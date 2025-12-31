/**
 * On-chain volatility tracker for calculating realized volatility
 * from historical price data.
 */

import { PriceDatabase } from './database';
import { PricePoint, VolatilityResult, OnChainVolatilityParams } from './types';

export class OnChainVolatilityTracker {
    constructor(private db: PriceDatabase) {}

    /**
     * Calculate realized volatility from historical price data.
     */
    async getVolatility(params: OnChainVolatilityParams): Promise<VolatilityResult> {
        const { assetId, lookbackDays } = params;

        // Fetch historical prices
        const endTimestamp = Math.floor(Date.now() / 1000);
        const startTimestamp = endTimestamp - (lookbackDays * 24 * 60 * 60);

        const prices = await this.db.getPriceSnapshots(
            assetId,
            startTimestamp,
            endTimestamp
        );

        if (prices.length < 2) {
            throw new Error(`Insufficient data: only ${prices.length} price points available`);
        }

        // Calculate log returns
        const returns = this.calculateLogReturns(prices);

        // Calculate realized volatility
        const volatility = this.calculateRealizedVolatility(returns);

        // Annualize the volatility
        const annualizedVol = this.annualizeVolatility(volatility, lookbackDays);

        // Apply 24/7 trading adjustment
        const adjustedVol = this.adjust24x7Trading(annualizedVol);

        // Calculate confidence score
        const confidence = this.calculateConfidence(prices, returns);

        return {
            volatility: adjustedVol,
            dataPoints: prices.length,
            startTimestamp: prices[0].timestamp,
            endTimestamp: prices[prices.length - 1].timestamp,
            source: 'pyth', // Will be determined by data source
            confidence
        };
    }

    /**
     * Calculate logarithmic returns from price series.
     * 
     * Log return = ln(P_t / P_{t-1})
     */
    private calculateLogReturns(prices: PricePoint[]): number[] {
        const returns: number[] = [];

        for (let i = 1; i < prices.length; i++) {
            const prevPrice = prices[i - 1].price;
            const currPrice = prices[i].price;

            if (prevPrice <= 0 || currPrice <= 0) {
                console.warn('Invalid price encountered, skipping:', { prevPrice, currPrice });
                continue;
            }

            const logReturn = Math.log(currPrice / prevPrice);
            returns.push(logReturn);
        }

        return returns;
    }

    /**
     * Calculate realized volatility (standard deviation of returns).
     */
    private calculateRealizedVolatility(returns: number[]): number {
        if (returns.length === 0) {
            throw new Error('No returns to calculate volatility from');
        }

        // Calculate mean return
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;

        // Calculate variance
        const variance = returns.reduce((sum, r) => {
            const diff = r - mean;
            return sum + (diff * diff);
        }, 0) / (returns.length - 1); // Use n-1 for sample variance

        // Standard deviation (volatility)
        return Math.sqrt(variance);
    }

    /**
     * Annualize volatility to get annualized vol percentage.
     * 
     * For daily data: annualized_vol = daily_vol * sqrt(252)
     * For general case: annualized_vol = vol * sqrt(periods_per_year)
     */
    private annualizeVolatility(volatility: number, lookbackDays: number): number {
        // Assume we have daily data points
        const tradingDaysPerYear = 252; // Standard for TradFi
        
        // However, for on-chain 24/7 assets, we use 365
        const periodsPerYear = 365;
        
        // Annualization factor
        const annualizationFactor = Math.sqrt(periodsPerYear);
        
        return volatility * annualizationFactor;
    }

    /**
     * Adjust volatility for 24/7 trading.
     * 
     * On-chain assets trade continuously, including weekends and holidays.
     * This typically adds 5-10% to volatility compared to TradFi assets
     * due to:
     * - Lower weekend liquidity
     * - More volatile price action outside market hours
     * - Different market participant mix
     */
    private adjust24x7Trading(volatility: number): number {
        // Add 7.5% premium for 24/7 trading
        // This is based on empirical observations of crypto vs TradFi vol
        const tradingPremium = 1.075;
        
        return volatility * tradingPremium;
    }

    /**
     * Calculate confidence score based on data quality.
     * 
     * Factors:
     * - Number of data points (more = better)
     * - Recency of data (fresher = better)
     * - Data source confidence scores
     * - Consistency of returns (less erratic = better)
     */
    private calculateConfidence(prices: PricePoint[], returns: number[]): number {
        // 1. Data point score (0-1)
        // Need at least 30 points for good confidence
        const minPoints = 30;
        const idealPoints = 90;
        const dataPointScore = Math.min(
            (prices.length - minPoints) / (idealPoints - minPoints),
            1
        );

        // 2. Recency score (0-1)
        // Data should be recent (within last 24 hours)
        const latestTimestamp = prices[prices.length - 1].timestamp;
        const now = Math.floor(Date.now() / 1000);
        const ageInHours = (now - latestTimestamp) / 3600;
        const recencyScore = Math.max(0, 1 - (ageInHours / 24));

        // 3. Source confidence average
        const avgSourceConfidence = prices.reduce((sum, p) => {
            return sum + (p.confidence || 1.0);
        }, 0) / prices.length;

        // 4. Return consistency score
        // Lower kurtosis = more consistent = better
        const kurtosis = this.calculateKurtosis(returns);
        const consistencyScore = Math.max(0, 1 - Math.abs(kurtosis) / 10);

        // Weighted average
        const weights = {
            dataPoints: 0.3,
            recency: 0.3,
            sourceConfidence: 0.2,
            consistency: 0.2
        };

        return (
            dataPointScore * weights.dataPoints +
            recencyScore * weights.recency +
            avgSourceConfidence * weights.sourceConfidence +
            consistencyScore * weights.consistency
        );
    }

    /**
     * Calculate kurtosis (measure of tail heaviness).
     */
    private calculateKurtosis(returns: number[]): number {
        if (returns.length < 4) return 0;

        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => {
            return sum + Math.pow(r - mean, 2);
        }, 0) / returns.length;

        const stdDev = Math.sqrt(variance);
        if (stdDev === 0) return 0;

        const fourthMoment = returns.reduce((sum, r) => {
            return sum + Math.pow((r - mean) / stdDev, 4);
        }, 0) / returns.length;

        // Excess kurtosis (subtract 3 for normal distribution)
        return fourthMoment - 3;
    }

    /**
     * Get historical volatility over multiple time periods.
     * Useful for understanding volatility term structure.
     */
    async getVolatilityTermStructure(
        assetId: string,
        mintAddress: string,
        periods: number[] = [7, 14, 30, 60, 90]
    ): Promise<Array<{ days: number; volatility: number; confidence: number }>> {
        const results = [];

        for (const days of periods) {
            try {
                const vol = await this.getVolatility({
                    assetId,
                    mintAddress,
                    lookbackDays: days
                });

                results.push({
                    days,
                    volatility: vol.volatility,
                    confidence: vol.confidence
                });
            } catch (error) {
                console.warn(`Failed to calculate ${days}-day volatility:`, error);
                results.push({
                    days,
                    volatility: 0,
                    confidence: 0
                });
            }
        }

        return results;
    }
}
