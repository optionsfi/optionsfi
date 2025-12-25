import { Connection, PublicKey, Transaction, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import vaultIdl from "../anchor/vault_idl.json";

// Program IDs on devnet
export const VAULT_PROGRAM_ID = new PublicKey(
    "A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94"
);

export const ORACLE_PROGRAM_ID = new PublicKey(
    "5MnuN6ahpRSp5F3R2uXvy9pSN4TQmhSydywQSoxszuZk"
);

export const RFQ_PROGRAM_ID = new PublicKey(
    "3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z"
);

// Vault configuration for each xStock
export interface VaultConfig {
    symbol: string;
    assetId: string;  // Used for PDA derivation
    underlyingMint: PublicKey;
}

// NVDAx token mint (the actual token users deposit)
const NVDAX_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn");

export const VAULTS: Record<string, VaultConfig> = {
    nvdax: {
        symbol: "NVDAx",
        assetId: "NVDAx",
        underlyingMint: NVDAX_MINT,
    },
    demonvdax: {
        symbol: "DemoNVDAx",
        assetId: "DemoNVDAx",
        underlyingMint: NVDAX_MINT,
    },
    demonvdax2: {
        symbol: "DemoNVDAx2",
        assetId: "DemoNVDAx2",
        underlyingMint: NVDAX_MINT,
    },
    demonvdax3: {
        symbol: "DemoNVDAx3",
        assetId: "DemoNVDAx3",
        underlyingMint: NVDAX_MINT,
    },
};

export interface VaultData {
    publicKey: string;
    symbol: string;
    authority: string;
    underlyingMint: string;
    shareMint: string;
    vaultTokenAccount: string;
    shareEscrow: string;
    epoch: number;
    totalAssets: string;
    totalShares: string;
    sharePrice: number;
    apy: number;
    tvl: number;
    utilizationCapBps: number;
    minEpochDuration: number;
    pendingWithdrawals: string;
    // Notional exposure tracking (fractional options)
    epochNotionalExposed: string;      // Total tokens exposed to options this epoch
    epochPremiumEarned: string;        // Total premium earned this epoch
    epochPremiumPerTokenBps: number;   // Average premium rate in basis points
}

/**
 * Derive vault PDA for a given asset ID
 */
export function deriveVaultPda(assetId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(assetId)],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive share mint PDA for a vault
 */
export function deriveShareMintPda(vaultPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("shares"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive vault token account PDA
 */
export function deriveVaultTokenAccountPda(vaultPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("vault_tokens"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive withdrawal request PDA (includes epoch in seeds)
 */
export function deriveWithdrawalPda(vaultPda: PublicKey, userPubkey: PublicKey, epoch: number | bigint): [PublicKey, number] {
    // Use BN for browser compatibility (writeBigUInt64LE doesn't work in browser)
    const epochBN = new BN(epoch.toString());
    const epochBuffer = epochBN.toArrayLike(Buffer, "le", 8);
    return PublicKey.findProgramAddressSync(
        [Buffer.from("withdrawal"), vaultPda.toBuffer(), userPubkey.toBuffer(), epochBuffer],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive the share escrow PDA
 */
export function deriveShareEscrowPda(vaultPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("share_escrow"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

/**
 * Get the vault program instance
 */
export function getVaultProgram(provider: AnchorProvider): any {
    return new Program(vaultIdl as any, provider);
}

/**
 * Fetch vault data from on-chain with retry logic
 */
export async function fetchVaultData(
    connection: Connection,
    assetId: string,
    retries = 3
): Promise<VaultData | null> {
    const [vaultPda] = deriveVaultPda(assetId);

    // Create a dummy wallet for read-only operations
    const dummyWallet = {
        publicKey: PublicKey.default,
        signTransaction: async () => { throw new Error("Not implemented"); },
        signAllTransactions: async () => { throw new Error("Not implemented"); },
    } as unknown as Wallet;

    const provider = new AnchorProvider(connection, dummyWallet, {
        commitment: "confirmed",
    });

    const program = getVaultProgram(provider);

    // Retry logic with exponential backoff
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const vaultAccount = await program.account.vault.fetch(vaultPda);

            // Calculate share price (totalAssets / totalShares)
            const totalAssets = Number(vaultAccount.totalAssets);
            const totalShares = Number(vaultAccount.totalShares);
            const sharePrice = totalShares > 0 ? totalAssets / totalShares : 1.0;

            // Calculate APY from epoch premium (annualized)
            // Real APY = (premium_earned / total_assets) × 52 weeks × 100
            // This gives the actual yield on the entire vault, not just exposed tokens
            const epochPremiumEarned = Number(vaultAccount.epochPremiumEarned || 0);
            const epochYieldPercent = totalAssets > 0
                ? (epochPremiumEarned / totalAssets) * 100
                : 0;
            // Annualize assuming weekly epochs
            const apy = epochYieldPercent * 52;
            const tvl = totalAssets / 1e6; // Assuming 6 decimals

            return {
                publicKey: vaultPda.toBase58(),
                symbol: assetId,
                authority: vaultAccount.authority.toBase58(),
                underlyingMint: vaultAccount.underlyingMint.toBase58(),
                shareMint: vaultAccount.shareMint.toBase58(),
                vaultTokenAccount: vaultAccount.vaultTokenAccount.toBase58(),
                shareEscrow: vaultAccount.shareEscrow.toBase58(),
                epoch: Number(vaultAccount.epoch),
                totalAssets: vaultAccount.totalAssets.toString(),
                totalShares: vaultAccount.totalShares.toString(),
                sharePrice,
                apy,
                tvl,
                utilizationCapBps: Number(vaultAccount.utilizationCapBps),
                minEpochDuration: Number(vaultAccount.minEpochDuration || 0),
                pendingWithdrawals: vaultAccount.pendingWithdrawals.toString(),
                // Notional exposure tracking (with fallbacks for existing vaults)
                epochNotionalExposed: (vaultAccount.epochNotionalExposed || 0).toString(),
                epochPremiumEarned: (vaultAccount.epochPremiumEarned || 0).toString(),
                epochPremiumPerTokenBps: Number(vaultAccount.epochPremiumPerTokenBps || 0),
            };
        } catch (error) {
            lastError = error as Error;
            console.warn(`Vault fetch attempt ${attempt + 1}/${retries} failed:`, error);

            // Wait before retry with exponential backoff (500ms, 1s, 2s)
            if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
            }
        }
    }

    // All retries failed
    console.error("All vault fetch attempts failed:", lastError);
    return null;
}


/**
 * Build a deposit transaction
 */
export async function buildDepositTransaction(
    connection: Connection,
    wallet: Wallet,
    assetId: string,
    amount: number // in base units (e.g., 1_000_000 for 1 USDC)
): Promise<Transaction> {
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const program = getVaultProgram(provider);

    const config = Object.values(VAULTS).find(v => v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);

    const [vaultPda] = deriveVaultPda(assetId);

    // Fetch the vault account to get the ACTUAL share mint and vault token account
    // (These were created as Keypairs during init, not PDAs)
    const vaultAccount = await (program.account as any).vault.fetch(vaultPda);
    const shareMint = vaultAccount.shareMint as PublicKey;
    const vaultTokenAccount = vaultAccount.vaultTokenAccount as PublicKey;

    // Get user's token account for the underlying asset
    const userTokenAccount = await getAssociatedTokenAddress(
        config.underlyingMint,
        wallet.publicKey
    );

    // Get user's share token account (create if needed)
    const userShareAccount = await getAssociatedTokenAddress(
        shareMint,
        wallet.publicKey
    );

    const tx = new Transaction();

    // Check if account exists and has no data (doesn't exist yet)
    const shareAccountInfo = await connection.getAccountInfo(userShareAccount);
    if (!shareAccountInfo) {
        tx.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                userShareAccount,
                wallet.publicKey,
                shareMint
            )
        );
    }

    // Build deposit instruction
    const depositIx = await program.methods
        .deposit(new BN(amount))
        .accounts({
            vault: vaultPda,
            shareMint: shareMint,
            vaultTokenAccount: vaultTokenAccount,
            userTokenAccount: userTokenAccount,
            userShareAccount: userShareAccount,
            user: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

    tx.add(depositIx);

    return tx;
}

/**
 * Build a request withdrawal transaction
 */
export async function buildRequestWithdrawalTransaction(
    connection: Connection,
    wallet: Wallet,
    assetId: string,
    shares: number // in base units
): Promise<Transaction> {
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const program = getVaultProgram(provider);

    const [vaultPda] = deriveVaultPda(assetId);

    // Fetch vault to get actual share mint and current epoch
    const vaultAccount = await (program.account as any).vault.fetch(vaultPda);
    const shareMint = vaultAccount.shareMint as PublicKey;
    const epoch = Number(vaultAccount.epoch);

    // Derive withdrawal PDA with epoch
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey, epoch);
    const [shareEscrowPda] = deriveShareEscrowPda(vaultPda);

    const userShareAccount = await getAssociatedTokenAddress(
        shareMint,
        wallet.publicKey
    );

    const tx = new Transaction();

    const requestWithdrawalIx = await program.methods
        .requestWithdrawal(new BN(shares))
        .accounts({
            vault: vaultPda,
            withdrawalRequest: withdrawalPda,
            shareEscrow: shareEscrowPda,
            userShareAccount: userShareAccount,
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .instruction();

    tx.add(requestWithdrawalIx);

    return tx;
}

/**
 * Build a process withdrawal transaction (after epoch settles)
 */
export async function buildProcessWithdrawalTransaction(
    connection: Connection,
    wallet: Wallet,
    assetId: string
): Promise<Transaction> {
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const program = getVaultProgram(provider);

    const config = Object.values(VAULTS).find(v => v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);

    const [vaultPda] = deriveVaultPda(assetId);

    // Fetch vault to get actual account addresses
    const vaultAccount = await (program.account as any).vault.fetch(vaultPda);
    const shareMint = vaultAccount.shareMint as PublicKey;
    const vaultTokenAccount = vaultAccount.vaultTokenAccount as PublicKey;

    // The withdrawal was requested in a previous epoch
    // We need to find it - typically the previous epoch
    const currentEpoch = Number(vaultAccount.epoch);
    const requestEpoch = currentEpoch > 0 ? currentEpoch - 1 : 0;
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey, requestEpoch);
    const [shareEscrowPda] = deriveShareEscrowPda(vaultPda);

    const userTokenAccount = await getAssociatedTokenAddress(
        config.underlyingMint,
        wallet.publicKey
    );

    const tx = new Transaction();

    const processWithdrawalIx = await program.methods
        .processWithdrawal()
        .accounts({
            vault: vaultPda,
            withdrawalRequest: withdrawalPda,
            shareMint: shareMint,
            vaultTokenAccount: vaultTokenAccount,
            userTokenAccount: userTokenAccount,
            shareEscrow: shareEscrowPda,
            user: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

    tx.add(processWithdrawalIx);

    return tx;
}

/**
 * Get user's share balance for a vault
 */
export async function getUserShareBalance(
    connection: Connection,
    userPubkey: PublicKey,
    assetId: string
): Promise<number> {
    try {
        const [vaultPda] = deriveVaultPda(assetId);

        // Create a dummy wallet for read-only operations
        const dummyWallet = {
            publicKey: PublicKey.default,
            signTransaction: async () => { throw new Error("Not implemented"); },
            signAllTransactions: async () => { throw new Error("Not implemented"); },
        } as unknown as Wallet;

        const provider = new AnchorProvider(connection, dummyWallet, { commitment: "confirmed" });
        const program = getVaultProgram(provider);

        // Fetch vault to get actual share mint
        const vaultAccount = await (program.account as any).vault.fetch(vaultPda);
        const shareMint = vaultAccount.shareMint as PublicKey;

        const userShareAccount = await getAssociatedTokenAddress(
            shareMint,
            userPubkey
        );

        const accountInfo = await connection.getTokenAccountBalance(userShareAccount);
        return Number(accountInfo.value.amount);
    } catch {
        return 0;
    }
}

/**
 * Get user's underlying token balance
 */
export async function getUserUnderlyingBalance(
    connection: Connection,
    userPubkey: PublicKey,
    assetId: string
): Promise<number> {
    try {
        const config = Object.values(VAULTS).find(v => v.assetId === assetId);
        if (!config) return 0;

        const userTokenAccount = await getAssociatedTokenAddress(
            config.underlyingMint,
            userPubkey
        );

        const accountInfo = await connection.getTokenAccountBalance(userTokenAccount);
        return Number(accountInfo.value.amount);
    } catch {
        return 0;
    }
}

/**
 * Check if user has a pending withdrawal request
 */
export async function getUserWithdrawalRequest(
    connection: Connection,
    wallet: Wallet,
    assetId: string
): Promise<{ shares: number; requestEpoch: number; processed: boolean } | null> {
    try {
        const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
        const program = getVaultProgram(provider);

        const [vaultPda] = deriveVaultPda(assetId);

        // Fetch vault to get current epoch
        const vaultAccount = await (program.account as any).vault.fetch(vaultPda);
        const currentEpoch = Number(vaultAccount.epoch);

        // Try to find withdrawal request from previous epochs
        // Start from previous epoch and go back a few epochs
        for (let epoch = currentEpoch - 1; epoch >= Math.max(0, currentEpoch - 5); epoch--) {
            try {
                const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey, epoch);
                const withdrawalAccount = await (program.account as any).withdrawalRequest.fetch(withdrawalPda);

                return {
                    shares: Number(withdrawalAccount.shares),
                    requestEpoch: Number(withdrawalAccount.requestEpoch),
                    processed: withdrawalAccount.processed,
                };
            } catch {
                // Try next epoch
                continue;
            }
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Build a transaction to advance the epoch (Keeper only)
 */
export async function buildAdvanceEpochTransaction(
    connection: Connection,
    wallet: Wallet,
    assetId: string,
    premiumEarned: number = 0
): Promise<Transaction> {
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const program = getVaultProgram(provider);

    const [vaultPda] = deriveVaultPda(assetId);

    const tx = new Transaction();

    const advanceEpochIx = await program.methods
        .advanceEpoch(new BN(premiumEarned))
        .accounts({
            vault: vaultPda,
            authority: wallet.publicKey,
        })
        .instruction();

    tx.add(advanceEpochIx);

    return tx;
}
