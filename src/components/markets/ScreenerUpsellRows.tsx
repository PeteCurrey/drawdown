"use client";

import Link from "next/link";
import { Lock, Sparkles, TrendingUp, Filter, ShieldCheck, ArrowRight } from "lucide-react";

export function ScreenerUpsellRows() {
  return (
    <div className="relative overflow-hidden border border-mkt-bd bg-white/70 backdrop-blur-sm p-6 md:p-8 space-y-6">
      {/* Decorative accent blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono font-bold uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            Foundation Tier Feature
          </div>
          <h3 className="text-xl md:text-2xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
            Unlock Multi-Timeframe Signals, AI Briefs & Custom Filters
          </h3>
          <p className="text-xs md:text-sm text-mkt-i2 leading-relaxed">
            Professional traders don&apos;t scan manually. Unlock 5-timeframe technical confluence,
            institutional AI debriefs, custom multi-factor scanner filters, and CSV data export.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-mkt-ink text-white hover:bg-accent text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            Upgrade to Foundation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard/tools/technical-scanner"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-mkt-bd text-mkt-i4 hover:text-mkt-ink hover:border-mkt-ink text-[10px] font-mono font-bold uppercase tracking-widest transition-all bg-white"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      {/* Feature comparison highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-mkt-bd/60 relative z-10">
        <div className="flex items-start gap-2.5 p-3 border border-mkt-bd/40 bg-white/50">
          <TrendingUp className="w-4 h-4 text-profit shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-ink">
              Multi-Timeframe Confluence
            </h4>
            <p className="text-[9px] font-mono text-mkt-i4 mt-0.5">
              15m, 1H, 4H, Daily & Weekly signals consensus matrix.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 border border-mkt-bd/40 bg-white/50">
          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-ink">
              Claude AI Debriefs
            </h4>
            <p className="text-[9px] font-mono text-mkt-i4 mt-0.5">
              Automated institutional bias, key pivot levels, and catalyst watch.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 border border-mkt-bd/40 bg-white/50">
          <Filter className="w-4 h-4 text-mkt-ink shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-ink">
              Custom Filter Engine
            </h4>
            <p className="text-[9px] font-mono text-mkt-i4 mt-0.5">
              Filter by RSI bands, ATR thresholds, MACD crosses, and momentum.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 border border-mkt-bd/40 bg-white/50">
          <ShieldCheck className="w-4 h-4 text-profit shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-mkt-ink">
              Saved Presets & Export
            </h4>
            <p className="text-[9px] font-mono text-mkt-i4 mt-0.5">
              Save screens to cloud and export filtered results to CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
