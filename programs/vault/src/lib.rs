use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, MintTo, Burn};

declare_id!("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");

// Metaplex Token Metadata Program ID
const METADATA_PROGRAM_ID: Pubkey = Pubkey::new_from_array([
    11, 112, 101, 177, 227, 209, 124, 69, 56, 157, 82, 127, 107, 4, 195, 205,
    88, 184, 108, 115, 26, 160, 253, 181, 73, 182, 209, 188, 3, 248, 41, 70,
]);

#[program]
pub mod vault {
    use super::*;

    /// Initialize a new vault for a specific xStock asset
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        asset_id: String,
        utilization_cap_bps: u16,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.asset_id = asset_id;
        vault.underlying_mint = ctx.accounts.underlying_mint.key();
        vault.share_mint = ctx.accounts.share_mint.key();
        vault.vault_token_account = ctx.accounts.vault_token_account.key();
        vault.premium_mint = ctx.accounts.premium_mint.key();
        vault.premium_token_account = ctx.accounts.premium_token_account.key();
        vault.total_assets = 0;
        vault.total_shares = 0;
        vault.epoch = 0;
        vault.utilization_cap_bps = utilization_cap_bps;
        vault.last_roll_timestamp = Clock::get()?.unix_timestamp;
        vault.pending_withdrawals = 0;
        vault.epoch_notional_exposed = 0;
        vault.epoch_premium_earned = 0;
        vault.epoch_premium_per_token_bps = 0;
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    /// Deposit underlying tokens and receive vault shares
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        let vault = &mut ctx.accounts.vault;

        // Calculate shares to mint (1:1 if first deposit, otherwise pro-rata)
        let shares_to_mint = if vault.total_shares == 0 {
            amount
        } else {
            // shares = amount * total_shares / total_assets
            (amount as u128)
                .checked_mul(vault.total_shares as u128)
                .ok_or(VaultError::Overflow)?
                .checked_div(vault.total_assets as u128)
                .ok_or(VaultError::Overflow)? as u64
        };

        require!(shares_to_mint > 0, VaultError::ZeroShares);

        // Transfer underlying tokens from user to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.vault_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Mint vault shares to user
        let asset_id = vault.asset_id.as_bytes();
        let seeds = &[
            b"vault",
            asset_id,
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.share_mint.to_account_info(),
                    to: ctx.accounts.user_share_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer_seeds,
            ),
            shares_to_mint,
        )?;

        // Update vault state
        vault.total_assets = vault.total_assets
            .checked_add(amount)
            .ok_or(VaultError::Overflow)?;
        vault.total_shares = vault.total_shares
            .checked_add(shares_to_mint)
            .ok_or(VaultError::Overflow)?;

        emit!(DepositEvent {
            vault: vault.key(),
            user: ctx.accounts.user.key(),
            amount,
            shares_minted: shares_to_mint,
            epoch: vault.epoch,
        });

        Ok(())
    }

    /// Request withdrawal (queued until epoch end)
    pub fn request_withdrawal(ctx: Context<RequestWithdrawal>, shares: u64) -> Result<()> {
        require!(shares > 0, VaultError::ZeroAmount);

        let vault = &mut ctx.accounts.vault;
        let withdrawal = &mut ctx.accounts.withdrawal_request;

        // Check user has enough shares
        require!(
            ctx.accounts.user_share_account.amount >= shares,
            VaultError::InsufficientShares
        );

        withdrawal.user = ctx.accounts.user.key();
        withdrawal.vault = vault.key();
        withdrawal.shares = shares;
        withdrawal.request_epoch = vault.epoch;
        withdrawal.processed = false;

        vault.pending_withdrawals = vault.pending_withdrawals
            .checked_add(shares)
            .ok_or(VaultError::Overflow)?;

        emit!(WithdrawalRequestedEvent {
            vault: vault.key(),
            user: ctx.accounts.user.key(),
            shares,
            epoch: vault.epoch,
        });

        Ok(())
    }

    /// Process withdrawal after epoch settles
    pub fn process_withdrawal(ctx: Context<ProcessWithdrawal>) -> Result<()> {
        let withdrawal = &mut ctx.accounts.withdrawal_request;
        let vault = &mut ctx.accounts.vault;

        require!(!withdrawal.processed, VaultError::AlreadyProcessed);
        require!(
            vault.epoch > withdrawal.request_epoch,
            VaultError::EpochNotSettled
        );

        let shares = withdrawal.shares;

        // Calculate underlying amount to return
        let amount = (shares as u128)
            .checked_mul(vault.total_assets as u128)
            .ok_or(VaultError::Overflow)?
            .checked_div(vault.total_shares as u128)
            .ok_or(VaultError::Overflow)? as u64;

        // Burn user's shares
        let asset_id = vault.asset_id.as_bytes();
        let seeds = &[
            b"vault",
            asset_id,
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.share_mint.to_account_info(),
                    from: ctx.accounts.user_share_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            shares,
        )?;

        // Transfer underlying tokens back to user
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_token_account.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        // Update vault state
        vault.total_assets = vault.total_assets
            .checked_sub(amount)
            .ok_or(VaultError::Overflow)?;
        vault.total_shares = vault.total_shares
            .checked_sub(shares)
            .ok_or(VaultError::Overflow)?;
        vault.pending_withdrawals = vault.pending_withdrawals
            .checked_sub(shares)
            .ok_or(VaultError::Overflow)?;

        // Mark withdrawal as processed
        withdrawal.processed = true;

        emit!(WithdrawalProcessedEvent {
            vault: vault.key(),
            user: ctx.accounts.user.key(),
            shares,
            amount,
            epoch: vault.epoch,
        });

        Ok(())
    }

    /// Advance epoch (called by keeper after settlement)
    /// Premium earned is credited to total_assets, increasing share value
    pub fn advance_epoch(ctx: Context<AdvanceEpoch>, premium_earned: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let clock = Clock::get()?;

        // Store epoch stats before resetting
        let notional_exposed = vault.epoch_notional_exposed;
        let avg_premium_bps = vault.epoch_premium_per_token_bps;

        // Add premium to total assets (increases share value)
        vault.total_assets = vault.total_assets
            .checked_add(premium_earned)
            .ok_or(VaultError::Overflow)?;
        vault.epoch = vault.epoch
            .checked_add(1)
            .ok_or(VaultError::Overflow)?;
        vault.last_roll_timestamp = clock.unix_timestamp;

        // Reset epoch tracking for new epoch
        vault.epoch_notional_exposed = 0;
        vault.epoch_premium_earned = 0;
        vault.epoch_premium_per_token_bps = 0;

        emit!(EpochAdvancedEvent {
            vault: vault.key(),
            new_epoch: vault.epoch,
            premium_earned,
            notional_exposed,
            avg_premium_bps,
            total_assets: vault.total_assets,
            total_shares: vault.total_shares,
        });

        Ok(())
    }

    /// Record notional exposure when an RFQ is filled (fractional options)
    /// Premium is in premium_mint tokens (USDC)
    pub fn record_notional_exposure(
        ctx: Context<RecordNotionalExposure>,
        notional_tokens: u64,
        premium: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        // Calculate max exposure: TVL * utilization_cap_bps / 10000
        let max_exposure = (vault.total_assets as u128)
            .checked_mul(vault.utilization_cap_bps as u128)
            .ok_or(VaultError::Overflow)?
            .checked_div(10000)
            .ok_or(VaultError::Overflow)? as u64;

        let new_exposure = vault.epoch_notional_exposed
            .checked_add(notional_tokens)
            .ok_or(VaultError::Overflow)?;

        require!(
            new_exposure <= max_exposure,
            VaultError::ExceedsUtilizationCap
        );

        // Update epoch tracking
        vault.epoch_notional_exposed = new_exposure;
        vault.epoch_premium_earned = vault.epoch_premium_earned
            .checked_add(premium)
            .ok_or(VaultError::Overflow)?;

        // Calculate running average premium rate in basis points
        if vault.epoch_notional_exposed > 0 {
            vault.epoch_premium_per_token_bps = ((vault.epoch_premium_earned as u128)
                .checked_mul(10000)
                .ok_or(VaultError::Overflow)?
                .checked_div(vault.epoch_notional_exposed as u128)
                .ok_or(VaultError::Overflow)?) as u32;
        }

        emit!(NotionalExposureEvent {
            vault: vault.key(),
            epoch: vault.epoch,
            notional_tokens,
            premium,
            total_notional_this_epoch: vault.epoch_notional_exposed,
            total_premium_this_epoch: vault.epoch_premium_earned,
            avg_premium_bps: vault.epoch_premium_per_token_bps,
        });

        Ok(())
    }

    /// Collect premium from market maker (called during epoch roll)
    /// Transfers USDC from payer to vault's premium account
    pub fn collect_premium(ctx: Context<CollectPremium>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.payer_token_account.to_account_info(),
                    to: ctx.accounts.vault_premium_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            amount,
        )?;

        emit!(PremiumCollectedEvent {
            vault: ctx.accounts.vault.key(),
            payer: ctx.accounts.payer.key(),
            amount,
            epoch: ctx.accounts.vault.epoch,
        });

        Ok(())
    }

    /// Pay out to market maker for ITM settlement
    /// Only callable by vault authority
    pub fn pay_settlement(ctx: Context<PaySettlement>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        let vault = &ctx.accounts.vault;
        let asset_id = vault.asset_id.as_bytes();
        let seeds = &[
            b"vault",
            asset_id,
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_premium_account.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        emit!(SettlementPaidEvent {
            vault: vault.key(),
            recipient: ctx.accounts.recipient.key(),
            amount,
            epoch: vault.epoch,
        });

        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub asset_id: String,
    pub underlying_mint: Pubkey,
    pub share_mint: Pubkey,
    pub vault_token_account: Pubkey,
    // USDC premium escrow
    pub premium_mint: Pubkey,
    pub premium_token_account: Pubkey,
    // State
    pub total_assets: u64,
    pub total_shares: u64,
    pub epoch: u64,
    pub utilization_cap_bps: u16,
    pub last_roll_timestamp: i64,
    pub pending_withdrawals: u64,
    // Notional-based exposure tracking
    pub epoch_notional_exposed: u64,
    pub epoch_premium_earned: u64,
    pub epoch_premium_per_token_bps: u32,
    pub bump: u8,
}

#[account]
pub struct WithdrawalRequest {
    pub user: Pubkey,
    pub vault: Pubkey,
    pub shares: u64,
    pub request_epoch: u64,
    pub processed: bool,
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
#[instruction(asset_id: String)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        // Space: 8 (discriminator) + 32 (authority) + 68 (asset_id string max) 
        //        + 32*5 (mints and accounts) + 8*6 (u64 fields) + 2 + 8 + 4 + 1
        space = 8 + 32 + 68 + 32 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 2 + 8 + 8 + 8 + 8 + 4 + 1,
        seeds = [b"vault", asset_id.as_bytes()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    pub underlying_mint: Account<'info, Mint>,
    pub premium_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        mint::decimals = underlying_mint.decimals,
        mint::authority = vault,
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = underlying_mint,
        token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = premium_mint,
        token::authority = vault,
    )]
    pub premium_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        address = vault.share_mint
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        mut,
        address = vault.vault_token_account
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.underlying_mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.share_mint
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RequestWithdrawal<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 1,
        seeds = [b"withdrawal", vault.key().as_ref(), user.key().as_ref(), &vault.epoch.to_le_bytes()],
        bump
    )]
    pub withdrawal_request: Account<'info, WithdrawalRequest>,

    #[account(token::mint = vault.share_mint)]
    pub user_share_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessWithdrawal<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        has_one = user,
        has_one = vault,
    )]
    pub withdrawal_request: Account<'info, WithdrawalRequest>,

    #[account(
        mut,
        address = vault.share_mint
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        mut,
        address = vault.vault_token_account
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.underlying_mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.share_mint
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AdvanceEpoch<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordNotionalExposure<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CollectPremium<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        address = vault.premium_token_account
    )]
    pub vault_premium_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.premium_mint
    )]
    pub payer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PaySettlement<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        address = vault.premium_token_account
    )]
    pub vault_premium_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.premium_mint
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    /// CHECK: Recipient can be any account
    pub recipient: AccountInfo<'info>,

    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct DepositEvent {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub shares_minted: u64,
    pub epoch: u64,
}

#[event]
pub struct WithdrawalRequestedEvent {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub shares: u64,
    pub epoch: u64,
}

#[event]
pub struct WithdrawalProcessedEvent {
    pub vault: Pubkey,
    pub user: Pubkey,
    pub shares: u64,
    pub amount: u64,
    pub epoch: u64,
}

#[event]
pub struct EpochAdvancedEvent {
    pub vault: Pubkey,
    pub new_epoch: u64,
    pub premium_earned: u64,
    pub notional_exposed: u64,
    pub avg_premium_bps: u32,
    pub total_assets: u64,
    pub total_shares: u64,
}

#[event]
pub struct NotionalExposureEvent {
    pub vault: Pubkey,
    pub epoch: u64,
    pub notional_tokens: u64,
    pub premium: u64,
    pub total_notional_this_epoch: u64,
    pub total_premium_this_epoch: u64,
    pub avg_premium_bps: u32,
}

#[event]
pub struct PremiumCollectedEvent {
    pub vault: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub epoch: u64,
}

#[event]
pub struct SettlementPaidEvent {
    pub vault: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub epoch: u64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum VaultError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Calculated shares must be greater than zero")]
    ZeroShares,
    #[msg("Insufficient shares")]
    InsufficientShares,
    #[msg("Withdrawal already processed")]
    AlreadyProcessed,
    #[msg("Epoch has not settled yet")]
    EpochNotSettled,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Exceeds utilization cap")]
    ExceedsUtilizationCap,
}
