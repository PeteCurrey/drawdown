import test from "node:test";
import assert from "node:assert/strict";
import { TIER_LEVEL, TIER_LABELS, hasAccess } from "../src/lib/tier-access.ts";
import type { SubscriptionTier } from "../src/lib/tier-access.ts";
import { CommercialAccess, resolveUserEntitlement } from "../src/lib/entitlements.ts";

test("Market Lobby Tier Access: 'core' tier is properly registered and weighted", () => {
  assert.equal(TIER_LEVEL.core, 1, "Core tier weight must be 1");
  assert.equal(TIER_LABELS.core, "Core", "Core tier label must be 'Core'");
  assert.equal(hasAccess("core", "free"), true, "Core has access to free");
  assert.equal(hasAccess("core", "core"), true, "Core has access to core");
  assert.equal(hasAccess("core", "signal-centre"), true, "Core has level 1 access");
  assert.equal(hasAccess("core", "foundation"), false, "Core does not have level 2 access under legacy scale");
  assert.equal(hasAccess("edge", "core"), true, "Edge tier has access to core features");
});

test("Market Lobby Entitlements: Watchlist and Screener access rules", () => {
  // Free tier
  assert.equal(CommercialAccess.canAccessWatchlists("free", "active"), false);
  assert.equal(CommercialAccess.canAccessMarketScreener("free", "active"), false);
  assert.equal(CommercialAccess.canAccessSavedScreens("free", "active"), false);

  // Core tier active
  assert.equal(CommercialAccess.canAccessWatchlists("core", "active"), true);
  assert.equal(CommercialAccess.canAccessMarketScreener("core", "active"), true);
  assert.equal(CommercialAccess.canAccessSavedScreens("core", "active"), true);

  // Core tier past_due drops access
  assert.equal(CommercialAccess.canAccessWatchlists("core", "past_due"), false);
  assert.equal(CommercialAccess.canAccessMarketScreener("core", "past_due"), false);
});

test("Market Lobby Entitlements: Signal Centre access rules", () => {
  assert.equal(CommercialAccess.canAccessSignalCentre("free", "active"), false);
  assert.equal(CommercialAccess.canAccessSignalCentre("core", "active"), true);
  assert.equal(CommercialAccess.canAccessSignalCentre("signal-centre", "active"), true);
  assert.equal(CommercialAccess.canAccessSignalCentre("foundation", "active"), true);
});

test("Market Lobby Entitlements: resolveUserEntitlement unauthenticated fallback", async () => {
  const result = await resolveUserEntitlement(null as any, "");
  assert.equal(result.tier, "free");
  assert.equal(result.level, 0);
  assert.equal(result.canAccessSignals, false);
  assert.equal(result.canAccessScanner, false);
  assert.equal(result.canAccessWatchlists, false);
  assert.equal(result.canAccessSavedScreens, false);
});
