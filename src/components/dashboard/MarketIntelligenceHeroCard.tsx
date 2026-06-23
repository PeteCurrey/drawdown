"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, MoreHorizontal, AlertCircle } from "lucide-react";

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
  rsi: string;
  price: string;
  trend: string;
  /** 0–100 composite bias score */
  defaultPct: number;
}

export interface HeroFeedItem {
  id: string;
  type: "alert" | "event";
  severity?: "green" | "orange" | "red";
  source?: string;
  message: string;
  time?: string;
}

interface OpenAlert {
  label: string;
  count: number;
  color: "orange" | "green" | "red";
}

interface MarketIntelligenceHeroCardProps {
  instruments: HeroInstrument[];
  initialInstrument?: HeroInstrument;
  feedItems: HeroFeedItem[];
  todayTradeCount: number;
  openAlerts: OpenAlert[];
  onInstrumentChange?: (inst: HeroInstrument) => void;
}

// ── Orbit signal nodes ───────────────────────────────────────────────────────

interface SignalNode {
  name: string;
  /** Degrees on the 180° arc: 180 = far left, 360 = far right */
  deg: number;
  /** 0–1, fraction of face radius */
  radiusFactor: number;
  /** B = Bullish, M = Mixed, C = Conflict */
  letter: "B" | "M" | "C";
  alert: boolean;
}

const SIGNAL_NODES: SignalNode[] = [
  { name: "RSI",        deg: 200, radiusFactor: 0.71, letter: "B", alert: false },
  { name: "EMA",        deg: 222, radiusFactor: 0.63, letter: "B", alert: false },
  { name: "COT",        deg: 248, radiusFactor: 0.55, letter: "C", alert: true  },
  { name: "VOL",        deg: 270, radiusFactor: 0.59, letter: "M", alert: false },
  { name: "NEWS",       deg: 294, radiusFactor: 0.55, letter: "M", alert: false },
  { name: "ORDER FLOW", deg: 322, radiusFactor: 0.65, letter: "C", alert: true  },
  { name: "MACRO",      deg: 346, radiusFactor: 0.71, letter: "B", alert: false },
];

// ── Weighted bias calculation ─────────────────────────────────────────────────

function computeBias(inst: HeroInstrument): number {
  const rsiVal = parseFloat(inst.rsi) || 50;
  // RSI: 0–100 → 0–100 bias (>50 bullish, centred at 50)
  const rsiBias = Math.min(100, Math.max(0, rsiVal));
  // EMA: above = bullish 75, below = bearish 25
  const emaStr = inst.trend?.toUpperCase() || "";
  const emaBias = emaStr.includes("ABOVE") ? 75 : emaStr.includes("BELOW") ? 25 : 50;
  // Order flow: proxy from defaultPct (platform pre-computed value)
  const ofBias = inst.defaultPct;
  // Macro: use defaultPct with slight regression to 50
  const macroBias = 50 + (inst.defaultPct - 50) * 0.6;

  // Weighted composite
  const composite = rsiBias * 0.30 + emaBias * 0.30 + ofBias * 0.25 + macroBias * 0.15;
  return Math.round(Math.min(100, Math.max(0, composite)));
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
  feedItems,
  todayTradeCount,
  openAlerts,
  onInstrumentChange,
}: MarketIntelligenceHeroCardProps) {
  const [selectedInst, setSelectedInst] = useState<HeroInstrument>(
    initialInstrument ?? instruments[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"1H" | "4H" | "1D">("4H");

  // Animation state
  const hasAnimated    = useRef(false);
  const [cardVisible,  setCardVisible]  = useState(false);
  const [arcPct,       setArcPct]       = useState(0);
  const [displayPct,   setDisplayPct]   = useState(0);
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(SIGNAL_NODES.map(() => false));
  const [feedVisible,  setFeedVisible]  = useState<boolean[]>(feedItems.map(() => false));

  // Target bias for selected instrument
  const targetBias = computeBias(selectedInst);

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
    SIGNAL_NODES.forEach((_, i) => {
      setTimeout(() => {
        setNodesVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 1200 + i * 60);
    });

    // 4. Feed items slide in from 800ms
    feedItems.forEach((_, i) => {
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
  }, [selectedInst]);

  // ── Instrument change handler ─────────────────────────────────────────────
  const handleInstrumentChange = useCallback((inst: HeroInstrument) => {
    setSelectedInst(inst);
    setDropdownOpen(false);
    onInstrumentChange?.(inst);
  }, [onInstrumentChange]);

  // ── Derived values ────────────────────────────────────────────────────────
  const isBullish   = targetBias >= 50;
  const biasLabel   = isBullish ? "BULLISH BIAS" : "BEARISH BIAS";
  const arcOffset   = pctToOffset(arcPct);
  const tipPos      = arcTipPos(arcPct);
  const trendUp     = selectedInst.trend?.toUpperCase().includes("ABOVE");
  const trendAt     = selectedInst.trend?.toUpperCase().includes("AT");
  const trendColor  = trendUp ? "#00C896" : trendAt ? "#F9A825" : "#CE6969";
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
        // Single background shorthand — no split background/backgroundImage.
        // Layer order: gloss highlight → shimmer → accents → solid base.
        background: [
          "linear-gradient(180deg, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.000) 1px)",
          "conic-gradient(from 0deg at 30% 50%, rgba(255,255,255,0.000) 0deg, rgba(255,255,255,0.022) 60deg, rgba(255,255,255,0.000) 120deg)",
          "radial-gradient(ellipse 60% 40% at 70% 30%, rgba(0,200,150,0.04) 0%, transparent 70%)",
          "radial-gradient(ellipse 40% 60% at 20% 80%, rgba(249,119,29,0.03) 0%, transparent 60%)",
          "#0a0a0f",
        ].join(", "),
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
                className="absolute top-full left-0 mt-1 py-1 z-[99] min-w-[130px] rounded-lg border border-white/10"
                style={{ background: "rgba(20,20,24,0.95)", backdropFilter: "blur(12px)" }}
              >
                {instruments.map(inst => (
                  <button
                    key={inst.slug}
                    onClick={() => handleInstrumentChange(inst)}
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
            {(["1H", "4H", "1D"] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-2.5 py-1 text-[9px] font-bold font-mono tracking-wider transition-all",
                  timeframe === tf
                    ? "bg-white text-[#0a0a0f]"
                    : "text-white/40 hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <button className="p-1 hover:bg-white/[0.06] rounded">
            <MoreHorizontal className="w-4 h-4 text-white/30" />
          </button>
        </div>
      </div>

      {/* ── Body grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12" style={{ minHeight: 380 }}>

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
                {visibleAlerts.map(alert => (
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
                      return (
                        <g>
                          <rect
                            x={px - 7} y={py - 5.5}
                            width={14} height={11}
                            rx={2.5}
                            fill={node.alert ? "rgba(255,107,43,0.18)" : "rgba(255,255,255,0.07)"}
                            stroke={node.alert ? "rgba(255,107,43,0.4)" : "rgba(255,255,255,0.12)"}
                            strokeWidth={0.6}
                          />
                          <text
                            x={px} y={py + 1}
                            fill={node.alert ? "#FF6B2B" : "rgba(255,255,255,0.5)"}
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
                      fill="rgba(200,200,198,0.75)"
                      fontSize={8}
                      fontWeight={400}
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
              { label: "PRICE",    value: selectedInst.price,  color: "rgba(255,255,255,0.9)" },
              { label: "RSI (14)", value: selectedInst.rsi,    color: "rgba(255,255,255,0.9)" },
              { label: "TREND",    value: selectedInst.trend,  color: trendColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
                  {label}
                </p>
                <p
                  className="text-[13px] font-light font-mono tabular-nums"
                  style={{ color }}
                >
                  {value}
                </p>
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
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/35">
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
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {feedItems.map((item, i) => {
              const isAlert    = item.type === "alert";
              const isTopAlert = isAlert && i === feedItems.findIndex(f => f.type === "alert");
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
                      {isAlert && item.source && (
                        <p className="text-[10px] font-bold text-white/90 mb-0.5">{item.source}</p>
                      )}
                      <p className="text-[11px] text-white/65 leading-snug">{item.message}</p>
                      {item.time && (
                        <p className="text-[9px] font-mono text-white/25 mt-1">{item.time}</p>
                      )}
                    </div>
                  </div>
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
          <span className="text-[10px] font-mono text-white/25">GMT/BST Sync Active</span>
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
