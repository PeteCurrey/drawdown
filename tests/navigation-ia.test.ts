import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. Navigation Architecture Tests (4 Pillars)
// ---------------------------------------------------------------------------

test("IA: platform layout exports 4 distinct navigation pillars", () => {
  const layout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(layout.includes("operatingLoopNavLinks"), "layout must define operatingLoopNavLinks");
  assert.ok(layout.includes("intelligenceNavLinks"), "layout must define intelligenceNavLinks");
  assert.ok(layout.includes("toolsNavLinks"), "layout must define toolsNavLinks");
  assert.ok(layout.includes("academyNavLinks"), "layout must define academyNavLinks");
});

test("IA: operating loop contains all 6 core stages", () => {
  const layout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(layout.includes('href: "/dashboard"'), "operating loop must include Today (/dashboard)");
  assert.ok(layout.includes('href: "/dashboard/prepare"'), "operating loop must include Prepare (/dashboard/prepare)");
  assert.ok(layout.includes('href: "/dashboard/plan"'), "operating loop must include Plan (/dashboard/plan)");
  assert.ok(layout.includes('href: "/dashboard/journal"'), "operating loop must include Journal (/dashboard/journal)");
  assert.ok(layout.includes('href: "/dashboard/review"'), "operating loop must include Review (/dashboard/review)");
  assert.ok(layout.includes('href: "/dashboard/improve"'), "operating loop must include Improve (/dashboard/improve)");
});

test("IA: external marketing routes (/brokers, /prop-firms) are removed from authenticated sidebar nav", () => {
  const layout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(!layout.includes('href: "/brokers"'), "sidebar must not link to external public /brokers");
  assert.ok(!layout.includes('href: "/prop-firms"'), "sidebar must not link to external public /prop-firms");
});

test("IA: desktop header workflow tabs include unified Journal", () => {
  const layout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(
    layout.includes('{ label: "Journal", href: "/dashboard/journal" }'),
    "header workflow tabs must link Journal to /dashboard/journal"
  );
});

test("IA: mobile bottom tab bar is workflow-first (Today, Plan, Journal, Markets)", () => {
  const layout = readFile("src/app/(platform)/layout.tsx");
  assert.ok(layout.includes('{ label: "Today", href: "/dashboard"'), "mobile bottom bar must have Today");
  assert.ok(layout.includes('{ label: "Plan", href: "/dashboard/plan"'), "mobile bottom bar must have Plan");
  assert.ok(layout.includes('{ label: "Journal", href: "/dashboard/journal"'), "mobile bottom bar must have Journal");
  assert.ok(layout.includes('{ label: "Markets", href: "/dashboard/the-wire"'), "mobile bottom bar must have Markets");
});

// ---------------------------------------------------------------------------
// 2. Contextual Tool Integration
// ---------------------------------------------------------------------------

test("IA: PlanClient contextually connects Stage 2 (Plan) to Stage 3 (Position Sizer)", () => {
  const planClient = readFile("src/components/dashboard/PlanClient.tsx");
  assert.ok(
    planClient.includes('href="/dashboard/tools/position-sizer"'),
    "PlanClient must contextually link to /dashboard/tools/position-sizer"
  );
});

// ---------------------------------------------------------------------------
// 3. Truth & Next Action in Dashboard Home
// ---------------------------------------------------------------------------

test("IA: dashboard home directs users without an account to Stage 0 Account Setup", () => {
  const dashboardPage = readFile("src/app/(platform)/dashboard/page.tsx");
  assert.ok(
    dashboardPage.includes('href: "/dashboard/accounts"'),
    "dashboard/page.tsx must direct unconfigured account state to /dashboard/accounts"
  );
  assert.ok(
    dashboardPage.includes('stage: "Stage 0: Setup"'),
    "dashboard/page.tsx must designate account setup as Stage 0"
  );
});

test("IA: dashboard home operating checklist links 3. Review directly to /dashboard/review", () => {
  const dashboardPage = readFile("src/app/(platform)/dashboard/page.tsx");
  assert.ok(
    dashboardPage.includes('href="/dashboard/review"'),
    "dashboard/page.tsx mini checklist must link to /dashboard/review"
  );
});

// ---------------------------------------------------------------------------
// 4. Architecture Documentation Integrity
// ---------------------------------------------------------------------------

test("IA Docs: all 4 required architecture documents exist", () => {
  assert.ok(fs.existsSync(path.join(rootDir, "docs/dashboard-current-ia.md")), "docs/dashboard-current-ia.md must exist");
  assert.ok(fs.existsSync(path.join(rootDir, "docs/dashboard-ia.md")), "docs/dashboard-ia.md must exist");
  assert.ok(fs.existsSync(path.join(rootDir, "docs/drawdown-terminology.md")), "docs/drawdown-terminology.md must exist");
  assert.ok(fs.existsSync(path.join(rootDir, "docs/dashboard-events.md")), "docs/dashboard-events.md must exist");
});

test("IA Docs: drawdown-terminology.md establishes canonical definitions", () => {
  const terms = readFile("docs/drawdown-terminology.md");
  assert.ok(terms.includes("Trading Account"), "must define Trading Account");
  assert.ok(terms.includes("Trade Plan"), "must define Trade Plan");
  assert.ok(terms.includes("Trade Record"), "must define Trade Record");
  assert.ok(terms.includes("Trade Review"), "must define Trade Review");
  assert.ok(terms.includes("AI Trade Journal"), "must define AI Trade Journal");
  assert.ok(terms.includes("Decision Support"), "must define Signals as decision support");
});
