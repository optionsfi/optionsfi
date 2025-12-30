/**
 * OptionsFi SDK - Program Addresses
 */

import { PublicKey } from '@solana/web3.js';

/**
 * OptionsFi Vault Program ID (mainnet/devnet)
 */
export const VAULT_PROGRAM_ID = new PublicKey(
    'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94'
);

/**
 * Mock USDC mint (devnet)
 */
export const MOCK_USDC_MINT = new PublicKey(
    'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
);

/**
 * Pyth Price Feed IDs (Hermes API)
 */
export const PYTH_PRICE_FEEDS = {
    /** NVDA/USD price feed */
    NVDA: '0x4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f',
    /** SOL/USD price feed */
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    /** BTC/USD price feed */
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    /** ETH/USD price feed */
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
} as const;

/**
 * Pyth Hermes API URL
 */
export const PYTH_HERMES_URL = 'https://hermes.pyth.network';

/**
 * Derive vault PDA from asset ID
 */
export function deriveVaultPda(assetId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), Buffer.from(assetId)],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive withdrawal request PDA
 */
export function deriveWithdrawalPda(
    vault: PublicKey,
    user: PublicKey,
    epoch: bigint
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from('withdrawal'),
            vault.toBuffer(),
            user.toBuffer(),
            Buffer.from(epoch.toString()),
        ],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive share escrow PDA
 */
export function deriveShareEscrowPda(vault: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('share_escrow'), vault.toBuffer()],
        VAULT_PROGRAM_ID
    );
}

/**
 * Derive whitelist PDA
 */
export function deriveWhitelistPda(vault: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('whitelist'), vault.toBuffer()],
        VAULT_PROGRAM_ID
    );
}
