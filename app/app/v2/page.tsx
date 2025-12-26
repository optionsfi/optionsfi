"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, TrendingUp, Wallet, Clock, Vault } from "lucide-react";
import { useAllVaults } from "../../hooks/useVault";
import { VAULT_CONFIG, computeTier, getPythFeedId } from "../../lib/vault-config";
import { useState, useEffect } from "react";

const HERMES_URL = "https://hermes.pyth.network";

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

// Calculate next keeper roll time (runs every 6 hours: 0:00, 6:00, 12:00, 18:00 UTC)
function getNextRollTime(): { hours: number; minutes: number; timeString: string } {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    // Find next 6-hour mark
    const nextRollHour = Math.ceil((utcHours + 1) / 6) * 6;
    const hoursUntil = nextRollHour - utcHours - 1;
    const minutesUntil = 60 - utcMinutes;

    const totalMinutes = hoursUntil * 60 + minutesUntil;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return {
        hours: h,
        minutes: m,
        timeString: h > 0 ? `${h}h ${m}m` : `${m}m`
    };
}

export default function V2EarnDashboard() {
    const { connected } = useWallet();
    const { vaults, userBalances, loading } = useAllVaults();
    const [nvdaPrice, setNvdaPrice] = useState<number>(0);
    const [nextRoll, setNextRoll] = useState(getNextRollTime());

    // Fetch NVDA price for TVL calculation
    useEffect(() => {
        const fetchPrice = async () => {
            const feedId = getPythFeedId("nvdax");
            if (!feedId) return;
            try {
                const response = await fetch(`${HERMES_URL}/v2/updates/price/latest?ids[]=${feedId}&parsed=true`);
                const data = await response.json();
                if (data.parsed?.[0]) {
                    const priceData = data.parsed[0].price;
                    setNvdaPrice(parseFloat(priceData.price) * Math.pow(10, priceData.expo));
                }
            } catch (e) { console.error(e); }
        };
        fetchPrice();
        const interval = setInterval(fetchPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    // Update next roll countdown
    useEffect(() => {
        const interval = setInterval(() => setNextRoll(getNextRollTime()), 1000);
        return () => clearInterval(interval);
    }, []);

    const vaultList = Object.entries(VAULT_CONFIG).map(([id, meta]) => {
        const liveData = vaults[id];
        const userShares = userBalances[id] ?? 0;

        // Get TVL from on-chain data (in tokens)
        const tvlTokens = liveData?.tvl ?? 0;
        const sharePrice = liveData?.sharePrice ?? 1.0;

        // Convert to USD
        const tvlUsd = tvlTokens * nvdaPrice;

        // User balance in USD: shares * sharePrice (tokens per share) * price
        const userValueUsd = (userShares / 1e6) * sharePrice * nvdaPrice;

        // APY comes from on-chain calculation (default to 0 if not live)
        const apy = liveData?.apy ?? 0;
        // Is vault live on-chain? Demo vaults are always "live" for testing
        const isLive = !!liveData || meta.isDemo;
        // Compute tier dynamically from APY
        const tier = computeTier(apy, meta.isDemo);

        // Calculate per-vault roll time
        let rollTime = nextRoll.timeString;
        if (meta.isDemo) {
            const now = Math.floor(Date.now() / 1000);
            const remaining = Math.max(0, 180 - (now % 180));
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            rollTime = `${m}m ${s}s`;
        }

        return {
            id,
            name: meta.name,
            symbol: meta.symbol,
            strategy: meta.strategy,
            logo: meta.logo,
            tier,
            apy,
            tvlTokens,
            tvlUsd,
            userShares,
            userValueUsd,
            isLive,
            isDemo: meta.isDemo,
            rollTime,
        };
    });

    const liveVaultCount = vaultList.filter(v => v.isLive).length;
    const avgAPY = vaultList.length > 0 ? vaultList.reduce((sum, v) => sum + v.apy, 0) / vaultList.length : 0;
    const calculatedTotalTVL = vaultList.reduce((sum, v) => sum + v.tvlUsd, 0);

    // Aggregate USDC premium balance across all vaults
    const totalPremiumUsdc = Object.values(vaults).reduce((sum, v) => {
        return sum + (v ? Number(v.premiumBalanceUsdc || 0) / 1e6 : 0);
    }, 0);

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
                        <div>
                            <p className="text-sm text-muted-foreground">Next Roll</p>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <p className="text-2xl font-bold text-yellow-400">{nextRoll.timeString}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">USDC Earned</p>
                            <div className="flex items-center gap-1">
                                <span className="text-emerald-400">$</span>
                                <p className="text-2xl font-bold text-emerald-400">{totalPremiumUsdc.toFixed(2)}</p>
                            </div>
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

            {/* Your Positions */}
            {connected && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        Your Positions
                    </h2>
                    <div className="rounded-xl border border-border bg-secondary/30 p-6">
                        {/* Show positions from vaults where user has shares */}
                        {(() => {
                            const userVaults = vaultList.filter(v => v.userShares > 0);

                            if (userVaults.length === 0) {
                                return (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>No active positions</p>
                                        <p className="text-sm mt-1">Deposit into a vault to start earning</p>
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-3">
                                    {userVaults.map(vault => (
                                        <Link
                                            key={vault.id}
                                            href={`/v2/earn/${vault.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-background/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={vault.logo} alt={vault.symbol} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-foreground">{vault.name}</p>
                                                    <p className="text-xs text-muted-foreground">{vault.strategy}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-foreground">{formatCurrency(vault.userValueUsd)}</p>
                                                <p className="text-xs text-green-400">{formatAPY(vault.apy)} APY</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            );
                        })()}
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
                                    <p className="text-lg font-semibold text-foreground">{formatCurrency(vault.tvlUsd)}</p>
                                </div>
                            </div>

                            {/* Utilization removed - now using simpler UI */}

                            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Next Roll
                                </span>
                                <span className="text-sm font-medium text-foreground">{vault.isLive ? vault.rollTime : "Pending"}</span>
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
