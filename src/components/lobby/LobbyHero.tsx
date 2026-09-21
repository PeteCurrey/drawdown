"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, TrendingUp, ShieldAlert, Radio, ChevronRight, Zap } from "lucide-react";
import type { LobbyArticle } from "@/types/lobby";

interface LobbyHeroProps {
  leadStory?: LobbyArticle | null;
}

const LIVE_TICKERS = [
  { symbol: "S&P 500", value: "5,864.20", change: "+0.45%", up: true },
  { symbol: "NASDAQ", value: "18,489.15", change: "+0.87%", up: true },
  { symbol: "EUR/USD", value: "1.0842", change: "-0.18%", up: false },
  { symbol: "XAU/USD", value: "$2,748.10", change: "+1.12%", up: true },
  { symbol: "BTC/USD", value: "$64,250", change: "+2.40%", up: true },
  { symbol: "US 10Y", value: "4.08%", change: "+0.03", up: true },
  { symbol: "DXY", value: "101.15", change: "-0.12%", up: false },
];

export function LobbyHero({ leadStory }: LobbyHeroProps) {
  const scrollToContent = () => {
    const el = document.getElementById("lobby-content") || document.getElementById("whats-happening");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-56px)] flex flex-col justify-between overflow-hidden bg-[#0B0E12] text-white">
      {/* 1. Background Image with Next.js Image Optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/lobby/lobby-hero-penthouse.jpg"
          alt="Modern penthouse trading office overlooking New York City skyline at night"
          fill
          priority
          quality={95}
          className="object-cover object-center transform scale-[1.02] transition-transform duration-1000 ease-out"
          sizes="100vw"
        />
        {/* Multilayered cinematic overlays for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E12] via-[#0B0E12]/60 to-[#0B0E12]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E12]/90 via-[#0B0E12]/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B0E12]/30 to-[#0B0E12]/90" />
      </div>

      {/* 2. Top Live Market Ticker Tape */}
      <div className="relative z-10 w-full border-b border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden py-2">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/70 font-semibold hidden sm:inline">
              LIVE MARKET FLOW
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs font-mono">
            {LIVE_TICKERS.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center gap-2">
                <span className="text-white/60 font-medium">{ticker.symbol}</span>
                <span className="text-white font-semibold">{ticker.value}</span>
                <span
                  className={`text-[11px] font-semibold flex items-center ${
                    ticker.up ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Hero Main Content */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#B8752E] animate-pulse"></span>
            <span className="font-semibold text-[#E5A96A]">THE LOBBY</span>
            <span className="text-white/30">•</span>
            <span className="text-white/80">INSTITUTIONAL MARKET SURVEILLANCE</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-[-0.04em] text-white leading-[0.95] drop-shadow-2xl">
            THE LOBBY
          </h1>

          <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white/90 tracking-tight leading-snug">
            Where institutional edge meets unfiltered industry surveillance.
          </p>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/70 max-w-2xl font-sans leading-relaxed">
            Broadsheet investigative reporting, verified broker audit trails, prop firm solvency surveillance, and quantitative market research. Zero marketing noise. Pure institutional signal.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={scrollToContent}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded bg-white text-[#0B0E12] font-semibold text-xs sm:text-sm uppercase tracking-wider font-mono hover:bg-[#E5A96A] hover:text-[#0B0E12] transition-all shadow-lg hover:shadow-white/20"
            >
              <span>Enter Newsroom</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            <Link
              href="/wire"
              className="flex items-center gap-2 px-5 py-3.5 rounded bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-all"
            >
              <Radio className="w-4 h-4 text-[#B8752E]" />
              <span>The Wire Live</span>
            </Link>

            <Link
              href="/lobby/prop-firms"
              className="hidden sm:flex items-center gap-2 px-5 py-3.5 rounded bg-transparent hover:bg-white/5 border border-white/10 text-white/80 hover:text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Prop Firm Watch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Breaking / Lead Story Preview Strip */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {leadStory ? (
            <div className="flex items-start sm:items-center gap-3 overflow-hidden">
              <span className="shrink-0 px-2 py-0.5 rounded bg-[#B8752E] text-[#0B0E12] font-mono font-bold text-[10px] uppercase tracking-wider">
                LEAD STORY
              </span>
              <Link
                href={`/lobby/${leadStory.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${leadStory.slug}`}
                className="group flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white font-medium truncate"
              >
                <span className="truncate group-hover:underline">
                  {leadStory.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B8752E] shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>CONTINUOUS MARKET COVERAGE // 12 SPECIALISED DESKS</span>
            </div>
          )}

          <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-wider text-white/60 shrink-0">
            <button
              onClick={scrollToContent}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <span>Scroll to Explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#B8752E]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
