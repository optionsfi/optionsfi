"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, TrendingUp, Wallet, Clock, Vault } from "lucide-react";
import { useAllVaults } from "../../hooks/useVault";
import { VAULT_CONFIG, computeTier } from "../../lib/vault-config";

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatAPY(value: number): string {
    return `${value.toFixed(1)}%`;
}

export default function V2EarnDashboard() {
    const { connected } = useWallet();
    const { vaults, loading } = useAllVaults();

    const vaultList = Object.entries(VAULT_CONFIG).map(([id, meta]) => {
        const liveData = vaults[id];
        // Get TVL from on-chain data (in tokens)
        const tvlTokens = liveData?.tvl ?? 0;
        // APY comes from on-chain calculation (default to 0 if not live)
        const apy = liveData?.apy ?? 0;
        // Is vault live on-chain?
        const isLive = !!liveData;
        // Compute tier dynamically from APY
        const tier = computeTier(apy, meta.isDemo);

        return {
            id,
            name: meta.name,
            symbol: meta.symbol,
            strategy: meta.strategy,
            logo: meta.logo,
            tier,
            apy,
            tvlTokens,
            isLive,
            isDemo: meta.isDemo,
        };
    });

    const liveVaultCount = vaultList.filter(v => v.isLive).length;
    const avgAPY = vaultList.length > 0 ? vaultList.reduce((sum, v) => sum + v.apy, 0) / vaultList.length : 0;
    const calculatedTotalTVL = vaultList.reduce((sum, v) => sum + v.tvlTokens, 0);

    return (
        <div className="w-full space-y-4">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-background border border-blue-500/20 p-6">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        Earn premium on xStocks
                    </h1>
                    <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                        Deposit xStocks. Vault sells covered calls. You collect premiums automatically.
                    </p>

                    {/* Stats Row */}
                    <div className="flex gap-8 mb-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Total TVL</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-foreground">{formatCurrency(calculatedTotalTVL)}</p>
                                {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg APY</p>
                            <p className="text-2xl font-bold text-green-400">{formatAPY(avgAPY)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Vaults</p>
                            <p className="text-2xl font-bold text-foreground">{liveVaultCount}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="#vaults"
                            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                        >
                            Explore Vaults
                        </Link>
                        <Link
                            href="/v2/oracle"
                            className="px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium border border-border transition-colors"
                        >
                            View Oracle
                        </Link>
                    </div>
                </div>
                {/* Decorative gradient */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            </section>

            {/* Your Positions (if connected) */}
            {connected && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Your Positions
                    </h2>
                    <div className="rounded-xl border border-border bg-secondary/30 p-6">
                        <div className="text-center text-muted-foreground py-8">
                            <p>No active positions</p>
                            <p className="text-sm mt-1">Deposit into a vault to start earning</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Top Vaults */}
            <section id="vaults" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Vault className="w-5 h-5" />
                        All Vaults
                    </h2>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                        {liveVaultCount} live on Devnet
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vaultList.map((vault) => (
                        <Link
                            key={vault.id}
                            href={`/v2/earn/${vault.id}`}
                            className={`group rounded-xl border p-5 transition-all ${vault.isLive
                                ? "bg-secondary/30 border-border hover:bg-secondary/50 hover:border-blue-500/30"
                                : "bg-secondary/10 border-border/50 opacity-70"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                                        {vault.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{vault.strategy}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {vault.isLive ? (
                                        <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400 border border-gray-500/30">
                                            Soon
                                        </span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded-full ${vault.tier === "Aggressive"
                                        ? "bg-red-500/20 text-red-400"
                                        : vault.tier === "Conservative"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                        {vault.tier}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">APY</p>
                                    <p className="text-lg font-semibold text-green-400">{formatAPY(vault.apy)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">TVL</p>
                                    <p className="text-lg font-semibold text-foreground">{formatCurrency(vault.tvlTokens)}</p>
                                </div>
                            </div>

                            {/* Utilization removed - now using simpler UI */}

                            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Next Roll
                                </span>
                                <span className="text-sm font-medium text-foreground">{vault.isLive ? "Active" : "Pending"}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest Updates */}
            {/* <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Latest Updates</h2>
                <div className="rounded-xl border border-border bg-secondary/30 divide-y divide-border">
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">All V2 vaults (NVDAx, TSLAx, SPYx...) initialized on devnet</span>
                        <span className="ml-auto text-xs text-muted-foreground">Just now</span>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm text-muted-foreground">Oracle initialized with Pyth integration</span>
                        <span className="ml-auto text-xs text-muted-foreground">5m ago</span>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">Oracle status: Healthy</span>
                        <span className="ml-auto text-xs text-muted-foreground">10m ago</span>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
