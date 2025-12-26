#!/usr/bin/env node
/**
 * Multi-Market Maker Launcher
 * 
 * Spawns multiple mock market makers with different pricing strategies
 * to demonstrate competitive quoting and best-price selection.
 * 
 * Usage: node multi-mm.js [count]
 * Example: node multi-mm.js 3
 */

const { spawn } = require("child_process");
const path = require("path");

// Market maker configurations with different pricing strategies
const MM_CONFIGS = [
    {
        id: "mm-aggressive",
        apiKey: "demo-mm-key-1",
        description: "Aggressive MM - highest premiums, wins often",
        premiumMultiplier: 1.15,  // 15% higher premiums
        responseDelay: 300,       // Fast responder
    },
    {
        id: "mm-conservative",
        apiKey: "demo-mm-key-1",
        description: "Conservative MM - lower premiums, more selective",
        premiumMultiplier: 0.85,  // 15% lower premiums
        responseDelay: 800,       // Slower responder
    },
    {
        id: "mm-balanced",
        apiKey: "demo-mm-key-1",
        description: "Balanced MM - market rate premiums",
        premiumMultiplier: 1.0,   // Standard pricing
        responseDelay: 500,       // Medium response time
    },
    {
        id: "mm-volatile",
        apiKey: "demo-mm-key-2",
        description: "Volatile MM - randomized premiums",
        premiumMultiplier: 0.8 + Math.random() * 0.5,  // 0.8x - 1.3x
        responseDelay: 200 + Math.random() * 1000,     // Variable
    },
    {
        id: "mm-institutional",
        apiKey: "demo-mm-key-2",
        description: "Institutional MM - best prices for large orders",
        premiumMultiplier: 1.08,  // Competitive but not aggressive
        responseDelay: 600,
    },
];

const count = parseInt(process.argv[2] || "3");
const selectedMMs = MM_CONFIGS.slice(0, Math.min(count, MM_CONFIGS.length));

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║         OptionsFi Multi-Market Maker Launcher              ║");
console.log("╚════════════════════════════════════════════════════════════╝");
console.log(`\nLaunching ${selectedMMs.length} market makers...\n`);

const children = [];

selectedMMs.forEach((config, index) => {
    console.log(`[${index + 1}] ${config.id}: ${config.description}`);
    console.log(`    Premium Multiplier: ${config.premiumMultiplier.toFixed(2)}x`);
    console.log(`    Response Delay: ${config.responseDelay}ms\n`);

    const env = {
        ...process.env,
        MAKER_ID: config.id,
        MM_API_KEY: config.apiKey,
        PREMIUM_MULTIPLIER: config.premiumMultiplier.toString(),
        RESPONSE_DELAY: config.responseDelay.toString(),
    };

    const child = spawn("node", [path.join(__dirname, "mock-mm.js")], {
        env,
        stdio: ["ignore", "pipe", "pipe"],
    });

    // Prefix output with MM ID
    child.stdout.on("data", (data) => {
        const lines = data.toString().split("\n").filter(l => l.trim());
        lines.forEach(line => {
            console.log(`[${config.id}] ${line}`);
        });
    });

    child.stderr.on("data", (data) => {
        console.error(`[${config.id}] ERROR: ${data.toString().trim()}`);
    });

    child.on("exit", (code) => {
        console.log(`[${config.id}] Exited with code ${code}`);
    });

    children.push(child);
});

console.log("────────────────────────────────────────────────────────────────");
console.log("All market makers launched. Press Ctrl+C to stop all.\n");

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\nShutting down all market makers...");
    children.forEach(child => child.kill());
    process.exit(0);
});

process.on("SIGTERM", () => {
    children.forEach(child => child.kill());
    process.exit(0);
});
