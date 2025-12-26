#!/usr/bin/env npx ts-node
/**
 * Setup Demo Vault (15m Epoch)
 * 
 * Migrates/Resets vault to 15 minute epochs for demo.
 * Based on scripts/migrate-vault.ts
 */

import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import path from "path";

// Configuration
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const WALLET_PATH = process.env.WALLET_PATH || process.env.ANCHOR_WALLET || "~/.config/solana/id.json";
const PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");

// Devnet mints
const UNDERLYING_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn");
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

function loadWallet(): Keypair {
    const resolvedPath = WALLET_PATH.replace("~", process.env.HOME || "");
    const keypairData = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
    return Keypair.fromSecretKey(Uint8Array.from(keypairData));
}

function deriveVaultPda(assetId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(assetId)],
        PROGRAM_ID
    );
}

async function main() {
    const assetId = process.argv[2];

    if (!assetId) {
        console.log("Usage: npx ts-node scripts/setup-demo.ts <assetId>");
        console.log("Example: npx ts-node scripts/setup-demo.ts DemoNVDAx");
        process.exit(1);
    }

    console.log("Converting Vault to 15m Demo Epoch...");
    console.log(`Asset ID: ${assetId}`);

    // Load wallet
    const wallet = loadWallet();
    const connection = new Connection(RPC_URL, "confirmed");
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        { commitment: "confirmed" }
    );
    anchor.setProvider(provider);

    // Load IDL
    const idlPath = path.join(__dirname, "../target/idl/vault.json");
    if (!fs.existsSync(idlPath)) {
        console.error("IDL not found at " + idlPath + ". Run 'anchor build' first.");
        process.exit(1);
    }
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
    const program = new anchor.Program(idl, provider);

    // Derive vault PDA
    const [vaultPda] = deriveVaultPda(assetId);

    // Check if vault exists
    const vaultAccount = await connection.getAccountInfo(vaultPda);

    if (vaultAccount) {
        console.log("Found existing vault. Force closing to reset...");
        try {
            await program.methods
                .forceCloseVault(assetId)
                .accounts({
                    vault: vaultPda,
                    authority: wallet.publicKey,
                })
                .rpc();
            console.log("✅ Old vault closed.");
        } catch (error: any) {
            console.error("❌ Failed to close vault:", error.message);
            process.exit(1);
        }
    }

    // Wait for confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create new vault
    console.log("Creating new vault with 900s (15m) epoch...");

    const [shareMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("share_mint"), vaultPda.toBytes()],
        PROGRAM_ID
    );

    const vaultTokenAccount = await getAssociatedTokenAddress(UNDERLYING_MINT, vaultPda, true);
    const premiumTokenAccount = await getAssociatedTokenAddress(USDC_MINT, vaultPda, true);
    // shareEscrow is a PDA, not an ATA
    const [shareEscrow] = PublicKey.findProgramAddressSync(
        [Buffer.from("share_escrow"), vaultPda.toBytes()],
        PROGRAM_ID
    );

    try {
        // initializeVault(assetId, utilization_cap_bps, min_epoch_duration)
        const tx = await program.methods
            .initializeVault(assetId, 8000, new anchor.BN(900)) // 80% util, 900s (15m) epoch
            .accounts({
                vault: vaultPda,
                underlyingMint: UNDERLYING_MINT,
                premiumMint: USDC_MINT,
                shareMint: shareMint,
                vaultTokenAccount: vaultTokenAccount,
                premiumTokenAccount: premiumTokenAccount,
                shareEscrow: shareEscrow,
                authority: wallet.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .rpc();

        console.log(`✅ Success! New vault (15m epoch) created: ${tx}`);
    } catch (error: any) {
        console.error("❌ Failed to create vault:", error.message);
        process.exit(1);
    }
}

main().catch(console.error);
