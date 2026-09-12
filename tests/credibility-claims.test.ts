import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

test("Credibility audit: No HMAC risk token claims remain in marketing or tools pages", () => {
  const toolsPage = readFile("src/app/(marketing)/tools/page.tsx");
  const toolsClient = readFile("src/app/(marketing)/tools/ToolsClient.tsx");
  const investmentMarketing = readFile("src/app/(marketing)/investment-centre/InvestmentCentreMarketingClient.tsx");
  const investmentClient = readFile("src/app/(platform)/dashboard/investment-centre/InvestmentCentreClient.tsx");

  assert.ok(!toolsPage.includes("HMAC Risk Tokens"), "tools/page.tsx should not claim HMAC Risk Tokens");
  assert.ok(!toolsClient.includes("HMAC Risk Tokens"), "ToolsClient.tsx should not claim HMAC Risk Tokens");
  assert.ok(!investmentMarketing.includes("HMAC"), "InvestmentCentreMarketingClient should not claim HMAC");
  assert.ok(!investmentClient.includes("HMAC-SHA256 SIGNED"), "InvestmentCentreClient should not claim HMAC-SHA256 SIGNED");
  assert.ok(!investmentClient.includes("HMAC-SHA256 Signed OrderIntent Router"), "InvestmentCentreClient should not claim HMAC router");
});

test("Credibility audit: No '1,420 Metrics' or '18 Real-Time Feeds' in tools or investment centre", () => {
  const toolsPage = readFile("src/app/(marketing)/tools/page.tsx");
  const toolsClient = readFile("src/app/(marketing)/tools/ToolsClient.tsx");
  const investmentMarketing = readFile("src/app/(marketing)/investment-centre/InvestmentCentreMarketingClient.tsx");

  assert.ok(!toolsPage.includes("1,420 Metrics"), "tools/page.tsx should not claim 1,420 Metrics");
  assert.ok(!toolsPage.includes("18 Real-Time Feeds"), "tools/page.tsx should not claim 18 Real-Time Feeds");
  assert.ok(!toolsClient.includes("1,420 Metrics"), "ToolsClient should not claim 1,420 Metrics");
  assert.ok(!toolsClient.includes("18 Real-Time Feeds"), "ToolsClient should not claim 18 Real-Time Feeds");
  assert.ok(!investmentMarketing.includes("1,420 METRICS"), "InvestmentCentreMarketingClient should not claim 1,420 METRICS");
  assert.ok(!investmentMarketing.includes("18 REAL-TIME"), "InvestmentCentreMarketingClient should not claim 18 REAL-TIME");
});

test("Credibility audit: Signal Centre does not claim DCS is based on back-tested accuracy", () => {
  const signalCentreMarketing = readFile("src/app/(marketing)/signal-centre/SignalCentreMarketingClient.tsx");
  assert.ok(
    !signalCentreMarketing.includes("based on back-tested signal accuracy"),
    "SignalCentreMarketingClient should not claim DCS is based on back-tested accuracy"
  );
});

test("Credibility audit: Platform marketing does not claim dark pool activity", () => {
  const platformPage = readFile("src/app/(marketing)/platform/page.tsx");
  assert.ok(!platformPage.includes("Dark pool"), "platform/page.tsx should not claim Dark pool activity");
});

test("Credibility audit: Grok prompt does not claim real-time X/Twitter access", () => {
  const signalEngine = readFile("src/lib/signal-engine.ts");
  assert.ok(
    !signalEngine.includes("with access to real-time X/Twitter sentiment data"),
    "signal-engine.ts should not claim Grok has real-time X/Twitter access"
  );
  assert.ok(
    !signalEngine.includes("You have access to real-time social sentiment data from X/Twitter"),
    "signal-engine.ts should not claim GPT-4o fallback has real-time X/Twitter access"
  );
});

test("Credibility audit: Dashboard does not manufacture Manual Trading Portfolio", () => {
  const dashboardPage = readFile("src/app/(platform)/dashboard/page.tsx");
  assert.ok(
    !dashboardPage.includes("Manual Trading Portfolio"),
    "dashboard/page.tsx should not manufacture a Manual Trading Portfolio"
  );
  assert.ok(
    !dashboardPage.includes("account_size: 100000"),
    "dashboard/page.tsx should not default account_size to 100000"
  );
});

test("Credibility audit: PetesDailyTakeExcerpt does not contain hardcoded fallback commentary", () => {
  const takeExcerpt = readFile("src/components/home/PetesDailyTakeExcerpt.tsx");
  assert.ok(
    !takeExcerpt.includes("Major indices are showing strong resilience"),
    "PetesDailyTakeExcerpt should not have hardcoded fallback quote"
  );
});
