"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  symbol: string;
  label: string;
  priceData?: { price: number; changePercent: number };
  feedOffline?: boolean;
}

function TVMiniChart({ symbol, label, priceData, feedOffline }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
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
      underLineBottomColor: "rgba(10, 37, 64, 0)",
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, [symbol]);

  const hasPrice = priceData !== undefined;
  const isPos = (priceData?.changePercent ?? 0) >= 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="border p-5 flex flex-col justify-between min-h-[290px] transition-all duration-300"
      style={{
        backgroundColor: "var(--surface-raised)",
        borderColor: isHovered ? "var(--accent)" : "var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        boxShadow: isHovered
          ? "0 0 24px rgba(10, 37, 64, 0.15), inset 0 0 12px rgba(10, 37, 64, 0.1)"
          : "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between pb-3 mb-2 border-b"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div>
          <span
            className="text-[12px] font-sans font-bold block"
            style={{ color: "var(--text-primary)" }}
          >
            {label}
          </span>
          <span
            className="text-[9px] font-mono uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {feedOffline ? "Feed offline" : "Polygon.io Feed"}
          </span>
        </div>
        <div className="text-right">
          <span
            className="text-[13px] font-mono tabular-nums font-semibold block"
            style={{ color: "var(--text-primary)" }}
          >
            {hasPrice
              ? priceData!.price > 1000
                ? priceData!.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : priceData!.price.toFixed(4)
              : "—"}
          </span>
          {hasPrice ? (
            <span
              className={cn(
                "text-[9px] font-mono font-bold flex items-center justify-end gap-0.5",
                isPos
                  ? "text-[color:var(--market-up)]"
                  : "text-[color:var(--market-down)]"
              )}
            >
              {isPos ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              {`${isPos ? "+" : ""}${priceData!.changePercent.toFixed(2)}%`}
            </span>
          ) : (
            <span
              className="text-[9px] font-mono"
              style={{ color: "var(--text-tertiary)" }}
            >
              —
            </span>
          )}
        </div>
      </div>

      {/* TradingView widget or offline placeholder */}
      {feedOffline ? (
        <div
          className="flex-grow flex flex-col items-center justify-center gap-2 text-center"
          style={{ minHeight: 180 }}
        >
          <WifiOff
            className="w-5 h-5"
            style={{ color: "var(--text-secondary)" }}
          />
          <p
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Chart unavailable
          </p>
        </div>
      ) : (
        <div
          className="w-full h-[180px] relative flex-grow overflow-hidden"
          ref={containerRef}
        >
          <div className="tradingview-widget-container__widget" />
        </div>
      )}
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
  const [snapshots, setSnapshots] = useState<
    Record<string, { price: number; changePercent: number }>
  >({});
  const [feedOffline, setFeedOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSnapshots() {
      try {
        const res = await fetch(
          "/api/market/polygon-snapshot?symbols=GBPUSD,EURUSD,XAUUSD,BTCUSD"
        );
        if (res.ok) {
          const json = await res.json();
          if (json.snapshots) {
            setSnapshots(json.snapshots);
          } else {
            setFeedOffline(true);
          }
        } else {
          setFeedOffline(true);
        }
      } catch (err) {
        console.error("Failed to load Polygon snapshots:", err);
        setFeedOffline(true);
      } finally {
        setLoading(false);
      }
    }
    loadSnapshots();
  }, []);

  return (
    <div className="w-full">
      {/* Section Heading */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] font-mono uppercase tracking-[0.08em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Systemic Price Action Feeds
          </span>
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border"
            style={{
              color: "var(--market-up)",
              borderColor:
                "color-mix(in srgb, var(--market-up) 25%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--market-up) 10%, transparent)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            Live Sparklines
          </span>
        </div>

        <h2
          className="type-display-lg font-normal mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Global Flux &amp; Volatility
        </h2>
        <p
          className="type-body-lg font-normal max-w-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          Real-time tracking of systemic market range expansion, high-low
          pricing envelopes, and volatility thresholds.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border p-5 animate-pulse flex flex-col gap-4"
              style={{
                backgroundColor: "var(--surface-raised)",
                borderColor: "var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                minHeight: 290,
              }}
            >
              <div
                className="h-4 w-24 rounded"
                style={{ backgroundColor: "var(--border-subtle)" }}
              />
              <div
                className="flex-grow rounded"
                style={{ backgroundColor: "var(--border-subtle)" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {CARDS_CONFIG.map((config) => (
            <TVMiniChart
              key={config.symbol}
              symbol={config.symbol}
              label={config.label}
              priceData={snapshots[config.tickerKey]}
              feedOffline={feedOffline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
