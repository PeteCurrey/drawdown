import { test } from "node:test";
import assert from "node:assert/strict";

import {
  TIER_WEIGHT,
  isSubscriptionActive,
  getEffectiveTierLevel,
  hasTierAccess,
  CommercialAccess,
} from "../src/lib/entitlements.ts";

// ---------------------------------------------------------------------------
// TIER_WEIGHT hierarchy
// ---------------------------------------------------------------------------

test("Entitlements: tier hierarchy is correctly ordered", () => {
  assert.equal(TIER_WEIGHT["free"], 0);
  assert.equal(TIER_WEIGHT["signal-centre"], 1);
  assert.equal(TIER_WEIGHT["foundation"], 1);
  assert.equal(TIER_WEIGHT["edge"], 2);
  assert.equal(TIER_WEIGHT["floor"], 3);
  assert.equal(TIER_WEIGHT["accelerator"], 4);
});

test("Entitlements: legacy signal-centre maps to same level as foundation", () => {
  assert.equal(TIER_WEIGHT["signal-centre"], TIER_WEIGHT["foundation"]);
});

test("Entitlements: unknown tier resolves to 0", () => {
  assert.equal(TIER_WEIGHT["unknown-tier"] ?? 0, 0);
});

// ---------------------------------------------------------------------------
// isSubscriptionActive
// ---------------------------------------------------------------------------

test("isSubscriptionActive: 'active' returns true", () => {
  assert.equal(isSubscriptionActive("active"), true);
});

test("isSubscriptionActive: 'trialing' returns true", () => {
  assert.equal(isSubscriptionActive("trialing"), true);
});

test("isSubscriptionActive: 'past_due' returns false", () => {
  assert.equal(isSubscriptionActive("past_due"), false);
});

test("isSubscriptionActive: 'cancelled' returns false", () => {
  assert.equal(isSubscriptionActive("cancelled"), false);
});

test("isSubscriptionActive: 'unpaid' returns false", () => {
  assert.equal(isSubscriptionActive("unpaid"), false);
});

test("isSubscriptionActive: 'inactive' returns false", () => {
  assert.equal(isSubscriptionActive("inactive"), false);
});

test("isSubscriptionActive: null returns false", () => {
  assert.equal(isSubscriptionActive(null), false);
});

test("isSubscriptionActive: undefined returns false", () => {
  assert.equal(isSubscriptionActive(undefined), false);
});

// ---------------------------------------------------------------------------
// getEffectiveTierLevel
// ---------------------------------------------------------------------------

test("getEffectiveTierLevel: active foundation resolves to 1", () => {
  assert.equal(getEffectiveTierLevel("foundation", "active"), 1);
});

test("getEffectiveTierLevel: trialing edge resolves to 2", () => {
  assert.equal(getEffectiveTierLevel("edge", "trialing"), 2);
});

test("getEffectiveTierLevel: past_due foundation drops to 0", () => {
  assert.equal(getEffectiveTierLevel("foundation", "past_due"), 0);
});

test("getEffectiveTierLevel: cancelled edge drops to 0", () => {
  assert.equal(getEffectiveTierLevel("edge", "cancelled"), 0);
});

test("getEffectiveTierLevel: inactive floor drops to 0", () => {
  assert.equal(getEffectiveTierLevel("floor", "inactive"), 0);
});

test("getEffectiveTierLevel: accelerator always resolves to 4 regardless of status", () => {
  assert.equal(getEffectiveTierLevel("accelerator", "inactive"), 4);
  assert.equal(getEffectiveTierLevel("accelerator", "past_due"), 4);
  assert.equal(getEffectiveTierLevel("accelerator", "active"), 4);
});

test("getEffectiveTierLevel: null tier always returns 0", () => {
  assert.equal(getEffectiveTierLevel(null, "active"), 0);
  assert.equal(getEffectiveTierLevel(null, "trialing"), 0);
});

test("getEffectiveTierLevel: case-insensitive tier matching", () => {
  assert.equal(getEffectiveTierLevel("FOUNDATION", "active"), 1);
  assert.equal(getEffectiveTierLevel("EDGE", "active"), 2);
});

// ---------------------------------------------------------------------------
// hasTierAccess
// ---------------------------------------------------------------------------

test("hasTierAccess: foundation active meets foundation requirement", () => {
  assert.equal(hasTierAccess("foundation", "foundation", "active"), true);
});

test("hasTierAccess: edge active meets foundation requirement", () => {
  assert.equal(hasTierAccess("edge", "foundation", "active"), true);
});

test("hasTierAccess: free does not meet foundation requirement", () => {
  assert.equal(hasTierAccess("free", "foundation", "active"), false);
});

test("hasTierAccess: foundation active does NOT meet edge requirement", () => {
  assert.equal(hasTierAccess("foundation", "edge", "active"), false);
});

test("hasTierAccess: edge active meets edge requirement", () => {
  assert.equal(hasTierAccess("edge", "edge", "active"), true);
});

test("hasTierAccess: past_due foundation does NOT meet foundation requirement", () => {
  assert.equal(hasTierAccess("foundation", "foundation", "past_due"), false);
});

// ---------------------------------------------------------------------------
// CommercialAccess predicates
// ---------------------------------------------------------------------------

test("CommercialAccess: free cannot access Signal Centre", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("free", "active"), false);
});

test("CommercialAccess: foundation active can access Signal Centre", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("foundation", "active"), true);
});

test("CommercialAccess: legacy signal-centre active can access Signal Centre", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("signal-centre", "active"), true);
});

test("CommercialAccess: foundation past_due cannot access Signal Centre", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("foundation", "past_due"), false);
});

test("CommercialAccess: edge active can access Signal Centre", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("edge", "active"), true);
});

test("CommercialAccess: foundation cannot access Investment Centre", () => {
  assert.equal(CommercialAccess.canAccessInvestmentCentre("foundation", "active"), false);
});

test("CommercialAccess: edge active can access Investment Centre", () => {
  assert.equal(CommercialAccess.canAccessInvestmentCentre("edge", "active"), true);
});

test("CommercialAccess: edge past_due cannot access Investment Centre", () => {
  assert.equal(CommercialAccess.canAccessInvestmentCentre("edge", "past_due"), false);
});

test("CommercialAccess: floor active can access Investment Centre", () => {
  assert.equal(CommercialAccess.canAccessInvestmentCentre("floor", "active"), true);
});

test("CommercialAccess: edge cannot access full courses", () => {
  assert.equal(CommercialAccess.canAccessFullCourses("edge", "active"), false);
});

test("CommercialAccess: floor active can access full courses", () => {
  assert.equal(CommercialAccess.canAccessFullCourses("floor", "active"), true);
});

test("CommercialAccess: floor active can access mentorship", () => {
  assert.equal(CommercialAccess.canAccessMentorship("floor", "active"), true);
});

test("CommercialAccess: floor inactive cannot access mentorship", () => {
  assert.equal(CommercialAccess.canAccessMentorship("floor", "inactive"), false);
});

test("CommercialAccess: floor active can access algo builder export", () => {
  assert.equal(CommercialAccess.canAccessAlgoBuilderExport("floor", "active"), true);
});

test("CommercialAccess: edge cannot access algo builder export", () => {
  assert.equal(CommercialAccess.canAccessAlgoBuilderExport("edge", "active"), false);
});

test("CommercialAccess: accelerator can access all features regardless of status", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("accelerator", "inactive"), true);
  assert.equal(CommercialAccess.canAccessInvestmentCentre("accelerator", "inactive"), true);
  assert.equal(CommercialAccess.canAccessFullCourses("accelerator", "inactive"), true);
  assert.equal(CommercialAccess.canAccessMentorship("accelerator", "inactive"), true);
  assert.equal(CommercialAccess.canAccessAlgoBuilderExport("accelerator", "inactive"), true);
});
