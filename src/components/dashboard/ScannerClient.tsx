"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, DollarSign, BarChart3, Zap, Gem, Activity,
  Grid3X3, List, Star, Bell, BellRing, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, Shield,
  Calendar, Newspaper, Eye, EyeOff, X, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TradingViewTechnicalWidget } from "@/components/market/TradingViewTechnicalWidget";
import { useTwelveData } from "@/hooks/useTwelveData";
import { useTechnicalData } from "@/hooks/useTechnicalData";
import type { InstrumentData } from "@/hooks/useTwelveData";
import type { TechnicalSummary, Signal, Consensus, TimeframeRow } from "@/hooks/useTechnicalData";
import { CENTRAL_BANK_RATES, STATIC_RATES_UPDATED } from "@/data/centralBankRates";
import { CFTC_CODES } from "@/data/cftcCodes";

// ─── Types ────────────────────────────────────────────────────────────────────

type MarketCategory = "forex" | "commodities" | "indices" | "crypto";
type ViewMode = "grid" | "list";
type FilterMode = "ALL" | "FOREX" | "INDEX" | "COMMODITY" | "CRYPTO" | "WATCHLIST" | "SIGNALS";
type SortMode = "name" | "change" | "atr" | "volume" | "score";
type CardTab = "TECHNICAL" | "MACRO" | "SMART MONEY" | "AI";

interface ScannerInstrument {
  scannerSlug: string; displayPair: string; tvSymbol: string; category: MarketCategory;
}
interface AlertItem {
  id: string; slug: string; type: "price" | "rsi" | "volume" | "consensus";
  value: number; label: string; createdAt: string;
}
interface PatternResult {
  patterns: { name: string; type: string; confidence: number; description: string }[];
  commentary: string; trendBias: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SCANNER_INSTRUMENTS: ScannerInstrument[] = [
  { scannerSlug: "EURUSD",  displayPair: "EUR/USD", tvSymbol: "FX:EURUSD",       category: "forex"       },
  { scannerSlug: "GBPUSD",  displayPair: "GBP/USD", tvSymbol: "FX:GBPUSD",       category: "forex"       },
  { scannerSlug: "USDJPY",  displayPair: "USD/JPY", tvSymbol: "FX:USDJPY",       category: "forex"       },
  { scannerSlug: "GBPJPY",  displayPair: "GBP/JPY", tvSymbol: "FX:GBPJPY",       category: "forex"       },
  { scannerSlug: "XAGUSD",  displayPair: "XAG/USD", tvSymbol: "OANDA:XAGUSD",    category: "commodities" },
  { scannerSlug: "UKX",     displayPair: "UK100",   tvSymbol: "TVC:UKX",         category: "indices"     },
  { scannerSlug: "SPX",     displayPair: "US500",   tvSymbol: "TVC:SPX",         category: "indices"     },
  { scannerSlug: "NDX",     displayPair: "NAS100",  tvSymbol: "TVC:NDX",         category: "indices"     },
  { scannerSlug: "DJI",     displayPair: "US30",    tvSymbol: "TVC:DJI",         category: "indices"     },
  { scannerSlug: "BTCUSDT", displayPair: "BTC/USD", tvSymbol: "BINANCE:BTCUSDT", category: "crypto"      },
  { scannerSlug: "ETHUSDT", displayPair: "ETH/USD", tvSymbol: "BINANCE:ETHUSDT", category: "crypto"      },
  { scannerSlug: "XRPUSDT", displayPair: "XRP/USD", tvSymbol: "BINANCE:XRPUSDT", category: "crypto"      },
];

const ALL_SLUGS = SCANNER_INSTRUMENTS.map(i => i.scannerSlug);

const CATEGORY_ICON: Record<MarketCategory, React.ElementType> = {
  forex: DollarSign, commodities: Gem, indices: BarChart3, crypto: Zap,
};
const CATEGORY_LABEL: Record<MarketCategory, string> = {
  forex: "Forex", commodities: "Commodity", indices: "Index", crypto: "Crypto",
};

const CONSENSUS_STYLE: Record<Consensus, string> = {
  "STRONG BUY":  "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  "BUY":         "bg-green-500/15  text-green-400  border-green-500/30",
  "NEUTRAL":     "bg-white/10      text-gray-400   border-white/20",
  "SELL":        "bg-red-500/15   text-red-400    border-red-500/30",
  "STRONG SELL": "bg-red-700/20   text-red-500    border-red-700/40",
};

const RETAIL_MOCK: Record<string, { longPct: number; shortPct: number }> = {
  EURUSD:{longPct:52,shortPct:48}, GBPUSD:{longPct:45,shortPct:55},
  USDJPY:{longPct:38,shortPct:62}, GBPJPY:{longPct:61,shortPct:39},
  BTCUSDT:{longPct:68,shortPct:32}, ETHUSDT:{longPct:63,shortPct:37},
  XRPUSDT:{longPct:71,shortPct:29}, XAGUSD:{longPct:55,shortPct:45},
  UKX:{longPct:48,shortPct:52}, SPX:{longPct:44,shortPct:56},
  NDX:{longPct:41,shortPct:59}, DJI:{longPct:43,shortPct:57},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, slug: string): string {
  if (!price) return "—";
  if (slug.includes("JPY")) return price.toFixed(3);
  if (["UKX","SPX","NDX","DJI"].includes(slug)) return price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (["BTCUSDT","ETHUSDT"].includes(slug)) return price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (slug === "XAGUSD" || slug === "XRPUSDT") return price.toFixed(4);
  return price.toFixed(5);
}

function formatTime(date: Date | null): string {
  if (!date) return "—";
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1m ago";
  return `${mins}m ago`;
}

function getActiveSessions(utcHour: number): string[] {
  const s: string[] = [];
  if (utcHour >= 0 && utcHour < 9)   s.push("ASIA");
  if (utcHour >= 8 && utcHour < 17)  s.push("LONDON");
  if (utcHour >= 13 && utcHour < 22) s.push("NEW YORK");
  return s;
}

function getInstrumentSession(inst: ScannerInstrument, activeSessions: string[]): string {
  if (inst.category === "crypto") return "24/7";
  if (activeSessions.length === 0) return "CLOSED";
  if (inst.category === "indices") {
    if ((inst.scannerSlug === "UKX") && activeSessions.includes("LONDON")) return "LONDON";
    if (["SPX","NDX","DJI"].includes(inst.scannerSlug) && activeSessions.includes("NEW YORK")) return "NEW YORK";
    return "CLOSED";
  }
  return activeSessions.join(" / ");
}

function calcSetupScore(data: InstrumentData, tech: TechnicalSummary): number {
  if (!data.price) return 0;
  let score = 0;
  score += Math.round(((tech.totalScore + 5) / 10) * 30);
  if (data.volumePct && data.volumePct > 100) score += Math.min(10, Math.round((data.volumePct - 100) / 10));
  if (data.atr && data.atr > 0) score += 10;
  if (tech.emaStack.above20 !== null) score += tech.emaStack.above20 === (tech.consensus === "BUY" || tech.consensus === "STRONG BUY") ? 8 : 0;
  if (tech.emaStack.above50 !== null) score += tech.emaStack.above50 === (tech.consensus === "BUY" || tech.consensus === "STRONG BUY") ? 7 : 0;
  return Math.min(100, Math.max(0, score));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SetupScoreDial({ score, size = 60 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#00c853" : score >= 40 ? "#ff9800" : "#f44336";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <span className="absolute text-xs font-bold font-mono" style={{ color }}>{score}</span>
    </div>
  );
}

function SignalArrow({ signal }: { signal: Signal }) {
  if (signal === "BUY")  return <TrendingUp  className="w-3 h-3 text-emerald-400 inline" />;
  if (signal === "SELL") return <TrendingDown className="w-3 h-3 text-red-400    inline" />;
  return <Minus className="w-3 h-3 text-gray-500 inline" />;
}

function SkeletonCard() {
  return (
    <div className="bg-background-surface/60 border border-border-slate/40 rounded-none p-5 animate-pulse space-y-3">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      <div className="h-8 bg-white/10 rounded w-2/3" />
      <div className="h-10 bg-white/5 rounded" />
      <div className="h-3 bg-white/10 rounded w-1/2" />
    </div>
  );
}

// ─── Market Status Bar ────────────────────────────────────────────────────────

function MarketStatusBar({ lastUpdated }: { lastUpdated: Date | null }) {
  const [utcTime, setUtcTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setUtcTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const utcH = utcTime.getUTCHours();
  const sessions = getActiveSessions(utcH);
  const utcStr = utcTime.toUTCString().split(" ").slice(4, 5)[0];

  const SESSION_CONFIG = [
    { name: "ASIA",     open: utcH >= 0 && utcH < 9,   hours: "00:00–09:00" },
    { name: "LONDON",   open: utcH >= 8 && utcH < 17,  hours: "08:00–17:00" },
    { name: "NEW YORK", open: utcH >= 13 && utcH < 22, hours: "13:00–22:00" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 bg-background-elevated border border-border-slate/40 rounded-none mb-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-primary font-bold">
          {utcStr} UTC
        </span>
      </div>
      <div className="h-3 w-px bg-border-slate/40 hidden sm:block" />
      <div className="flex items-center gap-3">
        {SESSION_CONFIG.map(s => (
          <div key={s.name} className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", s.open ? "bg-[#00c853]" : "bg-white/20")} />
            <span className={cn("font-mono text-[9px] uppercase tracking-widest",
              s.open ? "text-text-primary font-semibold" : "text-text-tertiary")}>
              {s.name}
            </span>
            {s.open && <span className="text-[8px] font-mono text-emerald-400">OPEN</span>}
          </div>
        ))}
      </div>
      <div className="ml-auto font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
        Updated {formatTime(lastUpdated)}
      </div>
    </div>
  );
}

// ─── Technical Tab ────────────────────────────────────────────────────────────

function TechnicalTab({ tech, price, slug }: { tech: TechnicalSummary; price: number | null; slug: string }) {
  if (tech.loading) return <div className="p-6 text-center text-text-tertiary text-xs font-mono animate-pulse">Loading technical data…</div>;
  if (tech.error || tech.rows.length === 0) return (
    <div className="p-6 text-center text-text-tertiary text-xs font-mono">
      <p>No API key configured.</p>
      <p className="mt-1 text-[10px]">Set NEXT_PUBLIC_TWELVE_DATA_KEY to enable live technical data.</p>
    </div>
  );

  const { rows, totalScore, emaStack, keyLevels } = tech;
  const fmt = (n: number | null) => n ? formatPrice(n, slug) : "—";
  const s2 = keyLevels.s2, r2 = keyLevels.r2;
  const pricePct = price && s2 !== null && r2 !== null && r2 !== s2
    ? Math.max(0, Math.min(100, ((price - s2) / (r2 - s2)) * 100)) : 50;
  const minsAgo = tech.lastUpdated ? Math.floor((Date.now() - tech.lastUpdated.getTime()) / 60000) : null;

  return (
    <div className="p-5 space-y-5">
      {minsAgo !== null && (
        <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
          <RefreshCw className="w-2.5 h-2.5" /> TA refreshed {minsAgo < 1 ? "just now" : `${minsAgo}m ago`}
        </p>
      )}
      {/* Multi-TF Table */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">
          Multi-Timeframe Signals
        </p>
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-text-tertiary border-b border-border-slate/20">
              <th className="py-1.5 text-left font-normal">TF</th>
              <th className="py-1.5 text-center font-normal">MA(20)</th>
              <th className="py-1.5 text-center font-normal">RSI</th>
              <th className="py-1.5 text-center font-normal">MACD</th>
              <th className="py-1.5 text-center font-normal">Overall</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/10">
            {rows.map(row => (
              <tr key={row.tf} className="hover:bg-white/5 transition-colors">
                <td className="py-1.5 text-text-secondary font-semibold">{row.label}</td>
                <td className="text-center"><SignalArrow signal={row.maSignal} /></td>
                <td className="text-center">
                  <span className={cn(row.rsi && row.rsi > 70 ? "text-red-400" : row.rsi && row.rsi < 30 ? "text-emerald-400" : "text-text-secondary")}>
                    {row.rsi?.toFixed(0) ?? "—"}
                  </span>
                </td>
                <td className="text-center"><SignalArrow signal={row.macdSignal} /></td>
                <td className="text-center"><SignalArrow signal={row.overall} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-slate/40">
              <td colSpan={4} className="pt-2 text-text-tertiary text-[9px]">Consensus Score</td>
              <td className="pt-2 text-center font-bold text-accent">
                {totalScore > 0 ? "+" : ""}{totalScore}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* EMA Stack */}
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">
            Moving Averages
          </p>
          <div className="space-y-2">
            {[
              { label: "20 EMA",  above: emaStack.above20,  val: emaStack.ema20  },
              { label: "50 EMA",  above: emaStack.above50,  val: emaStack.ema50  },
              { label: "200 EMA", above: emaStack.above200, val: emaStack.ema200 },
            ].map(e => (
              <div key={e.label} className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full shrink-0",
                  e.above === true ? "bg-emerald-400" : e.above === false ? "bg-red-400" : "bg-white/20")} />
                <span className="text-[10px] font-mono text-text-tertiary w-14">{e.label}</span>
                <span className={cn("text-[10px] font-mono",
                  e.above === true ? "text-emerald-400" : e.above === false ? "text-red-400" : "text-text-tertiary")}>
                  {e.above === true ? "ABOVE" : e.above === false ? "BELOW" : "—"}
                </span>
                {e.val && <span className="text-[9px] font-mono text-text-tertiary ml-auto">{fmt(e.val)}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Key Levels */}
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">
            Key Levels (Pivot)
          </p>
          <div className="space-y-1.5 text-[10px] font-mono">
            {[
              { label: "R2", value: keyLevels.r2,    cls: "text-red-300" },
              { label: "R1", value: keyLevels.r1,    cls: "text-red-400/70" },
              { label: "PP", value: keyLevels.pivot, cls: "text-accent" },
              { label: "S1", value: keyLevels.s1,    cls: "text-emerald-400/70" },
              { label: "S2", value: keyLevels.s2,    cls: "text-emerald-300" },
            ].map(l => (
              <div key={l.label} className="flex justify-between items-center">
                <span className="text-text-tertiary">{l.label}</span>
                <span className={l.cls}>{fmt(l.value)}</span>
              </div>
            ))}
          </div>
          {/* Price position slider */}
          {price && s2 !== null && r2 !== null && (
            <div className="mt-3">
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-visible">
                <div className="absolute h-full left-0 rounded-full" style={{ width: `${pricePct}%`, background: "linear-gradient(90deg, #22c55e, #3b82f6)" }} />
                <div className="absolute w-3 h-3 rounded-full bg-white border-2 border-accent -top-[3px] -translate-x-1/2 shadow" style={{ left: `${pricePct}%` }} />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-text-tertiary mt-1">
                <span>S2 {fmt(s2)}</span><span>R2 {fmt(r2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Macro Tab ────────────────────────────────────────────────────────────────

function MacroTab({ inst, priceData }: { inst: ScannerInstrument; priceData: InstrumentData }) {
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const vixDxy = useTwelveData(["VIX", "DXY"]);

  useEffect(() => {
    fetch(`/api/calendar/${inst.scannerSlug}`)
      .then(r => r.json()).then(d => setEvents(d.events ?? [])).catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, [inst.scannerSlug]);

  const vix = vixDxy["VIX"];
  const dxy = vixDxy["DXY"];
  const vixLevel = vix?.price ?? null;
  const vixColor = vixLevel ? (vixLevel < 15 ? "bg-emerald-500" : vixLevel < 25 ? "bg-amber-500" : "bg-red-500") : "bg-white/20";
  const vixLabel = vixLevel ? (vixLevel < 15 ? "CALM" : vixLevel < 25 ? "CAUTION" : "FEAR") : "—";

  const [ccy1, ccy2] = inst.displayPair.includes("/") ? inst.displayPair.split("/") : [null, null];
  const rate1 = ccy1 ? CENTRAL_BANK_RATES[ccy1] : null;
  const rate2 = ccy2 ? CENTRAL_BANK_RATES[ccy2] : null;
  const diff  = rate1 && rate2 ? (rate1.rate - rate2.rate) : null;

  const IMPACT_COLOR: Record<string, string> = { high: "text-red-400", medium: "text-amber-400", low: "text-emerald-400" };

  return (
    <div className="bg-[#0a0a14] bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px] p-5 space-y-5">
      {/* VIX / DXY */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
          Risk Sentiment
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "VIX", data: vix, color: vixColor, tag: vixLabel },
            { label: "DXY", data: dxy, color: (dxy?.changePct ?? 0) >= 0 ? "bg-emerald-500" : "bg-red-500", tag: null },
          ].map(item => (
            <div key={item.label} className="bg-white/5 border border-white/10 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", item.color)} />
                  {item.tag && <span className="text-[8px] font-mono text-text-tertiary">{item.tag}</span>}
                </div>
              </div>
              <p className="text-lg font-bold font-mono text-text-primary">
                {item.data?.price ? formatPrice(item.data.price, item.label) : <span className="animate-pulse">—</span>}
              </p>
              <p className={cn("text-[10px] font-mono", (item.data?.changePct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400")}>
                {item.data?.changePct != null ? `${item.data.changePct >= 0 ? "+" : ""}${item.data.changePct.toFixed(2)}%` : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Differential (forex only) */}
      {inst.category === "forex" && rate1 && rate2 && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
            Rate Differential
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-text-tertiary text-[9px] mb-1">{rate1.bank}</p>
              <p className="text-text-primary font-bold text-sm">{rate1.rate.toFixed(2)}%</p>
              <p className={cn("text-[9px] mt-0.5", rate1.trend === "hiking" ? "text-red-400" : rate1.trend === "cutting" ? "text-emerald-400" : "text-text-tertiary")}>
                {rate1.trend.toUpperCase()}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-text-tertiary text-[9px] mb-1">{rate2.bank}</p>
              <p className="text-text-primary font-bold text-sm">{rate2.rate.toFixed(2)}%</p>
              <p className={cn("text-[9px] mt-0.5", rate2.trend === "hiking" ? "text-red-400" : rate2.trend === "cutting" ? "text-emerald-400" : "text-text-tertiary")}>
                {rate2.trend.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between bg-white/5 border border-white/10 p-2">
            <span className="text-[9px] font-mono text-text-tertiary">Differential</span>
            <span className={cn("text-sm font-bold font-mono", diff && diff > 0 ? "text-emerald-400" : diff && diff < 0 ? "text-red-400" : "text-text-tertiary")}>
              {diff !== null ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)}%` : "—"}
            </span>
          </div>
          <p className="text-[8px] font-mono text-text-tertiary/50 mt-1">Rates updated {STATIC_RATES_UPDATED}</p>
        </div>
      )}

      {/* Economic Calendar */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
          Economic Calendar
        </p>
        {loadingEvents ? (
          <div className="space-y-2">{[0,1,2].map(i => <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />)}</div>
        ) : events.length === 0 ? (
          <p className="text-[10px] font-mono text-text-tertiary">No upcoming events.</p>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 p-2.5">
                <div className="shrink-0">
                  <p className="text-[9px] font-mono text-text-tertiary">{e.time} UTC</p>
                  <p className="text-[9px] font-mono font-bold text-text-secondary">{e.country}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-text-primary truncate">{e.event}</p>
                  <p className="text-[9px] font-mono text-text-tertiary">
                    Prev: {e.previous ?? "—"} · Est: {e.estimate ?? "—"}
                  </p>
                </div>
                <span className={cn("text-[8px] font-bold uppercase font-mono shrink-0", IMPACT_COLOR[e.impact] ?? "text-text-tertiary")}>
                  {e.impact}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Smart Money Tab ─────────────────────────────────────────────────────────

function SmartMoneyTab({ inst, data }: { inst: ScannerInstrument; data: InstrumentData }) {
  const [cot, setCot] = useState<any>(null);
  const hasCOT = !!CFTC_CODES[inst.scannerSlug];
  const retail = RETAIL_MOCK[inst.scannerSlug] ?? { longPct: 50, shortPct: 50 };

  useEffect(() => {
    if (!hasCOT) return;
    fetch(`/api/cot/${inst.scannerSlug}`).then(r => r.json()).then(setCot).catch(() => {});
  }, [inst.scannerSlug, hasCOT]);

  const isUnusualVol = data.volumePct && data.volumePct > 150;
  const isAccumulation = data.volumePct && data.volumePct > 200 && Math.abs(data.changePct ?? 0) < 0.1;

  const levels = [
    { label: "52W High",        price: data.fiftyTwoWeekHigh, type: "resistance" as const },
    { label: "Prev Month High", price: data.prevMonthHigh,    type: "resistance" as const },
    { label: "Prev Week High",  price: data.prevWeekHigh,     type: "resistance" as const },
    { label: "Weekly Open",     price: data.weeklyOpen,        type: "neutral"    as const },
    { label: "Prev Week Low",   price: data.prevWeekLow,       type: "support"    as const },
    { label: "Prev Month Low",  price: data.prevMonthLow,      type: "support"    as const },
    { label: "52W Low",         price: data.fiftyTwoWeekLow,   type: "support"    as const },
  ].filter(l => l.price !== null).sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  const TYPE_COLOR = { resistance: "text-red-400", neutral: "text-accent", support: "text-emerald-400" };

  return (
    <div className="bg-[#0f0f1a] p-5 space-y-5">
      {/* Volume Alerts */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
          Volume Intelligence
        </p>
        <div className="space-y-2">
          {isAccumulation && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 p-2.5">
              <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] font-mono text-blue-300 font-bold">ACCUMULATION SIGNAL</span>
              <span className="text-[9px] font-mono text-text-tertiary">Volume {data.volumePct}% avg, price flat</span>
            </div>
          )}
          {isUnusualVol && !isAccumulation && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 p-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-mono text-amber-300 font-bold">UNUSUAL VOLUME</span>
              <span className="text-[9px] font-mono text-text-tertiary">{data.volumePct}% of 20-day avg</span>
            </div>
          )}
          {!isUnusualVol && (
            <p className="text-[10px] font-mono text-text-tertiary">
              Volume: {data.volumePct ? `${data.volumePct}% of avg` : "No data"} — normal range.
            </p>
          )}
        </div>
      </div>

      {/* COT Panel */}
      {hasCOT && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
            COT Positioning (CFTC)
          </p>
          {!cot ? (
            <div className="space-y-2">{[0,1,2].map(i => <div key={i} className="h-8 bg-white/5 animate-pulse" />)}</div>
          ) : cot.weeks?.length > 0 ? (() => {
            const w = cot.weeks[0];
            const maxNet = Math.max(Math.abs(w.commercialNet), Math.abs(w.largeSpecNet), Math.abs(w.smallSpecNet), 1);
            const contrarian = w.commercialNet > 0 && w.largeSpecNet < 0;
            return (
              <div className="space-y-3">
                {contrarian && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 text-[9px] font-mono text-emerald-400">
                    ▲ CONTRARIAN LONG SIGNAL — Commercials net long, Large Specs net short
                  </div>
                )}
                {[
                  { label: "Commercials (Hedgers)", net: w.commercialNet },
                  { label: "Large Specs (Trend)", net: w.largeSpecNet },
                  { label: "Small Specs (Retail)", net: w.smallSpecNet },
                ].map(g => (
                  <div key={g.label} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono">
                      <span className="text-text-tertiary">{g.label}</span>
                      <span className={g.net > 0 ? "text-emerald-400" : "text-red-400"}>
                        {g.net > 0 ? "+" : ""}{g.net.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", g.net > 0 ? "bg-emerald-500" : "bg-red-500")}
                        style={{ width: `${Math.round((Math.abs(g.net) / maxNet) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })() : <p className="text-[10px] font-mono text-text-tertiary">COT data unavailable.</p>}
        </div>
      )}

      {/* Retail Sentiment */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-1 border-b border-white/10 pb-1">
          Retail Positioning <span className="text-[8px] normal-case">(fade this)</span>
        </p>
        <p className="text-[8px] font-mono text-text-tertiary/60 mb-3">
          When &gt;75% retail long, price often falls — contrarian indicator.
        </p>
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono mb-1">
            <span className="text-emerald-400">{retail.longPct}% Long</span>
            <span className="text-red-400">{retail.shortPct}% Short</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500/60 h-full transition-all" style={{ width: `${retail.longPct}%` }} />
            <div className="bg-red-500/60 h-full flex-1" />
          </div>
          {retail.longPct > 75 && (
            <p className="text-[9px] font-mono text-amber-400 mt-1">⚠ Extreme long bias — watch for reversal</p>
          )}
        </div>
      </div>

      {/* Institutional Levels */}
      {levels.length > 0 && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
            Institutional Levels
          </p>
          <div className="space-y-1.5">
            {levels.map((l, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-tertiary">{l.label}</span>
                <span className={TYPE_COLOR[l.type]}>{l.price ? formatPrice(l.price, inst.scannerSlug) : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Tab ───────────────────────────────────────────────────────────────────

function AITab({ inst, setupScore, tech, data }: {
  inst: ScannerInstrument; setupScore: number; tech: TechnicalSummary; data: InstrumentData;
}) {
  const [patterns, setPatterns] = useState<PatternResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);

  const loadPatterns = useCallback(async () => {
    if (called) return;
    setCalled(true);
    setLoading(true);
    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: inst.scannerSlug, displayPair: inst.displayPair }),
      });
      const d = await res.json();
      setPatterns(d);
    } catch { setPatterns(null); } finally { setLoading(false); }
  }, [inst.scannerSlug, called]);

  useEffect(() => { loadPatterns(); }, [loadPatterns]);

  const TYPE_STYLE: Record<string, string> = {
    bullish: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    bearish: "bg-red-500/15 text-red-400 border-red-500/30",
    neutral: "bg-white/10 text-gray-400 border-white/20",
  };

  const scoreBreakdown = [
    { label: "Technical Consensus", pts: Math.round(((tech.totalScore + 5) / 10) * 30), max: 30 },
    { label: "Smart Money Alignment", pts: 12, max: 25 },
    { label: "Pattern Quality",       pts: patterns?.patterns?.length ? Math.round(patterns.patterns[0]?.confidence * 20) : 0, max: 20 },
    { label: "Macro Backdrop",        pts: 10, max: 15 },
    { label: "Volume Confirmation",   pts: data.volumePct && data.volumePct > 100 ? Math.min(10, Math.round((data.volumePct - 100) / 10)) : 0, max: 10 },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Setup Score breakdown */}
      <div>
        <div className="flex items-center gap-3 mb-3 border-b border-border-slate/30 pb-2">
          <SetupScoreDial score={setupScore} size={52} />
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Setup Score</p>
            <p className={cn("text-lg font-bold font-mono", setupScore >= 70 ? "text-yellow-400" : setupScore >= 40 ? "text-amber-400" : "text-red-400")}>
              {setupScore}/100
            </p>
            {setupScore >= 70 && <p className="text-[9px] font-mono text-yellow-400/80">HIGH QUALITY SETUP</p>}
          </div>
        </div>
        <div className="space-y-2">
          {scoreBreakdown.map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-[9px] font-mono mb-0.5">
                <span className="text-text-tertiary">{s.label}</span>
                <span className="text-text-secondary">{s.pts}/{s.max}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent/60 rounded-full" style={{ width: `${(s.pts / s.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Detection */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">
          AI Pattern Detection
        </p>
        {loading ? (
          <div className="space-y-2">
            {[0,1].map(i => <div key={i} className="h-8 bg-white/5 animate-pulse rounded" />)}
            <p className="text-[9px] font-mono text-text-tertiary animate-pulse">Analysing {inst.displayPair} with Claude…</p>
          </div>
        ) : patterns ? (
          <div className="space-y-3">
            {patterns.patterns?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patterns.patterns.map((p, i) => (
                  <div key={i} className={cn("border px-2 py-1 text-[9px] font-mono font-bold uppercase", TYPE_STYLE[p.type] ?? TYPE_STYLE.neutral)}>
                    {p.name} <span className="font-normal opacity-60">{Math.round(p.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[10px] font-mono text-text-tertiary">No clear patterns detected.</p>}
            {patterns.commentary && (
              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-[9px] font-mono text-text-secondary leading-relaxed">{patterns.commentary}</p>
              </div>
            )}
            <p className="text-[8px] font-mono text-text-tertiary/50 uppercase">AI ANALYSIS — NOT FINANCIAL ADVICE</p>
          </div>
        ) : (
          <p className="text-[10px] font-mono text-text-tertiary">Set ANTHROPIC_API_KEY to enable AI pattern analysis.</p>
        )}
      </div>
    </div>
  );
}

// ─── Instrument Card ──────────────────────────────────────────────────────────

function InstrumentCard({
  inst, data, watchlist, onToggleWatch, alerts, onToggleAlerts, activeSessions, listView,
}: {
  inst: ScannerInstrument; data: InstrumentData; watchlist: string[];
  onToggleWatch: (s: string) => void; alerts: AlertItem[];
  onToggleAlerts: (s: string) => void; activeSessions: string[]; listView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<CardTab>("TECHNICAL");
  const tech = useTechnicalData(inst.scannerSlug, expanded);
  const setupScore = calcSetupScore(data, tech);
  const watched = watchlist.includes(inst.scannerSlug);
  const alertCount = alerts.filter(a => a.slug === inst.scannerSlug).length;
  const session = getInstrumentSession(inst, activeSessions);
  const changePct = data.changePct ?? 0;
  const isUp = changePct >= 0;

  const sessionColor = session === "CLOSED" ? "text-text-tertiary" :
    session === "LONDON" ? "text-blue-400" : session === "NEW YORK" ? "text-emerald-400" :
    session === "ASIA" ? "text-violet-400" : session === "24/7" ? "text-accent" : "text-text-secondary";

  const tabs: CardTab[] = ["TECHNICAL", "MACRO", "SMART MONEY", "AI"];

  if (listView) {
    return (
      <div className={cn("border border-border-slate/40 bg-background-surface/60 transition-all",
        setupScore >= 70 && "ring-1 ring-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]")}>
        <div className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setExpanded(e => !e)}>
          <div className="flex items-center gap-3 w-28 shrink-0">
            <SetupScoreDial score={setupScore} size={36} />
            <div>
              <p className="font-bold font-mono text-sm text-text-primary">{inst.displayPair}</p>
              <p className="text-[8px] font-mono text-text-tertiary uppercase">{CATEGORY_LABEL[inst.category]}</p>
            </div>
          </div>
          <div className="flex-1 font-mono text-sm font-bold text-text-primary">
            {data.loading ? <span className="animate-pulse">—</span> : data.price ? formatPrice(data.price, inst.scannerSlug) : "—"}
          </div>
          <div className={cn("font-mono text-xs font-bold", isUp ? "text-emerald-400" : "text-red-400")}>
            {data.changePct != null ? `${isUp ? "+" : ""}${data.changePct.toFixed(2)}%` : "—"}
          </div>
          {tech.consensus !== "NEUTRAL" && (
            <div className={cn("border px-2 py-0.5 text-[8px] font-bold font-mono uppercase", CONSENSUS_STYLE[tech.consensus])}>
              {tech.consensus}
            </div>
          )}
          <div className={cn("text-[8px] font-mono uppercase shrink-0", sessionColor)}>{session}</div>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-text-tertiary shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-text-tertiary shrink-0" />}
        </div>
        <ExpandedPanel show={expanded} tab={tab} setTab={setTab} tabs={tabs}
          inst={inst} data={data} tech={tech} setupScore={setupScore} />
      </div>
    );
  }

  return (
    <div className={cn("border border-border-slate/40 bg-background-surface/60 flex flex-col transition-all duration-200",
      setupScore >= 70 && "ring-1 ring-yellow-500/30 shadow-[0_0_24px_rgba(234,179,8,0.12)]")}>
      {/* Card front */}
      <div className="p-4 space-y-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <SetupScoreDial score={setupScore} size={44} />
            <div>
              <p className="font-black font-mono text-base text-text-primary leading-tight">{inst.displayPair}</p>
              <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">{CATEGORY_LABEL[inst.category]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {tech.consensus !== "NEUTRAL" && (
              <div className={cn("border px-1.5 py-0.5 text-[7px] font-bold font-mono uppercase", CONSENSUS_STYLE[tech.consensus])}>
                {tech.consensus}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-text-primary">
            {data.loading ? <span className="animate-pulse text-text-tertiary">—</span> : data.price ? formatPrice(data.price, inst.scannerSlug) : "—"}
          </span>
          <span className={cn("text-xs font-bold font-mono", isUp ? "text-emerald-400" : "text-red-400")}>
            {data.changePct != null ? `${isUp ? "+" : ""}${data.changePct.toFixed(2)}%` : ""}
          </span>
        </div>

        {/* Sparkline */}
        {data.sparkline.length > 1 ? (
          <div className="h-10 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sparkline.map((v, i) => ({ i, v }))} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
                <Line type="monotone" dataKey="v" stroke={isUp ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-10 bg-white/5 flex items-center justify-center">
            <span className="text-[8px] font-mono text-text-tertiary">No sparkline</span>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
          <div>
            <p className="text-text-tertiary mb-0.5">Spread</p>
            <p className="text-text-secondary">{data.spread ?? "—"}</p>
          </div>
          <div>
            <p className="text-text-tertiary mb-0.5">ATR(14)</p>
            <p className="text-text-secondary">{data.atr ? data.atr.toFixed(4) : "—"}</p>
          </div>
          <div>
            <p className={cn("text-[8px] uppercase font-bold", sessionColor)}>{session}</p>
            <p className="text-text-tertiary text-[8px]">Session</p>
          </div>
        </div>

        {/* Volume bar */}
        {data.volumePct !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono">
              <span className="text-text-tertiary uppercase">Volume</span>
              <span className={cn(data.volumePct > 120 ? "text-amber-400" : "text-text-tertiary")}>
                {data.volumePct}% avg
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all",
                data.volumePct > 200 ? "bg-amber-500" : data.volumePct > 120 ? "bg-amber-400/70" : "bg-accent/50")}
                style={{ width: `${Math.min(100, data.volumePct)}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-border-slate/20">
          <div className="flex items-center gap-2">
            <button onClick={e => { e.stopPropagation(); onToggleWatch(inst.scannerSlug); }}
              className={cn("p-1 hover:text-yellow-400 transition-colors", watched ? "text-yellow-400" : "text-text-tertiary")}>
              <Star className="w-3.5 h-3.5" fill={watched ? "currentColor" : "none"} />
            </button>
            <button onClick={e => { e.stopPropagation(); onToggleAlerts(inst.scannerSlug); }}
              className="relative p-1 text-text-tertiary hover:text-accent transition-colors">
              {alertCount > 0 ? <BellRing className="w-3.5 h-3.5 text-accent" /> : <Bell className="w-3.5 h-3.5" />}
              {alertCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full text-[6px] font-bold text-white flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          </div>
          <Link href={`/dashboard/tools/scanner?symbol=${inst.scannerSlug}`}
            className="text-[8px] font-mono uppercase text-text-tertiary hover:text-accent transition-colors flex items-center gap-1"
            onClick={e => e.stopPropagation()}>
            TradingView <ChevronRight className="w-2.5 h-2.5" />
          </Link>
          <button className="text-[8px] font-mono uppercase text-text-tertiary hover:text-accent transition-colors">
            {expanded ? "▲ Less" : "▼ More"}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      <ExpandedPanel show={expanded} tab={tab} setTab={setTab} tabs={tabs}
        inst={inst} data={data} tech={tech} setupScore={setupScore} />
    </div>
  );
}

function ExpandedPanel({ show, tab, setTab, tabs, inst, data, tech, setupScore }: {
  show: boolean; tab: CardTab; setTab: (t: CardTab) => void; tabs: CardTab[];
  inst: ScannerInstrument; data: InstrumentData; tech: TechnicalSummary; setupScore: number;
}) {
  return (
    <div style={{ maxHeight: show ? "900px" : "0", overflow: "hidden", transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
      <div className="border-t border-border-slate/30">
        {/* Tab bar */}
        <div className="flex border-b border-border-slate/30 bg-background-elevated/50">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-3 py-2 text-[9px] font-mono uppercase tracking-widest transition-colors",
                tab === t ? "text-accent border-b-2 border-accent" : "text-text-tertiary hover:text-text-secondary")}>
              {t}
            </button>
          ))}
        </div>
        {/* Tab content */}
        {tab === "TECHNICAL"   && <TechnicalTab  tech={tech} price={data.price} slug={inst.scannerSlug} />}
        {tab === "MACRO"       && <MacroTab      inst={inst} priceData={data} />}
        {tab === "SMART MONEY" && <SmartMoneyTab inst={inst} data={data} />}
        {tab === "AI"          && <AITab         inst={inst} setupScore={setupScore} tech={tech} data={data} />}
      </div>
    </div>
  );
}

// ─── Main Scanner Grid ────────────────────────────────────────────────────────

function MarketScannerGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [sort, setSort] = useState<SortMode>("name");
  const [sortOpen, setSortOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("scanner-watchlist") ?? "[]"); } catch { return []; }
  });
  const [alertsSlug, setAlertsSlug] = useState<string | null>(null);
  const [allAlerts, setAllAlerts] = useState<AlertItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("scanner-alerts") ?? "[]"); } catch { return []; }
  });
  const [newAlertValue, setNewAlertValue] = useState("");

  const utcH = new Date().getUTCHours();
  const activeSessions = getActiveSessions(utcH);

  const priceData = useTwelveData(ALL_SLUGS);
  const anyLastUpdated = Object.values(priceData).find(d => d.lastUpdated)?.lastUpdated ?? null;

  const toggleWatch = (slug: string) => {
    setWatchlist(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem("scanner-watchlist", JSON.stringify(next));
      return next;
    });
  };

  const saveAlert = (slug: string, label: string) => {
    const alert: AlertItem = { id: Date.now().toString(), slug, type: "price", value: parseFloat(newAlertValue) || 0, label, createdAt: new Date().toISOString() };
    const next = [...allAlerts, alert];
    setAllAlerts(next);
    localStorage.setItem("scanner-alerts", JSON.stringify(next));
    setNewAlertValue("");
  };

  const removeAlert = (id: string) => {
    const next = allAlerts.filter(a => a.id !== id);
    setAllAlerts(next);
    localStorage.setItem("scanner-alerts", JSON.stringify(next));
  };

  const FILTERS: FilterMode[] = ["ALL", "FOREX", "INDEX", "COMMODITY", "CRYPTO", "WATCHLIST", "SIGNALS"];
  const SORTS: { id: SortMode; label: string }[] = [
    { id: "name", label: "Name" }, { id: "change", label: "% Change" },
    { id: "atr", label: "ATR" },   { id: "volume", label: "Volume" }, { id: "score", label: "Setup Score" },
  ];

  const filteredInstruments = SCANNER_INSTRUMENTS.filter(inst => {
    if (filter === "WATCHLIST") return watchlist.includes(inst.scannerSlug);
    if (filter === "FOREX")     return inst.category === "forex";
    if (filter === "INDEX")     return inst.category === "indices";
    if (filter === "COMMODITY") return inst.category === "commodities";
    if (filter === "CRYPTO")    return inst.category === "crypto";
    if (filter === "SIGNALS") {
      const d = priceData[inst.scannerSlug];
      return d && (d.changePct ?? 0) > 1;
    }
    return true;
  }).sort((a, b) => {
    const da = priceData[a.scannerSlug], db = priceData[b.scannerSlug];
    if (sort === "change") return (db?.changePct ?? 0) - (da?.changePct ?? 0);
    if (sort === "atr")    return (db?.atr ?? 0) - (da?.atr ?? 0);
    if (sort === "volume") return (db?.volumePct ?? 0) - (da?.volumePct ?? 0);
    return a.displayPair.localeCompare(b.displayPair);
  });

  // Watchlist pinned to top
  const pinned   = filteredInstruments.filter(i => watchlist.includes(i.scannerSlug));
  const unpinned = filteredInstruments.filter(i => !watchlist.includes(i.scannerSlug));
  const sorted   = filter === "WATCHLIST" ? pinned : [...pinned, ...unpinned];

  return (
    <div className="space-y-4">
      <MarketStatusBar lastUpdated={anyLastUpdated} />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all",
                filter === f ? "bg-accent text-white border-accent" : "border-border-slate/40 text-text-tertiary hover:border-accent hover:text-accent")}>
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <button onClick={() => setSortOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 border border-border-slate/40 text-[9px] font-mono uppercase text-text-tertiary hover:border-accent transition-all">
              Sort: {SORTS.find(s => s.id === sort)?.label} <ChevronDown className="w-3 h-3" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-background-elevated border border-border-slate/50 z-20 min-w-[140px]">
                {SORTS.map(s => (
                  <button key={s.id} onClick={() => { setSort(s.id); setSortOpen(false); }}
                    className={cn("w-full text-left px-3 py-2 text-[9px] font-mono uppercase hover:bg-white/10 transition-colors",
                      sort === s.id ? "text-accent" : "text-text-tertiary")}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex border border-border-slate/40">
            <button onClick={() => setViewMode("grid")}
              className={cn("p-1.5 transition-colors", viewMode === "grid" ? "bg-accent text-white" : "text-text-tertiary hover:text-text-secondary")}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode("list")}
              className={cn("p-1.5 transition-colors", viewMode === "list" ? "bg-accent text-white" : "text-text-tertiary hover:text-text-secondary")}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List */}
      <div className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2")}>
        {sorted.map(inst => {
          const d = priceData[inst.scannerSlug];
          return d?.loading ? (
            <SkeletonCard key={inst.scannerSlug} />
          ) : (
            <InstrumentCard key={inst.scannerSlug} inst={inst} data={d}
              watchlist={watchlist} onToggleWatch={toggleWatch}
              alerts={allAlerts} onToggleAlerts={s => setAlertsSlug(s === alertsSlug ? null : s)}
              activeSessions={activeSessions} listView={viewMode === "list"} />
          );
        })}
        {sorted.length === 0 && (
          <div className="col-span-3 text-center py-12 text-text-tertiary font-mono text-sm">
            No instruments match this filter.
          </div>
        )}
      </div>

      {/* Alerts slide-out */}
      {alertsSlug && (
        <div className="fixed right-0 top-0 h-full w-80 bg-background-elevated border-l border-border-slate/50 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border-slate/30">
            <p className="font-mono text-sm font-bold text-text-primary uppercase">Alerts — {SCANNER_INSTRUMENTS.find(i => i.scannerSlug === alertsSlug)?.displayPair}</p>
            <button onClick={() => setAlertsSlug(null)} className="text-text-tertiary hover:text-text-primary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {allAlerts.filter(a => a.slug === alertsSlug).length === 0 ? (
              <p className="text-[10px] font-mono text-text-tertiary">No alerts set.</p>
            ) : (
              allAlerts.filter(a => a.slug === alertsSlug).map(a => (
                <div key={a.id} className="flex items-center justify-between bg-background-surface/60 border border-border-slate/30 px-3 py-2">
                  <div>
                    <p className="text-[10px] font-mono text-text-primary">{a.label}</p>
                    <p className="text-[9px] font-mono text-text-tertiary">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => removeAlert(a.id)} className="text-text-tertiary hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-border-slate/30 space-y-2">
            <p className="text-[9px] font-mono uppercase text-text-tertiary">Add Alert</p>
            <input value={newAlertValue} onChange={e => setNewAlertValue(e.target.value)}
              placeholder="Price level…"
              className="w-full bg-background-surface border border-border-slate/40 px-3 py-2 text-[10px] font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent" />
            <button onClick={() => saveAlert(alertsSlug, `Price @ ${newAlertValue}`)}
              className="w-full py-2 bg-accent text-white text-[9px] font-mono uppercase tracking-widest hover:bg-accent/80 transition-colors flex items-center justify-center gap-1">
              <Plus className="w-3 h-3" /> Add Alert
            </button>
          </div>
        </div>
      )}
      {alertsSlug && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setAlertsSlug(null)} />}
    </div>
  );
}

// ─── Existing SymbolDetail (preserved) ───────────────────────────────────────

function SymbolDetail({ instrument }: { instrument: ScannerInstrument }) {
  const CategoryIcon = CATEGORY_ICON[instrument.category];
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const idx = SCANNER_INSTRUMENTS.findIndex(i => i.scannerSlug === instrument.scannerSlug);
  const prev = SCANNER_INSTRUMENTS[idx - 1] ?? null;
  const next = SCANNER_INSTRUMENTS[idx + 1] ?? null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/tools/scanner"
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">
          <ChevronLeft className="w-3 h-3" /> All Markets
        </Link>
        <div className="flex items-center gap-2">
          {prev && (
            <Link href={`/dashboard/tools/scanner?symbol=${prev.scannerSlug}`}
              className="flex items-center gap-1 px-3 py-1.5 border border-border-slate/50 hover:border-accent text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-all">
              <ChevronLeft className="w-3 h-3" /> {prev.displayPair}
            </Link>
          )}
          {next && (
            <Link href={`/dashboard/tools/scanner?symbol=${next.scannerSlug}`}
              className="flex items-center gap-1 px-3 py-1.5 border border-border-slate/50 hover:border-accent text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-all">
              {next.displayPair} <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      <header className="border-b border-border-slate/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CategoryIcon className="w-4 h-4 text-text-tertiary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              {CATEGORY_LABEL[instrument.category]} · Technical Consensus · Daily (1D)
            </span>
          </div>
          <h1 className="text-5xl font-display font-black uppercase tracking-tight text-text-primary">
            {instrument.displayPair}
          </h1>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{instrument.tvSymbol}</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-background-elevated border border-border-slate/50">
          <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Live · TradingView Technical Analysis</span>
        </div>
      </header>

      <div ref={containerRef} className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-6 min-h-[460px]">
        {ready ? (
          <TradingViewTechnicalWidget tvSymbol={instrument.tvSymbol} isVisible={true} />
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex items-center gap-3 text-text-tertiary animate-pulse">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Loading signal data...</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-[9px] font-mono text-text-tertiary/60 uppercase tracking-widest text-center leading-relaxed">
        Analysis powered by TradingView Technical Analysis engine · 26 indicators · Daily timeframe · Not financial advice
      </p>

      <section className="space-y-4">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate/50 pb-3">
          Other Instruments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SCANNER_INSTRUMENTS.filter(i => i.scannerSlug !== instrument.scannerSlug).map(i => {
            const Icon = CATEGORY_ICON[i.category];
            return (
              <Link key={i.scannerSlug} href={`/dashboard/tools/scanner?symbol=${i.scannerSlug}`}
                className={cn("flex flex-col items-center justify-center gap-2 p-4",
                  "border border-border-slate/40 hover:border-accent hover:bg-accent/5",
                  "transition-all group text-center")}>
                <Icon className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                  {i.displayPair}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

interface ScannerClientProps { symbol: string | null; }

export function ScannerClient({ symbol }: ScannerClientProps) {
  const instrument = symbol ? SCANNER_INSTRUMENTS.find(i => i.scannerSlug === symbol) ?? null : null;
  if (instrument) return <SymbolDetail instrument={instrument} />;
  if (symbol && !instrument) return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-6">
        <Link href="/dashboard/tools/scanner"
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-6">
          <ChevronLeft className="w-3 h-3" /> All Markets
        </Link>
        <p className="text-sm text-text-tertiary font-mono uppercase">Symbol &quot;{symbol}&quot; not recognised.</p>
      </header>
      <MarketScannerGrid />
    </div>
  );
  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-premium">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Institutional_Scanner // Live</span>
          </div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight">
            Market <span className="text-premium">Scanner.</span>
          </h1>
          <p className="text-sm text-text-tertiary">12 instruments · Live prices · Multi-timeframe signals · AI pattern analysis</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-background-elevated border border-border-slate/50">
          <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">Live Data</span>
        </div>
      </header>
      <MarketScannerGrid />
    </div>
  );
}
