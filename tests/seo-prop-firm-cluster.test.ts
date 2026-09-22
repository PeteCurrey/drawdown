/**
 * Phase 5: Prop Firm Search & Commercial Cluster Tests
 *
 * Verifies:
 * - /prop-firms hub uses getMetadata() and has ItemList JSON-LD
 * - /prop-firms/compare uses getMetadata()
 * - /prop-firms/how-to-pass exists with HowTo + FAQPage JSON-LD
 * - Sitemap includes /prop-firms/how-to-pass
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const MARKETING = join(ROOT, "src/app/(marketing)");
const SITEMAP = join(ROOT, "src/app/sitemap.ts");

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("Phase 5 — Prop Firm Search & Commercial Cluster", () => {
  describe("/prop-firms hub page", () => {
    const src = read(join(MARKETING, "prop-firms/page.tsx"));

    it("uses getMetadata() (not raw alternates canonical)", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/prop-firms/page.tsx must use getMetadata()"
      );
      assert.ok(
        !src.includes("alternates: { canonical:"),
        "/prop-firms/page.tsx must not use hardcoded alternates canonical"
      );
    });

    it("imports PROP_FIRM_REVIEWS", () => {
      assert.ok(
        src.includes("PROP_FIRM_REVIEWS"),
        "/prop-firms/page.tsx must import PROP_FIRM_REVIEWS for ItemList schema"
      );
    });

    it("includes ItemList JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "ItemList"'),
        "/prop-firms/page.tsx must include ItemList JSON-LD"
      );
    });

    it("includes JsonLd component", () => {
      assert.ok(
        src.includes("JsonLd"),
        "/prop-firms/page.tsx must include JsonLd component"
      );
    });
  });

  describe("/prop-firms/compare page", () => {
    const src = read(join(MARKETING, "prop-firms/compare/page.tsx"));

    it("uses getMetadata() (not raw alternates canonical)", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/prop-firms/compare/page.tsx must use getMetadata()"
      );
      assert.ok(
        !src.includes("alternates: { canonical:"),
        "/prop-firms/compare/page.tsx must not use hardcoded alternates canonical"
      );
    });

    it("has canonical path /prop-firms/compare", () => {
      assert.ok(
        src.includes('path: "/prop-firms/compare"'),
        "must set path: '/prop-firms/compare' in getMetadata()"
      );
    });
  });

  describe("/prop-firms/how-to-pass page", () => {
    const src = read(join(MARKETING, "prop-firms/how-to-pass/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(
        !src.startsWith('"use client"'),
        "must be a Server Component"
      );
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/prop-firms/how-to-pass"'),
        "must use getMetadata with path '/prop-firms/how-to-pass'"
      );
    });

    it("includes HowTo JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "HowTo"'),
        "must include HowTo JSON-LD"
      );
    });

    it("includes FAQPage JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "FAQPage"'),
        "must include FAQPage JSON-LD"
      );
    });

    it("links to prop-firm-daily-loss calculator", () => {
      assert.ok(
        src.includes("/calculators/prop-firm-daily-loss"),
        "must link to prop-firm-daily-loss calculator"
      );
    });

    it("links to prop-firm-maximum-loss calculator", () => {
      assert.ok(
        src.includes("/calculators/prop-firm-maximum-loss"),
        "must link to prop-firm-maximum-loss calculator"
      );
    });

    it("links to position-size calculator", () => {
      assert.ok(
        src.includes("/calculators/position-size"),
        "must link to position-size calculator"
      );
    });

    it("links to risk-of-ruin calculator", () => {
      assert.ok(
        src.includes("/calculators/risk-of-ruin"),
        "must link to risk-of-ruin calculator"
      );
    });

    it("links to /prop-firms hub", () => {
      assert.ok(
        src.includes('"/prop-firms"') || src.includes("href: \"/prop-firms\""),
        "must link back to /prop-firms"
      );
    });

    it("links to /pricing (product conversion)", () => {
      assert.ok(
        src.includes('"/pricing"'),
        "must link to /pricing for product conversion"
      );
    });

    it("links to /risk-management hub", () => {
      assert.ok(
        src.includes("/risk-management"),
        "must link to /risk-management"
      );
    });

    it("has at least 4 FAQ entries", () => {
      const faqCount = (src.match(/question:/g) ?? []).length;
      assert.ok(
        faqCount >= 4,
        `must have at least 4 FAQ entries (found ${faqCount})`
      );
    });

    it("has at least 4 failure mode entries", () => {
      // COMMON_FAILURES array
      const failureCount = (src.match(/failure:/g) ?? []).length;
      assert.ok(
        failureCount >= 4,
        `must have at least 4 failure modes (found ${failureCount})`
      );
    });

    it("has Breadcrumbs with /prop-firms", () => {
      assert.ok(
        src.includes('href: "/prop-firms"'),
        "must include breadcrumb to /prop-firms"
      );
    });
  });

  describe("Sitemap", () => {
    const sitemap = read(SITEMAP);

    it("includes /prop-firms/how-to-pass", () => {
      assert.ok(
        sitemap.includes("'/prop-firms/how-to-pass'"),
        "sitemap.ts must include /prop-firms/how-to-pass"
      );
    });

    it("/prop-firms/how-to-pass has priority >= 0.75", () => {
      const block = sitemap.match(/prop-firms\/how-to-pass.*?priority:\s*([\d.]+)/s);
      const priority = block ? parseFloat(block[1]) : 0;
      assert.ok(
        priority >= 0.75,
        `/prop-firms/how-to-pass must have priority >= 0.75 (found ${priority})`
      );
    });
  });
});
