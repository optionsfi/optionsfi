
import * as anchor from "@coral-xyz/anchor";
import { Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// Configuration
const RPC_URL = "https://api.devnet.solana.com";
const ASSET_ID = "DemoNVDAx2";
const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"); // Devnet USDC
const NVDAX_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn");

async function main() {
    const connection = new Connection(RPC_URL, "confirmed");

    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.resolve(process.env.HOME || "", ".config/solana/id.json");
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
    );
    const wallet = new Wallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

    // Load IDL
    const idlPath = path.resolve(__dirname, "../idl/vault.json");
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
    console.log("Share Escrow PDA:", shareEscrowPda.toBase58());

    // 2. Generate Keypairs for other accounts
    const shareMint = Keypair.generate();
    const vaultTokenAccount = Keypair.generate();
    const premiumTokenAccount = Keypair.generate();

    console.log("Share Mint:", shareMint.publicKey.toBase58());
    console.log("Vault Token Account:", vaultTokenAccount.publicKey.toBase58());
    console.log("Premium Token Account:", premiumTokenAccount.publicKey.toBase58());

    // 3. Initialize Vault
    try {
        const tx = await program.methods
            .initializeVault(ASSET_ID, 2000) // 20% utilization cap
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

        console.log("Vault initialized successfully!");
        console.log("Transaction Signature:", tx);
    } catch (error) {
        console.error("Failed to initialize vault:", error);
    }
}

main().catch(console.error);
