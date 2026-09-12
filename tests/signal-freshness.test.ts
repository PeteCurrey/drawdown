import { test } from "node:test";
import assert from "node:assert/strict";
import { getSignalFreshness, getSignalAgeLabel } from "../src/lib/freshness.ts";

test("Freshness thresholds: recent signals are live", () => {
  const now = new Date().toISOString();
  
  assert.equal(getSignalFreshness({ created_at: now, timeframe: "15M", is_active: true }), "live");
  assert.equal(getSignalFreshness({ created_at: now, timeframe: "1H", is_active: true }), "live");
  assert.equal(getSignalFreshness({ created_at: now, timeframe: "4H", is_active: true }), "live");
  assert.equal(getSignalFreshness({ created_at: now, timeframe: "1D", is_active: true }), "live");
});

test("Freshness thresholds: signals past threshold are stale", () => {
  // 15M: older than 2 hours is stale
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  assert.equal(getSignalFreshness({ created_at: threeHoursAgo, timeframe: "15M", is_active: true }), "stale");

  // 1H: older than 4 hours is stale
  const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
  assert.equal(getSignalFreshness({ created_at: fiveHoursAgo, timeframe: "1H", is_active: true }), "stale");

  // 4H: older than 12 hours is stale
  const fourteenHoursAgo = new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString();
  assert.equal(getSignalFreshness({ created_at: fourteenHoursAgo, timeframe: "4H", is_active: true }), "stale");

  // 1D: older than 48 hours is stale
  const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
  assert.equal(getSignalFreshness({ created_at: threeDaysAgo, timeframe: "1D", is_active: true }), "stale");
});

test("Production regression test: 40-day-old active signals must be evaluated as STALE", () => {
  // 40 days ago (similar to August 2026 signals found in production)
  const fortyDaysAgo = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();

  const result = getSignalFreshness({
    created_at: fortyDaysAgo,
    timeframe: "1D",
    is_active: true,
  });

  assert.equal(result, "stale", "40-day-old signal marked active in DB must report as stale in UI");
});

test("Inactive signals report as empty (expired)", () => {
  const now = new Date().toISOString();
  assert.equal(getSignalFreshness({ created_at: now, timeframe: "1D", is_active: false }), "empty");
});

test("Signal age label formatting", () => {
  const oneHourAgo = new Date(Date.now() - 65 * 60 * 1000).toISOString();
  assert.match(getSignalAgeLabel(oneHourAgo), /1h \d+m ago/);

  const twoDaysAgo = new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString();
  assert.match(getSignalAgeLabel(twoDaysAgo), /2d \d+h ago/);
});
