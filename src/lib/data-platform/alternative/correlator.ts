/**
 * Drawdown Intelligence Data Platform — Multivariate Correlation Engine
 *
 * Core Mandate:
 *  - Connects Physical Observation + Market Price Movement + Scheduled Events + Geographic Node + Time Window.
 *  - Computes empirical Pearson correlation coefficients across paired observations.
 *  - Explicitly safeguards against spurious correlations:
 *      • Requires minimum sample observations (N >= 5)
 *      • Requires minimum statistical correlation (|r| >= 0.50)
 *      • Never claims to "predict markets" — reports observed empirical historical alignment.
 */

import type {
  PotentialSignal,
  GeographicWatchlistNode,
} from "./types.ts";
import { GeographicWatchlist } from "./watchlist.ts";

export interface CorrelationInput {
  nodeId: string;
  category: "satellite" | "ais" | "weather" | "composite";
  metricName: string;
  currentValue: number;
  baselineValue: number;
  unit: string;
  observedAt: string;
  historicalPairs: Array<{
    alternativeValue: number;
    marketPriceReturnPct: number;
  }>;
  instrumentId: string;
}

export class MultivariateCorrelator {
  /**
   * Calculates the Pearson correlation coefficient (r) between two continuous variables.
   * Formula: r = Cov(X, Y) / (Std(X) * Std(Y))
   */
  static calculatePearsonCorrelation(pairs: Array<{ alternativeValue: number; marketPriceReturnPct: number }>): number {
    const n = pairs.length;
    if (n < 3) return 0;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const p of pairs) {
      const x = p.alternativeValue;
      const y = p.marketPriceReturnPct;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    }

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return parseFloat(Math.max(-1, Math.min(1, numerator / denominator)).toFixed(3));
  }

  /**
   * Correlates an alternative data anomaly against a market instrument.
   * Produces a candidate PotentialSignal in OBSERVED or CORRELATED state.
   */
  static evaluateCorrelation(input: CorrelationInput): {
    isCorrelated: boolean;
    signal?: PotentialSignal;
    correlationScore: number;
    anomalyPct: number;
    notes: string;
  } {
    const node = GeographicWatchlist.getNode(input.nodeId);
    const nodeName = node?.name || input.nodeId;

    // 1. Calculate physical anomaly percentage
    const delta = input.currentValue - input.baselineValue;
    const anomalyPct = input.baselineValue !== 0
      ? parseFloat(((delta / input.baselineValue) * 100).toFixed(1))
      : 0;

    // 2. Compute empirical correlation
    const r = this.calculatePearsonCorrelation(input.historicalPairs);
    const absR = Math.abs(r);

    // 3. Significance check
    const isStatisticallySignificant = input.historicalPairs.length >= 5 && absR >= 0.50;
    const nowIso = new Date().toISOString();

    const hypothesis = `${nodeName} ${input.metricName} shifted ${anomalyPct > 0 ? "+" : ""}${anomalyPct}% from baseline (${input.currentValue} vs baseline ${input.baselineValue} ${input.unit}), showing empirical correlation (r = ${r}) with ${input.instrumentId}.`;

    if (!isStatisticallySignificant) {
      return {
        isCorrelated: false,
        correlationScore: r,
        anomalyPct,
        notes: `Insufficient correlation (|r| = ${absR} < 0.50 or N = ${input.historicalPairs.length} < 5) to establish candidate signal.`,
      };
    }

    const signal: PotentialSignal = {
      id: `sig-${input.nodeId.replace("node:", "")}-${Date.now()}`,
      state: "CORRELATED",
      nodeId: input.nodeId,
      nodeName,
      category: input.category,
      hypothesis,
      primaryMetric: input.metricName,
      observedValue: input.currentValue,
      unit: input.unit,
      baselineValue: input.baselineValue,
      anomalyMagnitudePct: anomalyPct,
      correlatedInstruments: [input.instrumentId],
      correlationCoefficient: r,
      confidence: "INFERRED", // Model-derived statistical observation
      sourceReliability: "PRIMARY",
      stateHistory: [
        {
          state: "OBSERVED",
          timestamp: input.observedAt,
          note: `Physical observation captured at ${input.observedAt}`,
        },
        {
          state: "CORRELATED",
          timestamp: nowIso,
          note: `Empirical correlation confirmed with r = ${r} (sample N = ${input.historicalPairs.length})`,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return {
      isCorrelated: true,
      signal,
      correlationScore: r,
      anomalyPct,
      notes: hypothesis,
    };
  }
}
