"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ScreenerRow } from "@/lib/screener";
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface MarketPulseBarProps {
  pulse: ScreenerRow[];
}

function formatPrice(n: number | null | undefined, slug: string): string {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const s = slug.toUpperCase();
  const decimals = s.includes("JPY") ? 3 : s.includes("XAU") || s.includes("BTC") || s.includes("ETH") || s.includes("SPX") || s.includes("NDX") ? 2 : 5;
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function MarketPulseBar({ pulse }: MarketPulseBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!pulse || pulse.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8E6E1] bg-white p-4 text-center text-xs text-[#888882]">
        Live market quotes synchronizing from cache...
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Scroll controls */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-[#555550] shadow-md transition hover:bg-[#F7F7F5] opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-[#555550] shadow-md transition hover:bg-[#F7F7F5] opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Horizontal Strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pulse.map((item) => {
          const isUp = (item.changePct ?? 0) > 0;
          const isDown = (item.changePct ?? 0) < 0;
          const isZero = !isUp && !isDown;

          return (
            <Link
              key={item.slug}
              href={`/dashboard/market-intelligence?symbol=${item.slug}`}
              className="flex-shrink-0 flex items-center justify-between gap-4 rounded-xl border border-[#E8E6E1] bg-white px-3.5 py-2.5 transition hover:border-[#F9771D]/40 hover:shadow-xs min-w-[200px]"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {item.displayPair}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded font-medium bg-[#F0EEE9] text-[#888882]">
                    {item.category}
                  </span>
                </div>

                <div className="font-mono text-sm font-semibold text-[#1A1A1A]">
                  {formatPrice(item.price, item.slug)}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                {item.feed_offline || item.price === null ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    <AlertCircle className="h-2.5 w-2.5" />
                    <span>OFFLINE</span>
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-mono font-medium ${
                      isUp ? "text-[#18B880]" : isDown ? "text-[#CE6969]" : "text-[#888882]"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : isDown ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {item.changePct !== null && item.changePct !== undefined
                      ? `${item.changePct > 0 ? "+" : ""}${item.changePct.toFixed(2)}%`
                      : "—"}
                  </span>
                )}

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                    item.bias === "BULLISH"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.bias === "BEARISH"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {item.bias}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
