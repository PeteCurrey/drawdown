"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Zap, Copy, Check, Star, ExternalLink, Calendar, 
  RefreshCw, Lock, Sparkles, Filter, Eye, AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Accent colors: Indigo
const C_PRIMARY = "#6366f1"; // indigo-500
const C_HOVER = "#4f46e5";   // indigo-600
const C_TINT = "#eef2ff";    // indigo-50
const C_BORDER = "#c7d2fe";  // indigo-200
const C_TEXT = "#4338ca";    // indigo-700

interface SignalData {
  id: string;
  instrument: string;
  timeframe: string;
  bias: string;
  confluence_score: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  take_profit_3: number;
  rr_ratio: number;
  atr: number;
  catalyst_event: any;
  confluence_factors: string[];
  created_at: string;
  expires_at: string;
}

interface SignalCentreDashboardClientProps {
  initialSignals: SignalData[];
  initialSavedIds: string[];
  isSubscriber: boolean;
  userId: string;
}

function getCategory(instrument: string): string {
  const symbol = instrument.toUpperCase();
  if (symbol.includes("BTC") || symbol.includes("ETH") || symbol.includes("SOL")) return "crypto";
  if (symbol.includes("SPX") || symbol.includes("NDX") || symbol.includes("DJI") || symbol.includes("FTSE") || symbol.includes("UKX") || symbol.includes("DAX")) return "indices";
  if (symbol.includes("XAU") || symbol.includes("XAG") || symbol.includes("GOLD") || symbol.includes("SILVER")) return "metals";
  return "forex";
}

export function SignalCentreDashboardClient({
  initialSignals,
  initialSavedIds,
  isSubscriber,
  userId,
}: SignalCentreDashboardClientProps) {
  const [signals, setSignals] = useState<SignalData[]>(initialSignals);
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  
  // Interactive filters state
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("all");
  const [activeBias, setActiveBias] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"all" | "watchlist">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const supabase = createClient();

  // Background scan trigger on page load
  useEffect(() => {
    triggerScan(true);
  }, []);

  const triggerScan = async (background = false) => {
    if (!background) setScanning(true);
    try {
      const res = await fetch("/api/signals/scan", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLastScanTime(data.lastScan);
        // Refresh active signals from database
        const { data: freshSignals } = await supabase
          .from("signals")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (freshSignals) {
          setSignals(freshSignals);
        }
      }
      if (data.message && !background) {
        setScanMessage(data.message);
        setTimeout(() => setScanMessage(""), 4000);
      }
    } catch (e) {
      console.error("[signal-centre] Trigger scan failed:", e);
    } finally {
      setScanning(false);
    }
  };

  // Watchlist Save/Unsave Handler
  const handleToggleWatchlist = async (signalId: string, instrument: string) => {
    if (savedIds.includes(signalId)) {
      // Unsave
      const { error } = await (supabase as any)
        .from("signals_saved")
        .delete()
        .eq("user_id", userId)
        .eq("signal_id", signalId);
      
      if (!error) {
        setSavedIds(prev => prev.filter(id => id !== signalId));
      }
    } else {
      // Save
      const { error } = await (supabase as any)
        .from("signals_saved")
        .insert({
          user_id: userId,
          signal_id: signalId,
          instrument: instrument,
        });
      
      if (!error) {
        setSavedIds(prev => [...prev, signalId]);
      }
    }
  };

  // Copy share URL to clipboard
  const handleCopyLink = (signalId: string) => {
    const origin = window.location.origin;
    const url = `${origin}/signal-centre/signals/${signalId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(signalId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter computation
  const filteredSignals = useMemo(() => {
    return signals.filter(s => {
      // Category filter
      const cat = getCategory(s.instrument);
      const matchCat = activeCategory === "all" || cat === activeCategory;

      // Timeframe filter
      const matchTf = activeTimeframe === "all" || s.timeframe === activeTimeframe;

      // Bias filter
      const matchBias = activeBias === "all" || s.bias === activeBias;

      // View mode (Watchlist vs All)
      const matchView = viewMode === "all" || savedIds.includes(s.id);

      return matchCat && matchTf && matchBias && matchView;
    });
  }, [signals, savedIds, activeCategory, activeTimeframe, activeBias, viewMode]);

  // Calculate timeframe signal age
  const getAge = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 pb-16">
      
      {/* Top Header Panel */}
      <header className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-display font-bold uppercase tracking-tight text-gray-900">
              SIGNAL <span style={{ color: C_PRIMARY }}>CENTRE.</span>
            </h1>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-mono font-bold uppercase rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              Live Scan
            </div>
          </div>
          <p className="text-xs text-gray-500 max-w-xl">
            Real-time, high-conviction sessional confluence setups across Forex, Indices, Metals, and Crypto.
          </p>
        </div>

        {/* Scan Actions / Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          {lastScanTime && (
            <div className="text-right">
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">LAST COMPLETED SCAN</p>
              <p className="text-xs font-mono font-bold text-gray-700 mt-0.5">
                {new Date(lastScanTime).toLocaleTimeString()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => triggerScan(false)}
              disabled={scanning}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: C_PRIMARY }}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", scanning && "animate-spin")} />
              {scanning ? "Scanning…" : "Scan Markets"}
            </button>
            {scanMessage && (
              <p className="text-[9px] font-mono text-emerald-600 text-center">{scanMessage}</p>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Controls & Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        
        {/* Row 1: Category & Watchlist selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All Setups" },
              { id: "forex", label: "Forex" },
              { id: "indices", label: "Indices" },
              { id: "metals", label: "Metals" },
              { id: "crypto", label: "Crypto" },
            ].map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all rounded-md"
                  style={active
                    ? { backgroundColor: C_PRIMARY, color: "#ffffff", border: `1px solid ${C_PRIMARY}` }
                    : { backgroundColor: "#ffffff", color: "#6b7280", border: "1px solid #e5e7eb" }
                  }
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Watchlist Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden select-none">
            <button
              onClick={() => setViewMode("all")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all",
                viewMode === "all" ? "bg-indigo-50 text-indigo-700 font-bold" : "bg-white text-gray-500 hover:text-gray-900"
              )}
            >
              All Signals
            </button>
            <button
              onClick={() => setViewMode("watchlist")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 border-l border-gray-200",
                viewMode === "watchlist" ? "bg-indigo-50 text-indigo-700 font-bold" : "bg-white text-gray-500 hover:text-gray-900"
              )}
            >
              <Star className="w-3 h-3" fill={viewMode === "watchlist" ? "currentColor" : "none"} />
              Watchlist ({savedIds.length})
            </button>
          </div>
        </div>

        {/* Row 2: Timeframe & Bias filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Timeframe selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Filter className="w-3 h-3" /> Timeframe:
            </span>
            <div className="flex gap-1">
              {["all", "15M", "1H", "4H", "1D"].map(tf => {
                const active = activeTimeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className="px-2.5 py-1 text-[9px] font-mono rounded border transition-all uppercase"
                    style={active
                      ? { backgroundColor: C_TINT, borderColor: C_BORDER, color: C_TEXT, fontWeight: 700 }
                      : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
                    }
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bias selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Bias:</span>
            <div className="flex gap-1">
              {[
                { id: "all", label: "All" },
                { id: "BULLISH", label: "Bullish" },
                { id: "BEARISH", label: "Bearish" },
              ].map(bias => {
                const active = activeBias === bias.id;
                return (
                  <button
                    key={bias.id}
                    onClick={() => setActiveBias(bias.id)}
                    className="px-2.5 py-1 text-[9px] font-mono rounded border transition-all"
                    style={active
                      ? { backgroundColor: C_TINT, borderColor: C_BORDER, color: C_TEXT, fontWeight: 700 }
                      : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
                    }
                  >
                    {bias.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Grid of active Signal Cards */}
      {filteredSignals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm space-y-3">
          <p className="text-sm font-mono text-gray-400">
            {viewMode === "watchlist" ? "No saved watchlist setups." : "No active signals match the current filters."}
          </p>
          <p className="text-xs text-gray-400/70 max-w-sm mx-auto">
            Try adjusting your filters or click Scan Markets above to poll the Twelve Data scanner engine for fresh signals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map(s => {
            const isBullish = s.bias === "BULLISH";
            const ageStr = getAge(s.created_at);
            const isSaved = savedIds.includes(s.id);

            return (
              <div 
                key={s.id} 
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden relative"
              >
                {/* Card Top / Details */}
                <div className="p-5 space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-black text-gray-900 leading-none">
                          {s.instrument}
                        </h3>
                        <span className="text-[8px] font-mono bg-gray-100 text-gray-500 px-1 py-0.5 rounded uppercase font-bold">
                          {s.timeframe}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 block mt-1.5">
                        Generated {ageStr}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={cn(
                        "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                        isBullish 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-red-50 border-red-200 text-red-700"
                      )}>
                        {s.bias}
                      </span>
                      {/* dots progress */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: i < Math.ceil(s.confluence_score / 2)
                                ? (isBullish ? "#10b981" : "#ef4444")
                                : "#e5e7eb"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Positioning metrics block */}
                  <div className="relative">
                    {!isSubscriber && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-3 text-center">
                        <Lock className="w-5 h-5 text-indigo-500 mb-1" />
                        <p className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider">
                          Edge Feature
                        </p>
                        <p className="text-[8px] text-gray-400">Upgrade to unlock exact levels</p>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry Zone:</span>
                        <span className="font-bold text-gray-900">
                          {isSubscriber ? s.entry_price.toFixed(s.entry_price > 100 ? 2 : 5) : "1.0854"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stop Loss:</span>
                        <span className="font-bold text-red-600">
                          {isSubscriber ? s.stop_loss.toFixed(s.stop_loss > 100 ? 2 : 5) : "1.0805"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target 2 (Primary):</span>
                        <span className="font-bold text-emerald-600">
                          {isSubscriber ? s.take_profit_2.toFixed(s.take_profit_2 > 100 ? 2 : 5) : "1.0952"}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-50 pt-1.5 mt-1.5">
                        <span className="text-gray-400">R:R Ratio:</span>
                        <span className="font-bold text-gray-900">1 : {s.rr_ratio.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Confluence factors (first 2 only for size) */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">CONFLUENCE FACTORS</p>
                    <div className="space-y-1 mt-1">
                      {s.confluence_factors.slice(0, 2).map((factor, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-600">
                          <span className="text-indigo-500 font-bold">✓</span>
                          <span className="truncate">{factor}</span>
                        </div>
                      ))}
                      {s.confluence_factors.length > 2 && (
                        <p className="text-[8px] font-mono text-indigo-500 pl-3">
                          + {s.confluence_factors.length - 2} more confluence factors
                        </p>
                      )}
                    </div>
                  </div>

                  {/* News Catalyst */}
                  <div className="bg-[#f5f3ff] border border-[#ddd6fe] rounded-lg p-2.5 flex gap-2 items-start">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Fundamental Catalyst</p>
                      <p className="text-[10px] font-mono font-bold text-gray-700 truncate leading-snug mt-0.5">
                        {s.catalyst_event?.event || "Technical Breakout Confluence"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Share */}
                    <button
                      onClick={() => handleCopyLink(s.id)}
                      className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-md text-gray-400 hover:text-gray-900 transition-all"
                      title="Copy public link"
                    >
                      {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {/* Watchlist */}
                    <button
                      onClick={() => handleToggleWatchlist(s.id, s.instrument)}
                      className={cn(
                        "p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-md transition-all",
                        isSaved ? "text-amber-500" : "text-gray-400 hover:text-gray-900"
                      )}
                      title="Save to watchlist"
                    >
                      <Star className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Full Analysis link */}
                  <Link
                    href={`/signal-centre/signals/${s.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Full Analysis <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Upgrade Call-to-Action for non-subscribers */}
      {!isSubscriber && (
        <section className="bg-white border border-[#c7d2fe] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden mt-8">
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
            <Sparkles style={{ width: 120, height: 120 }} />
          </div>
          
          <div className="space-y-1.5 relative z-10">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Unlock the Full Edge+ Suite
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
              Get raw live signal values, exact stops, three-tiered targets, and unlock alerts across all sessional setups. 
              Plans start from £149/mo.
            </p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 relative z-10">
            <span className="text-xs font-mono text-gray-400">Edge+ tier required</span>
            <Link 
              href="/pricing" 
              className="px-6 py-3 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-lg shadow-sm hover:shadow"
              style={{ backgroundColor: C_PRIMARY }}
            >
              Upgrade to Edge+
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
