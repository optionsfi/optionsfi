/**
 * Check vault state on-chain
 */
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as path from "path";

const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const connection = new Connection("https://api.devnet.solana.com");

async function checkVault(name: string) {
    const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(name)],
        VAULT_PROGRAM_ID
    );

    console.log(`\n=== ${name} ===`);
    console.log("PDA:", pda.toBase58());

    const info = await connection.getAccountInfo(pda);
    if (!info) {
        console.log("VAULT DOES NOT EXIST!");
        return;
    }

    // Load IDL and decode
    const idlPath = path.join(__dirname, "..", "target", "idl", "vault.json");
    const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

    const dummyWallet = {
        publicKey: PublicKey.default,
        signTransaction: async (t: any) => t,
        signAllTransactions: async (t: any) => t
    } as any;
    const provider = new AnchorProvider(connection, dummyWallet, {});
    const program = new Program(idl, provider);

    const vault = await (program.account as any).vault.fetch(pda);

    console.log("Epoch:", vault.epoch.toString());
    console.log("Total Assets:", (Number(vault.totalAssets) / 1e6).toFixed(2), "NVDAx");
    console.log("Total Shares:", (Number(vault.totalShares) / 1e6).toFixed(2));
    console.log("Share Price:", vault.totalShares > 0 ? (Number(vault.totalAssets) / Number(vault.totalShares)).toFixed(6) : "N/A");
    console.log("Premium Balance USDC:", (Number(vault.premiumBalanceUsdc) / 1e6).toFixed(4));
    console.log("Epoch Premium Earned:", (Number(vault.epochPremiumEarned) / 1e6).toFixed(4));
    console.log("Epoch Notional Exposed:", (Number(vault.epochNotionalExposed) / 1e6).toFixed(2));
    console.log("Last Roll:", new Date(Number(vault.lastRollTimestamp) * 1000).toISOString());
    console.log("Is Paused:", vault.isPaused);
}

async function main() {
    await checkVault("DemoNVDAx");
    await checkVault("NVDAx");
}

main().catch(console.error);
