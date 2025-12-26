/**
 * Check wallet holdings active on platform vs stale/unknown
 * 
 * Logic:
 * 1. Fetch current on-chain state for all configured vaults.
 * 2. Build a "Verified Mints" list (Underlying, ShareTokens, PremiumTokens).
 * 3. Fetch ALL token accounts in the user's wallet.
 * 4. Classify each holding as Verified or Stale.
 * 
 * Usage: npx ts-node scripts/check-holdings.ts
 */
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Configuration
const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const WALLET_PATH = process.env.WALLET_PATH || path.join(os.homedir(), ".config", "solana", "id.json");

// Hardcoded known mints (from source code)
const KNOWN_MINTS: Record<string, string> = {
    "G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn": "NVDAx (Underlying)",
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU": "USDC (Devnet)",
};

// Vaults to check
const VAULT_ASSET_IDS = ["NVDAx", "DemoNVDAx6"];

interface TokenHolding {
    mint: string;
    amount: number;
    decimals: number;
    address: string;
    isVerified: boolean;
    label?: string;
}

async function main() {
    console.log("=== OptionsFi Wallet Audit ===");
    console.log(`RPC: ${RPC_URL}`);

    // 1. Setup Connection and Target Wallet
    const connection = new Connection(RPC_URL, "confirmed");
    let targetPubkey: PublicKey;

    // Check if user provided a wallet address
    const inputArg = process.argv[2];
    if (inputArg && inputArg.length > 30) {
        try {
            targetPubkey = new PublicKey(inputArg);
            console.log(`Checking Provided Wallet: ${targetPubkey.toBase58()}`);
        } catch (e) {
            console.error("Invalid wallet address provided.");
            return;
        }
    } else {
        // Fallback to local keypair
        try {
            const keypairData = JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8"));
            const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
            targetPubkey = keypair.publicKey;
            console.log(`Checking Local Wallet: ${targetPubkey.toBase58()}`);
        } catch (e: any) {
            console.error(`Failed to load local wallet:`, e.message);
            console.log("Usage: npx ts-node scripts/check-holdings.ts <OPTIONAL_WALLET_ADDRESS>");
            return;
        }
    }

    // 2. Load IDL and Program (Need a dummy wallet provider if just querying)
    let program: Program;
    try {
        const possiblePaths = [
            path.join(__dirname, "..", "target", "idl", "vault.json"),
            path.join(__dirname, "..", "anchor", "vault_idl.json")
        ];
        const idlPath = possiblePaths.find(p => fs.existsSync(p));
        if (!idlPath) throw new Error("IDL not found");
        const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

        // Use a dummy wallet for the provider if we are just reading
        const dummyWallet = {
            publicKey: PublicKey.default,
            signTransaction: async () => { throw new Error("Read-only"); },
            signAllTransactions: async () => { throw new Error("Read-only"); }
        };

        const provider = new AnchorProvider(connection, dummyWallet as any, { commitment: "confirmed" });
        program = new Program(idl, provider);
    } catch (e: any) {
        console.error("Failed to init program:", e.message);
        return;
    }

    // 3. Build Active Mint Whitelist
    console.log("\n--- 1. REFERENCE: Active Platform Mints (Trusted) ---");
    console.log("These are the ONLY tokens currently used by the platform.");
    const verifiedMints = new Map<string, string>(); // mint -> description

    // Add hardcoded known mints first
    Object.entries(KNOWN_MINTS).forEach(([mint, label]) => verifiedMints.set(mint, label));

    for (const assetId of VAULT_ASSET_IDS) {
        try {
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), Buffer.from(assetId)],
                VAULT_PROGRAM_ID
            );
            const vault = await (program.account as any).vault.fetch(vaultPda);

            const shareMint = (vault.shareMint as PublicKey).toBase58();
            const premiumMint = (vault.premiumMint as PublicKey).toBase58();
            const underlyingMint = (vault.underlyingMint as PublicKey).toBase58();

            const shareLabel = `v${assetId} (Share Token)`;
            const premiumLabel = `USDC (Premium Token)`;
            const underlyingLabel = `${assetId} (Underlying)`;

            verifiedMints.set(shareMint, shareLabel);
            verifiedMints.set(premiumMint, premiumLabel);
            verifiedMints.set(underlyingMint, underlyingLabel);

            console.log(`\n  Vault: ${assetId}`);
            console.log(`    - Shares (v${assetId}):  ${shareMint}`);
            console.log(`    - Underlying:          ${underlyingMint}`);
        } catch (e) {
            console.warn(`[Warning] Could not fetch vault ${assetId} - maybe not deployed?`);
        }
    }

    // 4. Fetch All Wallet Holdings
    console.log("\n--- 2. WALLET AUDIT: Current Holdings ---");
    const accounts = await connection.getParsedTokenAccountsByOwner(targetPubkey, {
        programId: TOKEN_PROGRAM_ID
    });

    const holdings: TokenHolding[] = [];

    for (const { account, pubkey } of accounts.value) {
        const parsed = account.data.parsed.info;
        const amount = parsed.tokenAmount.uiAmount;
        const mint = parsed.mint;

        if (amount > 0) { // Only show non-zero balances
            holdings.push({
                mint,
                amount,
                decimals: parsed.tokenAmount.decimals,
                address: pubkey.toBase58(),
                isVerified: verifiedMints.has(mint),
                label: verifiedMints.get(mint)
            });
        }
    }

    // 5. Report Results
    const active = holdings.filter(h => h.isVerified);
    const stale = holdings.filter(h => !h.isVerified);

    console.log(`\n✅ VERIFIED ACTIVE HOLDINGS (${active.length})`);
    console.log("Tokens in your wallet that match the trusted list above:");
    if (active.length === 0) console.log("  (None)");
    active.forEach(h => {
        console.log(`  - ${h.amount.toFixed(2).padEnd(10)} ${h.label}\n    Mint: ${h.mint}`);
    });

    console.log(`\n⚠️  STALE / UNRECOGNIZED HOLDINGS (${stale.length})`);
    console.log("Tokens in your wallet NOT in the trusted list (Old deployments?):");
    if (stale.length === 0) console.log("  (None)");
    stale.forEach(h => {
        console.log(`  - ${h.amount.toFixed(2).padEnd(10)} (Unknown)\n    Mint: ${h.mint}`);
    });

    console.log("\n(You can use 'scripts/cleanup-tokens.ts' to burn/close the active ones if needed,");
    console.log(" but you'll need a separate script to clean up stale ones directly by mint)");
}

main().catch(console.error);
