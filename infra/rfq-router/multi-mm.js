#!/usr/bin/env node
/**
 * Multi-Market Maker Launcher
 * 
 * Spawns multiple mock market makers with different pricing strategies
 * to demonstrate competitive quoting and best-price selection.
 * 
 * Usage: node multi-mm.js [count]
 * Example: node multi-mm.js 5
 * 
 * Market Makers:
 * - Citadelis (aggressive)
 * - Janus Street (balanced)
 * - Leap Markets (selective)
 * - Optimus (algorithmic)
 * - Spire Research (research-driven)
 */

const { spawn } = require("child_process");
const path = require("path");

// Market maker configurations with professional names and different pricing strategies
const MM_CONFIGS = [
    {
        id: "citadelis",
        displayName: "Citadelis",
        apiKey: "demo-mm-key-1",
        description: "Aggressive quoting, high win rate",
        premiumMultiplier: 1.12,  // 12% higher premiums
        responseDelay: 250,       // Fast responder
        quoteChance: 0.95,        // Almost always quotes
    },
    {
        id: "janus-street",
        displayName: "Janus Street",
        apiKey: "demo-mm-key-1",
        description: "Balanced approach, consistent pricing",
        premiumMultiplier: 1.0,   // Standard pricing
        responseDelay: 400,       // Medium response time
        quoteChance: 0.85,        // Usually quotes
    },
    {
        id: "leap-markets",
        displayName: "Leap Markets",
        apiKey: "demo-mm-key-1",
        description: "Selective quoting, competitive rates",
        premiumMultiplier: 1.05,  // Slightly above market
        responseDelay: 600,       // Takes time to analyze
        quoteChance: 0.70,        // More selective
    },
    {
        id: "optimus",
        displayName: "Optimus",
        apiKey: "demo-mm-key-2",
        description: "Algorithmic pricing, variable spreads",
        premiumMultiplier: 0.95 + Math.random() * 0.20,  // 0.95x - 1.15x
        responseDelay: 150,       // Very fast (algo)
        quoteChance: 0.80,        // Frequently quotes
    },
    {
        id: "spire-research",
        displayName: "Spire Research",
        apiKey: "demo-mm-key-2",
        description: "Research-driven, best prices for large orders",
        premiumMultiplier: 1.08,  // Competitive
        responseDelay: 700,       // Slower but thorough
        quoteChance: 0.65,        // Selective
    },
];

const count = parseInt(process.argv[2] || "5");
const selectedMMs = MM_CONFIGS.slice(0, Math.min(count, MM_CONFIGS.length));

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║         OptionsFi Multi-Market Maker Launcher              ║");
console.log("╚════════════════════════════════════════════════════════════╝");
console.log(`\nLaunching ${selectedMMs.length} market makers...\n`);

const children = [];

selectedMMs.forEach((config, index) => {
    console.log(`[${index + 1}] ${config.displayName}`);
    console.log(`    Strategy: ${config.description}`);
    console.log(`    Premium: ${config.premiumMultiplier.toFixed(2)}x | Response: ${config.responseDelay}ms | Quote Rate: ${(config.quoteChance * 100).toFixed(0)}%\n`);

    const env = {
        ...process.env,
        MAKER_ID: config.id,
        MAKER_DISPLAY_NAME: config.displayName,
        MM_API_KEY: config.apiKey,
        PREMIUM_MULTIPLIER: config.premiumMultiplier.toString(),
        RESPONSE_DELAY: config.responseDelay.toString(),
        QUOTE_CHANCE: config.quoteChance.toString(),
    };

    const child = spawn("node", [path.join(__dirname, "mock-mm.js")], {
        env,
        stdio: ["ignore", "pipe", "pipe"],
    });

    // Prefix output with MM display name
    child.stdout.on("data", (data) => {
        const lines = data.toString().split("\n").filter(l => l.trim());
        lines.forEach(line => {
            console.log(`[${config.displayName}] ${line}`);
        });
    });

    child.stderr.on("data", (data) => {
        console.error(`[${config.displayName}] ERROR: ${data.toString().trim()}`);
    });

    child.on("exit", (code) => {
        console.log(`[${config.displayName}] Exited with code ${code}`);
    });

    children.push(child);
});

console.log("────────────────────────────────────────────────────────────────");
console.log("All market makers launched. Press Ctrl+C to stop all.\n");
console.log("📊 RFQ Router will select the HIGHEST premium quote.\n");

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
