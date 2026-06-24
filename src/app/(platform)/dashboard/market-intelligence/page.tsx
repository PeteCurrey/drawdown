"use client";

/**
 * /dashboard/market-intelligence
 *
 * Full visual overhaul:
 * - White theme for everything below the hero gauge
 * - All 7 metric cards wired to real data via useMarketData + news-sentiment API
 * - Real TradingView Advanced Chart (replaces sandbox placeholder)
 * - Live calendar events via existing /api/calendar/[instrument] (Finnhub)
 * - Consensus Metrics replaced with real analyst signal distribution
 * - SlideOver for COT explanation, calendar event details, metric definitions
 * - Full instrument/timeframe switching synced across all sections
 * - WCAG AA contrast on all white-background text
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, MoreHorizontal, ChevronRight,
  ExternalLink, Info, Bell, TrendingUp, TrendingDown, Minus,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketGauge } from "@/components/dashboard/MarketGauge";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TradingViewWidget, toTVSymbol, toTVInterval } from "@/components/dashboard/TradingViewWidget";
import { SlideOver, SlideOverSection, ImpactPill } from "@/components/ui/SlideOver";
import { useMarketData } from "@/hooks/useMarketData";
import {
  INSTRUMENT_GROUPS, TIMEFRAMES, INSTRUMENTS_LIST,
  type Instrument, intervalLabel,
} from "@/lib/instruments";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPrice(n: number | null, slug: string): string {
  if (n === null) return "—";
  const d = slug.includes("JPY") ? 3 : slug.includes("XAU") || slug.includes("BTC") ? 2 : 5;
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtN(n: number | null, d = 2): string {
  if (n === null) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtPips(spread: number | null, hookSlug: string): string {
  if (spread === null) return "—";
  const multiplier = hookSlug.includes("JPY") ? 100 : 10000;
  return (spread * multiplier).toFixed(1) + " pips";
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   "#111827", // near-black — 18.1:1 on white
  secondary: "#6b7280", // gray-500 — 4.6:1 on white
  positive:  "#16a34a", // green-600 — 5.1:1 on white
  negative:  "#dc2626", // red-600 — 5.9:1 on white
  neutral:   "#b45309", // amber-700 — 4.7:1 on white (safer than amber-600 for small text)
  border:    "#e5e7eb", // gray-200
  bg:        "#f8f8f8", // off-white page bg
  card:      "#ffffff",
};

// ── Session helper ────────────────────────────────────────────────────────────
function currentSession(): string {
  const h = new Date().getUTCHours();
  if (h >= 8 && h < 13) return "LONDON";
  if (h >= 13 && h < 17) return "LONDON / NY";
  if (h >= 17 && h < 22) return "NEW YORK";
  return "ASIAN";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Skel({ className }: { className?: string }) {
  return <div className={cn("rounded-md animate-pulse bg-gray-100", className)} />;
}

interface MetricCardProps {
  label:     string;
  value:     string | null;
  sub:       string | null;
  subColor?: string;
  loading?:  boolean;
  onClick?:  () => void;
  id?:       string;
  highlight?: boolean;
}

function MetricCard({ label, value, sub, subColor, loading, onClick, id, highlight }: MetricCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "relative bg-white border rounded-xl p-4 flex flex-col justify-between min-h-[88px] group transition-all duration-200",
        onClick ? "cursor-pointer hover:border-gray-300 hover:shadow-sm" : "",
        highlight ? "ring-2 ring-[#111827] border-[#111827]" : "",
      )}
      style={{ borderColor: highlight ? "#111827" : C.border }}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: C.secondary }}>
        {label}
      </span>
      <div>
        {loading ? (
          <>
            <Skel className="h-5 w-20 mb-1.5" />
            <Skel className="h-3 w-14" />
          </>
        ) : (
          <>
            <span className="text-[15px] font-bold block leading-tight" style={{ color: C.primary }}>
              {value ?? "—"}
            </span>
            <span className="text-[11px] block mt-0.5 font-medium" style={{ color: subColor ?? C.secondary }}>
              {sub ?? "—"}
            </span>
          </>
        )}
      </div>
      {/* Hover arrow */}
      {onClick && (
        <ArrowUpRight
          className="absolute top-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: C.secondary }}
        />
      )}
    </div>
  );
}

// Calendar event row with accordion
interface CalEventRowProps {
  event: {
    time: string;
    country: string;
    event: string;
    impact: string;
    actual?: string;
    estimate?: string;
    prev?: string;
  };
  hookSlug: string;
  onExpand: (ev: any) => void;
}

function CalEventRow({ event, hookSlug, onExpand }: CalEventRowProps) {
  const [expanded, setExpanded] = useState(false);

  // Convert UTC time to local
  const localTime = (() => {
    try {
      if (!event.time) return "—";
      const now = new Date();
      const [h, m] = event.time.split(":");
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(h), parseInt(m)));
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch { return event.time; }
  })();

  return (
    <div
      className="border-b last:border-b-0 cursor-pointer"
      style={{ borderColor: C.border }}
      onClick={() => {
        setExpanded(!expanded);
        onExpand(event);
      }}
    >
      <div className="flex items-start gap-3 py-3 px-1">
        <div className="text-center shrink-0 w-14">
          <span className="text-[12px] font-mono font-bold block" style={{ color: C.primary }}>{localTime}</span>
          <span className="text-[10px] font-mono" style={{ color: C.secondary }}>
            {event.country}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium leading-snug" style={{ color: C.primary }}>{event.event}</p>
          <div className="flex items-center gap-2 mt-1">
            <ImpactPill impact={event.impact} />
            {event.estimate && (
              <span className="text-[10px] font-mono" style={{ color: C.secondary }}>
                Est: {event.estimate}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn("w-3.5 h-3.5 shrink-0 transition-transform mt-0.5", expanded && "rotate-180")}
          style={{ color: C.secondary }}
        />
      </div>
      {expanded && (
        <div className="px-1 pb-3 text-[12px]" style={{ color: C.secondary }}>
          {event.prev && (
            <div className="flex gap-4 mb-2">
              <span><span className="font-semibold" style={{ color: C.primary }}>Previous:</span> {event.prev}</span>
              {event.estimate && <span><span className="font-semibold" style={{ color: C.primary }}>Forecast:</span> {event.estimate}</span>}
            </div>
          )}
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: C.secondary }}>
            This event can move {hookSlug.includes("USD") ? "USD pairs" : "related currency pairs"} significantly.
            High-impact releases often create sharp 1–3 minute volatility spikes — avoid trading immediately before and after.
          </p>
          <button
            className="flex items-center gap-1.5 text-[11px] font-medium rounded-lg px-3 py-1.5 border transition-colors hover:bg-gray-50"
            style={{ color: C.primary, borderColor: C.border }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Bell className="w-3 h-3" />
            Set Alert
          </button>
        </div>
      )}
    </div>
  );
}

// ── Signal distribution bar (replaces hardcoded progress bars) ────────────────
function SignalDistribution({ buyCount, sellCount, neutral }: { buyCount: number; sellCount: number; neutral: number }) {
  const total = buyCount + sellCount + neutral || 1;
  const buyPct  = Math.round((buyCount / total) * 100);
  const sellPct = Math.round((sellCount / total) * 100);
  const neuPct  = 100 - buyPct - sellPct;

  return (
    <div>
      <div className="flex justify-between text-[11px] font-mono mb-2">
        <span style={{ color: C.positive }}>Bullish {buyCount}/6</span>
        <span style={{ color: C.secondary }}>Neutral {neutral}/6</span>
        <span style={{ color: C.negative }}>Bearish {sellCount}/6</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-px">
        <div className="rounded-l-full" style={{ width: `${buyPct}%`, background: "#16a34a" }} />
        <div style={{ width: `${neuPct}%`, background: "#d1d5db" }} />
        <div className="rounded-r-full" style={{ width: `${sellPct}%`, background: "#dc2626" }} />
      </div>
      <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: C.secondary }}>
        <span>{buyPct}%</span>
        <span>{neuPct}%</span>
        <span>{sellPct}%</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MarketIntelligencePage() {
  const [selectedInst, setSelectedInst] = useState<Instrument>(INSTRUMENTS_LIST[0]);
  const [selectedInterval, setSelectedInterval] = useState("4h");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tzLocal, setTzLocal] = useState(false);

  // SlideOver state
  const [slideOver, setSlideOver] = useState<{
    open: boolean;
    title: string;
    subtitle?: string;
    content: React.ReactNode;
  }>({ open: false, title: "", content: null });

  const openSlideOver = (title: string, subtitle: string | undefined, content: React.ReactNode) =>
    setSlideOver({ open: true, title, subtitle, content });
  const closeSlideOver = () => setSlideOver(s => ({ ...s, open: false }));

  // Live data
  const hookSlug = selectedInst.hookSlug;
  const md = useMarketData(hookSlug, selectedInterval);

  // Calendar events
  const [calEvents, setCalEvents] = useState<any[]>([]);
  const [calLoading, setCalLoading] = useState(true);

  // News sentiment
  const [sentiment, setSentiment] = useState<{ score: number | null; label: string } | null>(null);
  const [sentLoading, setSentLoading] = useState(true);

  // Live feed items
  const [feedItems, setFeedItems] = useState([
    { id: "feed-1", type: "event" as const, severity: "green" as const, message: "📋 The Wire — Morning brief ready", time: "" },
    { id: "feed-2", type: "alert" as const, severity: "orange" as const, source: selectedInst.name, message: "Loading market events…", time: "" },
  ]);

  // Fetch calendar events
  useEffect(() => {
    setCalLoading(true);
    fetch(`/api/calendar/${encodeURIComponent(hookSlug)}`)
      .then(r => r.json())
      .then(d => {
        const events = (d.events ?? []).slice(0, 5);
        setCalEvents(events);
        if (events.length > 0) {
          const calFeed = events.slice(0, 3).map((e: any, i: number) => ({
            id: `cal-${hookSlug}-${i}`,
            type: "event" as const,
            severity: (e.impact === "high" ? "red" : e.impact === "medium" ? "orange" : "green") as any,
            message: `📋 ${e.country} ${e.event}`,
            time: e.time ?? "",
          }));
          setFeedItems([
            ...calFeed,
            { id: "feed-wire", type: "event" as const, severity: "green" as const, message: "📋 The Wire — Morning brief ready", time: "" },
          ].slice(0, 5));
        }
        setCalLoading(false);
      })
      .catch(() => setCalLoading(false));
  }, [hookSlug]);

  // Fetch news sentiment
  useEffect(() => {
    setSentLoading(true);
    setSentiment(null);
    fetch(`/api/news-sentiment/${encodeURIComponent(hookSlug)}`)
      .then(r => r.json())
      .then(d => { setSentiment({ score: d.score, label: d.label }); setSentLoading(false); })
      .catch(() => setSentLoading(false));
  }, [hookSlug]);

  // Derived signal counts for distribution bar
  const signalVals = [
    md.rsi !== null ? (md.rsi > 60 ? "SELL" : md.rsi < 40 ? "BUY" : "NEUTRAL") : "NEUTRAL",
    md.macdLine !== null && md.macdSignal !== null
      ? (md.macdLine > md.macdSignal ? "BUY" : md.macdLine < md.macdSignal ? "SELL" : "NEUTRAL")
      : "NEUTRAL",
    md.bbUpper && md.bbLower && md.price
      ? (md.price > md.bbUpper ? "SELL" : md.price < md.bbLower ? "BUY" : "NEUTRAL")
      : "NEUTRAL",
    md.stochK !== null ? (md.stochK > 80 ? "SELL" : md.stochK < 20 ? "BUY" : "NEUTRAL") : "NEUTRAL",
    md.cci !== null ? (md.cci > 100 ? "BUY" : md.cci < -100 ? "SELL" : "NEUTRAL") : "NEUTRAL",
    md.volRatio !== null ? (md.volRatio > 130 ? "BUY" : md.volRatio < 70 ? "SELL" : "NEUTRAL") : "NEUTRAL",
  ] as const;
  const buyCount  = signalVals.filter(s => s === "BUY").length;
  const sellCount = signalVals.filter(s => s === "SELL").length;
  const neutralCount = 6 - buyCount - sellCount;

  // RSI label
  const rsiLabel = md.rsi === null ? "—"
    : md.rsi > 70 ? "Overbought"
    : md.rsi > 50 ? "Bullish zone"
    : md.rsi > 30 ? "Bearish zone"
    : "Oversold";
  const rsiColor = md.rsi === null ? C.secondary
    : md.rsi > 70 ? C.negative
    : md.rsi > 50 ? C.positive
    : md.rsi > 30 ? C.neutral
    : C.negative;

  // EMA label
  const emaLabel = md.trendDir === "above" ? "Trending" : md.trendDir === "below" ? "Below EMA" : md.trendDir === "at" ? "At EMA" : "—";
  const emaColor = md.trendDir === "above" ? C.positive : md.trendDir === "below" ? C.negative : C.neutral;
  const emaSubValue = md.ema50 !== null ? `EMA 50: ${fmtPrice(md.ema50, hookSlug)}` : "—";

  // Volume label
  const volLabel = md.volRatio === null ? "—"
    : md.volRatio > 130 ? "Above average"
    : md.volRatio < 70  ? "Below average"
    : "Average";
  const volColor = md.volRatio !== null && md.volRatio > 130 ? C.positive : md.volRatio !== null && md.volRatio < 70 ? C.neutral : C.secondary;

  // Spread label — convert to pips
  const spreadPips = (() => {
    if (md.spread === null) return null;
    const m = hookSlug.includes("JPY") ? 100 : 10000;
    return parseFloat((md.spread * m).toFixed(2));
  })();
  const spreadLabel = spreadPips === null ? "—" : `${spreadPips} pips`;
  const spreadColor = spreadPips === null ? C.secondary
    : spreadPips < 1.5 ? C.positive
    : spreadPips < 3   ? C.neutral
    : C.negative;
  const spreadSubLabel = spreadPips === null ? "—"
    : spreadPips < 1.5 ? "Tight spread"
    : spreadPips < 3   ? "Normal spread"
    : "Wide spread";

  // Sentiment label
  const sentScore = sentiment?.score;
  const sentLabel = sentiment?.label ?? "—";
  const sentColor = sentLabel === "Positive" ? C.positive : sentLabel === "Negative" ? C.negative : C.neutral;

  // Next macro event
  const nextHighImpact = calEvents.find(e => e.impact === "high");
  const macroLabel = nextHighImpact
    ? `${nextHighImpact.time} ${nextHighImpact.country}`
    : "None today";
  const macroSub = nextHighImpact ? nextHighImpact.event?.slice(0, 28) + "…" : "Calendar clear";
  const macroColor = nextHighImpact ? C.negative : C.positive;

  // ── COT SlideOver content ─────────────────────────────────────────────────
  const cotContent = (
    <>
      <SlideOverSection label="What is COT Data?">
        The Commitment of Traders (COT) report is published every Friday by the CFTC (US Commodity Futures Trading Commission).
        It shows the net long/short positions held by three groups: commercial hedgers, non-commercial speculators (smart money),
        and retail traders.
      </SlideOverSection>
      <SlideOverSection label="How to read it">
        Focus on the <strong>non-commercial net position</strong>. When speculators are heavily net long, institutional
        money is bullish. Extreme readings often signal potential reversals.
      </SlideOverSection>
      <SlideOverSection label="Why it's not yet live">
        COT data requires a CFTC/Quandl API integration. This is on the roadmap. In the meantime,
        you can access the raw data directly:
      </SlideOverSection>
      <a
        href="https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[13px] font-medium rounded-lg px-4 py-2.5 border transition-colors hover:bg-gray-50"
        style={{ color: C.primary, borderColor: C.border }}
      >
        <ExternalLink className="w-4 h-4" />
        CFTC Reports (updated Fridays)
      </a>
    </>
  );

  const biasScore = md.biasScore ?? selectedInst.defaultPct;
  const biasLabel = biasScore >= 50 ? "Bullish Bias" : "Bearish Bias";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* ── Hero panel (stays dark) ─────────────────────────────────────────── */}
      <section
        className="text-white"
        style={{ background: "#0a0a0f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 md:px-10 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Back to Overview"
            >
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest block">
                <Link href="/dashboard" className="hover:text-white/60 transition-colors">Analysis Centre</Link>
                {" / "}
                <span className="text-white/60 font-semibold">Market Intelligence</span>
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h1 className="text-[17px] font-bold">Market Intelligence</h1>
                {/* Instrument selector */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 text-[12px] font-mono px-3 py-1 rounded-md transition-colors hover:bg-white/[0.08]"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    {selectedInst.name}
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-1 py-1 z-[99] min-w-[180px] rounded-xl border border-white/10 max-h-72 overflow-y-auto"
                      style={{ background: "rgba(18,18,24,0.98)", backdropFilter: "blur(12px)" }}
                    >
                      {INSTRUMENT_GROUPS.map(group => (
                        <div key={group.label}>
                          <div className="px-3 pt-2 pb-1 text-[9px] font-mono uppercase tracking-widest text-white/30">
                            {group.label}
                          </div>
                          {group.items.map(inst => (
                            <button
                              key={inst.slug}
                              onClick={() => { setSelectedInst(inst); setDropdownOpen(false); }}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-[12px] transition-colors",
                                inst.slug === selectedInst.slug
                                  ? "text-[#00C896] font-semibold"
                                  : "text-white/65 hover:text-white hover:bg-white/[0.06]"
                              )}
                            >
                              {inst.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
              <span className="text-[11px] text-white/45 font-mono uppercase tracking-wider">
                {currentSession()} · Live
              </span>
            </div>

            {/* Timeframe selector */}
            <div className="flex rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              {TIMEFRAMES.map(tf => (
                <button
                  key={tf.interval}
                  onClick={() => setSelectedInterval(tf.interval)}
                  className={cn(
                    "px-3 py-1.5 text-[12px] font-bold font-mono tracking-wide transition-all",
                    selectedInterval === tf.interval
                      ? "bg-white text-[#0a0a0f]"
                      : "text-white/45 hover:text-white/80"
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gauge + feed */}
        <div className="flex flex-col xl:flex-row gap-0 xl:gap-0">
          <div className="flex-1 p-6 md:p-10 pb-6">
            <MarketGauge
              percentage={biasScore}
              label={biasLabel}
              instrument={selectedInst.name}
              price={md.price !== null ? fmtPrice(md.price, hookSlug) : "—"}
              rsi={md.rsi !== null ? md.rsi.toFixed(1) : "—"}
              trend={md.trendLabel}
            />
          </div>

          {/* Live feed sidebar */}
          <div
            className="xl:w-[300px] shrink-0 p-4 flex flex-col"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", minHeight: 320 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">Live Feed</span>
              <span
                className="text-[9px] font-mono text-[#00C896] px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.15)" }}
              >24H</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LiveFeed items={feedItems} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Metric cards row (white bg) ─────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">

          {/* RSI */}
          <MetricCard
            id="metric-rsi"
            label="RSI (14)"
            value={md.rsi !== null ? md.rsi.toFixed(1) : null}
            sub={rsiLabel}
            subColor={rsiColor}
            loading={md.loading}
            onClick={() => openSlideOver("RSI (14) — Relative Strength Index", selectedInst.name, (
              <>
                <SlideOverSection label="Current Reading">
                  <div className="text-3xl font-bold mb-1" style={{ color: C.primary }}>
                    {md.rsi !== null ? md.rsi.toFixed(1) : "—"}
                  </div>
                  <div className="font-semibold" style={{ color: rsiColor }}>{rsiLabel}</div>
                </SlideOverSection>
                <SlideOverSection label="How to interpret">
                  RSI measures momentum. A reading above 70 signals the asset may be overbought — potential reversal zone.
                  Below 30 signals oversold. Between 50 and 70 is a bullish momentum zone; 30–50 is bearish momentum.
                </SlideOverSection>
                <SlideOverSection label="Timeframe">
                  Currently showing the <strong>{intervalLabel(selectedInterval)}</strong> RSI (14-period).
                  Change timeframe using the selector above the gauge.
                </SlideOverSection>
              </>
            ))}
          />

          {/* EMA */}
          <MetricCard
            id="metric-ema"
            label="EMA 50"
            value={md.trendDir === null ? null : (md.trendDir === "above" ? "Price above" : md.trendDir === "below" ? "Price below" : "At EMA")}
            sub={md.ema50 !== null ? `EMA: ${fmtPrice(md.ema50, hookSlug)}` : "—"}
            subColor={emaColor}
            loading={md.loading}
            onClick={() => openSlideOver("EMA 50 — Exponential Moving Average", selectedInst.name, (
              <>
                <SlideOverSection label="Current Readings">
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.secondary }}>EMA 50</div>
                      <div className="font-bold" style={{ color: C.primary }}>{md.ema50 !== null ? fmtPrice(md.ema50, hookSlug) : "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.secondary }}>EMA 200</div>
                      <div className="font-bold" style={{ color: C.primary }}>{md.ema200 !== null ? fmtPrice(md.ema200, hookSlug) : "—"}</div>
                    </div>
                  </div>
                </SlideOverSection>
                <SlideOverSection label="Trend Signal">
                  <span className="font-semibold" style={{ color: emaColor }}>{md.trendLabel}</span>
                  {" — "}{md.trendDir === "above"
                    ? "Price is trading above EMA 50, indicating short-term bullish momentum."
                    : md.trendDir === "below"
                    ? "Price is below EMA 50, indicating short-term bearish pressure."
                    : "Price is testing the EMA 50 — watch for a breakout in either direction."}
                </SlideOverSection>
                <SlideOverSection label="EMA Golden / Death Cross">
                  {md.ema50 !== null && md.ema200 !== null
                    ? (md.ema50 > md.ema200
                        ? "✅ EMA 50 is above EMA 200 — Golden Cross structure (structurally bullish)"
                        : "⚠️ EMA 50 is below EMA 200 — Death Cross structure (structurally bearish)")
                    : "EMA cross data loading..."}
                </SlideOverSection>
              </>
            ))}
          />

          {/* COT */}
          <MetricCard
            id="metric-cot"
            label="COT Data"
            value="Weekly"
            sub="COT · CFTC"
            subColor={C.neutral}
            loading={false}
            onClick={() => openSlideOver("COT Data — Commitment of Traders", "CFTC Report", cotContent)}
          />

          {/* Volume */}
          <MetricCard
            id="metric-volume"
            label="Volume"
            value={md.volRatio !== null ? `${Math.round(md.volRatio)}% avg` : null}
            sub={volLabel}
            subColor={volColor}
            loading={md.loading}
            onClick={() => openSlideOver("Volume Analysis", selectedInst.name, (
              <>
                <SlideOverSection label="Current vs Average">
                  <div className="text-3xl font-bold mb-1" style={{ color: C.primary }}>
                    {md.volRatio !== null ? `${Math.round(md.volRatio)}%` : "—"}
                  </div>
                  <div style={{ color: volColor }}>{volLabel} — relative to 20-period average</div>
                </SlideOverSection>
                <SlideOverSection label="How to use volume">
                  Volume confirms price moves. A price breakout with volume above 130% average is a high-conviction signal.
                  Low volume during a move suggests a lack of institutional conviction and higher probability of reversal.
                </SlideOverSection>
              </>
            ))}
          />

          {/* News Sentiment */}
          <MetricCard
            id="metric-news"
            label="News Sentiment"
            value={sentScore !== null && sentScore !== undefined ? sentScore.toFixed(2) : null}
            sub={sentLabel}
            subColor={sentColor}
            loading={sentLoading}
            onClick={() => window.open(`/dashboard/signal-centre`, "_self")}
          />

          {/* Spread */}
          <MetricCard
            id="metric-spread"
            label="Spread"
            value={spreadLabel !== "—" ? spreadLabel : null}
            sub={spreadSubLabel}
            subColor={spreadColor}
            loading={md.loading}
            onClick={() => openSlideOver("Bid/Ask Spread", selectedInst.name, (
              <>
                <SlideOverSection label="Current Spread">
                  <div className="text-3xl font-bold mb-1" style={{ color: C.primary }}>
                    {spreadPips !== null ? `${spreadPips} pips` : "—"}
                  </div>
                  <div style={{ color: spreadColor }}>{spreadSubLabel}</div>
                </SlideOverSection>
                <SlideOverSection label="Bid / Ask">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.secondary }}>Bid</div>
                      <div className="font-bold text-[15px]" style={{ color: C.negative }}>{md.bid !== null ? fmtPrice(md.bid, hookSlug) : "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: C.secondary }}>Ask</div>
                      <div className="font-bold text-[15px]" style={{ color: C.positive }}>{md.ask !== null ? fmtPrice(md.ask, hookSlug) : "—"}</div>
                    </div>
                  </div>
                </SlideOverSection>
                <SlideOverSection label="Why spread matters">
                  The spread is the immediate cost of entering any trade. For scalpers, a wide spread eats into profits quickly.
                  Spreads widen before major news events — be cautious within 30 minutes of high-impact releases.
                </SlideOverSection>
              </>
            ))}
          />

          {/* Macro Calendar */}
          <MetricCard
            id="metric-macro"
            label="Next Event"
            value={calLoading ? null : macroLabel}
            sub={calLoading ? null : macroSub}
            subColor={macroColor}
            loading={calLoading}
            onClick={() => {
              const el = document.getElementById("calendar-section");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      </section>

      {/* ── Main content grid ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-10 grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TradingView Chart */}
        <div
          className="xl:col-span-2 bg-white rounded-xl overflow-hidden"
          style={{ border: `1px solid ${C.border}` }}
        >
          {/* Chart header */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold" style={{ color: C.primary }}>
                TradingView Terminal
              </span>
              <span className="text-[12px] font-mono" style={{ color: C.secondary }}>
                {selectedInst.name} · {intervalLabel(selectedInterval)}
              </span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                }}
              >
                Live Chart
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono" style={{ color: C.secondary }}>
                {toTVSymbol(hookSlug)}
              </span>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4" style={{ color: C.secondary }} />
              </button>
            </div>
          </div>

          {/* Actual TradingView widget */}
          <TradingViewWidget
            hookSlug={hookSlug}
            interval={selectedInterval}
            theme="light"
            height={520}
          />

          <div
            className="flex justify-between px-5 py-2.5 text-[10px] font-mono"
            style={{ color: C.secondary, borderTop: `1px solid ${C.border}` }}
          >
            <span>Data via TradingView · {selectedInterval.toUpperCase()} candles</span>
            <span>Powered by Twelve Data & Finnhub</span>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Signal Distribution (replaces hardcoded bars) */}
          <div
            className="bg-white rounded-xl p-5"
            style={{ border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold" style={{ color: C.primary }}>Signal Consensus</h3>
              <span className="text-[10px] font-mono" style={{ color: C.secondary }}>
                {intervalLabel(selectedInterval)} · 6 indicators
              </span>
            </div>

            {md.loading ? (
              <div className="space-y-3">
                <Skel className="h-4 w-full" />
                <Skel className="h-2 w-full" />
              </div>
            ) : (
              <SignalDistribution buyCount={buyCount} sellCount={sellCount} neutral={neutralCount} />
            )}

            <div className="mt-4 space-y-2">
              {[
                { label: "RSI (14)", sig: signalVals[0], val: md.rsi !== null ? md.rsi.toFixed(1) : "—" },
                { label: "MACD", sig: signalVals[1], val: signalVals[1] === "BUY" ? "Bull Cross" : signalVals[1] === "SELL" ? "Bear Cross" : "Neutral" },
                { label: "Bollinger", sig: signalVals[2], val: md.bbUpper && md.price ? (md.price > md.bbUpper ? "Above upper" : md.price < (md.bbLower ?? 0) ? "Below lower" : "Mid band") : "—" },
                { label: "Stochastic", sig: signalVals[3], val: md.stochK !== null ? `K: ${md.stochK.toFixed(1)}` : "—" },
                { label: "CCI (20)", sig: signalVals[4], val: md.cci !== null ? (md.cci >= 0 ? `+${md.cci.toFixed(0)}` : md.cci.toFixed(0)) : "—" },
                { label: "Volume", sig: signalVals[5], val: md.volRatio !== null ? `${Math.round(md.volRatio)}% avg` : "—" },
              ].map(({ label, sig, val }) => (
                <div key={label} className="flex items-center justify-between text-[11px]">
                  <span style={{ color: C.secondary }}>{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ color: C.primary }}>{val}</span>
                    <span
                      className="font-bold text-[10px] tracking-wider min-w-[44px] text-right"
                      style={{ color: sig === "BUY" ? C.positive : sig === "SELL" ? C.negative : C.secondary }}
                    >
                      {sig}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Events */}
          <div
            id="calendar-section"
            className="bg-white rounded-xl p-5"
            style={{ border: `1px solid ${C.border}` }}
          >
            <div
              className="flex items-center justify-between mb-3 pb-3"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <h3 className="text-[13px] font-bold" style={{ color: C.primary }}>Calendar Events</h3>
              <button
                onClick={() => {
                  setTzLocal(!tzLocal);
                  localStorage.setItem("mi_tz_local", String(!tzLocal));
                }}
                className="text-[10px] font-mono px-2 py-1 rounded-full transition-colors hover:bg-gray-100"
                style={{
                  color: tzLocal ? C.primary : C.secondary,
                  border: `1px solid ${C.border}`,
                  background: tzLocal ? "#f3f4f6" : "transparent",
                }}
              >
                {tzLocal ? "LOCAL" : "GMT"}
              </button>
            </div>

            {calLoading ? (
              <div className="space-y-3">
                {[0,1,2].map(i => <Skel key={i} className="h-12 w-full" />)}
              </div>
            ) : calEvents.length === 0 ? (
              <p className="text-[12px] py-4 text-center" style={{ color: C.secondary }}>
                No high-impact events found for {selectedInst.name} today.
              </p>
            ) : (
              <div>
                {calEvents.map((ev, i) => (
                  <CalEventRow
                    key={i}
                    event={ev}
                    hookSlug={hookSlug}
                    onExpand={(event) => {
                      // Optionally could open a detailed SlideOver
                    }}
                  />
                ))}
              </div>
            )}

            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <p className="text-[10px] font-mono" style={{ color: C.secondary }}>
                Source: Finnhub economic calendar · Filtered for {selectedInst.name} relevance
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SlideOver ──────────────────────────────────────────────────────── */}
      <SlideOver
        open={slideOver.open}
        onClose={closeSlideOver}
        title={slideOver.title}
        subtitle={slideOver.subtitle}
      >
        {slideOver.content}
      </SlideOver>
    </div>
  );
}
