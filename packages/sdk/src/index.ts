/**
 * OptionsFi SDK
 * 
 * SDK for integrating with OptionsFi's on-chain options settlement infrastructure.
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { RFQClient, OptionPricing, DEVNET_CONFIG } from '@optionsfi/sdk';
 * 
 * // Initialize client
 * const client = new RFQClient(DEVNET_CONFIG);
 * await client.connect();
 * 
 * // Create an RFQ
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
 * // Subscribe to quotes
 * client.subscribeToQuotes(rfqId, (quote) => {
 *   // Validate quote against fair value
 *   const fairValue = OptionPricing.blackScholes({
 *     spot: 145.50,
 *     strike: 150,
 *     timeToExpiry: 7 / 365,
 *     riskFreeRate: 0.05,
 *     volatility: 0.45,
 *   }).call;
 * 
 *   const validation = OptionPricing.validateQuote(
 *     Number(quote.premium) / 1e6,
 *     fairValue
 *   );
 * 
 *   if (validation.isValid) {
 *     console.log('Valid quote received!', quote);
 *   }
 * });
 * ```
 * 
 * @packageDocumentation
 */

// Core clients
export { RFQClient } from './client/RFQClient';
export { VaultInstructions } from './client/VaultInstructions';

// Types
export type {
    // RFQ types
    RFQConfig,
    RFQParams,
    Quote,
    RFQ,
    RFQEventType,
    RFQEvent,
    // Option types
    OptionType,
    BlackScholesParams,
    OptionPrices,
    PremiumParams,
    OptionPosition,
    QuoteValidation,
    // Vault types
    VaultData,
    RecordExposureParams,
    CollectPremiumParams,
    PaySettlementParams,
    AdvanceEpochParams,
    WithdrawalRequest,
} from './types';

// Utilities
export {
    OptionPricing,
    ValidationError,
    validateRFQParams,
    validateBlackScholesParams,
    validatePublicKey,
    validateTokenAmount,
    validateTimestamp,
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
    formatDate,
    formatTimeToExpiry,
    shortenAddress,
    formatRFQId,
} from './utils';

// Constants
export {
    VAULT_PROGRAM_ID,
    MOCK_USDC_MINT,
    PYTH_PRICE_FEEDS,
    PYTH_HERMES_URL,
    deriveVaultPda,
    deriveWithdrawalPda,
    deriveShareEscrowPda,
    deriveWhitelistPda,
    DEVNET_CONFIG,
    MAINNET_CONFIG,
    DEFAULT_PRICING_PARAMS,
    RFQ_DEFAULTS,
    TOKEN_DECIMALS,
} from './constants';
