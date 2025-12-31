/**
 * Pyth Network client for fetching real-time and historical price data.
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { PricePoint } from './types';

export interface PythPriceConfig {
    connection: Connection;
    pythProgramId?: PublicKey;
}

export class PythPriceClient {
    private connection: Connection;
    private pythProgramId: PublicKey;

    constructor(config: PythPriceConfig) {
        this.connection = config.connection;
        // Pyth mainnet program ID
        this.pythProgramId = config.pythProgramId || 
            new PublicKey('FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH');
    }

    /**
     * Fetch current price from Pyth.
     * 
     * Note: This fetches real-time on-chain price data.
     * For historical data, we need to store snapshots.
     */
    async getCurrentPrice(priceFeedAddress: string): Promise<PricePoint | null> {
        try {
            const priceFeedPubkey = new PublicKey(priceFeedAddress);
            const accountInfo = await this.connection.getAccountInfo(priceFeedPubkey);

            if (!accountInfo) {
                return null;
            }

            // Parse Pyth price account
            // Pyth price is at offset 208, expo at offset 216
            const data = accountInfo.data;
            
            const price = data.readBigInt64LE(208);
            const expo = data.readInt32LE(216);
            const conf = data.readBigUInt64LE(224);

            // Calculate actual price
            const actualPrice = Number(price) * Math.pow(10, expo);
            const confidence = Number(conf) * Math.pow(10, expo);
            
            // Confidence as percentage of price
            const confidenceRatio = confidence / actualPrice;

            return {
                price: actualPrice,
                timestamp: Math.floor(Date.now() / 1000),
                source: 'pyth',
                confidence: Math.max(0, 1 - confidenceRatio) // Higher is better
            };
        } catch (error) {
            console.error('Error fetching Pyth price:', error);
            return null;
        }
    }

    /**
     * Fetch price using Pyth Hermes API (for historical data).
     * 
     * Hermes provides historical price data which is useful for
     * calculating volatility without storing every price point.
     */
    async getHistoricalPrices(
        priceFeedId: string,
        startTime: number,
        endTime: number
    ): Promise<PricePoint[]> {
        try {
            // Use Pyth Hermes API for historical data
            const url = `https://hermes.pyth.network/api/get_price_feed?id=${priceFeedId}`;
            
            // Note: This is a simplified version
            // Full implementation would need to handle pagination and time ranges
            const response = await fetch(url);
            const data = await response.json();

            // Transform Hermes response to PricePoint format
            // This is a placeholder - actual Hermes API structure may differ
            const prices: PricePoint[] = [];
            
            // For now, return empty array - full implementation in next phase
            return prices;
        } catch (error) {
            console.error('Error fetching historical Pyth prices:', error);
            return [];
        }
    }

    /**
     * Start periodic price sampling (for building historical data).
     * 
     * This should be run by the keeper service to continuously
     * sample and store prices for volatility calculation.
     */
    async startPriceSampling(
        priceFeedAddress: string,
        intervalSeconds: number,
        onPrice: (price: PricePoint) => void
    ): Promise<() => void> {
        const interval = setInterval(async () => {
            const price = await this.getCurrentPrice(priceFeedAddress);
            if (price) {
                onPrice(price);
            }
        }, intervalSeconds * 1000);

        // Return cleanup function
        return () => clearInterval(interval);
    }
}
