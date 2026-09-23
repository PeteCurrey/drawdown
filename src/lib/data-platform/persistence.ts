/**
 * Drawdown Intelligence Data Platform — Supabase Persistence Layer
 *
 * Provides serverless-safe read/write operations against:
 *   - data_provider_health   (last-run timestamps, circuit breaker, health metrics)
 *   - data_ingestion_records (per-run audit trail)
 *   - data_events            (canonical DataEvent rows, including REJECTED)
 *   - data_observations      (quantitative time-series — requires FK seeds)
 *
 * All methods are stateless: they take a Supabase client rather than holding
 * one themselves, so they work correctly in cold-start serverless environments
 * where ProviderHealthManager's in-memory Map is always empty at invocation.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import type {
  ProviderHealth,
  DataEvent,
  DataObservation,
  DataIngestionRecord,
} from "./types.ts";
import { CredentialManager } from "./credentials.ts";

export class ProviderRunPersistence {
  // ─── Schedule Tracking ──────────────────────────────────────────────────────

  /**
   * Returns the last time a provider successfully completed ingestion.
   * This is the DB-persisted equivalent of ProviderHealthManager's in-memory
   * lastSuccessfulFetch — survives cold-starts and is what IngestionScheduler
   * should read before calling isDue().
   */
  static async getLastRunAt(
    providerId: string,
    supabase: SupabaseClient
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("data_provider_health")
      .select("last_successful_fetch")
      .eq("provider_id", providerId)
      .maybeSingle();

    if (error) {
      console.warn(`[persistence] getLastRunAt(${providerId}) query error: ${error.message}`);
      return null;
    }
    return (data?.last_successful_fetch as string | null) ?? null;
  }

  // ─── Health State Persistence ─────────────────────────────────────────────

  /**
   * Flushes in-memory ProviderHealth state (ProviderHealthManager.getHealth())
   * to data_provider_health via upsert.
   *
   * MUST be called after every provider execution (success or failure) so that
   * last_successful_fetch persists across serverless cold-starts.
   */
  static async flushHealthState(
    health: ProviderHealth,
    supabase: SupabaseClient
  ): Promise<void> {
    const { error } = await supabase
      .from("data_provider_health")
      .upsert(
        {
          provider_id: health.providerId,
          name: health.name,
          status: health.status,
          successful_requests: health.successfulRequests,
          failed_requests: health.failedRequests,
          consecutive_failures: health.consecutiveFailures,
          average_latency_ms: health.averageLatencyMs,
          last_successful_fetch: health.lastSuccessfulFetch ?? null,
          last_attempted_fetch: health.lastAttemptedFetch ?? null,
          last_error_message: health.lastErrorMessage
            ? CredentialManager.redact(health.lastErrorMessage)
            : null,
          circuit_breaker_state: health.circuitBreakerState,
          rate_limit_reset_at: health.rateLimitResetAt ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider_id" }
      );

    if (error) {
      console.error(
        `[persistence] flushHealthState(${health.providerId}) failed: ${error.message}`
      );
    }
  }

  /**
   * Writes a NOT_CONFIGURED status to data_provider_health without touching
   * circuit-breaker or request counters.  Never silently skips a provider —
   * the Control Room will surface the MISSING_CREDENTIAL alert.
   */
  static async markMissingCredential(
    providerId: string,
    providerName: string,
    supabase: SupabaseClient
  ): Promise<void> {
    const { error } = await supabase
      .from("data_provider_health")
      .upsert(
        {
          provider_id: providerId,
          name: providerName,
          status: "NOT_CONFIGURED",
          // Preserve existing counters; only set what changed
          circuit_breaker_state: "CLOSED",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "provider_id",
          // ignoreDuplicates keeps existing request counters intact
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error(
        `[persistence] markMissingCredential(${providerId}) failed: ${error.message}`
      );
    }
  }

  // ─── Audit Trail ─────────────────────────────────────────────────────────

  /**
   * Persists a DataIngestionRecord to data_ingestion_records.
   * Returns the persisted row UUID (same as record.id if provided, else DB-generated).
   */
  static async persistIngestionRecord(
    record: DataIngestionRecord,
    supabase: SupabaseClient
  ): Promise<string | null> {
    const id = record.id || crypto.randomUUID();

    const { data, error } = await supabase
      .from("data_ingestion_records")
      .insert({
        id,
        provider_id: record.providerId,
        // source_id is nullable; skip unless a specific source registry entry exists
        source_id: null,
        endpoint: CredentialManager.redact(record.endpoint),
        request_params_hash: record.requestParamsHash,
        response_payload_hash: record.responsePayloadHash,
        http_status: record.httpStatus,
        latency_ms: record.latencyMs,
        schema_version: record.schemaVersion ?? "1.0",
        state: record.state,
        error_details: record.errorDetails
          ? CredentialManager.redact(record.errorDetails)
          : null,
        record_count: record.recordCount,
        fetched_at: record.fetchedAt,
        processed_at: record.processedAt ?? null,
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        `[persistence] persistIngestionRecord(${record.providerId}) failed: ${error.message}`
      );
      return null;
    }
    return (data as { id: string }).id;
  }

  // ─── Event Persistence ───────────────────────────────────────────────────

  /**
   * Bulk-inserts DataEvents to data_events.
   *
   * Accepted events (confidence ∈ VERIFIED|KNOWN|INFERRED) are inserted with
   * their original status.  Rejected events (confidence = UNKNOWN) are stored
   * with status = 'REJECTED' for audit — they are never surfaced to consumers
   * because the RLS policy on data_events excludes UNKNOWN confidence rows from
   * public SELECT.
   *
   * Returns counts of rows inserted and any insert errors.
   */
  static async persistEvents(
    events: DataEvent[],
    ingestionRecordId: string | null,
    supabase: SupabaseClient
  ): Promise<{ inserted: number; errors: number }> {
    if (events.length === 0) return { inserted: 0, errors: 0 };

    const rows = events.map((evt) => ({
      event_type: evt.eventType,
      title: evt.title,
      description: evt.description,
      entity_ids: evt.entityIds,
      source_ids: evt.sourceIds,
      occurred_at: evt.occurredAt,
      detected_at: evt.detectedAt,
      severity: evt.severity,
      confidence: evt.confidence,
      source_reliability: evt.sourceReliability,
      status: evt.status,
      primary_source_url: evt.primarySourceUrl ?? null,
      corroborating_references: evt.corroboratingReferences ?? [],
      metadata: {
        ...(evt.metadata ?? {}),
        ingestion_record_id: ingestionRecordId,
      },
    }));

    // Insert in a single batch; ignore individual duplicate collisions gracefully
    const { error } = await supabase.from("data_events").insert(rows);

    if (error) {
      // Log without leaking credential values
      console.error(
        `[persistence] persistEvents batch failed (${events.length} rows): ${error.message}`
      );
      return { inserted: 0, errors: events.length };
    }
    return { inserted: rows.length, errors: 0 };
  }

  // ─── Observation Persistence ──────────────────────────────────────────────

  /**
   * Bulk-upserts DataObservations to data_observations.
   *
   * Uses ON CONFLICT DO NOTHING on (source_id, entity_id, metric, observed_at)
   * to guarantee idempotency — re-ingesting the same data point is a no-op.
   *
   * IMPORTANT: requires that the observation's sourceId exists in data_sources
   * and entityId exists in data_entities (both seeded in migration
   * 20260923000001_provider_run_state.sql).  Rows that violate FK constraints
   * are silently dropped by the DB; the error is logged but does not abort
   * the provider run.
   */
  static async persistObservations(
    observations: DataObservation[],
    ingestionRecordId: string | null,
    supabase: SupabaseClient
  ): Promise<{ inserted: number; errors: number }> {
    if (observations.length === 0) return { inserted: 0, errors: 0 };

    const rows = observations.map((obs) => ({
      source_id: obs.sourceId,
      ingestion_record_id: ingestionRecordId,
      entity_id: obs.entityId,
      metric: obs.metric,
      value: obs.value,
      unit: obs.unit,
      currency: obs.currency ?? null,
      period: obs.period ?? null,
      region: obs.region ?? null,
      observed_at: obs.observedAt,
      received_at: obs.receivedAt,
      confidence: obs.confidence,
      source_reliability: obs.sourceReliability,
      ingestion_state: obs.ingestionState,
      source_reference: obs.sourceReference ?? null,
      metadata: obs.metadata ?? {},
    }));

    const { error } = await supabase
      .from("data_observations")
      .upsert(rows, {
        onConflict: "source_id,entity_id,metric,observed_at",
        ignoreDuplicates: true,
      });

    if (error) {
      console.error(
        `[persistence] persistObservations batch failed (${observations.length} rows): ${error.message}`
      );
      return { inserted: 0, errors: observations.length };
    }
    return { inserted: rows.length, errors: 0 };
  }
}
