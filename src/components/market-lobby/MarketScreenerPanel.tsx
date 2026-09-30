"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ScreenerRow, MarketCategory } from "@/lib/screener";
import { Search, SlidersHorizontal, Lock, ArrowUpRight, TrendingUp, TrendingDown, Minus, Bookmark } from "lucide-react";
import { LobbyUpgradeGate } from "./LobbyUpgradeGate";

interface MarketScreenerPanelProps {
  rows: ScreenerRow[];
  canAccessScanner: boolean;
  canAccessSavedScreens: boolean;
}

const CATEGORIES: { label: string; value: MarketCategory | "all" }[] = [
  { label: "All Markets", value: "all" },
  { label: "Forex", value: "forex" },
  { label: "Commodities", value: "commodities" },
  { label: "Indices", value: "indices" },
  { label: "Crypto", value: "crypto" },
  { label: "UK Equities", value: "stocks-uk" },
  { label: "US Equities", value: "stocks-us" },
];

function formatPrice(n: number | null | undefined, slug: string): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const s = slug.toUpperCase();
  const decimals = s.includes("JPY") ? 3 : s.includes("XAU") || s.includes("BTC") || s.includes("ETH") || s.includes("SPX") || s.includes("NDX") ? 2 : 5;
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function MarketScreenerPanel({
  rows,
  canAccessScanner,
  canAccessSavedScreens,
}: MarketScreenerPanelProps) {
  const [activeCategory, setActiveCategory] = useState<MarketCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesCategory = activeCategory === "all" || row.category === activeCategory;
      const matchesSearch =
        row.displayPair.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [rows, activeCategory, searchQuery]);

  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Bar: Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFF4EC] text-[#F9771D]">
              <SlidersHorizontal className="h-3 w-3" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A]">
              Cross-Asset Market Screener
            </h2>
          </div>
          <p className="text-xs text-[#555550]">
            Track price movements, RSI momentum, and 4-pillar algorithmic bias in real time.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888882]" />
          <input
            type="text"
            placeholder="Search pair or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E8E6E1] bg-[#F7F7F5] pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#888882] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F9771D]"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition ${
              activeCategory === cat.value
                ? "bg-[#1A1A1A] text-white font-semibold"
                : "bg-[#F7F7F5] text-[#555550] hover:bg-[#E8E6E1]/60"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E8E6E1] text-[10px] uppercase font-bold text-[#888882] tracking-wider">
              <th className="py-2.5 px-3">Instrument</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Price</th>
              <th className="py-2.5 px-3 text-right">24h Change</th>
              <th className="py-2.5 px-3 text-center">RSI (1H)</th>
              <th className="py-2.5 px-3 text-center">Directional Bias</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E1]/60">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#888882]">
                  No instruments found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isUp = (row.changePct ?? 0) > 0;
                const isDown = (row.changePct ?? 0) < 0;
                const rsi = row.rsi;

                return (
                  <tr key={row.slug} className="hover:bg-[#F7F7F5]/80 transition">
                    {/* Instrument */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/market-intelligence?symbol=${row.slug}`}
                          className="font-bold text-[#1A1A1A] hover:text-[#F9771D] transition"
                        >
                          {row.displayPair}
                        </Link>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="rounded bg-[#F0EEE9] px-2 py-0.5 text-[9px] uppercase font-semibold text-[#888882]">
                        {row.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-semibold text-[#1A1A1A]">
                      {formatPrice(row.price, row.slug)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-3 text-right font-mono">
                      {row.feed_offline || row.price === null ? (
                        <span className="text-[10px] text-[#888882]">Offline</span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-0.5 font-medium ${
                            isUp ? "text-[#18B880]" : isDown ? "text-[#CE6969]" : "text-[#888882]"
                          }`}
                        >
                          {isUp ? "+" : ""}
                          {row.changePct !== null && row.changePct !== undefined
                            ? `${row.changePct.toFixed(2)}%`
                            : "—"}
                        </span>
                      )}
                    </td>

                    {/* RSI */}
                    <td className="py-3 px-3 text-center">
                      {rsi !== null && rsi !== undefined ? (
                        <span
                          className={`font-mono font-medium px-2 py-0.5 rounded text-[11px] ${
                            rsi >= 70
                              ? "bg-rose-50 text-rose-700 font-bold"
                              : rsi <= 30
                              ? "bg-emerald-50 text-emerald-700 font-bold"
                              : "bg-[#F0EEE9] text-[#555550]"
                          }`}
                        >
                          {rsi.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[#888882]">—</span>
                      )}
                    </td>

                    {/* Bias */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          row.bias === "BULLISH"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : row.bias === "BEARISH"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {row.bias}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/market-intelligence?symbol=${row.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#E8E6E1] bg-white px-2.5 py-1 text-[11px] font-medium text-[#1A1A1A] hover:border-[#F9771D] hover:text-[#F9771D] shadow-2xs transition"
                      >
                        <span>Analyze</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Free Tier Upgrade Prompt if restricted */}
      {!canAccessScanner && (
        <LobbyUpgradeGate
          compact
          title="Showing 10 of 38 Instruments"
          description="Upgrade to Core to unlock full FX crosses, global indices, UK/US equities, and custom saved screens."
          ctaText="Unlock 38 Instruments — £24.99/mo"
          ctaHref="/dashboard/profile?tab=billing"
        />
      )}
    </div>
  );
}
