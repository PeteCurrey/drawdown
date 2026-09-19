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
      style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 animate-pulse" style={{ backgroundColor: "var(--market-up)", borderRadius: "var(--radius-md)" }} />
            <span className="type-label uppercase font-bold" style={{ color: "var(--text-primary)" }}>
              REAL-TIME MACRO INTELLIGENCE
            </span>
            <span 
              className="text-[9px] font-mono uppercase tracking-widest border px-2 py-0.5 ml-2 hidden sm:inline-block"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--surface-base)",
                color: "var(--text-secondary)"
              }}
            >
              FRED® & EIA® API Data
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "var(--text-secondary)" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
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
                    style={{ backgroundColor: "var(--surface-base)", borderColor: "var(--border-subtle)", borderRadius: "var(--radius-md)" }}
                  />
                ))
            : indicators.map((item) => {
                const isPositive = item.change > 0;
                const isNegative = item.change < 0;

                const trendColor = isPositive 
                  ? "var(--market-up)" 
                  : isNegative 
                  ? "var(--market-down)" 
                  : "var(--text-secondary)";

                const trendBg = isPositive 
                  ? "color-mix(in srgb, var(--market-up) 10%, transparent)" 
                  : isNegative 
                  ? "color-mix(in srgb, var(--market-down) 10%, transparent)" 
                  : "var(--surface-raised)";

                const trendBorder = isPositive
                  ? "color-mix(in srgb, var(--market-up) 25%, transparent)"
                  : isNegative
                  ? "color-mix(in srgb, var(--market-down) 25%, transparent)"
                  : "var(--border-subtle)";

                return (
                  <div
                    key={item.key}
                    className="border p-3.5 transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "var(--surface-raised)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--elev-1)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2" style={{ color: "var(--text-secondary)" }}>
                      <span className="truncate pr-1 font-medium">{item.name}</span>
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--market-up)" }} />
                      ) : isNegative ? (
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--market-down)" }} />
                      ) : (
                        <Minus className="w-3.5 h-3.5 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-[15px] font-mono tabular-nums font-bold tracking-tight transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
                        {item.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })}
                        <span className="text-[10px] font-normal ml-0.5" style={{ color: "var(--text-secondary)" }}>{item.unit}</span>
                      </span>

                      <span
                        className="text-[9px] font-mono tabular-nums font-semibold px-1.5 py-0.5 border"
                        style={{
                          color: trendColor,
                          backgroundColor: trendBg,
                          borderColor: trendBorder,
                          borderRadius: "var(--radius-sm)"
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
