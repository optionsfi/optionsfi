# Scripts Guide

This guide documents all scripts in the `/scripts` directory.

---

## 🔧 Setup & Configuration

### `setup.sh`
**Purpose:** Initial project setup script.  
**Usage:**
```bash
./scripts/setup.sh
```

### `setup-demo.ts`
**Purpose:** Creates a demo vault with 15-minute epoch intervals for testing.  
**Usage:**
```bash
npx ts-node scripts/setup-demo.ts <assetId>
# Example: npx ts-node scripts/setup-demo.ts DemoV3
```

### `convert-key.js`
**Purpose:** Converts wallet key formats (JSON array ↔ base58).  
**Usage:**
```bash
node scripts/convert-key.js
```

---

## 🏦 Vault Management

### `create-vault.ts`
**Purpose:** Creates a new production vault with custom parameters.  
**Usage:**
```bash
npx ts-node scripts/create-vault.ts
```
Requires editing script to set `ASSET_ID`, `UTILIZATION_CAP_BPS`, `MIN_EPOCH_DURATION`.

### `check-vault.ts`
**Purpose:** Quick check of vault on-chain state.  
**Usage:**
```bash
npx ts-node scripts/check-vault.ts <assetId>
```

### `inspect-vault.ts`
**Purpose:** Detailed inspection of vault account data.  
**Usage:**
```bash
npx ts-node scripts/inspect-vault.ts <assetId>
```

### `close-orphaned-account.ts`
**Purpose:** Closes orphaned token accounts after vault force-close.  
**Usage:**
```bash
npx ts-node scripts/close-orphaned-account.ts <assetId> <tokenAccountPubkey>
```

### `force-close-vault.ts`
**Purpose:** Force closes a vault (bypasses deserialization).  
**Usage:**
```bash
npx ts-node scripts/force-close-vault.ts <assetId>
```
> ⚠️ **WARNING:** Only use for broken vaults. Assets may be lost!

### `migrate-vault.ts`
**Purpose:** Migrates vault to new parameters or structure.  
**Usage:**
```bash
npx ts-node scripts/migrate-vault.ts
```

### `fix-vault-shortfall.ts`
**Purpose:** Fixes vault state when actual balance differs from `total_assets`.  
**Usage:**
```bash
npx ts-node scripts/fix-vault-shortfall.ts <assetId>
```

---

## 🪙 Token Management

### `create-nvdax.ts`
**Purpose:** Creates the mock NVDAx token mint with metadata.  
**Usage:**
```bash
npx ts-node scripts/create-nvdax.ts
```

### `create-usdc.ts`
**Purpose:** Creates a mock USDC token mint for testing.  
**Usage:**
```bash
npx ts-node scripts/create-usdc.ts
```

### `fund-keeper.ts`
**Purpose:** Funds the keeper wallet with USDC for premium collection.  
**Usage:**
```bash
npx ts-node scripts/fund-keeper.ts <amount>
```

### `check-holdings.ts`
**Purpose:** Audits wallet token holdings and classifies them as active or stale.  
**Usage:**
```bash
npx ts-node scripts/check-holdings.ts [walletAddress]
# If no address provided, uses default wallet from ~/.config/solana/id.json
```

### `cleanup-tokens.ts`
**Purpose:** Closes empty/unused token accounts to reclaim rent.  
**Usage:**
```bash
# Dry run (analysis only)
npx ts-node scripts/cleanup-tokens.ts

# Execute cleanup
npx ts-node scripts/cleanup-tokens.ts execute
```

---

## 📤 Withdrawals

### `inspect-withdrawal.ts`
**Purpose:** Inspects a user's pending withdrawal request.  
**Usage:**
```bash
npx ts-node scripts/inspect-withdrawal.ts <assetId> [userPubkey]
```

---

## 🔄 Epoch Operations

### `debug-roll.ts`
**Purpose:** Debug epoch roll issues by inspecting vault timing state.  
**Usage:**
```bash
npx ts-node scripts/debug-roll.ts <assetId>
```

---

## 🔐 Security & Upgrades

### `verify-upgrade.ts`
**Purpose:** Pre-deployment verification that all vaults can deserialize with new code.  
**Usage:**
```bash
npx ts-node scripts/verify-upgrade.ts
```
> ⚠️ Always run this before deploying program upgrades!

### `verify-key.ts`
**Purpose:** Verifies a wallet keypair is valid.  
**Usage:**
```bash
npx ts-node scripts/verify-key.ts
```

---

## 📋 Environment Files

### `.env.mints`
**Purpose:** Reference file containing known mint addresses.  
Not executable — used for documentation/reference.

---

## Quick Reference

| Script | Category | Description |
|--------|----------|-------------|
| `setup-demo.ts` | Setup | Create demo vault |
| `create-vault.ts` | Vault | Create production vault |
| `check-vault.ts` | Vault | Quick vault status |
| `inspect-vault.ts` | Vault | Detailed vault inspection |
| `force-close-vault.ts` | Vault | Emergency vault close |
| `check-holdings.ts` | Tokens | Audit wallet holdings |
| `cleanup-tokens.ts` | Tokens | Close unused token accounts |
| `fund-keeper.ts` | Tokens | Fund keeper with USDC |
| `verify-upgrade.ts` | Security | Pre-deploy verification |
| `inspect-withdrawal.ts` | Withdrawals | Check pending withdrawals |

---

*Last updated: December 2025*
