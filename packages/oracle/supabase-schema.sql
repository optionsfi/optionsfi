-- ============================================================================
-- OptionsFi Oracle - Price Snapshots Schema
-- ============================================================================

-- Price snapshots table for historical volatility calculation
CREATE TABLE IF NOT EXISTS price_snapshots (
    id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(32) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    timestamp BIGINT NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('pyth', 'dex', 'yahoo')),
    confidence DECIMAL(5, 4),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by asset and time range
CREATE INDEX IF NOT EXISTS idx_price_snapshots_asset_timestamp 
ON price_snapshots(asset_id, timestamp DESC);

-- Index for source-specific queries
CREATE INDEX IF NOT EXISTS idx_price_snapshots_source 
ON price_snapshots(source);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_price_snapshots_asset_source_timestamp 
ON price_snapshots(asset_id, source, timestamp DESC);

-- ============================================================================
-- Asset configuration table
-- ============================================================================

CREATE TABLE IF NOT EXISTS oracle_assets (
    id SERIAL PRIMARY KEY,
    asset_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    asset_type VARCHAR(20) NOT NULL CHECK (asset_type IN ('crypto', 'tokenized_stock', 'tokenized_treasury')),
    mint_address VARCHAR(44) NOT NULL,
    pyth_feed_id VARCHAR(64),
    tradfi_ticker VARCHAR(10),
    decimals INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_oracle_assets_asset_id 
ON oracle_assets(asset_id);

CREATE INDEX IF NOT EXISTS idx_oracle_assets_active 
ON oracle_assets(is_active) WHERE is_active = true;

-- ============================================================================
-- Volatility cache table (for performance)
-- ============================================================================

CREATE TABLE IF NOT EXISTS volatility_cache (
    id SERIAL PRIMARY KEY,
    asset_id VARCHAR(32) NOT NULL,
    lookback_days INTEGER NOT NULL,
    volatility DECIMAL(10, 6) NOT NULL,
    data_points INTEGER NOT NULL,
    source VARCHAR(20) NOT NULL,
    confidence DECIMAL(5, 4),
    start_timestamp BIGINT NOT NULL,
    end_timestamp BIGINT NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Index for cache lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_volatility_cache_lookup 
ON volatility_cache(asset_id, lookback_days, source) 
WHERE expires_at > NOW();

-- Auto-delete expired cache entries
CREATE INDEX IF NOT EXISTS idx_volatility_cache_expires 
ON volatility_cache(expires_at);

-- ============================================================================
-- Functions
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for oracle_assets
DROP TRIGGER IF EXISTS update_oracle_assets_updated_at ON oracle_assets;
CREATE TRIGGER update_oracle_assets_updated_at 
    BEFORE UPDATE ON oracle_assets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Initial seed data (NVDAX example)
-- ============================================================================

INSERT INTO oracle_assets (
    asset_id, 
    name, 
    asset_type, 
    mint_address, 
    pyth_feed_id, 
    tradfi_ticker, 
    decimals,
    config
) VALUES (
    'NVDAX',
    'NVIDIA Token',
    'tokenized_stock',
    'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn',
    NULL, -- Pyth doesn't have NVDAX directly
    'NVDA',
    6,
    '{
        "trading_hours": {
            "enforced": false,
            "description": "24/7 on-chain trading"
        },
        "liquidity_tier": "medium"
    }'::jsonb
) ON CONFLICT (asset_id) DO NOTHING;

-- ============================================================================
-- Cleanup functions
-- ============================================================================

-- Function to clean up old price snapshots (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_price_snapshots()
RETURNS void AS $$
BEGIN
    DELETE FROM price_snapshots 
    WHERE timestamp < EXTRACT(EPOCH FROM NOW() - INTERVAL '90 days');
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired volatility cache
CREATE OR REPLACE FUNCTION cleanup_expired_volatility_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM volatility_cache 
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE price_snapshots IS 'Historical price data for volatility calculations';
COMMENT ON TABLE oracle_assets IS 'Asset configuration for oracle services';
COMMENT ON TABLE volatility_cache IS 'Cached volatility calculations to reduce computation';
COMMENT ON COLUMN price_snapshots.confidence IS 'Confidence score 0-1 from data source';
COMMENT ON COLUMN volatility_cache.expires_at IS 'Cache TTL - typically 5-15 minutes';
