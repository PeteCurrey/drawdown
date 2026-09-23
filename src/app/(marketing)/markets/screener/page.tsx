import { Metadata } from "next";
import { PublicScreenerClient } from "@/components/markets/PublicScreenerClient";
import { TrackPageView } from "@/components/admin/TrackPageView";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, ShieldCheck } from "lucide-react";

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

export default function ScreenerPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary selection:bg-accent selection:text-black">
      <TrackPageView path="/markets/screener" />

      {/* Header section */}
      <section className="border-b border-border-slate/50 bg-white/40">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-tertiary">
            <Link href="/markets" className="hover:text-accent transition-colors">
              Markets
            </Link>
            <ChevronRight className="w-3 h-3 text-text-tertiary/60" />
            <span className="text-accent font-bold">Screener</span>
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
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                Real-time scanning across Forex, Commodities, Global Indices, and Cryptocurrencies.
                Track momentum, 24h performance, and institutional Market Structure Shift (MSS) bias.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent text-black font-mono font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Unlock Pro Scanner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Screener Section */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <PublicScreenerClient />
      </main>
    </div>
  );
}
