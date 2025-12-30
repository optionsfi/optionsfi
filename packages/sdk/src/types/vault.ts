/**
 * OptionsFi SDK - Vault Types
 * 
 * Types for interacting with OptionsFi vault accounts.
 */

import type { PublicKey } from '@solana/web3.js';

/**
 * Vault account data (on-chain state)
 */
export interface VaultData {
    /** Vault authority (admin) */
    authority: PublicKey;

    /** Asset identifier (e.g., "NVDAX") */
    assetId: string;

    /** Underlying token mint (e.g., NVDAx) */
    underlyingMint: PublicKey;

    /** Share token mint (e.g., vNVDAx) */
    shareMint: PublicKey;

    /** Vault's token account for underlying */
    vaultTokenAccount: PublicKey;

    /** Premium token mint (typically USDC) */
    premiumMint: PublicKey;

    /** Vault's token account for premium */
    premiumTokenAccount: PublicKey;

    /** Escrow account for pending share burns */
    shareEscrow: PublicKey;

    /** Total underlying assets in vault */
    totalAssets: bigint;

    /** Total shares outstanding */
    totalShares: bigint;

    /** Virtual offset for share price calculation */
    virtualOffset: bigint;

    /** Current epoch number */
    epoch: bigint;

    /** Maximum percentage of assets that can be used (basis points) */
    utilizationCapBps: number;

    /** Minimum epoch duration in seconds */
    minEpochDuration: bigint;

    /** Timestamp of last epoch roll */
    lastRollTimestamp: bigint;

    /** Pending withdrawal amount in shares */
    pendingWithdrawals: bigint;

    /** Notional exposure for current epoch */
    epochNotionalExposed: bigint;

    /** Premium earned in current epoch */
    epochPremiumEarned: bigint;

    /** Premium per token for current epoch (basis points) */
    epochPremiumPerTokenBps: number;

    /** Whether the vault is paused */
    isPaused: boolean;

    /** PDA bump seed */
    bump: number;
}

/**
 * Parameters for recording notional exposure
 */
export interface RecordExposureParams {
    /** Vault public key */
    vault: PublicKey;

    /** Vault authority (signer) */
    authority: PublicKey;

    /** Notional amount in underlying tokens */
    notionalTokens: bigint;

    /** Premium amount in quote tokens (USDC) */
    premium: bigint;
}

/**
 * Parameters for collecting premium
 */
export interface CollectPremiumParams {
    /** Vault public key */
    vault: PublicKey;

    /** Authority (signer) */
    authority: PublicKey;

    /** Payer's token account for premium */
    payerTokenAccount: PublicKey;

    /** Amount to collect */
    amount: bigint;
}

/**
 * Parameters for paying settlement
 */
export interface PaySettlementParams {
    /** Vault public key */
    vault: PublicKey;

    /** Authority (signer) */
    authority: PublicKey;

    /** Recipient's token account */
    recipientTokenAccount: PublicKey;

    /** Recipient public key */
    recipient: PublicKey;

    /** Settlement amount */
    amount: bigint;
}

/**
 * Parameters for advancing epoch
 */
export interface AdvanceEpochParams {
    /** Vault public key */
    vault: PublicKey;

    /** Authority (signer) */
    authority: PublicKey;

    /** Premium earned this epoch (for share price appreciation) */
    premiumEarned: bigint;
}

/**
 * Withdrawal request account data
 */
export interface WithdrawalRequest {
    /** User who requested withdrawal */
    user: PublicKey;

    /** Associated vault */
    vault: PublicKey;

    /** Epoch when withdrawal was requested */
    epoch: bigint;

    /** Number of shares to withdraw */
    shares: bigint;

    /** Whether the request has been processed */
    processed: boolean;
}
