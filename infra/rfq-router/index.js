/**
 * OptionsFi RFQ Router
 * 
 * Simple quote aggregation service that:
 * - Accepts RFQ requests from the keeper/frontend
 * - Broadcasts RFQs to connected market makers via WebSocket
 * - Collects quotes and returns best fill
 * 
 * Single port deployment: HTTP and WebSocket share the same port.
 */

const express = require("express");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const {
    rateLimitMiddleware,
    validateRFQ,
    getSecurityMetrics,
    logger,
    monitor
} = require("./security-middleware");

const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

// SECURITY: Apply rate limiting to all routes
app.use(rateLimitMiddleware);

// ============================================================================
// Environment Configuration
// ============================================================================

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ============================================================================
// SECURITY FIX L-2: CORS Configuration
// ============================================================================

// Allowed origins (configure via env in production)
const ALLOWED_ORIGINS_ENV = process.env.ALLOWED_ORIGINS;
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_ENV
    ? ALLOWED_ORIGINS_ENV.split(",").map(o => o.trim())
    : null; // null = allow all (dev mode only)

if (!ALLOWED_ORIGINS && IS_PRODUCTION) {
    console.warn("⚠️  WARNING: ALLOWED_ORIGINS not set in production - allowing all origins");
}

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // In production with whitelist, check against allowed origins
    if (ALLOWED_ORIGINS) {
        if (origin && ALLOWED_ORIGINS.includes(origin)) {
            res.header("Access-Control-Allow-Origin", origin);
        } else if (origin) {
            console.warn(`CORS blocked origin: ${origin}`);
            // Don't set header - browser will block
        }
    } else {
        // Development mode - allow all
        res.header("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// State
const rfqs = new Map();
const makers = new Map();

// Event log buffer (circular, max 100 events)
const eventLog = [];
const MAX_EVENTS = 100;

function logEvent(type, data) {
    const event = {
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        source: "rfq-router",
        timestamp: new Date().toISOString(),
        data,
    };
    eventLog.push(event);
    if (eventLog.length > MAX_EVENTS) {
        eventLog.shift();
    }
    console.log(`[${event.type}]`, JSON.stringify(data));
    return event;
}

// Create HTTP server
const server = http.createServer(app);

// ============================================================================
// SECURITY FIX H-2: Market Maker Authentication
// ============================================================================

// SECURITY: No default API keys in production
const MM_API_KEYS_ENV = process.env.MM_API_KEYS;

if (IS_PRODUCTION && !MM_API_KEYS_ENV) {
    console.error("FATAL: MM_API_KEYS must be set in production mode");
    console.error("Set NODE_ENV=development for demo mode with default keys");
    process.exit(1);
}

const MM_API_KEYS = new Set(
    (MM_API_KEYS_ENV || "demo-mm-key-1,demo-mm-key-2").split(",").map(k => k.trim())
);

if (!IS_PRODUCTION) {
    console.log("⚠️  WARNING: Running with demo API keys. Set NODE_ENV=production for production.");
}

// Rate limiting per maker (max 100 quotes per minute)
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 100;
const rateLimitMap = new Map(); // makerId -> { count, windowStart }

function checkRateLimit(makerId) {
    const now = Date.now();
    const record = rateLimitMap.get(makerId) || { count: 0, windowStart: now };

    // Reset window if expired
    if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
        record.count = 0;
        record.windowStart = now;
    }

    record.count++;
    rateLimitMap.set(makerId, record);

    return record.count <= RATE_LIMIT_MAX;
}

function validateMakerAuth(req) {
    // SECURITY FIX: Use Authorization header instead of URL query params
    // Format: Authorization: Bearer <apiKey>
    const authHeader = req.headers.authorization;

    // Also support query params for backwards compatibility (deprecation warning)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const queryApiKey = url.searchParams.get("apiKey");
    const makerId = url.searchParams.get("makerId") || `maker-${Date.now()}`;

    let apiKey = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        apiKey = authHeader.slice(7); // Remove "Bearer " prefix
    } else if (queryApiKey) {
        console.warn(`⚠️  Deprecation warning: API key in URL params (maker: ${makerId}). Use Authorization header.`);
        apiKey = queryApiKey;
    }

    if (!apiKey) {
        return { valid: false, error: "Missing API key. Use Authorization: Bearer <key> header" };
    }
    if (!MM_API_KEYS.has(apiKey)) {
        return { valid: false, error: "Invalid API key" };
    }

    // Rate limiting
    if (!checkRateLimit(makerId)) {
        return { valid: false, error: "Rate limit exceeded (100 quotes/minute)" };
    }

    return { valid: true, makerId };
}

// WebSocket server attached to same HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
    // Debug: Log raw request info
    console.log(`WS Connection - URL: ${req.url}, Host: ${req.headers.host}`);

    // Authenticate market maker
    const auth = validateMakerAuth(req);
    if (!auth.valid) {
        console.log(`Maker connection rejected: ${auth.error}`);
        logEvent("maker_rejected", { reason: auth.error, ip: req.socket.remoteAddress, url: req.url });
        ws.close(4001, auth.error);
        return;
    }

    const makerId = auth.makerId;

    // Extract wallet and USDC account from URL params
    const url = new URL(req.url, `http://${req.headers.host}`);
    const wallet = url.searchParams.get("wallet");
    const usdcAccount = url.searchParams.get("usdcAccount");

    // Validate wallet and USDC account are provided
    if (!wallet || !usdcAccount) {
        console.log(`Maker ${makerId} connection rejected: missing wallet or USDC account`);
        logEvent("maker_rejected", {
            reason: "missing_wallet_info",
            makerId,
            hasWallet: !!wallet,
            hasUsdcAccount: !!usdcAccount
        });
        ws.close(4001, "Missing wallet or usdcAccount query parameters");
        return;
    }

    console.log(`Maker authenticated: ${makerId} (wallet: ${wallet})`);

    // Store maker with wallet information
    makers.set(makerId, {
        ws,
        wallet,
        usdcAccount,
        connectedAt: Date.now()
    });

    logEvent("maker_connected", {
        makerId,
        wallet,
        totalMakers: makers.size
    });

    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data.toString());
            handleMakerMessage(makerId, msg);
        } catch (e) {
            console.error("Failed to parse maker message:", e);
        }
    });

    ws.on("close", () => {
        console.log(`Maker disconnected: ${makerId}`);
        makers.delete(makerId);
        logEvent("maker_disconnected", { makerId, totalMakers: makers.size });
    });

    ws.on("error", (error) => {
        console.error(`Maker error (${makerId}):`, error);
    });
});

function handleMakerMessage(makerId, msg) {
    if (msg.type === "quote" && msg.rfqId && msg.premium) {
        const rfq = rfqs.get(msg.rfqId);
        if (!rfq) {
            console.warn(`Quote received for unknown RFQ: ${msg.rfqId}`);
            return;
        }

        // Check if RFQ is still open
        if (rfq.status !== 'open') {
            console.warn(`Quote received for closed RFQ: ${msg.rfqId} (status: ${rfq.status})`);
            return;
        }

        // Check if quote is within deadline
        if (Date.now() > rfq.expiresAt) {
            console.warn(`Quote received after deadline for RFQ: ${msg.rfqId}`);
            rfq.status = 'expired';
            return;
        }

        // Validate quote has required fields
        if (!msg.premium || typeof msg.premium !== 'number') {
            console.warn(`Invalid quote format from ${makerId} for RFQ: ${msg.rfqId}`);
            return;
        }

        // Get maker info (wallet and USDC account)
        const makerInfo = makers.get(makerId);
        const makerWallet = makerInfo?.wallet || null;
        const usdcAccount = makerInfo?.usdcAccount || null;

        // Check for duplicate quotes from same maker
        const existingQuote = rfq.quotes.find(q => q.maker === makerId);
        if (existingQuote) {
            console.warn(`Duplicate quote from ${makerId} for RFQ: ${msg.rfqId}, updating...`);
            existingQuote.premium = msg.premium;
            existingQuote.timestamp = Date.now();
            existingQuote.validUntil = msg.validUntil || (Date.now() + 60000); // 60s default
            existingQuote.makerWallet = makerWallet;
            existingQuote.usdcAccount = usdcAccount;
        } else {
            rfq.quotes.push({
                id: `quote_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                maker: makerId,
                makerWallet: makerWallet,
                usdcAccount: usdcAccount,
                premium: msg.premium,
                timestamp: Date.now(),
                validUntil: msg.validUntil || (Date.now() + 60000), // 60s default
            });
        }

        logEvent("quote_received", {
            rfqId: msg.rfqId,
            maker: makerId,
            premium: msg.premium / 1e6,
            quoteCount: rfq.quotes.length,
            minQuotes: rfq.minQuotes
        });

        // Auto-close if we have enough quotes
        if (rfq.quotes.length >= rfq.minQuotes && rfq.minQuotes > 1) {
            logEvent("rfq_quote_threshold_met", {
                rfqId: msg.rfqId,
                quoteCount: rfq.quotes.length,
                minQuotes: rfq.minQuotes
            });
        }
    }
}

function broadcastToMakers(message) {
    const data = JSON.stringify(message);
    for (const [makerId, makerInfo] of makers) {
        try {
            makerInfo.ws.send(data);
        } catch (e) {
            console.error(`Failed to send to ${makerId}:`, e);
        }
    }
}

// REST API

// SECURITY: Security metrics endpoint
app.get("/security/metrics", getSecurityMetrics);

// Create RFQ (with input validation)
app.post("/rfq", validateRFQ, (req, res) => {
    const {
        underlying,
        optionType,
        strike,
        expiry,
        size,
        premiumFloor,
        vaultAddress,
        anonymous = false,
        minQuotes = 1,
        quoteTimeout = 30000
    } = req.body;

    const rfqId = `rfq_${Date.now()}_${uuidv4().slice(0, 6)}`;
    const rfq = {
        rfqId,
        underlying,
        optionType,
        strike,
        expiry,
        size,
        premiumFloor: premiumFloor || 0,
        vaultAddress: anonymous ? null : vaultAddress, // Anonymize if requested
        anonymous,
        minQuotes,
        quoteTimeout,
        quotes: [],
        filled: null,
        status: 'open',
        createdAt: Date.now(),
        expiresAt: Date.now() + quoteTimeout,
    };

    rfqs.set(rfqId, rfq);
    logEvent("rfq_created", {
        rfqId,
        underlying,
        optionType,
        strike,
        size,
        anonymous,
        minQuotes,
        makerCount: makers.size
    });

    // Broadcast to all connected makers
    const broadcastData = {
        type: "rfq",
        rfqId,
        underlying,
        optionType,
        strike,
        expiry,
        size,
        vaultAddress: rfq.vaultAddress, // null if anonymous
        quoteDeadline: rfq.expiresAt,
    };

    broadcastToMakers(broadcastData);

    res.json({
        rfqId,
        status: "open",
        broadcastedTo: makers.size,
        minQuotes,
        expiresAt: rfq.expiresAt
    });
});

app.get("/rfq/:rfqId", (req, res) => {
    const rfq = rfqs.get(req.params.rfqId);
    if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
    }

    // Calculate time remaining
    const timeRemaining = Math.max(0, rfq.expiresAt - Date.now());

    res.json({
        ...rfq,
        timeRemaining,
        isExpired: Date.now() > rfq.expiresAt
    });
});

// New endpoint: Wait for quotes with polling
app.post("/rfq/:rfqId/wait", async (req, res) => {
    const rfq = rfqs.get(req.params.rfqId);
    if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
    }

    const { minQuotes, timeout } = req.body;
    const targetQuotes = minQuotes || rfq.minQuotes || 1;
    const maxWait = Math.min(timeout || 30000, rfq.expiresAt - Date.now());
    const startTime = Date.now();
    const pollInterval = 500; // Check every 500ms

    // Poll for quotes
    const checkQuotes = () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;

                // Check if we have enough quotes
                if (rfq.quotes.length >= targetQuotes) {
                    clearInterval(interval);
                    resolve({ success: true, reason: 'target_met' });
                    return;
                }

                // Check if RFQ expired
                if (Date.now() > rfq.expiresAt) {
                    clearInterval(interval);
                    resolve({ success: false, reason: 'rfq_expired' });
                    return;
                }

                // Check if timeout reached
                if (elapsed >= maxWait) {
                    clearInterval(interval);
                    resolve({ success: false, reason: 'timeout' });
                    return;
                }
            }, pollInterval);
        });
    };

    const result = await checkQuotes();

    res.json({
        rfqId: rfq.rfqId,
        success: result.success,
        reason: result.reason,
        quotesReceived: rfq.quotes.length,
        targetQuotes,
        quotes: rfq.quotes.map(q => ({
            maker: q.maker,
            premium: q.premium,
            timestamp: q.timestamp
        }))
    });
});

app.post("/rfq/:rfqId/fill", (req, res) => {
    const rfq = rfqs.get(req.params.rfqId);
    if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
    }

    if (rfq.filled) {
        return res.json({
            rfqId: rfq.rfqId,
            status: 'filled',
            filled: rfq.filled,
            totalQuotes: rfq.quotes.length
        });
    }

    // Check if RFQ has expired
    if (Date.now() > rfq.expiresAt) {
        rfq.status = 'expired';
        logEvent("rfq_expired", { rfqId: rfq.rfqId, quoteCount: rfq.quotes.length });
        return res.json({
            rfqId: rfq.rfqId,
            status: 'expired',
            filled: null,
            message: "RFQ expired",
            totalQuotes: rfq.quotes.length
        });
    }

    if (rfq.quotes.length === 0) {
        return res.json({
            rfqId: rfq.rfqId,
            status: 'open',
            filled: null,
            message: "No quotes received",
            connectedMakers: makers.size
        });
    }

    // Check minimum quotes requirement
    if (rfq.quotes.length < rfq.minQuotes) {
        return res.json({
            rfqId: rfq.rfqId,
            status: 'open',
            filled: null,
            message: `Waiting for more quotes (${rfq.quotes.length}/${rfq.minQuotes})`,
            quotes: rfq.quotes.length
        });
    }

    // Filter valid quotes (above floor and not expired)
    const now = Date.now();
    const validQuotes = rfq.quotes.filter(q =>
        q.premium >= rfq.premiumFloor &&
        (!q.validUntil || q.validUntil > now)
    );

    if (validQuotes.length === 0) {
        rfq.status = 'no_valid_quotes';
        return res.json({
            rfqId: rfq.rfqId,
            status: 'no_valid_quotes',
            filled: null,
            message: "No quotes above floor or all quotes expired",
            totalQuotes: rfq.quotes.length,
            validQuotes: 0
        });
    }

    // Find best quote (highest premium for selling options)
    const rankedQuotes = validQuotes
        .sort((a, b) => b.premium - a.premium)
        .map((q, index) => ({ ...q, rank: index + 1 }));

    const bestQuote = rankedQuotes[0];

    rfq.filled = {
        quoteId: bestQuote.id,
        maker: bestQuote.maker,
        premium: bestQuote.premium,
        filledAt: Date.now(),
    };
    rfq.status = 'filled';

    logEvent("rfq_filled", {
        rfqId: rfq.rfqId,
        maker: bestQuote.maker,
        premium: bestQuote.premium / 1e6,
        totalQuotes: rfq.quotes.length,
        validQuotes: validQuotes.length
    });

    // Notify winning maker
    const makerInfo = makers.get(bestQuote.maker);
    if (makerInfo && makerInfo.ws) {
        makerInfo.ws.send(JSON.stringify({
            type: "fill",
            rfqId: rfq.rfqId,
            premium: bestQuote.premium,
            maker: bestQuote.maker,
        }));
    }

    // Notify losing makers
    for (const quote of rankedQuotes.slice(1)) {
        const loserInfo = makers.get(quote.maker);
        if (loserInfo && loserInfo.ws) {
            loserInfo.ws.send(JSON.stringify({
                type: "rfq_lost",
                rfqId: rfq.rfqId,
                yourQuote: quote.premium,
                winningQuote: bestQuote.premium,
            }));
        }
    }

    res.json({
        rfqId: rfq.rfqId,
        status: 'filled',
        filled: rfq.filled,
        totalQuotes: rfq.quotes.length,
        validQuotes: validQuotes.length,
        rankedQuotes: rankedQuotes.map(q => ({
            maker: q.maker,
            premium: q.premium,
            rank: q.rank
        }))
    });
});

// Health endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        connectedMakers: makers.size,
        activeRfqs: rfqs.size,
        uptime: process.uptime(),
    });
});

// Events endpoint for real-time logs
app.get("/events", (req, res) => {
    const since = req.query.since ? parseInt(req.query.since) : 0;
    const filtered = since > 0
        ? eventLog.filter(e => new Date(e.timestamp).getTime() > since)
        : eventLog.slice(-50); // Last 50 events
    res.json({ events: filtered, serverTime: Date.now() });
});

// Root endpoint for quick status
app.get("/", (req, res) => {
    res.json({
        service: "OptionsFi RFQ Router",
        version: "1.0.0",
        status: "online",
        makers: makers.size,
    });
});

// Start server
server.listen(PORT, () => {
    console.log("========================================");
    console.log("OptionsFi RFQ Router Starting");
    console.log("========================================");
    console.log(`HTTP + WebSocket server listening on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`WS: ws://localhost:${PORT}?makerId=your-id`);
    console.log("----------------------------------------");
});

// Cleanup old RFQs every 5 minutes
setInterval(() => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    let cleaned = 0;
    for (const [rfqId, rfq] of rfqs) {
        if (rfq.createdAt < fiveMinutesAgo) {
            rfqs.delete(rfqId);
            cleaned++;
        }
    }
    if (cleaned > 0) {
        console.log(`Cleaned ${cleaned} expired RFQs`);
    }
}, 5 * 60 * 1000);
