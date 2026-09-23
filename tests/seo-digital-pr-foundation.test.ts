/**
 * Phase 8: Linkable Assets & Digital PR Foundation Tests
 *
 * Verifies:
 * - /research/media uses getMetadata() with canonical path
 * - /press has WebPage JSON-LD, citable data benchmarks, embed code snippets,
 *   research links, editorial standards, and press contact
 * - Sitemap includes /press
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

describe("Phase 8 — Linkable Assets & Digital PR Foundation", () => {
  describe("/research/media page", () => {
    const src = read(join(MARKETING, "research/media/page.tsx"));

    it("uses getMetadata() with canonical path", () => {
      assert.ok(
        src.includes("getMetadata("),
        "/research/media/page.tsx must use getMetadata()"
      );
      assert.ok(
        src.includes('path: "/research/media"'),
        "must set path: '/research/media' in getMetadata()"
      );
    });

    it("imports JsonLd", () => {
      assert.ok(
        src.includes("JsonLd"),
        "/research/media/page.tsx must import JsonLd"
      );
    });

    it("renders <JsonLd> component in JSX (not just imported)", () => {
      assert.ok(
        src.includes("<JsonLd"),
        "/research/media/page.tsx must render <JsonLd data={...} /> in its JSX — importing alone is insufficient"
      );
    });
  });

  describe("/press page", () => {
    const src = read(join(MARKETING, "press/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(
        !src.startsWith('"use client"'),
        "must be a Server Component"
      );
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/press"'),
        "must use getMetadata with path '/press'"
      );
    });

    it("includes WebPage JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "WebPage"'),
        "must include WebPage JSON-LD"
      );
    });

    it("includes BreadcrumbList JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "BreadcrumbList"'),
        "must include BreadcrumbList JSON-LD"
      );
    });

    it("includes Organization with ContactPoint JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "Organization"') && src.includes("ContactPoint"),
        "must include Organization with ContactPoint JSON-LD for press contact"
      );
    });

    it("has citable data benchmarks section", () => {
      assert.ok(
        src.includes("DATA_BENCHMARKS") || src.includes("benchmark") || src.includes("Benchmark"),
        "must include citable data benchmarks"
      );
    });

    it("has at least 3 data benchmarks", () => {
      const benchmarkCount = (src.match(/stat:/g) ?? []).length;
      assert.ok(
        benchmarkCount >= 3,
        `must have at least 3 data benchmarks (found ${benchmarkCount})`
      );
    });

    it("has embeddable calculator section with iframe code", () => {
      assert.ok(
        src.includes("iframe"),
        "must include iframe embed code for calculators"
      );
    });

    it("has at least 2 embeddable tools", () => {
      const embedCount = (src.match(/embedPath:/g) ?? []).length;
      assert.ok(
        embedCount >= 2,
        `must have at least 2 embeddable tools (found ${embedCount})`
      );
    });

    it("links to /research (research papers section)", () => {
      assert.ok(
        src.includes('"/research"') || src.includes('href="/research"'),
        "must link to /research"
      );
    });

    it("links to /research/methodology", () => {
      assert.ok(
        src.includes("/research/methodology"),
        "must link to /research/methodology"
      );
    });

    it("links to /research/corrections", () => {
      assert.ok(
        src.includes("/research/corrections"),
        "must link to /research/corrections"
      );
    });

    it("links to /editorial-policy", () => {
      assert.ok(
        src.includes("/editorial-policy"),
        "must link to /editorial-policy"
      );
    });

    it("has a press contact email", () => {
      assert.ok(
        src.includes("press@drawdown.trading") || src.includes("mailto:press"),
        "must include press contact email"
      );
    });

    it("references research/position-sizing in citations", () => {
      assert.ok(
        src.includes("/research/position-sizing"),
        "must cite /research/position-sizing as a data source"
      );
    });

    it("has Breadcrumbs", () => {
      assert.ok(
        src.includes("Breadcrumbs"),
        "must include Breadcrumbs navigation"
      );
    });
  });

  describe("Sitemap", () => {
    const sitemap = read(SITEMAP);

    it("includes /press", () => {
      assert.ok(
        sitemap.includes("'/press'"),
        "sitemap.ts must include /press"
      );
    });

    it("/press has priority >= 0.65", () => {
      const block = sitemap.match(/url\('\/press'.*?priority:\s*([\d.]+)/s);
      const priority = block ? parseFloat(block[1]) : 0;
      assert.ok(
        priority >= 0.65,
        `/press must have priority >= 0.65 (found ${priority})`
      );
    });
  });
});
