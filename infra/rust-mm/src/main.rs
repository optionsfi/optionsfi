use bs58;
use dotenv::dotenv;
use futures_util::{SinkExt, StreamExt};
use log::{error, info, warn};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::RwLock;
use tokio::time::sleep;
use tokio_tungstenite::{connect_async, tungstenite::client::IntoClientRequest};

use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_program,
    transaction::Transaction,
};
use spl_associated_token_account::get_associated_token_address;
use spl_token::instruction::transfer;

// Configuration Constants
const DEFAULT_ROUTER_WS: &str = "ws://localhost:3006";
const DEFAULT_RPC_URL: &str = "https://api.devnet.solana.com";

// Solana Constants
const VAULT_PROGRAM_ID_STR: &str = "A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94";
const USDC_MINT_STR: &str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"; // Devnet USDC

// Data Structures
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type", rename_all = "camelCase")]
enum Message {
    Rfq {
        rfqId: String,
        underlying: String,
        optionType: String,
        strike: f64,
        expiry: u64,
        size: f64,
        #[serde(default)]
        premiumFloor: f64,
    },
    Quote {
        rfqId: String,
        premium: u64,
    },
    Fill {
        rfqId: String,
        premium: u64,
        #[serde(default)]
        maker: String,
    },
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    info!("🚀 Starting Rust Market Maker...");

    let ws_url = env::var("ROUTER_WS_URL").unwrap_or_else(|_| DEFAULT_ROUTER_WS.to_string());
    let mm_id = env::var("MAKER_ID").unwrap_or("rust-mm-1".to_string());
    let api_key = env::var("MM_API_KEY").expect("MM_API_KEY must be set");

    // Load Wallet
    let wallet_keypair = Arc::new(load_wallet().expect("Failed to load WALLET_PRIVATE_KEY"));
    info!("💳 Loaded wallet: {}", wallet_keypair.pubkey());

    // RPC Client
    let rpc_url = env::var("RPC_URL").unwrap_or(DEFAULT_RPC_URL.to_string());
    let rpc_client = Arc::new(RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed()));

    // State: RFQ ID -> Asset ID map
    let rfq_map: Arc<RwLock<HashMap<String, String>>> = Arc::new(RwLock::new(HashMap::new()));

    // Main Reconnect Loop
    loop {
        info!("Connecting to Router at {} as {}...", ws_url, mm_id);

        match connect_to_router(&ws_url, &mm_id, &api_key, rfq_map.clone(), wallet_keypair.clone(), rpc_client.clone()).await {
            Ok(_) => {
                info!("Connection closed cleanly.");
            }
            Err(e) => {
                error!("Connection error: {}", e);
            }
        }

        info!("Reconnecting in 5 seconds...");
        sleep(Duration::from_secs(5)).await;
    }
}

async fn connect_to_router(
    base_url: &str, 
    mm_id: &str, 
    api_key: &str,
    rfq_map: Arc<RwLock<HashMap<String, String>>>,
    wallet: Arc<Keypair>,
    rpc: Arc<RpcClient>
) -> Result<(), Box<dyn std::error::Error>> {
    let url_string = format!("{}?makerId={}", base_url, mm_id);
    let url = url::Url::parse(&url_string)?;

    let mut request = url.into_client_request()?;
    let headers = request.headers_mut();
    headers.insert(
        "Authorization",
        format!("Bearer {}", api_key).parse()?,
    );

    let (ws_stream, _) = connect_async(request).await?;
    info!("✅ Connected!");

    let (mut write, mut read) = ws_stream.split();

    // Use a channel to send messages from logic to the socket writer
    let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<Message>();

    // Spawn Writer Task
    let write_task = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            let json = serde_json::to_string(&msg).unwrap();
            if let Err(e) = write.send(tokio_tungstenite::tungstenite::Message::Text(json)).await {
                error!("Failed to send message: {}", e);
                break;
            }
        }
    });

    // Read Loop
    while let Some(msg_result) = read.next().await {
        let msg = msg_result?;
        if msg.is_text() {
            let text = msg.to_text()?;

            match serde_json::from_str::<Message>(text) {
                Ok(parsed) => {
                    match parsed {
                        Message::Rfq { rfqId, underlying, strike, expiry, size, .. } => {
                            // Store mapping
                            {
                                let mut map = rfq_map.write().await;
                                map.insert(rfqId.clone(), underlying.clone());
                            }

                            let tx_clone = tx.clone();
                            let rfq_id = rfqId.clone();
                            
                            // Spawn logic
                            tokio::spawn(async move {
                                handle_rfq(tx_clone, rfq_id, underlying, strike, expiry, size).await;
                            });
                        },
                        Message::Fill { rfqId, premium, .. } => {
                            info!("🎉 Fill received! RFQ: {}, Premium: {} µUSDC", rfqId, premium);
                            
                            let asset_id_opt = {
                                let mut map = rfq_map.write().await;
                                map.remove(&rfqId)
                            };

                            if let Some(asset_id) = asset_id_opt {
                                let w_clone = wallet.clone();
                                let r_clone = rpc.clone();
                                tokio::spawn(async move {
                                    if let Err(e) = handle_fill(r_clone, w_clone, rfqId, asset_id, premium).await {
                                        error!("❌ Fill failed: {}", e);
                                    }
                                });
                            } else {
                                warn!("⚠️ Unknown RFQ ID for fill: {}", rfqId);
                            }
                        },
                        _ => {}
                    }
                },
                Err(e) => error!("Failed to parse message: {}", e),
            }
        }
    }

    write_task.abort();
    Ok(())
}

async fn handle_rfq(
    tx: tokio::sync::mpsc::UnboundedSender<Message>,
    rfq_id: String,
    underlying: String,
    strike: f64,
    expiry: u64,
    size: f64
) {
    let mut rng = rand::thread_rng();
    if rng.gen::<f64>() > 0.95 { return; }

    let now_sec = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs();
    let duration_sec = if expiry > now_sec { expiry - now_sec } else { 0 };
    let duration_min = duration_sec as f64 / 60.0;
    
    let base_rate = 0.002 + rng.gen::<f64>() * 0.001; 
    let time_scale = (duration_min / 10080.0).sqrt(); 
    let premium_percent = base_rate * time_scale;

    let is_demo = underlying.to_lowercase().contains("demo");
    let spot_price = if is_demo { strike / 1.01 } else { strike / 1.10 };

    let base_premium_usd = size * spot_price * premium_percent;
    let adjusted_premium = base_premium_usd * 1.0;
    
    let premium_microns = (adjusted_premium * 1_000_000.0) as u64;
    let final_premium = std::cmp::max(1, premium_microns);

    let quote = Message::Quote {
        rfqId: rfq_id,
        premium: final_premium,
    };

    if let Err(e) = tx.send(quote) {
        error!("Failed to queue quote response: {}", e);
    }
}

async fn handle_fill(
    rpc: Arc<RpcClient>,
    wallet_keypair: Arc<Keypair>,
    rfq_id: String,
    asset_id: String,
    premium_amount: u64
) -> Result<(), Box<dyn std::error::Error>> {
    info!("🔗 Executing On-Chain Fill for {} ({})...", rfq_id, asset_id);

    let program_id = Pubkey::new_from_array(bs58::decode(VAULT_PROGRAM_ID_STR).into_vec()?.try_into().unwrap());
    let usdc_mint = Pubkey::new_from_array(bs58::decode(USDC_MINT_STR).into_vec()?.try_into().unwrap());

    // 1. Derive Vault PDA
    let (vault_pda, _) = Pubkey::find_program_address(&[b"vault", asset_id.as_bytes()], &program_id);

    // 2. Derive Premium Token Account (Vault's USDC ATA)
    let vault_premium_account = get_associated_token_address(&vault_pda, &usdc_mint);

    // 3. Derive MM Token Account (My USDC ATA)
    let my_token_account = get_associated_token_address(&wallet_keypair.pubkey(), &usdc_mint);

    // 4. Create Transfer Instruction
    let transfer_ix = transfer(
        &spl_token::id(),
        &my_token_account,
        &vault_premium_account,
        &wallet_keypair.pubkey(),
        &[],
        premium_amount, // Amount in atomic units
    )?;

    // 5. Send Transaction
    let latest_blockhash = rpc.get_latest_blockhash()?;
    let tx = Transaction::new_signed_with_payer(
        &[transfer_ix],
        Some(&wallet_keypair.pubkey()),
        &[&*wallet_keypair],
        latest_blockhash,
    );

    let signature = rpc.send_and_confirm_transaction(&tx)?;

    info!("✅ Fill Executed! Tx: {}", signature);
    Ok(())
}

fn load_wallet() -> Option<Keypair> {
    let key_str = match env::var("WALLET_PRIVATE_KEY") {
        Ok(v) => v,
        Err(_) => {
            error!("WALLET_PRIVATE_KEY env var is NOT set!");
            return None;
        }
    };

    if let Ok(vec) = serde_json::from_str::<Vec<u8>>(&key_str) {
        if let Ok(kp) = Keypair::from_bytes(&vec) {
            return Some(kp);
        } else {
            warn!("Parsed JSON key but Keypair::from_bytes failed (wrong length?)");
        }
    }

    if let Ok(key_bytes) = bs58::decode(key_str.trim()).into_vec() {
        if let Ok(kp) = Keypair::from_bytes(&key_bytes) {
            return Some(kp);
        } else {
            warn!("Decoded Base58 key but Keypair::from_bytes failed (wrong length?)");
        }
    } else {
        warn!("Failed to decode WALLET_PRIVATE_KEY as Base58");
    }

    error!("WALLET_PRIVATE_KEY format invalid. Expected JSON array [1,2,3...] OR Base58 string.");
    None
}
