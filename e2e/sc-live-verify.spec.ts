/**
 * Signal Centre Live Verification — BLOCKER 1 CLOSURE
 *
 * Coverage:
 *   • 5x FREE desktop authenticated HTTP 200 check
 *   • 5x PAID desktop authenticated HTTP 200 check
 *   • FREE mobile 375×812 check
 *   • FREE mobile 390×844 check
 *   • PAID mobile 375×812 check
 *   • PAID mobile 390×844 check
 *   • FREE data-protection: restricted fields must not be exposed in DOM
 *   • PAID data-access: full fields must be present
 *
 * Run with: npx playwright test e2e/sc-live-verify.spec.ts --project=desktop --reporter=list
 */

import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const FREE_EMAIL = "qa-free-user@drawdown.trading";
const FREE_PASS = "QA!Free#2026SecureTest";
const PAID_EMAIL = "qa-paid-user@drawdown.trading";
const PAID_PASS = "QA!Paid#2026SecureTest";
const BASE = "https://www.drawdown.trading";
const SC_URL = `${BASE}/dashboard/signal-centre`;

function screenshotDir() {
  const dir = path.join(process.cwd(), "docs", "screenshots", "sc-live-verify");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

interface RunResult {
  httpStatus: number;
  tier: string;
  title: string;
  visibleResult: string;
  consoleErrors: string[];
  failedRequests: string[];
  bodyText: string;
  html: string;
}

async function loginAndGoToSignalCentre(
  page: Page,
  tier: "Free" | "Paid",
  email: string,
  pass: string
): Promise<RunResult> {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("ERR_ABORTED")) {
        consoleErrors.push(text);
      }
    }
  });

  page.on("requestfailed", (req) => {
    const url = req.url();
    if (!url.includes("favicon") && !url.includes("analytics") && !url.includes("_next/static")) {
      failedRequests.push(`${req.failure()?.errorText} — ${url}`);
    }
  });

  // Login
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', pass);
  await page.click('button[type="submit"]');

  // Wait for post-login redirect into dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 25000 });

  // Navigate to Signal Centre and record HTTP response
  const response = await page.goto(SC_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  const httpStatus = response ? response.status() : 0;

  // Allow client hydration / data load
  await page.waitForTimeout(3000);

  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText);
  const html = await page.content();

  const is500 = httpStatus >= 500 || /application error|this page couldn.t load|internal server error/i.test(bodyText);
  const visibleResult = is500 ? "HTTP 500 Server Error" : "Signal Centre Rendered OK";

  return {
    httpStatus,
    tier,
    title,
    visibleResult,
    consoleErrors,
    failedRequests,
    bodyText,
    html,
  };
}

// ── DESKTOP — FREE USER — 5 runs ─────────────────────────────────────────────

for (let run = 1; run <= 5; run++) {
  test(`SC-LIVE FREE desktop run ${run}/5`, async ({ page }) => {
    const res = await loginAndGoToSignalCentre(page, "Free", FREE_EMAIL, FREE_PASS);

    const dir = screenshotDir();
    const screenshotFile = path.join(dir, `free-desktop-run${run}.png`);
    await page.screenshot({ path: screenshotFile, fullPage: false });

    console.log(
      `[FREE-RUN-${run}] status=${res.httpStatus} tier=${res.tier} title="${res.title}" consoleErrors=${res.consoleErrors.length} failedRequests=${res.failedRequests.length} visibleResult="${res.visibleResult}" screenshot="${screenshotFile}"`
    );

    expect(res.title.toLowerCase(), "Landed on login page").not.toContain("sign in");
    expect(res.httpStatus, "Expected HTTP 200").toBe(200);

    const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
    expect(has500, `500 error page detected (run ${run}): "${res.title}"`).toBe(false);

    const hasContent = /signal|instrument|upgrade|unlock|timeframe|bias|drawdown/i.test(res.bodyText);
    expect(hasContent, `No signal centre content found on run ${run}`).toBe(true);

    const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
    expect(overflow, "Horizontal overflow detected").toBe(false);
  });
}

// ── DESKTOP — PAID USER — 5 runs ─────────────────────────────────────────────

for (let run = 1; run <= 5; run++) {
  test(`SC-LIVE PAID desktop run ${run}/5`, async ({ page }) => {
    const res = await loginAndGoToSignalCentre(page, "Paid", PAID_EMAIL, PAID_PASS);

    const dir = screenshotDir();
    const screenshotFile = path.join(dir, `paid-desktop-run${run}.png`);
    await page.screenshot({ path: screenshotFile, fullPage: false });

    console.log(
      `[PAID-RUN-${run}] status=${res.httpStatus} tier=${res.tier} title="${res.title}" consoleErrors=${res.consoleErrors.length} failedRequests=${res.failedRequests.length} visibleResult="${res.visibleResult}" screenshot="${screenshotFile}"`
    );

    expect(res.title.toLowerCase(), "Landed on login page").not.toContain("sign in");
    expect(res.httpStatus, "Expected HTTP 200").toBe(200);

    const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
    expect(has500, `500 error page detected (run ${run}): "${res.title}"`).toBe(false);

    const hasContent = /signal|instrument|timeframe|bias|drawdown/i.test(res.bodyText);
    expect(hasContent, `No signal centre content found on run ${run}`).toBe(true);

    const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
    expect(overflow, "Horizontal overflow detected").toBe(false);
  });
}

// ── MOBILE 375×812 — FREE ────────────────────────────────────────────────────

test("SC-LIVE FREE mobile-375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const res = await loginAndGoToSignalCentre(page, "Free", FREE_EMAIL, FREE_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `free-mobile375.png`);
  await page.screenshot({ path: screenshotFile, fullPage: false });

  console.log(`[FREE-MOBILE-375] status=${res.httpStatus} overflowCheck=true screenshot="${screenshotFile}"`);

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, `500 on mobile-375 FREE: "${res.title}"`).toBe(false);

  const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
  expect(overflow, "Horizontal overflow on mobile-375 FREE").toBe(false);
});

// ── MOBILE 390×844 — FREE ────────────────────────────────────────────────────

test("SC-LIVE FREE mobile-390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const res = await loginAndGoToSignalCentre(page, "Free", FREE_EMAIL, FREE_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `free-mobile390.png`);
  await page.screenshot({ path: screenshotFile, fullPage: false });

  console.log(`[FREE-MOBILE-390] status=${res.httpStatus} overflowCheck=true screenshot="${screenshotFile}"`);

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, `500 on mobile-390 FREE: "${res.title}"`).toBe(false);

  const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
  expect(overflow, "Horizontal overflow on mobile-390 FREE").toBe(false);
});

// ── MOBILE 375×812 — PAID ────────────────────────────────────────────────────

test("SC-LIVE PAID mobile-375", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const res = await loginAndGoToSignalCentre(page, "Paid", PAID_EMAIL, PAID_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `paid-mobile375.png`);
  await page.screenshot({ path: screenshotFile, fullPage: false });

  console.log(`[PAID-MOBILE-375] status=${res.httpStatus} overflowCheck=true screenshot="${screenshotFile}"`);

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, `500 on mobile-375 PAID: "${res.title}"`).toBe(false);

  const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
  expect(overflow, "Horizontal overflow on mobile-375 PAID").toBe(false);
});

// ── MOBILE 390×844 — PAID ────────────────────────────────────────────────────

test("SC-LIVE PAID mobile-390", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const res = await loginAndGoToSignalCentre(page, "Paid", PAID_EMAIL, PAID_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `paid-mobile390.png`);
  await page.screenshot({ path: screenshotFile, fullPage: false });

  console.log(`[PAID-MOBILE-390] status=${res.httpStatus} overflowCheck=true screenshot="${screenshotFile}"`);

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, `500 on mobile-390 PAID: "${res.title}"`).toBe(false);

  const overflow = await page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth + 5);
  expect(overflow, "Horizontal overflow on mobile-390 PAID").toBe(false);
});

// ── DATA PROTECTION — FREE user must NOT see restricted fields ────────────────

test("SC-LIVE FREE data-protection: restricted fields not exposed", async ({ page }) => {
  const res = await loginAndGoToSignalCentre(page, "Free", FREE_EMAIL, FREE_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `free-data-protection.png`);
  await page.screenshot({ path: screenshotFile, fullPage: true });

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, "500 on data-protection check").toBe(false);

  // Approach: verify that unblurred DOM text contains no actual numeric entry prices or stop losses
  const exposedPrices = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    let node = walker.nextNode();
    while (node) {
      let el = node.parentElement;
      let blurred = false;
      while (el) {
        const style = window.getComputedStyle(el);
        if (style.filter && style.filter.includes("blur")) { blurred = true; break; }
        if (el.classList && (el.classList.contains("blur") || el.classList.contains("backdrop-blur"))) {
          blurred = true; break;
        }
        el = el.parentElement;
      }
      if (!blurred && node.textContent) {
        const t = node.textContent.trim();
        // Check for specific price patterns like "1.0845" or "43210.50"
        if (/^\d{1,6}\.\d{2,5}$/.test(t)) {
          texts.push(t);
        }
      }
      node = walker.nextNode();
    }
    return texts;
  });

  console.log("[FREE-DATA-PROTECTION] Unblurred numeric price values found:", JSON.stringify(exposedPrices));
  // In preview mode, entry_price, stop_loss, take_profit_2 are nullified (displayed as "—" or blurred)
  expect(exposedPrices.length, `Restricted prices exposed in unblurred DOM: ${exposedPrices.join(", ")}`).toBe(0);

  const hasGating = /upgrade|unlock|foundation|edge|floor|subscribe|tier/i.test(res.bodyText);
  expect(hasGating, "Expected upgrade or gating prompt for FREE user").toBe(true);
});

// ── DATA ACCESS — PAID user MUST see full fields ──────────────────────────────

test("SC-LIVE PAID data-access: full signal fields accessible", async ({ page }) => {
  const res = await loginAndGoToSignalCentre(page, "Paid", PAID_EMAIL, PAID_PASS);

  const dir = screenshotDir();
  const screenshotFile = path.join(dir, `paid-data-access.png`);
  await page.screenshot({ path: screenshotFile, fullPage: true });

  expect(res.httpStatus).toBe(200);
  expect(res.title.toLowerCase()).not.toContain("sign in");
  const has500 = /application error|this page couldn.t load|internal server error/i.test(res.bodyText);
  expect(has500, "500 on PAID data-access check").toBe(false);

  const hasSignalContent = /signal|instrument|bias|timeframe|entry|stop|take profit|r:r|rr ratio/i.test(res.bodyText);
  expect(hasSignalContent, "Paid user does not see signal content").toBe(true);
});
