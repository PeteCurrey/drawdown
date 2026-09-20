/**
 * Drawdown Intelligence Data Platform — Deduplication & Correlation Engine
 *
 * Explicitly separates:
 *  1. Duplicate observation: Same underlying fact received from the same source/provider.
 *  2. Corroborating observation: Independent source confirms an existing observation.
 *  3. Related observation: Different fact that belongs to the same entity or overlapping event.
 *  4. Derived event: Platform-level inference based on multiple observations.
 */

import type {  DataObservation, DataEvent  } from "./types.ts";
import { ConfidenceEngine } from "./confidence.ts";

export type IngestionRelationType = "DUPLICATE" | "CORROBORATING" | "RELATED" | "NEW";

export class DeduplicationEngine {
  /**
   * Generates a unique deterministic fingerprint for an observation:
   * (sourceId + entityId + metric + bucketed timestamp).
   */
  static getObservationKey(obs: DataObservation): string {
    // Round to minute to absorb minor seconds-level jitter
    const obsTime = new Date(obs.observedAt).toISOString().slice(0, 16);
    return `${obs.sourceId}:${obs.entityId}:${obs.metric}:${obsTime}`;
  }

  /**
   * Determines relationship of a new incoming observation against existing observations.
   */
  static classifyObservationRelation(
    incoming: DataObservation,
    existing: DataObservation[]
  ): {
    relation: IngestionRelationType;
    matchedObservation?: DataObservation;
  } {
    const incomingKey = this.getObservationKey(incoming);

    for (const ex of existing) {
      const existingKey = this.getObservationKey(ex);

      // Exact source + entity + metric + timestamp match -> DUPLICATE
      if (incomingKey === existingKey) {
        return { relation: "DUPLICATE", matchedObservation: ex };
      }

      // Different source, but same entity + metric + timestamp -> CORROBORATING
      const sameEntityMetricTime =
        incoming.entityId === ex.entityId &&
        incoming.metric === ex.metric &&
        incoming.observedAt.slice(0, 10) === ex.observedAt.slice(0, 10);

      if (sameEntityMetricTime && incoming.sourceId !== ex.sourceId) {
        return { relation: "CORROBORATING", matchedObservation: ex };
      }

      // Same entity, different metric, or related timeframe -> RELATED
      if (incoming.entityId === ex.entityId) {
        return { relation: "RELATED", matchedObservation: ex };
      }
    }

    return { relation: "NEW" };
  }

  /**
   * Merges corroborating observations and evaluates if confidence can be upgraded.
   */
  static mergeCorroborating(
    primaryObs: DataObservation,
    corroboratingObs: DataObservation
  ): DataObservation {
    const upgradedConfidence =
      primaryObs.sourceReliability === "PRIMARY"
        ? "VERIFIED"
        : primaryObs.sourceReliability === "AUTHORITATIVE_SECONDARY" ||
          corroboratingObs.sourceReliability === "AUTHORITATIVE_SECONDARY"
        ? "KNOWN"
        : primaryObs.sourceReliability === "SECONDARY" &&
          corroboratingObs.sourceReliability === "SECONDARY"
        ? "KNOWN" // 2 independent secondary sources corroborated
        : primaryObs.confidence;

    return {
      ...primaryObs,
      confidence: upgradedConfidence,
      receivedAt: new Date().toISOString(),
      metadata: {
        ...(primaryObs.metadata || {}),
        corroboratedBy: [
          ...((primaryObs.metadata?.corroboratedBy as string[]) || []),
          corroboratingObs.sourceId,
        ],
      },
    };
  }

  /**
   * Evaluates if a set of observations triggers a platform-level Derived Event.
   * Example: US 10-Year Yield minus 2-Year Yield < 0 -> Yield Curve Inversion Event.
   */
  static evaluateDerivedYieldCurveInversion(
    yield10y: DataObservation | null,
    yield2y: DataObservation | null
  ): DataEvent | null {
    if (!yield10y || !yield2y) return null;

    const spread = yield10y.value - yield2y.value;
    if (spread < 0) {
      return {
        eventType: "macro_yield_curve_inversion",
        title: "US Yield Curve Inversion Detected (10Y - 2Y)",
        description: `The 10-year Treasury yield (${yield10y.value}%) traded below the 2-year yield (${yield2y.value}%), producing an inverted spread of ${spread.toFixed(2)} bps.`,
        entityIds: ["ind:us-treasury-10y", "ind:us-treasury-2y"],
        sourceIds: [yield10y.sourceId, yield2y.sourceId],
        occurredAt: yield10y.observedAt,
        detectedAt: new Date().toISOString(),
        severity: "high",
        confidence: "INFERRED",
        sourceReliability: yield10y.sourceReliability,
        status: "READY",
        metadata: {
          spreadBps: parseFloat((spread * 100).toFixed(1)),
          yield10y: yield10y.value,
          yield2y: yield2y.value,
        },
      };
    }

    return null;
  }
}
