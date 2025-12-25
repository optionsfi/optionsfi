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
    // Demo vault with security fixes (share_escrow, whitelist, etc.)
    demonvdax3: {
        name: "Demo NVDAx",
        symbol: "NVDAx",
        assetId: "DemoNVDAx3",
        strategy: "Demo Vault",
        logo: "/nvidiax_logo.png",
        accentColor: "#76B900",
        strikeOffset: 0.10,
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
    aaplx: {
        name: "AAPLx Vault",
        symbol: "AAPLx",
        assetId: "AAPLx",
        strategy: "Covered Call",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6849799260ee65bf38841f90_Ticker%3DAAPL%2C%20Company%20Name%3DApple%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#A2AAAD",
        strikeOffset: 0.05,
        premiumRange: [0.4, 0.7],
        isDemo: false,
        decimals: 6,
        pythFeedId: "0x978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675",
    },
    tslax: {
        name: "TSLAx Vault",
        symbol: "TSLAx",
        assetId: "TSLAx",
        strategy: "Covered Call",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aaf9559b2312c162731f5_Ticker%3DTSLA%2C%20Company%20Name%3DTesla%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#CC0000",
        strikeOffset: 0.08,
        premiumRange: [1.2, 2.0],
        isDemo: false,
        decimals: 6,
        pythFeedId: "0x47a156470288850a440df3a6ce85a55917b813a19bb5b31128a33a986566a362",
    },
    spyx: {
        name: "SPYx Vault",
        symbol: "SPYx",
        assetId: "SPYx",
        strategy: "Covered Call",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/685116624ae31d5ceb724895_Ticker%3DSPX%2C%20Company%20Name%3DSP500%2C%20size%3D256x256.svg",
        accentColor: "#1E88E5",
        strikeOffset: 0.05,
        premiumRange: [0.4, 0.7],
        isDemo: false,
        decimals: 6,
        pythFeedId: "0x2817b78438c769357182c04346fddaad1178c82f4048828fe0997c3c64624e14",
    },
    metax: {
        name: "METAx Vault",
        symbol: "METAx",
        assetId: "METAx",
        strategy: "Covered Call",
        logo: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497dee3db1bae97b91ac05_Ticker%3DMETA%2C%20Company%20Name%3DMeta%20Platforms%20Inc.%2C%20size%3D256x256.svg",
        accentColor: "#0668E1",
        strikeOffset: 0.10,
        premiumRange: [0.8, 1.2],
        isDemo: false,
        decimals: 6,
        pythFeedId: "0xbf3e5871be3f80ab7a4d1f1fd039145179fb58569e159aee1ccd472868ea5900",
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
