import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// Stripe checkout server-side tier validation
// ---------------------------------------------------------------------------

test("Security: checkout route imports getTierFromPriceId for server-side validation", () => {
  const checkoutRoute = readFile("src/app/api/stripe/checkout/route.ts");
  assert.ok(
    checkoutRoute.includes("getTierFromPriceId"),
    "checkout/route.ts must import and use getTierFromPriceId to validate tier/priceId server-side"
  );
});

test("Security: checkout route rejects mismatched tier with 400", () => {
  const checkoutRoute = readFile("src/app/api/stripe/checkout/route.ts");
  assert.ok(
    checkoutRoute.includes("resolvedTier !== tier"),
    "checkout/route.ts must reject requests where client-supplied tier does not match priceId"
  );
});

test("Security: checkout route uses authoritativeTier in Stripe metadata, not client-supplied tier", () => {
  const checkoutRoute = readFile("src/app/api/stripe/checkout/route.ts");
  assert.ok(
    checkoutRoute.includes("authoritativeTier"),
    "checkout/route.ts must use authoritativeTier in session metadata"
  );
});

test("Security: webhook uses idempotency check to prevent duplicate processing", () => {
  const webhookRoute = readFile("src/app/api/stripe/webhook/route.ts");
  assert.ok(
    webhookRoute.includes("stripe_events"),
    "webhook/route.ts must use stripe_events table for idempotency"
  );
  assert.ok(
    webhookRoute.includes("23505"),
    "webhook/route.ts must handle unique_violation (23505) to detect duplicate events"
  );
});

test("Security: webhook forces free tier on cancellation", () => {
  const webhookRoute = readFile("src/app/api/stripe/webhook/route.ts");
  assert.ok(
    webhookRoute.includes("canceled") || webhookRoute.includes("cancelled"),
    "webhook/route.ts must handle subscription cancellation"
  );
  assert.ok(
    webhookRoute.includes("\"free\"") || webhookRoute.includes("'free'"),
    "webhook/route.ts must force free tier on cancellation"
  );
});

// ---------------------------------------------------------------------------
// Signal data sanitisation — no sensitive fields leaked to non-subscribers
// ---------------------------------------------------------------------------

test("Security: signal-centre page server-sanitises data for non-entitled users", () => {
  const signalCentrePage = readFile(
    "src/app/(platform)/dashboard/signal-centre/page.tsx"
  );
  assert.ok(
    signalCentrePage.includes("sanitizeSignalForPreview"),
    "signal-centre/page.tsx must call sanitizeSignalForPreview() to strip sensitive fields server-side"
  );
});

test("Security: signal-centre page strips entry_price for non-entitled users", () => {
  const signalCentrePage = readFile(
    "src/app/(platform)/dashboard/signal-centre/page.tsx"
  );
  assert.ok(
    signalCentrePage.includes("entry_price"),
    "signal-centre/page.tsx must reference entry_price in sanitisation"
  );
});

test("Security: signal detail page server-sanitises data for non-entitled users", () => {
  const signalDetailPage = readFile(
    "src/app/(platform)/dashboard/signal-centre/signals/[id]/page.tsx"
  );
  assert.ok(
    signalDetailPage.includes("sanitizeSignalForPreview"),
    "signal detail page must call sanitizeSignalForPreview() to strip sensitive fields server-side"
  );
});

// ---------------------------------------------------------------------------
// Client self-elevation prevention
// ---------------------------------------------------------------------------

test("Security: platform layout does not sync auth metadata tier to profile", () => {
  const platformLayout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(
    !platformLayout.includes("metaTier && currentProfile.subscription_tier !== metaTier"),
    "platform layout must not sync user_metadata tier to profiles.subscription_tier (prevents client self-elevation)"
  );
});

// ---------------------------------------------------------------------------
// AI endpoint tier gates
// ---------------------------------------------------------------------------

test("Security: chart-analysis route has Foundation tier gate", () => {
  const chartAnalysis = readFile("src/app/api/ai/chart-analysis/route.ts");
  assert.ok(
    chartAnalysis.includes("canAccessSignalCentre") || chartAnalysis.includes("CommercialAccess"),
    "chart-analysis/route.ts must enforce tier access via CommercialAccess"
  );
});

test("Security: explain-news route has Foundation tier gate", () => {
  const explainNews = readFile("src/app/api/ai/explain-news/route.ts");
  assert.ok(
    explainNews.includes("canAccessSignalCentre") || explainNews.includes("CommercialAccess"),
    "explain-news/route.ts must enforce tier access via CommercialAccess"
  );
});

test("Security: journal-analysis route has Foundation tier gate", () => {
  const journalAnalysis = readFile("src/app/api/ai/journal-analysis/route.ts");
  assert.ok(
    journalAnalysis.includes("canAccessSignalCentre") || journalAnalysis.includes("CommercialAccess"),
    "journal-analysis/route.ts must enforce tier access via CommercialAccess"
  );
});

test("Security: ai-debate route has Edge tier gate", () => {
  const aiDebate = readFile("src/app/api/intelligence/ai-debate/[symbol]/route.ts");
  assert.ok(
    aiDebate.includes("canAccessInvestmentCentre") || aiDebate.includes("CommercialAccess"),
    "ai-debate route must enforce Investment Centre tier access via CommercialAccess"
  );
});

test("Security: signals scan POST requires authentication", () => {
  const signalsScan = readFile("src/app/api/signals/scan/route.ts");
  assert.ok(
    signalsScan.includes("CRON_SECRET") || signalsScan.includes("canAccessSignalCentre"),
    "signals/scan route POST must require CRON_SECRET or authenticated tier access"
  );
});

// ---------------------------------------------------------------------------
// Canonical entitlement single source of truth
// ---------------------------------------------------------------------------

test("Security: no local TIER_WEIGHT definitions remain outside entitlements.ts", () => {
  const filesToCheck = [
    "src/app/api/algo-builder/generate/route.ts",
    "src/app/api/algo-builder/strategies/route.ts",
    "src/app/api/intelligence/grok-sentiment/route.ts",
    "src/app/api/market/analysis/route.ts",
    "src/components/signal-centre/SignalCentreDashboardClient.tsx",
  ];

  for (const relPath of filesToCheck) {
    const content = readFile(relPath);
    // Must not define a local TIER_WEIGHT object literal
    assert.ok(
      !content.match(/const TIER_WEIGHT\s*[=:]/),
      `${relPath} must not define a local TIER_WEIGHT — import from @/lib/entitlements instead`
    );
  }
});

test("Security: entitlements.ts is the canonical source (exports CommercialAccess)", () => {
  const entitlements = readFile("src/lib/entitlements.ts");
  assert.ok(
    entitlements.includes("export const CommercialAccess"),
    "src/lib/entitlements.ts must export CommercialAccess as the canonical access control object"
  );
  assert.ok(
    entitlements.includes("export const TIER_WEIGHT"),
    "src/lib/entitlements.ts must export TIER_WEIGHT as the authoritative tier map"
  );
});
