/**
 * OptionsFi SDK - Option Types
 * 
 * Types for option pricing and parameters.
 */

/**
 * Option type (call or put)
 */
export type OptionType = 'call' | 'put';

/**
 * Parameters for Black-Scholes pricing
 */
export interface BlackScholesParams {
    /** Current underlying spot price */
    spot: number;

    /** Option strike price */
    strike: number;

    /** Time to expiry in years (e.g., 0.0833 for 1 month) */
    timeToExpiry: number;

    /** Risk-free rate as decimal (e.g., 0.05 for 5%) */
    riskFreeRate: number;

    /** Annualized volatility as decimal (e.g., 0.30 for 30%) */
    volatility: number;
}

/**
 * Option pricing results
 */
export interface OptionPrices {
    /** Call option price */
    call: number;

    /** Put option price */
    put: number;

    /** Delta (rate of change vs underlying) */
    delta: {
        call: number;
        put: number;
    };
}

/**
 * Parameters for premium calculation
 */
export interface PremiumParams {
    /** Current spot price */
    spot: number;

    /** Strike as percentage of spot (e.g., 1.05 for 5% OTM call) */
    strikePercent: number;

    /** Days until expiry */
    daysToExpiry: number;

    /** Annualized volatility as decimal */
    volatility: number;

    /** Risk-free rate (default: 0.05) */
    riskFreeRate?: number;
}

/**
 * Option position details
 */
export interface OptionPosition {
    /** Underlying asset */
    asset: string;

    /** Call or put */
    optionType: OptionType;

    /** Strike price */
    strike: number;

    /** Expiry timestamp (Unix seconds) */
    expiry: number;

    /** Notional amount in base tokens */
    notional: bigint;

    /** Premium paid/received in quote tokens (USDC) */
    premium: bigint;

    /** Whether this position is long or short */
    side: 'long' | 'short';
}

/**
 * Quote validation result
 */
export interface QuoteValidation {
    /** Whether the quote is valid */
    isValid: boolean;

    /** Reason for invalidity (if any) */
    reason?: string;

    /** Calculated fair value for reference */
    fairValue?: number;

    /** Deviation from fair value in basis points */
    deviationBps?: number;
}
