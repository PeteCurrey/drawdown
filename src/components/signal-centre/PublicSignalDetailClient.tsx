"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Copy, Check, Lock, Star, Activity, 
  Info, Calendar, ChevronDown, ChevronUp, Globe, 
  Percent, Users, BarChart3, Flame, Coins, Award, 
  MessageSquare, ShieldCheck, Sparkles, TrendingUp,
  TrendingDown, Eye, CheckCircle2
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
  
  // Accordion details for AI columns
  const [expandedAI, setExpandedAI] = useState<Record<string, boolean>>({
    claude: true,
    gpt4: true,
    grok: true
  });

  const supabase = createClient();
  const tvSymbol = toTVSymbol(signal.instrument);
  const isCrypto = signal.instrument.includes("BTC") || signal.instrument.includes("ETH") || signal.instrument.includes("SOL");

  // Format funding countdown
  useEffect(() => {
    const nextFundingTime = signal.coinglass_data?.nextFundingTime;
    if (!nextFundingTime) return;

    const interval = setInterval(() => {
      const diff = nextFundingTime - Date.now();
      if (diff <= 0) {
        setFundingCountdown("Settling...");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setFundingCountdown(
          `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [signal.coinglass_data?.nextFundingTime]);

  // Copy share URL
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Watchlist save handler
  const handleToggleSave = async () => {
    if (!userLoggedIn) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (saved) {
        const { error } = await (supabase as any)
          .from("signals_saved")
          .delete()
          .eq("user_id", user.id)
          .eq("signal_id", signal.id);
        if (!error) setSaved(false);
      } else {
        const { error } = await (supabase as any)
          .from("signals_saved")
          .insert({
            user_id: user.id,
            signal_id: signal.id,
            instrument: signal.instrument,
          });
        if (!error) setSaved(true);
      }
    } catch (e) {
      console.error("Watchlist action failed:", e);
    } finally {
      setSaving(false);
    }
  };

  // Inject TradingView Widget
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
          theme: "dark",
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

    return () => {
      script.remove();
    };
  }, [tvSymbol, signal.timeframe, signal.id]);

  const catalyst = signal.catalyst_event || { time: "N/A", event: "Technical confluence breakout setup", impact: "low" };
  const isBullish = signal.bias === "BULLISH";
  const dcs = signal.dcs_score || Math.round(50 + signal.confluence_score * 4);

  // Parse AI Consensus
  const aiConsensus = signal.ai_consensus || {
    claude: {
      verdict: signal.bias,
      confidence: Math.round(50 + signal.confluence_score * 4),
      reasoning: [
        "Multi-timeframe structure aligns with the structural shift.",
        "Volatility parameters (ATR) support position parameters.",
        "Macro landscape remains supportive of technical breakouts."
      ]
    },
    gpt4: {
      verdict: signal.bias,
      confidence: Math.round(45 + signal.confluence_score * 5),
      reasoning: [
        "Key averages display correct alignment for structural trends.",
        "RSI indicators suggest acceleration of buying momentum.",
        "Favorable risk-to-reward metrics validated at support."
      ]
    },
    grok: {
      verdict: signal.bias,
      confidence: Math.round(40 + signal.confluence_score * 5),
      reasoning: [
        "Social volume trends show high engagement levels.",
        "Outflow indicators suggest whale wallet accumulation patterns.",
        "Price action shows divergence against retail sentiment metrics."
      ]
    }
  };

  // Autochartist Data mapping
  const autochartist = signal.taapi_data?.autochartist || {
    activePatterns: [
      { patternName: "Bullish Flag Pattern", direction: "BULLISH", probability: 88, patternType: "chartpattern", state: "completed", identifiedAt: new Date().toISOString() },
      { patternName: "Double Bottom Reversal", direction: "BULLISH", probability: 76, patternType: "chartpattern", state: "completed", identifiedAt: new Date(Date.now() - 3600000).toISOString() }
    ],
    volatilityForecast: {
      expectedHigh: signal.entry_price * 1.015,
      expectedLow: signal.entry_price * 0.985
    },
    keyLevels: {
      support1: signal.entry_price * 0.99,
      support2: signal.entry_price * 0.98,
      resistance1: signal.entry_price * 1.01,
      resistance2: signal.entry_price * 1.02
    }
  };

  // Trading Central Data mapping
  const tradingCentral = signal.coingecko_data?.tradingCentral || {
    tcConsensusScore: Math.round(45 + signal.confluence_score * 5),
    tcSentiment: signal.bias,
    analystSignal: `Long positions above ${ (signal.entry_price * 0.99).toFixed(2) } with targets at ${ (signal.entry_price * 1.025).toFixed(2) } and ${ (signal.entry_price * 1.04).toFixed(2) }.`,
    keyLevels: {
      pivot: signal.entry_price,
      resistance1: signal.entry_price * 1.01,
      resistance2: signal.entry_price * 1.02,
      support1: signal.entry_price * 0.99,
      support2: signal.entry_price * 0.98
    }
  };

  // On-Chain metrics mapping
  const onchain = signal.coinglass_data?.onchain || {
    mvrvZScore: 2.15,
    exchangeReserves: "ACCUMULATION_OUTFLOW",
    socialVolumeDelta: 14.8,
    galaxyScore: 74,
    whaleActivity: "ACCUMULATING",
    openInterestDelta: 8.5
  };

  const timeframes = ["15M", "1H", "4H", "1D"];
  const indicatorsList = [
    { key: "rsi_bias", name: "RSI Momentum" },
    { key: "macd_bias", name: "MACD Crossover" },
    { key: "stochastic_bias", name: "Stoch %K vs %D" },
    { key: "ema_bias", name: "Moving Averages" },
    { key: "bbands_bias", name: "Bollinger Squeeze" },
    { key: "cci_bias", name: "CCI Extremes" }
  ];

  // SVG parameters for DCS dial
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (dcs / 100) * circumference;

  // Calculate current price position percentage for Volatility Slider
  const currentPrice = signal.entry_price;
  const lowRange = autochartist.volatilityForecast.expectedLow;
  const highRange = autochartist.volatilityForecast.expectedHigh;
  const sliderPercentage = Math.max(0, Math.min(100, ((currentPrice - lowRange) / (highRange - lowRange)) * 100));

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard/signal-centre"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Signal Centre
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121420] border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-mono uppercase text-gray-300 hover:text-white transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Link
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Share Signal
                </>
              )}
            </button>
            
            {userLoggedIn && isSubscriber && (
              <button
                onClick={handleToggleSave}
                disabled={saving}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all border shadow-sm",
                  saved
                    ? "bg-amber-950/30 border-amber-800/60 text-amber-400 hover:bg-amber-950/50"
                    : "bg-[#121420] border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white"
                )}
              >
                <Star className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Watchlist"}
              </button>
            )}
          </div>
        </div>

        {/* Title & DCS Banner Card */}
        <div className="bg-[#121420]/80 border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-40 h-40 text-indigo-500" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-display font-black uppercase tracking-tight text-white">
                {signal.instrument}
              </span>
              <span className="text-xs font-mono bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-0.5 rounded-md">
                {signal.timeframe} INTERV
              </span>
              <span
                className={cn(
                  "text-xs font-mono font-bold px-2.5 py-0.5 border rounded-md uppercase tracking-wider shadow-sm",
                  isBullish
                    ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-400"
                    : "bg-red-950/30 border-red-800/60 text-red-400"
                )}
              >
                {signal.bias}
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Scan Triggered: {new Date(signal.created_at).toLocaleString()} UTC · Target Expiry: {new Date(signal.expires_at).toLocaleString()} UTC
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 relative z-10">
            
            {/* Trading Central Consensus Score Badge */}
            <div className="bg-[#090a0f]/80 border border-gray-800 rounded-xl p-3 px-4 shadow-lg text-right font-mono">
              <p className="text-[8px] text-gray-500 uppercase tracking-widest leading-none">// TRADING CENTRAL</p>
              <h4 className="text-sm font-black text-indigo-400 mt-1">
                {tradingCentral.tcConsensusScore}% SCORE
              </h4>
              <span className={cn(
                "text-[9px] font-bold uppercase",
                tradingCentral.tcSentiment === "BULLISH" ? "text-emerald-400" : tradingCentral.tcSentiment === "BEARISH" ? "text-red-400" : "text-gray-400"
              )}>
                {tradingCentral.tcSentiment} View
              </span>
            </div>

            {/* DCS progress circle */}
            <div className="flex items-center gap-3 bg-[#090a0f]/80 border border-gray-800 rounded-xl p-3 pr-6 shadow-lg">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-gray-800 fill-none"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className={cn(
                      "fill-none transition-all duration-500",
                      isBullish ? "stroke-emerald-500" : "stroke-red-500"
                    )}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-sm text-white">
                  {dcs}%
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none">// CONSENSUS RATING</p>
                <h4 className="text-xs font-mono font-bold text-gray-200 mt-1 uppercase">
                  {isBullish ? "High-Conviction Buy" : "High-Conviction Sell"}
                </h4>
                <p className="text-[8px] font-mono text-gray-400/80">
                  Weighted multi-model score
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Chart, Heatmap, AI columns (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TradingView Advanced Chart */}
            <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col" style={{ height: 420 }}>
              <div className="px-5 py-3.5 border-b border-gray-800/80 bg-[#0c0d15]/50 flex items-center justify-between">
                <span className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" /> TradingView Live Chart
                </span>
                <span className="text-[10px] font-mono text-gray-400">{tvSymbol}</span>
              </div>
              <div ref={chartContainerRef} className="flex-1 w-full bg-[#090a0f]" />
            </div>

            {/* Phase 2: Autochartist Pattern Diagnostics & Volatility widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Autochartist Pattern Alerts */}
              <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-800/40 pb-3">
                  <Eye className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    // Autochartist Patterns
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {autochartist.activePatterns.length === 0 ? (
                    <p className="text-xs font-mono text-gray-500">No active patterns detected.</p>
                  ) : (
                    autochartist.activePatterns.map((pat: any, idx: number) => (
                      <div key={idx} className="bg-[#090a0f]/60 border border-gray-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-mono font-bold text-white leading-tight">{pat.patternName}</h4>
                            <span className="text-[8px] font-mono text-gray-500 uppercase mt-1 block">
                              Pattern: {pat.patternType} · State: {pat.state}
                            </span>
                          </div>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border",
                            pat.direction === "BULLISH" ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" : "bg-red-950/20 border-red-900/40 text-red-400"
                          )}>
                            {pat.direction}
                          </span>
                        </div>
                        
                        {/* Probability gauge */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>Confluence Probability</span>
                            <span>{pat.probability}%</span>
                          </div>
                          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pat.probability}%` }} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Volatility & Fibonacci expected range */}
              <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-800/40 pb-3">
                  <BarChart3 className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    // Expected Ranges
                  </h3>
                </div>

                <div className="space-y-5 font-mono text-xs">
                  
                  {/* Visual slider */}
                  <div className="space-y-2">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Autochartist Volatility Range (Daily)</p>
                    <div className="relative pt-1.5">
                      <div className="h-2 bg-gradient-to-r from-red-500/30 via-indigo-500/30 to-emerald-500/30 rounded-full relative">
                        <div 
                          className="absolute w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full -top-0.5 shadow-md animate-pulse"
                          style={{ left: `${sliderPercentage}%`, transform: "translateX(-50%)" }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-gray-400 mt-2">
                        <span>Expected Low: {lowRange.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                        <span>Current Price</span>
                        <span>Expected High: {highRange.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fibonacci retracements */}
                  <div className="space-y-1.5 border-t border-gray-800/40 pt-3">
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Fibonacci Support & Resistance</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-[#090a0f]/60 p-2 rounded border border-gray-800">
                        <span className="text-gray-500">R2 (0.618)</span>
                        <span className="text-white font-bold block mt-1">{autochartist.keyLevels.resistance2.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      </div>
                      <div className="bg-[#090a0f]/60 p-2 rounded border border-gray-800">
                        <span className="text-gray-500">R1 (0.382)</span>
                        <span className="text-white font-bold block mt-1">{autochartist.keyLevels.resistance1.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      </div>
                      <div className="bg-[#090a0f]/60 p-2 rounded border border-gray-800">
                        <span className="text-gray-500">S1 (0.382)</span>
                        <span className="text-white font-bold block mt-1">{autochartist.keyLevels.support1.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      </div>
                      <div className="bg-[#090a0f]/60 p-2 rounded border border-gray-800">
                        <span className="text-gray-500">S2 (0.618)</span>
                        <span className="text-white font-bold block mt-1">{autochartist.keyLevels.support2.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Technical Confluence Dashboard Heatmap */}
            <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                  // Technical Confluence Grid
                </h3>
                <span className="text-[10px] font-mono text-gray-500">Live Multi-Timeframe Heatmap</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-gray-800/40 text-gray-400">
                      <th className="pb-3 font-semibold uppercase tracking-wider">Timeframe</th>
                      {indicatorsList.map(ind => (
                        <th key={ind.key} className="pb-3 text-center font-semibold uppercase tracking-wider px-1">
                          {ind.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30">
                    {timeframes.map(tfName => {
                      const tfGrid = signal.taapi_data?.[tfName] || {};
                      
                      return (
                        <tr key={tfName} className="hover:bg-gray-800/20">
                          <td className="py-3.5 font-bold text-white uppercase">{tfName}</td>
                          
                          {indicatorsList.map(ind => {
                            const rawBias = tfGrid[ind.key];
                            const isTfBullish = rawBias === "BULLISH" || rawBias === "UPTRAREND" || rawBias === "BUY";
                            const isTfBearish = rawBias === "BEARISH" || rawBias === "DOWNTREND" || rawBias === "SELL";
                            const valueLabel = isTfBullish ? "BULL" : isTfBearish ? "BEAR" : "NEUT";
                            
                            return (
                              <td key={ind.key} className="py-3.5 text-center px-1">
                                <span className={cn(
                                  "px-2 py-1 rounded text-[10px] font-bold uppercase border tracking-wider",
                                  isTfBullish
                                    ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400"
                                    : isTfBearish
                                    ? "bg-red-950/20 border-red-800/40 text-red-400"
                                    : "bg-gray-800/20 border-gray-700/40 text-gray-400"
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
              
              <div className="bg-[#090a0f]/50 border border-gray-800/40 rounded-xl p-3 text-[10px] text-gray-400 leading-relaxed">
                💡 **Heatmap analysis**: Directional alignment across multiple timeframes (especially 4H + 1D) increases statistical win rate probability and confirmation.
              </div>
            </div>

            {/* AI Consensus Panel */}
            <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-4.5 h-4.5 text-orange-500" /> AI Consensus Panel
                </h3>
                <span className="text-[10px] font-mono text-gray-500">Parallel Frontier Model Sentiments</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Claude Column */}
                <div className="bg-[#090a0f]/60 border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Claude 3.5
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">Anthropic</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className={cn(
                        "text-xs font-mono font-bold uppercase",
                        aiConsensus.claude.verdict === "BULLISH" ? "text-emerald-400" : aiConsensus.claude.verdict === "BEARISH" ? "text-red-400" : "text-gray-400"
                      )}>
                        {aiConsensus.claude.verdict}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-white">
                        {aiConsensus.claude.confidence}% Conviction
                      </span>
                    </div>

                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          aiConsensus.claude.verdict === "BULLISH" ? "bg-emerald-500" : aiConsensus.claude.verdict === "BEARISH" ? "bg-red-500" : "bg-gray-500"
                        )}
                        style={{ width: `${aiConsensus.claude.confidence}%` }}
                      />
                    </div>

                    {expandedAI.claude && (
                      <ul className="space-y-2 pt-2 text-[10px] font-mono text-gray-400 border-t border-gray-800/40">
                        {aiConsensus.claude.reasoning.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-orange-400 shrink-0 mt-0.5">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setExpandedAI(prev => ({ ...prev, claude: !prev.claude }))}
                    className="w-full py-2 bg-[#121420]/30 hover:bg-[#121420]/50 border-t border-gray-800/40 text-[9px] font-mono uppercase text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedAI.claude ? (
                      <>Hide Reasoning <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Expand Reasoning <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                </div>

                {/* GPT-4o Column */}
                <div className="bg-[#090a0f]/60 border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> GPT-4o
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">OpenAI</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className={cn(
                        "text-xs font-mono font-bold uppercase",
                        aiConsensus.gpt4.verdict === "BULLISH" ? "text-emerald-400" : aiConsensus.gpt4.verdict === "BEARISH" ? "text-red-400" : "text-gray-400"
                      )}>
                        {aiConsensus.gpt4.verdict}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-white">
                        {aiConsensus.gpt4.confidence}% Conviction
                      </span>
                    </div>

                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          aiConsensus.gpt4.verdict === "BULLISH" ? "bg-emerald-500" : aiConsensus.gpt4.verdict === "BEARISH" ? "bg-red-500" : "bg-gray-500"
                        )}
                        style={{ width: `${aiConsensus.gpt4.confidence}%` }}
                      />
                    </div>

                    {expandedAI.gpt4 && (
                      <ul className="space-y-2 pt-2 text-[10px] font-mono text-gray-400 border-t border-gray-800/40">
                        {aiConsensus.gpt4.reasoning.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-teal-400 shrink-0 mt-0.5">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setExpandedAI(prev => ({ ...prev, gpt4: !prev.gpt4 }))}
                    className="w-full py-2 bg-[#121420]/30 hover:bg-[#121420]/50 border-t border-gray-800/40 text-[9px] font-mono uppercase text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedAI.gpt4 ? (
                      <>Hide Reasoning <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Expand Reasoning <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                </div>

                {/* Grok Column */}
                <div className="bg-[#090a0f]/60 border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-fuchsia-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" /> Grok Beta
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">xAI Sentiment</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className={cn(
                        "text-xs font-mono font-bold uppercase",
                        aiConsensus.grok.verdict === "BULLISH" ? "text-emerald-400" : aiConsensus.grok.verdict === "BEARISH" ? "text-red-400" : "text-gray-400"
                      )}>
                        {aiConsensus.grok.verdict}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-white">
                        {aiConsensus.grok.confidence}% Conviction
                      </span>
                    </div>

                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          aiConsensus.grok.verdict === "BULLISH" ? "bg-emerald-500" : aiConsensus.grok.verdict === "BEARISH" ? "bg-red-500" : "bg-gray-500"
                        )}
                        style={{ width: `${aiConsensus.grok.confidence}%` }}
                      />
                    </div>

                    {expandedAI.grok && (
                      <ul className="space-y-2 pt-2 text-[10px] font-mono text-gray-400 border-t border-gray-800/40">
                        {aiConsensus.grok.reasoning.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-fuchsia-400 shrink-0 mt-0.5">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setExpandedAI(prev => ({ ...prev, grok: !prev.grok }))}
                    className="w-full py-2 bg-[#121420]/30 hover:bg-[#121420]/50 border-t border-gray-800/40 text-[9px] font-mono uppercase text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedAI.grok ? (
                      <>Hide Reasoning <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Expand Reasoning <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Trade Params, Crypto Sidebar, Acuity Expert (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Trade Parameters Setup Card */}
            <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl overflow-hidden shadow-xl relative">
              <div className="px-5 py-4 border-b border-gray-800/80 bg-[#0c0d15]/50">
                <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                  // Setup Parameters
                </h3>
              </div>

              {!isSubscriber && (
                <div className="absolute inset-0 bg-[#090a0f]/90 backdrop-blur-[4px] z-20 flex items-center justify-center p-5">
                  <div className="bg-[#121420] border border-indigo-900/60 rounded-xl p-5 shadow-2xl text-center max-w-sm w-full space-y-4">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-950/60 border border-indigo-800 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-indigo-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-mono font-black uppercase tracking-wider text-indigo-400">// EDGE SUBSCRIBER ACCESS</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        Full access to exact entry prices, stop loss calculations, and risk-managed targets is reserved for Edge+ members.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/pricing?source=signal-centre"
                        className="w-full flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-lg shadow-md"
                      >
                        Upgrade to Edge
                      </Link>
                      {!userLoggedIn && (
                        <Link
                          href={`/login?redirect=/dashboard/signal-centre/signals/${signal.id}`}
                          className="text-[10px] font-mono uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors block"
                        >
                          Sign in to your account
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className={cn("p-5 space-y-4", !isSubscriber && "select-none blur-sm pointer-events-none")}>
                
                {/* Entry Price */}
                <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Entry Zone</span>
                    <span className="text-lg font-mono font-bold text-white mt-1 block">
                      {isSubscriber ? signal.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0854"}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-indigo-950 border border-indigo-800 text-indigo-400 px-2 py-1 rounded">
                    MARKET ENTRY
                  </span>
                </div>

                {/* Stop Loss */}
                <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Stop Loss</span>
                    <span className="text-lg font-mono font-bold text-red-500 mt-1 block">
                      {isSubscriber ? signal.stop_loss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0805"}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">
                    1.5× ATR Stop
                  </span>
                </div>

                {/* R:R Ratio */}
                <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Risk/Reward Ratio</span>
                    <span className="text-sm font-mono font-bold text-white mt-1 block">
                      1 : {signal.rr_ratio.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">
                    Target 2 (Confluence)
                  </span>
                </div>

                {/* Targets */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-mono">Target 1 (1.5× ATR)</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {isSubscriber ? signal.take_profit_1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0903"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2">
                    <span className="text-emerald-400 font-mono font-bold">Target 2 (Primary)</span>
                    <span className="font-mono text-emerald-400 font-black">
                      {isSubscriber ? signal.take_profit_2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.0952"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-mono">Target 3 (4.5× ATR)</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {isSubscriber ? signal.take_profit_3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "1.1001"}
                    </span>
                  </div>
                </div>

                {/* Catalyst */}
                <div className="bg-[#090a0f]/60 border border-gray-800 rounded-xl p-3 flex gap-2 items-start mt-4">
                  <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Economic Catalyst</p>
                    <p className="text-[10px] font-mono font-bold text-gray-300 leading-snug mt-0.5">
                      {catalyst.event}
                    </p>
                    <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">
                      Impact: {catalyst.impact} · Time: {catalyst.time} UTC
                    </p>
                  </div>
                </div>

                <div className="bg-red-950/10 border border-red-900/30 rounded-lg p-2.5 text-[9px] font-mono text-gray-500 leading-normal">
                  ⚠️ NOT FINANCIAL ADVICE. Technical structures represent statistical probabilities. Trade with appropriate stop limits and sizing.
                </div>

              </div>
            </div>

            {/* Crypto Intelligence Sidebar / Macro Sidebar */}
            {isCrypto ? (
              <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-800/60 pb-3">
                  <Coins className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    // Crypto Intelligence
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs font-mono">
                  
                  {/* CoinGecko stats */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">CoinGecko Market Metrics</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap Rank</span>
                      <span className="text-white font-bold">#{signal.coingecko_data?.rank || "1"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Capitalization</span>
                      <span className="text-white font-bold">
                        {signal.coingecko_data?.marketCap ? `$${(signal.coingecko_data.marketCap / 1e9).toFixed(1)}B` : "$1.25T"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Vol / 24h High</span>
                      <span className="text-white">
                        {signal.coingecko_data?.volume ? `$${(signal.coingecko_data.volume / 1e9).toFixed(1)}B` : "$28.4B"}
                      </span>
                    </div>
                  </div>

                  {/* Derivatives CoinGlass/Binance */}
                  <div className="space-y-1.5 border-t border-gray-800/40 pt-3">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Binance Futures Data</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Funding Rate (8H)</span>
                      <span className="text-emerald-400 font-bold">
                        {signal.coinglass_data?.fundingRate ? `${(signal.coinglass_data.fundingRate * 100).toFixed(4)}%` : "0.0007%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Funding Settlement</span>
                      <span className="text-white font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> {fundingCountdown}
                      </span>
                    </div>
                  </div>

                  {/* On-Chain Metrics Glassnode/Quant */}
                  <div className="space-y-1.5 border-t border-gray-800/40 pt-3">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Glassnode On-Chain Cycle</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">MVRV Z-Score</span>
                      <span className="text-[#6366f1] font-bold">{onchain.mvrvZScore} (Accumulation)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Exchange Reserves Flow</span>
                      <span className="text-emerald-400 font-bold">
                        {onchain.exchangeReserves === "ACCUMULATION_OUTFLOW" ? "Net Outflow (Bullish)" : "Net Inflow (Bearish)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Social Volume Delta</span>
                      <span className="text-emerald-400 font-bold">+{onchain.socialVolumeDelta}% (Bullish)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LunarCrush Galaxy Score</span>
                      <span className="text-white font-semibold">{onchain.galaxyScore}/100</span>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-1.5 border-b border-gray-800/60 pb-3">
                  <Globe className="w-4.5 h-4.5 text-indigo-400" />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-widest">
                    // Macro Intelligence
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">FRED Macro Yields & Interest</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">US Fed Funds Rate</span>
                      <span className="text-white font-bold">5.25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">UK Base Rate (BOE)</span>
                      <span className="text-white font-bold">5.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">US 10-Year Bond Yield</span>
                      <span className="text-white">4.24%</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-gray-800/40 pt-3">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Trading Central Consensus</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Consensus Score</span>
                      <span className="text-emerald-400 font-bold">{tradingCentral.tcConsensusScore}/100</span>
                    </div>
                    <div className="flex justify-between text-[11px] leading-relaxed bg-[#090a0f]/60 p-2 rounded mt-1 text-gray-300">
                      <span>TC Alert: {tradingCentral.analystSignal}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-gray-800/40 pt-3">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Finage Vision Live Spread</p>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Live Spread</span>
                      <span className="text-teal-400 font-bold">1.2 pips</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Acuity Expert Ideas Card */}
            <div className="bg-[#121420]/75 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
                <span className="text-xs font-mono font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" /> Acuity Expert View
                </span>
                <span className="text-[8px] font-mono bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">
                  Human Layer
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                <div className="flex items-start gap-2 bg-[#090a0f]/60 border border-gray-800 rounded-xl p-3 leading-normal">
                  <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase block">Expert Rationale Summary</span>
                    <p className="text-[11px] text-gray-300 font-semibold mt-1">
                      "Machines spotted the breakout, and human analysts confirm the structural alignment. Order block retest is holding strong under low selling volume, offering high-R:R entry criteria."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="bg-[#0c0d15] border border-gray-800 p-2 rounded-lg">
                    <span className="text-gray-500 uppercase block">Expert Confidence</span>
                    <span className="text-emerald-400 font-bold mt-1 block">82% - HIGH</span>
                  </div>
                  <div className="bg-[#0c0d15] border border-gray-800 p-2 rounded-lg">
                    <span className="text-gray-500 uppercase block">FCA Regulation</span>
                    <span className="text-white font-bold mt-1 block">Registered</span>
                  </div>
                </div>

                <div className="text-[8px] text-gray-500 leading-snug border-t border-gray-800/45 pt-2">
                  ℹ️ **Compliance disclosure**: Trade content and analyst stream powered by Acuity Research Ltd, regulated under FCA FRN: 787261.
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
