/**
 * OptionsFi SDK - Option Pricing Utilities
 * 
 * Black-Scholes pricing and volatility calculations extracted from
 * the keeper service. Use these utilities to:
 * - Calculate fair values for options
 * - Validate market maker quotes
 * - Suggest strike prices based on delta
 * 
 * @example
 * ```typescript
 * import { OptionPricing } from '@optionsfi/sdk';
 * 
 * // Calculate call option fair value
 * const price = OptionPricing.blackScholes({
 *   spot: 145.50,
 *   strike: 150,
 *   timeToExpiry: 7 / 365, // 1 week
 *   riskFreeRate: 0.05,
 *   volatility: 0.45,
 * });
 * 
 * console.log('Call price:', price.call);
 * console.log('Put price:', price.put);
 * console.log('Call delta:', price.delta.call);
 * ```
 */

import type { BlackScholesParams, OptionPrices, PremiumParams, QuoteValidation } from '../types';
import { DEFAULT_PRICING_PARAMS } from '../constants';

/**
 * Option pricing utilities using Black-Scholes model
 */
export class OptionPricing {
    /**
     * Calculate option prices using Black-Scholes formula
     * 
     * @param params - Pricing parameters
     * @returns Call and put prices with deltas
     */
    static blackScholes(params: BlackScholesParams): OptionPrices {
        const { spot, strike, timeToExpiry, riskFreeRate, volatility } = params;

        // Handle edge cases
        if (timeToExpiry <= 0) {
            const intrinsicCall = Math.max(0, spot - strike);
            const intrinsicPut = Math.max(0, strike - spot);
            return {
                call: intrinsicCall,
                put: intrinsicPut,
                delta: {
                    call: intrinsicCall > 0 ? 1 : 0,
                    put: intrinsicPut > 0 ? -1 : 0,
                },
            };
        }

        if (volatility <= 0) {
            throw new Error('Volatility must be positive');
        }

        const sqrtT = Math.sqrt(timeToExpiry);

        // d1 and d2
        const d1 =
            (Math.log(spot / strike) +
                (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) /
            (volatility * sqrtT);
        const d2 = d1 - volatility * sqrtT;

        // Call and Put prices
        const callPrice =
            spot * this.normalCDF(d1) -
            strike * Math.exp(-riskFreeRate * timeToExpiry) * this.normalCDF(d2);
        const putPrice =
            strike * Math.exp(-riskFreeRate * timeToExpiry) * this.normalCDF(-d2) -
            spot * this.normalCDF(-d1);

        // Delta
        const callDelta = this.normalCDF(d1);
        const putDelta = callDelta - 1;

        return {
            call: Math.max(0, callPrice),
            put: Math.max(0, putPrice),
            delta: { call: callDelta, put: putDelta },
        };
    }

    /**
     * Calculate covered call premium
     * 
     * @param params - Premium calculation parameters
     * @returns Premium in same units as spot price
     */
    static calculateCoveredCallPremium(params: PremiumParams): number {
        const {
            spot,
            strikePercent,
            daysToExpiry,
            volatility,
            riskFreeRate = DEFAULT_PRICING_PARAMS.riskFreeRate,
        } = params;

        const strike = spot * strikePercent;
        const timeToExpiry = daysToExpiry / 365;

        const prices = this.blackScholes({
            spot,
            strike,
            timeToExpiry,
            riskFreeRate,
            volatility,
        });

        return prices.call;
    }

    /**
     * Calculate premium as basis points of notional
     * 
     * @param premium - Premium amount
     * @param spot - Spot price
     * @returns Premium in basis points
     */
    static premiumToBps(premium: number, spot: number): number {
        return Math.round((premium / spot) * 10000);
    }

    /**
     * Convert basis points to premium
     * 
     * @param bps - Basis points
     * @param spot - Spot price
     * @returns Premium amount
     */
    static bpsToPremium(bps: number, spot: number): number {
        return (bps / 10000) * spot;
    }

    /**
     * Calculate time to expiry in years
     * 
     * @param expiryTimestamp - Expiry Unix timestamp (seconds)
     * @returns Time in years
     */
    static timeToExpiry(expiryTimestamp: number): number {
        const now = Date.now() / 1000;
        const secondsToExpiry = expiryTimestamp - now;
        return secondsToExpiry / (365.25 * 24 * 60 * 60);
    }

    /**
     * Suggest a strike price based on delta target
     * 
     * @param spotPrice - Current spot price
     * @param deltaBps - Delta in basis points (e.g., 1000 = 10% OTM)
     * @param optionType - 'call' or 'put'
     * @returns Suggested strike price
     */
    static suggestStrike(
        spotPrice: number,
        deltaBps: number,
        optionType: 'call' | 'put' = 'call'
    ): number {
        // For calls: strike = spot * (1 + delta/10000) for OTM
        // For puts: strike = spot * (1 - delta/10000) for OTM
        const multiplier = optionType === 'call' ? 1 : -1;
        return spotPrice * (1 + (multiplier * deltaBps) / 10000);
    }

    /**
     * Validate a quote against fair value
     * 
     * @param quotePremium - Premium from quote
     * @param fairValue - Calculated fair value
     * @param maxDeviationBps - Maximum acceptable deviation in bps (default: 500)
     * @returns Validation result
     */
    static validateQuote(
        quotePremium: number,
        fairValue: number,
        maxDeviationBps: number = DEFAULT_PRICING_PARAMS.maxQuoteDeviationBps
    ): QuoteValidation {
        if (fairValue <= 0) {
            return {
                isValid: false,
                reason: 'Fair value must be positive',
                fairValue,
            };
        }

        const deviation = Math.abs(quotePremium - fairValue) / fairValue;
        const deviationBps = Math.round(deviation * 10000);
        const maxDeviation = maxDeviationBps / 10000;

        if (deviation > maxDeviation) {
            return {
                isValid: false,
                reason: `Quote deviates ${deviationBps} bps from fair value (max: ${maxDeviationBps} bps)`,
                fairValue,
                deviationBps,
            };
        }

        return {
            isValid: true,
            fairValue,
            deviationBps,
        };
    }

    /**
     * Calculate historical volatility from price data
     * 
     * @param prices - Array of closing prices (oldest first)
     * @param tradingDaysPerYear - Trading days for annualization (default: 252)
     * @returns Annualized volatility
     */
    static calculateHistoricalVolatility(
        prices: number[],
        tradingDaysPerYear: number = DEFAULT_PRICING_PARAMS.tradingDaysPerYear
    ): number {
        if (prices.length < 2) {
            throw new Error('Need at least 2 prices to calculate volatility');
        }

        // Calculate log returns
        const logReturns: number[] = [];
        for (let i = 1; i < prices.length; i++) {
            const logReturn = Math.log(prices[i] / prices[i - 1]);
            logReturns.push(logReturn);
        }

        // Calculate mean
        const mean = logReturns.reduce((sum, r) => sum + r, 0) / logReturns.length;

        // Calculate variance
        const variance =
            logReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
            (logReturns.length - 1);

        // Standard deviation of daily returns
        const dailyStdDev = Math.sqrt(variance);

        // Annualize
        return dailyStdDev * Math.sqrt(tradingDaysPerYear);
    }

    /**
     * Calculate implied volatility from option price using Newton-Raphson
     * 
     * @param optionPrice - Market price of option
     * @param spot - Spot price
     * @param strike - Strike price
     * @param timeToExpiry - Time to expiry in years
     * @param riskFreeRate - Risk-free rate
     * @param optionType - 'call' or 'put'
     * @param maxIterations - Maximum iterations (default: 100)
     * @returns Implied volatility
     */
    static calculateImpliedVolatility(
        optionPrice: number,
        spot: number,
        strike: number,
        timeToExpiry: number,
        riskFreeRate: number,
        optionType: 'call' | 'put',
        maxIterations: number = 100
    ): number {
        // Initial guess using Brenner-Subrahmanyam approximation
        let sigma = Math.sqrt((2 * Math.PI) / timeToExpiry) * (optionPrice / spot);

        const tolerance = 1e-6;

        for (let i = 0; i < maxIterations; i++) {
            const prices = this.blackScholes({
                spot,
                strike,
                timeToExpiry,
                riskFreeRate,
                volatility: sigma,
            });

            const price = optionType === 'call' ? prices.call : prices.put;
            const diff = price - optionPrice;

            if (Math.abs(diff) < tolerance) {
                return sigma;
            }

            // Calculate vega for Newton-Raphson
            const sqrtT = Math.sqrt(timeToExpiry);
            const d1 =
                (Math.log(spot / strike) +
                    (riskFreeRate + 0.5 * sigma * sigma) * timeToExpiry) /
                (sigma * sqrtT);
            const vega = spot * sqrtT * this.normalPDF(d1);

            if (vega < 1e-10) {
                throw new Error('Implied volatility calculation failed: vega too small');
            }

            sigma = sigma - diff / vega;

            // Clamp sigma to reasonable bounds
            sigma = Math.max(0.01, Math.min(5.0, sigma));
        }

        throw new Error('Implied volatility calculation did not converge');
    }

    // ============================================================================
    // Private Helper Functions
    // ============================================================================

    /**
     * Standard normal CDF using Abramowitz & Stegun approximation
     */
    private static normalCDF(x: number): number {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2);

        const t = 1.0 / (1.0 + p * x);
        const y =
            1.0 -
            ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return 0.5 * (1.0 + sign * y);
    }

    /**
     * Standard normal PDF
     */
    private static normalPDF(x: number): number {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }
}
