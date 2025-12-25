"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Loader2, CheckCircle, AlertCircle, Radio, Server, Terminal, Pause, Play } from "lucide-react";

interface ServiceStatus {
    name: string;
    url: string;
    status: "online" | "offline" | "loading";
    data: Record<string, unknown> | null;
    lastChecked: Date | null;
}

interface LogEvent {
    id: string;
    type: string;
    source: string;
    timestamp: string;
    data: Record<string, unknown>;
}

const EVENT_COLORS: Record<string, string> = {
    maker_connected: "text-green-400",
    maker_disconnected: "text-red-400",
    rfq_created: "text-blue-400",
    quote_received: "text-yellow-400",
    rfq_filled: "text-purple-400",
};

const EVENT_LABELS: Record<string, string> = {
    maker_connected: "MM CONNECTED",
    maker_disconnected: "MM DISCONNECTED",
    rfq_created: "RFQ CREATED",
    quote_received: "QUOTE RECEIVED",
    rfq_filled: "RFQ FILLED",
    epoch_roll_triggered: "EPOCH ROLL",
    epoch_roll_completed: "ROLL DONE",
    settlement_triggered: "SETTLEMENT",
    settlement_completed: "SETTLED",
};

const SOURCE_COLORS: Record<string, string> = {
    "rfq-router": "text-blue-500",
    "keeper": "text-orange-400",
};

export default function LogsPage() {
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: "RFQ Router", url: process.env.NEXT_PUBLIC_RFQ_ROUTER_URL || "", status: "loading", data: null, lastChecked: null },
        { name: "Keeper", url: process.env.NEXT_PUBLIC_KEEPER_URL || "", status: "loading", data: null, lastChecked: null },
    ]);
    const [events, setEvents] = useState<LogEvent[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastEventTime, setLastEventTime] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);

    const checkService = useCallback(async (service: ServiceStatus): Promise<ServiceStatus> => {
        if (!service.url) {
            return { ...service, status: "offline", data: { error: "URL not configured" }, lastChecked: new Date() };
        }
        try {
            const response = await fetch(`${service.url}/health`, { method: "GET", cache: "no-store" });
            if (response.ok) {
                const data = await response.json();
                return { ...service, status: "online", data, lastChecked: new Date() };
            }
            return { ...service, status: "offline", data: { error: `HTTP ${response.status}` }, lastChecked: new Date() };
        } catch (error: unknown) {
            return { ...service, status: "offline", data: { error: (error as Error).message }, lastChecked: new Date() };
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        const routerUrl = process.env.NEXT_PUBLIC_RFQ_ROUTER_URL;
        const keeperUrl = process.env.NEXT_PUBLIC_KEEPER_URL;

        const fetchFromUrl = async (url: string) => {
            try {
                const fullUrl = lastEventTime > 0 ? `${url}/events?since=${lastEventTime}` : `${url}/events`;
                const response = await fetch(fullUrl, { cache: "no-store" });
                if (response.ok) {
                    const data = await response.json();
                    return data.events || [];
                }
            } catch (error) {
                console.error(`Failed to fetch events from ${url}:`, error);
            }
            return [];
        };

        const allEvents: LogEvent[] = [];
        if (routerUrl) allEvents.push(...await fetchFromUrl(routerUrl));
        if (keeperUrl) allEvents.push(...await fetchFromUrl(keeperUrl));

        if (allEvents.length > 0) {
            setEvents(prev => {
                const newEvents = allEvents.filter((e: LogEvent) => !prev.some(p => p.id === e.id));
                const combined = [...prev, ...newEvents]
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .slice(-100);
                return combined;
            });
            setLastEventTime(Date.now());
            setTimeout(() => {
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }, 50);
        }
    }, [lastEventTime]);

    const refreshAll = useCallback(async () => {
        setIsRefreshing(true);
        const updated = await Promise.all(services.map(checkService));
        setServices(updated);
        await fetchEvents();
        setIsRefreshing(false);
    }, [services, checkService, fetchEvents]);

    // Initial load and auto-refresh
    useEffect(() => {
        refreshAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchEvents();
                // Refresh service status less frequently
                if (Date.now() % 10000 < 2000) {
                    Promise.all(services.map(checkService)).then(setServices);
                }
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchEvents, services, checkService]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3
        });
    };

    const StatusBadge = ({ status }: { status: "online" | "offline" | "loading" }) => {
        if (status === "loading") {
            return <span className="flex items-center gap-1.5 text-xs text-gray-400"><Loader2 className="w-3 h-3 animate-spin" /> Checking</span>;
        }
        if (status === "online") {
            return <span className="flex items-center gap-1.5 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> Online</span>;
        }
        return <span className="flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="w-3 h-3" /> Offline</span>;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Service Logs</h1>
                    <p className="text-sm text-gray-400">Real-time RFQ infrastructure monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${autoRefresh
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-800 text-gray-400"
                            }`}
                    >
                        {autoRefresh ? <Radio className="w-4 h-4 animate-pulse" /> : <Pause className="w-4 h-4" />}
                        {autoRefresh ? "Live" : "Paused"}
                    </button>
                    <button
                        onClick={refreshAll}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Compact Service Status */}
            <div className="flex gap-4">
                {services.map((service) => (
                    <div key={service.name} className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                        <Server className={`w-4 h-4 ${service.status === "online" ? "text-green-400" : "text-gray-400"}`} />
                        <span className="text-sm text-white">{service.name}</span>
                        <StatusBadge status={service.status} />
                        {service.status === "online" && service.data && (
                            <span className="text-xs text-gray-500">
                                {service.name === "RFQ Router" && `${(service.data as { connectedMakers?: number }).connectedMakers ?? 0} MMs`}
                                {service.name === "Keeper" && `${(service.data as { runCount?: number }).runCount ?? 0} runs`}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Terminal Log */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Event Stream</span>
                        {autoRefresh && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                LIVE
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500">{events.length} events</span>
                </div>

                <div
                    ref={terminalRef}
                    className="h-[400px] overflow-y-auto font-mono text-xs p-4 space-y-1"
                    style={{ backgroundColor: "#0d1117" }}
                >
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Terminal className="w-12 h-12 mb-3 opacity-30" />
                            <p>Waiting for events...</p>
                            <p className="text-xs mt-1">Events will stream here in real-time</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="flex gap-3 hover:bg-gray-800/30 px-2 py-0.5 rounded">
                                <span className="text-gray-500 flex-shrink-0">{formatTime(event.timestamp)}</span>
                                <span className={`flex-shrink-0 w-16 ${SOURCE_COLORS[event.source] || "text-gray-400"}`}>
                                    [{event.source === "rfq-router" ? "RFQ" : "KEEPER"}]
                                </span>
                                <span className={`flex-shrink-0 w-28 ${EVENT_COLORS[event.type] || "text-gray-400"}`}>
                                    {EVENT_LABELS[event.type] || event.type.toUpperCase()}
                                </span>
                                <span className="text-gray-300">
                                    {Object.entries(event.data).map(([k, v]) => (
                                        <span key={k} className="mr-3">
                                            <span className="text-gray-500">{k}=</span>
                                            <span className="text-white">{String(v)}</span>
                                        </span>
                                    ))}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
