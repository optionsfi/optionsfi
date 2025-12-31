/**
 * On-Chain Client for OptionsFi V2
 * 
 * Provides transaction building and submission for vault program interactions.
 */

import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Configuration
// ============================================================================

// Will be updated after program deployment
const VAULT_PROGRAM_ID = new PublicKey(
    process.env.VAULT_PROGRAM_ID || "A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94"
);

// ============================================================================
// PDA Derivation
// ============================================================================

export function deriveVaultPda(assetId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(assetId)],
        VAULT_PROGRAM_ID
    );
}

export function deriveWithdrawalPda(
    vault: PublicKey,
    user: PublicKey,
    epoch: bigint
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("withdrawal"),
            vault.toBuffer(),
            user.toBuffer(),
            Buffer.from(epoch.toString())
        ],
        VAULT_PROGRAM_ID
    );
}

export function deriveShareEscrowPda(vaultPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("share_escrow"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

export function deriveWhitelistPda(vaultPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("whitelist"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

// ============================================================================
// Vault Data Interface
// ============================================================================

export interface VaultData {
    authority: PublicKey;
    assetId: string;
    underlyingMint: PublicKey;
    shareMint: PublicKey;
    vaultTokenAccount: PublicKey;
    premiumMint: PublicKey;
    premiumTokenAccount: PublicKey;
    shareEscrow: PublicKey;
    totalAssets: bigint;
    totalShares: bigint;
    virtualOffset: bigint;
    epoch: bigint;
    utilizationCapBps: number;
    minEpochDuration: bigint;
    lastRollTimestamp: bigint;
    pendingWithdrawals: bigint;
    epochNotionalExposed: bigint;
    epochPremiumEarned: bigint;
    epochPremiumPerTokenBps: number;
    isPaused: boolean;
    bump: number;
}

// ============================================================================
// On-Chain Client
// ============================================================================

export class OnChainClient {
    private connection: Connection;
    private wallet: anchor.Wallet;
    private program: anchor.Program | null = null;

    constructor(connection: Connection, wallet: anchor.Wallet) {
        this.connection = connection;
        this.wallet = wallet;
    }

    async initialize(): Promise<void> {
        const provider = new anchor.AnchorProvider(
            this.connection,
            this.wallet,
            { commitment: "confirmed" }
        );

        try {
            // Load IDL from file - try multiple locations
            const possiblePaths = [
                path.resolve(__dirname, "../idl/vault.json"),  // Docker: /app/idl/vault.json
                path.resolve(process.cwd(), "idl/vault.json"), // Docker alternative
                path.resolve(__dirname, "../../../target/idl/vault.json"),  // Local dev: from keeper/src to project root
                path.resolve(__dirname, "../../target/idl/vault.json"),
            ];

            let idlPath: string | null = null;
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    idlPath = p;
                    break;
                }
            }

            if (idlPath) {
                const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
                this.program = new anchor.Program(idl, provider);
                console.log("Loaded vault IDL from:", idlPath);
            } else {
                console.warn("Vault IDL not found in any expected location");
            }
        } catch (error) {
            console.error("Failed to load IDL:", error);
        }
    }

    /**
     * Fetch vault data from on-chain
     */
    async fetchVault(assetId: string): Promise<VaultData | null> {
        if (!this.program) {
            console.warn("Program not initialized");
            return null;
        }

        try {
            const [vaultPda] = deriveVaultPda(assetId);
            const vault = await (this.program.account as any).vault.fetch(vaultPda);

            return {
                authority: vault.authority as PublicKey,
                assetId: vault.assetId as string,
                underlyingMint: vault.underlyingMint as PublicKey,
                shareMint: vault.shareMint as PublicKey,
                vaultTokenAccount: vault.vaultTokenAccount as PublicKey,
                premiumMint: vault.premiumMint as PublicKey,
                premiumTokenAccount: vault.premiumTokenAccount as PublicKey,
                shareEscrow: vault.shareEscrow as PublicKey,
                totalAssets: BigInt((vault.totalAssets as anchor.BN).toString()),
                totalShares: BigInt((vault.totalShares as anchor.BN).toString()),
                virtualOffset: BigInt((vault.virtualOffset as anchor.BN).toString()),
                epoch: BigInt((vault.epoch as anchor.BN).toString()),
                utilizationCapBps: vault.utilizationCapBps as number,
                minEpochDuration: BigInt((vault.minEpochDuration as anchor.BN).toString()),
                lastRollTimestamp: BigInt((vault.lastRollTimestamp as anchor.BN).toString()),
                pendingWithdrawals: BigInt((vault.pendingWithdrawals as anchor.BN).toString()),
                epochNotionalExposed: BigInt((vault.epochNotionalExposed as anchor.BN).toString()),
                epochPremiumEarned: BigInt((vault.epochPremiumEarned as anchor.BN).toString()),
                epochPremiumPerTokenBps: vault.epochPremiumPerTokenBps as number,
                isPaused: vault.isPaused as boolean,
                bump: vault.bump as number,
            };
        } catch (error: any) {
            console.error("Failed to fetch vault:", error.message);
            return null;
        }
    }

    /**
     * Record notional exposure on vault
     */
    async recordNotionalExposure(
        assetId: string,
        notionalTokens: bigint,
        premium: bigint
    ): Promise<string> {
        if (!this.program) {
            throw new Error("Program not initialized");
        }

        const [vaultPda] = deriveVaultPda(assetId);

        const tx = await this.program.methods
            .recordNotionalExposure(
                new anchor.BN(notionalTokens.toString()),
                new anchor.BN(premium.toString())
            )
            .accounts({
                vault: vaultPda,
                authority: this.wallet.publicKey,
            })
            .rpc();

        return tx;
    }

    /**
     * Advance epoch with premium
     */
    async advanceEpoch(assetId: string, premiumEarned: bigint): Promise<string> {
        if (!this.program) {
            throw new Error("Program not initialized");
        }

        const [vaultPda] = deriveVaultPda(assetId);

        const tx = await this.program.methods
            .advanceEpoch(new anchor.BN(premiumEarned.toString()))
            .accounts({
                vault: vaultPda,
                authority: this.wallet.publicKey,
            })
            .rpc();

        return tx;
    }

    /**
     * Collect premium from market maker
     * SECURITY FIX M-1: Now requires authority signature to prevent front-running
     */
    async collectPremium(
        assetId: string,
        amount: bigint,
        payerTokenAccount: PublicKey
    ): Promise<string> {
        if (!this.program) {
            throw new Error("Program not initialized");
        }

        const [vaultPda] = deriveVaultPda(assetId);
        const vault = await this.fetchVault(assetId);
        if (!vault) throw new Error("Vault not found");

        const tx = await this.program.methods
            .collectPremium(new anchor.BN(amount.toString()))
            .accounts({
                vault: vaultPda,
                vaultPremiumAccount: vault.premiumTokenAccount,
                payerTokenAccount: payerTokenAccount,
                payer: this.wallet.publicKey,
                authority: this.wallet.publicKey,  // SECURITY FIX M-1: Authority must sign
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();

        return tx;
    }

    /**
     * Pay settlement to market maker for ITM options
     */
    async paySettlement(
        assetId: string,
        amount: bigint,
        recipientTokenAccount: PublicKey,
        recipient: PublicKey
    ): Promise<string> {
        if (!this.program) {
            throw new Error("Program not initialized");
        }

        const [vaultPda] = deriveVaultPda(assetId);
        const [whitelistPda] = deriveWhitelistPda(vaultPda);
        const vault = await this.fetchVault(assetId);
        if (!vault) throw new Error("Vault not found");

        const tx = await this.program.methods
            .paySettlement(new anchor.BN(amount.toString()))
            .accounts({
                vault: vaultPda,
                whitelist: whitelistPda,
                vaultPremiumAccount: vault.premiumTokenAccount,
                recipientTokenAccount: recipientTokenAccount,
                recipient: recipient,
                authority: this.wallet.publicKey,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            })
            .rpc();

        return tx;
    }

    get publicKey(): PublicKey {
        return this.wallet.publicKey;
    }

    /**
     * Set minimum epoch duration for a vault
     */
    async setMinEpochDuration(assetId: string, duration: number): Promise<string> {
        if (!this.program) throw new Error("Client not initialized");

        const [vaultPda] = deriveVaultPda(assetId);

        return await this.program.methods
            .setMinEpochDuration(new anchor.BN(duration))
            .accounts({
                vault: vaultPda,
                authority: this.wallet.publicKey,
            })
            .rpc();
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function loadKeypair(keypairPath: string): Keypair {
    // Try env var first (base64-encoded keypair)
    if (process.env.WALLET_PRIVATE_KEY) {
        try {
            const decoded = Buffer.from(process.env.WALLET_PRIVATE_KEY, "base64");
            try {
                // Try to parse as JSON array string
                const keypairData = JSON.parse(decoded.toString());
                return Keypair.fromSecretKey(Uint8Array.from(keypairData));
            } catch (e) {
                // If not JSON, assume raw secret key bytes
                return Keypair.fromSecretKey(new Uint8Array(decoded));
            }
        } catch (error: any) {
            console.error("Failed to load wallet from WALLET_PRIVATE_KEY:", error.message);
        }
    }

    // Fall back to file
    const resolved = path.resolve(keypairPath);
    const keypairData = JSON.parse(fs.readFileSync(resolved, "utf-8"));
    return Keypair.fromSecretKey(Uint8Array.from(keypairData));
}

export function createWallet(keypairPath: string): anchor.Wallet {
    const keypair = loadKeypair(keypairPath);
    return new anchor.Wallet(keypair);
}
