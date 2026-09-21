import Link from "next/link";
import { Rss } from "lucide-react";

export function LobbyMasthead() {
  // Format current broadsheet date stamp pinned to London financial market time
  const today = new Date();
  const dateString = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London"
  }).toUpperCase();

  return (
    <header className="w-full border-b border-[#DEDDD8] bg-[#FFFFFF] pt-6 pb-5">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Top Broadsheet Dateline Bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono uppercase tracking-[0.12em] text-[#4B5157] pb-3 mb-4 border-b border-[#DEDDD8]/60">
          <div className="flex items-center gap-3">
            <span>{dateString}</span>
            <span className="text-[#DEDDD8]">•</span>
            <span className="hidden sm:inline">DRAWDOWN EDITORIAL INTELLIGENCE</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Market Session Ticker / Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[#0B0E12] font-semibold">LONDON / NEW YORK SESSIONS</span>
            </div>

            <Link
              href="/lobby/rss.xml"
              className="hidden sm:flex items-center gap-1 hover:text-[#16213E] transition-colors"
              title="Lobby RSS Feed"
            >
              <Rss className="w-3 h-3 text-[#B8752E]" />
              <span>RSS</span>
            </Link>
          </div>
        </div>

        {/* Central Masthead Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-2">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-[-0.04em] text-[#0B0E12] leading-none select-none">
              THE LOBBY
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#4B5157] font-sans max-w-xl leading-relaxed">
              What&apos;s happening in markets, trading and the businesses built around them.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#4B5157]">
              EDITION // CONTINUOUS DISPATCH
            </span>
            <span className="text-xs text-[#0B0E12] font-mono mt-1">
              TRUTH-FIRST MARKET SURVEILLANCE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
