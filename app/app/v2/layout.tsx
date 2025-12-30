"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Coins, PieChart, Activity, BookOpen, Settings, Droplets, Logs, Menu, X, LayoutDashboard, Radar, ScrollText } from "lucide-react";

import { useSettings } from "../../hooks/useSettings";

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

export default function V2Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { settings } = useSettings();

    useEffect(() => {
        const savedSidebar = localStorage.getItem("sidebarCollapsed");
        if (savedSidebar) {
            setSidebarCollapsed(savedSidebar === "true");
        }
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const toggleSidebar = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", String(newState));
    };

    // Core product navigation
    const coreNavItems = [
        { href: "/v2/portfolio", label: "Portfolio", icon: LayoutDashboard },
        { href: "/v2", label: "Earn", icon: Coins },
        { href: "/v2/oracle", label: "Oracle", icon: Radar },
    ];

    // Utility navigation (bottom section)
    const utilityNavItems = [
        { href: "/v2/faucet", label: "Faucet", icon: Droplets },
        { href: "/v2/logs", label: "Logs", icon: ScrollText },
        { href: "/v2/settings", label: "Settings", icon: Settings },
    ];

    // External links
    const externalLinks = [
        { href: "https://docs.optionsfi.xyz", label: "Docs", icon: BookOpen },
    ];

    const isActive = (href: string) => {
        if (href === "/v2") return pathname === "/v2" || pathname === "/v2/earn" || pathname?.startsWith("/v2/earn/");
        return pathname?.startsWith(href);
    };



    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Top Header - Clean, minimal */}
            <header className="flex-shrink-0 h-14 border-b border-border bg-background/80 backdrop-blur-md z-50">
                <div className="h-full flex justify-between items-center px-4 md:px-6">
                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <Link href="/v2" className="flex items-center gap-2 md:gap-3">
                            <img src="/OptionsFi_logo.png" alt="OptionsFi" className="h-7 md:h-8 w-auto" />
                            {settings.showTestnetWarning && (
                                <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    V2 Beta
                                </span>
                            )}
                        </Link>

                        {/* V1/V2 Toggle - hidden on mobile */}
                        {/* <div className="hidden md:flex items-center bg-secondary/50 rounded-lg p-0.5 border border-border">
                            <Link
                                href="/"
                                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors"
                            >
                                V1
                            </Link>
                            <div className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500/20 text-blue-400">
                                V2
                            </div>
                        </div> */}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Network Badge - smaller on mobile */}
                        {settings.showTestnetWarning && (
                            <div className="flex items-center gap-1.5 px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg bg-secondary/50 border border-border">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                <span className="text-[10px] md:text-xs font-medium text-muted-foreground">Devnet</span>
                            </div>
                        )}

                        {/* Wallet - hidden on mobile (moved to menu) */}
                        <div className="hidden md:block">
                            <WalletMultiButton className="!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !rounded-lg !h-8 md:!h-9 !px-3 md:!px-4 !text-xs md:!text-sm !font-medium !border !border-border" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-14 bg-background/95 backdrop-blur-sm z-40 overflow-y-auto">
                        <nav className="p-4 space-y-4">
                            {/* Wallet in Mobile Menu */}
                            <div className="px-1 pt-2 pb-4 border-b border-border">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3 px-3">Account</p>
                                <WalletMultiButton className="w-full !flex !justify-center !bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !rounded-xl !h-12 !text-sm !font-semibold !border !border-border" />
                            </div>

                            <div className="space-y-2 pt-2">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3 px-3">Navigation</p>
                                {coreNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(item.href)
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                                <div className="border-t border-border my-4" />
                                {utilityNavItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.href)
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                                {/* External Links */}
                                {externalLinks.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                )}

                {/* Left Sidebar - hidden on mobile */}
                <aside className={`hidden md:flex ${sidebarCollapsed ? 'w-16' : 'w-52'} flex-shrink-0 border-r border-border bg-background/50 transition-all duration-200 flex-col`}>
                    {/* Sidebar Header Row */}
                    <div className={`h-11 flex-shrink-0 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-end'} px-3 border-b border-border/50`}>
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"
                            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Core Nav Items - scrolls if needed */}
                    <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto min-h-0">
                        {coreNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center h-10 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} rounded-lg text-sm font-medium transition-all ${isActive(item.href)
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="mx-3 border-t border-border/50 flex-shrink-0" />

                    {/* Utility Nav Items - pinned at bottom */}
                    <nav className="px-2 py-3 space-y-1 flex-shrink-0">
                        {utilityNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center h-10 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} rounded-lg text-sm font-medium transition-all ${isActive(item.href)
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span className="text-[13px]">{item.label}</span>}
                                </Link>
                            );
                        })}
                        {/* External Links */}
                        {externalLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center h-10 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} rounded-lg text-sm font-medium transition-all text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50`}
                                    title={sidebarCollapsed ? item.label : undefined}
                                >
                                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span className="text-[13px]">{item.label}</span>}
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-3 md:p-4 overflow-auto pb-20 md:pb-4">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation - hidden when menu overlay is open */}
            {!mobileMenuOpen && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40 safe-area-bottom">
                    <div className="flex justify-around items-center h-16">
                        {coreNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive(item.href)
                                        ? "text-blue-400"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-[10px] font-medium">More</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}
