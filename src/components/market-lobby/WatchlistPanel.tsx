"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Lock, ArrowUpRight, Plus, Bell } from "lucide-react";
import { LobbyUpgradeGate } from "./LobbyUpgradeGate";

interface WatchlistItem {
  id: string;
  symbol: string;
  alerts_enabled: boolean;
  price?: number | null;
  changePct?: number | null;
  bias?: string;
}

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  canAccessWatchlists: boolean;
}

export function WatchlistPanel({ watchlist, canAccessWatchlists }: WatchlistPanelProps) {
  if (!canAccessWatchlists) {
    return (
      <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs">
        <LobbyUpgradeGate
          title="Custom Watchlists & Real-Time Alerts"
          description="Bookmark high-conviction assets, monitor consolidated quotes, and receive instant price threshold alerts."
          features={[
            "Unlimited custom watchlists across FX, Crypto, and Indices",
            "Price cross and structure shift alerts",
            "Instant access to 1-click order calculations",
            "Included with Core Membership (£24.99/mo)",
          ]}
          ctaText="Unlock Watchlists — £24.99/mo"
          ctaHref="/dashboard/profile?tab=billing"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFF4EC] text-[#F9771D]">
            <Bookmark className="h-3 w-3" />
          </span>
          <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A]">
            Priority Watchlist
          </h2>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#F9771D] hover:text-[#e06512] transition"
        >
          <span>Manage in Dashboard</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {watchlist.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E8E6E1] bg-[#F7F7F5]/50 p-6 text-center space-y-2">
          <p className="text-xs text-[#555550]">
            No instruments pinned to your watchlist yet.
          </p>
          <Link
            href="/dashboard/market-intelligence"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E8E6E1] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:border-[#F9771D] transition shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5 text-[#F9771D]" />
            <span>Discover Instruments</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {watchlist.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/market-intelligence?symbol=${item.symbol}`}
              className="flex flex-col justify-between rounded-xl border border-[#E8E6E1] bg-[#F7F7F5] p-3 transition hover:border-[#F9771D]/40 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1A1A1A]">{item.symbol}</span>
                {item.alerts_enabled && (
                  <Bell className="h-3 w-3 text-[#F9771D]" />
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                  {item.price !== null && item.price !== undefined ? item.price : "—"}
                </span>
                {item.changePct !== null && item.changePct !== undefined && (
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      item.changePct > 0
                        ? "text-[#18B880]"
                        : item.changePct < 0
                        ? "text-[#CE6969]"
                        : "text-[#888882]"
                    }`}
                  >
                    {item.changePct > 0 ? "+" : ""}
                    {item.changePct.toFixed(2)}%
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
