# DRAWDOWN — FULL SEO AUDIT & IMPROVEMENT PROGRAMME
## Expert Audit Framework + Antigravity Fix Prompt + 7-Prompt Improvement Series

**Context:** drawdown.trading, Next.js 15 App Router / Supabase / Vercel. ~1,177 programmatic SEO pages (UK + international batches) plus marketing, tool, and curriculum pages. Known live problems: programmatic URLs returning redirect errors instead of content; GSC showing high-impression pages resolving to wrong destinations; historical title-tag stacking bug; prior integrity issues (fabricated claims) recently remediated; some dead/soft-failing live-data widgets.

---

# PART A — THE EXPERT AUDIT (WHAT'S ALMOST CERTAINLY WRONG, AND WHY)

An SEO expert looking at this site's known symptoms would diagnose the following, in severity order:

## A1. Indexation & redirect integrity — CRITICAL
High-impression URLs redirecting to wrong destinations is the single most damaging pattern possible for a programmatic site. Consequences already in motion: Google reclassifies redirected URLs, transfers (or drops) their signals, impressions decay, and the crawl scheduler deprioritises the whole section. Likely root causes in a Next.js App Router build: (a) middleware or `next.config` redirect rules with over-broad matchers catching programmatic slugs; (b) dynamic route params failing lookup and falling through to a catch-all redirect instead of rendering or 404ing; (c) trailing-slash / case / locale normalisation loops; (d) `generateStaticParams` no longer matching the slugs that were originally submitted in the sitemap (slug schema drifted between batches). The GSC "Page with redirect" and "Redirect error" reports will tell us exactly which pattern.

## A2. Programmatic content quality — SEVERE (the March-2024-onwards risk)
1,177 templated pages is exactly the footprint Google's scaled-content policies target. If a meaningful share are thin (same template, swapped city/keyword tokens, no unique value), the site risks section-wide suppression — and a helpful-content-style classifier suppresses the WHOLE domain, which would strangle the new /learn hub at birth. The programmatic estate needs a ruthless quality gate: upgrade, consolidate, or prune. Fewer, better pages will outperform the current set.

## A3. International batches without hreflang — HIGH
UK + international programmatic batches almost certainly lack hreflang and may present near-duplicate English content across country variants → duplicate clustering, wrong-country rankings, wasted crawl budget. Either implement full hreflang reciprocity or consolidate international variants until there's genuinely localised content.

## A4. Site architecture & internal linking — HIGH
Programmatic pages generated in batches are typically orphaned or linked only from sitemaps/hub lists — weak internal PageRank flow, no contextual anchors. Combined with A1, Google sees a large, poorly-linked, redirect-broken section: textbook crawl-budget waste.

## A5. Soft 404s from dead widgets — MEDIUM-HIGH
Pages whose primary content is a data widget that renders empty (the dead live-data widgets) can be classified as soft 404s. Every data-dependent page needs server-verified content or graceful static fallback content (text, not fake numbers).

## A6. Metadata & title hygiene — MEDIUM
The title-stacking bug plus programmatic template titles → duplicated/truncated titles at scale, Google rewriting titles, depressed CTR. Descriptions likely templated/duplicated across batches.

## A7. E-E-A-T & trust signals — MEDIUM (but strategic)
Post-remediation, the site needs positive trust signals to rebuild: real author entity, editorial/review policy, honest About page (FCA-safe), Organization schema with sameAs, cited sources. YMYL-adjacent finance content is held to the highest E-E-A-T bar; this is not optional for a trading education site.

## A8. Performance & rendering — MEDIUM
GSAP/Lenis-heavy pages risk poor INP and CLS; TradingView embeds and chart hydration risk LCP problems and render-blocking. Also verify programmatic pages are actually SSR/SSG-rendered (view-source shows content) — not client-rendered shells.

## A9. Off-page — LOW AUTHORITY BASELINE (assumed)
A young domain in a brutally competitive niche (broker sites with DR 80+) cannot win head terms on content alone. Link acquisition via genuinely useful free tools and honest editorial is the only white-hat path that fits the brand.

---

# PART B — PROMPT F1: CRITICAL AUDIT & FIX (RUN FIRST, BEFORE ANY NEW CONTENT SHIPS)

> **ANTIGRAVITY PROMPT F1 — SEO CRITICAL FIXES**
>
> Inputs I will provide: GSC exports (Pages report: all statuses; Performance report: top 1,000 queries+pages by impressions; Sitemaps report). Work through the following in order. Produce a written report per phase before moving on. Do not delete any page without listing it for approval first.
>
> **PHASE 1 — Redirect forensics & repair (the #1 job)**
> 1. Build a crawl script (node, run locally/CI) that requests every URL in all sitemaps plus every URL from the GSC pages export, recording: final status, redirect chain hops, final destination, response time, and whether the final HTML contains the expected H1 for that slug.
> 2. Cross-reference failures against: `middleware.ts`, `next.config` redirects/rewrites, `vercel.json`, every catch-all and dynamic route under the programmatic namespaces, and `generateStaticParams` output. Identify the exact rule(s) sending programmatic slugs to wrong destinations.
> 3. Fix root cause so every legitimate programmatic URL returns 200 with its correct content, server-rendered. Slugs that no longer have data: return 410 (intentionally removed) or 301 to the single most relevant live page — never to home, never to a generic hub.
> 4. Eliminate all internal redirect chains (internal links must point at final URLs), normalise trailing slash + case + www policy in one place, and verify zero redirect loops.
> 5. Regenerate all sitemaps from the actual set of 200-status URLs only, with real lastmod. Remove dead URLs from sitemaps. Resubmit in GSC.
> 6. Output: before/after table (URL pattern → old behaviour → new behaviour), count of restored pages, count of 410s/301s for approval.
>
> **PHASE 2 — Title & metadata repair**
> 1. Audit every route's `generateMetadata`/metadata export. Confirm the title-stacking bug is dead everywhere: exactly one title per page, pattern `{Unique Title} | Drawdown`, ≤60 chars pre-suffix. Build a metadata lint script (CI) that fails on: duplicate titles across pages, missing/duplicate descriptions, titles >65 chars, descriptions outside 120–165 chars.
> 2. Rewrite programmatic title/description templates so each page's metadata contains its distinguishing entity naturally (no keyword-stuffed patterns).
> 3. Verify canonical tags: every page self-canonical unless deliberately consolidated; no canonicals pointing at redirecting URLs.
>
> **PHASE 3 — Soft-404 & data-dependency sweep**
> 1. Find every page whose primary content depends on a live data source. For each: verify the data pipeline works; where it can fail, implement server-side detection with meaningful static fallback content (explanatory text — NEVER placeholder or stale numbers, per the XAUUSD rule).
> 2. Any page that cannot show meaningful content without its data source gets rebuilt so it can, or is removed (listed for approval).
>
> **PHASE 4 — Rendering verification**
> 1. For each page template, curl the production URL and confirm the primary content (H1, body text) is present in the initial HTML response. Any template rendering content client-side only: convert to SSR/SSG.
> 2. Confirm robots.txt blocks nothing important, allows the sitemaps, and that no `noindex` leaked into production templates.
>
> **PHASE 5 — Report**
> Full summary: issues found, fixes shipped, pages restored/removed, remaining risks, and the GSC actions for me to take (validation clicks, sitemap resubmits).

---

# PART C — THE IMPROVEMENT SERIES (RUN AFTER F1 IS VERIFIED IN GSC)

## PROMPT S1 — PROGRAMMATIC ESTATE QUALITY GATE

> Inventory all ~1,177 programmatic pages. Score each: word count, unique-content ratio vs template, live internal links in, GSC impressions/clicks (from my export), keyword overlap with sibling pages. Output a decision table: **KEEP-AS-IS** (performing, unique) / **UPGRADE** (has impressions, thin content — add unique sections, real data modules, FAQs) / **CONSOLIDATE** (cannibalising siblings — merge + 301) / **PRUNE** (no impressions, no links, thin — 410). Execute UPGRADEs in batches of 50 with a build-verify pass each batch. Target end-state: a smaller estate where every surviving page would pass the "would this page exist if search engines didn't?" test. Produce a cannibalisation matrix for all money terms showing exactly one canonical target page per intent.

## PROMPT S2 — TECHNICAL LAYER: PERFORMANCE, SCHEMA, HREFLANG

> 1. Core Web Vitals pass on all templates: LCP <2.5s, INP <200ms, CLS <0.1 on mid-tier mobile throttling. Specific suspects: defer/lazy GSAP+Lenis init, reserve space for all charts/widgets (zero CLS), lazy-load TradingView embeds behind a styled facade, image optimisation via next/image everywhere, font loading via next/font with fallback metrics.
> 2. Schema rollout site-wide: Organization (with sameAs to real profiles only), WebSite+SearchAction, BreadcrumbList everywhere, Article/FAQPage on content, SoftwareApplication on tools, Course schema ONLY on curriculum that fully exists and is accurately described. Validate all in Rich Results.
> 3. International: decide per my instruction either (a) full hreflang implementation with x-default and reciprocal tags generated from a single source of truth, or (b) consolidation of international batches into global pages until localisation is real. Present the traffic data (from GSC country report) and recommend.
> 4. 404/410 policy, custom 404 with search + popular links, pagination handling on index pages, and a CI crawl (linkinator) that fails on any new 3xx/4xx/5xx internal link.

## PROMPT S3 — SITE ARCHITECTURE & INTERNAL LINKING ENGINE

> Build a site-wide linking system: (1) taxonomy in Supabase mapping every page to cluster + pillar; (2) automated related-content modules driven by that taxonomy on every template (programmatic pages included — link them INTO the /learn hub and tools, and receive links FROM relevant articles); (3) breadcrumbs everywhere reflecting the taxonomy; (4) descriptive-anchor policy (no "click here", no exact-match-anchor spam — natural entity anchors); (5) orphan detection in CI: fail if any indexable page has <3 internal inlinks; (6) HTML sitemap page; (7) mega-menu + footer architecture exposing pillars, tools, and top comparisons. Output an architecture diagram and inlink-count table before/after.

## PROMPT S4 — E-E-A-T & TRUST LAYER

> 1. Author entity: founder author page (bio limited to verifiable facts; the single permitted claim — trades a funded FTMO account — with FTMO affiliate relationship disclosed), Person schema, linked from every authored article.
> 2. Editorial standards page: how content is produced, sourcing policy, correction policy, update cadence, AI-assistance disclosure if applicable. Link site-wide footer.
> 3. About page: rebuilt FCA-safe (already flagged in the integrity workstream — coordinate, don't duplicate work).
> 4. Citations pass: every statistic across the site links to a primary source; add a References section pattern to article templates.
> 5. Risk warning + disclosure components verified present on every relevant template; affiliate disclosure adjacent to every /go/ link.
> 6. Dates: visible published/updated dates everywhere, tied to real content changes only (no fake freshness bumping).

## PROMPT S5 — LINKABLE ASSETS & DIGITAL PR SUPPORT

> Build the assets that earn links (outreach itself is a human job — prepare the ammunition): (1) polish the calculator suite (Batch 9) with embeddable versions (iframe/embed code with attribution link) so other sites can embed our calculators; (2) build 2–3 data-driven evergreen resources: forex market hours tool (DST-aware), economic calendar page (real feed only), historical volatility explorer from cached market data — all genuinely best-in-class; (3) create a /press page (factual company info, brand assets); (4) generate a prospect list format: for each linkable asset, output the search footprints for finding link targets. NO fabricated data studies — any "study" must come from real, defensible data.

## PROMPT S6 — AI VISIBILITY (GEO/AEO)

> Optimise for AI-engine citation alongside Google: (1) add llms.txt describing the site's key resources; (2) restructure definitional content so the first 1–2 sentences of every concept page are a clean, quotable, self-contained definition (the snippet AI engines lift); (3) ensure FAQPage schema question phrasing matches natural-language queries; (4) verify all key content is server-rendered and accessible to AI crawlers (check robots policy for GPTBot/ClaudeBot/PerplexityBot — my call on allow/deny, present the trade-off); (5) add "cite this page" metadata patterns; (6) once Ahrefs connector is working, set up Brand Radar tracking for "drawdown trading education" prompt space and report baseline share of voice.

## PROMPT S7 — MONITORING, REGRESSION-PROOFING & OPS

> Make SEO regressions impossible to ship silently: (1) CI suite that runs on every deploy: metadata lint, internal link crawl, schema validation, sitemap integrity (all URLs 200), robots/noindex leak check, CWV budget via Lighthouse CI on 6 representative templates; (2) a weekly Vercel cron job that samples 200 random indexable URLs in production, verifies 200 + expected H1 + canonical, and emails a report (reuse The Wire email infrastructure); (3) a /admin SEO dashboard page (auth-gated) showing: last crawl results, sitemap counts, pages by status; (4) documented monthly GSC review checklist for me: coverage deltas, new redirect errors, top-mover queries, manual actions. 

---

# PART D — SEQUENCING

1. **F1** (critical fixes) — nothing else ships to production before Phase 1 is verified. Then request re-validation in GSC and watch the Pages report for 2–3 weeks.
2. **S1** (programmatic quality gate) — in parallel with Education Hub Prompt 1–2 builds, since it's analysis-heavy first.
3. **S2 + S3** — technical + architecture, once F1 validations start clearing.
4. **S4** — coordinate with the integrity workstream; ship before scaling content batches 10 and 14 (the trust-sensitive clusters).
5. **S5** — after Batch 9 calculators exist.
6. **S6 + S7** — final layer; S7's CI suite ideally earlier if capacity allows, since it protects everything else.

**Data I need to supply to Antigravity:** GSC exports (Pages/Coverage full, Performance 16 months, Sitemaps), and once the Ahrefs connector is re-authorised: organic keywords, top pages, referring domains exports for competitive context and the S1 scoring.
