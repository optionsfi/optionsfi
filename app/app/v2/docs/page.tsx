"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft, Zap, Shield, Clock, TrendingUp, Users, Building,
    Code, Terminal, Activity, Wallet, BookOpen, ChevronRight, Menu
} from "lucide-react";

/**
 * V2 Documentation Page - Mintlify Style
 * Sidebar Navigation + Main Content Area with Card Grids
 */
export default function V2DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // simple scroll spy could be added here, but for now we rely on clicks

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // offset for header
            window.scrollBy(0, -80);
        }
        setMobileMenuOpen(false);
    };

    const navItems = [
        { id: "introduction", label: "Introduction", icon: <BookOpen className="w-4 h-4" /> },
        { id: "depositors", label: "For Depositors", icon: <Users className="w-4 h-4" /> },
        { id: "market-makers", label: "For Market Makers", icon: <Terminal className="w-4 h-4" /> },
        { id: "contracts", label: "Contracts", icon: <Code className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F17] text-white">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-[#0B0F17]/90 backdrop-blur z-50">
                <span className="font-bold">OptionsFi Docs</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto flex">

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-800 bg-[#0B0F17] transform transition-transform duration-300
                    lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:block
                    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="mb-8">
                            <Link href="/v2" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to App
                            </Link>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">OptionsFi</span>
                                <span className="text-gray-500 font-normal">Docs</span>
                            </h1>
                        </div>

                        <nav className="space-y-1 flex-1">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                                            ? "bg-blue-500/10 text-blue-400"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-auto pt-6 border-t border-gray-800">
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-3">Links</div>
                            <a href="https://github.com/optionsfi" target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2">
                                <Code className="w-4 h-4" /> GitHub
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-6 py-10 lg:px-12 max-w-5xl">

                    {/* SECTION: INTRODUCTION */}
                    <div id="introduction" className="mb-20 scroll-mt-24">
                        <h1 className="text-4xl font-bold mb-4">Introduction</h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            OptionsFi is a decentralized protocol for automated covered call strategies on Solana.
                            We connect passive depositors with professional market makers via a high-frequency RFQ system.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mb-12">
                            <Card
                                title="Quickstart Guide"
                                icon={<Zap className="w-6 h-6 text-green-400" />}
                                onClick={() => scrollTo("depositors")}
                                desc="Learn how to deposit assets and start earning yield in minutes."
                            />
                            <Card
                                title="Market Making"
                                icon={<Terminal className="w-6 h-6 text-blue-400" />}
                                onClick={() => scrollTo("market-makers")}
                                desc="Integrate your trading bot with our WebSocket RFQ router."
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox label="Strategy" value="Covered Calls" />
                            <StatBox label="Settlement" value="Cash (USDC)" />
                            <StatBox label="Epochs" value="7d / 15m" />
                            <StatBox label="Chain" value="Solana" />
                        </div>
                    </div>

                    {/* SECTION: DEPOSITORS */}
                    <div id="depositors" className="mb-20 scroll-mt-24 pt-8 border-t border-gray-800/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Users className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-bold">For Depositors</h2>
                        </div>

                        <p className="text-gray-400 mb-8 max-w-3xl">
                            Depositing into OptionsFi V2 is a streamlined process. You provide the collateral,
                            and the vault manages the option writing, RFQ auctions, and settlement automatically.
                        </p>

                        <h3 className="text-xl font-semibold text-white mb-4">How it Works</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                            <StepCard num="01" title="Deposit" desc="Add xStock tokens (e.g. NVDAx) to the vault. You get share tokens back." />
                            <StepCard num="02" title="Auction" desc="At epoch start, vault requests quotes. MMs bid premiums." />
                            <StepCard num="03" title="Yield" desc="Best bid wins. Premium is paid instantly to the vault." />
                            <StepCard num="04" title="Settle" desc="At epoch end, profits/losses settle. You can withdraw." />
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-4">Risk Profile</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <RiskBox title="Upside Capping" severity="Medium" text="If price rallies >10%, you miss the extra gains. The vault sells the upside." />
                            <RiskBox title="Principal Risk" severity="High" text="If underlying asset crashes, your collateral value drops. Premium provides only a small buffer." />
                        </div>
                    </div>

                    {/* SECTION: MARKET MAKERS */}
                    <div id="market-makers" className="mb-20 scroll-mt-24 pt-8 border-t border-gray-800/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Terminal className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-bold">For Market Makers</h2>
                        </div>

                        <p className="text-gray-400 mb-8 max-w-3xl">
                            We use an off-chain WebSocket RFQ router to ensure zero-latency pricing discovery,
                            with on-chain atomic settlement to guarantee trustlessness.
                        </p>

                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
                            <h4 className="text-sm font-semibold uppercase text-gray-500 mb-4">Connection Details</h4>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">WebSocket URL</label>
                                    <code className="bg-black px-3 py-2 rounded text-green-400 text-sm block">wss://rfq.optionsfi.xyz</code>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Auth Header</label>
                                    <code className="bg-black px-3 py-2 rounded text-blue-400 text-sm block">Authorization: Bearer KEY</code>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-4">Message Flow</h3>
                        <div className="space-y-4">
                            <CodeBlock title="1. Receive RFQ" code={`
{
  "type": "rfq",
  "rfqId": "123-abc",
  "underlying": "NVDAx",
  "expiry": 1735689000,
  "strike": 150.00
}`} />
                            <CodeBlock title="2. Send Quote" code={`
{
  "type": "quote",
  "rfqId": "123-abc",
  "price": 2.55,
  "signature": "..."
}`} />
                        </div>
                    </div>

                    {/* SECTION: CONTRACTS */}
                    <div id="contracts" className="mb-20 scroll-mt-24 pt-8 border-t border-gray-800/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Code className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-bold">Contracts</h2>
                        </div>

                        <div className="rounded-xl border border-gray-800 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-900 text-gray-400">
                                    <tr>
                                        <th className="p-4 font-medium">Name</th>
                                        <th className="p-4 font-medium">Address (Devnet)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    <tr className="hover:bg-white/5">
                                        <td className="p-4">Vault Program</td>
                                        <td className="p-4 font-mono text-gray-400">A4jgqct3bwTwRmHECHdPpbH3a8ksaVb7rny9pMUGFo94</td>
                                    </tr>
                                    <tr className="hover:bg-white/5">
                                        <td className="p-4">RFQ Router</td>
                                        <td className="p-4 font-mono text-gray-400">3M2K6htNbWyZHtvvUyUME19f5GUS6x8AtGmitFENDT5Z</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function Card({ title, desc, icon, onClick }: { title: string; desc: string; icon: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="text-left group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:bg-gray-900 transition-all">
            <div className="mb-4 p-3 bg-gray-800 rounded-lg w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                {title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </button>
    );
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800 text-center">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{label}</p>
            <p className="text-white font-mono font-medium">{value}</p>
        </div>
    );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
    return (
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 relative overflow-hidden">
            <span className="absolute top-2 right-3 text-4xl font-bold text-gray-800/50 select-none">{num}</span>
            <h4 className="text-white font-semibold mb-2 relative z-10">{title}</h4>
            <p className="text-sm text-gray-400 relative z-10">{desc}</p>
        </div>
    );
}

function RiskBox({ title, severity, text }: { title: string; severity: "Medium" | "High"; text: string }) {
    return (
        <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20">
            <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-white">{title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${severity === "High" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>{severity}</span>
            </div>
            <p className="text-sm text-gray-400">{text}</p>
        </div>
    );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
    return (
        <div className="rounded-xl border border-gray-800 overflow-hidden bg-[#0d1117]">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900/50 text-xs text-gray-400 font-mono">
                {title}
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-gray-300 leading-relaxed">
                    {code.trim()}
                </pre>
            </div>
        </div>
    );
}
