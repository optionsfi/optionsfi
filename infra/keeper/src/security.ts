/**
 * Security helpers for Keeper service
 * 
 * Lightweight security utilities for the keeper service including:
 * - Input validation
 * - Logging
 * - Error handling
 */

import winston from 'winston';

// Configure logger
export const securityLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

/**
 * Validate asset ID format
 */
export function validateAssetId(assetId: string): boolean {
    // Asset ID should be alphanumeric with optional underscores/hyphens
    const regex = /^[A-Za-z0-9_-]{1,32}$/;
    return regex.test(assetId);
}

/**
 * Validate Solana address
 */
export function validateSolanaAddress(address: string): boolean {
    // Basic Solana address format check (base58, 32-44 characters)
    const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return regex.test(address);
}

/**
 * Validate amount (must be positive and within safe range)
 */
export function validateAmount(amount: number | bigint): boolean {
    try {
        const num = typeof amount === 'bigint' ? Number(amount) : amount;
        return num > 0 && num <= Number.MAX_SAFE_INTEGER;
    } catch {
        return false;
    }
}

/**
 * Validate strike price
 */
export function validateStrike(strike: number): boolean {
    return strike > 0 && strike < 1000000;
}

/**
 * Validate expiry timestamp
 */
export function validateExpiry(expiry: number): boolean {
    const now = Date.now() / 1000;
    const maxExpiry = now + (365 * 24 * 60 * 60); // 1 year max
    return expiry > now && expiry < maxExpiry;
}

/**
 * Log security event
 */
export function logSecurityEvent(
    type: string,
    level: 'info' | 'warn' | 'error',
    details: Record<string, any>
): void {
    securityLogger[level]('Security event', {
        type,
        timestamp: Date.now(),
        ...details
    });
}

/**
 * Sanitize error message for logging (remove sensitive data)
 */
export function sanitizeError(error: any): Record<string, any> {
    return {
        message: error.message || String(error),
        type: error.constructor?.name || 'Error',
        // Don't include stack traces in production
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    };
}

/**
 * Validate RFQ parameters before creating
 */
export interface RFQParams {
    assetId: string;
    strike: number;
    expiry: number;
    notional: number;
    vaultAddress: string;
}

export function validateRFQParams(params: RFQParams): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!validateAssetId(params.assetId)) {
        errors.push('Invalid asset ID format');
    }

    if (!validateStrike(params.strike)) {
        errors.push('Invalid strike price');
    }

    if (!validateExpiry(params.expiry)) {
        errors.push('Invalid expiry timestamp');
    }

    if (!validateAmount(params.notional)) {
        errors.push('Invalid notional amount');
    }

    if (!validateSolanaAddress(params.vaultAddress)) {
        errors.push('Invalid vault address');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Rate limit checker for keeper operations
 * Prevents keeper from spamming the network
 */
export class KeeperRateLimiter {
    private lastRun: Map<string, number> = new Map();
    private minIntervalMs: number;

    constructor(minIntervalMs: number = 60000) { // 1 minute default
        this.minIntervalMs = minIntervalMs;
    }

    canRun(operationId: string): boolean {
        const lastRun = this.lastRun.get(operationId);
        const now = Date.now();

        if (!lastRun || now - lastRun >= this.minIntervalMs) {
            this.lastRun.set(operationId, now);
            return true;
        }

        return false;
    }

    getTimeUntilNext(operationId: string): number {
        const lastRun = this.lastRun.get(operationId);
        if (!lastRun) return 0;

        const elapsed = Date.now() - lastRun;
        return Math.max(0, this.minIntervalMs - elapsed);
    }
}
