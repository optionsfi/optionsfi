module.exports = [
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[project]/app/anchor/vault_idl.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"address":"A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94","metadata":{"name":"vault","version":"0.1.0","spec":"0.1.0","description":"OptionsFi V2 - Covered Call Vault"},"instructions":[{"name":"advance_epoch","docs":["Advance epoch (called by keeper after settlement)","Premium earned is credited to total_assets, increasing share value"],"discriminator":[93,138,234,218,241,230,132,38],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"authority","signer":true,"relations":["vault"]}],"args":[{"name":"premium_earned","type":"u64"}]},{"name":"collect_premium","docs":["Collect premium from market maker (called during epoch roll)","Transfers USDC from payer to vault's premium account"],"discriminator":[166,199,123,128,71,141,223,204],"accounts":[{"name":"vault","pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"vault_premium_account","writable":true},{"name":"payer_token_account","writable":true},{"name":"payer","writable":true,"signer":true},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"deposit","docs":["Deposit underlying tokens and receive vault shares"],"discriminator":[242,35,198,137,82,225,242,182],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"share_mint","writable":true},{"name":"vault_token_account","writable":true},{"name":"user_token_account","writable":true},{"name":"user_share_account","writable":true},{"name":"user","writable":true,"signer":true},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"initialize_vault","docs":["Initialize a new vault for a specific xStock asset"],"discriminator":[48,191,163,44,71,129,63,164],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"arg","path":"asset_id"}]}},{"name":"underlying_mint"},{"name":"premium_mint"},{"name":"share_mint","writable":true,"signer":true},{"name":"vault_token_account","writable":true,"signer":true},{"name":"premium_token_account","writable":true,"signer":true},{"name":"authority","writable":true,"signer":true},{"name":"system_program","address":"11111111111111111111111111111111"},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"name":"rent","address":"SysvarRent111111111111111111111111111111111"}],"args":[{"name":"asset_id","type":"string"},{"name":"utilization_cap_bps","type":"u16"}]},{"name":"pay_settlement","docs":["Pay out to market maker for ITM settlement","Only callable by vault authority"],"discriminator":[65,54,44,166,205,55,164,205],"accounts":[{"name":"vault","pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"vault_premium_account","writable":true},{"name":"recipient_token_account","writable":true},{"name":"recipient"},{"name":"authority","signer":true,"relations":["vault"]},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"process_withdrawal","docs":["Process withdrawal after epoch settles"],"discriminator":[51,97,236,17,37,33,196,64],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]},"relations":["withdrawal_request"]},{"name":"withdrawal_request","writable":true},{"name":"share_mint","writable":true},{"name":"vault_token_account","writable":true},{"name":"user_token_account","writable":true},{"name":"user_share_account","writable":true},{"name":"user","writable":true,"signer":true,"relations":["withdrawal_request"]},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[]},{"name":"record_notional_exposure","docs":["Record notional exposure when an RFQ is filled (fractional options)","Premium is in premium_mint tokens (USDC)"],"discriminator":[26,180,108,160,15,34,179,128],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"authority","signer":true,"relations":["vault"]}],"args":[{"name":"notional_tokens","type":"u64"},{"name":"premium","type":"u64"}]},{"name":"request_withdrawal","docs":["Request withdrawal (queued until epoch end)"],"discriminator":[251,85,121,205,56,201,12,177],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"withdrawal_request","writable":true,"pda":{"seeds":[{"kind":"const","value":[119,105,116,104,100,114,97,119,97,108]},{"kind":"account","path":"vault"},{"kind":"account","path":"user"},{"kind":"account","path":"vault.epoch","account":"Vault"}]}},{"name":"user_share_account"},{"name":"user","writable":true,"signer":true},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"shares","type":"u64"}]}],"accounts":[{"name":"Vault","discriminator":[211,8,232,43,2,152,117,119]},{"name":"WithdrawalRequest","discriminator":[242,88,147,173,182,62,229,193]}],"events":[{"name":"DepositEvent","discriminator":[120,248,61,83,31,142,107,144]},{"name":"EpochAdvancedEvent","discriminator":[26,197,195,116,126,48,210,42]},{"name":"NotionalExposureEvent","discriminator":[220,74,165,136,237,183,23,38]},{"name":"PremiumCollectedEvent","discriminator":[76,52,166,111,182,211,215,144]},{"name":"SettlementPaidEvent","discriminator":[97,3,234,177,141,83,59,26]},{"name":"WithdrawalProcessedEvent","discriminator":[23,252,30,4,24,110,166,133]},{"name":"WithdrawalRequestedEvent","discriminator":[82,227,155,140,223,124,77,243]}],"errors":[{"code":6000,"name":"ZeroAmount","msg":"Amount must be greater than zero"},{"code":6001,"name":"ZeroShares","msg":"Calculated shares must be greater than zero"},{"code":6002,"name":"InsufficientShares","msg":"Insufficient shares"},{"code":6003,"name":"AlreadyProcessed","msg":"Withdrawal already processed"},{"code":6004,"name":"EpochNotSettled","msg":"Epoch has not settled yet"},{"code":6005,"name":"Overflow","msg":"Arithmetic overflow"},{"code":6006,"name":"ExceedsUtilizationCap","msg":"Exceeds utilization cap"}],"types":[{"name":"DepositEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"shares_minted","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"EpochAdvancedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"new_epoch","type":"u64"},{"name":"premium_earned","type":"u64"},{"name":"notional_exposed","type":"u64"},{"name":"avg_premium_bps","type":"u32"},{"name":"total_assets","type":"u64"},{"name":"total_shares","type":"u64"}]}},{"name":"NotionalExposureEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"epoch","type":"u64"},{"name":"notional_tokens","type":"u64"},{"name":"premium","type":"u64"},{"name":"total_notional_this_epoch","type":"u64"},{"name":"total_premium_this_epoch","type":"u64"},{"name":"avg_premium_bps","type":"u32"}]}},{"name":"PremiumCollectedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"payer","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"SettlementPaidEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"recipient","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"Vault","type":{"kind":"struct","fields":[{"name":"authority","type":"pubkey"},{"name":"asset_id","type":"string"},{"name":"underlying_mint","type":"pubkey"},{"name":"share_mint","type":"pubkey"},{"name":"vault_token_account","type":"pubkey"},{"name":"premium_mint","type":"pubkey"},{"name":"premium_token_account","type":"pubkey"},{"name":"total_assets","type":"u64"},{"name":"total_shares","type":"u64"},{"name":"epoch","type":"u64"},{"name":"utilization_cap_bps","type":"u16"},{"name":"last_roll_timestamp","type":"i64"},{"name":"pending_withdrawals","type":"u64"},{"name":"epoch_notional_exposed","type":"u64"},{"name":"epoch_premium_earned","type":"u64"},{"name":"epoch_premium_per_token_bps","type":"u32"},{"name":"bump","type":"u8"}]}},{"name":"WithdrawalProcessedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"WithdrawalRequest","type":{"kind":"struct","fields":[{"name":"user","type":"pubkey"},{"name":"vault","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"request_epoch","type":"u64"},{"name":"processed","type":"bool"}]}},{"name":"WithdrawalRequestedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"epoch","type":"u64"}]}}]});}),
"[project]/app/lib/vault-sdk.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ORACLE_PROGRAM_ID",
    ()=>ORACLE_PROGRAM_ID,
    "RFQ_PROGRAM_ID",
    ()=>RFQ_PROGRAM_ID,
    "VAULTS",
    ()=>VAULTS,
    "VAULT_PROGRAM_ID",
    ()=>VAULT_PROGRAM_ID,
    "buildAdvanceEpochTransaction",
    ()=>buildAdvanceEpochTransaction,
    "buildDepositTransaction",
    ()=>buildDepositTransaction,
    "buildProcessWithdrawalTransaction",
    ()=>buildProcessWithdrawalTransaction,
    "buildRequestWithdrawalTransaction",
    ()=>buildRequestWithdrawalTransaction,
    "deriveShareMintPda",
    ()=>deriveShareMintPda,
    "deriveVaultPda",
    ()=>deriveVaultPda,
    "deriveVaultTokenAccountPda",
    ()=>deriveVaultTokenAccountPda,
    "deriveWithdrawalPda",
    ()=>deriveWithdrawalPda,
    "fetchVaultData",
    ()=>fetchVaultData,
    "getUserShareBalance",
    ()=>getUserShareBalance,
    "getUserUnderlyingBalance",
    ()=>getUserUnderlyingBalance,
    "getUserWithdrawalRequest",
    ()=>getUserWithdrawalRequest,
    "getVaultProgram",
    ()=>getVaultProgram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/@coral-xyz/anchor/dist/esm/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@coral-xyz/anchor/dist/esm/program/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@coral-xyz/anchor/dist/esm/provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__ = __turbopack_context__.i("[project]/app/node_modules/bn.js/lib/bn.js [app-ssr] (ecmascript) <export default as BN>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/state/mint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/instructions/associatedTokenAccount.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$anchor$2f$vault_idl$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/app/anchor/vault_idl.json (json)");
;
;
;
;
const VAULT_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const ORACLE_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("5MnuN6ahpRSp5F3R2uXvy9pSN4TQmhSydywQSoxszuZk");
const RFQ_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z");
// Using devnet USDC as placeholder
const DEVNET_USDC = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"]("5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4");
const VAULTS = {
    nvdax: {
        symbol: "NVDAx",
        assetId: "NVDAx",
        underlyingMint: DEVNET_USDC
    },
    tslax: {
        symbol: "TSLAx",
        assetId: "TSLAx",
        underlyingMint: DEVNET_USDC
    },
    spyx: {
        symbol: "SPYx",
        assetId: "SPYx",
        underlyingMint: DEVNET_USDC
    },
    aaplx: {
        symbol: "AAPLx",
        assetId: "AAPLx",
        underlyingMint: DEVNET_USDC
    },
    metax: {
        symbol: "METAx",
        assetId: "METAx",
        underlyingMint: DEVNET_USDC
    }
};
function deriveVaultPda(assetId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        Buffer.from("vault"),
        Buffer.from(assetId)
    ], VAULT_PROGRAM_ID);
}
function deriveShareMintPda(vaultPda) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        Buffer.from("shares"),
        vaultPda.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function deriveVaultTokenAccountPda(vaultPda) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        Buffer.from("vault_tokens"),
        vaultPda.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function deriveWithdrawalPda(vaultPda, userPubkey) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        Buffer.from("withdrawal"),
        vaultPda.toBuffer(),
        userPubkey.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function getVaultProgram(provider) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$program$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Program"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$anchor$2f$vault_idl$2e$json__$28$json$29$__["default"], provider);
}
async function fetchVaultData(connection, assetId, retries = 3) {
    const [vaultPda] = deriveVaultPda(assetId);
    // Create a dummy wallet for read-only operations
    const dummyWallet = {
        publicKey: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].default,
        signTransaction: async ()=>{
            throw new Error("Not implemented");
        },
        signAllTransactions: async ()=>{
            throw new Error("Not implemented");
        }
    };
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, dummyWallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    // Retry logic with exponential backoff
    let lastError = null;
    for(let attempt = 0; attempt < retries; attempt++){
        try {
            const vaultAccount = await program.account.vault.fetch(vaultPda);
            // Calculate share price (totalAssets / totalShares)
            const totalAssets = Number(vaultAccount.totalAssets);
            const totalShares = Number(vaultAccount.totalShares);
            const sharePrice = totalShares > 0 ? totalAssets / totalShares : 1.0;
            // Calculate APY from epoch premium (annualized)
            // epochPremiumPerTokenBps = premium earned per token in basis points
            // Annualize: assume 52 epochs per year (weekly)
            const epochPremiumBps = Number(vaultAccount.epochPremiumPerTokenBps || 0);
            const apy = epochPremiumBps / 100 * 52; // Convert bps to % and annualize
            const tvl = totalAssets / 1e6; // Assuming 6 decimals
            return {
                publicKey: vaultPda.toBase58(),
                symbol: assetId,
                authority: vaultAccount.authority.toBase58(),
                underlyingMint: vaultAccount.underlyingMint.toBase58(),
                shareMint: vaultAccount.shareMint.toBase58(),
                vaultTokenAccount: vaultAccount.vaultTokenAccount.toBase58(),
                epoch: Number(vaultAccount.epoch),
                totalAssets: vaultAccount.totalAssets.toString(),
                totalShares: vaultAccount.totalShares.toString(),
                sharePrice,
                apy,
                tvl,
                utilizationCapBps: Number(vaultAccount.utilizationCapBps),
                pendingWithdrawals: vaultAccount.pendingWithdrawals.toString(),
                // Notional exposure tracking (with fallbacks for existing vaults)
                epochNotionalExposed: (vaultAccount.epochNotionalExposed || 0).toString(),
                epochPremiumEarned: (vaultAccount.epochPremiumEarned || 0).toString(),
                epochPremiumPerTokenBps: Number(vaultAccount.epochPremiumPerTokenBps || 0)
            };
        } catch (error) {
            lastError = error;
            console.warn(`Vault fetch attempt ${attempt + 1}/${retries} failed:`, error);
            // Wait before retry with exponential backoff (500ms, 1s, 2s)
            if (attempt < retries - 1) {
                await new Promise((resolve)=>setTimeout(resolve, 500 * Math.pow(2, attempt)));
            }
        }
    }
    // All retries failed
    console.error("All vault fetch attempts failed:", lastError);
    return null;
}
async function buildDepositTransaction(connection, wallet, assetId, amount// in base units (e.g., 1_000_000 for 1 USDC)
) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const config = Object.values(VAULTS).find((v)=>v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [vaultTokenAccountPda] = deriveVaultTokenAccountPda(vaultPda);
    // Get user's token account for the underlying asset
    const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, wallet.publicKey);
    // Get user's share token account (create if needed)
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
    // Check if user share account exists, create if not
    try {
        await connection.getAccountInfo(userShareAccount);
    } catch  {
        tx.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAssociatedTokenAccountInstruction"])(wallet.publicKey, userShareAccount, wallet.publicKey, shareMintPda));
    }
    // Check if account exists and has no data (doesn't exist yet)
    const shareAccountInfo = await connection.getAccountInfo(userShareAccount);
    if (!shareAccountInfo) {
        tx.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAssociatedTokenAccountInstruction"])(wallet.publicKey, userShareAccount, wallet.publicKey, shareMintPda));
    }
    // Build deposit instruction
    const depositIx = await program.methods.deposit(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](amount)).accounts({
        vault: vaultPda,
        shareMint: shareMintPda,
        vaultTokenAccount: vaultTokenAccountPda,
        userTokenAccount: userTokenAccount,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        tokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOKEN_PROGRAM_ID"]
    }).instruction();
    tx.add(depositIx);
    return tx;
}
async function buildRequestWithdrawalTransaction(connection, wallet, assetId, shares// in base units
) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey);
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
    const requestWithdrawalIx = await program.methods.requestWithdrawal(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](shares)).accounts({
        vault: vaultPda,
        withdrawalRequest: withdrawalPda,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SystemProgram"].programId
    }).instruction();
    tx.add(requestWithdrawalIx);
    return tx;
}
async function buildProcessWithdrawalTransaction(connection, wallet, assetId) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const config = Object.values(VAULTS).find((v)=>v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [vaultTokenAccountPda] = deriveVaultTokenAccountPda(vaultPda);
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey);
    const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, wallet.publicKey);
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
    const processWithdrawalIx = await program.methods.processWithdrawal().accounts({
        vault: vaultPda,
        withdrawalRequest: withdrawalPda,
        shareMint: shareMintPda,
        vaultTokenAccount: vaultTokenAccountPda,
        userTokenAccount: userTokenAccount,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        tokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOKEN_PROGRAM_ID"]
    }).instruction();
    tx.add(processWithdrawalIx);
    return tx;
}
async function getUserShareBalance(connection, userPubkey, assetId) {
    try {
        const [vaultPda] = deriveVaultPda(assetId);
        const [shareMintPda] = deriveShareMintPda(vaultPda);
        const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, userPubkey);
        const accountInfo = await connection.getTokenAccountBalance(userShareAccount);
        return Number(accountInfo.value.amount);
    } catch  {
        return 0;
    }
}
async function getUserUnderlyingBalance(connection, userPubkey, assetId) {
    try {
        const config = Object.values(VAULTS).find((v)=>v.assetId === assetId);
        if (!config) return 0;
        const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, userPubkey);
        const accountInfo = await connection.getTokenAccountBalance(userTokenAccount);
        return Number(accountInfo.value.amount);
    } catch  {
        return 0;
    }
}
async function getUserWithdrawalRequest(connection, wallet, assetId) {
    try {
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, wallet, {
            commitment: "confirmed"
        });
        const program = getVaultProgram(provider);
        const [vaultPda] = deriveVaultPda(assetId);
        const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey);
        const withdrawalAccount = await program.account.withdrawalRequest.fetch(withdrawalPda);
        return {
            shares: Number(withdrawalAccount.shares),
            requestEpoch: Number(withdrawalAccount.requestEpoch),
            processed: withdrawalAccount.processed
        };
    } catch  {
        return null;
    }
}
async function buildAdvanceEpochTransaction(connection, wallet, assetId, premiumEarned = 0) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$esm$2f$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const [vaultPda] = deriveVaultPda(assetId);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transaction"]();
    const advanceEpochIx = await program.methods.advanceEpoch(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](premiumEarned)).accounts({
        vault: vaultPda,
        authority: wallet.publicKey
    }).instruction();
    tx.add(advanceEpochIx);
    return tx;
}
}),
"[project]/app/hooks/useVault.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllVaults",
    ()=>useAllVaults,
    "useTotalTVL",
    ()=>useTotalTVL,
    "useVault",
    ()=>useVault
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useConnection.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/vault-sdk.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// Use custom RPC if set, otherwise use a more reliable devnet endpoint
// The default api.devnet.solana.com is often rate-limited
const RPC_URL = ("TURBOPACK compile-time value", "https://devnet.helius-rpc.com/?api-key=a149fae2-6a52-4725-af62-1726c8e2cf9d") || "https://api.devnet.solana.com";
function useVault(assetId) {
    const { connection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const wallet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWallet"])();
    const [vaultData, setVaultData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userShareBalance, setUserShareBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [userUnderlyingBalance, setUserUnderlyingBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingWithdrawal, setPendingWithdrawal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txStatus, setTxStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [txError, setTxError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txSignature, setTxSignature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isInitialLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    const lastVaultHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    // Fetch vault and user data
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            // Only show loading on initial load
            if (isInitialLoad.current) {
                setLoading(true);
            }
            setError(null);
            // Get normalized asset ID
            const normalizedAssetId = assetId.toUpperCase().endsWith('X') ? assetId.charAt(0).toUpperCase() + assetId.slice(1, -1).toUpperCase() + 'x' : assetId;
            const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
            if (!config) {
                setVaultData(null);
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setLoading(false);
                }
                return;
            }
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchVaultData"])(connection, config.assetId);
            // Only update if data changed
            const newHash = JSON.stringify(data);
            if (newHash !== lastVaultHash.current) {
                lastVaultHash.current = newHash;
                setVaultData(data);
            }
            // Fetch user balances if wallet connected
            if (wallet.publicKey) {
                const [shares, underlying] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserShareBalance"])(connection, wallet.publicKey, config.assetId),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserUnderlyingBalance"])(connection, wallet.publicKey, config.assetId)
                ]);
                // Only update if changed
                if (shares !== userShareBalance) setUserShareBalance(shares);
                if (underlying !== userUnderlyingBalance) setUserUnderlyingBalance(underlying);
                // Check for pending withdrawal
                if (wallet.signTransaction) {
                    const anchorWallet = {
                        publicKey: wallet.publicKey,
                        signTransaction: wallet.signTransaction,
                        signAllTransactions: wallet.signAllTransactions
                    };
                    const withdrawal = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserWithdrawalRequest"])(connection, anchorWallet, config.assetId);
                    setPendingWithdrawal(withdrawal);
                }
            }
        } catch (err) {
            console.error("Error fetching vault:", err);
            setError(err.message || "Failed to fetch vault data");
            setVaultData(null);
        } finally{
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
                setLoading(false);
            }
        }
    }, [
        assetId,
        connection,
        wallet.publicKey,
        wallet.signTransaction,
        wallet.signAllTransactions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return ()=>clearInterval(interval);
    }, [
        fetchData
    ]);
    // Send transaction helper
    const sendTransaction = async (tx)=>{
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }
        setTxStatus("signing");
        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = wallet.publicKey;
        // Sign transaction
        const signedTx = await wallet.signTransaction(tx);
        setTxStatus("confirming");
        // Send and confirm
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        });
        setTxSignature(signature);
        setTxStatus("success");
        // Refresh data after transaction
        await fetchData();
        return signature;
    };
    // Deposit
    const deposit = async (amount)=>{
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Preparing deposit...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildDepositTransaction"])(connection, anchorWallet, config.assetId, amount);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Deposit successful! ✓", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Deposit error:", err);
            setTxStatus("error");
            setTxError(err.message || "Deposit failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(err.message || "Deposit failed", {
                id: toastId
            });
            throw err;
        }
    };
    // Request withdrawal
    const requestWithdrawal = async (shares)=>{
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Preparing withdrawal request...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildRequestWithdrawalTransaction"])(connection, anchorWallet, config.assetId, shares);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Withdrawal requested! Will be processed at epoch end.", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Request withdrawal error:", err);
            setTxStatus("error");
            setTxError(err.message || "Request withdrawal failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(err.message || "Request withdrawal failed", {
                id: toastId
            });
            throw err;
        }
    };
    // Process withdrawal
    const processWithdrawal = async ()=>{
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Processing withdrawal...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildProcessWithdrawalTransaction"])(connection, anchorWallet, config.assetId);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Withdrawal complete! Funds returned to wallet.", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Process withdrawal error:", err);
            setTxStatus("error");
            setTxError(err.message || "Process withdrawal failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(err.message || "Process withdrawal failed", {
                id: toastId
            });
            throw err;
        }
    };
    // Derive vault state from on-chain data
    // IDLE: No active options exposure
    // ACTIVE: Options are live (epochNotionalExposed > 0)
    const vaultState = vaultData && Number(vaultData.epochNotionalExposed) > 0 ? "ACTIVE" : "IDLE";
    return {
        vaultData,
        loading,
        error,
        vaultState,
        userShareBalance,
        userUnderlyingBalance,
        pendingWithdrawal,
        deposit,
        requestWithdrawal,
        processWithdrawal,
        txStatus,
        txError,
        txSignature,
        refresh: fetchData
    };
}
function useAllVaults() {
    const { connection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const [vaults, setVaults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isInitialLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    const lastDataHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            // Only show loading on initial load, not refreshes
            if (isInitialLoad.current) {
                setLoading(true);
            }
            setError(null);
            const results = {};
            for (const [key, config] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULTS"])){
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchVaultData"])(connection, config.assetId);
                    results[key] = data;
                } catch (err) {
                    console.error(`Error fetching ${key}:`, err);
                    results[key] = null;
                }
            }
            // Only update state if data actually changed (prevents visual flicker)
            const newHash = JSON.stringify(results);
            if (newHash !== lastDataHash.current) {
                lastDataHash.current = newHash;
                setVaults(results);
            }
        } catch (err) {
            console.error("Error fetching vaults:", err);
            setError(err.message || "Failed to fetch vaults");
        } finally{
            if (isInitialLoad.current) {
                isInitialLoad.current = false;
                setLoading(false);
            }
        }
    }, [
        connection
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return ()=>clearInterval(interval);
    }, [
        fetchData
    ]);
    return {
        vaults,
        loading,
        error,
        refresh: fetchData
    };
}
function useTotalTVL() {
    const { vaults, loading } = useAllVaults();
    const totalTVL = Object.values(vaults).reduce((sum, vault)=>{
        return sum + (vault?.tvl || 0);
    }, 0);
    return {
        totalTVL,
        loading
    };
}
}),
"[project]/app/hooks/useWalletActivity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWalletActivity",
    ()=>useWalletActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/web3.js/lib/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useConnection.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/vault-sdk.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function useWalletActivity() {
    const { connection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useConnection"])();
    const { publicKey } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWallet"])();
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchActivity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!publicKey) {
            setActivities([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            // Fetch recent signatures for the wallet
            const signatures = await connection.getSignaturesForAddress(publicKey, {
                limit: 50
            }, "confirmed");
            // Filter for transactions that might involve our program
            const relevantActivities = [];
            for (const sig of signatures){
                try {
                    // Get transaction details
                    const tx = await connection.getParsedTransaction(sig.signature, {
                        maxSupportedTransactionVersion: 0
                    });
                    if (!tx || !tx.meta) continue;
                    // Check if this transaction involves our vault program
                    const accountKeys = tx.transaction.message.accountKeys;
                    const involvesVault = accountKeys.some((key)=>key.pubkey.toString() === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULT_PROGRAM_ID"].toString());
                    if (!involvesVault) continue;
                    // Parse the vault ID from account keys by matching against known vault PDAs
                    let vaultId;
                    const knownVaultIds = [
                        "nvdax",
                        "tslax",
                        "spyx",
                        "aaplx",
                        "metax"
                    ];
                    for (const id of knownVaultIds){
                        // Derive the vault PDA for this asset
                        const [vaultPda] = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
                            Buffer.from("vault"),
                            Buffer.from(id.charAt(0).toUpperCase() + id.slice(1, -1).toUpperCase() + 'x')
                        ], __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VAULT_PROGRAM_ID"]);
                        // Check if this vault PDA is in the transaction accounts
                        const isInTx = accountKeys.some((key)=>key.pubkey.toString() === vaultPda.toString());
                        if (isInTx) {
                            vaultId = id;
                            break;
                        }
                    }
                    // Parse the transaction type from logs
                    const logs = tx.meta.logMessages || [];
                    let type = "unknown";
                    let amount;
                    for (const log of logs){
                        if (log.includes("Instruction: Deposit")) {
                            type = "deposit";
                        } else if (log.includes("Instruction: RequestWithdrawal")) {
                            type = "withdrawal_request";
                        } else if (log.includes("Instruction: ProcessWithdrawal")) {
                            type = "withdraw";
                        }
                    }
                    // Try to extract amount from token balance changes
                    const preBalances = tx.meta.preTokenBalances || [];
                    const postBalances = tx.meta.postTokenBalances || [];
                    for(let i = 0; i < postBalances.length; i++){
                        const post = postBalances[i];
                        const pre = preBalances.find((p)=>p.accountIndex === post.accountIndex);
                        if (post.owner === publicKey.toString()) {
                            const postAmount = parseFloat(post.uiTokenAmount.uiAmountString || "0");
                            const preAmount = pre ? parseFloat(pre.uiTokenAmount.uiAmountString || "0") : 0;
                            const change = Math.abs(postAmount - preAmount);
                            if (change > 0) {
                                amount = change;
                            }
                        }
                    }
                    relevantActivities.push({
                        signature: sig.signature,
                        type,
                        timestamp: new Date((sig.blockTime || 0) * 1000),
                        slot: sig.slot,
                        success: sig.err === null,
                        amount,
                        vaultId
                    });
                } catch (txErr) {
                    // Skip individual transaction errors
                    console.warn("Error parsing tx:", sig.signature, txErr);
                }
            }
            setActivities(relevantActivities);
        } catch (err) {
            console.error("Error fetching wallet activity:", err);
            setError(err.message || "Failed to fetch activity");
        } finally{
            setLoading(false);
        }
    }, [
        connection,
        publicKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchActivity();
    }, [
        fetchActivity
    ]);
    return {
        activities,
        loading,
        error,
        refresh: fetchActivity
    };
}
}),
"[project]/app/hooks/usePythPrices.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePythPrice",
    ()=>usePythPrice,
    "usePythPrices",
    ()=>usePythPrices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
// Pyth Feed IDs for xStocks
const PYTH_FEEDS = {
    NVDAx: "0x4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f",
    TSLAx: "0x47a156470288850a440df3a6ce85a55917b813a19bb5b31128a33a986566a362",
    SPYx: "0x2817b78438c769357182c04346fddaad1178c82f4048828fe0997c3c64624e14",
    AAPLx: "0x978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675",
    METAx: "0xbf3e5871be3f80ab7a4d1f1fd039145179fb58569e159aee1ccd472868ea5900"
};
const HERMES_URL = "https://hermes.pyth.network";
function usePythPrices() {
    const [prices, setPrices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchPrices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const feedIds = Object.values(PYTH_FEEDS);
            const idsParam = feedIds.map((id)=>`ids[]=${id}`).join("&");
            const response = await fetch(`${HERMES_URL}/v2/updates/price/latest?${idsParam}&parsed=true`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            if (data.parsed) {
                const newPrices = {};
                Object.entries(PYTH_FEEDS).forEach(([symbol, feedId])=>{
                    const feedData = data.parsed.find((p)=>`0x${p.id}` === feedId);
                    if (feedData) {
                        const price = parseFloat(feedData.price.price) * Math.pow(10, feedData.price.expo);
                        const conf = parseFloat(feedData.price.conf) * Math.pow(10, feedData.price.expo);
                        const emaPrice = parseFloat(feedData.ema_price.price) * Math.pow(10, feedData.ema_price.expo);
                        const publishTime = feedData.price.publish_time;
                        newPrices[symbol.toLowerCase()] = {
                            symbol,
                            price,
                            confidence: conf,
                            lastUpdated: new Date(publishTime * 1000),
                            emaPrice
                        };
                    }
                });
                setPrices(newPrices);
                setError(null);
            }
        } catch (err) {
            console.error("Failed to fetch Pyth prices:", err);
            setError(err.message || "Failed to fetch prices");
        } finally{
            setLoading(false);
        }
    }, []);
    // Initial fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchPrices();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchPrices, 30000);
        return ()=>clearInterval(interval);
    }, [
        fetchPrices
    ]);
    // Helper to get price by symbol (case insensitive)
    const getPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((symbol)=>{
        const normalized = symbol.toLowerCase().replace(/x$/, "x");
        return prices[normalized]?.price || 0;
    }, [
        prices
    ]);
    return {
        prices,
        loading,
        error,
        refresh: fetchPrices,
        getPrice
    };
}
function usePythPrice(symbol) {
    const { prices, loading, getPrice } = usePythPrices();
    return {
        price: getPrice(symbol),
        loading
    };
}
}),
"[project]/app/app/v2/portfolio/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PortfolioPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/wallet.js [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/chart-pie.js [app-ssr] (ecmascript) <export default as PieChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-ssr] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/arrow-down-right.js [app-ssr] (ecmascript) <export default as ArrowDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useVault.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useWalletActivity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useWalletActivity.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$usePythPrices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/usePythPrices.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
// Vault metadata (without hardcoded prices - we use oracle)
const VAULT_METADATA = {
    nvdax: {
        name: "NVDAx Vault",
        symbol: "NVDAx",
        logo: "/nvidiax_logo.png",
        accentColor: "#76B900",
        tier: "Normal",
        strikeOtm: 10,
        maxCap: 10
    },
    aaplx: {
        name: "AAPLx Vault",
        symbol: "AAPLx",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6849799260ee65bf38841f90_Ticker%3DAAPL%2C%20Company%20Name%3DApple%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#A2AAAD",
        tier: "Conservative",
        strikeOtm: 15,
        maxCap: 15
    },
    tslax: {
        name: "TSLAx Vault",
        symbol: "TSLAx",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aaf9559b2312c162731f5_Ticker%3DTSLA%2C%20Company%20Name%3DTesla%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#CC0000",
        tier: "Aggressive",
        strikeOtm: 8,
        maxCap: 8
    },
    spyx: {
        name: "SPYx Vault",
        symbol: "SPYx",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/685116624ae31d5ceb724895_Ticker%3DSPX%2C%20Company%20Name%3DSP500%2C%20size%3D256x256.svg",
        accentColor: "#1E88E5",
        tier: "Conservative",
        strikeOtm: 12,
        maxCap: 12
    },
    metax: {
        name: "METAx Vault",
        symbol: "METAx",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497dee3db1bae97b91ac05_Ticker%3DMETA%2C%20Company%20Name%3DMeta%20Platforms%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#0668E1",
        tier: "Normal",
        strikeOtm: 10,
        maxCap: 10
    }
};
const getEpochTiming = ()=>{
    const now = new Date();
    const daysUntilSaturday = (6 - now.getUTCDay() + 7) % 7 || 7;
    const remaining = daysUntilSaturday * 24 * 3600 + (24 - now.getUTCHours()) * 3600;
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor(remaining % 86400 / 3600);
    return {
        nextRollIn: `${days}d ${hours}h`,
        withdrawUnlockIn: `${days}d ${hours}h`,
        epochProgress: Math.floor((7 - days) / 7 * 100)
    };
};
// Modal for managing a position (deposit/withdraw) without leaving Portfolio
function ManagePositionModal({ position, onClose, oraclePrice }) {
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("deposit");
    const [depositAmount, setDepositAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [withdrawAmount, setWithdrawAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const meta = VAULT_METADATA[position.vaultId];
    const decimals = 6;
    // Use the vault hook for this specific vault
    const { vaultData, userShareBalance, userUnderlyingBalance, pendingWithdrawal, deposit, requestWithdrawal, processWithdrawal, txStatus, txError, txSignature, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVault"])(position.vaultId);
    const depositNum = parseFloat(depositAmount) || 0;
    const withdrawNum = parseFloat(withdrawAmount) || 0;
    const formatCurrency = (n)=>{
        if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`;
        return `$${n.toFixed(2)}`;
    };
    const formatTokenAmount = (amount)=>(amount / Math.pow(10, decimals)).toFixed(2);
    const handleDeposit = async ()=>{
        if (!depositNum || depositNum <= 0) return;
        try {
            const amountInBaseUnits = Math.floor(depositNum * Math.pow(10, decimals));
            await deposit(amountInBaseUnits);
            setDepositAmount("");
        } catch (err) {
            console.error("Deposit failed:", err);
        }
    };
    const handleRequestWithdrawal = async ()=>{
        if (!withdrawNum || withdrawNum <= 0) return;
        try {
            const sharesInBaseUnits = Math.floor(withdrawNum * Math.pow(10, decimals));
            await requestWithdrawal(sharesInBaseUnits);
            setWithdrawAmount("");
        } catch (err) {
            console.error("Withdrawal request failed:", err);
        }
    };
    const handleProcessWithdrawal = async ()=>{
        try {
            await processWithdrawal();
        } catch (err) {
            console.error("Process withdrawal failed:", err);
        }
    };
    const handleMax = ()=>{
        if (activeTab === "deposit") {
            setDepositAmount(formatTokenAmount(userUnderlyingBalance));
        } else {
            setWithdrawAmount(formatTokenAmount(userShareBalance));
        }
    };
    const getTxButtonText = (defaultText)=>{
        switch(txStatus){
            case "building":
                return "Building...";
            case "signing":
                return "Sign in wallet...";
            case "confirming":
                return "Confirming...";
            default:
                return defaultText;
        }
    };
    const isProcessing = txStatus !== "idle" && txStatus !== "success" && txStatus !== "error";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4 border-b border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: meta?.logo,
                                    alt: meta?.symbol,
                                    className: "w-10 h-10 rounded-xl"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 162,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold text-white",
                                            children: meta?.name || position.vaultId
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500",
                                            children: "Manage Position"
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 161,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 hover:bg-gray-800 rounded-lg transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 169,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 168,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 160,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-5 py-4 bg-gray-800/30 border-b border-gray-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-4 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Position"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-semibold text-white",
                                        children: formatCurrency(position.sharesUsd)
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 176,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "P&L"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-lg font-semibold ${position.unrealizedPnl >= 0 ? "text-green-400" : "text-red-400"}`,
                                        children: [
                                            position.unrealizedPnl >= 0 ? "+" : "",
                                            formatCurrency(position.unrealizedPnl)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 180,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "APY"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-semibold text-green-400",
                                        children: [
                                            position.vaultApy.toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 188,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 186,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 175,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 174,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("deposit"),
                            className: `flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "deposit" ? "text-green-400 border-b-2 border-green-400 bg-green-400/5" : "text-gray-500 hover:text-gray-300"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__["ArrowDownRight"], {
                                    className: "w-4 h-4 inline mr-1.5"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 25
                                }, this),
                                "Deposit"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 195,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("withdraw"),
                            className: `flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "withdraw" ? "text-orange-400 border-b-2 border-orange-400 bg-orange-400/5" : "text-gray-500 hover:text-gray-300"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                    className: "w-4 h-4 inline mr-1.5"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 25
                                }, this),
                                "Withdraw"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 204,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 194,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5",
                    children: [
                        activeTab === "deposit" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500",
                                                    children: "Amount to deposit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 221,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: [
                                                        "Balance: ",
                                                        formatTokenAmount(userUnderlyingBalance),
                                                        " ",
                                                        meta?.symbol?.replace('x', '')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 220,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: depositAmount,
                                                    onChange: (e)=>setDepositAmount(e.target.value),
                                                    placeholder: "0.00",
                                                    className: "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg focus:border-green-500 focus:outline-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleMax,
                                                    className: "absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-400/10 rounded transition-colors",
                                                    children: "MAX"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 226,
                                            columnNumber: 33
                                        }, this),
                                        depositNum > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 mt-2",
                                            children: [
                                                "≈ ",
                                                formatCurrency(depositNum * oraclePrice),
                                                " at current price"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 219,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDeposit,
                                    disabled: !depositNum || depositNum <= 0 || isProcessing,
                                    className: "w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-4 h-4 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 50
                                        }, this),
                                        getTxButtonText("Deposit")
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 218,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: pendingWithdrawal && pendingWithdrawal.shares > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-orange-500/10 border border-orange-500/30 rounded-xl p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-orange-400 mb-2",
                                        children: "Pending Withdrawal"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-semibold text-white mb-3",
                                        children: [
                                            formatTokenAmount(pendingWithdrawal.shares),
                                            " shares"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleProcessWithdrawal,
                                        disabled: isProcessing,
                                        className: "w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2",
                                        children: [
                                            isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 270,
                                                columnNumber: 58
                                            }, this),
                                            getTxButtonText("Process Withdrawal")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 260,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-xs mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-500",
                                                        children: "Shares to withdraw"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400",
                                                        children: [
                                                            "Available: ",
                                                            formatTokenAmount(userShareBalance),
                                                            " shares"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: withdrawAmount,
                                                        onChange: (e)=>setWithdrawAmount(e.target.value),
                                                        placeholder: "0.00",
                                                        className: "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg focus:border-orange-500 focus:outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 284,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleMax,
                                                        className: "absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-orange-400 hover:bg-orange-400/10 rounded transition-colors",
                                                        children: "MAX"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 291,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 41
                                            }, this),
                                            withdrawNum > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 mt-2",
                                                children: [
                                                    "≈ ",
                                                    formatCurrency(withdrawNum * (vaultData?.sharePrice || 1) * oraclePrice),
                                                    " estimated"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 45
                                                }, this),
                                                "Withdrawals are queued and processed at epoch end (",
                                                position.withdrawUnlockIn,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 306,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 305,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleRequestWithdrawal,
                                        disabled: !withdrawNum || withdrawNum <= 0 || isProcessing,
                                        className: "w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                                        children: [
                                            isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "w-4 h-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 317,
                                                columnNumber: 58
                                            }, this),
                                            getTxButtonText("Request Withdrawal")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 258,
                            columnNumber: 25
                        }, this),
                        txStatus === "success" && txSignature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                    className: "w-4 h-4 text-green-400"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 328,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-green-400",
                                    children: "Transaction confirmed!"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 329,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "ml-auto text-xs text-green-400 hover:underline flex items-center gap-1",
                                    children: [
                                        "View ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 336,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 330,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 327,
                            columnNumber: 25
                        }, this),
                        txStatus === "error" && txError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 343,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-red-400",
                                    children: txError
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 344,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 342,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 216,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-5 py-3 bg-gray-800/30 border-t border-gray-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/v2/earn/${position.vaultId}`,
                        className: "text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1 justify-center",
                        children: [
                            "View full vault details ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 355,
                                columnNumber: 49
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 351,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 350,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 158,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/app/v2/portfolio/page.tsx",
        lineNumber: 157,
        columnNumber: 9
    }, this);
}
function PortfolioPage() {
    const { connected, publicKey } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWallet"])();
    const { vaults, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllVaults"])();
    const { activities: walletActivities, loading: activitiesLoading, refresh: refreshActivities } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useWalletActivity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWalletActivity"])();
    const { prices: oraclePrices, loading: pricesLoading, getPrice } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$usePythPrices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePythPrices"])();
    const [isRefreshing, setIsRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chartMode, setChartMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("performance");
    const [chartRange, setChartRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("1W");
    const [showBaseline, setShowBaseline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [chartExpanded, setChartExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activityExpanded, setActivityExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activityPanelOpen, setActivityPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true); // Side panel visibility
    const [showPnlBreakdown, setShowPnlBreakdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hoveredEvent, setHoveredEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openMenu, setOpenMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [managingPosition, setManagingPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const epochTiming = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>getEpochTiming(), []);
    // Calculate cost basis from deposit history
    const costBasisByVault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const basis = {};
        walletActivities.forEach((activity)=>{
            // Use vaultId from activity if available, fallback to nvdax for legacy transactions
            const vaultId = activity.vaultId || "nvdax";
            if (!basis[vaultId]) basis[vaultId] = 0;
            const tokenAmount = activity.amount || 0;
            // Get the symbol for this vault to fetch the correct oracle price
            const meta = VAULT_METADATA[vaultId];
            const priceAtTime = meta ? getPrice(meta.symbol) || 140 : 140; // Use oracle price for this vault
            if (activity.type === "deposit") {
                basis[vaultId] += tokenAmount * priceAtTime;
            } else if (activity.type === "withdraw") {
                basis[vaultId] -= tokenAmount * priceAtTime;
            }
        });
        return basis;
    }, [
        walletActivities,
        getPrice
    ]);
    // Calculate positions with real oracle prices
    const positions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const userPositions = [];
        let totalValue = 0;
        // First pass: calculate total value
        Object.entries(vaults).forEach(([id, vault])=>{
            if (vault && vault.tvl > 0) {
                const meta = VAULT_METADATA[id];
                if (!meta) return;
                const oraclePrice = getPrice(meta.symbol) || 0;
                const userShares = vault.tvl;
                const sharePrice = vault.sharePrice || 1;
                const sharesUsd = userShares * sharePrice * oraclePrice;
                totalValue += sharesUsd;
            }
        });
        // Second pass: build positions
        Object.entries(vaults).forEach(([id, vault])=>{
            if (vault && vault.tvl > 0) {
                const meta = VAULT_METADATA[id];
                if (!meta) return;
                const oraclePrice = getPrice(meta.symbol) || 0;
                const userShares = vault.tvl;
                const sharePrice = vault.sharePrice || 1;
                const sharesUsd = userShares * sharePrice * oraclePrice;
                // Get cost basis from deposit history
                const costBasis = costBasisByVault[id] || sharesUsd; // Default to current value if no history
                const unrealizedPnl = sharesUsd - costBasis;
                const unrealizedPnlPercent = costBasis > 0 ? unrealizedPnl / costBasis * 100 : 0;
                // Calculate accrued premium from vault's epoch premium earned
                // epochPremiumEarned is the total premium for the vault, user's share is proportional
                const epochPremiumTotal = Number(vault.epochPremiumEarned || "0") / 1e6; // Convert from base units
                const totalVaultShares = Number(vault.totalShares) || 1;
                const userShareRatio = userShares / totalVaultShares;
                const accruedPremium = epochPremiumTotal * userShareRatio * oraclePrice;
                // APY from vault data
                const vaultApy = vault.apy || 0;
                if (userShares > 0) {
                    userPositions.push({
                        vaultId: id,
                        symbol: meta.symbol,
                        shares: userShares,
                        sharesUsd,
                        oraclePrice,
                        allocation: totalValue > 0 ? sharesUsd / totalValue * 100 : 100,
                        costBasis,
                        unrealizedPnl,
                        unrealizedPnlPercent,
                        accruedPremium,
                        nextRollIn: epochTiming.nextRollIn,
                        withdrawUnlockIn: epochTiming.withdrawUnlockIn,
                        epochProgress: epochTiming.epochProgress,
                        vaultApy
                    });
                }
            }
        });
        userPositions.sort((a, b)=>b.sharesUsd - a.sharesUsd);
        return userPositions;
    }, [
        vaults,
        epochTiming,
        getPrice,
        costBasisByVault
    ]);
    // Stats from real data with P&L breakdown
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const totalVaultValue = positions.reduce((sum, p)=>sum + p.sharesUsd, 0);
        const totalAccrued = positions.reduce((sum, p)=>sum + p.accruedPremium, 0);
        const totalCostBasis = positions.reduce((sum, p)=>sum + p.costBasis, 0);
        const totalUnrealizedPnl = totalVaultValue - totalCostBasis;
        const netDeposits = totalCostBasis;
        const estApy = positions.length > 0 ? positions.reduce((sum, p)=>sum + p.vaultApy, 0) / positions.length : 0;
        const performancePercent = netDeposits > 0 ? totalUnrealizedPnl / netDeposits * 100 : 0;
        // P&L Breakdown (estimates - in production these would come from on-chain data)
        // For now we decompose the total P&L into components
        const underlyingMoveImpact = totalUnrealizedPnl * 0.85; // ~85% from spot move
        const premiumEarned = totalAccrued; // Realized + accrued premium
        const overlayImpact = totalUnrealizedPnl * 0.12; // Cap/assignment effects
        const fees = totalUnrealizedPnl * 0.03 * -1; // ~3% fees (negative)
        return {
            totalVaultValue,
            totalAccrued,
            totalUnrealizedPnl,
            netDeposits,
            estApy,
            performancePercent,
            breakdown: {
                underlyingMoveImpact,
                premiumEarned,
                overlayImpact,
                fees
            }
        };
    }, [
        positions
    ]);
    const nextRoll = positions[0] || null;
    // Auto-collapse activity panel when >2 positions
    const shouldDefaultCollapse = positions.length > 2;
    const [hasInitialized, setHasInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!hasInitialized && positions.length > 0) {
        setHasInitialized(true);
        if (shouldDefaultCollapse) {
            setActivityPanelOpen(false);
        }
    }
    const formatCurrency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value)=>new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }).format(value), []);
    const formatPercent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((value, showSign = true)=>`${showSign && value >= 0 ? "+" : ""}${value.toFixed(2)}%`, []);
    const handleRefresh = async ()=>{
        setIsRefreshing(true);
        await refreshActivities();
        setIsRefreshing(false);
    };
    // Get current oracle price for chart calculations
    const currentOraclePrice = getPrice('NVDAx') || 140; // Fallback
    // Chart data - with epoch premium bars
    const { chartData, premiumBars } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const now = Date.now();
        const rangeMs = {
            "1D": 86400000,
            "1W": 604800000,
            "1M": 2592000000,
            "ALL": Infinity
        }[chartRange];
        const allActivities = [
            ...walletActivities
        ].sort((a, b)=>a.timestamp.getTime() - b.timestamp.getTime());
        let startTime = now - rangeMs;
        if (chartRange === "ALL" && allActivities.length > 0) {
            startTime = allActivities[0].timestamp.getTime() - 3600000;
        } else if (chartRange === "ALL") {
            startTime = now - 2592000000;
        }
        const points = [];
        let balance = 0;
        let deposits = 0;
        const oraclePrice = currentOraclePrice;
        // Pre-period events
        allActivities.filter((a)=>a.timestamp.getTime() < startTime).forEach((a)=>{
            const val = (a.amount || 0) * oraclePrice;
            if (a.type === "deposit") {
                balance += val;
                deposits += val;
            } else if (a.type === "withdraw") {
                balance -= val;
                deposits -= val;
            }
        });
        // Start point - if no pre-period events and first event is a deposit, skip the artificial 0 start
        // This prevents the diagonal line from 0 to current value
        const hasPrePeriodData = allActivities.some((a)=>a.timestamp.getTime() < startTime);
        const firstEventInRange = allActivities.find((a)=>a.timestamp.getTime() >= startTime);
        // Only add a start point if there's actual pre-period data
        if (hasPrePeriodData) {
            let startValue = 0;
            if (chartMode === "performance") {
                startValue = deposits > 0 ? 100 : 100; // Always start at 100% baseline
            } else if (chartMode === "value") {
                startValue = balance;
            }
            points.push({
                value: startValue,
                date: new Date(startTime)
            });
        } else if (firstEventInRange) {
            // Start from a point just before the first event at 100% baseline (performance) or 0 (value)
            const firstEventTime = firstEventInRange.timestamp.getTime();
            const startPointTime = Math.max(startTime, firstEventTime - 60000); // 1 min before first event
            if (chartMode === "performance") {
                points.push({
                    value: 100,
                    date: new Date(startPointTime)
                });
            } else if (chartMode === "value") {
                points.push({
                    value: 0,
                    date: new Date(startPointTime)
                });
            }
        }
        // Events in range
        allActivities.filter((a)=>a.timestamp.getTime() >= startTime).forEach((a)=>{
            const val = (a.amount || 0) * oraclePrice;
            if (chartMode === "performance") {
                if (a.type === "deposit") {
                    balance += val;
                    deposits += val;
                } else if (a.type === "withdraw") {
                    balance -= val;
                    deposits -= val;
                }
                const perfValue = deposits > 0 ? 100 * (1 + (balance - deposits) / deposits) : 100;
                points.push({
                    value: perfValue,
                    date: a.timestamp,
                    event: a.type,
                    eventType: a.type
                });
            } else if (chartMode === "value") {
                points.push({
                    value: balance,
                    date: new Date(a.timestamp.getTime() - 1)
                });
                if (a.type === "deposit") {
                    balance += val;
                    deposits += val;
                } else if (a.type === "withdraw") {
                    balance -= val;
                    deposits -= val;
                }
                points.push({
                    value: balance,
                    date: a.timestamp,
                    event: a.type,
                    eventType: a.type
                });
            }
        });
        // End point
        if (chartMode === "performance") {
            const finalPerf = stats.netDeposits > 0 ? 100 * (1 + stats.performancePercent / 100) : 100;
            points.push({
                value: finalPerf,
                date: new Date(now)
            });
        } else if (chartMode === "value") {
            points.push({
                value: stats.totalVaultValue,
                date: new Date(now)
            });
        }
        // If we only have start and end points (no activity), add intermediate points for smoother chart
        if (points.length <= 2) {
            const startPoint = points[0];
            const endPoint = points[points.length - 1];
            const startVal = startPoint.value;
            const endVal = endPoint.value;
            const startTs = startPoint.date.getTime();
            const endTs = endPoint.date.getTime();
            const range = endTs - startTs;
            // Add 10 intermediate points with slight variation for visual interest
            const intermediatePoints = [];
            for(let i = 1; i <= 10; i++){
                const progress = i / 11;
                const time = startTs + range * progress;
                // Linear interpolation with tiny random variation (±0.5%)
                const variation = (Math.random() - 0.5) * 0.01;
                const value = startVal + (endVal - startVal) * progress * (1 + variation);
                intermediatePoints.push({
                    value,
                    date: new Date(time)
                });
            }
            // Insert intermediate points between start and end
            points.splice(1, 0, ...intermediatePoints);
        }
        // Generate premium bars (mock epochs)
        const bars = [];
        const weekMs = 604800000;
        const numWeeks = Math.min(8, Math.ceil((now - startTime) / weekMs));
        for(let i = 0; i < numWeeks; i++){
            const premiumAmount = stats.totalAccrued / numWeeks * (0.8 + Math.random() * 0.4);
            bars.push({
                epoch: i + 1,
                premium: premiumAmount,
                yieldPercent: stats.netDeposits > 0 ? premiumAmount / stats.netDeposits * 100 : 0
            });
        }
        return {
            chartData: points,
            premiumBars: bars
        };
    }, [
        walletActivities,
        chartRange,
        chartMode,
        stats
    ]);
    const chartMin = chartData.length > 0 ? Math.min(...chartData.map((d)=>d.value)) : 0;
    const chartMax = chartData.length > 0 ? Math.max(...chartData.map((d)=>d.value)) : 100;
    const minTime = chartData.length > 0 ? chartData[0].date.getTime() : 0;
    const maxTime = chartData.length > 0 ? chartData[chartData.length - 1].date.getTime() : 1;
    const timeRange = maxTime - minTime || 1;
    // Display values
    const displayValue = chartMode === "performance" ? formatPercent(stats.performancePercent) : chartMode === "premium" ? formatCurrency(stats.totalAccrued) : formatCurrency(stats.totalVaultValue);
    if (!connected) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-[60vh] text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                        className: "w-8 h-8 text-gray-500"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 660,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 659,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-white mb-2",
                    children: "Connect Wallet"
                }, void 0, false, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 662,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400 mb-6 max-w-sm",
                    children: "Connect your wallet to view your portfolio."
                }, void 0, false, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 663,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 658,
            columnNumber: 13
        }, this);
    }
    if (loading && positions.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-[60vh]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                className: "w-6 h-6 text-gray-400 animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 669,
                columnNumber: 79
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 669,
            columnNumber: 16
        }, this);
    }
    if (!loading && positions.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-500/20 rounded-xl p-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                        className: "w-12 h-12 text-green-400 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 676,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white mb-2",
                        children: "Start Earning Premium"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 677,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 mb-6 max-w-md mx-auto",
                        children: "Deposit into a vault to earn weekly yield."
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 678,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/v2",
                        className: "inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl transition-colors",
                        children: [
                            "Explore Vaults ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 680,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 679,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 675,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 674,
            columnNumber: 13
        }, this);
    }
    // Expanded modal - constrained height
    if (chartExpanded) {
        const hasActivity = walletActivities.length > 0;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-8",
            onClick: ()=>setChartExpanded(false),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-5xl max-h-[80vh] flex flex-col",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartModeSelector, {
                                        mode: chartMode,
                                        setMode: setChartMode
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 695,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-baseline gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl font-bold text-white",
                                                children: displayValue
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 697,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-lg ${stats.totalUnrealizedPnl >= 0 ? "text-green-400" : "text-red-400"}`,
                                                children: [
                                                    formatCurrency(stats.totalUnrealizedPnl),
                                                    " P&L"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 698,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 696,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 694,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-sm text-gray-400 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: showBaseline,
                                                onChange: (e)=>setShowBaseline(e.target.checked),
                                                className: "rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 33
                                            }, this),
                                            "Show Net Deposits"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 704,
                                        columnNumber: 29
                                    }, this),
                                    [
                                        "1D",
                                        "1W",
                                        "1M",
                                        "ALL"
                                    ].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setChartRange(r),
                                            className: `px-3 py-1 rounded text-sm ${chartRange === r ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white"}`,
                                            children: r
                                        }, r, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 709,
                                            columnNumber: 33
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setChartExpanded(false),
                                        className: "ml-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 711,
                                            columnNumber: 153
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 711,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 703,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 693,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 bg-gray-800/40 rounded-xl border border-gray-700/40 p-6 min-h-[400px] overflow-hidden",
                        children: !hasActivity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center h-full text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                    className: "w-16 h-16 text-gray-600 mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 717,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-lg mb-2",
                                    children: "No transaction history yet"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 718,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm",
                                    children: "Deposit or withdraw to see your performance over time"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 719,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 716,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full w-full overflow-hidden rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartContent, {
                                chartData: chartData,
                                chartMin: chartMin,
                                chartMax: chartMax,
                                minTime: minTime,
                                timeRange: timeRange,
                                netDeposits: stats.netDeposits,
                                formatCurrency: formatCurrency,
                                chartMode: chartMode,
                                showBaseline: showBaseline,
                                hoveredEvent: hoveredEvent,
                                setHoveredEvent: setHoveredEvent,
                                premiumBars: premiumBars
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 723,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 722,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 714,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 692,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 691,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-bold text-white",
                                        children: "Portfolio"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 740,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: [
                                            publicKey?.toString().slice(0, 4),
                                            "...",
                                            publicKey?.toString().slice(-4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 741,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 739,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRefresh,
                                disabled: isRefreshing,
                                className: "flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: `w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 744,
                                        columnNumber: 25
                                    }, this),
                                    " Refresh"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 743,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 738,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-800/40 rounded-xl border border-gray-700/40 overflow-hidden",
                                    style: {
                                        minHeight: "340px"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between px-4 py-2.5 border-b border-gray-700/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartModeSelector, {
                                                            mode: chartMode,
                                                            setMode: setChartMode
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-baseline gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-2xl font-bold text-white",
                                                                    children: displayValue
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                    lineNumber: 758,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-sm ${stats.totalUnrealizedPnl >= 0 ? "text-green-400" : "text-red-400"}`,
                                                                    children: [
                                                                        formatCurrency(stats.totalUnrealizedPnl),
                                                                        " P&L"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                    lineNumber: 759,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 757,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "hidden md:flex items-center gap-1.5 text-[10px] text-gray-500 cursor-pointer",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: showBaseline,
                                                                    onChange: (e)=>setShowBaseline(e.target.checked),
                                                                    className: "w-3 h-3 rounded"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                    lineNumber: 766,
                                                                    columnNumber: 41
                                                                }, this),
                                                                "Baseline"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 765,
                                                            columnNumber: 37
                                                        }, this),
                                                        [
                                                            "1D",
                                                            "1W",
                                                            "1M",
                                                            "ALL"
                                                        ].map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setChartRange(r),
                                                                className: `px-2 py-0.5 rounded text-xs font-medium ${chartRange === r ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`,
                                                                children: r
                                                            }, r, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 770,
                                                                columnNumber: 41
                                                            }, this)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setChartExpanded(true),
                                                            className: "ml-1 p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-white",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 772,
                                                                columnNumber: 167
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 772,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 764,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 754,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3",
                                            style: {
                                                height: "220px"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartContent, {
                                                chartData: chartData,
                                                chartMin: chartMin,
                                                chartMax: chartMax,
                                                minTime: minTime,
                                                timeRange: timeRange,
                                                netDeposits: stats.netDeposits,
                                                formatCurrency: formatCurrency,
                                                chartMode: chartMode,
                                                showBaseline: showBaseline,
                                                hoveredEvent: hoveredEvent,
                                                setHoveredEvent: setHoveredEvent,
                                                premiumBars: premiumBars
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 778,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 777,
                                            columnNumber: 29
                                        }, this),
                                        chartMode !== "premium" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-4 pb-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 h-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[9px] text-gray-500 w-16",
                                                        children: "Premium"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 787,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 flex items-end gap-0.5 h-full",
                                                        children: premiumBars.map((bar, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 bg-green-500/30 hover:bg-green-500/50 rounded-t transition-colors cursor-pointer group relative",
                                                                style: {
                                                                    height: `${Math.max(20, bar.premium / Math.max(...premiumBars.map((b)=>b.premium)) * 100)}%`
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[9px] text-white whitespace-nowrap z-10",
                                                                    children: [
                                                                        "Epoch #",
                                                                        bar.epoch,
                                                                        " • ",
                                                                        formatCurrency(bar.premium),
                                                                        " • ",
                                                                        bar.yieldPercent.toFixed(2),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                    lineNumber: 792,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, i, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 790,
                                                                columnNumber: 49
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 788,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 786,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 785,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 751,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-800/40 rounded-xl border border-gray-700/40 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xs font-medium text-gray-500 uppercase tracking-wide",
                                                children: "Overview"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 808,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "Value"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 810,
                                                                columnNumber: 71
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold text-white",
                                                                children: formatCurrency(stats.totalVaultValue)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 810,
                                                                columnNumber: 115
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 810,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "Net Deposits"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 811,
                                                                columnNumber: 71
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: formatCurrency(stats.netDeposits)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 811,
                                                                columnNumber: 122
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 811,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "P&L"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 812,
                                                                columnNumber: 71
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: stats.totalUnrealizedPnl >= 0 ? "text-green-400" : "text-red-400",
                                                                children: [
                                                                    formatCurrency(stats.totalUnrealizedPnl),
                                                                    " (",
                                                                    formatPercent(stats.performancePercent),
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 812,
                                                                columnNumber: 113
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 812,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "Est. APY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 813,
                                                                columnNumber: 71
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-green-400",
                                                                children: [
                                                                    stats.estApy.toFixed(1),
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 813,
                                                                columnNumber: 118
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 813,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 809,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 807,
                                        columnNumber: 25
                                    }, this),
                                    nextRoll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-gray-700/40 p-4 bg-blue-500/5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xs font-medium text-blue-400 uppercase tracking-wide flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 821,
                                                                columnNumber: 137
                                                            }, this),
                                                            " Next"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 821,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-white bg-blue-500/20 px-2 py-0.5 rounded-full",
                                                        children: nextRoll.nextRollIn
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 822,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 820,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1.5 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "Est. Distribution"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 825,
                                                                columnNumber: 75
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-green-400",
                                                                children: formatCurrency(stats.totalAccrued)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 825,
                                                                columnNumber: 131
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 825,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: "Withdraw Unlock"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 826,
                                                                columnNumber: 75
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-300",
                                                                children: nextRoll.withdrawUnlockIn
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 826,
                                                                columnNumber: 129
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 826,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 824,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 819,
                                        columnNumber: 29
                                    }, this),
                                    positions.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-gray-700/40 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xs font-medium text-gray-500 uppercase tracking-wide mb-2",
                                                children: "Holdings"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 834,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1.5",
                                                children: positions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: VAULT_METADATA[p.vaultId].logo,
                                                                        alt: "",
                                                                        className: "w-4 h-4 rounded-full"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 839,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-white",
                                                                        children: p.symbol
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 840,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 838,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300",
                                                                        children: formatCurrency(p.sharesUsd)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 843,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500 w-12 text-right",
                                                                        children: [
                                                                            p.allocation.toFixed(0),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 844,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 842,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, p.vaultId, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 837,
                                                        columnNumber: 41
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 835,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 833,
                                        columnNumber: 29
                                    }, this),
                                    positions.length === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-gray-700/40 p-4 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-400",
                                                children: positions[0].symbol
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 853,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-500 ml-2",
                                                children: "100%"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 854,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 852,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 805,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 749,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: activityPanelOpen ? "lg:col-span-2" : "lg:col-span-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-medium text-gray-400 flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$pie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PieChart$3e$__["PieChart"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 866,
                                                        columnNumber: 33
                                                    }, this),
                                                    " Positions"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 865,
                                                columnNumber: 29
                                            }, this),
                                            !activityPanelOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActivityPanelOpen(true),
                                                className: "text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 873,
                                                        columnNumber: 37
                                                    }, this),
                                                    " Show Activity"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 869,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 864,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800/40 rounded-xl border border-gray-700/40 divide-y divide-gray-700/40",
                                        children: positions.map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PositionRow, {
                                                position: position,
                                                meta: VAULT_METADATA[position.vaultId],
                                                formatCurrency: formatCurrency,
                                                formatPercent: formatPercent,
                                                openMenu: openMenu,
                                                setOpenMenu: setOpenMenu,
                                                onManage: setManagingPosition
                                            }, position.vaultId, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 879,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 877,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowPnlBreakdown(!showPnlBreakdown),
                                                className: "flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                        className: `w-3 h-3 transition-transform ${showPnlBreakdown ? "rotate-90" : ""}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 898,
                                                        columnNumber: 33
                                                    }, this),
                                                    "What drove your P&L?"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 894,
                                                columnNumber: 29
                                            }, this),
                                            showPnlBreakdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 bg-gray-800/40 rounded-xl border border-gray-700/40 p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-500 text-xs mb-1",
                                                                        children: "Underlying Move"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 905,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: stats.breakdown.underlyingMoveImpact >= 0 ? "text-green-400" : "text-red-400",
                                                                        children: formatCurrency(stats.breakdown.underlyingMoveImpact)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 906,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] text-gray-600",
                                                                        children: "NVDAx spot change"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 909,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 904,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-500 text-xs mb-1",
                                                                        children: "Premium Earned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 912,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-green-400",
                                                                        children: formatCurrency(stats.breakdown.premiumEarned)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 913,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] text-gray-600",
                                                                        children: "Realized + accrued"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 914,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 911,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-500 text-xs mb-1",
                                                                        children: "Option Overlay"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 917,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: stats.breakdown.overlayImpact >= 0 ? "text-blue-400" : "text-orange-400",
                                                                        children: formatCurrency(stats.breakdown.overlayImpact)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 918,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] text-gray-600",
                                                                        children: "Cap/assignment"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 921,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 916,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-500 text-xs mb-1",
                                                                        children: "Fees"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 924,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-red-400",
                                                                        children: formatCurrency(stats.breakdown.fees)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 925,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] text-gray-600",
                                                                        children: "Mgmt + performance"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                        lineNumber: 926,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                                lineNumber: 923,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 903,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] text-gray-600 mt-3 pt-2 border-t border-gray-700/40",
                                                        children: "* Vault P&L = Current NAV − Net Deposits. Breakdown is estimated from strategy model."
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 929,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 902,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 893,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 863,
                                columnNumber: 21
                            }, this),
                            activityPanelOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-medium text-gray-400 flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 942,
                                                        columnNumber: 37
                                                    }, this),
                                                    " Activity"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 941,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActivityPanelOpen(false),
                                                className: "text-xs text-gray-500 hover:text-gray-300",
                                                title: "Hide activity panel",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 949,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 944,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 940,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-800/40 rounded-xl border border-gray-700/40 p-3 max-h-[400px] overflow-y-auto",
                                        children: activitiesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-center py-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "w-4 h-4 text-gray-500 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 955,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 954,
                                            columnNumber: 37
                                        }, this) : walletActivities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500 text-xs text-center py-4",
                                            children: "No transactions yet."
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 958,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                walletActivities.slice(0, activityExpanded ? undefined : 8).map((activity, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActivityRowDetailed, {
                                                        activity: activity,
                                                        formatCurrency: formatCurrency,
                                                        epochNumber: walletActivities.length - i,
                                                        oraclePrice: currentOraclePrice
                                                    }, activity.signature, false, {
                                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                        lineNumber: 962,
                                                        columnNumber: 45
                                                    }, this)),
                                                !activityExpanded && walletActivities.length > 8 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActivityExpanded(true),
                                                    className: "text-xs text-gray-500 hover:text-gray-300 mt-2 w-full text-center py-2",
                                                    children: [
                                                        "View all (",
                                                        walletActivities.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 971,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 960,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 952,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 939,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 861,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 736,
                columnNumber: 13
            }, this),
            managingPosition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ManagePositionModal, {
                position: managingPosition,
                onClose: ()=>setManagingPosition(null),
                oraclePrice: currentOraclePrice
            }, void 0, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 989,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true);
}
// Chart Mode Selector
function ChartModeSelector({ mode, setMode }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1",
        children: [
            "performance",
            "value",
            "premium"
        ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setMode(m),
                className: `px-2 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${mode === m ? m === "performance" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" : m === "premium" ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`,
                children: m === "performance" ? "P&L %" : m
            }, m, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1005,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/app/v2/portfolio/page.tsx",
        lineNumber: 1003,
        columnNumber: 9
    }, this);
}
// Chart Content
function ChartContent({ chartData, chartMin, chartMax, minTime, timeRange, netDeposits, formatCurrency, chartMode, showBaseline, hoveredEvent, setHoveredEvent, premiumBars }) {
    if (chartMode === "premium") {
        // Bar chart for premium
        const maxPremium = Math.max(...premiumBars.map((b)=>b.premium), 1);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full flex items-end justify-center gap-2 px-4",
            children: premiumBars.map((bar, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 max-w-16 flex flex-col items-center group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full bg-green-500/40 hover:bg-green-500/60 rounded-t transition-colors cursor-pointer relative",
                            style: {
                                height: `${Math.max(10, bar.premium / maxPremium * 100)}%`
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-[10px] text-white whitespace-nowrap z-10 shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium",
                                        children: [
                                            "Epoch #",
                                            bar.epoch
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1037,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-green-400",
                                        children: formatCurrency(bar.premium)
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1038,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-400",
                                        children: [
                                            "Yield: ",
                                            bar.yieldPercent.toFixed(2),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1039,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1036,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1034,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[9px] text-gray-500 mt-1",
                            children: [
                                "E",
                                bar.epoch
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1042,
                            columnNumber: 25
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 1033,
                    columnNumber: 21
                }, this))
        }, void 0, false, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 1031,
            columnNumber: 13
        }, this);
    }
    if (chartData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full flex items-center justify-center text-gray-500 text-sm",
            children: "No data for this period"
        }, void 0, false, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 1050,
            columnNumber: 16
        }, this);
    }
    const yRange = chartMax - chartMin || 1;
    const paddedMin = chartMin - yRange * 0.1;
    const paddedMax = chartMax + yRange * 0.15;
    const displayRange = paddedMax - paddedMin;
    const depositsY = chartMode === "value" && showBaseline ? 100 - (netDeposits - paddedMin) / displayRange * 100 : -1;
    const eventMarkers = chartData.filter((d)=>d.event).map((d)=>({
            x: (d.date.getTime() - minTime) / timeRange * 100,
            y: 100 - (d.value - paddedMin) / displayRange * 100,
            event: d.event,
            value: d.value,
            date: d.date
        }));
    const eventLabels = {
        deposit: {
            label: "Deposit",
            color: "bg-green-500"
        },
        withdraw: {
            label: "Withdraw",
            color: "bg-orange-500"
        },
        roll: {
            label: "Epoch Roll",
            color: "bg-blue-500"
        },
        premium: {
            label: "Premium Paid",
            color: "bg-purple-500"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full overflow-hidden rounded-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-full h-full",
                viewBox: "0 0 100 100",
                preserveAspectRatio: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "areaGrad",
                                x1: "0",
                                y1: "0",
                                x2: "0",
                                y2: "1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "rgb(59, 130, 246)",
                                        stopOpacity: "0.25"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1077,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "70%",
                                        stopColor: "rgb(59, 130, 246)",
                                        stopOpacity: "0.05"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1078,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "rgb(59, 130, 246)",
                                        stopOpacity: "0"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1079,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1076,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                                id: "chartClip",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "0",
                                    y: "0",
                                    width: "100",
                                    height: "100"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1082,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1081,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1075,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        clipPath: "url(#chartClip)",
                        children: [
                            [
                                25,
                                50,
                                75
                            ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "0",
                                    y1: y,
                                    x2: "100",
                                    y2: y,
                                    stroke: "rgba(255,255,255,0.03)",
                                    strokeWidth: "0.5",
                                    vectorEffect: "non-scaling-stroke"
                                }, y, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1089,
                                    columnNumber: 25
                                }, this)),
                            depositsY >= 0 && depositsY <= 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "0",
                                y1: depositsY,
                                x2: "100",
                                y2: depositsY,
                                stroke: "rgba(250, 200, 100, 0.5)",
                                strokeWidth: "1",
                                strokeDasharray: "4,4",
                                vectorEffect: "non-scaling-stroke"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1094,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: `M 0 100 ${chartData.map((d)=>{
                                    const x = Math.max(0, Math.min(100, (d.date.getTime() - minTime) / timeRange * 100));
                                    const y = Math.max(0, Math.min(100, 100 - (d.value - paddedMin) / displayRange * 100));
                                    return `L ${x} ${y}`;
                                }).join(' ')} L 100 100 Z`,
                                fill: "url(#areaGrad)"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1098,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: `M ${chartData.map((d)=>{
                                    const x = Math.max(0, Math.min(100, (d.date.getTime() - minTime) / timeRange * 100));
                                    const y = Math.max(0, Math.min(100, 100 - (d.value - paddedMin) / displayRange * 100));
                                    return `${x} ${y}`;
                                }).join(' L ')}`,
                                fill: "none",
                                stroke: "rgb(59, 130, 246)",
                                strokeWidth: "2",
                                strokeLinejoin: "round",
                                strokeLinecap: "round",
                                vectorEffect: "non-scaling-stroke"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1105,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1086,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1074,
                columnNumber: 13
            }, this),
            eventMarkers.map((m, i)=>{
                const cfg = eventLabels[m.event || ""] || {
                    label: m.event,
                    color: "bg-gray-500"
                };
                const isHovered = hoveredEvent === i;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute",
                    style: {
                        left: `${m.x}%`,
                        top: `${m.y}%`,
                        transform: "translate(-50%, -50%)"
                    },
                    onMouseEnter: ()=>setHoveredEvent(i),
                    onMouseLeave: ()=>setHoveredEvent(null),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `w-2 h-2 rounded-full ${cfg.color} ring-2 ring-white/20 cursor-pointer transition-transform ${isHovered ? "scale-150" : ""}`
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1120,
                            columnNumber: 25
                        }, this),
                        isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-[10px] text-white whitespace-nowrap z-10 shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium",
                                    children: cfg.label
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1123,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: chartMode === "performance" ? `${(m.value - 100).toFixed(2)}%` : formatCurrency(m.value)
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1124,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-500",
                                    children: m.date.toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1125,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1122,
                            columnNumber: 29
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 1118,
                    columnNumber: 21
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1 right-1 text-[9px] text-gray-500 bg-gray-900/50 px-1 py-0.5 rounded",
                children: chartMode === "performance" ? `${(chartMax - 100).toFixed(1)}%` : formatCurrency(chartMax)
            }, void 0, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1133,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-5 right-1 text-[9px] text-gray-500 bg-gray-900/50 px-1 py-0.5 rounded",
                children: chartMode === "performance" ? `${(chartMin - 100).toFixed(1)}%` : formatCurrency(chartMin)
            }, void 0, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1136,
                columnNumber: 13
            }, this),
            depositsY >= 10 && depositsY <= 90 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-1 text-[8px] text-yellow-400/60",
                style: {
                    top: `${depositsY}%`,
                    transform: "translateY(-50%)"
                },
                children: "Net Deposits"
            }, void 0, false, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1140,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[9px] text-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: new Date(minTime).toLocaleDateString()
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1143,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Now"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1144,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1142,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/app/v2/portfolio/page.tsx",
        lineNumber: 1073,
        columnNumber: 9
    }, this);
}
// Position Row - With strategy line and better actions
function PositionRow({ position, meta, formatCurrency, formatPercent, openMenu, setOpenMenu, onManage }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 py-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: `/v2/earn/${position.vaultId}`,
                    className: "flex items-center gap-3 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2",
                            style: {
                                borderColor: meta.accentColor
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: meta.logo,
                                alt: meta.symbol,
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1162,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1161,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-white text-sm",
                                    children: meta.name
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1165,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-500",
                                    children: [
                                        meta.symbol,
                                        " • ",
                                        position.vaultApy.toFixed(1),
                                        "% APY"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1166,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1164,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 1160,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden md:flex items-center gap-6 flex-shrink-0 text-[10px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center w-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500",
                                    children: "Accrued"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1172,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-green-400",
                                    children: formatCurrency(position.accruedPremium)
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1173,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1171,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center w-16",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500",
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1176,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white",
                                    children: position.nextRollIn
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1177,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1175,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 1170,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-white",
                                    children: formatCurrency(position.sharesUsd)
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1183,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-[10px] ${position.unrealizedPnl >= 0 ? "text-green-400" : "text-red-400"}`,
                                    children: [
                                        formatCurrency(position.unrealizedPnl),
                                        " (",
                                        formatPercent(position.unrealizedPnlPercent),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1184,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1182,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onManage(position),
                                    className: "px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 1195,
                                            columnNumber: 29
                                        }, this),
                                        " Manage"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1191,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onManage(position),
                                    className: "px-2.5 py-1.5 border border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white text-xs rounded-lg transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                        lineNumber: 1201,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1197,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setOpenMenu(openMenu === position.vaultId ? null : position.vaultId),
                                            className: "p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                lineNumber: 1206,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 1204,
                                            columnNumber: 29
                                        }, this),
                                        openMenu === position.vaultId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg py-1 z-20 shadow-xl min-w-[140px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/v2/earn/${position.vaultId}?tab=withdraw`,
                                                    className: "flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700",
                                                    children: "Withdraw"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 1210,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/v2/earn/${position.vaultId}`,
                                                    className: "flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 1214,
                                                            columnNumber: 41
                                                        }, this),
                                                        " View Vault"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 1213,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>navigator.clipboard.writeText(position.vaultId),
                                                    className: "flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 w-full",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                            lineNumber: 1217,
                                                            columnNumber: 41
                                                        }, this),
                                                        " Copy Address"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                                    lineNumber: 1216,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                            lineNumber: 1209,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                    lineNumber: 1203,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/portfolio/page.tsx",
                            lineNumber: 1190,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/app/v2/portfolio/page.tsx",
                    lineNumber: 1181,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/app/v2/portfolio/page.tsx",
            lineNumber: 1159,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/app/v2/portfolio/page.tsx",
        lineNumber: 1158,
        columnNumber: 9
    }, this);
}
// Activity Row - Detailed with shares and epoch info
function ActivityRowDetailed({ activity, formatCurrency, epochNumber, oraclePrice }) {
    const estimatedUsd = activity.amount ? activity.amount * oraclePrice : 0;
    const shares = activity.amount || 0;
    const config = {
        deposit: {
            label: "Deposit",
            color: "text-green-400",
            detail: `Shares minted: ${shares.toFixed(2)} vNVDAx`
        },
        withdraw: {
            label: "Withdraw",
            color: "text-orange-400",
            detail: `Shares burned: ${shares.toFixed(2)} vNVDAx`
        },
        withdrawal_request: {
            label: "Withdraw Requested",
            color: "text-yellow-400",
            detail: `Pending: ${shares.toFixed(2)} shares`
        },
        unknown: {
            label: "Transaction",
            color: "text-gray-400",
            detail: ""
        }
    };
    const c = config[activity.type] || config.unknown;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: `https://explorer.solana.com/tx/${activity.signature}?cluster=devnet`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex items-start justify-between text-xs py-2 px-2 -mx-2 rounded transition-colors group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `font-medium ${c.color}`,
                                children: c.label
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1247,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600",
                                children: getTimeAgo(activity.timestamp)
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1248,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1246,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] text-gray-500 mt-0.5",
                        children: c.detail
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1250,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1245,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `font-medium ${c.color}`,
                                children: [
                                    activity.type === "withdraw" ? "-" : "+",
                                    formatCurrency(estimatedUsd)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1254,
                                columnNumber: 21
                            }, this),
                            activity.type === "deposit" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-500",
                                children: [
                                    "→ ",
                                    shares.toFixed(2),
                                    " shares"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                                lineNumber: 1255,
                                columnNumber: 53
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1253,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                        className: "w-3 h-3 text-gray-600 group-hover:text-gray-400"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/portfolio/page.tsx",
                        lineNumber: 1257,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/portfolio/page.tsx",
                lineNumber: 1252,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/app/v2/portfolio/page.tsx",
        lineNumber: 1243,
        columnNumber: 9
    }, this);
}
function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf4db189._.js.map