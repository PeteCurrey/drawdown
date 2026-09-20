/**
 * Drawdown Intelligence Data Platform — Ingestion Pipeline Orchestrator
 *
 * Implements the full lifecycle:
 *   DISCOVERED -> FETCHING -> INGESTED -> NORMALIZED -> VALIDATED -> CORRELATED -> READY
 *   (or FAILED, STALE, REJECTED)
 *
 * Guarantees:
 *  - Full request/response audit logging (data_ingestion_records)
 *  - Strict provenance & confidence enforcement
 *  - Deduplication vs corroboration
 *  - Fault isolation: one provider failure never halts the pipeline
 */

import crypto from "crypto";
import type { 
  DataProvider,
  IngestionRequest,
  DataIngestionRecord,
  DataObservation,
  DataEvent,
  IngestionState,
 } from "./types";
import { DataNormalizer } from "./normalization";
import { DeduplicationEngine } from "./deduplication";
import { CredentialManager } from "./credentials";

export interface PipelineExecutionResult {
  success: boolean;
  providerId: string;
  ingestionRecord: DataIngestionRecord;
  observations: DataObservation[];
  events: DataEvent[];
  errors: string[];
}

export class IngestionPipeline {
  /**
   * Executes an end-to-end ingestion cycle for a single provider request.
   */
  static async execute(
    provider: DataProvider,
    request: IngestionRequest,
    existingObservations: DataObservation[] = []
  ): Promise<PipelineExecutionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let state: IngestionState = "DISCOVERED";

    const requestHash = DataNormalizer.generateHash(request.params || request.endpoint);
    const ingestionRecordId = crypto.randomUUID();

    let ingestionRecord: DataIngestionRecord = {
      id: ingestionRecordId,
      providerId: provider.id,
      endpoint: CredentialManager.redact(request.endpoint),
      requestParamsHash: requestHash,
      responsePayloadHash: "",
      httpStatus: 0,
      latencyMs: 0,
      schemaVersion: "1.0",
      state: "DISCOVERED",
      recordCount: 0,
      fetchedAt: new Date().toISOString(),
    };

    try {
      // 1. FETCHING
      state = "FETCHING";
      const rawResult = await provider.fetchRaw(request);

      // 2. INGESTED
      state = "INGESTED";
      ingestionRecord.httpStatus = rawResult.httpStatus;
      ingestionRecord.latencyMs = rawResult.latencyMs;
      ingestionRecord.responsePayloadHash = rawResult.rawHash;
      ingestionRecord.state = "INGESTED";

      // 3. NORMALIZED
      state = "NORMALIZED";
      const normalizedBundle = await provider.normalize(rawResult);

      if (normalizedBundle.errors && normalizedBundle.errors.length > 0) {
        errors.push(...normalizedBundle.errors);
      }

      // 4. VALIDATED
      state = "VALIDATED";
      const validatedObservations: DataObservation[] = [];
      const validatedEvents: DataEvent[] = [];

      for (const obs of normalizedBundle.observations) {
        const check = DataNormalizer.validateObservation({
          ...obs,
          ingestionRecordId,
        });

        if (check.observation) {
          validatedObservations.push(check.observation);
        } else {
          errors.push(`Validation failure on observation: ${check.errors.join(", ")}`);
        }
      }

      for (const evt of normalizedBundle.events) {
        const check = DataNormalizer.validateEvent(evt);
        if (check.event) {
          validatedEvents.push(check.event);
        } else {
          errors.push(`Validation failure on event: ${check.errors.join(", ")}`);
        }
      }

      // 5. CORRELATED & DEDUPLICATED
      state = "CORRELATED";
      const readyObservations: DataObservation[] = [];

      for (const obs of validatedObservations) {
        const relation = DeduplicationEngine.classifyObservationRelation(obs, existingObservations);

        if (relation.relation === "DUPLICATE") {
          // Skip duplicate creation; audit note
          continue;
        } else if (relation.relation === "CORROBORATING" && relation.matchedObservation) {
          const merged = DeduplicationEngine.mergeCorroborating(relation.matchedObservation, obs);
          readyObservations.push(merged);
        } else {
          readyObservations.push({
            ...obs,
            ingestionState: "READY",
          });
        }
      }

      // 6. READY
      state = "READY";
      ingestionRecord.state = "READY";
      ingestionRecord.recordCount = readyObservations.length + validatedEvents.length;
      ingestionRecord.processedAt = new Date().toISOString();

      return {
        success: true,
        providerId: provider.id,
        ingestionRecord,
        observations: readyObservations,
        events: validatedEvents,
        errors,
      };
    } catch (err: any) {
      const errorMsg = CredentialManager.redact(err?.message || "Pipeline execution failed");
      errors.push(errorMsg);

      ingestionRecord.state = "FAILED";
      ingestionRecord.errorDetails = errorMsg;
      ingestionRecord.latencyMs = Date.now() - startTime;
      ingestionRecord.processedAt = new Date().toISOString();

      return {
        success: false,
        providerId: provider.id,
        ingestionRecord,
        observations: [],
        events: [],
        errors,
      };
    }
  }
}
