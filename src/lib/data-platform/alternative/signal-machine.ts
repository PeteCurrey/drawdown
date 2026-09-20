/**
 * Drawdown Intelligence Data Platform — Signal Lifecycle State Machine
 *
 * Enforces the strict 7-Stage Alternative Data Signal Lifecycle:
 *
 *   OBSERVED ──> CORRELATED ──> CANDIDATE ──> RESEARCHING ──> VERIFIED ──> PUBLISHED
 *       │            │             │              │              │
 *       └────────────┴─────────────┴──────────────┴──────────────┴──────> REJECTED
 *
 * Strict Transition Rules:
 *  - No bypass: A signal cannot leap directly from OBSERVED or CORRELATED to PUBLISHED.
 *  - CANDIDATE requires minimum anomaly magnitude (|anomaly| >= 15%) and correlation (|r| >= 0.55).
 *  - VERIFIED requires corroborating evidence or analyst review.
 *  - PUBLISHED requires editorial release note and confidence upgrade.
 *  - REJECTED requires a documented rejection reason.
 *  - Every transition immutably appends to stateHistory.
 */

import type { PotentialSignal, SignalLifecycleState } from "./types.ts";

export interface TransitionResult {
  success: boolean;
  signal: PotentialSignal;
  error?: string;
}

export class SignalStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<SignalLifecycleState, SignalLifecycleState[]> = {
    OBSERVED: ["CORRELATED", "REJECTED"],
    CORRELATED: ["CANDIDATE", "REJECTED"],
    CANDIDATE: ["RESEARCHING", "REJECTED"],
    RESEARCHING: ["VERIFIED", "REJECTED"],
    VERIFIED: ["PUBLISHED", "REJECTED"],
    PUBLISHED: ["REJECTED"], // Can be retracted if invalidated later
    REJECTED: [],            // Terminal state
  };

  /**
   * Evaluates if a proposed state transition is valid.
   */
  static canTransition(from: SignalLifecycleState, to: SignalLifecycleState): boolean {
    const allowed = this.ALLOWED_TRANSITIONS[from] || [];
    return allowed.includes(to);
  }

  /**
   * Executes a state transition with business guards.
   */
  static transition(
    signal: PotentialSignal,
    targetState: SignalLifecycleState,
    opts: {
      note?: string;
      rejectionReason?: string;
      publishedNotice?: string;
    } = {}
  ): TransitionResult {
    // 1. Structural transition legality
    if (!this.canTransition(signal.state, targetState)) {
      return {
        success: false,
        signal,
        error: `Illegal transition: Cannot transition from ${signal.state} to ${targetState}.`,
      };
    }

    // 2. Guard: Candidate requirements
    if (targetState === "CANDIDATE") {
      const absAnomaly = Math.abs(signal.anomalyMagnitudePct);
      const absR = Math.abs(signal.correlationCoefficient ?? 0);

      if (absAnomaly < 10.0) {
        return {
          success: false,
          signal,
          error: `Cannot promote to CANDIDATE: Anomaly magnitude (${absAnomaly}%) is below 10% threshold.`,
        };
      }
      if (absR < 0.50) {
        return {
          success: false,
          signal,
          error: `Cannot promote to CANDIDATE: Correlation coefficient (|r| = ${absR}) is below 0.50 threshold.`,
        };
      }
    }

    // 3. Guard: Rejection reason
    if (targetState === "REJECTED" && !opts.rejectionReason) {
      return {
        success: false,
        signal,
        error: "Rejection requires a documented rejectionReason.",
      };
    }

    // 4. Guard: Publication release notice
    if (targetState === "PUBLISHED" && !opts.publishedNotice) {
      return {
        success: false,
        signal,
        error: "Publication requires a factual, non-predictive publishedNotice.",
      };
    }

    // Clone and apply transition
    const nowIso = new Date().toISOString();
    const updated: PotentialSignal = {
      ...signal,
      state: targetState,
      updatedAt: nowIso,
      stateHistory: [
        ...signal.stateHistory,
        {
          state: targetState,
          timestamp: nowIso,
          note: opts.note || (targetState === "REJECTED" ? opts.rejectionReason : opts.publishedNotice),
        },
      ],
    };

    if (targetState === "REJECTED") {
      updated.rejectionReason = opts.rejectionReason;
    }

    if (targetState === "PUBLISHED") {
      updated.publishedNotice = opts.publishedNotice;
      // Upgrade confidence to KNOWN upon verified editorial publication
      updated.confidence = "KNOWN";
    }

    return {
      success: true,
      signal: updated,
    };
  }
}
