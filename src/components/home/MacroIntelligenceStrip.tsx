"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Indicator {
  key: string;
  name: string;
  value: number;
  prevValue: number;
  unit: string;
  change: number;
  direction: "up" | "down" | "flat";
  source: string;
}

export function MacroIntelligenceStrip() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIndicators() {
      try {
        const res = await fetch("/api/macro/indicators");
        if (res.ok) {
          const data = await res.json();
          if (data.list) {
            setIndicators(data.list);
          }
        }
      } catch (err) {
        console.error("Failed to load macro indicators:", err);
      } finally {
        setLoading(false);
      }
    }
    loadIndicators();
    const interval = setInterval(loadIndicators, 60000); // Poll live macro data every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="w-full border-b py-8 overflow-hidden select-none"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-none bg-mkt-grn animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold" style={{ color: "var(--ink-950)" }}>
              REAL-TIME MACRO INTELLIGENCE
            </span>
            <span 
              className="text-[9px] font-mono uppercase tracking-widest border px-2 py-0.5 ml-2 hidden sm:inline-block"
              style={{
                borderColor: "var(--line-200)",
                backgroundColor: "var(--paper-0)",
                color: "var(--graphite-600)"
              }}
            >
              FRED® & EIA® API Data
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "var(--graphite-600)" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--signal-navy)" }} />
            <span>Institutional Central Bank & Commodity Feeds</span>
          </div>
        </div>

        {/* Ticker Cards Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div 
                    key={i} 
                    className="h-20 animate-pulse border"
                    style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
                  />
                ))
            : indicators.map((item) => {
                const isPositive = item.change > 0;
                const isNegative = item.change < 0;

                const trendColor = isPositive 
                  ? "var(--mkt-grn)" 
                  : isNegative 
                  ? "var(--mkt-red)" 
                  : "var(--graphite-600)";

                const trendBg = isPositive 
                  ? "var(--mkt-gbg)" 
                  : isNegative 
                  ? "var(--mkt-rbg)" 
                  : "var(--paper-100)";

                const trendBorder = isPositive
                  ? "var(--mkt-gbd)"
                  : isNegative
                  ? "var(--mkt-rbd)"
                  : "var(--line-200)";

                return (
                  <div
                    key={item.key}
                    className="border p-3.5 transition-all duration-300 group flex flex-col justify-between"
                    style={{
                      backgroundColor: "var(--paper-0)",
                      borderColor: "var(--line-200)",
                      borderRadius: 0,
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2" style={{ color: "var(--graphite-600)" }}>
                      <span className="truncate pr-1">{item.name}</span>
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--mkt-grn)" }} />
                      ) : isNegative ? (
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--mkt-red)" }} />
                      ) : (
                        <Minus className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-[15px] font-mono font-bold tracking-tight transition-colors duration-300" style={{ color: "var(--ink-950)" }}>
                        {item.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })}
                        <span className="text-[10px] font-normal ml-0.5" style={{ color: "var(--graphite-600)" }}>{item.unit}</span>
                      </span>

                      <span
                        className="text-[9px] font-mono font-semibold px-1.5 py-0.5 border"
                        style={{
                          color: trendColor,
                          backgroundColor: trendBg,
                          borderColor: trendBorder,
                          borderRadius: 0
                        }}
                      >
                        {isPositive ? `+${item.change}` : item.change}
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}

