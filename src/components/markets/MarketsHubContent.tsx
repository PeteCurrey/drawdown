"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Activity, Globe } from "lucide-react";
import { TradingViewTickerTape } from "@/components/markets/TradingViewTickerTape";
import { TradingViewMiniChart } from "@/components/markets/TradingViewMiniChart";
import { getCategoryInstruments } from "@/lib/markets-config";
import { MarketTicker } from "@/components/market/MarketTicker";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    slug: "forex" as const,
    name: "Forex",
    count: "6 Major Pairs",
    desc: "Live TradingView charts, technical analysis gauges, and curriculum context for GBP/USD, EUR/USD, USD/JPY, and other major forex pairs.",
    badge: "GBP/USD, EUR/USD, USD/JPY",
    bgImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800"
  },
  {
    slug: "commodities" as const,
    name: "Commodities",
    count: "Precious Metals & Energy",
    desc: "Macro commodities including safe-haven assets (Gold, Silver) and energy (WTI Crude Oil) with key fundamental driver breakdowns.",
    badge: "Gold, Silver, Crude Oil",
    bgImage: "https://images.unsplash.com/photo-1610374792793-f016b77ca51a?q=80&w=800"
  },
  {
    slug: "indices" as const,
    name: "Indices",
    count: "US & UK Equity Benchmarks",
    desc: "Global equity benchmarks tracking UK and US economic health. Essential directional sentiment indicators for cross-asset trading.",
    badge: "FTSE 100, S&P 500, NASDAQ",
    bgImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800"
  },
  {
    slug: "crypto" as const,
    name: "Cryptocurrencies",
    count: "24/7 Digital Assets",
    desc: "High-beta digital assets (Bitcoin, Ethereum, XRP) covered in Drawdown's Phase 1 foundational modules.",
    badge: "Bitcoin, Ethereum, XRP",
    bgImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800"
  }
];

export function MarketsHubContent() {
  const [macroData, setMacroData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, any>>({});
  const [snapshots, setSnapshots] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        const [macroRes, catRes, snapRes] = await Promise.all([
          fetch("/api/macro/indicators"),
          fetch("/api/market/category-snapshots"),
          fetch("/api/market/polygon-snapshot?symbols=GBPUSD,XAUUSD,UK100,BTCUSD")
        ]);

        if (macroRes.ok) {
          const m = await macroRes.json();
          if (m.list) setMacroData(m.list);
        }

        if (catRes.ok) {
          const c = await catRes.json();
          if (c.categories) setCategoryData(c.categories);
        }

        if (snapRes.ok) {
          const s = await snapRes.json();
          if (s.snapshots) setSnapshots(s.snapshots);
        }
      } catch (err) {
        console.error("Error loading Markets Hub data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  return (
    <div className="flex flex-col bg-[#0A0A0A] text-white min-h-screen selection:bg-[#C8F135] selection:text-black">
      {/* Top Ticker */}
      <div className="border-b border-border-slate/50">
        <MarketTicker />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-[#0A0A0A] overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3 text-[#C8F135]">
               <div className="w-8 h-[1px] bg-[#C8F135]" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">LIVE INTELLIGENCE</span>
            </div>
            
            <h1 className="font-display font-extrabold uppercase tracking-tight leading-[0.9] text-4xl sm:text-6xl lg:text-7xl text-white">
              Market Intelligence <br />
              <span className="text-[#C8F135]">Command Center.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl font-medium">
              Live market data flows, volatility metrics, and actionable setups. Cut through the noise and see where the smart money is moving today.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/markets/pulse"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C8F135] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#b5db2e] transition-colors shadow-lg font-sans"
              >
                Enter The Pulse (Live Feed) &rarr;
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white/10 transition-colors font-sans"
              >
                Browse Asset Classes ↓
              </a>
            </div>

            {/* Stat Row */}
            <div className="mt-12 flex flex-wrap justify-center sm:justify-start gap-x-12 gap-y-4">
              <div>
                <span className="text-2xl font-mono font-bold text-white block">16</span>
                <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mt-1">Instruments Covered</span>
              </div>
              <div>
                <span className="text-2xl font-mono font-bold text-white block">4</span>
                <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mt-1">Asset Classes</span>
              </div>
              <div>
                <span className="text-2xl font-mono font-bold text-white block">24/7</span>
                <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mt-1">Crypto Coverage</span>
              </div>
              <div>
                <span className="text-2xl font-mono font-bold text-[#C8F135] block">Polygon.io</span>
                <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mt-1">Real-time Stream</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MACRO CONTEXT BANNER */}
      <section className="w-full bg-[#111111] border-b border-white/10 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4 text-[#C8F135]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C8F135] font-bold">
              MACRO REGIME
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {macroData.map((item) => {
              const isPos = item.change > 0;
              const isNeg = item.change < 0;
              return (
                <div key={item.key} className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-white/50 block uppercase truncate">{item.name}</span>
                    <span className="font-bold text-white">{item.value}<span className="text-[9px] text-white/40">{item.unit}</span></span>
                  </div>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold", isPos ? "text-[#18B880] bg-[#18B880]/10" : isNeg ? "text-[#CE6969] bg-[#CE6969]/10" : "text-white/40")}>
                    {isPos ? `+${item.change}` : item.change}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2 — TICKER TAPE */}
      <div className="w-full bg-[#0d0d0d] border-y border-white/8">
        <TradingViewTickerTape />
      </div>

      {/* SECTION 3 — FOUR CATEGORY CARDS */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-8">
          // EXPLORE BY ASSET CLASS
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => {
            const snap = categoryData[cat.slug];
            const isPos = snap ? snap.changePercent >= 0 : true;

            return (
              <Link 
                key={cat.slug} 
                href={`/markets/${cat.slug}`}
                className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Animated background image */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                  <img 
                    src={cat.bgImage} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.12] group-hover:opacity-[0.3] scale-100 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Header Row */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl lg:text-2xl font-sans font-extrabold text-white tracking-tight group-hover:text-[#C8F135] transition-colors uppercase">
                        {cat.name}
                      </h2>
                      <span className="inline-block mt-2 text-[10px] font-mono tracking-widest uppercase text-white/40">
                        {cat.count}
                      </span>
                    </div>

                    {/* Live Snapshot Badge */}
                    {snap ? (
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          {snap.label}: {snap.price}
                        </span>
                        <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase inline-block mt-1", isPos ? "text-[#18B880] bg-[#18B880]/10 border-[#18B880]/20" : "text-[#CE6969] bg-[#CE6969]/10 border-[#CE6969]/20")}>
                          {isPos ? "+" : ""}{snap.changePercent}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#C8F135] bg-[#C8F135]/5 border border-[#C8F135]/15 px-3 py-1 rounded-full uppercase">
                        {cat.slug}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-white/60 leading-relaxed font-sans">
                    {cat.desc}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8 relative z-10">
                  <span className="text-xs text-white/40 font-mono tracking-wide">
                    {cat.badge}
                  </span>
                  
                  <span className="text-sm font-bold text-[#C8F135] flex items-center gap-1.5 group-hover:underline">
                    Explore Category <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — FEATURED INSTRUMENTS WITH POLYGON BADGES */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full border-t border-white/5">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-4">
          // FEATURED INSTRUMENTS
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 font-sans">
          Today's most-watched markets.
        </h2>
        <p className="text-base text-white opacity-50 mb-10 font-sans">
          The instruments our traders focus on most. Enriched with real-time Polygon snapshots.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { slug: "gbpusd", category: "forex", name: "GBP/USD", desc: "British Pound / US Dollar", tvSymbol: "FX:GBPUSD", key: "GBPUSD" },
            { slug: "gold", category: "commodities", name: "XAU/USD", desc: "Gold Spot / US Dollar", tvSymbol: "OANDA:XAUUSD", key: "XAUUSD" },
            { slug: "uk100", category: "indices", name: "UK100", desc: "FTSE 100 Index", tvSymbol: "SPREADEX:UK100", key: "UK100" },
            { slug: "bitcoin", category: "crypto", name: "BTC/USD", desc: "Bitcoin / US Dollar", tvSymbol: "COINBASE:BTCUSD", key: "BTCUSD" },
          ].map((item) => {
            const snap = snapshots[item.key];
            const isPos = snap ? snap.changePercent >= 0 : true;

            return (
              <Link 
                key={item.key}
                href={`/markets/${item.category}/${item.slug}`}
                className="bg-white/3 rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="p-4 pb-0 flex justify-between items-start">
                    <div>
                      <div className="text-lg font-mono font-bold text-white">{item.name}</div>
                      <div className="text-xs text-white opacity-40">{item.desc}</div>
                    </div>
                    {snap && (
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">{snap.price}</div>
                        <div className={cn("text-[9px] font-mono font-bold", isPos ? "text-[#18B880]" : "text-[#CE6969]")}>
                          {isPos ? "+" : ""}{snap.changePercent}%
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full h-[160px] bg-[#0A0A0A] overflow-hidden mt-4">
                    <TradingViewMiniChart 
                      symbol={item.tvSymbol}
                      largeChartUrl={`https://drawdown.trading/markets/${item.category}/${item.slug}`}
                      height={160}
                    />
                  </div>
                </div>
                <div className="p-4 pt-3 border-t border-white/5">
                  <span className="text-xs text-[#C8F135] font-mono flex items-center gap-1">
                    View Full Analysis <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 — WHY THIS EXISTS */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5 w-full">
        <div className="max-w-5xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <span className="text-xs font-mono tracking-widest uppercase opacity-40 block mb-4">
                // WHY WE BUILT THIS
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-sans">
                Market data without the noise.
              </h2>
              <div className="space-y-4 text-base text-white/70 leading-relaxed font-sans">
                <p>
                  Most market data sites bury you in numbers without context. They show you a price, a chart and a gauge — but nothing that helps you understand what you're actually looking at or how to trade it.
                </p>
                <p>
                  Every page in the Drawdown Markets Hub connects live TradingView and Polygon.io data to curriculum context. You can see how we teach each instrument, what drives it fundamentally, when it's most active, and what kinds of setups work on it.
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  href="/courses"
                  className="border border-white/20 text-white px-6 py-3 rounded-lg text-sm hover:bg-white/5 transition inline-block font-sans font-semibold"
                >
                  Explore the Curriculum &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">Live Polygon.io & TradingView Data</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Real-time market quotes and interactive charts powered by institutional data feeds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/3 rounded-xl border border-white/8 p-5 relative overflow-hidden group">
                <div className="w-2 h-2 rounded-full bg-[#C8F135] mt-1.5 shrink-0 relative z-10" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-sm text-white mb-1 font-sans">FRED® & EIA® Macro Intelligence</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Track Federal Reserve interest rates, Bank of England policy, CPI inflation, and Crude Oil spot prices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FULL INSTRUMENT LIST */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="text-xs font-mono tracking-widest uppercase opacity-40 mb-4">
          // ALL INSTRUMENTS
        </div>
        <h2 className="text-3xl font-bold text-white mb-10 font-sans">
          Every market we cover.
        </h2>

        <div className="space-y-16">
          {[
            { key: "forex" as const, name: "Forex" },
            { key: "commodities" as const, name: "Commodities" },
            { key: "indices" as const, name: "Indices" },
            { key: "crypto" as const, name: "Cryptocurrencies" },
          ].map(cat => {
            const list = getCategoryInstruments(cat.key);
            return (
              <div key={cat.key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white uppercase font-sans">
                      {cat.name}
                    </h3>
                    <span className="bg-white/5 rounded-full px-3 py-1 text-xs font-mono opacity-50 text-white">
                      {list.length}
                    </span>
                  </div>
                  <Link 
                    href={`/markets/${cat.key}`}
                    className="text-xs text-[#C8F135] font-mono hover:underline"
                  >
                    View all {cat.name} &rarr;
                  </Link>
                </div>

                <div className="border-t border-white/5">
                  {list.map(inst => (
                    <Link 
                      key={inst.slug}
                      href={`/markets/${inst.category}/${inst.slug}`}
                      className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/[0.02] transition px-2 rounded cursor-pointer group"
                    >
                      <div className="flex items-baseline">
                        <span className="font-mono font-semibold text-sm text-white group-hover:text-[#C8F135] transition-colors">
                          {inst.displayPair}
                        </span>
                        <span className="text-xs text-white opacity-40 ml-3 hidden sm:inline">
                          {inst.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-mono bg-white/5 border border-white/10 rounded-full px-3 py-1 opacity-60 text-white">
                          {inst.drawdownPhase.split(" — ")[0]}
                        </span>
                        <span className="text-[#C8F135] ml-4 text-sm group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7 — BOTTOM CTA STRIP */}
      <section className="py-16 border-t border-white/8 w-full bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 font-sans">
            Want to learn to trade these markets properly?
          </h2>
          <p className="text-base text-white opacity-50 mb-8 max-w-2xl mx-auto font-sans leading-relaxed">
            The Drawdown curriculum takes you from complete beginner to structured, risk-managed trader across forex, commodities, indices and crypto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-[#C8F135] text-black font-semibold px-8 py-3 rounded-lg hover:opacity-95 transition font-sans text-center"
            >
              Start Free on Drawdown &rarr;
            </Link>
            <Link
              href="/courses"
              className="border border-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/5 transition font-sans text-center"
            >
              View the Curriculum &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
