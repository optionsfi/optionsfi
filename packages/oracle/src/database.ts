/**
 * Database client for price snapshot storage and retrieval.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PricePoint, OracleConfig } from './types';

export class PriceDatabase {
    private client: SupabaseClient;

    constructor(config: OracleConfig) {
        this.client = createClient(config.supabaseUrl, config.supabaseKey);
    }

    /**
     * Store a price snapshot.
     */
    async storePriceSnapshot(
        assetId: string,
        price: number,
        timestamp: number,
        source: 'pyth' | 'dex' | 'yahoo',
        confidence?: number
    ): Promise<void> {
        const { error } = await this.client
            .from('price_snapshots')
            .insert({
                asset_id: assetId,
                price,
                timestamp,
                source,
                confidence
            });

        if (error) {
            throw new Error(`Failed to store price snapshot: ${error.message}`);
        }
    }

    /**
     * Store multiple price snapshots in bulk.
     */
    async storePriceSnapshots(snapshots: Array<{
        assetId: string;
        price: number;
        timestamp: number;
        source: 'pyth' | 'dex' | 'yahoo';
        confidence?: number;
    }>): Promise<void> {
        const records = snapshots.map(s => ({
            asset_id: s.assetId,
            price: s.price,
            timestamp: s.timestamp,
            source: s.source,
            confidence: s.confidence
        }));

        const { error } = await this.client
            .from('price_snapshots')
            .insert(records);

        if (error) {
            throw new Error(`Failed to store price snapshots: ${error.message}`);
        }
    }

    /**
     * Get price snapshots for an asset within a time range.
     */
    async getPriceSnapshots(
        assetId: string,
        startTimestamp: number,
        endTimestamp: number,
        source?: 'pyth' | 'dex' | 'yahoo'
    ): Promise<PricePoint[]> {
        let query = this.client
            .from('price_snapshots')
            .select('price, timestamp, source, confidence')
            .eq('asset_id', assetId)
            .gte('timestamp', startTimestamp)
            .lte('timestamp', endTimestamp)
            .order('timestamp', { ascending: true });

        if (source) {
            query = query.eq('source', source);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to get price snapshots: ${error.message}`);
        }

        return (data || []).map(row => ({
            price: parseFloat(row.price),
            timestamp: row.timestamp,
            source: row.source as 'pyth' | 'dex' | 'yahoo',
            confidence: row.confidence ? parseFloat(row.confidence) : undefined
        }));
    }

    /**
     * Get the latest price snapshot for an asset.
     */
    async getLatestPrice(
        assetId: string,
        source?: 'pyth' | 'dex' | 'yahoo'
    ): Promise<PricePoint | null> {
        let query = this.client
            .from('price_snapshots')
            .select('price, timestamp, source, confidence')
            .eq('asset_id', assetId)
            .order('timestamp', { ascending: false })
            .limit(1);

        if (source) {
            query = query.eq('source', source);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Failed to get latest price: ${error.message}`);
        }

        if (!data || data.length === 0) {
            return null;
        }

        const row = data[0];
        return {
            price: parseFloat(row.price),
            timestamp: row.timestamp,
            source: row.source as 'pyth' | 'dex' | 'yahoo',
            confidence: row.confidence ? parseFloat(row.confidence) : undefined
        };
    }

    /**
     * Get cached volatility if available and not expired.
     */
    async getCachedVolatility(
        assetId: string,
        lookbackDays: number,
        source: string
    ): Promise<{ volatility: number; confidence: number } | null> {
        const { data, error } = await this.client
            .from('volatility_cache')
            .select('volatility, confidence')
            .eq('asset_id', assetId)
            .eq('lookback_days', lookbackDays)
            .eq('source', source)
            .gt('expires_at', new Date().toISOString())
            .order('calculated_at', { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return null;
        }

        const row = data[0];
        return {
            volatility: parseFloat(row.volatility),
            confidence: row.confidence ? parseFloat(row.confidence) : 1.0
        };
    }

    /**
     * Store volatility calculation in cache.
     */
    async cacheVolatility(
        assetId: string,
        lookbackDays: number,
        volatility: number,
        dataPoints: number,
        source: string,
        confidence: number,
        startTimestamp: number,
        endTimestamp: number,
        ttlMinutes: number = 15
    ): Promise<void> {
        const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

        const { error } = await this.client
            .from('volatility_cache')
            .insert({
                asset_id: assetId,
                lookback_days: lookbackDays,
                volatility,
                data_points: dataPoints,
                source,
                confidence,
                start_timestamp: startTimestamp,
                end_timestamp: endTimestamp,
                expires_at: expiresAt.toISOString()
            });

        if (error) {
            // Log but don't throw - cache failure shouldn't break the system
            console.warn(`Failed to cache volatility: ${error.message}`);
        }
    }

    /**
     * Get asset configuration.
     */
    async getAssetConfig(assetId: string): Promise<{
        mintAddress: string;
        pythFeedId?: string;
        tradFiTicker?: string;
        decimals: number;
    } | null> {
        const { data, error } = await this.client
            .from('oracle_assets')
            .select('mint_address, pyth_feed_id, tradfi_ticker, decimals')
            .eq('asset_id', assetId)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            mintAddress: data.mint_address,
            pythFeedId: data.pyth_feed_id,
            tradFiTicker: data.tradfi_ticker,
            decimals: data.decimals
        };
    }
}
