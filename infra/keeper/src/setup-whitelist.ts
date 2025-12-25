
import * as anchor from "@coral-xyz/anchor";
import { Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Configuration
const RPC_URL = "https://api.devnet.solana.com";
const ASSETS = ["DemoNVDAx", "DemoNVDAx2"];

async function main() {
    const connection = new Connection(RPC_URL, "confirmed");

    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.resolve(process.env.HOME || "", ".config/solana/id.json");
    if (!fs.existsSync(walletPath)) {
        throw new Error(`Wallet not found at ${walletPath}`);
    }
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
    );
    const wallet = new Wallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

    // Load IDL
    const idlPath = path.resolve(__dirname, "../idl/vault.json");
    if (!fs.existsSync(idlPath)) {
        throw new Error(`IDL not found at ${idlPath}`);
    }
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
    const program = new Program(idl, provider);

    console.log("Program ID:", program.programId.toBase58());
    console.log("Authority:", wallet.publicKey.toBase58());

    for (const assetId of ASSETS) {
        console.log(`\nProcessing vault: ${assetId}...`);

        try {
            // Derive PDAs
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), Buffer.from(assetId)],
                program.programId
            );
            console.log("Vault PDA:", vaultPda.toBase58());

            const [whitelistPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("whitelist"), vaultPda.toBuffer()],
                program.programId
            );
            console.log("Whitelist PDA:", whitelistPda.toBase58());

            // Check if whitelist already exists
            const whitelistAccount = await connection.getAccountInfo(whitelistPda);

            if (!whitelistAccount) {
                console.log("Initializing whitelist...");
                await program.methods
                    .initializeWhitelist()
                    .accounts({
                        vault: vaultPda,
                        whitelist: whitelistPda,
                        authority: wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .rpc();
                console.log("Whitelist initialized!");
            } else {
                console.log("Whitelist already initialized.");
            }

            // Add Authority as Market Maker (for testing)
            console.log("Adding Authority as Market Maker...");
            try {
                await program.methods
                    .addMarketMaker(wallet.publicKey)
                    .accounts({
                        vault: vaultPda,
                        whitelist: whitelistPda,
                        authority: wallet.publicKey,
                    })
                    .rpc();
                console.log("Market Maker added successfully!");
            } catch (e: any) {
                if (e.message.includes("AlreadyWhitelisted")) {
                    console.log("Market Maker already whitelisted.");
                } else {
                    console.error("Failed to add market maker:", e);
                }
            }

        } catch (error) {
            console.error(`Failed to process ${assetId}:`, error);
        }
    }
}

main().catch(console.error);
