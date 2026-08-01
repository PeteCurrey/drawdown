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
  }, []);

  return (
    <section className="w-full bg-[#0A0A0A] border-y border-white/10 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C8F135] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C8F135] font-bold">
              REAL-TIME MACRO INTELLIGENCE
            </span>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded ml-2 hidden sm:inline-block">
              FRED® & EIA® API Data
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8F135]" />
            <span>Institutional Central Bank & Commodity Feeds</span>
          </div>
        </div>

        {/* Ticker Cards Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ))
            : indicators.map((item) => {
                const isPositive = item.change > 0;
                const isNegative = item.change < 0;

                return (
                  <div
                    key={item.key}
                    className="bg-white/[0.03] border border-white/10 rounded-xl p-3 hover:border-[#C8F135]/40 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1">
                      <span className="truncate">{item.name}</span>
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 text-[#18B880] shrink-0" />
                      ) : isNegative ? (
                        <TrendingDown className="w-3 h-3 text-[#CE6969] shrink-0" />
                      ) : (
                        <Minus className="w-3 h-3 text-white/40 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-mono font-bold text-white tracking-tight group-hover:text-[#C8F135] transition-colors">
                        {item.value}
                        <span className="text-xs font-normal text-white/40 ml-0.5">{item.unit}</span>
                      </span>

                      <span
                        className={cn(
                          "text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded",
                          isPositive
                            ? "text-[#18B880] bg-[#18B880]/10"
                            : isNegative
                            ? "text-[#CE6969] bg-[#CE6969]/10"
                            : "text-white/40 bg-white/5"
                        )}
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
