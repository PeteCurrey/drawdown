"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ShieldAlert, Radio, ChevronRight } from "lucide-react";
import type { LobbyArticle } from "@/types/lobby";
import { LobbyTickerTape } from "./LobbyTickerTape";

interface LobbyHeroProps {
  leadStory?: LobbyArticle | null;
}

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
          alt="Luxury penthouse overlooking the New York City skyline at dusk — executive trading desk with financial charts, modern fireplace and live baseball on wall TV"
          fill
          priority
          quality={100}
          className="object-cover object-center transform scale-[1.01] transition-transform duration-1000 ease-out"
          sizes="100vw"
        />
        {/* Softened cinematic ambient overlays to reveal glowing city skyline lights */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E12] via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E12]/80 via-[#0B0E12]/30 to-transparent" />
      </div>

      {/* 2. Top Live Market Ticker Tape */}
      <div className="relative z-10 w-full border-b border-white/10 bg-black/50 backdrop-blur-md overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center h-11 sm:h-12">
          <div className="flex items-center gap-2 shrink-0 pr-3 sm:pr-6 border-r border-white/10 h-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/80 font-semibold whitespace-nowrap hidden sm:inline">
              LIVE MARKET FLOW
            </span>
          </div>

          <div className="flex-1 h-full min-w-0 flex items-center overflow-hidden">
            <LobbyTickerTape />
          </div>
        </div>
      </div>

      {/* 3. Hero Main Content */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 flex-1 flex flex-col justify-center items-start text-left">
        <div className="max-w-2xl">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#B8752E] animate-pulse"></span>
            <span className="font-semibold text-[#E5A96A]">THE LOBBY</span>
            <span className="text-white/30">•</span>
            <span className="text-white/80">INSTITUTIONAL MARKET SURVEILLANCE</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-[-0.04em] text-white leading-[0.95] drop-shadow-2xl">
            THE LOBBY
          </h1>

          <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white/90 tracking-tight leading-snug drop-shadow-md">
            Where institutional edge meets unfiltered industry surveillance.
          </p>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-xl font-sans leading-relaxed drop-shadow">
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
              className="flex items-center gap-2 px-5 py-3.5 rounded bg-black/40 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-all"
            >
              <Radio className="w-4 h-4 text-[#B8752E]" />
              <span>The Wire Live</span>
            </Link>

            <Link
              href="/lobby/prop-firms"
              className="hidden sm:flex items-center gap-2 px-5 py-3.5 rounded bg-black/30 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-all"
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
