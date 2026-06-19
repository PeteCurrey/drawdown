"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MiniChartProps {
  symbol: string;
}

function TVMiniChart({ symbol }: MiniChartProps) {
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
      height: 220,
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

  return (
    <div className="bg-white border border-mkt-bd rounded-[14px] p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[268px] flex items-center justify-center">
      <div className="w-full h-full relative" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

const CARDS_CONFIG = [
  { symbol: "FX:GBPUSD", label: "GBP/USD" },
  { symbol: "FX:EURUSD", label: "EUR/USD" },
  { symbol: "BINANCE:BTCUSD", label: "BTC/USD" },
];

export function GlobalFluxSection() {
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
            // MARKET DYNAMICS
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-mkt-ink tracking-tight mb-4">
            Global Flux & Volatility
          </h2>
          <p className="text-base text-mkt-i3 max-w-xl mx-auto font-sans">
            Real-time tracking of systemic market range expansion, high-low pricing envelopes, and volatility thresholds.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS_CONFIG.map((config, idx) => (
            <motion.div
              key={config.symbol}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
              variants={cardVariants}
            >
              <TVMiniChart symbol={config.symbol} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
