"use client";

import { ScreenerRow } from "@/lib/screener";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from "lucide-react";

interface ScreenerHeatmapProps {
  instruments: ScreenerRow[];
  onSelect?: (instrument: ScreenerRow) => void;
}

export function ScreenerHeatmap({ instruments, onSelect }: ScreenerHeatmapProps) {
  if (instruments.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-mkt-bd/50">
        <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
          No instruments match this filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {instruments.map((item) => {
        const change = item.changePct ?? 0;
        const isBullish = change > 0;
        const isBearish = change < 0;
        const absChange = Math.abs(change);

        // Intensity background tint based on magnitude
        let bgIntensity = "bg-white";
        if (item.feed_offline) {
          bgIntensity = "bg-amber-500/5";
        } else if (isBullish) {
          if (absChange >= 2.0) bgIntensity = "bg-profit/15 hover:bg-profit/20";
          else if (absChange >= 0.8) bgIntensity = "bg-profit/10 hover:bg-profit/15";
          else bgIntensity = "bg-profit/5 hover:bg-profit/10";
        } else if (isBearish) {
          if (absChange >= 2.0) bgIntensity = "bg-loss/15 hover:bg-loss/20";
          else if (absChange >= 0.8) bgIntensity = "bg-loss/10 hover:bg-loss/15";
          else bgIntensity = "bg-loss/5 hover:bg-loss/10";
        }

        return (
          <div
            key={item.slug}
            onClick={() => onSelect?.(item)}
            className={cn(
              "group p-4 border border-mkt-bd hover:border-mkt-bds transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[120px]",
              bgIntensity
            )}
          >
            {/* Top Indicator Strip */}
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-1",
                item.feed_offline
                  ? "bg-amber-500"
                  : isBullish
                  ? "bg-profit"
                  : isBearish
                  ? "bg-loss"
                  : "bg-mkt-bd"
              )}
            />

            {/* Header: Symbol & Direction Icon */}
            <div className="flex justify-between items-start gap-1">
              <div>
                <h4 className="font-mono font-bold text-xs text-mkt-ink group-hover:text-accent transition-colors">
                  {item.displayPair}
                </h4>
                <span className="text-[8px] font-mono text-mkt-i4 uppercase tracking-wider block">
                  {item.category}
                </span>
              </div>
              <div
                className={cn(
                  "w-5 h-5 flex items-center justify-center border text-[10px]",
                  item.feed_offline
                    ? "border-amber-500/30 text-amber-500"
                    : isBullish
                    ? "border-profit/30 text-mkt-grn bg-profit/5"
                    : isBearish
                    ? "border-loss/30 text-red-500 bg-loss/5"
                    : "border-mkt-bd text-mkt-i4"
                )}
              >
                {item.feed_offline ? (
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                ) : isBullish ? (
                  <ArrowUpRight className="w-3 h-3 text-profit" />
                ) : isBearish ? (
                  <ArrowDownRight className="w-3 h-3 text-loss" />
                ) : (
                  <Minus className="w-3 h-3 text-mkt-i4" />
                )}
              </div>
            </div>

            {/* Price & Change */}
            <div className="mt-3 pt-2 border-t border-mkt-bd/30 flex justify-between items-end">
              <div>
                <span className="text-[8px] font-mono text-mkt-i4 block uppercase">Price</span>
                <span className="text-xs font-mono font-bold text-mkt-ink">
                  {item.feed_offline
                    ? "—"
                    : item.price !== null
                    ? item.price >= 1000
                      ? item.price.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 2 })
                      : item.price >= 10
                      ? item.price.toFixed(2)
                      : item.price.toFixed(4)
                    : "—"}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "text-xs font-mono font-black",
                    item.feed_offline
                      ? "text-amber-500 text-[9px]"
                      : isBullish
                      ? "text-mkt-grn"
                      : isBearish
                      ? "text-red-500"
                      : "text-mkt-i4"
                  )}
                >
                  {item.feed_offline
                    ? "OFFLINE"
                    : item.changePct !== null
                    ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
