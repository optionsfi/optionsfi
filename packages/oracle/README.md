# @optionsfi/oracle

Hybrid pricing oracle for OptionsFi with on-chain and TradFi data integration.

## Features

- **Multi-Source Price Fetching**: Pyth Network, DEX aggregators, Yahoo Finance
- **Historical Data Storage**: Supabase-backed price snapshots
- **Volatility Calculation**: Realized volatility from on-chain and TradFi data
- **Hybrid Model**: Intelligent weighting of data sources
- **Caching**: Performance optimization with TTL-based cache

## Installation

```bash
npm install @optionsfi/oracle
```

## Setup

### 1. Database Schema

Run the Supabase migration:

```bash
cd packages/oracle
# Copy schema to your Supabase project or run via psql
psql $DATABASE_URL < supabase-schema.sql
```

### 2. Configuration

```typescript
import { PriceSamplerService } from '@optionsfi/oracle';

const sampler = new PriceSamplerService({
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
    solanaRpcUrl: process.env.SOLANA_RPC_URL!
});
```

## Usage

### Price Sampling

Start continuous price sampling for an asset:

```typescript
await sampler.startSampling({
    assetId: 'NVDAX',
    yahooTicker: 'NVDA',
    intervalSeconds: 300 // Sample every 5 minutes
});
```

### Historical Backfill

Backfill historical prices from Yahoo Finance:

```typescript
await sampler.backfillHistoricalPrices(
    'NVDAX',
    'NVDA',
    90 // 90 days of history
);
```

### Direct Price Fetching

```typescript
import { YahooFinanceClient } from '@optionsfi/oracle';

const yahoo = new YahooFinanceClient();
const price = await yahoo.getCurrentPrice('NVDA');
console.log(`Current price: $${price?.price}`);
```

## Architecture

```
┌─────────────────────────────────────────┐
│     MULTI-SOURCE DATA AGGREGATION       │
└─────────────────────────────────────────┘
         │                 │
    ┌────┴─────┐     ┌─────┴────┐
    ▼          ▼     ▼          ▼
┌────────┐  ┌────────┐  ┌────────┐
│ Pyth   │  │ Yahoo  │  │  DEX   │
│ Network│  │Finance │  │ Prices │
└────────┘  └────────┘  └────────┘
         │
         ▼
┌─────────────────────┐
│  Price Database     │
│  (Supabase)         │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Volatility Engine  │
│  (Next Phase)       │
└─────────────────────┘
```

## Development

```bash
# Build
npm run build

# Development mode
npm run dev

# Tests
npm test
```

## Environment Variables

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Next Steps

Phase 1 (Current): Data collection infrastructure
- ✅ Database schema
- ✅ Price fetching clients
- ✅ Sampling service

Phase 2 (Next): Volatility calculation
- [ ] On-chain volatility tracker
- [ ] Hybrid volatility engine
- [ ] Pricing oracle

## License

MIT
