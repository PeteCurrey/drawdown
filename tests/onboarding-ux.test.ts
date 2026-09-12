import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. OnboardingWizard Validation & Navigation Integrity (Prompt 07 Activation)
// ---------------------------------------------------------------------------

test("OnboardingUX: step 1 is blocked if primary improvement objective is not selected", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 1 && !primaryObjective)"),
    "Step 1 must disable continuation if primary improvement objective is missing"
  );
  assert.ok(
    wizard.includes("What do you want to"),
    "Step 1 must ask what the user wants to improve"
  );
});

test("OnboardingUX: step 1 provides all 5 required operational improvement objectives", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(wizard.includes('"Risk"'), "Must include Risk objective");
  assert.ok(wizard.includes('"Strategy"'), "Must include Strategy objective");
  assert.ok(wizard.includes('"Discipline"'), "Must include Discipline objective");
  assert.ok(wizard.includes('"Prop Firm Performance"'), "Must include Prop Firm Performance objective");
  assert.ok(wizard.includes('"Market Analysis"'), "Must include Market Analysis objective");
});

test("OnboardingUX: step 2 is blocked if primary market is not selected", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 2 && !primaryMarket)"),
    "Step 2 must disable continuation if primary market is not selected"
  );
  assert.ok(
    wizard.includes("What do you"),
    "Step 2 must ask what the user trades most"
  );
});

test("OnboardingUX: step 2 provides genuinely supported asset classes", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(wizard.includes('"FX"'), "Must include FX");
  assert.ok(wizard.includes('"Indices"'), "Must include Indices");
  assert.ok(wizard.includes('"Commodities"'), "Must include Commodities");
  assert.ok(wizard.includes('"Equities"'), "Must include Equities");
  assert.ok(wizard.includes('"Crypto"'), "Must include Crypto");
});

test("OnboardingUX: handleComplete validates selections before submitting", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("if (!primaryObjective || !primaryMarket) return;"),
    "handleComplete must guard against submitting with empty required objective/market fields"
  );
  assert.ok(
    wizard.includes("setSubmitError"),
    "handleComplete must handle submission failures with visible error state"
  );
});

test("OnboardingUX: step 3 provides honest summary and direct links to operating loop", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes('href="/dashboard/accounts"'),
    "Step 3 must link to Stage 0 Account Setup"
  );
  assert.ok(
    wizard.includes('href="/dashboard/prepare"'),
    "Step 3 must link to Stage 1 Session Preparation"
  );
  assert.ok(
    wizard.includes('href="/dashboard/the-wire"'),
    "Step 3 must link to The Wire"
  );
  assert.ok(
    wizard.includes("Launch Terminal"),
    "Step 3 primary button must offer Launch Terminal CTA"
  );
  assert.ok(
    !wizard.includes("animate-pulse"),
    "Step 3 must not use fake animated verification pulses"
  );
});

// ---------------------------------------------------------------------------
// 2. Locked Feature Components (TierGate & LockedFeatureCard)
// ---------------------------------------------------------------------------

test("OnboardingUX: TierGate dynamically renders feature name and tier requirements", () => {
  const tierGate = readFile("src/components/dashboard/TierGate.tsx");
  assert.ok(
    tierGate.includes("featureName ?? required"),
    "TierGate must render custom featureName or fall back to required tier label"
  );
  assert.ok(
    tierGate.includes("TIER_LABELS[requiredTier]"),
    "TierGate must resolve tier label from canonical tier access map"
  );
});

test("OnboardingUX: TierGate uses design system tokens instead of hardcoded hex values", () => {
  const tierGate = readFile("src/components/dashboard/TierGate.tsx");
  assert.ok(
    !tierGate.includes("#1A1A1A"),
    "TierGate must not use hardcoded #1A1A1A hex colors"
  );
  assert.ok(
    !tierGate.includes("#555550"),
    "TierGate must not use hardcoded #555550 hex colors"
  );
  assert.ok(
    !tierGate.includes("#DEDDD8"),
    "TierGate must not use hardcoded #DEDDD8 hex colors"
  );
  assert.ok(
    tierGate.includes("text-text-primary"),
    "TierGate must use text-text-primary design token"
  );
});

test("OnboardingUX: LockedFeatureCard renders required tier upgrade CTA", () => {
  const card = readFile("src/components/dashboard/LockedFeatureCard.tsx");
  assert.ok(
    card.includes("Upgrade to {requiredLabel}"),
    "LockedFeatureCard must render clear Upgrade to {requiredLabel} CTA"
  );
  assert.ok(
    card.includes("currentTier?: SubscriptionTier"),
    "LockedFeatureCard must support optional currentTier prop"
  );
});

// ---------------------------------------------------------------------------
// 3. Post-Stripe Return & Empty States
// ---------------------------------------------------------------------------

test("OnboardingUX: Dashboard detects ?subscription=success and displays confirmation banner", () => {
  const dashboard = readFile("src/app/(platform)/dashboard/page.tsx");
  assert.ok(
    dashboard.includes('params.get("subscription") === "success"'),
    "Dashboard must check for subscription=success in query string"
  );
  assert.ok(
    dashboard.includes("Subscription Confirmed"),
    "Dashboard must display Subscription Confirmed banner"
  );
});

test("OnboardingUX: ReviewListingClient empty state links to /dashboard/journal", () => {
  const review = readFile("src/app/(platform)/dashboard/review/ReviewListingClient.tsx");
  assert.ok(
    review.includes('href="/dashboard/journal"'),
    "Empty state must link to canonical AI Trade Journal (/dashboard/journal)"
  );
  assert.ok(
    !review.includes('href="/dashboard/record"'),
    "Empty state must not link to legacy quick record URL"
  );
});

test("OnboardingUX: Dashboard getNextAction routes unconfigured accounts to Stage 0", () => {
  const dashboard = readFile("src/app/(platform)/dashboard/page.tsx");
  assert.ok(
    dashboard.includes('stage: "Stage 0: Setup"'),
    "getNextAction must assign Stage 0: Setup when account is missing"
  );
  assert.ok(
    dashboard.includes('href: "/dashboard/accounts"'),
    "getNextAction must point to /dashboard/accounts when account is missing"
  );
});
