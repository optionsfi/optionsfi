/**
 * Option Pricing Tests
 */

import { describe, it, expect } from 'vitest';
import { OptionPricing } from '../src/utils/pricing';

describe('OptionPricing.blackScholes', () => {
    const baseParams = {
        spot: 100,
        strike: 100,
        timeToExpiry: 1, // 1 year
        riskFreeRate: 0.05,
        volatility: 0.2,
    };

    describe('ATM options', () => {
        it('should return positive call price for ATM option', () => {
            const result = OptionPricing.blackScholes(baseParams);
            expect(result.call).toBeGreaterThan(0);
        });

        it('should return positive put price for ATM option', () => {
            const result = OptionPricing.blackScholes(baseParams);
            expect(result.put).toBeGreaterThan(0);
        });

        it('should satisfy put-call parity', () => {
            const result = OptionPricing.blackScholes(baseParams);
            const { spot, strike, timeToExpiry, riskFreeRate } = baseParams;

            // Put-Call Parity: C - P = S - K * e^(-rT)
            const lhs = result.call - result.put;
            const rhs = spot - strike * Math.exp(-riskFreeRate * timeToExpiry);

            expect(lhs).toBeCloseTo(rhs, 4);
        });

        it('should have call delta around 0.5 for ATM', () => {
            const result = OptionPricing.blackScholes(baseParams);
            expect(result.delta.call).toBeCloseTo(0.6, 1); // ATM with drift is slightly > 0.5
        });

        it('should have put delta around -0.5 for ATM', () => {
            const result = OptionPricing.blackScholes(baseParams);
            expect(result.delta.put).toBeCloseTo(-0.4, 1);
        });
    });

    describe('ITM/OTM options', () => {
        it('should return higher call price for ITM call', () => {
            const itmCall = OptionPricing.blackScholes({ ...baseParams, strike: 80 });
            const otmCall = OptionPricing.blackScholes({ ...baseParams, strike: 120 });

            expect(itmCall.call).toBeGreaterThan(otmCall.call);
        });

        it('should return higher put price for ITM put', () => {
            const itmPut = OptionPricing.blackScholes({ ...baseParams, strike: 120 });
            const otmPut = OptionPricing.blackScholes({ ...baseParams, strike: 80 });

            expect(itmPut.put).toBeGreaterThan(otmPut.put);
        });

        it('should have delta close to 1 for deep ITM call', () => {
            const result = OptionPricing.blackScholes({ ...baseParams, strike: 50 });
            expect(result.delta.call).toBeCloseTo(1, 1);
        });

        it('should have delta close to 0 for deep OTM call', () => {
            const result = OptionPricing.blackScholes({ ...baseParams, strike: 200 });
            expect(result.delta.call).toBeCloseTo(0, 1);
        });
    });

    describe('time value', () => {
        it('should have more value with more time to expiry', () => {
            const shortDated = OptionPricing.blackScholes({ ...baseParams, timeToExpiry: 0.1 });
            const longDated = OptionPricing.blackScholes({ ...baseParams, timeToExpiry: 1 });

            expect(longDated.call).toBeGreaterThan(shortDated.call);
        });

        it('should return intrinsic value at expiry (call ITM)', () => {
            const result = OptionPricing.blackScholes({
                ...baseParams,
                spot: 110,
                strike: 100,
                timeToExpiry: 0,
            });

            expect(result.call).toBe(10); // Intrinsic: 110 - 100
        });

        it('should return zero at expiry (call OTM)', () => {
            const result = OptionPricing.blackScholes({
                ...baseParams,
                spot: 90,
                strike: 100,
                timeToExpiry: 0,
            });

            expect(result.call).toBe(0);
        });
    });

    describe('volatility impact', () => {
        it('should have higher price with higher volatility', () => {
            const lowVol = OptionPricing.blackScholes({ ...baseParams, volatility: 0.1 });
            const highVol = OptionPricing.blackScholes({ ...baseParams, volatility: 0.5 });

            expect(highVol.call).toBeGreaterThan(lowVol.call);
            expect(highVol.put).toBeGreaterThan(lowVol.put);
        });
    });

    describe('edge cases', () => {
        it('should throw for zero volatility', () => {
            expect(() => OptionPricing.blackScholes({ ...baseParams, volatility: 0 }))
                .toThrow();
        });

        it('should throw for negative volatility', () => {
            expect(() => OptionPricing.blackScholes({ ...baseParams, volatility: -0.2 }))
                .toThrow();
        });
    });
});

describe('OptionPricing.calculateCoveredCallPremium', () => {
    it('should return positive premium', () => {
        const premium = OptionPricing.calculateCoveredCallPremium({
            spot: 145.50,
            strikePercent: 1.05, // 5% OTM
            daysToExpiry: 7,
            volatility: 0.45,
        });

        expect(premium).toBeGreaterThan(0);
    });

    it('should return higher premium for longer expiry', () => {
        const short = OptionPricing.calculateCoveredCallPremium({
            spot: 100,
            strikePercent: 1.05,
            daysToExpiry: 7,
            volatility: 0.3,
        });

        const long = OptionPricing.calculateCoveredCallPremium({
            spot: 100,
            strikePercent: 1.05,
            daysToExpiry: 30,
            volatility: 0.3,
        });

        expect(long).toBeGreaterThan(short);
    });

    it('should return lower premium for higher strike', () => {
        const atm = OptionPricing.calculateCoveredCallPremium({
            spot: 100,
            strikePercent: 1.0,
            daysToExpiry: 30,
            volatility: 0.3,
        });

        const otm = OptionPricing.calculateCoveredCallPremium({
            spot: 100,
            strikePercent: 1.1, // 10% OTM
            daysToExpiry: 30,
            volatility: 0.3,
        });

        expect(atm).toBeGreaterThan(otm);
    });
});

describe('OptionPricing.premiumToBps', () => {
    it('should convert premium to basis points correctly', () => {
        expect(OptionPricing.premiumToBps(5, 100)).toBe(500);
        expect(OptionPricing.premiumToBps(1, 100)).toBe(100);
        expect(OptionPricing.premiumToBps(0.5, 100)).toBe(50);
    });
});

describe('OptionPricing.bpsToPremium', () => {
    it('should convert basis points to premium correctly', () => {
        expect(OptionPricing.bpsToPremium(500, 100)).toBe(5);
        expect(OptionPricing.bpsToPremium(100, 100)).toBe(1);
        expect(OptionPricing.bpsToPremium(50, 100)).toBe(0.5);
    });
});

describe('OptionPricing.timeToExpiry', () => {
    it('should calculate time to expiry in years', () => {
        const now = Math.floor(Date.now() / 1000);
        const oneYearFromNow = now + 365.25 * 24 * 60 * 60;

        const tte = OptionPricing.timeToExpiry(oneYearFromNow);
        expect(tte).toBeCloseTo(1, 2);
    });

    it('should return approximately 0.0833 for one month', () => {
        const now = Math.floor(Date.now() / 1000);
        const oneMonthFromNow = now + 30 * 24 * 60 * 60;

        const tte = OptionPricing.timeToExpiry(oneMonthFromNow);
        expect(tte).toBeCloseTo(30 / 365.25, 2);
    });
});

describe('OptionPricing.suggestStrike', () => {
    it('should return spot price for 0 delta', () => {
        expect(OptionPricing.suggestStrike(100, 0)).toBe(100);
    });

    it('should return higher strike for OTM call', () => {
        const strike = OptionPricing.suggestStrike(100, 500, 'call'); // 5% OTM
        expect(strike).toBe(105);
    });

    it('should return lower strike for OTM put', () => {
        const strike = OptionPricing.suggestStrike(100, 500, 'put'); // 5% OTM
        expect(strike).toBe(95);
    });
});

describe('OptionPricing.validateQuote', () => {
    it('should accept quote within deviation bounds', () => {
        const result = OptionPricing.validateQuote(10, 10, 500);
        expect(result.isValid).toBe(true);
    });

    it('should accept quote at boundary', () => {
        const result = OptionPricing.validateQuote(10.5, 10, 500); // 5% deviation
        expect(result.isValid).toBe(true);
    });

    it('should reject quote beyond deviation bounds', () => {
        const result = OptionPricing.validateQuote(12, 10, 500); // 20% deviation
        expect(result.isValid).toBe(false);
        expect(result.reason).toContain('deviates');
    });

    it('should return deviation in bps', () => {
        const result = OptionPricing.validateQuote(10.3, 10, 500);
        expect(result.deviationBps).toBe(300);
    });

    it('should reject zero fair value', () => {
        const result = OptionPricing.validateQuote(10, 0);
        expect(result.isValid).toBe(false);
    });
});

describe('OptionPricing.calculateHistoricalVolatility', () => {
    it('should calculate volatility from prices', () => {
        // Prices that show some movement
        const prices = [100, 101, 99, 102, 98, 103, 97, 104];
        const vol = OptionPricing.calculateHistoricalVolatility(prices);

        expect(vol).toBeGreaterThan(0);
        expect(vol).toBeLessThan(2); // Reasonable bounds
    });

    it('should throw for less than 2 prices', () => {
        expect(() => OptionPricing.calculateHistoricalVolatility([100]))
            .toThrow();
    });

    it('should return 0 for constant prices', () => {
        const prices = [100, 100, 100, 100, 100];
        const vol = OptionPricing.calculateHistoricalVolatility(prices);
        expect(vol).toBe(0);
    });

    it('should return higher volatility for more volatile prices', () => {
        const calm = [100, 101, 100, 101, 100];
        const volatile = [100, 110, 90, 120, 80];

        const calmVol = OptionPricing.calculateHistoricalVolatility(calm);
        const volatileVol = OptionPricing.calculateHistoricalVolatility(volatile);

        expect(volatileVol).toBeGreaterThan(calmVol);
    });
});

describe('OptionPricing.calculateImpliedVolatility', () => {
    it('should find IV that prices back to market price', () => {
        const spot = 100;
        const strike = 105;
        const timeToExpiry = 0.25;
        const riskFreeRate = 0.05;

        // First, calculate a price with known vol
        const knownVol = 0.3;
        const prices = OptionPricing.blackScholes({
            spot,
            strike,
            timeToExpiry,
            riskFreeRate,
            volatility: knownVol,
        });

        // Now find IV from that price
        const impliedVol = OptionPricing.calculateImpliedVolatility(
            prices.call,
            spot,
            strike,
            timeToExpiry,
            riskFreeRate,
            'call'
        );

        expect(impliedVol).toBeCloseTo(knownVol, 4);
    });

    it('should work for put options', () => {
        const spot = 100;
        const strike = 95;
        const timeToExpiry = 0.25;
        const riskFreeRate = 0.05;
        const knownVol = 0.25;

        const prices = OptionPricing.blackScholes({
            spot,
            strike,
            timeToExpiry,
            riskFreeRate,
            volatility: knownVol,
        });

        const impliedVol = OptionPricing.calculateImpliedVolatility(
            prices.put,
            spot,
            strike,
            timeToExpiry,
            riskFreeRate,
            'put'
        );

        expect(impliedVol).toBeCloseTo(knownVol, 4);
    });
});
