/**
 * Phase 3: Calculator Search Acquisition Tests
 *
 * Verifies that all 9 enhanced calculator pages contain the required
 * structural content elements for search acquisition:
 * - "Who This Calculator Is For" section (personas)
 * - Variable Definitions table
 * - Worked Example
 * - Common Pitfalls section
 * - CalculatorNextStep import and usage (conversion CTA)
 * - Correct metadata (title, description, canonical path)
 * - FAQPage JSON-LD
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const CALC_DIR = join(ROOT, "src/app/(marketing)/calculators");

function readCalc(slug: string): string {
  return readFileSync(join(CALC_DIR, slug, "page.tsx"), "utf-8");
}

const CALCULATOR_SLUGS = [
  "position-size",
  "risk",
  "drawdown",
  "drawdown-recovery",
  "pip-value",
  "compounding",
  "risk-of-ruin",
  "prop-firm-daily-loss",
  "prop-firm-maximum-loss",
] as const;

describe("Phase 3 — Calculator Search Acquisition", () => {
  describe("CalculatorNextStep component exists and is correctly structured", () => {
    it("exports a CalculatorNextStep named function component", () => {
      const src = readFileSync(
        join(ROOT, "src/components/calculators/CalculatorNextStep.tsx"),
        "utf-8"
      );
      assert.ok(
        src.includes("export function CalculatorNextStep"),
        "CalculatorNextStep.tsx must export named function CalculatorNextStep"
      );
    });

    it("accepts heading, body, cta, and href props", () => {
      const src = readFileSync(
        join(ROOT, "src/components/calculators/CalculatorNextStep.tsx"),
        "utf-8"
      );
      assert.ok(src.includes("heading:"), "must have heading prop");
      assert.ok(src.includes("body:"), "must have body prop");
      assert.ok(src.includes("cta:"), "must have cta prop");
      assert.ok(src.includes("href:"), "must have href prop");
    });

    it("is a client component", () => {
      const src = readFileSync(
        join(ROOT, "src/components/calculators/CalculatorNextStep.tsx"),
        "utf-8"
      );
      assert.ok(
        src.startsWith('"use client"'),
        "CalculatorNextStep must be a client component"
      );
    });
  });

  for (const slug of CALCULATOR_SLUGS) {
    describe(`/calculators/${slug}`, () => {
      const src = readCalc(slug);

      it("imports CalculatorNextStep", () => {
        assert.ok(
          src.includes("CalculatorNextStep"),
          `${slug}/page.tsx must import and use CalculatorNextStep`
        );
      });

      it("has a Who This Calculator Is For section", () => {
        const hasWho =
          src.includes("Who This Calculator Is For") ||
          src.includes("Who This Simulator Is For");
        assert.ok(
          hasWho,
          `${slug}/page.tsx must contain a 'Who This Calculator Is For' section`
        );
      });

      it("has a variable definitions table", () => {
        // Either Table2 icon (used as header) or the words "Variable Definitions"
        const hasTable =
          src.includes("Table2") ||
          src.includes("Variable Definitions") ||
          src.includes("Input Variable Definitions");
        assert.ok(
          hasTable,
          `${slug}/page.tsx must contain a variable definitions table`
        );
      });

      it("has a worked example", () => {
        const hasExample =
          src.includes("Worked Example") || src.includes("worked example");
        assert.ok(
          hasExample,
          `${slug}/page.tsx must contain a worked example section`
        );
      });

      it("has common pitfalls or verification checklist", () => {
        const hasPitfalls =
          src.includes("Pitfall") ||
          src.includes("pitfall") ||
          src.includes("Checklist") ||
          src.includes("checklist");
        assert.ok(
          hasPitfalls,
          `${slug}/page.tsx must contain a pitfalls or checklist section`
        );
      });

      it("uses getMetadata with correct path", () => {
        assert.ok(
          src.includes(`path: "/calculators/${slug}"`),
          `${slug}/page.tsx must call getMetadata with path "/calculators/${slug}"`
        );
      });

      it("includes FAQPage JSON-LD", () => {
        assert.ok(
          src.includes('"@type": "FAQPage"'),
          `${slug}/page.tsx must include FAQPage JSON-LD`
        );
      });

      it("includes WebApplication JSON-LD", () => {
        assert.ok(
          src.includes('"@type": "WebApplication"'),
          `${slug}/page.tsx must include WebApplication JSON-LD`
        );
      });

      it("has at least 2 FAQ entries", () => {
        const faqCount = (src.match(/question:/g) ?? []).length;
        assert.ok(
          faqCount >= 2,
          `${slug}/page.tsx must have at least 2 FAQ entries (found ${faqCount})`
        );
      });

      it("has breadcrumbs linking to /calculators", () => {
        assert.ok(
          src.includes('href: "/calculators"'),
          `${slug}/page.tsx must have breadcrumb link to /calculators`
        );
      });

      it("links to at least 2 other internal calculator pages", () => {
        const internalCalcLinks = (
          src.match(/href="\/calculators\//g) ?? []
        ).length;
        assert.ok(
          internalCalcLinks >= 2,
          `${slug}/page.tsx must link to at least 2 other /calculators/* pages (found ${internalCalcLinks})`
        );
      });
    });
  }
});
