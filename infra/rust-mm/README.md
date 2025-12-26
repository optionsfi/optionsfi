# Rust Market Maker Client

A high-frequency market maker client for OptionsFi, written in Rust.

## Features
- 🚀 **High Performance**: <1ms response latency for quoting.
- ⚡️ **Async I/O**: Built on `tokio` and `tungstenite`.
- 🔐 **Secure**: Local signing with `solana-sdk`.

## Setup

1. **Install Rust**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings (API Key, Wallet Key, etc.).

3. **Build**:
   ```bash
   cargo build --release
   ```

## Running
```bash
cargo run --release
```

## Configuration
- `ROUTER_WS_URL`: WebSocket URL of the RFQ Router (e.g. `ws://localhost:3006`).
- `MM_API_KEY`: API Key for authentication.
- `MAKER_ID`: Unique ID for this maker instance.
- `WALLET_PRIVATE_KEY`: Base58 or JSON array private key for signing transactions.
