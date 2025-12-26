FROM rust:1.75-slim-bookworm as builder

WORKDIR /app

# Copy manifest only to cache dependencies
COPY Cargo.toml ./
# Create dummy main to build deps
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copy actual source
COPY src src
# Touch main.rs to force rebuild
RUN touch src/main.rs
RUN cargo build --release

# Runtime image
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/rust-mm /usr/local/bin/rust-mm

# Default Command
CMD ["rust-mm"]
