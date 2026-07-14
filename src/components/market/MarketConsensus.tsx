"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  ChevronRight,
  DollarSign,
  BarChart3,
  Zap,
  Gem,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TradingViewTechnicalWidget } from "./TradingViewTechnicalWidget";

// ─── Subscription tier type (mirrors the platform-wide definition) ─────────

type SubscriptionTier = "free" | "foundation" | "edge" | "floor";

// ─── Instrument catalogue ─────────────────────────────────────────────────
// tvSymbol values are confirmed against markets-config.ts and TradingView's
// live symbol database. Do not change without verifying on TradingView first.

type MarketCategory = "forex" | "commodities" | "indices" | "crypto";

interface DashboardInstrument {
  displayPair: string;    // Human-readable label shown in the card header
  tvSymbol: string;       // TradingView symbol passed to the widget
  category: MarketCategory;
  scannerSlug?: string;   // Slug for the /tools/scanner deep-link (optional)
}

const DASHBOARD_INSTRUMENTS: DashboardInstrument[] = [
  { displayPair: "EUR/USD",  tvSymbol: "FX:EURUSD",          category: "forex",        scannerSlug: "EURUSD"  },
  { displayPair: "GBP/USD",  tvSymbol: "FX:GBPUSD",          category: "forex",        scannerSlug: "GBPUSD"  },
  { displayPair: "USD/JPY",  tvSymbol: "FX:USDJPY",          category: "forex",        scannerSlug: "USDJPY"  },
  { displayPair: "GBP/JPY",  tvSymbol: "FX:GBPJPY",          category: "forex",        scannerSlug: "GBPJPY"  },
  { displayPair: "XAG/USD",  tvSymbol: "OANDA:XAGUSD",       category: "commodities",  scannerSlug: "XAGUSD"  },
  { displayPair: "UK100",    tvSymbol: "TVC:UKX",            category: "indices",      scannerSlug: "UKX"     },
  { displayPair: "US500",    tvSymbol: "TVC:SPX",            category: "indices",      scannerSlug: "SPX"     },
  { displayPair: "NAS100",   tvSymbol: "TVC:NDX",            category: "indices",      scannerSlug: "NDX"     },
  { displayPair: "US30",     tvSymbol: "TVC:DJI",            category: "indices",      scannerSlug: "DJI"     },
  { displayPair: "BTC/USD",  tvSymbol: "BINANCE:BTCUSDT",    category: "crypto",       scannerSlug: "BTCUSDT" },
  { displayPair: "ETH/USD",  tvSymbol: "BINANCE:ETHUSDT",    category: "crypto",       scannerSlug: "ETHUSDT" },
  { displayPair: "XRP/USD",  tvSymbol: "BINANCE:XRPUSDT",    category: "crypto",       scannerSlug: "XRPUSDT" },
];

// ─── Category icons ───────────────────────────────────────────────────────

const CATEGORY_ICON: Record<MarketCategory, React.ElementType> = {
  forex:       DollarSign,
  commodities: Gem,
  indices:     BarChart3,
  crypto:      Zap,
};

const CATEGORY_LABEL: Record<MarketCategory, string> = {
  forex:       "Forex",
  commodities: "Commodity",
  indices:     "Index",
  crypto:      "Crypto",
};

// ─── Component ───────────────────────────────────────────────────────────

interface MarketConsensusProps {
  /** The current user's subscription tier. Defaults to 'free' (locked state). */
  userTier?: SubscriptionTier;
}

export function MarketConsensus({ userTier = "free" }: MarketConsensusProps) {
  const [search, setSearch] = useState("");
  // Set of tvSymbol strings that have entered the viewport (or near it).
  // Once a symbol is in this set it stays — the widget must not be destroyed
  // just because the user scrolls back up.
  const [visibleSymbols, setVisibleSymbols] = useState<Set<string>>(new Set());

  // Map of tvSymbol → card DOM element, populated via ref callbacks.
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Derived: which instruments pass the current search filter.
  const searchLower = search.toLowerCase().trim();
  const matchesSearch = useCallback(
    (inst: DashboardInstrument) =>
      !searchLower || inst.displayPair.toLowerCase().includes(searchLower),
    [searchLower]
  );

  // ── IntersectionObserver for lazy loading ──────────────────────────────
  // rootMargin: 200px below the viewport so widgets preload a little before
  // they fully scroll into view, avoiding a visible pop-in.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sym = (entry.target as HTMLElement).dataset.tvsymbol;
            if (sym) {
              setVisibleSymbols((prev) => {
                if (prev.has(sym)) return prev; // Already visible — no re-render needed
                const next = new Set(prev);
                next.add(sym);
                return next;
              });
              // Once marked visible, no need to keep observing.
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: "200px 0px" }
    );

    // Observe every card that has been mounted so far.
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []); // Run once — new cards from search changes don't need re-observation
           // because the visibility Set accumulates and we re-check on mount.

  // When new card refs are attached (e.g. initial render or after search reset),
  // start observing them if not already visible.
  const setCardRef = useCallback(
    (tvSymbol: string, el: HTMLDivElement | null) => {
      if (el) {
        cardRefs.current.set(tvSymbol, el);
      } else {
        cardRefs.current.delete(tvSymbol);
      }
    },
    []
  );

  // Edge and Floor tiers have full AI signal access.
  const hasSignalAccess = userTier === "edge" || userTier === "floor";

  return (
    <div className="space-y-10">

      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-sans font-black uppercase tracking-tight text-text-primary">
            Market Intelligence
          </h2>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            Live TradingView technical consensus · Daily (1D) timeframe · 12 instruments
          </p>
        </div>

        <div className="flex items-center gap-4 p-3 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 focus-within:border-accent transition-colors w-full md:w-80">
          <Search className="w-4 h-4 text-text-tertiary shrink-0" />
          <input
            type="text"
            placeholder="FILTER SYMBOLS..."
            aria-label="Filter market symbols"
            className="bg-transparent border-none outline-none font-mono text-[9px] uppercase tracking-widest text-text-primary w-full placeholder-text-tertiary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Card grid ───────────────────────────────────────────────────── */}
      {/*
        All 12 cards are always rendered in the DOM.
        Cards that don't match the search filter are visually hidden with
        `display: none` (via the `hidden` Tailwind class) rather than being
        unmounted — this preserves their IntersectionObserver registration and
        keeps already-loaded widgets alive so they do not need to reload when
        the filter is cleared.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_INSTRUMENTS.map((inst) => {
          const CategoryIcon = CATEGORY_ICON[inst.category];
          const isMatch = matchesSearch(inst);
          const isWidgetVisible = visibleSymbols.has(inst.tvSymbol);

          return (
            <div
              key={inst.tvSymbol}
              data-tvsymbol={inst.tvSymbol}
              ref={(el) => setCardRef(inst.tvSymbol, el)}
              className={cn(
                "group bg-background-surface/40 backdrop-blur-md border border-border-slate/50",
                "hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5",
                "transition-all duration-300 p-5 space-y-4 flex flex-col",
                !isMatch && "hidden"
              )}
            >
              {/* Card header — Drawdown chrome */}
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-sans font-black uppercase tracking-tight truncate text-text-primary">
                    {inst.displayPair}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CategoryIcon className="w-3 h-3 text-text-tertiary shrink-0" />
                    <span className="text-[8px] font-mono text-text-tertiary uppercase truncate">
                      Technical Consensus
                    </span>
                  </div>
                </div>

                {/* Category badge */}
                <span className="shrink-0 px-1.5 py-0.5 border border-border-slate/40 text-[7px] font-mono uppercase tracking-widest text-text-tertiary">
                  {CATEGORY_LABEL[inst.category]}
                </span>
              </div>

              {/* Card body — TradingView widget */}
              {/*
                The widget renders its own BUY/SELL/NEUTRAL gauge using
                TradingView's 26-indicator blend (17 MAs + 9 oscillators).
                isTransparent: true lets our card background show through.
                Required TradingView attribution appears inside the widget iframe.
              */}
              <div className="flex-1">
                <TradingViewTechnicalWidget
                  tvSymbol={inst.tvSymbol}
                  isVisible={isWidgetVisible}
                />
              </div>

              {/* Card footer — scanner deep-link */}
              {/* Path is /dashboard/tools/scanner — the scanner lives inside the
                  platform group, not the marketing /tools/ group. */}
              <div className="pt-3 border-t border-border-slate/50 flex justify-end items-center">
                <Link
                  href={`/dashboard/tools/scanner${inst.scannerSlug ? `?symbol=${inst.scannerSlug}` : ""}`}
                  className="p-1.5 hover:bg-background-elevated text-text-tertiary hover:text-accent transition-colors"
                  title={`Full technical analysis — ${inst.displayPair}`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── No search results ────────────────────────────────────────────── */}
      {searchLower && !DASHBOARD_INSTRUMENTS.some(matchesSearch) && (
        <div className="py-16 text-center space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            No symbols match &quot;{search}&quot;
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-[9px] font-mono uppercase tracking-widest text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* ── AI Signal Synthesis footer ───────────────────────────────────── */}
      {/* Source of truth: userTier prop from dashboard/page.tsx (fetched from
          profiles.subscription_tier). Edge and Floor unlock; free/foundation locked. */}
      <div
        className={cn(
          "p-8 border flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-300 hover:-translate-y-0.5",
          hasSignalAccess
            ? "bg-background-elevated/40 backdrop-blur-md border-accent/30 hover:shadow-[0_0_20px_rgba(0,167,225,0.12)] hover:border-accent/50"
            : "bg-background-elevated/40 backdrop-blur-md border-border-slate/50 hover:shadow-[0_0_20px_rgba(0,167,225,0.1)] hover:border-accent/30"
        )}
      >
        <div className="flex gap-4 items-start max-w-2xl">
          <div
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center shrink-0",
              hasSignalAccess
                ? "bg-profit/10 border-profit/20"
                : "bg-accent/10 border-accent/20"
            )}
          >
            {hasSignalAccess ? (
              <CheckCircle2 className="w-5 h-5 text-profit" />
            ) : (
              <Zap className="w-5 h-5 text-accent animate-pulse" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-text-primary">
              AI Signal Synthesis
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Ratings are derived from TradingView&apos;s Technical Analysis engine —
              a blend of EMA, RSI, MACD, and 23 further indicators on the daily timeframe.{" "}
              {hasSignalAccess
                ? "Always use your own judgment and risk management."
                : "Upgrade to Edge or Floor to unlock live signal data."}
            </p>
          </div>
        </div>

        {/* Upgrade CTA — free/foundation only */}
        {!hasSignalAccess && (
          <Link
            href="/pricing"
            className="px-10 py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-all shrink-0"
          >
            Upgrade for Edge Signals
          </Link>
        )}

        {/* Active CTA — edge/floor only.
             Routes to the Intelligence Hub which is the actual home of AI signals,
             insider flow, and political capital tracking. */}
        {hasSignalAccess && (
          <Link
            href="/dashboard/intelligence"
            className="flex items-center gap-3 shrink-0 px-5 py-3 border border-profit/30 bg-profit/5 hover:bg-profit/10 hover:border-profit/60 transition-all group"
          >
            <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-profit group-hover:tracking-[0.15em] transition-all">
              View Intelligence Hub
            </span>
            <ChevronRight className="w-3 h-3 text-profit opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
          </Link>
        )}
      </div>
    </div>
  );
}
