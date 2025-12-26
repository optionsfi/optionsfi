"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, TrendingUp, Wallet, Clock, Vault, Briefcase } from "lucide-react";
import { useAllVaults } from "../../hooks/useVault";
import { VAULT_CONFIG, computeTier, getPythFeedId } from "../../lib/vault-config";
import { useState, useEffect } from "react";
import { calculateVaultTiming } from "../../lib/vault-timing";

const HERMES_URL = "https://hermes.pyth.network";

type SortOption = "tvl" | "apy" | "roll";

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
    const [sortBy, setSortBy] = useState<SortOption>("tvl");

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

        // Standardized timing logic
        const timing = calculateVaultTiming(liveData, id);
        const rollTime = timing.nextRollIn;

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

    // Find the soonest actual vault roll to show in the hero section
    const soonestRoll = Object.entries(VAULT_CONFIG).reduce((best, [id, _]) => {
        const timing = calculateVaultTiming(vaults[id], id);
        if (timing.nextRollTime === 0) return best;
        if (best === null || timing.nextRollTime < best.nextRollTime) return timing;
        return best;
    }, null as any);

    const displayRollTime = soonestRoll ? soonestRoll.nextRollIn : nextRoll.timeString;

    return (
        <div className="w-full space-y-4">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-background border border-blue-500/20 p-6">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                        Earn weekly option premium on xStocks
                    </h1>
                    <p className="text-muted-foreground text-lg mb-6 max-w-xl">
                        Deposit xStocks. Vault writes covered calls. Premiums settle automatically.
                    </p>

                    {/* Stats Row - Reordered: TVL, Earned, APY, Roll, Vaults */}
                    <div className="flex gap-8 mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total TVL</p>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-foreground">{formatCurrency(calculatedTotalTVL)}</p>
                                {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Premium Earned (USDC)</p>
                            <div className="flex items-center gap-1">
                                <p className="text-2xl font-bold text-emerald-400">${totalPremiumUsdc.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="group relative">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">Avg APY <span className="text-[9px] text-gray-500 cursor-help">ⓘ</span></p>
                            <p className="text-2xl font-medium text-green-400">{formatAPY(avgAPY)}</p>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                Annualized from recent vault performance. Variable.
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Next Option Roll</p>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-yellow-400" />
                                <p className="text-2xl font-bold text-yellow-400">{displayRollTime}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Vaults</p>
                            <p className="text-2xl font-bold text-foreground">{liveVaultCount}</p>
                        </div>
                    </div>

                    {/* Trust anchor */}
                    <p className="text-xs text-gray-500 mb-5">Fully collateralized. Cash-settled. No liquidations.</p>

                    <div className="flex gap-3">
                        <Link
                            href="#vaults"
                            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                        >
                            Explore Vaults
                        </Link>
                        <Link
                            href="/v2/oracle"
                            className="px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium border border-border transition-colors group relative"
                        >
                            Pricing Oracle
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                Underlying price & settlement source
                            </span>
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
                        <Briefcase className="w-5 h-5" />
                        Your Positions
                    </h2>
                    {/* Show positions from vaults where user has shares */}
                    {(() => {
                        const userVaults = vaultList.filter(v => v.userShares > 0);

                        if (userVaults.length === 0) {
                            return (
                                <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center text-muted-foreground">
                                    <p>No active positions</p>
                                    <p className="text-sm mt-1">Deposit into a vault to start earning</p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userVaults.map(vault => (
                                    <Link
                                        key={vault.id}
                                        href={`/v2/earn/${vault.id}`}
                                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-blue-500/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={vault.logo} alt={vault.symbol} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-medium text-foreground">{vault.name}</p>
                                                <p className="text-xs text-muted-foreground">{vault.strategy}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-foreground">{formatCurrency(vault.userValueUsd)}</p>
                                            <div className="flex items-center justify-end gap-1.5">
                                                {vault.isDemo && <span className="text-[9px] px-1 py-0.5 bg-gray-700/50 text-gray-400 rounded">Simulated</span>}
                                                <p className="text-xs text-green-400">{formatAPY(vault.apy)} APY</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        );
                    })()}
                </section>
            )}

            {/* Top Vaults */}
            <section id="vaults" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Vault className="w-5 h-5" />
                        All Vaults
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>Sort:</span>
                            {(["tvl", "apy", "roll"] as SortOption[]).map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSortBy(opt)}
                                    className={`px-2 py-0.5 rounded ${sortBy === opt ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    {opt === "tvl" ? "TVL" : opt === "apy" ? "APY" : "Roll"}
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            {liveVaultCount} live on Devnet
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vaultList
                        .sort((a, b) => {
                            if (sortBy === "tvl") return b.tvlUsd - a.tvlUsd;
                            if (sortBy === "apy") return b.apy - a.apy;
                            return 0; // Roll sort not implemented yet
                        })
                        .map(vault => (
                            <Link
                                key={vault.id}
                                href={`/v2/earn/${vault.id}`}
                                className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30 p-5 hover:border-blue-500/30 hover:bg-secondary/50 transition-all flex flex-col justify-between min-h-[180px]"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={vault.logo} alt={vault.symbol} className="w-10 h-10 rounded-full border border-border" />
                                                {vault.isLive && (
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-secondary flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground text-lg leading-tight">{vault.name}</h3>
                                                <p className="text-xs text-muted-foreground">{vault.strategy}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${vault.isDemo ? "bg-gray-800 text-gray-400" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                }`}>
                                                {vault.tier}
                                            </span>
                                            {vault.isDemo && <span className="text-[9px] text-gray-500">Devnet Only</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">APY</p>
                                            <p className="text-xl font-bold text-green-400">{formatAPY(vault.apy)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">TVL</p>
                                            <p className="text-xl font-bold text-foreground">{formatCurrency(vault.tvlUsd)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5 text-yellow-400/80" />
                                        <span>Next Option Roll</span>
                                        <span className="text-foreground font-medium ml-1">{vault.rollTime}</span>
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        ))}
                </div>
            </section>
        </div>
    );
}
