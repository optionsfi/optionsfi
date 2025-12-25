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

// CORS for frontend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
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

// WebSocket server attached to same HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
    const makerId = req.url?.split("makerId=")[1] || `maker-${Date.now()}`;
    console.log(`Maker connected: ${makerId}`);
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
    logEvent("rfq_created", { rfqId, underlying, optionType, strike, size: size / 1e6, makerCount: makers.size });

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
