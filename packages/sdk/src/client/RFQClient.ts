/**
 * OptionsFi SDK - RFQ Client
 * 
 * Main client for interacting with the OptionsFi RFQ infrastructure.
 * Connects to the RFQ router via WebSocket to create RFQs, receive quotes,
 * and execute options trades.
 * 
 * @example
 * ```typescript
 * import { RFQClient, DEVNET_CONFIG } from '@optionsfi/sdk';
 * 
 * const client = new RFQClient(DEVNET_CONFIG);
 * await client.connect();
 * 
 * const rfqId = await client.createRFQ({
 *   asset: 'NVDAX',
 *   side: 'sell',
 *   optionType: 'call',
 *   strike: 150,
 *   expiry: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
 *   quantity: BigInt(1000 * 1e6),
 *   vaultAddress: 'your-vault-address',
 * });
 * 
 * client.subscribeToQuotes(rfqId, (quote) => {
 *   console.log('Received quote:', quote);
 * });
 * ```
 */

import WebSocket from 'ws';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';
import type { RFQConfig, RFQParams, Quote, RFQ, RFQEvent } from '../types';
import { RFQ_DEFAULTS } from '../constants/config';

/**
 * RFQ Client for interacting with OptionsFi infrastructure
 */
export class RFQClient {
    private connection: Connection;
    private wsConnection: WebSocket | null = null;
    private config: RFQConfig;
    private quoteCallbacks: Map<string, (quote: Quote) => void> = new Map();
    private eventCallbacks: Set<(event: RFQEvent) => void> = new Set();
    private activeRFQs: Map<string, RFQ> = new Map();
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    /**
     * Create a new RFQ Client
     * 
     * @param config - Configuration for connecting to OptionsFi
     */
    constructor(config: RFQConfig) {
        this.config = {
            ...config,
            rfqTimeoutMs: config.rfqTimeoutMs ?? RFQ_DEFAULTS.timeoutMs,
        };
        this.connection = new Connection(config.rpcUrl, 'confirmed');
    }

    /**
     * Connect to the RFQ router WebSocket
     * 
     * @returns Promise that resolves when connected
     * @throws Error if connection fails
     */
    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.wsConnection = new WebSocket(this.config.rfqRouterUrl);

                this.wsConnection.on('open', () => {
                    console.log('Connected to OptionsFi RFQ Router');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    resolve();
                });

                this.wsConnection.on('message', (data: Buffer) => {
                    try {
                        const message = JSON.parse(data.toString());
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                });

                this.wsConnection.on('error', (error) => {
                    console.error('WebSocket error:', error);
                    this.emitEvent({
                        type: 'connection_error',
                        rfqId: '',
                        data: error,
                        timestamp: Date.now(),
                    });
                    if (!this.isConnected) {
                        reject(error);
                    }
                });

                this.wsConnection.on('close', () => {
                    console.log('WebSocket connection closed');
                    this.isConnected = false;
                    this.attemptReconnect();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Disconnect from the RFQ router
     */
    disconnect(): void {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
            this.isConnected = false;
        }
    }

    /**
     * Check if the client is connected
     */
    get connected(): boolean {
        return this.isConnected;
    }

    /**
     * Create a new RFQ and broadcast to market makers
     * 
     * @param params - RFQ parameters
     * @returns RFQ ID
     * @throws Error if not connected or params invalid
     */
    async createRFQ(params: RFQParams): Promise<string> {
        if (!this.wsConnection || !this.isConnected) {
            throw new Error('Not connected. Call connect() first.');
        }

        // Validate parameters
        this.validateRFQParams(params);

        // Generate RFQ ID
        const rfqId = this.generateRFQId();

        // Create RFQ record
        const rfq: RFQ = {
            id: rfqId,
            params,
            quotes: [],
            status: 'open',
            createdAt: Date.now(),
        };
        this.activeRFQs.set(rfqId, rfq);

        // Send to RFQ router
        const message = {
            type: 'create_rfq',
            rfqId,
            underlying: params.asset,
            optionType: params.optionType,
            strike: params.strike,
            expiry: params.expiry,
            size: params.quantity.toString(),
            premiumFloor: params.premiumFloor?.toString() ?? '0',
            timestamp: Date.now(),
        };

        this.wsConnection.send(JSON.stringify(message));

        return rfqId;
    }

    /**
     * Subscribe to quotes for a specific RFQ
     * 
     * @param rfqId - RFQ to subscribe to
     * @param callback - Called when a quote is received
     */
    subscribeToQuotes(rfqId: string, callback: (quote: Quote) => void): void {
        this.quoteCallbacks.set(rfqId, callback);

        // Request subscription from router
        if (this.wsConnection && this.isConnected) {
            this.wsConnection.send(JSON.stringify({
                type: 'subscribe_quotes',
                rfqId,
            }));
        }
    }

    /**
     * Unsubscribe from quotes for an RFQ
     * 
     * @param rfqId - RFQ to unsubscribe from
     */
    unsubscribeFromQuotes(rfqId: string): void {
        this.quoteCallbacks.delete(rfqId);
    }

    /**
     * Accept a quote and execute the option trade
     * 
     * @param rfqId - RFQ ID
     * @param quoteId - Quote to accept
     * @param wallet - Solana wallet for signing
     * @returns Transaction signature
     */
    async executeOption(
        rfqId: string,
        quoteId: string,
        wallet: { signTransaction: (tx: Transaction) => Promise<Transaction> }
    ): Promise<string> {
        const rfq = this.activeRFQs.get(rfqId);
        if (!rfq) {
            throw new Error(`RFQ ${rfqId} not found`);
        }

        const quote = rfq.quotes.find(q => q.id === quoteId);
        if (!quote) {
            throw new Error(`Quote ${quoteId} not found in RFQ ${rfqId}`);
        }

        // Notify RFQ router of acceptance
        if (this.wsConnection && this.isConnected) {
            this.wsConnection.send(JSON.stringify({
                type: 'accept_quote',
                rfqId,
                quoteId,
            }));
        }

        // Build and send on-chain transaction
        const tx = await this.buildExecutionTransaction(rfq, quote);
        const signedTx = await wallet.signTransaction(tx);
        const signature = await this.connection.sendRawTransaction(
            signedTx.serialize()
        );
        await this.connection.confirmTransaction(signature, 'confirmed');

        // Update RFQ status
        rfq.status = 'filled';
        rfq.fill = {
            quoteId,
            marketMaker: quote.marketMaker,
            premium: quote.premium,
            filledAt: Date.now(),
            transactionSignature: signature,
        };

        return signature;
    }

    /**
     * Cancel an open RFQ
     * 
     * @param rfqId - RFQ to cancel
     */
    async cancelRFQ(rfqId: string): Promise<void> {
        const rfq = this.activeRFQs.get(rfqId);
        if (!rfq) {
            throw new Error(`RFQ ${rfqId} not found`);
        }

        if (rfq.status !== 'open') {
            throw new Error(`Cannot cancel RFQ with status: ${rfq.status}`);
        }

        if (this.wsConnection && this.isConnected) {
            this.wsConnection.send(JSON.stringify({
                type: 'cancel_rfq',
                rfqId,
            }));
        }

        rfq.status = 'cancelled';
        this.quoteCallbacks.delete(rfqId);
    }

    /**
     * Get an active RFQ by ID
     * 
     * @param rfqId - RFQ ID
     * @returns RFQ or undefined
     */
    getRFQ(rfqId: string): RFQ | undefined {
        return this.activeRFQs.get(rfqId);
    }

    /**
     * Get all active RFQs
     */
    getAllRFQs(): RFQ[] {
        return Array.from(this.activeRFQs.values());
    }

    /**
     * Subscribe to all RFQ events
     * 
     * @param callback - Called for each event
     * @returns Unsubscribe function
     */
    onEvent(callback: (event: RFQEvent) => void): () => void {
        this.eventCallbacks.add(callback);
        return () => this.eventCallbacks.delete(callback);
    }

    // ============================================================================
    // Private Methods
    // ============================================================================

    private handleMessage(message: any): void {
        if (message.type === 'quote' && message.rfqId) {
            const quote: Quote = {
                id: message.quoteId || `quote_${Date.now()}`,
                rfqId: message.rfqId,
                marketMaker: message.maker,
                premium: BigInt(message.premium),
                timestamp: Date.now(),
                expiresAt: message.expiresAt || Date.now() + 60000,
            };

            // Store quote in RFQ
            const rfq = this.activeRFQs.get(message.rfqId);
            if (rfq && rfq.status === 'open') {
                rfq.quotes.push(quote);
            }

            // Call quote callback
            const callback = this.quoteCallbacks.get(message.rfqId);
            if (callback) {
                callback(quote);
            }

            // Emit event
            this.emitEvent({
                type: 'quote_received',
                rfqId: message.rfqId,
                data: quote,
                timestamp: Date.now(),
            });
        } else if (message.type === 'fill' && message.rfqId) {
            const rfq = this.activeRFQs.get(message.rfqId);
            if (rfq) {
                rfq.status = 'filled';
                this.emitEvent({
                    type: 'rfq_filled',
                    rfqId: message.rfqId,
                    data: rfq,
                    timestamp: Date.now(),
                });
            }
        }
    }

    private emitEvent(event: RFQEvent): void {
        for (const callback of this.eventCallbacks) {
            try {
                callback(event);
            } catch (error) {
                console.error('Event callback error:', error);
            }
        }
    }

    private validateRFQParams(params: RFQParams): void {
        if (!params.asset || params.asset.length === 0) {
            throw new Error('Asset is required');
        }
        if (params.quantity <= 0) {
            throw new Error('Quantity must be positive');
        }
        if (params.strike <= 0) {
            throw new Error('Strike must be positive');
        }
        if (params.expiry <= Math.floor(Date.now() / 1000)) {
            throw new Error('Expiry must be in the future');
        }
        if (!['call', 'put'].includes(params.optionType)) {
            throw new Error('Option type must be "call" or "put"');
        }
        if (!['buy', 'sell'].includes(params.side)) {
            throw new Error('Side must be "buy" or "sell"');
        }
    }

    private generateRFQId(): string {
        return `rfq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    private async buildExecutionTransaction(
        rfq: RFQ,
        quote: Quote
    ): Promise<Transaction> {
        // TODO: Build actual Solana transaction calling vault program
        // This requires:
        // 1. Record notional exposure on vault
        // 2. Trigger premium collection
        // The exact implementation depends on the vault's instruction interface
        throw new Error(
            'Transaction building not yet implemented. ' +
            'Use VaultInstructions class to build transactions manually.'
        );
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

        console.log(`Attempting reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            this.connect().catch(error => {
                console.error('Reconnection failed:', error);
            });
        }, delay);
    }
}
