# OptionsFi Developer Guide

## Project Overview

**OptionsFi** is a decentralized options settlement infrastructure built on Solana. It provides covered call vaults and an RFQ (Request for Quote) system for on-chain options trading.

### Core Technology Stack

- **Blockchain**: Solana (Devnet)
- **Smart Contracts**: Rust + Anchor Framework v0.32.0
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **SDK**: TypeScript (published as `@optionsfi/sdk`)
- **Backend Services**: Node.js + Express (Keeper service, RFQ Router)
- **Market Maker**: Rust (optional high-performance MM implementation)

### Key Features

- Covered call vaults with epoch-based withdrawal system
- RFQ-based options trading with market maker integration
- Black-Scholes pricing with real-time volatility data
- Pyth Network price feeds integration
- WebSocket-based quote aggregation

## Architecture

### Repository Structure

```
├── programs/vault/          # Anchor smart contract (Rust)
├── packages/sdk/            # TypeScript SDK for external integrators
├── app/                     # Next.js frontend application
├── infra/
│   ├── keeper/             # Epoch management service (TypeScript)
│   ├── rfq-router/         # Quote aggregation service (JavaScript)
│   └── rust-mm/            # High-performance market maker (Rust)
├── scripts/                # Deployment and utility scripts
└── docs/                   # Mintlify documentation
```

### Core Components

#### 1. Vault Program (`programs/vault/`)
- **Language**: Rust with Anchor framework
- **Program ID**: `A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94` (devnet)
- **Main file**: `programs/vault/src/lib.rs`
- **Key instructions**:
  - `initialize_vault` - Create new vault
  - `deposit` - Deposit assets and receive vault shares
  - `request_withdrawal` - Queue withdrawal for next epoch
  - `complete_withdrawal` - Execute queued withdrawal
  - `record_exposure` - Track option positions sold
  - `collect_premium` - Collect premiums from sold options
  - `settle_option` - Settle ITM options at expiry
  - `advance_epoch` - Roll to next epoch

#### 2. SDK (`packages/sdk/`)
- **Package**: `@optionsfi/sdk`
- **Purpose**: External integration library
- **Main exports**:
  - `RFQClient` - RFQ creation and quote management
  - `VaultInstructions` - On-chain vault interactions
  - `OptionPricing` - Black-Scholes pricing utilities
  - Constants and PDA derivation helpers
- **Testing**: Vitest

#### 3. Frontend (`app/`)
- **Framework**: Next.js 16 with App Router
- **Key directories**:
  - `app/app/v2/` - V2 UI pages (trading, earn, portfolio, etc.)
  - `app/hooks/` - React hooks (useVault, useRfq, usePythPrices, etc.)
  - `app/lib/` - Core logic (vault-sdk, options-math, rfq-client)
  - `app/components/` - Shared components
  - `app/anchor/` - IDL files and Anchor setup
- **Wallet**: Solana wallet adapter with multiple wallet support

#### 4. Keeper Service (`infra/keeper/`)
- **Purpose**: Automated epoch management and settlement
- **Responsibilities**:
  - Advance vault epochs on schedule
  - Fetch real-time volatility data (Yahoo Finance)
  - Calculate Black-Scholes premiums
  - Execute on-chain premium collection
  - Trigger option settlements to actual market makers
  - **Track MM wallet addresses**: Stores winning MM wallet when RFQ fills
  - **Production settlements**: Pays ITM settlements to actual MM (not keeper)
- **API Endpoints**:
  - `POST /trigger` - Manually trigger epoch roll
  - `POST /settle` - Manually trigger settlement
  - `GET /health` - Health check

#### 5. RFQ Router (`infra/rfq-router/`)
- **Purpose**: Quote aggregation service
- **Communication**: HTTP + WebSocket on single port (default 3005)
- **Flow**:
  1. Receives RFQ from keeper/frontend via HTTP POST
  2. Broadcasts to connected market makers via WebSocket
  3. Collects quotes from MMs (including MM wallet addresses)
  4. Returns best quote to requester
- **Production Feature**: Validates and tracks MM wallet addresses
  - MMs must provide `wallet` and `usdcAccount` on connection
  - All quotes include MM wallet info for settlement tracking
- **Files**:
  - `index.js` - Main router
  - `mock-mm.js` - Mock market maker for testing
  - `multi-mm.js` - Multiple MM simulation

#### 6. Rust Market Maker (`infra/rust-mm/`)
- **Purpose**: High-performance market maker implementation
- **Features**: Low-latency quote generation, WebSocket connectivity

## Development Workflow

### Initial Setup (Run Once)

```bash
# 1. Build and deploy vault program
anchor build
anchor deploy

# 2. Create mock tokens (devnet)
npx ts-node scripts/create-nvdax.ts
npx ts-node scripts/create-usdc.ts

# 3. Initialize vault
npx ts-node scripts/create-vault.ts

# 4. Copy IDL to frontend
cp target/idl/vault.json app/anchor/vault_idl.json
```

### Development Mode (4 Terminals)

```bash
# Terminal 1: RFQ Router
cd infra/rfq-router && node index.js

# Terminal 2: Mock Market Maker
cd infra/rfq-router && node mock-mm.js

# Terminal 3: Keeper Service
cd infra/keeper && npm run dev

# Terminal 4: Frontend
cd app && npm run dev
```

Access the app at: `http://localhost:3000/v2/earn/nvdax`

### Testing

```bash
# SDK tests
cd packages/sdk && npm test

# Anchor program tests
anchor test

# Frontend linting
cd app && npm run lint
```

## Code Conventions

### TypeScript/JavaScript

#### File Naming
- React components: PascalCase (e.g., `AppWalletProvider.tsx`)
- Utilities/libs: kebab-case (e.g., `options-math.ts`, `vault-sdk.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useVault.ts`, `usePythPrices.ts`)
- API routes: lowercase (e.g., `route.ts`)

#### Code Style
- Use TypeScript for all new code in app and SDK
- Prefer functional components with hooks in React
- Use explicit types over `any`
- Export types and interfaces from dedicated type files
- Use named exports over default exports (except Next.js pages/layouts)

#### Error Handling
- SDK uses custom `ValidationError` class for input validation
- Always validate user inputs before on-chain operations
- Use try-catch blocks for async operations
- Provide meaningful error messages

#### Naming Conventions
- Functions: camelCase (e.g., `validateRFQParams`, `formatTokenAmount`)
- Classes: PascalCase (e.g., `RFQClient`, `OptionPricing`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `VAULT_PROGRAM_ID`, `PYTH_PRICE_FEEDS`)
- Types/Interfaces: PascalCase (e.g., `RFQParams`, `VaultData`)

#### SDK Patterns
- Validation functions throw `ValidationError` with field name
- Formatting functions handle null/undefined gracefully
- All token amounts use `bigint` for precision
- Timestamps are Unix seconds (not milliseconds)
- Use basis points (bps) for percentage calculations (1 bps = 0.01%)

### Rust (Anchor)

#### Code Organization
- Keep instruction handlers concise
- Use separate context structs for each instruction
- Define custom errors in `#[error_code]` enum
- Use descriptive account names in context structs

#### Security Practices
- Always validate account ownership
- Check signer requirements explicitly
- Use `require!` macros for validation
- Implement proper access control (authority checks)
- Use `overflow-checks = true` in release profile (already configured)

#### Naming Conventions
- Functions: snake_case (e.g., `initialize_vault`, `record_exposure`)
- Structs: PascalCase (e.g., `InitializeVault`, `Deposit`)
- Constants: SCREAMING_SNAKE_CASE
- Accounts: snake_case in context structs

#### PDA Derivation
- Use consistent seeds across codebase
- Vault PDA: `["vault", asset_id.as_bytes()]`
- Withdrawal PDA: `["withdrawal", vault.key(), user.key()]`
- Share escrow PDA: `["share_escrow", vault.key()]`
- Whitelist PDA: `["whitelist", vault.key()]`

## Important Files and Patterns

### Configuration Files

#### `Anchor.toml`
- Anchor version: 0.32.0
- Program IDs for deployment
- Cluster configuration (devnet by default)
- Test script configuration

#### `app/anchor/setup.ts`
- Anchor provider setup
- Connection configuration
- Program initialization

#### `app/utils/constants.ts`
- Public keys for program, mints, and accounts
- Network endpoints
- Token decimals and formatting

### Key Libraries

#### `app/lib/vault-sdk.ts`
- Vault instruction builders
- On-chain interaction wrappers
- Account fetching and parsing

#### `app/lib/options-math.ts`
- Black-Scholes pricing implementation
- Volatility calculations
- Greeks computation
- Premium calculations

#### `app/lib/rfq-client.ts`
- RFQ creation and management
- WebSocket communication with router
- Quote handling

#### `packages/sdk/src/utils/pricing.ts`
- Reusable Black-Scholes implementation
- Normal distribution (CDF) calculation
- Quote validation against fair value

#### `packages/sdk/src/utils/validation.ts`
- Input validation utilities
- Custom `ValidationError` class
- Type guards and runtime checks

### IDL Management

- Source of truth: `target/idl/vault.json` (generated by Anchor)
- Frontend copy: `app/anchor/vault_idl.json`
- SDK copy: `packages/sdk/src/idl/vault.json`
- **Always sync IDL files after program changes**

## Common Tasks

### Adding a New Vault Instruction

1. Add instruction handler in `programs/vault/src/lib.rs`
2. Define accounts context struct with `#[derive(Accounts)]`
3. Add any new error codes to `VaultError` enum
4. Build program: `anchor build`
5. Deploy if needed: `anchor deploy`
6. Sync IDL: `cp target/idl/vault.json app/anchor/vault_idl.json`
7. Update SDK if instruction is public-facing

### Creating a New Frontend Page

1. Create page in `app/app/v2/[page-name]/page.tsx`
2. Use existing hooks from `app/hooks/`
3. Follow layout pattern from existing pages
4. Add navigation link in `app/components/Navbar.tsx` if needed

### Adding SDK Functionality

1. Implement in appropriate module:
   - Client operations: `packages/sdk/src/client/`
   - Utilities: `packages/sdk/src/utils/`
   - Types: `packages/sdk/src/types/`
2. Add tests in `packages/sdk/tests/`
3. Export from `packages/sdk/src/index.ts`
4. Update documentation
5. Rebuild: `npm run build`

### Deploying Infrastructure Services

#### Keeper Service
- Platform: Railway (see `infra/keeper/railway.json`)
- Dockerfile: `infra/keeper/Dockerfile`
- Requires environment variables:
  - `SOLANA_RPC_URL`
  - `WALLET_PRIVATE_KEY`
  - `RFQ_ROUTER_URL`

#### RFQ Router
- Platform: Railway (see `infra/rfq-router/railway.json`)
- Dockerfile: `infra/rfq-router/Dockerfile`
- Single port for HTTP and WebSocket
- Set `PORT` environment variable

## Security Infrastructure

### Institutional-Grade Security System

OptionsFi implements comprehensive security across all layers:

**Security Module Location:** `infra/security/`

**Components:**
1. **Mint Registry** (`mint-registry.ts`)
   - Multi-tier classification (Verified → Banned)
   - Automatic risk assessment
   - On-chain metadata validation
   - Import/export functionality

2. **Rate Limiter** (`rate-limiter.ts`)
   - IP-based and API key-based limiting
   - Auto-blocking after 5 violations
   - Configurable tiers (10-1000 req/min)
   - Automatic cleanup

3. **Data Validator** (`validator.ts`)
   - Type, range, format validation
   - SQL/XSS/Command injection prevention
   - Solana address validation
   - Predefined schemas

4. **Security Monitor** (`monitoring.ts`)
   - Real-time threat detection
   - Anomaly detection
   - Security metrics dashboard
   - Alert system

**Integration Points:**
- RFQ Router: Rate limiting + input validation
- Keeper: Operation validation + error sanitization
- Smart Contract: Mint validation + whitelist enforcement

**Security Patterns:**
```typescript
// Rate limiting middleware
app.use(rateLimitMiddleware);

// Input validation
app.post("/rfq", validateRFQ, (req, res) => {
  // Process validated input
});

// Security monitoring
monitor.logEvent({
  type: ThreatType.INVALID_INPUT,
  level: ThreatLevel.MEDIUM,
  source: req.ip,
  details: { errors },
  action: 'blocked'
});
```

**Threat Detection:**
- Rate limit abuse
- SQL injection attempts
- XSS attacks
- Brute force attempts
- Malicious token mints
- Request burst patterns

**Security Endpoints:**
- `/security/metrics` - View security metrics
- Real-time monitoring dashboard
- Alert system integration

## Security Considerations

### Smart Contract Security

Refer to `SECURITY.md` for detailed security model. Key points:

- **Epoch-gated withdrawals**: Prevent flash loan attacks
- **Utilization cap**: Limit vault exposure (default 30%)
- **Authority controls**: Only vault authority can pause/unpause
- **Premium accounting**: Precise tracking using basis points
- **Whitelist system**: Optional market maker whitelist
- **Reentrancy protection**: Anchor's account validation prevents reentrancy

### Best Practices

- Never commit private keys or secrets
- Use environment variables for sensitive configuration
- Validate all user inputs before blockchain interactions
- Test thoroughly on devnet before mainnet deployment
- Implement proper error handling and logging
- Use Solana's account validation (Anchor does this automatically)
- Always check account ownership and signer requirements

## Testing Strategy

### Unit Tests
- SDK utilities: `packages/sdk/tests/`
- Test pricing, validation, formatting functions
- Use Vitest for fast, focused tests

### Integration Tests
- Anchor tests: `tests/**/*.ts`
- Test full instruction flows
- Verify account state changes

### End-to-End Testing
- Use devnet for full system tests
- Run all 4 services (frontend, keeper, router, MM)
- Test complete user flows (deposit → epoch roll → withdrawal)

## Debugging Tips

### Common Issues

#### "Account not found" errors
- Ensure accounts are initialized
- Check PDA derivation matches on-chain
- Verify correct cluster (devnet vs mainnet)

#### Transaction simulation failed
- Check account ownership
- Verify signer requirements
- Ensure sufficient SOL for rent
- Check token account balances

#### WebSocket connection issues
- Verify RFQ router is running
- Check CORS configuration in router
- Ensure same port for HTTP and WS

#### Vault epoch issues
- Check `min_epoch_duration` has passed
- Verify keeper has authority
- Ensure no pending settlements

### Useful Scripts

```bash
# Check vault state
npx ts-node scripts/check-vault.ts

# Inspect specific withdrawal
npx ts-node scripts/inspect-withdrawal.ts

# Verify keeper holdings
npx ts-node scripts/check-holdings.ts

# Cleanup test tokens
npx ts-node scripts/cleanup-tokens.ts
```

## API Documentation

Full API documentation is available in `docs/` (Mintlify format):

- `docs/introduction.mdx` - Getting started
- `docs/quickstart.mdx` - Quick integration guide
- `docs/api-reference/` - Detailed API docs
- `docs/guides/` - Integration tutorials
- `docs/examples/` - Code examples

## Environment Variables

### Frontend (`app/`)

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_RFQ_ROUTER_URL=http://localhost:3005
NEXT_PUBLIC_KEEPER_URL=http://localhost:3010
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-key>
```

### Keeper Service (`infra/keeper/`)

```bash
SOLANA_RPC_URL=https://api.devnet.solana.com
WALLET_PRIVATE_KEY=<base58-encoded-keypair>
RFQ_ROUTER_URL=http://localhost:3005
PORT=3010
```

### RFQ Router (`infra/rfq-router/`)

```bash
PORT=3005
NODE_ENV=development
```

## Resources

- **Anchor Documentation**: https://www.anchor-lang.com/
- **Solana Cookbook**: https://solanacookbook.com/
- **Pyth Network**: https://docs.pyth.network/
- **Next.js Documentation**: https://nextjs.org/docs
- **Solana Web3.js**: https://solana-labs.github.io/solana-web3.js/

## Additional Documentation

- `README.md` - Project overview and architecture
- `README_V2.md` - V2 system architecture and components
- `SECURITY.md` - Detailed security model and attack mitigations
- `SCRIPTS.md` - Quick reference for running the demo
- `PRD/week1_2_prd.md` - SDK and documentation PRD

## Contributing Guidelines

### Before Submitting Changes

1. Run linters: `npm run lint` (in relevant directories)
2. Run tests: `npm test`
3. Test on devnet with full stack running
4. Update documentation if adding new features
5. Sync IDL files if program changed
6. Follow existing code patterns and conventions

### Commit Messages

- Use descriptive commit messages
- Reference issue numbers if applicable
- Keep commits focused and atomic

### Code Review Checklist

- [ ] Code follows existing conventions
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No hardcoded secrets or keys
- [ ] Error handling implemented
- [ ] TypeScript types are explicit
- [ ] Anchor accounts properly validated

## Troubleshooting

### Program Deployment Issues

```bash
# Verify wallet balance
solana balance

# Check program is deployed
solana program show <PROGRAM_ID>

# View program logs
solana logs <PROGRAM_ID>
```

### Frontend Build Issues

```bash
# Clear Next.js cache
cd app && rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

### SDK Publishing Issues

```bash
# Verify build outputs
cd packages/sdk && npm run build
ls -la dist/

# Test locally before publishing
npm link
cd ../../app
npm link @optionsfi/sdk
```

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Cache Pyth price feeds
- Debounce user inputs for calculations

### Backend Services
- Use connection pooling for Solana RPC
- Implement rate limiting for external APIs
- Cache volatility data (see `app/data/nvda-volatility-cache.json`)
- Use WebSocket subscriptions instead of polling

### Smart Contract
- Minimize compute units in instructions
- Use efficient data structures (minimize account size)
- Batch operations when possible
- Optimize CPI calls

---

**Last Updated**: 2025-12-30

For questions or issues, please refer to the issue tracker or documentation.
