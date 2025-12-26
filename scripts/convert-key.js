
const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");
const fs = require("fs");

// Usage: npx ts-node scripts/convert-key.ts <path-to-json-keypair>
// Or just paste array in the file if lazy

const args = process.argv.slice(2);
const keyPath = args[0] || "target/deploy/vault-keypair.json"; // Default or change this

try {
    if (fs.existsSync(keyPath)) {
        const keyData = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
        const keypair = Keypair.fromSecretKey(Uint8Array.from(keyData));
        console.log("\n✅ Base58 Private Key (Copy this to Railway):\n");
        console.log(bs58.encode(keypair.secretKey));
        console.log("\n✅ Public Key:", keypair.publicKey.toBase58());
    } else {
        console.error("File not found:", keyPath);
        console.log("Usage: npx ts-node scripts/convert-key.ts <path-to-json-key-file>");

        // Try to handle direct array input as arg if someone pastes it
        try {
            const rawArr = JSON.parse(args[0]);
            const kp = Keypair.fromSecretKey(Uint8Array.from(rawArr));
            console.log("\n✅ Base58 Private Key:\n");
            console.log(bs58.encode(kp.secretKey));
        } catch { }
    }
} catch (e) {
    console.error("Error:", e);
}
