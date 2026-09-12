import { test } from "node:test";
import assert from "node:assert/strict";
import { getBriefFreshness } from "../src/lib/freshness.ts";

test("getBriefFreshness: today's report is live", () => {
  const today = new Date().toISOString();
  assert.equal(getBriefFreshness(today), "live");
});

test("getBriefFreshness: report older than 26 hours is stale", () => {
  const thirtyHoursAgo = new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString();
  assert.equal(getBriefFreshness(thirtyHoursAgo), "stale");
});

test("getBriefFreshness: null report date is empty", () => {
  assert.equal(getBriefFreshness(null), "empty");
});
