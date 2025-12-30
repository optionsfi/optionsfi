/**
 * Formatting Utility Tests
 */

import { describe, it, expect } from 'vitest';
import {
    formatTokenAmount,
    parseTokenAmount,
    formatUSDC,
    parseUSDC,
    formatPrice,
    formatPercent,
    formatBps,
    bpsToPercent,
    percentToBps,
    formatTimestamp,
    formatTimeToExpiry,
    shortenAddress,
    formatRFQId,
} from '../src/utils/formatting';

describe('formatTokenAmount', () => {
    it('should format USDC amounts correctly (6 decimals)', () => {
        expect(formatTokenAmount(1500000n, 6)).toBe('1.5');
        expect(formatTokenAmount(1000000n, 6)).toBe('1');
        expect(formatTokenAmount(1234567n, 6)).toBe('1.23');
    });

    it('should format SOL amounts correctly (9 decimals)', () => {
        expect(formatTokenAmount(1500000000n, 9)).toBe('1.5');
        expect(formatTokenAmount(1000000000n, 9)).toBe('1');
    });

    it('should respect maxDecimals parameter', () => {
        expect(formatTokenAmount(1234567n, 6, 4)).toBe('1.2345');
        expect(formatTokenAmount(1234567n, 6, 0)).toBe('1');
    });

    it('should handle zero', () => {
        expect(formatTokenAmount(0n, 6)).toBe('0');
    });

    it('should handle amounts less than 1', () => {
        expect(formatTokenAmount(500000n, 6)).toBe('0.5');
        expect(formatTokenAmount(10000n, 6)).toBe('0.01');
    });

    it('should trim trailing zeros', () => {
        expect(formatTokenAmount(1000000n, 6, 6)).toBe('1');
        expect(formatTokenAmount(1100000n, 6, 6)).toBe('1.1');
    });
});

describe('parseTokenAmount', () => {
    it('should parse whole numbers', () => {
        expect(parseTokenAmount('1', 6)).toBe(1000000n);
        expect(parseTokenAmount('100', 6)).toBe(100000000n);
    });

    it('should parse decimal numbers', () => {
        expect(parseTokenAmount('1.5', 6)).toBe(1500000n);
        expect(parseTokenAmount('1.23', 6)).toBe(1230000n);
        expect(parseTokenAmount('0.5', 6)).toBe(500000n);
    });

    it('should truncate extra decimals', () => {
        expect(parseTokenAmount('1.1234567', 6)).toBe(1123456n);
    });

    it('should handle zero', () => {
        expect(parseTokenAmount('0', 6)).toBe(0n);
        expect(parseTokenAmount('0.0', 6)).toBe(0n);
    });
});

describe('formatUSDC / parseUSDC', () => {
    it('should format and parse consistently', () => {
        const original = 1234560n;
        const formatted = formatUSDC(original, 6);
        const parsed = parseUSDC(formatted);
        expect(parsed).toBe(1234560n);
    });

    it('should format USDC with default 2 decimals', () => {
        expect(formatUSDC(1534567n)).toBe('1.53');
    });
});

describe('formatPrice', () => {
    it('should format prices with commas', () => {
        expect(formatPrice(1234.56)).toBe('1,234.56');
        expect(formatPrice(1000000)).toBe('1,000,000.00');
    });

    it('should respect decimals parameter', () => {
        expect(formatPrice(1.5, 0)).toBe('2');
        expect(formatPrice(1.5, 4)).toBe('1.5000');
    });
});

describe('formatPercent', () => {
    it('should format percentages correctly', () => {
        expect(formatPercent(0.15)).toBe('15.00%');
        expect(formatPercent(0.0525)).toBe('5.25%');
        expect(formatPercent(1)).toBe('100.00%');
    });

    it('should respect decimals parameter', () => {
        expect(formatPercent(0.12345, 3)).toBe('12.345%');
        expect(formatPercent(0.12345, 0)).toBe('12%');
    });
});

describe('formatBps', () => {
    it('should format basis points with suffix', () => {
        expect(formatBps(500)).toBe('500 bps');
        expect(formatBps(1000)).toBe('1,000 bps');
    });
});

describe('bpsToPercent / percentToBps', () => {
    it('should convert bps to percent', () => {
        expect(bpsToPercent(100)).toBe(1);
        expect(bpsToPercent(50)).toBe(0.5);
        expect(bpsToPercent(500)).toBe(5);
    });

    it('should convert percent to bps', () => {
        expect(percentToBps(1)).toBe(100);
        expect(percentToBps(0.5)).toBe(50);
        expect(percentToBps(5)).toBe(500);
    });

    it('should be inverse operations', () => {
        expect(bpsToPercent(percentToBps(5.5))).toBeCloseTo(5.5);
        expect(percentToBps(bpsToPercent(550))).toBe(550);
    });
});

describe('formatTimestamp', () => {
    it('should format timestamp to ISO string', () => {
        const timestamp = 1703865600; // 2023-12-29T12:00:00Z
        const result = formatTimestamp(timestamp);
        expect(result).toMatch(/2023-12-29/);
    });
});

describe('formatTimeToExpiry', () => {
    const now = Math.floor(Date.now() / 1000);

    it('should return "Expired" for past timestamps', () => {
        expect(formatTimeToExpiry(now - 3600)).toBe('Expired');
    });

    it('should format minutes for short durations', () => {
        const result = formatTimeToExpiry(now + 30 * 60); // 30 minutes
        expect(result).toBe('30m');
    });

    it('should format hours and minutes', () => {
        const result = formatTimeToExpiry(now + 90 * 60); // 1.5 hours
        expect(result).toBe('1h 30m');
    });

    it('should format days and hours', () => {
        const result = formatTimeToExpiry(now + 36 * 60 * 60); // 36 hours
        expect(result).toBe('1d 12h');
    });
});

describe('shortenAddress', () => {
    const fullAddress = 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94';

    it('should shorten address with default 4 chars', () => {
        const result = shortenAddress(fullAddress);
        expect(result).toBe('A4jg...Fo94');
    });

    it('should respect custom chars parameter', () => {
        const result = shortenAddress(fullAddress, 6);
        expect(result).toBe('A4jgqc...UGFo94');
    });

    it('should return full address if too short', () => {
        const result = shortenAddress('ABCD1234', 4);
        expect(result).toBe('ABCD1234');
    });
});

describe('formatRFQId', () => {
    it('should format standard RFQ IDs', () => {
        const rfqId = 'rfq_1703865600000_abc123';
        const result = formatRFQId(rfqId);
        expect(result).toBe('RFQ-ABC123');
    });

    it('should handle non-standard IDs', () => {
        const rfqId = 'someOtherId';
        const result = formatRFQId(rfqId);
        expect(result).toBe('someOtherId');
    });
});
