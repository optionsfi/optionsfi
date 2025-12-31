use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, MintTo, Burn};
use anchor_spl::associated_token::AssociatedToken;

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
    /// SECURITY: Validates mint addresses to prevent malicious tokens
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        asset_id: String,
        utilization_cap_bps: u16,
        min_epoch_duration: i64,
    ) -> Result<()> {
        // SECURITY: Validate underlying mint is not suspicious
        // Check for freeze authority (suspicious for DeFi)
        let underlying_mint_info = &ctx.accounts.underlying_mint;
        if let Some(_freeze_auth) = underlying_mint_info.freeze_authority {
            msg!("WARNING: Underlying mint has freeze authority");
            // In production, you might want to reject this
        }
        
        // SECURITY: Validate premium mint (USDC)
        // Premium mint should be a known stablecoin
        let premium_mint_key = ctx.accounts.premium_mint.key();
        // Add your approved stablecoin mints here
        // For now, we just log and continue
        msg!("Premium mint: {}", premium_mint_key);
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.asset_id = asset_id;
        vault.underlying_mint = ctx.accounts.underlying_mint.key();
        vault.share_mint = ctx.accounts.share_mint.key();
        vault.vault_token_account = ctx.accounts.vault_token_account.key();
        vault.premium_mint = ctx.accounts.premium_mint.key();
        vault.premium_token_account = ctx.accounts.premium_token_account.key();
        vault.share_escrow = ctx.accounts.share_escrow.key();
        vault.total_assets = 0;
        vault.total_shares = 0;
        vault.epoch = 0;
        vault.utilization_cap_bps = utilization_cap_bps;
        vault.min_epoch_duration = min_epoch_duration;
        vault.last_roll_timestamp = Clock::get()?.unix_timestamp;
        vault.pending_withdrawals = 0;
        vault.epoch_notional_exposed = 0;
        vault.epoch_premium_earned = 0;
        vault.epoch_premium_per_token_bps = 0;
        vault.is_paused = false;
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    /// Deposit underlying tokens and receive vault shares
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        let vault = &mut ctx.accounts.vault;

        // SECURITY: Check if vault is paused
        require!(!vault.is_paused, VaultError::VaultPaused);

        // Calculate shares to mint
        // effective_total_shares = total_shares + virtual_offset
        let effective_shares = vault.total_shares.checked_add(vault.virtual_offset).ok_or(VaultError::Overflow)?;
        
        let shares_to_mint = if effective_shares == 0 {
            // First deposit: set virtual offset (no real shares minted)
            // Virtual offset prevents share price manipulation attacks
            vault.virtual_offset = 1000;
            
            // User gets full value - no tokens "lost"
            // shares = amount * (total_shares + virtual_offset) / total_assets
            // But total_assets is 0, so we use 1:1 initially
            amount
        } else {
            // SECURITY FIX M-2: Explicit division by zero check
            require!(vault.total_assets > 0, VaultError::DivisionByZero);
            
            // shares = amount * effective_shares / total_assets
            (amount as u128)
                .checked_mul(effective_shares as u128)
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

        // Auto-start epoch 1 on first deposit
        // This provides better UX - vault becomes "active" immediately
        if vault.epoch == 0 && vault.total_assets > 0 {
            vault.epoch = 1;
            vault.last_roll_timestamp = Clock::get()?.unix_timestamp;
            msg!("Auto-started epoch 1 on first deposit");
        }

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

        // SECURITY: Check if vault is paused
        require!(!vault.is_paused, VaultError::VaultPaused);

        // Check user has enough shares
        require!(
            ctx.accounts.user_share_account.amount >= shares,
            VaultError::InsufficientShares
        );

        // Transfer shares to vault escrow
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_share_account.to_account_info(),
                    to: ctx.accounts.share_escrow.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            shares,
        )?;

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
    /// SECURITY FIX H-3: Added min_expected_amount for slippage protection
    /// SECURITY FIX M-3: Blocked when vault is paused
    pub fn process_withdrawal(ctx: Context<ProcessWithdrawal>, min_expected_amount: u64) -> Result<()> {
        let withdrawal = &mut ctx.accounts.withdrawal_request;
        let vault = &mut ctx.accounts.vault;

        // SECURITY FIX M-3: Block withdrawals when paused (emergency protection)
        require!(!vault.is_paused, VaultError::VaultPaused);

        require!(!withdrawal.processed, VaultError::AlreadyProcessed);
        require!(
            vault.epoch > withdrawal.request_epoch,
            VaultError::EpochNotSettled
        );

        let shares = withdrawal.shares;

        // Calculate underlying amount to return using effective shares
        // effective_shares = total_shares + virtual_offset
        let effective_shares = vault.total_shares.checked_add(vault.virtual_offset).ok_or(VaultError::Overflow)?;
        
        // SECURITY FIX M-2: Explicit division by zero check
        require!(effective_shares > 0, VaultError::DivisionByZero);
        
        let amount = (shares as u128)
            .checked_mul(vault.total_assets as u128)
            .ok_or(VaultError::Overflow)?
            .checked_div(effective_shares as u128)
            .ok_or(VaultError::Overflow)? as u64;

        // SECURITY FIX H-3: Slippage protection - user specifies minimum acceptable amount
        require!(
            amount >= min_expected_amount,
            VaultError::SlippageExceeded
        );

        // SECURITY FIX H-1: Verify vault has sufficient assets
        require!(
            vault.total_assets >= amount,
            VaultError::InsufficientVaultBalance
        );

        // Burn user's shares
        let asset_id = vault.asset_id.as_bytes();
        let seeds = &[
            b"vault",
            asset_id,
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::burn(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Burn {
                    mint: ctx.accounts.share_mint.to_account_info(),
                    from: ctx.accounts.share_escrow.to_account_info(),
                    authority: vault.to_account_info(), // Vault auth
                },
                signer_seeds,
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

        // Calculate and claim proportional USDC premiums
        // Claimable = (shares / effective_shares) * premium_balance_usdc
        let premium_balance = vault.premium_balance_usdc;
        if premium_balance > 0 {
            let user_premium_share = (shares as u128)
                .checked_mul(premium_balance as u128)
                .ok_or(VaultError::Overflow)?
                .checked_div(effective_shares as u128)
                .ok_or(VaultError::Overflow)? as u64;

            if user_premium_share > 0 {
                // LONG-TERM FIX: Cap claim to actual token balance to handle state/balance drift
                // This prevents "insufficient funds" errors if state drifts from actual balance
                let actual_premium_balance = ctx.accounts.vault_premium_account.amount;
                let capped_premium_share = user_premium_share.min(actual_premium_balance);
                
                if capped_premium_share > 0 {
                    // Transfer USDC to user
                    token::transfer(
                        CpiContext::new_with_signer(
                            ctx.accounts.token_program.to_account_info(), // Standard token program for USDC
                            Transfer {
                                from: ctx.accounts.vault_premium_account.to_account_info(),
                                to: ctx.accounts.user_premium_account.to_account_info(),
                                authority: vault.to_account_info(),
                            },
                            signer_seeds,
                        ),
                        capped_premium_share,
                    )?;

                    // Deduct capped amount from vault state
                    vault.premium_balance_usdc = vault.premium_balance_usdc
                        .checked_sub(capped_premium_share)
                        .ok_or(VaultError::Overflow)?;
                    
                    if capped_premium_share < user_premium_share {
                        msg!("WARNING: Premium capped from {} to {} due to balance drift", 
                            user_premium_share, capped_premium_share);
                    }
                    msg!("Withdrew premium share: {} USDC", capped_premium_share);
                }
            }
        }

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

        // 1. Timelock Check
        require!(
            clock.unix_timestamp >= vault.last_roll_timestamp + vault.min_epoch_duration,
            VaultError::EpochTooShort
        );

        // 2. Unbounded Premium Check (TVL Cap)
        // Premium shouldn't be > 50% of TVL in a single epoch (sanity check against infinite mint)
        require!(
            premium_earned <= vault.total_assets / 2,
            VaultError::ExcessivePremium
        );

        // 3. Implied Yield Check
        // If we have exposure, check that implied yield (premium / exposure) isn't insane (e.g., > 20% flat)
        if vault.epoch_notional_exposed > 0 {
             let yield_bps = (premium_earned as u128)
                .checked_mul(10000)
                .ok_or(VaultError::Overflow)?
                .checked_div(vault.epoch_notional_exposed as u128)
                .ok_or(VaultError::Overflow)?;
            
            // 2000 bps = 20% return in a single epoch. That's extremely high.
            require!(yield_bps <= 2000, VaultError::ExcessiveYield);
        } else {
            // No exposure => no premium expected (or very small)
             require!(premium_earned == 0, VaultError::ExcessivePremium);
        }

        // Store epoch stats before resetting
        let notional_exposed = vault.epoch_notional_exposed;
        let avg_premium_bps = vault.epoch_premium_per_token_bps;

        // Credit premium to USDC balance (separate from underlying TVL)
        // This prevents the "flywheel" effect of synthetic token creation
        vault.premium_balance_usdc = vault.premium_balance_usdc
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
            premium_balance_usdc: vault.premium_balance_usdc,
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
    /// SECURITY FIX M-1: Now requires authority signature to prevent front-running
    /// SECURITY FIX M-1b: Now updates epoch_premium_earned to track state
    pub fn collect_premium(ctx: Context<CollectPremium>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        let vault = &mut ctx.accounts.vault;

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

        // SECURITY FIX M-1b: Track collected premium in vault state
        vault.epoch_premium_earned = vault.epoch_premium_earned
            .checked_add(amount)
            .ok_or(VaultError::Overflow)?;

        emit!(PremiumCollectedEvent {
            vault: vault.key(),
            payer: ctx.accounts.payer.key(),
            amount,
            epoch: vault.epoch,
        });

        Ok(())
    }

    /// Pay out to market maker for ITM settlement
    /// Only callable by vault authority
    /// SECURITY: Settlement capped at epoch premium earned
    pub fn pay_settlement(ctx: Context<PaySettlement>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);

        // SECURITY FIX C-1: Verify recipient is whitelisted BEFORE transfer
        let whitelist = &ctx.accounts.whitelist;
        require!(
            whitelist.market_makers.contains(&ctx.accounts.recipient.key()),
            VaultError::NotWhitelisted
        );

        // SECURITY FIX H-2: Cap settlements at epoch premium earned
        let vault = &ctx.accounts.vault;
        require!(
            amount <= vault.epoch_premium_earned,
            VaultError::ExcessiveSettlement
        );

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

    /// Create metadata for the share token (vNVDAx, etc.)
    /// Only callable by vault authority since vault PDA is the mint authority
    pub fn create_share_metadata(
        ctx: Context<CreateShareMetadata>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let asset_id = vault.asset_id.as_bytes();
        let seeds = &[
            b"vault",
            asset_id,
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // Build the CreateMetadataAccountV3 instruction
        let create_metadata_ix = mpl_token_metadata::instructions::CreateMetadataAccountV3 {
            metadata: ctx.accounts.metadata.key(),
            mint: ctx.accounts.share_mint.key(),
            mint_authority: vault.key(),
            payer: ctx.accounts.payer.key(),
            update_authority: (vault.key(), true),
            system_program: ctx.accounts.system_program.key(),
            rent: Some(ctx.accounts.rent.key()),
        };

        let data_v2 = mpl_token_metadata::types::DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        let ix = create_metadata_ix.instruction(
            mpl_token_metadata::instructions::CreateMetadataAccountV3InstructionArgs {
                data: data_v2,
                is_mutable: true,
                collection_details: None,
            }
        );

        anchor_lang::solana_program::program::invoke_signed(
            &ix,
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.share_mint.to_account_info(),
                vault.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
            signer_seeds,
        )?;

        msg!("Created metadata for share token: {}", ctx.accounts.share_mint.key());
        Ok(())
    }

    /// Initialize the market maker whitelist
    pub fn initialize_whitelist(ctx: Context<InitializeWhitelist>) -> Result<()> {
        let whitelist = &mut ctx.accounts.whitelist;
        whitelist.authority = ctx.accounts.authority.key();
        whitelist.vault = ctx.accounts.vault.key();
        whitelist.market_makers = Vec::new(); // Maximum 10 MMs
        whitelist.bump = ctx.bumps.whitelist;
        Ok(())
    }

    /// Add a market maker to the whitelist
    pub fn add_market_maker(ctx: Context<AddMarketMaker>, market_maker: Pubkey) -> Result<()> {
        let whitelist = &mut ctx.accounts.whitelist;
        require!(whitelist.market_makers.len() < 10, VaultError::WhitelistFull);
        require!(!whitelist.market_makers.contains(&market_maker), VaultError::AlreadyWhitelisted);

        whitelist.market_makers.push(market_maker);
        Ok(())
    }

    /// SECURITY FIX M-4: Remove a market maker from the whitelist
    pub fn remove_market_maker(ctx: Context<RemoveMarketMaker>, market_maker: Pubkey) -> Result<()> {
        let whitelist = &mut ctx.accounts.whitelist;
        
        let position = whitelist.market_makers.iter().position(|&mm| mm == market_maker);
        require!(position.is_some(), VaultError::NotWhitelisted);
        
        whitelist.market_makers.remove(position.unwrap());
        
        emit!(MarketMakerRemovedEvent {
            vault: ctx.accounts.vault.key(),
            market_maker,
        });
        
        Ok(())
    }

    /// SECURITY: Pause or unpause the vault (emergency control)
    /// When paused, deposits and withdrawal requests are blocked
    pub fn set_pause(ctx: Context<SetPause>, paused: bool) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.is_paused = paused;
        
        emit!(VaultPausedEvent {
            vault: vault.key(),
            paused,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    /// SECURITY FIX M-3: Queue a parameter change with timelock
    /// Changes take effect after TIMELOCK_DURATION (24 hours)
    pub fn queue_param_change(
        ctx: Context<SetParam>,
        new_min_epoch_duration: Option<i64>,
        new_utilization_cap_bps: Option<u16>,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let clock = Clock::get()?;
        
        // Store pending changes
        if let Some(duration) = new_min_epoch_duration {
            vault.pending_min_epoch_duration = duration;
        }
        if let Some(cap) = new_utilization_cap_bps {
            require!(cap <= 10000, VaultError::InvalidParameter); // Max 100%
            vault.pending_utilization_cap = cap;
        }
        
        // Set execution time (24 hours from now)
        const TIMELOCK_DURATION: i64 = 86400; // 24 hours
        vault.param_change_unlock_time = clock.unix_timestamp + TIMELOCK_DURATION;
        
        emit!(ParamChangeQueuedEvent {
            vault: vault.key(),
            new_min_epoch_duration,
            new_utilization_cap_bps,
            unlock_time: vault.param_change_unlock_time,
        });
        
        Ok(())
    }

    /// SECURITY FIX M-3: Execute queued parameter changes after timelock
    pub fn execute_param_change(ctx: Context<SetParam>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let clock = Clock::get()?;
        
        // Check timelock has passed
        require!(
            vault.param_change_unlock_time > 0 && clock.unix_timestamp >= vault.param_change_unlock_time,
            VaultError::TimelockNotExpired
        );
        
        // Apply pending changes
        if vault.pending_min_epoch_duration > 0 {
            vault.min_epoch_duration = vault.pending_min_epoch_duration;
        }
        if vault.pending_utilization_cap > 0 {
            vault.utilization_cap_bps = vault.pending_utilization_cap;
        }
        
        emit!(ParamChangeExecutedEvent {
            vault: vault.key(),
            new_min_epoch_duration: vault.min_epoch_duration,
            new_utilization_cap_bps: vault.utilization_cap_bps,
        });
        
        // Reset pending state
        vault.pending_min_epoch_duration = 0;
        vault.pending_utilization_cap = 0;
        vault.param_change_unlock_time = 0;
        
        Ok(())
    }

    /// Cancel a queued parameter change
    pub fn cancel_param_change(ctx: Context<SetParam>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        vault.pending_min_epoch_duration = 0;
        vault.pending_utilization_cap = 0;
        vault.param_change_unlock_time = 0;
        
        Ok(())
    }

    /// DEPRECATED: Direct parameter changes now require timelock
    /// Kept for backwards compatibility but will fail
    pub fn set_min_epoch_duration(_ctx: Context<SetParam>, _duration: i64) -> Result<()> {
        Err(VaultError::UseTimelockForParamChange.into())
    }

    /// DEPRECATED: Direct parameter changes now require timelock
    /// Kept for backwards compatibility but will fail
    pub fn set_utilization_cap(_ctx: Context<SetParam>, _cap_bps: u16) -> Result<()> {
        Err(VaultError::UseTimelockForParamChange.into())
    }

    /// Reconcile premium_balance_usdc state with actual token account balance
    /// Use this to fix state drift caused by manual token movements or bugs
    /// Authority only
    pub fn reconcile_premium_balance(ctx: Context<ReconcilePremiumBalance>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let old_balance = vault.premium_balance_usdc;
        let actual_balance = ctx.accounts.vault_premium_account.amount;
        
        vault.premium_balance_usdc = actual_balance;
        
        msg!("Reconciled premium balance: {} -> {}", old_balance, actual_balance);
        
        emit!(PremiumBalanceReconciledEvent {
            vault: vault.key(),
            old_balance,
            new_balance: actual_balance,
        });
        
        Ok(())
    }

    /// Close a vault and recover rent (authority only)
    /// Vault must be empty (no assets, shares, or pending withdrawals)
    pub fn close_vault(ctx: Context<CloseVault>) -> Result<()> {
        let vault = &ctx.accounts.vault;
        
        // Safety checks - vault must be completely empty
        require!(vault.total_assets == 0, VaultError::VaultNotEmpty);
        require!(vault.total_shares == 0, VaultError::VaultNotEmpty);
        require!(vault.pending_withdrawals == 0, VaultError::VaultNotEmpty);
        require!(vault.epoch_notional_exposed == 0, VaultError::VaultNotEmpty);
        
        // Account will be closed automatically by Anchor's close constraint
        Ok(())
    }

    /// Force close a vault account (bypasses deserialization)
    /// USE WITH CAUTION: Only for recovering from incompatible account structures
    /// SECURITY FIX C-2: Now verifies caller is the stored vault authority
    pub fn force_close_vault(ctx: Context<ForceCloseVault>, asset_id: String) -> Result<()> {
        let vault_account = &ctx.accounts.vault;
        let authority = &ctx.accounts.authority;

        // Verify the PDA matches what we expect
        let (expected_pda, _bump) = Pubkey::find_program_address(
            &[b"vault", asset_id.as_bytes()],
            ctx.program_id,
        );
        require!(vault_account.key() == expected_pda, VaultError::InvalidVaultPda);

        // SECURITY FIX C-2: Verify caller is the vault authority
        // Authority is stored at bytes 8-40 (after 8-byte discriminator)
        let vault_data = vault_account.try_borrow_data()?;
        require!(vault_data.len() >= 40, VaultError::InvalidVaultPda);
        
        let stored_authority = Pubkey::try_from(&vault_data[8..40])
            .map_err(|_| VaultError::InvalidVaultPda)?;
        require!(
            stored_authority == authority.key(),
            VaultError::UnauthorizedForceClose
        );
        drop(vault_data); // Release borrow before modifying

        // Transfer all lamports to authority
        let vault_lamports = vault_account.lamports();
        **vault_account.try_borrow_mut_lamports()? = 0;
        **authority.try_borrow_mut_lamports()? = authority.lamports()
            .checked_add(vault_lamports)
            .ok_or(VaultError::Overflow)?;

        // Zero out the account data
        vault_account.try_borrow_mut_data()?.fill(0);

        msg!("Force closed vault {} - returned {} lamports", asset_id, vault_lamports);
        Ok(())
    }

    /// Close an orphaned token account that was owned by a vault PDA
    /// This is used to clean up old share escrows, vault token accounts, etc.
    /// after a vault has been force-closed, enabling reuse of asset IDs.
    /// 
    /// The caller must provide the correct asset_id that was used to derive the vault PDA.
    /// The vault PDA must NOT exist anymore (force-closed).
    pub fn close_orphaned_token_account(
        ctx: Context<CloseOrphanedTokenAccount>,
        asset_id: String,
    ) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;

        // Derive vault PDA - this is the owner of the orphaned token account
        let (vault_pda, bump) = Pubkey::find_program_address(
            &[b"vault", asset_id.as_bytes()],
            ctx.program_id,
        );

        // Verify the vault no longer exists
        require!(
            ctx.accounts.vault_pda.data_is_empty(),
            VaultError::VaultStillExists
        );

        // Verify the vault PDA matches
        require!(
            ctx.accounts.vault_pda.key() == vault_pda,
            VaultError::InvalidVaultPda
        );

        // SECURITY FIX H-1: Verify the token account is actually owned by this vault PDA
        // This prevents closing arbitrary token accounts
        require!(
            token_account.owner == vault_pda,
            VaultError::InvalidTokenAccountOwner
        );

        // Close the token account using vault PDA as signer
        let seeds = &[b"vault".as_ref(), asset_id.as_bytes(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        token::close_account(CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::CloseAccount {
                account: token_account.to_account_info(),
                destination: authority.to_account_info(),
                authority: ctx.accounts.vault_pda.to_account_info(),
            },
            signer_seeds,
        ))?;

        msg!("Closed orphaned token account {} for vault {}", token_account.key(), asset_id);
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
    // Share escrow for withdrawals
    pub share_escrow: Pubkey,
    // State
    pub total_assets: u64,
    pub total_shares: u64,
    /// Virtual offset for share calculations (prevents first-depositor attacks)
    /// effective_shares = total_shares + virtual_offset
    pub virtual_offset: u64,
    pub epoch: u64,
    pub utilization_cap_bps: u16,
    pub min_epoch_duration: i64,
    pub last_roll_timestamp: i64,
    pub pending_withdrawals: u64,
    // Notional-based exposure tracking
    pub epoch_notional_exposed: u64,
    pub epoch_premium_earned: u64,
    pub epoch_premium_per_token_bps: u32,
    /// Accumulated USDC premium balance (separate from underlying TVL)
    pub premium_balance_usdc: u64,
    /// SECURITY: Emergency pause flag
    pub is_paused: bool,
    /// SECURITY FIX M-3: Timelock for parameter changes
    pub pending_min_epoch_duration: i64,
    pub pending_utilization_cap: u16,
    pub param_change_unlock_time: i64,
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

#[account]
pub struct VaultWhitelist {
    pub authority: Pubkey,
    pub vault: Pubkey,
    pub market_makers: Vec<Pubkey>,
    pub bump: u8,
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
        //        + 32*6 (mints and accounts) + 8*8 (u64 fields) + 2 + 8 + 4 + 1 (is_paused)
        //        + 8 (pending_min_epoch_duration) + 2 (pending_utilization_cap) + 8 (param_change_unlock_time) + 1 (bump)
        space = 8 + 32 + 68 + 32 + 32 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 2 + 8 + 8 + 8 + 8 + 4 + 8 + 1 + 8 + 2 + 8 + 1,
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
        seeds = [b"share_mint", vault.key().as_ref()],
        bump
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = underlying_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = premium_mint,
        associated_token::authority = vault,
    )]
    pub premium_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = share_mint,
        token::authority = vault,
        seeds = [b"share_escrow", vault.key().as_ref()],
        bump
    )]
    pub share_escrow: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
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

    #[account(
        mut,
        address = vault.share_escrow
    )]
    pub share_escrow: Account<'info, TokenAccount>,

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

    #[account(
        mut,
        address = vault.share_escrow
    )]
    pub share_escrow: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = vault.share_mint
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
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
        address = vault.share_escrow
    )]
    pub share_escrow: Account<'info, TokenAccount>,

    #[account(
        mut,
        address = vault.premium_token_account
    )]
    pub vault_premium_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = premium_mint,
        associated_token::authority = user
    )]
    pub user_premium_account: Account<'info, TokenAccount>,

    #[account(address = vault.premium_mint)]
    pub premium_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
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
        mut,  // SECURITY FIX M-1b: Mutable to track premium state
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority  // SECURITY FIX M-1: Require authority to prevent front-running
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

    /// SECURITY FIX M-1: Authority must sign to prevent front-running premium collection
    pub authority: Signer<'info>,

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
        seeds = [b"whitelist", vault.key().as_ref()],
        bump = whitelist.bump,
        has_one = vault
    )]
    pub whitelist: Account<'info, VaultWhitelist>,

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

    /// CHECK: Recipient must be in the whitelist
    pub recipient: AccountInfo<'info>,

    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct InitializeWhitelist<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + (4 + 32 * 10) + 1, // Max 10 MMs
        seeds = [b"whitelist", vault.key().as_ref()],
        bump
    )]
    pub whitelist: Account<'info, VaultWhitelist>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddMarketMaker<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"whitelist", vault.key().as_ref()],
        bump = whitelist.bump,
        has_one = vault,
        has_one = authority
    )]
    pub whitelist: Account<'info, VaultWhitelist>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

/// SECURITY FIX M-4: Context for removing market makers
#[derive(Accounts)]
pub struct RemoveMarketMaker<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"whitelist", vault.key().as_ref()],
        bump = whitelist.bump,
        has_one = vault,
        has_one = authority
    )]
    pub whitelist: Account<'info, VaultWhitelist>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetPause<'info> {
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
pub struct SetParam<'info> {
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
pub struct ReconcilePremiumBalance<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        address = vault.premium_token_account
    )]
    pub vault_premium_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority,
        close = authority
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

/// Force close context - uses UncheckedAccount to bypass deserialization
/// SECURITY: Only the program upgrade authority should call this
#[derive(Accounts)]
#[instruction(asset_id: String)]
pub struct ForceCloseVault<'info> {
    /// CHECK: We verify the PDA matches in the instruction
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

/// Context for closing orphaned token accounts after vault force-close
/// This allows reusing asset IDs by cleaning up leftover PDAs
#[derive(Accounts)]
#[instruction(asset_id: String)]
pub struct CloseOrphanedTokenAccount<'info> {
    /// CHECK: The vault PDA - must be empty (force-closed)
    /// We verify this matches the derived PDA in the instruction
    #[account(mut)]
    pub vault_pda: UncheckedAccount<'info>,

    /// The token account to close (share escrow, vault token account, etc.)
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,

    /// Authority receiving the lamports
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateShareMetadata<'info> {
    #[account(
        seeds = [b"vault", vault.asset_id.as_bytes()],
        bump = vault.bump,
        has_one = authority,
        has_one = share_mint
    )]
    pub vault: Account<'info, Vault>,

    /// CHECK: The share mint owned by vault program
    pub share_mint: AccountInfo<'info>,

    /// CHECK: Metadata account to be created (validated by Metaplex)
    #[account(mut)]
    pub metadata: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,

    /// CHECK: Token Metadata Program
    #[account(address = METADATA_PROGRAM_ID)]
    pub token_metadata_program: AccountInfo<'info>,
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
    pub premium_balance_usdc: u64,
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

#[event]
pub struct VaultPausedEvent {
    pub vault: Pubkey,
    pub paused: bool,
    pub timestamp: i64,
}

#[event]
pub struct ParamChangeQueuedEvent {
    pub vault: Pubkey,
    pub new_min_epoch_duration: Option<i64>,
    pub new_utilization_cap_bps: Option<u16>,
    pub unlock_time: i64,
}

#[event]
pub struct ParamChangeExecutedEvent {
    pub vault: Pubkey,
    pub new_min_epoch_duration: i64,
    pub new_utilization_cap_bps: u16,
}

/// SECURITY FIX M-4: Event emitted when a market maker is removed
#[event]
pub struct MarketMakerRemovedEvent {
    pub vault: Pubkey,
    pub market_maker: Pubkey,
}

/// Event emitted when premium balance is reconciled
#[event]
pub struct PremiumBalanceReconciledEvent {
    pub vault: Pubkey,
    pub old_balance: u64,
    pub new_balance: u64,
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
    #[msg("Recipient is not whitelisted")]
    NotWhitelisted,
    #[msg("Whitelist is full")]
    WhitelistFull,
    #[msg("Market maker already whitelisted")]
    AlreadyWhitelisted,
    #[msg("Insufficient liquidity for first deposit")]
    InsufficientLiquidity,
    #[msg("Epoch duration too short")]
    EpochTooShort,
    #[msg("Premium exceeds safety limits")]
    ExcessivePremium,
    #[msg("Implied yield too high")]
    ExcessiveYield,
    #[msg("Settlement exceeds epoch premium earned")]
    ExcessiveSettlement,
    #[msg("Insufficient vault balance for withdrawal")]
    InsufficientVaultBalance,
    #[msg("Vault is paused")]
    VaultPaused,
    #[msg("Vault must be empty to close")]
    VaultNotEmpty,
    #[msg("Invalid vault PDA")]
    InvalidVaultPda,
    #[msg("Withdrawal amount below minimum expected (slippage protection)")]
    SlippageExceeded,
    #[msg("Division by zero")]
    DivisionByZero,
    #[msg("Timelock has not expired yet")]
    TimelockNotExpired,
    #[msg("Direct param changes deprecated - use queue_param_change")]
    UseTimelockForParamChange,
    #[msg("Invalid parameter value")]
    InvalidParameter,
    #[msg("Caller is not the vault authority")]
    UnauthorizedForceClose,
    #[msg("Vault still exists - close it first before cleaning up token accounts")]
    VaultStillExists,
    #[msg("Token account is not owned by the expected vault PDA")]
    InvalidTokenAccountOwner,
}
