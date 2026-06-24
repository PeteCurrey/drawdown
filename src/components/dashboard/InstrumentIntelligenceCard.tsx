"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMarketData, type MarketData } from "@/hooks/useMarketData";
import type { Signal } from "@/hooks/useTechnicalData";
import type { HeroInstrument } from "@/components/dashboard/MarketIntelligenceHeroCard";
import { intervalLabel, instrumentBySlug } from "@/lib/instruments";

/* ─────────────────────────────────────────────────────────────────────────────
   InstrumentIntelligenceCard
   ─────────────────────────────────────────────────────────────────────────────
   Placed directly below <MarketIntelligenceHeroCard /> on the Overview page.
   Receives the same selectedInst prop that the hero card does — no second
   instrument selector.

   Data pipeline:
     • useTwelveData  → live price, prevClose, changePct, ATR, volumePct
     • useTechnicalData → RSI/MACD per TF, EMA50/200, S1/R1 key levels
     • useExtraSignals   → BB, Stochastic, CCI via TwelveData 4H (internal hook)
     • useCalendarEvents → /api/calendar/[instrument] (internal hook)
   ───────────────────────────────────────────────────────────────────────────── */


// ─── Session timing ───────────────────────────────────────────────────────────

interface SessionInfo {
  name: string;
  color: string;
  openUTC: string;
  closeUTC: string;
  nextName: string;
  nextOpenUTC: string;
}

function computeSession(now = new Date()): SessionInfo {
  const total = now.getUTCHours() * 60 + now.getUTCMinutes();
  if (total >= 480 && total < 780)
    return { name: "LONDON",         color: "#4A9EFF", openUTC: "08:00", closeUTC: "17:00", nextName: "London / NY", nextOpenUTC: "13:00" };
  if (total >= 780 && total < 1020)
    return { name: "LONDON / NY",    color: "#00C896", openUTC: "13:00", closeUTC: "17:00", nextName: "New York",    nextOpenUTC: "17:00" };
  if (total >= 1020 && total < 1320)
    return { name: "NEW YORK",       color: "#F9771D", openUTC: "13:00", closeUTC: "22:00", nextName: "Sydney",      nextOpenUTC: "22:00" };
  if (total >= 1320 || total < 60)
    return { name: "SYDNEY / TOKYO", color: "#A78BFA", openUTC: "22:00", closeUTC: "07:00", nextName: "Tokyo",       nextOpenUTC: "00:00" };
  return   { name: "TOKYO",          color: "#FBBF24", openUTC: "00:00", closeUTC: "09:00", nextName: "London",      nextOpenUTC: "08:00" };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmtPrice(n: number | null | undefined, instrSlug: string): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const d = instrSlug.includes("JPY") ? 3
    : instrSlug.includes("XAU") || instrSlug.includes("BTC") ? 2
    : 5;
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtN(n: number | null | undefined, d = 2): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// ─── Calendar events hook ─────────────────────────────────────────────────────

interface CalEvent { time: string; country: string; event: string; impact: string; }

function useCalendarEvents(hookSlug: string) {
  const [state, setState] = useState<{ events: CalEvent[]; loading: boolean }>({ events: [], loading: true });

  useEffect(() => {
    setState({ events: [], loading: true });
    fetch(`/api/calendar/${hookSlug}`)
      .then(r => r.json())
      .then(d => setState({ events: (d.events ?? []).slice(0, 3), loading: false }))
      .catch(() => setState({ events: [], loading: false }));
  }, [hookSlug]);

  return state;
}

// ─── Signal derivation helpers ────────────────────────────────────────────────

function signalFromBB(upper: number | null, lower: number | null, price: number | null): Signal {
  if (!upper || !lower || !price) return "NEUTRAL";
  if (price > upper) return "SELL";
  if (price < lower) return "BUY";
  return "NEUTRAL";
}

function bbLabel(upper: number | null, lower: number | null, price: number | null): string {
  if (!upper || !lower || !price) return "—";
  if (price > upper) return "Above Upper";
  if (price < lower) return "Below Lower";
  const pct = ((price - lower) / (upper - lower)) * 100;
  if (pct > 80) return "Near Upper";
  if (pct < 20) return "Near Lower";
  return "Mid Band";
}

function signalFromStoch(k: number | null): Signal {
  if (k === null) return "NEUTRAL";
  return k > 80 ? "SELL" : k < 20 ? "BUY" : "NEUTRAL";
}

function signalFromCCI(cci: number | null): Signal {
  if (cci === null) return "NEUTRAL";
  return cci > 100 ? "BUY" : cci < -100 ? "SELL" : "NEUTRAL";
}

function signalFromVolume(ratio: number | null | undefined): Signal {
  if (ratio == null) return "NEUTRAL";
  return ratio > 130 ? "BUY" : ratio < 70 ? "SELL" : "NEUTRAL";
}

// ─── Design tokens (light mode) ──────────────────────────────────────────────
// All text and border values are dark-on-white.
const T = {
  text:       "#111110",
  textSub:    "rgba(0,0,0,0.50)",
  textMuted:  "rgba(0,0,0,0.35)",
  textFaint:  "rgba(0,0,0,0.22)",
  divider:    "rgba(0,0,0,0.06)",
  dividerXl:  "rgba(0,0,0,0.09)",
  skelBg:     "rgba(0,0,0,0.06)",
  rowBgNeutral: "rgba(0,0,0,0.025)",
  rowBorderNeutral: "rgba(0,0,0,0.08)",
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skel({ className }: { className?: string }) {
  return <div className={cn("rounded animate-pulse", className)} style={{ background: T.skelBg }} />;
}

function KeyLevelRow({
  label, value, valueColor,
}: { label: string; value: string; valueColor?: string }) {
  return (
    <div
      className="flex items-center justify-between h-8"
      style={{ borderBottom: `1px solid ${T.divider}` }}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider"
        style={{ color: T.textFaint }}>
        {label}
      </span>
      <span className="text-[12px] font-mono tabular-nums"
        style={{ color: valueColor ?? T.text }}>
        {value}
      </span>
    </div>
  );
}

interface SignalRowProps {
  name: string;
  value: string;
  signal: Signal;
  loading?: boolean;
}

function SignalRow({ name, value, signal, loading }: SignalRowProps) {
  if (loading) {
    return (
      <div className="h-10 flex items-center px-3"
        style={{
          background: T.rowBgNeutral,
          borderLeft: `2px solid ${T.rowBorderNeutral}`,
          borderBottom: `1px solid ${T.divider}`,
        }}>
        <Skel className="h-2.5 flex-1" />
      </div>
    );
  }

  const isBuy  = signal === "BUY";
  const isSell = signal === "SELL";
  const accentColor = isBuy ? "#00c864" : isSell ? "#dc3232" : T.rowBorderNeutral;

  return (
    <div
      className="flex items-center h-10 px-3 gap-2"
      style={{
        background: isBuy ? "rgba(0,200,100,0.06)" : isSell ? "rgba(220,50,50,0.06)" : T.rowBgNeutral,
        borderLeft: `2px solid ${accentColor}`,
        borderBottom: `1px solid ${T.divider}`,
      }}
    >
      <span className="text-[11px] font-mono shrink-0 w-[90px]"
        style={{ color: T.textMuted }}>
        {name}
      </span>
      <span className="text-[11px] font-mono flex-1 text-center truncate"
        style={{ color: T.textSub }}>
        {value}
      </span>
      <span
        className="text-[10px] font-bold tracking-[0.1em] shrink-0 min-w-[42px] text-right"
        style={{ color: isBuy ? "#00c864" : isSell ? "#dc3232" : T.textFaint }}
      >
        {signal}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface InstrumentIntelligenceCardProps {
  instrument: HeroInstrument;
  /** Twelve Data interval string, e.g. "4h" — passed from dashboard/page.tsx */
  interval?: string;
}

export function InstrumentIntelligenceCard({ instrument, interval = "4h" }: InstrumentIntelligenceCardProps) {
  // ── Slug normalisation ──────────────────────────────────────────────────────
  // Primary: hookSlug directly on the Instrument object from lib/instruments
  // Secondary: instrumentBySlug catalogue lookup
  // Fallback: strip slash
  const hookSlug: string =
    (instrument as any).hookSlug
    ?? instrumentBySlug(instrument.slug)?.hookSlug
    ?? instrument.slug.replace("/", "");

  // ── Single data hook (server-side, no rate limiting) ─────────────────────
  const md  = useMarketData(hookSlug, interval);
  const cal = useCalendarEvents(hookSlug);

  // ── Session (refreshes every minute) ───────────────────────────────────────
  const [session, setSession] = useState<SessionInfo>(() => computeSession());
  useEffect(() => {
    const t = setInterval(() => setSession(computeSession()), 60_000);
    return () => clearInterval(t);
  }, []);

  // ── Bias direction — from live biasScore ───────────────────────────────────
  const biasScore = md.biasScore;
  const bias: "bullish" | "bearish" | "neutral" =
    biasScore !== null
      ? (biasScore >= 55 ? "bullish" : biasScore <= 45 ? "bearish" : "neutral")
      : (instrument.defaultPct >= 55 ? "bullish" : instrument.defaultPct <= 45 ? "bearish" : "neutral");

  // ── Entrance animations ─────────────────────────────────────────────────────
  const [cardVisible, setCardVisible] = useState(false);
  const [col1Vis,     setCol1Vis]     = useState(false);
  const [col2Vis,     setCol2Vis]     = useState(false);
  const [col3Vis,     setCol3Vis]     = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCardVisible(true), 300);
    const t2 = setTimeout(() => setCol1Vis(true),     400);
    const t3 = setTimeout(() => setCol2Vis(true),     500);
    const t4 = setTimeout(() => setCol3Vis(true),     600);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, []);

  // ── Inject keyframes (once) ─────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("intel-card-styles")) return;
    const s = document.createElement("style");
    s.id = "intel-card-styles";
    s.textContent = `
      @keyframes intelFadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .intel-card-enter { animation: intelFadeUp 500ms ease-out both; }
    `;
    document.head.appendChild(s);
  }, []);

  // ── Price & change ─────────────────────────────────────────────────────────
  const livePrice  = md.price;
  const changeAbs  = md.change;
  const changePct  = md.changePct;
  const priceUp    = changeAbs !== null ? changeAbs >= 0 : null;
  const changeDecimals =
    instrument.slug.includes("JPY") ? 3 :
    (instrument.slug.includes("XAU") || instrument.slug.includes("BTC")) ? 2 : 5;

  // ── Key levels ─────────────────────────────────────────────────────────────
  // Swing high/low from 20-candle lookback (computed server-side)
  const support    = md.support;
  const resistance = md.resistance;
  const ema50      = md.ema50;
  const ema200     = md.ema200;
  const atr        = md.atrCurrent;

  // ── RSI signal ─────────────────────────────────────────────────────────────
  const rsiVal     = md.rsi;
  const rsiSig:  Signal = rsiVal === null ? "NEUTRAL"
    : rsiVal < 40 ? "BUY" : rsiVal > 60 ? "SELL" : "NEUTRAL";

  // ── MACD signal ────────────────────────────────────────────────────────────
  const macdSig: Signal = md.macdLine !== null && md.macdSignal !== null
    ? (md.macdLine > md.macdSignal ? "BUY" : md.macdLine < md.macdSignal ? "SELL" : "NEUTRAL")
    : "NEUTRAL";
  const macdStr =
    macdSig === "BUY"  ? "Bullish Cross" :
    macdSig === "SELL" ? "Bearish Cross" : "Converging";

  // ── BB, Stoch, CCI signals ─────────────────────────────────────────────────
  const bbSig:   Signal = signalFromBB(md.bbUpper, md.bbLower, livePrice);
  const stochSig:Signal = signalFromStoch(md.stochK);
  const cciSig:  Signal = signalFromCCI(md.cci);
  const volSig:  Signal = signalFromVolume(md.volRatio);

  const bbStr    = bbLabel(md.bbUpper, md.bbLower, livePrice);
  const stochStr = md.stochK !== null ? md.stochK.toFixed(1) : "—";
  const cciStr   = md.cci !== null ? (md.cci >= 0 ? `+${md.cci.toFixed(1)}` : md.cci.toFixed(1)) : "—";
  const rsiStr   = rsiVal !== null ? rsiVal.toFixed(1) : "—";
  const volStr   = md.volRatio === null ? "—"
    : md.volRatio > 130 ? "Above Avg" : md.volRatio < 70 ? "Below Avg" : "Normal";

  // ── Signal summary ─────────────────────────────────────────────────────────
  const allSignals: Signal[] = [rsiSig, macdSig, bbSig, stochSig, cciSig, volSig];
  const buyCount  = allSignals.filter(s => s === "BUY").length;
  const sellCount = allSignals.filter(s => s === "SELL").length;
  const summaryText =
    buyCount > sellCount  ? `${buyCount} of 6 indicators bullish` :
    sellCount > buyCount  ? `${sellCount} of 6 indicators bearish` :
    "Mixed — no clear bias";
  const summaryColor =
    buyCount > sellCount  ? "#00c864" :
    sellCount > buyCount  ? "#dc3232" : T.textMuted;

  // ── ATR volatility — real current vs 20-period average ────────────────────
  const atrRatio   = md.atrRatio;
  const volBarW    = atrRatio ? Math.min(100, Math.max(4, atrRatio * 50)) : 0;
  const volLabel   = !atrRatio ? "—" : atrRatio < 0.75 ? "LOW" : atrRatio < 1.25 ? "NORMAL" : atrRatio < 1.75 ? "ELEVATED" : "HIGH";
  const volColor   = volLabel === "LOW"      ? T.textMuted
                   : volLabel === "NORMAL"   ? "#D97706"
                   : volLabel === "ELEVATED" ? "#F97316" : "#DC2626";

  // ── Trend description ──────────────────────────────────────────────────────
  const trendDesc = md.trendDir === null && md.loading ? "Loading..."
    : md.trendDir === "above" ? (md.ema200 && livePrice && livePrice > md.ema200
        ? "Strongly bullish — price above both EMAs"
        : "Moderately bullish — above EMA 50")
    : md.trendDir === "below" ? (md.ema200 && livePrice && livePrice < md.ema200
        ? "Bearish — price below both EMAs"
        : "Weakly bearish — below EMA 50")
    : md.trendDir === "at" ? "At EMA 50 — watching for breakout"
    : "Waiting for data...";

  // ── Loading states ─────────────────────────────────────────────────────────
  const dataLoading = md.loading;

  // ── Card shadow & border
  const cardBoxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)";

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      className={cn("relative rounded-2xl bg-white overflow-hidden", cardVisible ? "intel-card-enter" : "opacity-0")}
      style={{
        boxShadow: cardBoxShadow,
        border: `1px solid ${T.divider}`,
      }}
    >
      {/* ── Bottom-left corner glow — two layers cross-fade on bias change ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: bias === "bullish" ? 1 : 0,
          background: "radial-gradient(ellipse 110% 90% at 0% 100%, rgba(0,200,100,0.28) 0%, rgba(0,200,100,0.06) 45%, transparent 70%)",
          transition: "opacity 800ms ease",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: bias === "bearish" ? 1 : 0,
          background: "radial-gradient(ellipse 110% 90% at 0% 100%, rgba(220,50,50,0.28) 0%, rgba(220,50,50,0.06) 45%, transparent 70%)",
          transition: "opacity 800ms ease",
        }}
      />
      {/* ── Body (z-1 so it sits above the glow layer) ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 py-6 px-8">

        {/* ══ COLUMN 1 — Instrument Header & Key Levels ══ */}
        <div
          className="lg:pr-8 pb-6 lg:pb-0"
          style={{
            opacity: col1Vis ? 1 : 0,
            transform: col1Vis ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
            borderRight: `1px solid ${T.divider}`,
            borderBottom: `1px solid ${T.divider}`,
          }}
        >
          {/* Instrument name + bias pill */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-[26px] font-bold leading-none tracking-tight" style={{ color: T.text }}>
                {instrument.name}
              </h2>
              <span
                className="text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  background: bias === "bullish" ? "rgba(0,200,100,0.10)"
                            : bias === "bearish" ? "rgba(220,50,50,0.10)"
                            : "rgba(0,0,0,0.05)",
                  color: bias === "bullish" ? "#00966A"
                       : bias === "bearish" ? "#B91C1C"
                       : T.textMuted,
                  border: `1px solid ${bias === "bullish" ? "rgba(0,200,100,0.22)" : bias === "bearish" ? "rgba(220,50,50,0.22)" : T.divider}`,
                }}
              >
                {bias === "bullish" ? "BULLISH" : bias === "bearish" ? "BEARISH" : "NEUTRAL"}
              </span>
            </div>
            <p className="text-[12px]" style={{ color: T.textFaint }}>
              {instrument.name}
            </p>
          </div>

          {/* Live price */}
          <div className="mb-5">
            {dataLoading ? (
              <>
                <Skel className="h-7 w-36 mb-2" />
                <Skel className="h-3 w-24" />
              </>
            ) : (
              <>
                <p className="text-[22px] font-mono font-semibold tabular-nums leading-none mb-1.5" style={{ color: T.text }}>
                  {livePrice ? fmtPrice(livePrice, instrument.slug) : "—"}
                </p>
                {changeAbs !== null && changePct !== null ? (
                  <p className="text-[11px] font-mono"
                    style={{ color: priceUp ? "#059669" : "#DC2626" }}>
                    {priceUp ? "+" : ""}{fmtN(changeAbs, changeDecimals)}
                    {" "}({priceUp ? "+" : ""}{changePct?.toFixed(2)}%)
                  </p>
                ) : (
                  <p className="text-[11px] font-mono" style={{ color: T.textFaint }}>
                    — updating day change
                  </p>
                )}
              </>
            )}
          </div>

          {/* Key levels separator + header */}
          <div className="mb-3" style={{ borderTop: `1px solid ${T.divider}` }} />
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-2"
            style={{ color: T.textFaint }}>
            Key Levels · 4H
          </p>

          {/* Key level rows */}
          <div>
            {dataLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between h-8"
                  style={{ borderBottom: `1px solid ${T.divider}` }}>
                  <Skel className="h-2.5 w-16" />
                  <Skel className="h-2.5 w-20" />
                </div>
              ))
            ) : (
              <>
                <KeyLevelRow label="Support"    value={fmtPrice(support,    instrument.slug)} valueColor="#059669" />
                <KeyLevelRow label="Resistance" value={fmtPrice(resistance, instrument.slug)} valueColor="#DC2626" />
                <KeyLevelRow label="EMA 50"     value={fmtPrice(ema50,      instrument.slug)} />
                <KeyLevelRow label="EMA 200"    value={fmtPrice(ema200,     instrument.slug)} />
                <KeyLevelRow label="ATR (14)"   value={atr ? fmtN(atr, instrument.slug.includes("XAU") ? 2 : 5) : "—"} />
              </>
            )}
          </div>
        </div>

        {/* ══ COLUMN 2 — Technical Signals ══ */}
        <div
          className="lg:px-8 py-6 lg:py-0"
          style={{
            opacity: col2Vis ? 1 : 0,
            transform: col2Vis ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease-out 100ms, transform 400ms ease-out 100ms",
            borderRight: `1px solid ${T.divider}`,
            borderBottom: `1px solid ${T.divider}`,
          }}
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-4"
            style={{ color: T.textFaint }}>
            Technical Signals · {intervalLabel(interval)}
          </p>

          {/* Signal badge grid */}
          <div
            className="flex flex-col overflow-hidden rounded-lg"
            style={{ border: `1px solid ${T.dividerXl}` }}
          >
            <SignalRow
              name="RSI (14)"
              value={rsiStr}
              signal={rsiSig}
              loading={dataLoading}
            />
            <SignalRow
              name="MACD"
              value={macdStr}
              signal={macdSig}
              loading={dataLoading}
            />
            <SignalRow
              name="Bollinger"
              value={bbStr}
              signal={bbSig}
              loading={dataLoading}
            />
            <SignalRow
              name="Stochastic"
              value={stochStr !== "—" ? `K: ${stochStr}` : "—"}
              signal={stochSig}
              loading={dataLoading}
            />
            <SignalRow
              name="CCI (20)"
              value={cciStr}
              signal={cciSig}
              loading={dataLoading}
            />
            <SignalRow
              name="Volume"
              value={volStr}
              signal={volSig}
              loading={dataLoading}
            />
          </div>

          {/* Summary line */}
          <p className="text-[10px] font-mono text-right mt-2.5"
            style={{ color: dataLoading ? T.textFaint : summaryColor }}>
            {dataLoading ? "Computing signals…" : summaryText}
          </p>
        </div>

        {/* ══ COLUMN 3 — Market Context & Session ══ */}
        <div
          className="lg:pl-8 pt-6 lg:pt-0"
          style={{
            opacity: col3Vis ? 1 : 0,
            transform: col3Vis ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease-out 200ms, transform 400ms ease-out 200ms",
          }}
        >
          {/* Active Session */}
          <div className="mb-5">
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-2.5"
              style={{ color: T.textFaint }}>
              Active Session
            </p>
            <span
              className="inline-block text-[11px] font-bold font-mono tracking-wider px-3 py-1 rounded-full mb-2"
              style={{
                background: `${session.color}18`,
                color: session.color,
                border: `1px solid ${session.color}40`,
              }}
            >
              {session.name}
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono"
              style={{ color: T.textMuted }}>
              <span>Open {session.openUTC} UTC</span>
              <span>Close {session.closeUTC} UTC</span>
            </div>
            <p className="text-[10px] font-mono mt-1" style={{ color: T.textFaint }}>
              Next: {session.nextName} · {session.nextOpenUTC} UTC
            </p>
          </div>

          {/* Separator */}
          <div className="mb-4" style={{ borderTop: `1px solid ${T.divider}` }} />

          {/* Volatility */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.15em]"
                style={{ color: T.textFaint }}>
                Volatility
              </p>
              <span className="text-[10px] font-bold font-mono" style={{ color: volColor }}>
                {volLabel}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: T.skelBg }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${volBarW}%`, background: volColor }}
              />
            </div>
            {atr && livePrice ? (
              <p className="text-[9px] font-mono mt-1.5" style={{ color: T.textFaint }}>
                ATR {fmtN(atr, 3)} · {((atr / livePrice) * 100).toFixed(2)}% of price
              </p>
            ) : (
              <Skel className="h-2.5 w-28 mt-1.5" />
            )}
          </div>

          {/* Separator */}
          <div className="mb-4" style={{ borderTop: `1px solid ${T.divider}` }} />

          {/* Economic Events */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-3"
              style={{ color: T.textFaint }}>
              Upcoming Events
            </p>

            {cal.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5"
                  style={{ borderBottom: i < 2 ? `1px solid ${T.divider}` : "none" }}>
                  <Skel className="w-2 h-2 rounded-full shrink-0" />
                  <Skel className="h-2.5 flex-1" />
                  <Skel className="h-2.5 w-10" />
                </div>
              ))
            ) : cal.events.length === 0 ? (
              <p className="text-[10px] font-mono" style={{ color: T.textFaint }}>
                No events in next 7 days
              </p>
            ) : (
              cal.events.map((evt, i) => {
                const impactColor =
                  evt.impact === "high"   ? "#DC2626" :
                  evt.impact === "medium" ? "#D97706" :
                  T.textMuted;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 py-2.5"
                    style={{
                      borderBottom: i < cal.events.length - 1
                        ? `1px solid ${T.divider}`
                        : "none",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1"
                      style={{ background: impactColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-tight truncate"
                        style={{ color: T.textSub }}>
                        {evt.event}
                      </p>
                      <p className="text-[9px] font-mono mt-0.5"
                        style={{ color: T.textMuted }}>
                        {evt.country} · {evt.time} UTC
                      </p>
                    </div>
                    <span
                      className="text-[8px] font-bold font-mono tracking-wider uppercase shrink-0 mt-0.5"
                      style={{ color: impactColor }}
                    >
                      {evt.impact}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
