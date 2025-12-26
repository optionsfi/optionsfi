/**
 * Fix Vault Shortfall
 * 
 * Detects if the vault's recorded Premium Balance (USDC) is higher than its actual Token Account balance.
 * If so, it transfers the difference from the local wallet to the vault to make it solvent.
 * This unblocks withdrawals that are failing due to "Insufficient Funds".
 * 
 * Usage: npx ts-node scripts/fix-vault-shortfall.ts
 */
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress, createTransferInstruction, getAccount } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const WALLET_PATH = process.env.WALLET_PATH || path.join(os.homedir(), ".config", "solana", "id.json");

async function main() {
    console.log("=== OptionsFi Vault Solvency Fixer ===");
    console.log(`RPC: ${RPC_URL}`);

    // Setup
    const connection = new Connection(RPC_URL, "confirmed");
    const keypairData = JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8"));
    const wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(keypairData)));
    console.log(`Payer: ${wallet.publicKey.toBase58()}`);

    // Load IDL
    const idlPath = path.join(__dirname, "..", "target", "idl", "vault.json");
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    const program = new Program(idl, provider);

    const vaults = ["NVDAx", "DemoNVDAx6"];

    for (const assetId of vaults) {
        console.log(`\nChecking Vault: ${assetId}...`);

        try {
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), Buffer.from(assetId)],
                VAULT_PROGRAM_ID
            );
            const vault = await (program.account as any).vault.fetch(vaultPda);
            const premiumMint = vault.premiumMint as PublicKey;
            const vaultPremiumAccount = vault.premiumTokenAccount as PublicKey;

            const stateBalance = Number(vault.premiumBalanceUsdc); // Base units

            // Check Actual Balance
            let actualBalance = 0;
            try {
                const info = await connection.getTokenAccountBalance(vaultPremiumAccount);
                actualBalance = Number(info.value.amount);
            } catch (e) {
                console.log("  - Could not read vault token account (Empty?)");
            }

            const stateHuman = (stateBalance / 1e6).toFixed(4);
            const actualHuman = (actualBalance / 1e6).toFixed(4);

            console.log(`  State Balance:  $${stateHuman}`);
            console.log(`  Actual Balance: $${actualHuman}`);

            if (stateBalance > actualBalance) {
                const shortfall = stateBalance - actualBalance;
                const shortfallHuman = (shortfall / 1e6).toFixed(4);
                console.log(`  ❌ INSOLVENT! Shortfall: $${shortfallHuman} USDC`);
                console.log(`  -> Attempting to fund shortfall...`);

                // Create Transfer
                const payerTokenAccount = await getAssociatedTokenAddress(premiumMint, wallet.publicKey);

                const tx = new Transaction().add(
                    createTransferInstruction(
                        payerTokenAccount,
                        vaultPremiumAccount,
                        wallet.publicKey,
                        BigInt(shortfall)
                    )
                );

                const sig = await provider.sendAndConfirm(tx);
                console.log(`  ✅ Fixed! Transfer successful: ${sig}`);
                console.log(`  Vault is now solvent. Withdrawals should work.`);
            } else {
                console.log(`  ✅ SOLVENT (Actual >= State)`);
            }

        } catch (e: any) {
            console.error(`  Error processing ${assetId}:`, e.message);
        }
    }
}

main().catch(console.error);
