export interface VaultTimingResult {
    nextRollTime: number; // Timestamp in ms
    nextRollIn: string;   // Formatted string
    epochProgress: number; // 0-100
    isDemo: boolean;
}

/**
 * Pure function to calculate vault timing.
 * Can be used in loops or hooks.
 */
export function calculateVaultTiming(vault: any, assetId: string): VaultTimingResult {
    const isDemo = assetId?.toLowerCase().includes("demo") || false;

    // Default or fallback
    if (!vault && !isDemo) {
        return {
            nextRollTime: 0,
            nextRollIn: "...",
            epochProgress: 0,
            isDemo
        };
    }

    const now = Date.now();
    const lastRoll = Number(vault?.lastRollTimestamp || 0) * 1000;
    let minDuration = Number(vault?.minEpochDuration || 0) * 1000;

    // Fallback durations if 0
    if (minDuration === 0) {
        minDuration = isDemo ? 180 * 1000 : 604800 * 1000;
    }

    let epochEndTimestamp = 0;

    // 1. Valid on-chain data
    if (lastRoll > 0) {
        epochEndTimestamp = lastRoll + minDuration;
    }
    // 2. Fallback for Demo (3-minute alignments)
    else if (isDemo) {
        const nowSec = Math.floor(now / 1000);
        const nextMarkSec = nowSec + (180 - (nowSec % 180));
        epochEndTimestamp = nextMarkSec * 1000;
    }
    // 3. Fallback for Prod (6-hour alignments)
    else {
        const date = new Date(now);
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const nextMarkHour = Math.ceil((utcHours + (utcMinutes / 60)) / 6) * 6;
        const nextRollDate = new Date(date);
        nextRollDate.setUTCHours(nextMarkHour, 0, 0, 0);
        epochEndTimestamp = nextRollDate.getTime();
    }

    // Calculate time left
    const timeLeft = Math.max(0, epochEndTimestamp - now);

    // Progress
    let progress = 0;
    if (lastRoll > 0) {
        const elapsed = now - lastRoll;
        progress = Math.min(100, Math.max(0, (elapsed / minDuration) * 100));
    } else if (isDemo) {
        // Approximate progress for demo fallback
        const elapsed = 180000 - timeLeft;
        progress = Math.min(100, Math.max(0, (elapsed / 180000) * 100));
    }

    // Format string
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeString = "";
    if (days > 0) {
        timeString = `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        timeString = `${hours}h ${minutes % 60}m`;
    } else {
        timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return {
        nextRollTime: epochEndTimestamp,
        nextRollIn: timeString,
        epochProgress: Math.floor(progress),
        isDemo
    };
}
