"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  BarChart3,
  Zap,
  Gem,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TradingViewTechnicalWidget } from "@/components/market/TradingViewTechnicalWidget";

// ─── Instrument catalogue ─────────────────────────────────────────────────
// Mirrors the scannerSlug → tvSymbol mapping in MarketConsensus.tsx.
// Keep in sync if instruments are added or changed.

type MarketCategory = "forex" | "commodities" | "indices" | "crypto";

interface ScannerInstrument {
  scannerSlug: string;
  displayPair: string;
  tvSymbol: string;
  category: MarketCategory;
}

export const SCANNER_INSTRUMENTS: ScannerInstrument[] = [
  { scannerSlug: "EURUSD",  displayPair: "EUR/USD", tvSymbol: "FX:EURUSD",        category: "forex"       },
  { scannerSlug: "GBPUSD",  displayPair: "GBP/USD", tvSymbol: "FX:GBPUSD",        category: "forex"       },
  { scannerSlug: "USDJPY",  displayPair: "USD/JPY", tvSymbol: "FX:USDJPY",        category: "forex"       },
  { scannerSlug: "GBPJPY",  displayPair: "GBP/JPY", tvSymbol: "FX:GBPJPY",        category: "forex"       },
  { scannerSlug: "XAGUSD",  displayPair: "XAG/USD", tvSymbol: "OANDA:XAGUSD",     category: "commodities" },
  { scannerSlug: "UKX",     displayPair: "UK100",   tvSymbol: "TVC:UKX",          category: "indices"     },
  { scannerSlug: "SPX",     displayPair: "US500",   tvSymbol: "TVC:SPX",          category: "indices"     },
  { scannerSlug: "NDX",     displayPair: "NAS100",  tvSymbol: "TVC:NDX",          category: "indices"     },
  { scannerSlug: "DJI",     displayPair: "US30",    tvSymbol: "TVC:DJI",          category: "indices"     },
  { scannerSlug: "BTCUSDT", displayPair: "BTC/USD", tvSymbol: "BINANCE:BTCUSDT",  category: "crypto"      },
  { scannerSlug: "ETHUSDT", displayPair: "ETH/USD", tvSymbol: "BINANCE:ETHUSDT",  category: "crypto"      },
  { scannerSlug: "XRPUSDT", displayPair: "XRP/USD", tvSymbol: "BINANCE:XRPUSDT", category: "crypto"      },
];

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

// ─── Props ────────────────────────────────────────────────────────────────

interface ScannerClientProps {
  /** Raw scannerSlug from the URL ?symbol= param, e.g. "EURUSD". Null = overview. */
  symbol: string | null;
}

// ─── Component ───────────────────────────────────────────────────────────

export function ScannerClient({ symbol }: ScannerClientProps) {
  const instrument = symbol
    ? SCANNER_INSTRUMENTS.find((i) => i.scannerSlug === symbol) ?? null
    : null;

  // ── Symbol detail view ─────────────────────────────────────────────────
  if (instrument) {
    return <SymbolDetail instrument={instrument} />;
  }

  // ── Unknown slug: fallback to overview with an error note ──────────────
  if (symbol && !instrument) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700 pb-24">
        <header className="border-b border-border-slate/50 pb-6">
          <Link
            href="/dashboard/tools/scanner"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-6"
          >
            <ChevronLeft className="w-3 h-3" /> All Markets
          </Link>
          <p className="text-sm text-text-tertiary font-mono uppercase">
            Symbol &quot;{symbol}&quot; not recognised. Select from the list below.
          </p>
        </header>
        <OverviewGrid />
      </div>
    );
  }

  // ── Overview: no symbol param ──────────────────────────────────────────
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-premium">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">
              Technical_Consensus // Daily
            </span>
          </div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight">
            Market <span className="text-premium">Scanner.</span>
          </h1>
          <p className="text-sm text-text-tertiary">
            Select an instrument to view its live TradingView technical analysis.
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-background-elevated border border-border-slate/50">
          <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">
            Live Data
          </span>
        </div>
      </header>
      <OverviewGrid />
    </div>
  );
}

// ─── Per-symbol detail view ───────────────────────────────────────────────

function SymbolDetail({ instrument }: { instrument: ScannerInstrument }) {
  const CategoryIcon = CATEGORY_ICON[instrument.category];
  // Widget is always visible on the detail page — no lazy-loading needed since
  // this is the primary content.
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Small delay so the page fade-in animation completes before the widget loads
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Adjacent instruments for quick navigation
  const idx = SCANNER_INSTRUMENTS.findIndex(
    (i) => i.scannerSlug === instrument.scannerSlug
  );
  const prev = SCANNER_INSTRUMENTS[idx - 1] ?? null;
  const next = SCANNER_INSTRUMENTS[idx + 1] ?? null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Back + breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/tools/scanner"
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> All Markets
        </Link>

        {/* Prev / Next navigation */}
        <div className="flex items-center gap-2">
          {prev && (
            <Link
              href={`/dashboard/tools/scanner?symbol=${prev.scannerSlug}`}
              className="flex items-center gap-1 px-3 py-1.5 border border-border-slate/50 hover:border-accent text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-all"
              title={prev.displayPair}
            >
              <ChevronLeft className="w-3 h-3" /> {prev.displayPair}
            </Link>
          )}
          {next && (
            <Link
              href={`/dashboard/tools/scanner?symbol=${next.scannerSlug}`}
              className="flex items-center gap-1 px-3 py-1.5 border border-border-slate/50 hover:border-accent text-[9px] font-mono uppercase text-text-tertiary hover:text-accent transition-all"
              title={next.displayPair}
            >
              {next.displayPair} <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Instrument header */}
      <header className="border-b border-border-slate/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CategoryIcon className="w-4 h-4 text-text-tertiary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              {CATEGORY_LABEL[instrument.category]} · Technical Consensus · Daily (1D)
            </span>
          </div>
          <h1 className="text-5xl font-display font-black uppercase tracking-tight text-text-primary">
            {instrument.displayPair}
          </h1>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
            {instrument.tvSymbol}
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 bg-background-elevated border border-border-slate/50">
          <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest">
            Live · TradingView Technical Analysis
          </span>
        </div>
      </header>

      {/* TradingView Technical Analysis widget — reuses Phase 2 component */}
      <div
        ref={containerRef}
        className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-6 min-h-[460px]"
      >
        {ready ? (
          <TradingViewTechnicalWidget
            tvSymbol={instrument.tvSymbol}
            isVisible={true}
          />
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex items-center gap-3 text-text-tertiary animate-pulse">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Loading signal data...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer — matches the Phase 2 disclosure on dashboard cards */}
      <p className="text-[9px] font-mono text-text-tertiary/60 uppercase tracking-widest text-center leading-relaxed">
        Analysis powered by TradingView Technical Analysis engine · 26 indicators ·
        Daily timeframe · Not financial advice
      </p>

      {/* Quick-jump to other symbols */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate/50 pb-3">
          Other Instruments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SCANNER_INSTRUMENTS.filter(
            (i) => i.scannerSlug !== instrument.scannerSlug
          ).map((i) => {
            const Icon = CATEGORY_ICON[i.category];
            return (
              <Link
                key={i.scannerSlug}
                href={`/dashboard/tools/scanner?symbol=${i.scannerSlug}`}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4",
                  "border border-border-slate/40 hover:border-accent hover:bg-accent/5",
                  "transition-all group text-center"
                )}
              >
                <Icon className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                  {i.displayPair}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Overview grid — symbol picker ───────────────────────────────────────

function OverviewGrid() {
  const groups: Record<MarketCategory, ScannerInstrument[]> = {
    forex:       SCANNER_INSTRUMENTS.filter((i) => i.category === "forex"),
    indices:     SCANNER_INSTRUMENTS.filter((i) => i.category === "indices"),
    commodities: SCANNER_INSTRUMENTS.filter((i) => i.category === "commodities"),
    crypto:      SCANNER_INSTRUMENTS.filter((i) => i.category === "crypto"),
  };

  const categoryOrder: MarketCategory[] = ["forex", "indices", "commodities", "crypto"];

  return (
    <div className="space-y-10">
      {categoryOrder.map((cat) => {
        const Icon = CATEGORY_ICON[cat];
        return (
          <div key={cat} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border-slate/50 pb-2">
              <Icon className="w-4 h-4 text-text-tertiary" />
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                {CATEGORY_LABEL[cat]}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groups[cat].map((inst) => (
                <Link
                  key={inst.scannerSlug}
                  href={`/dashboard/tools/scanner?symbol=${inst.scannerSlug}`}
                  className={cn(
                    "group p-6 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md",
                    "hover:border-accent hover:shadow-[0_0_20px_rgba(0,167,225,0.08)]",
                    "hover:-translate-y-0.5 transition-all duration-200 space-y-3"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-display font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors">
                      {inst.displayPair}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">
                      Live · TradingView TA
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
