/**
 * Test script for volatility calculation engines.
 */

import { config } from 'dotenv';
import { 
    PriceDatabase, 
    OnChainVolatilityTracker,
    HybridVolatilityEngine,
    PricingOracle
} from '../src';

config();

async function main() {
    console.log('🧪 Testing Volatility Engines\n');
    console.log('='.repeat(60));

    const oracleConfig = {
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_KEY!,
        solanaRpcUrl: process.env.SOLANA_RPC_URL!
    };

    const db = new PriceDatabase(oracleConfig);

    // Test 1: On-Chain Volatility Tracker
    console.log('\n📊 Test 1: On-Chain Volatility Calculation');
    console.log('-'.repeat(60));
    
    const tracker = new OnChainVolatilityTracker(db);
    
    try {
        const onChainVol = await tracker.getVolatility({
            assetId: 'NVDAX',
            mintAddress: 'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn',
            lookbackDays: 30
        });

        console.log('✅ On-Chain Volatility:');
        console.log(`   Volatility: ${(onChainVol.volatility * 100).toFixed(2)}%`);
        console.log(`   Data Points: ${onChainVol.dataPoints}`);
        console.log(`   Confidence: ${(onChainVol.confidence * 100).toFixed(1)}%`);
        console.log(`   Source: ${onChainVol.source}`);
    } catch (error: any) {
        console.log('❌ On-Chain Volatility Failed:', error.message);
    }

    // Test 2: Volatility Term Structure
    console.log('\n📈 Test 2: Volatility Term Structure');
    console.log('-'.repeat(60));

    try {
        const termStructure = await tracker.getVolatilityTermStructure(
            'NVDAX',
            'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn',
            [7, 14, 30, 60]
        );

        console.log('Term Structure:');
        termStructure.forEach(({ days, volatility, confidence }) => {
            if (volatility > 0) {
                console.log(`   ${days.toString().padStart(2)} days: ${(volatility * 100).toFixed(2)}% (confidence: ${(confidence * 100).toFixed(0)}%)`);
            }
        });
    } catch (error: any) {
        console.log('❌ Term Structure Failed:', error.message);
    }

    // Test 3: Hybrid Volatility Engine
    console.log('\n🔄 Test 3: Hybrid Volatility (On-Chain + TradFi)');
    console.log('-'.repeat(60));

    const hybridEngine = new HybridVolatilityEngine(db);

    try {
        const hybridVol = await hybridEngine.calculateHybridVolatility({
            assetId: 'NVDAX',
            tradFiTicker: 'NVDA',
            onChainMint: 'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn',
            lookbackDays: 30
        });

        console.log('✅ Hybrid Volatility:');
        console.log(`   Final Volatility: ${(hybridVol.finalVolatility * 100).toFixed(2)}%`);
        console.log(`   TradFi Vol:       ${(hybridVol.tradFiVol * 100).toFixed(2)}%`);
        console.log(`   On-Chain Vol:     ${(hybridVol.onChainVol * 100).toFixed(2)}%`);
        console.log(`   Weight (on-chain):${(hybridVol.weight * 100).toFixed(1)}%`);
        console.log(`   Divergence:       ${(hybridVol.divergence * 100).toFixed(1)}%`);
        console.log(`   Risk Level:       ${hybridVol.recommendation.toUpperCase()}`);
    } catch (error: any) {
        console.log('❌ Hybrid Volatility Failed:', error.message);
    }

    // Test 4: Volatility Comparison
    console.log('\n📊 Test 4: On-Chain vs TradFi Comparison');
    console.log('-'.repeat(60));

    try {
        const comparison = await hybridEngine.getVolatilityComparison(
            'NVDAX',
            'NVDA',
            'G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn',
            30
        );

        console.log('Comparison:');
        console.log(`   On-Chain:    ${(comparison.onChain * 100).toFixed(2)}%`);
        console.log(`   TradFi:      ${(comparison.tradFi * 100).toFixed(2)}%`);
        console.log(`   Difference:  ${comparison.difference > 0 ? '+' : ''}${(comparison.difference * 100).toFixed(2)}%`);
        console.log(`   % Diff:      ${comparison.percentDifference > 0 ? '+' : ''}${comparison.percentDifference.toFixed(1)}%`);
    } catch (error: any) {
        console.log('❌ Comparison Failed:', error.message);
    }

    // Test 5: Pricing Oracle
    console.log('\n💰 Test 5: Option Pricing with Risk Adjustment');
    console.log('-'.repeat(60));

    const oracle = new PricingOracle(hybridEngine);

    try {
        const pricing = await oracle.calculatePricing({
            assetId: 'NVDAX',
            spot: 145.50,
            strike: 150,
            daysToExpiry: 7,
            optionType: 'call'
        });

        console.log('✅ Option Pricing:');
        console.log(`   Spot Price:       $${pricing.metadata.tradFiVol > 0 ? '145.50' : 'N/A'}`);
        console.log(`   Strike:           $150.00`);
        console.log(`   Days to Expiry:   7`);
        console.log(`   Type:             Call`);
        console.log(`\n   Fair Value:       $${pricing.fairValue.toFixed(2)}`);
        console.log(`   Min Premium:      $${pricing.minPremium.toFixed(2)} (${((pricing.riskAdjustment) * 100).toFixed(1)}% buffer)`);
        console.log(`   Max Premium:      $${pricing.maxPremium.toFixed(2)}`);
        console.log(`   Volatility Used:  ${(pricing.volatilityUsed * 100).toFixed(2)}%`);
        console.log(`\n   Risk Assessment:  ${pricing.metadata.recommendation.toUpperCase()}`);
        console.log(`   Divergence:       ${(pricing.metadata.divergence * 100).toFixed(1)}%`);
    } catch (error: any) {
        console.log('❌ Pricing Failed:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Phase 2 Testing Complete!\n');
}

main().catch(console.error);
