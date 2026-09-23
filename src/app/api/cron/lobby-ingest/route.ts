/**
 * /api/cron/lobby-ingest — Data Platform Ingestion Cron
 *
 * This is the top-level caller that was always missing.
 *
 * Runs every 15 minutes (vercel.json: 15-minute cron).
 *
 * For each registered provider it:
 *   1. Reads last_successful_fetch from data_provider_health (DB-persisted,
 *      survives serverless cold-starts — no in-memory state relied upon).
 *   2. Calls IngestionScheduler.isDue() to skip providers whose interval
 *      hasn't elapsed (e.g. cftc-cot is weekly; it will skip on 671 of 672
 *      15-minute windows).
 *   3. Validates credentials — keyed providers with no env var receive an
 *      honest MISSING_CREDENTIAL status in data_provider_health and in the
 *      response body; they are never silently skipped.
 *   4. Respects the circuit breaker: providers in OPEN state are bypassed
 *      without incrementing failure counters.
 *   5. Fetches and normalises via each provider's domain-specific method,
 *      then validates through DataNormalizer (Zod schemas).
 *   6. Deduplicates observations within the current batch using
 *      DeduplicationEngine (same-source same-entity same-metric same-minute).
 *   7. Gates events through ConfidenceGatekeeper.filterFactualEvents():
 *      - VERIFIED / KNOWN / INFERRED  → stored with original status, eligible
 *        for Lobby and The Wire display.
 *      - UNKNOWN → stored with status = 'REJECTED' in data_events for audit;
 *        never exposed to end-users (RLS policy enforces this at DB level too).
 *   8. Clusters accepted events with EventClusteringEngine to consolidate
 *      corroborating reports before persistence.
 *   9. Persists DataIngestionRecord, events, and observations to Supabase.
 *  10. Flushes ProviderHealthManager's updated in-memory state back to
 *      data_provider_health so the next cold-start has accurate telemetry.
 *
 * Auth: Vercel Cron (x-vercel-cron: 1) or Bearer $CRON_SECRET for
 * manual / staging invocations.
 */

import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { ProviderRegistry } from "@/lib/data-platform/registry";
import { IngestionScheduler } from "@/lib/data-platform/scheduler";
import type { ScheduleInterval } from "@/lib/data-platform/types";
import { ConfidenceGatekeeper } from "@/lib/data-platform/confidence";
import { DeduplicationEngine } from "@/lib/data-platform/deduplication";
import { DataNormalizer } from "@/lib/data-platform/normalization";
import { EventClusteringEngine } from "@/lib/data-platform/clustering";
import { ProviderHealthManager } from "@/lib/data-platform/health";
import { CredentialManager } from "@/lib/data-platform/credentials";
import { ProviderRunPersistence } from "@/lib/data-platform/persistence";
import { LobbyControlRoomService } from "@/lib/data-platform/control-room";
import { bridgeEventBatchToDrafts } from "@/lib/data-platform/bridge";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  DataProvider,
  DataEvent,
  DataObservation,
  DataIngestionRecord,
  NormalizedIngestionBundle,
  RawFetchResult,
} from "@/lib/data-platform/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — long enough for all providers

// ─── Provider Schedule Registry ───────────────────────────────────────────────
// How often each registered provider should be polled.
// Cron fires every 15 min; providers with longer intervals skip most invocations.

const PROVIDER_SCHEDULE: Record<string, ScheduleInterval> = {
  "sec-edgar": "hourly",       // SEC rate-limits at 10 req/min; filings appear ~hourly
  "central-banks": "hourly",   // Central bank policy comms are not real-time
  "regulators": "hourly",      // FCA / SEC / ESMA regulatory publications
  "cftc-cot": "weekly",        // CFTC releases every Friday
  "fred-api": "daily",         // FRED series update daily / monthly
  "eia-v2-api": "daily",       // EIA WTI crude daily spot
  "twelve-data": "every-5-minutes", // Market quote tick (runs every 15-min cron window)
};

// ─── Provider → Control Room Category Mapping ─────────────────────────────────

const PROVIDER_CATEGORY: Record<string, string> = {
  "sec-edgar": "corporate",
  "central-banks": "central banks",
  "regulators": "regulators",
  "cftc-cot": "positioning",
  "fred-api": "macro",
  "eia-v2-api": "macro",
  "twelve-data": "markets",
};

// ─── Credential Resolver ──────────────────────────────────────────────────────

function resolveCredential(provider: DataProvider): string | null {
  if (provider.authenticationType === "public_unauthenticated") {
    return "PUBLIC"; // sentinel — no key needed
  }
  switch (provider.id) {
    case "twelve-data":
      return CredentialManager.getTwelveDataKey();
    case "fred-api":
      return CredentialManager.getFredKey();
    case "eia-v2-api":
      return CredentialManager.getEiaKey();
    default:
      return null; // unknown keyed provider — treat as missing
  }
}

// ─── Per-Provider Fetch Dispatch ──────────────────────────────────────────────
//
// Each provider exposes domain-specific named fetch methods (e.g. fetchBankFeed,
// fetchLatestFilings) rather than a fully generic IngestionRequest endpoint,
// because their payloads contain provider-specific metadata (bank codes, regulator
// codes, RSS XML vs JSON) that BaseProvider.fetchRaw() cannot build without
// duplicating the URL-construction logic that already lives in those methods.
//
// This function calls the appropriate named method(s), records health telemetry
// (since named methods call fetch() directly rather than via BaseProvider.fetchRaw),
// then merges all sub-bundles into a single NormalizedIngestionBundle.

async function fetchAndNormalize(
  provider: DataProvider
): Promise<{ bundle: NormalizedIngestionBundle; aggregateRaw: Partial<RawFetchResult> }> {
  const p = provider as unknown as Record<string, (...args: unknown[]) => Promise<RawFetchResult>>;

  // Helper: call a provider method, record health, return { raw, bundle }
  async function dispatch(
    method: string,
    ...args: unknown[]
  ): Promise<{ raw: RawFetchResult; bundle: NormalizedIngestionBundle }> {
    const raw = await p[method](...args);
    ProviderHealthManager.recordExecution(provider.id, {
      latencyMs: raw.latencyMs,
      isSuccess: raw.httpStatus >= 200 && raw.httpStatus < 300,
      httpStatus: raw.httpStatus,
    });
    const bundle = await provider.normalize(raw);
    return { raw, bundle };
  }

  // Helper: merge multiple settled bundle promises into one
  function merge(
    settled: PromiseSettledResult<{ raw: RawFetchResult; bundle: NormalizedIngestionBundle }>[]
  ): { bundle: NormalizedIngestionBundle; aggregateRaw: Partial<RawFetchResult> } {
    const merged: NormalizedIngestionBundle = {
      observations: [],
      events: [],
      entities: [],
      rawCount: 0,
      errors: [],
    };
    let totalLatency = 0;
    let successCount = 0;
    let lastStatus = 0;

    for (const r of settled) {
      if (r.status === "fulfilled") {
        const { raw, bundle } = r.value;
        merged.observations.push(...bundle.observations);
        merged.events.push(...bundle.events);
        merged.entities.push(...bundle.entities);
        merged.rawCount += bundle.rawCount;
        if (bundle.errors?.length) merged.errors!.push(...bundle.errors);
        totalLatency += raw.latencyMs;
        successCount++;
        lastStatus = raw.httpStatus;
      } else {
        const msg = CredentialManager.redact(r.reason?.message ?? "Sub-fetch failed");
        merged.errors!.push(msg);
        ProviderHealthManager.recordExecution(provider.id, {
          latencyMs: 0,
          isSuccess: false,
          errorMessage: msg,
        });
      }
    }

    return {
      bundle: merged,
      aggregateRaw: {
        httpStatus: lastStatus,
        latencyMs: successCount > 0 ? Math.round(totalLatency / successCount) : 0,
      },
    };
  }

  switch (provider.id) {
    // ── SEC EDGAR: single Atom feed (latest filings, all form types) ──────────
    case "sec-edgar": {
      const { raw, bundle } = await dispatch("fetchLatestFilings");
      return { bundle, aggregateRaw: raw };
    }

    // ── Central Banks: FED + ECB + BOE in parallel ───────────────────────────
    case "central-banks": {
      const codes = ["FED", "ECB", "BOE"] as const;
      const settled = await Promise.allSettled(
        codes.map((code) => dispatch("fetchBankFeed", code))
      );
      return merge(settled);
    }

    // ── Regulators: FCA + SEC + ESMA in parallel ─────────────────────────────
    case "regulators": {
      const codes = ["FCA", "SEC", "ESMA"] as const;
      const settled = await Promise.allSettled(
        codes.map((code) => dispatch("fetchRegulatorFeed", code))
      );
      return merge(settled);
    }

    // ── CFTC COT: single JSON endpoint ───────────────────────────────────────
    case "cftc-cot": {
      const { raw, bundle } = await dispatch("fetchLatestReports", 50);
      return { bundle, aggregateRaw: raw };
    }

    // ── FRED: canonical macro series in parallel ──────────────────────────────
    case "fred-api": {
      const series = ["FEDFUNDS", "DGS10", "DGS2", "CPIAUCSL", "UNRATE", "GDP", "M2SL", "T10Y2Y", "IC4WSA"];
      const settled = await Promise.allSettled(
        series.map((id) => dispatch("fetchSeriesObservations", id, 5))
      );
      return merge(settled);
    }

    // ── EIA: WTI crude spot ───────────────────────────────────────────────────
    case "eia-v2-api": {
      const { raw, bundle } = await dispatch("fetchWtiCrude", 5);
      return { bundle, aggregateRaw: raw };
    }

    // ── Twelve Data: key FX + metals quotes ───────────────────────────────────
    case "twelve-data": {
      const symbols = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "US100", "SPX500"];
      const settled = await Promise.allSettled(
        symbols.map((sym) => dispatch("fetchQuote", sym))
      );
      return merge(settled);
    }

    default:
      return {
        bundle: { observations: [], events: [], entities: [], rawCount: 0, errors: [] },
        aggregateRaw: { httpStatus: 0, latencyMs: 0 },
      };
  }
}

// ─── Per-Provider Run Result ──────────────────────────────────────────────────

export interface ProviderRunResult {
  status:
    | "SUCCESS"
    | "SKIPPED_NOT_DUE"
    | "MISSING_CREDENTIAL"
    | "CIRCUIT_BREAKER_OPEN"
    | "SKIPPED_NO_SCHEDULE"
    | "ERROR";
  eventsAccepted?: number;
  eventsRejected?: number;
  observationsPersisted?: number;
  lobbyDraftsCreated?: number;
  lobbyDraftsSkipped?: number;
  ingestionRecordId?: string | null;
  normalizeErrors?: number;
  error?: string;
}

// ─── Core Per-Provider Orchestrator ──────────────────────────────────────────

async function runProvider(
  provider: DataProvider,
  supabase: ReturnType<typeof createServiceRoleClient>
): Promise<ProviderRunResult> {
  const pid = provider.id;
  const frequency = PROVIDER_SCHEDULE[pid];

  // 1. Skip providers not in the schedule (e.g. dynamically registered rss-feed instances)
  if (!frequency) {
    return { status: "SKIPPED_NO_SCHEDULE" };
  }

  // 2. Read last successful run from DB — not in-memory, survives cold-starts
  const lastRunAt = await ProviderRunPersistence.getLastRunAt(pid, supabase);

  // 3. Is this provider due?
  if (!IngestionScheduler.isDue(frequency, lastRunAt)) {
    return { status: "SKIPPED_NOT_DUE" };
  }

  // 4. Credential check — honest MISSING_CREDENTIAL, never silently skip
  const credential = resolveCredential(provider);
  if (!credential) {
    await ProviderRunPersistence.markMissingCredential(pid, provider.name, supabase);
    return { status: "MISSING_CREDENTIAL" };
  }

  // 5. Circuit breaker check — respect OPEN state without hammering
  if (!ProviderHealthManager.canExecute(pid)) {
    return { status: "CIRCUIT_BREAKER_OPEN" };
  }

  // ── 6-9: Fetch → Normalise → Validate → Gate → Cluster ──────────────────

  let bundle: NormalizedIngestionBundle;
  let aggregateRaw: Partial<RawFetchResult>;
  const startTime = Date.now();

  try {
    ({ bundle, aggregateRaw } = await fetchAndNormalize(provider));
  } catch (err: any) {
    const errMsg = CredentialManager.redact(err?.message ?? "Fetch failed");
    ProviderHealthManager.recordExecution(pid, {
      latencyMs: Date.now() - startTime,
      isSuccess: false,
      errorMessage: errMsg,
    });
    await ProviderRunPersistence.flushHealthState(
      ProviderHealthManager.getHealth(pid, provider.name),
      supabase
    );
    return { status: "ERROR", error: errMsg };
  }

  // 6a. Validate events (Zod)
  const validatedEvents: DataEvent[] = [];
  let normalizeErrors = bundle.errors?.length ?? 0;

  for (const evt of bundle.events) {
    const check = DataNormalizer.validateEvent(evt);
    if (check.event) {
      validatedEvents.push(check.event);
    } else {
      normalizeErrors++;
    }
  }

  // 6b. Validate observations (Zod)
  const validatedObservations: DataObservation[] = [];
  for (const obs of bundle.observations) {
    const check = DataNormalizer.validateObservation({
      ...obs,
      ingestionRecordId: undefined, // will be set after record insertion
    });
    if (check.observation) {
      validatedObservations.push(check.observation);
    } else {
      normalizeErrors++;
    }
  }

  // 7. Deduplication (within-batch only; DB unique constraint handles cross-batch)
  const seenObsKeys = new Set<string>();
  const dedupedObservations = validatedObservations.filter((obs) => {
    const key = DeduplicationEngine.getObservationKey(obs);
    if (seenObsKeys.has(key)) return false;
    seenObsKeys.add(key);
    return true;
  });

  // 8. Confidence gate
  //    ConfidenceGatekeeper.filterFactualEvents rejects UNKNOWN events.
  //    Rejected events are stored with status='REJECTED' for audit.
  const acceptedEvents = ConfidenceGatekeeper.filterFactualEvents(validatedEvents);
  const rejectedEvents: DataEvent[] = validatedEvents
    .filter((e) => !ConfidenceGatekeeper.canPublishAsFact(e.confidence))
    .map((e) => ({ ...e, status: "REJECTED" as const }));

  // 9. Cluster accepted events (consolidates corroborating cross-source reports)
  const clusters = EventClusteringEngine.clusterEvents(acceptedEvents);
  const canonicalEvents = clusters.map((c) => c.canonicalEvent);

  // ── 10-12: Persist ────────────────────────────────────────────────────────

  // 10. Audit record
  const ingestionRecord: DataIngestionRecord = {
    id: crypto.randomUUID(),
    providerId: pid,
    endpoint: CredentialManager.redact(
      aggregateRaw.endpoint ?? `provider:${pid}`
    ),
    requestParamsHash: DataNormalizer.generateHash({ providerId: pid, runAt: new Date().toISOString() }),
    responsePayloadHash: aggregateRaw.rawHash ?? DataNormalizer.generateHash(bundle.rawCount),
    httpStatus: aggregateRaw.httpStatus ?? 0,
    latencyMs: aggregateRaw.latencyMs ?? (Date.now() - startTime),
    schemaVersion: "1.0",
    state: "READY",
    recordCount: canonicalEvents.length + rejectedEvents.length + dedupedObservations.length,
    fetchedAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  };

  const ingestionRecordId = await ProviderRunPersistence.persistIngestionRecord(
    ingestionRecord,
    supabase
  );

  // 11. Persist events (accepted + rejected together — the RLS policy on
  //     data_events already prevents UNKNOWN rows from reaching public consumers)
  const allEvents = [...canonicalEvents, ...rejectedEvents];
  const { inserted: eventsInserted } = await ProviderRunPersistence.persistEvents(
    allEvents,
    ingestionRecordId,
    supabase
  );

  // 12. Persist observations (FK constraints require seeded data_sources + data_entities;
  //     migration 20260923000001 seeds the rows; FK errors are caught and logged)
  const { inserted: obsInserted } = await ProviderRunPersistence.persistObservations(
    dedupedObservations,
    ingestionRecordId,
    supabase
  );

  // 13. Flush health state to DB — this is what makes isDue() work next cold-start
  await ProviderRunPersistence.flushHealthState(
    ProviderHealthManager.getHealth(pid, provider.name),
    supabase
  );

  // 14. Update Control Room in-memory freshness (best-effort; survives until next
  //     cold-start; the real source of truth is now data_provider_health in DB)
  const category = PROVIDER_CATEGORY[pid];
  if (category) {
    LobbyControlRoomService.recordCategoryActivity(category);
  }

  // 15. Increment Control Room funnel counters
  if (bundle.rawCount > 0) {
    LobbyControlRoomService.recordFunnelEvent("raw", bundle.rawCount);
    LobbyControlRoomService.recordFunnelEvent("normalized", validatedEvents.length + validatedObservations.length);
    LobbyControlRoomService.recordFunnelEvent("deduplicated", dedupedObservations.length + validatedEvents.length);
    LobbyControlRoomService.recordFunnelEvent("verified", eventsInserted);
    if (rejectedEvents.length > 0) {
      LobbyControlRoomService.recordFunnelEvent("rejected", rejectedEvents.length);
    }
  }

  // 16. Bridge accepted canonical events → lobby_articles (DRAFT, Option B).
  //     Only event-generating providers produce Lobby content. Observation-only
  //     providers (fred, eia, twelve-data) will have canonicalEvents.length === 0
  //     and the bridge call becomes a fast no-op.
  let bridgeCreated = 0;
  let bridgeSkipped = 0;
  if (canonicalEvents.length > 0) {
    const bridgeResult = await bridgeEventBatchToDrafts(canonicalEvents);
    bridgeCreated = bridgeResult.created;
    bridgeSkipped = bridgeResult.skipped;
  }

  return {
    status: "SUCCESS",
    eventsAccepted: canonicalEvents.length,
    eventsRejected: rejectedEvents.length,
    observationsPersisted: obsInserted,
    lobbyDraftsCreated: bridgeCreated,
    lobbyDraftsSkipped: bridgeSkipped,
    ingestionRecordId,
    normalizeErrors,
  };
}


// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Auth: Vercel sends x-vercel-cron: 1; manual calls use Bearer $CRON_SECRET
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const isAuthorized =
    isVercelCron ||
    (cronSecret && authHeader === `Bearer ${cronSecret}`);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runStart = Date.now();
  const supabase = createServiceRoleClient();

  // Ensure all default providers are registered (idempotent)
  ProviderRegistry.initDefaultProviders();
  const providers = ProviderRegistry.getAll().filter((p) => p.id in PROVIDER_SCHEDULE);

  const results: Record<string, ProviderRunResult> = {};
  let providersDue = 0;
  let providersSucceeded = 0;

  for (const provider of providers) {
    try {
      const result = await runProvider(provider, supabase);
      results[provider.id] = result;

      if (result.status !== "SKIPPED_NOT_DUE" && result.status !== "SKIPPED_NO_SCHEDULE") {
        providersDue++;
      }
      if (result.status === "SUCCESS") {
        providersSucceeded++;
      }
    } catch (err: any) {
      // Fault isolation: one provider failing must not abort others
      const errMsg = CredentialManager.redact(err?.message ?? "Unhandled error");
      results[provider.id] = { status: "ERROR", error: errMsg };
      console.error(`[lobby-ingest] Unhandled error for provider ${provider.id}:`, errMsg);
    }
  }

  const durationMs = Date.now() - runStart;

  console.log(
    `[lobby-ingest] Run complete in ${durationMs}ms — ` +
    `${providers.length} evaluated, ${providersDue} due, ${providersSucceeded} succeeded.`
  );

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    durationMs,
    providersEvaluated: providers.length,
    providersDue,
    providersSucceeded,
    results,
  });
}
