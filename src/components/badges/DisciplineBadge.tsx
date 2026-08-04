"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, XCircle, Info } from "lucide-react";
import type { DisciplineScore, BadgeTier, CriterionResult } from "@/lib/discipline-scorer";

// ─── Badge tier visual config ─────────────────────────────────────────────────
const TIER_CONFIG: Record<
  "bronze" | "silver" | "gold",
  { label: string; color: string; border: string; bg: string; glow: string }
> = {
  bronze: {
    label:  "Verified Discipline — Bronze",
    color:  "#CD7F32",
    border: "rgba(205, 127, 50, 0.4)",
    bg:     "rgba(205, 127, 50, 0.06)",
    glow:   "0 0 20px rgba(205, 127, 50, 0.15)",
  },
  silver: {
    label:  "Verified Discipline — Silver",
    color:  "#9CA3AF",
    border: "rgba(156, 163, 175, 0.4)",
    bg:     "rgba(156, 163, 175, 0.06)",
    glow:   "0 0 20px rgba(156, 163, 175, 0.15)",
  },
  gold: {
    label:  "Verified Discipline — Gold",
    color:  "#E2B755",
    border: "rgba(226, 183, 85, 0.4)",
    bg:     "rgba(226, 183, 85, 0.06)",
    glow:   "0 0 20px rgba(226, 183, 85, 0.20)",
  },
};

// ─── Criterion Row ────────────────────────────────────────────────────────────
function CriterionRow({ c }: { c: CriterionResult }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: "var(--line-200)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 py-3 text-left"
        aria-expanded={open}
      >
        {c.passed ? (
          <CheckCircle2 size={15} className="shrink-0 text-green-600" />
        ) : (
          <XCircle size={15} className="shrink-0 text-red-500" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold" style={{ color: "var(--ink-950)" }}>
            {c.label}
          </p>
          <p className="text-[10px] font-mono" style={{ color: "var(--graphite-600)" }}>
            Required: {c.threshold} &nbsp;·&nbsp; Yours: {c.actual}
          </p>
        </div>
        {open ? (
          <ChevronUp size={13} style={{ color: "var(--graphite-600)" }} />
        ) : (
          <ChevronDown size={13} style={{ color: "var(--graphite-600)" }} />
        )}
      </button>
      {open && (
        <p className="pb-3 pl-7 text-[12px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
          {c.description}
        </p>
      )}
    </div>
  );
}

// ─── No-badge state ───────────────────────────────────────────────────────────
function NotYetEarned({ score }: { score?: DisciplineScore }) {
  const [showCriteria, setShowCriteria] = useState(false);
  return (
    <div
      className="p-6 border space-y-4"
      style={{ borderColor: "var(--line-200)", backgroundColor: "var(--paper-100)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center border"
          style={{ borderColor: "var(--line-200)" }}
        >
          <ShieldCheck size={18} style={{ color: "var(--graphite-600)" }} />
        </div>
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
            No Badge Yet
          </p>
          <p className="text-[12px]" style={{ color: "var(--graphite-600)" }}>
            Keep journalling consistently to qualify.
          </p>
        </div>
      </div>

      {score && (
        <>
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--graphite-600)" }}>
                Process Score
              </span>
              <span className="text-[12px] font-bold" style={{ color: "var(--ink-950)" }}>
                {score.aggregate_score}/100
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--line-200)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${score.aggregate_score}%`,
                  backgroundColor: score.aggregate_score === 100 ? "#16a34a" : "var(--signal-navy)",
                }}
              />
            </div>
          </div>

          {/* Criteria toggle */}
          <button
            onClick={() => setShowCriteria((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider"
            style={{ color: "var(--signal-navy)" }}
          >
            <Info size={12} />
            {showCriteria ? "Hide" : "What's being measured"}
          </button>
          {showCriteria && score.criteria.map((c) => <CriterionRow key={c.key} c={c} />)}
        </>
      )}

      {/* Compliance note — never implies profit */}
      <p className="text-[10px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
        The Verified Discipline badge measures process consistency, not profitability.
        It does not predict or guarantee future trading returns.
      </p>
    </div>
  );
}

// ─── Badge earned state ───────────────────────────────────────────────────────
function BadgeEarned({
  tier,
  score,
  consecutiveDays,
  verifiedSinceDate,
}: {
  tier: "bronze" | "silver" | "gold";
  score?: DisciplineScore;
  consecutiveDays: number;
  verifiedSinceDate?: string;
}) {
  const cfg = TIER_CONFIG[tier];
  const [showCriteria, setShowCriteria] = useState(false);

  return (
    <div
      className="p-6 border space-y-5 relative overflow-hidden"
      style={{
        borderColor: cfg.border,
        backgroundColor: cfg.bg,
        boxShadow: cfg.glow,
      }}
    >
      {/* Decorative corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${cfg.color}, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 flex items-center justify-center border-2"
          style={{ borderColor: cfg.border, backgroundColor: cfg.bg }}
        >
          <ShieldCheck size={22} style={{ color: cfg.color }} />
        </div>
        <div>
          <p
            className="text-[10px] font-mono font-bold uppercase tracking-[0.12em]"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </p>
          {consecutiveDays > 0 && (
            <p className="text-[11px]" style={{ color: "var(--graphite-600)" }}>
              {consecutiveDays} days of consistent process
              {verifiedSinceDate ? ` · since ${verifiedSinceDate}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Score bar */}
      {score && (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--line-200)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: "100%", backgroundColor: cfg.color }}
            />
          </div>
          <p className="text-[10px] font-mono" style={{ color: "var(--graphite-600)" }}>
            All 4 criteria met · 90-day rolling window · {score.trade_count} trades logged
          </p>
        </div>
      )}

      {/* Criteria toggle */}
      {score && (
        <>
          <button
            onClick={() => setShowCriteria((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider"
            style={{ color: cfg.color }}
          >
            <Info size={12} />
            {showCriteria ? "Hide details" : "See what's being measured"}
          </button>
          {showCriteria && score.criteria.map((c) => <CriterionRow key={c.key} c={c} />)}
        </>
      )}

      {/* Compliance note */}
      <p className="text-[10px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
        This badge measures adherence to a defined process over 90 days.
        It does not measure or imply profitability. Past discipline does not guarantee future returns.
      </p>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export interface DisciplineBadgeProps {
  /** null = not yet earned */
  tier: BadgeTier;
  /** Full score breakdown from scoring engine */
  score?: DisciplineScore;
  /** How many consecutive days all criteria have been met */
  consecutiveDays?: number;
  /** ISO date string when the badge was first awarded */
  verifiedSinceDate?: string;
}

export function DisciplineBadge({
  tier,
  score,
  consecutiveDays = 0,
  verifiedSinceDate,
}: DisciplineBadgeProps) {
  if (!tier) {
    return <NotYetEarned score={score} />;
  }
  return (
    <BadgeEarned
      tier={tier}
      score={score}
      consecutiveDays={consecutiveDays}
      verifiedSinceDate={verifiedSinceDate}
    />
  );
}
