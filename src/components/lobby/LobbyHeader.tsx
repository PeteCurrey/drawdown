"use client";

import Link from "next/link";
import { ArrowLeft, Search, Rss, Radio } from "lucide-react";

export function LobbyHeader() {
  return (
    <header className="sticky top-0 z-50 w-full h-[56px] bg-[#0B0E12]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">

        {/* Left: Back link & Lobby identity */}
        <div className="flex items-center gap-5 h-full">
          <Link
            href="/"
            className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-150 text-xs font-mono tracking-wider uppercase"
            title="Return to Drawdown Main Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-[#B8752E]" />
            <span>Main Site</span>
          </Link>

          <span className="w-px h-4 bg-white/10" />

          {/* Lobby Brand */}
          <Link
            href="/lobby"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-150"
          >
            <span className="font-display font-black text-sm tracking-tight">
              DRAWDOWN
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#B8752E] font-bold">
              THE LOBBY
            </span>
          </Link>
        </div>

        {/* Center: Live status — flat, no pill */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.14em] text-white/40">
          <span className="flex items-center gap-2 text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white/60">MARKET SURVEILLANCE ACTIVE</span>
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span>LONDON / NEW YORK DESK</span>
        </div>

        {/* Right: Actions — flat links, no pill/rounded containers */}
        <div className="flex items-center gap-5 h-full">
          <Link
            href="/wire"
            className="flex items-center gap-1.5 text-[#E5A96A] hover:text-[#F5C28A] transition-colors duration-150 text-[11px] font-mono uppercase tracking-wider font-semibold"
            title="The Wire - Real-Time Terminal Feed"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            <span>The Wire</span>
          </Link>

          <span className="w-px h-4 bg-white/10 hidden sm:block" />

          <Link
            href="/lobby/archive"
            className="hidden sm:block text-[11px] font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors duration-150"
          >
            Archive
          </Link>

          <Link
            href="/lobby/rss.xml"
            className="text-white/40 hover:text-white transition-colors duration-150"
            title="Lobby RSS Feed"
            aria-label="Lobby RSS Feed"
          >
            <Rss className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/lobby/search"
            aria-label="Search The Lobby"
            className="text-white/40 hover:text-white transition-colors duration-150"
            title="Search The Lobby"
          >
            <Search className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </header>
  );
}
