# Oracle Package Testing Guide

## Prerequisites

Before testing, you need:

1. **Supabase Project**
   - Sign up at https://supabase.com
   - Create a new project
   - Copy your project URL and anon key

2. **Environment Variables**
   Create `packages/oracle/.env`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key-here
   SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

## Step 1: Database Setup

### Run the Supabase Schema

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy contents of `supabase-schema.sql`
4. Run the query

**Option B: Via psql (if you have it)**
```bash
# Get your connection string from Supabase dashboard
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" < supabase-schema.sql
```

**Verify Tables Created:**
```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('price_snapshots', 'oracle_assets', 'volatility_cache');
```

Should return 3 rows.

## Step 2: Run Setup Script

```bash
cd packages/oracle

# Install dependencies
npm install

# Build the package
npm run build

# Run setup (backfills 90 days of NVDA data)
npm run setup
```

**Expected Output:**
```
🚀 OptionsFi Oracle Setup

✅ Environment variables configured

📊 Testing database connection...
✅ Database connection successful
   Found asset config for NVDAX: { mintAddress: 'G5V...', tradFiTicker: 'NVDA', ... }

📈 Backfilling historical price data...
Backfilling 90 days of historical prices for NVDAX...
Stored batch 1/1
✅ Historical data backfilled

✨ Setup complete!
```

**If it fails:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check network connection
- Yahoo Finance might rate-limit (wait a few minutes)

## Step 3: Verify Data in Supabase

Go to Supabase Dashboard → Table Editor → `price_snapshots`

**You should see:**
- ~90 rows (one per day)
- `asset_id` = 'NVDAX'
- `source` = 'yahoo'
- Prices around $100-150 (depending on NVDA's recent price)
- Timestamps covering last 90 days

**Check with SQL:**
```sql
-- Count price snapshots
SELECT COUNT(*) FROM price_snapshots WHERE asset_id = 'NVDAX';

-- Latest price
SELECT * FROM price_snapshots 
WHERE asset_id = 'NVDAX' 
ORDER BY timestamp DESC 
LIMIT 1;

-- Date range
SELECT 
    MIN(to_timestamp(timestamp)) as earliest,
    MAX(to_timestamp(timestamp)) as latest,
    COUNT(*) as total_prices
FROM price_snapshots 
WHERE asset_id = 'NVDAX';
```

## Step 4: Test Price Sampling

Start continuous price sampling:

```bash
npm run sample
```

**Expected Output:**
```
🔄 Starting price sampling service...

✅ Price sampling started for NVDAX
   Interval: 5 minutes
   Source: Yahoo Finance

Press Ctrl+C to stop

[NVDAX] Yahoo price stored: $145.23
[NVDAX] Yahoo price stored: $145.45
...
```

**Let it run for 10-15 minutes, then verify:**

```sql
-- Check recent prices
SELECT * FROM price_snapshots 
WHERE asset_id = 'NVDAX' 
AND timestamp > EXTRACT(EPOCH FROM NOW() - INTERVAL '1 hour')
ORDER BY timestamp DESC;
```

Should see 2-3 new entries (one every 5 minutes).

## Step 5: Test Price Fetching APIs

Create a test script `packages/oracle/scripts/test-apis.ts`:

```typescript
import { YahooFinanceClient, PythPriceClient } from '../src';
import { Connection } from '@solana/web3.js';

async function main() {
    console.log('Testing Yahoo Finance API...\n');
    
    const yahoo = new YahooFinanceClient();
    
    // Test current price
    const currentPrice = await yahoo.getCurrentPrice('NVDA');
    console.log('Current NVDA price:', currentPrice);
    
    // Test historical prices
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - (7 * 24 * 60 * 60); // 7 days ago
    
    const historicalPrices = await yahoo.getHistoricalPrices('NVDA', startTime, endTime);
    console.log(`\nHistorical prices fetched: ${historicalPrices.length}`);
    console.log('First price:', historicalPrices[0]);
    console.log('Last price:', historicalPrices[historicalPrices.length - 1]);
    
    // Test Pyth client (currently placeholder)
    console.log('\n\nTesting Pyth client...');
    const pyth = new PythPriceClient({
        connection: new Connection('https://api.devnet.solana.com')
    });
    console.log('✅ Pyth client initialized (full implementation in Phase 2)');
}

main().catch(console.error);
```

Run it:
```bash
npx tsx scripts/test-apis.ts
```

## Step 6: Check Database Performance

```sql
-- Query performance test (should be fast with indexes)
EXPLAIN ANALYZE
SELECT * FROM price_snapshots 
WHERE asset_id = 'NVDAX' 
AND timestamp >= EXTRACT(EPOCH FROM NOW() - INTERVAL '30 days')
ORDER BY timestamp DESC;

-- Should show "Index Scan" not "Seq Scan"
```

## Troubleshooting

### Error: "Database connection failed"

**Check:**
1. Supabase URL and key are correct
2. Supabase project is not paused (free tier pauses after inactivity)
3. Network allows connections to Supabase

**Fix:**
- Go to Supabase dashboard
- Check project status
- Verify credentials in `.env`

### Error: "No historical prices fetched"

**Possible causes:**
- Yahoo Finance rate limiting
- Invalid ticker symbol
- Network issues

**Fix:**
- Wait 5 minutes and try again
- Use a different ticker to test: `npm run setup -- --ticker=AAPL`
- Check Yahoo Finance status: https://finance.yahoo.com/quote/NVDA

### Error: "Table does not exist"

**Fix:**
- Make sure you ran `supabase-schema.sql`
- Check in Supabase dashboard that tables exist
- Re-run the schema if needed

### Price sampling not working

**Check:**
1. Is the process running? (`ps aux | grep sample`)
2. Check logs for errors
3. Verify environment variables
4. Test Yahoo API manually: `curl "https://query1.finance.yahoo.com/v8/finance/chart/NVDA"`

## Success Criteria

✅ **Phase 1 is working correctly if:**

1. ✅ Database has 3 tables created
2. ✅ NVDAX asset is configured in `oracle_assets`
3. ✅ ~90 historical prices are stored in `price_snapshots`
4. ✅ Setup script completes without errors
5. ✅ Sampling service stores new prices every 5 minutes
6. ✅ Yahoo Finance API returns current prices
7. ✅ Database queries are fast (<100ms)

## Next Steps

Once all tests pass:

1. **Stop the sampling service** (Ctrl+C)
2. **Proceed to Phase 2**: Volatility calculation
3. **Keep the data**: Historical prices will be used for vol calculations

## Cost Estimate

**Supabase Free Tier:**
- 500MB database (plenty for price data)
- Unlimited API requests

**With 90 days of data:**
- Daily prices: ~90 rows × 50 bytes = 4.5 KB
- With 5-min sampling: ~90 days × 288 samples/day × 50 bytes = 1.3 MB

Should stay well within free tier for development.

## Production Considerations

For production:
- Use Supabase Pro ($25/month) for better performance
- Implement retry logic for API failures
- Add monitoring/alerting for data gaps
- Consider Redis for hot data caching
- Set up automated backups

---

**Ready for Phase 2?** Once these tests pass, we'll build the volatility calculation engine!
