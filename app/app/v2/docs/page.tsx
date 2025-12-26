"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Zap, Shield, Clock, TrendingUp,
    Code, Terminal, ChevronRight, Menu,
    LayoutGrid, Wallet, Landmark, FileCode,
    Calculator, AlertTriangle, Lock, Key
} from "lucide-react";

/**
 * V2 Documentation Page - Expanded Technical Content
 * Detailed specifications for Depositors and Market Makers without layout changes.
 */
export default function V2DocsPage() {
    // Stage state: 'intro', 'depositor', 'market-maker', 'contracts'
    const [view, setView] = useState("intro");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = (id: string) => {
        setView(id);
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    const navItems = [
        { id: "intro", label: "Introduction", icon: <LayoutGrid className="w-4 h-4" /> },
        { id: "depositor", label: "For Depositors", icon: <Wallet className="w-4 h-4" /> },
        { id: "market-maker", label: "For Market Makers", icon: <Landmark className="w-4 h-4" /> },
        { id: "contracts", label: "Contracts", icon: <FileCode className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F17] text-gray-300 flex flex-col lg:flex-row">

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#0B0F17] sticky top-0 z-50">
                <span className="font-bold text-white">OptionsFi Docs</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-800 bg-[#0B0F17] transform transition-transform duration-200
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="mb-8">
                        <Link href="/v2" className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-6 uppercase tracking-wider">
                            <ArrowLeft className="w-3 h-3" />
                            Back to App
                        </Link>
                        <h1 className="text-lg font-bold text-white tracking-tight">
                            OptionsFi <span className="text-gray-600 font-normal">Docs</span>
                        </h1>
                    </div>

                    <nav className="space-y-0.5 flex-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${view === item.id
                                    ? "bg-gray-800 text-white font-medium shadow-sm"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-800/50">
                        <a href="https://github.com/feeniks01/optionsfi" target="_blank" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white mb-2 font-mono">
                            <Code className="w-3 h-3" /> github.com/feeniks01/optionsfi
                        </a>
                    </div>
                </div>
            </aside>

            {/* Main Content - Left Aligned, No Phantom Gutter */}
            <main className="flex-1 min-w-0 bg-[#0B0F17]">
                <div className="max-w-4xl px-8 py-10 lg:py-12">

                    {/* VIEW: INTRODUCTION */}
                    {view === "intro" && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Introduction</h2>

                            <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                                OptionsFi is a decentralized protocol on Solana enabling automated yield generation through covered call strategies.
                                The protocol utilizes an off-chain Request-for-Quote (RFQ) system for institutional-grade execution while maintaining non-custodial settlement.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                <StatPill label="Strategy" value="Covered Calls" />
                                <StatPill label="Settlement" value="USDC-Cash" />
                                <StatPill label="Epochs" value="Weekly" />
                                <StatPill label="Chain" value="Solana" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/30 hover:border-blue-500/30 transition-colors cursor-pointer group" onClick={() => navigate("depositor")}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Wallet className="w-5 h-5 text-blue-400" />
                                        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">Start Earning</h3>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Understand the vault lifecycle, yield mechanics, and withdrawal process.
                                    </p>
                                </div>

                                <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/30 hover:border-purple-500/30 transition-colors cursor-pointer group" onClick={() => navigate("market-maker")}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Terminal className="w-5 h-5 text-purple-400" />
                                        <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors">Integrate Bot</h3>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        Connect to the RFQ router, quote option premiums, and settle on-chain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: DEPOSITORS */}
                    {view === "depositor" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-8 border-b border-gray-800 pb-2">
                                <h2 className="text-2xl font-bold text-white tracking-tight">For Depositors</h2>
                            </div>

                            {/* Core Flow */}
                            <div className="mb-12">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Vault Lifecycle</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <StepCard num="01" title="Deposit" desc="User deposits xStock. Vault mints share tokens representing pro-rata ownership." />
                                    <StepCard num="02" title="Auction" desc="At epoch start (Friday), Vault broadcasts RFQ. Market makers bid premium for call options." />
                                    <StepCard num="03" title="Locked" desc="Collateral is locked for 7 days. Premium is collected immediately." />
                                    <StepCard num="04" title="Settle" desc="On expiry, options settle. If ITM, diff paid to MM. If OTM, vault keeps 100%." />
                                </div>
                            </div>

                            {/* Yield Mechanics */}
                            <div className="mb-12">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calculator className="w-4 h-4" />
                                    Yield Mechanics
                                </h3>
                                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-6 space-y-6">
                                    <div>
                                        <div className="text-sm font-medium text-gray-200 mb-2">Share Calculation</div>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                            Vault shares (vTokens) are minted based on the current Net Asset Value (NAV) of the vault.
                                            To prevent inflation attacks, a virtual offset is applied to the first deposit.
                                        </p>
                                        <code className="block bg-black/50 p-3 rounded text-xs font-mono text-gray-300">
                                            Shares = Amount * TotalShares / TotalAssets
                                        </code>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-gray-200 mb-2">APY Calculation</div>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                                            Annualized Percentage Yield is extrapolated from the weekly premium earned relative to the spot price.
                                        </p>
                                        <code className="block bg-black/50 p-3 rounded text-xs font-mono text-gray-300">
                                            WeeklyYield = Premium / SpotPrice<br />
                                            APY = (1 + WeeklyYield)^52 - 1
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Withdrawal Process */}
                            <div className="mb-12">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Withdrawal Queue
                                </h3>
                                <div className="space-y-4">
                                    <TimelineRow time="Anytime" event="Request Withdrawal" desc="User signals intent to withdraw. Shares are moved to escrow. Not executed immediately." />
                                    <TimelineRow time="Epoch End" event="Processing" desc="Once the active option expires, the vault unlocks collateral." />
                                    <TimelineRow time="T+1" event="Claim" desc="User claims their underlying assets + earned yield. Shares are burned." />
                                </div>
                                <div className="mt-4 p-3 bg-blue-900/10 border border-blue-900/30 rounded text-xs text-blue-300">
                                    Note: Instant withdrawals are available if the vault has 'Idle Liquidity' (assets not currently used in an option contract).
                                </div>
                            </div>

                            {/* Risks */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Risk Disclosure
                                </h3>
                                <div className="grid gap-3">
                                    <RiskRow title="Upside Cap" desc="Strategy sells upside above Strike (10% OTM). If asset moons >10%, you miss the excess gains." severity="Medium" />
                                    <RiskRow title="Principal Variance" desc="The underlying asset (xStock) can lose value. Yield provides a buffer, but not full protection." severity="High" />
                                    <RiskRow title="Smart Contract" desc="Protocol risks including bugs, upgradeability, and economic exploits." severity="Critical" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: MARKET MAKERS */}
                    {view === "market-maker" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-8 border-b border-gray-800 pb-2">
                                <h2 className="text-2xl font-bold text-white tracking-tight">For Market Makers</h2>
                            </div>

                            <div className="mb-8">
                                <p className="text-gray-400 mb-6 max-w-2xl text-sm leading-relaxed">
                                    Market Makers interact with OptionsFi via a centralized **RFQ Router** (WebSocket) which coordinates competitive auctions for option flow.
                                    Winning quotes are settled atomically on Solana.
                                </p>

                                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm mb-6">
                                    <div className="grid grid-cols-[100px_1fr] gap-y-3">
                                        <span className="text-gray-500">WebSocket</span>
                                        <span className="text-green-400 select-all">wss://rfq.optionsfi.xyz</span>

                                        <span className="text-gray-500">Auth</span>
                                        <span className="text-blue-400">Bearer &lt;API_KEY&gt;</span>

                                        <span className="text-gray-500">Rate Limit</span>
                                        <span className="text-gray-300">100 quotes / min</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Integration Flow</h3>
                            <div className="mb-10 space-y-4">
                                <TimelineRow time="1" event="Connect" desc="Establish WebSocket connection with Bearer auth header." />
                                <TimelineRow time="2" event="Listen" desc="Subscribe to RFQ events. Filter by 'underlying' (e.g., NVDAx)." />
                                <TimelineRow time="3" event="Quote" desc="Calculate premium. Send signed quote message before auction deadline (30s)." />
                                <TimelineRow time="4" event="Settle" desc="If won, Router notifies MM. Keeper executes on-chain settlement." />
                            </div>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Message Specifications</h3>
                            <div className="space-y-8 mb-10">
                                <SpecBlock title="Client receives: RFQ" code={`
{
  "type": "rfq",
  "rfqId": "550e8400-e29b-41d4-a716-446655440000",
  "underlying": "NVDAx",
  "expiry": 1735689000, // Unix Timestamp
  "size": 1000.0,       // Number of contracts
  "strike": 150.00,     // Strike price in USDC
  "premiumFloor": 0.5   // Min premium willing to accept
}`} />
                                <SpecBlock title="Client sends: Quote" code={`
{
  "type": "quote",
  "rfqId": "550e8400-e29b-41d4-a716-446655440000",
  "price": 2.55,        // USDC per token
  "signature": "..."    // (Optional in Devnet) Ed25519 signature
}`} />
                                <SpecBlock title="Client receives: Fill" code={`
{
  "type": "fill",
  "rfqId": "550e8400-e29b-41d4-a716-446655440000",
  "premium": 2.55,
  "txId": "5dJ...z90"   // Solana Transaction Signature
}`} />
                            </div>

                            <div className="mb-8 p-4 border border-yellow-900/30 bg-yellow-900/10 rounded-lg">
                                <h4 className="text-sm font-medium text-yellow-500 mb-2 flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    Signing Logic
                                </h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    Quotes must be cryptographically signed to prevent spoofing.
                                    The message to sign is the concatenation of `rfqId` + `price`.
                                </p>
                                <pre className="bg-black/30 p-3 rounded text-xs text-gray-300 font-mono">
                                    const msg = new TextEncoder().encode(`{'${rfqId}'}:{'${price}'}`);<br />
                                    const sig = nacl.sign.detached(msg, secretKey);
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* VIEW: CONTRACTS */}
                    {view === "contracts" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-8 border-b border-gray-800 pb-2">
                                <h2 className="text-2xl font-bold text-white tracking-tight">Contracts (Devnet)</h2>
                            </div>

                            <div className="border border-gray-800 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm font-mono">
                                    <thead className="bg-gray-900 border-b border-gray-800 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="p-4 font-medium">Identifier</th>
                                            <th className="p-4 font-medium">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50 bg-[#0d1117]">
                                        <tr>
                                            <td className="p-4 text-gray-300">Vault Program</td>
                                            <td className="p-4 text-gray-500 select-all font-mono">A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300">RFQ Router</td>
                                            <td className="p-4 text-gray-500 select-all font-mono">3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300">USDC Mint</td>
                                            <td className="p-4 text-gray-500 select-all font-mono">4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300">Keepers</td>
                                            <td className="p-4 text-gray-500 select-all font-mono">8uC...9j2</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

// ----------------------------------------------------------------------
// UTIL COMPONENTS (Strict Specs)
// ----------------------------------------------------------------------

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-3 bg-gray-900/40 border border-gray-800 rounded text-sm text-center">
            <span className="text-gray-500 mr-2">{label}:</span>
            <span className="text-gray-200 font-medium">{value}</span>
        </div>
    );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
    return (
        <div className="p-4 border border-gray-800 bg-gray-900/10 rounded h-full">
            <div className="flex justify-between items-start mb-2">
                <span className="text-white font-semibold">{title}</span>
                <span className="text-xs text-gray-600 font-mono">{num}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function TimelineRow({ time, event, desc }: { time: string; event: string; desc: string }) {
    return (
        <div className="flex gap-4 p-3 border-l-2 border-gray-800 hover:border-gray-700 transition-colors">
            <div className="w-24 flex-shrink-0 text-xs font-mono text-gray-500 pt-0.5">{time}</div>
            <div>
                <div className="text-sm font-medium text-gray-200 mb-0.5">{event}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{desc}</div>
            </div>
        </div>
    );
}

function RiskRow({ title, desc, severity }: { title: string; desc: string; severity: string }) {
    return (
        <div className="flex justify-between items-start p-3 border border-gray-800 bg-gray-900/20 rounded">
            <div className="max-w-xl pr-4">
                <div className="text-sm font-medium text-gray-200 mb-1">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
            <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-medium ${severity === "High" || severity === "Critical" ? "bg-red-900/20 text-red-400" : "bg-yellow-900/20 text-yellow-500"
                }`}>
                {severity}
            </span>
        </div>
    );
}

function SpecBlock({ title, code }: { title: string; code: string }) {
    return (
        <div>
            <div className="text-xs text-gray-500 mb-2 font-mono flex items-center gap-2">
                <Code className="w-3 h-3" />
                {title}
            </div>
            <pre className="bg-[#0d1117] border border-gray-800 p-4 rounded text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
                {code.trim()}
            </pre>
        </div>
    );
}
