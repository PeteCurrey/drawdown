"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, Layers, TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import { getPerformanceColor, GICS_SECTORS, StockItem } from "@/lib/data/stock-sectors";

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
  children?: any[];
  [key: string]: any;
}

/**
 * Custom SVG Content Renderer for Treemap Tiles
 * Handles multi-tier hierarchy:
 * Depth 1: Sector container boundary
 * Depth 2: Industry container
 * Depth 3 (or leaf): Stock tile with Ticker, % change, and Market Cap
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
    companyName,
    change1D,
    marketCap,
    price
  } = props;

  // Sector Header Box (Depth 1)
  if (depth === 1) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke="#27272A"
          strokeWidth={2}
        />
        {width > 80 && height > 24 && (
          <text
            x={x + 6}
            y={y + 14}
            fill="#A1A1AA"
            fontSize={11}
            fontWeight={600}
            fontFamily="monospace"
            className="select-none tracking-wider uppercase opacity-80"
          >
            {name}
          </text>
        )}
      </g>
    );
  }

  // Intermediate industry level or non-leaf without ticker
  if (!ticker && depth === 2) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke="#18181B"
          strokeWidth={1}
        />
      </g>
    );
  }

  // Stock Leaf Tile
  const isPositive = (change1D ?? 0) >= 0;
  const bgColor = getPerformanceColor(change1D);
  const formattedChange = (change1D ?? 0) > 0 ? `+${change1D?.toFixed(2)}%` : `${change1D?.toFixed(2)}%`;

  // Dynamic layout depending on tile size
  const showTicker = width >= 34 && height >= 24;
  const showChange = width >= 48 && height >= 42;
  const showCap = width >= 75 && height >= 60;
  const showPrice = width >= 90 && height >= 75;

  return (
    <g className="cursor-pointer group">
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill={bgColor}
        rx={3}
        className="transition-all duration-150 hover:brightness-125 stroke-[#09090B] stroke-[1.5]"
      />

      {showTicker && (
        <text
          x={x + width / 2}
          y={showChange ? y + height / 2 - (showCap ? 10 : 4) : y + height / 2 + 4}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={width > 80 ? 14 : 11}
          fontWeight={700}
          className="select-none pointer-events-none tracking-tight font-mono"
        >
          {ticker || name}
        </text>
      )}

      {showChange && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (showTicker ? (showCap ? 6 : 10) : 4)}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={width > 80 ? 12 : 10}
          fontWeight={600}
          className="select-none pointer-events-none opacity-95 font-mono"
        >
          {formattedChange}
        </text>
      )}

      {showCap && marketCap && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 20}
          textAnchor="middle"
          fill="#E4E4E7"
          fontSize={9.5}
          fontWeight={400}
          className="select-none pointer-events-none opacity-75 font-mono"
        >
          ${marketCap >= 1000 ? `${(marketCap / 1000).toFixed(1)}T` : `${marketCap}B`}
        </text>
      )}
    </g>
  );
};

export function StockSectorMap({
  initialData,
  rawStocks
}: {
  initialData: any[];
  rawStocks: StockItem[];
}) {
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [hoveredStock, setHoveredStock] = useState<StockItem | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (selectedSector === "All Sectors") {
      return initialData;
    }
    return initialData.filter(
      (sec) => sec.name.toLowerCase() === selectedSector.toLowerCase()
    );
  }, [initialData, selectedSector]);

  // Aggregate stats
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
        ? (activeStocks.reduce((sum, s) => sum + (s.change1D ?? 0), 0) /
            activeStocks.length).toFixed(2)
        : "0.00",
    [activeStocks]
  );

  return (
    <div className="flex flex-col w-full bg-[#0E0E10] border border-[#27272A] rounded-xl overflow-hidden shadow-2xl">
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 border-b border-[#27272A] bg-[#121214] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#18B880] animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              US Equities Sector Map
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              GICS S&P 500 Large-Cap
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Proportional market cap sizing with 1-day performance heat map
          </p>
        </div>

        {/* Quick summary stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
            <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Total Cap:</span>
            <span className="text-white font-semibold">
              ${(totalCap / 1000).toFixed(2)}T
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
            <BarChart2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">Avg Move:</span>
            <span
              className={`font-semibold ${
                Number(avgPerf) >= 0 ? "text-[#18B880]" : "text-[#EF4444]"
              }`}
            >
              {Number(avgPerf) > 0 ? `+${avgPerf}%` : `${avgPerf}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Sector filter pills */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-[#27272A] bg-[#0A0A0C] overflow-x-auto scrollbar-none">
        <span className="text-xs text-zinc-500 mr-2 uppercase tracking-wider font-mono">
          Filter:
        </span>
        {GICS_SECTORS.map((sector) => {
          const isSelected = selectedSector === sector;
          return (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#C8F135] text-black font-semibold shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {sector}
            </button>
          );
        })}
      </div>

      {/* Main Treemap Visualization */}
      <div className="relative w-full h-[620px] p-2 bg-[#09090B]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={filteredData}
            dataKey="size"
            aspectRatio={16 / 9}
            stroke="#000000"
            content={<CustomTreemapContent />}
            onMouseEnter={(node: any) => {
              if (node && node.ticker) {
                setHoveredStock({
                  ticker: node.ticker,
                  name: node.companyName || node.name,
                  sector: node.sector || "",
                  industry: node.industry || "",
                  marketCap: node.marketCap || node.size,
                  change1D: node.change1D,
                  price: node.price
                });
              }
            }}
            onMouseLeave={() => setHoveredStock(null)}
          />
        </ResponsiveContainer>

        {/* Hover inspector card overlay */}
        {hoveredStock && (
          <div className="absolute top-5 right-5 pointer-events-none z-20 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 p-3.5 rounded-xl shadow-2xl w-64 text-left font-sans animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base font-mono">
                {hoveredStock.ticker}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  (hoveredStock.change1D ?? 0) >= 0
                    ? "bg-green-950/80 text-green-400 border border-green-800/60"
                    : "bg-red-950/80 text-red-400 border border-red-800/60"
                }`}
              >
                {(hoveredStock.change1D ?? 0) > 0
                  ? `+${hoveredStock.change1D?.toFixed(2)}%`
                  : `${hoveredStock.change1D?.toFixed(2)}%`}
              </span>
            </div>
            <div className="text-xs text-zinc-300 font-medium truncate mt-0.5">
              {hoveredStock.name}
            </div>
            <div className="border-t border-zinc-800 my-2 pt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                  Market Cap
                </span>
                <span className="text-white font-mono font-semibold">
                  ${(hoveredStock.marketCap / 1000).toFixed(2)}T
                </span>
              </div>
              {hoveredStock.price && (
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                    Last Price
                  </span>
                  <span className="text-white font-mono font-semibold">
                    ${hoveredStock.price.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-zinc-500 block text-[10px] uppercase font-mono">
                  Industry
                </span>
                <span className="text-zinc-300 text-[11px] truncate block">
                  {hoveredStock.industry}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & status footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 bg-[#121214] border-t border-[#27272A] text-xs text-zinc-400 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[11px] uppercase font-mono">
            Performance:
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-[#B91C1C] text-white">
              -3%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#DC2626] text-white">
              -2%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#EF4444] text-white">
              -1%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#3F3F46] text-white">
              0%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#22C55E] text-white">
              +1%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#16A34A] text-white">
              +2%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#15803D] text-white">
              +3%+
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-zinc-500">
          Click or hover tile for financial details • Real-time mock/cached quotes
        </div>
      </div>
    </div>
  );
}
