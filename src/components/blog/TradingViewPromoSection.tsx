"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

// TradingView official logo SVG path (Simple Icons / official brand mark)
// Brand colours: bg #131722 (dark navy), accent #2962FF (brand blue), text #FFFFFF
const TVLogoMark = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    fill="#2962FF"
    aria-hidden="true"
  >
    {/* Official TradingView logo path from Simple Icons */}
    <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519M5.3655 22l2.452-4.2898h13.9218L24 22H5.3655zm.2452-6.5416L0 22h3.9228l1.6877-2.9531V22h3.6775v-7.3369c0-.5422-.2452-1.0845-.9808-1.0845s-.9808.5423-.9808 1.0845V22H4.713v-6.5416zm4.9039 0v6.5416h3.6775v-3.9228c0-.5422.2452-1.0845.9808-1.0845s.9808.5423.9808 1.0845v3.9228h3.6775v-6.5416H10.514z"/>
  </svg>
);

export function TradingViewPromoSection() {
  return (
    <div
      className="my-10 relative overflow-hidden rounded-none border"
      style={{ background: "#131722", borderColor: "#2A2E39" }}
    >
      {/* Brand blue left accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ background: "#2962FF" }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#2962FF 1px, transparent 1px), linear-gradient(90deg, #2962FF 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Logo + Copy */}
        <div className="space-y-4">
          {/* Logo row */}
          <div className="flex items-center gap-3">
            <TVLogoMark />
            <div>
              <span
                className="text-white font-bold text-lg leading-none block"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                TradingView
              </span>
              <span
                className="text-[10px] font-mono uppercase tracking-widest mt-0.5 block"
                style={{ color: "#2962FF" }}
              >
                Official Charting Partner
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#B2B5BE" }}>
            Every chart, liquidity zone and order flow layout on Drawdown is built
            on TradingView. Access real-time tick data, multi-chart layouts, 100+
            built-in indicators, Pine Script backtesting, and webhook automation.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {["Real-time tick data", "Multi-chart layouts", "Pine Script", "Webhook alerts"].map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-none"
                style={{ borderColor: "#2A2E39", color: "#787B86", background: "transparent" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="shrink-0 flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto">
          <Link
            href="/go/tradingview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all duration-200 rounded-none"
            style={{ background: "#2962FF" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1E53E5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2962FF")}
          >
            Try TradingView Free
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <span
            className="text-[9px] font-mono text-center md:text-right"
            style={{ color: "#4A4F5E" }}
          >
            Disclosed affiliate · We use TradingView daily
          </span>
        </div>
      </div>
    </div>
  );
}
