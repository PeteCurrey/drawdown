import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CRON_JOB_REGISTRY, evaluateCronJobHealth, type CronJobDefinition } from "../src/lib/cron-registry.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

test("Cron Registry: All 16 background routes are registered with valid configuration", () => {
  const jobIds = Object.keys(CRON_JOB_REGISTRY);
  assert.equal(jobIds.length, 16, "Must have exactly 16 registered background jobs");

  for (const [id, config] of Object.entries(CRON_JOB_REGISTRY)) {
    assert.equal(config.id, id);
    assert.ok(config.name, `Job ${id} must have a human-readable name`);
    assert.ok(config.endpoint, `Job ${id} must have an endpoint path`);
    assert.ok(config.scheduleDescription, `Job ${id} must have a schedule description`);
    assert.ok(config.expectedIntervalMs > 0, `Job ${id} must have a positive expectedIntervalMs`);
    assert.ok(config.gracePeriodMs > 0, `Job ${id} must have a positive gracePeriodMs`);
    assert.ok(["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(config.criticality), `Job ${id} must define criticality`);
  }
});

test("Cron Health Evaluator: Healthy (OK) when last successful run is within expected interval + grace", () => {
  const config = CRON_JOB_REGISTRY["update-prices"];
  const now = Date.now();
  // 3 minutes ago for a 5-minute interval + 2-minute grace
  const recentRun = new Date(now - 3 * 60 * 1000).toISOString();

  const health = evaluateCronJobHealth(config, {
    started_at: recentRun,
    completed_at: recentRun,
    status: "SUCCESS",
    duration_ms: 1200,
    records_processed: 10,
  }, null, now);

  assert.equal(health.state, "OK");
  assert.equal(health.isMissed, false);
});

test("Cron Health Evaluator: Missed when single expected interval is missed", () => {
  const config = CRON_JOB_REGISTRY["update-prices"];
  const now = Date.now();
  // 70 minutes ago for a 30-minute interval + 30-minute grace (threshold 60 mins)
  const missedOneRun = new Date(now - 70 * 60 * 1000).toISOString();

  const health = evaluateCronJobHealth(config, {
    started_at: missedOneRun,
    completed_at: missedOneRun,
    status: "SUCCESS",
    duration_ms: 1200,
    records_processed: 10,
  }, null, now);

  assert.equal(health.state, "MISSED");
  assert.equal(health.isMissed, true);
});

test("Cron Health Evaluator: Stale when multiple intervals are missed", () => {
  const config = CRON_JOB_REGISTRY["update-prices"];
  const now = Date.now();
  // 150 minutes ago (missed > 2x max allowed 60m for update-prices)
  const missedMultipleRuns = new Date(now - 150 * 60 * 1000).toISOString();

  const health = evaluateCronJobHealth(config, {
    started_at: missedMultipleRuns,
    completed_at: missedMultipleRuns,
    status: "SUCCESS",
    duration_ms: 1200,
    records_processed: 10,
  }, null, now);

  assert.equal(health.state, "STALE");
  assert.equal(health.isMissed, true);
});

test("Cron Health Evaluator: Failed when last status is FAILED", () => {
  const config = CRON_JOB_REGISTRY["signal-scan"];
  const now = Date.now();
  const recentRun = new Date(now - 2 * 60 * 1000).toISOString();

  const health = evaluateCronJobHealth(config, {
    started_at: recentRun,
    completed_at: recentRun,
    status: "FAILED",
    duration_ms: 500,
    records_processed: 0,
    error_message: "Upstream API timeout",
  }, null, now);

  assert.equal(health.state, "FAILED");
  assert.equal(health.isMissed, true);
  assert.equal(health.lastErrorMessage, "Upstream API timeout");
});

test("Cron Health Evaluator: Unknown when no execution records exist", () => {
  const config = CRON_JOB_REGISTRY["signal-scan"];
  const health = evaluateCronJobHealth(config, null, null);

  assert.equal(health.state, "UNKNOWN");
  assert.equal(health.isMissed, true);
});

test("Cron Observability Implementation: Routes are instrumented with startCronRun / completeCronRun", () => {
  const signalScanRoute = readFile("src/app/api/signals/scan/route.ts");
  assert.ok(signalScanRoute.includes("startCronRun"), "signals/scan route must call startCronRun");
  assert.ok(signalScanRoute.includes("completeCronRun"), "signals/scan route must call completeCronRun");

  const updatePricesRoute = readFile("src/app/api/cron/update-prices/route.ts");
  assert.ok(updatePricesRoute.includes("startCronRun"), "update-prices route must call startCronRun");
  assert.ok(updatePricesRoute.includes("completeCronRun"), "update-prices route must call completeCronRun");

  const breakingNewsRoute = readFile("src/app/api/the-wire/breaking-news/route.ts");
  assert.ok(breakingNewsRoute.includes("startCronRun"), "the-wire/breaking-news route must call startCronRun");
  assert.ok(breakingNewsRoute.includes("completeCronRun"), "the-wire/breaking-news route must call completeCronRun");
});
