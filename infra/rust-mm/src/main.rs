use bs58;
use dotenv::dotenv;
use futures_util::{SinkExt, StreamExt};
use log::{error, info, warn};
use rand::Rng;
use serde::{Deserialize, Serialize};
use serde_json::json;
use solana_sdk::{
    pubkey::Pubkey,
    signature::{Keypair, Signer},
};
use std::env;
use std::str::FromStr;
use std::time::Duration;
use tokio::time::sleep;
use tokio_tungstenite::{connect_async, tungstenite::client::IntoClientRequest};

// Configuration Constants
const DEFAULT_ROUTER_WS: &str = "ws://localhost:3006";
const DEFAULT_RPC_URL: &str = "https://api.devnet.solana.com";

// Data Structures
#[derive(Serialize, Deserialize, Debug)]
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

    // Load Wallet (Optional for Quoting-only, required for Fills)
    let wallet = load_wallet();
    if let Some(w) = &wallet {
        info!("💳 Loaded wallet: {}", w.pubkey());
    } else {
        warn!("⚠️  No wallet loaded. Fills will fail, but quoting will work.");
    }

    // Main Reconnect Loop
    loop {
        info!("Connecting to Router at {} as {}...", ws_url, mm_id);

        match connect_to_router(&ws_url, &mm_id, &api_key).await {
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

async fn connect_to_router(base_url: &str, mm_id: &str, api_key: &str) -> Result<(), Box<dyn std::error::Error>> {
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
            // info!("Received: {}", text); // Verbose logging

            // Parse generic to get type first, or try Enum
            match serde_json::from_str::<Message>(text) {
                Ok(parsed) => {
                    match parsed {
                        Message::Rfq { rfqId, underlying, strike, expiry, size, .. } => {
                            let tx_clone = tx.clone();
                            let rfq_id = rfqId.clone();
                            
                            // Spawn logic to not block reader
                            tokio::spawn(async move {
                                handle_rfq(tx_clone, rfq_id, underlying, strike, expiry, size).await;
                            });
                        },
                        Message::Fill { rfqId, premium, .. } => {
                            info!("🎉 Fill Confirmed! RFQ: {}, Premium: {} µUSDC", rfqId, premium);
                            // TODO: Trigger On-Chain Transaction Here
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
    // ⚡️ HIGH FREQUENCY PRICING LOGIC ⚡️

    // Filter chance (simulate logic)
    let mut rng = rand::thread_rng();
    if rng.gen::<f64>() > 0.95 { // Quote 95% of requests
        return; 
    }

    // info!("📨 RFQ: {} for {} {} @ ${}", rfq_id, size, underlying, strike);

    // Pricing Model (Mock Black-Scholes-ish)
    // In Rust, this math is instant (<1us)
    let now_sec = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs();
    let duration_sec = if expiry > now_sec { expiry - now_sec } else { 0 };
    let duration_min = duration_sec as f64 / 60.0;
    
    // Base rate ~0.2% per week
    let base_rate = 0.002 + rng.gen::<f64>() * 0.001; 
    let time_scale = (duration_min / 10080.0).sqrt(); // Weekly sqrt scale
    let premium_percent = base_rate * time_scale;

    let is_demo = underlying.to_lowercase().contains("demo");
    let spot_price = if is_demo { strike / 1.01 } else { strike / 1.10 };

    let base_premium_usd = size * spot_price * premium_percent;
    // Multiplier for aggressiveness
    let multiplier = 1.0; 
    let adjusted_premium = base_premium_usd * multiplier;
    
    // Convert to µUSDC (6 decimals)
    let premium_microns = (adjusted_premium * 1_000_000.0) as u64;
    let final_premium = std::cmp::max(1, premium_microns);

    // info!("📊 Calculated Premium: {} µUSDC (${:.4})", final_premium, adjusted_premium);

    // Artificial Latency?
    // User wants FAST. Let's do 10ms just to be realistic, or 0ms for max speed.
    // sleep(Duration::from_millis(10)).await;

    // Send Quote
    let quote = Message::Quote {
        rfqId: rfq_id,
        premium: final_premium,
    };

    if let Err(e) = tx.send(quote) {
        error!("Failed to queue quote response: {}", e);
    }
}

// Utils
fn load_wallet() -> Option<Keypair> {
    let key_str = env::var("WALLET_PRIVATE_KEY").ok()?;
    // simple parsing for array (JSON) or base58
    if let Ok(vec) = serde_json::from_str::<Vec<u8>>(&key_str) {
        return Keypair::from_bytes(&vec).ok();
    }
    if let Ok(key_bytes) = bs58::decode(&key_str).into_vec() {
        return Keypair::from_bytes(&key_bytes).ok();
    }
    None
}
