# OptionsFi

**On-chain options infrastructure for tokenized equities.**

OptionsFi provides a modular RFQ-based settlement layer for options on Solana. Market participants (vaults, protocols, individual traders) can source real option premiums from professional market makers, with pricing negotiated off-chain via RFQ and execution settled atomically on-chain.

The covered call vault is a **reference implementation** built on this infrastructure—demonstrating how any yield product can integrate with the RFQ layer to access institutional options liquidity.

---

## Core Concepts

### What is an RFQ?

A **Request for Quote (RFQ)** is an off-chain negotiation mechanism where:
1. A requester broadcasts option parameters (underlying, strike, expiry, size)
2. Professional market makers respond with quotes (premium they're willing to pay/receive)
3. The best quote is selected and executed atomically on-chain

This model is standard in TradFi options markets (CBOE, CME) and eliminates the liquidity fragmentation problems of on-chain order books.

### What is an Epoch?

An **epoch** is a discrete time period (typically 1 week) representing a single options cycle:
- **Epoch Start:** Options are sold via RFQ; premium is collected into the vault
- **Epoch Duration:** Options are "live"; vault assets are exposed to strike
- **Epoch End (Settlement):** Options either expire worthless (vault keeps premium) or settle ITM (vault pays difference to market maker)

Epochs provide clear boundaries for accounting, withdrawals, and settlement.

### Settlement Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EPOCH LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│   │  Keeper  │───►│   RFQ    │───►│  Market  │───►│  On-Chain│        │
│   │ Creates  │    │  Router  │    │  Maker   │    │Settlement│        │
│   │   RFQ    │    │Broadcasts│    │  Quotes  │    │ Executes │        │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘        │
│                                                                         │
│   Premium flows: Market Maker ──USDC──► Vault Premium Account          │
│   Settlement:    Vault ──USDC──► Market Maker (if ITM)                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                          INTEGRATION LAYER                            │
│         (Vaults, Trading Protocols, Yield Aggregators)                │
└─────────────────────────────────┬─────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼──────────────────────────┐
        │                         │                          │
        ▼                         ▼                          ▼
┌──────────────┐         ┌───────────────┐          ┌──────────────┐
│    VAULT     │         │  RFQ ROUTER   │          │   KEEPER     │
│   PROGRAM    │◄───────►│  (WebSocket)  │◄────────►│   SERVICE    │
│   (Anchor)   │         └───────────────┘          └──────────────┘
│              │                  ▲                        │
│  • Deposits  │                  │                        │
│  • Shares    │         ┌────────┴─────────┐              ▼
│  • Premium   │         │  MARKET MAKERS   │      ┌──────────────┐
│  • Settle    │         │  (Professional)  │      │ PYTH ORACLE  │
└──────┬───────┘         └──────────────────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│   SOLANA     │
│   (Devnet)   │
└──────────────┘
```

### Component Overview

| Component | Location | Responsibility |
|-----------|----------|----------------|
| **Vault Program** | `programs/vault/` | Anchor smart contract. Manages deposits, share minting/burning, premium escrow, settlement execution, and epoch state. |
| **RFQ Router** | `infra/rfq-router/` | Off-chain WebSocket server. Broadcasts RFQs to connected market makers, aggregates quotes, returns best fill. Stateless quote relay. |
| **Keeper Service** | `infra/keeper/` | Off-chain automation. Monitors epoch timing, fetches oracle prices, calculates reference parameters (Black-Scholes bounds), initiates RFQs, triggers on-chain settlement. |
| **Market Makers** | External / `mock-mm.js` | Professional liquidity providers. Receive RFQ broadcasts, return quotes, transfer premium on fill, receive settlement payouts. |
| **Price Oracle** | Pyth Network | Real-time price feeds for underlying assets. Used by keeper for strike calculation and settlement determination. |
| **Frontend** | `app/` | Next.js UI. Wallet integration, deposit/withdraw flows, vault analytics. |

---

## Vault Program — On-Chain Instructions

The vault program is the on-chain component handling all state transitions and token flows.

### User Instructions

| Instruction | Parameters | Description |
|-------------|------------|-------------|
| `deposit` | `amount: u64` | Deposit underlying tokens, receive vault shares proportional to current share price. |
| `request_withdrawal` | `shares: u64` | Lock shares in escrow; redeemable after current epoch settles. |
| `process_withdrawal` | — | After epoch advances, redeem locked shares for underlying tokens + proportional premium. |

### Keeper Instructions (Authority-Gated)

| Instruction | Parameters | Description |
|-------------|------------|-------------|
| `record_notional_exposure` | `notional_tokens: u64`, `premium: u64` | Record option position from filled RFQ. Premium is credited to vault accounting; utilization cap enforced. |
| `collect_premium` | `amount: u64` | Transfer USDC premium from market maker to vault's premium escrow account. |
| `advance_epoch` | `premium_earned: u64` | Close current epoch, credit premium to `premium_balance_usdc`, reset epoch counters, increment epoch number. |
| `pay_settlement` | `amount: u64` | Pay ITM settlement to whitelisted market maker. Capped at `epoch_premium_earned` to prevent drain attacks. |

### Admin Instructions

| Instruction | Description |
|-------------|-------------|
| `initialize_vault` | Create new vault with asset ID, utilization cap, minimum epoch duration. |
| `set_pause` | Emergency pause/unpause. Blocks deposits and new withdrawal requests. |
| `set_utilization_cap` | Adjust maximum TVL percentage that can be exposed to options. |
| `add_market_maker` / `initialize_whitelist` | Manage whitelist of addresses eligible to receive settlement payouts. |

---

## Share Price Mechanics

Vaults use a rebasing share model (similar to Aave aTokens, Lido stETH, or ERC-4626):

```
share_price = total_assets / (total_shares + virtual_offset)
```

**Example Flow:**
1. Initial deposit: 100 NVDAx → 100 vNVDAx shares (1:1)
2. Epoch completes: 3 USDC premium earned, credited to vault
3. New share price: reflects premium accrual
4. Withdraw 100 vNVDAx → 100 NVDAx + proportional USDC premium

The `virtual_offset` (set on first deposit) prevents first-depositor share price manipulation attacks without requiring users to "burn" tokens.

---

## RFQ Flow — End to End

```
1. KEEPER detects epoch roll is due
   └── Fetches current price from Pyth Oracle
   └── Calculates strike (spot + 10% OTM)
   └── Calculates reference premium (Black-Scholes with 30-day historical vol)

2. KEEPER sends RFQ to RFQ Router
   └── POST /rfq { underlying: "NVDAx", strike: 199.00, expiry: +7d, size: 1000 }

3. RFQ ROUTER broadcasts to connected Market Makers via WebSocket
   └── { type: "rfq", rfqId: "...", ... }

4. MARKET MAKERS respond with quotes
   └── { type: "quote", rfqId: "...", premium: 5000000 } // 5 USDC (6 decimals)

5. KEEPER calls POST /rfq/:id/fill to select best quote
   └── Router returns winning maker + premium

6. KEEPER executes on-chain settlement:
   a. record_notional_exposure(1000 tokens, 5 USDC)
   b. collect_premium(5 USDC) // MM transfers USDC to vault
   
7. At epoch end:
   a. Keeper checks if options expired ITM or OTM
   b. If OTM: advance_epoch() — vault keeps premium
   c. If ITM: pay_settlement() — vault pays difference to MM, then advance_epoch()
```

---

## Security Model

### On-Chain Protections

| Mechanism | Description |
|-----------|-------------|
| **Virtual Offset** | Prevents first-depositor attacks. No tokens burned; pure accounting offset. |
| **Utilization Cap** | Maximum % of TVL exposed to options (default 80%). Enforced on `record_notional_exposure`. |
| **Epoch Timelock** | Minimum duration between epoch advances prevents rapid cycling attacks. |
| **Premium Caps** | Premium cannot exceed 50% of TVL; implied yield cannot exceed 20% per epoch. |
| **Settlement Cap** | `pay_settlement` amount capped at `epoch_premium_earned`. Prevents draining vault. |
| **MM Whitelist** | Only whitelisted addresses can receive settlement payouts. |
| **Share Escrow** | Withdrawal requests lock shares in escrow until epoch settles. Prevents double-spend. |
| **Pause Mechanism** | Authority can pause deposits and withdrawal requests in emergencies. |

### Off-Chain Security Considerations

- Keeper private key should be stored in HSM/KMS for production
- RFQ Router should use proper authentication (not URL query params)
- Market maker connections should use TLS and rate limiting

### Known Limitations (Pre-Mainnet)

| Issue | Status |
|-------|--------|
| Single authority key | Multisig planned |
| `force_close_vault` bypasses checks | Needs fix |
| No withdrawal slippage protection | Recommended |

See [SECURITY.md](./SECURITY.md) for full audit report.

---

## Quick Start

### Prerequisites

- Solana CLI (devnet)
- Node.js 18+
- Anchor 0.32.0

### Deploy & Initialize

```bash
# Build and deploy program
anchor build
anchor deploy --provider.cluster devnet

# Create tokens and initialize vault
npx ts-node scripts/create-nvdax.ts
npx ts-node scripts/create-usdc.ts
npx ts-node scripts/init-vault.ts

# Copy IDL to frontend
cp target/idl/vault.json app/anchor/
```

### Run Services

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

### Test Flow

1. Open `http://localhost:3000/v2/earn/nvdax`
2. Connect wallet, use faucet to get NVDAx
3. Deposit → receive vault shares
4. Wait for keeper to roll epoch (or trigger manually)
5. Observe premium credited
6. Request withdrawal → process after epoch → receive tokens + premium

---

## Deployed Addresses (Devnet)

| Account | Address |
|---------|---------|
| Vault Program | `A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94` |
| NVDAx Mint | `G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn` |
| USDC Mint | `5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4` |
| Vault PDA | `sjmw5dVeoAuxXPBiB7hCfQB4yTV8hrVohK4QAxswMZk` |
| vNVDAx Share Mint | `6k9oCRMgiKUwQQuCdiQSqSkowvsDuXFyVNpVz6ThLMH1` |

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `RPC_URL` | devnet | Solana RPC endpoint |
| `ASSET_IDS` | `NVDAx` | Comma-separated vault asset IDs |
| `EPOCH_DURATION_DAYS` | `7` | Days per epoch |
| `STRIKE_DELTA_BPS` | `1000` | Strike offset in basis points (1000 = 10% OTM) |
| `VOL_LOOKBACK_DAYS` | `30` | Historical volatility lookback period |
| `RFQ_ROUTER_URL` | `http://localhost:3005` | RFQ Router endpoint |
| `MM_API_KEYS` | — | Comma-separated market maker API keys |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Anchor 0.32.0, Rust |
| Blockchain | Solana Devnet |
| Keeper | Node.js, TypeScript |
| RFQ Router | Node.js, Express, WebSocket |
| Frontend | Next.js 15, React, TailwindCSS |
| Oracles | Pyth Network (prices), Yahoo Finance (volatility) |

---

## Extending OptionsFi

The RFQ layer is designed to be protocol-agnostic. Potential integrations:

- **Put-selling vaults** — Same RFQ flow, different payoff structure
- **Collars** — Combine covered calls with protective puts
- **Exotic options** — Barrier options, binary options (with MM support)
- **Third-party protocols** — Any protocol can integrate the RFQ layer to access options liquidity

Market makers need only implement the WebSocket quote protocol to participate.

---

## Links

- **Live Demo:** https://www.optionsfi.xyz/v2/
- **Video Walkthrough:** https://www.youtube.com/watch?v=3tbL4IyPB34

---

## License

MIT
