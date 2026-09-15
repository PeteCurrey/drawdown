"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  type: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  badgeColor: string;
}

export function InstitutionalPulseSection() {
  const [sentiment, setSentiment] = useState<any>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedOffline, setFeedOffline] = useState(false);

  // Fetch sentiment and consensus (to build signals) on mount
  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [sentRes, conRes] = await Promise.all([
          fetch("/api/market/sentiment"),
          fetch("/api/market/consensus")
        ]);
        const sentData = sentRes.ok ? await sentRes.json() : null;
        const conData = conRes.ok ? await conRes.json() : [];

        if (!active) return;

        if (sentData && !sentData.error) {
          setSentiment(sentData);
        }

        // Map consensus technicals to signals
        if (Array.isArray(conData) && conData.length > 0) {
          const mappedSignals = conData.slice(0, 4).map((item) => {
            let type = "NEUTRAL";
            let color = "var(--mkt-amb)";
            let bgColor = "rgba(245, 158, 11, 0.05)";
            let badgeColor = "text-mkt-amb bg-amber-50/50 border-amber-200";
            let icon = ShieldAlert;

            if (item.verdict.toLowerCase().includes("buy")) {
              type = "BULLISH";
              color = "var(--mkt-grn)";
              bgColor = "var(--mkt-gbg)";
              badgeColor = "text-mkt-grn bg-mkt-gbg border-mkt-gbd";
              icon = ArrowUpRight;
            } else if (item.verdict.toLowerCase().includes("sell")) {
              type = "BEARISH";
              color = "var(--mkt-red)";
              bgColor = "var(--mkt-rbg)";
              badgeColor = "text-mkt-red bg-mkt-rbg border-mkt-rbd";
              icon = ArrowDownRight;
            }

            return {
              type,
              icon,
              title: `${item.symbol} — ${item.trend} Trend`,
              description: `${item.symbol} is trading ${item.trend.toLowerCase()} of its 20-period EMA. The 14-period RSI is at ${item.rsi}, indicating ${item.trend === "Bullish" ? "positive" : item.trend === "Bearish" ? "negative" : "neutral"} momentum on the daily timeframe.`,
              color,
              bgColor,
              badgeColor
            };
          });
          setSignals(mappedSignals);
        } else {
          // No usable data from either endpoint
          setFeedOffline(true);
        }
      } catch (err) {
        console.error("Error loading sentiment/pulse:", err);
        if (active) setFeedOffline(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // If signals were fetched but are empty after load, mark offline
  const signalsUnavailable = !loading && (feedOffline || signals.length === 0);

  // Donut values: only render when sentiment data is available
  const sentimentAvailable = !!sentiment && !sentiment.error;
  const fg = sentimentAvailable ? (sentiment.fearGreed || 50) : 50;
  const vixVal = sentimentAvailable ? (sentiment.vix || 15) : 15;

  const rawBull = fg / 100;
  const rawNeut = Math.max(10, Math.min(25, vixVal)) / 100;
  const rawBear = Math.max(0.05, 1 - rawBull - rawNeut);

  const sum = rawBull + rawNeut + rawBear;
  const bullPct = rawBull / sum;
  const bearPct = rawBear / sum;
  const neutPct = rawNeut / sum;

  // Donut SVG calculations
  const radius = 50;
  const strokeWidth = 8;
  const circ = 2 * Math.PI * radius; // ~314.159

  const bullLength = circ * bullPct;
  const bearLength = circ * bearPct;
  const neutLength = circ * neutPct;

  const bullOffset = 0;
  const bearOffset = -bullLength;
  const neutOffset = -(bullLength + bearLength);

  return (
    <section 
      className="w-full border-b py-24 select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] block mb-3" style={{ color: "var(--graphite-600)" }}>
            // SENTIMENT & TECHNICAL CONSENSUS
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4" style={{ color: "var(--ink-950)" }}>
            Systemic Market Sentiment
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <p className="text-[15px] leading-relaxed font-sans lg:col-span-6" style={{ color: "var(--graphite-600)" }}>
              Aggregate sentiment and technical consensus data drawn from global risk gauges and EMA/RSI readings across major instruments.
            </p>
            <p className="text-[12px] leading-relaxed font-mono lg:col-span-6 border-l pl-6 pt-1" style={{ color: "var(--graphite-600)", borderColor: "var(--line-200)" }}>
              The Market Sentiment Index compiles global risk gauges (such as the Crypto Fear &amp; Greed Index and the VIX Volatility Index) to map macro exposure. Higher bullish weights signal broad buying appetite, while higher VIX values imply market consolidation.
            </p>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Signal Cards or Feed Offline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2 pl-1" style={{ color: "var(--ink-950)" }}>
              <RefreshCw className="w-4 h-4" style={{ color: "var(--signal-navy)" }} /> Technical Consensus Signals
            </h3>

            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border p-5 flex items-start gap-4 animate-pulse"
                    style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0 }}
                  >
                    <div className="w-10 h-10 shrink-0" style={{ backgroundColor: "var(--line-200)" }} />
                    <div className="flex-grow space-y-2">
                      <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--line-200)" }} />
                      <div className="h-3 w-3/4 rounded" style={{ backgroundColor: "var(--line-200)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : signalsUnavailable ? (
              // FEED_OFFLINE state — no fabricated fallback
              <div
                className="border p-8 flex flex-col items-center justify-center gap-3 text-center"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0, minHeight: 240 }}
              >
                <WifiOff className="w-7 h-7" style={{ color: "var(--graphite-600)" }} />
                <p className="text-sm font-mono font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
                  Signals Unavailable
                </p>
                <p className="text-xs font-sans" style={{ color: "var(--graphite-600)" }}>
                  Could not retrieve consensus data. Check back shortly or refresh the page.
                </p>
              </div>
            ) : (
              signals.map((sig: any, idx: number) => {
                const Icon = sig.icon || ArrowUpRight;
                return (
                  <div
                    key={idx}
                    className="border p-5 transition-all duration-300 flex items-start gap-4"
                    style={{
                      backgroundColor: "var(--paper-100)",
                      borderColor: "var(--line-200)",
                      borderRadius: 0
                    }}
                  >
                    {/* Icon Container */}
                    <div 
                      className="w-10 h-10 flex items-center justify-center shrink-0 border"
                      style={{
                        borderColor: "var(--line-200)",
                        backgroundColor: "var(--paper-0)",
                        borderRadius: 0
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: sig.color }} />
                    </div>
                    {/* Card Content */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-sans font-bold leading-tight" style={{ color: "var(--ink-950)" }}>
                          {sig.title}
                        </h4>
                        <span 
                          className={cn("text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider", sig.badgeColor)}
                          style={{ borderRadius: 0 }}
                        >
                          {sig.type}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans pr-4" style={{ color: "var(--graphite-600)" }}>
                        {sig.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Sentiment Ring & Sentiment Bars */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2 pl-1" style={{ color: "var(--ink-950)" }}>
              <BarChart2 className="w-4 h-4" style={{ color: "var(--signal-navy)" }} /> Market Sentiment Profile
            </h3>

            {!loading && !sentimentAvailable ? (
              // Sentiment feed offline
              <div
                className="border p-8 flex flex-col items-center justify-center gap-3 text-center"
                style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderRadius: 0, minHeight: 320 }}
              >
                <WifiOff className="w-7 h-7" style={{ color: "var(--graphite-600)" }} />
                <p className="text-sm font-mono font-bold uppercase tracking-wider" style={{ color: "var(--ink-950)" }}>
                  Sentiment Feed Offline
                </p>
                <p className="text-xs font-sans" style={{ color: "var(--graphite-600)" }}>
                  Could not retrieve sentiment data. Refresh to retry.
                </p>
              </div>
            ) : (
              <div 
                className="border p-6 flex flex-col items-center"
                style={{
                  backgroundColor: "var(--paper-100)",
                  borderColor: "var(--line-200)",
                  borderRadius: 0
                }}
              >
                
                {/* Donut Chart Ring */}
                <div className="relative w-48 h-48 mb-8 mt-2">
                  <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="var(--line-200)"
                      strokeWidth={strokeWidth}
                    />
                    {/* Bullish Arc (Green) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="var(--mkt-grn)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${bullLength} ${circ}`}
                      strokeDashoffset={bullOffset}
                    />
                    {/* Bearish Arc (Red) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="var(--mkt-red)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${bearLength} ${circ}`}
                      strokeDashoffset={bearOffset}
                    />
                    {/* Neutral Arc (Amber) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="var(--mkt-amb)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${neutLength} ${circ}`}
                      strokeDashoffset={neutOffset}
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-sans font-extrabold tracking-tighter" style={{ color: "var(--ink-950)" }}>
                      {`${Math.round(bullPct * 100)}%`}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--mkt-grn)" }}>
                      {sentiment?.label || "Bullish"}
                    </span>
                  </div>
                </div>

                {/* Three Sentiment Bars */}
                <div className="w-full space-y-4 mt-2">
                  {/* Bullish Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--graphite-600)" }}>Bullish Exposure</span>
                      <span className="font-mono font-bold" style={{ color: "var(--mkt-grn)" }}>{`${Math.round(bullPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 rounded-none overflow-hidden">
                      <div className="h-full rounded-none transition-all duration-500" style={{ width: `${Math.round(bullPct * 100)}%`, backgroundColor: "var(--mkt-grn)" }} />
                    </div>
                  </div>

                  {/* Bearish Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--graphite-600)" }}>Bearish Exposure</span>
                      <span className="font-mono font-bold" style={{ color: "var(--mkt-red)" }}>{`${Math.round(bearPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 rounded-none overflow-hidden">
                      <div className="h-full rounded-none transition-all duration-500" style={{ width: `${Math.round(bearPct * 100)}%`, backgroundColor: "var(--mkt-red)" }} />
                    </div>
                  </div>

                  {/* Neutral Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--graphite-600)" }}>Neutral Exposure</span>
                      <span className="font-mono font-bold" style={{ color: "var(--mkt-amb)" }}>{`${Math.round(neutPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 rounded-none overflow-hidden">
                      <div className="h-full rounded-none transition-all duration-500" style={{ width: `${Math.round(neutPct * 100)}%`, backgroundColor: "var(--mkt-amb)" }} />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
