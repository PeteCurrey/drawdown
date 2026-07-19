# DRAWDOWN — EDUCATION HUB & TOP-OF-FUNNEL SEO BUILD
## Antigravity Prompt File — Sequenced Build (8 Prompts)

**Project:** drawdown.trading (Next.js 15 / Supabase / Vercel / Tailwind)
**Objective:** Build a genuine trading education content hub that captures top-of-funnel search traffic across the entire trading space (not just Drawdown's product keywords), establishing brand authority, earning backlinks, and feeding the funnel toward the curriculum, Signal Centre, and tools.

---

## ⛔ NON-NEGOTIABLE RULES (APPLY TO EVERY PROMPT BELOW)

1. **ZERO fabricated claims.** No invented statistics, no fake partnerships, no made-up studies, no "9 out of 10 traders" figures without a citable source. If a statistic is used, it must link to its real source (e.g. FCA, ESMA, BIS Triennial Survey, broker disclosure pages). If no source exists, do not use the claim.
2. **FCA financial promotion compliance.** Every education page must carry the standard risk warning component. No earnings claims, no lifestyle promises, no "quit your job" framing, no implied guaranteed returns. Educational tone throughout: "traders use X to..." not "use X to profit."
3. **CFD/spread betting risk disclosure.** Where leverage, CFDs, or spread betting are discussed, include the standard "76%+ of retail investor accounts lose money trading CFDs" contextual note (sourced to broker disclosures — do not invent a percentage; pull the real current figure from a cited broker page or use the ESMA-mandated framing).
4. **Affiliate disclosure.** Any page containing a `/go/[slug]` affiliate link must display the affiliate disclosure component near the link. FTMO pages must disclose both that the founder trades a funded FTMO account AND that FTMO is an affiliate partner.
5. **Real data only.** Any live price, chart, or widget must use the existing Twelve Data / TradingView infrastructure. NO hardcoded price values anywhere. If live data is unavailable, the component must degrade gracefully (hide or show "data unavailable") — never show a stale fallback number.
6. **Founder claims permitted:** "founder trades a funded FTMO account" — nothing beyond this. No profit figures, no payout figures, no account sizes.
7. **Design system:** existing Drawdown design tokens. Dark editorial aesthetic, Syne display / DM Sans body / DM Mono for data. GSAP ScrollTrigger with scrub for scroll animation (never IntersectionObserver). Lenis smooth scroll. All media custom-built (SVG diagrams, interactive components) — no stock photography, no generic AI images.
8. **Title tags:** single clean title per page, `{Page Title} | Drawdown` — verify the title-stacking bug fix is respected. Max 60 chars before the brand suffix.
9. **No new curriculum/product claims.** Education pages must not reference curriculum phases, features, or tools that do not exist in production. Cross-sell CTAs may only point to live, working features.
10. **Do not touch the programmatic SEO batch pages or their redirect logic in this build** — that is being fixed in a separate workstream. New pages live under `/learn/*` and must not collide with existing routes.

---

## ARCHITECTURE OVERVIEW

```
/learn                          ← Hub index (pillar directory)
/learn/what-is-trading          ← Pillar 1
/learn/types-of-trading         ← Pillar 2
  /learn/types-of-trading/day-trading
  /learn/types-of-trading/swing-trading
  /learn/types-of-trading/scalping
  /learn/types-of-trading/position-trading
  /learn/types-of-trading/algorithmic-trading
  /learn/types-of-trading/copy-trading
/learn/indicators               ← Pillar 3 (encyclopedia index)
  /learn/indicators/[slug]      ← ~30 indicator pages
/learn/chart-patterns           ← Pillar 4
  /learn/chart-patterns/candlestick/[slug]
  /learn/chart-patterns/classic/[slug]
/learn/risk-management          ← Pillar 5
  /learn/risk-management/[slug]
/learn/trading-psychology       ← Pillar 6
  /learn/trading-psychology/[slug]
/learn/smart-money-concepts     ← Pillar 7 (SMC/ICT — Drawdown's niche authority)
  /learn/smart-money-concepts/[slug]
/learn/markets                  ← Pillar 8
  /learn/markets/forex | indices | gold | crypto | stocks
/learn/glossary                 ← A–Z index
  /learn/glossary/[slug]        ← individual term pages
```

Content data lives in Supabase (`learn_articles` table) or MDX files in-repo — Antigravity to choose based on existing content infrastructure, but MUST support: draft/published status, updated_at date display, author attribution, related-article relationships.

---

## PROMPT 1 — FOUNDATION: HUB ARCHITECTURE, TEMPLATES & SHARED COMPONENTS

Build the `/learn` hub foundation before any content:

**1. Article page template** (`/learn/[...slug]` layouts) containing:
- Breadcrumb trail (with BreadcrumbList JSON-LD)
- H1, standfirst/summary paragraph, estimated reading time, last-updated date
- Author byline component: "Reviewed by the Drawdown team" + founder attribution where appropriate ("Written by [founder], who trades a funded FTMO account") — no other founder claims
- Sticky table of contents (desktop sidebar, mobile collapsible)
- Article body with styled typography (proper heading hierarchy, pull-quotes, definition callout boxes, warning/note/tip callouts)
- FAQ accordion section (with FAQPage JSON-LD)
- "Related concepts" grid (internal links, minimum 4 per page)
- "Continue learning" prev/next within cluster
- Risk warning footer component (persistent, every page)
- Contextual CTA component — ONE per page, mid-article or end: points only to live features (Risk Calculator, Market Scanner, live curriculum content, Signal Centre). CTA copy is educational-adjacent, not hard-sell.

**2. Shared custom media components** (these are the "unique media" differentiator — build once, reuse everywhere):
- `<ConceptDiagram>` — renders custom inline SVG diagrams from a props-driven schema (annotated chart shapes, arrows, zones). Dark theme, brand colors, DM Mono labels.
- `<InteractiveChart>` — lightweight candlestick chart component (canvas or lightweight-charts library) that renders REAL historical OHLC data pulled from Twelve Data via a cached Supabase edge function (cache aggressively — daily candles, 90-day window, revalidate weekly — to protect API quota). Supports overlay of a single indicator series.
- `<IndicatorPlayground>` — extends InteractiveChart: user can adjust indicator parameters (e.g. RSI period slider) and see the indicator recalculate live on real cached data. This is the linkbait component — nobody else has interactive indicator demos on education pages.
- `<PatternAnimation>` — GSAP-animated SVG that draws a candlestick/chart pattern step by step as the user scrolls (ScrollTrigger scrub).
- `<ComparisonTable>` — styled comparison table (e.g. day trading vs swing trading).
- `<RiskWarning>`, `<AffiliateDisclosure>`, `<KeyTakeaways>` (summary box at top of article).
- `<GlossaryTooltip>` — inline term wrapper that shows a definition tooltip and links to the glossary page for that term.

**3. Hub index page** (`/learn`): cinematic hero, pillar directory cards, "start here" pathway for complete beginners, search/filter across all articles.

**4. SEO plumbing for the hub:**
- Metadata generation helper: title (≤60 chars + " | Drawdown"), meta description (150–160 chars), canonical, OG image generation (dynamic OG images via @vercel/og — dark brand template with article title in Syne)
- Article JSON-LD (headline, datePublished, dateModified, author)
- `/learn` section added to sitemap generation with lastmod from updated_at
- Internal linking: GlossaryTooltip auto-links first occurrence of glossary terms in article bodies

Acceptance: template renders a dummy article perfectly on mobile + desktop, Lighthouse SEO 100, all JSON-LD validates in Rich Results test, InteractiveChart shows real cached EURUSD daily data.

---

## PROMPT 2 — PILLAR PAGES (8 COMPREHENSIVE GUIDES)

Write and build the 8 pillar pages. Each is 2,500–4,000 words of genuinely useful, original content — written to be the best answer on the internet, not thin SEO filler. Each pillar includes: KeyTakeaways box, 3+ custom ConceptDiagrams or one InteractiveChart, FAQ section (6–8 questions targeting People Also Ask queries), links out to its cluster pages (built in later prompts — use correct future URLs), and cited sources for any factual claims.

1. **What Is Trading? A Complete Beginner's Guide** (`/learn/what-is-trading`) — target: "what is trading", "how does trading work", "trading for beginners". Covers: markets overview, how prices move, participants, brokers vs exchanges, spread betting vs CFDs vs investing (UK framing — tax treatment mentioned factually with "not tax advice" note), realistic expectations section (honest about loss statistics, cited).
2. **Types of Trading Explained** (`/learn/types-of-trading`) — comparison of day/swing/scalping/position/algo/copy trading with ComparisonTable of timeframes, time commitment, typical holding periods.
3. **Trading Indicators: The Complete Guide** (`/learn/indicators`) — what indicators are, leading vs lagging, categories (trend/momentum/volatility/volume), how traders combine them, indicator limitations and over-fitting honesty section. Doubles as the encyclopedia index with a filterable grid of all indicator pages.
4. **Chart Patterns & Candlestick Patterns Guide** (`/learn/chart-patterns`) — index + guide, PatternAnimation hero.
5. **Risk Management in Trading** (`/learn/risk-management`) — position sizing, risk per trade, R-multiples, stop losses, drawdown (own the term — this is the brand name; deep section on drawdown types, max drawdown, recovery maths with a custom diagram showing the loss/recovery asymmetry: a 50% loss needs a 100% gain), links to the live Risk Calculator tool.
6. **Trading Psychology** (`/learn/trading-psychology`) — discipline, common cognitive biases, revenge trading, journaling (link to live Trade Journal tool).
7. **Smart Money Concepts & ICT Trading Explained** (`/learn/smart-money-concepts`) — the niche authority play: order blocks, fair value gaps, liquidity, market structure, honest framing (presented as a methodology traders use, noting it is contested and not academically validated — this honesty is a differentiator and E-E-A-T signal).
8. **Markets You Can Trade** (`/learn/markets`) — forex majors/minors, indices, gold/commodities, crypto CFDs, stocks — with live (cached) data widgets per market using existing infrastructure.

Acceptance: each pillar passes the content checklist at the bottom of this file.

---

## PROMPT 3 — INDICATOR ENCYCLOPEDIA (~30 PAGES)

Build `/learn/indicators/[slug]` pages. Every page follows the same rich template but content must be individually written — no template-spun paragraphs.

**Per-page structure:** What it is (plain English first) → the formula/calculation (DM Mono, explained step by step) → IndicatorPlayground with real cached data and adjustable parameters → how traders read it (signals, divergence where relevant) → strengths & known weaknesses (honest) → common settings table → how it's combined with other indicators → FAQ → related indicators.

**Batch A — priority (high volume):** RSI, MACD, Moving Averages (SMA/EMA — one page, thorough), Bollinger Bands, Stochastic Oscillator, Fibonacci Retracement, ATR, VWAP, Ichimoku Cloud, Parabolic SAR.
**Batch B:** ADX, CCI, Williams %R, OBV, Volume Profile, Pivot Points, Supertrend, Keltner Channels, Donchian Channels, MFI.
**Batch C:** Momentum, ROC, Standard Deviation, Chaikin Money Flow, Accumulation/Distribution, Aroon, DMI, Envelopes, Fractals, Heikin Ashi (as a chart type page).

IndicatorPlayground must actually compute each indicator client-side from the cached OHLC series — implement the calculation library properly (or use a vetted TA library) and unit-test RSI, MACD, EMA, ATR calculations against known reference values.

Ship in three batches (A, then B, then C) with a build-verify pass between each.

---

## PROMPT 4 — CHART PATTERN LIBRARY (~25 PAGES)

`/learn/chart-patterns/candlestick/[slug]` — Doji, Hammer, Inverted Hammer, Shooting Star, Engulfing (bullish/bearish — one page each), Morning Star, Evening Star, Three White Soldiers, Three Black Crows, Harami, Piercing Line, Dark Cloud Cover, Tweezer Tops/Bottoms, Marubozu.

`/learn/chart-patterns/classic/[slug]` — Head & Shoulders, Inverse H&S, Double Top, Double Bottom, Triangles (ascending/descending/symmetrical — one page), Flags & Pennants, Wedges, Cup & Handle, Rounding Bottom, Rectangle/Range.

Each page: PatternAnimation (the scroll-drawn SVG of the pattern forming — the signature media asset), anatomy diagram with labeled components, what it suggests and the honest reliability caveat (patterns are probabilistic context, not signals — cite the general evidence honestly), where traders place invalidation, real-chart example section using InteractiveChart with a genuine historical instance (hand-pick real dates/instruments — verify the pattern actually occurred on that data), FAQ, related patterns.

---

## PROMPT 5 — SMC/ICT DEEP CLUSTER (~12 PAGES)

This is Drawdown's authority niche — go deeper than anyone. `/learn/smart-money-concepts/[slug]`:

Order Blocks, Fair Value Gaps, Liquidity (buy-side/sell-side), Liquidity Sweeps & Stop Hunts, Break of Structure, Change of Character, Market Structure (HH/HL/LH/LL), Premium & Discount / Optimal Trade Entry, Kill Zones & Session Timing, Displacement, Inducement, Mitigation Blocks.

Each with custom ConceptDiagrams showing the concept on annotated price action, honest framing (methodology, not proven edge), and cross-links into the Market Scanner (which detects ICT patterns — the natural product tie-in, presented as "see this concept detected on live charts").

---

## PROMPT 6 — GLOSSARY (A–Z, ~120 TERMS)

`/learn/glossary` index (alphabet nav, search) + `/learn/glossary/[slug]` term pages.

Term pages are concise but real: 150–400 word definition, one diagram where visual, "used in a sentence" example, DefinedTerm JSON-LD, links to the full article where one exists (e.g. glossary/rsi → indicators/rsi). Terms include all core vocabulary: pip, lot, leverage, margin, spread, slippage, stop loss, take profit, drawdown, equity, balance, long, short, bid/ask, candlestick, timeframe, backtesting, prop firm, funded account, and ~100 more — generate the full list, deduplicate against existing pages, and wire every term into the GlossaryTooltip auto-linker.

Glossary pages target "what is a pip" / "[term] meaning in trading" long-tail queries — quick wins with low difficulty.

---

## PROMPT 7 — EXISTING PAGE UPGRADE PASS

Audit every currently-live marketing and content page (NOT the programmatic batch pages — those are the separate redirect workstream) against the content checklist:

1. Inventory all live routes (crawl the sitemap + route files). Output a table: URL, title tag, meta description, word count, has unique media (y/n), has schema (y/n), thin/duplicate content flag, verdict (keep / upgrade / consolidate / noindex).
2. For every "upgrade" page: rewrite thin sections, add at least one custom media component, fix metadata, add FAQ + schema where appropriate, add internal links into the new /learn hub.
3. For duplicate/near-duplicate pages: consolidate with 301s and canonical fixes.
4. Verify every page passes the integrity rules (no fabricated claims survived from earlier builds — flag ANY unverifiable claim found and list it in the output report rather than silently keeping it).
5. Output a full report of changes made.

---

## PROMPT 8 — TECHNICAL SEO & INTERNAL LINKING LAYER

1. **Sitemaps:** split sitemap index — `/sitemap-learn.xml` for the hub with real lastmod dates.
2. **Internal linking engine:** every article stores `related_slugs`; build a linting script that fails CI if any published article has fewer than 4 internal links or any orphan pages exist in /learn.
3. **Schema audit:** validate Article, FAQPage, BreadcrumbList, DefinedTerm across all templates.
4. **Performance:** InteractiveChart and IndicatorPlayground must be lazy-loaded below the fold, zero CLS, and the OHLC cache must serve from edge. LCP < 2.5s on article pages.
5. **Navigation:** add "Learn" to the main site nav with a mega-menu of pillars; add footer links to all 8 pillars.
6. **Redirect safety check:** confirm no /learn route collides with any existing route or the programmatic page namespace; run a full-site crawl (linkinator or similar) and output any 3xx/4xx found in /learn.
7. **RSS feed** for /learn articles (supports The Wire newsletter repurposing).

---

## PER-PAGE CONTENT QUALITY CHECKLIST (EVERY PAGE, EVERY PROMPT)

- [ ] Answers the target query better than the current top 3 results would
- [ ] Original writing — no spun/templated paragraphs shared across pages
- [ ] At least one custom media component (diagram, animation, or interactive)
- [ ] Any statistic or factual claim is cited to a real, linked source
- [ ] No fabricated partnerships, features, or founder claims
- [ ] Risk warning present; affiliate disclosure present if affiliate links used
- [ ] Title ≤60 chars + " | Drawdown", unique meta description 150–160 chars
- [ ] Correct JSON-LD validates
- [ ] ≥4 contextual internal links + breadcrumb + related grid
- [ ] One CTA maximum, pointing only to a live working feature
- [ ] Reads honestly — limitations and caveats included, no hype
- [ ] Mobile layout verified, no CLS from charts/media

## ROLLOUT ORDER & CADENCE

1. Prompt 1 (foundation) → verify → 2 (pillars) → verify
2. Prompt 6 (glossary — fast quick wins, powers the tooltip system) 
3. Prompt 3 Batch A (top indicators) → 4 (patterns) → 3 Batches B/C
4. Prompt 5 (SMC cluster)
5. Prompt 7 (existing page upgrades) — can run parallel after Prompt 1
6. Prompt 8 (technical layer) — final pass

**Before Prompt 2 content is written:** validate the target keyword list in Ahrefs (GB + US volumes, difficulty, People Also Ask questions per pillar) and feed the confirmed keyword map + PAA questions into the prompt as context.
