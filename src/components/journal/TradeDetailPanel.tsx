"use client";

import React, { useState, useEffect } from "react";
import { X, Edit2, CheckCircle, Trash2, RefreshCw, Loader2, ExternalLink } from "lucide-react";
import type { TradeEntry, ParsedAiVerdict, VerdictType } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  trade: TradeEntry | null;
  allTrades: TradeEntry[];
  onClose: () => void;
  onUpdated: (trade: TradeEntry) => void;
  onDeleted: (id: string) => void;
  onEdit?: (trade: TradeEntry) => void;
  onReplay?: (trade: TradeEntry) => void;
}

type PanelTab = "details" | "verdict" | "chart";

const TV_SYMBOL_MAP: Record<string, string> = {
  GBPUSD: "FX:GBPUSD", EURUSD: "FX:EURUSD", USDJPY: "FX:USDJPY", GBPJPY: "FX:GBPJPY",
  AUDUSD: "FX:AUDUSD", USDCHF: "FX:USDCHF", EURJPY: "FX:EURJPY", EURGBP: "FX:EURGBP",
  USDCAD: "FX:USDCAD", NZDUSD: "FX:NZDUSD",
  XAUUSD: "OANDA:XAUUSD", XAGUSD: "OANDA:XAGUSD",
  SPX: "SP:SPX", NDX: "NASDAQ:NDX", DAX: "XETR:DAX", UK100: "OANDA:UK100GBP",
  BTCUSD: "BINANCE:BTCUSDT", ETHUSD: "BINANCE:ETHUSDT",
};

function tvSymbol(symbol: string): string {
  const upper = symbol.toUpperCase().replace("/","");
  return TV_SYMBOL_MAP[upper] ?? `FX:${upper}`;
}

const VERDICT_COLORS: Record<VerdictType, { border: string; bg: string; badge: string; text: string; label: string }> = {
  GOOD_PROCESS:   { border: "border-l-green-500",  bg: "bg-green-50",  badge: "bg-green-100 text-green-700",  text: "text-green-700",  label: "GOOD PROCESS" },
  POOR_PROCESS:   { border: "border-l-red-500",    bg: "bg-red-50",    badge: "bg-red-100 text-red-700",      text: "text-red-700",    label: "POOR PROCESS" },
  MIXED:          { border: "border-l-amber-500",  bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  text: "text-amber-700",  label: "MIXED" },
  REVIEW_NEEDED:  { border: "border-l-purple-500", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700",text: "text-purple-700", label: "REVIEW NEEDED" },
};

function DetailRow({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm font-bold text-black">{value ?? "—"}</span>
    </div>
  );
}

function StatGrid({ trade }: { trade: TradeEntry }) {
  const pnl = trade.pnl_amount;
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Left column */}
      <div className="space-y-3">
        <DetailRow label="Entry Price" value={trade.entry_price.toFixed(5)} />
        <DetailRow label="Stop Loss" value={trade.stop_loss.toFixed(5)} />
        <DetailRow label="Take Profit" value={trade.take_profit?.toFixed(5)} />
        <DetailRow label="Exit Price" value={trade.exit_price?.toFixed(5)} />
        <DetailRow label="Pips" value={trade.pips_gained != null ? `${trade.pips_gained > 0 ? "+" : ""}${trade.pips_gained.toFixed(1)}` : undefined} />
        <DetailRow label="Duration" value={trade.duration_minutes != null ? `${Math.floor(trade.duration_minutes / 60)}h ${trade.duration_minutes % 60}m` : undefined} />
      </div>
      {/* Right column */}
      <div className="space-y-3">
        <DetailRow label="Position Size" value={`${trade.position_size_lots} lots`} />
        <DetailRow label="Risk Amount" value={trade.risk_amount != null ? `£${trade.risk_amount.toFixed(2)}` : undefined} />
        <DetailRow label="Risk %" value={trade.risk_percent != null ? `${trade.risk_percent.toFixed(2)}%` : undefined} />
        <DetailRow label="RR Planned" value={trade.rr_planned != null ? `${trade.rr_planned.toFixed(2)}:1` : undefined} />
        <DetailRow label="RR Achieved" value={trade.rr_achieved != null ? `${trade.rr_achieved.toFixed(2)}:1` : undefined} />
        <DetailRow label="P&L %"
          value={trade.pnl_percent != null
            ? <span className={trade.pnl_percent >= 0 ? "text-green-600" : "text-red-600"}>{trade.pnl_percent >= 0 ? "+" : ""}{trade.pnl_percent.toFixed(2)}%</span>
            : undefined}
        />
      </div>
      {/* Separator */}
      <div className="col-span-2 border-t border-gray-100" />
      <DetailRow label="Session" value={trade.session} />
      <DetailRow label="Entry Time" value={new Date(trade.entry_time).toLocaleString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })} />
      <DetailRow label="Setup Type" value={trade.setup_type} />
      <DetailRow label="Market Conditions" value={trade.market_conditions} />
      {trade.confluences?.length ? (
        <div className="col-span-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Confluences</span>
          <div className="flex flex-wrap gap-1">
            {trade.confluences.map(c => <span key={c} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--tool-accent-tint)] text-[var(--tool-accent-text)] border border-[var(--tool-accent-border)]">{c}</span>)}
          </div>
        </div>
      ) : null}
      {trade.mistakes?.length ? (
        <div className="col-span-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Mistakes</span>
          <div className="flex flex-wrap gap-1">
            {trade.mistakes.map(m => <span key={m} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{m}</span>)}
          </div>
        </div>
      ) : null}
      {trade.emotions_before && (
        <DetailRow label="Emotion Before" value={trade.emotions_before} />
      )}
      {trade.emotions_during && (
        <DetailRow label="Emotion During" value={trade.emotions_during} />
      )}
      {trade.rules_followed != null && (
        <DetailRow label="Rules Followed" value={trade.rules_followed ? "✅ Yes" : "❌ No"} />
      )}
      {trade.pre_trade_notes && (
        <div className="col-span-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Pre-Trade Notes</span>
          <p className="text-xs text-gray-600 leading-relaxed">{trade.pre_trade_notes}</p>
        </div>
      )}
      {trade.post_trade_notes && (
        <div className="col-span-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Post-Trade Notes</span>
          <p className="text-xs text-gray-600 leading-relaxed">{trade.post_trade_notes}</p>
        </div>
      )}
      {trade.prop_firm && (
        <div className="col-span-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-3">
          <DetailRow label="Prop Firm" value={trade.prop_firm} />
          <DetailRow label="Account" value={trade.prop_account_id} />
          <DetailRow label="Phase" value={trade.prop_phase} />
        </div>
      )}
    </div>
  );
}

function VerdictPanel({ trade, allTrades, onRefresh }: { trade: TradeEntry; allTrades: TradeEntry[]; onRefresh: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateVerdict() {
    setGenerating(true); setError(null);
    try {
      const recent = allTrades
        .filter(t => t.status === "CLOSED" && t.id !== trade.id)
        .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime())
        .slice(0, 30);
      const res = await fetch("/api/journal/ai-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade_id: trade.id, trade, recent_trades: recent }),
      });
      if (!res.ok) throw new Error(await res.text());
      onRefresh();
    } catch (e: any) { setError(e.message); }
    finally { setGenerating(false); }
  }

  if (!trade.ai_verdict && !trade.ai_verdict_generated_at) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-12 h-12 rounded-full border border-[var(--tool-accent-border)] bg-[var(--tool-accent-tint)] flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <p className="text-sm font-bold text-black mb-1">AI Analysis Pending</p>
          <p className="text-xs text-gray-400">Generate a coaching verdict for this trade.</p>
        </div>
        <button onClick={generateVerdict} disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--tool-accent)] hover:bg-[var(--tool-accent-hover)] text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-60">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : "🤖"}
          Generate AI Verdict
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  if (!trade.ai_verdict) {
    return <p className="text-sm text-gray-400 py-8 text-center">Analysis unavailable. Try regenerating.</p>;
  }

  let parsed: ParsedAiVerdict;
  try { parsed = JSON.parse(trade.ai_verdict); }
  catch { return <p className="text-sm text-red-600 py-8 text-center">Verdict data corrupted. Regenerate to fix.</p>; }

  const vc = VERDICT_COLORS[parsed.verdict] ?? VERDICT_COLORS.MIXED;

  // Count pattern occurrences
  const patternCount = parsed.pattern_flag
    ? allTrades.filter(t => {
        if (!t.ai_verdict) return false;
        try { return JSON.parse(t.ai_verdict).pattern_flag === parsed.pattern_flag; }
        catch { return false; }
      }).length
    : 0;

  const scoreColor = parsed.score >= 70 ? "#16a34a" : parsed.score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="space-y-3">
      <div className={cn("rounded-xl border-l-4 p-5 space-y-4", vc.border, vc.bg)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">AI VERDICT · {trade.symbol} · Process Score</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-black text-black">{parsed.score}</span>
              <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-full", vc.badge)}>{vc.label}</span>
            </div>
          </div>
          <button onClick={generateVerdict} disabled={generating}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors" title="Re-generate">
            {generating ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" /> : <RefreshCw className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* Score bar */}
        <div className="w-full bg-white/70 rounded-full h-2">
          <div className="h-2 rounded-full transition-all" style={{ width: `${parsed.score}%`, backgroundColor: scoreColor }} />
        </div>

        {/* Headline */}
        <p className={cn("text-sm italic font-semibold leading-relaxed border-t border-black/10 pt-3", vc.text)}>
          "{parsed.headline}"
        </p>

        {/* What went well */}
        <div className="border-t border-black/10 pt-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">✅ WHAT WENT WELL</p>
          <p className="text-xs text-gray-700 leading-relaxed">{parsed.what_went_well}</p>
        </div>

        {/* What to improve */}
        <div className="border-t border-black/10 pt-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">🔧 WHAT TO IMPROVE</p>
          <p className="text-xs text-gray-700 leading-relaxed">{parsed.what_to_improve}</p>
        </div>

        {/* Key lesson */}
        <div className="border-t border-black/10 pt-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">💡 KEY LESSON</p>
          <p className="text-xs text-gray-700 leading-relaxed">{parsed.key_lesson}</p>
        </div>

        {/* Pattern flag */}
        {parsed.pattern_flag && (
          <div className="border-t border-black/10 pt-3 flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">PATTERN: {parsed.pattern_flag}</p>
              {patternCount > 1 && (
                <p className="text-[10px] text-gray-600 mt-0.5">
                  This is the {patternCount}{patternCount === 2 ? "nd" : patternCount === 3 ? "rd" : "th"} time in your last 30 trades.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      {trade.ai_verdict_generated_at && (
        <p className="text-[9px] text-gray-400 text-center">
          Generated {new Date(trade.ai_verdict_generated_at).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
        </p>
      )}
    </div>
  );
}

function ChartPanel({ trade, onReplay }: { trade: TradeEntry; onReplay?: () => void }) {
  const symbol = tvSymbol(trade.symbol);
  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv_detail&symbol=${encodeURIComponent(symbol)}&interval=60&theme=light&style=1&locale=en&toolbar_bg=%23f1f3f6&hide_side_toolbar=0`;

  return (
    <div className="space-y-3">
      {trade.chart_screenshot_url && (
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Entry Screenshot</p>
          <img src={trade.chart_screenshot_url} alt="Trade chart" className="w-full rounded-xl border border-gray-100 object-cover max-h-48" />
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Live Chart — {trade.symbol}</p>
          <a href={`https://www.tradingview.com/chart/?symbol=${symbol}`} target="_blank" rel="noopener"
            className="flex items-center gap-1 text-[9px] text-[var(--tool-accent-text)] hover:text-black transition-colors font-bold">
            Open in TradingView <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <iframe
          title="TradingView Chart"
          src={iframeUrl}
          className="w-full h-[280px] rounded-xl border border-gray-100"
          allowTransparency
          allowFullScreen
        />
      </div>
      {onReplay && (
        <button onClick={onReplay}
          className="w-full py-3 flex items-center justify-center gap-2 border border-[var(--tool-accent-border)] bg-[var(--tool-accent-tint)] rounded-xl text-[11px] font-black uppercase tracking-widest text-[var(--tool-accent-text)] hover:bg-[var(--tool-accent-border)] transition-all">
          ▶ REPLAY TRADE
        </button>
      )}
    </div>
  );
}

export function TradeDetailPanel({ trade, allTrades, onClose, onUpdated, onDeleted, onEdit, onReplay }: Props) {
  const [tab, setTab] = useState<PanelTab>("details");
  const [localTrade, setLocalTrade] = useState<TradeEntry | null>(trade);
  const [deleting, setDeleting] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [exitPrice, setExitPrice] = useState("");
  const [exitTime, setExitTime] = useState(new Date().toISOString().slice(0, 16));
  const [closing, setClosing] = useState(false);

  useEffect(() => { setLocalTrade(trade); }, [trade]);

  function refreshTrade() {
    if (!localTrade) return;
    fetch(`/api/journal/trade-entries/${localTrade.id}`)
      .then(r => r.json())
      .then(d => { if (d.trade) { setLocalTrade(d.trade); onUpdated(d.trade); } })
      .catch(() => {});
  }

  async function handleDelete() {
    if (!localTrade || !confirm("Delete this trade permanently?")) return;
    setDeleting(true);
    await fetch(`/api/journal/trade-entries/${localTrade.id}`, { method: "DELETE" });
    onDeleted(localTrade.id);
    onClose();
  }

  async function handleCloseTrade() {
    if (!localTrade || !exitPrice) return;
    setClosing(true);
    try {
      const ep = parseFloat(exitPrice);
      const pnlAmount = localTrade.direction === "BUY"
        ? (ep - localTrade.entry_price) * localTrade.position_size_lots * 100000 * 0.0001
        : (localTrade.entry_price - ep) * localTrade.position_size_lots * 100000 * 0.0001;
      const rrAchieved = localTrade.rr_planned && localTrade.risk_amount
        ? pnlAmount / localTrade.risk_amount : null;

      const res = await fetch(`/api/journal/trade-entries/${localTrade.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CLOSED",
          exit_price: ep,
          exit_time: new Date(exitTime).toISOString(),
          pnl_amount: pnlAmount,
          rr_achieved: rrAchieved,
          duration_minutes: Math.round((new Date(exitTime).getTime() - new Date(localTrade.entry_time).getTime()) / 60000),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { trade: updated } = await res.json();
      setLocalTrade(updated);
      onUpdated(updated);
      setShowCloseModal(false);
      // Trigger AI verdict
      fetch("/api/journal/ai-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade_id: updated.id, trade: updated, recent_trades: [] }),
      }).catch(() => {});
    } catch (e: any) { alert("Failed to close trade: " + e.message); }
    finally { setClosing(false); }
  }

  if (!trade || !localTrade) return null;

  const pnl = localTrade.pnl_amount;
  const isOpen = localTrade.status === "OPEN";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-black">{localTrade.symbol}</h2>
                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full",
                  localTrade.direction === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  {localTrade.direction}
                </span>
                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full",
                  isOpen ? "bg-amber-100 text-amber-700" : localTrade.status === "CANCELLED" ? "bg-gray-100 text-gray-500" : "bg-gray-100 text-gray-600")}>
                  {localTrade.status}
                </span>
              </div>
              {pnl != null && (
                <p className={cn("text-3xl font-black mt-1", pnl >= 0 ? "text-green-600" : "text-red-600")}>
                  {pnl >= 0 ? "+" : ""}£{Math.abs(pnl).toFixed(0)}
                </p>
              )}
              {isOpen && <p className="text-xs text-amber-600 font-bold mt-1">Position Open</p>}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {(["details","verdict","chart"] as PanelTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  tab === t ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200")}>
                {t === "details" ? "Details" : t === "verdict" ? "🤖 AI Verdict" : "📊 Chart"}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "details" && <StatGrid trade={localTrade} />}
          {tab === "verdict" && (
            <VerdictPanel trade={localTrade} allTrades={allTrades}
              onRefresh={() => { setTimeout(refreshTrade, 2000); }} />
          )}
          {tab === "chart" && (
            <ChartPanel trade={localTrade}
              onReplay={onReplay ? () => onReplay(localTrade) : undefined} />
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit?.(localTrade)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          {isOpen && (
            <button onClick={() => setShowCloseModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-green-200 bg-green-50 rounded-lg text-[10px] font-bold text-green-700 hover:bg-green-100 transition-all">
              <CheckCircle className="w-3.5 h-3.5" /> Close Trade
            </button>
          )}
          <button onClick={handleDelete} disabled={deleting}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-red-200 bg-red-50 rounded-lg text-[10px] font-bold text-red-700 hover:bg-red-100 transition-all disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Close Trade Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCloseModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 space-y-4 z-10 animate-in zoom-in-95 duration-150">
            <h3 className="font-black text-black">Close Trade — {localTrade.symbol}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Exit Price</label>
                <input type="number" value={exitPrice} onChange={e => setExitPrice(e.target.value)} placeholder="Enter exit price"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--tool-accent)]" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Exit Time</label>
                <input type="datetime-local" value={exitTime} onChange={e => setExitTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[var(--tool-accent)]" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCloseModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleCloseTrade} disabled={closing || !exitPrice}
                className="flex-1 py-2.5 bg-[var(--tool-accent)] rounded-lg text-[10px] font-black text-white hover:bg-[var(--tool-accent-hover)] transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                {closing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
