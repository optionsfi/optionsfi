/**
 * RFQ Client Tests
 * 
 * These tests focus on the RFQClient's validation and error handling.
 * WebSocket integration tests would require mocking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RFQClient } from '../src/client/RFQClient';
import { DEVNET_CONFIG } from '../src/constants';
import type { RFQParams } from '../src/types';

describe('RFQClient', () => {
    let client: RFQClient;

    beforeEach(() => {
        client = new RFQClient(DEVNET_CONFIG);
    });

    describe('constructor', () => {
        it('should create instance with config', () => {
            expect(client).toBeInstanceOf(RFQClient);
        });

        it('should not be connected initially', () => {
            expect(client.connected).toBe(false);
        });

        it('should use default timeout if not specified', () => {
            const clientWithoutTimeout = new RFQClient({
                ...DEVNET_CONFIG,
                rfqTimeoutMs: undefined,
            });
            expect(clientWithoutTimeout).toBeInstanceOf(RFQClient);
        });
    });

    describe('createRFQ validation', () => {
        const validParams: RFQParams = {
            asset: 'NVDAX',
            side: 'sell',
            optionType: 'call',
            strike: 150,
            expiry: Math.floor(Date.now() / 1000) + 86400,
            quantity: BigInt(1000 * 1e6),
            vaultAddress: 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94',
        };

        it('should throw when not connected', async () => {
            await expect(client.createRFQ(validParams))
                .rejects.toThrow('Not connected');
        });

        // Note: Additional validation tests are in validation.test.ts
        // These test the integration with RFQClient
    });

    describe('RFQ management', () => {
        it('should return undefined for non-existent RFQ', () => {
            expect(client.getRFQ('non-existent')).toBeUndefined();
        });

        it('should return empty array when no RFQs', () => {
            expect(client.getAllRFQs()).toEqual([]);
        });
    });

    describe('quote subscription', () => {
        it('should allow subscribing to quotes', () => {
            const callback = vi.fn();
            client.subscribeToQuotes('test-rfq', callback);
            // Subscription is stored but nothing happens until WS is connected
            expect(callback).not.toHaveBeenCalled();
        });

        it('should allow unsubscribing from quotes', () => {
            const callback = vi.fn();
            client.subscribeToQuotes('test-rfq', callback);
            client.unsubscribeFromQuotes('test-rfq');
            // Should not throw
        });
    });

    describe('event subscription', () => {
        it('should return unsubscribe function', () => {
            const callback = vi.fn();
            const unsubscribe = client.onEvent(callback);

            expect(typeof unsubscribe).toBe('function');

            // Should not throw when unsubscribing
            unsubscribe();
        });
    });

    describe('cancelRFQ', () => {
        it('should throw for non-existing RFQ', async () => {
            await expect(client.cancelRFQ('non-existent'))
                .rejects.toThrow('not found');
        });
    });

    describe('executeOption', () => {
        it('should throw for non-existing RFQ', async () => {
            const mockWallet = {
                signTransaction: vi.fn(),
            };

            await expect(client.executeOption('non-existent', 'quote-1', mockWallet))
                .rejects.toThrow('not found');
        });
    });

    describe('disconnect', () => {
        it('should not throw when not connected', () => {
            expect(() => client.disconnect()).not.toThrow();
            expect(client.connected).toBe(false);
        });
    });
});

describe('RFQClient config', () => {
    it('should use mainnet config', async () => {
        const { MAINNET_CONFIG } = await import('../src/constants');
        const client = new RFQClient(MAINNET_CONFIG);
        expect(client).toBeInstanceOf(RFQClient);
    });

    it('should allow custom config', () => {
        const customConfig = {
            rpcUrl: 'https://custom-rpc.com',
            rfqRouterUrl: 'wss://custom-router.com',
            programId: 'CustomProgramId111111111111111111111111111',
            network: 'devnet' as const,
            rfqTimeoutMs: 60000,
        };
        const client = new RFQClient(customConfig);
        expect(client).toBeInstanceOf(RFQClient);
    });
});
