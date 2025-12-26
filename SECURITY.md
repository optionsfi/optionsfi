# Security Model — OptionsFi

This document describes the security mechanisms implemented across the OptionsFi protocol to protect user funds and prevent exploits.

---

## Table of Contents

1. [On-Chain Security (Vault Program)](#on-chain-security-vault-program)
2. [Off-Chain Security (Keeper & RFQ Router)](#off-chain-security-keeper--rfq-router)
3. [Attack Vectors & Mitigations](#attack-vectors--mitigations)
4. [Known Limitations](#known-limitations)
5. [Security Checklist](#security-checklist)

---

## On-Chain Security (Vault Program)

### 1. First-Depositor Attack Protection

**Attack Vector:** An attacker deposits a tiny amount (1 wei), then donates tokens directly to the vault to inflate share price. Subsequent depositors receive 0 shares due to rounding.

**Mitigation:** Virtual offset mechanism.

```rust
// On first deposit, set virtual offset
if effective_shares == 0 {
    vault.virtual_offset = 1000;  // Pure accounting, no token loss
    shares_to_mint = amount;      // User gets FULL value
}

// All calculations use:
effective_shares = total_shares + virtual_offset;
```

**Impact:** First depositor gets full value. No tokens "burned" to a dead address. The virtual offset prevents share price manipulation while costing users nothing.

---

### 2. Settlement Theft Protection

**Attack Vector:** Unauthorized entity calls `pay_settlement` to drain vault funds.

**Mitigation:** Market maker whitelist.

```rust
// Only whitelisted addresses can receive settlements
require!(
    whitelist.market_makers.contains(&recipient.key()),
    VaultError::NotWhitelisted
);

// Settlement capped at epoch premium earned
require!(
    amount <= vault.epoch_premium_earned,
    VaultError::ExcessiveSettlement
);
```

**Management:** Authority can add/remove whitelisted addresses via `add_market_maker` and `remove_market_maker` instructions.

---

### 3. Epoch Cycling Attack Protection

**Attack Vector:** Rapid epoch cycling to manipulate premium crediting or front-run withdrawals.

**Mitigation:** Minimum epoch duration enforced on-chain.

```rust
const MIN_EPOCH_DURATION: i64 = 3600; // 1 hour minimum

let elapsed = current_time - vault.last_roll_timestamp;
require!(elapsed >= vault.min_epoch_duration, VaultError::EpochTooShort);
```

**Note:** Production deployments should use 24-72 hour minimums.

---

### 4. Premium Manipulation Protection

**Attack Vector:** Malicious keeper records unrealistic premiums to inflate share prices.

**Mitigation:** Multiple on-chain caps:

```rust
// Cap 1: Premium cannot exceed 50% of TVL
require!(
    premium_earned <= vault.total_assets / 2,
    VaultError::ExcessivePremium
);

// Cap 2: Implied yield cannot exceed 20% per epoch
if vault.epoch_notional_exposed > 0 {
    let yield_bps = (premium_earned * 10000) / vault.epoch_notional_exposed;
    require!(yield_bps <= 2000, VaultError::ExcessiveYield);
}
```

---

### 5. Utilization Over-Exposure Protection

**Attack Vector:** Vault sells options against entire TVL, leaving nothing for withdrawals.

**Mitigation:** Configurable utilization cap (default 80%).

```rust
let available = (vault.total_assets * vault.utilization_cap_bps as u64) / 10000;
let new_total = vault.epoch_notional_exposed + notional_amount;
require!(new_total <= available, VaultError::ExceedsUtilizationCap);
```

---

### 6. Withdrawal Slippage Protection

**Attack Vector:** Share price drops between withdrawal request and processing, user receives less than expected.

**Mitigation:** User-specified minimum expected amount.

```rust
pub fn process_withdrawal(ctx: Context<ProcessWithdrawal>, min_expected_amount: u64) -> Result<()> {
    let amount = calculate_withdrawal_amount(...);
    
    require!(
        amount >= min_expected_amount,
        VaultError::SlippageExceeded
    );
    // ...
}
```

---

### 7. Flash Loan Attack Protection

**Attack Vector:** Flash loan to deposit, request withdrawal, manipulate price, withdraw in same block.

**Mitigation:** Epoch-gated withdrawals.

```rust
// Withdrawals locked until next epoch
require!(
    vault.epoch > withdrawal.request_epoch,
    VaultError::EpochNotSettled
);
```

**Impact:** Withdrawals require at least one epoch (hours to days) to process, making flash loans ineffective.

---

### 8. Emergency Pause Mechanism

**Attack Vector:** Active exploit requiring immediate halt.

**Mitigation:** Authority can pause vault operations.

```rust
pub fn set_pause(ctx: Context<SetPause>, paused: bool) -> Result<()> {
    vault.is_paused = paused;
    
    emit!(VaultPausedEvent {
        vault: vault.key(),
        paused,
        timestamp: Clock::get()?.unix_timestamp,
    });
    // ...
}

// In deposit/request_withdrawal:
require!(!vault.is_paused, VaultError::VaultPaused);
```

---

### 9. Parameter Change Timelock

**Attack Vector:** Authority instantly changes parameters to enable exploits (e.g., set utilization to 100%).

**Mitigation:** 24-hour timelock on parameter changes.

```rust
pub fn queue_param_change(...) -> Result<()> {
    const TIMELOCK_DURATION: i64 = 86400; // 24 hours
    vault.param_change_unlock_time = clock.unix_timestamp + TIMELOCK_DURATION;
    // ...
}

pub fn execute_param_change(...) -> Result<()> {
    require!(
        clock.unix_timestamp >= vault.param_change_unlock_time,
        VaultError::TimelockNotExpired
    );
    // ...
}
```

---

### 10. Force Close Authority Verification

**Attack Vector:** Unauthorized entity calls `force_close_vault` to drain rent.

**Mitigation:** Verify caller is stored vault authority.

```rust
// Read authority from raw account data (bytes 8-40)
let vault_data = vault_account.try_borrow_data()?;
let stored_authority = Pubkey::try_from(&vault_data[8..40])?;

require!(
    stored_authority == authority.key(),
    VaultError::UnauthorizedForceClose
);
```

---

### 11. Division by Zero Protection

**Attack Vector:** Edge cases causing division by zero, leading to undefined behavior.

**Mitigation:** Explicit zero checks before all divisions.

```rust
require!(vault.total_assets > 0, VaultError::DivisionByZero);
require!(effective_shares > 0, VaultError::DivisionByZero);
```

---

### 12. Rent Exemption

**Mitigation:** All accounts are initialized with Anchor's `init` macro, which automatically calculates and transfers rent-exempt lamports. The `space` attribute explicitly defines account sizes to ensure rent exemption is maintained.

---

## Off-Chain Security (Keeper & RFQ Router)

### 1. API Key Authentication

**Attack Vector:** Unauthorized market makers submitting fake quotes.

**Mitigation:** API key validation for WebSocket connections.

```javascript
// Production: No default keys
if (IS_PRODUCTION && !MM_API_KEYS_ENV) {
    console.error("FATAL: MM_API_KEYS must be set");
    process.exit(1);
}

// Authorization header (preferred)
const authHeader = req.headers.authorization;
if (authHeader.startsWith("Bearer ")) {
    apiKey = authHeader.slice(7);
}
```

---

### 2. Rate Limiting

**Attack Vector:** Market maker spam overwhelming the RFQ router.

**Mitigation:** Per-maker rate limits.

```javascript
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 100;

if (!checkRateLimit(makerId)) {
    return { valid: false, error: "Rate limit exceeded (100 quotes/minute)" };
}
```

---

### 3. CORS Protection

**Attack Vector:** Malicious websites making cross-origin requests.

**Mitigation:** Configurable origin whitelist.

```javascript
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",");

if (ALLOWED_ORIGINS && ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
}
```

---

### 4. Wallet Key Security

**Attack Vector:** Keeper private key compromise.

**Mitigation:** Support for environment-based key loading.

```typescript
// Recommended for production:
// 1. AWS KMS: Set WALLET_KMS_KEY_ID
// 2. GCP Secret Manager: Set WALLET_SECRET_NAME
// 3. HashiCorp Vault: Set VAULT_ADDR and VAULT_TOKEN
// 4. Encrypted env: Set WALLET_PRIVATE_KEY

if (IS_PRODUCTION && !process.env.WALLET_PRIVATE_KEY) {
    console.error("⚠️ SECURITY WARNING: Using local keypair in production!");
}
```

---

### 5. Premium Collection Authority

**Attack Vector:** Front-running keeper's premium collection transaction.

**Mitigation:** Authority signature required.

```rust
#[account(
    seeds = [b"vault", vault.asset_id.as_bytes()],
    bump = vault.bump,
    has_one = authority  // Only authority can collect premium
)]
pub vault: Account<'info, Vault>,

pub authority: Signer<'info>,
```

---

## Attack Vectors & Mitigations

| Attack | Category | Mitigation | Status |
|--------|----------|------------|--------|
| First-depositor share manipulation | On-chain | Virtual offset | ✅ |
| Settlement theft | On-chain | MM whitelist + amount cap | ✅ |
| Flash loan | On-chain | Epoch-gated withdrawals | ✅ |
| Epoch cycling | On-chain | Minimum duration | ✅ |
| Premium manipulation | On-chain | TVL cap + yield cap | ✅ |
| Over-utilization | On-chain | Utilization cap (80%) | ✅ |
| Withdrawal slippage | On-chain | min_expected_amount | ✅ |
| Division by zero | On-chain | Explicit checks | ✅ |
| Parameter manipulation | On-chain | 24h timelock | ✅ |
| Force close theft | On-chain | Authority verification | ✅ |
| Unauthorized MM | Off-chain | API key auth | ✅ |
| Quote spam | Off-chain | Rate limiting | ✅ |
| Cross-site requests | Off-chain | CORS whitelist | ✅ |
| Key compromise | Off-chain | HSM/KMS support | ✅ |
| Premium front-running | On-chain | Authority signature | ✅ |
| Emergency exploit | On-chain | Pause mechanism | ✅ |

---

## Known Limitations

### 1. Single Withdrawal Per Epoch

Users can only have one pending withdrawal request per vault per epoch. The withdrawal PDA is seeded by:

```rust
seeds = [b"withdrawal", vault.key(), user.key(), &epoch.to_le_bytes()]
```

**Workaround:** Request additional withdrawals in subsequent epochs.

### 2. Single Authority

The vault currently uses a single authority key for all privileged operations.

**Recommendation:** Implement multisig wallet before mainnet.

### 3. No Oracle Manipulation Protection

The protocol trusts Pyth oracle prices. Extreme oracle manipulation could affect settlement calculations.

**Mitigation:** Settlement amount capped at epoch premium earned.

---

## Security Checklist

### Pre-Launch

- [ ] Multisig for vault authority
- [ ] Multisig for program upgrade authority
- [ ] HSM/KMS for keeper wallet
- [ ] `MM_API_KEYS` set (not defaults)
- [ ] `ALLOWED_ORIGINS` set for CORS
- [ ] `NODE_ENV=production`
- [ ] Professional security audit

### Post-Launch

- [ ] Bug bounty program
- [ ] On-chain event monitoring
- [ ] Alert system for:
  - Pause events
  - Large withdrawals
  - Parameter changes
  - Unusual premium rates

---

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do not** disclose publicly
2. Email: security@optionsfi.xyz
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work to resolve issues promptly.

---

*Last updated: December 2025*
