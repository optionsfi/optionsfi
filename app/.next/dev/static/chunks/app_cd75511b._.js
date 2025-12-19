(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/anchor/vault_idl.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"address":"A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94","metadata":{"name":"vault","version":"0.1.0","spec":"0.1.0","description":"OptionsFi V2 - Covered Call Vault"},"instructions":[{"name":"advance_epoch","docs":["Advance epoch (called by keeper after settlement)","Premium earned is credited to total_assets, increasing share value"],"discriminator":[93,138,234,218,241,230,132,38],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"authority","signer":true,"relations":["vault"]}],"args":[{"name":"premium_earned","type":"u64"}]},{"name":"collect_premium","docs":["Collect premium from market maker (called during epoch roll)","Transfers USDC from payer to vault's premium account"],"discriminator":[166,199,123,128,71,141,223,204],"accounts":[{"name":"vault","pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"vault_premium_account","writable":true},{"name":"payer_token_account","writable":true},{"name":"payer","writable":true,"signer":true},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"deposit","docs":["Deposit underlying tokens and receive vault shares"],"discriminator":[242,35,198,137,82,225,242,182],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"share_mint","writable":true},{"name":"vault_token_account","writable":true},{"name":"user_token_account","writable":true},{"name":"user_share_account","writable":true},{"name":"user","writable":true,"signer":true},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"initialize_vault","docs":["Initialize a new vault for a specific xStock asset"],"discriminator":[48,191,163,44,71,129,63,164],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"arg","path":"asset_id"}]}},{"name":"underlying_mint"},{"name":"premium_mint"},{"name":"share_mint","writable":true,"signer":true},{"name":"vault_token_account","writable":true,"signer":true},{"name":"premium_token_account","writable":true,"signer":true},{"name":"authority","writable":true,"signer":true},{"name":"system_program","address":"11111111111111111111111111111111"},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},{"name":"rent","address":"SysvarRent111111111111111111111111111111111"}],"args":[{"name":"asset_id","type":"string"},{"name":"utilization_cap_bps","type":"u16"}]},{"name":"pay_settlement","docs":["Pay out to market maker for ITM settlement","Only callable by vault authority"],"discriminator":[65,54,44,166,205,55,164,205],"accounts":[{"name":"vault","pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"vault_premium_account","writable":true},{"name":"recipient_token_account","writable":true},{"name":"recipient"},{"name":"authority","signer":true,"relations":["vault"]},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[{"name":"amount","type":"u64"}]},{"name":"process_withdrawal","docs":["Process withdrawal after epoch settles"],"discriminator":[51,97,236,17,37,33,196,64],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]},"relations":["withdrawal_request"]},{"name":"withdrawal_request","writable":true},{"name":"share_mint","writable":true},{"name":"vault_token_account","writable":true},{"name":"user_token_account","writable":true},{"name":"user_share_account","writable":true},{"name":"user","writable":true,"signer":true,"relations":["withdrawal_request"]},{"name":"token_program","address":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}],"args":[]},{"name":"record_notional_exposure","docs":["Record notional exposure when an RFQ is filled (fractional options)","Premium is in premium_mint tokens (USDC)"],"discriminator":[26,180,108,160,15,34,179,128],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"authority","signer":true,"relations":["vault"]}],"args":[{"name":"notional_tokens","type":"u64"},{"name":"premium","type":"u64"}]},{"name":"request_withdrawal","docs":["Request withdrawal (queued until epoch end)"],"discriminator":[251,85,121,205,56,201,12,177],"accounts":[{"name":"vault","writable":true,"pda":{"seeds":[{"kind":"const","value":[118,97,117,108,116]},{"kind":"account","path":"vault.asset_id","account":"Vault"}]}},{"name":"withdrawal_request","writable":true,"pda":{"seeds":[{"kind":"const","value":[119,105,116,104,100,114,97,119,97,108]},{"kind":"account","path":"vault"},{"kind":"account","path":"user"},{"kind":"account","path":"vault.epoch","account":"Vault"}]}},{"name":"user_share_account"},{"name":"user","writable":true,"signer":true},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"shares","type":"u64"}]}],"accounts":[{"name":"Vault","discriminator":[211,8,232,43,2,152,117,119]},{"name":"WithdrawalRequest","discriminator":[242,88,147,173,182,62,229,193]}],"events":[{"name":"DepositEvent","discriminator":[120,248,61,83,31,142,107,144]},{"name":"EpochAdvancedEvent","discriminator":[26,197,195,116,126,48,210,42]},{"name":"NotionalExposureEvent","discriminator":[220,74,165,136,237,183,23,38]},{"name":"PremiumCollectedEvent","discriminator":[76,52,166,111,182,211,215,144]},{"name":"SettlementPaidEvent","discriminator":[97,3,234,177,141,83,59,26]},{"name":"WithdrawalProcessedEvent","discriminator":[23,252,30,4,24,110,166,133]},{"name":"WithdrawalRequestedEvent","discriminator":[82,227,155,140,223,124,77,243]}],"errors":[{"code":6000,"name":"ZeroAmount","msg":"Amount must be greater than zero"},{"code":6001,"name":"ZeroShares","msg":"Calculated shares must be greater than zero"},{"code":6002,"name":"InsufficientShares","msg":"Insufficient shares"},{"code":6003,"name":"AlreadyProcessed","msg":"Withdrawal already processed"},{"code":6004,"name":"EpochNotSettled","msg":"Epoch has not settled yet"},{"code":6005,"name":"Overflow","msg":"Arithmetic overflow"},{"code":6006,"name":"ExceedsUtilizationCap","msg":"Exceeds utilization cap"}],"types":[{"name":"DepositEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"shares_minted","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"EpochAdvancedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"new_epoch","type":"u64"},{"name":"premium_earned","type":"u64"},{"name":"notional_exposed","type":"u64"},{"name":"avg_premium_bps","type":"u32"},{"name":"total_assets","type":"u64"},{"name":"total_shares","type":"u64"}]}},{"name":"NotionalExposureEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"epoch","type":"u64"},{"name":"notional_tokens","type":"u64"},{"name":"premium","type":"u64"},{"name":"total_notional_this_epoch","type":"u64"},{"name":"total_premium_this_epoch","type":"u64"},{"name":"avg_premium_bps","type":"u32"}]}},{"name":"PremiumCollectedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"payer","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"SettlementPaidEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"recipient","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"Vault","type":{"kind":"struct","fields":[{"name":"authority","type":"pubkey"},{"name":"asset_id","type":"string"},{"name":"underlying_mint","type":"pubkey"},{"name":"share_mint","type":"pubkey"},{"name":"vault_token_account","type":"pubkey"},{"name":"premium_mint","type":"pubkey"},{"name":"premium_token_account","type":"pubkey"},{"name":"total_assets","type":"u64"},{"name":"total_shares","type":"u64"},{"name":"epoch","type":"u64"},{"name":"utilization_cap_bps","type":"u16"},{"name":"last_roll_timestamp","type":"i64"},{"name":"pending_withdrawals","type":"u64"},{"name":"epoch_notional_exposed","type":"u64"},{"name":"epoch_premium_earned","type":"u64"},{"name":"epoch_premium_per_token_bps","type":"u32"},{"name":"bump","type":"u8"}]}},{"name":"WithdrawalProcessedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"amount","type":"u64"},{"name":"epoch","type":"u64"}]}},{"name":"WithdrawalRequest","type":{"kind":"struct","fields":[{"name":"user","type":"pubkey"},{"name":"vault","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"request_epoch","type":"u64"},{"name":"processed","type":"bool"}]}},{"name":"WithdrawalRequestedEvent","type":{"kind":"struct","fields":[{"name":"vault","type":"pubkey"},{"name":"user","type":"pubkey"},{"name":"shares","type":"u64"},{"name":"epoch","type":"u64"}]}}]});}),
"[project]/app/lib/vault-sdk.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/web3.js/lib/index.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/node_modules/@coral-xyz/anchor/dist/browser/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__ = __turbopack_context__.i("[project]/app/node_modules/bn.js/lib/bn.js [app-client] (ecmascript) <export default as BN>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/state/mint.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/spl-token/lib/esm/instructions/associatedTokenAccount.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$anchor$2f$vault_idl$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/app/anchor/vault_idl.json (json)");
;
;
;
;
const VAULT_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const ORACLE_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("5MnuN6ahpRSp5F3R2uXvy9pSN4TQmhSydywQSoxszuZk");
const RFQ_PROGRAM_ID = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z");
// Using devnet USDC as placeholder
const DEVNET_USDC = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"]("5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("vault"),
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(assetId)
    ], VAULT_PROGRAM_ID);
}
function deriveShareMintPda(vaultPda) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("shares"),
        vaultPda.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function deriveVaultTokenAccountPda(vaultPda) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("vault_tokens"),
        vaultPda.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function deriveWithdrawalPda(vaultPda, userPubkey) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].findProgramAddressSync([
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("withdrawal"),
        vaultPda.toBuffer(),
        userPubkey.toBuffer()
    ], VAULT_PROGRAM_ID);
}
function getVaultProgram(provider) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Program"](__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$anchor$2f$vault_idl$2e$json__$28$json$29$__["default"], provider);
}
async function fetchVaultData(connection, assetId, retries = 3) {
    const [vaultPda] = deriveVaultPda(assetId);
    // Create a dummy wallet for read-only operations
    const dummyWallet = {
        publicKey: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PublicKey"].default,
        signTransaction: async ()=>{
            throw new Error("Not implemented");
        },
        signAllTransactions: async ()=>{
            throw new Error("Not implemented");
        }
    };
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, dummyWallet, {
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
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const config = Object.values(VAULTS).find((v)=>v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [vaultTokenAccountPda] = deriveVaultTokenAccountPda(vaultPda);
    // Get user's token account for the underlying asset
    const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, wallet.publicKey);
    // Get user's share token account (create if needed)
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    // Check if user share account exists, create if not
    try {
        await connection.getAccountInfo(userShareAccount);
    } catch  {
        tx.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAssociatedTokenAccountInstruction"])(wallet.publicKey, userShareAccount, wallet.publicKey, shareMintPda));
    }
    // Check if account exists and has no data (doesn't exist yet)
    const shareAccountInfo = await connection.getAccountInfo(userShareAccount);
    if (!shareAccountInfo) {
        tx.add((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$instructions$2f$associatedTokenAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAssociatedTokenAccountInstruction"])(wallet.publicKey, userShareAccount, wallet.publicKey, shareMintPda));
    }
    // Build deposit instruction
    const depositIx = await program.methods.deposit(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](amount)).accounts({
        vault: vaultPda,
        shareMint: shareMintPda,
        vaultTokenAccount: vaultTokenAccountPda,
        userTokenAccount: userTokenAccount,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        tokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_PROGRAM_ID"]
    }).instruction();
    tx.add(depositIx);
    return tx;
}
async function buildRequestWithdrawalTransaction(connection, wallet, assetId, shares// in base units
) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey);
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    const requestWithdrawalIx = await program.methods.requestWithdrawal(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](shares)).accounts({
        vault: vaultPda,
        withdrawalRequest: withdrawalPda,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        systemProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SystemProgram"].programId
    }).instruction();
    tx.add(requestWithdrawalIx);
    return tx;
}
async function buildProcessWithdrawalTransaction(connection, wallet, assetId) {
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const config = Object.values(VAULTS).find((v)=>v.assetId === assetId);
    if (!config) throw new Error(`Unknown vault: ${assetId}`);
    const [vaultPda] = deriveVaultPda(assetId);
    const [shareMintPda] = deriveShareMintPda(vaultPda);
    const [vaultTokenAccountPda] = deriveVaultTokenAccountPda(vaultPda);
    const [withdrawalPda] = deriveWithdrawalPda(vaultPda, wallet.publicKey);
    const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, wallet.publicKey);
    const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, wallet.publicKey);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    const processWithdrawalIx = await program.methods.processWithdrawal().accounts({
        vault: vaultPda,
        withdrawalRequest: withdrawalPda,
        shareMint: shareMintPda,
        vaultTokenAccount: vaultTokenAccountPda,
        userTokenAccount: userTokenAccount,
        userShareAccount: userShareAccount,
        user: wallet.publicKey,
        tokenProgram: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_PROGRAM_ID"]
    }).instruction();
    tx.add(processWithdrawalIx);
    return tx;
}
async function getUserShareBalance(connection, userPubkey, assetId) {
    try {
        const [vaultPda] = deriveVaultPda(assetId);
        const [shareMintPda] = deriveShareMintPda(vaultPda);
        const userShareAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(shareMintPda, userPubkey);
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
        const userTokenAccount = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$spl$2d$token$2f$lib$2f$esm$2f$state$2f$mint$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAssociatedTokenAddress"])(config.underlyingMint, userPubkey);
        const accountInfo = await connection.getTokenAccountBalance(userTokenAccount);
        return Number(accountInfo.value.amount);
    } catch  {
        return 0;
    }
}
async function getUserWithdrawalRequest(connection, wallet, assetId) {
    try {
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, wallet, {
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
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$coral$2d$xyz$2f$anchor$2f$dist$2f$browser$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AnchorProvider"](connection, wallet, {
        commitment: "confirmed"
    });
    const program = getVaultProgram(provider);
    const [vaultPda] = deriveVaultPda(assetId);
    const tx = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$web3$2e$js$2f$lib$2f$index$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transaction"]();
    const advanceEpochIx = await program.methods.advanceEpoch(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$bn$2e$js$2f$lib$2f$bn$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BN$3e$__["BN"](premiumEarned)).accounts({
        vault: vaultPda,
        authority: wallet.publicKey
    }).instruction();
    tx.add(advanceEpochIx);
    return tx;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/hooks/useVault.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllVaults",
    ()=>useAllVaults,
    "useTotalTVL",
    ()=>useTotalTVL,
    "useVault",
    ()=>useVault
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/app/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useConnection.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/vault-sdk.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Use custom RPC if set, otherwise use a more reliable devnet endpoint
// The default api.devnet.solana.com is often rate-limited
const RPC_URL = ("TURBOPACK compile-time value", "https://devnet.helius-rpc.com/?api-key=a149fae2-6a52-4725-af62-1726c8e2cf9d") || "https://api.devnet.solana.com";
function useVault(assetId) {
    _s();
    const { connection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"])();
    const wallet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const [vaultData, setVaultData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userShareBalance, setUserShareBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [userUnderlyingBalance, setUserUnderlyingBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingWithdrawal, setPendingWithdrawal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txStatus, setTxStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [txError, setTxError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txSignature, setTxSignature] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isInitialLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const lastVaultHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    // Fetch vault and user data
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useVault.useCallback[fetchData]": async ()=>{
            try {
                // Only show loading on initial load
                if (isInitialLoad.current) {
                    setLoading(true);
                }
                setError(null);
                // Get normalized asset ID
                const normalizedAssetId = assetId.toUpperCase().endsWith('X') ? assetId.charAt(0).toUpperCase() + assetId.slice(1, -1).toUpperCase() + 'x' : assetId;
                const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
                if (!config) {
                    setVaultData(null);
                    if (isInitialLoad.current) {
                        isInitialLoad.current = false;
                        setLoading(false);
                    }
                    return;
                }
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchVaultData"])(connection, config.assetId);
                // Only update if data changed
                const newHash = JSON.stringify(data);
                if (newHash !== lastVaultHash.current) {
                    lastVaultHash.current = newHash;
                    setVaultData(data);
                }
                // Fetch user balances if wallet connected
                if (wallet.publicKey) {
                    const [shares, underlying] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserShareBalance"])(connection, wallet.publicKey, config.assetId),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserUnderlyingBalance"])(connection, wallet.publicKey, config.assetId)
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
                        const withdrawal = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserWithdrawalRequest"])(connection, anchorWallet, config.assetId);
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
        }
    }["useVault.useCallback[fetchData]"], [
        assetId,
        connection,
        wallet.publicKey,
        wallet.signTransaction,
        wallet.signAllTransactions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useVault.useEffect": ()=>{
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return ({
                "useVault.useEffect": ()=>clearInterval(interval)
            })["useVault.useEffect"];
        }
    }["useVault.useEffect"], [
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
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Preparing deposit...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildDepositTransaction"])(connection, anchorWallet, config.assetId, amount);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Deposit successful! ✓", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Deposit error:", err);
            setTxStatus("error");
            setTxError(err.message || "Deposit failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(err.message || "Deposit failed", {
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
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Preparing withdrawal request...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildRequestWithdrawalTransaction"])(connection, anchorWallet, config.assetId, shares);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Withdrawal requested! Will be processed at epoch end.", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Request withdrawal error:", err);
            setTxStatus("error");
            setTxError(err.message || "Request withdrawal failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(err.message || "Request withdrawal failed", {
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
        const config = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VAULTS"][assetId.toLowerCase()];
        if (!config) throw new Error("Unknown vault");
        const toastId = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Processing withdrawal...");
        try {
            setTxStatus("building");
            setTxError(null);
            setTxSignature(null);
            const anchorWallet = {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions
            };
            const tx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildProcessWithdrawalTransaction"])(connection, anchorWallet, config.assetId);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loading("Please sign the transaction...", {
                id: toastId
            });
            const signature = await sendTransaction(tx);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Withdrawal complete! Funds returned to wallet.", {
                id: toastId,
                duration: 5000
            });
            return signature;
        } catch (err) {
            console.error("Process withdrawal error:", err);
            setTxStatus("error");
            setTxError(err.message || "Process withdrawal failed");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(err.message || "Process withdrawal failed", {
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
_s(useVault, "205Z/B2rd+u6H2DNUPeIW+I+so0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
function useAllVaults() {
    _s1();
    const { connection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"])();
    const [vaults, setVaults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isInitialLoad = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const lastDataHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("");
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAllVaults.useCallback[fetchData]": async ()=>{
            try {
                // Only show loading on initial load, not refreshes
                if (isInitialLoad.current) {
                    setLoading(true);
                }
                setError(null);
                const results = {};
                for (const [key, config] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VAULTS"])){
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$vault$2d$sdk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchVaultData"])(connection, config.assetId);
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
        }
    }["useAllVaults.useCallback[fetchData]"], [
        connection
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAllVaults.useEffect": ()=>{
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return ({
                "useAllVaults.useEffect": ()=>clearInterval(interval)
            })["useAllVaults.useEffect"];
        }
    }["useAllVaults.useEffect"], [
        fetchData
    ]);
    return {
        vaults,
        loading,
        error,
        refresh: fetchData
    };
}
_s1(useAllVaults, "DQJKf0T/i5Veq+XYdqT+rMBhzc0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useConnection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnection"]
    ];
});
function useTotalTVL() {
    _s2();
    const { vaults, loading } = useAllVaults();
    const totalTVL = Object.values(vaults).reduce((sum, vault)=>{
        return sum + (vault?.tvl || 0);
    }, 0);
    return {
        totalTVL,
        loading
    };
}
_s2(useTotalTVL, "DHmGHXd9m1OnEeyPFYnoD0T9amI=", false, function() {
    return [
        useAllVaults
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/app/v2/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>V2EarnDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/node_modules/@solana/wallet-adapter-react/lib/esm/useWallet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vault$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Vault$3e$__ = __turbopack_context__.i("[project]/app/node_modules/lucide-react/dist/esm/icons/vault.js [app-client] (ecmascript) <export default as Vault>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useVault.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Metadata for display (price is approximate for USD TVL calculation)
const VAULT_METADATA = {
    nvdax: {
        name: "NVDAx Vault",
        strategy: "Covered Call",
        tier: "Normal",
        nextRoll: "Pending",
        apy: 12.4,
        utilization: 0,
        price: 177
    },
    aaplx: {
        name: "AAPLx Vault",
        strategy: "Covered Call",
        tier: "Conservative",
        nextRoll: "5d 8h",
        apy: 8.2,
        utilization: 42,
        price: 195
    },
    tslax: {
        name: "TSLAx Vault",
        strategy: "Covered Call",
        tier: "Aggressive",
        nextRoll: "1d 3h",
        apy: 18.6,
        utilization: 72,
        price: 250
    },
    spyx: {
        name: "SPYx Vault",
        strategy: "Covered Call",
        tier: "Conservative",
        nextRoll: "3d 6h",
        apy: 6.5,
        utilization: 35,
        price: 590
    },
    metax: {
        name: "METAx Vault",
        strategy: "Covered Call",
        tier: "Normal",
        nextRoll: "4d 12h",
        apy: 15.2,
        utilization: 65,
        price: 580
    }
};
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}
function formatAPY(value) {
    return `${value.toFixed(1)}%`;
}
function V2EarnDashboard() {
    _s();
    const { connected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const { vaults, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllVaults"])();
    const vaultList = Object.entries(VAULT_METADATA).map(([id, meta])=>{
        const liveData = vaults[id];
        const tvlTokens = liveData ? liveData.tvl : 0;
        const tvlUsd = tvlTokens * meta.price; // Convert to USD
        return {
            id,
            ...meta,
            tvl: tvlUsd,
            tvlTokens,
            isLive: !!liveData,
            utilization: liveData && Number(liveData.totalShares) > 0 ? liveData.utilizationCapBps / 100 : meta.utilization
        };
    });
    const liveVaultCount = vaultList.filter((v)=>v.isLive).length;
    const avgAPY = vaultList.reduce((sum, v)=>sum + v.apy, 0) / vaultList.length;
    const calculatedTotalTVL = vaultList.reduce((sum, v)=>sum + v.tvl, 0); // Sum of all USD TVLs
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-background border border-blue-500/20 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-foreground mb-3",
                                children: "Earn premium on xStocks"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 64,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground text-lg mb-6 max-w-xl",
                                children: "Deposit xStocks. Vault sells covered calls. You collect premiums automatically."
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 67,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-8 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Total TVL"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-bold text-foreground",
                                                        children: formatCurrency(calculatedTotalTVL)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 76,
                                                        columnNumber: 33
                                                    }, this),
                                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        className: "w-4 h-4 animate-spin text-gray-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 77,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 75,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 73,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Avg APY"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 81,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-green-400",
                                                children: formatAPY(avgAPY)
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 82,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Vaults"
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 85,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-foreground",
                                                children: liveVaultCount
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 86,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 84,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 72,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "#vaults",
                                        className: "px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors",
                                        children: "Explore Vaults"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/v2/oracle",
                                        className: "px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium border border-border transition-colors",
                                        children: "View Oracle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 97,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 90,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 63,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 106,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/page.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this),
            connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-foreground flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 113,
                                columnNumber: 25
                            }, this),
                            "Your Positions"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 112,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-border bg-secondary/30 p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-muted-foreground py-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "No active positions"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/page.tsx",
                                    lineNumber: 118,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm mt-1",
                                    children: "Deposit into a vault to start earning"
                                }, void 0, false, {
                                    fileName: "[project]/app/app/v2/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/app/v2/page.tsx",
                            lineNumber: 117,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 116,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/page.tsx",
                lineNumber: 111,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "vaults",
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-foreground flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vault$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Vault$3e$__["Vault"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 25
                                    }, this),
                                    "All Vaults"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 128,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-muted-foreground flex items-center gap-2",
                                children: [
                                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3 h-3 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 133,
                                        columnNumber: 37
                                    }, this),
                                    liveVaultCount,
                                    " live on Devnet"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 132,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 127,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: vaultList.map((vault)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/v2/earn/${vault.id}`,
                                className: `group rounded-xl border p-5 transition-all ${vault.isLive ? "bg-secondary/30 border-border hover:bg-secondary/50 hover:border-blue-500/30" : "bg-secondary/10 border-border/50 opacity-70"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-foreground group-hover:text-blue-400 transition-colors",
                                                        children: vault.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: vault.strategy
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 148,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    vault.isLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/app/v2/page.tsx",
                                                                lineNumber: 157,
                                                                columnNumber: 45
                                                            }, this),
                                                            " Live"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 41
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400 border border-gray-500/30",
                                                        children: "Soon"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-xs px-2 py-1 rounded-full ${vault.tier === "Aggressive" ? "bg-red-500/20 text-red-400" : vault.tier === "Conservative" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`,
                                                        children: vault.tier
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "APY"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg font-semibold text-green-400",
                                                        children: formatAPY(vault.apy)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 176,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "TVL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 181,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lg font-semibold text-foreground",
                                                        children: formatCurrency(vault.tvl)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 180,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "Utilization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground",
                                                        children: [
                                                            vault.utilization,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 187,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-1.5 rounded-full bg-secondary overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-full rounded-full bg-blue-500",
                                                    style: {
                                                        width: `${vault.utilization}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/app/v2/page.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 186,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 pt-4 border-t border-border flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/app/v2/page.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 37
                                                    }, this),
                                                    "Next Roll"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 200,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-foreground",
                                                children: vault.nextRoll
                                            }, void 0, false, {
                                                fileName: "[project]/app/app/v2/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 199,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, vault.id, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 139,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 137,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/page.tsx",
                lineNumber: 126,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-foreground",
                        children: "Latest Updates"
                    }, void 0, false, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 213,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-border bg-secondary/30 divide-y divide-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "All V2 vaults (NVDAx, TSLAx, SPYx...) initialized on devnet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-xs text-muted-foreground",
                                        children: "Just now"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 218,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 215,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 221,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Oracle initialized with Pyth integration"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-xs text-muted-foreground",
                                        children: "5m ago"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 223,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 220,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Oracle status: Healthy"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-xs text-muted-foreground",
                                        children: "10m ago"
                                    }, void 0, false, {
                                        fileName: "[project]/app/app/v2/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/app/v2/page.tsx",
                                lineNumber: 225,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/app/v2/page.tsx",
                        lineNumber: 214,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/app/v2/page.tsx",
                lineNumber: 212,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/app/v2/page.tsx",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
_s(V2EarnDashboard, "as3ZyPtveWQBKvFP0Hvmw8T27dk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$node_modules$2f40$solana$2f$wallet$2d$adapter$2d$react$2f$lib$2f$esm$2f$useWallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useVault$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllVaults"]
    ];
});
_c = V2EarnDashboard;
var _c;
__turbopack_context__.k.register(_c, "V2EarnDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_cd75511b._.js.map