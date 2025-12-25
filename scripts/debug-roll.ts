
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
// import axios from "axios";
// import { OnChainClient, createWallet } from "../infra/keeper/src/onchain";
import vaultIdl from "../target/idl/vault.json";

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const ASSET_ID = "DemoNVDAx5";

// Mock minimal Config for pricing check
const config = {
    strikeDeltaBps: 1000,
    volatilityLookbackDays: 30,
    ticker: "NVDA",
    riskFreeRate: 0.05,
    rfqRouterUrl: "http://localhost:3005" // Won't work locally if not running, but we can verify steps before that
};

async function main() {
    console.log(`Debugging Roll for: ${ASSET_ID}`);
    const connection = new Connection(RPC_URL, "confirmed");

    const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require("fs").readFileSync(process.env.WALLET_PATH || require("os").homedir() + "/.config/solana/id.json", "utf-8")))
    ));
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    anchor.setProvider(provider);

    const program = new anchor.Program(vaultIdl as any, provider);
    const [vaultPda] = PublicKey.findProgramAddressSync([Buffer.from("vault"), Buffer.from(ASSET_ID)], program.programId);

    // 1. Fetch Vault
    console.log("Fetching vault...");
    const vault = await (program.account as any).vault.fetch(vaultPda);
    console.log(`Epoch Notional: ${vault.epochNotionalExposed.toString()}`);
    console.log(`Total Assets: ${vault.totalAssets.toString()}`);
    const utilizationCapBps = vault.utilizationCapBps;
    console.log(`Utilization Cap: ${utilizationCapBps} bps`);

    // 2. Capacity Check
    const totalAssets = Number(vault.totalAssets) / 1e6;
    const currentExposure = Number(vault.epochNotionalExposed) / 1e6;
    const maxExposure = totalAssets * (utilizationCapBps / 10000);
    const available = maxExposure - currentExposure;
    console.log(`Assets: ${totalAssets}, Exposed: ${currentExposure}, Max: ${maxExposure}, Available: ${available}`);

    if (available < 0.01) {
        console.error("ERROR: Not enough capacity to roll!");
        return;
    }

    // 3. Oracle Check
    // We'll skip fetching real oracle for this debug since logging capacity is usually the blocker
    // But if we proceed:
    console.log("Capacity OK. Roll should proceed if keeper is running.");

    // Check minEpochDuration
    console.log(`Min Epoch Duration: ${vault.minEpochDuration.toString()}`);
}

main().catch(console.error);
