"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Official TradingView Logo Ligature (dot, slash, backslash)
const TradingViewLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519M5.3655 22l2.452-4.2898h13.9218L24 22H5.3655zm.2452-6.5416L0 22h3.9228l1.6877-2.9531V22h3.6775v-7.3369c0-.5422-.2452-1.0845-.9808-1.0845s-.9808.5423-.9808 1.0845V22H4.713v-6.5416zm4.9039 0v6.5416h3.6775v-3.9228c0-.5422.2452-1.0845.9808-1.0845s.9808.5423.9808 1.0845v3.9228h3.6775v-6.5416H10.514z"/>
  </svg>
);

const bulletPoints = [
  "Real-time data across forex, indices, commodities and crypto",
  "100+ built-in indicators + Pine Script for custom strategies",
  "Multi-chart layouts — run up to 8 charts simultaneously",
  "Paper trading mode — test live setups without real capital"
];

const metrics = [
  { value: "60M+", label: "TRADERS" },
  { value: "50+", label: "EXCHANGES" },
  { value: "Free", label: "PLAN AVAILABLE" }
];

const liveMarketPages = [
  { name: "EUR/USD ANALYSIS", href: "/markets/forex/eurusd" },
  { name: "GBP/USD ANALYSIS", href: "/markets/forex/gbpusd" },
  { name: "GOLD ANALYSIS", href: "/markets/commodities/gold" },
  { name: "FTSE 100 ANALYSIS", href: "/markets/indices/ftse100" },
  { name: "BITCOIN ANALYSIS", href: "/markets/crypto/btcusd" }
];

export function TradingViewSection() {
  useEffect(() => {
    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (typeof window !== "undefined" && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: "FX:GBPUSD",
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: "tradingview-advanced-chart-container",
          studies: [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      // Small timeout to allow the DOM container to mount before rendering the widget
      const t = setTimeout(initWidget, 100);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <section 
      className="w-full bg-[#050505] text-white py-24 select-none relative border-b border-zinc-900"
      style={{ contentVisibility: "auto" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Top Monospace Label */}
        <div className="space-y-4 mb-12">
          <span className="block text-[11px] font-mono uppercase tracking-[0.08em] text-zinc-500">
            // CHARTING PARTNER
          </span>
          <div className="flex items-center gap-2 text-zinc-400">
            <TradingViewLogo className="w-5 h-5 text-white" />
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] font-semibold text-white">
              TRADINGVIEW PARTNER
            </span>
          </div>
        </div>

        {/* Content & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Column Description Block */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.03em] font-bold text-white">
              The chart platform <br />
              serious traders <br />
              actually use.
            </h2>

            <div className="space-y-4 text-zinc-400 text-[14px] font-sans leading-relaxed">
              <p>
                Every chart example in the Drawdown curriculum runs on TradingView. We use it ourselves — every session, every analysis, without exception. Sixty million traders globally. Real-time data across every market we teach.
              </p>
              <p>
                It's the one tool we recommend without reservation.
              </p>
            </div>

            {/* Custom Green Bullet Points */}
            <ul className="space-y-3">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-[13px] font-sans text-zinc-300">
                  <span className="mt-1.5 w-2 h-2 shrink-0 bg-[#b6f900] rounded-full shadow-[0_0_8px_rgba(182,249,0,0.6)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Neon Green Call to Action Button */}
            <div className="space-y-4 pt-4">
              <Link
                href="/go/tradingview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#b6f900] hover:bg-[#a5df00] text-black font-sans font-bold text-[13px] uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(182,249,0,0.15)] hover:shadow-[0_0_25px_rgba(182,249,0,0.3)]"
                style={{ borderRadius: 0 }}
              >
                Try TradingView Free →
              </Link>
              <p className="text-[11px] font-sans text-zinc-500 leading-snug">
                Affiliate link — we earn a commission if you upgrade. We use TradingView ourselves and recommend it without qualification.
              </p>
            </div>

            {/* Custom Bottom Metrics Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900">
              {metrics.map((m, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-[20px] font-display font-semibold text-white tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column Interactive Chart Embed */}
          <div className="lg:col-span-7 h-[420px] lg:h-[500px] w-full border border-zinc-900 bg-[#0c0c0e] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-9 bg-[#131722] border-b border-zinc-900 px-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-300">LIVE</span>
                <span className="text-[11px] font-mono tracking-wider text-zinc-400">GBP/USD</span>
                <span className="text-[11px] font-mono text-zinc-500">1H</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">Powered by TradingView</span>
            </div>
            
            <div className="flex-1 w-full pt-9 relative">
              <div 
                id="tradingview-advanced-chart-container" 
                className="w-full h-full absolute inset-0 pt-9" 
              />
            </div>
          </div>

        </div>

        {/* Live Market Analysis Pages Horizontal Strip */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 font-bold shrink-0 uppercase">
            LIVE MARKET PAGES:
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {liveMarketPages.map((p, idx) => (
              <Link
                key={idx}
                href={p.href}
                className="text-[11px] font-mono text-zinc-400 hover:text-[#b6f900] transition-colors duration-200 flex items-center gap-1.5"
              >
                <span>→</span>
                <span>{p.name}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
