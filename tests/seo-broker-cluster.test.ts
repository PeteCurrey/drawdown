/**
 * Phase 6: Broker & Trading Platform Commercial SEO Tests
 *
 * Verifies:
 * - /brokers hub uses getMetadata() and has ItemList JSON-LD
 * - /brokers/how-to-choose has HowTo + FAQPage JSON-LD and correct structure
 * - Sitemap includes /brokers/how-to-choose
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

describe("Phase 6 — Broker & Trading Platform Commercial SEO", () => {
  describe("/brokers hub page", () => {
    const src = read(join(MARKETING, "brokers/page.tsx"));

    it("uses getMetadata() (not raw alternates canonical)", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/brokers/page.tsx must use getMetadata()"
      );
      assert.ok(
        !src.includes("alternates: { canonical:"),
        "/brokers/page.tsx must not use hardcoded alternates canonical"
      );
    });

    it("has canonical path /brokers", () => {
      assert.ok(
        src.includes("path: '/brokers'"),
        "must set path: '/brokers' in getMetadata()"
      );
    });

    it("includes ItemList JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "ItemList"'),
        "/brokers/page.tsx must include ItemList JSON-LD"
      );
    });

    it("imports brokers data for ItemList", () => {
      assert.ok(
        src.includes("brokers"),
        "/brokers/page.tsx must import brokers data"
      );
    });

    it("includes JsonLd component", () => {
      assert.ok(
        src.includes("JsonLd"),
        "/brokers/page.tsx must include JsonLd component"
      );
    });
  });

  describe("/brokers/how-to-choose page", () => {
    const src = read(join(MARKETING, "brokers/how-to-choose/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(
        !src.startsWith('"use client"'),
        "must be a Server Component"
      );
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/brokers/how-to-choose"'),
        "must use getMetadata with path '/brokers/how-to-choose'"
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

    it("covers regulation as a criterion", () => {
      const hasReg =
        src.includes("Regulation") ||
        src.includes("regulation") ||
        src.includes("FCA") ||
        src.includes("ASIC");
      assert.ok(hasReg, "must cover broker regulation");
    });

    it("covers trading costs as a criterion", () => {
      const hasCost =
        src.includes("Trading Cost") ||
        src.includes("trading cost") ||
        src.includes("Spreads") ||
        src.includes("spread");
      assert.ok(hasCost, "must cover trading costs");
    });

    it("has at least 4 red flag entries", () => {
      const flagCount = (src.match(/flag:/g) ?? []).length;
      assert.ok(
        flagCount >= 4,
        `must have at least 4 red flag entries (found ${flagCount})`
      );
    });

    it("has at least 4 FAQ entries", () => {
      const faqCount = (src.match(/question:/g) ?? []).length;
      assert.ok(
        faqCount >= 4,
        `must have at least 4 FAQ entries (found ${faqCount})`
      );
    });

    it("links to pip-value calculator", () => {
      assert.ok(
        src.includes("/calculators/pip-value"),
        "must link to pip-value calculator"
      );
    });

    it("links to position-size calculator", () => {
      assert.ok(
        src.includes("/calculators/position-size"),
        "must link to position-size calculator"
      );
    });

    it("links to /brokers hub", () => {
      assert.ok(
        src.includes('"/brokers"') ||
          src.includes('href: "/brokers"') ||
          src.includes("/brokers/all"),
        "must link back to /brokers or /brokers/all"
      );
    });

    it("links to /pricing (product conversion)", () => {
      assert.ok(
        src.includes('"/pricing"'),
        "must link to /pricing for product conversion"
      );
    });

    it("links to /risk-management", () => {
      assert.ok(
        src.includes("/risk-management"),
        "must link to /risk-management hub"
      );
    });

    it("has Breadcrumbs linking to /brokers", () => {
      assert.ok(
        src.includes('href: "/brokers"'),
        "must include breadcrumb to /brokers"
      );
    });
  });

  describe("Sitemap", () => {
    const sitemap = read(SITEMAP);

    it("includes /brokers/how-to-choose", () => {
      assert.ok(
        sitemap.includes("'/brokers/how-to-choose'"),
        "sitemap.ts must include /brokers/how-to-choose"
      );
    });

    it("/brokers/how-to-choose has priority >= 0.75", () => {
      const block = sitemap.match(/brokers\/how-to-choose.*?priority:\s*([\d.]+)/s);
      const priority = block ? parseFloat(block[1]) : 0;
      assert.ok(
        priority >= 0.75,
        `/brokers/how-to-choose must have priority >= 0.75 (found ${priority})`
      );
    });
  });
});
