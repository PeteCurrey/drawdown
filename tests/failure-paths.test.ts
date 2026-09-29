import { test } from "node:test";
import assert from "node:assert/strict";
import { 
  evaluateTimestampFreshness,
  evaluateComingUpEventEligibility,
  isSignalEligibleForProduction,
  DATASET_FRESHNESS_CONFIG,
  TIME_MS
} from "../src/lib/data-freshness-policy.ts";
import { evaluateCronJobHealth, CRON_JOB_REGISTRY } from "../src/lib/cron-registry.ts";

test("FAILURE PATH 1: Upstream Provider / Market Data Outage -> Immediate Fail-Closed Detection", () => {
  const now = Date.now();

  // Scenario: Provider hasn't returned quotes for 20 minutes (exceeds 15m maxEligibilityAgeMs)
  const staleQuoteTimestamp = new Date(now - 20 * TIME_MS.MINUTE).toISOString();
  const evaluation = evaluateTimestampFreshness("market_quote", staleQuoteTimestamp, now);

  assert.equal(evaluation.isEligible, false, "Stale quotes > 15m MUST NOT be marked eligible for live display");
  assert.equal(evaluation.band, "AGED", "Quotes > 15m must transition out of LIVE/RECENT/STALE into AGED/UNAVAILABLE");

  // Scenario: Provider completely down (timestamp is null or undefined)
  const missingEvaluation = evaluateTimestampFreshness("market_quote", null, now);
  assert.equal(missingEvaluation.band, "UNAVAILABLE", "Missing quote timestamp must yield UNAVAILABLE status");
  assert.equal(missingEvaluation.isEligible, false, "Missing quote must not be eligible for production display");
});

test("FAILURE PATH 2: Editorial / Lobby Ingestion Stoppage -> Truthful Standby (No Stale Fallback)", () => {
  const now = Date.now();

  // Scenario: Ingestion pipeline stopped 73 hours ago.
  const articlePublishedAt = new Date(now - 73 * TIME_MS.HOUR).toISOString();
  const evaluation = evaluateTimestampFreshness("lobby_lead", articlePublishedAt, now);

  assert.equal(evaluation.isEligible, false, "Articles older than 72h maxEligibilityAgeMs MUST NOT be eligible as lead story");
  assert.equal(evaluation.band, "AGED", "73h old article must be classified as AGED");
});

test("FAILURE PATH 3: Expired or Quarantined Signals -> Strictly Filtered from Public Presentation", () => {
  const now = Date.now();

  // 1. Quarantined signal (is_test: true)
  const testSignal = {
    is_active: true,
    is_test: true,
    data_classification: "TEST_DEMO",
    created_at: new Date(now - 10 * TIME_MS.MINUTE).toISOString(),
    expires_at: new Date(now + 60 * TIME_MS.MINUTE).toISOString(),
    timeframe: "15M",
  };
  assert.equal(isSignalEligibleForProduction(testSignal, now), false, "Quarantined test signal must be rejected");

  // 2. Unclassified / quarantine classification
  const quarantinedSignal = {
    is_active: true,
    is_test: false,
    data_classification: "UNCLASSIFIED",
    created_at: new Date(now - 10 * TIME_MS.MINUTE).toISOString(),
    expires_at: new Date(now + 60 * TIME_MS.MINUTE).toISOString(),
    timeframe: "15M",
  };
  assert.equal(isSignalEligibleForProduction(quarantinedSignal, now), false, "UNCLASSIFIED signal must be rejected");

  // 3. Stale 15M signal (created 2.5 hours ago, max window is 2h)
  const stale15mSignal = {
    is_active: true,
    is_test: false,
    data_classification: "PRODUCTION_VERIFIED",
    created_at: new Date(now - 2.5 * TIME_MS.HOUR).toISOString(),
    expires_at: new Date(now + 30 * TIME_MS.MINUTE).toISOString(),
    timeframe: "15M",
  };
  assert.equal(isSignalEligibleForProduction(stale15mSignal, now), false, "15M signal older than 2h must be rejected even if expires_at is future");
});

test("FAILURE PATH 4: Background Cron Failure -> Critical System Health Degraded/Failed State", () => {
  const now = Date.now();
  const job = CRON_JOB_REGISTRY["update-prices"];

  // Upstream Twelve Data / Finnhub network failure causes job to log FAILED
  const failedRun = {
    started_at: new Date(now - 5 * TIME_MS.MINUTE).toISOString(),
    completed_at: new Date(now - 4.9 * TIME_MS.MINUTE).toISOString(),
    status: "FAILED",
    duration_ms: 6000,
    records_processed: 0,
    error_message: "Twelve Data API rate limit exceeded (HTTP 429)",
  };

  const health = evaluateCronJobHealth(job, failedRun, null, now);
  assert.equal(health.state, "FAILED", "Job must reflect FAILED state");
  assert.equal(health.isMissed, true, "Job must trigger missed/alert condition");
  assert.equal(health.lastErrorMessage, "Twelve Data API rate limit exceeded (HTTP 429)");
});
