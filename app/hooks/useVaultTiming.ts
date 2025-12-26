import { useState, useEffect } from 'react';
import { calculateVaultTiming, VaultTimingResult } from '../lib/vault-timing';

export type VaultTiming = VaultTimingResult;

/**
 * centralized hook for vault timing logic
 * Handles both production (weekly/daily) and demo (3-minute) epochs
 * Ensures consistent countdowns across the app
 */
export function useVaultTiming(vault: any, assetId: string) {
    const [timing, setTiming] = useState<VaultTimingResult>(() => calculateVaultTiming(vault, assetId));

    // Tick every second
    useEffect(() => {
        // Update immediately on prop change
        setTiming(calculateVaultTiming(vault, assetId));

        const interval = setInterval(() => {
            setTiming(calculateVaultTiming(vault, assetId));
        }, 1000);
        return () => clearInterval(interval);
    }, [vault, assetId]);

    return timing;
}
