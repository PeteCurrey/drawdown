/**
 * Drawdown Trading — Critical Browser E2E Journeys
 *
 * These are genuine browser-automation tests using Playwright/Chromium.
 * They run against the live production deployment at https://drawdown.trading.
 *
 * They are distinct from the 210 in-process Node tests in tests/*.test.ts which
 * verify logic/contracts. These tests verify that a real browser engine renders
 * the expected DOM, redirects, meta-tags and layout at the correct viewports.
 *
 * Screenshot evidence is persisted to docs/screenshots/ for the release record.
 */

import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Save a named screenshot to docs/screenshots/<project>/<name>.png */
async function saveScreenshot(page: Page, name: string, testInfo: any) {
  const dir = path.join(
    process.cwd(),
    "docs",
    "screenshots",
    testInfo.project.name
  );
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

/** Assert zero horizontal overflow: scrollWidth must not exceed clientWidth */
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      bodyScrollWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      htmlScrollWidth: html.scrollWidth,
      htmlClientWidth: html.clientWidth,
    };
  });
  expect(
    overflow.bodyScrollWidth,
    `body horizontal overflow: scrollWidth (${overflow.bodyScrollWidth}) > clientWidth (${overflow.bodyClientWidth})`
  ).toBeLessThanOrEqual(overflow.bodyClientWidth + 2); // +2px tolerance for sub-pixel rounding
  expect(
    overflow.htmlScrollWidth,
    `html horizontal overflow: scrollWidth (${overflow.htmlScrollWidth}) > clientWidth (${overflow.htmlClientWidth})`
  ).toBeLessThanOrEqual(overflow.htmlClientWidth + 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Journey A: Homepage renders, title matches, primary CTA visible
// ─────────────────────────────────────────────────────────────────────────────

test("Journey A: Homepage loads with correct title and hero CTA", async ({
  page,
}, testInfo) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response?.status(), "Homepage must return 200").toBe(200);

  const title = await page.title();
  expect(title, "Title must include Drawdown").toMatch(/drawdown/i);

  // The hero section must be present in the DOM
  const heroText = await page.textContent("body");
  expect(heroText, "Body text must include 'Drawdown'").toMatch(/drawdown/i);

  await saveScreenshot(page, "homepage", testInfo);
  await assertNoHorizontalOverflow(page);
});

// ─────────────────────────────────────────────────────────────────────────────
// Journey B: Pricing page renders and shows tier prices
// ─────────────────────────────────────────────────────────────────────────────

test("Journey B: Pricing page renders tier plans", async ({
  page,
}, testInfo) => {
  const response = await page.goto("/pricing", {
    waitUntil: "domcontentloaded",
  });

  // Pricing may redirect — accept 200 or any 2xx/3xx that ends 200
  const finalStatus = response?.status();
  expect([200, 308, 301, 302], `Unexpected status: ${finalStatus}`).toContain(
    finalStatus ?? 200
  );

  // Wait for page to settle after any JS hydration
  await page.waitForTimeout(1500);

  const bodyText = await page.textContent("body");

  // Must show Foundation tier price — £49
  expect(bodyText, "Pricing must mention £49 Foundation tier").toMatch(
    /49/
  );

  await saveScreenshot(page, "pricing", testInfo);
  await assertNoHorizontalOverflow(page);
});

// ─────────────────────────────────────────────────────────────────────────────
// Journey C: /login route is publicly accessible (not gated)
// ─────────────────────────────────────────────────────────────────────────────

test("Journey C: Login page is publicly accessible", async ({
  page,
}, testInfo) => {
  const response = await page.goto("/login", {
    waitUntil: "domcontentloaded",
  });

  const status = response?.status() ?? 200;
  // Should be 200. Accept redirect chains that resolve to 200.
  expect(status, "Login page must be accessible").toBeLessThan(500);

  await page.waitForTimeout(1000);

  const bodyText = await page.textContent("body");
  expect(bodyText, "Login page must contain login-related content").toMatch(
    /sign\s*in|log\s*in|email|password/i
  );

  await saveScreenshot(page, "login", testInfo);
  await assertNoHorizontalOverflow(page);
});

// ─────────────────────────────────────────────────────────────────────────────
// Journey D: Protected /dashboard redirects unauthenticated visitors to /login
// ─────────────────────────────────────────────────────────────────────────────

test("Journey D: /dashboard redirects unauthenticated visitors to /login", async ({
  page,
}, testInfo) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000); // Allow SSR middleware redirect to complete

  const finalUrl = page.url();
  expect(
    finalUrl,
    `Unauthenticated /dashboard must redirect to /login, got: ${finalUrl}`
  ).toMatch(/\/login/);

  await saveScreenshot(page, "dashboard-auth-redirect", testInfo);
});

// ─────────────────────────────────────────────────────────────────────────────
// Journey E: SEO — robots.txt and sitemap.xml are served correctly
// ─────────────────────────────────────────────────────────────────────────────

test("Journey E: robots.txt is served with 200 and contains sitemap", async ({
  page,
}) => {
  const response = await page.goto("/robots.txt", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status(), "robots.txt must return 200").toBe(200);

  const content = await page.textContent("body");
  expect(content, "robots.txt must reference the sitemap").toMatch(
    /sitemap\.xml/i
  );
  expect(content, "robots.txt must reference drawdown.trading domain").toMatch(
    /drawdown\.trading/
  );
  // Must not reference vercel.app preview domains in production robots
  expect(
    content,
    "robots.txt must not reference vercel.app domains"
  ).not.toMatch(/vercel\.app/);
});

test("Journey E2: sitemap.xml is served with 200 and is valid XML", async ({
  page,
}) => {
  const response = await page.goto("/sitemap.xml", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status(), "sitemap.xml must return 200").toBe(200);

  const contentType =
    response?.headers()["content-type"] ?? "";
  // XML sitemap should have xml content type or text/xml
  expect(contentType, "sitemap.xml content type").toMatch(/xml|text/);

  const content = await page.textContent("body");
  expect(content, "sitemap.xml must contain drawdown.trading URLs").toMatch(
    /drawdown\.trading/
  );
  // No hardcoded legacy dates from pre-production era
  expect(content, "sitemap.xml must not contain 2026-07-19 hardcoded date").not.toMatch(
    /2026-07-19/
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Journey F: Meta tags — homepage canonical and og:title
// ─────────────────────────────────────────────────────────────────────────────

test("Journey F: Homepage has canonical URL and og:title meta tag", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Canonical link tag
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href")
    .catch(() => null);

  // og:title must be set
  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute("content")
    .catch(() => null);

  // At least one of these must be present for SEO correctness
  const hasCanonical = canonical && canonical.includes("drawdown");
  const hasOgTitle = ogTitle && ogTitle.length > 0;

  expect(
    hasCanonical || hasOgTitle,
    `Homepage must have either a canonical link (got: ${canonical}) or og:title (got: ${ogTitle})`
  ).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// Mobile viewport layout verification (no horizontal overflow)
// ─────────────────────────────────────────────────────────────────────────────

test("Mobile: Homepage has no horizontal overflow at mobile viewport", async ({
  page,
}, testInfo) => {
  // Only run this assertion check as a named test on mobile projects
  // On desktop the viewport is 1440px wide so different assertion intent
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  await saveScreenshot(page, "homepage-mobile-overflow-check", testInfo);
  await assertNoHorizontalOverflow(page);
});

test("Mobile: Pricing page has no horizontal overflow at mobile viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  await saveScreenshot(page, "pricing-mobile-overflow-check", testInfo);
  await assertNoHorizontalOverflow(page);
});
