"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ScreenerRow } from "@/lib/screener";
import {
  computeCurrencyStrengths,
  CurrencyStrength,
  CurrencyCode,
} from "@/lib/currency-strength";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, Zap } from "lucide-react";

// ─── Flag emoji map ────────────────────────────────────────────────────────────
const CURRENCY_FLAG: Record<CurrencyCode, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  NZD: "🇳🇿",
};

interface CurrencyStrengthMeterProps {
  initialData?: ScreenerRow[];
}

export function CurrencyStrengthMeter({ initialData }: CurrencyStrengthMeterProps) {
  const shouldReduceMotion = useReducedMotion();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [data, setData] = useState<ScreenerRow[]>(
    initialData && initialData.length > 0 ? initialData : []
  );
  const [loading, setLoading] = useState(
    initialData && initialData.length > 0 ? false : true
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData && initialData.length > 0 ? new Date() : null
  );

  // ── Change-flash tracking ───────────────────────────────────────────────────
  // Tracks previous scores so we can flash currency rows on change
  const prevScoresRef = useRef<Map<CurrencyCode, number | null>>(new Map());
  const [changedCurrencies, setChangedCurrencies] = useState<
    Map<CurrencyCode, "up" | "down">
  >(new Map());
  const flashTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // ── Live freshness clock ────────────────────────────────────────────────────
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const isFresh = lastUpdated
    ? currentTime - lastUpdated.getTime() < 20_000
    : false;

  // ── Fetch + diff ────────────────────────────────────────────────────────────
  async function loadData(manual = false) {
    if (manual) setIsRefreshing(true);
    try {
      // Reuse the existing screener cache — no new Twelve Data call
      const res = await fetch("/api/market/screener");
      if (res.ok) {
        const json: ScreenerRow[] = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          // Compute new strengths so we can diff vs previous
          const newStrengths = computeCurrencyStrengths(json);

          // Build flash diff
          const diff = new Map<CurrencyCode, "up" | "down">();
          if (prevScoresRef.current.size > 0) {
            for (const entry of newStrengths) {
              const prev = prevScoresRef.current.get(entry.currency);
              if (
                prev !== undefined &&
                prev !== null &&
                entry.score !== null
              ) {
                if (entry.score > prev) diff.set(entry.currency, "up");
                else if (entry.score < prev) diff.set(entry.currency, "down");
              }
            }
          }

          // Store new scores for next diff
          const newScoreMap = new Map<CurrencyCode, number | null>();
          for (const entry of newStrengths) {
            newScoreMap.set(entry.currency, entry.score);
          }
          prevScoresRef.current = newScoreMap;

          // Staggered flash (50 ms per currency, matches screener pattern)
          flashTimeoutsRef.current.forEach((t) => clearTimeout(t));
          flashTimeoutsRef.current = [];

          if (diff.size > 0) {
            Array.from(diff.entries()).forEach(([currency, direction], idx) => {
              const triggerTimer = setTimeout(() => {
                setChangedCurrencies((prev) => {
                  const next = new Map(prev);
                  next.set(currency, direction);
                  return next;
                });
                const clearTimer = setTimeout(() => {
                  setChangedCurrencies((prev) => {
                    if (!prev.has(currency)) return prev;
                    const next = new Map(prev);
                    next.delete(currency);
                    return next;
                  });
                }, 950);
                flashTimeoutsRef.current.push(clearTimer);
              }, idx * 50);
              flashTimeoutsRef.current.push(triggerTimer);
            });
          }

          setData(json);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error("[CurrencyStrengthMeter] fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // ── Poll on the same 15 s cadence as PublicScreenerClient ──────────────────
  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      loadData();
    }
    const interval = setInterval(() => loadData(), 15_000);
    return () => {
      clearInterval(interval);
      flashTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived strengths ───────────────────────────────────────────────────────
  const strengths = useMemo(() => computeCurrencyStrengths(data), [data]);

  // ── Normalise bar widths (max score maps to 80% width) ─────────────────────
  const maxAbsScore = useMemo(() => {
    const live = strengths.filter((s) => s.score !== null);
    if (live.length === 0) return 1;
    return Math.max(...live.map((s) => Math.abs(s.score!)), 0.001);
  }, [strengths]);

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full bg-white border border-mkt-bd shadow-sm">
        <div className="px-5 py-4 border-b border-mkt-bd bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs border border-mkt-bd/80 bg-white flex items-center justify-center text-accent shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
              Currency Strength Meter
            </h2>
            <p className="text-[10px] font-mono text-mkt-i4">
              Loading screener data…
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 animate-pulse rounded-xs"
              style={{ opacity: 1 - i * 0.08 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-mkt-bd shadow-sm">
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-mkt-bd flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs border border-mkt-bd/80 bg-white flex items-center justify-center text-accent shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-extrabold uppercase tracking-tight text-mkt-ink">
                Currency Relative Strength
              </h2>
              <span className="text-[9px] font-mono font-bold bg-slate-200/80 text-mkt-i2 px-1.5 py-0.5 rounded-xs">
                8 Currencies
              </span>
            </div>
            <p className="text-[10px] font-mono text-mkt-i4">
              Relative momentum score · Average signed 24h % change across tracked FX pairs
            </p>
          </div>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-mkt-i4">
          <span className="flex items-center gap-1.5">
            <span
              className={cn(
                "relative flex h-2 w-2",
                isRefreshing && "opacity-50"
              )}
            >
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  isFresh ? "animate-ping bg-emerald-400" : "bg-slate-300"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  isFresh ? "bg-emerald-500" : "bg-slate-400"
                )}
              />
            </span>
            {lastUpdated
              ? `Updated ${Math.floor((currentTime - lastUpdated.getTime()) / 1000)}s ago`
              : "Awaiting data"}
          </span>
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="px-2 py-1 border border-mkt-bd rounded-xs hover:bg-slate-100 transition-colors disabled:opacity-40 uppercase tracking-wider font-bold"
            title="Refresh now"
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* ── Ranked bars ────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 space-y-2.5 relative overflow-hidden">
        {/* Ambient scan sweep — decorative, no semantic content */}
        {!shouldReduceMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              animate={{ x: ["-100%", "250%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-1/2 h-full absolute inset-y-0 -skew-x-12 bg-gradient-to-r from-transparent via-slate-400/[0.10] to-transparent"
            />
          </div>
        )}

        {strengths.map((entry, idx) => {
          const isUp = entry.score !== null && entry.score > 0;
          const isDown = entry.score !== null && entry.score < 0;
          const direction = changedCurrencies.get(entry.currency);

          const barWidthPct =
            entry.score !== null
              ? Math.min((Math.abs(entry.score) / maxAbsScore) * 80, 80)
              : 0;

          const glowShadow =
            direction === "up"
              ? "0 0 12px rgba(24, 184, 128, 0.40)"
              : direction === "down"
              ? "0 0 12px rgba(206, 105, 105, 0.40)"
              : "0 0 0px rgba(0,0,0,0)";

          return (
            <motion.div
              key={entry.currency}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{
                opacity: 1,
                y: 0,
                boxShadow: direction
                  ? [glowShadow, glowShadow, "0 0 0px rgba(0,0,0,0)"]
                  : "0 0 0px rgba(0,0,0,0)",
              }}
              transition={
                direction
                  ? shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.6, ease: "easeOut" }
                  : shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, delay: idx * 0.04, ease: "easeOut" }
              }
              className={cn(
                "relative flex items-center gap-3 p-3 border rounded-xs transition-colors duration-150",
                entry.feed_offline
                  ? "bg-amber-500/5 border-amber-500/30"
                  : isUp
                  ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/8"
                  : isDown
                  ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/8"
                  : "bg-slate-50 border-mkt-bd hover:bg-slate-100/70"
              )}
            >
              {/* Top edge stripe — intensifies on change */}
              <motion.div
                animate={{
                  opacity: direction ? [1, 1, 0.7] : 0.7,
                  filter: direction
                    ? ["saturate(2.2) brightness(1.3)", "saturate(2.2) brightness(1.3)", "saturate(1) brightness(1)"]
                    : "saturate(1) brightness(1)",
                }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
                className={cn(
                  "absolute top-0 left-0 right-0 h-0.5 rounded-t-xs",
                  entry.feed_offline
                    ? "bg-amber-400"
                    : isUp
                    ? "bg-emerald-500"
                    : isDown
                    ? "bg-red-500"
                    : "bg-slate-300"
                )}
              />

              {/* Rank badge */}
              <div
                className={cn(
                  "shrink-0 w-6 h-6 flex items-center justify-center font-mono font-extrabold text-[10px] border rounded-xs",
                  entry.feed_offline
                    ? "border-amber-400/40 text-amber-600 bg-amber-50"
                    : idx === 0
                    ? "border-emerald-400/60 text-emerald-700 bg-emerald-50"
                    : idx === 7
                    ? "border-red-400/60 text-red-700 bg-red-50"
                    : "border-mkt-bd text-mkt-i3 bg-white"
                )}
              >
                {idx + 1}
              </div>

              {/* Flag + name */}
              <div className="shrink-0 w-36 sm:w-44">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base leading-none" aria-hidden="true">
                    {CURRENCY_FLAG[entry.currency]}
                  </span>
                  <span className="font-mono font-extrabold text-sm text-mkt-ink tracking-tight">
                    {entry.currency}
                  </span>
                  <span className="hidden sm:inline text-[10px] font-mono text-mkt-i4 truncate">
                    {entry.label}
                  </span>
                </div>
                {/* Pair coverage — shown for all 8 currencies equally */}
                <span className="text-[9px] font-mono text-mkt-i4 block mt-0.5">
                  {entry.feed_offline
                    ? "No live data"
                    : `Based on ${entry.activePairCount} of ${entry.pairCount} pair${entry.pairCount !== 1 ? "s" : ""}`}
                </span>
              </div>

              {/* Bar track */}
              <div className="flex-1 relative h-5 flex items-center">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-mkt-bd/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: entry.feed_offline ? "0%" : `${barWidthPct}%` }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.5, delay: idx * 0.04, ease: "easeOut" }
                    }
                    className={cn(
                      "h-full rounded-full",
                      isUp ? "bg-emerald-500" : isDown ? "bg-red-500" : "bg-slate-300"
                    )}
                  />
                </div>
              </div>

              {/* Score + direction icon */}
              <div className="shrink-0 flex items-center gap-1.5 min-w-[72px] justify-end">
                {entry.feed_offline ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-amber-600">
                    <AlertTriangle className="w-3 h-3" />
                    OFFLINE
                  </span>
                ) : (
                  <>
                    <div
                      className={cn(
                        "w-4 h-4 flex items-center justify-center border rounded-xs bg-white/80",
                        isUp
                          ? "border-emerald-500/30 text-emerald-700"
                          : isDown
                          ? "border-red-500/30 text-red-700"
                          : "border-mkt-bd text-mkt-i4"
                      )}
                    >
                      {isUp ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : isDown ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <Minus className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "font-mono font-extrabold text-[12px] tabular-nums",
                        isUp
                          ? "text-emerald-700"
                          : isDown
                          ? "text-red-700"
                          : "text-mkt-i3"
                      )}
                    >
                      {entry.score !== null
                        ? `${isUp ? "+" : ""}${entry.score.toFixed(2)}%`
                        : "—"}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="px-5 py-2.5 border-t border-mkt-bd/60 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-[9px] font-mono text-mkt-i4">
        <span>
          Score = simple average of signed 24h % change across all tracked pairs per
          currency. Relative momentum indicator only — not an absolute currency value or
          fabricated unit.
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Zap className="w-2.5 h-2.5 text-accent" />
          Twelve Data &amp; Yahoo Finance feed · 60s cache · No new API calls
        </span>
      </div>
    </div>
  );
}
