/**
 * Mock Market Maker for OptionsFi
 * 
 * Connects to RFQ Router and provides quotes for testing.
 * On fill, transfers USDC premium to vault's premium account.
 */

const WebSocket = require("ws");
const { Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
const { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, getAccount, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const fs = require("fs");
const path = require("path");

const ROUTER_WS_URL = process.env.ROUTER_WS_URL || "ws://localhost:3006";
const MAKER_ID = process.env.MAKER_ID || "mock-mm-usdc";
const MM_API_KEY = process.env.MM_API_KEY || "demo-mm-key-1"; // Must match RFQ router's MM_API_KEYS
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

// USDC Mint on devnet (Mock USDC)
const USDC_MINT = new PublicKey("5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4");

// Vault PDA for NVDAx (we'll derive the premium account from this)
const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");

let ws;
let reconnectAttempts = 0;
let connection;
let wallet;
let rfqVaults = {}; // Track underlying asset per RFQ ID

// Derive vault PDA
function deriveVaultPda(assetId) {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(assetId)],
        VAULT_PROGRAM_ID
    );
}

// Load wallet from file or environment
function loadWallet() {
    // Try environment variable first (base64-encoded keypair)
    if (process.env.WALLET_PRIVATE_KEY) {
        try {
            const decoded = Buffer.from(process.env.WALLET_PRIVATE_KEY, "base64");
            wallet = Keypair.fromSecretKey(Uint8Array.from(decoded));
            console.log(`Wallet loaded from env: ${wallet.publicKey.toBase58()}`);
            return;
        } catch (error) {
            console.error("Failed to load wallet from WALLET_PRIVATE_KEY:", error.message);
        }
    }

    // Fall back to file
    const walletPath = process.env.WALLET_PATH || path.join(process.env.HOME || "/root", ".config/solana/id.json");
    try {
        const keypairData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
        wallet = Keypair.fromSecretKey(Uint8Array.from(keypairData));
        console.log(`Wallet loaded from file: ${wallet.publicKey.toBase58()}`);
    } catch (error) {
        console.error("Failed to load wallet:", error.message);
        console.log("Premium transfers will be simulated only (no actual tokens)");
        wallet = null;
    }
}

// Initialize connection and derive accounts
async function init() {
    connection = new Connection(RPC_URL, "confirmed");
    loadWallet();

    // Check if we have USDC balance
    if (wallet) {
        try {
            const mmUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
            const balance = await connection.getTokenAccountBalance(mmUsdcAccount);
            console.log(`MM USDC balance: ${balance.value.uiAmount} USDC`);
        } catch (error) {
            console.warn("Could not check USDC balance:", error.message);
        }
    }
}

function connect() {
    console.log(`\nConnecting to RFQ Router as ${MAKER_ID}...`);

    const wsUrl = `${ROUTER_WS_URL}?makerId=${MAKER_ID}&apiKey=${MM_API_KEY}`;
    console.log(`WebSocket URL: ${wsUrl}`);

    ws = new WebSocket(wsUrl);

    ws.on("open", () => {
        console.log("✓ Connected to RFQ Router");
        reconnectAttempts = 0;
    });

    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data.toString());
            handleMessage(msg);
        } catch (e) {
            console.error("Failed to parse message:", e);
        }
    });

    ws.on("close", (code, reason) => {
        console.log(`Disconnected from RFQ Router - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
        scheduleReconnect();
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error.message);
    });
}

function scheduleReconnect() {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectAttempts++;
    console.log(`Reconnecting in ${delay}ms...`);
    setTimeout(connect, delay);
}

function handleMessage(msg) {
    if (msg.type === "rfq") {
        console.log(`\n📨 Received RFQ: ${msg.rfqId}`, {
            underlying: msg.underlying,
            strike: msg.strike,
            size: msg.size,
        });

        // Track the underlying asset for this RFQ
        rfqVaults[msg.rfqId] = msg.underlying;

        // Generate quote with realistic spread
        // Premium = size (tokens) * spotPrice * premiumPercent (~0.2% for 6h OTM calls)
        const premiumPercent = 0.002 + Math.random() * 0.001;
        // Use strike as proxy for spot price (strike is 10% OTM)
        const spotPrice = msg.strike / 1.10;
        // Premium in USD = size_tokens * price * percent
        const premiumUsd = msg.size * spotPrice * premiumPercent;
        // Convert to USDC base units (6 decimals)
        const premium = Math.floor(premiumUsd * 1e6);

        console.log(`📊 Premium calc: ${msg.size} tokens × $${spotPrice.toFixed(2)} × ${(premiumPercent * 100).toFixed(2)}% = $${premiumUsd.toFixed(2)} (${premium} base units)`);

        // Simulate thinking time (500ms - 1.5s)
        setTimeout(() => {
            sendQuote(msg.rfqId, premium);
        }, 500 + Math.random() * 1000);
    }

    if (msg.type === "fill") {
        const assetId = rfqVaults[msg.rfqId] || "NVDAx3";
        console.log(`\n✅ Order filled! RFQ: ${msg.rfqId}, Premium: ${msg.premium / 1e6} USDC, Vault: ${assetId}`);
        transferPremiumToVault(msg.premium, assetId);
        delete rfqVaults[msg.rfqId]; // Cleanup
    }
}

function sendQuote(rfqId, premium) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const quote = {
            type: "quote",
            rfqId,
            premium,
        };
        ws.send(JSON.stringify(quote));
        console.log(`💬 Sent quote for ${rfqId}: ${premium / 1e6} USDC`);
    }
}

async function transferPremiumToVault(premiumBaseUnits, assetId) {
    if (!wallet) {
        console.log(`[Simulated] Would transfer ${premiumBaseUnits / 1e6} USDC to vault ${assetId}`);
        return;
    }

    try {
        // Derive vault PDA for this asset
        const [vaultPda] = deriveVaultPda(assetId);
        const vaultPremiumAccount = await getAssociatedTokenAddress(USDC_MINT, vaultPda, true);
        console.log(`Vault ${assetId} USDC Account: ${vaultPremiumAccount.toBase58()}`);

        // Get MM's USDC token account
        const mmUsdcAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);

        // Check balance
        const balance = await connection.getTokenAccountBalance(mmUsdcAccount);
        console.log(`MM USDC balance: ${balance.value.uiAmount} USDC`);

        if (Number(balance.value.amount) < premiumBaseUnits) {
            console.warn(`⚠️ Insufficient USDC balance. Have: ${balance.value.uiAmount}, Need: ${premiumBaseUnits / 1e6}`);
            return;
        }

        const tx = new Transaction();

        // Check if vault premium account exists, create if needed
        try {
            await getAccount(connection, vaultPremiumAccount);
        } catch (error) {
            console.log("Creating vault USDC token account...");
            tx.add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,      // payer
                    vaultPremiumAccount,   // ata
                    vaultPda,              // owner (vault PDA)
                    USDC_MINT              // mint
                )
            );
        }

        // Create transfer instruction
        const transferIx = createTransferInstruction(
            mmUsdcAccount,           // from
            vaultPremiumAccount,     // to (vault's USDC account)
            wallet.publicKey,        // owner
            premiumBaseUnits         // amount
        );

        tx.add(transferIx);
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        tx.sign(wallet);
        const signature = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(signature, "confirmed");

        console.log(`✓ Premium transferred to ${assetId}: ${premiumBaseUnits / 1e6} USDC`);
        console.log(`  TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (error) {
        console.error("Failed to transfer premium:", error.message);
    }
}

// Start
console.log("========================================");
console.log("Mock Market Maker (USDC) Starting");
console.log("========================================");
console.log(`RFQ Router: ${ROUTER_WS_URL}`);
console.log(`Maker ID: ${MAKER_ID}`);
console.log(`RPC: ${RPC_URL}`);
console.log("----------------------------------------");

init().then(() => {
    connect();
}).catch(error => {
    console.error("Init failed:", error);
    process.exit(1);
});
