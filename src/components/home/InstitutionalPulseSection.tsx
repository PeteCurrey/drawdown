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
  badgeStyle: React.CSSProperties;
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
            let color = "var(--market-flat)";
            let bgColor = "color-mix(in srgb, var(--market-flat) 5%, transparent)";
            let badgeStyle = {
              color: "var(--market-flat)",
              backgroundColor: "color-mix(in srgb, var(--market-flat) 10%, transparent)",
              borderColor: "color-mix(in srgb, var(--market-flat) 25%, transparent)"
            };
            let icon = ShieldAlert;

            if (item.verdict.toLowerCase().includes("buy")) {
              type = "BULLISH";
              color = "var(--market-up)";
              bgColor = "color-mix(in srgb, var(--market-up) 10%, transparent)";
              badgeStyle = {
                color: "var(--market-up)",
                backgroundColor: "color-mix(in srgb, var(--market-up) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--market-up) 25%, transparent)"
              };
              icon = ArrowUpRight;
            } else if (item.verdict.toLowerCase().includes("sell")) {
              type = "BEARISH";
              color = "var(--market-down)";
              bgColor = "color-mix(in srgb, var(--market-down) 10%, transparent)";
              badgeStyle = {
                color: "var(--market-down)",
                backgroundColor: "color-mix(in srgb, var(--market-down) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--market-down) 25%, transparent)"
              };
              icon = ArrowDownRight;
            }

            return {
              type,
              icon,
              title: `${item.symbol} — ${item.trend} Trend`,
              description: `${item.symbol} is trading ${item.trend.toLowerCase()} of its 20-period EMA. The 14-period RSI is at ${item.rsi}, indicating ${item.trend === "Bullish" ? "positive" : item.trend === "Bearish" ? "negative" : "neutral"} momentum on the daily timeframe.`,
              color,
              bgColor,
              badgeStyle
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
    <div className="w-full select-none relative z-10">
      <div>
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="type-label uppercase block mb-3" style={{ color: "var(--text-secondary)" }}>
            MARKET SENTIMENT
          </span>
          <h2 className="type-display-lg font-normal mb-4" style={{ color: "var(--text-primary)" }}>
            Systemic Market Sentiment
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <p className="type-body-lg font-normal leading-relaxed lg:col-span-6" style={{ color: "var(--text-secondary)" }}>
              Aggregate sentiment and technical consensus data drawn from global risk gauges and EMA/RSI readings across major instruments.
            </p>
            <p className="text-[12px] leading-relaxed font-mono lg:col-span-6 border-l pl-6 pt-1" style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}>
              The Market Sentiment Index compiles global risk gauges (such as the Crypto Fear &amp; Greed Index and the VIX Volatility Index) to map macro exposure. Higher bullish weights signal broad buying appetite, while higher VIX values imply market consolidation.
            </p>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Signal Cards or Feed Offline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2 pl-1" style={{ color: "var(--text-primary)" }}>
              <RefreshCw className="w-4 h-4" style={{ color: "var(--accent)" }} /> Technical Consensus Signals
            </h3>

            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border p-5 flex items-start gap-4 animate-pulse"
                    style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  >
                    <div className="w-10 h-10 shrink-0" style={{ backgroundColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }} />
                    <div className="flex-grow space-y-2">
                      <div className="h-3 w-1/2 rounded-md" style={{ backgroundColor: "var(--border-subtle)" }} />
                      <div className="h-3 w-3/4 rounded-md" style={{ backgroundColor: "var(--border-subtle)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : signalsUnavailable ? (
              // FEED_OFFLINE state — no fabricated fallback
              <div
                className="border p-8 flex flex-col items-center justify-center gap-3 text-center"
                style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)", minHeight: 240 }}
              >
                <WifiOff className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
                <p className="text-sm font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                  Signals Unavailable
                </p>
                <p className="text-xs font-sans" style={{ color: "var(--text-secondary)" }}>
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
                      backgroundColor: "var(--surface-raised)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    {/* Icon Container */}
                    <div 
                      className="w-10 h-10 flex items-center justify-center shrink-0 border"
                      style={{
                        borderColor: "var(--border-subtle)",
                        backgroundColor: "var(--surface-base)",
                        borderRadius: "var(--radius-md)"
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: sig.color }} />
                    </div>
                    {/* Card Content */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-sans font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                          {sig.title}
                        </h4>
                        <span 
                          className="text-[9px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider"
                          style={{ borderRadius: "var(--radius-md)", ...sig.badgeStyle }}
                        >
                          {sig.type}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed font-sans pr-4" style={{ color: "var(--text-secondary)" }}>
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
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-2 pl-1" style={{ color: "var(--text-primary)" }}>
              <BarChart2 className="w-4 h-4" style={{ color: "var(--accent)" }} /> Market Sentiment Profile
            </h3>

            {!loading && !sentimentAvailable ? (
              // Sentiment feed offline
              <div
                className="border p-8 flex flex-col items-center justify-center gap-3 text-center"
                style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)", minHeight: 320 }}
              >
                <WifiOff className="w-7 h-7" style={{ color: "var(--text-secondary)" }} />
                <p className="text-sm font-mono font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                  Sentiment Feed Offline
                </p>
                <p className="text-xs font-sans" style={{ color: "var(--text-secondary)" }}>
                  Could not retrieve sentiment data. Refresh to retry.
                </p>
              </div>
            ) : (
              <div 
                className="border p-6 flex flex-col items-center"
                style={{
                  backgroundColor: "var(--surface-raised)",
                  borderColor: "var(--border-subtle)",
                  borderRadius: "var(--radius-md)"
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
                      stroke="var(--border-subtle)"
                      strokeWidth={strokeWidth}
                    />
                    {/* Bullish Arc (Green) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="var(--market-up)"
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
                      stroke="var(--market-down)"
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
                      stroke="var(--market-flat)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${neutLength} ${circ}`}
                      strokeDashoffset={neutOffset}
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-mono tabular-nums font-extrabold tracking-tighter" style={{ color: "var(--text-primary)" }}>
                      {`${Math.round(bullPct * 100)}%`}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--market-up)" }}>
                      {sentiment?.label || "Bullish"}
                    </span>
                  </div>
                </div>

                {/* Three Sentiment Bars */}
                <div className="w-full space-y-4 mt-2">
                  {/* Bullish Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--text-secondary)" }}>Bullish Exposure</span>
                      <span className="font-mono tabular-nums font-bold" style={{ color: "var(--market-up)" }}>{`${Math.round(bullPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 overflow-hidden" style={{ borderRadius: "var(--radius-md)" }}>
                      <div className="h-full transition-all duration-500" style={{ width: `${Math.round(bullPct * 100)}%`, backgroundColor: "var(--market-up)", borderRadius: "var(--radius-md)" }} />
                    </div>
                  </div>

                  {/* Bearish Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--text-secondary)" }}>Bearish Exposure</span>
                      <span className="font-mono tabular-nums font-bold" style={{ color: "var(--market-down)" }}>{`${Math.round(bearPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 overflow-hidden" style={{ borderRadius: "var(--radius-md)" }}>
                      <div className="h-full transition-all duration-500" style={{ width: `${Math.round(bearPct * 100)}%`, backgroundColor: "var(--market-down)", borderRadius: "var(--radius-md)" }} />
                    </div>
                  </div>

                  {/* Neutral Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-sans font-medium" style={{ color: "var(--text-secondary)" }}>Neutral Exposure</span>
                      <span className="font-mono tabular-nums font-bold" style={{ color: "var(--market-flat)" }}>{`${Math.round(neutPct * 100)}%`}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 overflow-hidden" style={{ borderRadius: "var(--radius-md)" }}>
                      <div className="h-full transition-all duration-500" style={{ width: `${Math.round(neutPct * 100)}%`, backgroundColor: "var(--market-flat)", borderRadius: "var(--radius-md)" }} />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
