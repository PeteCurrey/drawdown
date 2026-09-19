"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { ToolFormulaSection } from "@/components/tools/ToolFormulaSection";
import { ToolContextualCTA, ToolDisclaimer } from "@/components/tools/ToolContextualCTA";
import { SESSIONS, getSessionStatuses, isHourInSession } from "@/lib/tools/market-hours";
import { Clock, Globe, Zap, CheckCircle2, AlertCircle } from "lucide-react";

export function ForexMarketHoursClient() {
  const [now, setNow] = useState<Date>(new Date());
  const [localTz, setLocalTz] = useState<string>("UTC");

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setLocalTz(detected);
    } catch {}

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sessionData = useMemo(() => {
    return getSessionStatuses(now);
  }, [now]);

  // Formatted local and UTC clock strings
  const utcString = now.toUTCString().slice(17, 25);
  const localTimeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 24 Hour Blocks for the Interactive Linear Scrub Bar (00 to 23 UTC)
  const hours24 = Array.from({ length: 24 }, (_, i) => i);
  const currentUtcFraction = now.getUTCHours() + now.getUTCMinutes() / 60;

  return (
    <div className="w-full min-h-screen bg-[var(--surface-base)] pt-32 pb-24 text-[var(--text-primary)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <ToolHeader
          badge="Live Market Utility"
          title="Forex Market Hours &amp; Session Clock"
          subtitle="Track Sydney, Tokyo, London, and New York trading sessions in real-time. Identify the highest liquidity overlaps and session open volatility windows."
        />

        {/* Real-Time Clocks Strip */}
        <div
          className="p-6 sm:p-8 border mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
          style={{
            borderColor: "rgba(22,33,62,0.12)",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(22,33,62,0.08)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-raised)] border border-black/5 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[var(--accent)] animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] block">
                Universal Coordinated Time (UTC)
              </span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
                {utcString}{" "}
                <span className="text-xs font-sans font-medium text-[var(--text-tertiary)]">
                  UTC
                </span>
              </div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-8 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] block">
              Your Local Time ({localTz})
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-[var(--accent)] tracking-tight">
              {localTimeString}
            </div>
          </div>
        </div>

        {/* Active Overlaps Banner */}
        {sessionData.activeOverlaps.length > 0 && (
          <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-md mb-8 flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs font-mono text-emerald-900">
              <span className="font-bold uppercase tracking-wider block">
                Peak Liquidity Confluence Active:
              </span>
              {sessionData.activeOverlaps.join(" · ")}
            </div>
          </div>
        )}

        {/* 4 Major Sessions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sessionData.sessions.map((st) => (
            <div
              key={st.session.id}
              className="p-6 border flex flex-col justify-between transition-all"
              style={{
                borderColor: st.isOpen ? st.session.color : "var(--border-subtle)",
                backgroundColor: "var(--surface-raised)",
                boxShadow: st.isOpen ? `0 0 24px ${st.session.color}15` : "none",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                    {st.session.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full border ${
                      st.isOpen
                        ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                        : "border-black/10 bg-black/5 text-[var(--text-tertiary)]"
                    }`}
                  >
                    {st.statusText}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="text-xs font-mono text-[var(--text-secondary)]">
                    Hours: {st.session.utcOpenHour.toString().padStart(2, "0")}:00 – {st.session.utcCloseHour.toString().padStart(2, "0")}:00 UTC
                  </div>
                  <div className="text-xs font-mono font-semibold text-[var(--accent)]">
                    {st.timeRemainingText}
                  </div>
                </div>

                {/* Progress bar if open */}
                {st.isOpen && (
                  <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${st.progressPercent}%`,
                        backgroundColor: st.session.color,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 space-y-2 text-[11px] font-mono">
                <div className="text-[var(--text-tertiary)] uppercase tracking-wider">
                  Top Traded Pairs:
                </div>
                <div className="flex flex-wrap gap-1">
                  {st.session.keyPairs.map((p) => (
                    <span
                      key={p}
                      className="px-1.5 py-0.5 rounded border border-black/5 bg-[var(--surface-base)] text-[var(--text-secondary)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] pt-1">
                  {st.session.shareOfVolume}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 24-Hour Timeline Bar Visualizer */}
        <div
          className="p-6 sm:p-8 border mb-12"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                24-Hour Global Timeline (UTC)
              </h3>
              <p className="text-xs font-sans text-[var(--text-secondary)] mt-0.5">
                Current time highlighted with marker. Inspect overlapping session liquidity.
              </p>
            </div>
            <div className="text-xs font-mono text-[var(--accent)] font-semibold">
              Now: {sessionData.currentUtcHours.toString().padStart(2, "0")}:{sessionData.currentUtcMinutes.toString().padStart(2, "0")} UTC
            </div>
          </div>

          <div className="space-y-4">
            {SESSIONS.map((sess) => (
              <div key={sess.id} className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>{sess.name}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {sess.utcOpenHour}:00 - {sess.utcCloseHour}:00 UTC
                  </span>
                </div>
                <div className="grid grid-cols-24 gap-0.5 h-6 bg-black/[0.03] p-0.5 rounded border border-black/5">
                  {hours24.map((hr) => {
                    const active = isHourInSession(hr + 0.5, sess.utcOpenHour, sess.utcCloseHour);
                    const isCurrent = Math.floor(currentUtcFraction) === hr;

                    return (
                      <div
                        key={hr}
                        title={`${hr}:00 UTC`}
                        className={`h-full rounded-xs transition-colors relative ${
                          active ? "opacity-90" : "opacity-0"
                        } ${isCurrent ? "ring-2 ring-black" : ""}`}
                        style={{
                          backgroundColor: sess.color,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Hour Axis */}
            <div className="grid grid-cols-24 gap-0.5 pt-1 text-[9px] font-mono text-[var(--text-tertiary)] text-center">
              {hours24.map((hr) => (
                <div key={hr} className={hr % 4 === 0 ? "font-bold text-[var(--text-primary)]" : ""}>
                  {hr % 4 === 0 ? hr : "·"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Framework */}
        <ToolFormulaSection
          title="Session Overlaps &amp; Liquidity Dynamics"
          description="The foreign exchange market is a decentralized 24-hour over-the-counter market that follows the sun. While trading is theoretically continuous from Sunday 21:00 UTC to Friday 21:00 UTC, volatility and spreads are heavily dictated by cross-continental session overlaps."
          formulaLatex="\text{Peak Volume} = \text{London Session} \cap \text{New York Session} \quad (12:00 - 16:00\ \text{UTC})"
          steps={[
            "Sydney Session (21:00 - 06:00 UTC): Opens the global trading day. Typically lower volume, focused on AUD and NZD crosses.",
            "Tokyo Session (00:00 - 09:00 UTC): Asia-Pacific flow center. High volume in USD/JPY and JPY cross pairs.",
            "London Session (07:00 - 16:00 UTC): The global financial capital for FX. London alone handles ~38% of total daily global forex turnover.",
            "New York Session (12:00 - 21:00 UTC): Merges with London between 12:00 and 16:00 UTC, producing over 50% of all daily transactions.",
          ]}
          faqs={[
            {
              question: "What is the best time of day to trade Forex?",
              answer:
                "The London / New York overlap (12:00 – 16:00 UTC / 8:00 AM – 12:00 PM EST) offers the tightest spreads, cleanest liquidity, and most reliable directional momentum of the entire trading day.",
            },
            {
              question: "Why do broker spreads widen at 21:00 / 22:00 UTC?",
              answer:
                "At 5:00 PM New York time, the New York trading floor closes and interbank rollover takes place. Between New York close and Asian liquidity arrival, interbank spreads widen dramatically.",
            },
          ]}
        />

        {/* Contextual CTA */}
        <ToolContextualCTA
          toolName="Forex Market Hours"
          lead="Align execution with true institutional session volume."
          benefit="The Drawdown Investment Centre terminal provides automated session alerts and pre-market briefings right as London and New York open."
        />

        <ToolDisclaimer />
      </div>
    </div>
  );
}
