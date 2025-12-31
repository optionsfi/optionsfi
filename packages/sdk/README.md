# @optionsfi/sdk

TypeScript SDK for OptionsFi, a decentralized options settlement protocol built on Solana. Enables developers to build applications with covered call vaults, RFQ-based options trading, and support for multiple asset types.

## Features

- 🌐 **Multi-Asset Support** - Trade options on crypto, tokenized stocks, and tokenized treasuries
- 🔌 **RFQ System** - Request quotes from multiple market makers with competitive pricing
- 📊 **Options Pricing** - Black-Scholes calculations with Greeks and volatility tools
- 🏦 **Vault Operations** - Interact with on-chain covered call vaults
- 🔒 **Anonymous RFQs** - Privacy-preserving quote requests for large institutional flows
- ✅ **Type-Safe** - Comprehensive TypeScript types with runtime validation
- 🎯 **Production-Ready Settlements** - Complete MM wallet tracking from quote to ITM settlement

## Installation

```bash
npm install @optionsfi/sdk
# or
yarn add @optionsfi/sdk
# or
pnpm add @optionsfi/sdk
```

**Peer Dependencies:**

```bash
npm install @coral-xyz/anchor @solana/web3.js
```

These allow you to use your preferred versions of Anchor and Solana web3.js.

## Quick Start

### Production-Ready Settlement System

The SDK includes complete market maker wallet tracking for accurate settlements:

```typescript
// Quotes now include MM wallet addresses
interface Quote {
  marketMakerWallet: string;   // MM's Solana wallet
  usdcTokenAccount: string;    // MM's USDC account
  premium: bigint;
  // ... other fields
}

// Transactions automatically include premium collection
const tx = await client.executeOption(rfqId, quote.id, wallet);
// Transaction includes:
// 1. recordNotionalExposure - Record the option position
// 2. collectPremium - Collect premium from MM's USDC account

// At expiry, ITM settlements go to actual MM wallet (not intermediaries)
```

**Key Benefits:**
- ✅ Trustless settlements directly to market makers
- ✅ Complete transaction building with premium collection
- ✅ Whitelist validation enforced on-chain
- ✅ End-to-end wallet tracking from quote to settlement

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

// SDK includes bundled vault IDL - no need to provide it
const instructions = new VaultInstructions(connection);
await instructions.initialize();

// Fetch vault data
const vault = await instructions.fetchVault('NVDAX');
console.log('Total assets:', vault.totalAssets);
console.log('Current epoch:', vault.epoch);

// Check remaining capacity
const capacity = VaultInstructions.getRemainingCapacity(vault);
console.log('Remaining capacity:', capacity);

// Build transaction instruction
const [vaultPda] = deriveVaultPda('NVDAX');
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

## Documentation

For comprehensive guides and API documentation, visit [docs.optionsfi.xyz](https://docs.optionsfi.xyz).

## Support

- **Issues**: [GitHub Issues](https://github.com/optionsfi/optionsfi/issues)
- **Documentation**: [docs.optionsfi.xyz](https://docs.optionsfi.xyz)
- **Website**: [optionsfi.xyz](https://optionsfi.xyz)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Security

For security concerns, please email security@optionsfi.xyz. Do not open public issues for security vulnerabilities.

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the OptionsFi team
