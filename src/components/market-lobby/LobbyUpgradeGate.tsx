"use client";

import React from "react";
import Link from "next/link";
import { Lock, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface LobbyUpgradeGateProps {
  title?: string;
  description?: string;
  features?: string[];
  ctaText?: string;
  ctaHref?: string;
  compact?: boolean;
}

export function LobbyUpgradeGate({
  title = "Unlock Full Market Intelligence",
  description = "Access complete signal parameters (Entry, SL, TP1-3), full 38-instrument real-time screener, and custom watchlists with Core Membership.",
  features = [
    "Full Signal Centre execution levels & R:R ratios",
    "Complete 38-instrument technical screener & RSI",
    "Real-time custom watchlists & price alerts",
    "Institutional order flow & composite bias",
  ],
  ctaText = "Upgrade to Core — £24.99/mo",
  ctaHref = "/dashboard/profile?tab=billing",
  compact = false,
}: LobbyUpgradeGateProps) {
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-[#F9771D]/30 bg-gradient-to-r from-[#FFF7ED] via-white to-[#FFF7ED] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F9771D]/10 text-[#F9771D]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A1A]">{title}</h4>
              <p className="text-[11px] text-[#555550]">{description}</p>
            </div>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1A1A1A] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-black"
          >
            <Zap className="h-3.5 w-3.5 text-[#F9771D]" />
            <span>{ctaText}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E8E6E1] bg-white p-6 shadow-sm">
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#F9771D]/10 blur-2xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4EC] border border-[#F9771D]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#F9771D]">
            <Lock className="h-3 w-3" />
            <span>CORE MEMBERSHIP</span>
          </div>
          <h3 className="font-display text-lg font-bold tracking-tight text-[#1A1A1A]">
            {title}
          </h3>
          <p className="text-xs text-[#555550] leading-relaxed">
            {description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[#555550]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#18B880] shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end justify-center shrink-0 space-y-2 border-t md:border-t-0 md:border-l border-[#E8E6E1] pt-4 md:pt-0 md:pl-6">
          <div className="text-left md:text-right">
            <span className="text-xs text-[#888882]">Subscription</span>
            <div className="font-mono text-xl font-bold text-[#1A1A1A]">
              £24.99<span className="text-xs font-normal text-[#888882]">/month</span>
            </div>
            <span className="text-[10px] text-[#888882]">Cancel anytime. Instant unlock.</span>
          </div>

          <Link
            href={ctaHref}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-black"
          >
            <span>{ctaText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
