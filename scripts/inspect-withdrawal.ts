/**
 * Inspect Withdrawal Requests for a specific wallet
 * 
 * Usage: npx ts-node scripts/inspect-withdrawal.ts <WALLET_PUBKEY>
 */
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as path from "path";

const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";

async function main() {
    const userKeyStr = process.argv[2];
    if (!userKeyStr) {
        console.error("Please provide user pubkey");
        return;
    }
    const userPubkey = new PublicKey(userKeyStr);

    console.log(`\n=== Withdrawal Inspector for ${userPubkey.toBase58()} ===`);
    console.log(`RPC: ${RPC_URL}`);

    const connection = new Connection(RPC_URL, "confirmed");

    // Load IDL
    const idlPath = path.join(__dirname, "..", "target", "idl", "vault.json");
    if (!fs.existsSync(idlPath)) {
        console.error("IDL not found");
        return;
    }
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

    // Dummy provider
    const dummyWallet = {
        publicKey: PublicKey.default,
        signTransaction: async () => { },
        signAllTransactions: async () => { }
    };
    const provider = new AnchorProvider(connection, dummyWallet as any, {});
    const program = new Program(idl, provider);

    const vaults = ["NVDAx", "DemoNVDAx6"];

    for (const assetId of vaults) {
        console.log(`\nChecking Vault: ${assetId}...`);

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), Buffer.from(assetId)],
            VAULT_PROGRAM_ID
        );

        try {
            const vault = await (program.account as any).vault.fetch(vaultPda);
            console.log(`  Current Epoch: ${vault.epoch}`);
            console.log(`  Vault USDC Balance (State): ${(Number(vault.premiumBalanceUsdc) / 1e6).toFixed(2)}`);

            // Check ACTUAL USDC balance of vault premium account
            const premiumTokenAccount = vault.premiumTokenAccount as PublicKey;
            try {
                const bal = await connection.getTokenAccountBalance(premiumTokenAccount);
                console.log(`  Vault USDC Balance (Actual): ${bal.value.uiAmount}`);
            } catch (e) {
                console.log(`  Vault USDC Balance (Actual): 0 (Account not found?)`);
            }

            // Scan last 20 epochs for withdrawal requests
            console.log("  Scanning past epochs for requests...");
            let found = false;
            for (let i = Number(vault.epoch); i >= Math.max(0, Number(vault.epoch) - 20); i--) {
                const epochBN = new BN(i);
                const [reqPda] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("withdrawal"),
                        vaultPda.toBuffer(),
                        userPubkey.toBuffer(),
                        epochBN.toArrayLike(Buffer, "le", 8)
                    ],
                    VAULT_PROGRAM_ID
                );

                try {
                    const req = await (program.account as any).withdrawalRequest.fetch(reqPda);
                    console.log(`    [Epoch ${i}] Request Found:`);
                    console.log(`      - Shares: ${(Number(req.shares) / 1e6).toFixed(2)}`);
                    console.log(`      - Processed: ${req.processed}`);
                    console.log(`      - Request Epoch: ${req.requestEpoch}`);
                    found = true;

                    if (!req.processed) {
                        console.log(`      ⚠️  PENDING! Try claiming with this epoch.`);
                    } else {
                        console.log(`      ✅  PROCESSED. Funds should have been sent.`);
                    }

                } catch (e) {
                    // Not found
                }
            }
            if (!found) console.log("    No requests found in last 20 epochs.");

        } catch (e: any) {
            console.error("  Error fetching vault:", e.message);
        }
    }
}

main().catch(console.error);
