/**
 * OptionsFi SDK - RFQ Types
 * 
 * Types for Request for Quote (RFQ) operations.
 */

/**
 * Configuration for connecting to the OptionsFi RFQ infrastructure
 */
export interface RFQConfig {
    /** Solana RPC URL */
    rpcUrl: string;

    /** WebSocket URL for the RFQ router (e.g., wss://rfq.optionsfi.xyz) */
    rfqRouterUrl: string;

    /** OptionsFi vault program ID */
    programId: string;

    /** Network environment */
    network?: 'devnet' | 'mainnet-beta';

    /** Optional timeout for RFQ requests in milliseconds (default: 30000) */
    rfqTimeoutMs?: number;
}

/**
 * Parameters for creating a new RFQ
 */
export interface RFQParams {
    /** Asset identifier (e.g., "NVDAX", "SOL") */
    asset: string;

    /** Whether the protocol is buying or selling options */
    side: 'buy' | 'sell';

    /** Type of option */
    optionType: 'call' | 'put';

    /** Strike price in USD (e.g., 150.00) */
    strike: number;

    /** Expiry timestamp (Unix seconds) */
    expiry: number;

    /** Notional quantity in base asset tokens (scaled by decimals) */
    quantity: bigint;

    /** Vault address making the request */
    vaultAddress: string;

    /** Minimum acceptable premium (optional floor) */
    premiumFloor?: bigint;
}

/**
 * A quote from a market maker
 */
export interface Quote {
    /** Unique quote identifier */
    id: string;

    /** RFQ this quote is for */
    rfqId: string;

    /** Market maker identifier */
    marketMaker: string;

    /** Premium amount in USDC (scaled by decimals, typically 6) */
    premium: bigint;

    /** Quote timestamp (Unix milliseconds) */
    timestamp: number;

    /** When this quote expires (Unix milliseconds) */
    expiresAt: number;
}

/**
 * RFQ status and state
 */
export interface RFQ {
    /** Unique RFQ identifier */
    id: string;

    /** Original RFQ parameters */
    params: RFQParams;

    /** All quotes received */
    quotes: Quote[];

    /** Current status */
    status: 'open' | 'filled' | 'cancelled' | 'expired';

    /** Fill details if filled */
    fill?: {
        quoteId: string;
        marketMaker: string;
        premium: bigint;
        filledAt: number;
        transactionSignature?: string;
    };

    /** Creation timestamp (Unix milliseconds) */
    createdAt: number;
}

/**
 * RFQ event types for subscription callbacks
 */
export type RFQEventType =
    | 'quote_received'
    | 'rfq_filled'
    | 'rfq_cancelled'
    | 'rfq_expired'
    | 'connection_error';

/**
 * RFQ event payload
 */
export interface RFQEvent {
    type: RFQEventType;
    rfqId: string;
    data: Quote | RFQ | Error;
    timestamp: number;
}
