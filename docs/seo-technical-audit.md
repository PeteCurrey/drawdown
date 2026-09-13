# DRAWDOWN.TRADING — TECHNICAL SEO AUDIT & REMEDIATION REPORT
## Phase 16: Technical SEO Health, Crawlability, Canonicality & Indexation Integrity
**Date**: September 2026  
**Auditor**: Senior Technical SEO Engineer & Next.js Systems Architect  
**Status**: COMPLETE & VERIFIED  

---

## Executive Summary

This audit and remediation pass resolves longstanding technical SEO issues across Drawdown Trading, including:
1. **Google Search Console Indexation Traps**: Identified and neutralized the source of ~1,063 "Crawled — currently not indexed" URLs arising from thin programmatic SEO (pSEO) combinations (`[topic]/[city]` & `[topic]/[location]` combinations without unique local content).
2. **Dynamic Sitemap Architecture**: Eliminated the static, stale `sitemap-fetched.xml` containing hardcoded `2026-07-19` timestamps. Replaced with Next.js 16 programmatic `src/app/sitemap.ts` that dynamically generates live ISO timestamps and prioritizes high-value indexable pages.
3. **Robots Exclusion Standard**: Replaced legacy `public/robots.txt` (which incorrectly pointed the sitemap to `drawdown-alpha.vercel.app`) with dynamic `src/app/robots.ts` serving canonical `https://drawdown.trading/sitemap.xml` and explicitly disallowing authenticated, admin, partner, and checkout routes.
4. **Canonical & Metadata Integrity**: Injected explicit canonical tags and Open Graph / Twitter metadata across all core marketing pages (`/`, `/tools`, `/brokers`, `/pricing`, `/signal-centre`).
5. **Schema & Structured Data Truth**: Verified complete absence of fabricated `AggregateRating` schemas across all marketing templates and verified that all Review schemas use genuine editorial attribution.
6. **Marketing Copy Compliance**: Resolved remaining deferred claims from Prompt 14 (removed unverified "same feeds as professional trading desks" and "8 institutional sources").

---

## 1. Route Inventory & Indexation Classification

Every route in the Next.js App Router application is classified under an explicit indexation strategy:

| Route Path | Category | Directives | Canonical Target |
|---|---|---|---|
| `/` | Core Marketing | `index, follow` | `https://drawdown.trading` |
| `/pricing` | Commercial Landing | `index, follow` | `https://drawdown.trading/pricing` |
| `/platform` | Product Landing | `index, follow` | `https://drawdown.trading/platform` |
| `/signal-centre` | Feature Hub | `index, follow` | `https://drawdown.trading/signal-centre` |
| `/about` | E-E-A-T Profile | `index, follow` | `https://drawdown.trading/about` |
| `/how-it-works` | Conversion Page | `index, follow` | `https://drawdown.trading/how-it-works` |
| `/funded-pathway` | Solution Hub | `index, follow` | `https://drawdown.trading/funded-pathway` |
| `/roadmap` | Trust Page | `index, follow` | `https://drawdown.trading/roadmap` |
| `/tools` | Product Hub | `index, follow` | `https://drawdown.trading/tools` |
| `/tools/*` (individual tools) | Product Features | `index, follow` | `https://drawdown.trading/tools/*` |
| `/calculators/*` | Utility Tools | `index, follow` | `https://drawdown.trading/calculators/*` |
| `/courses` | Curriculum Catalog | `index, follow` | `https://drawdown.trading/courses` |
| `/courses/[slug]` | Course Detail | `index, follow` | `https://drawdown.trading/courses/[slug]` |
| `/brokers` | Review Comparison Hub | `index, follow` | `https://drawdown.trading/brokers` |
| `/brokers/[broker]` | Editorial Review | `index, follow` | `https://drawdown.trading/brokers/[broker]` |
| `/prop-firms` | Industry Hub | `index, follow` | `https://drawdown.trading/prop-firms` |
| `/research/*` | Authority Content | `index, follow` | `https://drawdown.trading/research/*` |
| `/blog/*` | Editorial Articles | `index, follow` | `https://drawdown.trading/blog/*` |
| `/learn-to-trade/[topic]` | Educational Category | `index, follow` | `https://drawdown.trading/learn-to-trade/[topic]` |
| `/[region]/learn-to-trade/[topic]/[city]` | Legacy pSEO | `noindex, follow` | Self-canonical / de-indexed |
| `/learn-to-trade/[topic]/[location]` | Legacy pSEO | `noindex, follow` | Self-canonical / de-indexed |
| `/dashboard/*` | Authenticated App | `Disallowed in robots.txt` | N/A |
| `/admin/*` | Internal Administration | `Disallowed in robots.txt` | N/A |
| `/partner/*` | Affiliate Portal | `Disallowed in robots.txt` | N/A |
| `/api/*` | API Endpoints | `Disallowed in robots.txt` | N/A |
| `/store/*/success` | Thank-you Pages | `Disallowed in robots.txt` | N/A |
| `/login`, `/signup`, `/forgot-password` | Auth Gateways | `Disallowed in robots.txt` | N/A |

---

## 2. Remediation of the ~1,063 "Crawled — Currently Not Indexed" URLs

### Root Cause Analysis
During previous platform experiments, a programmatic SEO (pSEO) engine generated hundreds of combinatorial URLs:
- `~283 topics × 50+ locations/cities across AU, UK, US, HK, SG`
- These routes substituted tokens like `$Location` and `$Topic` into boilerplate copy.
- Googlebot crawled these permutations, found near-duplicate or empty placeholder content without real regional differentiation, and rightly classified them as **"Crawled — currently not indexed"**.
- This diluted domain crawl budget and reduced authority for primary commercial and educational pages.

### Applied Remediation
1. **Direct Noindex Injection**: All templated city-level routes (`/[region]/learn-to-trade/[topic]/[city]` and `/learn-to-trade/[topic]/[location]`) now strictly export `robots: { index: false, follow: true }`. Crawlers discover and follow internal contextual links to core courses without indexing low-value doorway combinations.
2. **Sitemap Exclusion**: Programmatic topic-city permutations are strictly excluded from `src/app/sitemap.ts`. The sitemap now serves only the primary curriculum, core tool pages, calculators, authoritative reviews, and research whitepapers.
3. **Cleaned Stale Datasets**: AU city routes that previously omitted noindex now enforce it alongside explicit canonical paths.

---

## 3. Sitemap & Robots Configuration

### `src/app/sitemap.ts`
- Implemented as a dynamic Next.js 16 Route Handler returning `MetadataRoute.Sitemap`.
- Replaced hardcoded `2026-07-19` timestamps with live timestamps (`new Date()`).
- Categorized URLs into Core Marketing (1.0–0.9), Tools & Calculators (0.85–0.7), Curriculum (0.85–0.75), Reviews & Comparisons (0.75–0.65), and Legal/Policy (0.3).
- Excluded all thin doorway pages, test endpoints, checkout callbacks, and authenticated dashboard surfaces.

### `src/app/robots.ts`
- Deleted conflicting legacy file `public/robots.txt`.
- Generated dynamic robots rules with:
  ```ts
  disallow: [
    '/dashboard/', '/dashboard',
    '/profile/', '/profile',
    '/admin/', '/admin',
    '/partner/', '/partner',
    '/api/', '/api',
    '/checkout/', '/checkout',
    '/unsubscribe',
    '/newsletter/', '/newsletter',
    '/login', '/signup', '/forgot-password',
    '/store/the-edge/success',
    '/store/prop-survival-kit/success',
    '/store/how-to-trade/success',
    '/store/manual-bundle/success',
    '/courses/deploy-your-algo/success',
  ]
  sitemap: 'https://drawdown.trading/sitemap.xml'
  ```
- Fixed incorrect domain reference (previously `drawdown-alpha.vercel.app`).

---

## 4. Schema & Structured Data Truth Verification

### Review & Rating Schema Audit
- **Zero Fabricated Aggregate Ratings**: Automated grep and unit test verification confirmed that no fake `AggregateRating` schemas (`ratingValue: 5.0, reviewCount: 1500`) exist on public marketing pages.
- **Genuine Editorial Reviews**: Broker reviews on `/brokers/[broker]` use `@type: Review` with author `Pete Currey` and a transparent single-critic editorial rating, accurately reflecting founder assessment rather than crowdsourced claims.
- **Product & FAQ Schemas**: The `/pricing` page exposes compliant `@type: FAQPage` and `@type: ItemList` with accurate subscription pricing (£0 Free, £49/mo Foundation, £99/mo Edge, £299/mo Floor) and dynamic `activeFloorSubs >= floorCap ? SoldOut : InStock` inventory states.

---

## 5. Verification & Quality Assurance

- **Unit & Integration Tests**: Added `tests/seo-technical-audit.test.ts` to platform test suite (6 dedicated tests).
- **Total Test Suite**: 195 passing tests (`npm test` exits 0).
- **Claims Linter**: Extended `src/scripts/lint-claims.ts` with 3 additional regex patterns covering Prompt 16 copy fixes (`same feeds as professional trading desks`, `8 institutional sources`, unqualified COT causality). Passed with 0 violations.
- **Next.js Production Build**: Turbopack production compilation succeeded with zero route errors.
