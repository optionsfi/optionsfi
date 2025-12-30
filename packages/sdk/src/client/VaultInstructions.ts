/**
 * OptionsFi SDK - Vault Instructions
 * 
 * Transaction builders for interacting with the OptionsFi Vault program.
 * These utilities help you build Solana transactions without needing to
 * understand the full Anchor program interface.
 * 
 * @example
 * ```typescript
 * import { VaultInstructions, deriveVaultPda } from '@optionsfi/sdk';
 * import { Connection, PublicKey } from '@solana/web3.js';
 * 
 * const connection = new Connection('https://api.devnet.solana.com');
 * const vaultInstructions = new VaultInstructions(connection);
 * await vaultInstructions.initialize();
 * 
 * // Fetch vault data
 * const vault = await vaultInstructions.fetchVault('NVDAX');
 * console.log('Total assets:', vault.totalAssets);
 * 
 * // Build a transaction instruction
 * const ix = await vaultInstructions.recordNotionalExposure({
 *   vault: vaultPda,
 *   authority: walletPublicKey,
 *   notionalTokens: BigInt(1000 * 1e6),
 *   premium: BigInt(50 * 1e6),
 * });
 * ```
 */

import * as anchor from '@coral-xyz/anchor';
import {
    Connection,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import type {
    VaultData,
    RecordExposureParams,
    CollectPremiumParams,
    PaySettlementParams,
    AdvanceEpochParams,
} from '../types';
import { VAULT_PROGRAM_ID, deriveVaultPda } from '../constants';

// Token Program ID constant (avoid peer dependency on @solana/spl-token)
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// NOTE: The IDL will be bundled with the SDK or fetched from chain
// For now, we reference it as an external file that integrators provide
type VaultProgram = anchor.Program;

/**
 * Client for building vault program instructions
 */
export class VaultInstructions {
    private connection: Connection;
    private program: VaultProgram | null = null;
    private idl: any = null;

    /**
     * Create a new VaultInstructions client
     * 
     * @param connection - Solana connection
     * @param idl - Optional IDL (will use bundled IDL if not provided)
     */
    constructor(connection: Connection, idl?: any) {
        this.connection = connection;
        this.idl = idl;
    }

    /**
     * Initialize the Anchor program interface
     * 
     * @param wallet - Optional wallet for signing (not required for instruction building)
     */
    async initialize(wallet?: anchor.Wallet): Promise<void> {
        if (!this.idl) {
            throw new Error(
                'IDL not provided. Pass the vault IDL to the constructor or call setIDL().'
            );
        }

        const provider = new anchor.AnchorProvider(
            this.connection,
            wallet || ({} as any),
            { commitment: 'confirmed' }
        );

        // Create program with IDL and provider
        // Note: anchor.Program constructor signature varies by version
        this.program = new anchor.Program(this.idl, VAULT_PROGRAM_ID, provider);
    }

    /**
     * Set the program IDL
     * 
     * @param idl - Vault program IDL
     */
    setIDL(idl: any): void {
        this.idl = idl;
    }

    /**
     * Check if the client is initialized
     */
    get isInitialized(): boolean {
        return this.program !== null;
    }

    /**
     * Fetch vault account data
     * 
     * @param assetId - Asset identifier (e.g., "NVDAX")
     * @returns Vault data or null if not found
     */
    async fetchVault(assetId: string): Promise<VaultData | null> {
        if (!this.program) {
            throw new Error('Client not initialized. Call initialize() first.');
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
            if (error.message?.includes('Account does not exist')) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Build instruction to record notional exposure after RFQ execution
     * 
     * @param params - Exposure parameters
     * @returns TransactionInstruction
     */
    async recordNotionalExposure(
        params: RecordExposureParams
    ): Promise<TransactionInstruction> {
        if (!this.program) {
            throw new Error('Client not initialized. Call initialize() first.');
        }

        return await this.program.methods
            .recordNotionalExposure(
                new anchor.BN(params.notionalTokens.toString()),
                new anchor.BN(params.premium.toString())
            )
            .accounts({
                vault: params.vault,
                authority: params.authority,
            })
            .instruction();
    }

    /**
     * Build instruction to collect premium from market maker
     * 
     * @param params - Collection parameters
     * @returns TransactionInstruction
     */
    async collectPremium(
        params: CollectPremiumParams
    ): Promise<TransactionInstruction> {
        if (!this.program) {
            throw new Error('Client not initialized. Call initialize() first.');
        }

        // Fetch vault to get premium token account
        const vault = await (this.program.account as any).vault.fetch(params.vault);

        return await this.program.methods
            .collectPremium(new anchor.BN(params.amount.toString()))
            .accounts({
                vault: params.vault,
                vaultPremiumAccount: vault.premiumTokenAccount,
                payerTokenAccount: params.payerTokenAccount,
                payer: params.authority, // Payer is typically the authority
                authority: params.authority,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction();
    }

    /**
     * Build instruction to pay settlement to market maker
     * 
     * @param params - Settlement parameters
     * @returns TransactionInstruction
     */
    async paySettlement(
        params: PaySettlementParams
    ): Promise<TransactionInstruction> {
        if (!this.program) {
            throw new Error('Client not initialized. Call initialize() first.');
        }

        // Fetch vault to get premium token account
        const vault = await (this.program.account as any).vault.fetch(params.vault);

        return await this.program.methods
            .paySettlement(new anchor.BN(params.amount.toString()))
            .accounts({
                vault: params.vault,
                vaultPremiumAccount: vault.premiumTokenAccount,
                recipientTokenAccount: params.recipientTokenAccount,
                recipient: params.recipient,
                authority: params.authority,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction();
    }

    /**
     * Build instruction to advance epoch
     * 
     * @param params - Advance epoch parameters
     * @returns TransactionInstruction
     */
    async advanceEpoch(
        params: AdvanceEpochParams
    ): Promise<TransactionInstruction> {
        if (!this.program) {
            throw new Error('Client not initialized. Call initialize() first.');
        }

        return await this.program.methods
            .advanceEpoch(new anchor.BN(params.premiumEarned.toString()))
            .accounts({
                vault: params.vault,
                authority: params.authority,
            })
            .instruction();
    }

    /**
     * Calculate share price from vault data
     * 
     * @param vault - Vault data
     * @param decimals - Token decimals (default: 6)
     * @returns Share price as a number
     */
    static calculateSharePrice(vault: VaultData, decimals: number = 6): number {
        if (vault.totalShares === 0n) {
            return 1.0;
        }

        const totalAssets = Number(vault.totalAssets) / 10 ** decimals;
        const totalShares = Number(vault.totalShares) / 10 ** decimals;
        const virtualOffset = Number(vault.virtualOffset) / 10 ** decimals;

        return (totalAssets + virtualOffset) / totalShares;
    }

    /**
     * Calculate utilization percentage from vault data
     * 
     * @param vault - Vault data
     * @returns Utilization as decimal (0-1)
     */
    static calculateUtilization(vault: VaultData): number {
        if (vault.totalAssets === 0n) {
            return 0;
        }

        return (
            Number(vault.epochNotionalExposed) / Number(vault.totalAssets)
        );
    }

    /**
     * Check if vault can accept more exposure
     * 
     * @param vault - Vault data
     * @param additionalNotional - Additional notional to expose
     * @returns Whether the vault can accept the exposure
     */
    static canAcceptExposure(
        vault: VaultData,
        additionalNotional: bigint
    ): boolean {
        const maxExposure =
            (vault.totalAssets * BigInt(vault.utilizationCapBps)) / 10000n;
        const newExposure = vault.epochNotionalExposed + additionalNotional;
        return newExposure <= maxExposure;
    }

    /**
     * Calculate remaining capacity for option writing
     * 
     * @param vault - Vault data
     * @returns Remaining notional capacity
     */
    static getRemainingCapacity(vault: VaultData): bigint {
        const maxExposure =
            (vault.totalAssets * BigInt(vault.utilizationCapBps)) / 10000n;
        const remaining = maxExposure - vault.epochNotionalExposed;
        return remaining > 0n ? remaining : 0n;
    }
}
