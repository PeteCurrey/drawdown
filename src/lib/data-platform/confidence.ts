/**
 * Drawdown Intelligence Data Platform — Source Reliability & Confidence Engine
 *
 * Rules:
 *  - Do NOT equate 2 secondary sources to VERIFIED.
 *  - Primary authoritative source -> VERIFIED
 *  - Authoritative secondary or 2+ independent secondary -> KNOWN
 *  - Derived, computed, or correlated -> INFERRED
 *  - Insufficient or unverified evidence -> UNKNOWN
 *  - UNKNOWN data is stored inside the platform for research/audit, but MUST NEVER
 *    be published as factual Lobby or Platform content.
 */

import type {  ConfidenceLevel, SourceReliability, DataObservation, DataEvent  } from "./types";

export interface ConfidenceEvaluationParams {
  sourceReliability: SourceReliability;
  corroboratingSourcesCount?: number;
  isDerivedOrCalculated?: boolean;
  hasContradictions?: boolean;
}

export class ConfidenceEngine {
  /**
   * Evaluates the canonical confidence level based on source reliability,
   * corroborating evidence, and derivation state.
   */
  static evaluateConfidence(params: ConfidenceEvaluationParams): ConfidenceLevel {
    if (params.hasContradictions) {
      return "UNKNOWN";
    }

    if (params.isDerivedOrCalculated) {
      return "INFERRED";
    }

    switch (params.sourceReliability) {
      case "PRIMARY":
        // Official regulatory filing, central bank release, or primary exchange feed
        return "VERIFIED";

      case "AUTHORITATIVE_SECONDARY":
        // Tier-1 institutional publisher (Bloomberg, Reuters, FT, WSJ)
        return "KNOWN";

      case "SECONDARY":
        // Corroborated by 2 or more independent secondary sources -> KNOWN
        if ((params.corroboratingSourcesCount ?? 0) >= 2) {
          return "KNOWN";
        }
        // Single uncorroborated secondary publication remains UNKNOWN until verified
        return "UNKNOWN";

      case "COMMUNITY":
      case "UNVERIFIED":
      default:
        return "UNKNOWN";
    }
  }

  /**
   * Publication Gate Check:
   * Returns true ONLY if the confidence level is suitable for factual display.
   */
  static canPublishAsFact(confidence: ConfidenceLevel): boolean {
    return confidence === "VERIFIED" || confidence === "KNOWN" || confidence === "INFERRED";
  }

  /**
   * Filters observations for public downstream consumers (The Lobby, The Wire, Tools).
   * Ensures UNKNOWN records are never surfaced to end-users as factual data.
   */
  static filterFactualObservations(observations: DataObservation[]): DataObservation[] {
    return observations.filter(obs => this.canPublishAsFact(obs.confidence));
  }

  /**
   * Filters events for public downstream consumers.
   */
  static filterFactualEvents(events: DataEvent[]): DataEvent[] {
    return events.filter(evt => this.canPublishAsFact(evt.confidence));
  }
}

export const ConfidenceGatekeeper = ConfidenceEngine;
