"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  symbol: string;
  tickerKey: string;
  label: string;
  priceData?: { price: number; changePercent: number };
}

function TVMiniChart({ symbol, tickerKey, label, priceData }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      height: 200,
      locale: "en",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
      trendLineColor: "rgba(0, 194, 255, 1)",
      underLineColor: "rgba(0, 194, 255, 0.12)",
      underLineBottomColor: "rgba(0, 194, 255, 0)"
    });

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";

    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);
  }, [symbol]);

  const isPos = (priceData?.changePercent ?? 0) >= 0;

  return (
    <div className="bg-white border border-mkt-bd rounded-[14px] p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[290px] flex flex-col justify-between">
      {/* Header Live Price Badge */}
      {priceData && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100">
          <div>
            <span className="text-xs font-mono font-bold text-mkt-ink block">{label}</span>
            <span className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">Polygon.io Stream</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono font-bold text-mkt-ink block">
              {priceData.price > 1000 ? priceData.price.toLocaleString() : priceData.price}
            </span>
            <span className={cn("text-[9px] font-mono font-semibold flex items-center justify-end gap-0.5", isPos ? "text-mkt-grn" : "text-mkt-red")}>
              {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {isPos ? "+" : ""}{priceData.changePercent}%
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-full relative flex-grow" ref={containerRef}>
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.55,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="w-full bg-white border-b border-mkt-bd py-24 select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">
            // MARKET DYNAMICS & REALTIME FLUX
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Global Flux & Volatility
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time tracking of systemic market range expansion, high-low pricing envelopes, and volatility thresholds.
          </p>
          <p className="text-xs text-mkt-i4 max-w-2xl mx-auto font-sans mt-4 leading-relaxed border-t border-neutral-100 pt-4">
            Enriched with live Polygon.io data feeds, these TradingView widgets stream real-time price feeds and daily sparklines for GBP/USD, EUR/USD, Gold, and BTC/USD.
          </p>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS_CONFIG.map((config, idx) => (
            <motion.div
              key={config.symbol}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
              variants={cardVariants}
            >
              <TVMiniChart
                symbol={config.symbol}
                tickerKey={config.tickerKey}
                label={config.label}
                priceData={snapshots[config.tickerKey]}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
