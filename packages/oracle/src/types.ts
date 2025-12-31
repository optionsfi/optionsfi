/**
 * Core type definitions for the oracle package.
 */

/**
 * Price data point with timestamp and source information.
 */
export interface PricePoint {
    price: number;
    timestamp: number;
    source: 'pyth' | 'dex' | 'yahoo';
    confidence?: number;
}

/**
 * Volatility calculation result.
 */
export interface VolatilityResult {
    volatility: number;
    dataPoints: number;
    startTimestamp: number;
    endTimestamp: number;
    source: 'pyth' | 'dex' | 'yahoo' | 'hybrid';
    confidence: number;
}

/**
 * Parameters for fetching on-chain volatility.
 */
export interface OnChainVolatilityParams {
    assetId: string;
    mintAddress: string;
    pythFeedId?: string;
    lookbackDays: number;
}

/**
 * Parameters for hybrid volatility calculation.
 */
export interface HybridVolatilityParams {
    assetId: string;
    tradFiTicker: string;
    onChainMint: string;
    lookbackDays: number;
}

/**
 * Result from hybrid volatility calculation.
 */
export interface HybridVolatilityResult {
    finalVolatility: number;
    tradFiVol: number;
    onChainVol: number;
    weight: number;
    divergence: number;
    recommendation: 'safe' | 'caution' | 'warning';
}

/**
 * Parameters for pricing oracle calculations.
 */
export interface PricingOracleParams {
    assetId: string;
    spot: number;
    strike: number;
    daysToExpiry: number;
    optionType: 'call' | 'put';
}

/**
 * Result from pricing oracle.
 */
export interface PricingOracleResult {
    fairValue: number;
    minPremium: number;
    maxPremium: number;
    volatilityUsed: number;
    riskAdjustment: number;
    metadata: {
        tradFiVol: number;
        onChainVol: number;
        divergence: number;
        recommendation: string;
    };
}

/**
 * Configuration for oracle services.
 */
export interface OracleConfig {
    supabaseUrl: string;
    supabaseKey: string;
    solanaRpcUrl: string;
    pythHermesUrl?: string;
}
