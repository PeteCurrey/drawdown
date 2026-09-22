# Walkthrough: Phase 2 Technical SEO Remediation

## Executive Summary

Phase 2 of the Technical SEO Remediation has been fully implemented, verified with automated tests (both existing suites and a newly added dedicated audit suite), and successfully compiled with `next build`.

All changes strictly preserve Drawdown's design aesthetic, UI components, and product functionality while eliminating critical technical debt in canonicalization, metadata generation, sitemap accuracy, and search indexing.

---

## Changes Implemented

### 1. SSR Architecture & Metadata for All 9 Calculators
Converted client-only calculators into Server Components that export standard Next.js `Metadata` with explicit, deterministic canonical URLs, Open Graph / Twitter cards, structured JSON-LD (`WebApplication` and `FAQPage`), and contextual internal linking networks:

| Route | Client Component Extracted | Status | Metadata Title |
|---|---|---|---|
| `/calculators/position-size` | `PositionSizeCalculator.tsx` | Server Component | `Position Size Calculator | Forex & Futures Lot Sizing` |
| `/calculators/drawdown` | `DrawdownCalculator.tsx` | Server Component | `Drawdown Calculator | Adverse Streak & Capital Risk Modeler` |
| `/calculators/pip-value` | `PipValueCalculator.tsx` | Server Component | `Pip Value Calculator | Real-Time Forex & CFD Lot Value` |
| `/calculators/compounding` | `CompoundingCalculator.tsx` | Server Component | `Forex Compounding Calculator | Trading Equity Growth Modeler` |
| `/calculators/prop-firm-daily-loss` | `PropFirmDailyLossCalculator.tsx` | Server Component | `Prop Firm Daily Loss Calculator | Drawdown Buffer Modeler` |
| `/calculators/prop-firm-maximum-loss` | `PropFirmMaximumLossCalculator.tsx` | Server Component | `Prop Firm Maximum Loss Calculator | Static vs Trailing Breach Buffer` |
| `/calculators/risk` | Uses existing `RiskCalculator.tsx` | Server Component | `Trading Risk Calculator | Capital Exposure & Sizing Check` |
| `/calculators/drawdown-recovery` | Uses existing `DrawdownRecoveryCalculator.tsx` | Server Component | `Drawdown Recovery Calculator & Non-Linear Loss Math` |
| `/calculators/risk-of-ruin` | Uses existing `RiskOfRuinSimulator.tsx` | Server Component | `Risk of Ruin Simulator & Drawdown Probability` |
| `/calculators` (Hub) | Hub Page | Server Component | `Trading Calculator Hub | Risk & Drawdown Modelers` |

### 2. Tools Dynamic Routes Converted to SSG (`/tools/[slug]`)
- Converted `src/app/(marketing)/tools/[slug]/page.tsx` from `"use client"` to a Server Component.
- Implemented `generateStaticParams()` dynamically returning all tools from `@/data/tools`.
- Implemented `generateMetadata()` with title, description, and canonical URL (`https://drawdown.trading/tools/${tool.slug}`).
- Added `SoftwareApplication` JSON-LD schema for all individual tools.

### 3. Canonical Normalization & Regional Hreflang Fixes
- `src/lib/metadata.ts`:
  - Enforced strict canonical URL formatting without trailing slashes.
  - Restricted hreflang emissions to only paths that actually exist with regional alternatives (`""` and `"/pricing"`).
  - Ensured `alternates.languages` is omitted (`undefined`) for non-regional paths (e.g. `/calculators/*`, `/courses/*`) rather than producing empty objects or broken 404 links.

### 4. Dynamic Broker & Prop Firm SEO Upgrades
- `src/app/(marketing)/prop-firms/[slug]/page.tsx`: Upgraded `generateMetadata()` with deterministic canonical paths (`/prop-firms/${slug}`).
- `src/app/(marketing)/brokers/[broker]/page.tsx`:
  - Upgraded `generateStaticParams()` to return actual broker slugs from `brokers` data instead of empty `[]`.
  - Canonicalized broker URLs deterministically to `/brokers/${canonicalSlug}`.

### 5. Content-Driven Sitemap Overhaul (`src/app/sitemap.ts`)
- Replaced static/hardcoded course lists with all dynamic course phases from `src/data/courses.ts`.
- Added dynamic tool routes from `src/data/tools.ts`.
- Added dynamic prop-firm reviews from `src/data/seo/prop-firms.ts`.
- Added dynamic broker reviews from `src/data/brokers.ts`.
- Added dynamic Lobby articles from Supabase `lobby_articles` where `status = 'PUBLISHED'`.
- Removed redirecting route `/brokers` (301s to `/brokers/all`).
- Removed `noindex` route `/brokers/best-for-gold`.
- Replaced indiscriminate `new Date()` with stable baseline dates and real content modification timestamps.

### 6. Research Subpages Canonicalized
- Updated `/research`, `/research/risk`, `/research/broker-testing`, `/research/datasets`, `/research/methodology`, `/research/prop-firms`, `/research/trading-costs`, and `/research/corrections` to use `getMetadata()` with proper canonicals.

---

## Verification & Test Results

### 1. Technical SEO Audit (`tests/seo-technical-audit.test.ts`)
```
✔ SEO: sitemap.ts exports a valid sitemap function
✔ SEO: robots.ts exports valid robots configuration
✔ SEO: public/robots.txt static file was removed in favor of app/robots.ts
✔ SEO: Key marketing pages export proper canonical URLs and metadata
✔ SEO: Thin pSEO city pages are marked noindex
✔ SEO: No fabricated AggregateRating schema in marketing components
Result: 6 passed, 0 failed
```

### 2. Phase 2 Dedicated Verification Suite (`tests/seo-phase2-remediation.test.ts`)
```
✔ SEO Phase 2: All 9 calculator page.tsx files are Server Components without "use client"
✔ SEO Phase 2: Homepage metadata is concise and communicates brand proposition
✔ SEO Phase 2: Tools [slug] is a Server Component with generateMetadata and generateStaticParams
✔ SEO Phase 2: Prop Firm and Broker review pages have deterministic canonicals in metadata
✔ SEO Phase 2: sitemap includes all 9 calculators, courses, tools, prop-firms and excludes redirects/noindex
✔ SEO Phase 2: hreflang in getMetadata strictly guards against 404 regional pages
Result: 6 passed, 0 failed
```

### 3. Unit Test Suite (`npm run test:unit`)
```
Result: 106 passed, 0 failed across 22 test suites
```

### 4. Production Build (`npm run build`)
```
▲ Next.js 16.2.9 (Turbopack)
✓ Compiled successfully in 41s
✓ Finished TypeScript in 57s
✓ Collecting page data using 1 worker in 5.8s
● /tools/[slug] (SSG) prerendered as static HTML
● /prop-firms/[slug] (SSG) prerendered as static HTML
○ /sitemap.xml (Static)
○ /robots.txt (Static)
Result: Build completed with code 0
```
