"use client";

import Link from "next/link";
import { ArrowLeft, Search, Rss, Radio, ExternalLink } from "lucide-react";

export function LobbyHeader() {
  return (
    <header className="sticky top-0 z-50 w-full h-[56px] bg-[#0B0E12]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Back to Main Site link & Lobby identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 py-1.5 px-3 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-all text-xs font-mono tracking-wider uppercase"
            title="Return to Drawdown Main Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-[#B8752E]" />
            <span className="font-semibold">Main Site</span>
            <span className="hidden md:inline text-white/40 text-[11px] font-normal lowercase">
              (drawdown.trading)
            </span>
          </Link>

          <span className="text-white/20 hidden sm:inline">/</span>

          {/* Lobby Brand */}
          <Link
            href="/lobby"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <span className="font-display font-black text-sm tracking-tight">
              DRAWDOWN
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#B8752E] font-bold">
              THE LOBBY
            </span>
          </Link>
        </div>

        {/* Center: Live Session Market Pulse (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.14em] text-white/70">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">MARKET SURVEILLANCE ACTIVE</span>
          </div>
          <span className="text-white/30">•</span>
          <span className="text-white/60">LONDON / NEW YORK DESK</span>
        </div>

        {/* Right: Quick actions (Wire, Archive, Search, RSS) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/wire"
            className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-[#B8752E]/15 hover:bg-[#B8752E]/25 border border-[#B8752E]/40 text-[#E5A96A] transition-colors text-[11px] font-mono uppercase tracking-wider font-semibold"
            title="The Wire - Real-Time Terminal Feed"
          >
            <Radio className="w-3 h-3 animate-pulse text-[#E5A96A]" />
            <span>The Wire</span>
          </Link>

          <Link
            href="/lobby/archive"
            className="hidden sm:inline-flex text-[11px] font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors px-2 py-1"
          >
            Archive
          </Link>

          <Link
            href="/lobby/rss.xml"
            className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            title="Lobby RSS Feed"
            aria-label="Lobby RSS Feed"
          >
            <Rss className="w-3.5 h-3.5 text-[#B8752E]" />
          </Link>

          <Link
            href="/lobby/search"
            aria-label="Search The Lobby"
            className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            title="Search The Lobby"
          >
            <Search className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
