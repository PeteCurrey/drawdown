"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Clock, ArrowRight, TrendingUp } from "lucide-react";

const INSTRUMENT_CARDS = [
  { symbol: "GBP/USD", type: "Forex", drift: "Bullish", indicator: "▲ +0.32%" },
  { symbol: "XAU/USD", type: "Metals", drift: "Bullish", indicator: "▲ +1.15%" },
  { symbol: "UK100", type: "Indices", drift: "Bearish", indicator: "▼ -0.42%" },
  { symbol: "BTC/USD", type: "Crypto", drift: "Bullish", indicator: "▲ +2.60%" }
];

export function MarketCallPromoSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section 
      className="w-full border-b select-none overflow-hidden"
      style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", paddingTop: "var(--section-y-desktop)", paddingBottom: "var(--section-y-desktop)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          <div className="lg:col-span-6 space-y-4">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase rounded-md"
              style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-subtle)", color: "var(--accent)" }}
            >
              <Award className="w-3.5 h-3.5" /> WEEKLY FORECAST CHALLENGE
            </span>
            <h2 
              className="type-display-lg font-normal"
              style={{ color: "var(--text-primary)" }}
            >
              The Weekly <br />
              <span style={{ color: "var(--accent)" }}>Market Call.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-6 space-y-6 lg:border-l lg:pl-10" style={{ borderColor: "var(--border-subtle)" }}>
            <p 
              className="type-body-lg font-normal"
              style={{ color: "var(--text-secondary)" }}
            >
              Establish and record your directional forecast on primary global macro instruments each week. Quantify your market anticipation skill, monitor your consistent bias against live settlement data, and earn professional recognition on our scoreboard.
            </p>
            <div className="flex items-center gap-6 text-[11px] font-mono uppercase text-sans" style={{ color: "var(--text-secondary)" }}>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" style={{ color: "var(--market-up)" }} /> Tuesday locks</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" style={{ color: "var(--market-flat)" }} /> Friday resolution</span>
            </div>
          </div>
        </div>

        {/* Assets Matrix Demo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {INSTRUMENT_CARDS.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.symbol}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="p-6 border flex flex-col justify-between h-48 transition-all duration-300 relative animate-in fade-in"
                style={{
                  borderColor: isHovered ? "var(--accent)" : "var(--border-subtle)",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: isHovered ? "0 0 24px rgba(10, 37, 64, 0.08)" : "none",
                }}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[13px] font-sans font-bold uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>
                      {item.symbol}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border" style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono border-t pt-4" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
                  <span>Forecast Drift</span>
                  <span className="font-bold">{item.drift}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lower Banner: Forecast challenge details & Buttons */}
        <div 
          className="border p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-raised)", borderRadius: "var(--radius-md)" }}
        >
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Award className="w-4 h-4" style={{ color: "var(--market-up)" }} /> Reward: 1 Month of Free Edge Tier (£99/mo value)
            </h4>
            <p className="text-xs font-sans max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              The highest-scoring participant with the highest forecasting accuracy on each week's scoreboard automatically earns our prized "Verified Caller" badge and premium Edge Tier platform access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/market-call"
              className="px-6 py-3 border font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors"
              style={{ borderColor: "var(--text-primary)", color: "var(--text-primary)", borderRadius: "var(--radius-md)" }}
            >
              Challenge Guidelines
            </Link>
            
            <Link
              href="/dashboard/market-call"
              className="px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-1.5"
              style={{ backgroundColor: "var(--accent)", color: "var(--surface-base)", borderRadius: "var(--radius-md)" }}
            >
              Submit Your Forecast <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
