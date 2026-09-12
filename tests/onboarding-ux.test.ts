import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. OnboardingWizard Validation & Navigation Integrity
// ---------------------------------------------------------------------------

test("OnboardingUX: step 1 is blocked if firstName, lastName, or style is missing", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 1 && (!firstName || !lastName || !style))"),
    "Step 1 must disable continuation if firstName, lastName, or style is missing"
  );
});

test("OnboardingUX: step 2 is blocked if experience level is not selected", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 2 && !experience)"),
    "Step 2 must disable continuation if experience is not selected"
  );
  assert.ok(
    wizard.includes("Experience & Region"),
    "Step 2 title must be aligned with experience and region"
  );
});

test("OnboardingUX: step 3 is blocked if markets are empty or capital is not selected", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 3 && (markets.length === 0 || !capital))"),
    "Step 3 must disable continuation if markets are empty or capital is unselected"
  );
});

test("OnboardingUX: step 4 is blocked if goal is not selected", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("(step === 4 && !goal)"),
    "Step 4 must disable continuation if trading goal is unselected"
  );
});

test("OnboardingUX: handleComplete validates identity before submitting", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes("if (!firstName.trim() || !lastName.trim() || !style)"),
    "handleComplete must guard against submitting with empty required identity fields"
  );
  assert.ok(
    wizard.includes("setSubmitError"),
    "handleComplete must handle submission failures with visible error state"
  );
});

test("OnboardingUX: step 5 provides honest summary and direct links to operating loop", () => {
  const wizard = readFile("src/components/dashboard/OnboardingWizard.tsx");
  assert.ok(
    wizard.includes('href="/dashboard/accounts"'),
    "Step 5 must link to Stage 0 Account Setup"
  );
  assert.ok(
    wizard.includes('href="/dashboard/prepare"'),
    "Step 5 must link to Stage 1 Session Preparation"
  );
  assert.ok(
    wizard.includes('href="/dashboard/the-wire"'),
    "Step 5 must link to The Wire"
  );
  assert.ok(
    wizard.includes("Launch Terminal"),
    "Step 5 primary button must offer Launch Terminal CTA"
  );
  assert.ok(
    !wizard.includes("animate-pulse"),
    "Step 5 must not use fake animated verification pulses"
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
