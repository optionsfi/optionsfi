# OptionsFi

Settlement and pricing layer where products like vaults source real option premiums from professional market makers via RFQs, with deterministic on-chain execution.

# Site

https://optionsfi.vercel.app/v2/

# Video

https://www.youtube.com/watch?v=3tbL4IyPB34

## What It Does

Vaults are a reference client built on OptionsFi’s RFQ-based options settlement layer. Deposited tokenized equities are exposed to option markets by issuing RFQs to professional market makers, executing priced options on-chain, and crediting premium back to vault shares on a per-epoch basis.

**Example:** Deposit 100 NVDAx → Vault sells 10% OTM covered calls → Earns ~1% weekly premium → Withdraw 104+ NVDAx after a month

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                   │
│                        React/Next.js + Wallet                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
    ▼                            ▼                            ▼
┌──────────┐            ┌──────────────┐            ┌──────────────┐
│  VAULT   │            │  RFQ ROUTER  │            │   KEEPER     │
│ PROGRAM  │◄──────────►│  (WebSocket) │◄──────────►│  (Cron)      │
│ (Anchor) │            └──────────────┘            └──────────────┘
└────┬─────┘                   ▲                          │
     │                         │                          │
     │               ┌─────────┴────────┐                 ▼
     │               │  MARKET MAKERS   │         ┌──────────────┐
     │               └──────────────────┘         │ PYTH ORACLE  │
     ▼                                            └──────────────┘
┌──────────┐
│  SOLANA  │
│  DEVNET  │
└──────────┘
```

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Vault Program | `programs/vault/` | On-chain Anchor program. Handles deposits, withdrawals, share minting, premium accounting. |
| Keeper | `infra/keeper/` | Off-chain Node.js service. Fetches oracle prices, calculates reference pricing parameters and minimum premium constraints (e.g. Black-Scholes bounds), creates RFQs, records exposure, triggers settlement. |
| RFQ Router | `infra/rfq-router/` | WebSocket server for market maker quote aggregation. Fills best quote. |
| Mock MM | `infra/rfq-router/mock-mm.js` | Simulated market maker for testing. Quotes premium and transfers tokens on fill. |
| Frontend | `app/` | Next.js UI. Wallet connection, deposit/withdraw flows, vault stats. |

## Covered Call Economics

The vault sells out-of-the-money (OTM) call options:

```
Current NVDAx price:  $181.00
Strike price:         $199.00  (10% OTM)
Premium received:     $0.50/token

At expiry:
  - If NVDAx < $199: Option expires worthless. Vault keeps tokens + premium.
  - If NVDAx > $199: Vault pays (NVDAx_price - $199) to market maker.
```

Premium is priced using Black-Scholes with real volatility data from Yahoo Finance and real-time prices from Pyth oracles.

## On-Chain Vault Instructions

| Instruction | Description |
|-------------|-------------|
| `initialize_vault` | Create vault with asset config and utilization cap |
| `deposit` | User deposits xStock, receives vault shares |
| `request_withdrawal` | Queue shares for withdrawal (locks until epoch ends) |
| `process_withdrawal` | Claim underlying tokens after epoch settles |
| `record_notional_exposure` | Keeper records option position and premium |
| `advance_epoch` | Keeper advances epoch, credits premium to totalAssets |
| `collect_premium` | Transfer USDC premium from market maker to vault |
| `pay_settlement` | Pay ITM settlement to market maker |

## Share Price Mechanics

```
sharePrice = totalAssets / totalShares
```

- Initial deposit: 100 NVDAx → 100 vNVDAx (1:1)
- After premium: totalAssets = 103, sharePrice = 1.03
- New deposit: 100 NVDAx → 97.09 vNVDAx (fewer shares, same value)
- Withdraw 97.09 vNVDAx → 100 NVDAx (share price increased)

This is the same model used by Aave aTokens and Lido stETH.

## Quick Start

### Prerequisites

- Solana CLI configured for devnet
- Node.js 18+
- Anchor 0.32.0

### 1. Deploy Program

```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 2. Initialize Vault and Tokens

```bash
npx ts-node scripts/create-nvdax.ts    # Create mock NVDAx token
npx ts-node scripts/create-usdc.ts     # Create mock USDC token
npx ts-node scripts/init-vault.ts      # Initialize vault
cp target/idl/vault.json app/anchor/   # Copy IDL to frontend
```

### 3. Run Services (4 terminals)

```bash
# Terminal 1: RFQ Router
cd infra/rfq-router && node index.js

# Terminal 2: Mock Market Maker
cd infra/rfq-router && node mock-mm.js

# Terminal 3: Keeper
cd infra/keeper && npm run dev

# Terminal 4: Frontend
cd app && npm run dev
```

### 4. Demo Flow

1. Open http://localhost:3000/v2/earn/nvdax
2. Connect wallet
3. Use faucet to get NVDAx tokens
4. Deposit into vault → receive vault shares
5. Click "Roll Epoch" → keeper creates RFQ → market maker quotes → premium transferred
6. Click "Settle" → epoch advances → premium credited to vault
7. Withdraw → receive original tokens + premium

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `RPC_URL` | devnet | Solana RPC |
| `ASSET_ID` | NVDAx | Vault asset ID |
| `TICKER` | NVDA | Yahoo Finance ticker for volatility |
| `EPOCH_DURATION_DAYS` | 7 | Weekly epochs |
| `STRIKE_DELTA_BPS` | 1000 | 10% OTM strike |
| `VOL_LOOKBACK_DAYS` | 30 | Volatility lookback |

## Deployed Addresses (Devnet)

| Account | Address |
|---------|---------|
| Vault Program | `A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94` |
| NVDAx Mint | `G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn` |
| USDC Mint | `5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4` |
| Vault PDA | `sjmw5dVeoAuxXPBiB7hCfQB4yTV8hrVohK4QAxswMZk` |
| vNVDAx Share Mint | `6k9oCRMgiKUwQQuCdiQSqSkowvsDuXFyVNpVz6ThLMH1` |

## Tech Stack

- **On-chain:** Anchor 0.32.0, Solana Devnet
- **Keeper:** Node.js, TypeScript
- **Frontend:** Next.js 15, React
- **Oracles:** Pyth Network, Yahoo Finance

## Security Considerations

- All RFQ fills are atomic on-chain transactions, eliminating counterparty settlement risk.
- 80% utilization cap: Maximum 80% of vault TVL can be exposed to options
- Epoch-gated withdrawals: Prevents manipulation by forcing withdrawals to wait until settlement
- On-chain accounting: All premium and exposure recorded on-chain

## Roadmap

- Support additional structured products (collars, puts) using the same RFQ rails
- Expand RFQ participation to multiple independent market makers
- Generalize the RFQ protocol for third-party derivative products

## License

MIT
