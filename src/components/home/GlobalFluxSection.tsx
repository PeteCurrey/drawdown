"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  symbol: string;
  tickerKey: string;
  label: string;
  priceData?: { price: number; changePercent: number };
}

// TradingView official logo SVG path
const TVLogoMark = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-7 h-7 shrink-0"
    fill="#2962FF"
    aria-hidden="true"
  >
    <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519M5.3655 22l2.452-4.2898h13.9218L24 22H5.3655zm.2452-6.5416L0 22h3.9228l1.6877-2.9531V22h3.6775v-7.3369c0-.5422-.2452-1.0845-.9808-1.0845s-.9808.5423-.9808 1.0845V22H4.713v-6.5416zm4.9039 0v6.5416h3.6775v-3.9228c0-.5422.2452-1.0845.9808-1.0845s.9808.5423.9808 1.0845v3.9228h3.6775v-6.5416H10.514z"/>
  </svg>
);

function TVMiniChart({ symbol, tickerKey, label, priceData }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: 180,
      locale: "en",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      trendLineColor: "rgba(10, 37, 64, 0.8)",
      underLineColor: "rgba(10, 37, 64, 0.05)",
      underLineBottomColor: "rgba(10, 37, 64, 0)"
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, [symbol]);

  const isPos = (priceData?.changePercent ?? 0) >= 0;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border p-5 flex flex-col justify-between min-h-[290px] transition-all duration-300"
      style={{
        backgroundColor: "var(--paper-100)",
        borderColor: isHovered ? "var(--signal-navy)" : "var(--line-200)",
        borderRadius: 0,
        boxShadow: isHovered ? "0 0 24px rgba(10, 37, 64, 0.15), inset 0 0 12px rgba(10, 37, 64, 0.1) " : "none",
      }}
    >
      {/* Header Live Price Badge */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b" style={{ borderColor: "var(--line-200)" }}>
        <div>
          <span className="text-[12px] font-sans font-bold block" style={{ color: "var(--ink-950)" }}>{label}</span>
          <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
            Polygon.io Feed
          </span>
        </div>
        <div className="text-right">
          <span className="text-[13px] font-mono tabular-nums font-semibold block" style={{ color: "var(--ink-950)" }}>
            {priceData ? (priceData.price > 1000 ? priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : priceData.price.toFixed(4)) : "--"}
          </span>
          <span className={cn("text-[9px] font-mono font-bold flex items-center justify-end gap-0.5", isPos ? "text-mkt-grn" : "text-mkt-red")}>
            {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            {priceData ? `${isPos ? "+" : ""}${priceData.changePercent.toFixed(2)}%` : "0.00%"}
          </span>
        </div>
      </div>

      <div className="w-full h-[180px] relative flex-grow overflow-hidden" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

const CARDS_CONFIG = [
  { symbol: "FX:GBPUSD", tickerKey: "GBPUSD", label: "GBP/USD" },
  { symbol: "FX:EURUSD", tickerKey: "EURUSD", label: "EUR/USD" },
  { symbol: "OANDA:XAUUSD", tickerKey: "XAUUSD", label: "Gold (XAU/USD)" },
  { symbol: "BINANCE:BTCUSD", tickerKey: "BTCUSD", label: "BTC/USD" },
];

export function GlobalFluxSection() {
  const [snapshots, setSnapshots] = useState<Record<string, { price: number; changePercent: number }>>({});

  useEffect(() => {
    async function loadSnapshots() {
      try {
        const res = await fetch("/api/market/polygon-snapshot?symbols=GBPUSD,EURUSD,XAUUSD,BTCUSD");
        if (res.ok) {
          const json = await res.json();
          if (json.snapshots) {
            setSnapshots(json.snapshots);
          }
        }
      } catch (err) {
        console.error("Failed to load Polygon snapshots:", err);
      }
    }
    loadSnapshots();
  }, []);

  return (
    <section 
      className="w-full border-b py-24 select-none relative z-10"
      style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="text-[11px] font-mono uppercase tracking-[0.08em]"
              style={{ color: "var(--graphite-600)" }}
            >
              Systemic Price Action Feeds
            </span>
            <span 
              className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border"
              style={{
                color: "var(--mkt-grn)",
                borderColor: "var(--mkt-gbd)",
                backgroundColor: "var(--mkt-gbg)",
                borderRadius: 0
              }}
            >
              Live Sparklines
            </span>
          </div>
          
          <h2 
            className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-[-0.02em] font-semibold mb-4"
            style={{ color: "var(--ink-950)" }}
          >
            Global Flux & Volatility
          </h2>
          <p 
            className="text-[15px] leading-relaxed font-sans max-w-xl"
            style={{ color: "var(--graphite-600)" }}
          >
            Real-time tracking of systemic market range expansion, high-low pricing envelopes, and volatility thresholds.
          </p>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CARDS_CONFIG.map((config) => (
            <TVMiniChart
              key={config.symbol}
              symbol={config.symbol}
              tickerKey={config.tickerKey}
              label={config.label}
              priceData={snapshots[config.tickerKey]}
            />
          ))}
        </div>

        {/* Dedicated Premium TradingView Partnership Promo Banner */}
        <div 
          className="border p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative overflow-hidden"
          style={{ 
            backgroundColor: "var(--paper-100)", 
            borderColor: "var(--line-200)",
            borderRadius: 0
          }}
        >
          {/* Subtle design details */}
          <div 
            className="absolute top-0 left-0 w-1 h-full"
            style={{ backgroundColor: "#2962FF" }}
          />

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <TVLogoMark />
              <div>
                <span className="text-[15px] font-sans font-bold leading-none block" style={{ color: "var(--ink-950)" }}>
                  TradingView
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest mt-1 block" style={{ color: "#2962FF" }}>
                  Official Technical Charting Partner
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed font-sans" style={{ color: "var(--graphite-600)" }}>
              Every structural layout, institutional liquidity grid, and order flow chart displayed across the Drawdown ecosystem is powered by TradingView's premium data engine. Access real-time tick feeds, customized pine indicators, and secure webhook order executions.
            </p>

            <div className="flex flex-wrap gap-2">
              {["100+ Indicators", "Pine Script v5", "Webhook Alerts", "Tabular Order Book"].map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider border"
                  style={{ borderColor: "var(--line-200)", color: "var(--graphite-600)", backgroundColor: "var(--paper-0)", borderRadius: 0 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end gap-2 w-full lg:w-auto">
            <Link
              href="/go/tradingview"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all duration-300"
              style={{ backgroundColor: "#2962FF", borderRadius: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1b4bd1")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2962FF")}
            >
              Analyze Markets on TradingView
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[9px] font-mono" style={{ color: "var(--graphite-600)" }}>
              Disclosed Partner · Used Daily by Pete Currey
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

