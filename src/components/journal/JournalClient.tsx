"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Upload, RefreshCw, BookOpen, BarChart2, Calendar, Bot } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TradeEntry } from "./types";
import { LogView } from "./LogView";
import { AnalyticsView } from "./AnalyticsView";
import { CalendarView } from "./CalendarView";
import { AiCoach } from "./AiCoach";
import { LogTradeModal } from "./LogTradeModal";
import { TradeDetailPanel } from "./TradeDetailPanel";

// ─── Design tokens (journal uses cyan accent, white cards) ────────────────────
const CYAN = "var(--tool-accent)";

type View = "log" | "analytics" | "calendar" | "coach";

const VIEWS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "log",       label: "Trade Log",  icon: BookOpen  },
  { id: "analytics", label: "Analytics",  icon: BarChart2 },
  { id: "calendar",  label: "Calendar",   icon: Calendar  },
  { id: "coach",     label: "AI Coach",   icon: Bot       },
];

interface JournalClientProps {
  initialView: View;
  userId:      string;
}

export function JournalClient({ initialView, userId }: JournalClientProps) {
  const [activeView, setActiveView]         = useState<View>(initialView);
  const [trades, setTrades]                 = useState<TradeEntry[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [showLogModal, setShowLogModal]     = useState(false);
  const [prefill, setPrefill]               = useState<Partial<TradeEntry> | undefined>();
  const [selectedTrade, setSelectedTrade]   = useState<TradeEntry | null>(null);
  const [refreshKey, setRefreshKey]         = useState(0);

  // ── Sync view from URL searchParam ──────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("view") as View | null;
    if (v && VIEWS.some(x => x.id === v)) setActiveView(v);
  }, []);

  function switchView(v: View) {
    setActiveView(v);
    const url = new URL(window.location.href);
    url.searchParams.set("view", v);
    window.history.replaceState({}, "", url.toString());
  }

  // ── Fetch trades ─────────────────────────────────────────────────────────────
  const fetchTrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("trade_entries" as any)
        .select("*")
        .eq("user_id", userId)
        .order("trading_day", { ascending: false })
        .order("created_at",  { ascending: false });

      if (err) throw err;
      setTrades((data ?? []) as TradeEntry[]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load trades.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchTrades(); }, [fetchTrades, refreshKey]);

  // ── Handlers ──────────────────────────────────────────────────────────────────
  function handleSaved(trade: TradeEntry) {
    setTrades(prev => {
      const exists = prev.some(t => t.id === trade.id);
      return exists
        ? prev.map(t => t.id === trade.id ? trade : t)
        : [trade, ...prev];
    });
    setShowLogModal(false);
    setPrefill(undefined);
  }

  function handleDelete(id: string) {
    setTrades(prev => prev.filter(t => t.id !== id));
    if (selectedTrade?.id === id) setSelectedTrade(null);
  }

  function handleSelectTrade(trade: TradeEntry) {
    setSelectedTrade(trade);
  }

  function handleEdit(trade: TradeEntry) {
    setPrefill(trade);
    setShowLogModal(true);
    setSelectedTrade(null);
  }

  const closedTrades = useMemo(
    () => trades.filter(t => t.status === "CLOSED"),
    [trades]
  );

  // Quick stats for the header bar
  const stats = useMemo(() => {
    const totalPnl  = closedTrades.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
    const wins      = closedTrades.filter(t => (t.pnl_amount ?? 0) > 0).length;
    const winRate   = closedTrades.length > 0
      ? Math.round((wins / closedTrades.length) * 100) : 0;
    return { totalPnl, winRate, total: closedTrades.length };
  }, [closedTrades]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <header className="space-y-4">
        {/* Eyebrow */}
        <p
          className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
          style={{ color: CYAN }}
        >
          AI_JOURNAL // PERFORMANCE
        </p>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-black uppercase leading-none" style={{ fontSize: 32 }}>
              TRADE{" "}
              <span style={{ color: CYAN }}>JOURNAL.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Every trade logged. Every pattern found. Every edge revealed.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-gray-200 hover:border-gray-400 text-gray-500 hover:text-gray-900 transition-all disabled:opacity-40"
              title="Refresh trades"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => { setPrefill(undefined); setShowLogModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black transition-all hover:opacity-90"
              style={{ backgroundColor: CYAN }}
            >
              <Plus className="w-3.5 h-3.5" />
              Log Trade
            </button>
          </div>
        </div>

        {/* Quick-stat bar */}
        {!loading && trades.length > 0 && (
          <div className="flex flex-wrap gap-4 py-3 px-4 bg-white border border-gray-100 shadow-sm">
            <StatPill label="Closed Trades" value={String(stats.total)} />
            <StatPill
              label="Total P&amp;L"
              value={`${stats.totalPnl >= 0 ? "+" : ""}£${Math.abs(stats.totalPnl).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              color={stats.totalPnl >= 0 ? "#16a34a" : "#dc2626"}
            />
            <StatPill
              label="Win Rate"
              value={`${stats.winRate}%`}
              color={stats.winRate >= 50 ? "#16a34a" : stats.winRate >= 40 ? "#d97706" : "#dc2626"}
            />
          </div>
        )}
      </header>

      {/* ── View tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200">
        {VIEWS.map(v => {
          const Icon = v.icon;
          const active = activeView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => switchView(v.id)}
              className="flex items-center gap-2 px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-widest transition-all relative"
              style={{
                color: active ? CYAN : "#9ca3af",
                borderBottom: active ? `2px solid ${CYAN}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* ── Loading skeleton ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded" />
          ))}
        </div>
      )}

      {/* ── Error state ────────────────────────────────────────────────────────── */}
      {!loading && error && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200">
          <p className="text-sm text-red-600 font-mono">{error}</p>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="text-xs font-mono uppercase tracking-wider text-red-500 hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────────── */}
      {!loading && !error && trades.length === 0 && activeView !== "coach" && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-full border-2"
            style={{ borderColor: "var(--tool-accent-border)", backgroundColor: "var(--tool-accent-tint)" }}
          >
            <BookOpen className="w-7 h-7" style={{ color: CYAN }} />
          </div>
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">No trades yet</p>
          <p className="text-xs text-gray-400 max-w-xs">
            Log your first trade to start building your edge. Every pattern starts with one data point.
          </p>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-black"
            style={{ backgroundColor: CYAN }}
          >
            Log Your First Trade
          </button>
        </div>
      )}

      {/* ── Views ─────────────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="relative">
          {activeView === "log" && trades.length > 0 && (
            <LogView trades={trades} onSelectTrade={handleSelectTrade} />
          )}
          {activeView === "analytics" && (
            <AnalyticsView trades={closedTrades} />
          )}
          {activeView === "calendar" && (
            <CalendarView trades={trades} onSelectTrade={handleSelectTrade} />
          )}
          {activeView === "coach" && (
            <AiCoach trades={trades} />
          )}
        </div>
      )}

      {/* ── Trade detail side panel ────────────────────────────────────────────── */}
      {selectedTrade && (
        <TradeDetailPanel
          trade={selectedTrade}
          allTrades={trades}
          onClose={() => setSelectedTrade(null)}
          onUpdated={handleSaved}
          onDeleted={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {/* ── Log / Edit trade modal ─────────────────────────────────────────────── */}
      {showLogModal && (
        <LogTradeModal
          open={showLogModal}
          onClose={() => { setShowLogModal(false); setPrefill(undefined); }}
          onSaved={handleSaved}
          prefill={prefill}
        />
      )}
    </div>
  );
}

// ─── Micro stat pill ──────────────────────────────────────────────────────────
function StatPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">{label}</span>
      <span
        className="text-sm font-display font-bold"
        style={{ color: color ?? "#111" }}
      >
        {value}
      </span>
    </div>
  );
}
