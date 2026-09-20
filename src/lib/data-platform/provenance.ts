/**
 * Drawdown Intelligence Data Platform — Source Provenance Engine
 *
 * Rules:
 *  - No orphaned facts. Every observation/event MUST retain source, retrieved timestamp,
 *    observed timestamp, provider attribution, reliability, and confidence.
 *  - Event time (observedAt) MUST NEVER be overwritten by retrieval time (receivedAt).
 *  - Temporal sanity checks: observedAt cannot be in the future.
 */

import type {  DataObservation, DataEvent, DataSource  } from "./types.ts";

export interface ProvenanceValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ProvenanceService {
  /**
   * Validates provenance on an observation.
   */
  static validateObservationProvenance(obs: DataObservation): ProvenanceValidationResult {
    const errors: string[] = [];

    if (!obs.sourceId || obs.sourceId.trim() === "") {
      errors.push("Missing mandatory sourceId");
    }
    if (!obs.entityId || obs.entityId.trim() === "") {
      errors.push("Missing mandatory entityId");
    }
    if (!obs.metric || obs.metric.trim() === "") {
      errors.push("Missing mandatory metric");
    }
    if (typeof obs.value !== "number" || isNaN(obs.value) || !isFinite(obs.value)) {
      errors.push("Invalid or non-numeric observation value");
    }
    if (!obs.observedAt) {
      errors.push("Missing mandatory observedAt (event timestamp)");
    } else {
      const observedTime = new Date(obs.observedAt).getTime();
      if (isNaN(observedTime)) {
        errors.push("Invalid observedAt date format");
      } else {
        // Temporal sanity: cannot be more than 10 minutes into the future (allowing for minor clock skew)
        const maxFutureMs = Date.now() + 10 * 60 * 1000;
        if (observedTime > maxFutureMs) {
          errors.push(`Temporal anomaly: observedAt (${obs.observedAt}) cannot be in the future`);
        }
      }
    }

    if (!obs.receivedAt) {
      errors.push("Missing mandatory receivedAt (retrieval timestamp)");
    }

    if (!obs.sourceReliability) {
      errors.push("Missing mandatory sourceReliability classification");
    }
    if (!obs.confidence) {
      errors.push("Missing mandatory confidence level");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates provenance on a discrete event.
   */
  static validateEventProvenance(event: DataEvent): ProvenanceValidationResult {
    const errors: string[] = [];

    if (!event.title || event.title.trim() === "") {
      errors.push("Missing event title");
    }
    if (!event.eventType || event.eventType.trim() === "") {
      errors.push("Missing eventType");
    }
    if (!event.occurredAt) {
      errors.push("Missing occurredAt timestamp");
    } else {
      const occurredTime = new Date(event.occurredAt).getTime();
      if (isNaN(occurredTime)) {
        errors.push("Invalid occurredAt date format");
      }
    }
    if (!event.detectedAt) {
      errors.push("Missing detectedAt timestamp");
    }
    if (!event.sourceIds || event.sourceIds.length === 0) {
      errors.push("Missing source attribution: event must link to at least one sourceId");
    }
    if (!event.confidence) {
      errors.push("Missing mandatory confidence level");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Attaches licensing and attribution metadata from the registered source.
   */
  static enrichWithSourceMetadata(obs: DataObservation, source: DataSource): DataObservation {
    return {
      ...obs,
      sourceReliability: source.reliability,
      sourceReference: obs.sourceReference || source.url,
      metadata: {
        ...(obs.metadata || {}),
        providerId: source.providerId,
        sourceName: source.name,
        attributionRequired: source.attributionRequired,
        attributionText: source.attributionText,
        licenseNotes: source.licenseNotes,
      },
    };
  }
}
