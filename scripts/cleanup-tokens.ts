/**
 * Analyze and cleanup unused token accounts
 * 
 * Usage: npx ts-node scripts/cleanup-tokens.ts [--execute]
 * Without --execute: Shows what would be closed (dry run)
 * With --execute: Actually closes empty token accounts
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAccount, closeAccount } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

// Mints that are ACTIVELY USED by the app
const ACTIVE_MINTS = new Set([
    "G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn",  // NVDAx (underlying)
    "5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4",  // USDC (premium)
    "4yLeF5RVrpBST6Y3VDz7XQT3bGFACXtzMkANRpeFJduw",  // DemoNVDAx share mint
]);

// Known mint names for display
const MINT_NAMES: Record<string, string> = {
    "G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn": "NVDAx (underlying)",
    "5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4": "USDC (premium)",
    "4yLeF5RVrpBST6Y3VDz7XQT3bGFACXtzMkANRpeFJduw": "vDemoNVDAx (shares)",
    "BoAgayd7WrWsLxWz9HDJx9oYf33XfaXoHseMMezz7mHU": "OLD vDemoNVDAx5 (shares) - ORPHANED",
};

async function main() {
    const executeMode = process.argv.includes("--execute");

    // Load wallet
    const walletPath = process.env.WALLET_PATH ||
        path.join(process.env.HOME!, ".config/solana/id.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const payer = Keypair.fromSecretKey(Uint8Array.from(walletData));

    console.log(`\n🔍 Token Account Analysis`);
    console.log(`   Wallet: ${payer.publicKey.toBase58()}`);
    console.log(`   Mode: ${executeMode ? "EXECUTE" : "DRY RUN"}`);
    console.log("");

    const connection = new Connection(RPC_URL, "confirmed");

    // Get all token accounts owned by this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        payer.publicKey,
        { programId: TOKEN_PROGRAM_ID }
    );

    console.log(`Found ${tokenAccounts.value.length} token accounts:\n`);

    const toClose: { pubkey: PublicKey; mint: string; balance: number }[] = [];

    for (const account of tokenAccounts.value) {
        const info = account.account.data.parsed.info;
        const mint = info.mint;
        const balance = parseFloat(info.tokenAmount.uiAmountString || "0");
        const isActive = ACTIVE_MINTS.has(mint);
        const name = MINT_NAMES[mint] || "Unknown";

        const status = isActive
            ? "✓ ACTIVE"
            : balance > 0
                ? "? HAS BALANCE"
                : "✗ EMPTY";

        console.log(`${status} | ${mint.slice(0, 8)}... | Balance: ${balance} | ${name}`);

        // Only consider closing empty, non-active accounts
        if (!isActive && balance === 0) {
            toClose.push({
                pubkey: account.pubkey,
                mint,
                balance
            });
        }
    }

    console.log("");

    if (toClose.length === 0) {
        console.log("✅ No empty unused accounts to close!");
        return;
    }

    console.log(`\n📋 Accounts that can be closed (empty + not active):`);
    for (const acc of toClose) {
        console.log(`   - ${acc.pubkey.toBase58()} (mint: ${acc.mint.slice(0, 8)}...)`);
    }

    if (!executeMode) {
        console.log(`\n⚠️  DRY RUN - To actually close these accounts, run with --execute`);
        console.log(`   npx ts-node scripts/cleanup-tokens.ts --execute`);
        return;
    }

    console.log(`\n🗑️  Closing ${toClose.length} empty accounts...`);

    for (const acc of toClose) {
        try {
            const sig = await closeAccount(
                connection,
                payer,
                acc.pubkey,
                payer.publicKey,  // Destination for rent
                payer              // Authority
            );
            console.log(`   ✓ Closed ${acc.pubkey.toBase58().slice(0, 8)}... - Tx: ${sig.slice(0, 8)}...`);
        } catch (err: any) {
            console.log(`   ✗ Failed to close ${acc.pubkey.toBase58().slice(0, 8)}...: ${err.message}`);
        }
    }

    console.log("\n✅ Cleanup complete!");
}

main().catch(console.error);
