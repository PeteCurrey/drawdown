import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeLog, invokeDrawdownEndpoint } from "../src/invoker.ts";
import { SCHEDULED_JOBS } from "../src/config.ts";
import type { Env } from "../src/types.ts";

test("Invoker: sanitizeLog redacts sensitive secrets", () => {
  const secret = "super-secret-token-xyz-123";
  const rawLog = `Authorization failed with Bearer ${secret} for route`;
  const sanitized = sanitizeLog(rawLog, secret);

  assert.ok(!sanitized.includes(secret), "Secret must be removed from logs");
  assert.ok(sanitized.includes("[REDACTED_SECRET]"), "Must replace secret with placeholder");
});

test("Invoker: Fails closed if DRAWDOWN_API_URL is missing", async () => {
  const signalJob = SCHEDULED_JOBS.find((j) => j.id === "signal-scan")!;
  const env: Env = {
    ENVIRONMENT: "production",
    DRAWDOWN_API_URL: "",
    CRON_SECRET: "test-secret",
    MORNING_BRIEF_WORKFLOW: { create: async () => ({ id: "1" }) },
    EVENING_WRAP_WORKFLOW: { create: async () => ({ id: "2" }) },
    DAILY_REPORT_WORKFLOW: { create: async () => ({ id: "3" }) },
  };

  const result = await invokeDrawdownEndpoint(signalJob, env);
  assert.equal(result.status, "ERROR");
  assert.ok(result.error?.includes("DRAWDOWN_API_URL is missing"));
});

test("Invoker: Fails closed if CRON_SECRET is missing", async () => {
  const signalJob = SCHEDULED_JOBS.find((j) => j.id === "signal-scan")!;
  const env: Env = {
    ENVIRONMENT: "production",
    DRAWDOWN_API_URL: "https://drawdown.io",
    CRON_SECRET: "",
    MORNING_BRIEF_WORKFLOW: { create: async () => ({ id: "1" }) },
    EVENING_WRAP_WORKFLOW: { create: async () => ({ id: "2" }) },
    DAILY_REPORT_WORKFLOW: { create: async () => ({ id: "3" }) },
  };

  const result = await invokeDrawdownEndpoint(signalJob, env);
  assert.equal(result.status, "ERROR");
  assert.ok(result.error?.includes("CRON_SECRET is missing"));
});
