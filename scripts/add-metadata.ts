/**
 * Add Metadata to Existing Tokens
 * 
 * Uses mpl-token-metadata v2 stable API to add metadata to NVDAx and USDC mints
 */

import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    clusterApiUrl,
} from "@solana/web3.js";
import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";
import * as path from "path";

// Token addresses from deployment
const NVDAX_MINT = new PublicKey("G5VWnnWRxVvuTqRCEQNNGEdRmS42hMTyh8DAN9MHecLn");
const USDC_MINT = new PublicKey("5z8s3k7mkmH1DKFPvjkVd8PxapEeYaPJjqQTJeUEN1i4");

async function addMetadata(
    connection: Connection,
    payer: Keypair,
    mint: PublicKey,
    name: string,
    symbol: string,
    uri: string
) {
    // Derive metadata PDA
    const [metadataPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        METADATA_PROGRAM_ID
    );

    // Check if metadata already exists
    const metadataInfo = await connection.getAccountInfo(metadataPda);
    if (metadataInfo) {
        console.log(`Metadata already exists for ${symbol}`);
        return;
    }

    console.log(`Creating metadata for ${symbol}...`);
    console.log(`  Mint: ${mint.toBase58()}`);
    console.log(`  Metadata PDA: ${metadataPda.toBase58()}`);

    const metadataData = {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
    };

    const createMetadataIx = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPda,
            mint: mint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                data: metadataData,
                isMutable: true,
                collectionDetails: null,
            },
        }
    );

    const tx = new Transaction().add(createMetadataIx);
    const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
        commitment: "confirmed",
    });
    console.log(`✅ ${symbol} metadata created: ${sig}`);
}

async function main() {
    // Load wallet
    const walletPath = process.env.WALLET_PATH || path.join(process.env.HOME!, ".config/solana/id.json");
    const walletData = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
    const payer = Keypair.fromSecretKey(Uint8Array.from(walletData));

    console.log("Payer:", payer.publicKey.toBase58());

    // Connect to devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Add NVDAx metadata
    await addMetadata(
        connection,
        payer,
        NVDAX_MINT,
        "Mock NVDAx",
        "NVDAx",
        "https://raw.githubusercontent.com/feeniks01/optionsfi/master/app/public/metadata/nvdax.json"
    );

    // Add USDC metadata
    await addMetadata(
        connection,
        payer,
        USDC_MINT,
        "Mock USDC",
        "USDC",
        "https://raw.githubusercontent.com/feeniks01/optionsfi/master/app/public/metadata/usdc.json"
    );

    console.log("\n✅ All metadata created!");
}

main().catch(console.error);
