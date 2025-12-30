/**
 * Validation Utility Tests
 */

import { describe, it, expect } from 'vitest';
import {
    ValidationError,
    validateRFQParams,
    validateBlackScholesParams,
    validatePublicKey,
    validateTokenAmount,
    validateTimestamp,
} from '../src/utils/validation';
import type { RFQParams, BlackScholesParams } from '../src/types';

describe('validateRFQParams', () => {
    const validParams: RFQParams = {
        asset: 'NVDAX',
        side: 'sell',
        optionType: 'call',
        strike: 150,
        expiry: Math.floor(Date.now() / 1000) + 86400, // 1 day in future
        quantity: BigInt(1000 * 1e6),
        vaultAddress: 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94',
    };

    it('should pass for valid parameters', () => {
        expect(() => validateRFQParams(validParams)).not.toThrow();
    });

    it('should throw for empty asset', () => {
        expect(() => validateRFQParams({ ...validParams, asset: '' }))
            .toThrow(ValidationError);
    });

    it('should throw for whitespace-only asset', () => {
        expect(() => validateRFQParams({ ...validParams, asset: '   ' }))
            .toThrow(ValidationError);
    });

    it('should throw for invalid side', () => {
        expect(() => validateRFQParams({ ...validParams, side: 'hold' as any }))
            .toThrow(ValidationError);
    });

    it('should throw for invalid option type', () => {
        expect(() => validateRFQParams({ ...validParams, optionType: 'straddle' as any }))
            .toThrow(ValidationError);
    });

    it('should throw for zero strike', () => {
        expect(() => validateRFQParams({ ...validParams, strike: 0 }))
            .toThrow(ValidationError);
    });

    it('should throw for negative strike', () => {
        expect(() => validateRFQParams({ ...validParams, strike: -100 }))
            .toThrow(ValidationError);
    });

    it('should throw for past expiry', () => {
        const pastExpiry = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
        expect(() => validateRFQParams({ ...validParams, expiry: pastExpiry }))
            .toThrow(ValidationError);
    });

    it('should throw for zero quantity', () => {
        expect(() => validateRFQParams({ ...validParams, quantity: 0n }))
            .toThrow(ValidationError);
    });

    it('should throw for negative quantity', () => {
        expect(() => validateRFQParams({ ...validParams, quantity: -100n }))
            .toThrow(ValidationError);
    });

    it('should throw for invalid vault address', () => {
        expect(() => validateRFQParams({ ...validParams, vaultAddress: 'abc' }))
            .toThrow(ValidationError);
    });

    it('should throw for negative premium floor', () => {
        expect(() => validateRFQParams({ ...validParams, premiumFloor: -1n }))
            .toThrow(ValidationError);
    });

    it('should pass with zero premium floor', () => {
        expect(() => validateRFQParams({ ...validParams, premiumFloor: 0n }))
            .not.toThrow();
    });

    it('should include field name in error message', () => {
        try {
            validateRFQParams({ ...validParams, strike: -1 });
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect((error as ValidationError).field).toBe('strike');
        }
    });
});

describe('validateBlackScholesParams', () => {
    const validParams: BlackScholesParams = {
        spot: 145.50,
        strike: 150,
        timeToExpiry: 0.0833, // ~1 month
        riskFreeRate: 0.05,
        volatility: 0.45,
    };

    it('should pass for valid parameters', () => {
        expect(() => validateBlackScholesParams(validParams)).not.toThrow();
    });

    it('should throw for zero spot', () => {
        expect(() => validateBlackScholesParams({ ...validParams, spot: 0 }))
            .toThrow(ValidationError);
    });

    it('should throw for negative spot', () => {
        expect(() => validateBlackScholesParams({ ...validParams, spot: -100 }))
            .toThrow(ValidationError);
    });

    it('should throw for zero strike', () => {
        expect(() => validateBlackScholesParams({ ...validParams, strike: 0 }))
            .toThrow(ValidationError);
    });

    it('should throw for zero time to expiry', () => {
        expect(() => validateBlackScholesParams({ ...validParams, timeToExpiry: 0 }))
            .toThrow(ValidationError);
    });

    it('should throw for negative time to expiry', () => {
        expect(() => validateBlackScholesParams({ ...validParams, timeToExpiry: -0.1 }))
            .toThrow(ValidationError);
    });

    it('should throw for zero volatility', () => {
        expect(() => validateBlackScholesParams({ ...validParams, volatility: 0 }))
            .toThrow(ValidationError);
    });

    it('should throw for unreasonably high volatility (>500%)', () => {
        expect(() => validateBlackScholesParams({ ...validParams, volatility: 6 }))
            .toThrow(ValidationError);
    });

    it('should throw for unreasonable risk-free rate', () => {
        expect(() => validateBlackScholesParams({ ...validParams, riskFreeRate: 2 }))
            .toThrow(ValidationError);
    });

    it('should allow negative risk-free rate (within bounds)', () => {
        expect(() => validateBlackScholesParams({ ...validParams, riskFreeRate: -0.05 }))
            .not.toThrow();
    });
});

describe('validatePublicKey', () => {
    it('should pass for valid base58 address', () => {
        expect(() => validatePublicKey('A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94'))
            .not.toThrow();
    });

    it('should pass for system program address', () => {
        expect(() => validatePublicKey('11111111111111111111111111111111'))
            .not.toThrow();
    });

    it('should throw for too short address', () => {
        expect(() => validatePublicKey('A4jgq'))
            .toThrow(ValidationError);
    });

    it('should throw for invalid characters (0, O, I, l)', () => {
        // Base58 doesn't include 0, O, I, l
        expect(() => validatePublicKey('0OIl111111111111111111111111111111'))
            .toThrow(ValidationError);
    });

    it('should include custom field name in error', () => {
        try {
            validatePublicKey('abc', 'vaultAddress');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect((error as ValidationError).field).toBe('vaultAddress');
        }
    });
});

describe('validateTokenAmount', () => {
    it('should pass for valid amount', () => {
        expect(() => validateTokenAmount(BigInt(1000 * 1e6))).not.toThrow();
    });

    it('should pass for zero amount', () => {
        expect(() => validateTokenAmount(0n)).not.toThrow();
    });

    it('should throw for negative amount', () => {
        expect(() => validateTokenAmount(-1n))
            .toThrow(ValidationError);
    });

    it('should throw for unreasonably large amount', () => {
        const hugeAmount = BigInt(1e30);
        expect(() => validateTokenAmount(hugeAmount))
            .toThrow(ValidationError);
    });
});

describe('validateTimestamp', () => {
    const now = Math.floor(Date.now() / 1000);

    it('should pass for valid timestamp', () => {
        expect(() => validateTimestamp(now)).not.toThrow();
    });

    it('should throw for negative timestamp', () => {
        expect(() => validateTimestamp(-1))
            .toThrow(ValidationError);
    });

    it('should throw for non-integer timestamp', () => {
        expect(() => validateTimestamp(123.456))
            .toThrow(ValidationError);
    });

    it('should throw for past timestamp when mustBeFuture is true', () => {
        expect(() => validateTimestamp(now - 3600, 'expiry', { mustBeFuture: true }))
            .toThrow(ValidationError);
    });

    it('should pass for future timestamp when mustBeFuture is true', () => {
        expect(() => validateTimestamp(now + 3600, 'expiry', { mustBeFuture: true }))
            .not.toThrow();
    });

    it('should throw when timestamp exceeds maxFutureDays', () => {
        const tenDaysFromNow = now + 10 * 24 * 60 * 60;
        expect(() => validateTimestamp(tenDaysFromNow, 'expiry', { maxFutureDays: 7 }))
            .toThrow(ValidationError);
    });

    it('should pass when timestamp within maxFutureDays', () => {
        const fiveDaysFromNow = now + 5 * 24 * 60 * 60;
        expect(() => validateTimestamp(fiveDaysFromNow, 'expiry', { maxFutureDays: 7 }))
            .not.toThrow();
    });
});
