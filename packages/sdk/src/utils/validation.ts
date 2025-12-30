/**
 * OptionsFi SDK - Input Validation Utilities
 */

import type { RFQParams, BlackScholesParams } from '../types';

/**
 * Validation error with detailed message
 */
export class ValidationError extends Error {
    readonly field: string;

    constructor(field: string, message: string) {
        super(`Validation error on '${field}': ${message}`);
        this.name = 'ValidationError';
        this.field = field;
    }
}

/**
 * Validate RFQ parameters
 * 
 * @param params - RFQ parameters to validate
 * @throws ValidationError if any parameter is invalid
 */
export function validateRFQParams(params: RFQParams): void {
    if (!params.asset || params.asset.trim().length === 0) {
        throw new ValidationError('asset', 'Asset identifier is required');
    }

    if (!['buy', 'sell'].includes(params.side)) {
        throw new ValidationError('side', 'Side must be "buy" or "sell"');
    }

    if (!['call', 'put'].includes(params.optionType)) {
        throw new ValidationError('optionType', 'Option type must be "call" or "put"');
    }

    if (params.strike <= 0) {
        throw new ValidationError('strike', 'Strike must be a positive number');
    }

    if (params.expiry <= Math.floor(Date.now() / 1000)) {
        throw new ValidationError('expiry', 'Expiry must be in the future');
    }

    if (params.quantity <= 0n) {
        throw new ValidationError('quantity', 'Quantity must be positive');
    }

    if (!params.vaultAddress || params.vaultAddress.length < 32) {
        throw new ValidationError('vaultAddress', 'Valid vault address is required');
    }

    if (params.premiumFloor !== undefined && params.premiumFloor < 0n) {
        throw new ValidationError('premiumFloor', 'Premium floor cannot be negative');
    }
}

/**
 * Validate Black-Scholes parameters
 * 
 * @param params - Black-Scholes parameters to validate
 * @throws ValidationError if any parameter is invalid
 */
export function validateBlackScholesParams(params: BlackScholesParams): void {
    if (params.spot <= 0) {
        throw new ValidationError('spot', 'Spot price must be positive');
    }

    if (params.strike <= 0) {
        throw new ValidationError('strike', 'Strike price must be positive');
    }

    if (params.timeToExpiry <= 0) {
        throw new ValidationError('timeToExpiry', 'Time to expiry must be positive');
    }

    if (params.volatility <= 0) {
        throw new ValidationError('volatility', 'Volatility must be positive');
    }

    if (params.volatility > 5) {
        throw new ValidationError('volatility', 'Volatility seems too high (>500%)');
    }

    if (params.riskFreeRate < -0.1 || params.riskFreeRate > 1) {
        throw new ValidationError('riskFreeRate', 'Risk-free rate seems unreasonable');
    }
}

/**
 * Validate a Solana public key string
 * 
 * @param address - Address string to validate
 * @param fieldName - Field name for error messages
 * @throws ValidationError if address is invalid
 */
export function validatePublicKey(address: string, fieldName: string = 'address'): void {
    // Base58 alphabet (no 0, O, I, l)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    if (!base58Regex.test(address)) {
        throw new ValidationError(fieldName, 'Invalid Solana public key format');
    }
}

/**
 * Validate that an amount is a valid token amount
 * 
 * @param amount - Amount to validate
 * @param fieldName - Field name for error messages
 * @param decimals - Token decimals (default: 6)
 * @throws ValidationError if amount is invalid
 */
export function validateTokenAmount(
    amount: bigint,
    fieldName: string = 'amount',
    decimals: number = 6
): void {
    if (amount < 0n) {
        throw new ValidationError(fieldName, 'Amount cannot be negative');
    }

    // Check for overflow (max reasonable amount)
    const maxReasonable = BigInt(1e15) * BigInt(10 ** decimals);
    if (amount > maxReasonable) {
        throw new ValidationError(fieldName, 'Amount seems unreasonably large');
    }
}

/**
 * Validate a Unix timestamp
 * 
 * @param timestamp - Timestamp to validate (seconds)
 * @param fieldName - Field name for error messages
 * @param options - Validation options
 * @throws ValidationError if timestamp is invalid
 */
export function validateTimestamp(
    timestamp: number,
    fieldName: string = 'timestamp',
    options: { mustBeFuture?: boolean; maxFutureDays?: number } = {}
): void {
    if (!Number.isInteger(timestamp) || timestamp < 0) {
        throw new ValidationError(fieldName, 'Invalid timestamp');
    }

    const now = Math.floor(Date.now() / 1000);

    if (options.mustBeFuture && timestamp <= now) {
        throw new ValidationError(fieldName, 'Timestamp must be in the future');
    }

    if (options.maxFutureDays) {
        const maxTimestamp = now + options.maxFutureDays * 24 * 60 * 60;
        if (timestamp > maxTimestamp) {
            throw new ValidationError(
                fieldName,
                `Timestamp cannot be more than ${options.maxFutureDays} days in the future`
            );
        }
    }
}
