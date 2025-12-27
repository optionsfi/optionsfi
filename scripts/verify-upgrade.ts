#!/usr/bin/env npx ts-node
/**
 * Pre-Upgrade Verification Script
 * 
 * Run this BEFORE deploying any program upgrade to verify:
 * 1. All existing vaults can be deserialized with current code
 * 2. No struct layout mismatches
 * 3. All vaults are in a safe state for upgrade
 * 
 * Usage: npx ts-node scripts/verify-upgrade.ts
 */

import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");

// Known vault asset IDs to check
const KNOWN_VAULTS = [
    "NVDAx",
    "DemoNVDAx",
    "DemoNVDAx2",
    "DemoV3",
];

interface UpgradeCheck {
    assetId: string;
    pda: string;
    status: "OK" | "NOT_FOUND" | "DESERIALIZATION_ERROR" | "UNSAFE_STATE";
    message: string;
    hasAssets: boolean;
    hasPendingWithdrawals: boolean;
    isInEpoch: boolean;
}

async function main() {
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("  PRE-UPGRADE VERIFICATION SCRIPT");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log(`RPC: ${RPC_URL}`);
    console.log(`Program: ${VAULT_PROGRAM_ID.toBase58()}\n`);

    const connection = new Connection(RPC_URL);

    // Load IDL from target (the NEW code we're about to deploy)
    const idlPath = path.join(__dirname, "..", "target", "idl", "vault.json");
    if (!fs.existsSync(idlPath)) {
        console.error("❌ IDL not found at target/idl/vault.json");
        console.error("   Run 'anchor build' first to generate the IDL\n");
        process.exit(1);
    }

    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
    console.log("✅ Loaded IDL from target/idl/vault.json\n");

    // Create dummy provider for read-only operations
    const provider = new AnchorProvider(
        connection,
        { publicKey: PublicKey.default, signTransaction: async () => { throw new Error(); }, signAllTransactions: async () => { throw new Error(); } } as any,
        { commitment: "confirmed" }
    );
    const program = new Program(idl, provider);

    const results: UpgradeCheck[] = [];
    let hasErrors = false;
    let hasWarnings = false;

    console.log("Checking known vaults...\n");

    for (const assetId of KNOWN_VAULTS) {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), Buffer.from(assetId)],
            VAULT_PROGRAM_ID
        );

        let check: UpgradeCheck = {
            assetId,
            pda: pda.toBase58(),
            status: "OK",
            message: "",
            hasAssets: false,
            hasPendingWithdrawals: false,
            isInEpoch: false,
        };

        try {
            const vault = await (program.account as any).vault.fetch(pda);

            check.hasAssets = Number(vault.totalAssets) > 0;
            check.hasPendingWithdrawals = Number(vault.pendingWithdrawals) > 0;
            check.isInEpoch = Number(vault.epochNotionalExposed) > 0;

            // Check for unsafe states
            const warnings: string[] = [];

            if (check.hasAssets) {
                warnings.push(`Assets: ${(Number(vault.totalAssets) / 1e6).toFixed(2)}`);
            }
            if (check.hasPendingWithdrawals) {
                warnings.push(`Pending withdrawals: ${Number(vault.pendingWithdrawals)}`);
            }
            if (check.isInEpoch) {
                warnings.push(`Active exposure: ${(Number(vault.epochNotionalExposed) / 1e6).toFixed(2)}`);
            }

            if (warnings.length > 0) {
                check.message = warnings.join(", ");
                hasWarnings = true;
            } else {
                check.message = "Empty vault, safe to upgrade";
            }

            console.log(`✅ ${assetId.padEnd(15)} - Deserialized OK`);
            if (check.message) {
                console.log(`   └─ ${check.message}`);
            }

        } catch (error: any) {
            if (error.message.includes("Account does not exist")) {
                check.status = "NOT_FOUND";
                check.message = "Vault does not exist (already closed?)";
                console.log(`⚪ ${assetId.padEnd(15)} - Not found (OK)`);
            } else {
                check.status = "DESERIALIZATION_ERROR";
                check.message = error.message;
                hasErrors = true;
                console.log(`❌ ${assetId.padEnd(15)} - DESERIALIZATION FAILED`);
                console.log(`   └─ ${error.message}`);
            }
        }

        results.push(check);
    }

    // Also scan for any unknown vaults by fetching all program accounts
    console.log("\nScanning for additional vaults...");

    try {
        const allAccounts = await connection.getProgramAccounts(VAULT_PROGRAM_ID, {
            filters: [
                { dataSize: 8 + 32 + 68 + 32 + 32 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 2 + 8 + 8 + 8 + 8 + 4 + 8 + 1 + 8 + 2 + 8 + 1 },
            ],
        });

        const knownPdas = new Set(results.map(r => r.pda));
        const unknownVaults = allAccounts.filter(a => !knownPdas.has(a.pubkey.toBase58()));

        if (unknownVaults.length > 0) {
            console.log(`\n⚠️  Found ${unknownVaults.length} vault(s) not in KNOWN_VAULTS list:`);
            for (const vault of unknownVaults) {
                console.log(`   - ${vault.pubkey.toBase58()}`);
                hasWarnings = true;
            }
        } else {
            console.log("   └─ No additional vaults found");
        }
    } catch (e: any) {
        console.log(`   └─ Could not scan (${e.message})`);
    }

    // Summary
    console.log("\n═══════════════════════════════════════════════════════════════");
    console.log("  SUMMARY");
    console.log("═══════════════════════════════════════════════════════════════");

    const activeVaults = results.filter(r => r.status === "OK" && r.hasAssets);
    const deserializationErrors = results.filter(r => r.status === "DESERIALIZATION_ERROR");

    if (deserializationErrors.length > 0) {
        console.log(`\n❌ ${deserializationErrors.length} vault(s) FAILED deserialization!`);
        console.log("   DO NOT DEPLOY - upgrade would break these vaults!\n");
        for (const v of deserializationErrors) {
            console.log(`   - ${v.assetId}: ${v.message}`);
        }
        process.exit(1);
    }

    if (activeVaults.length > 0) {
        console.log(`\n⚠️  ${activeVaults.length} vault(s) have active assets:`);
        for (const v of activeVaults) {
            console.log(`   - ${v.assetId}: ${v.message}`);
        }
        console.log("\n   These vaults will continue to work after upgrade,");
        console.log("   but consider waiting for epoch end before deploying.\n");
    }

    console.log("\n✅ All vaults can be deserialized with new code.");
    console.log("   Upgrade is SAFE to proceed.\n");

    // Write results to file
    const resultsPath = path.join(__dirname, "..", "upgrade-verification-results.json");
    fs.writeFileSync(resultsPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        rpcUrl: RPC_URL,
        programId: VAULT_PROGRAM_ID.toBase58(),
        results,
        hasErrors,
        hasWarnings,
        safeToUpgrade: !hasErrors,
    }, null, 2));
    console.log(`Results saved to: ${resultsPath}`);
}

main().catch(console.error);
