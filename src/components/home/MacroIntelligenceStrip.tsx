"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Table } from "lucide-react";

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

const FALLBACK_INDICATORS: Indicator[] = [
  { key: "fed_rate", name: "Fed Funds Rate", value: 3.63, prevValue: 3.63, unit: "%", change: 0, direction: "flat", source: "FRED (FEDFUNDS)" },
  { key: "us_cpi", name: "US CPI YoY", value: 334.13, prevValue: 332.81, unit: "%", change: 1.32, direction: "up", source: "FRED (CPIAUCSL)" },
  { key: "uk_cpi", name: "UK CPI YoY", value: 136.10, prevValue: 135.60, unit: "%", change: 0.50, direction: "up", source: "FRED (GBRCPIALLMINMEI)" },
  { key: "boe_rate", name: "BoE Base Rate", value: 0.25, prevValue: 0.25, unit: "%", change: 0, direction: "flat", source: "FRED (BOERUKM)" },
  { key: "wti_oil", name: "WTI Crude Oil", value: 107.02, prevValue: 102.42, unit: "USD/bbl", change: 4.60, direction: "up", source: "EIA (RWTC)" },
  { key: "us_10y", name: "US 10Y Yield", value: 4.94, prevValue: 5.01, unit: "%", change: -0.07, direction: "down", source: "FRED (DGS10)" },
];

export function MacroIntelligenceStrip() {
  const [indicators, setIndicators] = useState<Indicator[]>(FALLBACK_INDICATORS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  useEffect(() => {
    async function loadIndicators() {
      try {
        const res = await fetch("/api/macro/indicators");
        if (res.ok) {
          const data = await res.json();
          if (data.list && Array.isArray(data.list) && data.list.length > 0) {
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
      className="w-full border-b py-5 md:py-6 overflow-hidden select-none"
      style={{ backgroundColor: "var(--surface-raised)", borderColor: "var(--border-subtle)" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span 
              className="text-[11px] font-mono font-bold uppercase tracking-wider" 
              style={{ color: "var(--text-primary)" }}
            >
              MACRO INTELLIGENCE
            </span>
            <span style={{ color: "var(--border-subtle)" }}>/</span>
            <span 
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "var(--text-tertiary)" }}
            >
              FRED® & EIA® API DATA
            </span>
          </div>

          {/* View Toggle: Dense Table (Default / Bloomberg-style) vs Flat Cards */}
          <div 
            className="flex items-center border p-0.5 rounded-[4px]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-base)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[3px] transition-colors ${
                viewMode === "table"
                  ? "font-semibold"
                  : "hover:text-[var(--text-primary)]"
              }`}
              style={{
                backgroundColor: viewMode === "table" ? "var(--surface-raised)" : "transparent",
                color: viewMode === "table" ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
              }}
              title="Dense Financial Table"
            >
              <Table className="w-3 h-3" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[3px] transition-colors ${
                viewMode === "cards"
                  ? "font-semibold"
                  : "hover:text-[var(--text-primary)]"
              }`}
              style={{
                backgroundColor: viewMode === "cards" ? "var(--surface-raised)" : "transparent",
                color: viewMode === "cards" ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: viewMode === "cards" ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
              }}
              title="Flat Metric Cards"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Dense Table View (Bloomberg / IG style) */}
        {viewMode === "table" ? (
          <div 
            className="w-full border rounded-[6px] overflow-hidden"
            style={{ 
              borderColor: "var(--border-subtle)", 
              backgroundColor: "var(--surface-base)",
              boxShadow: "none"
            }}
          >
            {/* Table Column Headers */}
            <div 
              className="grid grid-cols-12 px-4 py-2 border-b text-[10px] font-mono uppercase tracking-wider font-semibold"
              style={{ 
                borderColor: "var(--border-subtle)", 
                backgroundColor: "var(--surface-raised)",
                color: "var(--text-tertiary)"
              }}
            >
              <div className="col-span-5 sm:col-span-4 text-left">Indicator</div>
              <div className="hidden sm:block sm:col-span-2 text-right">Previous</div>
              <div className="col-span-4 sm:col-span-3 text-right">Latest Value</div>
              <div className="col-span-3 sm:col-span-3 text-right">Net Delta</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {indicators.map((item) => {
                const isPositive = item.change > 0;
                const isNegative = item.change < 0;
                const isZero = item.change === 0;

                const trendColor = isPositive 
                  ? "var(--market-up)" 
                  : isNegative 
                  ? "var(--market-down)" 
                  : "var(--text-tertiary)";

                const glyph = isPositive ? "▲ " : isNegative ? "▼ " : "";
                const formattedDelta = isZero ? "0.00" : `${isPositive ? "+" : ""}${item.change.toFixed(2)}`;

                const formattedValue = item.unit === "USD/bbl"
                  ? `$${item.value.toFixed(2)}`
                  : `${item.value.toFixed(2)} ${item.unit}`;

                const formattedPrev = item.unit === "USD/bbl"
                  ? `$${item.prevValue.toFixed(2)}`
                  : `${item.prevValue.toFixed(2)} ${item.unit}`;

                return (
                  <div
                    key={item.key}
                    className="grid grid-cols-12 px-4 py-2.5 items-center transition-colors hover:bg-[var(--surface-raised)]/60"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    {/* Indicator Name & Data Source */}
                    <div className="col-span-5 sm:col-span-4 flex items-baseline gap-2">
                      <span 
                        className="font-mono text-xs font-semibold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </span>
                      <span 
                        className="hidden md:inline-block font-mono text-[9.5px] uppercase tracking-wider"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {item.source}
                      </span>
                    </div>

                    {/* Previous (Tabular Mono, Right-Aligned) */}
                    <div 
                      className="hidden sm:block sm:col-span-2 text-right font-mono text-xs tabular-nums"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {formattedPrev}
                    </div>

                    {/* Latest Value (Tabular Mono, Right-Aligned) */}
                    <div 
                      className="col-span-4 sm:col-span-3 text-right font-mono text-xs font-bold tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formattedValue}
                    </div>

                    {/* Net Delta (Tabular Mono, Color-Only, No Pill, No Fill, Right-Aligned) */}
                    <div 
                      className="col-span-3 sm:col-span-3 text-right font-mono text-xs font-medium tabular-nums"
                      style={{ color: trendColor }}
                    >
                      {glyph}{formattedDelta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Flat Cards Grid (6 items, sharp 6px corners, zero shadow, right-aligned numbers, color-only delta) */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {indicators.map((item) => {
              const isPositive = item.change > 0;
              const isNegative = item.change < 0;
              const isZero = item.change === 0;

              const trendColor = isPositive 
                ? "var(--market-up)" 
                : isNegative 
                ? "var(--market-down)" 
                : "var(--text-tertiary)";

              const glyph = isPositive ? "▲ " : isNegative ? "▼ " : "";
              const formattedDelta = isZero ? "0.00" : `${isPositive ? "+" : ""}${item.change.toFixed(2)}`;

              const formattedValue = item.unit === "USD/bbl"
                ? `$${item.value.toFixed(2)}`
                : `${item.value.toFixed(2)}${item.unit}`;

              return (
                <div
                  key={item.key}
                  className="border p-3 flex flex-col justify-between"
                  style={{
                    backgroundColor: "var(--surface-base)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: "6px",
                    boxShadow: "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="font-mono text-[10px] font-medium uppercase tracking-wider truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Right-Aligned Numeric Content */}
                  <div className="flex flex-col items-end">
                    <span 
                      className="text-sm font-mono tabular-nums font-bold tracking-tight text-right"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formattedValue}
                    </span>

                    {/* Delta: Pure typographic color, no pill, no fill, right-aligned */}
                    <span
                      className="text-[10.5px] font-mono tabular-nums font-medium text-right mt-0.5"
                      style={{ color: trendColor }}
                    >
                      {glyph}{formattedDelta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
