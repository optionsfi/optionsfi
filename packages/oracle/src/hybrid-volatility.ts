/**
 * Hybrid volatility engine that combines on-chain and TradFi data
 * with intelligent weighting.
 */

import { OnChainVolatilityTracker } from './volatility-tracker';
import { YahooFinanceClient } from './yahoo-client';
import { PriceDatabase } from './database';
import { HybridVolatilityParams, HybridVolatilityResult, PricePoint } from './types';

export class HybridVolatilityEngine {
    private onChainTracker: OnChainVolatilityTracker;
    private yahooClient: YahooFinanceClient;

    constructor(db: PriceDatabase) {
        this.onChainTracker = new OnChainVolatilityTracker(db);
        this.yahooClient = new YahooFinanceClient();
    }

    /**
     * Calculate hybrid volatility combining on-chain and TradFi data.
     */
    async calculateHybridVolatility(
        params: HybridVolatilityParams
    ): Promise<HybridVolatilityResult> {
        const { assetId, tradFiTicker, onChainMint, lookbackDays } = params;

        // Fetch both volatilities in parallel
        const [onChainResult, tradFiVol] = await Promise.all([
            this.getOnChainVolatility(assetId, onChainMint, lookbackDays),
            this.getTradFiVolatility(tradFiTicker, lookbackDays)
        ]);

        // Calculate weight for on-chain data (0 to 0.7)
        const weight = this.calculateWeight(onChainResult.confidence, onChainResult.dataPoints);

        // Weighted average
        const finalVolatility = (onChainResult.volatility * weight) + (tradFiVol * (1 - weight));

        // Calculate divergence
        const divergence = Math.abs(onChainResult.volatility - tradFiVol) / tradFiVol;

        // Risk assessment
        const recommendation = this.assessRisk(divergence);

        return {
            finalVolatility,
            tradFiVol,
            onChainVol: onChainResult.volatility,
            weight,
            divergence,
            recommendation
        };
    }

    /**
     * Get on-chain volatility.
     */
    private async getOnChainVolatility(
        assetId: string,
        mintAddress: string,
        lookbackDays: number
    ): Promise<{ volatility: number; confidence: number; dataPoints: number }> {
        try {
            const result = await this.onChainTracker.getVolatility({
                assetId,
                mintAddress,
                lookbackDays
            });

            return {
                volatility: result.volatility,
                confidence: result.confidence,
                dataPoints: result.dataPoints
            };
        } catch (error) {
            console.warn('Failed to get on-chain volatility, using fallback:', error);
            return {
                volatility: 0,
                confidence: 0,
                dataPoints: 0
            };
        }
    }

    /**
     * Get TradFi volatility from Yahoo Finance data.
     */
    private async getTradFiVolatility(
        ticker: string,
        lookbackDays: number
    ): Promise<number> {
        try {
            const endTime = Math.floor(Date.now() / 1000);
            const startTime = endTime - (lookbackDays * 24 * 60 * 60);

            const prices = await this.yahooClient.getHistoricalPrices(
                ticker,
                startTime,
                endTime
            );

            if (prices.length < 2) {
                throw new Error('Insufficient TradFi data');
            }

            // Calculate log returns
            const returns: number[] = [];
            for (let i = 1; i < prices.length; i++) {
                const logReturn = Math.log(prices[i].price / prices[i - 1].price);
                returns.push(logReturn);
            }

            // Calculate volatility
            const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
            const variance = returns.reduce((sum, r) => {
                return sum + Math.pow(r - mean, 2);
            }, 0) / (returns.length - 1);

            const dailyVol = Math.sqrt(variance);
            
            // Annualize (252 trading days for TradFi)
            const annualizedVol = dailyVol * Math.sqrt(252);

            return annualizedVol;
        } catch (error) {
            console.error('Failed to calculate TradFi volatility:', error);
            throw error;
        }
    }

    /**
     * Calculate weight for on-chain data.
     * 
     * Weight is based on:
     * - Data confidence (from volatility tracker)
     * - Number of data points
     * - Liquidity (future enhancement)
     * - Asset maturity (future enhancement)
     * 
     * Max weight is capped at 0.7 to always use at least 30% TradFi data.
     */
    private calculateWeight(confidence: number, dataPoints: number): number {
        // Base weight from confidence (0-0.4)
        let weight = confidence * 0.4;

        // Add data point factor (0-0.3)
        const minPoints = 30;
        const idealPoints = 90;
        const dataPointFactor = Math.min(
            Math.max(0, (dataPoints - minPoints) / (idealPoints - minPoints)),
            1
        );
        weight += dataPointFactor * 0.3;

        // Cap at 0.7 (always use at least 30% TradFi)
        return Math.min(weight, 0.7);
    }

    /**
     * Assess risk based on divergence between on-chain and TradFi vol.
     */
    private assessRisk(divergence: number): 'safe' | 'caution' | 'warning' {
        if (divergence < 0.10) return 'safe';      // < 10% difference
        if (divergence < 0.25) return 'caution';   // 10-25% difference
        return 'warning';                           // > 25% difference
    }

    /**
     * Get volatility comparison for analysis.
     */
    async getVolatilityComparison(
        assetId: string,
        tradFiTicker: string,
        onChainMint: string,
        lookbackDays: number
    ): Promise<{
        onChain: number;
        tradFi: number;
        difference: number;
        percentDifference: number;
    }> {
        const [onChainResult, tradFiVol] = await Promise.all([
            this.getOnChainVolatility(assetId, onChainMint, lookbackDays),
            this.getTradFiVolatility(tradFiTicker, lookbackDays)
        ]);

        const difference = onChainResult.volatility - tradFiVol;
        const percentDifference = (difference / tradFiVol) * 100;

        return {
            onChain: onChainResult.volatility,
            tradFi: tradFiVol,
            difference,
            percentDifference
        };
    }
}
