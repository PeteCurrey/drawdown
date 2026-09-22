/**
 * Phase 7: Research & Original Data Authority Tests
 *
 * Verifies:
 * - /research hub has CollectionPage JSON-LD
 * - /research/position-sizing has Article + FAQPage JSON-LD and required content
 * - Sitemap includes /research/position-sizing at correct priority
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

describe("Phase 7 — Research & Original Data Authority", () => {
  describe("/research hub page", () => {
    const src = read(join(MARKETING, "research/page.tsx"));

    it("imports JsonLd", () => {
      assert.ok(
        src.includes("JsonLd"),
        "/research/page.tsx must import and use JsonLd"
      );
    });

    it("includes CollectionPage JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "CollectionPage"'),
        "/research/page.tsx must include CollectionPage JSON-LD"
      );
    });

    it("includes BreadcrumbList JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "BreadcrumbList"'),
        "/research/page.tsx must include BreadcrumbList JSON-LD"
      );
    });

    it("uses getMetadata with /research path", () => {
      assert.ok(
        src.includes('path: "/research"'),
        "must use getMetadata with path '/research'"
      );
    });
  });

  describe("/research/position-sizing page", () => {
    const src = read(join(MARKETING, "research/position-sizing/page.tsx"));

    it("is a Server Component", () => {
      assert.ok(
        !src.startsWith('"use client"'),
        "must be a Server Component"
      );
    });

    it("uses getMetadata with correct path", () => {
      assert.ok(
        src.includes('path: "/research/position-sizing"'),
        "must use getMetadata with path '/research/position-sizing'"
      );
    });

    it("includes Article JSON-LD", () => {
      assert.ok(
        src.includes('"@type": "Article"'),
        "must include Article JSON-LD"
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

    it("references datePublished", () => {
      assert.ok(
        src.includes("datePublished"),
        "Article JSON-LD must include datePublished"
      );
    });

    it("references dateModified", () => {
      assert.ok(
        src.includes("dateModified"),
        "Article JSON-LD must include dateModified"
      );
    });

    it("has a simulation results data table", () => {
      assert.ok(
        src.includes("Median Balance") || src.includes("medianBalance") || src.includes("median"),
        "must include simulation results data"
      );
    });

    it("has key findings section", () => {
      assert.ok(
        src.includes("Finding") || src.includes("finding") || src.includes("FINDINGS"),
        "must include key findings"
      );
    });

    it("links to /calculators/position-size", () => {
      assert.ok(
        src.includes("/calculators/position-size"),
        "must link to position-size calculator"
      );
    });

    it("links to /calculators/risk-of-ruin", () => {
      assert.ok(
        src.includes("/calculators/risk-of-ruin"),
        "must link to risk-of-ruin calculator"
      );
    });

    it("links back to /research hub", () => {
      assert.ok(
        src.includes('href: "/research"') || src.includes('href="/research"'),
        "must link back to /research"
      );
    });

    it("links to /risk-management", () => {
      assert.ok(
        src.includes("/risk-management"),
        "must link to /risk-management"
      );
    });

    it("links to /research/methodology", () => {
      assert.ok(
        src.includes("/research/methodology"),
        "must link to /research/methodology"
      );
    });

    it("links to /research/datasets", () => {
      assert.ok(
        src.includes("/research/datasets"),
        "must link to /research/datasets"
      );
    });

    it("has at least 3 FAQ entries", () => {
      const faqCount = (src.match(/question:/g) ?? []).length;
      assert.ok(
        faqCount >= 3,
        `must have at least 3 FAQ entries (found ${faqCount})`
      );
    });

    it("has Breadcrumbs with /research", () => {
      assert.ok(
        src.includes('href: "/research"'),
        "must include breadcrumb to /research"
      );
    });
  });

  describe("Sitemap", () => {
    const sitemap = read(SITEMAP);

    it("includes /research/position-sizing", () => {
      assert.ok(
        sitemap.includes("'/research/position-sizing'"),
        "sitemap.ts must include /research/position-sizing"
      );
    });

    it("/research/position-sizing has priority >= 0.65", () => {
      const block = sitemap.match(/research\/position-sizing.*?priority:\s*([\d.]+)/s);
      const priority = block ? parseFloat(block[1]) : 0;
      assert.ok(
        priority >= 0.65,
        `/research/position-sizing must have priority >= 0.65 (found ${priority})`
      );
    });

    it("/research hub has priority >= 0.8", () => {
      const block = sitemap.match(/url\('\/research',.*?priority:\s*([\d.]+)/s);
      const priority = block ? parseFloat(block[1]) : 0;
      assert.ok(
        priority >= 0.8,
        `/research must have priority >= 0.8 (found ${priority})`
      );
    });
  });
});
