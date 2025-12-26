"use client";

import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { VAULT_PROGRAM_ID, VAULTS, deriveVaultPda } from "../lib/vault-sdk";

export interface WalletActivity {
    signature: string;
    type: "deposit" | "withdraw" | "withdrawal_request" | "unknown";
    timestamp: Date;
    slot: number;
    success: boolean;
    amount?: number;
    vaultId?: string;
}

/**
 * Hook to fetch real wallet activity involving our vault program
 */
export function useWalletActivity() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [activities, setActivities] = useState<WalletActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivity = useCallback(async () => {
        if (!publicKey) {
            setActivities([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const cacheKey = `optionsfi_activity_v1_${publicKey.toString()}`;
            let cachedData: { lastSignature: string; activities: any[] } | null = null;

            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    cachedData = JSON.parse(cached);
                    // Hydrate dates
                    if (cachedData?.activities) {
                        cachedData.activities = cachedData.activities.map(a => ({
                            ...a,
                            timestamp: new Date(a.timestamp)
                        }));
                        // Set initial data from cache immediately for fast render
                        if (!activities.length) {
                            setActivities(cachedData.activities);
                        }
                    }
                }
            } catch (e) {
                console.warn("Failed to parse activity cache", e);
            }

            // Fetch recent signatures
            // If we have a cache, fetch until the last known signature to get only new items
            // If no cache, fetch a larger batch to populate history
            const fetchOptions: any = { limit: cachedData ? 20 : 50 };
            if (cachedData?.lastSignature) {
                fetchOptions.until = cachedData.lastSignature;
            }

            const signatures = await connection.getSignaturesForAddress(
                publicKey,
                fetchOptions,
                "confirmed"
            );

            // If no new signatures and we have cache, we are done
            if (signatures.length === 0 && cachedData) {
                setActivities(cachedData.activities);
                setLoading(false);
                return;
            }

            // Fetch transactions for new signatures
            const BATCH_SIZE = 5;
            const BATCH_DELAY_MS = 200;
            const newActivities: WalletActivity[] = [];

            for (let i = 0; i < signatures.length; i += BATCH_SIZE) {
                const batch = signatures.slice(i, i + BATCH_SIZE);
                if (i > 0) await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));

                const txPromises = batch.map(async (sig) => {
                    try {
                        const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
                        if (!tx || !tx.meta) return null;

                        const accountKeys = tx.transaction.message.accountKeys;
                        let vaultId: string | undefined;
                        let involvesActiveVault = false;

                        for (const [id, config] of Object.entries(VAULTS)) {
                            const [vaultPda] = deriveVaultPda(config.assetId);
                            if (accountKeys.some(key => key.pubkey.toString() === vaultPda.toString())) {
                                vaultId = id;
                                involvesActiveVault = true;
                                break;
                            }
                        }

                        if (!involvesActiveVault) return null;

                        const logs = tx.meta.logMessages || [];
                        let type: WalletActivity["type"] = "unknown";
                        for (const log of logs) {
                            if (log.includes("Instruction: Deposit")) type = "deposit";
                            else if (log.includes("Instruction: RequestWithdrawal")) type = "withdrawal_request";
                            else if (log.includes("Instruction: ProcessWithdrawal")) type = "withdraw";
                        }

                        let amount: number | undefined;
                        const preBalances = tx.meta.preTokenBalances || [];
                        const postBalances = tx.meta.postTokenBalances || [];

                        for (const post of postBalances) {
                            if (post.owner === publicKey.toString()) {
                                const pre = preBalances.find(p => p.accountIndex === post.accountIndex);
                                const postAmount = parseFloat(post.uiTokenAmount.uiAmountString || "0");
                                const preAmount = pre ? parseFloat(pre.uiTokenAmount.uiAmountString || "0") : 0;
                                const change = Math.abs(postAmount - preAmount);
                                if (change > 0) amount = change;
                            }
                        }

                        return {
                            signature: sig.signature,
                            type,
                            timestamp: new Date((sig.blockTime || 0) * 1000),
                            slot: sig.slot,
                            success: sig.err === null,
                            amount,
                            vaultId,
                        } as WalletActivity;
                    } catch (txErr) {
                        console.warn("Error parsing tx:", sig.signature, txErr);
                        return null;
                    }
                });

                const results = await Promise.all(txPromises);
                results.forEach(r => { if (r) newActivities.push(r); });
            }

            // Merge new activities with cached ones
            // Filter duplicates just in case
            const existingSigs = new Set(cachedData?.activities.map(a => a.signature) || []);
            const uniqueNewActivities = newActivities.filter(a => !existingSigs.has(a.signature));

            const allActivities = [
                ...uniqueNewActivities,
                ...(cachedData?.activities || [])
            ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            setActivities(allActivities);

            // Update cache
            if (allActivities.length > 0) {
                const latestSig = allActivities[0].signature;
                localStorage.setItem(cacheKey, JSON.stringify({
                    lastSignature: latestSig,
                    activities: allActivities
                }));
            }

        } catch (err: any) {
            console.error("Error fetching wallet activity:", err);
            setError(err.message || "Failed to fetch activity");
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey]);

    // Force refresh helper that clears cache (optional, or just re-fetches top)
    // Actually standard refresh should just fetch top. 
    // If we want hard reset: localStorage.removeItem(cacheKey)

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    return {
        activities,
        loading,
        error,
        refresh: fetchActivity,
    };
}
