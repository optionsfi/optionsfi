"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Settings, Palette, Bell, Sliders, Beaker, Monitor, Moon, Sun,
    Check, ChevronRight, RefreshCw, Zap, Eye
} from "lucide-react";

// UI Scale options
const UI_SCALES = [
    { label: "Compact", value: 0.92, description: "Maximize information density" },
    { label: "Default", value: 1.00, description: "Balanced for most displays" },
    { label: "Comfortable", value: 1.08, description: "More spacing between elements" },
    { label: "Large", value: 1.15, description: "Larger text and controls" },
];

import { useSettings, type AppSettings } from "../../../hooks/useSettings";

// Settings navigation sections
type SettingsSection = "appearance" | "preferences" | "notifications" | "advanced";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");
    const { settings, updateSetting, isLoaded } = useSettings();

    if (!isLoaded) {
        return <div className="p-8 text-gray-500">Loading settings...</div>;
    }

    const {
        uiScale,
        theme,
        autoRefresh,
        refreshInterval,
        showTestnetWarning,
        defaultChartMode,
        txNotifications,
        epochNotifications,
        showAdvancedMetrics,
        experimentalFeatures
    } = settings;

    const sections: { id: SettingsSection; label: string; icon: typeof Settings }[] = [
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "preferences", label: "Preferences", icon: Sliders },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "advanced", label: "Advanced", icon: Beaker },
    ];

    return (
        <div className="w-full max-w-[1600px] mx-0 px-2 md:px-6 py-6 text-foreground">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your appearance, preferences, and notifications.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Settings Navigation Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 max-w-4xl">
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">

                        {/* Appearance Section */}
                        {activeSection === "appearance" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Appearance</h2>
                                    <p className="text-sm text-muted-foreground">Customize the visual experience</p>
                                </div>

                                {/* UI Scale / Density */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-4 block flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Interface Density
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {UI_SCALES.map((scale) => (
                                            <button
                                                key={scale.value}
                                                onClick={() => updateSetting("uiScale", scale.value)}
                                                className={`relative p-4 rounded-lg border text-left transition-all ${uiScale === scale.value
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-secondary/40 border-border text-muted-foreground hover:border-accent hover:bg-secondary"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-medium text-sm text-foreground">{scale.label}</p>
                                                    {uiScale === scale.value && (
                                                        <Check className="w-4 h-4 text-blue-400" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{scale.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Theme */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-4 block flex items-center gap-2">
                                        <Moon className="w-4 h-4" />
                                        Theme Mode
                                    </label>
                                    <div className="flex gap-3">
                                        {[
                                            { id: "dark", label: "Dark", icon: Moon },
                                            { id: "light", label: "Light", icon: Sun },
                                            { id: "system", label: "System", icon: Monitor },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => updateSetting("theme", t.id as AppSettings["theme"])}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm transition-all ${theme === t.id
                                                    ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                    : "bg-secondary/30 border-border text-muted-foreground hover:border-accent"
                                                    }`}
                                            >
                                                <t.icon className="w-4 h-4" />
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Section */}
                        {activeSection === "preferences" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Preferences</h2>
                                    <p className="text-sm text-muted-foreground">Configure app behavior</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4" />
                                                Auto-refresh data
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Automatically update prices and balances</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("autoRefresh", !autoRefresh)}
                                            className={`w-11 h-6 rounded-full transition-all ${autoRefresh ? "bg-blue-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${autoRefresh ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>

                                    {autoRefresh && (
                                        <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Refresh interval</p>
                                                <p className="text-xs text-muted-foreground mt-1">How often to fetch new data via RPC</p>
                                            </div>
                                            <select
                                                value={refreshInterval}
                                                onChange={(e) => updateSetting("refreshInterval", Number(e.target.value))}
                                                className="px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground focus:outline-none focus:border-accent"
                                            >
                                                <option value={5000}>5 seconds</option>
                                                <option value={10000}>10 seconds</option>
                                                <option value={30000}>30 seconds</option>
                                                <option value={60000}>1 minute</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Default chart view</p>
                                            <p className="text-xs text-muted-foreground mt-1">Initial chart mode in Portfolio</p>
                                        </div>
                                        <select
                                            value={defaultChartMode}
                                            onChange={(e) => updateSetting("defaultChartMode", e.target.value as AppSettings["defaultChartMode"])}
                                            className="px-3 py-2 bg-secondary border border-border rounded text-sm text-foreground focus:outline-none focus:border-accent"
                                        >
                                            <option value="performance">Performance (%)</option>
                                            <option value="value">Value ($)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Show testnet warning</p>
                                            <p className="text-xs text-muted-foreground mt-1">Display Devnet banner in header</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("showTestnetWarning", !showTestnetWarning)}
                                            className={`w-11 h-6 rounded-full transition-all ${showTestnetWarning ? "bg-blue-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${showTestnetWarning ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {activeSection === "notifications" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Notifications</h2>
                                    <p className="text-sm text-muted-foreground">Manage alerts and updates</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Transaction updates</p>
                                            <p className="text-xs text-muted-foreground mt-1">Notify when transactions confirm on-chain</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("txNotifications", !txNotifications)}
                                            className={`w-11 h-6 rounded-full transition-all ${txNotifications ? "bg-blue-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${txNotifications ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Epoch roll alerts</p>
                                            <p className="text-xs text-muted-foreground mt-1">Notify when vault epochs settle</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("epochNotifications", !epochNotifications)}
                                            className={`w-11 h-6 rounded-full transition-all ${epochNotifications ? "bg-blue-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${epochNotifications ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Advanced Section */}
                        {activeSection === "advanced" && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Advanced</h2>
                                    <p className="text-sm text-muted-foreground">Power user settings</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Zap className="w-4 h-4" />
                                                Advanced metrics
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Show Greeks, IV, and detailed analytics</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("showAdvancedMetrics", !showAdvancedMetrics)}
                                            className={`w-11 h-6 rounded-full transition-all ${showAdvancedMetrics ? "bg-blue-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${showAdvancedMetrics ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <Beaker className="w-4 h-4" />
                                                Experimental features
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">Enable beta features</p>
                                        </div>
                                        <button
                                            onClick={() => updateSetting("experimentalFeatures", !experimentalFeatures)}
                                            className={`w-11 h-6 rounded-full transition-all ${experimentalFeatures ? "bg-orange-600" : "bg-muted"}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${experimentalFeatures ? "translate-x-5" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
