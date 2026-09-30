"use client";

import React from "react";
import { Globe2, Activity, Clock, Flame } from "lucide-react";

interface SessionInfo {
  name: string;
  isOpen: boolean;
  timeUtc: string;
  nextSession: string;
  peakPairs: string[];
  biasSummary: {
    bullish: number;
    bearish: number;
    neutral: number;
    total: number;
  };
}

interface SessionActivityPanelProps {
  session: SessionInfo;
}

export function SessionActivityPanel({ session }: SessionActivityPanelProps) {
  const { bullish, bearish, neutral, total } = session.biasSummary;
  const safeTotal = total > 0 ? total : 1;
  const bullishPct = Math.round((bullish / safeTotal) * 100);
  const bearishPct = Math.round((bearish / safeTotal) * 100);
  const neutralPct = Math.max(0, 100 - bullishPct - bearishPct);

  const sessions = [
    { name: "Asian", hours: "00:00 – 08:00 UTC", active: session.name.includes("ASIAN") },
    { name: "London", hours: "08:00 – 16:30 UTC", active: session.name.includes("LONDON") },
    { name: "London / NY", hours: "13:00 – 16:30 UTC", active: session.name.includes("OVERLAP") },
    { name: "New York", hours: "13:00 – 21:00 UTC", active: session.name.includes("NEW YORK") },
  ];

  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFF4EC] text-[#F9771D]">
            <Activity className="h-3 w-3" />
          </span>
          <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A]">
            Session Rhythm & Breadth
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F7F7F5] px-2.5 py-1 text-[11px] font-mono text-[#555550]">
          <Clock className="h-3 w-3 text-[#888882]" />
          <span>{session.timeUtc}</span>
        </span>
      </div>

      {/* Global Sessions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {sessions.map((s) => (
          <div
            key={s.name}
            className={`rounded-xl p-3 border transition ${
              s.active
                ? "border-[#F9771D]/40 bg-[#FFF4EC]/40"
                : "border-[#E8E6E1] bg-[#F7F7F5]/50 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1A1A]">{s.name}</span>
              {s.active && (
                <span className="h-2 w-2 rounded-full bg-[#F9771D] animate-pulse" />
              )}
            </div>
            <span className="block text-[10px] text-[#888882] mt-0.5">{s.hours}</span>
          </div>
        ))}
      </div>

      {/* Peak Session Pairs */}
      <div className="rounded-xl border border-[#E8E6E1] bg-[#F7F7F5] p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-[#1A1A1A]">
            <Flame className="h-3.5 w-3.5 text-[#F9771D]" />
            <span>Peak Session Instruments</span>
          </span>
          <span className="text-[10px] text-[#888882]">Maximum Order Flow Overlap</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {session.peakPairs.map((p) => (
            <span
              key={p}
              className="rounded-lg bg-white border border-[#E8E6E1] px-2.5 py-1 font-mono text-xs font-semibold text-[#1A1A1A] shadow-2xs"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Market Breadth & Sentiment Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1A1A1A]">Universe Bias Breadth</span>
          <span className="text-[11px] text-[#888882]">
            {total} Evaluated Assets
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8E6E1] flex">
          <div
            className="h-full bg-[#18B880] transition-all"
            style={{ width: `${bullishPct}%` }}
            title={`Bullish: ${bullishPct}%`}
          />
          <div
            className="h-full bg-gray-400 transition-all"
            style={{ width: `${neutralPct}%` }}
            title={`Neutral: ${neutralPct}%`}
          />
          <div
            className="h-full bg-[#CE6969] transition-all"
            style={{ width: `${bearishPct}%` }}
            title={`Bearish: ${bearishPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#18B880]" />
            <span className="text-[#555550]">Bullish {bullishPct}% ({bullish})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-[#555550]">Neutral {neutralPct}% ({neutral})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#CE6969]" />
            <span className="text-[#555550]">Bearish {bearishPct}% ({bearish})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
