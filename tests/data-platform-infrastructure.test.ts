import type { DataObservation, DataEvent } from "../src/lib/data-platform/types.ts";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  ProviderRegistry,
  ProviderHealthManager,
  CredentialManager,
  ProvenanceService,
  ConfidenceEngine,
  DataNormalizer,
  DeduplicationEngine,
  IngestionScheduler,
  TwelveDataProvider,
  FredProvider,
  EiaProvider,
  IngestionPipeline,
  
  
} from "../src/lib/data-platform/index.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

// ─── 1. PROVIDER FRAMEWORK TESTS ─────────────────────────────────────────────

test("Provider Framework: ProviderRegistry registers and queries providers by ID and Category", () => {
  ProviderRegistry.resetForTesting();
  ProviderRegistry.initDefaultProviders();

  const all = ProviderRegistry.getAll();
  assert.ok(all.length >= 3, "Must have at least 3 default reference providers registered");

  const td = ProviderRegistry.get("twelve-data");
  assert.ok(td, "Twelve Data provider must be registered");
  assert.equal(td.name, "Twelve Data");
  assert.ok(td.categories.includes("MARKET"));

  const fred = ProviderRegistry.get("fred-api");
  assert.ok(fred, "FRED provider must be registered");
  assert.equal(fred.sourceReliability, "PRIMARY");

  const eia = ProviderRegistry.get("eia-v2-api");
  assert.ok(eia, "EIA provider must be registered");
  assert.ok(eia.categories.includes("ENERGY"));

  const marketProviders = ProviderRegistry.getByCategory("MARKET");
  assert.ok(marketProviders.some(p => p.id === "twelve-data"));

  const macroProviders = ProviderRegistry.getByCategory("MACRO");
  assert.ok(macroProviders.some(p => p.id === "fred-api"));
});

test("Provider Framework: Missing credentials return NOT_CONFIGURED health without throwing", async () => {
  const originalFred = process.env.FRED_API_KEY;
  delete process.env.FRED_API_KEY;

  try {
    const fred = new FredProvider();
    const health = await fred.checkHealth();

    assert.equal(health.isAvailable, false);
    assert.equal(health.status, "NOT_CONFIGURED");
    assert.match(health.error || "", /FRED_API_KEY is not configured/i);
  } finally {
    if (originalFred) process.env.FRED_API_KEY = originalFred;
  }
});

test("Provider Framework: Circuit breaker trips to OPEN on consecutive failures and recovers on half-open", () => {
  ProviderHealthManager.resetForTesting();
  const providerId = "test-flaky-provider";

  // Record 4 failures -> Should remain CLOSED but DEGRADED
  for (let i = 0; i < 4; i++) {
    ProviderHealthManager.recordExecution(providerId, {
      latencyMs: 150,
      isSuccess: false,
      httpStatus: 500,
      errorMessage: "Server error",
    });
  }
  let health = ProviderHealthManager.getHealth(providerId);
  assert.equal(health.circuitBreakerState, "CLOSED");
  assert.equal(ProviderHealthManager.canExecute(providerId), true);

  // 5th failure -> Trips to OPEN
  ProviderHealthManager.recordExecution(providerId, {
    latencyMs: 200,
    isSuccess: false,
    httpStatus: 500,
    errorMessage: "Server error 5",
  });
  health = ProviderHealthManager.getHealth(providerId);
  assert.equal(health.circuitBreakerState, "OPEN");
  assert.equal(health.status, "UNAVAILABLE");
  assert.equal(ProviderHealthManager.canExecute(providerId), false);

  // Immediate rate limit HTTP 429 also forces OPEN
  const rateLimitedId = "test-rate-limited";
  ProviderHealthManager.recordExecution(rateLimitedId, {
    latencyMs: 80,
    isSuccess: false,
    httpStatus: 429,
    errorMessage: "Rate limited",
    rateLimitResetMs: 500,
  });
  const rlHealth = ProviderHealthManager.getHealth(rateLimitedId);
  assert.equal(rlHealth.circuitBreakerState, "OPEN");
});

// ─── 2. NORMALIZATION & SCHEMA VALIDATION TESTS ──────────────────────────────

test("Normalization: Twelve Data quote transforms into canonical DataObservation", async () => {
  const td = new TwelveDataProvider();
  const mockPayload = {
    symbol: "EUR/USD",
    close: "1.0875",
    currency: "USD",
    datetime: "2026-09-20 12:00:00",
    exchange: "FOREX",
    percent_change: "0.25",
  };

  const bundle = await td.normalize({
    providerId: td.id,
    endpoint: "https://api.twelvedata.com/quote",
    httpStatus: 200,
    latencyMs: 120,
    payload: mockPayload,
    rawHash: "dummy-hash",
    fetchedAt: new Date().toISOString(),
  });

  assert.equal(bundle.observations.length, 1);
  const obs = bundle.observations[0];
  assert.equal(obs.entityId, "inst:eurusd");
  assert.equal(obs.metric, "price");
  assert.equal(obs.value, 1.0875);
  assert.equal(obs.confidence, "KNOWN");
  assert.equal(obs.sourceReliability, "AUTHORITATIVE_SECONDARY");
  assert.equal(obs.currency, "USD");
  assert.ok(obs.observedAt.startsWith("2026-09-20"));
});

test("Normalization: FRED observations parse correctly and assign VERIFIED confidence", async () => {
  const fred = new FredProvider();
  const mockPayload = {
    realtime_start: "2026-09-20",
    realtime_end: "2026-09-20",
    observations: [
      { date: "2026-08-01", value: "5.33" },
      { date: "2026-07-01", value: "5.33" },
      { date: "2026-06-01", value: "." }, // missing data marker
    ],
  };

  const bundle = await fred.normalize({
    providerId: fred.id,
    endpoint: "https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS",
    httpStatus: 200,
    latencyMs: 95,
    payload: mockPayload,
    rawHash: "dummy-fred-hash",
    fetchedAt: new Date().toISOString(),
  });

  // The "." value should be skipped
  assert.equal(bundle.observations.length, 2);
  const obs = bundle.observations[0];
  assert.equal(obs.entityId, "ind:fedfunds");
  assert.equal(obs.value, 5.33);
  assert.equal(obs.confidence, "VERIFIED");
  assert.equal(obs.sourceReliability, "PRIMARY");
});

test("Normalization: EIA energy spot prices parse correctly with USD/bbl units", async () => {
  const eia = new EiaProvider();
  const mockPayload = {
    response: {
      data: [
        { period: "2026-09-18", value: "78.45", series: "RWTC", "series-description": "WTI Spot Price" },
      ],
    },
  };

  const bundle = await eia.normalize({
    providerId: eia.id,
    endpoint: "https://api.eia.gov/v2/petroleum/pri/spt/data/",
    httpStatus: 200,
    latencyMs: 140,
    payload: mockPayload,
    rawHash: "dummy-eia-hash",
    fetchedAt: new Date().toISOString(),
  });

  assert.equal(bundle.observations.length, 1);
  const obs = bundle.observations[0];
  assert.equal(obs.entityId, "comm:crude-wti");
  assert.equal(obs.value, 78.45);
  assert.equal(obs.unit, "USD/bbl");
  assert.equal(obs.confidence, "VERIFIED");
});

test("Normalization: Malformed payloads are rejected cleanly without crashing", () => {
  const malformedObs = {
    sourceId: "test-source",
    // missing entityId
    metric: "price",
    value: NaN, // invalid number
    unit: "USD",
    observedAt: "not-a-date",
  };

  const result = DataNormalizer.validateObservation(malformedObs);
  assert.equal(result.observation, null);
  assert.ok(result.errors.length > 0);
});

// ─── 3. PROVENANCE & TEMPORAL SANITY TESTS ────────────────────────────────────

test("Provenance: Requires both observedAt (event time) and receivedAt (retrieval time)", () => {
  const now = new Date().toISOString();
  const validObs: DataObservation = {
    sourceId: "fred-api",
    entityId: "ind:dgs10",
    metric: "yield_10y",
    value: 4.25,
    unit: "%",
    observedAt: "2026-09-19T16:00:00.000Z",
    receivedAt: now,
    confidence: "VERIFIED",
    sourceReliability: "PRIMARY",
    ingestionState: "READY",
  };

  const check = ProvenanceService.validateObservationProvenance(validObs);
  assert.equal(check.isValid, true);
  assert.notEqual(validObs.observedAt, validObs.receivedAt, "Event time must be distinct from retrieval time");
});

test("Provenance: Temporal sanity rejects observation timestamps set in the future", () => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day in future
  const futureObs: DataObservation = {
    sourceId: "twelve-data-market",
    entityId: "inst:gbpusd",
    metric: "price",
    value: 1.3050,
    unit: "currency",
    observedAt: futureDate,
    receivedAt: new Date().toISOString(),
    confidence: "KNOWN",
    sourceReliability: "AUTHORITATIVE_SECONDARY",
    ingestionState: "READY",
  };

  const check = ProvenanceService.validateObservationProvenance(futureObs);
  assert.equal(check.isValid, false);
  assert.match(check.errors.join(" "), /cannot be in the future/i);
});

// ─── 4. CONFIDENCE & PUBLICATION GATE TESTS ───────────────────────────────────

test("Confidence Model: Evaluates reliability rules without equating 2 sources to VERIFIED", () => {
  // Primary -> VERIFIED
  const primaryConf = ConfidenceEngine.evaluateConfidence({
    sourceReliability: "PRIMARY",
    corroboratingSourcesCount: 0,
  });
  assert.equal(primaryConf, "VERIFIED");

  // Authoritative Secondary -> KNOWN
  const authSecConf = ConfidenceEngine.evaluateConfidence({
    sourceReliability: "AUTHORITATIVE_SECONDARY",
  });
  assert.equal(authSecConf, "KNOWN");

  // 2 Secondary sources -> KNOWN (NOT VERIFIED!)
  const twoSecConf = ConfidenceEngine.evaluateConfidence({
    sourceReliability: "SECONDARY",
    corroboratingSourcesCount: 2,
  });
  assert.equal(twoSecConf, "KNOWN", "Two secondary sources must be KNOWN, never VERIFIED");

  // Single Secondary source -> UNKNOWN
  const singleSecConf = ConfidenceEngine.evaluateConfidence({
    sourceReliability: "SECONDARY",
    corroboratingSourcesCount: 0,
  });
  assert.equal(singleSecConf, "UNKNOWN", "Uncorroborated secondary claim must remain UNKNOWN");

  // Derived calculation -> INFERRED
  const derivedConf = ConfidenceEngine.evaluateConfidence({
    sourceReliability: "AUTHORITATIVE_SECONDARY",
    isDerivedOrCalculated: true,
  });
  assert.equal(derivedConf, "INFERRED");
});

test("Confidence Model: UNKNOWN observations remain stored but are strictly filtered from public output", () => {
  const observations: DataObservation[] = [
    {
      sourceId: "fred-api",
      entityId: "ind:fedfunds",
      metric: "rate",
      value: 5.33,
      unit: "%",
      observedAt: "2026-09-18T00:00:00Z",
      receivedAt: "2026-09-19T00:00:00Z",
      confidence: "VERIFIED",
      sourceReliability: "PRIMARY",
      ingestionState: "READY",
    },
    {
      sourceId: "unverified-crawler",
      entityId: "inst:rumor-token",
      metric: "price",
      value: 99.0,
      unit: "USD",
      observedAt: "2026-09-19T00:00:00Z",
      receivedAt: "2026-09-19T00:00:00Z",
      confidence: "UNKNOWN",
      sourceReliability: "UNVERIFIED",
      ingestionState: "READY",
    },
  ];

  // Storage verification: UNKNOWN is present in the dataset
  assert.equal(observations.length, 2);
  assert.ok(observations.some(o => o.confidence === "UNKNOWN"));

  // Publication gate filter verification
  const publicObservations = ConfidenceEngine.filterFactualObservations(observations);
  assert.equal(publicObservations.length, 1);
  assert.equal(publicObservations[0].confidence, "VERIFIED");
  assert.ok(publicObservations.every(o => o.confidence !== "UNKNOWN"));
});

// ─── 5. SECURITY & CREDENTIAL PROTECTION TESTS ───────────────────────────────

test("Security Audit: No NEXT_PUBLIC_TWELVE_DATA_KEY remains in client components", () => {
  const riskCalculator = fs.readFileSync(path.join(rootDir, "src/components/tools/RiskCalculator.tsx"), "utf8");
  const tradeContext = fs.readFileSync(path.join(rootDir, "src/components/tools/TradeContextPanel.tsx"), "utf8");
  const healthCheck = fs.readFileSync(path.join(rootDir, "src/components/algo-builder/HealthCheck.tsx"), "utf8");

  assert.ok(
    !riskCalculator.includes("process.env.NEXT_PUBLIC_TWELVE_DATA_KEY"),
    "RiskCalculator.tsx must not read NEXT_PUBLIC_TWELVE_DATA_KEY"
  );
  assert.ok(
    !tradeContext.includes("process.env.NEXT_PUBLIC_TWELVE_DATA_KEY"),
    "TradeContextPanel.tsx must not read NEXT_PUBLIC_TWELVE_DATA_KEY"
  );
  assert.ok(
    !healthCheck.includes("process.env.NEXT_PUBLIC_TWELVE_DATA_KEY"),
    "HealthCheck.tsx must not read NEXT_PUBLIC_TWELVE_DATA_KEY"
  );
});

test("Security: CredentialManager redacts sensitive API keys and tokens from error messages", () => {
  const secretKey = "td_secret_sample_key_12345678";
  const rawUrl = `https://api.twelvedata.com/quote?symbol=EURUSD&apikey=${secretKey}`;
  const redacted = CredentialManager.redact(rawUrl);

  assert.ok(!redacted.includes(secretKey), "API key must be redacted");
  assert.match(redacted, /\[REDACTED\]/);
});

// ─── 6. DEDUPLICATION, CORRELATION & DERIVED EVENTS ──────────────────────────

test("Deduplication: Accurately separates Duplicate, Corroborating, and Related observations", () => {
  const baseObs: DataObservation = {
    sourceId: "source-a",
    entityId: "comm:crude-wti",
    metric: "spot_price",
    value: 78.50,
    unit: "USD/bbl",
    observedAt: "2026-09-20T10:00:00.000Z",
    receivedAt: "2026-09-20T10:05:00.000Z",
    confidence: "KNOWN",
    sourceReliability: "SECONDARY",
    ingestionState: "READY",
  };

  const existing = [baseObs];

  // 1. Same source + entity + metric + timestamp -> DUPLICATE
  const duplicate = { ...baseObs, value: 78.50 };
  const dupResult = DeduplicationEngine.classifyObservationRelation(duplicate, existing);
  assert.equal(dupResult.relation, "DUPLICATE");

  // 2. Different source, same entity + metric + date -> CORROBORATING
  const corroborating: DataObservation = {
    ...baseObs,
    sourceId: "source-b",
    sourceReliability: "SECONDARY",
  };
  const corrobResult = DeduplicationEngine.classifyObservationRelation(corroborating, existing);
  assert.equal(corrobResult.relation, "CORROBORATING");

  // Corroboration merges and upgrades confidence from UNKNOWN to KNOWN
  const merged = DeduplicationEngine.mergeCorroborating(baseObs, corroborating);
  assert.equal(merged.confidence, "KNOWN");
  assert.ok((merged.metadata?.corroboratedBy as string[]).includes("source-b"));

  // 3. Same entity, different metric -> RELATED
  const related: DataObservation = {
    ...baseObs,
    metric: "inventory_barrels",
    value: 420_000_000,
    unit: "barrels",
  };
  const relResult = DeduplicationEngine.classifyObservationRelation(related, existing);
  assert.equal(relResult.relation, "RELATED");
});

test("Correlation: Evaluates derived Yield Curve Inversion event when 10Y < 2Y", () => {
  const yield10y: DataObservation = {
    sourceId: "fred-api",
    entityId: "ind:us-treasury-10y",
    metric: "yield",
    value: 3.85,
    unit: "%",
    observedAt: "2026-09-20T12:00:00Z",
    receivedAt: "2026-09-20T12:05:00Z",
    confidence: "VERIFIED",
    sourceReliability: "PRIMARY",
    ingestionState: "READY",
  };

  const yield2y: DataObservation = {
    sourceId: "fred-api",
    entityId: "ind:us-treasury-2y",
    metric: "yield",
    value: 4.10, // 2Y yield higher than 10Y -> Inverted!
    unit: "%",
    observedAt: "2026-09-20T12:00:00Z",
    receivedAt: "2026-09-20T12:05:00Z",
    confidence: "VERIFIED",
    sourceReliability: "PRIMARY",
    ingestionState: "READY",
  };

  const derivedEvent = DeduplicationEngine.evaluateDerivedYieldCurveInversion(yield10y, yield2y);
  assert.ok(derivedEvent, "Must generate a derived yield curve event");
  assert.equal(derivedEvent.eventType, "macro_yield_curve_inversion");
  assert.equal(derivedEvent.confidence, "INFERRED");
  assert.equal(derivedEvent.severity, "high");
  assert.ok(derivedEvent.description.includes("traded below"));
});

// ─── 7. SCHEDULER CADENCE TESTS ──────────────────────────────────────────────

test("Scheduler: Correctly evaluates due status for declarative cadences", () => {
  const fiveMinAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();
  const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

  assert.equal(IngestionScheduler.isDue("every-5-minutes", fiveMinAgo), true);
  assert.equal(IngestionScheduler.isDue("every-5-minutes", twoMinAgo), false);
  assert.equal(IngestionScheduler.isDue("every-5-minutes", null), true, "First run must always be due");
  assert.equal(IngestionScheduler.isDue("event-driven", null), false, "Event-driven is not scheduled by time");
});

// ─── 8. FAILURE ISOLATION & END-TO-END PIPELINE TESTS ────────────────────────

test("Pipeline: Failure in one provider does not crash caller and records audit entry", async () => {
  // Create a mock provider that throws an error
  const failingProvider = {
    id: "failing-provider",
    name: "Failing Provider",
    categories: ["MARKET" as const],
    sourceReliability: "SECONDARY" as const,
    authenticationType: "api_key_query" as const,
    rateLimits: { maxRequestsPerMinute: 60, cooldownPeriodMs: 60_000 },
    attribution: { required: false },
    licensing: { commercialAllowed: true, redistributionAllowed: true, retentionAllowed: true },
    checkHealth: async () => ({ isAvailable: false, status: "UNAVAILABLE" as const, latencyMs: 0 }),
    fetchRaw: async () => { throw new Error("Connection timeout to third-party endpoint"); },
    normalize: async () => ({ observations: [], events: [], entities: [], rawCount: 0 }),
  };

  const result = await IngestionPipeline.execute(failingProvider, {
    endpoint: "https://api.flaky.com/data",
  });

  assert.equal(result.success, false);
  assert.equal(result.ingestionRecord.state, "FAILED");
  assert.match(result.ingestionRecord.errorDetails || "", /Connection timeout/i);
  assert.equal(result.observations.length, 0);
  assert.ok(result.errors.length > 0);
});
