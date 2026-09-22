/**
 * Phase 4: Risk Management Authority Cluster Tests
 *
 * Verifies the /risk-management hub page exists and contains
 * the required structural content elements.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const HUB_PAGE = join(ROOT, "src/app/(marketing)/risk-management/page.tsx");
const SITEMAP = join(ROOT, "src/app/sitemap.ts");

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("Phase 4 — Risk Management Authority Cluster", () => {
  describe("Risk Management Hub Page (/risk-management/page.tsx)", () => {
    const src = read(HUB_PAGE);

    it("is a Server Component (no 'use client')", () => {
      assert.ok(
        !src.startsWith('"use client"'),
        "/risk-management page must be a Server Component"
      );
    });

    it("uses getMetadata with correct canonical path", () => {
      assert.ok(
        src.includes('path: "/risk-management"'),
        "must call getMetadata with path '/risk-management'"
      );
    });

    it("includes WebPage JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "WebPage"'),
        "must include WebPage JSON-LD"
      );
    });

    it("includes FAQPage JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "FAQPage"'),
        "must include FAQPage JSON-LD"
      );
    });

    it("includes BreadcrumbList JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "BreadcrumbList"'),
        "must include BreadcrumbList JSON-LD"
      );
    });

    it("links to position-size calculator", () => {
      assert.ok(
        src.includes('"/calculators/position-size"'),
        "must link to /calculators/position-size"
      );
    });

    it("links to risk calculator", () => {
      assert.ok(
        src.includes('"/calculators/risk"') ||
          src.includes('href: "/calculators/risk"') ||
          src.includes("href: \"/calculators/risk\""),
        "must link to /calculators/risk"
      );
    });

    it("links to drawdown calculator", () => {
      assert.ok(
        src.includes('"/calculators/drawdown"'),
        "must link to /calculators/drawdown"
      );
    });

    it("links to drawdown-recovery calculator", () => {
      assert.ok(
        src.includes('"/calculators/drawdown-recovery"'),
        "must link to /calculators/drawdown-recovery"
      );
    });

    it("links to risk-of-ruin calculator", () => {
      assert.ok(
        src.includes('"/calculators/risk-of-ruin"'),
        "must link to /calculators/risk-of-ruin"
      );
    });

    it("links to prop-firm-daily-loss calculator", () => {
      assert.ok(
        src.includes('"/calculators/prop-firm-daily-loss"'),
        "must link to /calculators/prop-firm-daily-loss"
      );
    });

    it("links to prop-firm-maximum-loss calculator", () => {
      assert.ok(
        src.includes('"/calculators/prop-firm-maximum-loss"'),
        "must link to /calculators/prop-firm-maximum-loss"
      );
    });

    it("links to /pricing (product conversion)", () => {
      assert.ok(
        src.includes('"/pricing"'),
        "must link to /pricing for product conversion"
      );
    });

    it("covers position sizing section", () => {
      assert.ok(
        src.includes("Position Sizing"),
        "must include a Position Sizing section"
      );
    });

    it("covers drawdown control section", () => {
      assert.ok(
        src.includes("Drawdown Control") || src.includes("Drawdown"),
        "must include a Drawdown section"
      );
    });

    it("covers risk of ruin section", () => {
      assert.ok(
        src.includes("Risk of Ruin") || src.includes("Ruin"),
        "must include a Risk of Ruin section"
      );
    });

    it("covers prop firm section", () => {
      assert.ok(
        src.includes("Prop Firm"),
        "must include a Prop Firm Risk section"
      );
    });

    it("has a formula reference section", () => {
      assert.ok(
        src.includes("formula") || src.includes("Formula"),
        "must include a formulas reference section"
      );
    });

    it("has at least 4 FAQ entries", () => {
      const faqCount = (src.match(/question:/g) ?? []).length;
      assert.ok(
        faqCount >= 4,
        `must have at least 4 FAQ entries (found ${faqCount})`
      );
    });

    it("has Breadcrumbs component", () => {
      assert.ok(
        src.includes("Breadcrumbs"),
        "must include Breadcrumbs navigation"
      );
    });
  });

  describe("Sitemap includes /risk-management", () => {
    const sitemap = read(SITEMAP);

    it("has /risk-management URL entry", () => {
      assert.ok(
        sitemap.includes("'/risk-management'"),
        "sitemap.ts must include /risk-management"
      );
    });

    it("/risk-management has priority 0.85", () => {
      const match = sitemap.match(/risk-management.*?priority:\s*([\d.]+)/s);
      const priority = match ? parseFloat(match[1]) : 0;
      assert.ok(
        priority >= 0.8,
        `/risk-management must have priority >= 0.8 (found ${priority})`
      );
    });
  });

  describe("Inbound links from calculator pages", () => {
    it("position-size page links to /risk-management", () => {
      const src = read(
        join(ROOT, "src/app/(marketing)/calculators/position-size/page.tsx")
      );
      assert.ok(
        src.includes("/risk-management"),
        "position-size/page.tsx must link to /risk-management"
      );
    });
  });
});
