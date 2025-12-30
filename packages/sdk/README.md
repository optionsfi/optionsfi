# @optionsfi/sdk

SDK for integrating with OptionsFi's on-chain options settlement infrastructure on Solana.

## Features

- 🔌 **RFQ Client** - Create RFQs and receive quotes from market makers
- 📊 **Option Pricing** - Black-Scholes pricing and volatility calculations
- 🏦 **Vault Instructions** - Build transactions for the vault program
- ✅ **Type-Safe** - Full TypeScript support with comprehensive types

## Installation

```bash
npm install @optionsfi/sdk
# or
yarn add @optionsfi/sdk
# or
pnpm add @optionsfi/sdk
```

## Peer Dependencies

This SDK requires the following peer dependencies:

```bash
npm install @coral-xyz/anchor @solana/web3.js
```

## Quick Start

### Creating an RFQ

```typescript
import { RFQClient, DEVNET_CONFIG } from '@optionsfi/sdk';

// Initialize client
const client = new RFQClient(DEVNET_CONFIG);
await client.connect();

// Create an RFQ for selling covered calls
const rfqId = await client.createRFQ({
  asset: 'NVDAX',
  side: 'sell',
  optionType: 'call',
  strike: 150, // $150 strike
  expiry: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 1 week
  quantity: BigInt(1000 * 1e6), // 1000 tokens
  vaultAddress: 'your-vault-address',
});

// Subscribe to quotes
client.subscribeToQuotes(rfqId, (quote) => {
  console.log(`Quote from ${quote.marketMaker}: ${quote.premium} USDC`);
});
```

### Option Pricing

```typescript
import { OptionPricing } from '@optionsfi/sdk';

// Calculate Black-Scholes fair value
const prices = OptionPricing.blackScholes({
  spot: 145.50,
  strike: 150,
  timeToExpiry: 7 / 365, // 1 week
  riskFreeRate: 0.05,
  volatility: 0.45,
});

console.log('Call price:', prices.call);
console.log('Put price:', prices.put);
console.log('Call delta:', prices.delta.call);

// Validate a quote against fair value
const validation = OptionPricing.validateQuote(premiumFromQuote, prices.call);
if (!validation.isValid) {
  console.log('Quote rejected:', validation.reason);
}
```

### Working with Vaults

```typescript
import { VaultInstructions, deriveVaultPda } from '@optionsfi/sdk';
import { Connection } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');
const instructions = new VaultInstructions(connection, vaultIdl);
await instructions.initialize();

// Fetch vault data
const vault = await instructions.fetchVault('NVDAX');
console.log('Total assets:', vault.totalAssets);
console.log('Current epoch:', vault.epoch);

// Check remaining capacity
const capacity = VaultInstructions.getRemainingCapacity(vault);
console.log('Remaining capacity:', capacity);

// Build transaction instruction
const ix = await instructions.recordNotionalExposure({
  vault: vaultPda,
  authority: walletPublicKey,
  notionalTokens: BigInt(1000 * 1e6),
  premium: BigInt(50 * 1e6),
});
```

## API Reference

### RFQClient

Main client for interacting with the RFQ infrastructure.

| Method | Description |
|--------|-------------|
| `connect()` | Connect to the RFQ router WebSocket |
| `disconnect()` | Disconnect from the router |
| `createRFQ(params)` | Create a new RFQ |
| `subscribeToQuotes(rfqId, callback)` | Subscribe to quotes |
| `executeOption(rfqId, quoteId, wallet)` | Execute an option trade |
| `cancelRFQ(rfqId)` | Cancel an open RFQ |
| `onEvent(callback)` | Subscribe to all events |

### OptionPricing

Static utilities for option pricing.

| Method | Description |
|--------|-------------|
| `blackScholes(params)` | Calculate option prices |
| `calculateCoveredCallPremium(params)` | Premium for covered calls |
| `premiumToBps(premium, spot)` | Convert premium to bps |
| `validateQuote(premium, fairValue)` | Validate quote against fair |
| `suggestStrike(spot, deltaBps)` | Suggest strike price |
| `calculateHistoricalVolatility(prices)` | Calculate vol from prices |
| `calculateImpliedVolatility(...)` | Derive IV from price |

### VaultInstructions

Build transactions for the vault program.

| Method | Description |
|--------|-------------|
| `fetchVault(assetId)` | Fetch vault account data |
| `recordNotionalExposure(params)` | Record option exposure |
| `collectPremium(params)` | Collect premium from MM |
| `paySettlement(params)` | Pay ITM settlement |
| `advanceEpoch(params)` | Advance to next epoch |

### Utilities

```typescript
import {
  // Formatting
  formatTokenAmount,
  parseTokenAmount,
  formatUSDC,
  parseUSDC,
  formatTimeToExpiry,
  shortenAddress,
  
  // Validation
  validateRFQParams,
  validateBlackScholesParams,
  
  // Constants
  VAULT_PROGRAM_ID,
  deriveVaultPda,
  PYTH_PRICE_FEEDS,
} from '@optionsfi/sdk';
```

## Configuration

### Networks

```typescript
import { DEVNET_CONFIG, MAINNET_CONFIG } from '@optionsfi/sdk';

// Use devnet for testing
const client = new RFQClient(DEVNET_CONFIG);

// Use mainnet for production
const client = new RFQClient(MAINNET_CONFIG);

// Custom configuration
const client = new RFQClient({
  rpcUrl: 'https://my-rpc.com',
  rfqRouterUrl: 'wss://rfq.optionsfi.xyz',
  programId: 'A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94',
  network: 'mainnet-beta',
});
```

## License

MIT
