"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Lock,
  Zap,
  Activity,
  BarChart3,
  Cpu,
  Coins,
  Archive,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";

// ── Mock signal cards for hero ────────────────────────────────────────────────
const MOCK_SIGNALS = [
  { instrument: "SPX500", timeframe: "4H", bias: "BULLISH" as const, dcs: 81, catalyst: "FOMC Minutes", age: "12m ago" },
  { instrument: "USD/JPY", timeframe: "1D", bias: "BEARISH" as const, dcs: 85, catalyst: "BoJ Policy", age: "38m ago" },
  { instrument: "SOL/USD", timeframe: "4H", bias: "BEARISH" as const, dcs: 84, catalyst: "On-Chain Outflow", age: "2h ago" },
];

// ── AI model config ───────────────────────────────────────────────────────────
const AI_MODELS = [
  {
    key: "claude",
    name: "Claude Sonnet",
    provider: "Anthropic",
    dotColor: "bg-orange-400",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    weight: "40%",
    tagline: "Multi-step reasoning and risk context.",
    description:
      "Strongest at unpacking the why behind every signal in plain language. Claude explains the structural logic, key invalidation level, and probability reasoning in clear prose — not just a direction.",
  },
  {
    key: "gpt4",
    name: "GPT-4o",
    provider: "OpenAI",
    dotColor: "bg-teal-400",
    textColor: "text-teal-600",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50",
    weight: "35%",
    tagline: "Pattern synthesis across large data sets.",
    description:
      "Surfaces multi-timeframe confluence from TAAPI indicators, Autochartist patterns, and Trading Central data. Produces structured entry/exit analysis with explicit R:R validation.",
  },
  {
    key: "grok",
    name: "Grok Beta",
    provider: "xAI",
    dotColor: "bg-fuchsia-400",
    textColor: "text-fuchsia-600",
    borderColor: "border-fuchsia-200",
    bgColor: "bg-fuchsia-50",
    weight: "25%",
    tagline: "Real-time X/Twitter sentiment layer.",
    description:
      "Flags when social narrative diverges from price structure — a high-value contrarian signal. When retail is overwhelmingly one-sided, Grok spots it before it shows up in price.",
  },
];

// ── Consensus process steps ───────────────────────────────────────────────────
const PROCESS_STEPS = [
  {
    num: "01",
    title: "Data bundle assembly",
    body: "Every 60 seconds: current price + OHLCV, TAAPI indicator values (RSI, MACD, EMAs, ATR), Autochartist active patterns, Finnhub news sentiment, and for crypto — Glassnode MVRV + CoinGlass funding rate + Santiment social volume.",
  },
  {
    num: "02",
    title: "Parallel AI dispatch",
    body: "The same bundle hits Claude, GPT-4o, and Grok simultaneously with a structured prompt. Each returns: direction, conviction (1–10), key reasons, invalidation level, one-sentence rationale.",
  },
  {
    num: "03",
    title: "Consensus scoring",
    body: "The server weights the three responses (Claude 40% / GPT-4o 35% / Grok 25%) to compute the DCS from 0–100. When all three agree with high conviction, DCS exceeds 75.",
  },
  {
    num: "04",
    title: "Display & alerts",
    body: "DCS scores, individual AI opinions, and the underlying data render on the signal page in real time. High-DCS signals trigger push notifications. Every signal links to supporting educational material.",
  },
];

// ── Feature tiles ─────────────────────────────────────────────────────────────
const FEATURE_TILES = [
  {
    icon: Zap,
    title: "Live Signal Feed",
    body: "Autochartist + Trading Central signals auto-populate in real time. Filterable by asset class, timeframe, and conviction level.",
    locked: false,
  },
  {
    icon: Cpu,
    title: "AI Consensus Panel",
    body: "Claude, GPT-4o, and Grok opinions in parallel columns. Colour-coded agreement. Expandable full reasoning. The most visually distinctive section on any UK trading platform.",
    locked: false,
  },
  {
    icon: BarChart3,
    title: "Technical Confluence Grid",
    body: "TAAPI indicators across M15 / 1H / 4H / 1D for every pair. RSI, MACD, 20 EMA, ATR, Bollinger squeeze — all in one scannable heatmap. Updates every 60 seconds.",
    locked: false,
  },
  {
    icon: Coins,
    title: "Crypto Intelligence Hub",
    body: "CoinGecko price + dominance → Glassnode on-chain → CryptoQuant funding rates → Santiment social/whale divergence → CoinGlass open interest. One Crypto DCS per major pair.",
    locked: false,
  },
  {
    icon: Archive,
    title: "Signal Archive & Performance",
    body: "Every signal logged with DCS score, model breakdown, and outcome. Win rate and R:R stats displayed. Full transparency — something most signal providers won't show.",
    locked: false,
  },
  {
    icon: ShieldCheck,
    title: "Acuity Expert Ideas",
    body: "Human analyst trade ideas from Acuity Research (FCA-regulated). Entry, exit, rationale, and chart visual. Machines spotted it, humans confirmed it.",
    locked: true,
    tierBadge: "Edge / Floor",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is this financial advice?",
    a: "No. Signal Centre provides technical analysis, AI-generated pattern recognition, and market intelligence for educational purposes. All content is clearly labelled as analysis, not advice. Trade with appropriate risk management.",
  },
  {
    q: "What markets does it cover?",
    a: "Forex (major + minor pairs), Indices (SPX, NAS, DAX, FTSE), Metals (Gold, Silver), and Crypto (BTC, ETH, SOL and more). New instruments are added regularly.",
  },
  {
    q: "How are the DCS scores calculated?",
    a: "The Drawdown Consensus Score aggregates responses from Claude, GPT-4o, and Grok — each analysing the same live data bundle. Claude is weighted 40%, GPT-4o 35%, Grok 25%, based on back-tested signal accuracy. The score runs from 0–100; signals above 75 DCS are considered high-conviction.",
  },
  {
    q: "Can I access Signal Centre if I already have a Drawdown subscription?",
    a: "Yes — Foundation, Edge, and Floor plans all include Signal Centre access (with Edge and Floor unlocking additional features like Acuity Expert Ideas). The standalone Signal Centre plan is for traders who want signal intelligence without the full curriculum.",
  },
  {
    q: "What happens after the 7-day trial?",
    a: "You'll be charged £39/mo unless you cancel before the trial ends. No card is required to start — you enter payment details at the end of the trial.",
  },
];

// ── Heatmap mock data ─────────────────────────────────────────────────────────
const HEATMAP_TFS = ["15M", "1H", "4H", "1D"];
const HEATMAP_INDS = ["RSI", "MACD", "Stoch", "EMA", "BBands", "CCI"];
const HEATMAP_DATA: Record<string, string[]> = {
  "15M": ["BEAR", "BEAR", "BEAR", "NEUT", "BEAR", "BEAR"],
  "1H":  ["BEAR", "BEAR", "NEUT", "BEAR", "BEAR", "BEAR"],
  "4H":  ["BEAR", "BEAR", "BEAR", "BEAR", "BEAR", "NEUT"],
  "1D":  ["BEAR", "BEAR", "BEAR", "BEAR", "NEUT", "BEAR"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function DcsDial({ value, isBullish }: { value: number; isBullish: boolean }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} className="stroke-border-slate/30 fill-none" strokeWidth="5" />
        <circle
          cx="35" cy="35" r={r}
          className={cn("fill-none transition-all", isBullish ? "stroke-profit" : "stroke-red-500")}
          strokeWidth="5"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-text-primary">
        {value}%
      </div>
    </div>
  );
}

function HeatCell({ val }: { val: string }) {
  return (
    <td className="py-2.5 text-center px-1">
      <span className={cn(
        "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider font-mono",
        val === "BULL"
          ? "bg-profit/10 border-profit/30 text-profit"
          : val === "BEAR"
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-background-elevated/60 border-border-slate/40 text-text-tertiary"
      )}>
        {val}
      </span>
    </td>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function SignalCentreMarketingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-background-primary text-text-primary">

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pb-20 pt-32 overflow-hidden border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* LEFT: Copy */}
            <div className="lg:col-span-5 space-y-8">
              {/* Eyebrow */}
              <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block">
                // Signal Centre — drawdown.trading
              </span>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-[1.06] text-text-primary">
                Three AI models.<br />
                One consensus.<br />
                <span className="text-accent">Every signal explained.</span>
              </h1>

              {/* Sub */}
              <p className="text-base text-text-secondary leading-relaxed max-w-md font-sans">
                The Signal Centre runs Claude (Anthropic), GPT-4o (OpenAI), and Grok (xAI)
                simultaneously against live market data — and shows you exactly where they agree,
                where they don't, and why. No black box. No mystery entry. Just institutional-grade
                signal intelligence, built for serious traders.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup?tier=signal-centre"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-mkt-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors font-sans"
                >
                  Start 7-Day Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-border-slate/50 text-text-secondary text-sm font-medium hover:border-border-slate hover:text-text-primary transition-colors font-sans"
                >
                  See how it works ↓
                </button>
              </div>

              {/* Trust line */}
              <p className="text-[11px] font-mono text-text-tertiary tracking-wider">
                £39/mo after trial · Cancel anytime · No card required during trial
              </p>
            </div>

            {/* RIGHT: Mock signal cards */}
            <div className="lg:col-span-7 space-y-3">
              {/* Live badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-profit/30 bg-profit/5 text-[10px] font-mono font-bold uppercase tracking-widest text-profit">
                  <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                  Live Scan Active
                </span>
                <span className="text-[9px] font-mono text-text-tertiary">
                  3 signals matched · <span className="text-profit">AI consensus running</span>
                </span>
              </div>

              {MOCK_SIGNALS.map((sig) => {
                const isBull = sig.bias === "BULLISH";
                return (
                  <div
                    key={sig.instrument}
                    className="group relative bg-background-surface/40 border border-border-slate/50 rounded-2xl p-5 flex items-center gap-5 hover:border-border-slate hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                  >
                    {/* Bias bar */}
                    <div className={cn(
                      "absolute top-0 left-0 w-0.5 h-full rounded-l-2xl",
                      isBull ? "bg-profit" : "bg-red-400"
                    )} />

                    <DcsDial value={sig.dcs} isBullish={isBull} />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base font-mono font-black uppercase text-text-primary">
                          {sig.instrument}
                        </span>
                        <span className="text-[9px] font-mono bg-background-elevated/60 border border-border-slate/40 text-text-tertiary px-2 py-0.5 rounded-md">
                          {sig.timeframe}
                        </span>
                        <span className={cn(
                          "text-[9px] font-mono font-bold px-2 py-0.5 border rounded-md uppercase",
                          isBull
                            ? "bg-profit/10 border-profit/30 text-profit"
                            : "bg-red-50 border-red-200 text-red-600"
                        )}>
                          {sig.bias}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-text-tertiary">
                        Catalyst: <span className="text-text-secondary">{sig.catalyst}</span>
                        <span className="mx-2">·</span>
                        <Clock className="w-3 h-3 inline mr-0.5 -mt-0.5 text-text-tertiary" />{sig.age}
                      </p>
                    </div>

                    {/* AI alignment dots */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-0.5">AI Consensus</span>
                      <div className="flex gap-1">
                        {["bg-orange-400", "bg-teal-400", "bg-fuchsia-400"].map((dot, i) => (
                          <span key={i} className={cn("w-2 h-2 rounded-full", dot)} />
                        ))}
                      </div>
                      <span className={cn(
                        "text-[9px] font-mono font-black",
                        sig.dcs >= 80 ? "text-accent" : "text-text-secondary"
                      )}>
                        DCS {sig.dcs}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — THE DIFFERENTIATOR
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6 border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
            // The Edge
          </span>

          <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-6 max-w-2xl">
            No other UK platform does this.
          </h2>

          <p className="text-base text-text-secondary leading-relaxed max-w-2xl mb-16 font-sans">
            Three frontier AI models analyse the same live market data simultaneously. Each has a different
            personality, different training weighting, and different data sources. Their outputs are scored,
            weighted, and shown side-by-side as a proprietary Drawdown Consensus Score (DCS) — from 0 to 100.
            When all three agree with high conviction, DCS is high. That's the signal you act on.
          </p>

          {/* Three model cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {AI_MODELS.map((m) => (
              <div key={m.key} className={cn(
                "border rounded-2xl p-6 space-y-4 bg-background-surface/40 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300",
                m.borderColor, m.bgColor
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", m.dotColor)} />
                  <span className={cn("text-sm font-mono font-bold", m.textColor)}>{m.name}</span>
                  <span className="text-[9px] font-mono text-text-tertiary ml-auto uppercase">{m.provider}</span>
                </div>
                <div>
                  <p className={cn("text-xs font-semibold mb-2 font-sans", m.textColor)}>{m.tagline}</p>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">{m.description}</p>
                </div>
                <div className={cn("flex items-center justify-between pt-2 border-t", m.borderColor)}>
                  <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Consensus Weight</span>
                  <span className={cn("text-xs font-mono font-black", m.textColor)}>{m.weight}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 4-step process */}
          <div className="border border-border-slate/50 rounded-2xl p-8 bg-background-surface/40 backdrop-blur-sm">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary mb-8">
              How the consensus engine works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="space-y-3">
                  <span className="text-3xl font-mono font-black text-accent/30">{step.num}</span>
                  <h4 className="text-sm font-semibold text-text-primary font-sans leading-snug">{step.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — FEATURE TILES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
            // Live Signal Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-16 max-w-xl">
            Everything you need.<br />Nothing you don't.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.title}
                  className="relative bg-background-surface/40 border border-border-slate/50 rounded-2xl p-6 space-y-4 hover:border-border-slate hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                >
                  {tile.locked && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-text-tertiary bg-background-elevated/60 border border-border-slate/40 px-1.5 py-0.5 rounded">
                        {tile.tierBadge}
                      </span>
                      <Lock className="w-3 h-3 text-text-tertiary" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-2 font-sans", tile.locked ? "text-text-tertiary" : "text-text-primary")}>
                      {tile.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">{tile.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — SIGNAL DETAIL SHOWCASE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
            // Inside a Signal
          </span>
          <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-4">
            Every signal. Fully dissected.
          </h2>
          <p className="text-base text-text-secondary mb-14 font-sans max-w-xl">
            Click any signal in the feed and this is what you get. A complete institutional-grade breakdown,
            from chart to consensus to macro context.
          </p>

          {/* Header bar */}
          <div className="bg-background-surface/40 border border-border-slate/50 rounded-2xl overflow-hidden mb-5 backdrop-blur-sm">
            <div className="h-0.5 bg-red-400 w-full" />
            <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-mono font-black uppercase text-text-primary">USD/JPY</span>
                  <span className="text-[10px] font-mono bg-background-elevated/60 border border-border-slate/40 text-text-tertiary px-2.5 py-0.5 rounded-lg">1D INTERV</span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 border rounded-lg uppercase bg-red-50 border-red-200 text-red-600">BEARISH</span>
                </div>
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                  Scan: 24 Jun 2026 · Expires: 25 Jun 2026
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* TC Badge */}
                <div className="bg-premium/5 border border-premium/20 rounded-xl p-3 px-4 text-right font-mono">
                  <p className="text-[8px] text-premium/60 uppercase tracking-widest leading-none">Trading Central</p>
                  <h4 className="text-sm font-black text-premium mt-1">82%</h4>
                  <span className="text-[9px] font-bold text-red-600">BEARISH View</span>
                </div>

                {/* DCS */}
                <div className="flex items-center gap-3 bg-background-elevated/40 border border-border-slate/50 rounded-xl p-3 pr-5">
                  <DcsDial value={87} isBullish={false} />
                  <div>
                    <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Consensus Score</p>
                    <h4 className="text-xs font-mono font-bold text-red-600 mt-1 uppercase">High-Conv. Sell</h4>
                    <p className="text-[8px] font-mono text-text-tertiary">Weighted multi-model</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two-col grid: Chart + Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
            {/* Chart placeholder */}
            <div className="lg:col-span-7 bg-background-surface/40 border border-border-slate/50 rounded-2xl overflow-hidden backdrop-blur-sm" style={{ height: 320 }}>
              <div className="px-5 py-3 border-b border-border-slate/50 flex items-center justify-between bg-background-elevated/30">
                <span className="text-xs font-mono font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-premium" /> TradingView Live Chart
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">FX:USDJPY</span>
              </div>
              <div className="flex-1 flex items-center justify-center h-[272px]">
                <div className="text-center space-y-3">
                  <Activity className="w-12 h-12 text-border-slate mx-auto" />
                  <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">Live Chart — Dashboard Only</p>
                  <Link href="/signup?tier=signal-centre" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mkt-ink text-white text-xs font-bold font-mono hover:bg-neutral-800 transition-colors">
                    Start Free Trial →
                  </Link>
                </div>
              </div>
            </div>

            {/* Setup Parameters */}
            <div className="lg:col-span-5 bg-background-surface/40 border border-border-slate/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="px-5 py-3.5 border-b border-border-slate/50 bg-background-elevated/30 flex items-center justify-between">
                <h3 className="text-xs font-mono font-black text-text-primary uppercase tracking-wider">Setup Parameters</h3>
                <span className="text-[9px] font-mono bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded-lg font-bold uppercase">BEARISH</span>
              </div>
              <div className="p-5 space-y-3.5 font-mono text-xs">
                {[
                  { label: "Entry Zone", value: "157.84", color: "text-text-primary", size: "text-xl font-black" },
                  { label: "Stop Loss", value: "159.20", color: "text-red-600", size: "text-xl font-black" },
                  { label: "Risk / Reward", value: "1 : 2.8", color: "text-text-primary", size: "text-sm font-bold" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between border-b border-border-slate/40 pb-3">
                    <span className="text-text-tertiary text-[9px] uppercase tracking-widest">{row.label}</span>
                    <span className={cn(row.size, row.color)}>{row.value}</span>
                  </div>
                ))}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary text-[9px] uppercase tracking-widest">Target 1</span>
                    <span className="text-profit font-semibold">155.10</span>
                  </div>
                  <div className="flex justify-between bg-profit/5 border border-profit/20 rounded-lg p-2">
                    <span className="text-profit font-bold text-[9px] uppercase">Target 2 (Primary)</span>
                    <span className="text-profit font-black">152.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary text-[9px] uppercase tracking-widest">Target 3</span>
                    <span className="text-profit font-semibold">149.80</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom callouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {[
              {
                title: "Autochartist Patterns",
                items: [
                  { name: "Bearish Pennant Breakout", prob: 84, dir: "BEAR" },
                  { name: "Head and Shoulders", prob: 79, dir: "BEAR" },
                ],
              },
              {
                title: "Expected Ranges",
                content: (
                  <div className="space-y-2 text-xs font-mono">
                    <p className="text-[9px] text-text-tertiary uppercase tracking-wider">Autochartist Volatility (Daily)</p>
                    <div className="h-1.5 bg-gradient-to-r from-profit/20 via-border-slate/30 to-red-200 rounded-full relative">
                      <div className="absolute w-3 h-3 rounded-full bg-red-400 border-2 border-white shadow" style={{ left: "62%", top: "-3px" }} />
                    </div>
                    <div className="flex justify-between text-[8px] text-text-tertiary">
                      <span>Low: 155.20</span>
                      <span className="text-text-secondary font-bold">Entry</span>
                      <span>High: 159.80</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-2">
                      {[["R1 (0.382)", "158.90"], ["R2 (0.618)", "159.50"], ["S1 (0.382)", "156.10"], ["S2 (0.618)", "155.30"]].map(([l, v]) => (
                        <div key={l} className="bg-background-elevated/40 border border-border-slate/40 rounded p-1.5 text-[9px]">
                          <span className="text-text-tertiary block">{l}</span>
                          <span className="text-text-secondary font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                title: "Macro Intelligence",
                content: (
                  <div className="space-y-2 text-xs font-mono">
                    {[
                      { label: "US Fed Funds Rate", value: "5.25%", color: "text-red-600" },
                      { label: "BoJ Rate", value: "0.10%", color: "text-profit" },
                      { label: "US 10-Year Bond", value: "4.24%", color: "text-text-secondary" },
                      { label: "TC Consensus", value: "82 / 100", color: "text-premium" },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-1 border-b border-border-slate/30">
                        <span className="text-text-tertiary text-[9px]">{row.label}</span>
                        <span className={cn("font-bold text-[9px]", row.color)}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((col) => (
              <div key={col.title} className="bg-background-surface/40 border border-border-slate/50 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
                <h4 className="text-xs font-mono font-black text-text-primary uppercase tracking-wider pb-2 border-b border-border-slate/40">
                  {col.title}
                </h4>
                {col.items ? (
                  <div className="space-y-3">
                    {col.items.map((pat) => (
                      <div key={pat.name} className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="text-[10px] font-mono font-bold text-text-primary">{pat.name}</h5>
                          <span className="text-[8px] font-mono font-bold bg-red-100 border border-red-200 text-red-600 px-1.5 py-0.5 rounded">{pat.dir}</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-mono text-text-tertiary">
                            <span>Probability</span><span className="font-bold text-text-secondary">{pat.prob}%</span>
                          </div>
                          <div className="h-1 bg-border-slate/30 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 rounded-full" style={{ width: `${pat.prob}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : col.content}
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="bg-background-surface/40 border border-border-slate/50 rounded-2xl p-6 mb-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border-slate/40 pb-3">
              <h4 className="text-xs font-mono font-black text-text-primary uppercase tracking-wider">Technical Confluence Grid</h4>
              <span className="text-[10px] font-mono text-text-tertiary">Live Multi-Timeframe Heatmap</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-slate/40 text-text-tertiary">
                    <th className="pb-3 text-left font-semibold uppercase tracking-wider text-[9px]">TF</th>
                    {HEATMAP_INDS.map(ind => (
                      <th key={ind} className="pb-3 text-center font-semibold uppercase tracking-wider text-[9px] px-1">{ind}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-slate/30">
                  {HEATMAP_TFS.map(tf => (
                    <tr key={tf} className="hover:bg-background-elevated/30 transition-colors">
                      <td className="py-2.5 font-bold text-text-secondary uppercase text-[10px]">{tf}</td>
                      {HEATMAP_DATA[tf].map((val, i) => <HeatCell key={i} val={val} />)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Consensus Panel */}
          <div className="bg-background-surface/40 border border-border-slate/50 rounded-2xl p-6 mb-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5 border-b border-border-slate/40 pb-3">
              <h4 className="text-xs font-mono font-black text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-premium" /> AI Consensus Panel
              </h4>
              <span className="text-[10px] font-mono text-text-tertiary">Parallel Frontier Model Sentiments</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AI_MODELS.map((m) => (
                <div key={m.key} className={cn("border rounded-xl overflow-hidden", m.bgColor, m.borderColor)}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs font-mono font-bold flex items-center gap-1.5", m.textColor)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", m.dotColor)} /> {m.name}
                      </span>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase">{m.provider}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-red-600">BEARISH</span>
                      <span className={cn("text-[11px] font-mono font-semibold", m.textColor)}>
                        {m.key === "claude" ? "89" : m.key === "gpt4" ? "85" : "82"}% Conviction
                      </span>
                    </div>
                    <div className="h-1.5 bg-border-slate/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: m.key === "claude" ? "89%" : m.key === "gpt4" ? "85%" : "82%" }} />
                    </div>
                    <ul className="space-y-1.5 pt-2 border-t border-border-slate/30 text-[10px] font-mono text-text-secondary">
                      {m.key === "claude" && (
                        <><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> BoJ rate divergence confirms structural downtrend.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> Stop placement beyond ATR support level is valid.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> USD positioning remains elevated — watch FOMC tone.</li></>
                      )}
                      {m.key === "gpt4" && (
                        <><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> 4H and 1D momentum both aligned bearish.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> Head and shoulders pattern probability: 79%.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> Target 2 R:R of 2.8 is statistically robust.</li></>
                      )}
                      {m.key === "grok" && (
                        <><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> Retail positioning 76% long USD/JPY — contrarian signal.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> Social volume spike with divergent price action.</li><li className="flex gap-1.5"><span className={cn("shrink-0", m.textColor)}>·</span> X/Twitter sentiment at 3-week bearish extreme.</li></>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[11px] font-mono text-text-tertiary uppercase tracking-widest">
            This is what every signal looks like inside the Signal Centre.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — PRICING CALLOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 border-b border-border-slate/50">
        <div className="max-w-2xl mx-auto">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5 text-center">
            // Signal Centre Subscription
          </span>

          <div className="bg-background-surface/40 border border-border-slate/50 rounded-2xl overflow-hidden backdrop-blur-sm" style={{ borderLeftWidth: 4, borderLeftColor: "var(--color-accent, #C8F135)" }}>
            <div className="p-8 space-y-8">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-6xl font-sans font-extrabold tracking-tight text-text-primary">£39</span>
                  <span className="text-sm text-text-tertiary font-sans">/month</span>
                </div>
                <p className="text-xs font-mono text-text-tertiary">7-day free trial · Cancel anytime</p>
              </div>

              {/* CTA */}
              <Link
                href="/signup?tier=signal-centre"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-mkt-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors font-sans"
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Features */}
              <div className="space-y-3 border-t border-border-slate/50 pt-6">
                <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-4">What's included</p>
                {[
                  { text: "Live Signal Feed (Forex, Indices, Metals, Crypto)", included: true },
                  { text: "AI Consensus Panel — Claude + GPT-4o + Grok", included: true },
                  { text: "Technical Confluence Grid (M15 to D1)", included: true },
                  { text: "Crypto Intelligence Hub", included: true },
                  { text: "Signal Archive & Performance Tracker", included: true },
                  { text: "Push notifications for high-DCS signals", included: true },
                  { text: "Full signal detail pages with live charts", included: true },
                  { text: "Acuity Expert Ideas", included: false, note: "Edge / Floor tier" },
                  { text: "Raw data export + API webhooks", included: false, note: "Floor tier" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {item.included ? (
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-profit" />
                    ) : (
                      <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-text-tertiary font-mono">◎</span>
                    )}
                    <span className={cn("text-xs font-sans leading-relaxed flex-1", item.included ? "text-text-secondary" : "text-text-tertiary")}>
                      {item.text}
                    </span>
                    {item.note && (
                      <span className="text-[8px] font-mono text-text-tertiary border border-border-slate/40 bg-background-elevated/40 px-1.5 py-0.5 rounded shrink-0">{item.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-text-tertiary font-sans mt-6">
            Already a Foundation, Edge, or Floor member?{" "}
            <span className="text-text-secondary font-semibold">Signal Centre is included in your plan.</span>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 border-b border-border-slate/50">
        <div className="max-w-2xl mx-auto">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-5">
            // Questions
          </span>
          <h2 className="text-4xl font-sans font-extrabold tracking-tight text-text-primary mb-12">
            Common questions.
          </h2>

          <div className="space-y-0 divide-y divide-border-slate/50">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <span className={cn("text-sm font-semibold font-sans leading-snug transition-colors", isOpen ? "text-text-primary" : "text-text-secondary hover:text-text-primary")}>
                      {faq.q}
                    </span>
                    <span className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                      isOpen ? "border-accent bg-accent/10" : "border-border-slate/50"
                    )}>
                      {isOpen ? (
                        <ChevronUp className="w-3 h-3 text-accent" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-text-tertiary" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pb-5 text-sm text-text-secondary leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
            Stop guessing.<br />
            <span className="text-accent">Start reading consensus.</span>
          </h2>
          <p className="text-base text-text-secondary font-sans leading-relaxed">
            Three AI models. Live market data. One score that tells you when the setup is real.
          </p>
          <Link
            href="/signup?tier=signal-centre"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-mkt-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors font-sans shadow-xl shadow-accent/10"
          >
            Start Your Free Trial — £39/mo <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs font-mono text-text-tertiary tracking-wider">
            No card required · Cancel before day 8 to pay nothing
          </p>
        </div>
      </section>

    </div>
  );
}
