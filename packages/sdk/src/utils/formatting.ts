/**
 * OptionsFi SDK - Formatting Utilities
 */

import { TOKEN_DECIMALS } from '../constants';

/**
 * Format a token amount from smallest unit to human-readable string
 * 
 * @param amount - Amount in smallest unit (e.g., lamports)
 * @param decimals - Token decimals
 * @param maxDecimals - Maximum decimals to display (default: 2)
 * @returns Formatted string
 * 
 * @example
 * formatTokenAmount(1500000n, 6); // "1.50"
 * formatTokenAmount(1234567890n, 9); // "1.23"
 */
export function formatTokenAmount(
    amount: bigint,
    decimals: number,
    maxDecimals: number = 2
): string {
    const divisor = BigInt(10 ** decimals);
    const intPart = amount / divisor;
    const fracPart = amount % divisor;

    // Pad fractional part with leading zeros
    const fracStr = fracPart.toString().padStart(decimals, '0');
    const truncatedFrac = fracStr.slice(0, maxDecimals);

    if (maxDecimals === 0 || parseInt(truncatedFrac) === 0) {
        return intPart.toString();
    }

    // Trim trailing zeros
    const trimmedFrac = truncatedFrac.replace(/0+$/, '');
    return trimmedFrac ? `${intPart}.${trimmedFrac}` : intPart.toString();
}

/**
 * Parse a human-readable token amount to smallest unit
 * 
 * @param amount - Human-readable amount (e.g., "1.5")
 * @param decimals - Token decimals
 * @returns Amount in smallest unit
 * 
 * @example
 * parseTokenAmount("1.5", 6); // 1500000n
 * parseTokenAmount("100", 6); // 100000000n
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
    const parts = amount.split('.');
    const intPart = parts[0] || '0';
    let fracPart = parts[1] || '';

    // Pad or truncate fractional part
    fracPart = fracPart.slice(0, decimals).padEnd(decimals, '0');

    return BigInt(intPart) * BigInt(10 ** decimals) + BigInt(fracPart);
}

/**
 * Format USDC amount (6 decimals)
 */
export function formatUSDC(amount: bigint, maxDecimals: number = 2): string {
    return formatTokenAmount(amount, TOKEN_DECIMALS.USDC, maxDecimals);
}

/**
 * Parse USDC amount to smallest unit
 */
export function parseUSDC(amount: string): bigint {
    return parseTokenAmount(amount, TOKEN_DECIMALS.USDC);
}

/**
 * Format a price in USD with appropriate precision
 * 
 * @param price - Price as number
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted price string
 */
export function formatPrice(price: number, decimals: number = 2): string {
    return price.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format a percentage
 * 
 * @param value - Decimal value (e.g., 0.15 for 15%)
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format basis points
 * 
 * @param bps - Basis points value
 * @returns Formatted string with "bps" suffix
 */
export function formatBps(bps: number): string {
    return `${bps.toLocaleString()} bps`;
}

/**
 * Convert basis points to percentage
 */
export function bpsToPercent(bps: number): number {
    return bps / 100;
}

/**
 * Convert percentage to basis points
 */
export function percentToBps(percent: number): number {
    return Math.round(percent * 100);
}

/**
 * Format a Unix timestamp to ISO date string
 * 
 * @param timestamp - Unix timestamp (seconds)
 * @returns ISO date string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
}

/**
 * Format a Unix timestamp to human-readable date
 * 
 * @param timestamp - Unix timestamp (seconds)
 * @param options - Intl.DateTimeFormat options
 * @returns Localized date string
 */
export function formatDate(
    timestamp: number,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
): string {
    return new Date(timestamp * 1000).toLocaleString('en-US', options);
}

/**
 * Format time until expiry
 * 
 * @param expiryTimestamp - Expiry Unix timestamp (seconds)
 * @returns Human-readable duration string
 */
export function formatTimeToExpiry(expiryTimestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = expiryTimestamp - now;

    if (secondsRemaining <= 0) {
        return 'Expired';
    }

    const days = Math.floor(secondsRemaining / 86400);
    const hours = Math.floor((secondsRemaining % 86400) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Shorten a public key for display
 * 
 * @param address - Full public key string
 * @param chars - Characters to show on each end (default: 4)
 * @returns Shortened address (e.g., "ABCD...WXYZ")
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (address.length <= chars * 2 + 3) {
        return address;
    }
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format an RFQ ID for display
 * 
 * @param rfqId - Full RFQ ID
 * @returns Shortened ID
 */
export function formatRFQId(rfqId: string): string {
    // RFQ IDs are typically "rfq_timestamp_random"
    const parts = rfqId.split('_');
    if (parts.length >= 3) {
        return `RFQ-${parts[2].toUpperCase()}`;
    }
    return rfqId.slice(0, 12);
}
