"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, Info, CheckCircle, Clock, AlertCircle, Zap, Loader2, ExternalLink, Wallet, Radio, Play, Square, ArrowRight, Shield, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useVault } from "../../../../hooks/useVault";
import { useVaultTiming } from "../../../../hooks/useVaultTiming";
import { useRfq } from "../../../../hooks/useRfq";
import { getVaultTheme, type VaultTheme } from "../../../../themes/vaultThemes";
import { VAULT_CONFIG, getVaultConfig, getPythFeedId, computeTier } from "../../../../lib/vault-config";

const HERMES_URL = "https://hermes.pyth.network";

function PayoffChart({ spotPrice, strikePrice, premiumRange }: { spotPrice: number; strikePrice: number; premiumRange: [number, number] }) {
    const capGain = ((strikePrice - spotPrice) / spotPrice) * 100;
    const currentBarIndex = 11;

    return (
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Premium Range</span>
                    <span className="text-[9px] text-gray-600 ml-1">Per epoch</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Upside Capped</span>
            </div>
            <div className="relative h-14">
                <div className="absolute inset-0 flex items-end gap-0.5">
                    {Array.from({ length: 24 }).map((_, i) => {
                        const height = i < 12 ? 28 : i < 18 ? 28 + (i - 12) * 9 : 82;
                        const capped = i >= 18;
                        const isCurrent = i === currentBarIndex;
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-t transition-all ${capped ? 'bg-yellow-500/50' : 'bg-green-500/50'} ${isCurrent ? 'ring-2 ring-white/60' : ''}`}
                                style={{ height: `${Math.min(height, 82)}%` }}
                            />
                        );
                    })}
                </div>
                <div className="absolute left-[47%] top-0 bottom-0 w-0.5 bg-white/40" />
                <div className="absolute left-[47%] top-0 -translate-x-1/2 text-[10px] text-white/70 bg-gray-900/90 px-1.5 py-0.5 rounded">now</div>
                <div className="absolute right-2 top-1 text-xs bg-gray-900/90 px-1.5 py-0.5 rounded">
                    <span className="text-yellow-400">cap ${strikePrice.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
}

export default function VaultDetailPage() {
    const params = useParams();
    const ticker = params.ticker as string;
    const vaultMeta = getVaultConfig(ticker);
    const { connected, publicKey } = useWallet();

    // Get vault-specific theme colors
    const theme = getVaultTheme(vaultMeta?.symbol || "NVDAx");

    // Vault hook for on-chain data and transactions
    const {
        vaultData,
        loading: vaultLoading,
        vaultState,
        userShareBalance,
        userUnderlyingBalance,
        pendingWithdrawal,
        deposit,
        requestWithdrawal,
        processWithdrawal,
        txStatus,
        txError,
        txSignature,
        refresh,
    } = useVault(ticker);

    // RFQ hook for quote fetching
    const rfq = useRfq();

    // Computed values from on-chain data
    // Demo vaults are always "live" for testing - show demo panel and enable functionality
    const isLive = !!vaultData || (vaultMeta?.isDemo ?? false);
    const apy = vaultData?.apy ?? 0;
    const tier = vaultMeta ? computeTier(apy, vaultMeta.isDemo) : "Demo";

    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
    const [underlyingPrice, setUnderlyingPrice] = useState<number | null>(null);
    const [priceLoading, setPriceLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchPrice = async () => {
        const feedId = getPythFeedId(ticker);
        if (!feedId) return;
        setPriceLoading(true);
        try {
            const response = await fetch(`${HERMES_URL}/v2/updates/price/latest?ids[]=${feedId}&parsed=true`);
            const data = await response.json();
            if (data.parsed?.[0]) {
                const priceData = data.parsed[0].price;
                setUnderlyingPrice(parseFloat(priceData.price) * Math.pow(10, priceData.expo));
                setLastUpdated(new Date());
            }
        } catch (e) { console.error(e); }
        setPriceLoading(false);
    };

    useEffect(() => {
        fetchPrice();
        const interval = setInterval(fetchPrice, 15000);
        return () => clearInterval(interval);
    }, [ticker]);

    // Format helpers
    const decimals = vaultMeta?.decimals || 6;
    const formatTokenAmount = (amount: number) => (amount / Math.pow(10, decimals)).toFixed(2);
    // Calculate strike price: ~10% OTM, rounded to $2.50 increments
    const getRealisticStrike = (spot: number): number => {
        if (!vaultMeta) return spot; // Safety fallback
        // Calculate OTM target based on vault config (e.g., 0.10 for 10%, 0.01 for 1%)
        const otmTarget = spot * (1 + vaultMeta.strikeOffset);
        // Round to nearest $2.50 increment
        const increment = 2.5;
        return Math.round(otmTarget / increment) * increment;
    };
    const strikePrice = underlyingPrice ? getRealisticStrike(underlyingPrice) : null;
    const formatPrice = (p: number | null) => p ? `$${p.toFixed(2)} ` : "—";
    const depositNum = parseFloat(depositAmount) || 0;
    const withdrawNum = parseFloat(withdrawAmount) || 0;
    const estPremiumUsd = underlyingPrice && depositNum && vaultMeta ? (depositNum * underlyingPrice * vaultMeta.premiumRange[0] / 100) : null;

    // Handle deposit
    const handleDeposit = async () => {
        if (!depositNum || depositNum <= 0) return;
        try {
            const amountInBaseUnits = Math.floor(depositNum * Math.pow(10, decimals));
            await deposit(amountInBaseUnits);
            setDepositAmount("");
        } catch (err) {
            console.error("Deposit failed:", err);
        }
    };

    // Handle withdrawal request
    const handleRequestWithdrawal = async () => {
        if (!withdrawNum || withdrawNum <= 0) return;
        try {
            const sharesInBaseUnits = Math.floor(withdrawNum * Math.pow(10, decimals));
            await requestWithdrawal(sharesInBaseUnits);
            setWithdrawAmount("");
        } catch (err) {
            console.error("Withdrawal request failed:", err);
        }
    };

    // Handle process withdrawal
    const handleProcessWithdrawal = async () => {
        try {
            await processWithdrawal();
        } catch (err) {
            console.error("Process withdrawal failed:", err);
        }
    };

    // Set max amount
    // Set max amount
    const handleHalfDeposit = () => {
        setDepositAmount(formatTokenAmount(userUnderlyingBalance / 2));
    };

    const handleMaxDeposit = () => {
        setDepositAmount(formatTokenAmount(userUnderlyingBalance));
    };

    const handleMaxWithdraw = () => {
        setWithdrawAmount(formatTokenAmount(userShareBalance));
    };

    // Transaction status display
    const getTxButtonText = (defaultText: string) => {
        switch (txStatus) {
            case "building": return "Building...";
            case "signing": return "Sign in wallet...";
            case "confirming": return "Confirming...";
            default: return defaultText;
        }
    };

    const isProcessing = txStatus === "building" || txStatus === "signing" || txStatus === "confirming";

    if (!vaultMeta) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-3xl font-bold text-foreground mb-4">Vault not found</h1>
                <Link href="/v2" className="text-blue-400 text-lg">← Back to Earn</Link>
            </div>
        );
    }

    // Use on-chain data if available, fallback to metadata
    const tvlTokens = vaultData?.tvl || 0;
    const tvlUsd = tvlTokens * (underlyingPrice || 0); // TVL in USD
    const epoch = vaultData?.epoch || 0;
    const exposureTokens = vaultData ? (Number(vaultData.epochNotionalExposed) / 1e6) : 0;
    const utilization = tvlTokens > 0 ? (exposureTokens / tvlTokens) * 100 : 0;
    const utilizationCap = vaultData?.utilizationCapBps ? vaultData.utilizationCapBps / 100 : 80;

    // Use centralized timing hook
    const timing = useVaultTiming(vaultData, ticker);
    const { nextRollIn: timeString, epochProgress } = timing;
    const timeUntilEpochEnd = Math.max(0, Math.floor((timing.nextRollTime - Date.now()) / 1000));


    // For demo vaults or short intervals, show minutes:seconds


    // Themed background gradient
    const backgroundStyle = {
        background: `linear - gradient(135deg, #0B0F17 0 %, ${theme.accentSoft} 50 %, #0B0F17 100 %)`,
        backgroundSize: '200% 200%',
    };

    return (
        <div className="space-y-4 min-h-screen -m-4 p-4" style={{ ...backgroundStyle, width: 'calc(100% + 2rem)' }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/v2" className="hover:text-gray-400">Earn</Link>
                <span>/</span>
                <span className="text-gray-500">{vaultMeta.name}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{vaultMeta.symbol} Vault</h1>
                    {isLive && (
                        <span
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
                            style={{
                                backgroundColor: theme.accentSoft,
                                color: theme.accent,
                                borderColor: theme.accentBorder
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />Live
                        </span>
                    )}
                    {vaultLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                </div>
            </div>

            {/* Top Stat Pills - Configuration Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* RFQ Chip */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${rfq.routerOnline ? 'bg-gray-900/60 border-gray-800/60 text-gray-300' : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                    {rfq.routerLoading ? <Loader2 className="w-3 h-3 animate-spin" /> :
                        rfq.routerOnline ? <Radio className="w-3 h-3 text-green-500" /> : <AlertCircle className="w-3 h-3" />}
                    {rfq.routerOnline ? "RFQ Online" : "RFQ Offline"}
                </div>

                {/* Strike Chip */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-800/60 text-xs text-gray-300">
                    <span>Strike</span>
                    <span className="text-white font-semibold">{vaultMeta.strikeOffset * 100}% OTM</span>
                </div>

                {/* Utilization Cap Chip */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-800/60 text-xs text-gray-300">
                    <span>Utilization Cap</span>
                    <span className="text-white font-semibold">{utilizationCap}%</span>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4">


                    {/* 2. Primary Grid (3 Cols) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Card 1: USDC Premium Earned (Hero) */}
                        {(() => {
                            const totalShares = vaultData ? Number(vaultData.totalShares) : 0;
                            const vaultPremium = vaultData ? Number(vaultData.premiumBalanceUsdc) : 0;
                            const userRatio = totalShares > 0 ? (Number(userShareBalance) / totalShares) : 0;
                            const yourShare = (vaultPremium / 1e6) * userRatio;

                            return (
                                <div className="rounded-xl bg-gray-800/40 border border-gray-700/40 p-5 flex flex-col justify-between min-h-[140px]">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1 flex items-center gap-1.5">
                                            USDC Premium Earned
                                            <span className="relative group cursor-help">
                                                <Info className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">Your share of premium earned from RFQ-filled options</span>
                                            </span>
                                        </p>
                                        <p className="text-4xl font-bold text-emerald-400 mt-2">
                                            ${yourShare.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-emerald-500/80 mt-1">Claimable at epoch settlement</p>
                                    </div>
                                    <div className="border-t border-gray-700/50 pt-2 mt-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500">Your share of total premiums</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Card 2: Epoch Status */}
                        <div className="rounded-xl bg-gray-800/40 border border-gray-700/40 p-5 flex flex-col justify-between min-h-[140px]">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1.5">
                                    Epoch Status
                                    <span className="relative group cursor-help">
                                        <Info className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">RFQ → Exposure → Settlement</span>
                                    </span>
                                </p>
                                <div className="space-y-3 mt-3">
                                    {/* Status Row 1: RFQ */}
                                    <div className="flex items-center gap-2">
                                        {exposureTokens > 0 ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-gray-600 border-dashed animate-spin-slow" />
                                        )}
                                        <span className={`text-sm font-medium ${exposureTokens > 0 ? "text-green-300" : "text-gray-400"}`}>
                                            {exposureTokens > 0 ? "RFQ Filled" : "Awaiting RFQ"}
                                        </span>
                                    </div>

                                    {/* Status Row 2: Exposure */}
                                    <div className="flex items-center gap-2">
                                        {vaultState === "ACTIVE" ? (
                                            <Zap className="w-4 h-4 text-blue-400" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-gray-600" />
                                        )}
                                        <span className={`text-sm font-medium ${vaultState === "ACTIVE" ? "text-blue-200" : "text-gray-500"}`}>
                                            Option Strategy Active
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-700/50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Epoch Ends In</span>
                                            <span className="text-xs font-mono text-gray-300">~{timeString}</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1 mt-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-gray-600 h-full rounded-full"
                                                style={{ width: `${Math.min(Math.max(epochProgress, 0), 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Utilization */}
                        <div className="rounded-xl bg-gray-800/40 border border-gray-700/40 p-5 flex flex-col justify-between min-h-[140px]">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 flex items-center gap-1.5">
                                    Option Exposure Sold
                                    <span className="relative group cursor-help">
                                        <Info className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">Total notional exposure sold via RFQ</span>
                                    </span>
                                </p>
                                <p className="text-2xl font-semibold text-white mt-1">
                                    {exposureTokens.toFixed(2)} <span className="text-lg text-gray-500 font-normal">{vaultMeta.symbol}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">Notional covered this epoch</p>
                            </div>

                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                                    <span>Exposure vs Cap</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-800 overflow-hidden relative">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            backgroundColor: theme.accent,
                                            width: `${Math.min(utilization, 100)}%`
                                        }}
                                    />
                                    {/* Cap Marker */}
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-gray-500/50"
                                        style={{ left: `${utilizationCap}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Secondary Row: TVL + Chart */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* TVL Card */}
                        <div className="rounded-xl bg-gray-800/40 border border-gray-700/40 p-4 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm text-gray-400">TVL</p>
                                <p className="text-xs text-gray-500"></p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-lg font-bold text-white">${tvlUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    <p className="text-sm text-blue-400">{tvlTokens.toFixed(2)} {vaultMeta.symbol}</p>
                                </div>
                                <div className="text-[11px] text-gray-500 space-y-0.5">
                                    <p>Vault collateral</p>
                                    <p>{exposureTokens.toFixed(2)} {vaultMeta.symbol} exposure utilized ({utilization.toFixed(0)}%)</p>
                                </div>
                            </div>
                        </div>

                        {/* Payoff Chart Wrapper - Lower contrast */}
                        <div className="brightness-75 saturate-50 hover:brightness-100 hover:saturate-100 transition-all duration-500">
                            {underlyingPrice && strikePrice ? (
                                <PayoffChart spotPrice={underlyingPrice} strikePrice={strikePrice} premiumRange={vaultMeta.premiumRange} />
                            ) : (
                                <div className="h-full rounded-xl bg-gray-800/20 border border-gray-800/40 animate-pulse" />
                            )}
                        </div>
                    </div>

                    {/* Vault State Banner */}
                    {isLive && (
                        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${vaultState === "ACTIVE"
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-blue-500/10 border border-blue-500/20"
                            }`}>
                            {vaultState === "ACTIVE" ? (
                                <>
                                    <Play className="w-4 h-4 text-green-400" />
                                    <span className="text-green-300">
                                        <strong>Option exposure active</strong> — settlement finalizes at epoch end
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-300">
                                        <strong>Auto-rolling</strong> — Epoch #{epoch} · Keeper will roll at next schedule
                                    </span>
                                </>
                            )}
                        </div>
                    )}


                    {/* Transaction Status Toast */}
                    {txSignature && txStatus === "success" && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-300">Transaction confirmed!</span>
                            <a
                                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-green-400 hover:text-green-300 flex items-center gap-1"
                            >
                                View < ExternalLink className="w-3 h-3" />
                            </a >
                        </div >
                    )}

                    {
                        txError && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-300">{txError}</span>
                            </div>
                        )
                    }
                </div >

                {/* Deposit Panel */}
                < div className="lg:col-span-1" >
                    <div className="rounded-xl bg-gray-800/40 border border-gray-700/40 p-4 sticky top-4">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400"></span>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 mb-4 p-1 bg-gray-900/60 rounded-lg">
                            <button
                                onClick={() => setActiveTab("deposit")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "deposit" ? "text-white" : "text-gray-400 hover:text-white"}`}
                                style={activeTab === "deposit" ? { backgroundColor: theme.accent } : {}}
                            >Deposit</button>
                            <button
                                onClick={() => setActiveTab("withdraw")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "withdraw" ? "text-white" : "text-gray-400 hover:text-white"}`}
                                style={activeTab === "withdraw" ? { backgroundColor: theme.accent } : {}}
                            >Withdraw</button>
                        </div>

                        {activeTab === "deposit" ? (
                            <div className="space-y-4">
                                {/* User balance */}
                                {/* User balance moved inside input */}

                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                    <div className="flex">
                                        {/* Left: Token Pill */}
                                        <div className="flex items-center pr-4 border-r border-gray-800/60">
                                            <div className="flex items-center gap-2 bg-gray-800 rounded-full pl-1.5 pr-3 py-1.5">
                                                <img
                                                    src={vaultMeta.logo}
                                                    alt={vaultMeta.symbol}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                                <span className="font-semibold text-white text-sm">{vaultMeta.symbol}</span>
                                            </div>
                                        </div>

                                        {/* Right: Balance/Buttons + Amount + USD */}
                                        <div className="flex-1 pl-4 flex flex-col">
                                            {/* Top row: Balance + HALF/MAX */}
                                            <div className="flex items-center justify-end gap-2 mb-2">
                                                {connected && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 cursor-pointer hover:text-gray-400" onClick={() => setDepositAmount(formatTokenAmount(userUnderlyingBalance))}>
                                                        <Wallet className="w-3 h-3" />
                                                        <span>{formatTokenAmount(userUnderlyingBalance)} {vaultMeta.symbol}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); refresh(); }} className="hover:text-white transition-colors ml-0.5">
                                                            <RefreshCw className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setDepositAmount(formatTokenAmount(userUnderlyingBalance / 2))}
                                                    disabled={isProcessing || !connected}
                                                    className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    style={{ color: theme.accent }}
                                                >
                                                    HALF
                                                </button>
                                                <button
                                                    onClick={handleMaxDeposit}
                                                    disabled={isProcessing || !connected}
                                                    className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    style={{ color: theme.accent }}
                                                >
                                                    MAX
                                                </button>
                                            </div>

                                            {/* Big amount input */}
                                            <input
                                                type="number"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                                placeholder="0.00"
                                                disabled={isProcessing}
                                                className="w-full text-right text-3xl font-semibold bg-transparent border-none outline-none p-0 placeholder-gray-600 text-white appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            />

                                            {/* USD value */}
                                            <span className="text-[11px] text-gray-500 text-right mt-0.5">
                                                ≈ ${underlyingPrice ? (Number(depositAmount || 0) * underlyingPrice).toFixed(2) : "0.00"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Outcome Table */}
                                <div className="rounded-lg bg-gray-900/40 border border-gray-800/60 divide-y divide-gray-800/60">
                                    <div className="flex justify-between px-4 py-3">
                                        <span className="text-sm text-gray-400">You deposit</span>
                                        <span className="text-white font-semibold">{depositNum.toFixed(2)} {vaultMeta.symbol}</span>
                                    </div>
                                    <div className="flex justify-between px-4 py-3">
                                        <span className="text-sm text-gray-400">You receive</span>
                                        <span className="text-white font-semibold">{depositNum.toFixed(2)} v{vaultMeta.symbol}</span>
                                    </div>
                                    <div className="flex justify-between px-4 py-3">
                                        <span className="text-sm text-gray-400">Withdraw</span>
                                        <span className="text-gray-300">Epoch end (~{timeString})</span>
                                    </div>
                                    {estPremiumUsd && estPremiumUsd > 0 && (
                                        <div className="flex justify-between px-4 py-3">
                                            <span className="text-sm text-gray-400">Est. Weekly Premium</span>
                                            <span className="text-green-400 font-semibold">~${estPremiumUsd.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Summary line */}
                                {strikePrice && (
                                    <p className="text-sm text-gray-400 text-center">
                                        Withdrawals unlock at epoch end. Upside capped above {formatPrice(strikePrice)}.
                                    </p>
                                )}

                                {connected ? (
                                    <button
                                        onClick={handleDeposit}
                                        disabled={isProcessing || depositNum <= 0}
                                        className="w-full py-3 h-12 rounded-lg hover:brightness-110 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
                                        style={{ backgroundColor: isProcessing || depositNum <= 0 ? undefined : theme.accent }}
                                    >
                                        {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {getTxButtonText("Deposit")}
                                    </button>
                                ) : (
                                    <button className="w-full py-3 h-12 rounded-lg bg-gray-700 text-gray-400 font-medium cursor-not-allowed">
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* User share balance */}
                                <div className="p-4 rounded-lg bg-gray-900/40 border border-gray-800/60 text-center">
                                    <p className="text-sm text-gray-400">Your shares</p>
                                    <p className="text-3xl font-bold text-white mt-1">{formatTokenAmount(userShareBalance)}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">v{vaultMeta.symbol}</p>
                                </div>

                                {/* Pending withdrawal */}
                                {pendingWithdrawal && !pendingWithdrawal.processed && (
                                    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400/90">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4" />
                                            Pending withdrawal: {formatTokenAmount(pendingWithdrawal.shares)} shares
                                        </div>
                                        <p className="text-xs text-yellow-500/70">Requested in epoch #{pendingWithdrawal.requestEpoch}</p>
                                        {vaultData && vaultData.epoch > pendingWithdrawal.requestEpoch && (
                                            <button
                                                onClick={handleProcessWithdrawal}
                                                disabled={isProcessing}
                                                className="mt-2 w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-sm flex items-center justify-center gap-2"
                                            >
                                                {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Claim Withdrawal
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Request new withdrawal */}
                                {(!pendingWithdrawal || pendingWithdrawal.processed) && userShareBalance > 0 && (
                                    <>
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Shares to withdraw</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={withdrawAmount}
                                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    disabled={isProcessing}
                                                    className="w-full px-4 py-3 h-12 rounded-lg bg-gray-900/60 border border-gray-700/60 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-blue-500/60 disabled:opacity-50 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">v{vaultMeta.symbol}</span>
                                                    <button
                                                        onClick={handleMaxWithdraw}
                                                        disabled={isProcessing}
                                                        className="text-xs font-medium hover:brightness-125 disabled:opacity-50"
                                                        style={{ color: theme.accent }}
                                                    >
                                                        MAX
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400/90 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Processed at epoch end
                                        </div>

                                        <button
                                            onClick={handleRequestWithdrawal}
                                            disabled={isProcessing || withdrawNum <= 0}
                                            className="w-full py-3 h-12 rounded-lg hover:brightness-110 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2"
                                            style={{ backgroundColor: isProcessing || withdrawNum <= 0 ? undefined : theme.accent }}
                                        >
                                            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {getTxButtonText("Request Withdrawal")}
                                        </button>
                                    </>
                                )}

                                {userShareBalance === 0 && (!pendingWithdrawal || pendingWithdrawal.processed) && (
                                    <>
                                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400/90 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Processed at epoch end
                                        </div>
                                        <button className="w-full py-3 h-12 rounded-lg bg-gray-700 text-gray-400 font-medium cursor-not-allowed">
                                            No shares
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}
