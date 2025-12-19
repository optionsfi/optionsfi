/**
 * Create Mock USDC Token with Metadata (mpl-token-metadata v3)
 * 
 * Supply: 78,000,000,000 tokens (6 decimals)
 * Metadata: Mock USDC with logo
 */

import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    createMetadataAccountV3,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    createSignerFromKeypair,
    signerIdentity,
    none,
} from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import * as fs from "fs";
import * as path from "path";

const DECIMALS = 6;
const MAX_SUPPLY = 78_000_000_000; // 78 billion
const MAX_SUPPLY_BASE = BigInt(MAX_SUPPLY) * BigInt(10 ** DECIMALS);

// Metadata for Mock USDC
const TOKEN_NAME = "Mock USDC";
const TOKEN_SYMBOL = "USDC";
const TOKEN_URI = "https://raw.githubusercontent.com/feeniks01/optionsfi/master/app/public/metadata/usdc.json";

// Helper to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.join(process.env.HOME!, ".config/solana/id.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const payer = Keypair.fromSecretKey(Uint8Array.from(walletData));

    console.log("Payer:", payer.publicKey.toBase58());

    // Connect to devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Create Umi instance
    const umi = createUmi(clusterApiUrl("devnet"))
        .use(mplTokenMetadata());
    const umiKeypair = fromWeb3JsKeypair(payer);
    const signer = createSignerFromKeypair(umi, umiKeypair);
    umi.use(signerIdentity(signer));

    // Create mint
    console.log("Creating Mock USDC mint...");
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey, // mint authority
        payer.publicKey, // freeze authority
        DECIMALS
    );
    console.log("Mock USDC Mint:", mint.toBase58());

    // Wait for mint to be confirmed across network
    console.log("Waiting for mint confirmation...");
    await sleep(3000);

    // Verify mint exists
    const mintInfo = await connection.getAccountInfo(mint);
    if (!mintInfo) {
        throw new Error("Mint account not found after creation");
    }
    console.log("Mint confirmed, data length:", mintInfo.data.length);

    // Create metadata using Umi
    console.log("Creating metadata...");

    const mintUmi = fromWeb3JsPublicKey(mint);

    try {
        await createMetadataAccountV3(umi, {
            mint: mintUmi,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer.publicKey,
            data: {
                name: TOKEN_NAME,
                symbol: TOKEN_SYMBOL,
                uri: TOKEN_URI,
                sellerFeeBasisPoints: 0,
                creators: none(),
                collection: none(),
                uses: none(),
            },
            isMutable: true,
            collectionDetails: none(),
        }).sendAndConfirm(umi);

        console.log("Metadata created!");
    } catch (error: any) {
        console.error("Metadata creation failed:", error.message);
        console.log("Continuing without metadata...");
    }

    // Create token account and mint max supply
    console.log("Minting max supply (this may take a moment for 78B tokens)...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer.publicKey,
        MAX_SUPPLY_BASE
    );
    console.log(`Minted ${MAX_SUPPLY.toLocaleString()} Mock USDC to ${tokenAccount.address.toBase58()}`);

    // Save mint address
    const outputPath = path.join(__dirname, ".env.mints");
    fs.appendFileSync(outputPath, `USDC_MINT=${mint.toBase58()}\n`);
    console.log(`\nSaved to ${outputPath}`);
}

main().catch(console.error);
