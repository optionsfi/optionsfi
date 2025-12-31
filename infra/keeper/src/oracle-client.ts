/**
 * Oracle client for keeper service.
 * Integrates hybrid volatility and pricing oracle.
 */

import { 
    PriceDatabase, 
    HybridVolatilityEngine, 
    PricingOracle,
    PricingOracleResult
} from '@optionsfi/oracle';

export interface OracleConfig {
    supabaseUrl: string;
    supabaseKey: string;
    solanaRpcUrl: string;
}

export interface AssetConfig {
    assetId: string;
    tradFiTicker: string;
    onChainMint: string;
}

export class KeeperOracleClient {
    private db: PriceDatabase;
    private hybridEngine: HybridVolatilityEngine;
    private pricingOracle: PricingOracle;

    constructor(config: OracleConfig) {
        this.db = new PriceDatabase(config);
        this.hybridEngine = new HybridVolatilityEngine(this.db);
        this.pricingOracle = new PricingOracle(this.hybridEngine);
    }

    /**
     * Get option pricing with risk-adjusted premiums.
     */
    async getOptionPricing(
        assetConfig: AssetConfig,
        spot: number,
        strikePercent: number,
        daysToExpiry: number
    ): Promise<PricingOracleResult> {
        const strike = spot * strikePercent;

        return await this.pricingOracle.calculatePricing({
            assetId: assetConfig.assetId,
            spot,
            strike,
            daysToExpiry,
            optionType: 'call'
        });
    }

    /**
     * Get hybrid volatility for monitoring/logging.
     */
    async getVolatility(
        assetConfig: AssetConfig,
        lookbackDays: number = 30
    ) {
        return await this.hybridEngine.calculateHybridVolatility({
            assetId: assetConfig.assetId,
            tradFiTicker: assetConfig.tradFiTicker,
            onChainMint: assetConfig.onChainMint,
            lookbackDays
        });
    }

    /**
     * Check if divergence requires manual review.
     */
    isDivergenceHigh(divergence: number): boolean {
        return divergence > 0.25; // >25% difference
    }

    /**
     * Get latest price from database (for verification).
     */
    async getLatestPrice(assetId: string): Promise<number | null> {
        const latestPrice = await this.db.getLatestPrice(assetId);
        return latestPrice?.price || null;
    }
}
