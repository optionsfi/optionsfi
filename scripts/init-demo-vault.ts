/**
 * Initialize DemoNVDAx Vault
 * 
 * Creates a separate demo vault for testing demo controls
 */

import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as path from "path";

// Load program ID
const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");

// DEMO asset ID - separate from production NVDAx
const ASSET_ID = "DemoNVDAx";
const UTILIZATION_CAP_BPS = 8000; // 80%

async function main() {
    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.join(process.env.HOME!, ".config/solana/id.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const payer = Keypair.fromSecretKey(Uint8Array.from(walletData));

    console.log("Authority:", payer.publicKey.toBase58());

    // Load mint addresses from .env.mints
    const envPath = path.join(__dirname, ".env.mints");
    if (!fs.existsSync(envPath)) {
        console.error("Error: .env.mints not found. Run create-nvdax.ts and create-usdc.ts first.");
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, "utf-8");
    const nvdaxMatch = envContent.match(/NVDAX_MINT=(\w+)/);
    const usdcMatch = envContent.match(/USDC_MINT=(\w+)/);

    if (!nvdaxMatch || !usdcMatch) {
        console.error("Error: Missing NVDAX_MINT or USDC_MINT in .env.mints");
        process.exit(1);
    }

    const nvdaxMint = new PublicKey(nvdaxMatch[1]);
    const usdcMint = new PublicKey(usdcMatch[1]);

    console.log("NVDAx Mint (shared):", nvdaxMint.toBase58());
    console.log("USDC Mint:", usdcMint.toBase58());
    console.log("\nCreating DEMO vault with assetId:", ASSET_ID);

    // Connect to devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const wallet = new Wallet(payer);
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

    // Load IDL
    const idlPath = path.join(__dirname, "../target/idl/vault.json");
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
    const program = new Program(idl, provider);

    // Derive vault PDA for DEMO
    const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(ASSET_ID)],
        VAULT_PROGRAM_ID
    );
    console.log("\nDemo Vault PDA:", vaultPda.toBase58());

    // Generate new keypairs for accounts
    const shareMintKeypair = Keypair.generate();
    const vaultTokenAccountKeypair = Keypair.generate();
    const premiumTokenAccountKeypair = Keypair.generate();

    console.log("Demo Share Mint:", shareMintKeypair.publicKey.toBase58());
    console.log("Demo Vault Token Account:", vaultTokenAccountKeypair.publicKey.toBase58());
    console.log("Demo Premium Token Account:", premiumTokenAccountKeypair.publicKey.toBase58());

    // Check if vault already exists
    const vaultAccount = await connection.getAccountInfo(vaultPda);
    if (vaultAccount) {
        console.log("\nDemo vault already exists!");
        process.exit(0);
    }

    // Initialize vault
    console.log("\nInitializing demo vault...");

    try {
        const tx = await program.methods
            .initializeVault(ASSET_ID, UTILIZATION_CAP_BPS)
            .accounts({
                vault: vaultPda,
                authority: payer.publicKey,
                underlyingMint: nvdaxMint,
                shareMint: shareMintKeypair.publicKey,
                vaultTokenAccount: vaultTokenAccountKeypair.publicKey,
                premiumMint: usdcMint,
                premiumTokenAccount: premiumTokenAccountKeypair.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .signers([shareMintKeypair, vaultTokenAccountKeypair, premiumTokenAccountKeypair])
            .rpc();

        console.log("Demo vault initialized:", tx);
        console.log("\n✅ DemoNVDAx Vault is ready!");
        console.log("\nDemo Vault Address:", vaultPda.toBase58());

        // Save addresses
        fs.appendFileSync(envPath, `\n# Demo Vault\n`);
        fs.appendFileSync(envPath, `DEMO_VAULT_PDA=${vaultPda.toBase58()}\n`);
        fs.appendFileSync(envPath, `DEMO_SHARE_MINT=${shareMintKeypair.publicKey.toBase58()}\n`);
        fs.appendFileSync(envPath, `DEMO_VAULT_TOKEN_ACCOUNT=${vaultTokenAccountKeypair.publicKey.toBase58()}\n`);
        fs.appendFileSync(envPath, `DEMO_PREMIUM_TOKEN_ACCOUNT=${premiumTokenAccountKeypair.publicKey.toBase58()}\n`);
    } catch (error: any) {
        console.error("Error initializing demo vault:", error.message);
        if (error.logs) {
            console.error("Logs:", error.logs);
        }
    }
}

main().catch(console.error);
