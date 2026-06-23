"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTwelveData, tdSymbol } from "@/hooks/useTwelveData";
import { useTechnicalData, type Signal } from "@/hooks/useTechnicalData";
import type { HeroInstrument } from "@/components/dashboard/MarketIntelligenceHeroCard";

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
     • useCalendarEvents → Finnhub /api/calendar/[instrument] (internal hook)
   ───────────────────────────────────────────────────────────────────────────── */

// ─── Static maps ──────────────────────────────────────────────────────────────

const FULL_NAMES: Record<string, string> = {
  "GBP/USD": "British Pound / US Dollar",
  "EUR/USD": "Euro / US Dollar",
  "USD/JPY": "US Dollar / Japanese Yen",
  "EUR/GBP": "Euro / British Pound",
  "XAU/USD": "Gold vs US Dollar",
  "BTC/USD": "Bitcoin / US Dollar",
};

/** Map from INSTRUMENTS_LIST slug ("GBP/USD") to hook slug ("GBPUSD") */
const SLUG_TO_HOOK: Record<string, string> = {
  "GBP/USD": "GBPUSD",
  "EUR/USD": "EURUSD",
  "USD/JPY": "USDJPY",
  "EUR/GBP": "EURGBP",
  "XAU/USD": "XAUUSD",
  "BTC/USD": "BTCUSDT",
};

/** Typical ATR as % of price — used for volatility comparison */
const TYPICAL_ATR_PCT: Record<string, number> = {
  GBPUSD: 0.55, EURUSD: 0.45, USDJPY: 0.55, EURGBP: 0.30,
  XAUUSD: 1.20, BTCUSDT: 3.50,
};

const TD_BASE = "https://api.twelvedata.com";

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
  // London:  08:00–17:00 UTC  (480–1020)
  // Overlap: 13:00–17:00 UTC  (780–1020)
  // New York:13:00–22:00 UTC  (780–1320)
  // Sydney:  22:00–07:00 UTC
  // Tokyo:   00:00–09:00 UTC
  if (total >= 480 && total < 780)
    return { name: "LONDON",           color: "#4A9EFF", openUTC: "08:00", closeUTC: "17:00", nextName: "London / NY", nextOpenUTC: "13:00" };
  if (total >= 780 && total < 1020)
    return { name: "LONDON / NY",      color: "#00C896", openUTC: "13:00", closeUTC: "17:00", nextName: "New York",    nextOpenUTC: "17:00" };
  if (total >= 1020 && total < 1320)
    return { name: "NEW YORK",          color: "#F9771D", openUTC: "13:00", closeUTC: "22:00", nextName: "Sydney",      nextOpenUTC: "22:00" };
  if (total >= 1320 || total < 60)
    return { name: "SYDNEY / TOKYO",   color: "#A78BFA", openUTC: "22:00", closeUTC: "07:00", nextName: "Tokyo",       nextOpenUTC: "00:00" };
  if (total >= 0 && total < 480)
    return { name: "TOKYO",            color: "#FBBF24", openUTC: "00:00", closeUTC: "09:00", nextName: "London",      nextOpenUTC: "08:00" };
  return   { name: "CLOSED",           color: "#6B7280", openUTC: "--",    closeUTC: "--",    nextName: "London",      nextOpenUTC: "08:00" };
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

// ─── Extra-signals hook (BB, Stoch, CCI) ─────────────────────────────────────

interface ExtraSignals {
  bbUpper:  number | null;
  bbMiddle: number | null;
  bbLower:  number | null;
  stochK:   number | null;
  stochD:   number | null;
  cci:      number | null;
  loading:  boolean;
  error:    boolean;
}

const EXTRA_EMPTY: ExtraSignals = {
  bbUpper: null, bbMiddle: null, bbLower: null,
  stochK: null,  stochD: null,  cci: null,
  loading: true, error: false,
};

function useExtraSignals(hookSlug: string): ExtraSignals {
  const [state, setState] = useState<ExtraSignals>({ ...EXTRA_EMPTY });
  const prevSlug = useRef<string | null>(null);

  useEffect(() => {
    if (prevSlug.current === hookSlug) return;
    prevSlug.current = hookSlug;
    setState({ ...EXTRA_EMPTY, loading: true });

    const key = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
    if (!key) { setState({ ...EXTRA_EMPTY, loading: false, error: true }); return; }

    const sym = encodeURIComponent(tdSymbol(hookSlug));
    Promise.all([
      fetch(`${TD_BASE}/bbands?symbol=${sym}&interval=4h&time_period=20&series_type=close&outputsize=1&apikey=${key}`)
        .then(r => r.json()).catch(() => null),
      fetch(`${TD_BASE}/stoch?symbol=${sym}&interval=4h&outputsize=1&apikey=${key}`)
        .then(r => r.json()).catch(() => null),
      fetch(`${TD_BASE}/cci?symbol=${sym}&interval=4h&time_period=20&outputsize=1&apikey=${key}`)
        .then(r => r.json()).catch(() => null),
    ]).then(([bb, stoch, cci]) => {
      setState({
        bbUpper:  bb?.values?.[0]?.upper_band  ? parseFloat(bb.values[0].upper_band)  : null,
        bbMiddle: bb?.values?.[0]?.middle_band ? parseFloat(bb.values[0].middle_band) : null,
        bbLower:  bb?.values?.[0]?.lower_band  ? parseFloat(bb.values[0].lower_band)  : null,
        stochK:   stoch?.values?.[0]?.slow_k   ? parseFloat(stoch.values[0].slow_k)   : null,
        stochD:   stoch?.values?.[0]?.slow_d   ? parseFloat(stoch.values[0].slow_d)   : null,
        cci:      cci?.values?.[0]?.cci        ? parseFloat(cci.values[0].cci)        : null,
        loading: false, error: false,
      });
    }).catch(() => setState({ ...EXTRA_EMPTY, loading: false, error: true }));
  }, [hookSlug]);

  return state;
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

function bbLabel(extra: ExtraSignals, price: number | null): string {
  if (!extra.bbUpper || !extra.bbLower || !price) return "—";
  if (price > extra.bbUpper) return "Above Upper";
  if (price < extra.bbLower) return "Below Lower";
  const pct = ((price - extra.bbLower) / (extra.bbUpper - extra.bbLower)) * 100;
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

function signalFromVolume(pct: number | null | undefined): Signal {
  if (pct == null) return "NEUTRAL";
  return pct > 120 ? "BUY" : pct < 80 ? "SELL" : "NEUTRAL";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skel({ className }: { className?: string }) {
  return <div className={cn("rounded", className)} style={{ background: "rgba(255,255,255,0.06)" }} />;
}

function KeyLevelRow({
  label, value, valueColor,
}: { label: string; value: string; valueColor?: string }) {
  return (
    <div
      className="flex items-center justify-between h-8"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.32)" }}>
        {label}
      </span>
      <span className="text-[12px] font-mono tabular-nums"
        style={{ color: valueColor ?? "rgba(255,255,255,0.82)" }}>
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
          background: "rgba(255,255,255,0.025)",
          borderLeft: "2px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
        <Skel className="h-2.5 flex-1" />
      </div>
    );
  }

  const isBuy  = signal === "BUY";
  const isSell = signal === "SELL";
  const accentColor = isBuy ? "#00c864" : isSell ? "#dc3232" : "rgba(255,255,255,0.1)";

  return (
    <div
      className="flex items-center h-10 px-3 gap-2"
      style={{
        background: isBuy ? "rgba(0,200,100,0.07)" : isSell ? "rgba(220,50,50,0.07)" : "rgba(255,255,255,0.025)",
        borderLeft: `2px solid ${accentColor}`,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span className="text-[11px] font-mono shrink-0 w-[90px]"
        style={{ color: "rgba(255,255,255,0.42)" }}>
        {name}
      </span>
      <span className="text-[11px] font-mono flex-1 text-center truncate"
        style={{ color: "rgba(255,255,255,0.68)" }}>
        {value}
      </span>
      <span
        className="text-[10px] font-bold tracking-[0.1em] shrink-0 min-w-[42px] text-right"
        style={{ color: isBuy ? "#00c864" : isSell ? "#dc3232" : "rgba(255,255,255,0.22)" }}
      >
        {signal}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface InstrumentIntelligenceCardProps {
  instrument: HeroInstrument;
}

export function InstrumentIntelligenceCard({ instrument }: InstrumentIntelligenceCardProps) {
  // ── Slug normalisation ──────────────────────────────────────────────────────
  const hookSlug = SLUG_TO_HOOK[instrument.slug] ?? instrument.slug.replace("/", "");

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const tdAll  = useTwelveData([hookSlug]);
  const td     = tdAll[hookSlug];
  const tech   = useTechnicalData(hookSlug, true);
  const extra  = useExtraSignals(hookSlug);
  const cal    = useCalendarEvents(hookSlug);

  // ── Session (refreshes every minute) ───────────────────────────────────────
  const [session, setSession] = useState<SessionInfo>(() => computeSession());
  useEffect(() => {
    const t = setInterval(() => setSession(computeSession()), 60_000);
    return () => clearInterval(t);
  }, []);

  // ── Bias direction ──────────────────────────────────────────────────────────
  const bias: "bullish" | "bearish" | "neutral" =
    instrument.defaultPct >= 55 ? "bullish" :
    instrument.defaultPct <= 45 ? "bearish" : "neutral";

  // ── Entrance animations — fire once on mount via hasAnimated ref ────────────
  const hasAnimated = useRef(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [col1Vis,     setCol1Vis]     = useState(false);
  const [col2Vis,     setCol2Vis]     = useState(false);
  const [col3Vis,     setCol3Vis]     = useState(false);
  const [glowVis,     setGlowVis]     = useState(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const t1 = setTimeout(() => setCardVisible(true),  300);
    const t2 = setTimeout(() => setCol1Vis(true),       400);
    const t3 = setTimeout(() => setCol2Vis(true),       500);
    const t4 = setTimeout(() => setCol3Vis(true),       600);
    const t5 = setTimeout(() => setGlowVis(true),      1300);
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout); };
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

  // ── Price & change ──────────────────────────────────────────────────────────
  const livePrice  = td?.price;
  const prevClose  = td?.prevClose;
  const changePct  = td?.changePct;
  const changeAbs  = (livePrice && prevClose) ? livePrice - prevClose : null;
  const priceUp    = changeAbs !== null ? changeAbs >= 0 : null;
  const changeDecimals =
    instrument.slug.includes("JPY") ? 3 :
    (instrument.slug.includes("XAU") || instrument.slug.includes("BTC")) ? 2 : 5;

  // ── Key levels ──────────────────────────────────────────────────────────────
  const support    = tech.keyLevels.s1;
  const resistance = tech.keyLevels.r1;
  const ema50      = tech.emaStack.ema50;
  const ema200     = tech.emaStack.ema200;
  const atr        = td?.atr;

  // ── 4H timeframe row (TF_MAP index 2 = "4H") ───────────────────────────────
  const row4H      = tech.rows[2];
  const rsiVal     = row4H?.rsi ?? null;
  const rsiSig:  Signal = row4H?.rsiSignal  ?? "NEUTRAL";
  const macdSig: Signal = row4H?.macdSignal ?? "NEUTRAL";

  // ── Additional signals ──────────────────────────────────────────────────────
  const bbSig:   Signal = signalFromBB(extra.bbUpper, extra.bbLower, livePrice ?? null);
  const stochSig:Signal = signalFromStoch(extra.stochK);
  const cciSig:  Signal = signalFromCCI(extra.cci);
  const volSig:  Signal = signalFromVolume(td?.volumePct);

  // ── Signal summary ──────────────────────────────────────────────────────────
  const allSignals: Signal[] = [rsiSig, macdSig, bbSig, stochSig, cciSig, volSig];
  const buyCount  = allSignals.filter(s => s === "BUY").length;
  const sellCount = allSignals.filter(s => s === "SELL").length;
  const summaryText =
    buyCount > sellCount  ? `${buyCount} of 6 indicators bullish` :
    sellCount > buyCount  ? `${sellCount} of 6 indicators bearish` :
    "Mixed — no clear bias";
  const summaryColor =
    buyCount > sellCount  ? "#00c864" :
    sellCount > buyCount  ? "#dc3232" : "rgba(255,255,255,0.3)";

  // ── Volatility ──────────────────────────────────────────────────────────────
  const atrPct     = (livePrice && atr) ? (atr / livePrice) * 100 : null;
  const typicalPct = TYPICAL_ATR_PCT[hookSlug] ?? 0.5;
  const atrRatio   = atrPct ? atrPct / typicalPct : null;
  const volBarW    = atrRatio ? Math.min(100, Math.max(4, atrRatio * 50)) : 0;
  const volLabel   = !atrRatio ? "—" : atrRatio < 0.7 ? "LOW" : atrRatio < 1.3 ? "NORMAL" : "HIGH";
  const volColor   = volLabel === "LOW"    ? "rgba(255,255,255,0.4)"
                   : volLabel === "NORMAL" ? "#FBBF24" : "#F87171";

  // ── Loading states ──────────────────────────────────────────────────────────
  const priceLoading   = td?.loading ?? true;
  const techLoading    = tech.loading;
  const signalsLoading = extra.loading || tech.loading;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      className={cn("relative overflow-hidden rounded-2xl", cardVisible ? "intel-card-enter" : "opacity-0")}
      style={{
        // Single background shorthand — layers top-to-bottom, solid colour last.
        // This is the ONLY way to guarantee no layer cancels another.
        background: [
          "conic-gradient(from 0deg at 30% 60%, rgba(255,255,255,0.000) 0deg, rgba(255,255,255,0.022) 60deg, rgba(255,255,255,0.000) 120deg)",
          "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(0,200,150,0.03) 0%, transparent 60%)",
          "#0d0d0f",
        ].join(", "),
      }}
    >
      {/* ── Directional glow — opacity cross-fade between bullish/bearish ── */}
      {/* Must be inside the section so overflow-hidden clips it correctly    */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowVis && bias === "bullish" ? 1 : 0,
          background: "radial-gradient(ellipse 90% 90% at 0% 100%, rgba(0,200,100,0.12) 0%, transparent 55%)",
          transition: "opacity 800ms ease",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowVis && bias === "bearish" ? 1 : 0,
          background: "radial-gradient(ellipse 90% 90% at 0% 100%, rgba(220,50,50,0.12) 0%, transparent 55%)",
          transition: "opacity 800ms ease",
        }}
      />

      {/* ── Body ── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 py-6 px-8">

        {/* ══ COLUMN 1 — Instrument Header & Key Levels ══ */}
        <div
          className="lg:pr-8 pb-6 lg:pb-0"
          style={{
            opacity: col1Vis ? 1 : 0,
            transform: col1Vis ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Instrument name + bias pill */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-[26px] font-bold text-white leading-none tracking-tight">
                {instrument.name}
              </h2>
              <span
                className="text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  background: bias === "bullish" ? "rgba(0,200,100,0.14)"
                            : bias === "bearish" ? "rgba(220,50,50,0.14)"
                            : "rgba(255,255,255,0.07)",
                  color: bias === "bullish" ? "#00C896"
                       : bias === "bearish" ? "#F87171"
                       : "rgba(255,255,255,0.4)",
                  border: `1px solid ${bias === "bullish" ? "rgba(0,200,100,0.25)" : bias === "bearish" ? "rgba(220,50,50,0.25)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {bias === "bullish" ? "BULLISH" : bias === "bearish" ? "BEARISH" : "NEUTRAL"}
              </span>
            </div>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.32)" }}>
              {FULL_NAMES[instrument.slug] ?? instrument.slug}
            </p>
          </div>

          {/* Live price */}
          <div className="mb-5">
            {priceLoading ? (
              <>
                <Skel className="h-7 w-36 mb-2" />
                <Skel className="h-3 w-24" />
              </>
            ) : (
              <>
                <p className="text-[22px] font-mono font-light text-white tabular-nums leading-none mb-1.5">
                  {livePrice ? fmtPrice(livePrice, instrument.slug) : instrument.price}
                </p>
                {changeAbs !== null && changePct !== null ? (
                  <p className="text-[11px] font-mono"
                    style={{ color: priceUp ? "#00C896" : "#F87171" }}>
                    {priceUp ? "+" : ""}{fmtN(changeAbs, changeDecimals)}
                    {" "}({priceUp ? "+" : ""}{changePct?.toFixed(2)}%)
                  </p>
                ) : (
                  <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.18)" }}>
                    — updating day change
                  </p>
                )}
              </>
            )}
          </div>

          {/* Key levels separator + header */}
          <div className="mb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-2"
            style={{ color: "rgba(255,255,255,0.22)" }}>
            Key Levels · 4H
          </p>

          {/* Key level rows */}
          <div>
            {techLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between h-8"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Skel className="h-2.5 w-16" />
                  <Skel className="h-2.5 w-20" />
                </div>
              ))
            ) : (
              <>
                <KeyLevelRow label="Support"    value={fmtPrice(support,    instrument.slug)} valueColor="#00C896" />
                <KeyLevelRow label="Resistance" value={fmtPrice(resistance, instrument.slug)} valueColor="#F87171" />
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
            borderRight: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-4"
            style={{ color: "rgba(255,255,255,0.22)" }}>
            Technical Signals · 4H
          </p>

          {/* Signal badge grid */}
          <div
            className="flex flex-col overflow-hidden rounded-lg"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <SignalRow
              name="RSI (14)"
              value={rsiVal !== null ? rsiVal.toFixed(1) : "—"}
              signal={rsiSig}
              loading={techLoading}
            />
            <SignalRow
              name="MACD"
              value={macdSig === "BUY" ? "Bull Cross" : macdSig === "SELL" ? "Bear Cross" : "Neutral"}
              signal={macdSig}
              loading={techLoading}
            />
            <SignalRow
              name="Bollinger"
              value={extra.loading ? "—" : bbLabel(extra, livePrice ?? null)}
              signal={bbSig}
              loading={extra.loading}
            />
            <SignalRow
              name="Stochastic"
              value={extra.stochK !== null ? `K: ${extra.stochK.toFixed(1)}` : "—"}
              signal={stochSig}
              loading={extra.loading}
            />
            <SignalRow
              name="CCI (20)"
              value={extra.cci !== null ? extra.cci.toFixed(1) : "—"}
              signal={cciSig}
              loading={extra.loading}
            />
            <SignalRow
              name="Volume"
              value={td?.volumePct != null ? `${td.volumePct}% avg` : "—"}
              signal={volSig}
              loading={priceLoading}
            />
          </div>

          {/* Summary line */}
          <p className="text-[10px] font-mono text-right mt-2.5"
            style={{ color: signalsLoading ? "rgba(255,255,255,0.2)" : summaryColor }}>
            {signalsLoading ? "Computing signals…" : summaryText}
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
              style={{ color: "rgba(255,255,255,0.22)" }}>
              Active Session
            </p>
            <span
              className="inline-block text-[11px] font-bold font-mono tracking-wider px-3 py-1 rounded-full mb-2"
              style={{
                background: `${session.color}18`,
                color: session.color,
                border: `1px solid ${session.color}30`,
              }}
            >
              {session.name}
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono"
              style={{ color: "rgba(255,255,255,0.28)" }}>
              <span>Open {session.openUTC} UTC</span>
              <span>Close {session.closeUTC} UTC</span>
            </div>
            <p className="text-[10px] font-mono mt-1" style={{ color: "rgba(255,255,255,0.18)" }}>
              Next: {session.nextName} · {session.nextOpenUTC} UTC
            </p>
          </div>

          {/* Separator */}
          <div className="mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* Volatility */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.22)" }}>
                Volatility
              </p>
              <span className="text-[10px] font-bold font-mono" style={{ color: volColor }}>
                {volLabel}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${volBarW}%`, background: volColor }}
              />
            </div>
            {atr && livePrice ? (
              <p className="text-[9px] font-mono mt-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                ATR {fmtN(atr, 3)} · {atrPct?.toFixed(2)}% of price
              </p>
            ) : (
              <Skel className="h-2.5 w-28 mt-1.5" />
            )}
          </div>

          {/* Separator */}
          <div className="mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* Economic Events */}
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-3"
              style={{ color: "rgba(255,255,255,0.22)" }}>
              Upcoming Events
            </p>

            {cal.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5"
                  style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <Skel className="w-2 h-2 rounded-full shrink-0" />
                  <Skel className="h-2.5 flex-1" />
                  <Skel className="h-2.5 w-10" />
                </div>
              ))
            ) : cal.events.length === 0 ? (
              <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                No events in next 7 days
              </p>
            ) : (
              cal.events.map((evt, i) => {
                const impactColor =
                  evt.impact === "high"   ? "#F87171" :
                  evt.impact === "medium" ? "#FBBF24" :
                  "rgba(255,255,255,0.28)";
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 py-2.5"
                    style={{
                      borderBottom: i < cal.events.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1"
                      style={{ background: impactColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-tight truncate"
                        style={{ color: "rgba(255,255,255,0.62)" }}>
                        {evt.event}
                      </p>
                      <p className="text-[9px] font-mono mt-0.5"
                        style={{ color: "rgba(255,255,255,0.28)" }}>
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
