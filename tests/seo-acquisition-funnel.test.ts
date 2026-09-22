/**
 * Phase 9: Organic Acquisition & Paying Traffic Funnel Tests
 *
 * Verifies:
 * - /pricing uses getMetadata() with hasRegionalVariants
 * - /funded-pathway uses getMetadata()
 * - /for/prop-firm-traders has WebPage + FAQPage JSON-LD and correct content
 * - /for/day-traders has WebPage + FAQPage JSON-LD and correct content
 * - Sitemap includes both /for/ pages
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

describe("Phase 9 — Organic Acquisition & Paying Traffic Funnel", () => {
  describe("/pricing page", () => {
    const src = read(join(MARKETING, "pricing/page.tsx"));

    it("uses getMetadata()", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/pricing/page.tsx must use getMetadata()"
      );
    });

    it("has hasRegionalVariants: true (hreflang for UK/global)", () => {
      assert.ok(
        src.includes("hasRegionalVariants: true"),
        "/pricing must use hasRegionalVariants: true"
      );
    });

    it("does not use hardcoded alternates canonical", () => {
      assert.ok(
        !src.includes("alternates: { canonical:"),
        "/pricing must not use hardcoded alternates canonical"
      );
    });
  });

  describe("/funded-pathway page", () => {
    const src = read(join(MARKETING, "funded-pathway/page.tsx"));

    it("uses getMetadata()", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/funded-pathway/page.tsx must use getMetadata()"
      );
    });

    it("does not use hardcoded alternates canonical", () => {
      assert.ok(
        !src.includes("alternates: { canonical:"),
        "/funded-pathway must not use hardcoded alternates canonical"
      );
    });

    it("imports JsonLd", () => {
      assert.ok(
        src.includes("JsonLd"),
        "/funded-pathway must import JsonLd for schema markup"
      );
    });
  });

  describe("/for/prop-firm-traders page", () => {
    const src = read(join(MARKETING, "for/prop-firm-traders/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(!src.startsWith('"use client"'), "must be a Server Component");
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/for/prop-firm-traders"'),
        "must use getMetadata with path '/for/prop-firm-traders'"
      );
    });

    it("includes WebPage JSON-LD", () => {
      assert.ok(src.includes('"@type": "WebPage"'), "must include WebPage JSON-LD");
    });

    it("includes FAQPage JSON-LD", () => {
      assert.ok(src.includes('"@type": "FAQPage"'), "must include FAQPage JSON-LD");
    });

    it("links to /pricing (primary conversion)", () => {
      assert.ok(src.includes('"/pricing"'), "must link to /pricing");
    });

    it("links to /calculators/prop-firm-daily-loss", () => {
      assert.ok(
        src.includes("/calculators/prop-firm-daily-loss"),
        "must link to prop-firm-daily-loss calculator"
      );
    });

    it("links to /calculators/position-size", () => {
      assert.ok(
        src.includes("/calculators/position-size"),
        "must link to position-size calculator"
      );
    });

    it("links to /prop-firms/compare", () => {
      assert.ok(src.includes("/prop-firms/compare"), "must link to prop-firms/compare");
    });

    it("links to /prop-firms/how-to-pass", () => {
      assert.ok(src.includes("/prop-firms/how-to-pass"), "must link to how-to-pass guide");
    });

    it("links to /research/position-sizing", () => {
      assert.ok(
        src.includes("/research/position-sizing"),
        "must link to position-sizing research"
      );
    });

    it("has at least 3 FAQ entries", () => {
      const count = (src.match(/question:/g) ?? []).length;
      assert.ok(count >= 3, `must have at least 3 FAQs (found ${count})`);
    });
  });

  describe("/for/day-traders page", () => {
    const src = read(join(MARKETING, "for/day-traders/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(!src.startsWith('"use client"'), "must be a Server Component");
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/for/day-traders"'),
        "must use getMetadata with path '/for/day-traders'"
      );
    });

    it("includes WebPage JSON-LD", () => {
      assert.ok(src.includes('"@type": "WebPage"'), "must include WebPage JSON-LD");
    });

    it("includes FAQPage JSON-LD", () => {
      assert.ok(src.includes('"@type": "FAQPage"'), "must include FAQPage JSON-LD");
    });

    it("links to /pricing (primary conversion)", () => {
      assert.ok(src.includes('"/pricing"'), "must link to /pricing");
    });

    it("links to /calculators/pip-value", () => {
      assert.ok(src.includes("/calculators/pip-value"), "must link to pip-value calculator");
    });

    it("links to /calculators/position-size", () => {
      assert.ok(
        src.includes("/calculators/position-size"),
        "must link to position-size calculator"
      );
    });

    it("links to /calculators/drawdown-recovery", () => {
      assert.ok(
        src.includes("/calculators/drawdown-recovery"),
        "must link to drawdown-recovery calculator"
      );
    });

    it("links to /research/position-sizing", () => {
      assert.ok(
        src.includes("/research/position-sizing"),
        "must link to position-sizing research"
      );
    });

    it("links to /risk-management", () => {
      assert.ok(src.includes("/risk-management"), "must link to /risk-management");
    });

    it("has at least 3 FAQ entries", () => {
      const count = (src.match(/question:/g) ?? []).length;
      assert.ok(count >= 3, `must have at least 3 FAQs (found ${count})`);
    });
  });

  describe("Sitemap", () => {
    const sitemap = read(SITEMAP);

    it("includes /for/prop-firm-traders", () => {
      assert.ok(
        sitemap.includes("'/for/prop-firm-traders'"),
        "sitemap must include /for/prop-firm-traders"
      );
    });

    it("includes /for/day-traders", () => {
      assert.ok(
        sitemap.includes("'/for/day-traders'"),
        "sitemap must include /for/day-traders"
      );
    });

    it("/for/prop-firm-traders has priority >= 0.75", () => {
      const block = sitemap.match(/for\/prop-firm-traders.*?priority:\s*([\d.]+)/s);
      const p = block ? parseFloat(block[1]) : 0;
      assert.ok(p >= 0.75, `/for/prop-firm-traders must have priority >= 0.75 (found ${p})`);
    });

    it("/for/day-traders has priority >= 0.75", () => {
      const block = sitemap.match(/for\/day-traders.*?priority:\s*([\d.]+)/s);
      const p = block ? parseFloat(block[1]) : 0;
      assert.ok(p >= 0.75, `/for/day-traders must have priority >= 0.75 (found ${p})`);
    });
  });
});
