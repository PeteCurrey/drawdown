/**
 * Drawdown — Verified Discipline Badge Scoring Engine
 *
 * Scoring is based ENTIRELY on process metrics. P&L is never a factor.
 * The rubric measures rule-following, risk consistency, and journal continuity.
 *
 * Approved rubric (confirmed by Pete Currey, 2026-08-04):
 *   1. Stop-loss defined:   ≥ 90% of closed trades have stop_loss set
 *   2. Plan adherence:      ≥ 80% of closed trades have rules_followed = true
 *   3. Consistent sizing:   Coefficient of Variation of risk_percent ≤ 0.40
 *   4. Journal continuity:  ≥ 20 closed trades across 90 days, no gap > 21 days
 *
 * Rolling window: last 90 calendar days.
 * Recalculation: weekly (triggered by cron or on-demand).
 *
 * Badge tiers (days of sustained compliance):
 *   Bronze:  90 days
 *   Silver: 180 days
 *   Gold:   365 days
 */

export interface TradeRow {
  id: string;
  trading_day: string;          // "YYYY-MM-DD"
  status: "OPEN" | "CLOSED" | "CANCELLED";
  stop_loss: number | null;
  rules_followed: boolean | null;
  risk_percent: number | null;
}

export interface CriterionResult {
  key: string;
  label: string;
  description: string;          // plain-English explanation (shown to user)
  threshold: string;            // e.g. "≥ 90%"
  actual: string;               // e.g. "94.2%"
  passed: boolean;
}

export interface DisciplineScore {
  /** ISO date the window starts (90 days ago) */
  window_start: string;
  /** ISO date the window ends (today) */
  window_end: string;
  /** Number of closed trades in the window */
  trade_count: number;
  /** Individual criterion results */
  criteria: CriterionResult[];
  /** true if all 4 criteria pass */
  all_passed: boolean;
  /** 0-100 aggregate score (for display only — badge is binary per criterion) */
  aggregate_score: number;
}

export type BadgeTier = "bronze" | "silver" | "gold" | null;

export interface BadgeStatus {
  tier: BadgeTier;
  /** How many consecutive days all criteria have been met */
  consecutive_days_passing: number;
  score: DisciplineScore;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysBetween(a: string, b: string): number {
  return Math.abs(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000
  );
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function coefficientOfVariation(values: number[]): number {
  const m = mean(values);
  if (m === 0) return 0;
  return stddev(values) / m;
}

// ─── Scoring function ─────────────────────────────────────────────────────────

export function computeDisciplineScore(allTrades: TradeRow[]): DisciplineScore {
  const windowStart = daysAgo(90);
  const windowEnd   = new Date().toISOString().slice(0, 10);

  // Filter to the 90-day window, closed trades only
  const closed = allTrades.filter(
    (t) => t.status === "CLOSED" && t.trading_day >= windowStart
  );

  // ── Criterion 1: Stop-loss defined ─────────────────────────────────────────
  const withStop = closed.filter((t) => t.stop_loss !== null && t.stop_loss > 0).length;
  const stopRate = closed.length > 0 ? withStop / closed.length : 0;
  const c1: CriterionResult = {
    key: "stop_loss_defined",
    label: "Stop-Loss Defined",
    description:
      "At least 90% of your closed trades must have a stop-loss price recorded at entry. " +
      "This confirms every position carries a predefined exit point.",
    threshold: "≥ 90%",
    actual: closed.length > 0 ? `${(stopRate * 100).toFixed(1)}%` : "N/A",
    passed: closed.length > 0 && stopRate >= 0.9,
  };

  // ── Criterion 2: Plan adherence ────────────────────────────────────────────
  const withPlan = closed.filter((t) => t.rules_followed === true).length;
  const planRate  = closed.length > 0 ? withPlan / closed.length : 0;
  const c2: CriterionResult = {
    key: "plan_adherence",
    label: "Plan Adherence",
    description:
      "At least 80% of your closed trades must be marked as following your pre-defined rules. " +
      "This is self-reported — it reflects your honesty with yourself as much as your discipline.",
    threshold: "≥ 80%",
    actual: closed.length > 0 ? `${(planRate * 100).toFixed(1)}%` : "N/A",
    passed: closed.length > 0 && planRate >= 0.8,
  };

  // ── Criterion 3: Consistent position sizing ────────────────────────────────
  const riskValues = closed
    .filter((t) => t.risk_percent !== null && t.risk_percent > 0)
    .map((t) => t.risk_percent as number);
  const cv = coefficientOfVariation(riskValues);
  const c3: CriterionResult = {
    key: "consistent_sizing",
    label: "Consistent Position Sizing",
    description:
      "Your risk-per-trade (as a % of account) must not vary wildly. " +
      "We measure the coefficient of variation: a value ≤ 0.40 means your sizing stays " +
      "within roughly ±40% of your own average — ruling out revenge-sized and panic-sized entries.",
    threshold: "CV ≤ 0.40",
    actual: riskValues.length >= 2 ? cv.toFixed(2) : "N/A",
    passed: riskValues.length >= 2 && cv <= 0.4,
  };

  // ── Criterion 4: Journal continuity ───────────────────────────────────────
  const uniqueDays = Array.from(new Set(closed.map((t) => t.trading_day))).sort();
  let maxGap = 0;
  for (let i = 1; i < uniqueDays.length; i++) {
    const gap = daysBetween(uniqueDays[i - 1], uniqueDays[i]);
    if (gap > maxGap) maxGap = gap;
  }
  const c4: CriterionResult = {
    key: "journal_continuity",
    label: "Journal Continuity",
    description:
      "You must have at least 20 closed trades logged across a 90-day period, " +
      "with no gap longer than 21 days between trading sessions. " +
      "This verifies you are actively journalling — not front-loading trades to qualify.",
    threshold: "≥ 20 trades, no gap > 21 days",
    actual:
      closed.length > 0
        ? `${closed.length} trades${uniqueDays.length > 1 ? `, max gap ${maxGap}d` : ""}`
        : "No trades",
    passed: closed.length >= 20 && (uniqueDays.length <= 1 || maxGap <= 21),
  };

  const criteria   = [c1, c2, c3, c4];
  const all_passed = criteria.every((c) => c.passed);
  const passCount  = criteria.filter((c) => c.passed).length;
  // Aggregate score: 25 points per criterion
  const aggregate_score = Math.round((passCount / criteria.length) * 100);

  return {
    window_start: windowStart,
    window_end:   windowEnd,
    trade_count:  closed.length,
    criteria,
    all_passed,
    aggregate_score,
  };
}

// ─── Badge tier from consecutive days ─────────────────────────────────────────

export function getBadgeTier(consecutiveDaysPassing: number): BadgeTier {
  if (consecutiveDaysPassing >= 365) return "gold";
  if (consecutiveDaysPassing >= 180) return "silver";
  if (consecutiveDaysPassing >= 90)  return "bronze";
  return null;
}
