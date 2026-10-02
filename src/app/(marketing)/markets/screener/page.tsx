import { Metadata } from "next";
import { PublicScreenerClient } from "@/components/markets/PublicScreenerClient";
import { TrackPageView } from "@/components/admin/TrackPageView";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ShieldCheck, Activity, BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Market Screener — Forex, Crypto, Commodities & Indices | Drawdown Trading",
  description: "Screen 35+ global financial assets with real-time prices, 24h percentage performance, RSI momentum, and Market Structure Shift (MSS) bias. Zero delay, 60s cache.",
  alternates: {
    canonical: "https://drawdown.trading/markets/screener",
  },
  openGraph: {
    title: "Live Market Screener | Drawdown Trading",
    description: "Real-time institutional technical screener across FX majors, crosses, commodities, equity indices, and crypto.",
    url: "https://drawdown.trading/markets/screener",
  },
};

import { ScreenerRow } from "@/lib/screener";

async function getInitialScreenerData(): Promise<ScreenerRow[]> {
  try {
    const res = await fetch("https://drawdown.trading/api/market/screener", {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Non-fatal: client-side fetch will hydrate immediately
    console.warn("[ScreenerPage] Server prefetch fallback to client hydration:", err);
  }
  return [];
}

export default async function ScreenerPage() {
  const initialData = await getInitialScreenerData();

  const validAssets = initialData.filter(i => !i.feed_offline && i.changePct !== null);
  const advCount = validAssets.filter(i => (i.changePct ?? 0) > 0).length;
  const decCount = validAssets.filter(i => (i.changePct ?? 0) < 0).length;
  const totalCount = initialData.length > 0 ? initialData.length : 32;

  return (
    <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent selection:text-black">
      <TrackPageView path="/markets/screener" />

      {/* Header section */}
      <section className="border-b border-border-slate/50 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-6">
          {/* Sub Navigation Strip & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-slate/60 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary">
              <Link href="/markets" className="hover:text-accent transition-colors">
                Markets
              </Link>
              <ChevronRight className="w-3 h-3 text-text-tertiary/60" />
              <span className="text-accent font-bold">Screener</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <Link
                href="/markets"
                className="px-3 py-1 text-text-secondary hover:text-text-primary border border-border-slate/70 bg-white/70 hover:bg-white transition-colors uppercase tracking-wider rounded-xs flex items-center gap-1"
              >
                <BarChart2 className="w-3 h-3 text-text-tertiary" />
                Markets Hub
              </Link>
              <Link
                href="/markets/screener"
                className="px-3 py-1 bg-black text-white font-bold uppercase tracking-wider rounded-xs shadow-2xs flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3 text-accent" />
                Screener
              </Link>
              <Link
                href="/markets/pulse"
                className="px-3 py-1 text-text-secondary hover:text-text-primary border border-border-slate/70 bg-white/70 hover:bg-white transition-colors uppercase tracking-wider rounded-xs flex items-center gap-1"
              >
                <Activity className="w-3 h-3 text-text-tertiary" />
                The Pulse
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-widest">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Live Screener Engine
              </div>
              <h1 className="text-3xl md:text-5xl font-sans font-extrabold uppercase tracking-tight text-text-primary">
                Market <span className="text-accent">Screener.</span>
              </h1>
              <p className="text-sm md:text-base font-medium text-text-secondary leading-relaxed">
                Scan the market. Find what changed. Real-time scanning across Forex, Commodities, Global Indices, and Cryptocurrencies. Track momentum, relative activity, and institutional Market Structure Shift (MSS) bias.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-white font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Unlock Pro Scanner
              </Link>
            </div>
          </div>

          {/* Operational Terminal Hero Live-State Strip */}
          <div className="pt-2">
            <div className="bg-white border border-border-slate px-4 py-2.5 rounded-xs flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-bold uppercase tracking-wider text-text-primary">
                    Live Stream Feed
                  </span>
                </div>
                <span className="text-border-slate">|</span>
                <span className="text-text-secondary">
                  <strong>{totalCount}</strong> Instruments Active
                </span>
                <span className="text-border-slate hidden sm:inline">|</span>
                <span className="text-text-secondary hidden sm:inline">
                  6 Asset Classes
                </span>
              </div>

              <div className="flex items-center gap-4 text-text-tertiary">
                {validAssets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">▲ {advCount} Advancing</span>
                    <span>·</span>
                    <span className="text-red-700 font-bold">▼ {decCount} Declining</span>
                  </div>
                )}
                <span className="bg-slate-100 border border-border-slate/80 text-text-secondary px-2 py-0.5 rounded-xs text-[9px] font-semibold uppercase tracking-wider">
                  60s Edge Cache
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Screener Section */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PublicScreenerClient initialData={initialData} />
      </main>
    </div>
  );
}
