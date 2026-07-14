"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function TradingViewSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerDiv = containerRef.current;
    if (!containerDiv) return;

    // Clear container
    containerDiv.innerHTML = "";

    // Create widget target div
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget h-full w-full";
    containerDiv.appendChild(widgetDiv);

    // Create embed script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "FX:GBPUSD",
      "interval": "60",
      "timezone": "Europe/London",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "backgroundColor": "rgba(10, 10, 10, 1)",
      "gridColor": "rgba(255, 255, 255, 0.04)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com"
    });

    containerDiv.appendChild(script);

    return () => {
      if (containerDiv) {
        containerDiv.innerHTML = "";
      }
    };
  }, []);

  return (
    <section className="bg-[#0A0A0A] w-full py-24 lg:py-32 border-t border-white/5 relative z-25 overflow-hidden">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.01] to-transparent pointer-events-none" />
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/[0.01] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* Section Label */}
        <div className="mb-12">
          <span className="text-[11px] font-sans font-bold text-white/45 uppercase tracking-widest block">
            // CHARTING PARTNER
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Content, ~42% width) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-white/60 select-none">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
                <title>TradingView</title>
                <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z"/>
              </svg>
              <span className="text-xs font-sans font-bold tracking-widest uppercase">
                TradingView Partner
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight">
              The chart platform serious traders actually use.
            </h2>
            
            <div className="space-y-4 text-sm md:text-[15px] text-white/70 leading-relaxed font-sans">
              <p>
                Every chart example in the Drawdown curriculum runs on TradingView. We use it ourselves — every session, every analysis, without exception. Sixty million traders globally. Real-time data across every market we teach.
              </p>
              <p>
                It's the one tool we recommend without reservation. And we've never taken a penny to say that.
              </p>
            </div>

            <ul className="space-y-3.5 pt-2">
              {[
                "Real-time data across forex, indices, commodities and crypto",
                "100+ built-in indicators + Pine Script for custom strategies",
                "Multi-chart layouts — run up to 8 charts simultaneously",
                "Paper trading mode — test live setups without real capital"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span 
                    className="w-2 h-2 rounded-full inline-block shrink-0 mt-2" 
                    style={{ backgroundColor: "#C8F135" }} 
                  />
                  <span className="text-sm md:text-[14px] text-white/80 font-sans">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6 space-y-4">
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-bold text-sm tracking-wide transition-colors bg-[#C8F135] text-black hover:opacity-95 shadow-lg shadow-black/10 font-sans"
              >
                Try TradingView Free →
              </Link>
              <p className="text-xs text-white/40 max-w-sm font-sans">
                Affiliate link — we earn a commission if you upgrade. We use TradingView ourselves and recommend it without qualification.
              </p>
            </div>

            {/* Stat Row */}
            <div className="flex items-center gap-6 pt-8 border-t border-white/5 mt-8">
              <div>
                <span className="block text-white font-semibold text-base md:text-lg">60M+</span>
                <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest font-sans">Traders</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block text-white font-semibold text-base md:text-lg">50+</span>
                <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest font-sans">Exchanges</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block text-white font-semibold text-base md:text-lg">Free</span>
                <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-widest font-sans">Plan Available</span>
              </div>
            </div>

          </div>

          {/* Right Column (Chart Embed, ~58% width) */}
          <div className="lg:col-span-7">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0A]">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 h-10 bg-[#111111] border-b border-white/5 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135] inline-block animate-pulse" />
                  <span className="text-[10px] font-bold text-[#C8F135] uppercase tracking-wider font-mono">
                    LIVE
                  </span>
                  <span className="text-xs font-semibold text-white font-mono ml-1">
                    GBP/USD · 1H
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-sans">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current">
                    <title>TradingView</title>
                    <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z"/>
                  </svg>
                  <span>Powered by TradingView</span>
                </div>
              </div>

              {/* Chart container */}
              <div className="w-full h-[320px] lg:h-[480px]">
                <div 
                  className="tradingview-widget-container h-full w-full" 
                  ref={containerRef}
                />
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Below the columns — full-width strip */}
      <div className="w-full bg-white/[0.03] border-y border-white/5 py-6 mt-16 md:mt-24 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-[11px] uppercase tracking-widest text-white/30 font-bold shrink-0 md:pr-4 md:border-r md:border-white/10 font-sans">
            LIVE MARKET PAGES:
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full whitespace-nowrap scroll-smooth flex-nowrap md:flex-wrap">
            <Link 
              href="/markets/forex/eurusd" 
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C8F135] transition-colors font-sans"
            >
              → EUR/USD Analysis
            </Link>
            <Link 
              href="/markets/forex/gbpusd" 
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C8F135] transition-colors font-sans"
            >
              → GBP/USD Analysis
            </Link>
            <Link 
              href="/markets/commodities/gold" 
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C8F135] transition-colors font-sans"
            >
              → Gold Analysis
            </Link>
            <Link 
              href="/markets/indices/uk100" 
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C8F135] transition-colors font-sans"
            >
              → FTSE 100 Analysis
            </Link>
            <Link 
              href="/markets/crypto/bitcoin" 
              className="text-xs uppercase tracking-widest text-white/40 hover:text-[#C8F135] transition-colors font-sans"
            >
              → Bitcoin Analysis
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
