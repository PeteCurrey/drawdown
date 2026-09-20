/**
 * Drawdown Intelligence Data Platform — Normalization & Schema Validation Engine
 *
 * Validates incoming payloads using Zod schemas and normalizes them into
 * canonical DataObservation and DataEvent structures.
 */

import { z } from "zod";
import crypto from "crypto";
import type {  DataObservation, DataEvent, IngestionState  } from "./types";
import { ProvenanceService } from "./provenance";

// ─── ZOD SCHEMAS ─────────────────────────────────────────────────────────────

export const ObservationSchema = z.object({
  sourceId: z.string().min(1),
  ingestionRecordId: z.string().optional(),
  entityId: z.string().min(1),
  metric: z.string().min(1),
  value: z.number().finite(),
  unit: z.string().min(1),
  currency: z.string().optional(),
  period: z.string().optional(),
  region: z.string().optional(),
  observedAt: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  receivedAt: z.string().datetime({ offset: true }),
  confidence: z.enum(["VERIFIED", "KNOWN", "INFERRED", "UNKNOWN"]),
  sourceReliability: z.enum(["PRIMARY", "AUTHORITATIVE_SECONDARY", "SECONDARY", "COMMUNITY", "UNVERIFIED"]),
  ingestionState: z.enum([
    "DISCOVERED", "FETCHING", "INGESTED", "NORMALIZED", "VALIDATED",
    "CORRELATED", "READY", "FAILED", "STALE", "REJECTED"
  ]),
  sourceReference: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const EventSchema = z.object({
  eventType: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  entityIds: z.array(z.string()).default([]),
  sourceIds: z.array(z.string()).min(1),
  occurredAt: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  detectedAt: z.string().datetime({ offset: true }),
  severity: z.enum(["low", "normal", "high", "critical"]),
  confidence: z.enum(["VERIFIED", "KNOWN", "INFERRED", "UNKNOWN"]),
  sourceReliability: z.enum(["PRIMARY", "AUTHORITATIVE_SECONDARY", "SECONDARY", "COMMUNITY", "UNVERIFIED"]),
  status: z.enum(["DETECTED", "RESEARCHING", "READY", "REJECTED"]).default("READY"),
  primarySourceUrl: z.string().url().optional(),
  corroboratingReferences: z.array(z.any()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ─── NORMALIZATION UTILITIES ──────────────────────────────────────────────────

export class DataNormalizer {
  /**
   * Generates a SHA-256 hash of an object or string for request/response auditing.
   */
  static generateHash(data: unknown): string {
    const raw = typeof data === "string" ? data : JSON.stringify(data ?? "");
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  /**
   * Parses and validates a raw observation into a canonical DataObservation.
   */
  static validateObservation(obs: unknown): { observation: DataObservation | null; errors: string[] } {
    const parseResult = ObservationSchema.safeParse(obs);
    if (!parseResult.success) {
      return {
        observation: null,
        errors: parseResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`),
      };
    }

    const observation = parseResult.data as DataObservation;
    const provCheck = ProvenanceService.validateObservationProvenance(observation);
    if (!provCheck.isValid) {
      return {
        observation: null,
        errors: provCheck.errors,
      };
    }

    return {
      observation: {
        ...observation,
        ingestionState: "VALIDATED" as IngestionState,
      },
      errors: [],
    };
  }

  /**
   * Parses and validates an event into a canonical DataEvent.
   */
  static validateEvent(evt: unknown): { event: DataEvent | null; errors: string[] } {
    const parseResult = EventSchema.safeParse(evt);
    if (!parseResult.success) {
      return {
        event: null,
        errors: parseResult.error.issues.map(i => `${i.path.join(".")}: ${i.message}`),
      };
    }

    const event = parseResult.data as DataEvent;
    const provCheck = ProvenanceService.validateEventProvenance(event);
    if (!provCheck.isValid) {
      return {
        event: null,
        errors: provCheck.errors,
      };
    }

    return {
      event,
      errors: [],
    };
  }

  /**
   * Standardizes dates to ISO-8601 strings.
   */
  static toIsoString(dateInput: string | number | Date): string {
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }
    if (typeof dateInput === "number") {
      // Unix timestamp (seconds vs milliseconds)
      const ms = dateInput < 10_000_000_000 ? dateInput * 1000 : dateInput;
      return new Date(ms).toISOString();
    }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      throw new Error(`Invalid date string: ${dateInput}`);
    }
    return d.toISOString();
  }
}
