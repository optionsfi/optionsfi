"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Zap, Shield, Clock, TrendingUp, Users,
    Code, Terminal, BookOpen, ChevronRight, Menu
} from "lucide-react";

/**
 * V2 Documentation Page - Technical Refactor
 * Strict layout, conditional rendering without scroll-spy, neutral tone.
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
        { id: "intro", label: "Introduction", icon: <BookOpen className="w-4 h-4" /> },
        { id: "depositor", label: "For Depositors", icon: <Users className="w-4 h-4" /> },
        { id: "market-maker", label: "For Market Makers", icon: <Terminal className="w-4 h-4" /> },
        { id: "contracts", label: "Contracts", icon: <Code className="w-4 h-4" /> },
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
                        <a href="https://github.com/optionsfi" target="_blank" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white mb-2 font-mono">
                            <Code className="w-3 h-3" /> github.com/optionsfi
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
                                OptionsFi is a Solana protocol for automated covered call strategies using RFQ-based execution.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                <StatPill label="Strategy" value="Covered Calls" />
                                <StatPill label="Settlement" value="USDC" />
                                <StatPill label="Epochs" value="7d / 15m" />
                                <StatPill label="Chain" value="Solana" />
                            </div>

                            <div className="border border-gray-800 rounded-lg p-6 bg-gray-900/30 mb-8 hover:border-gray-700 transition-colors cursor-pointer group" onClick={() => navigate("depositor")}>
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-5 h-5 text-white" />
                                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">Quickstart Guide</h3>
                                </div>
                                <p className="text-sm text-gray-400 max-w-lg">
                                    Learn the deposit flow, epoch lifecycle, and settlement mechanics for yield generation.
                                </p>
                            </div>

                            <p className="text-sm text-gray-500">
                                Looking for market making integration? See <button onClick={() => navigate("market-maker")} className="text-blue-400 hover:underline">Market Marker Docs</button>.
                            </p>
                        </div>
                    )}

                    {/* VIEW: DEPOSITORS */}
                    {view === "depositor" && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-8 border-b border-gray-800 pb-2">
                                <h2 className="text-2xl font-bold text-white tracking-tight">For Depositors</h2>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">How It Works</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <StepCard num="01" title="Deposit" desc="Deposit xStock collateral. Receive share tokens." />
                                    <StepCard num="02" title="Auction" desc="Vault broadcasts RFQ. Market makers bid premium." />
                                    <StepCard num="03" title="Yield" desc="Winning premium is paid instantly to vault." />
                                    <StepCard num="04" title="Settle" desc="Options settle cash. Payout logic executes." />
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Epoch Lifecycle</h3>
                                <div className="space-y-4">
                                    <TimelineRow time="T+0" event="Epoch Start" desc="Strike fixed (10% OTM). RFQ executed. Collateral locked." />
                                    <TimelineRow time="T+7d" event="Expiry" desc="Oracle price check. Difference paid if ITM. Principal returns if OTM." />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Risk Factors</h3>
                                <div className="grid gap-3">
                                    <RiskRow title="Upside Cap" desc="Gains capped at strike price (10% OTM). Protocol sells excess upside." severity="Medium" />
                                    <RiskRow title="Principal Variance" desc="Collateral value fluctuates with market. Premium offers partial buffer only." severity="High" />
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
                                <p className="text-gray-400 mb-6">
                                    Integrate with the off-chain RFQ router to provide liquidity.
                                    Settlement is atomic and non-custodial on Solana.
                                </p>

                                <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm mb-6">
                                    <div className="grid grid-cols-[100px_1fr] gap-y-2">
                                        <span className="text-gray-500">WebSocket</span>
                                        <span className="text-green-400 select-all">wss://rfq.optionsfi.xyz</span>

                                        <span className="text-gray-500">Auth</span>
                                        <span className="text-blue-400">Bearer &lt;API_KEY&gt;</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Message Specs</h3>
                            <div className="space-y-6 mb-10">
                                <SpecBlock title="Client receives: RFQ" code={`
{
  "type": "rfq",
  "rfqId": "uuid-v4",
  "underlying": "NVDAx",
  "expiry": 1735689000,
  "size": 1000.0,
  "strike": 150.00
}`} />
                                <SpecBlock title="Client sends: Quote" code={`
{
  "type": "quote",
  "rfqId": "uuid-v4",
  "price": 2.55, // USDC per token
  "signature": "base58_sig"
}`} />
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
                                            <td className="p-4 text-gray-500 select-all">A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300">RFQ Router</td>
                                            <td className="p-4 text-gray-500 select-all">3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-gray-300">USDC Mint</td>
                                            <td className="p-4 text-gray-500 select-all">4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU</td>
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
        <div className="p-4 border border-gray-800 bg-gray-900/10 rounded">
            <div className="flex justify-between items-start mb-2">
                <span className="text-white font-semibold">{title}</span>
                <span className="text-xs text-gray-600 font-mono">{num}</span>
            </div>
            <p className="text-xs text-gray-400 leading-normal">{desc}</p>
        </div>
    );
}

function TimelineRow({ time, event, desc }: { time: string; event: string; desc: string }) {
    return (
        <div className="flex gap-4 p-3 border-l-2 border-gray-800">
            <div className="w-16 flex-shrink-0 text-xs font-mono text-gray-500 pt-0.5">{time}</div>
            <div>
                <div className="text-sm font-medium text-gray-200 mb-0.5">{event}</div>
                <div className="text-sm text-gray-500">{desc}</div>
            </div>
        </div>
    );
}

function RiskRow({ title, desc, severity }: { title: string; desc: string; severity: string }) {
    return (
        <div className="flex justify-between items-start p-3 border border-gray-800 bg-gray-900/20 rounded">
            <div className="max-w-xl">
                <div className="text-sm font-medium text-gray-200 mb-1">{title}</div>
                <div className="text-xs text-gray-500">{desc}</div>
            </div>
            <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-medium ${severity === "High" ? "bg-red-900/20 text-red-400" : "bg-yellow-900/20 text-yellow-500"
                }`}>
                {severity}
            </span>
        </div>
    );
}

function SpecBlock({ title, code }: { title: string; code: string }) {
    return (
        <div>
            <div className="text-xs text-gray-500 mb-2 font-mono">{title}</div>
            <pre className="bg-[#0d1117] border border-gray-800 p-4 rounded text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
                {code.trim()}
            </pre>
        </div>
    );
}
