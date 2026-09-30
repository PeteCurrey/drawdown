"use client";

import React from "react";
import Link from "next/link";
import { Zap, Lock, ArrowUpRight, ShieldCheck, Target, TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";

export interface SignalItem {
  id: string;
  instrument: string;
  timeframe: string;
  bias: "BULLISH" | "BEARISH";
  dcs_score: number | null;
  confluence_score: number;
  entry_price: number | null;
  stop_loss: number | null;
  take_profit_1: number | null;
  take_profit_2: number | null;
  take_profit_3: number | null;
  rr_ratio: number | null;
  atr: number | null;
  catalyst_event: any;
  confluence_factors: any;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  locked: boolean;
}

interface SignalDiscoveryFeedProps {
  signals: SignalItem[];
  canAccessSignals: boolean;
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function SignalDiscoveryFeed({ signals, canAccessSignals }: SignalDiscoveryFeedProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFF4EC] text-[#F9771D]">
              <Zap className="h-3 w-3" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A]">
              Active Signals & Confluence Discovery
            </h2>
          </div>
          <p className="text-xs text-[#555550]">
            Systematically generated multi-timeframe trade confluences with composite DCS confidence scoring.
          </p>
        </div>

        <Link
          href="/dashboard/signal-centre"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F9771D] hover:text-[#e06512] transition"
        >
          <span>Open Signal Centre</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {signals.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E6E1] bg-white p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F5] text-[#888882]">
            <Zap className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1A1A1A]">No Active Signals Found</h3>
            <p className="text-xs text-[#555550] max-w-md mx-auto">
              Our signal scan engine runs every 5 minutes across multi-timeframe technical indicators and AI consensus. All recent setups have expired or are awaiting fresh structural triggers.
            </p>
          </div>
          <Link
            href="/dashboard/signal-centre"
            className="inline-flex items-center justify-center rounded-xl bg-[#1A1A1A] px-4 py-2 text-xs font-medium text-white transition hover:bg-black"
          >
            Check Signal Archives
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((sig) => {
            const isBullish = sig.bias === "BULLISH";
            const catalystText = sig.catalyst_event?.event || "Technical Structure & Momentum Alignment";
            const dcs = sig.dcs_score ?? 75;

            return (
              <div
                key={sig.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E8E6E1] bg-white p-4 transition-all hover:border-[#F9771D]/40 hover:shadow-xs"
              >
                {/* Header: Pair, Timeframe, Bias */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#1A1A1A]">
                        {sig.instrument}
                      </span>
                      <span className="rounded bg-[#F0EEE9] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#555550]">
                        {sig.timeframe}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {sig.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-600">
                          RECENT
                        </span>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isBullish
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isBullish ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{sig.bias}</span>
                      </span>
                    </div>
                  </div>

                  {/* DCS Score meter */}
                  <div className="space-y-1.5 rounded-xl border border-[#E8E6E1]/70 bg-[#F7F7F5] p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#555550]">DCS Confidence</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">{dcs} / 100</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8E6E1]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#F9771D] to-[#18B880] transition-all"
                        style={{ width: `${Math.min(100, Math.max(10, dcs))}%` }}
                      />
                    </div>
                  </div>

                  {/* Catalyst statement */}
                  <p className="text-[11px] text-[#555550] line-clamp-2 leading-relaxed">
                    {catalystText}
                  </p>
                </div>

                {/* Execution parameters (Entitlement gated) */}
                <div className="mt-4 pt-3 border-t border-[#E8E6E1]">
                  {sig.locked ? (
                    <div className="relative overflow-hidden rounded-xl border border-[#F9771D]/20 bg-[#FFFDF9] p-3 text-center">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#1A1A1A]">
                          <Lock className="h-3.5 w-3.5 text-[#F9771D]" />
                          <span>Entry, SL & TP Levels Hidden</span>
                        </div>
                        <p className="text-[10px] text-[#888882]">
                          Available to Core Subscribers (£24.99/mo)
                        </p>
                        <Link
                          href="/dashboard/profile?tab=billing"
                          className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[#1A1A1A] py-1.5 text-[11px] font-medium text-white transition hover:bg-black"
                        >
                          <span>Unlock Signal Levels</span>
                          <ArrowRight className="h-3 w-3 text-[#F9771D]" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-[#F7F7F5] p-1.5">
                          <span className="block text-[9px] uppercase font-semibold text-[#888882]">Entry</span>
                          <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                            {sig.entry_price ?? "—"}
                          </span>
                        </div>
                        <div className="rounded-lg bg-rose-50/60 p-1.5">
                          <span className="block text-[9px] uppercase font-semibold text-rose-600">Stop</span>
                          <span className="font-mono text-xs font-bold text-rose-700">
                            {sig.stop_loss ?? "—"}
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-50/60 p-1.5">
                          <span className="block text-[9px] uppercase font-semibold text-emerald-600">Target 1</span>
                          <span className="font-mono text-xs font-bold text-emerald-700">
                            {sig.take_profit_1 ?? "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#888882] px-0.5">
                        <span>R:R {sig.rr_ratio ? `1:${sig.rr_ratio}` : "—"}</span>
                        <span>{timeAgo(sig.created_at)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
