
import * as anchor from "@coral-xyz/anchor";
import { Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// Configuration
const RPC_URL = "https://api.devnet.solana.com";
const ASSET_ID = "DemoNVDAx3";
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Devnet USDC
// const NVDAX_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn"); // Original
const NVDAX_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn"); // Reusing same underlying for demo

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

    console.log(`Initializing vault for ${ASSET_ID}...`);
    console.log("Program ID:", program.programId.toBase58());

    // 1. Derive PDAs
    const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(ASSET_ID)],
        program.programId
    );
    console.log("Vault PDA:", vaultPda.toBase58());

    const [shareEscrowPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("share_escrow"), vaultPda.toBuffer()],
        program.programId
    );
    const [whitelistPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("whitelist"), vaultPda.toBuffer()],
        program.programId
    );

    // 2. Generate Keypairs for other accounts
    const shareMint = Keypair.generate();
    const vaultTokenAccount = Keypair.generate();
    const premiumTokenAccount = Keypair.generate();

    console.log("Share Mint:", shareMint.publicKey.toBase58());

    // 3. Initialize Vault
    try {
        console.log("Initializing Vault Account...");
        const tx = await program.methods
            .initializeVault(ASSET_ID, 2000, new anchor.BN(60)) // 20% cap, 60s timelock
            .accounts({
                vault: vaultPda,
                underlyingMint: NVDAX_MINT,
                premiumMint: USDC_MINT,
                shareMint: shareMint.publicKey,
                vaultTokenAccount: vaultTokenAccount.publicKey,
                premiumTokenAccount: premiumTokenAccount.publicKey,
                shareEscrow: shareEscrowPda,
                authority: wallet.publicKey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([shareMint, vaultTokenAccount, premiumTokenAccount])
            .rpc();

        console.log("Vault initialized! Tx:", tx);

        // 4. Initialize Whitelist
        console.log("Initializing Whitelist...");
        await program.methods
            .initializeWhitelist()
            .accounts({
                vault: vaultPda,
                whitelist: whitelistPda,
                authority: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();
        console.log("Whitelist initialized.");

        // 5. Add Self as Market Maker
        console.log("Adding self as Market Maker...");
        await program.methods
            .addMarketMaker(wallet.publicKey)
            .accounts({
                vault: vaultPda,
                whitelist: whitelistPda,
                authority: wallet.publicKey,
            })
            .rpc();
        console.log("Added self as MM.");

    } catch (error) {
        console.error("Setup failed:", error);
    }
}

main().catch(console.error);
