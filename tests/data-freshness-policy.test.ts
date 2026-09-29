import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateTimestampFreshness,
  evaluateComingUpEventEligibility,
  isSignalEligibleForProduction,
  getSignalFreshnessWindowMs,
  DATASET_FRESHNESS_CONFIG,
} from "../src/lib/data-freshness-policy.ts";

test("Lobby Lead: article under 24h evaluates as LIVE", () => {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const result = evaluateTimestampFreshness("lobby_lead", twelveHoursAgo);

  assert.equal(result.band, "LIVE");
  assert.equal(result.isEligible, true);
});

test("Lobby Lead: article between 24h and 72h evaluates as RECENT or STALE but eligible", () => {
  const thirtyHoursAgo = new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString();
  const result = evaluateTimestampFreshness("lobby_lead", thirtyHoursAgo);

  assert.equal(result.band, "RECENT");
  assert.equal(result.isEligible, true);
});

test("Lobby Lead: article over 72h evaluates as AGED and INELIGIBLE", () => {
  const eightyHoursAgo = new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString();
  const result = evaluateTimestampFreshness("lobby_lead", eightyHoursAgo);

  assert.equal(result.band, "AGED");
  assert.equal(result.isEligible, false, "Article > 72h must be strictly disqualified from lead slot");
});

test("Coming Up Event: future event in UTC is eligible", () => {
  const tomorrowUtc = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const result = evaluateComingUpEventEligibility(tomorrowUtc);

  assert.equal(result.isUpcoming, true);
});

test("Coming Up Event: past event is strictly disqualified", () => {
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const result = evaluateComingUpEventEligibility(twoDaysAgo);

  assert.equal(result.isUpcoming, false, "Past event must be disqualified");
});

test("Coming Up Event: same-day UTC event remains eligible", () => {
  const now = new Date();
  // An event set to 23:59 UTC today
  const todayLateUtc = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 0
  )).toISOString();

  const result = evaluateComingUpEventEligibility(todayLateUtc);
  assert.equal(result.isUpcoming, true, "Same-day event in UTC must be eligible");
});

test("Signals: 15M signal older than 2 hours is disqualified", () => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const futureExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const signal = {
    is_active: true,
    is_test: false,
    created_at: threeHoursAgo,
    expires_at: futureExpiry,
    timeframe: "15M",
  };

  assert.equal(isSignalEligibleForProduction(signal), false);
});

test("Signals: active non-expired 1H signal within 4 hours is eligible", () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const futureExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  const signal = {
    is_active: true,
    is_test: false,
    created_at: oneHourAgo,
    expires_at: futureExpiry,
    timeframe: "1H",
  };

  assert.equal(isSignalEligibleForProduction(signal), true);
});

test("Signals: test signal is strictly disqualified from production", () => {
  const now = new Date().toISOString();
  const futureExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  const signal = {
    is_active: true,
    is_test: true,
    created_at: now,
    expires_at: futureExpiry,
    timeframe: "1H",
  };

  assert.equal(isSignalEligibleForProduction(signal), false, "is_test=true must never be eligible for production");
});
