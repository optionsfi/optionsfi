/**
 * Centralized vault configuration - Static metadata only
 * 
 * Dynamic data (TVL, APY, price, tier) should be fetched from on-chain
 * or computed based on live data.
 */

export interface VaultMetadata {
    name: string;
    symbol: string;
    assetId: string;      // On-chain asset ID for PDA derivation
    strategy: string;
    logo: string;
    accentColor: string;
    strikeOffset: number; // Strike OTM percentage (e.g., 0.10 = 10%)
    premiumRange: [number, number]; // Expected premium range as percentage (strategy-based)
    isDemo: boolean;
    decimals: number;
    pythFeedId: string;
}

export const VAULT_CONFIG: Record<string, VaultMetadata> = {
    // Demo vault with virtual offset (first depositor protection - no token loss)
    demonvdax: {
        name: "Demo NVDAx",
        symbol: "NVDAx",
        assetId: "DemoV3",  // Uses mock USDC (5z8s3k...) for premium
        strategy: "Demo Vault",
        logo: "/nvidiax_logo.png",
        accentColor: "#76B900",
        strikeOffset: 0.01,
        premiumRange: [0.8, 1.2],
        isDemo: true,
        decimals: 6,
        pythFeedId: "0x4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f",
    },

    // Production vaults
    nvdax: {
        name: "NVDAx Vault",
        symbol: "NVDAx",
        assetId: "NVDAx",
        strategy: "Covered Call",
        logo: "/nvidiax_logo.png",
        accentColor: "#76B900",
        strikeOffset: 0.10,
        premiumRange: [0.8, 1.2],
        isDemo: false,
        decimals: 6,
        pythFeedId: "0x4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f",
    },
};

// Helper to get vault by ticker (lowercase key)
export function getVaultConfig(ticker: string): VaultMetadata | undefined {
    return VAULT_CONFIG[ticker.toLowerCase()];
}

// Get all vault tickers
export function getAllVaultTickers(): string[] {
    return Object.keys(VAULT_CONFIG);
}

// Get Pyth feed ID for a vault
export function getPythFeedId(ticker: string): string | undefined {
    return VAULT_CONFIG[ticker.toLowerCase()]?.pythFeedId;
}

// Compute tier based on APY dynamically
export function computeTier(apy: number, isDemo: boolean): "Conservative" | "Normal" | "Aggressive" | "Demo" {
    if (isDemo) return "Demo";
    if (apy < 8) return "Conservative";
    if (apy > 15) return "Aggressive";
    return "Normal";
}
