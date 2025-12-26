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

const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

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
    console.log(`Maker authenticated: ${makerId}`);
    makers.set(makerId, ws);
    logEvent("maker_connected", { makerId, totalMakers: makers.size });

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
        if (rfq && !rfq.filled) {
            rfq.quotes.push({
                maker: makerId,
                premium: msg.premium,
                timestamp: Date.now(),
            });
            logEvent("quote_received", { rfqId: msg.rfqId, maker: makerId, premium: msg.premium / 1e6 });
        }
    }
}

function broadcastToMakers(message) {
    const data = JSON.stringify(message);
    for (const [makerId, ws] of makers) {
        try {
            ws.send(data);
        } catch (e) {
            console.error(`Failed to send to ${makerId}:`, e);
        }
    }
}

// REST API

app.post("/rfq", (req, res) => {
    const { underlying, optionType, strike, expiry, size, premiumFloor } = req.body;

    const rfqId = `rfq_${Date.now()}_${uuidv4().slice(0, 6)}`;
    const rfq = {
        rfqId,
        underlying,
        optionType,
        strike,
        expiry,
        size,
        premiumFloor: premiumFloor || 0,
        quotes: [],
        filled: null,
        createdAt: Date.now(),
    };

    rfqs.set(rfqId, rfq);
    logEvent("rfq_created", { rfqId, underlying, optionType, strike, size: size, makerCount: makers.size });

    // Broadcast to makers
    broadcastToMakers({
        type: "rfq",
        rfqId,
        underlying,
        optionType,
        strike,
        expiry,
        size,
    });

    res.json({ rfqId, status: "open" });
});

app.get("/rfq/:rfqId", (req, res) => {
    const rfq = rfqs.get(req.params.rfqId);
    if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
    }
    res.json(rfq);
});

app.post("/rfq/:rfqId/fill", (req, res) => {
    const rfq = rfqs.get(req.params.rfqId);
    if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
    }

    if (rfq.filled) {
        return res.json({ rfqId: rfq.rfqId, filled: rfq.filled });
    }

    if (rfq.quotes.length === 0) {
        return res.json({ rfqId: rfq.rfqId, filled: null, message: "No quotes received" });
    }

    // Find best quote (highest premium for selling options)
    const validQuotes = rfq.quotes.filter(q => q.premium >= rfq.premiumFloor);
    if (validQuotes.length === 0) {
        return res.json({ rfqId: rfq.rfqId, filled: null, message: "No quotes above floor" });
    }

    const bestQuote = validQuotes.reduce((best, q) =>
        q.premium > best.premium ? q : best
    );

    rfq.filled = {
        maker: bestQuote.maker,
        premium: bestQuote.premium,
        filledAt: Date.now(),
    };

    logEvent("rfq_filled", { rfqId: rfq.rfqId, maker: bestQuote.maker, premium: bestQuote.premium / 1e6 });

    // Notify winning maker
    const makerWs = makers.get(bestQuote.maker);
    if (makerWs) {
        makerWs.send(JSON.stringify({
            type: "fill",
            rfqId: rfq.rfqId,
            premium: bestQuote.premium,
        }));
    }

    res.json({ rfqId: rfq.rfqId, filled: rfq.filled });
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
