"use client";

import { useState, useEffect, useMemo } from "react";
import { ScreenerInstrument } from "@/lib/screener";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CorrelationMatrixProps {
  instruments: Array<{
    scannerSlug: string;
    displayPair: string;
    tvSymbol?: string;
    category?: any;
  }>;
  canAccessEdge: boolean;
}

// Pearson correlation coefficient
function calculatePearson(seriesA: number[], seriesB: number[]): number {
  const n = Math.min(seriesA.length, seriesB.length);
  if (n < 5) return 0;

  const a = seriesA.slice(-n);
  const b = seriesB.slice(-n);

  const meanA = a.reduce((sum, v) => sum + v, 0) / n;
  const meanB = b.reduce((sum, v) => sum + v, 0) / n;

  let num = 0;
  let denA = 0;
  let denB = 0;

  for (let i = 0; i < n; i++) {
    const diffA = a[i] - meanA;
    const diffB = b[i] - meanB;
    num += diffA * diffB;
    denA += diffA * diffA;
    denB += diffB * diffB;
  }

  const denom = Math.sqrt(denA * denB);
  if (denom === 0) return 0;
  return num / denom;
}

export function CorrelationMatrix({ instruments, canAccessEdge }: CorrelationMatrixProps) {
  const [lookback, setLookback] = useState<20 | 60 | 120>(60);
  const [loading, setLoading] = useState(false);
  const [historyMap, setHistoryMap] = useState<Record<string, number[]>>({});

  // Limit matrix to max 12 items at once for readable grid sizing
  const displayInstruments = useMemo(() => instruments.slice(0, 12), [instruments]);

  useEffect(() => {
    if (!canAccessEdge || displayInstruments.length === 0) return;

    let active = true;
    async function loadHistories() {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          displayInstruments.map(async (inst) => {
            const res = await fetch(
              `/api/market/history?symbol=${encodeURIComponent(inst.scannerSlug)}&interval=1h&outputsize=${lookback}`
            );
            if (!res.ok) return { slug: inst.scannerSlug, closes: [] };
            const bars = await res.json();
            const closes = Array.isArray(bars) ? bars.map((b: any) => Number(b.close)).filter(Boolean) : [];
            return { slug: inst.scannerSlug, closes };
          })
        );

        if (!active) return;
        const newMap: Record<string, number[]> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value.closes.length > 0) {
            newMap[r.value.slug] = r.value.closes;
          }
        });
        setHistoryMap(newMap);
      } catch (err) {
        console.error("Failed to load correlation histories:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistories();
    return () => {
      active = false;
    };
  }, [displayInstruments, lookback, canAccessEdge]);

  // Compute pairwise matrix
  const matrix = useMemo(() => {
    const slugs = displayInstruments.map((i) => i.scannerSlug);
    const m: Record<string, Record<string, number>> = {};

    for (const slugA of slugs) {
      m[slugA] = {};
      const seriesA = historyMap[slugA] || [];
      for (const slugB of slugs) {
        if (slugA === slugB) {
          m[slugA][slugB] = 1.0;
        } else {
          const seriesB = historyMap[slugB] || [];
          m[slugA][slugB] = calculatePearson(seriesA, seriesB);
        }
      }
    }
    return m;
  }, [displayInstruments, historyMap]);

  if (!canAccessEdge) {
    return (
      <div className="relative border border-border-slate/50 bg-background-surface/80 p-8 text-center space-y-6 overflow-hidden">
        <div className="absolute inset-0 bg-background-surface/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border border-premium/30 bg-premium/10 flex items-center justify-center text-premium mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-base font-bold uppercase tracking-wider text-text-primary">
            Edge Tier Feature: Correlation Matrix
          </h3>
          <p className="text-xs font-mono text-text-tertiary max-w-md mt-1 leading-relaxed">
            Detect portfolio risk concentration and uncover hedged pairs with automated pairwise Pearson correlation analysis over 20, 60, and 120 periods.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-premium text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Upgrade to Edge <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dummy placeholder grid underneath blur */}
        <div className="opacity-20 pointer-events-none select-none grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded flex items-center justify-center font-mono text-xs">
              0.84
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border-slate/50 bg-background-surface p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-slate/40 pb-4">
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-text-primary">
            Cross-Asset Correlation Matrix
          </h3>
          <p className="text-[10px] font-mono text-text-tertiary mt-0.5">
            Pairwise Pearson coefficient (1H candles). Values &gt; +0.70 indicate strong positive correlation; &lt; -0.70 indicate strong inverse correlation.
          </p>
        </div>

        {/* Lookback Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[9px] font-mono uppercase text-text-tertiary mr-1">Lookback:</span>
          {([20, 60, 120] as const).map((period) => (
            <button
              key={period}
              onClick={() => setLookback(period)}
              className={cn(
                "px-2.5 py-1 text-[9px] font-mono font-bold uppercase border transition-colors",
                lookback === period
                  ? "bg-accent text-white border-accent"
                  : "border-border-slate/40 text-text-tertiary hover:border-accent hover:text-text-primary"
              )}
            >
              {period}H
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
            Calculating correlation matrix across {displayInstruments.length} assets…
          </p>
        </div>
      ) : displayInstruments.length === 0 ? (
        <div className="py-12 text-center text-text-tertiary font-mono text-xs">
          No instruments selected for correlation calculation.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-[10px]">
            <thead>
              <tr>
                <th className="p-2 border border-border-slate/30 bg-background-elevated/40 text-left text-text-tertiary">
                  Asset
                </th>
                {displayInstruments.map((inst) => (
                  <th
                    key={inst.scannerSlug}
                    className="p-2 border border-border-slate/30 bg-background-elevated/40 text-center text-text-secondary whitespace-nowrap"
                  >
                    {inst.displayPair}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayInstruments.map((rowInst) => (
                <tr key={rowInst.scannerSlug}>
                  <td className="p-2 border border-border-slate/30 bg-background-elevated/20 font-bold text-text-primary whitespace-nowrap">
                    {rowInst.displayPair}
                  </td>
                  {displayInstruments.map((colInst) => {
                    const r = matrix[rowInst.scannerSlug]?.[colInst.scannerSlug] ?? 0;
                    const isSelf = rowInst.scannerSlug === colInst.scannerSlug;

                    let cellStyle = "text-text-tertiary bg-white/[0.02]";
                    if (isSelf) {
                      cellStyle = "text-text-secondary bg-white/[0.05] font-bold";
                    } else if (r >= 0.7) {
                      cellStyle = "text-emerald-400 bg-emerald-500/20 font-bold border-emerald-500/30";
                    } else if (r >= 0.3) {
                      cellStyle = "text-emerald-400/80 bg-emerald-500/10";
                    } else if (r <= -0.7) {
                      cellStyle = "text-red-400 bg-red-500/20 font-bold border-red-500/30";
                    } else if (r <= -0.3) {
                      cellStyle = "text-red-400/80 bg-red-500/10";
                    }

                    return (
                      <td
                        key={colInst.scannerSlug}
                        className={cn(
                          "p-2 border border-border-slate/30 text-center transition-colors",
                          cellStyle
                        )}
                        title={`${rowInst.displayPair} vs ${colInst.displayPair}: r = ${r.toFixed(3)}`}
                      >
                        {isSelf ? "1.00" : r.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[9px] font-mono text-text-tertiary">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/50" />
            Positive (&gt; +0.70)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500/50" />
            Inverse (&lt; -0.70)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-white/10 border border-white/20" />
            Neutral (-0.30 to +0.30)
          </span>
        </div>
        <span>Showing top {displayInstruments.length} filtered assets</span>
      </div>
    </div>
  );
}
