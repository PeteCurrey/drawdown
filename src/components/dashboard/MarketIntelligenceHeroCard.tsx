"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, MoreHorizontal, AlertCircle } from "lucide-react";
import { INSTRUMENT_GROUPS, TIMEFRAMES, type Instrument } from "@/lib/instruments";
import { useMarketIntelligence } from "@/hooks/useMarketIntelligence";
import { useTwelveData } from "@/hooks/useTwelveData";

/* ─────────────────────────────────────────────────────────────────────────────
   MarketIntelligenceHeroCard
   ─────────────────────────────────────────────────────────────────────────────
   Self-contained hero gauge card for the dashboard Overview page.

   Design spec:
   • Animated shimmer background via conic-gradient CSS keyframe (12s, very subtle)
   • Card entrance: fade-up 600ms ease-out, runs once on mount via hasAnimated ref
   • SVG half-circle gauge arc animates stroke-dashoffset 1000ms ease-out + 200ms delay
   • JS counter synced to arc animation
   • Orbit nodes fade in staggered 60ms each, after gauge completes
   • Live feed items slide in from the right, staggered, from 800ms
   • Glowing dot at the arc tip
   • Translucent inner surfaces — no flat hex greys
   • Weighted composite bias: RSI 30% + EMA 30% + Order Flow 25% + Macro 15%
   ───────────────────────────────────────────────────────────────────────────── */

// ── Types ────────────────────────────────────────────────────────────────────

export interface HeroInstrument {
  slug: string;
  name: string;
  /** Twelve Data / hook key — e.g. "XAUUSD" */
  hookSlug: string;
  /** TradingView widget symbol */
  tvSymbol: string;
  /** Loading placeholder 0–100, overwritten immediately by live biasScore */
  defaultPct: number;
  /** Kept for backwards-compat — not used for display, live data used instead */
  rsi?: string;
  price?: string;
  trend?: string;
}

export interface HeroFeedItem {
  id: string;
  type: "alert" | "event";
  severity?: "green" | "orange" | "red";
  source?: string;
  message: string;
  time?: string;
  url?: string;
}

interface OpenAlert {
  label: string;
  count: number;
  color: "orange" | "green" | "red";
}

interface MarketIntelligenceHeroCardProps {
  instruments: HeroInstrument[];
  initialInstrument?: HeroInstrument;
  todayTradeCount: number;
  onInstrumentChange?: (inst: HeroInstrument) => void;
  /** Current selected Twelve Data interval string e.g. "4h" — controlled by parent */
  selectedInterval?: string;
  /** Called when user clicks a timeframe pill */
  onTimeframeChange?: (interval: string) => void;
}

// ── Orbit signal nodes ───────────────────────────────────────────────────────

interface SignalNode {
  name: string;
  /** Degrees on the 180° arc: 180 = far left, 360 = far right */
  deg: number;
  /** 0–1, fraction of face radius */
  radiusFactor: number;
  letter: string;
  alert: boolean;
}

// ── SVG arc helpers ───────────────────────────────────────────────────────────

const ARC_R = 110;        // radius of the drawn arc
const ARC_CX = 160;       // SVG viewBox centre x
const ARC_CY = 160;       // SVG viewBox centre y (arc pivot)
const ARC_CIRCUMFERENCE = Math.PI * ARC_R; // half-circle circumference

function pctToOffset(pct: number) {
  return ARC_CIRCUMFERENCE - (pct / 100) * ARC_CIRCUMFERENCE;
}

// Tip position along the arc for a given percentage
function arcTipPos(pct: number) {
  const angle = Math.PI + (pct / 100) * Math.PI; // 180° to 360°
  return {
    x: ARC_CX + ARC_R * Math.cos(angle),
    y: ARC_CY + ARC_R * Math.sin(angle),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MarketIntelligenceHeroCard({
  instruments,
  initialInstrument,
  todayTradeCount,
  onInstrumentChange,
  selectedInterval = "4h",
  onTimeframeChange,
}: MarketIntelligenceHeroCardProps) {
  const [selectedInst, setSelectedInst] = useState<HeroInstrument>(
    initialInstrument ?? instruments[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ── Live data hook ──
  const hookSlug = (selectedInst as any).hookSlug ?? selectedInst.slug.replace("/", "");
  const marketData = useMarketIntelligence(hookSlug, selectedInterval);

  // ── Live price via useTwelveData (client-side, 30s poll, efficient) ─────────
  const liveData = useTwelveData([hookSlug]);
  const tdInstrument = liveData[hookSlug];

  // Price: prefer useTwelveData (faster, client-side), fallback to marketData
  const livePrice = (tdInstrument?.price ?? marketData.quote?.price) ?? null;

  // ── Flash animation on price tick ─────────────────────────────────────────
  const prevPriceRef = useRef<number | null>(null);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    if (livePrice === null) return;
    if (prevPriceRef.current !== null && prevPriceRef.current !== livePrice) {
      setPriceFlash(livePrice > prevPriceRef.current ? "up" : "down");
      const t = setTimeout(() => setPriceFlash(null), 700);
      return () => clearTimeout(t);
    }
    prevPriceRef.current = livePrice;
  }, [livePrice]);

  // biasScore: use live value, fall back to placeholder while loading
  const targetBias = marketData.bias?.score ?? selectedInst.defaultPct;

  // Derive change from useTwelveData when available
  const liveChangePct = tdInstrument?.changePct ?? marketData.quote?.changePercent ?? null;
  const isFallback = !tdInstrument || tdInstrument.error || tdInstrument.price === null
    ? (marketData.is_fallback ?? false)
    : false;

  const livePriceStr = livePrice
    ? livePrice.toLocaleString("en-US", {
        minimumFractionDigits: selectedInst.slug.includes("JPY") ? 3 : (selectedInst.slug.includes("XAU") || selectedInst.slug.includes("BTC") ? 2 : 5),
        maximumFractionDigits: selectedInst.slug.includes("JPY") ? 3 : (selectedInst.slug.includes("XAU") || selectedInst.slug.includes("BTC") ? 2 : 5)
      })
    : "—";
  const liveRsiStr = marketData.indicators?.rsi !== null && marketData.indicators?.rsi !== undefined
    ? marketData.indicators.rsi.toFixed(1)
    : "—";

  let liveTrend = "—";
  let trendDir: "above" | "below" | "at" | null = null;
  if (livePrice && marketData.indicators?.ema50) {
    const ema50 = marketData.indicators.ema50;
    const pctDiff = ((livePrice - ema50) / ema50) * 100;
    if (pctDiff > 0.05) {
      liveTrend = "ABOVE EMA";
      trendDir = "above";
    } else if (pctDiff < -0.05) {
      liveTrend = "BELOW EMA";
      trendDir = "below";
    } else {
      liveTrend = "AT EMA";
      trendDir = "at";
    }
  }
  const liveTrendColor = trendDir === "above" ? "#00C896" : trendDir === "below" ? "#CE6969" : "#F9A825";

  // Vol ratio calculation for signals
  const currentVolume = marketData.indicators?.currentVolume ?? 0;
  const volumeAvg = marketData.indicators?.volumeAvg ?? 1;
  const volRatio = currentVolume && volumeAvg ? (currentVolume / volumeAvg) * 100 : null;

  // Animation state
  const hasAnimated    = useRef(false);
  const [cardVisible,  setCardVisible]  = useState(false);
  const [arcPct,       setArcPct]       = useState(0);
  const [displayPct,   setDisplayPct]   = useState(0);
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(Array.from({ length: 7 }).map(() => false));
  const [feedVisible,  setFeedVisible]  = useState<boolean[]>(Array.from({ length: 6 }).map(() => false));

  const [intelData, setIntelData] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);

  // Dynamic ticking London/GMT Clock
  const [londonTime, setLondonTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const timeStr = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setLondonTime(`${timeStr} London`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync state if initialInstrument changes from parent
  useEffect(() => {
    if (initialInstrument) {
      setSelectedInst(initialInstrument);
    }
  }, [initialInstrument]);

  // Fetch full intelligence data on instrument change
  useEffect(() => {
    setIntelLoading(true);
    fetch(`/api/intelligence/full/${hookSlug}`)
      .then(r => r.json())
      .then(data => {
        setIntelData(data);
        setIntelLoading(false);
      })
      .catch(() => {
        setIntelLoading(false);
      });
  }, [hookSlug]);

  // Construct live feed items from actual news, events, and signal alerts
  const liveFeedItems = (() => {
    const items: HeroFeedItem[] = [];

    // 1. News items
    marketData.news.slice(0, 3).forEach((item) => {
      items.push({
        id: `news-${item.id}`,
        type: "event",
        severity: "green",
        source: item.source,
        message: item.headline,
        time: new Date(item.datetime).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        }) + " UTC",
        url: item.url
      });
    });

    // 2. Economic Calendar events
    marketData.events.slice(0, 2).forEach((item) => {
      items.push({
        id: `event-${item.id}`,
        type: "event",
        severity: item.impact === "high" ? "red" : item.impact === "medium" ? "orange" : "green",
        source: "ECONOMIC EVENT",
        message: `📋 ${item.country} ${item.event} (Est: ${item.estimate ?? "—"})`,
        time: new Date(item.time).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit"
        }) + " UTC"
      });
    });

    // 3. Technical signal alerts
    if (marketData.indicators?.rsi !== null && marketData.indicators?.rsi !== undefined) {
      const rsi = marketData.indicators.rsi;
      if (rsi > 70) {
        items.push({
          id: `rsi-alert-high`,
          type: "alert",
          severity: "red",
          source: "RSI Alert",
          message: `RSI Overbought (${rsi.toFixed(1)}) on ${selectedInterval}. Potential trend fatigue.`,
          time: "Just now"
        });
      } else if (rsi < 30) {
        items.push({
          id: `rsi-alert-low`,
          type: "alert",
          severity: "green",
          source: "RSI Alert",
          message: `RSI Oversold (${rsi.toFixed(1)}) on ${selectedInterval}. Potential accumulation.`,
          time: "Just now"
        });
      }
    }

    // 4. Fallback if empty
    if (items.length === 0) {
      items.push({
        id: `seed-status-${hookSlug}`,
        type: "event",
        severity: "green",
        message: `Live market data connection active for ${selectedInst.name}.`,
        time: "Active",
      });
    }

    return items.slice(0, 6);
  })();

  // Stagger animation for feed items when count changes
  useEffect(() => {
    setFeedVisible(Array(liveFeedItems.length).fill(true));
  }, [liveFeedItems.length]);

  const SIGNAL_NODES: SignalNode[] = [
    {
      name: "RSI",
      deg: 200,
      radiusFactor: 0.71,
      letter: marketData.indicators?.rsi === null || marketData.indicators?.rsi === undefined
        ? "N"
        : marketData.indicators.rsi < 40 ? "B" : marketData.indicators.rsi > 60 ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("RSI") ?? false,
    },
    {
      name: "EMA",
      deg: 222,
      radiusFactor: 0.63,
      letter: trendDir === "above" ? "B" : trendDir === "below" ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("EMA") ?? false,
    },
    {
      name: "COT",
      deg: 248,
      radiusFactor: 0.55,
      letter: intelData?.cot?.signal === "BULLISH" ? "B" : intelData?.cot?.signal === "BEARISH" ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("COT") ?? false,
    },
    {
      name: "VOL",
      deg: 270,
      radiusFactor: 0.59,
      letter: volRatio === null ? "N" : volRatio > 120 ? (marketData.quote?.change && marketData.quote.change > 0 ? "B" : "S") : "N",
      alert: marketData.bias?.conflictNodes.includes("VOL") ?? false,
    },
    {
      name: "NEWS",
      deg: 294,
      radiusFactor: 0.55,
      letter: intelData?.news?.overall_label === "BULLISH" ? "B" : intelData?.news?.overall_label === "BEARISH" ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("NEWS") ?? false,
    },
    {
      name: "ORDER FLOW",
      deg: 322,
      radiusFactor: 0.65,
      letter: intelData?.retail_sentiment?.signal === "CONTRARIAN_BULLISH" ? "B" : intelData?.retail_sentiment?.signal === "CONTRARIAN_BEARISH" ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("ORDER FLOW") ?? false,
    },
    {
      name: "MACRO",
      deg: 346,
      radiusFactor: 0.71,
      letter: intelData?.macro?.regime_label === "RISK-ON" ? "B" : intelData?.macro?.regime_label === "RISK-OFF" ? "S" : "N",
      alert: marketData.bias?.conflictNodes.includes("MACRO") ?? false,
    },
  ];


  // ── Entrance animation (once on mount) ────────────────────────────────────
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // 1. Card fades up
    requestAnimationFrame(() => setCardVisible(true));

    // 2. Arc + counter begin after 200ms
    const arcTimer = setTimeout(() => {
      const duration = 1000;
      const t0 = performance.now();
      const animateArc = (now: number) => {
        const t = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const cur = Math.round(eased * targetBias);
        setArcPct(cur);
        setDisplayPct(cur);
        if (t < 1) requestAnimationFrame(animateArc);
      };
      requestAnimationFrame(animateArc);
    }, 200);

    // 3. Nodes stagger after arc (200ms delay + 1000ms arc = 1200ms base)
    Array.from({ length: 7 }).forEach((_, i) => {
      setTimeout(() => {
        setNodesVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 1200 + i * 60);
    });

    // 4. Feed items slide in from 800ms
    Array.from({ length: 6 }).forEach((_, i) => {
      setTimeout(() => {
        setFeedVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 800 + i * 80);
    });

    return () => clearTimeout(arcTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-animate arc on instrument change (NOT from zero, from current) ──────
  const prevBias = useRef(targetBias);
  useEffect(() => {
    if (!hasAnimated.current) return; // skip if entrance hasn't fired yet
    const from = prevBias.current;
    const to   = targetBias;
    prevBias.current = to;
    if (from === to) return;

    const duration = 700;
    const t0 = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      const cur = Math.round(from + eased * (to - from));
      setArcPct(cur);
      setDisplayPct(cur);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInst, targetBias]);

  // ── Instrument change handler ─────────────────────────────────────────────
  const handleInstrumentChange = useCallback((inst: HeroInstrument) => {
    console.log('[DD-SELECT] Instrument changed to:', inst.slug);
    setSelectedInst(inst);
    setDropdownOpen(false);
    onInstrumentChange?.(inst);
  }, [onInstrumentChange]);

  // ── Derived values ────────────────────────────────────────────────────────
  const isBullish   = targetBias >= 50;
  const biasLabel   = isBullish ? "BULLISH BIAS" : "BEARISH BIAS";
  const arcOffset   = pctToOffset(arcPct);
  const tipPos      = arcTipPos(arcPct);
  const openAlerts: OpenAlert[] = [
    { label: "Technical", count: liveFeedItems.filter(f => f.type === "alert").length, color: "orange" },
    { label: "Events", count: liveFeedItems.filter(f => f.type === "event").length, color: "green" }
  ];
  const visibleAlerts = openAlerts.filter(a => a.count > 0);

  // ── Inline keyframe injection (once) ─────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("hero-gauge-styles")) return;
    const style = document.createElement("style");
    style.id = "hero-gauge-styles";
    style.textContent = `
      @keyframes shimmerRotate {
        0%   { --shimmer-angle: 0deg; }
        100% { --shimmer-angle: 360deg; }
      }
      @keyframes heroPulse {
        0%, 100% { transform: scale(1);   opacity: 1; }
        50%       { transform: scale(1.1); opacity: 0.8; }
      }
      @keyframes heroFadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(16px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .hero-card-enter   { animation: heroFadeUp 600ms ease-out both; }
      .feed-slide-in     { animation: slideInRight 400ms ease-out both; }
      .alert-node-pulse  { animation: heroPulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      className={cn(
        "relative overflow-hidden text-white",
        "rounded-2xl",
        cardVisible ? "hero-card-enter" : "opacity-0"
      )}
      style={{
        // Premium glassmorphism off-black layout with subtle gloss highlight and accents
        background: [
          "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.03) 30%, rgba(255, 255, 255, 0) 70%)",
          "radial-gradient(circle at 50% -20%, rgba(0, 200, 150, 0.15), transparent 60%)",
          "radial-gradient(circle at 10% 100%, rgba(249, 119, 29, 0.08), transparent 40%)",
          "linear-gradient(180deg, rgba(14, 14, 19, 0.85) 0%, rgba(10, 10, 14, 0.9) 100%)",
        ].join(", "),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        animation: cardVisible ? "heroFadeUp 600ms ease-out both" : undefined,
      }}
    >
      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="h-[52px] border-b border-white/[0.06] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Market Intelligence
          </span>
          <div className="w-px h-4 bg-white/10" />

          {/* Instrument dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 font-semibold text-sm text-white hover:text-[#00C896] transition-colors"
            >
              {selectedInst.name}
              <ChevronDown className="w-3 h-3 text-white/40" />
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 py-1 z-[99] min-w-[160px] rounded-lg border border-white/10 max-h-72 overflow-y-auto"
                style={{ background: "rgba(20,20,24,0.97)", backdropFilter: "blur(12px)" }}
              >
                {INSTRUMENT_GROUPS.map(group => (
                  <div key={group.label}>
                    <div className="px-3 pt-2 pb-1 text-[9px] font-mono uppercase tracking-widest text-white/30">
                      {group.label}
                    </div>
                    {group.items.map(inst => (
                      <button
                        key={inst.slug}
                        onClick={() => handleInstrumentChange(inst as unknown as HeroInstrument)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs transition-colors",
                          inst.slug === selectedInst.slug
                            ? "text-[#00C896]"
                            : "text-white/70 hover:text-white hover:bg-white/[0.06]"
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00C896] rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-white/40">Live</span>
          </div>
          <div className="w-px h-4 bg-white/10" />

          {/* Timeframe selector */}
          <div className="flex rounded-md overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.interval}
                onClick={() => onTimeframeChange?.(tf.interval)}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-bold font-mono tracking-wide transition-all",
                  selectedInterval === tf.interval
                    ? "bg-white text-[#0a0a0f]"
                    : "text-white/40 hover:text-white/80"
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button className="p-1 hover:bg-white/[0.06] rounded">
            <MoreHorizontal className="w-4 h-4 text-white/30" />
          </button>
        </div>
      </div>

      {/* ── Body grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12" style={{ height: 380 }}>

        {/* ── Col A: Session stats ──────────────────────────────────────────── */}
        <div className="lg:col-span-3 border-r border-white/[0.06] p-6 flex flex-col justify-between">
          {/* Session activity */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-3">
              Session Activity
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl font-black font-mono leading-none tabular-nums">
                {todayTradeCount}
              </span>
              <span className="text-[10px] font-mono text-white/35 uppercase">trades today</span>
            </div>
            {/* Mini sparkline */}
            <svg className="w-full h-8" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 20 18 35 20 T 60 10 T 100 6"
                fill="none"
                stroke="rgba(0,200,150,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 25 Q 20 18 35 20 T 60 10 T 100 6 L 100 30 L 0 30 Z"
                fill="url(#sparkGrad)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C896" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Open alerts — hidden when empty */}
          {visibleAlerts.length > 0 && (
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-3">
                Open Alerts
              </p>
              <div className="flex gap-2 flex-wrap">
                {visibleAlerts.map((alert: OpenAlert) => (
                  <div
                    key={alert.label}
                    className="flex-1 min-w-[56px] rounded-lg py-2 px-3 text-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-sm font-bold font-mono tabular-nums"
                      style={{
                        color: alert.color === "orange" ? "#F9771D"
                             : alert.color === "green"  ? "#00C896"
                             : "#CE6969"
                      }}
                    >
                      {alert.count}
                    </p>
                    <p className="text-[8px] font-mono text-white/35 uppercase mt-0.5">
                      {alert.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Col B: Gauge ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative border-r border-white/[0.06] overflow-hidden py-4">

          {/* Canvas-style tick rings — rendered as SVG behind the main gauge */}
          <div className="relative w-full flex justify-center" style={{ maxWidth: 340 }}>
            <svg
              viewBox="0 0 320 200"
              className="w-full"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Arc gradient: dark green tip → vivid green */}
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1a5c3e" />
                  <stop offset="100%" stopColor="#00d87c" />
                </linearGradient>
                {/* Glow filter for tip dot */}
                <filter id="tipGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ── Tick rings ── */}
              {[
                { r: 145, count: 180, h: 4,   op: 0.8 },
                { r: 130, count: 90,  h: 3,   op: 0.5 },
                { r: 116, count: 45,  h: 2.5, op: 0.3 },
                { r: 103, count: 24,  h: 2,   op: 0.2 },
              ].map(({ r, count, h, op }, ri) =>
                Array.from({ length: count + 1 }).map((_, i) => {
                  const deg = 180 + (i / count) * 180;
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={`r${ri}-t${i}`}
                      x1={160 + r * Math.cos(rad)}
                      y1={160 + r * Math.sin(rad)}
                      x2={160 + (r - h) * Math.cos(rad)}
                      y2={160 + (r - h) * Math.sin(rad)}
                      stroke={`rgba(160,160,155,${op})`}
                      strokeWidth={0.5}
                    />
                  );
                })
              )}

              {/* ── Arc track (unfilled) ── */}
              <path
                d={`M ${160 - ARC_R} 160 A ${ARC_R} ${ARC_R} 0 0 1 ${160 + ARC_R} 160`}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={6}
                strokeLinecap="round"
              />

              {/* ── Arc filled portion (gradient) ── */}
              <path
                d={`M ${160 - ARC_R} 160 A ${ARC_R} ${ARC_R} 0 0 1 ${160 + ARC_R} 160`}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={ARC_CIRCUMFERENCE}
                strokeDashoffset={arcOffset}
                style={{ transition: "stroke-dashoffset 50ms linear" }}
              />

              {/* ── Glowing tip dot ── */}
              {arcPct > 1 && (
                <circle
                  cx={tipPos.x}
                  cy={tipPos.y}
                  r={5}
                  fill="#00d87c"
                  filter="url(#tipGlow)"
                  opacity={0.9}
                />
              )}

              {/* ── Orbit signal nodes ── */}
              {SIGNAL_NODES.map((node, i) => {
                const rad    = (node.deg * Math.PI) / 180;
                const faceR  = 96; // face radius
                const dotR   = faceR * node.radiusFactor;
                const dx = 160 + dotR * Math.cos(rad);
                const dy = 160 + dotR * Math.sin(rad);

                // Label outside the outermost ring
                const labelR   = 155;
                const lx = 160 + labelR * Math.cos(rad);
                const ly = 160 + labelR * Math.sin(rad);
                const isLeft   = node.deg < 265;
                const isBottom = node.deg > 252 && node.deg < 288;

                // Connector from R_OUT to label anchor
                const connInner = { x: 160 + 147 * Math.cos(rad), y: 160 + 147 * Math.sin(rad) };
                const connOuter = { x: lx + (isLeft ? -4 : 4) * Math.cos(rad) * 0, y: ly };

                return (
                  <g
                    key={node.name}
                    style={{
                      opacity: nodesVisible[i] ? 1 : 0,
                      transition: `opacity 300ms ease ${i * 60}ms`,
                    }}
                  >
                    {/* Dotted connector */}
                    <line
                      x1={connInner.x} y1={connInner.y}
                      x2={lx + (isLeft ? -6 : 6)} y2={ly}
                      stroke="rgba(160,160,155,0.35)"
                      strokeWidth={0.7}
                      strokeDasharray="2,3"
                    />

                    {/* Node dot on inner ring */}
                    <circle
                      cx={dx} cy={dy} r={2.5}
                      fill={node.alert ? "#FF6B2B" : "rgba(255,255,255,0.25)"}
                      className={node.alert ? "alert-node-pulse" : ""}
                    />

                    {/* Letter pill on middle ring */}
                    {(() => {
                      const pillR = 122;
                      const px = 160 + pillR * Math.cos(rad);
                      const py = 160 + pillR * Math.sin(rad);
                      const letterColor = node.letter === "B" ? "#00C896" : node.letter === "S" ? "#CE6969" : "rgba(255,255,255,0.5)";
                      const pillBg = node.letter === "B" ? "rgba(0,200,150,0.08)" : node.letter === "S" ? "rgba(206,105,105,0.08)" : "rgba(255,255,255,0.07)";
                      const pillStroke = node.letter === "B" ? "rgba(0,200,150,0.2)" : node.letter === "S" ? "rgba(206,105,105,0.2)" : "rgba(255,255,255,0.12)";
                      return (
                        <g>
                          <rect
                            x={px - 7} y={py - 5.5}
                            width={14} height={11}
                            rx={2.5}
                            fill={node.alert ? "rgba(255,107,43,0.18)" : pillBg}
                            stroke={node.alert ? "rgba(255,107,43,0.4)" : pillStroke}
                            strokeWidth={0.6}
                          />
                          <text
                            x={px} y={py + 1}
                            fill={node.alert ? "#FF6B2B" : letterColor}
                            fontSize={6}
                            fontWeight={600}
                            fontFamily="Inter, monospace"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {node.letter}
                          </text>
                        </g>
                      );
                    })()}

                    {/* Orange alert triangle at outer ring */}
                    {node.alert && (() => {
                      const triR = 137;
                      const tx = 160 + triR * Math.cos(rad);
                      const ty = 160 + triR * Math.sin(rad);
                      const s  = 6;
                      return (
                        <g>
                          <polygon
                            points={`${tx},${ty - s} ${tx + s * 0.87},${ty + s * 0.5} ${tx - s * 0.87},${ty + s * 0.5}`}
                            fill="#FF6B2B"
                          />
                          <text x={tx} y={ty + 1.5} fill="#fff" fontSize={5} fontWeight={700}
                            textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">
                            !
                          </text>
                        </g>
                      );
                    })()}

                    {/* Label outside outermost ring */}
                    <text
                      x={lx + (isLeft ? -10 : 10)}
                      y={ly + (isBottom ? 12 : 0)}
                      fill="rgba(255,255,255,0.70)"
                      fontSize={11}
                      fontWeight={500}
                      fontFamily="Inter, system-ui, sans-serif"
                      textAnchor={isLeft ? "end" : "start"}
                      dominantBaseline="middle"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

              {/* ── Centre: percentage + bias label ── */}
              <text
                x="160"
                y="138"
                fill="white"
                fontSize={54}
                fontWeight={200}
                fontFamily="Inter, system-ui, sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-2px" }}
              >
                {displayPct}
                <tspan fontSize={24} dy={-12} fontWeight={200}>%</tspan>
              </text>
              <text
                x="160"
                y="160"
                fill="rgba(255,255,255,0.45)"
                fontSize={9}
                fontWeight={400}
                fontFamily="Inter, system-ui, sans-serif"
                textAnchor="middle"
                letterSpacing="0.16em"
              >
                {biasLabel}
              </text>
            </svg>
          </div>

          {/* ── Footer stats ─────────────────────────────────────────────── */}
          <div
            className="flex justify-center items-center gap-10 w-full px-6 mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              { label: "PRICE",    value: livePriceStr,  color: priceFlash === "up" ? "#00C896" : priceFlash === "down" ? "#CE6969" : "rgba(255,255,255,0.9)", isFallback, isPrice: true },
              { label: "RSI (14)", value: liveRsiStr,    color: "rgba(255,255,255,0.9)", isFallback: false, isPrice: false },
              { label: "TREND",    value: liveTrend,     color: liveTrendColor, isFallback: false, isPrice: false },
            ].map(({ label, value, color, isFallback: fb, isPrice }) => (
              <div key={label} className="text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {label}
                </p>
                <div
                  className="text-[18px] font-mono tabular-nums leading-none flex items-center justify-center gap-1.5"
                  style={{
                    color,
                    transition: isPrice ? "color 400ms ease" : undefined,
                  }}
                >
                  {fb && <span className="text-[14px] text-amber-500 font-bold" title="Live price unavailable — showing estimated value">~</span>}
                  <span>{value}</span>
                  {fb && (
                    <div 
                      className="group relative flex items-center justify-center cursor-help"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 border border-gray-700 rounded shadow-lg text-white text-left z-50">
                        Live price unavailable — showing estimated value
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Col C: Live feed ─────────────────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          {/* Feed header */}
          <div
            className="h-10 flex items-center justify-between px-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                Live Feed
              </span>
              <span
                className="text-[8px] font-mono text-[#00C896] px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.15)" }}
              >
                24H
              </span>
            </div>
          </div>

          {/* Feed items */}
          <div key={hookSlug} className="flex-1 overflow-y-auto p-3 space-y-2">
            {liveFeedItems.map((item, i) => {
              const isAlert    = item.type === "alert";
              const isTopAlert = isAlert && i === liveFeedItems.findIndex(f => f.type === "alert");
              
              const itemContent = (
                <div className="flex items-start gap-2">
                  {isAlert ? (
                    <AlertCircle className="w-3.5 h-3.5 text-[#F9771D] shrink-0 mt-0.5" />
                  ) : (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                      style={{
                        background: item.severity === "green" ? "#00C896"
                                  : item.severity === "orange" ? "#F9771D"
                                  : "#CE6969"
                      }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    {item.source && (
                      <p className="text-[11px] font-bold text-white/90 mb-0.5">{item.source}</p>
                    )}
                    <p className="text-[13px] text-white/70 leading-snug hover:text-[#00C896] transition-colors">{item.message}</p>
                    {item.time && (
                      <p className="text-[10px] font-mono text-white/30 mt-1">{item.time}</p>
                    )}
                  </div>
                </div>
              );

              if (item.url && item.url !== "#") {
                return (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={item.id}
                    className={cn(
                      "block rounded-lg p-3 hover:bg-white/[0.08] transition-colors cursor-pointer",
                      feedVisible[i] ? "feed-slide-in" : "opacity-0"
                    )}
                    style={{
                      animationDelay: `${i * 80}ms`,
                      background: isTopAlert
                        ? "rgba(249,119,29,0.1)"
                        : "rgba(255,255,255,0.04)",
                      border: isTopAlert
                        ? "1px solid rgba(249,119,29,0.25)"
                        : "1px solid rgba(255,255,255,0.07)",
                      borderLeft: isTopAlert ? "3px solid #F9771D" : undefined,
                    }}
                  >
                    {itemContent}
                  </a>
                );
              }

              return (
                <div
                  key={item.id}
                  className={cn("rounded-lg p-3", feedVisible[i] ? "feed-slide-in" : "opacity-0")}
                  style={{
                    animationDelay: `${i * 80}ms`,
                    background: isTopAlert
                      ? "rgba(249,119,29,0.1)"
                      : "rgba(255,255,255,0.04)",
                    border: isTopAlert
                      ? "1px solid rgba(249,119,29,0.25)"
                      : "1px solid rgba(255,255,255,0.07)",
                    borderLeft: isTopAlert ? "3px solid #F9771D" : undefined,
                  }}
                >
                  {itemContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Panel footer bar ────────────────────────────────────────────────── */}
      <div
        className="h-9 flex items-center justify-between px-6"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00C896] rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-white/30">Terminal Connected</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-white/25">{londonTime || "GMT/BST Sync Active"}</span>
          <Link
            href="/dashboard/market-intelligence"
            className="text-[11px] font-bold px-3 py-1 rounded-md transition-colors"
            style={{ background: "#F9771D", color: "#fff" }}
          >
            Full Analysis →
          </Link>
        </div>
      </div>
    </section>
  );
}
