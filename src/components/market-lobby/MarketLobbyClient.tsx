"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MarketLobbyMasthead } from "./MarketLobbyMasthead";
import { MarketPulseBar } from "./MarketPulseBar";
import { SignalDiscoveryFeed } from "./SignalDiscoveryFeed";
import { MarketScreenerPanel } from "./MarketScreenerPanel";
import { SessionActivityPanel } from "./SessionActivityPanel";
import { IntelligenceBrief } from "./IntelligenceBrief";
import { WatchlistPanel } from "./WatchlistPanel";
import { ScreenerRow } from "@/lib/screener";
import { RefreshCw, AlertCircle } from "lucide-react";

interface MarketLobbyData {
  user: {
    authenticated: boolean;
    tier: string;
    entitlements: {
      canAccessSignals: boolean;
      canAccessScanner: boolean;
      canAccessWatchlists: boolean;
      hasCoreAccess: boolean;
      canAccessSavedScreens: boolean;
    };
  };
  pulse: ScreenerRow[];
  signals: any[];
  screener: ScreenerRow[];
  session: any;
  brief: any[];
  watchlist: any[];
  cached_at: string;
}

export function MarketLobbyClient() {
  const [data, setData] = useState<MarketLobbyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    try {
      const res = await fetch("/api/lobby/market", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Failed to load market lobby: HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error("[market-lobby] Fetch error:", err);
      setError(err?.message || "Failed to load market lobby data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-[#F9771D]" />
        <p className="text-xs font-medium text-[#888882] tracking-wider uppercase font-mono">
          Loading Drawdown Market Intelligence...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3 max-w-lg mx-auto my-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-[#1A1A1A]">Unable to Load Market Lobby</h3>
        <p className="text-xs text-[#555550]">{error}</p>
        <button
          onClick={() => fetchData(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const { user, pulse, signals, screener, session, brief, watchlist, cached_at } = data!;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Masthead */}
      <MarketLobbyMasthead
        sessionName={session?.name || "MARKET SESSION"}
        isSessionOpen={session?.isOpen ?? true}
        nextSession={session?.nextSession || "Next Session Open"}
        instrumentsCount={screener?.length || 38}
        lastUpdated={cached_at}
        onRefresh={() => fetchData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Market Pulse Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#888882] uppercase tracking-wider px-1">
          <span>Real-Time Market Pulse</span>
          <span className="font-mono text-[10px] text-[#888882] lowercase">synced via cache</span>
        </div>
        <MarketPulseBar pulse={pulse} />
      </div>

      {/* 3. Priority Signal Discovery Feed */}
      <SignalDiscoveryFeed
        signals={signals}
        canAccessSignals={user.entitlements.canAccessSignals}
      />

      {/* 4. Two-Column Mid-Section: Screener & Session Rhythm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Cross-Asset Screener */}
        <div className="lg:col-span-2">
          <MarketScreenerPanel
            rows={screener}
            canAccessScanner={user.entitlements.canAccessScanner}
            canAccessSavedScreens={user.entitlements.canAccessSavedScreens}
          />
        </div>

        {/* Right (1 col): Session Activity Rhythm + Watchlist */}
        <div className="space-y-6">
          <SessionActivityPanel session={session} />
          <WatchlistPanel
            watchlist={watchlist}
            canAccessWatchlists={user.entitlements.canAccessWatchlists}
          />
        </div>
      </div>

      {/* 5. Editorial & Macro Intelligence Brief */}
      <IntelligenceBrief articles={brief} />
    </div>
  );
}
