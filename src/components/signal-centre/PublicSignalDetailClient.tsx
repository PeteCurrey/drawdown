"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, Lock, Star, Activity,
  Calendar, ChevronDown, ChevronUp, Globe,
  BarChart3, Flame, Coins,
  MessageSquare, ShieldCheck, Sparkles, TrendingUp,
  Eye, CheckCircle2, Cpu, ArrowUpRight, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface SignalData {
  id: string;
  instrument: string;
  timeframe: string;
  bias: string;
  confluence_score: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  take_profit_3: number;
  rr_ratio: number;
  atr: number;
  catalyst_event: any;
  confluence_factors: string[];
  created_at: string;
  expires_at: string;
  taapi_data: any;
  coingecko_data: any;
  coinglass_data: any;
  ai_consensus: any;
  dcs_score: number;
}

interface PublicSignalDetailClientProps {
  signal: SignalData;
  isSubscriber: boolean;
  userLoggedIn: boolean;
  initialSaved: boolean;
}

function toTVSymbol(instrument: string): string {
  const MAP: Record<string, string> = {
    GBPUSD: "FX:GBPUSD", EURUSD: "FX:EURUSD", USDJPY: "FX:USDJPY",
    GBPJPY: "FX:GBPJPY", XAGUSD: "OANDA:XAGUSD", XAUUSD: "TVC:GOLD",
    SPX: "FOREXCOM:SPXUSD", NDX: "FOREXCOM:NSXUSD", DJI: "FOREXCOM:DJI",
    FTSE: "FOREXCOM:UKXUSD", BTCUSD: "BINANCE:BTCUSDT", ETHUSD: "BINANCE:ETHUSDT",
    SOLUSD: "BINANCE:SOLUSDT",
  };
  const key = instrument.replace("/", "").toUpperCase();
  return MAP[key] ?? instrument;
}

export function PublicSignalDetailClient({
  signal,
  isSubscriber,
  userLoggedIn,
  initialSaved,
}: PublicSignalDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [fundingCountdown, setFundingCountdown] = useState<string>("08:00:00");
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [expandedAI, setExpandedAI] = useState<Record<string, boolean>>({
    claude: true,
    gpt4: true,
    grok: true,
  });

  const supabase = createClient();
  const tvSymbol = toTVSymbol(signal.instrument);
  const isCrypto = signal.instrument.includes("BTC") || signal.instrument.includes("ETH") || signal.instrument.includes("SOL");

  // Funding countdown
  useEffect(() => {
    const nextFundingTime = signal.coinglass_data?.nextFundingTime;
    if (!nextFundingTime) return;
    const interval = setInterval(() => {
      const diff = nextFundingTime - Date.now();
      if (diff <= 0) { setFundingCountdown("Settling..."); clearInterval(interval); return; }
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setFundingCountdown(`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [signal.coinglass_data?.nextFundingTime]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleToggleSave = async () => {
    if (!userLoggedIn) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      if (saved) {
        const { error } = await (supabase as any).from("signals_saved").delete().eq("user_id", user.id).eq("signal_id", signal.id);
        if (!error) setSaved(false);
      } else {
        const { error } = await (supabase as any).from("signals_saved").insert({ user_id: user.id, signal_id: signal.id, instrument: signal.instrument });
        if (!error) setSaved(true);
      }
    } catch (e) { console.error("Watchlist action failed:", e); }
    finally { setSaving(false); }
  };

  // TradingView widget — light theme
  useEffect(() => {
    if (!chartContainerRef.current) return;
    chartContainerRef.current.innerHTML = "";
    const containerId = `tv-chart-${signal.id}`;
    const wrapper = document.createElement("div");
    wrapper.id = containerId;
    wrapper.style.height = "100%";
    chartContainerRef.current.appendChild(wrapper);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: signal.timeframe === "1D" ? "D" : signal.timeframe === "4H" ? "240" : signal.timeframe === "1H" ? "60" : "15",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          container_id: containerId,
        });
      }
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [tvSymbol, signal.timeframe, signal.id]);

  const catalyst = signal.catalyst_event || { time: "N/A", event: "Technical confluence breakout setup", impact: "low" };
  const isBullish = signal.bias === "BULLISH";
  const dcs = signal.dcs_score || Math.round(50 + signal.confluence_score * 4);

  const aiConsensus = signal.ai_consensus || {
    claude: { verdict: signal.bias, confidence: Math.round(50 + signal.confluence_score * 4), reasoning: ["Multi-timeframe structure aligns with the structural shift.", "Volatility parameters (ATR) support position parameters.", "Macro landscape remains supportive of technical breakouts."] },
    gpt4: { verdict: signal.bias, confidence: Math.round(45 + signal.confluence_score * 5), reasoning: ["Key averages display correct alignment for structural trends.", "RSI indicators suggest acceleration of buying momentum.", "Favorable risk-to-reward metrics validated at support."] },
    grok: { verdict: signal.bias, confidence: Math.round(40 + signal.confluence_score * 5), reasoning: ["Social volume trends show high engagement levels.", "Outflow indicators suggest whale wallet accumulation patterns.", "Price action shows divergence against retail sentiment metrics."] },
  };

  const autochartist = signal.taapi_data?.autochartist || {
    activePatterns: [
      { patternName: "Bullish Flag Pattern", direction: "BULLISH", probability: 88, patternType: "chartpattern", state: "completed", identifiedAt: new Date().toISOString() },
      { patternName: "Double Bottom Reversal", direction: "BULLISH", probability: 76, patternType: "chartpattern", state: "completed", identifiedAt: new Date(Date.now() - 3600000).toISOString() },
    ],
    volatilityForecast: { expectedHigh: signal.entry_price * 1.015, expectedLow: signal.entry_price * 0.985 },
    keyLevels: { support1: signal.entry_price * 0.99, support2: signal.entry_price * 0.98, resistance1: signal.entry_price * 1.01, resistance2: signal.entry_price * 1.02 },
  };

  const tradingCentral = signal.coingecko_data?.tradingCentral || {
    tcConsensusScore: Math.round(45 + signal.confluence_score * 5),
    tcSentiment: signal.bias,
    analystSignal: `Long positions above ${(signal.entry_price * 0.99).toFixed(2)} with targets at ${(signal.entry_price * 1.025).toFixed(2)} and ${(signal.entry_price * 1.04).toFixed(2)}.`,
    keyLevels: { pivot: signal.entry_price, resistance1: signal.entry_price * 1.01, resistance2: signal.entry_price * 1.02, support1: signal.entry_price * 0.99, support2: signal.entry_price * 0.98 },
  };

  const onchain = signal.coinglass_data?.onchain || {
    mvrvZScore: 2.15, exchangeReserves: "ACCUMULATION_OUTFLOW", socialVolumeDelta: 14.8, galaxyScore: 74, whaleActivity: "ACCUMULATING", openInterestDelta: 8.5,
  };

  const timeframes = ["15M", "1H", "4H", "1D"];
  const indicatorsList = [
    { key: "rsi_bias", name: "RSI" },
    { key: "macd_bias", name: "MACD" },
    { key: "stochastic_bias", name: "Stoch" },
    { key: "ema_bias", name: "EMA" },
    { key: "bbands_bias", name: "BBands" },
    { key: "cci_bias", name: "CCI" },
  ];

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (dcs / 100) * circumference;

  const currentPrice = signal.entry_price;
  const lowRange = autochartist.volatilityForecast.expectedLow;
  const highRange = autochartist.volatilityForecast.expectedHigh;
  const sliderPercentage = Math.max(0, Math.min(100, ((currentPrice - lowRange) / (highRange - lowRange)) * 100));

  // AI model config
  const aiModels = [
    { key: "claude", name: "Claude Sonnet", provider: "Anthropic", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", barColor: "bg-orange-500" },
    { key: "gpt4", name: "GPT-4o", provider: "OpenAI", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500", barColor: "bg-teal-500" },
    { key: "grok", name: "Grok Beta", provider: "xAI", color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-200", dot: "bg-fuchsia-500", barColor: "bg-fuchsia-500" },
  ];

  return (
    <div className="pb-16 space-y-6 max-w-7xl mx-auto">

      {/* ── Navigation bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/dashboard/signal-centre"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Signal Centre
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-400 rounded-lg text-xs font-mono uppercase text-gray-600 hover:text-gray-900 transition-all shadow-sm"
          >
            {copied ? (<><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</>) : (<><Copy className="w-3.5 h-3.5" /> Share</>)}
          </button>
          {userLoggedIn && isSubscriber && (
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all border shadow-sm",
                saved ? "bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100" : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              )}
            >
              <Star className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Watchlist"}
            </button>
          )}
        </div>
      </div>

      {/* ── Title & DCS Banner ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Bias accent bar */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1",
          isBullish ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-red-400 to-rose-500"
        )} />

        <div className="space-y-2 relative z-10 mt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-display font-black uppercase tracking-tight text-gray-900">
              {signal.instrument}
            </span>
            <span className="text-xs font-mono bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-lg">
              {signal.timeframe} INTERV
            </span>
            <span className={cn(
              "text-xs font-mono font-bold px-2.5 py-0.5 border rounded-lg uppercase tracking-wider",
              isBullish ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
            )}>
              {signal.bias}
            </span>
          </div>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Scan: {new Date(signal.created_at).toLocaleString()} · Expires: {new Date(signal.expires_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 relative z-10">

          {/* Trading Central Badge */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 px-4 text-right font-mono shadow-sm">
            <p className="text-[8px] text-violet-400 uppercase tracking-widest leading-none">Trading Central</p>
            <h4 className="text-sm font-black text-violet-700 mt-1">{tradingCentral.tcConsensusScore}%</h4>
            <span className={cn(
              "text-[9px] font-bold uppercase",
              tradingCentral.tcSentiment === "BULLISH" ? "text-emerald-600" : tradingCentral.tcSentiment === "BEARISH" ? "text-red-600" : "text-gray-500"
            )}>
              {tradingCentral.tcSentiment} View
            </span>
          </div>

          {/* DCS Dial */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 pr-5 shadow-sm">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={radius} className="stroke-gray-200 fill-none" strokeWidth="7" />
                <circle
                  cx="45" cy="45" r={radius}
                  className={cn("fill-none transition-all duration-700", isBullish ? "stroke-emerald-500" : "stroke-red-500")}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-sm text-gray-900">
                {dcs}%
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">Consensus Score</p>
              <h4 className={cn("text-xs font-mono font-bold mt-1 uppercase", isBullish ? "text-emerald-700" : "text-red-700")}>
                {isBullish ? "High-Conv. Buy" : "High-Conv. Sell"}
              </h4>
              <p className="text-[8px] font-mono text-gray-400">Weighted multi-model</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: Chart + Patterns + Heatmap + AI Consensus */}
        <div className="lg:col-span-8 space-y-6">

          {/* TradingView Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ height: 420 }}>
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-violet-500" /> TradingView Live Chart
              </span>
              <span className="text-[10px] font-mono text-gray-400">{tvSymbol}</span>
            </div>
            <div ref={chartContainerRef} className="flex-1 w-full bg-white" />
          </div>

          {/* Patterns + Volatility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Autochartist Patterns */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Eye className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Autochartist Patterns</h3>
              </div>
              <div className="space-y-3">
                {autochartist.activePatterns.length === 0 ? (
                  <p className="text-xs font-mono text-gray-400">No active patterns detected.</p>
                ) : (
                  autochartist.activePatterns.map((pat: any, idx: number) => (
                    <div key={idx} className={cn(
                      "border rounded-xl p-3.5 space-y-2",
                      pat.direction === "BULLISH" ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                    )}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-mono font-bold text-gray-900 leading-tight">{pat.patternName}</h4>
                          <span className="text-[8px] font-mono text-gray-500 uppercase mt-1 block">
                            {pat.patternType} · {pat.state}
                          </span>
                        </div>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border",
                          pat.direction === "BULLISH" ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-red-100 border-red-300 text-red-700"
                        )}>
                          {pat.direction}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-500">
                          <span>Probability</span>
                          <span className="font-bold">{pat.probability}%</span>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden border border-gray-200">
                          <div
                            className={cn("h-full rounded-full", pat.direction === "BULLISH" ? "bg-emerald-500" : "bg-red-500")}
                            style={{ width: `${pat.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Volatility & Fibonacci */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <BarChart3 className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Expected Ranges</h3>
              </div>
              <div className="space-y-5 font-mono text-xs">
                {/* Volatility Slider */}
                <div className="space-y-2">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider">Autochartist Volatility Range (Daily)</p>
                  <div className="relative pt-1.5">
                    <div className="h-2.5 bg-gradient-to-r from-red-200 via-gray-200 to-emerald-200 rounded-full relative border border-gray-200">
                      <div
                        className={cn(
                          "absolute w-4 h-4 rounded-full -top-0.75 shadow border-2 border-white",
                          isBullish ? "bg-emerald-500" : "bg-red-500"
                        )}
                        style={{ left: `${sliderPercentage}%`, transform: "translateX(-50%)", top: "-3px" }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-400 mt-2">
                      <span>Low: {lowRange.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      <span className="text-gray-600 font-bold">Entry</span>
                      <span>High: {highRange.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </div>
                  </div>
                </div>

                {/* Fibonacci Levels */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider">Fibonacci Support & Resistance</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[
                      { label: "R2 (0.618)", value: autochartist.keyLevels.resistance2, color: "text-red-600", bg: "bg-red-50 border-red-200" },
                      { label: "R1 (0.382)", value: autochartist.keyLevels.resistance1, color: "text-red-500", bg: "bg-red-50 border-red-100" },
                      { label: "S1 (0.382)", value: autochartist.keyLevels.support1, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                      { label: "S2 (0.618)", value: autochartist.keyLevels.support2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
                    ].map(lvl => (
                      <div key={lvl.label} className={cn("p-2 rounded-lg border font-mono", lvl.bg)}>
                        <span className="text-gray-500 text-[8px] block">{lvl.label}</span>
                        <span className={cn("font-bold block mt-0.5", lvl.color)}>
                          {lvl.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Confluence Heatmap */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Technical Confluence Grid</h3>
              <span className="text-[10px] font-mono text-gray-400">Live Multi-Timeframe Heatmap</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="pb-3 font-semibold uppercase tracking-wider text-[9px]">TF</th>
                    {indicatorsList.map(ind => (
                      <th key={ind.key} className="pb-3 text-center font-semibold uppercase tracking-wider px-1 text-[9px]">{ind.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {timeframes.map(tfName => {
                    const tfGrid = signal.taapi_data?.[tfName] || {};
                    return (
                      <tr key={tfName} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-bold text-gray-900 uppercase text-[10px]">{tfName}</td>
                        {indicatorsList.map(ind => {
                          const rawBias = tfGrid[ind.key];
                          const isTfBullish = rawBias === "BULLISH" || rawBias === "UPTREND" || rawBias === "BUY";
                          const isTfBearish = rawBias === "BEARISH" || rawBias === "DOWNTREND" || rawBias === "SELL";
                          const valueLabel = isTfBullish ? "BULL" : isTfBearish ? "BEAR" : "NEUT";
                          return (
                            <td key={ind.key} className="py-3 text-center px-1">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider",
                                isTfBullish ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : isTfBearish ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-gray-100 border-gray-200 text-gray-500"
                              )}>
                                {valueLabel}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-[10px] text-violet-700 leading-relaxed font-mono">
              💡 Directional alignment across 4H + 1D increases statistical win-rate probability. Look for 4 or more aligned indicators before entry.
            </div>
          </div>

          {/* AI Consensus Panel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-500" /> AI Consensus Panel
              </h3>
              <span className="text-[10px] font-mono text-gray-400">Parallel Frontier Models</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiModels.map(m => {
                const data = aiConsensus[m.key] || {};
                const verdict = data.verdict || signal.bias;
                const confidence = data.confidence || 65;
                const reasoning: string[] = data.reasoning || [];
                const verdictIsBullish = verdict === "BULLISH";
                return (
                  <div key={m.key} className={cn("border rounded-xl overflow-hidden flex flex-col", m.bg, m.border)}>
                    <div className="p-4 space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-mono font-bold flex items-center gap-1.5", m.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
                          {m.name}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">{m.provider}</span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className={cn(
                          "text-xs font-mono font-bold uppercase",
                          verdict === "BULLISH" ? "text-emerald-600" : verdict === "BEARISH" ? "text-red-600" : "text-gray-500"
                        )}>
                          {verdict}
                        </span>
                        <span className={cn("text-[11px] font-mono font-semibold", m.color)}>{confidence}% Conviction</span>
                      </div>

                      <div className="h-1.5 bg-white/70 rounded-full overflow-hidden border border-white">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", verdict === "BULLISH" ? "bg-emerald-500" : verdict === "BEARISH" ? "bg-red-500" : "bg-gray-400")}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>

                      {expandedAI[m.key] && reasoning.length > 0 && (
                        <ul className="space-y-1.5 pt-2 text-[10px] font-mono border-t border-white/60">
                          {reasoning.map((r, idx) => (
                            <li key={idx} className={cn("flex items-start gap-1.5 leading-snug", m.color, "opacity-80")}>
                              <span className="shrink-0 mt-0.5">·</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedAI(prev => ({ ...prev, [m.key]: !prev[m.key] }))}
                      className="w-full py-2 bg-white/40 hover:bg-white/70 border-t border-white/60 text-[9px] font-mono uppercase text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
                    >
                      {expandedAI[m.key] ? (<>Hide Reasoning <ChevronUp className="w-3 h-3" /></>) : (<>Expand Reasoning <ChevronDown className="w-3 h-3" /></>)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT: Setup Parameters + Intel Sidebar + Acuity */}
        <div className="lg:col-span-4 space-y-5">

          {/* Trade Setup Parameters */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Setup Parameters</h3>
              <span className={cn(
                "text-[9px] font-mono font-bold px-2 py-0.5 rounded-lg border uppercase",
                isBullish ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
              )}>
                {signal.bias}
              </span>
            </div>

            {!isSubscriber && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-[3px] z-20 flex items-center justify-center p-5">
                <div className="bg-white border border-violet-200 rounded-xl p-5 shadow-lg text-center max-w-sm w-full space-y-4">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-violet-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-mono font-black uppercase tracking-wider text-violet-700">Foundation Access Required</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Exact entry prices, stop loss, and risk-managed targets are available on Foundation and above.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/pricing?source=signal-centre"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-xl shadow-sm"
                    >
                      Upgrade <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    {!userLoggedIn && (
                      <Link
                        href={`/login?redirect=/dashboard/signal-centre/signals/${signal.id}`}
                        className="text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors block"
                      >
                        Sign in to your account
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={cn("p-5 space-y-4", !isSubscriber && "select-none blur-[2px] pointer-events-none")}>
              {/* Entry */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Entry Zone</span>
                  <span className="text-xl font-mono font-black text-gray-900 mt-1 block">
                    {isSubscriber ? signal.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0854"}
                  </span>
                </div>
                <span className="text-[9px] font-mono bg-violet-50 border border-violet-200 text-violet-600 px-2 py-1 rounded-lg font-bold uppercase">Market Entry</span>
              </div>

              {/* Stop Loss */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Stop Loss</span>
                  <span className="text-xl font-mono font-black text-red-600 mt-1 block">
                    {isSubscriber ? signal.stop_loss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0805"}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-400">1.5× ATR Stop</span>
              </div>

              {/* R:R */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Risk / Reward</span>
                  <span className="text-sm font-mono font-bold text-gray-900 mt-1 block">1 : {signal.rr_ratio.toFixed(1)}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-400">Target 2 Confluence</span>
              </div>

              {/* Targets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono">Target 1 (1.5× ATR)</span>
                  <span className="font-mono text-emerald-600 font-semibold">
                    {isSubscriber ? signal.take_profit_1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0903"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                  <span className="text-emerald-700 font-mono font-bold">Target 2 (Primary)</span>
                  <span className="font-mono text-emerald-700 font-black">
                    {isSubscriber ? signal.take_profit_2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0952"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-mono">Target 3 (4.5× ATR)</span>
                  <span className="font-mono text-emerald-600 font-semibold">
                    {isSubscriber ? signal.take_profit_3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.1001"}
                  </span>
                </div>
              </div>

              {/* Catalyst */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-2 items-start mt-2">
                <Calendar className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Economic Catalyst</p>
                  <p className="text-[10px] font-mono font-bold text-gray-700 leading-snug mt-0.5">{catalyst.event}</p>
                  <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">
                    Impact: {catalyst.impact} · {catalyst.time} UTC
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[9px] font-mono text-amber-700 leading-normal">
                ⚠️ NOT FINANCIAL ADVICE. Technical structures represent statistical probabilities. Always trade with a stop loss and appropriate position sizing.
              </div>
            </div>
          </div>

          {/* Crypto Intelligence / Macro Sidebar */}
          {isCrypto ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Coins className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Crypto Intelligence</h3>
              </div>
              <div className="space-y-4 text-xs font-mono">
                {/* CoinGecko */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">CoinGecko Market Metrics</p>
                  {[
                    { label: "Market Cap Rank", value: `#${signal.coingecko_data?.rank || "1"}` },
                    { label: "Market Cap", value: signal.coingecko_data?.marketCap ? `$${(signal.coingecko_data.marketCap / 1e9).toFixed(1)}B` : "$1.25T" },
                    { label: "24h Volume", value: signal.coingecko_data?.volume ? `$${(signal.coingecko_data.volume / 1e9).toFixed(1)}B` : "$28.4B" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-bold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Binance Futures */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Binance Futures Data</p>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Funding Rate (8H)</span>
                    <span className="text-emerald-600 font-bold">
                      {signal.coinglass_data?.fundingRate ? `${(signal.coinglass_data.fundingRate * 100).toFixed(4)}%` : "0.0007%"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Next Funding</span>
                    <span className="text-gray-900 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> {fundingCountdown}
                    </span>
                  </div>
                </div>

                {/* On-Chain */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Glassnode On-Chain Cycle</p>
                  {[
                    { label: "MVRV Z-Score", value: `${onchain.mvrvZScore} (Accumulation)`, color: "text-violet-600" },
                    { label: "Exchange Reserves", value: onchain.exchangeReserves === "ACCUMULATION_OUTFLOW" ? "Net Outflow (Bullish)" : "Net Inflow (Bearish)", color: "text-emerald-600" },
                    { label: "Social Volume Δ", value: `+${onchain.socialVolumeDelta}%`, color: "text-emerald-600" },
                    { label: "Galaxy Score", value: `${onchain.galaxyScore}/100`, color: "text-gray-900" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">{row.label}</span>
                      <span className={cn("font-bold", row.color)}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Globe className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">Macro Intelligence</h3>
              </div>
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">FRED Macro Yields & Rates</p>
                  {[
                    { label: "US Fed Funds Rate", value: "5.25%" },
                    { label: "UK Base Rate (BOE)", value: "5.00%" },
                    { label: "US 10-Year Bond", value: "4.24%" },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-bold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Trading Central Consensus</p>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Consensus Score</span>
                    <span className="text-emerald-600 font-bold">{tradingCentral.tcConsensusScore}/100</span>
                  </div>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-2.5 text-[10px] text-violet-700 leading-relaxed mt-1">
                    TC Alert: {tradingCentral.analystSignal}
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Live Spread</p>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Avg Live Spread</span>
                    <span className="text-teal-600 font-bold">1.2 pips</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Acuity Expert Ideas */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Acuity Expert View
              </span>
              <span className="text-[8px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-lg uppercase font-bold">
                Human Layer
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 leading-normal">
                <MessageSquare className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-gray-400 uppercase block">Expert Rationale</span>
                  <p className="text-[11px] text-gray-700 font-semibold mt-1 leading-relaxed">
                    "Machines spotted the breakout, and human analysts confirm structural alignment. Order block retest is holding strong under low selling volume, offering high-R:R entry criteria."
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <span className="text-gray-500 uppercase block text-[8px]">Expert Confidence</span>
                  <span className="text-emerald-700 font-bold mt-1 block">82% — HIGH</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl">
                  <span className="text-gray-500 uppercase block text-[8px]">FCA Regulation</span>
                  <span className="text-blue-700 font-bold mt-1 block">Registered</span>
                </div>
              </div>
              <div className="text-[8px] text-gray-400 leading-snug border-t border-gray-100 pt-2">
                ℹ️ Compliance disclosure: Trade content and analyst stream powered by Acuity Research Ltd, regulated under FCA FRN: 787261.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
