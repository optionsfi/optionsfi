/**
 * Price sampling service that collects prices from multiple sources
 * and stores them in the database for volatility calculations.
 */

import { Connection } from '@solana/web3.js';
import { PriceDatabase } from './database';
import { PythPriceClient } from './pyth-client';
import { YahooFinanceClient } from './yahoo-client';
import { OracleConfig } from './types';

export interface AssetSamplingConfig {
    assetId: string;
    pythFeedAddress?: string;
    yahooTicker?: string;
    intervalSeconds: number;
}

export class PriceSamplerService {
    private db: PriceDatabase;
    private pythClient: PythPriceClient;
    private yahooClient: YahooFinanceClient;
    private stopFunctions: Map<string, () => void> = new Map();

    constructor(config: OracleConfig) {
        this.db = new PriceDatabase(config);
        this.pythClient = new PythPriceClient({
            connection: new Connection(config.solanaRpcUrl)
        });
        this.yahooClient = new YahooFinanceClient();
    }

    /**
     * Start sampling prices for an asset.
     */
    async startSampling(config: AssetSamplingConfig): Promise<void> {
        const { assetId, pythFeedAddress, yahooTicker, intervalSeconds } = config;

        console.log(`Starting price sampling for ${assetId} (interval: ${intervalSeconds}s)`);

        // Sample from Pyth if configured
        if (pythFeedAddress) {
            const stopPyth = await this.pythClient.startPriceSampling(
                pythFeedAddress,
                intervalSeconds,
                async (price) => {
                    try {
                        await this.db.storePriceSnapshot(
                            assetId,
                            price.price,
                            price.timestamp,
                            'pyth',
                            price.confidence
                        );
                        console.log(`[${assetId}] Pyth price stored: $${price.price.toFixed(2)}`);
                    } catch (error) {
                        console.error(`Failed to store Pyth price for ${assetId}:`, error);
                    }
                }
            );
            this.stopFunctions.set(`${assetId}-pyth`, stopPyth);
        }

        // Sample from Yahoo Finance if configured
        if (yahooTicker) {
            const interval = setInterval(async () => {
                try {
                    const price = await this.yahooClient.getCurrentPrice(yahooTicker);
                    if (price) {
                        await this.db.storePriceSnapshot(
                            assetId,
                            price.price,
                            price.timestamp,
                            'yahoo',
                            price.confidence
                        );
                        console.log(`[${assetId}] Yahoo price stored: $${price.price.toFixed(2)}`);
                    }
                } catch (error) {
                    console.error(`Failed to store Yahoo price for ${assetId}:`, error);
                }
            }, intervalSeconds * 1000);

            this.stopFunctions.set(`${assetId}-yahoo`, () => clearInterval(interval));
        }
    }

    /**
     * Stop sampling for an asset.
     */
    stopSampling(assetId: string): void {
        const pythKey = `${assetId}-pyth`;
        const yahooKey = `${assetId}-yahoo`;

        const stopPyth = this.stopFunctions.get(pythKey);
        if (stopPyth) {
            stopPyth();
            this.stopFunctions.delete(pythKey);
            console.log(`Stopped Pyth sampling for ${assetId}`);
        }

        const stopYahoo = this.stopFunctions.get(yahooKey);
        if (stopYahoo) {
            stopYahoo();
            this.stopFunctions.delete(yahooKey);
            console.log(`Stopped Yahoo sampling for ${assetId}`);
        }
    }

    /**
     * Stop all sampling.
     */
    stopAll(): void {
        for (const [key, stopFn] of this.stopFunctions.entries()) {
            stopFn();
            console.log(`Stopped sampling: ${key}`);
        }
        this.stopFunctions.clear();
    }

    /**
     * Backfill historical prices from Yahoo Finance.
     */
    async backfillHistoricalPrices(
        assetId: string,
        yahooTicker: string,
        daysBack: number
    ): Promise<void> {
        const endTime = Math.floor(Date.now() / 1000);
        const startTime = endTime - (daysBack * 24 * 60 * 60);

        console.log(`Backfilling ${daysBack} days of historical prices for ${assetId}...`);

        const prices = await this.yahooClient.getHistoricalPrices(
            yahooTicker,
            startTime,
            endTime
        );

        if (prices.length === 0) {
            console.warn(`No historical prices fetched for ${assetId}`);
            return;
        }

        // Store in batches of 100
        const batchSize = 100;
        for (let i = 0; i < prices.length; i += batchSize) {
            const batch = prices.slice(i, i + batchSize);
            const snapshots = batch.map(p => ({
                assetId,
                price: p.price,
                timestamp: p.timestamp,
                source: 'yahoo' as const,
                confidence: p.confidence
            }));

            await this.db.storePriceSnapshots(snapshots);
            console.log(`Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(prices.length / batchSize)}`);
        }

        console.log(`Backfill complete: ${prices.length} prices stored for ${assetId}`);
    }
}
