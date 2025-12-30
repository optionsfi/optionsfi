/**
 * OptionsFi SDK - Default Configuration
 */

import type { RFQConfig } from '../types';

/**
 * Default configuration for devnet
 */
export const DEVNET_CONFIG: RFQConfig = {
    rpcUrl: 'https://api.devnet.solana.com',
    rfqRouterUrl: 'wss://rfq.optionsfi.xyz',
    programId: 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94',
    network: 'devnet',
    rfqTimeoutMs: 30000,
};

/**
 * Default configuration for mainnet
 */
export const MAINNET_CONFIG: RFQConfig = {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    rfqRouterUrl: 'wss://rfq.optionsfi.xyz',
    programId: 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94',
    network: 'mainnet-beta',
    rfqTimeoutMs: 30000,
};

/**
 * Default option pricing parameters
 */
export const DEFAULT_PRICING_PARAMS = {
    /** Default risk-free rate (5%) */
    riskFreeRate: 0.05,

    /** Default volatility lookback period in days */
    volatilityLookbackDays: 30,

    /** Maximum acceptable deviation from fair value (5%) */
    maxQuoteDeviationBps: 500,

    /** Trading days per year for volatility annualization */
    tradingDaysPerYear: 252,
};

/**
 * RFQ timing defaults
 */
export const RFQ_DEFAULTS = {
    /** Default RFQ timeout in milliseconds */
    timeoutMs: 30000,

    /** Minimum quote collection time */
    minQuoteTimeMs: 5000,

    /** Quote expiry buffer (how long before expiry to stop accepting) */
    quoteExpiryBufferMs: 2000,
};

/**
 * Token decimals for common tokens
 */
export const TOKEN_DECIMALS = {
    USDC: 6,
    SOL: 9,
    NVDAX: 6,
} as const;
