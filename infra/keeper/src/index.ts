/**
 * OptionsFi V2 Keeper Service
 * 
 * Manages vault epoch lifecycle with:
 * - Real vault TVL fetching
 * - Black-Scholes premium pricing
 * - Historical volatility from Yahoo Finance
 * - On-chain premium collection and settlement
 */

import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { CronJob } from "cron";
import axios from "axios";
import express, { Request, Response } from "express";
import winston from "winston";

import { OnChainClient, createWallet, deriveVaultPda, VaultData } from "./onchain";
import {
    getVolatility,
    calculateCoveredCallPremium,
    premiumToBps,
    blackScholes
} from "./pricing";

// ============================================================================
// Configuration
// ============================================================================

const config = {
    rpcUrl: process.env.RPC_URL || "https://api.devnet.solana.com",
    walletPath: process.env.WALLET_PATH || process.env.ANCHOR_WALLET || "~/.config/solana/id.json",
    // Support multiple vaults via comma-separated ASSET_IDS
    assetIds: (process.env.ASSET_IDS || process.env.ASSET_ID || "DemoNVDAx4").split(",").map(s => s.trim()),
    ticker: process.env.TICKER || "NVDA", // Yahoo Finance ticker for volatility
    cronSchedule: process.env.CRON_SCHEDULE || "0 */6 * * *", // Every 6 hours
    epochDurationDays: parseInt(process.env.EPOCH_DURATION_DAYS || "7"),
    strikeDeltaBps: parseInt(process.env.STRIKE_DELTA_BPS || "1000"), // 10% OTM
    riskFreeRate: parseFloat(process.env.RISK_FREE_RATE || "0.05"), // 5%
    volatilityLookbackDays: parseInt(process.env.VOL_LOOKBACK_DAYS || "30"),
    healthPort: parseInt(process.env.HEALTH_PORT || "3010"),
    rfqRouterUrl: process.env.RFQ_ROUTER_URL || "http://localhost:3005",
    quoteWaitMs: parseInt(process.env.QUOTE_WAIT_MS || "10000"),
};

// Pyth Hermes API for real-time prices
const HERMES_URL = "https://hermes.pyth.network";
const NVDA_PRICE_FEED_ID = "0x4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f"; // NVDA/USD

function getFeedIdForAsset(assetId: string): string {
    // For now, all vaults use NVDA as underlying
    return NVDA_PRICE_FEED_ID;
}

// ============================================================================
// Logger
// ============================================================================

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

// ============================================================================
// State
// ============================================================================

interface KeeperState {
    connection: Connection;
    wallet: anchor.Wallet;
    onchainClient: OnChainClient | null;
    lastRunTime: number | null;
    lastRunSuccess: boolean | null;
    runCount: number;
    errorCount: number;
    isRunning: boolean;
    // Epoch tracking
    epochStrikePrice: number;
    epochNotional: bigint;
    epochPremiumEarned: bigint;
}

const state: KeeperState = {
    connection: null!,
    wallet: null!,
    onchainClient: null,
    lastRunTime: null,
    lastRunSuccess: null,
    runCount: 0,
    errorCount: 0,
    isRunning: false,
    epochStrikePrice: 0,
    epochNotional: BigInt(0),
    epochPremiumEarned: BigInt(0),
};

// Event log buffer for real-time monitoring
interface KeeperEvent {
    id: string;
    type: string;
    source: string;
    timestamp: string;
    data: Record<string, unknown>;
}

const eventLog: KeeperEvent[] = [];
const MAX_EVENTS = 100;

function logEvent(type: string, data: Record<string, unknown>): void {
    const event: KeeperEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        source: "keeper",
        timestamp: new Date().toISOString(),
        data,
    };
    eventLog.push(event);
    if (eventLog.length > MAX_EVENTS) {
        eventLog.shift();
    }
    logger.info(`[${type}]`, data);
}

// ============================================================================
// Price Oracle
// ============================================================================

interface OraclePrice {
    price: number;     // Price in dollars
    confidence: number; // Confidence interval
    timestamp: Date;
}

async function fetchOraclePrice(assetId: string, retries = 3): Promise<OraclePrice | null> {
    const feedId = getFeedIdForAsset(assetId);

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // Use standard URL format that works in terminal/curl
            const response = await axios.get(
                `${HERMES_URL}/v2/updates/price/latest?ids[]=${feedId}&parsed=true`,
                { timeout: 30000 }
            );

            const priceData = response.data?.parsed?.[0]?.price;
            if (!priceData) {
                throw new Error(`Invalid price response for ${feedId}`);
            }

            const price = parseFloat(priceData.price) * Math.pow(10, priceData.expo);
            const conf = parseFloat(priceData.conf) * Math.pow(10, priceData.expo);

            logger.info("Fetched price from Pyth", {
                assetId,
                feedId: feedId.slice(0, 10) + "...",
                price: price.toFixed(2),
                confidence: conf.toFixed(4),
                attempt: attempt + 1
            });

            return {
                price,
                confidence: conf,
                timestamp: new Date(),
            };
        } catch (error: any) {
            logger.warn(`Oracle fetch attempt ${attempt + 1}/${retries} failed`, {
                assetId,
                error: error.message
            });
            if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
            }
        }
    }

    logger.error("Failed to fetch oracle price after all retries", { assetId });
    return null;
}

// Batch fetch helper to avoid serial requests to Hermes
async function fetchPricesInBatch(assetIds: string[]): Promise<Map<string, OraclePrice>> {
    const priceMap = new Map<string, OraclePrice>();
    const uniqueFeedIds = new Set<string>();
    const feedToAsset = new Map<string, string[]>();

    for (const assetId of assetIds) {
        const feedId = getFeedIdForAsset(assetId);
        if (feedId) {
            uniqueFeedIds.add(feedId);
            if (!feedToAsset.has(feedId)) feedToAsset.set(feedId, []);
            feedToAsset.get(feedId)!.push(assetId);
        }
    }

    if (uniqueFeedIds.size === 0) return priceMap;

    try {
        const idsParam = Array.from(uniqueFeedIds).map(id => `ids[]=${id}`).join("&");
        const url = `${HERMES_URL}/v2/updates/price/latest?${idsParam}&parsed=true`;

        const response = await axios.get(url, { timeout: 30000 });
        const parsedData = response.data?.parsed || [];

        for (const item of parsedData) {
            const feedIdLong = item.id.startsWith("0x") ? item.id : `0x${item.id}`;
            const matchedAssets = feedToAsset.get(feedIdLong) || [];

            const price = parseFloat(item.price.price) * Math.pow(10, item.price.expo);
            const conf = parseFloat(item.price.conf) * Math.pow(10, item.price.expo);
            const oraclePrice = { price, confidence: conf, timestamp: new Date() };

            for (const assetId of matchedAssets) {
                priceMap.set(assetId, oraclePrice);
            }
        }
    } catch (e: any) {
        logger.error("Batch price fetch failed", { error: e.message });
        // Fallback to individual fetches if batch fails
        for (const assetId of assetIds) {
            const p = await fetchOraclePrice(assetId);
            if (p) priceMap.set(assetId, p);
        }
    }

    return priceMap;
}

// ============================================================================
// Epoch Roll Logic
// ============================================================================

async function runEpochRollForVault(assetId: string, preFetchedPrice?: OraclePrice): Promise<boolean> {
    logger.info("Processing vault", { assetId });

    try {
        // Step 1: Fetch real vault data
        logger.info("Step 1: Fetching vault data...", { assetId });
        const vaultData = state.onchainClient
            ? await state.onchainClient.fetchVault(assetId)
            : null;

        if (!vaultData) {
            throw new Error("Failed to fetch vault data");
        }

        const totalAssets = Number(vaultData.totalAssets) / 1e6; // Assuming 6 decimals
        const currentExposure = Number(vaultData.epochNotionalExposed) / 1e6;
        const utilizationCap = vaultData.utilizationCapBps / 10000;
        const maxExposure = totalAssets * utilizationCap;
        const availableExposure = maxExposure - currentExposure;

        logger.info("Vault state", {
            totalAssets,
            currentExposure,
            maxExposure,
            availableExposure,
            epoch: vaultData.epoch.toString(),
        });

        if (availableExposure < 0.01) {
            logger.warn("Available exposure capacity too small to roll (< 0.01 tokens)", {
                availableExposure: availableExposure.toFixed(6)
            });
            state.isRunning = false;
            return false;
        }

        // Step 2: Fetch oracle price
        logger.info("Step 2: Fetching oracle price...");
        const oraclePrice = preFetchedPrice || await fetchOraclePrice(assetId);
        if (!oraclePrice) {
            throw new Error("Failed to fetch oracle price");
        }

        // Step 3: Calculate strike price (OTM by strike delta)
        logger.info("Step 3: Calculating strike price...");
        const spotPrice = oraclePrice.price;
        const strikeDelta = config.strikeDeltaBps / 10000;
        const strikePrice = spotPrice * (1 + strikeDelta);

        logger.info("Strike calculated", {
            spot: spotPrice.toFixed(2),
            strikeDelta: `${strikeDelta * 100}%`,
            strike: strikePrice.toFixed(2),
        });

        // Step 4: Fetch historical volatility from Yahoo Finance
        logger.info("Step 4: Fetching historical volatility...");
        let volatility: number;
        try {
            volatility = await getVolatility(config.ticker, config.volatilityLookbackDays);
            logger.info("Historical volatility fetched", {
                ticker: config.ticker,
                volatility: `${(volatility * 100).toFixed(1)}%`,
                lookbackDays: config.volatilityLookbackDays,
            });
        } catch (volError: any) {
            logger.error("Failed to fetch volatility, using fallback", { error: volError.message });
            volatility = 0.4; // 40% fallback
        }

        // Step 5: Calculate Black-Scholes premium
        logger.info("Step 5: Calculating Black-Scholes premium...");
        const premiumPerToken = calculateCoveredCallPremium({
            spot: spotPrice,
            strikePercent: strikePrice / spotPrice,
            daysToExpiry: config.epochDurationDays,
            volatility: volatility,
            riskFreeRate: config.riskFreeRate,
        });

        const premiumBps = premiumToBps(premiumPerToken, spotPrice);

        logger.info("Black-Scholes premium calculated", {
            premiumPerToken: premiumPerToken.toFixed(4),
            premiumBps,
            volatility: `${(volatility * 100).toFixed(1)}%`,
            daysToExpiry: config.epochDurationDays,
        });

        // Step 6: Calculate notional to expose (use available capacity)
        const notionalTokens = Math.min(availableExposure, totalAssets * 0.5); // Max 50% per roll
        const totalPremium = notionalTokens * premiumPerToken;

        logger.info("Notional calculated", {
            notionalTokens: notionalTokens.toFixed(2),
            totalPremium: totalPremium.toFixed(2),
        });

        // Step 7: Create RFQ (if RFQ router is available)
        logger.info("Step 6: Creating RFQ...");
        let rfqFilled = false;
        let actualPremium = totalPremium;

        try {
            const rfqResponse = await axios.post(`${config.rfqRouterUrl}/rfq`, {
                underlying: assetId,
                optionType: "CALL",
                strike: strikePrice,
                expiry: Date.now() + config.epochDurationDays * 24 * 60 * 60 * 1000,
                size: notionalTokens,
                premiumFloor: Math.max(1, Math.floor(totalPremium * 0.8 * 1e6)), // 80% of BS price minimum in USDC base units
            }, { timeout: 15000 });

            const rfqId = rfqResponse.data.rfqId;
            logger.info("RFQ created", { rfqId });

            // Wait for quotes
            await new Promise(resolve => setTimeout(resolve, config.quoteWaitMs));

            // Fill RFQ
            const fillResponse = await axios.post(
                `${config.rfqRouterUrl}/rfq/${rfqId}/fill`,
                {},
                { timeout: 15000 }
            );

            if (fillResponse.data.filled) {
                actualPremium = fillResponse.data.filled.premium / 1e6; // Convert from base units
                rfqFilled = true;
                logger.info("RFQ filled", {
                    maker: fillResponse.data.filled.maker,
                    premium: actualPremium.toFixed(2),
                });
            }
        } catch (rfqError: any) {
            logger.warn("RFQ failed, using BS premium", { error: rfqError.message });
        }

        // Step 7: Record exposure on-chain
        logger.info("Step 7: Recording exposure on-chain...");
        if (state.onchainClient) {
            const notionalBaseUnits = BigInt(Math.floor(notionalTokens * 1e6));
            const premiumBaseUnits = BigInt(Math.floor(actualPremium * 1e6));

            const recordTx = await state.onchainClient.recordNotionalExposure(
                assetId,
                notionalBaseUnits,
                premiumBaseUnits
            );
            logger.info("Exposure recorded", { tx: recordTx });

            // Track for settlement
            state.epochStrikePrice = strikePrice;
            state.epochNotional = state.epochNotional + notionalBaseUnits;
            state.epochPremiumEarned = state.epochPremiumEarned + premiumBaseUnits;
        }

        logger.info("========================================");
        logger.info("Epoch roll completed successfully", {
            notional: notionalTokens.toFixed(2),
            premium: actualPremium.toFixed(2),
            premiumBps,
            strike: strikePrice.toFixed(2),
            rfqFilled,
        });
        logger.info("========================================");

        state.lastRunTime = Date.now();
        state.lastRunSuccess = true;
        state.isRunning = false;
        return true;

    } catch (error: any) {
        logger.error("Epoch roll failed", { error: error.message, stack: error.stack });
        state.lastRunTime = Date.now();
        state.lastRunSuccess = false;
        state.errorCount++;
        state.isRunning = false;
        return false;
    }
}

// Wrapper function to run epoch roll for all configured vaults
async function runEpochRoll(): Promise<boolean> {
    if (state.isRunning) {
        logger.warn("Epoch roll already in progress");
        return false;
    }

    state.isRunning = true;
    state.runCount++;

    logger.info("========================================");
    logger.info("Starting epoch roll for all vaults", {
        vaults: config.assetIds,
        runNumber: state.runCount
    });
    logger.info("========================================");

    // Initial batch fetch of prices
    const priceMap = await fetchPricesInBatch(config.assetIds);

    let allSuccess = true;
    for (const assetId of config.assetIds) {
        const success = await runEpochRollForVault(assetId, priceMap.get(assetId));
        if (!success) allSuccess = false;
    }

    state.isRunning = false;
    state.lastRunTime = Date.now();
    state.lastRunSuccess = allSuccess;

    return allSuccess;
}

// ============================================================================
// Settlement Logic
// ============================================================================

async function runSettlement(): Promise<{ success: boolean; message: string }> {
    logger.info("Running settlement...");

    try {
        // Fetch current oracle price (using primary vault)
        const primaryAsset = config.assetIds[0];
        const oraclePrice = await fetchOraclePrice(primaryAsset);
        if (!oraclePrice) {
            throw new Error("Failed to fetch oracle price for settlement");
        }

        const currentPrice = oraclePrice.price;
        const strikePrice = state.epochStrikePrice;

        logger.info("Settlement price check", {
            currentPrice: currentPrice.toFixed(2),
            strikePrice: strikePrice.toFixed(2),
        });

        // Determine ITM/OTM (for CALL: ITM if spot > strike)
        const isITM = currentPrice > strikePrice && strikePrice > 0;
        let payoffAmount = BigInt(0);
        let settlementType = "OTM";

        if (isITM && state.epochNotional > 0) {
            // Calculate payoff: (spot - strike) / spot * notional (simplified)
            const intrinsicValue = currentPrice - strikePrice;
            const payoffRatio = intrinsicValue / currentPrice;
            payoffAmount = BigInt(Math.floor(Number(state.epochNotional) * payoffRatio));
            settlementType = "ITM";

            logger.info("ITM settlement", {
                intrinsicValue: intrinsicValue.toFixed(2),
                payoffRatio: (payoffRatio * 100).toFixed(2) + "%",
                payoffAmount: (Number(payoffAmount) / 1e6).toFixed(2),
            });

            // TODO: Pay settlement to MM using paySettlement()
        } else {
            logger.info("OTM settlement - vault keeps premium");
        }

        // Advance epoch on-chain
        // Convert USDC premium to equivalent underlying tokens
        // Premium is in USDC base units (6 decimals), need to convert to underlying tokens
        if (state.onchainClient) {
            const netPremiumUsdc = state.epochPremiumEarned > payoffAmount
                ? state.epochPremiumEarned - payoffAmount
                : BigInt(0);

            // Convert USDC premium to equivalent underlying tokens
            // netPremiumUsdc is in USDC (6 decimals), currentPrice is in USD per token
            // tokens = usdc_value / price
            // Result in 6 decimal token units
            const premiumInTokens = BigInt(Math.floor(
                (Number(netPremiumUsdc) / currentPrice)
            ));

            logger.info("Converting premium to tokens", {
                netPremiumUsdc: (Number(netPremiumUsdc) / 1e6).toFixed(4),
                spotPrice: currentPrice.toFixed(2),
                premiumInTokens: (Number(premiumInTokens) / 1e6).toFixed(6),
            });

            const tx = await state.onchainClient.advanceEpoch(primaryAsset, premiumInTokens);
            logger.info("Epoch advanced", { tx, assetId: primaryAsset });
        }

        // Record settlement values for response
        const savedStrike = state.epochStrikePrice;
        const savedPremium = state.epochPremiumEarned;

        // Reset epoch tracking
        state.epochStrikePrice = 0;
        state.epochNotional = BigInt(0);
        state.epochPremiumEarned = BigInt(0);

        const netGain = Number(savedPremium - payoffAmount) / 1e6;

        return {
            success: true,
            message: `${settlementType} Settlement - Net: ${netGain.toFixed(2)} tokens`,
        };

    } catch (error: any) {
        logger.error("Settlement failed", { error: error.message });
        return {
            success: false,
            message: error.message,
        };
    }
}

// ============================================================================
// Initialization
// ============================================================================

async function initialize(): Promise<void> {
    logger.info("========================================");
    logger.info("OptionsFi Keeper Service Starting");
    logger.info("========================================");
    logger.info("Configuration", {
        assetIds: config.assetIds,
        ticker: config.ticker,
        cronSchedule: config.cronSchedule,
        epochDuration: `${config.epochDurationDays}d`,
        strikeDelta: `${config.strikeDeltaBps}bps`,
        volatilityLookback: `${config.volatilityLookbackDays}d`,
    });

    // Initialize connection
    state.connection = new Connection(config.rpcUrl, "confirmed");

    // Load wallet
    const walletPath = config.walletPath.replace("~", process.env.HOME || "");
    state.wallet = createWallet(walletPath);
    logger.info("Wallet loaded", { pubkey: state.wallet.publicKey.toBase58() });

    // Initialize on-chain client
    state.onchainClient = new OnChainClient(state.connection, state.wallet);
    await state.onchainClient.initialize();
    logger.info("On-chain client initialized");
}

// ============================================================================
// HTTP Server
// ============================================================================

function startHealthServer(): void {
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

    app.get("/health", (req: Request, res: Response) => {
        res.json({
            status: "healthy",
            lastRunTime: state.lastRunTime,
            lastRunSuccess: state.lastRunSuccess,
            runCount: state.runCount,
            errorCount: state.errorCount,
            isRunning: state.isRunning,
            config: {
                assetIds: config.assetIds,
                ticker: config.ticker,
                epochDuration: config.epochDurationDays,
            },
        });
    });

    // Events endpoint for real-time logs
    app.get("/events", (req: Request, res: Response) => {
        const since = req.query.since ? parseInt(req.query.since as string) : 0;
        const filtered = since > 0
            ? eventLog.filter(e => new Date(e.timestamp).getTime() > since)
            : eventLog.slice(-50);
        res.json({ events: filtered, serverTime: Date.now() });
    });

    app.post("/trigger", async (req: Request, res: Response) => {
        logEvent("epoch_roll_triggered", { vaults: config.assetIds, manual: true });
        const success = await runEpochRoll();
        logEvent("epoch_roll_completed", { vaults: config.assetIds, success });
        res.json({ success, message: success ? "Epoch roll completed" : "Epoch roll failed" });
    });

    app.post("/settle", async (req: Request, res: Response) => {
        logEvent("settlement_triggered", { vault: config.assetIds[0], manual: true });
        const result = await runSettlement();
        logEvent("settlement_completed", { vault: config.assetIds[0], success: result.success });
        res.json(result);
    });

    app.listen(config.healthPort, () => {
        logger.info(`Health server listening on port ${config.healthPort}`);
    });
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
    await initialize();

    // Schedule epoch rolls
    const cronJob = new CronJob(config.cronSchedule, async () => {
        logger.info("Scheduled epoch roll triggered");
        await runEpochRoll();
    });
    cronJob.start();
    logger.info("Scheduled epoch rolls", { schedule: config.cronSchedule });

    // Start health server
    startHealthServer();

    logger.info("Keeper service ready");
    logger.info("========================================");
}

main().catch((error) => {
    logger.error("Fatal error", { error });
    process.exit(1);
});
