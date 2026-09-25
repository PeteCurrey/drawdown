"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import {
  Layers,
  TrendingUp,
  DollarSign,
  BarChart2,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  getPerformanceColor,
  GICS_SECTORS,
  DATA_LAST_UPDATED,
  StockItem,
} from "@/lib/data/stock-sectors";

// ─── SVG Tile Renderer ────────────────────────────────────────────────────────

interface CustomNodeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  depth?: number;
  name?: string;
  ticker?: string;
  companyName?: string;
  marketCap?: number;
  change1D?: number;
  price?: number;
  children?: unknown[];
  [key: string]: unknown;
}

/**
 * Custom SVG content renderer for Recharts Treemap.
 * Depth 1: Sector label border
 * Depth 2: Industry grouping
 * Leaf (depth ≥ 2 with ticker): Stock tile
 *
 * ⚠️  change1D shown here is ILLUSTRATIVE — see static data disclaimer.
 */
const CustomTreemapContent = (props: CustomNodeProps) => {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    depth = 0,
    name,
    ticker,
    change1D,
    marketCap,
  } = props;

  // Sector boundary — label strip at top
  if (depth === 1) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke="#CBD5E1"   // slate-300
          strokeWidth={1.5}
        />
        {width > 80 && height > 22 && (
          <text
            x={x + 6}
            y={y + 14}
            fill="#64748B"    // slate-500
            fontSize={10}
            fontWeight={600}
            fontFamily="monospace"
          >
            {name}
          </text>
        )}
      </g>
    );
  }

  // Industry grouping (no ticker)
  if (!ticker && depth === 2) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke="#E2E8F0"   // slate-200
          strokeWidth={1}
        />
      </g>
    );
  }

  // Stock leaf tile
  const { bgColor, textColor } = getPerformanceColor(change1D);
  const isPositive = (change1D ?? 0) > 0;
  const changeStr =
    (change1D ?? 0) > 0
      ? `+${change1D?.toFixed(2)}%`
      : `${change1D?.toFixed(2)}%`;

  const showTicker  = width >= 34 && height >= 24;
  const showChange  = width >= 50 && height >= 44;
  const showCap     = width >= 78 && height >= 62;

  return (
    <g className="cursor-pointer">
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill={bgColor}
        stroke="#ffffff"
        strokeWidth={1}
        rx={2}
      />

      {showTicker && (
        <text
          x={x + width / 2}
          y={showChange ? y + height / 2 - (showCap ? 10 : 4) : y + height / 2 + 4}
          textAnchor="middle"
          fill={textColor}
          fontSize={width > 80 ? 13 : 10}
          fontWeight={700}
          fontFamily="monospace"
        >
          {ticker || name}
        </text>
      )}

      {showChange && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (showTicker ? (showCap ? 6 : 10) : 4)}
          textAnchor="middle"
          fill={textColor}
          fontSize={width > 80 ? 11 : 9}
          fontWeight={600}
          fontFamily="monospace"
          opacity={0.9}
        >
          {changeStr}
        </text>
      )}

      {showCap && marketCap && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 20}
          textAnchor="middle"
          fill={textColor}
          fontSize={9}
          fontWeight={400}
          fontFamily="monospace"
          opacity={0.65}
        >
          {marketCap >= 1000
            ? `$${(marketCap / 1000).toFixed(1)}T`
            : `$${marketCap}B`}
        </text>
      )}
    </g>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function StockSectorMap({
  initialData,
  rawStocks,
}: {
  initialData: unknown[];
  rawStocks: StockItem[];
}) {
  const [selectedSector, setSelectedSector] = useState("All Sectors");

  const filteredData = useMemo(() => {
    if (selectedSector === "All Sectors") return initialData;
    return (initialData as { name: string }[]).filter(
      (sec) => sec.name.toLowerCase() === selectedSector.toLowerCase()
    );
  }, [initialData, selectedSector]);

  const activeStocks = useMemo(() => {
    if (selectedSector === "All Sectors") return rawStocks;
    return rawStocks.filter(
      (s) => s.sector.toLowerCase() === selectedSector.toLowerCase()
    );
  }, [rawStocks, selectedSector]);

  const totalCap = useMemo(
    () => activeStocks.reduce((sum, s) => sum + s.marketCap, 0),
    [activeStocks]
  );
  const avgPerf = useMemo(
    () =>
      activeStocks.length > 0
        ? (
            activeStocks.reduce((sum, s) => sum + (s.change1D ?? 0), 0) /
            activeStocks.length
          ).toFixed(2)
        : "0.00",
    [activeStocks]
  );
  const gainers = useMemo(
    () => activeStocks.filter((s) => (s.change1D ?? 0) > 0).length,
    [activeStocks]
  );
  const losers = useMemo(
    () => activeStocks.filter((s) => (s.change1D ?? 0) < 0).length,
    [activeStocks]
  );

  return (
    <div className="flex flex-col w-full bg-white border border-mkt-bd shadow-sm">

      {/* ── Static data disclaimer banner ───────────────────────────── */}
      <div className="flex items-start gap-3 px-5 py-3.5 border-b border-amber-200 bg-amber-50/80">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-mono text-amber-800 leading-relaxed">
          <strong className="font-bold">Illustrative reference data — not live market data.</strong>{" "}
          Sector and industry classifications are GICS structural reference (accurate).
          Market-cap tile sizing is approximate (~{DATA_LAST_UPDATED}).
          Performance figures (% change) are <strong>static placeholders</strong> — they do not reflect
          real or historical daily moves. Live equity data requires additional API integration
          pending SC9 credit-budget review.
        </p>
      </div>

      {/* ── Header controls bar ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-4 border-b border-mkt-bd gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-mkt-i3" />
            <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
              US Equities Sector Map
            </h2>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-mkt-i3 border border-mkt-bd uppercase tracking-wider">
              GICS Reference
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 uppercase tracking-wider">
              Illustrative Data
            </span>
          </div>
          <p className="text-[10px] font-mono text-mkt-i4 mt-1">
            Proportional market-cap sizing · Sector &amp; industry classification (GICS) · Performance figures are illustrative only
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-mkt-i3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-mkt-bd">
            <DollarSign className="w-3 h-3 text-mkt-i4" />
            <span>Approx Cap:</span>
            <span className="font-bold text-mkt-ink">
              ${(totalCap / 1000).toFixed(1)}T
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-mkt-bd">
            <BarChart2 className="w-3 h-3 text-mkt-i4" />
            <span>Avg (Illus.):</span>
            <span
              className={`font-bold ${
                Number(avgPerf) >= 0 ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {Number(avgPerf) > 0 ? `+${avgPerf}%` : `${avgPerf}%`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-mkt-bd">
            <TrendingUp className="w-3 h-3 text-mkt-i4" />
            <span className="text-emerald-700 font-bold">{gainers} illus. ↑</span>
            <span className="text-red-700 font-bold">{losers} illus. ↓</span>
          </div>
        </div>
      </div>

      {/* ── Sector filter pills ──────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-mkt-bd bg-slate-50/50 overflow-x-auto scrollbar-none">
        <span className="text-[9px] font-mono uppercase tracking-widest text-mkt-i4 mr-1 shrink-0">
          Sector:
        </span>
        {GICS_SECTORS.map((sector) => {
          const isSelected = selectedSector === sector;
          return (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-2.5 py-1 text-[10px] font-mono font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-mkt-i2 border-mkt-bd hover:text-mkt-ink hover:bg-slate-100"
              }`}
            >
              {sector}
            </button>
          );
        })}
      </div>

      {/* ── Treemap ──────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 600 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={filteredData}
            dataKey="size"
            aspectRatio={16 / 9}
            stroke="#ffffff"
            content={<CustomTreemapContent />}
          />
        </ResponsiveContainer>
      </div>

      {/* ── Footer disclaimer ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 justify-between px-5 py-2.5 border-t border-mkt-bd bg-slate-50/50 text-[9px] font-mono text-mkt-i4">
        <span className="flex items-center gap-1.5">
          <Info className="w-3 h-3 text-amber-500" />
          Performance figures are illustrative only — not live, historical, or accurate market data.
          Sector/industry: GICS structural classification (accurate).
          Market-cap sizing: approximate reference (~{DATA_LAST_UPDATED}).
        </span>
        <span className="flex items-center gap-1.5 shrink-0 text-amber-600 font-semibold">
          <AlertTriangle className="w-3 h-3" />
          Static reference snapshot · Last updated: {DATA_LAST_UPDATED}
        </span>
      </div>
    </div>
  );
}
