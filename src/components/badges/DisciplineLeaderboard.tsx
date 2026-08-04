"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Calendar, Trophy, Info } from "lucide-react";

interface LeaderboardEntry {
  name: string;
  tier: "bronze" | "silver" | "gold";
  since: string;
}

const TIER_BADGES = {
  bronze: { label: "Bronze", color: "#CD7F32", bg: "rgba(205, 127, 50, 0.1)", border: "rgba(205, 127, 50, 0.3)" },
  silver: { label: "Silver", color: "#9CA3AF", bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.3)" },
  gold:   { label: "Gold",   color: "#E2B755", bg: "rgba(226, 183, 85, 0.1)", border: "rgba(226, 183, 85, 0.3)" },
};

export function DisciplineLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/discipline/leaderboard");
        if (!res.ok) throw new Error("Failed to load community board");
        const data = await res.json();
        setEntries(data.leaderboard ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-100 rounded" />
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-gray-50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="p-6 bg-white border border-[#DEDDD8] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-6">
      <div className="flex items-center justify-between border-b border-[#DEDDD8] pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">Verified Discipline</h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-accent bg-accent/5 px-2 py-0.5 rounded">
          {entries.length} ACTIVE
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-text-tertiary text-center py-4">
          No members have currently opted in to share their badges publicly.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const badge = TIER_BADGES[entry.tier];
            const dateStr = new Date(entry.since).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg transition-all hover:bg-gray-50/50"
                style={{ borderColor: "var(--line-200)" }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-[#1A1A1A]">
                      {entry.name}
                    </p>
                    <p className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      Active since {dateStr}
                    </p>
                  </div>
                </div>

                <div
                  className="px-2 py-1 border text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1 shrink-0"
                  style={{
                    color: badge.color,
                    backgroundColor: badge.bg,
                    borderColor: badge.border,
                  }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {badge.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimers & Info */}
      <div className="p-3 bg-gray-50 border border-gray-100 rounded text-[9.5px] leading-relaxed text-gray-500 space-y-2">
        <div className="flex items-start gap-1">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <p>
            Badges are gained or lost dynamically based on a rolling 90-day process compliance window. 
            Default privacy is strictly opt-in.
          </p>
        </div>
        <p className="font-semibold text-gray-600 border-t border-gray-200/60 pt-1">
          ⚠️ Compliance Disclaimer: Verified Discipline status measures process compliance (such as setting stops and adhering to plans), not profitability. It does not guarantee or indicate future trading performance.
        </p>
      </div>
    </div>
  );
}
