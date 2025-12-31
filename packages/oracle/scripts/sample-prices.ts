/**
 * Start continuous price sampling for configured assets.
 * This should be run as a background service (e.g., via PM2 or systemd).
 */

import { config } from 'dotenv';
import { PriceSamplerService } from '../src';

// Load environment variables from .env file
config();

async function main() {
    console.log('🔄 Starting price sampling service...\n');

    const config = {
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_KEY!,
        solanaRpcUrl: process.env.SOLANA_RPC_URL!
    };

    const sampler = new PriceSamplerService(config);

    // Sample NVDAX every 5 minutes (300 seconds)
    await sampler.startSampling({
        assetId: 'NVDAX',
        yahooTicker: 'NVDA',
        intervalSeconds: 300
    });

    console.log('✅ Price sampling started for NVDAX');
    console.log('   Interval: 5 minutes');
    console.log('   Source: Yahoo Finance');
    console.log('\nPress Ctrl+C to stop\n');

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Stopping price sampling...');
        sampler.stopAll();
        console.log('✅ Stopped\n');
        process.exit(0);
    });

    // Keep process alive
    await new Promise(() => {});
}

main().catch(console.error);
