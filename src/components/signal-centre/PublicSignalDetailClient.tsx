"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Lock, ShieldCheck, Star, ExternalLink, Activity, Info, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Accent tokens: Indigo
const C_PRIMARY = "#6366f1"; // indigo-500
const C_HOVER = "#4f46e5";   // indigo-600
const C_TINT = "#eef2ff";    // indigo-50
const C_BORDER = "#c7d2fe";  // indigo-200
const C_TEXT = "#4338ca";    // indigo-700

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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();
  const tvSymbol = toTVSymbol(signal.instrument);

  // Copy share URL to clipboard
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Save/Unsave watchlist handlers
  const handleToggleSave = async () => {
    if (!userLoggedIn) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (saved) {
        // Delete
        const { error } = await (supabase as any)
          .from("signals_saved")
          .delete()
          .eq("user_id", user.id)
          .eq("signal_id", signal.id);
        if (!error) setSaved(false);
      } else {
        // Insert
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

  // Inject TradingView Advanced Chart Widget
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
          hide_side_toolbar: true,
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

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard/signal-centre"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Signal Centre
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-mono uppercase text-gray-600 hover:text-gray-900 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Link
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
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all border",
                  saved
                    ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                )}
              >
                <Star className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved to Watchlist" : "Save Setup"}
              </button>
            )}
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-display font-bold uppercase tracking-tight text-gray-900">
                {signal.instrument}
              </span>
              <span className="text-xs font-mono bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                {signal.timeframe} TIMEFRAME
              </span>
              <span
                className={cn(
                  "text-xs font-mono font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider",
                  isBullish
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                )}
              >
                {signal.bias}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              GENERATED AT {new Date(signal.created_at).toLocaleString()} · EXPIRES AT {new Date(signal.expires_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Confluence Rating */}
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">CONFLUENCE RATING</p>
              <div className="flex items-center gap-1 mt-1 justify-end">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: i < signal.confluence_score 
                        ? (isBullish ? "#10b981" : "#ef4444") 
                        : "#e5e7eb"
                    }}
                  />
                ))}
                <span className="text-sm font-mono font-bold text-gray-900 ml-1">
                  {signal.confluence_score}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[62%_35%] gap-6 items-start">
          
          {/* Left Column: Chart & Analysts Insights */}
          <div className="space-y-6">
            
            {/* Live Chart Container */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ height: 420 }}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" /> TradingView Live Chart
                </span>
                <span className="text-[10px] font-mono text-gray-400">{tvSymbol}</span>
              </div>
              <div ref={chartContainerRef} className="flex-1 w-full bg-white" />
            </div>

            {/* Confluence Factors */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                Confluence Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {signal.confluence_factors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-indigo-500">✓</span>
                    <span className="text-xs font-mono text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalyst event fundamentals */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" /> Fundamental Catalyst
              </h3>
              <div className="flex items-start gap-3 mt-2 bg-[#f5f3ff] border border-[#ddd6fe] rounded-lg p-3">
                <div className={cn(
                  "px-2 py-1 rounded text-[9px] font-mono font-bold uppercase shrink-0 mt-0.5",
                  catalyst.impact === "high" ? "bg-red-100 text-red-700" : catalyst.impact === "medium" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                )}>
                  {catalyst.impact} Impact
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-gray-900 leading-snug">{catalyst.event}</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-1">Calendar Event Time: {catalyst.time} UTC</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Trade Parameters Card */}
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
              <div className="px-4 py-3 border-b border-gray-100 bg-white">
                <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
                  Position Setup Parameters
                </h3>
              </div>

              {/* Blurred Overlay for non-subscribers */}
              {!isSubscriber && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-20 flex items-center justify-center p-5">
                  <div className="bg-white border border-[#c7d2fe] rounded-xl p-5 shadow-lg text-center max-w-sm w-full space-y-4">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-mono font-black uppercase tracking-wider text-indigo-600">// EDGE SUBSCRIBER ACCESS</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans">
                        Full access to exact entry prices, stop loss calculations, and risk-managed targets is reserved for Edge+ members.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/pricing?source=signal-centre"
                        className="w-full flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all rounded-lg"
                      >
                        Upgrade to Edge
                      </Link>
                      {!userLoggedIn && (
                        <Link
                          href={`/login?redirect=/signal-centre/signals/${signal.id}`}
                          className="text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors block"
                        >
                          Sign in to your account
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Setup list */}
              <div className={cn("p-5 space-y-4", !isSubscriber && "select-none blur-sm pointer-events-none")}>
                
                {/* Entry Price */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Entry Zone</span>
                    <span className="text-base font-mono font-bold text-gray-900 mt-1 block">
                      {isSubscriber ? signal.entry_price.toFixed(signal.entry_price > 100 ? 2 : 5) : "1.0854"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-100 text-[#4338ca] px-2 py-1 rounded">
                    MARKET ORDER
                  </span>
                </div>

                {/* Stop Loss */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Stop Loss</span>
                    <span className="text-base font-mono font-bold text-red-600 mt-1 block">
                      {isSubscriber ? signal.stop_loss.toFixed(signal.stop_loss > 100 ? 2 : 5) : "1.0805"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    1.5× ATR Stop
                  </span>
                </div>

                {/* R:R Ratio */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Risk/Reward Ratio</span>
                    <span className="text-sm font-mono font-bold text-gray-900 mt-1 block">
                      1 : {signal.rr_ratio.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    Calculated to TP2
                  </span>
                </div>

                {/* Target 1 */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-2 pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Target 1 (1.0 R:R)</span>
                    <span className="text-sm font-mono font-semibold text-emerald-600 mt-0.5 block">
                      {isSubscriber ? signal.take_profit_1.toFixed(signal.take_profit_1 > 100 ? 2 : 5) : "1.0903"}
                    </span>
                  </div>
                </div>

                {/* Target 2 */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Target 2 (2.0 R:R) · Primary</span>
                    <span className="text-sm font-mono font-bold text-emerald-600 mt-0.5 block">
                      {isSubscriber ? signal.take_profit_2.toFixed(signal.take_profit_2 > 100 ? 2 : 5) : "1.0952"}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                    RECOMMENDED
                  </span>
                </div>

                {/* Target 3 */}
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Target 3 (3.0 R:R) · Runner</span>
                    <span className="text-sm font-mono font-semibold text-emerald-600 mt-0.5 block">
                      {isSubscriber ? signal.take_profit_3.toFixed(signal.take_profit_3 > 100 ? 2 : 5) : "1.1001"}
                    </span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[9px] font-mono text-gray-400 leading-normal mt-4">
                  ⚠️ NOT FINANCIAL ADVICE. Algorithmic alerts are purely technical models. Execute at your own discretion.
                </div>

              </div>
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}
