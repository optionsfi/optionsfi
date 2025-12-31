/**
 * Setup script for oracle infrastructure.
 * Run this once to initialize the database and backfill historical data.
 */

import { config } from 'dotenv';
import { PriceDatabase, PriceSamplerService } from '../src';

// Load environment variables from .env file
config();

async function main() {
    console.log('🚀 OptionsFi Oracle Setup\n');

    // Check environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'SOLANA_RPC_URL'];
    const missing = requiredEnvVars.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
        console.error('❌ Missing environment variables:', missing.join(', '));
        console.log('\nPlease set these in your .env file:');
        console.log('SUPABASE_URL=your-supabase-url');
        console.log('SUPABASE_KEY=your-supabase-anon-key');
        console.log('SOLANA_RPC_URL=https://api.devnet.solana.com');
        process.exit(1);
    }

    const config = {
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_KEY!,
        solanaRpcUrl: process.env.SOLANA_RPC_URL!
    };

    console.log('✅ Environment variables configured\n');

    // Test database connection
    console.log('📊 Testing database connection...');
    const db = new PriceDatabase(config);
    
    try {
        const assetConfig = await db.getAssetConfig('NVDAX');
        if (assetConfig) {
            console.log('✅ Database connection successful');
            console.log('   Found asset config for NVDAX:', assetConfig);
        } else {
            console.log('⚠️  Database connected but NVDAX asset not found');
            console.log('   Run the supabase-schema.sql to seed initial data');
        }
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.log('\nMake sure you have:');
        console.log('1. Created a Supabase project');
        console.log('2. Run the schema: psql $DATABASE_URL < supabase-schema.sql');
        process.exit(1);
    }

    console.log('\n📈 Backfilling historical price data...');
    const sampler = new PriceSamplerService(config);

    try {
        // Backfill 90 days of NVDA data
        await sampler.backfillHistoricalPrices('NVDAX', 'NVDA', 90);
        console.log('✅ Historical data backfilled');
    } catch (error) {
        console.error('❌ Backfill failed:', error);
        console.log('\nThis might be due to:');
        console.log('- Yahoo Finance rate limiting');
        console.log('- Network issues');
        console.log('- Invalid ticker symbol');
    }

    console.log('\n✨ Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Start price sampling: npm run sample');
    console.log('2. Verify data in Supabase dashboard');
    console.log('3. Proceed to Phase 2: Volatility calculation\n');
}

main().catch(console.error);
