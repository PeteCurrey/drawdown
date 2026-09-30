"use client";

import React, { useState, useEffect } from "react";
import { Compass, Clock, Globe2, Activity, RefreshCw } from "lucide-react";

interface MastheadProps {
  sessionName: string;
  isSessionOpen: boolean;
  nextSession: string;
  instrumentsCount?: number;
  lastUpdated?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function MarketLobbyMasthead({
  sessionName,
  isSessionOpen,
  nextSession,
  instrumentsCount = 38,
  lastUpdated,
  onRefresh,
  isRefreshing = false,
}: MastheadProps) {
  const [liveUtc, setLiveUtc] = useState<string>("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setLiveUtc(`${h}:${m}:${s} UTC`);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const sessionColor = isSessionOpen
    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
    : "bg-amber-500/10 text-amber-700 border-amber-500/30";

  const dotColor = isSessionOpen ? "bg-emerald-500" : "bg-amber-500";

  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Branding & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF4EC] border border-[#F9771D]/25 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[#F9771D]">
              <Compass className="h-3 w-3" />
              <span>Market Discovery Surface</span>
            </span>
            <span className="text-[11px] font-medium text-[#888882]">
              {instrumentsCount} Instruments Tracked
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
            Market Lobby
          </h1>
          <p className="text-xs sm:text-sm text-[#555550] max-w-2xl">
            Real-time multi-asset intelligence, technical confluence scans, active session dynamics, and verified signal parameters across global financial markets.
          </p>
        </div>

        {/* Right: Session details & live clock */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Active Session Card */}
          <div className="flex items-center gap-3 rounded-xl border border-[#E8E6E1] bg-[#F7F7F5] px-3.5 py-2">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-semibold tracking-wider text-[#888882]">Active Session</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${dotColor} ${isSessionOpen ? "animate-pulse" : ""}`} />
                <span className="text-xs font-bold text-[#1A1A1A]">{sessionName}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-[#E8E6E1]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-semibold tracking-wider text-[#888882]">Next Change</span>
              <span className="text-[11px] font-medium text-[#555550]">{nextSession}</span>
            </div>
          </div>

          {/* Clock & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-[#E8E6E1] bg-white px-3 py-2 text-xs font-mono font-medium text-[#1A1A1A] shadow-xs">
              <Clock className="h-3.5 w-3.5 text-[#888882]" />
              <span>{liveUtc || "--:--:-- UTC"}</span>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Refresh market data"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E6E1] bg-white text-[#555550] hover:text-[#1A1A1A] hover:bg-[#F7F7F5] shadow-xs transition disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#F9771D]" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
