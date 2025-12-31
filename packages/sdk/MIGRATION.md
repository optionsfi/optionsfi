# Migration Guide

## v0.3.0 - Production-Ready Settlements

### New Features

#### Quote Type Extended with MM Wallet Information

Quotes now include market maker wallet addresses for settlement tracking:

**New Fields:**
```typescript
interface Quote {
  // Existing fields...
  marketMakerWallet: string;   // MM's Solana wallet address
  usdcTokenAccount: string;    // MM's USDC token account
}
```

**Impact:** Non-breaking. Existing code continues to work, but you can now access MM wallet info:

```typescript
client.subscribeToQuotes(rfqId, (quote) => {
  console.log('MM Wallet:', quote.marketMakerWallet);
  console.log('USDC Account:', quote.usdcTokenAccount);
  console.log('Premium:', quote.premium);
});
```

#### Complete Transaction Building

`executeOption()` now builds complete transactions including premium collection:

**Before (v0.2.0):**
- Transaction included only `recordNotionalExposure`
- Manual `collectPremium` instruction required

**After (v0.3.0):**
- Transaction includes both `recordNotionalExposure` AND `collectPremium`
- Automatically uses MM's USDC account from quote
- No manual steps needed

```typescript
// Works automatically - no changes needed
const signature = await client.executeOption(rfqId, quoteId, wallet);
```

#### Settlement Tracking

The RFQ fill data now includes MM wallet information:

```typescript
interface RFQFill {
  // Existing fields...
  marketMakerWallet: string;   // NEW: MM wallet for settlement
  usdcTokenAccount: string;    // NEW: MM USDC account
}
```

### Migration Required

**None!** All changes are backward compatible. New fields are automatically populated when available.

### For Market Makers

If you're running a market maker, update your connection to include wallet info:

```typescript
const wsUrl = `wss://rfq.optionsfi.xyz?makerId=YOUR_ID&wallet=YOUR_WALLET&usdcAccount=YOUR_USDC_ACCOUNT&apiKey=YOUR_KEY`;
```

---

## v0.2.0

## Breaking Changes

### Renamed Constants

The following constants have been renamed for clarity:

| Old Name | New Name | Reason |
|----------|----------|--------|
| `MOCK_USDC_MINT` | `DEVNET_USDC_MINT` | Clarifies this is official devnet USDC, not a mock |

### New Exports

- `MAINNET_USDC_MINT` - Official Circle USDC mint for mainnet-beta

## Migration Steps

### If you were using MOCK_USDC_MINT

**Before (v0.1.0):**
```typescript
import { MOCK_USDC_MINT } from '@optionsfi/sdk';

const usdcMint = MOCK_USDC_MINT;
```

**After (v0.2.0):**
```typescript
import { DEVNET_USDC_MINT, MAINNET_USDC_MINT } from '@optionsfi/sdk';

// For devnet
const usdcMint = DEVNET_USDC_MINT;

// For mainnet
const usdcMint = MAINNET_USDC_MINT;
```

## Repository Changes

The SDK repository has been transferred to the OptionsFi organization:

- **Old URL**: `https://github.com/feeniks01/optionsfi`
- **New URL**: `https://github.com/optionsfi/optionsfi`

All issue links, documentation links, and repository references have been updated.

## No Other Breaking Changes

All other APIs remain backward compatible. New features:
- Multi-asset support (crypto, tokenized stocks, treasuries)
- Anonymous RFQ support
- Enhanced multi-dealer quote collection
- Trading hours configuration (optional)

See [CHANGELOG.md](./CHANGELOG.md) for full details.
