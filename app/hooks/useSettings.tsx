"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface AppSettings {
    uiScale: number;
    autoRefresh: boolean;
    refreshInterval: number;
    showTestnetWarning: boolean;
    showAdvancedMetrics: boolean;
    experimentalFeatures: boolean;
    defaultChartMode: "performance" | "value";
    theme: "dark" | "light" | "system";
    txNotifications: boolean;
    epochNotifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    uiScale: 1.0,
    autoRefresh: true,
    refreshInterval: 30000,
    showTestnetWarning: true,
    showAdvancedMetrics: false,
    experimentalFeatures: false,
    defaultChartMode: "performance",
    theme: "dark",
    txNotifications: true,
    epochNotifications: true,
};

interface SettingsContextType {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }): React.ReactNode {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    const applyTheme = (theme: AppSettings["theme"]) => {
        const root = document.documentElement;
        let effectiveTheme = theme;

        if (theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (effectiveTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
    };

    const applySideEffects = useCallback((s: AppSettings) => {
        // UI Scale
        document.documentElement.style.setProperty("--ui-scale", String(s.uiScale));

        // Theme
        applyTheme(s.theme);
    }, []);

    // Initial load
    useEffect(() => {
        const loadSettings = () => {
            const saved: Partial<AppSettings> = {};

            try {
                const keys: (keyof AppSettings)[] = [
                    "uiScale", "autoRefresh", "refreshInterval",
                    "showTestnetWarning", "showAdvancedMetrics", "experimentalFeatures",
                    "defaultChartMode", "theme", "txNotifications", "epochNotifications"
                ];

                keys.forEach(key => {
                    const val = localStorage.getItem(key);
                    if (val !== null) {
                        if (key === "uiScale" || key === "refreshInterval") {
                            (saved as any)[key] = parseFloat(val);
                        } else if (key === "autoRefresh" || key === "showTestnetWarning" ||
                            key === "showAdvancedMetrics" || key === "experimentalFeatures" ||
                            key === "txNotifications" || key === "epochNotifications") {
                            (saved as any)[key] = val === "true";
                        } else {
                            (saved as any)[key] = val;
                        }
                    }
                });
            } catch (e) {
                console.warn("Failed to load settings", e);
            }

            const merged = { ...DEFAULT_SETTINGS, ...saved };
            setSettings(merged);
            setIsLoaded(true);
            applySideEffects(merged);
        };

        loadSettings();
    }, [applySideEffects]);

    // Handle system theme changes
    useEffect(() => {
        if (settings.theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings.theme]);

    const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => {
            const next = { ...prev, [key]: value };
            localStorage.setItem(key, String(value));

            if (key === "uiScale" || key === "theme") {
                applySideEffects(next);
            }

            return next;
        });
    }, [applySideEffects]);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, isLoaded }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
