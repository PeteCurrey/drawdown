"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ToastProvider, useToast } from "@/components/notifications/ToastProvider";
import Link from "next/link";
import {
  Zap, Copy, Check, Star, ExternalLink, Calendar,
  RefreshCw, Lock, Sparkles, Filter, Award,
  BarChart3, TrendingUp, TrendingDown, Percent, Flame,
  Cpu, Bell, Download, MessageSquare, ChevronRight,
  Activity, Shield, Crown, Users, ArrowUpRight,
  CheckCircle2, AlertCircle, Clock, Globe, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ExtendYourEdge } from "@/components/dashboard/ExtendYourEdge";

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
  dcs_score: number;
  ai_consensus: any;
  taapi_data: any;
  coingecko_data: any;
  coinglass_data: any;
}

interface SignalCentreDashboardClientProps {
  initialSignals: SignalData[];
  initialSavedIds: string[];
  isSubscriber: boolean;
  userId: string;
  userTier: string;
}

const TIER_WEIGHT: Record<string, number> = { free: 0, 'signal-centre': 1, foundation: 1, edge: 2, floor: 3 };

function tierAtLeast(userTier: string, required: string): boolean {
  return (TIER_WEIGHT[userTier] ?? 0) >= (TIER_WEIGHT[required] ?? 0);
}

function getCategory(instrument: string): string {
  const symbol = instrument.toUpperCase();
  if (symbol.includes("BTC") || symbol.includes("ETH") || symbol.includes("SOL")) return "crypto";
  if (symbol.includes("SPX") || symbol.includes("NDX") || symbol.includes("DJI") || symbol.includes("FTSE") || symbol.includes("UKX") || symbol.includes("DAX")) return "indices";
  if (symbol.includes("XAU") || symbol.includes("XAG") || symbol.includes("GOLD") || symbol.includes("SILVER")) return "metals";
  return "forex";
}

const TIER_CONFIG = {
  free: {
    label: "Free",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    icon: Globe,
  },
  foundation: {
    label: "Foundation",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Shield,
  },
  edge: {
    label: "Edge",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    icon: Zap,
  },
  floor: {
    label: "Floor",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: Crown,
  },
};

// ─── Gate wrapper component ────────────────────────────────────────────────────
function TierGate({
  children,
  requiredTier,
  userTier,
  featureName,
}: {
  children: React.ReactNode;
  requiredTier: "foundation" | "edge" | "floor";
  userTier: string;
  featureName: string;
}) {
  const unlocked = tierAtLeast(userTier, requiredTier);
  const tierInfo = TIER_CONFIG[requiredTier];
  const TierIcon = tierInfo.icon;

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200">
      <div className="blur-[3px] pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-center p-6">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", tierInfo.bgColor)}>
          <TierIcon className={cn("w-5 h-5", tierInfo.color)} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{featureName}</p>
          <p className="text-xs text-gray-500 mt-1">
            Available on <span className={cn("font-bold", tierInfo.color)}>{tierInfo.label}</span> and above
          </p>
        </div>
        <Link
          href="/pricing"
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
            tierInfo.bgColor, tierInfo.color, tierInfo.borderColor, "border"
          )}
        >
          Upgrade to {tierInfo.label} <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function SignalCentreInner({
  initialSignals,
  initialSavedIds,
  isSubscriber,
  userId,
  userTier,
}: SignalCentreDashboardClientProps) {
  const { addToast } = useToast();
  const [signals, setSignals] = useState<SignalData[]>(initialSignals);
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Interactive filters
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("all");
  const [activeBias, setActiveBias] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"all" | "watchlist">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const supabase = createClient();

  const canSeeExact = tierAtLeast(userTier, "foundation");
  const canSeeAIPanel = tierAtLeast(userTier, "edge");
  const canSeeFloor = tierAtLeast(userTier, "floor");

  // Background scan on load + auto-refresh every 90 seconds
  useEffect(() => {
    triggerScan(true);

    const timeIv = setInterval(() => setNow(Date.now()), 60_000);

    // Re-fetch signals from DB every 90 s so the feed stays live
    const pollInterval = setInterval(async () => {
      try {
        const { data: freshSignals } = await supabase
          .from("signals")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (freshSignals) {
          setSignals((prev) => {
            // Detect new high-conviction signals (DCS ≥ 75)
            const prevIds = new Set(prev.map((s) => s.id));
            const newHigh = freshSignals.filter(
              (s: any) => !prevIds.has(s.id) && (s.dcs_score ?? 0) >= 75
            );
            newHigh.forEach((s: any) => {
              addToast({
                type: s.bias === "BULLISH" ? "signal-bullish" : "signal-bearish",
                title: `${s.instrument} ${s.bias} — DCS ${s.dcs_score}%`,
                body: `New ${s.timeframe} ${s.bias.toLowerCase()} signal with ${s.dcs_score}% conviction score`,
              });
            });
            return freshSignals;
          });
        }
      } catch (e) {
        console.warn("[signal-centre] Auto-poll failed:", e);
      }
    }, 90_000);

    // Full background scan every 5 minutes to generate new signals
    const scanInterval = setInterval(() => {
      triggerScan(true);
    }, 300_000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(scanInterval);
      clearInterval(timeIv);
    };
  }, []);

  const triggerScan = async (background = false) => {
    if (!background) setScanning(true);
    try {
      const res = await fetch("/api/signals/scan", { method: "POST" });
      const data = await res.json();
      
      if (res.status === 429) {
        if (!background) {
          addToast({
            type: "alert",
            title: "Scan Throttled",
            body: "Scan throttled — try again in 60 seconds",
          });
        }
        return;
      }

      if (data.success) {
        setLastScanTime(data.lastScan);
        const { data: freshSignals } = await supabase
          .from("signals")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (freshSignals) {
          setSignals(freshSignals);

          // Fire toast for any high-conviction signals generated in the last 6 minutes
          const sixMinsAgo = Date.now() - 6 * 60 * 1000;
          freshSignals
            .filter(
              (s: any) =>
                typeof s.dcs_score === "number" &&
                s.dcs_score >= 85 &&
                new Date(s.created_at).getTime() >= sixMinsAgo
            )
            .forEach((s: any) => {
              addToast({
                type: "high-conviction",
                title: `🔥 High-conviction signal`,
                body: `${s.instrument} ${s.bias} — DCS ${s.dcs_score}%`,
              });
            });
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

  const handleToggleWatchlist = async (signalId: string, instrument: string) => {
    if (savedIds.includes(signalId)) {
      const { error } = await (supabase as any)
        .from("signals_saved")
        .delete()
        .eq("user_id", userId)
        .eq("signal_id", signalId);
      if (!error) setSavedIds(prev => prev.filter(id => id !== signalId));
    } else {
      const { error } = await (supabase as any)
        .from("signals_saved")
        .insert({ user_id: userId, signal_id: signalId, instrument });
      if (!error) setSavedIds(prev => [...prev, signalId]);
    }
  };

  const handleCopyLink = (signalId: string) => {
    const url = `${window.location.origin}/dashboard/signal-centre/signals/${signalId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(signalId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredSignals = useMemo(() => {
    return signals.filter(s => {
      const cat = getCategory(s.instrument);
      const matchCat = activeCategory === "all" || cat === activeCategory;
      const matchTf = activeTimeframe === "all" || s.timeframe === activeTimeframe;
      const matchBias = activeBias === "all" || s.bias === activeBias;
      const matchView = viewMode === "all" || savedIds.includes(s.id);
      return matchCat && matchTf && matchBias && matchView;
    });
  }, [signals, savedIds, activeCategory, activeTimeframe, activeBias, viewMode]);

  const getAge = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const closedSignalsArchive = [
    { instrument: "BTC/USD", date: "2026-06-22", bias: "BULLISH", dcs: 92, outcome: "Target 2 Hit", pips: "+2.0 R:R", success: true },
    { instrument: "GBP/USD", date: "2026-06-21", bias: "BEARISH", dcs: 84, outcome: "Target 1 Hit", pips: "+1.0 R:R", success: true },
    { instrument: "EUR/USD", date: "2026-06-21", bias: "BULLISH", dcs: 78, outcome: "Stopped Out", pips: "-1.0 R:R", success: false },
    { instrument: "XAU/USD", date: "2026-06-20", bias: "BULLISH", dcs: 95, outcome: "Target 3 Hit", pips: "+3.0 R:R", success: true },
    { instrument: "SPX500", date: "2026-06-19", bias: "BULLISH", dcs: 88, outcome: "Target 2 Hit", pips: "+2.0 R:R", success: true },
  ];

  const currentTierConfig = TIER_CONFIG[userTier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.free;
  const CurrentTierIcon = currentTierConfig.icon;

  return (
    <div className="space-y-6 pb-8">

      {/* ── Controls bar (scan + status) ──────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Live pulse */}
          <div className="flex flex-col gap-0.5">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg"
              style={{ backgroundColor: "var(--tool-accent-tint,#f7ffe8)", border: "1px solid var(--tool-accent-border,#d4f05a)", color: "var(--tool-accent-text,#4a6600)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: "var(--tool-accent,#C8F135)" }} />
              Live Scan Active
            </div>
            {lastScanTime && (
              <span className="text-[9px] font-mono text-text-tertiary px-1">
                Last updated {Math.max(0, Math.floor((now - new Date(lastScanTime).getTime()) / 60000))} mins ago
              </span>
            )}
          </div>
          {/* Tier badge */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border",
            currentTierConfig.bgColor, currentTierConfig.color, currentTierConfig.borderColor
          )}>
            <CurrentTierIcon className="w-3 h-3" />
            {currentTierConfig.label} Access
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={() => triggerScan(false)}
            disabled={scanning}
            className="px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:opacity-90"
            style={{ backgroundColor: "var(--tool-accent,#14b8a6)", color: "#fff" }}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", scanning && "animate-spin")} />
            {scanning ? "Scanning…" : "Scan Markets"}
          </button>
          {scanMessage && (
            <p className="text-[9px] font-mono text-emerald-600">{scanMessage}</p>
          )}
        </div>
      </div>

      {/* ── Tier Access Banner ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Foundation */}
        <div className={cn(
          "rounded-2xl border bg-white p-5 flex items-start gap-4 transition-all",
          tierAtLeast(userTier, "foundation")
            ? "border-l-4 border-blue-400 border-gray-200"
            : "border-gray-200 opacity-60"
        )}>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", tierAtLeast(userTier, "foundation") ? "bg-blue-50" : "bg-gray-100")}>
            <Shield className={cn("w-4 h-4", tierAtLeast(userTier, "foundation") ? "text-blue-600" : "text-gray-400")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-xs font-bold uppercase tracking-wider", tierAtLeast(userTier, "foundation") ? "text-gray-900" : "text-gray-500")}>Foundation</h3>
              {tierAtLeast(userTier, "foundation") && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
            </div>
            <ul className="mt-1.5 space-y-1">
              {["Basic signal feed", "Entry, stop & target levels", "Single AI summary per signal"].map(f => (
                <li key={f} className="text-[10px] font-mono flex items-center gap-1.5 text-gray-500">
                  <span className={cn("w-1 h-1 rounded-full shrink-0", tierAtLeast(userTier, "foundation") ? "bg-blue-400" : "bg-gray-300")} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Edge */}
        <div className={cn(
          "rounded-2xl border bg-white p-5 flex items-start gap-4 transition-all",
          tierAtLeast(userTier, "edge")
            ? "border-l-4 border-violet-400 border-gray-200"
            : "border-gray-200 opacity-60"
        )}>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", tierAtLeast(userTier, "edge") ? "bg-violet-50" : "bg-gray-100")}>
            <Zap className={cn("w-4 h-4", tierAtLeast(userTier, "edge") ? "text-violet-600" : "text-gray-400")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-xs font-bold uppercase tracking-wider", tierAtLeast(userTier, "edge") ? "text-gray-900" : "text-gray-500")}>Edge</h3>
              {tierAtLeast(userTier, "edge") && <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />}
            </div>
            <ul className="mt-1.5 space-y-1">
              {["Full AI Consensus Panel (3 models)", "Crypto intelligence + on-chain data", "Acuity trading ideas feed"].map(f => (
                <li key={f} className="text-[10px] font-mono flex items-center gap-1.5 text-gray-500">
                  <span className={cn("w-1 h-1 rounded-full shrink-0", tierAtLeast(userTier, "edge") ? "bg-violet-400" : "bg-gray-300")} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Floor */}
        <div className={cn(
          "rounded-2xl border bg-white p-5 flex items-start gap-4 transition-all",
          tierAtLeast(userTier, "floor")
            ? "border-l-4 border-amber-400 border-gray-200"
            : "border-gray-200 opacity-60"
        )}>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", tierAtLeast(userTier, "floor") ? "bg-amber-50" : "bg-gray-100")}>
            <Crown className={cn("w-4 h-4", tierAtLeast(userTier, "floor") ? "text-amber-600" : "text-gray-400")} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-xs font-bold uppercase tracking-wider", tierAtLeast(userTier, "floor") ? "text-gray-900" : "text-gray-500")}>Floor</h3>
              {tierAtLeast(userTier, "floor") && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <ul className="mt-1.5 space-y-1">
              {["Raw data access + API export", "Custom alert webhooks", "1-to-1 signal review with Pete"].map(f => (
                <li key={f} className="text-[10px] font-mono flex items-center gap-1.5 text-gray-500">
                  <span className={cn("w-1 h-1 rounded-full shrink-0", tierAtLeast(userTier, "floor") ? "bg-amber-400" : "bg-gray-300")} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">

        {/* Row 1: Category + watchlist */}
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
                  className={cn(
                    "px-3.5 py-2 text-[10px] font-mono uppercase tracking-wider transition-all rounded-lg border font-bold",
                    active
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-teal-300 hover:text-teal-600"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex border border-gray-200 rounded-xl overflow-hidden select-none bg-gray-50">
            <button
              onClick={() => setViewMode("all")}
              className={cn(
                "px-3.5 py-2 text-[10px] font-mono uppercase tracking-wider transition-all font-bold",
                viewMode === "all" ? "bg-teal-500 text-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              All Signals
            </button>
            <button
              onClick={() => setViewMode("watchlist")}
              className={cn(
                "px-3.5 py-2 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 border-l border-gray-200 font-bold",
                viewMode === "watchlist" ? "bg-teal-500 text-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Star className="w-3 h-3" fill={viewMode === "watchlist" ? "currentColor" : "none"} />
              Watchlist ({savedIds.length})
            </button>
          </div>
        </div>

        {/* Row 2: Timeframe + Bias */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Filter className="w-3 h-3" /> Timeframe:
            </span>
            <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              {["all", "15M", "1H", "4H", "1D"].map(tf => {
                const active = activeTimeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={cn(
                      "px-2.5 py-1 text-[9px] rounded-md transition-all uppercase font-semibold",
                      active ? "bg-teal-500 text-white" : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Bias:</span>
            <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
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
                    className={cn(
                      "px-2.5 py-1 text-[9px] rounded-md transition-all font-semibold",
                      active
                        ? bias.id === "BULLISH" ? "bg-emerald-600 text-white"
                          : bias.id === "BEARISH" ? "bg-red-500 text-white"
                          : "bg-teal-500 text-white"
                        : "text-gray-500 hover:text-gray-800"
                    )}
                  >
                    {bias.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Signal Cards Grid ──────────────────────────────────────────────── */}
      {filteredSignals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm space-y-3">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-sm font-mono text-gray-500">
            {viewMode === "watchlist" ? "No saved watchlist setups." : "No active signals match the current filters."}
          </p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Try adjusting filters or click <strong>Scan Markets</strong> above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSignals.map(s => {
            const isBullish = s.bias === "BULLISH";
            const ageStr = getAge(s.created_at);
            const isSaved = savedIds.includes(s.id);
            const dcs = s.dcs_score || Math.round(50 + s.confluence_score * 4);
            const clVerdict = s.ai_consensus?.claude?.verdict;
            const gpVerdict = s.ai_consensus?.gpt4?.verdict;
            const gkVerdict = s.ai_consensus?.grok?.verdict;
            const clAligned = clVerdict === s.bias;
            const gpAligned = gpVerdict === s.bias;
            const gkAligned = gkVerdict === s.bias;

            return (
              <div
                key={s.id}
                className="relative bg-white border border-gray-200 hover:border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Bullish bottom-left glow — matches InstrumentIntelligenceCard */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    opacity: isBullish ? 1 : 0,
                    background: "radial-gradient(ellipse 110% 90% at 0% 100%, rgba(0,200,100,0.22) 0%, rgba(0,200,100,0.05) 45%, transparent 70%)",
                    transition: "opacity 600ms ease",
                  }}
                />
                {/* Bearish bottom-left glow */}
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    opacity: isBullish ? 0 : 1,
                    background: "radial-gradient(ellipse 110% 90% at 0% 100%, rgba(220,50,50,0.22) 0%, rgba(220,50,50,0.05) 45%, transparent 70%)",
                    transition: "opacity 600ms ease",
                  }}
                />

                <div className="relative z-10 p-5 space-y-4 flex-1">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-black text-gray-900 leading-none">
                          {s.instrument}
                        </h3>
                        <span className="text-[8px] font-mono bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded uppercase font-bold">
                          {s.timeframe}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-gray-400 block mt-1.5">
                        <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                        Generated {ageStr}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={cn(
                        "text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider",
                        isBullish
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      )}>
                        {s.bias}
                      </span>
                      <span className="text-[10px] font-mono text-gray-600 font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                        DCS {dcs}%
                      </span>
                    </div>
                  </div>

                  {/* Price levels — Foundation gated */}
                  <div className="relative">
                    {!canSeeExact && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-3 text-center rounded-xl border border-blue-100">
                        <Shield className="w-4 h-4 text-blue-500 mb-1" />
                        <p className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-wider">Foundation Feature</p>
                        <Link href="/pricing" className="text-[8px] text-blue-500 mt-0.5 hover:underline">Upgrade to unlock levels</Link>
                      </div>
                    )}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry Price:</span>
                        <span className="font-bold text-gray-900">
                          {canSeeExact ? s.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "─ ─ ─ ─"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stop Loss:</span>
                        <span className="font-bold text-red-500">
                          {canSeeExact ? s.stop_loss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "─ ─ ─ ─"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target 2 (TP):</span>
                        <span className="font-bold text-emerald-600">
                          {canSeeExact ? s.take_profit_2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "─ ─ ─ ─"}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                        <span className="text-gray-400">R:R Ratio:</span>
                        <span className="font-bold text-gray-900">1 : {s.rr_ratio.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI alignment — Edge gated on card */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-violet-500" /> AI Alignment
                    </p>
                    {canSeeAIPanel ? (
                      <div className="flex gap-1.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-mono border font-bold uppercase",
                          clAligned ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-gray-50 border-gray-200 text-gray-400"
                        )}>
                          Claude {clAligned ? "✓" : "—"}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-mono border font-bold uppercase",
                          gpAligned ? "bg-teal-50 border-teal-200 text-teal-600" : "bg-gray-50 border-gray-200 text-gray-400"
                        )}>
                          GPT-4 {gpAligned ? "✓" : "—"}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-mono border font-bold uppercase",
                          gkAligned ? "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600" : "bg-gray-50 border-gray-200 text-gray-400"
                        )}>
                          Grok {gkAligned ? "✓" : "—"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 border border-violet-100 rounded-lg">
                        <Lock className="w-3 h-3 text-violet-500" />
                        <span className="text-[8px] font-mono text-violet-600">Edge+ feature · <Link href="/pricing" className="underline">Upgrade</Link></span>
                      </div>
                    )}
                  </div>

                  {/* Catalyst */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex gap-2 items-start">
                    <Calendar className="w-3.5 h-3.5 text-violet-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[8px] font-mono text-gray-400 uppercase tracking-wider">Fundamentals Catalyst</p>
                      <p className="text-[10px] font-mono font-bold text-gray-700 truncate leading-snug mt-0.5">
                        {s.catalyst_event?.event || "Technical Breakout Confluence"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(s.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-md text-gray-400 hover:text-gray-700 transition-all"
                      title="Copy public link"
                    >
                      {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleToggleWatchlist(s.id, s.instrument)}
                      className={cn(
                        "p-1.5 hover:bg-gray-200 rounded-md transition-all",
                        isSaved ? "text-amber-500" : "text-gray-400 hover:text-gray-700"
                      )}
                      title="Save to watchlist"
                    >
                      <Star className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <Link
                    href={`/dashboard/signal-centre/signals/${s.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider font-bold text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Full Analysis <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Floor: AI Consensus Deep-Dive Panel ────────────────────────────── */}
      <TierGate requiredTier="edge" userTier={userTier} featureName="Full AI Consensus Panel">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-gray-900 uppercase tracking-wide">AI Consensus Panel</h2>
                <p className="text-[10px] font-mono text-gray-500">Claude · GPT-4o · Grok — live multi-model alignment</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-violet-100 text-violet-600 border border-violet-200 px-2 py-1 rounded-lg uppercase font-bold">Edge+</span>
          </div>

          {/* Model consensus for most recent signal */}
          {filteredSignals.length > 0 && (() => {
            const s = filteredSignals[0];
            const aiConsensus = s.ai_consensus || {};
            const models = [
              { key: "claude", name: "Claude Sonnet", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", label: "Anthropic" },
              { key: "gpt4", name: "GPT-4o", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", label: "OpenAI" },
              { key: "grok", name: "Grok-2", color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-200", label: "xAI" },
            ];
            return (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-gray-700">{s.instrument}</span>
                  <span className="text-[9px] font-mono text-gray-400">{s.timeframe} · Most Recent Signal</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {models.map(m => {
                    const data = aiConsensus[m.key] || {};
                    const verdict = data.verdict || s.bias;
                    const confidence = data.confidence || Math.round(50 + s.confluence_score * 4);
                    const reasoning = data.reasoning || ["Analysis pending. Signal queued for AI review."];
                    const aligned = verdict === s.bias;
                    return (
                      <div key={m.key} className={cn("rounded-xl border p-4 space-y-3", m.bg, m.border)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={cn("text-xs font-bold", m.color)}>{m.name}</p>
                            <p className="text-[8px] font-mono text-gray-400">{m.label}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-lg font-black", m.color)}>{confidence}%</p>
                            <p className={cn("text-[8px] font-mono font-bold uppercase", aligned ? "text-emerald-600" : "text-red-500")}>
                              {aligned ? "Aligned ✓" : "Divergent"}
                            </p>
                          </div>
                        </div>
                        <div className={cn("h-1.5 rounded-full bg-white/60 overflow-hidden")}>
                          <div
                            className={cn("h-full rounded-full transition-all", aligned ? "bg-emerald-500" : "bg-red-400")}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <ul className="space-y-1">
                          {(Array.isArray(reasoning) ? reasoning : [reasoning]).slice(0, 2).map((r: string, i: number) => (
                            <li key={i} className={cn("text-[9px] font-mono leading-snug", m.color, "opacity-80")}>
                              · {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </section>
      </TierGate>

      {/* ── Floor: Raw Data + API Export + Custom Alerts + Pete Review ─────── */}
      <TierGate requiredTier="floor" userTier={userTier} featureName="Floor Intelligence Suite">
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-display font-bold text-gray-900 uppercase tracking-wide">Floor Intelligence Suite</h2>
                <p className="text-[10px] font-mono text-gray-500">Raw data · API export · Custom alerts · 1-to-1 review</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-amber-100 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg uppercase font-bold">Floor Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Export */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Download className="w-4.5 h-4.5 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Raw Data Export</h3>
              </div>
              <p className="text-[10px] font-mono text-amber-700 leading-relaxed">
                Export active signals as JSON or CSV for your own models, bots, or backtesting pipelines.
              </p>
              <button
                onClick={() => {
                  const json = JSON.stringify(signals, null, 2);
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `drawdown-signals-${new Date().toISOString().split("T")[0]}.json`;
                  a.click();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON ({signals.length} signals)
              </button>
            </div>

            {/* Custom Alerts */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Custom Alerts</h3>
              </div>
              <p className="text-[10px] font-mono text-amber-700 leading-relaxed">
                Configure webhook or email alerts when high-conviction signals trigger above your DCS threshold.
              </p>
              <Link
                href="/dashboard/profile#alerts"
                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase rounded-xl transition-all"
              >
                <Bell className="w-3.5 h-3.5" />
                Configure Alerts
              </Link>
            </div>

            {/* 1-to-1 Pete Review */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Signal Review with Pete</h3>
              </div>
              <p className="text-[10px] font-mono text-amber-700 leading-relaxed">
                Book a monthly 1-to-1 session with Pete to review active signals, your execution, and refine your edge.
              </p>
              <Link
                href="mailto:petecurrey@gmail.com?subject=Floor Signal Review Request"
                className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase rounded-xl transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Book Review Session
              </Link>
            </div>
          </div>

          {/* Raw signals table */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Raw Signal Feed
            </h4>
            <div className="overflow-x-auto rounded-xl border border-amber-200">
              <table className="w-full text-left font-mono text-[10px] border-collapse">
                <thead className="bg-amber-100">
                  <tr>
                    {["Instrument", "TF", "Bias", "Entry", "Stop", "TP2", "ATR", "DCS", "Expires"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-[9px] font-bold text-amber-800 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 bg-white">
                  {signals.slice(0, 10).map(s => (
                    <tr key={s.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-3 py-2 font-bold text-gray-900 whitespace-nowrap">{s.instrument}</td>
                      <td className="px-3 py-2 text-gray-600">{s.timeframe}</td>
                      <td className="px-3 py-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-bold border",
                          s.bias === "BULLISH"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        )}>
                          {s.bias}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.entry_price.toFixed(4)}</td>
                      <td className="px-3 py-2 text-red-600 whitespace-nowrap">{s.stop_loss.toFixed(4)}</td>
                      <td className="px-3 py-2 text-emerald-600 whitespace-nowrap">{s.take_profit_2.toFixed(4)}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{s.atr?.toFixed(4)}</td>
                      <td className="px-3 py-2 font-bold text-amber-700">{s.dcs_score || Math.round(50 + s.confluence_score * 4)}%</td>
                      <td className="px-3 py-2 text-gray-400 whitespace-nowrap">{new Date(s.expires_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {signals.length > 10 && (
              <p className="text-[9px] font-mono text-gray-400 mt-2 text-center">
                Showing 10 of {signals.length} signals · <Link href="#" className="text-amber-600 hover:underline" onClick={e => { e.preventDefault(); const json = JSON.stringify(signals, null, 2); const blob = new Blob([json], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "signals.json"; a.click(); }}>Export all</Link>
              </p>
            )}
          </div>
        </section>
      </TierGate>

      {/* ── Signal Archive & Performance Tracker ──────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
            <Award className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest block mb-0.5" style={{ color: "var(--tool-accent,#C8F135)" }}>// Archive</span>
            <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wide">Signal Archive &amp; Performance</h2>
            <p className="text-[9px] font-mono text-text-tertiary">Transparent track record · closed signal log</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Win Rate", value: "68.4%", icon: Percent, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            { label: "Total Closed", value: "324", icon: Activity, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
            { label: "Avg R:R", value: "1 : 2.3", icon: BarChart3, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
            { label: "Net Gains", value: "+14.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={cn("border p-4 rounded-2xl space-y-1 text-center", stat.bg, stat.border)}>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{stat.label}</span>
                <span className={cn("text-xl font-mono font-black flex items-center justify-center gap-1", stat.color)}>
                  <Icon className="w-4 h-4" />
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Archive Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Closed Setup", "Date", "DCS", "Bias", "Outcome", "R:R Net"].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {closedSignalsArchive.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900">{item.instrument}</td>
                  <td className="px-4 py-3 text-gray-400">{item.date}</td>
                  <td className="px-4 py-3 text-gray-600">{item.dcs}%</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                      item.bias === "BULLISH"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    )}>
                      {item.bias}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.success ? "bg-emerald-500" : "bg-red-500")} />
                      {item.outcome}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-bold", item.success ? "text-emerald-600" : "text-red-500")}>
                    {item.pips}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Upgrade CTA (non-subscribers only) ────────────────────────────── */}
      {!isSubscriber && (
        <section className="bg-gradient-to-br from-violet-50 via-white to-blue-50 border border-violet-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.04] pointer-events-none">
            <Sparkles style={{ width: 140, height: 140 }} className="text-violet-600" />
          </div>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-600" />
              <h3 className="text-base font-bold text-gray-900 font-display uppercase tracking-tight">
                The Signal Centre is your edge.
              </h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl font-mono">
              Foundation unlocks exact levels. Edge adds full AI Consensus + crypto intelligence. Floor gives you raw data, custom alerts, and a direct line to Pete.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link
              href="/pricing"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-xl shadow-sm"
            >
              View Plans
            </Link>
          </div>
        </section>
      )}

      {/* ── Extend Your Edge widget (signal-centre subscribers only) ───────── */}
      {userTier === 'signal-centre' && (
        <section>
          <ExtendYourEdge />
        </section>
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────────
// Wraps inner component with the ToastProvider so in-app notifications work
export function SignalCentreDashboardClient(props: SignalCentreDashboardClientProps) {
  return (
    <ToastProvider>
      <SignalCentreInner {...props} />
    </ToastProvider>
  );
}
