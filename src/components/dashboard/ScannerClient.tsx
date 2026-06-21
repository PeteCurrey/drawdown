"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, DollarSign, BarChart3, Zap, Gem, Activity,
  Grid3X3, List, Star, Bell, BellRing, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle, Shield,
  Calendar, Newspaper, Eye, EyeOff, X, Plus, Cpu, Zap as ZapIcon, Building2,
  Calculator,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";
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
type CardTab = "SIGNALS" | "FUNDAMENTALS" | "AI BRIEF" | "SMART MONEY";

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
  "STRONG BUY":  "bg-profit/15  text-profit   border-profit/30",
  "BUY":         "bg-profit/8   text-profit   border-profit/20",
  "NEUTRAL":     "bg-border-slate/30 text-text-tertiary border-border-slate/50",
  "SELL":        "bg-loss/10    text-loss      border-loss/25",
  "STRONG SELL": "bg-loss/20    text-loss      border-loss/40",
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

function getActiveSessions(now: Date = new Date()): string[] {
  const s: string[] = [];
  const day  = now.getUTCDay();   // 0=Sun, 1=Mon … 6=Sat
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Saturday: all markets closed for the weekend
  if (day === 6) return s;
  // Sunday before 21:00 UTC: pre-market — forex week hasn't opened
  if (day === 0 && mins < 21 * 60) return s;
  // Friday after 22:00 UTC: markets wound down, weekend begins
  if (day === 5 && mins >= 22 * 60) return s;

  // Asian session: Sun 21:00→ + Mon–Fri 00:00–09:00 UTC
  if (day === 0 && mins >= 21 * 60) s.push("ASIA");
  if (day >= 1 && day <= 5 && mins < 9 * 60) s.push("ASIA");

  // London session: Mon–Fri 08:00–16:30 UTC (LSE hours)
  if (day >= 1 && day <= 5 && mins >= 8 * 60 && mins < 16 * 60 + 30) s.push("LONDON");

  // New York session: Mon–Fri 13:30–20:00 UTC (NYSE EDT / regular hours)
  if (day >= 1 && day <= 5 && mins >= 13 * 60 + 30 && mins < 20 * 60) s.push("NEW YORK");

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
  const color = score >= 70 ? "#00c853" : score >= 40 ? "#f59e0b" : "#ef4444";
  const trackColor = score >= 70 ? "rgba(0,200,83,0.12)" : score >= 40 ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)";
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={4.5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4.5}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease", filter: score >= 70 ? `drop-shadow(0 0 4px ${color})` : "none" }} />
      </svg>
      <span className="absolute text-[10px] font-black font-mono" style={{ color }}>{score}</span>
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
    <div className="bg-background-surface border border-border-slate/40 rounded-xl p-5 animate-pulse space-y-3">
      <div className="h-4 bg-background-elevated rounded w-1/3" />
      <div className="h-8 bg-background-elevated rounded w-2/3" />
      <div className="h-10 bg-background-elevated/50 rounded" />
      <div className="h-3 bg-background-elevated rounded w-1/2" />
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
  const sessions = getActiveSessions(utcTime);
  const utcStr = utcTime.toUTCString().split(" ").slice(4, 5)[0];
  const isWeekend = utcTime.getUTCDay() === 0 || utcTime.getUTCDay() === 6;

  const SESSION_CONFIG = [
    { name: "ASIA",     open: sessions.includes("ASIA"),     hours: "00:00–09:00" },
    { name: "LONDON",   open: sessions.includes("LONDON"),   hours: "08:00–16:30" },
    { name: "NEW YORK", open: sessions.includes("NEW YORK"), hours: "13:30–20:00" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 bg-background-surface border border-border-slate/50 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", isWeekend ? "bg-border-slate/60" : "bg-accent animate-pulse")} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-primary font-bold">
          {utcStr} UTC
        </span>
        {isWeekend && <span className="text-[8px] font-mono uppercase tracking-widest text-amber-400 font-bold">WEEKEND</span>}
      </div>
      <div className="h-3 w-px bg-border-slate/40 hidden sm:block" />
      <div className="flex items-center gap-3">
        {SESSION_CONFIG.map(s => (
          <div key={s.name} className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", s.open ? "bg-accent" : "bg-border-slate/50")} />
            <span className={cn("font-mono text-[9px] uppercase tracking-widest",
              s.open ? "text-text-primary font-semibold" : "text-text-tertiary")}>
              {s.name}
            </span>
            {s.open && <span className="text-[8px] font-mono text-accent font-bold">OPEN</span>}
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

// ─── Signals Tab ──────────────────────────────────────────────────────────────
function SignalsTab({ tech, price, slug, tvSymbol }: { tech: TechnicalSummary; price: number | null; slug: string; tvSymbol: string }) {
  if (tech.loading) return <div className="p-6 text-center text-text-tertiary text-xs font-mono animate-pulse">Loading signal data…</div>;
  if (tech.error || tech.rows.length === 0) return (
    <div className="space-y-0">
      <div className="border-b border-border-slate/20">
        <TradingViewTechnicalWidget tvSymbol={tvSymbol} isVisible />
      </div>
      <div className="p-4 text-center text-text-tertiary text-[10px] font-mono">
        Set NEXT_PUBLIC_TWELVE_DATA_KEY to add our multi-timeframe overlay.
      </div>
    </div>
  );

  const { rows, totalScore, emaStack, keyLevels } = tech;
  const fmt = (n: number | null) => n ? formatPrice(n, slug) : "—";
  const s2 = keyLevels.s2, r2 = keyLevels.r2, s1 = keyLevels.s1, r1 = keyLevels.r1, pivot = keyLevels.pivot;
  const pricePct = price && s2 !== null && r2 !== null && r2 !== s2
    ? Math.max(0, Math.min(100, ((price - s2) / (r2 - s2)) * 100)) : 50;
  const minsAgo = tech.lastUpdated ? Math.floor((Date.now() - tech.lastUpdated.getTime()) / 60000) : null;

  // Entry zone suggestion
  const entryZone = totalScore > 2 && s1 !== null && pivot !== null
    ? { type: "long", label: `Potential long zone: S1–Pivot (${fmt(s1)}–${fmt(pivot)}). Watch for bullish rejection candle.` }
    : totalScore < -2 && pivot !== null && r1 !== null
    ? { type: "short", label: `Potential short zone: Pivot–R1 (${fmt(pivot)}–${fmt(r1)}). Watch for bearish rejection.` }
    : { type: "neutral", label: "No clear directional bias. Wait for a break of R1 or S1 before entry." };

  return (
    <div className="space-y-0">
      {/* TradingView Technical Analysis widget — primary visual */}
      <div className="border-b border-border-slate/20">
        <TradingViewTechnicalWidget tvSymbol={tvSymbol} isVisible />
      </div>
      {/* Drawdown signals overlay — sourced from Twelve Data */}
      <div className="p-5 space-y-5">
      {minsAgo !== null && (
        <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
          <RefreshCw className="w-2.5 h-2.5" /> Drawdown signals · {minsAgo < 1 ? "just now" : `${minsAgo}m ago`}
        </p>
      )}
      {/* Multi-TF Matrix */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">
          Multi-Timeframe Signals
        </p>
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr className="text-text-tertiary border-b border-border-slate/20">
              <th className="py-1.5 text-left font-normal">TF</th>
              <th className="py-1.5 text-center font-normal">Trend</th>
              <th className="py-1.5 text-center font-normal">RSI</th>
              <th className="py-1.5 text-center font-normal">MACD</th>
              <th className="py-1.5 text-center font-normal">Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/10">
            {rows.map(row => (
              <tr key={row.tf} className="hover:bg-background-elevated/40 transition-colors">
                <td className="py-1.5 text-text-secondary font-semibold">{row.label}</td>
                <td className="text-center"><SignalArrow signal={row.maSignal} /></td>
                <td className="text-center">
                  <span className={cn("font-bold", row.rsi && row.rsi > 70 ? "text-loss" : row.rsi && row.rsi < 30 ? "text-profit" : "text-text-secondary")}>
                    {row.rsi?.toFixed(0) ?? "—"}
                  </span>
                </td>
                <td className="text-center"><SignalArrow signal={row.macdSignal} /></td>
                <td className="text-center">
                  <span className={cn("text-[8px] font-bold font-mono uppercase px-1.5 py-0.5 rounded border",
                    row.overall === "BUY" ? "text-profit border-profit/30 bg-profit/10" :
                    row.overall === "SELL" ? "text-loss border-loss/30 bg-loss/10" :
                    "text-text-tertiary border-border-slate/40 bg-border-slate/20")}>
                    {row.overall}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border-slate/40">
              <td colSpan={5} className="pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-text-tertiary uppercase shrink-0">Consensus</span>
                  <div className="flex-1 h-2 bg-background-elevated rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all",
                      totalScore > 0 ? "bg-profit" : totalScore < 0 ? "bg-loss" : "bg-border-slate/50")}
                      style={{ width: `${Math.min(100, Math.abs(totalScore) / 5 * 100)}%`,
                        marginLeft: totalScore < 0 ? "auto" : 0 }} />
                  </div>
                  <span className={cn("text-[11px] font-black font-mono shrink-0",
                    totalScore > 1 ? "text-profit" : totalScore < -1 ? "text-loss" : "text-text-tertiary")}>
                    {totalScore > 0 ? "+" : ""}{totalScore}
                  </span>
                </div>
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
    </div>
  );
}

// ─── Fundamentals Tab ────────────────────────────────────────────────────────

function FundamentalsTab({ inst, priceData }: { inst: ScannerInstrument; priceData: InstrumentData }) {
  const [events, setEvents] = useState<any[]>([]);
  const [newsItems, setNewsItems] = useState<Array<{ headline: string; source: string; sentiment: string; url: string; score: number }>>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [retailData, setRetailData] = useState<{ longPct: number; shortPct: number; signal: string } | null>(null);
  const retail = retailData ?? (RETAIL_MOCK[inst.scannerSlug] ?? { longPct: 50, shortPct: 50 });
  const vixDxy = useTwelveData(["VIX", "DXY"]);

  useEffect(() => {
    setLoadingEvents(true);
    setLoadingNews(true);

    fetch(`/api/calendar/${inst.scannerSlug}`)
      .then(r => r.json()).then(d => setEvents(d.events ?? [])).catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));

    // Real news sentiment via server-side route (API key protected)
    fetch(`/api/intelligence/news-sentiment/${inst.scannerSlug}`)
      .then(r => r.json()).then(d => setNewsItems(d.articles?.slice(0, 5) ?? []))
      .catch(() => setNewsItems([]))
      .finally(() => setLoadingNews(false));

    // Real retail sentiment (MyFXBook-based, server-side)
    fetch(`/api/intelligence/retail-sentiment/${inst.scannerSlug}`)
      .then(r => r.json()).then(d => {
        if (d.longPct !== undefined) {
          setRetailData({
            longPct: Math.round(d.longPct),
            shortPct: Math.round(d.shortPct ?? 100 - d.longPct),
            signal: d.signal ?? "NEUTRAL",
          });
        }
      }).catch(() => {});
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

  const timeAgo = (ts: number) => {
    const m = Math.floor((Date.now() - ts * 1000) / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="bg-background-elevated/20 p-5 space-y-5">
      {/* VIX / DXY */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-white/10 pb-1">
          Risk Sentiment
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "VIX", data: vix, color: vixColor, tag: vixLabel },
            { label: "DXY", data: dxy, color: (dxy?.changePct ?? 0) >= 0 ? "bg-profit" : "bg-loss", tag: null },
          ].map(item => (
            <div key={item.label} className="bg-background-surface/60 border border-border-slate/40 rounded-lg p-3 space-y-1.5">
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
              <p className={cn("text-[10px] font-mono", (item.data?.changePct ?? 0) >= 0 ? "text-profit" : "text-loss")}>
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
            <div className="bg-background-surface/60 border border-border-slate/40 rounded-lg p-3">
              <p className="text-text-tertiary text-[9px] mb-1">{rate1.bank}</p>
              <p className="text-text-primary font-bold text-sm">{rate1.rate.toFixed(2)}%</p>
              <p className={cn("text-[9px] mt-0.5", rate1.trend === "hiking" ? "text-loss" : rate1.trend === "cutting" ? "text-profit" : "text-text-tertiary")}>
                {rate1.trend.toUpperCase()}
              </p>
            </div>
            <div className="bg-background-surface/60 border border-border-slate/40 rounded-lg p-3">
              <p className="text-text-tertiary text-[9px] mb-1">{rate2.bank}</p>
              <p className="text-text-primary font-bold text-sm">{rate2.rate.toFixed(2)}%</p>
              <p className={cn("text-[9px] mt-0.5", rate2.trend === "hiking" ? "text-loss" : rate2.trend === "cutting" ? "text-profit" : "text-text-tertiary")}>
                {rate2.trend.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between bg-background-surface/60 border border-border-slate/40 rounded-lg p-2">
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
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1">Economic Calendar</p>
        {loadingEvents ? (
          <div className="space-y-2">{[0,1,2].map(i => <div key={i} className="h-10 bg-background-elevated rounded-lg animate-pulse" />)}</div>
        ) : events.length === 0 ? (
          <p className="text-[10px] font-mono text-text-tertiary">No high-impact events in next 48h.</p>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => {
              const isPast = e.actual !== null && e.actual !== undefined;
              return (
                <div key={i} className="flex items-start gap-3 bg-background-surface/60 border border-border-slate/40 rounded-lg p-2.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
                    e.impact === "high" ? "bg-loss animate-pulse" : e.impact === "medium" ? "bg-warning" : "bg-border-slate/60")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-mono font-bold text-text-primary truncate">{e.event}</p>
                      <span className={cn("text-[8px] font-bold uppercase font-mono shrink-0",
                        e.impact === "high" ? "text-loss" : e.impact === "medium" ? "text-warning" : "text-text-tertiary")}>
                        {e.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[9px] font-mono text-text-tertiary">
                      <span>{e.country} · {e.time} UTC</span>
                      <span>Prev: {e.previous ?? "—"}</span>
                      <span>Est: {e.estimate ?? "—"}</span>
                      {isPast && (
                        <span className={cn("font-bold",
                          e.actual > (e.estimate ?? e.previous) ? "text-profit" : "text-loss")}>
                          Act: {e.actual} {e.actual > (e.estimate ?? e.previous) ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Retail Sentiment Gauge — live data from /api/intelligence/retail-sentiment */}
      <div>
        <div className="flex items-center gap-2 mb-3 border-b border-border-slate/30 pb-1">
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">
            Retail Positioning <span className="text-[8px] normal-case">(contrarian indicator)</span>
          </p>
          {retailData && (
            <span className="ml-auto text-[7px] font-mono text-profit border border-profit/20 bg-profit/10 px-1.5 py-0.5 rounded">LIVE</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-mono mb-1">
            <span className="text-profit font-bold">{retail.longPct}% Long</span>
            <span className="text-loss font-bold">{retail.shortPct}% Short</span>
          </div>
          <div className="h-4 rounded-lg overflow-hidden flex border border-border-slate/30">
            <div className="bg-profit/50 h-full transition-all flex items-center justify-end pr-1" style={{ width: `${retail.longPct}%` }}>
              {retail.longPct > 25 && <span className="text-[7px] font-bold text-profit-dark">{retail.longPct}%</span>}
            </div>
            <div className="bg-loss/50 h-full flex-1 flex items-center justify-start pl-1">
              {retail.shortPct > 25 && <span className="text-[7px] font-bold text-loss-dark">{retail.shortPct}%</span>}
            </div>
          </div>
          {retail.longPct > 70 && (
            <p className="text-[9px] font-mono text-warning flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Retail crowded LONG — institutional may fade this move
            </p>
          )}
          {retail.shortPct > 70 && (
            <p className="text-[9px] font-mono text-warning flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Retail crowded SHORT — potential short squeeze setup
            </p>
          )}
          <p className="text-[8px] font-mono text-text-tertiary/50">When &gt;70% retail one-sided, price often moves against the crowd.</p>
        </div>
      </div>

      {/* News Sentiment — real data from /api/intelligence/news-sentiment (Finnhub + Alpha Vantage, server-side) */}
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/30 pb-1 flex items-center gap-2">
          <Newspaper className="w-3 h-3" /> News Sentiment
        </p>
        {loadingNews ? (
          <div className="space-y-2">{[0,1,2].map(i => <div key={i} className="h-10 bg-background-elevated rounded animate-pulse" />)}</div>
        ) : newsItems.length === 0 ? (
          <p className="text-[10px] font-mono text-text-tertiary">No recent news found for {inst.displayPair}.</p>
        ) : (
          <div className="space-y-2">
            {newsItems.map((item, i) => (
              <a key={i} href={item.url || "#"} target="_blank" rel="noopener noreferrer"
                className="block bg-background-surface/60 border border-border-slate/40 rounded-lg p-2.5 hover:border-accent/30 transition-colors group">
                <div className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
                    item.sentiment === "bullish" ? "bg-profit" : item.sentiment === "bearish" ? "bg-loss" : "bg-white/20")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2">{item.headline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-mono text-text-tertiary">{item.source}</span>
                      <span className={cn("text-[7px] font-mono font-bold uppercase px-1 rounded",
                        item.sentiment === "bullish" ? "text-profit bg-profit/10" :
                        item.sentiment === "bearish" ? "text-loss bg-loss/10" : "text-text-tertiary bg-white/5")}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI Brief Tab ────────────────────────────────────────────────────────────

interface DebateAgent {
  name: string;
  model: string;
  color: string;
  ok: boolean;
  data: Record<string, any>;
  score: number;
}
interface DebateSynthesis {
  consensus_bias: string;
  conviction: string;
  agreement_level: string;
  setup_quality_score: number;
  headline: string;
  trade_thesis: string;
  key_risk: string;
  best_timeframe: string;
  analysts_available: number;
  agent_scores: { technical: number; macro: number; sentiment: number; composite: number };
  where_analysts_disagree: string | null;
}
interface DebateResult {
  symbol: string;
  analysts_available: number;
  synthesis: DebateSynthesis;
  agents: { technician: DebateAgent; strategist: DebateAgent; sentiment: DebateAgent };
  generated_at: string;
  cached?: boolean;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  const pct = Math.max(0, Math.min(100, ((score + 100) / 200) * 100));
  const bgMap: Record<string, string> = { cyan: "bg-accent", green: "bg-profit", blue: "bg-blue-400" };
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-[12px] font-black font-mono w-8 text-right",
        score > 20 ? "text-profit" : score < -20 ? "text-loss" : "text-text-tertiary")}>
        {score > 0 ? "+" : ""}{score}
      </span>
      <div className="w-16 h-1.5 bg-background-elevated rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", bgMap[color] ?? "bg-accent")}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AIBriefTab({ inst, tech, data }: { inst: ScannerInstrument; tech: TechnicalSummary; data: InstrumentData }) {
  const [brief, setBrief] = useState<DebateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cacheRef = useRef<{ result: DebateResult; ts: number } | null>(null);

  const load = useCallback(async (force = false) => {
    if (!force && cacheRef.current && Date.now() - cacheRef.current.ts < 20 * 60 * 1000) {
      setBrief(cacheRef.current.result);
      return;
    }
    setLoading(true); setError(false);
    try {
      const res = await fetch(`/api/intelligence/ai-debate/${inst.scannerSlug}`);
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      cacheRef.current = { result: d, ts: Date.now() };
      setBrief(d);
    } catch { setError(true); } finally { setLoading(false); }
  }, [inst.scannerSlug]);

  useEffect(() => { load(); }, [load]);

  const dataPoints = [tech.rows.length * 3, tech.emaStack.ema20 ? 3 : 0, 20].reduce((a, b) => a + b, 0);

  if (loading) return (
    <div className="p-6 space-y-3">
      <p className="text-[10px] font-mono text-text-tertiary animate-pulse">
        Consulting 3 AI analysts across {dataPoints}+ data points…
      </p>
      {["w-3/4","w-full","w-2/3","w-5/6","w-1/2","w-4/5"].map((w, i) => (
        <div key={i} className={cn("h-3 bg-background-elevated rounded animate-pulse", w)} />
      ))}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[0,1,2].map(i => <div key={i} className="h-12 bg-background-elevated rounded animate-pulse" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 space-y-3">
      <p className="text-[10px] font-mono text-text-tertiary">AI analysis temporarily unavailable. Technical signals remain live.</p>
      <button onClick={() => load(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-border-slate/50 text-[9px] font-mono uppercase hover:border-accent hover:text-accent transition-colors rounded">
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
    </div>
  );

  if (!brief) return (
    <div className="p-6">
      <p className="text-[10px] font-mono text-text-tertiary">Set ANTHROPIC_API_KEY to enable the AI Intelligence Brief.</p>
    </div>
  );

  const s = brief.synthesis;
  const biasColor = s.consensus_bias === "BULLISH" ? "text-profit" : s.consensus_bias === "BEARISH" ? "text-loss" : s.consensus_bias === "CONTESTED" ? "text-warning" : "text-text-tertiary";
  const sq = s.setup_quality_score ?? 0;
  const agentBorders: Record<string, string> = { cyan: "border-l-accent", green: "border-l-profit", blue: "border-l-blue-400" };
  const agentList = [brief.agents.technician, brief.agents.strategist, brief.agents.sentiment];
  const showDivergence = s.agreement_level === "DIVERGENT" || s.agreement_level === "MIXED";
  const genTime = brief.generated_at ? new Date(brief.generated_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="divide-y divide-border-slate/20">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-1">
              INTELLIGENCE BRIEF · {inst.displayPair} · {brief.analysts_available}/3 analysts · {genTime}
            </p>
            <blockquote className="text-[12px] font-mono text-text-primary italic leading-relaxed border-l-2 border-accent pl-3 max-w-[480px]">
              "{s.headline}"
            </blockquote>
            <p className="text-[8px] font-mono text-text-tertiary mt-1 pl-3">— AI Desk</p>
          </div>
          <button onClick={() => load(true)} title="Refresh"
            className="flex items-center gap-1 px-2 py-1 border border-border-slate/40 text-[8px] font-mono uppercase text-text-tertiary hover:border-accent hover:text-accent transition-colors rounded shrink-0 ml-4">
            <RefreshCw className="w-2.5 h-2.5" />{brief.cached ? "Cached" : "Live"}
          </button>
        </div>

        {/* Consensus row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-text-tertiary uppercase">CONSENSUS</span>
            <span className={cn("text-[11px] font-black font-mono uppercase", biasColor)}>{s.consensus_bias}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-text-tertiary uppercase">CONVICTION</span>
            <span className={cn("text-[10px] font-bold font-mono uppercase",
              s.conviction === "HIGH" ? "text-profit" : s.conviction === "MEDIUM" ? "text-warning" : "text-text-tertiary")}>
              {s.conviction}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-text-tertiary uppercase">TIMEFRAME</span>
            <span className="text-[10px] font-mono text-text-secondary">{s.best_timeframe}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[8px] font-mono text-text-tertiary">SETUP</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 bg-background-elevated rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all",
                  sq >= 70 ? "bg-profit" : sq >= 40 ? "bg-warning" : "bg-loss")}
                  style={{ width: `${sq}%` }} />
              </div>
              <span className={cn("text-[10px] font-bold font-mono",
                sq >= 70 ? "text-profit" : sq >= 40 ? "text-warning" : "text-loss")}>{sq}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade thesis */}
      <div className="px-5 py-4">
        <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-2">TRADE THESIS</p>
        <p className="text-[11px] font-mono text-text-secondary leading-relaxed">{s.trade_thesis}</p>
      </div>

      {/* Key risk */}
      <div className="px-5 py-4 bg-loss/3">
        <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-2">KEY RISK</p>
        <p className="text-[11px] font-mono text-text-secondary leading-relaxed">{s.key_risk}</p>
      </div>

      {/* Agent panel */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary">ANALYST PANEL</p>
          <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary">SCORE</p>
        </div>
        <div className="space-y-2">
          {agentList.map(agent => (
            <div key={agent.name}
              className={cn("flex items-center gap-3 border-l-2 pl-3 py-1.5",
                agentBorders[agent.color] ?? "border-l-border-slate")}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-text-primary">
                    {agent.name === "The Technician" ? "📊" : agent.name === "The Strategist" ? "🌍" : "📰"}
                    {" "}{agent.model}
                  </span>
                  {agent.ok ? (
                    <span className={cn("text-[8px] font-bold font-mono uppercase",
                      (agent.data.technical_bias ?? agent.data.flow_bias ?? agent.data.news_momentum) === "BULLISH" ||
                      (agent.data.technical_bias ?? agent.data.flow_bias ?? agent.data.news_momentum) === "ACCELERATING"
                        ? "text-profit"
                        : (agent.data.technical_bias ?? agent.data.flow_bias ?? agent.data.news_momentum) === "BEARISH" ||
                          (agent.data.technical_bias ?? agent.data.flow_bias ?? agent.data.news_momentum) === "FADING"
                        ? "text-loss" : "text-text-tertiary")}>
                      {agent.data.technical_bias ?? agent.data.flow_bias ?? agent.data.news_momentum ?? "—"}
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-text-tertiary/40">UNAVAILABLE</span>
                  )}
                </div>
              </div>
              <ScoreBar score={agent.score} color={agent.color} />
            </div>
          ))}
        </div>
        {/* Composite score */}
        <div className="mt-3 pt-3 border-t border-border-slate/20 flex items-center justify-between">
          <span className="text-[8px] font-mono text-text-tertiary uppercase">Composite (macro 40% / tech 35% / sent 25%)</span>
          <span className={cn("text-[13px] font-black font-mono",
            s.agent_scores.composite > 20 ? "text-profit" :
            s.agent_scores.composite < -20 ? "text-loss" : "text-text-tertiary")}>
            {s.agent_scores.composite > 0 ? "+" : ""}{s.agent_scores.composite}
          </span>
        </div>

        {/* Divergence warning */}
        {showDivergence && s.where_analysts_disagree && (
          <div className="mt-3 flex items-start gap-2 bg-warning/10 border border-warning/20 rounded px-3 py-2">
            <AlertTriangle className="w-3 h-3 text-warning shrink-0 mt-0.5" />
            <p className="text-[9px] font-mono text-warning">{s.where_analysts_disagree}</p>
          </div>
        )}
      </div>

      <p className="px-5 py-3 text-[8px] font-mono text-text-tertiary/40 uppercase tracking-widest">
        NOT FINANCIAL ADVICE · AI GENERATED · {genTime}
      </p>
    </div>
  );
}

// ─── Smart Money Tab ──────────────────────────────────────────────────────────

function RetailGauge({ longPct }: { longPct: number | null }) {
  if (longPct === null) return <p className="text-[10px] font-mono text-text-tertiary">No retail data</p>;
  const angle = ((longPct / 100) * 180) - 90;
  const r = 60;
  const cx = 80, cy = 80;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcPath = (start: number, end: number) => {
    const s = toRad(start - 90), e = toRad(end - 90);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };
  const needleAngle = toRad(angle);
  const nx = cx + (r - 10) * Math.cos(needleAngle), ny = cy + (r - 10) * Math.sin(needleAngle);
  const color = longPct > 70 ? "#ef4444" : longPct < 30 ? "#22c55e" : "#6b7280";

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d={arcPath(0, 54)}  fill="#22c55e" opacity="0.15" />
        <path d={arcPath(54, 126)} fill="#6b7280" opacity="0.15" />
        <path d={arcPath(126, 180)} fill="#ef4444" opacity="0.15" />
        <text x="12" y="82" fontSize="7" fill="#22c55e" fontFamily="monospace">SHORT</text>
        <text x="130" y="82" fontSize="7" fill="#ef4444" fontFamily="monospace">LONG</text>
        <text x="70" y="25" fontSize="7" fill="#9ca3af" fontFamily="monospace">BALANCED</text>
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill={color} />
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="14" fontWeight="900" fill={color} fontFamily="monospace">{longPct}%</text>
        <text x={cx} y={cy + 30} textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">RETAIL LONG</text>
      </svg>
    </div>
  );
}

function SmartMoneyTab({ inst, data }: { inst: ScannerInstrument; data: InstrumentData }) {
  const [cotData, setCotData] = useState<any>(null);
  const [macroData, setMacroData] = useState<any>(null);
  const [retailData, setRetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/intelligence/cot/${inst.scannerSlug}`).then(r => r.json()).catch(() => null),
      fetch(`/api/intelligence/macro/${inst.scannerSlug}`).then(r => r.json()).catch(() => null),
      fetch(`/api/intelligence/retail-sentiment/${inst.scannerSlug}`).then(r => r.json()).catch(() => null),
    ]).then(([cot, macro, retail]) => {
      setCotData(cot);
      setMacroData(macro);
      setRetailData(retail);
    }).finally(() => setLoading(false));
  }, [inst.scannerSlug]);

  if (loading) return (
    <div className="p-6 space-y-3">
      {["w-full","w-3/4","w-full h-32","w-full","w-2/3"].map((w, i) => (
        <div key={i} className={cn("bg-background-elevated rounded animate-pulse", w.includes("h") ? w : `h-4 ${w}`)} />
      ))}
    </div>
  );

  const cotHistory: any[] = (cotData?.history_52w ?? []).slice(0, 8).reverse().map((r: any, i: number) => ({
    week: `W${i + 1}`,
    hedgeFunds: r.net_speculator ?? 0,
    smartMoney: r.net_commercial ?? 0,
    retail:     -(r.net_speculator ?? 0) - (r.net_commercial ?? 0),
  }));

  const signal: string = cotData?.signal ?? "NEUTRAL";
  const signalBorder = signal === "SMART_MONEY_LONG" ? "border-profit" : signal === "SMART_MONEY_SHORT" ? "border-loss" : "border-border-slate/40";
  const signalText   = signal === "SMART_MONEY_LONG" ? "text-profit"  : signal === "SMART_MONEY_SHORT" ? "text-loss"  : "text-text-tertiary";
  const signalBg     = signal === "SMART_MONEY_LONG" ? "bg-profit/8"  : signal === "SMART_MONEY_SHORT" ? "bg-loss/8"  : "bg-background-elevated/40";

  const longPct  = retailData?.long_percent  ?? null;
  const crowd    = retailData?.crowd_label   ?? "BALANCED";
  const retSignal = retailData?.signal       ?? "MIXED";

  const rateDiff  = macroData?.rate_differential ?? null;
  const realYield = macroData?.real_yield_10y    ?? null;
  const vix       = macroData?.vix_level         ?? null;
  const vixRegime = macroData?.vix_regime        ?? "UNKNOWN";
  const regime    = macroData?.regime_label      ?? "UNKNOWN";
  const seriesVals = macroData?.series_values    ?? {};

  const vixColor =
    vix === null ? "text-text-tertiary" :
    vix < 12  ? "text-profit" :
    vix < 17  ? "text-text-secondary" :
    vix < 22  ? "text-warning" :
    vix < 30  ? "text-loss" : "text-red-600";
  const vixBg =
    vix === null ? "bg-background-elevated/40" :
    vix < 12  ? "bg-profit/8" :
    vix < 17  ? "bg-background-elevated/40" :
    vix < 22  ? "bg-warning/8" :
    vix < 30  ? "bg-loss/8" : "bg-red-900/20";
  const vixDesc =
    vix === null ? "" :
    vix < 12  ? "Carry trades and mean reversion work well" :
    vix < 17  ? "Standard strategy selection" :
    vix < 22  ? "Trend following preferred, widen stops" :
    vix < 30  ? "High risk, reduce position sizes, expect whipsaws" :
                "Avoid new positions unless crisis play";
  const vixPct = vix ? Math.min(100, (vix / 40) * 100) : 0;

  const isFx = ["EURUSD","GBPUSD","USDJPY","GBPJPY"].includes(inst.scannerSlug);
  const ccyMap: Record<string, [string, string, string, string]> = {
    EURUSD: ["USD","EUR","FEDFUNDS","ECBDFR"],
    GBPUSD: ["USD","GBP","FEDFUNDS","IUDSOIA"],
    USDJPY: ["USD","JPY","FEDFUNDS","IRSTCB01JPM156N"],
    GBPJPY: ["GBP","JPY","IUDSOIA","IRSTCB01JPM156N"],
  };
  const [ccy1, ccy2, s1key, s2key] = ccyMap[inst.scannerSlug] ?? ["Base","Quote","",""];
  const rate1 = s1key ? seriesVals[s1key] ?? null : null;
  const rate2 = s2key ? seriesVals[s2key] ?? null : null;
  const inflation = seriesVals["T10YIE"] ?? null;

  return (
    <div className="p-5 space-y-6">
      {cotData && !cotData.error && cotHistory.length > 0 && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/20 pb-1">COMMITMENT OF TRADERS — LAST 8 WEEKS</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{label:"SMART MONEY NET", val:cotData.net_commercial, chg:null},
              {label:"HEDGE FUNDS NET", val:cotData.net_speculator, chg:cotData.week_change},
              {label:"COT INDEX", val:null, idx:cotData.cot_index}].map((item,i) => (
              <div key={i} className="bg-background-elevated/40 border border-border-slate/30 rounded p-2">
                <p className="text-[7px] font-mono text-text-tertiary uppercase tracking-widest mb-1">{item.label}</p>
                {item.val !== undefined && item.val !== null ? (
                  <p className={cn("text-[11px] font-black font-mono", item.val > 0 ? "text-profit" : "text-loss")}>
                    {item.val > 0 ? "+" : ""}{item.val.toLocaleString()}
                    {item.chg !== null && item.chg !== undefined && (
                      <span className="text-[8px] font-normal ml-1 text-text-tertiary">
                        ({item.chg > 0 ? "↑" : "↓"}{Math.abs(item.chg).toLocaleString()})
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="text-[11px] font-black font-mono text-accent">{item.idx}/100</p>
                )}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={cotHistory} barSize={8} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fontSize: 8, fontFamily: "monospace", fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fontFamily: "monospace", fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={v => v > 999 ? `${(v/1000).toFixed(0)}k` : String(v)} />
              <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #1f2937", borderRadius: 4, fontSize: 9, fontFamily: "monospace" }}
                formatter={(val: number, name: string) => [val.toLocaleString(), name === "hedgeFunds" ? "Hedge Funds" : name === "smartMoney" ? "Smart Money" : "Retail"]}
              />
              <Bar dataKey="smartMoney" name="Smart Money" radius={[2,2,0,0]}>
                {cotHistory.map((entry, i) => <Cell key={i} fill={entry.smartMoney >= 0 ? "#22c55e" : "#ef4444"} opacity={0.8} />)}
              </Bar>
              <Bar dataKey="hedgeFunds" name="Hedge Funds" fill="#3b82f6" opacity={0.7} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1 justify-center">
            {[{c:"#22c55e",l:"Smart Money (Commercials)"},{c:"#3b82f6",l:"Hedge Funds (Large Specs)"}].map(({c,l}) => (
              <div key={l} className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{background:c}} /><span className="text-[7px] font-mono text-text-tertiary">{l}</span></div>
            ))}
          </div>
        </div>
      )}

      {cotData && !cotData.error && (
        <div className={cn("border rounded-lg p-4", signalBorder, signalBg)}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={cn("w-3.5 h-3.5", signalText)} />
            <span className={cn("text-[9px] font-mono font-bold uppercase tracking-widest", signalText)}>SMART MONEY SIGNAL</span>
          </div>
          <p className={cn("text-[10px] font-black font-mono uppercase mb-2", signalText)}>
            {signal === "SMART_MONEY_LONG" ? "COMMERCIALS ACCUMULATING" :
             signal === "SMART_MONEY_SHORT" ? "COMMERCIALS DISTRIBUTING" : "NEUTRAL POSITIONING"}
          </p>
          <p className="text-[10px] font-mono text-text-secondary leading-relaxed mb-3">
            {signal === "SMART_MONEY_LONG"
              ? `Smart money (commercials) are net long ${cotData.net_commercial > 0 ? "+" : ""}${cotData.net_commercial?.toLocaleString() ?? ""} contracts while hedge funds are net ${cotData.net_speculator < 0 ? "short" : "long"}. Historically this precedes a bullish move on a 2-4 week horizon.`
              : signal === "SMART_MONEY_SHORT"
              ? `Commercials are net short ${cotData.net_commercial?.toLocaleString() ?? ""} contracts while hedge funds hold longs. Commercial short interest historically precedes bearish moves.`
              : "Commercial and speculator positioning is broadly balanced. No strong directional signal from COT data this week."}
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[7px] font-mono text-text-tertiary uppercase">COT Index</p>
              <p className={cn("text-[13px] font-black font-mono", signalText)}>{cotData.cot_index ?? "—"}/100</p>
            </div>
            <div>
              <p className="text-[7px] font-mono text-text-tertiary uppercase">Report Date</p>
              <p className="text-[10px] font-mono text-text-secondary">{cotData.report_date ?? "—"}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/20 pb-1">RETAIL POSITIONING — CONTRARIAN INDICATOR</p>
        <div className="flex items-start gap-6">
          <RetailGauge longPct={longPct} />
          <div className="flex-1">
            {longPct !== null ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border",
                    crowd === "CROWDED_LONG" ? "bg-loss/10 text-loss border-loss/20" :
                    crowd === "CROWDED_SHORT" ? "bg-profit/10 text-profit border-profit/20" : "bg-background-elevated border-border-slate/40 text-text-tertiary")}>
                    {crowd.replace("_", " ")}
                  </span>
                  <span className={cn("text-[9px] font-mono font-bold uppercase",
                    retSignal === "CONTRARIAN_BULLISH" ? "text-profit" :
                    retSignal === "CONTRARIAN_BEARISH" ? "text-loss" : "text-text-tertiary")}>
                    {retSignal === "CONTRARIAN_BULLISH" ? "→ CONTRARIAN BULLISH" :
                     retSignal === "CONTRARIAN_BEARISH" ? "→ CONTRARIAN BEARISH" : "→ MIXED"}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-text-secondary leading-relaxed">
                  {longPct > 70
                    ? `${longPct}% of retail traders are LONG ${inst.displayPair}. When retail crowding exceeds 70%, price reverses against the crowd within 2 weeks in 68% of cases. This is a CONTRARIAN BEARISH signal.`
                    : longPct < 30
                    ? `Only ${longPct}% of retail traders are long ${inst.displayPair} — extreme short bias. Historically this is a contrarian BULLISH signal. Price often squeezes against the retail crowd.`
                    : `Retail positioning is balanced at ${longPct}% long / ${100 - longPct}% short. No extreme crowding — no strong contrarian signal at this time.`}
                </p>
                <p className="text-[8px] font-mono text-text-tertiary/60 mt-2">Source: MyFXBook Community Outlook · {retailData?.fetched_at ? new Date(retailData.fetched_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : ""}</p>
              </>
            ) : (
              <p className="text-[10px] font-mono text-text-tertiary">Retail sentiment data unavailable for this instrument.</p>
            )}
          </div>
        </div>
      </div>

      {isFx && macroData && !macroData.error && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/20 pb-1">REAL YIELD DIFFERENTIAL</p>
          <div className="grid grid-cols-2 gap-4 mb-3">
            {[{ label: ccy1, rate: rate1 }, { label: ccy2, rate: rate2 }].map(({label, rate}) => (
              <div key={label} className="bg-background-elevated/40 border border-border-slate/30 rounded p-3">
                <p className="text-[9px] font-mono font-bold text-text-primary mb-2">[{label}]</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-text-tertiary">Nominal Rate</span>
                    <span className="text-text-primary">{rate !== null ? `${rate.toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-text-tertiary">Inflation (10Y BE)</span>
                    <span className="text-text-primary">{inflation !== null ? `${inflation.toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono border-t border-border-slate/20 pt-1">
                    <span className="text-text-tertiary font-bold">Real Yield</span>
                    <span className={cn("font-bold", rate !== null && inflation !== null && (rate - inflation) > 0 ? "text-profit" : "text-loss")}>
                      {rate !== null && inflation !== null ? `${(rate - inflation) > 0 ? "+" : ""}${(rate - inflation).toFixed(2)}%` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-accent/8 border border-accent/20 rounded p-3">
            <p className="text-[9px] font-mono text-text-secondary leading-relaxed">
              <span className="text-accent font-bold">Real Yield Differential: {rateDiff !== null ? `${rateDiff > 0 ? "+" : ""}${rateDiff.toFixed(2)}%` : "N/A"}</span>
              {rateDiff !== null && ` favours ${rateDiff > 0 ? ccy1 : ccy2}. Higher real yields attract capital flows — institutional money tends to flow toward ${rateDiff > 0 ? ccy1 : ccy2} on this differential.`}
            </p>
          </div>
        </div>
      )}

      {macroData && !macroData.error && (
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-3 border-b border-border-slate/20 pb-1">VIX REGIME INDICATOR</p>
          <div className={cn("border rounded-lg p-4", vixBg,
            vix && vix > 30 ? "border-red-600/30 animate-pulse" : "border-border-slate/40")}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={cn("text-[18px] font-black font-mono", vixColor)}>
                  {vix !== null ? vix.toFixed(1) : "—"}
                </span>
                <span className={cn("text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border",
                  vix && vix < 12  ? "bg-profit/10 text-profit border-profit/20" :
                  vix && vix < 17  ? "bg-background-elevated border-border-slate/40 text-text-secondary" :
                  vix && vix < 22  ? "bg-warning/10 text-warning border-warning/20" :
                  vix && vix < 30  ? "bg-loss/10 text-loss border-loss/20" : "bg-red-900/20 text-red-400 border-red-600/30")}>
                  {vixRegime}
                </span>
                <span className="text-[8px] font-mono text-text-tertiary">VIX</span>
              </div>
              <span className="text-[8px] font-mono text-text-tertiary uppercase">{regime}</span>
            </div>
            <div className="h-2 bg-background-elevated rounded-full overflow-hidden mb-3">
              <div className={cn("h-full rounded-full transition-all",
                vix && vix < 12  ? "bg-profit" :
                vix && vix < 17  ? "bg-text-secondary" :
                vix && vix < 22  ? "bg-warning" :
                vix && vix < 30  ? "bg-loss" : "bg-red-600")}
                style={{ width: `${vixPct}%` }} />
            </div>
            <p className="text-[10px] font-mono text-text-secondary leading-relaxed">{vixDesc}</p>
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
  const [tab, setTab] = useState<CardTab>("SIGNALS");
  const tech = useTechnicalData(inst.scannerSlug, expanded);
  const setupScore = calcSetupScore(data, tech);
  const watched = watchlist.includes(inst.scannerSlug);
  const alertCount = alerts.filter(a => a.slug === inst.scannerSlug).length;
  // Fetch upcoming events for next-event indicator on card face
  const [nextEvent, setNextEvent] = useState<{ label: string; minsAway: number } | null>(null);
  useEffect(() => {
    fetch(`/api/calendar/${inst.scannerSlug}`).then(r => r.json()).then(d => {
      const first = d.events?.[0];
      if (!first || !first.time) { setNextEvent(null); return; }
      const [h, m] = (first.time ?? "00:00").split(":").map(Number);
      const now = new Date(); const evtUtc = new Date();
      evtUtc.setUTCHours(h, m || 0, 0, 0);
      if (evtUtc < now) evtUtc.setUTCDate(evtUtc.getUTCDate() + 1);
      const minsAway = Math.round((evtUtc.getTime() - now.getTime()) / 60000);
      setNextEvent({ label: first.event?.split(" ").slice(0, 4).join(" ") ?? "Event", minsAway });
    }).catch(() => {});
  }, [inst.scannerSlug]);
  const session = getInstrumentSession(inst, activeSessions);
  const changePct = data.changePct ?? 0;
  const isUp = changePct >= 0;

  const sessionColor = session === "CLOSED" ? "text-text-tertiary" :
    session === "LONDON" ? "text-blue-400" : session === "NEW YORK" ? "text-profit" :
    session === "ASIA" ? "text-violet-400" : session === "24/7" ? "text-accent" : "text-text-secondary";

  const tabs: CardTab[] = ["SIGNALS", "FUNDAMENTALS", "AI BRIEF", "SMART MONEY"];

  if (listView) {
    return (
      <div className={cn("border border-border-slate/50 bg-background-surface rounded-xl transition-all overflow-hidden",
        setupScore >= 70 && "ring-1 ring-amber-400/40 shadow-[0_0_20px_rgba(234,179,8,0.08)]")}>
        <div className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-background-elevated/40 transition-colors"
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
          <div className={cn("font-mono text-xs font-bold", isUp ? "text-profit" : "text-loss")}>
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
    <div className={cn("border border-border-slate/50 bg-background-surface rounded-xl flex flex-col transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5",
      setupScore >= 70 && "ring-1 ring-amber-400/40 shadow-[0_0_24px_rgba(234,179,8,0.10)]")}>
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
            <div className={cn("border px-2 py-0.5 text-[7px] font-bold font-mono uppercase rounded", CONSENSUS_STYLE[tech.consensus])}>
              {tech.consensus}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-text-primary">
            {data.loading ? <span className="animate-pulse text-text-tertiary">—</span> : data.price ? formatPrice(data.price, inst.scannerSlug) : "—"}
          </span>
          <span className={cn("text-xs font-bold font-mono", isUp ? "text-profit" : "text-loss")}>
            {data.changePct != null ? `${isUp ? "+" : ""}${data.changePct.toFixed(2)}%` : ""}
          </span>
        </div>
        {/* Setup quality bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-mono">
            <span className="text-text-tertiary uppercase">Setup Score</span>
            <span className={cn("font-bold", setupScore >= 70 ? "text-amber-400" : setupScore >= 40 ? "text-text-secondary" : "text-text-tertiary")}>{setupScore}</span>
          </div>
          <div className="h-1 bg-background-elevated rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all",
              setupScore >= 70 ? "bg-amber-400" : setupScore >= 40 ? "bg-accent/70" : "bg-border-slate/60")}
              style={{ width: `${setupScore}%` }} />
          </div>
        </div>

        {/* TradingView Mini Chart — 1D sparkline */}
        <div className="-mx-4 overflow-hidden" style={{ height: 80 }}>
          <TradingViewMiniChart
            symbol={inst.tvSymbol}
            largeChartUrl={`/dashboard/tools/scanner?symbol=${inst.scannerSlug}`}
            height={80}
            className="w-full"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
          <div>
            <p className="text-text-tertiary mb-0.5">Spread</p>
            <p className="text-text-secondary font-bold">
              {data.spread != null
                ? inst.scannerSlug.includes("JPY") || ["UKX","SPX","NDX","DJI"].includes(inst.scannerSlug)
                  ? data.spread.toFixed(2)
                  : (data.spread * 10000).toFixed(1) + " pips"
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary mb-0.5">ATR(14)</p>
            <p className="text-text-secondary font-bold">
              {data.atr != null
                ? inst.scannerSlug.includes("JPY") || ["UKX","SPX","NDX","DJI"].includes(inst.scannerSlug)
                  ? data.atr.toFixed(1) + " pts"
                  : (data.atr * 10000).toFixed(0) + " pips"
                : "—"}
            </p>
          </div>
          <div>
            <p className={cn("text-[8px] uppercase font-bold", sessionColor)}>{session}</p>
            <p className="text-text-tertiary text-[8px]">Session</p>
          </div>
        </div>
        {/* Next event indicator */}
        {nextEvent && nextEvent.minsAway < 1440 && (
          <div className={cn("flex items-center gap-1.5 text-[8px] font-mono",
            nextEvent.minsAway < 240 ? "text-warning" : "text-text-tertiary")}>
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{nextEvent.label}</span>
            <span className="shrink-0">in {nextEvent.minsAway < 60 ? `${nextEvent.minsAway}m` : `${Math.floor(nextEvent.minsAway / 60)}h`}</span>
          </div>
        )}

        {/* Volume bar */}
        {data.volumePct !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono">
              <span className="text-text-tertiary uppercase">Volume</span>
              <span className={cn(data.volumePct > 120 ? "text-amber-400" : "text-text-tertiary")}>
                {data.volumePct}% avg
              </span>
            </div>
            <div className="h-1 bg-background-elevated rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all",
                data.volumePct > 200 ? "bg-warning" : data.volumePct > 120 ? "bg-warning/70" : "bg-accent/50")}
                style={{ width: `${Math.min(100, data.volumePct)}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-1 border-t border-border-slate/20 space-y-2">
          <div className="flex items-center justify-between">
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
          {/* Calculate Risk — passes live price, ATR, bias, setup score to risk calculator */}
          {data.price && (
            <Link
              href={[
                "/dashboard/tools/position-sizer",
                `?symbol=${inst.scannerSlug}`,
                `&display=${encodeURIComponent(inst.displayPair)}`,
                `&price=${data.price.toFixed(5)}`,
                data.atr != null ? `&atr=${data.atr.toFixed(5)}` : "",
                data.spread != null ? `&spread=${data.spread.toFixed(5)}` : "",
                `&bias=${["STRONG BUY","BUY"].includes(tech.consensus) ? "BULLISH" : ["STRONG SELL","SELL"].includes(tech.consensus) ? "BEARISH" : "NEUTRAL"}`,
                `&setup_score=${setupScore}`,
              ].join("")}
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[8px] font-mono uppercase border border-border-slate/40 rounded text-text-tertiary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
            >
              <Calculator className="w-3 h-3" /> Calculate Risk →
            </Link>
          )}
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
  const TAB_ICONS: Record<CardTab, React.ElementType> = {
    "SIGNALS": BarChart3,
    "FUNDAMENTALS": Newspaper,
    "AI BRIEF": Cpu,
    "SMART MONEY": Building2,
  };
  return (
    <div style={{ maxHeight: show ? "1200px" : "0", overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
      <div className="border-t border-border-slate/30">
        {/* Tab bar */}
        <div className="flex border-b border-border-slate/30 bg-background-elevated/20 overflow-x-auto">
          {tabs.map(t => {
            const Icon = TAB_ICONS[t];
            return (
              <button key={t} onClick={() => setTab(t)}
                className={cn("flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-mono uppercase tracking-widest transition-all whitespace-nowrap",
                  tab === t ? "text-accent border-b-2 border-accent font-bold" : "text-text-tertiary hover:text-text-secondary")}>
                <Icon className="w-3 h-3" />{t}
              </button>
            );
          })}
        </div>
        {/* Tab content */}
        {tab === "SIGNALS"      && <SignalsTab      tech={tech} price={data.price} slug={inst.scannerSlug} tvSymbol={inst.tvSymbol} />}
        {tab === "FUNDAMENTALS" && <FundamentalsTab inst={inst} priceData={data} />}
        {tab === "AI BRIEF"     && <AIBriefTab      inst={inst} tech={tech} data={data} />}
        {tab === "SMART MONEY"  && <SmartMoneyTab   inst={inst} data={data} />}
      </div>
    </div>
  );
}

// ─── Signals Table View ───────────────────────────────────────────────────────

type SigSortCol = "name" | "price" | "change" | "tf15m" | "tf1h" | "tf4h" | "daily" | "weekly" | "consensus" | "setup";
type CatFilter  = "ALL" | "FOREX" | "INDEX" | "COMMODITY" | "CRYPTO";
type BiasFilter = "ALL" | "BULL" | "BEAR";

interface SignalRow {
  slug: string;
  signals: Record<string, "BUY" | "SELL" | "NEUTRAL">;
  totalScore: number;
  consensus: string;
  alignedCount: number;
  alignedDir: "BUY" | "SELL" | "NEUTRAL";
}

function TFBadge({ signal }: { signal: "BUY" | "SELL" | "NEUTRAL" | undefined }) {
  if (!signal) return <span className="text-white/20 text-xs">—</span>;
  if (signal === "BUY") return (
    <div className="flex items-center justify-center w-6 h-6 rounded bg-profit/15 border border-profit/25">
      <TrendingUp className="w-3 h-3 text-profit" />
    </div>
  );
  if (signal === "SELL") return (
    <div className="flex items-center justify-center w-6 h-6 rounded bg-loss/15 border border-loss/25">
      <TrendingDown className="w-3 h-3 text-loss" />
    </div>
  );
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded bg-white/5 border border-white/10">
      <Minus className="w-3 h-3 text-white/30" />
    </div>
  );
}

function SortTh({ col, label, sort, dir, onSort }: {
  col: SigSortCol; label: string; sort: SigSortCol; dir: "asc" | "desc";
  onSort: (c: SigSortCol) => void;
}) {
  const active = sort === col;
  return (
    <th onClick={() => onSort(col)}
      className={cn("px-3 py-2.5 text-left text-[8px] font-mono uppercase tracking-widest cursor-pointer select-none whitespace-nowrap transition-colors",
        active ? "text-accent" : "text-white/40 hover:text-white/70")}>
      <span className="flex items-center gap-1">
        {label}
        {active && <span className="text-accent">{dir === "desc" ? "↓" : "↑"}</span>}
      </span>
    </th>
  );
}

function SignalsTableView({
  priceData,
}: {
  priceData: Record<string, InstrumentData>;
}) {
  const [matrix, setMatrix] = useState<Record<string, SignalRow>>({});
  const [matrixLoading, setMatrixLoading] = useState(true);
  const [matrixUpdated, setMatrixUpdated] = useState<string | null>(null);

  const [sort, setSort] = useState<SigSortCol>("consensus");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [catFilter, setCatFilter] = useState<CatFilter>("ALL");
  const [minSetup, setMinSetup] = useState(0);
  const [biasFilter, setBiasFilter] = useState<BiasFilter>("ALL");
  const [tfAlign, setTfAlign] = useState(0);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [bannerEvent, setBannerEvent] = useState<{ label: string; countdown: string } | null>(null);

  useEffect(() => {
    fetch("/api/scanner/signals-matrix")
      .then(r => r.json())
      .then(d => { if (d.matrix) { setMatrix(d.matrix); setMatrixUpdated(d.updatedAt); } })
      .catch(() => {})
      .finally(() => setMatrixLoading(false));
  }, []);

  useEffect(() => {
    Promise.all(["EURUSD","GBPUSD","USDJPY","SPX"].map(s =>
      fetch(`/api/calendar/${s}`).then(r => r.json()).catch(() => ({ events: [] }))
    )).then(results => {
      const all = results.flatMap((r: any) => (r.events ?? []).filter((e: any) => e.impact === "high"));
      let best: { label: string; targetMs: number } | null = null;
      const seen = new Set<string>();
      for (const e of all) {
        if (!e.time || seen.has(e.event)) continue;
        seen.add(e.event);
        const [h, m] = (e.time as string).split(":").map(Number);
        const d = new Date(); d.setUTCHours(h, m || 0, 0, 0);
        if (d < new Date()) d.setUTCDate(d.getUTCDate() + 1);
        const ms = d.getTime() - Date.now();
        if (ms > 0 && ms < 86400000 && (!best || ms < best.targetMs - Date.now()))
          best = { label: `${e.country} ${(e.event as string).split(" ").slice(0, 4).join(" ")}`, targetMs: d.getTime() };
      }
      if (!best) return;
      const fmt = () => {
        const rem = best!.targetMs - Date.now();
        if (rem <= 0) { setBannerEvent({ label: best!.label, countdown: "NOW" }); return; }
        const h = Math.floor(rem / 3600000), m = Math.floor((rem % 3600000) / 60000);
        setBannerEvent({ label: best!.label, countdown: h > 0 ? `${h}h ${m}m` : `${m}m` });
      };
      fmt(); const t = setInterval(fmt, 60000); return () => clearInterval(t);
    });
  }, []);

  const handleSort = (col: SigSortCol) => {
    if (sort === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSort(col); setSortDir("desc"); }
  };

  const sigScore = (s?: "BUY"|"SELL"|"NEUTRAL") => s === "BUY" ? 1 : s === "SELL" ? -1 : 0;

  const rows = SCANNER_INSTRUMENTS
    .filter(inst => {
      if (catFilter === "FOREX"     && inst.category !== "forex")       return false;
      if (catFilter === "INDEX"     && inst.category !== "indices")     return false;
      if (catFilter === "COMMODITY" && inst.category !== "commodities") return false;
      if (catFilter === "CRYPTO"    && inst.category !== "crypto")      return false;
      const sig = matrix[inst.scannerSlug];
      const pData = priceData[inst.scannerSlug];
      const setup = calcSetupScore(pData ?? ({} as InstrumentData), {} as TechnicalSummary);
      if (minSetup > 0 && setup < minSetup) return false;
      if (biasFilter === "BULL" && sig && sig.totalScore <= 0) return false;
      if (biasFilter === "BEAR" && sig && sig.totalScore >= 0) return false;
      if (tfAlign > 0 && sig && sig.alignedCount < tfAlign) return false;
      return true;
    })
    .sort((a, b) => {
      const sa = matrix[a.scannerSlug], sb = matrix[b.scannerSlug];
      const da = priceData[a.scannerSlug], db = priceData[b.scannerSlug];
      if (sort === "name") return sortDir === "asc" ? a.displayPair.localeCompare(b.displayPair) : b.displayPair.localeCompare(a.displayPair);
      let va = 0, vb = 0;
      if (sort === "price")     { va = da?.price ?? 0;     vb = db?.price ?? 0; }
      if (sort === "change")    { va = da?.changePct ?? 0; vb = db?.changePct ?? 0; }
      if (sort === "consensus") { va = sa?.totalScore ?? 0; vb = sb?.totalScore ?? 0; }
      if (sort === "setup")     { va = calcSetupScore(da ?? ({} as InstrumentData), {} as TechnicalSummary); vb = calcSetupScore(db ?? ({} as InstrumentData), {} as TechnicalSummary); }
      if (sort === "tf15m")   { va = sigScore(sa?.signals["15m"]);    vb = sigScore(sb?.signals["15m"]); }
      if (sort === "tf1h")    { va = sigScore(sa?.signals["1H"]);     vb = sigScore(sb?.signals["1H"]); }
      if (sort === "tf4h")    { va = sigScore(sa?.signals["4H"]);     vb = sigScore(sb?.signals["4H"]); }
      if (sort === "daily")   { va = sigScore(sa?.signals["Daily"]);  vb = sigScore(sb?.signals["Daily"]); }
      if (sort === "weekly")  { va = sigScore(sa?.signals["Weekly"]); vb = sigScore(sb?.signals["Weekly"]); }
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const alignedCount = Object.values(matrix).filter(r => r.alignedCount >= 3).length;
  const minsAgo = matrixUpdated ? Math.floor((Date.now() - new Date(matrixUpdated).getTime()) / 60000) : null;
  const SEL = "bg-background-elevated border border-border-slate/50 text-text-secondary text-[9px] font-mono uppercase tracking-widest px-2.5 py-1.5 focus:outline-none focus:border-accent cursor-pointer rounded";

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-center gap-4 px-5 py-3 bg-background-elevated border border-border-slate/40 rounded-xl">
        <span className="text-[13px]">📊</span>
        <p className="text-[10px] font-mono text-text-secondary leading-relaxed">
          {matrixLoading ? (
            <span className="animate-pulse text-text-tertiary">Loading signal matrix…</span>
          ) : (
            <>
              <span className="text-text-primary font-bold">{alignedCount} instrument{alignedCount !== 1 ? "s" : ""}</span>
              {" "}show aligned multi-timeframe signals.{" "}
              {bannerEvent
                ? <><span className="text-warning font-bold">⚡ {bannerEvent.label}</span>{" "}in{" "}<span className="text-warning font-bold">{bannerEvent.countdown}</span>.</>
                : <span className="text-text-tertiary">No high-impact events found in next 24h.</span>}
            </>
          )}
        </p>
        {minsAgo !== null && (
          <span className="ml-auto text-[8px] font-mono text-text-tertiary flex items-center gap-1 shrink-0">
            <RefreshCw className="w-2.5 h-2.5" />{minsAgo < 1 ? "just now" : `${minsAgo}m ago`}
          </span>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value as CatFilter)} className={SEL}>
          <option value="ALL">ALL MARKETS</option>
          <option value="FOREX">FOREX ONLY</option>
          <option value="INDEX">INDICES ONLY</option>
          <option value="COMMODITY">COMMODITIES</option>
          <option value="CRYPTO">CRYPTO ONLY</option>
        </select>
        <select value={minSetup} onChange={e => setMinSetup(Number(e.target.value))} className={SEL}>
          <option value={0}>MIN SETUP: ANY</option>
          <option value={40}>MIN SETUP: 40</option>
          <option value={60}>MIN SETUP: 60</option>
          <option value={70}>MIN SETUP: 70+</option>
        </select>
        <select value={biasFilter} onChange={e => setBiasFilter(e.target.value as BiasFilter)} className={SEL}>
          <option value="ALL">BIAS: ALL</option>
          <option value="BULL">BULLISH ONLY</option>
          <option value="BEAR">BEARISH ONLY</option>
        </select>
        <select value={tfAlign} onChange={e => setTfAlign(Number(e.target.value))} className={SEL}>
          <option value={0}>TF ALIGN: ANY</option>
          <option value={3}>TF ALIGN: 3+ ★</option>
          <option value={4}>TF ALIGN: 4+</option>
          <option value={5}>TF ALIGN: ALL 5</option>
        </select>
        <span className="ml-auto text-[9px] font-mono text-text-tertiary">{rows.length} / {SCANNER_INSTRUMENTS.length} instruments</span>
      </div>

      {/* Table */}
      <div className="bg-background-surface border border-border-slate/50 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background-elevated/60 border-b border-border-slate/40">
                <SortTh col="name"      label="Instrument" sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="price"     label="Price"      sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="change"    label="Chg%"       sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="tf15m"     label="15m"        sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="tf1h"      label="1H"         sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="tf4h"      label="4H"         sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="daily"     label="Daily"      sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="weekly"    label="Weekly"     sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="consensus" label="Consensus"  sort={sort} dir={sortDir} onSort={handleSort} />
                <SortTh col="setup"     label="Setup"      sort={sort} dir={sortDir} onSort={handleSort} />
                <th className="px-3 py-2.5 text-left text-[8px] font-mono uppercase tracking-widest text-white/40 whitespace-nowrap">Next Event</th>
                <th className="px-3 py-2.5 text-left text-[8px] font-mono uppercase tracking-widest text-white/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {matrixLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border-slate/20 animate-pulse">
                      {Array.from({ length: 12 }).map((_, j) => (
                        <td key={j} className="px-3 py-3.5">
                          <div className="h-3.5 bg-background-elevated rounded w-full max-w-[80px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map(inst => (
                    <SignalsTableRow
                      key={inst.scannerSlug}
                      inst={inst}
                      priceData={priceData[inst.scannerSlug] ?? ({} as InstrumentData)}
                      matrixRow={matrix[inst.scannerSlug] ?? null}
                      expanded={expandedSlug === inst.scannerSlug}
                      onToggleExpand={() => setExpandedSlug(s => s === inst.scannerSlug ? null : inst.scannerSlug)}
                    />
                  ))
              }
              {!matrixLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-text-tertiary font-mono text-xs">
                    No instruments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SignalsTableRow({
  inst, priceData, matrixRow, expanded, onToggleExpand,
}: {
  inst: ScannerInstrument;
  priceData: InstrumentData;
  matrixRow: SignalRow | null;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [nextEvt, setNextEvt] = useState<{ minsAway: number } | null>(null);
  const [expandedTab, setExpandedTab] = useState<CardTab>("SIGNALS");
  const tech = useTechnicalData(inst.scannerSlug, expanded);

  useEffect(() => {
    fetch(`/api/calendar/${inst.scannerSlug}`).then(r => r.json()).then(d => {
      const first = (d.events ?? []).find((e: any) => e.impact === "high") ?? d.events?.[0];
      if (!first?.time) return;
      const [h, m] = (first.time as string).split(":").map(Number);
      const dt = new Date(); dt.setUTCHours(h, m || 0, 0, 0);
      if (dt < new Date()) dt.setUTCDate(dt.getUTCDate() + 1);
      const mins = Math.round((dt.getTime() - Date.now()) / 60000);
      if (mins < 1440) setNextEvt({ minsAway: mins });
    }).catch(() => {});
  }, [inst.scannerSlug]);

  const changePct = priceData.changePct ?? 0;
  const isUp = changePct >= 0;
  const sigs = matrixRow?.signals ?? {};
  const setupScore = calcSetupScore(priceData, expanded ? tech : ({} as TechnicalSummary));
  const score = matrixRow?.totalScore ?? 0;
  const aligned3Plus = (matrixRow?.alignedCount ?? 0) >= 3;
  const alignedDir = matrixRow?.alignedDir;

  return (
    <>
      <tr
        className={cn(
          "border-b border-border-slate/20 transition-colors cursor-pointer",
          expanded ? "bg-background-elevated/40" : "hover:bg-background-elevated/20",
          aligned3Plus && !expanded && "border-l-2 border-l-accent/50"
        )}
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-[160px]">
            <SetupScoreDial score={setupScore} size={30} />
            <div>
              <p className="font-black font-mono text-[11px] text-text-primary leading-tight">{inst.displayPair}</p>
              <p className="text-[7px] font-mono text-text-tertiary uppercase tracking-widest">{CATEGORY_LABEL[inst.category]}</p>
            </div>
            {aligned3Plus && (
              <span className={cn("text-[7px] font-bold font-mono px-1.5 py-0.5 rounded uppercase shrink-0 border",
                alignedDir === "BUY" ? "bg-profit/10 text-profit border-profit/20" : "bg-loss/10 text-loss border-loss/20")}>
                {matrixRow?.alignedCount}× ALIGN
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-3 font-mono text-[11px] font-bold text-text-primary text-right whitespace-nowrap">
          {priceData.loading ? "—" : priceData.price ? formatPrice(priceData.price, inst.scannerSlug) : "—"}
        </td>
        <td className={cn("px-3 py-3 font-mono text-[10px] font-bold text-right whitespace-nowrap", isUp ? "text-profit" : "text-loss")}>
          {`${isUp ? "+" : ""}${changePct.toFixed(2)}%`}
        </td>
        {(["15m","1H","4H","Daily","Weekly"] as const).map(tf => (
          <td key={tf} className="px-2 py-3">
            <div className="flex justify-center">
              <TFBadge signal={sigs[tf]} />
            </div>
          </td>
        ))}
        <td className="px-3 py-3 text-center">
          {matrixRow ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className={cn("text-[14px] font-black font-mono leading-none",
                score > 1 ? "text-profit" : score < -1 ? "text-loss" : "text-text-tertiary")}>
                {score > 0 ? "+" : ""}{score}
              </span>
              <span className={cn("text-[6px] font-mono uppercase tracking-wide",
                score > 1 ? "text-profit/60" : score < -1 ? "text-loss/60" : "text-text-tertiary/60")}>
                {matrixRow.consensus}
              </span>
            </div>
          ) : <span className="text-text-tertiary">—</span>}
        </td>
        <td className="px-3 py-3">
          <div className="w-[60px] mx-auto">
            <div className="h-1.5 bg-background-elevated rounded-full overflow-hidden mb-0.5">
              <div className={cn("h-full rounded-full transition-all",
                setupScore >= 70 ? "bg-amber-400" : setupScore >= 40 ? "bg-accent" : "bg-border-slate/60")}
                style={{ width: `${setupScore}%` }} />
            </div>
            <p className="text-[7px] font-mono text-text-tertiary text-center">{setupScore}</p>
          </div>
        </td>
        <td className="px-3 py-3 text-center whitespace-nowrap">
          {nextEvt ? (
            <span className={cn("text-[9px] font-mono font-bold",
              nextEvt.minsAway < 60 ? "text-warning" : "text-text-tertiary")}>
              {nextEvt.minsAway < 60 ? `${nextEvt.minsAway}m` : `${Math.floor(nextEvt.minsAway / 60)}h`}
            </span>
          ) : <span className="text-text-tertiary text-[9px]">—</span>}
        </td>
        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
          <button onClick={onToggleExpand}
            className={cn("flex items-center gap-1 px-2.5 py-1.5 text-[8px] font-mono font-bold uppercase border rounded transition-all whitespace-nowrap",
              expanded
                ? "bg-accent text-white border-accent"
                : "bg-accent/10 text-accent border-accent/30 hover:bg-accent hover:text-white")}>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {expanded ? "CLOSE" : "ANALYSE"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={12} className="p-0 border-b border-border-slate/30">
            <div className="border-t border-accent/20">
              <ExpandedPanel
                show={true}
                tab={expandedTab}
                setTab={setExpandedTab}
                tabs={["SIGNALS", "FUNDAMENTALS", "AI BRIEF", "SMART MONEY"] as CardTab[]}
                inst={inst}
                data={priceData}
                tech={tech}
                setupScore={setupScore}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Market Intelligence Bar ─────────────────────────────────────────────────

function FearGreedGauge({ vixPrice }: { vixPrice: number | null }) {
  const score = vixPrice === null ? null
    : vixPrice < 15  ? Math.round(75 + ((15  - vixPrice) / 15)  * 25)
    : vixPrice < 20  ? Math.round(50 + ((20  - vixPrice) / 5)   * 25)
    : vixPrice < 30  ? Math.round(20 + ((30  - vixPrice) / 10)  * 30)
    : Math.max(0, Math.round(20 - (vixPrice - 30) * 2));
  const label = score === null ? "—" : score >= 75 ? "GREED" : score >= 50 ? "NEUTRAL" : score >= 25 ? "FEAR" : "EXTREME FEAR";
  const color = score === null ? "#4b5563" : score >= 75 ? "#00c853" : score >= 50 ? "#f59e0b" : score >= 25 ? "#f97316" : "#ef4444";
  const r = 20;
  const arcLen = Math.PI * r;
  const filled = score !== null ? (score / 100) * arcLen : 0;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={48} height={28} viewBox="0 0 48 28" style={{ overflow: "visible" }}>
        <path d={`M 4 24 A ${r} ${r} 0 0 1 44 24`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinecap="round" />
        {score !== null && (
          <path d={`M 4 24 A ${r} ${r} 0 0 1 44 24`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={`${filled} ${arcLen}`} style={{ filter: `drop-shadow(0 0 5px ${color}88)` }} />
        )}
      </svg>
      <span className="text-[13px] font-black font-mono leading-none" style={{ color }}>{score ?? "—"}</span>
      <span className="text-[7px] font-mono uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  );
}

function MarketIntelligenceBar({
  priceData, activeSessions, onSignalBias,
}: {
  priceData: Record<string, InstrumentData>;
  activeSessions: string[];
  onSignalBias: (b: "BULL" | "BEAR" | "NEUT" | null) => void;
}) {
  const vixDxy = useTwelveData(["VIX", "DXY"]);
  const [gold, setGold] = useState<{ price: number | null; changePct: number | null }>({ price: null, changePct: null });
  const [nextEvt, setNextEvt] = useState<{ label: string; targetMs: number } | null>(null);
  const [countdown, setCountdown] = useState("");
  const [signalBias, setSignalBias] = useState<"BULL" | "BEAR" | "NEUT" | null>(null);

  const tdKey = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "") : "";

  // Fetch Gold
  useEffect(() => {
    if (!tdKey) return;
    fetch(`https://api.twelvedata.com/quote?symbol=XAU/USD&apikey=${tdKey}`)
      .then(r => r.json()).then(d => {
        if (!d.code) setGold({ price: parseFloat(d.close ?? "0") || null, changePct: parseFloat(d.percent_change ?? "0") || null });
      }).catch(() => {});
  }, [tdKey]);

  // Fetch next high-impact event across all currencies
  useEffect(() => {
    const slugs = ["EURUSD", "GBPUSD", "USDJPY", "SPX", "BTCUSDT"];
    Promise.all(slugs.map(s => fetch(`/api/calendar/${s}`).then(r => r.json()).catch(() => ({ events: [] }))))
      .then(results => {
        const seen = new Set<string>();
        const all = results.flatMap(r => (r.events ?? []).filter((e: any) => e.impact === "high"));
        let best: { label: string; targetMs: number } | null = null;
        for (const e of all) {
          if (!e.time || seen.has(e.event)) continue;
          seen.add(e.event);
          const [hh, mm] = (e.time as string).split(":").map(Number);
          const d = new Date();
          d.setUTCHours(hh, mm || 0, 0, 0);
          if (d.getTime() < Date.now()) d.setUTCDate(d.getUTCDate() + 1);
          const ms = d.getTime() - Date.now();
          if (ms > 0 && ms < 86400000 && (!best || ms < best.targetMs - Date.now())) {
            best = { label: `${e.country} ${(e.event as string).split(" ").slice(0, 4).join(" ")}`, targetMs: d.getTime() };
          }
        }
        setNextEvt(best);
      });
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!nextEvt) { setCountdown(""); return; }
    const tick = () => {
      const rem = nextEvt.targetMs - Date.now();
      if (rem <= 0) { setCountdown("NOW"); return; }
      const h = Math.floor(rem / 3600000);
      const m = Math.floor((rem % 3600000) / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setCountdown(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [nextEvt]);

  const vix = vixDxy["VIX"];
  const dxy = vixDxy["DXY"];
  const vixPrice = vix?.price ?? null;

  // Top mover
  const topMover = SCANNER_INSTRUMENTS.reduce<{ inst: ScannerInstrument; pct: number } | null>((best, inst) => {
    const p = Math.abs(priceData[inst.scannerSlug]?.changePct ?? 0);
    return !best || p > best.pct ? { inst, pct: p } : best;
  }, null);
  const topMoverRaw = topMover ? (priceData[topMover.inst.scannerSlug]?.changePct ?? 0) : 0;

  // Signal counts (heuristic from changePct — MTF data populates as cards are opened)
  const counts = SCANNER_INSTRUMENTS.reduce((acc, inst) => {
    const p = priceData[inst.scannerSlug]?.changePct ?? 0;
    if (p > 0.15) acc.bull++; else if (p < -0.15) acc.bear++; else acc.neut++;
    return acc;
  }, { bull: 0, neut: 0, bear: 0 });

  const SESSION_DATA = [
    { name: "ASIA",     open: activeSessions.includes("ASIA"),     flag: "🇯🇵", hours: "00–09" },
    { name: "LONDON",   open: activeSessions.includes("LONDON"),   flag: "🇬🇧", hours: "08–16:30" },
    { name: "NEW YORK", open: activeSessions.includes("NEW YORK"), flag: "🇺🇸", hours: "13:30–20" },
  ];

  // Add weekend indicator to sessions widget
  const now = new Date();
  const isWeekend = now.getUTCDay() === 0 || now.getUTCDay() === 6;
  const marketClosed = activeSessions.length === 0;

  const Widget = ({ children, label, className = "" }: { children: React.ReactNode; label: string; className?: string }) => (
    <div className={cn("flex flex-col items-center justify-center gap-2 px-5 py-4 min-w-[170px] shrink-0", className)}>
      <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-white/40 text-center">{label}</p>
      {children}
    </div>
  );

  const Divider = () => <div className="w-px self-stretch bg-white/8 shrink-0" />;

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-stretch overflow-x-auto scrollbar-none">

        {/* 1 — Fear & Greed */}
        <Widget label="Market Sentiment">
          <FearGreedGauge vixPrice={vixPrice} />
          {vixPrice !== null && (
            <p className="text-[8px] font-mono text-white/40 text-center">VIX {vixPrice.toFixed(1)}</p>
          )}
        </Widget>

        <Divider />

        {/* 2 — DXY */}
        <Widget label="USD Index (DXY)">
          {dxy?.price ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[18px] font-black font-mono text-white">{dxy.price.toFixed(2)}</span>
              <span className={cn("text-[10px] font-bold font-mono flex items-center gap-0.5",
                (dxy.changePct ?? 0) >= 0 ? "text-[#00c853]" : "text-[#ef4444]")}>
                {(dxy.changePct ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {(dxy.changePct ?? 0) >= 0 ? "+" : ""}{dxy.changePct?.toFixed(2)}%
              </span>
              <p className="text-[7px] font-mono text-white/30 text-center leading-tight max-w-[130px]">
                {(dxy.changePct ?? 0) > 0.1 ? "Headwind for EUR, GBP, Gold" : (dxy.changePct ?? 0) < -0.1 ? "Tailwind for EUR, GBP, Gold" : "DXY flat"}
              </p>
            </div>
          ) : <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />}
        </Widget>

        <Divider />

        {/* 3 — Gold */}
        <Widget label="Gold (XAU/USD)">
          {gold.price ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[18px] font-black font-mono text-[#fbbf24]">${gold.price.toFixed(0)}</span>
              <span className={cn("text-[10px] font-bold font-mono",
                (gold.changePct ?? 0) >= 0 ? "text-[#00c853]" : "text-[#ef4444]")}>
                {(gold.changePct ?? 0) >= 0 ? "+" : ""}{gold.changePct?.toFixed(2)}%
              </span>
              <p className="text-[7px] font-mono text-white/30 text-center leading-tight max-w-[130px]">
                {(gold.changePct ?? 0) > 0.3 ? "Rising — risk-off sentiment" : "Stable"}
              </p>
            </div>
          ) : <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />}
        </Widget>

        <Divider />

        {/* 4 — Sessions */}
        <Widget label="Trading Sessions">
          <div className="flex flex-col gap-1.5 w-full">
            {SESSION_DATA.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  s.open ? "bg-[#00c853] shadow-[0_0_6px_#00c853]" : "bg-white/20")} />
                <span className="text-[8px] font-mono">
                  <span className="mr-1">{s.flag}</span>
                  <span className={s.open ? "text-white font-bold" : "text-white/40"}>{s.name}</span>
                </span>
                {s.open && <span className="ml-auto text-[7px] font-mono text-[#00c853] font-bold">LIVE</span>}
              </div>
            ))}
          </div>
        </Widget>

        <Divider />

        {/* 5 — Top Mover */}
        <Widget label="Top Mover Today">
          {topMover && priceData[topMover.inst.scannerSlug]?.price ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[12px] font-black font-mono text-white tracking-wider">
                {topMover.inst.displayPair}
              </span>
              <span className={cn(
                "text-[14px] font-black font-mono px-3 py-0.5 rounded-full",
                topMoverRaw >= 0
                  ? "bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30"
                  : "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30"
              )}>
                {topMoverRaw >= 0 ? "+" : ""}{topMoverRaw.toFixed(2)}%
              </span>
              <p className="text-[7px] font-mono text-white/30">{topMover.inst.category}</p>
            </div>
          ) : <div className="w-20 h-10 bg-white/10 rounded animate-pulse" />}
        </Widget>

        <Divider />

        {/* 6 — Next High-Impact Event */}
        <Widget label="Next High-Impact Event">
          {nextEvt ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5 bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-2.5 py-1 rounded-full">
                <span className="text-[#f59e0b] text-[10px]">⚡</span>
                <span className="text-[10px] font-black font-mono text-[#f59e0b]">{countdown || "…"}</span>
              </div>
              <p className="text-[8px] font-mono text-white/60 text-center max-w-[140px] leading-tight">{nextEvt.label}</p>
            </div>
          ) : (
            <p className="text-[8px] font-mono text-white/30 text-center">No high-impact<br/>events today</p>
          )}
        </Widget>

        <Divider />

        {/* 7 — Signals Summary */}
        <Widget label="Signals Summary">
          <div className="flex flex-col gap-1.5 w-full">
            {([
              { key: "BULL" as const, label: "BULLISH", count: counts.bull, color: "#00c853", dot: "🟢" },
              { key: "NEUT" as const, label: "NEUTRAL", count: counts.neut, color: "#6b7280", dot: "⚪" },
              { key: "BEAR" as const, label: "BEARISH", count: counts.bear, color: "#ef4444", dot: "🔴" },
            ]).map(item => (
              <button key={item.key}
                onClick={() => {
                  const next = signalBias === item.key ? null : item.key;
                  setSignalBias(next);
                  onSignalBias(next);
                }}
                className={cn("flex items-center gap-2 px-2 py-0.5 rounded transition-all text-left w-full",
                  signalBias === item.key ? "bg-white/15 ring-1 ring-white/30" : "hover:bg-white/8")}>
                <span className="text-[9px]">{item.dot}</span>
                <span className="text-[11px] font-black font-mono" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[8px] font-mono text-white/50 uppercase">{item.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[7px] font-mono text-white/20 text-center">Click to filter</p>
        </Widget>

      </div>
    </div>
  );
}

// ─── Main Scanner Grid ────────────────────────────────────────────────────────

function MarketScannerGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [sort, setSort] = useState<SortMode>("name");
  const [signalBias, setSignalBias] = useState<"BULL" | "BEAR" | "NEUT" | null>(null);
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

  // ── Reactive session clock — updates every minute so session badges stay accurate
  const [sessionNow, setSessionNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setSessionNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const activeSessions = getActiveSessions(sessionNow);

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
      // handled by SignalsTableView — show all for grid fallback
      return true;
    }
    // Signal bias filter from intelligence bar
    if (signalBias) {
      const p = priceData[inst.scannerSlug]?.changePct ?? 0;
      if (signalBias === "BULL") return p > 0.15;
      if (signalBias === "BEAR") return p < -0.15;
      if (signalBias === "NEUT") return p >= -0.15 && p <= 0.15;
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

      {/* Intelligence Bar */}
      <MarketIntelligenceBar
        priceData={priceData}
        activeSessions={activeSessions}
        onSignalBias={bias => {
          setSignalBias(bias);
          if (bias) setFilter("ALL");
        }}
      />

      {/* Filter tabs — always visible */}
      <div className="flex items-center gap-1 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all",
              filter === f ? "bg-accent text-white border-accent" : "border-border-slate/40 text-text-tertiary hover:border-accent hover:text-accent")}>
            {f}
          </button>
        ))}
      </div>

      {filter === "SIGNALS" ? (
        <SignalsTableView priceData={priceData} />
      ) : (
        <>
          {/* Sort + View toggle */}
          <div className="flex items-center gap-2 justify-end">
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
      </>
      )}

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
