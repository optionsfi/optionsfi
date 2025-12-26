
import { Keypair } from "@solana/web3.js";
const bs58 = require("bs58");

const base58Key = "2zeoJdeSfco8tpD4WjCD8oQdsYBm5nwfXcRn7TqwsaCbuSvMBWji5CTFoYNnVFx1MFWeZ4QY1juo2oqCNxAdD1NA";

try {
    const keyBytes = bs58.decode(base58Key);
    const keypair = Keypair.fromSecretKey(keyBytes);
    console.log("Public Key:", keypair.publicKey.toBase58());
} catch (e: any) {
    console.error("Error:", e.message);
}
