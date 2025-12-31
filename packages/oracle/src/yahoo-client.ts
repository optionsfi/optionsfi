/**
 * Yahoo Finance client for TradFi asset price data.
 */

import axios from 'axios';
import { PricePoint } from './types';

export class YahooFinanceClient {
    private baseUrl = 'https://query1.finance.yahoo.com/v8/finance';

    /**
     * Fetch historical prices for a ticker.
     */
    async getHistoricalPrices(
        ticker: string,
        startTimestamp: number,
        endTimestamp: number
    ): Promise<PricePoint[]> {
        try {
            const url = `${this.baseUrl}/chart/${ticker}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d`;
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            const result = response.data.chart.result[0];
            const timestamps = result.timestamp;
            const prices = result.indicators.quote[0].close;

            const pricePoints: PricePoint[] = [];
            
            for (let i = 0; i < timestamps.length; i++) {
                if (prices[i] !== null) {
                    pricePoints.push({
                        price: prices[i],
                        timestamp: timestamps[i],
                        source: 'yahoo',
                        confidence: 1.0 // Yahoo data is generally reliable
                    });
                }
            }

            return pricePoints;
        } catch (error) {
            console.error(`Error fetching Yahoo prices for ${ticker}:`, error);
            return [];
        }
    }

    /**
     * Fetch current price for a ticker.
     */
    async getCurrentPrice(ticker: string): Promise<PricePoint | null> {
        try {
            const url = `${this.baseUrl}/chart/${ticker}?interval=1m&range=1d`;
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            const result = response.data.chart.result[0];
            const meta = result.meta;
            
            if (!meta.regularMarketPrice) {
                return null;
            }

            return {
                price: meta.regularMarketPrice,
                timestamp: meta.regularMarketTime,
                source: 'yahoo',
                confidence: 1.0
            };
        } catch (error) {
            console.error(`Error fetching current Yahoo price for ${ticker}:`, error);
            return null;
        }
    }
}
