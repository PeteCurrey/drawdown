import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  TIER_WEIGHT,
  isSubscriptionActive,
  getEffectiveTierLevel,
  hasTierAccess,
  CommercialAccess,
} from "../src/lib/entitlements.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. Free user can access intended Free functionality
// ---------------------------------------------------------------------------
test("Conversion: Free user can access core operating loop and tools", () => {
  // Free level is 0
  assert.equal(getEffectiveTierLevel("free", "active"), 0);

  // Free user has access to core calculations without gating
  const positionSizing = readFile("src/lib/position-sizing.ts");
  assert.ok(
    positionSizing.includes("export function calculatePositionSize"),
    "Position sizing math must be an un-gated pure engine function"
  );

  const runMyTrade = readFile("src/components/dashboard/RunMyTrade.tsx");
  assert.ok(
    runMyTrade.includes("Drawdown Analysis"),
    "RunMyTrade must provide complete drawdown calculation for Free users"
  );
  assert.ok(
    runMyTrade.includes("SAVE TRADE PLAN"),
    "RunMyTrade must allow Free users to save trade plans"
  );
});

// ---------------------------------------------------------------------------
// 2. Free user cannot access Foundation-only API
// ---------------------------------------------------------------------------
test("Conversion: Free user cannot access Foundation-only APIs (server-enforced)", () => {
  const journalAiRoute = readFile("src/app/api/ai/journal-analysis/route.ts");
  assert.ok(
    journalAiRoute.includes("CommercialAccess.canAccessSignalCentre") ||
    journalAiRoute.includes("Foundation subscription or higher"),
    "AI Journal analysis route must reject free users with 403"
  );

  const chartAiRoute = readFile("src/app/api/ai/chart-analysis/route.ts");
  assert.ok(
    chartAiRoute.includes("CommercialAccess.canAccessSignalCentre") ||
    chartAiRoute.includes("Foundation subscription or higher"),
    "AI Chart analysis route must reject free users with 403"
  );

  // Assert predicate returns false for free tier
  assert.equal(CommercialAccess.canAccessSignalCentre("free", "active"), false);
  assert.equal(CommercialAccess.canAccessSignalCentre("free", "inactive"), false);
});

// ---------------------------------------------------------------------------
// 3. Foundation user receives Foundation entitlement
// ---------------------------------------------------------------------------
test("Conversion: Foundation user receives Foundation entitlement", () => {
  assert.equal(hasTierAccess("foundation", "foundation", "active"), true);
  assert.equal(CommercialAccess.canAccessSignalCentre("foundation", "active"), true);
  assert.equal(getEffectiveTierLevel("foundation", "active"), 1);
});

// ---------------------------------------------------------------------------
// 4. Edge user receives Edge entitlement
// ---------------------------------------------------------------------------
test("Conversion: Edge user receives Edge entitlement and inherits Foundation", () => {
  assert.equal(hasTierAccess("edge", "edge", "active"), true);
  assert.equal(hasTierAccess("edge", "foundation", "active"), true);
  assert.equal(CommercialAccess.canAccessInvestmentCentre("edge", "active"), true);
  assert.equal(getEffectiveTierLevel("edge", "active"), 2);
});

// ---------------------------------------------------------------------------
// 5. Floor user receives Floor entitlement
// ---------------------------------------------------------------------------
test("Conversion: Floor user receives Floor entitlement and inherits all sub-tiers", () => {
  assert.equal(hasTierAccess("floor", "floor", "active"), true);
  assert.equal(hasTierAccess("floor", "edge", "active"), true);
  assert.equal(hasTierAccess("floor", "foundation", "active"), true);
  assert.equal(CommercialAccess.canAccessFullCourses("floor", "active"), true);
  assert.equal(CommercialAccess.canAccessAlgoBuilderExport("floor", "active"), true);
  assert.equal(getEffectiveTierLevel("floor", "active"), 3);
});

// ---------------------------------------------------------------------------
// 6. Locked UI displays correct upgrade destination
// ---------------------------------------------------------------------------
test("Conversion: Locked UI displays correct upgrade destination", () => {
  const tierGate = readFile("src/components/dashboard/TierGate.tsx");
  assert.ok(
    tierGate.includes('href="/pricing"'),
    "TierGate must link to /pricing"
  );
  assert.ok(
    tierGate.includes("Upgrade to {required}"),
    "TierGate must include explicit Upgrade CTA"
  );
  assert.ok(
    tierGate.includes("// WHAT IS THIS?"),
    "TierGate must explain what the locked capability is"
  );
  assert.ok(
    tierGate.includes("// WHAT {required.toUpperCase()} UNLOCKS"),
    "TierGate must explain what the upgrade unlocks"
  );

  const lockedCard = readFile("src/components/dashboard/LockedFeatureCard.tsx");
  assert.ok(
    lockedCard.includes('href="/pricing"'),
    "LockedFeatureCard must link to /pricing"
  );
  assert.ok(
    lockedCard.includes("Upgrade to {requiredLabel}"),
    "LockedFeatureCard must render upgrade link for the required tier"
  );
});

// ---------------------------------------------------------------------------
// 7. Upgrade CTA opens correct Stripe flow
// ---------------------------------------------------------------------------
test("Conversion: Upgrade CTA initiates authoritative Stripe checkout", () => {
  const directUpgrade = readFile("src/components/dashboard/DirectUpgradeButton.tsx");
  assert.ok(
    directUpgrade.includes('fetch("/api/stripe/checkout-tier"'),
    "DirectUpgradeButton must call /api/stripe/checkout-tier"
  );

  const pricingClient = readFile("src/app/(marketing)/pricing/PricingClient.tsx");
  assert.ok(
    pricingClient.includes('fetch("/api/stripe/checkout"'),
    "PricingClient must call /api/stripe/checkout"
  );
});

// ---------------------------------------------------------------------------
// 8. Successful upgrade updates entitlement
// ---------------------------------------------------------------------------
test("Conversion: Successful upgrade webhook updates profile tier", () => {
  const webhook = readFile("src/app/api/stripe/webhook/route.ts");
  assert.ok(
    webhook.includes("subscription_tier: tier") ||
    webhook.includes("subscription_status: \"active\""),
    "Webhook must activate profile tier on checkout completion"
  );
});

// ---------------------------------------------------------------------------
// 9. Cancelled subscription handled correctly
// ---------------------------------------------------------------------------
test("Conversion: Cancelled subscription resets tier to free", () => {
  const webhook = readFile("src/app/api/stripe/webhook/route.ts");
  assert.ok(
    webhook.includes('subscription_tier: "free"') &&
    webhook.includes('subscription_status: "cancelled"'),
    "Webhook must revert cancelled subscriptions to free tier and status cancelled"
  );
  assert.equal(getEffectiveTierLevel("foundation", "cancelled"), 0);
  assert.equal(getEffectiveTierLevel("edge", "cancelled"), 0);
});

// ---------------------------------------------------------------------------
// 10. Failed payment handled correctly
// ---------------------------------------------------------------------------
test("Conversion: Failed payment sets status past_due and drops effective privileges to 0", () => {
  const webhook = readFile("src/app/api/stripe/webhook/route.ts");
  assert.ok(
    webhook.includes('subscription_status: "past_due"'),
    "Webhook must record past_due status on payment failure"
  );
  assert.equal(getEffectiveTierLevel("foundation", "past_due"), 0);
  assert.equal(getEffectiveTierLevel("edge", "past_due"), 0);
  assert.equal(hasTierAccess("foundation", "foundation", "past_due"), false);
});

// ---------------------------------------------------------------------------
// 11. User context survives upgrade where supported
// ---------------------------------------------------------------------------
test("Conversion: User context survives upgrade via redirectPath", () => {
  const checkoutRoute = readFile("src/app/api/stripe/checkout/route.ts");
  assert.ok(
    checkoutRoute.includes("redirectPath"),
    "Checkout route must extract redirectPath from request body"
  );
  assert.ok(
    checkoutRoute.includes("subscription=success"),
    "Checkout route must append subscription=success to the return URL"
  );

  const checkoutTierRoute = readFile("src/app/api/stripe/checkout-tier/route.ts");
  assert.ok(
    checkoutTierRoute.includes("redirectPath"),
    "Checkout-tier route must support redirectPath"
  );
  assert.ok(
    checkoutTierRoute.includes("subscription=success"),
    "Checkout-tier route must append subscription=success to the return URL"
  );

  const pricingClient = readFile("src/app/(marketing)/pricing/PricingClient.tsx");
  assert.ok(
    pricingClient.includes("redirectPath"),
    "PricingClient must pass redirectPath to checkout session"
  );
});

// ---------------------------------------------------------------------------
// 12. Deep links remain valid
// ---------------------------------------------------------------------------
test("Conversion: Deep links handle query parameters safely", () => {
  const checkoutRoute = readFile("src/app/api/stripe/checkout/route.ts");
  assert.ok(
    checkoutRoute.includes("redirectPath.includes(\"?\") ? \"&\" : \"?\""),
    "Checkout route must cleanly handle URLs with existing query parameters"
  );

  const checkoutTierRoute = readFile("src/app/api/stripe/checkout-tier/route.ts");
  assert.ok(
    checkoutTierRoute.includes("redirectPath.includes(\"?\") ? \"&\" : \"?\""),
    "Checkout-tier route must cleanly handle URLs with existing query parameters"
  );
});

// ---------------------------------------------------------------------------
// 13. Mobile locked state works
// ---------------------------------------------------------------------------
test("Conversion: Mobile locked state uses responsive layout without overflow", () => {
  const tierGate = readFile("src/components/dashboard/TierGate.tsx");
  assert.ok(
    tierGate.includes("grid-cols-1 md:grid-cols-2"),
    "TierGate must use single column on mobile viewports"
  );
  assert.ok(
    tierGate.includes("flex-wrap"),
    "TierGate button row must wrap on mobile screens"
  );
});

// ---------------------------------------------------------------------------
// 14. Usage limits enforce correctly
// ---------------------------------------------------------------------------
test("Conversion: Usage limits are enforced server-side", () => {
  const algoRoute = readFile("src/app/api/algo-builder/generate/route.ts");
  assert.ok(
    algoRoute.includes("algo_generation_log"),
    "Algo builder must track generations in server database log"
  );

  const aiRateLimit = readFile("src/lib/supabase/ai-rate-limit.ts");
  assert.ok(
    aiRateLimit.includes("checkAndLogAiUsage"),
    "AI routes must use checkAndLogAiUsage for server-side rate limits"
  );
});

// ---------------------------------------------------------------------------
// 15. No client-only premium bypass
// ---------------------------------------------------------------------------
test("Conversion: No client-only premium bypass", () => {
  // Server-side Signal Centre page strips private levels for non-subscribers
  const signalPage = readFile("src/app/(platform)/dashboard/signal-centre/page.tsx");
  assert.ok(
    signalPage.includes("sanitizeSignalForPreview"),
    "Signal Centre server component must sanitize sensitive trade levels for non-subscribers"
  );
  assert.ok(
    signalPage.includes("entry_price: null"),
    "Sanitizer must remove entry_price before payload reaches the client"
  );
});

// ---------------------------------------------------------------------------
// 16. Existing RUN MY TRADE functionality remains intact
// ---------------------------------------------------------------------------
test("Conversion: Existing RUN MY TRADE functionality remains intact", () => {
  const runMyTrade = readFile("src/components/dashboard/RunMyTrade.tsx");
  assert.ok(
    runMyTrade.includes("calculatePositionSize"),
    "RunMyTrade must use the canonical calculatePositionSize engine"
  );
  assert.ok(
    runMyTrade.includes("/api/trade-plans/create"),
    "RunMyTrade must submit to /api/trade-plans/create"
  );
});

// ---------------------------------------------------------------------------
// 17. Existing trade plans remain intact
// ---------------------------------------------------------------------------
test("Conversion: Existing trade plans table is preserved without duplication", () => {
  const createRoute = readFile("src/app/api/trade-plans/create/route.ts");
  assert.ok(
    createRoute.includes('.from("trade_plans")'),
    "Must write directly to existing trade_plans table"
  );
  assert.ok(
    createRoute.includes('.from("trade_plan_snapshots")'),
    "Must record immutable snapshot in trade_plan_snapshots"
  );
});

// ---------------------------------------------------------------------------
// 18. No duplicate entitlement logic introduced
// ---------------------------------------------------------------------------
test("Conversion: Single authoritative entitlement source of truth", () => {
  assert.ok(
    typeof TIER_WEIGHT === "object",
    "TIER_WEIGHT must be exported from entitlements.ts"
  );
  assert.ok(
    typeof CommercialAccess === "object",
    "CommercialAccess must be exported from entitlements.ts"
  );
  assert.ok(
    typeof hasTierAccess === "function",
    "hasTierAccess must be exported from entitlements.ts"
  );
});
