/**
 * Create Metadata for vNVDAx Share Token (mpl-token-metadata v3)
 * 
 * Run this AFTER init-vault.ts to add metadata to the share mint
 * 
 * NOTE: This requires the vault program to have a create_share_metadata instruction
 * since the share mint authority is the vault PDA.
 */

import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    createMetadataAccountV3,
    mplTokenMetadata,
    MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    createSignerFromKeypair,
    signerIdentity,
    publicKey as umiPublicKey,
} from "@metaplex-foundation/umi";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey, toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import * as fs from "fs";
import * as path from "path";

// Vault Program ID
const VAULT_PROGRAM_ID = new PublicKey("A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94");
const ASSET_ID = "NVDAx";

// Metadata for vNVDAx share token
const TOKEN_NAME = "Mock vNVDAx";
const TOKEN_SYMBOL = "vNVDAx";
const TOKEN_URI = "https://raw.githubusercontent.com/feeniks01/optionsfi/master/app/public/metadata/vnvdax.json";

async function main() {
    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.join(process.env.HOME!, ".config/solana/id.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const payer = Keypair.fromSecretKey(Uint8Array.from(walletData));

    console.log("Payer:", payer.publicKey.toBase58());

    // Connect to devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Derive vault and share mint PDAs
    const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), Buffer.from(ASSET_ID)],
        VAULT_PROGRAM_ID
    );
    const [shareMintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("shares"), vaultPda.toBuffer()],
        VAULT_PROGRAM_ID
    );

    console.log("Vault PDA:", vaultPda.toBase58());
    console.log("Share Mint PDA:", shareMintPda.toBase58());

    // Check if share mint exists
    const shareMintInfo = await connection.getAccountInfo(shareMintPda);
    if (!shareMintInfo) {
        console.error("Error: Share mint not found. Run init-vault.ts first.");
        process.exit(1);
    }

    // Create metadata PDA
    const metaplexProgramId = toWeb3JsPublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
    const [metadataPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            metaplexProgramId.toBuffer(),
            shareMintPda.toBuffer(),
        ],
        metaplexProgramId
    );

    // Check if metadata already exists
    const metadataInfo = await connection.getAccountInfo(metadataPda);
    if (metadataInfo) {
        console.log("Metadata already exists for vNVDAx share token!");
        console.log("Metadata PDA:", metadataPda.toBase58());
        process.exit(0);
    }

    console.log("\n⚠️  vNVDAx share metadata requires the vault program's create_share_metadata instruction.");
    console.log("The share mint authority is the vault PDA, which requires a CPI call to create metadata.");
    console.log("\nShare Mint:", shareMintPda.toBase58());
    console.log("Metadata PDA (to be created):", metadataPda.toBase58());
    console.log("\nTo create metadata, call the vault program's create_share_metadata instruction.");
}

main().catch(console.error);
