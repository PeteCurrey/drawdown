# Programmatic SEO Approval & Release Governance Process

**Document Version:** 1.0  
**Effective Date:** August 5, 2026  
**Repository:** `drawdown.trading`  
**Status:** ACTIVE — Technical Freeze Enforcement  

---

## Executive Summary

To protect `drawdown.trading` from search engine quality penalties (such as Google’s Helpful Content System and Scaled Content Abuse policies), all automated or template-driven programmatic SEO publishing is **frozen by default**.

The freeze is enforced via the `PROGRAMMATIC_SEO_PUBLISHING_ENABLED` environment variable in `.env.local` and hard-gated at the API level in `/src/app/api/admin/seo/generate/route.ts` and `/src/app/sitemap.ts`.

No programmatic page may enter indexation or the sitemap without passing the 5-stage Quality and Governance Pipeline outlined in this document.

---

## 1. Governance Architecture & Freeze Mechanism

### 1.1 Technical Freeze Controls
* **Environment Variable:** `PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false` (Default)
* **API Gate:** `/api/admin/seo/generate/route.ts` returns `HTTP 503 Service Unavailable` when publishing is disabled.
* **Sitemap Guard:** `/src/app/sitemap.ts` conditionally skips fetching `seo_pages` records from Supabase when the freeze flag is set to `false`.
* **Dynamic Route Guard:** `/best/[slug]/page.tsx` returns `HTTP 404 Not Found` (via `notFound()`) for any non-approved or non-existent slug, preventing mass redirect chains.

---

## 2. The 5-Stage Approval & Quality Pipeline

Before any batch of programmatic pages is published or made discoverable to search crawlers, it must pass through all 5 sequential stages:

```
[ Stage 1: Search Intent & Cannibalization Check ]
                       │
                       ▼
[ Stage 2: E-E-A-T & Original Research Audit ]
                       │
                       ▼
[ Stage 3: Technical SEO & Canonical Validation ]
                       │
                       ▼
[ Stage 4: Manual Editorial Sign-off ]
                       │
                       ▼
[ Stage 5: Deployment & Indexation Staging ]
```

---

### Stage 1: Search Intent & Cannibalization Check
* **Objective:** Ensure the target page satisfies a distinct, high-intent query and does not compete with existing static hub pages or active blog articles.
* **Requirements:**
  1. Perform a kw-overlap audit against existing canonical hubs (`/brokers/all`, `/courses`, `/markets`, `/prop-firms`).
  2. Verify search volume and intent classification (Informational, Commercial, Navigational).
  3. If intent overlaps >70% with an existing page, consolidate into the existing page rather than generating a new programmatic URL.

---

### Stage 2: E-E-A-T & Original Research Audit
* **Objective:** Prevent thin content, generic template spinning, or automated hallucinated claims.
* **Requirements:**
  1. **Minimum Word Count:** 1,200 words of unique, non-templated text.
  2. **Unique Data Requirement:** Every programmatic page must contain at least 2 proprietary data points, interactive calculator widgets, or unique expert observations not found elsewhere on the web.
  3. **Fact Verification:** All quantitative claims must link to verified evidence or citations in `/methodology`.
  4. **No Mojibake / Formatting Artifacts:** Character sets must be UTF-8 compliant with clean typography (no `â€”`, `ï¿½`, or broken entities).

---

### Stage 3: Technical SEO & Canonical Validation
* **Objective:** Verify HTTP headers, metadata, schema markup, and URL structures.
* **Requirements:**
  1. **Self-Referential Canonical:** Every page must specify a self-referential `<link rel="canonical" href="https://drawdown.trading/best/[slug]" />`.
  2. **No Redirect Loops or Chains:** Ensure target URL responds with `200 OK` directly.
  3. **Structured Data:** Include valid Schema.org markup (`WebPage`, `ItemPage`, or `Article`) with valid Organization publisher data referencing `Black & Rowan Management Group Limited t/a Drawdown`.
  4. **Mobile & Core Web Vitals:** Validate LCP < 2.5s, CLS < 0.1, and FID/INP < 200ms on simulated mobile viewports.

---

### Stage 4: Manual Editorial Sign-off
* **Objective:** Human-in-the-loop verification by a qualified domain editor.
* **Requirements:**
  1. Record approval log containing:
     * Target URL Slug
     * Reviewing Editor Name
     * Approval Date & Time
     * QA Checklist Verification (Stages 1–3 confirmed)
  2. Store sign-off entry in `/seo-audit/input/approved_pages.json`.

---

### Stage 5: Deployment & Indexation Staging
* **Objective:** Controlled release into production.
* **Procedure:**
  1. Set `is_published = true` in Supabase `seo_pages` for the specific approved slug(s).
  2. Enable temporary publishing window or set `PROGRAMMATIC_SEO_PUBLISHING_ENABLED=true` in deployment environment settings.
  3. Trigger sitemap rebuild and verify XML payload via `/sitemap.xml`.
  4. Submit target URL to Google Search Console via Indexing API or manual inspection request.

---

## 3. Immediate Action Plan & Freeze Status

| Phase | Description | Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Programmatic Publishing Freeze | **ENFORCED** | `PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false` in `.env.local` |
| **Phase 2** | `/best/` Catch-all Redirect Fix | **COMPLETED** | `notFound()` returned for non-existent `/best/` URLs |
| **Phase 3** | XML Sitemap Audit & Clean-up | **COMPLETED** | `/sitemap.xml` returns 0 redirect URLs, 0 404s, 0 frozen pages |
| **Phase 4** | Robots.txt Optimization | **COMPLETED** | Disallowed private auth/cron routes, verified sitemap declaration |
| **Phase 5** | Redirect Chain Elimination | **COMPLETED** | `/brokers` → `/brokers/all` single-hop redirect verified |
| **Phase 6** | Legal Entity Standardization | **COMPLETED** | `LEGAL_CONFIG` centralized across Schema.org & footer |

---

## 4. Emergency Kill Switch Procedure

If Google Search Console reports sudden indexation of unapproved programmatic pages or quality warnings:
1. Re-confirm `PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false` in environment config.
2. Run database staging reset script:
   ```bash
   npx ts-node scripts/seo/verify-seo-remediation.ts
   ```
3. Deploy update to immediately strip non-approved programmatic URLs from `sitemap.xml` and trigger HTTP 410 / 404 response codes.
