/**
 * Pricing oracle that provides risk-adjusted option pricing
 * using hybrid volatility data.
 */

import { HybridVolatilityEngine } from './hybrid-volatility';
import { PricingOracleParams, PricingOracleResult } from './types';

export class PricingOracle {
    constructor(private hybridEngine: HybridVolatilityEngine) {}

    /**
     * Calculate risk-adjusted option pricing.
     */
    async calculatePricing(params: PricingOracleParams): Promise<PricingOracleResult> {
        const { assetId, spot, strike, daysToExpiry, optionType } = params;

        // Get hybrid volatility (need to know the asset config)
        // For now, hardcode NVDAX mapping - will be dynamic later
        const tradFiTicker = 'NVDA';
        const onChainMint = 'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn';

        const volResult = await this.hybridEngine.calculateHybridVolatility({
            assetId,
            tradFiTicker,
            onChainMint,
            lookbackDays: 30
        });

        // Calculate Black-Scholes fair value
        const fairValue = this.blackScholes({
            spot,
            strike,
            timeToExpiry: daysToExpiry / 365,
            volatility: volResult.finalVolatility,
            riskFreeRate: 0.05, // 5% risk-free rate
            optionType
        });

        // Apply risk adjustment based on divergence
        const riskAdjustment = this.calculateRiskAdjustment(volResult);

        // Calculate bounds
        const minPremium = fairValue * (1 + riskAdjustment);
        const maxPremium = fairValue * (1 + riskAdjustment + 0.30); // +30% max markup

        return {
            fairValue,
            minPremium,
            maxPremium,
            volatilityUsed: volResult.finalVolatility,
            riskAdjustment,
            metadata: {
                tradFiVol: volResult.tradFiVol,
                onChainVol: volResult.onChainVol,
                divergence: volResult.divergence,
                recommendation: volResult.recommendation
            }
        };
    }

    /**
     * Calculate risk adjustment factor based on volatility result.
     */
    private calculateRiskAdjustment(volResult: {
        divergence: number;
        recommendation: 'safe' | 'caution' | 'warning';
    }): number {
        // Higher divergence = higher risk buffer
        if (volResult.recommendation === 'warning') return 0.15; // +15%
        if (volResult.recommendation === 'caution') return 0.08; // +8%
        return 0.03; // +3% baseline
    }

    /**
     * Black-Scholes option pricing formula.
     */
    private blackScholes(params: {
        spot: number;
        strike: number;
        timeToExpiry: number;
        volatility: number;
        riskFreeRate: number;
        optionType: 'call' | 'put';
    }): number {
        const { spot, strike, timeToExpiry, volatility, riskFreeRate, optionType } = params;

        if (timeToExpiry <= 0) return Math.max(0, spot - strike);
        if (volatility <= 0) return 0;

        const d1 = (Math.log(spot / strike) + (riskFreeRate + 0.5 * volatility ** 2) * timeToExpiry) /
                   (volatility * Math.sqrt(timeToExpiry));
        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        const nd1 = this.normalCDF(d1);
        const nd2 = this.normalCDF(d2);
        const nMinusD1 = this.normalCDF(-d1);
        const nMinusD2 = this.normalCDF(-d2);

        if (optionType === 'call') {
            return spot * nd1 - strike * Math.exp(-riskFreeRate * timeToExpiry) * nd2;
        } else {
            return strike * Math.exp(-riskFreeRate * timeToExpiry) * nMinusD2 - spot * nMinusD1;
        }
    }

    /**
     * Cumulative distribution function for standard normal distribution.
     */
    private normalCDF(x: number): number {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        
        return x > 0 ? 1 - prob : prob;
    }

    /**
     * Calculate Greeks for option.
     */
    calculateGreeks(params: {
        spot: number;
        strike: number;
        timeToExpiry: number;
        volatility: number;
        riskFreeRate: number;
        optionType: 'call' | 'put';
    }): {
        delta: number;
        gamma: number;
        theta: number;
        vega: number;
        rho: number;
    } {
        const { spot, strike, timeToExpiry, volatility, riskFreeRate } = params;

        if (timeToExpiry <= 0 || volatility <= 0) {
            return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
        }

        const d1 = (Math.log(spot / strike) + (riskFreeRate + 0.5 * volatility ** 2) * timeToExpiry) /
                   (volatility * Math.sqrt(timeToExpiry));
        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        const nd1 = this.normalCDF(d1);
        const nd2 = this.normalCDF(d2);
        const npd1 = this.normalPDF(d1);

        const isCall = params.optionType === 'call';

        const delta = isCall ? nd1 : nd1 - 1;
        const gamma = npd1 / (spot * volatility * Math.sqrt(timeToExpiry));
        const theta = isCall
            ? (-spot * npd1 * volatility / (2 * Math.sqrt(timeToExpiry)) - 
               riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiry) * nd2) / 365
            : (-spot * npd1 * volatility / (2 * Math.sqrt(timeToExpiry)) + 
               riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiry) * this.normalCDF(-d2)) / 365;
        const vega = spot * npd1 * Math.sqrt(timeToExpiry) / 100;
        const rho = isCall
            ? strike * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * nd2 / 100
            : -strike * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * this.normalCDF(-d2) / 100;

        return { delta, gamma, theta, vega, rho };
    }

    /**
     * Probability density function for standard normal distribution.
     */
    private normalPDF(x: number): number {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }
}
