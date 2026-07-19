# DRAWDOWN — BUILD PROMPTS B9–B16 (COMPANION TO CONTENT EXPANSION BATCHES)
## Copy-paste Antigravity prompts. Run in order: B9 → B10 → B12 → B14 → B11 → B13 → B15 → B16.
## The batches spec file (drawdown-content-expansion-batches.md) is the reference for page lists, compliance rules, and content requirements — attach it alongside each prompt. The non-negotiable rules from the Education Hub file apply to everything.

---

## PROMPT B9 — FREE TOOLS & CALCULATOR SUITE (`/tools/*`)

Build the public calculator suite. This ships in three steps: shared infrastructure, then calculators, then landing page content.

**STEP 1 — Shared calculator infrastructure**
1. Create `components/tools/` with: `<CalculatorShell>` (card layout, brand dark theme, input column + live results column, mobile-stacked), `<CalcInput>` (labelled numeric input with unit suffix, validation, sensible min/max), `<CalcSelect>`, `<CalcResult>` (large DM Mono output with animated count-up on change), `<CalcDisclaimer>` (standard "educational tool, not financial advice" component — rendered on every calculator), `<EmbedCode>` (collapsible "embed this calculator" block emitting an iframe snippet pointing to a minimal `/tools/embed/[slug]` route with an attribution backlink).
2. All calculation logic lives in `lib/calculators/` as pure, unit-tested functions — zero maths inside components.
3. Create `/tools` index page: hero, grid of tool cards, brand design system (Syne display, GSAP scroll reveals).
4. Every calculator page: calculator above the fold, then supporting content sections (rendered from MDX/DB per the spec file), FAQ accordion with FAQPage schema, SoftwareApplication schema, breadcrumbs, related tools + related /learn articles grid, risk warning footer.

**STEP 2 — The calculators (build all, unit-test the maths against these reference formulas)**

1. **Position Size** (`/tools/position-size-calculator`):
   `riskAmount = accountBalance × (riskPercent/100)`; `positionSizeUnits = riskAmount / (stopDistanceInPrice × pipOrPointValuePerUnit)`; output in lots (standard/mini/micro breakdown), units, and risk amount in account currency. Inputs: account currency, balance, risk %, instrument (select drives pip/point conventions), stop distance (pips or price). Test: £10,000 / 1% / EURUSD (GBP account) / 50-pip stop → verify against hand-computed reference including GBP conversion via cached rate.
2. **Pip Value** (`/tools/pip-calculator`): `pipValue = (pipSize / exchangeRate) × lotUnits`, converted to account currency via cached FX rate (Twelve Data, daily cache, edge function). If the rate fetch fails: show calculator in quote-currency mode with a notice — never a stale hardcoded rate.
3. **Lot Size** (`/tools/lot-size-calculator`): same engine as position size, surfaced lot-first with its own copy targeting its own query. Canonical stays self; content must be genuinely distinct.
4. **Margin** (`/tools/margin-calculator`): `requiredMargin = (lotUnits × price) / leverage`, converted to account currency.
5. **Profit** (`/tools/profit-calculator`): `pl = (exit − entry) × direction × lotUnits`, converted; shows pips and currency.
6. **Drawdown Recovery** (`/tools/drawdown-recovery-calculator`) — FLAGSHIP:
   `recoveryRequired = drawdownPct / (1 − drawdownPct)` (as %). Render an interactive SVG curve (drawdown 0–90% on x, required recovery on y, log-ish y-scale) with a draggable marker; animate the curve draw on scroll (GSAP scrub). Below: a table of common values (10%→11.1%, 20%→25%, 33%→50%, 50%→100%, 75%→300%, 90%→900%). This page gets maximum design polish — it is the brand's signature linkable asset.
7. **Risk of Ruin** (`/tools/risk-of-ruin-calculator`): implement the standard fixed-fractional risk-of-ruin approximation using win rate, payoff ratio (R:R), risk per trade, and ruin threshold; document the formula and its assumptions on-page (cite a standard reference text for the formula); render probability as a curve across risk-per-trade values. Unit-test against published reference values.
8. **Compounding** (`/tools/compounding-calculator`): `final = start × (1 + r)^n` with per-period contributions optional. COMPLIANCE: all inputs default to EMPTY (no suggestive default return %), prominent inline disclaimer above results ("Illustrative arithmetic only. Not a projection or promise of trading results."), no preset scenario buttons.
9. **Prop Firm Drawdown Tracker** (`/tools/prop-firm-drawdown-calculator`): inputs: account size, max drawdown % + type (static / trailing / EOD-trailing), daily drawdown %, current balance, today's starting balance. Outputs: current distance to daily breach, distance to max breach, and for trailing: current high-water mark logic explained visually with a small SVG diagram of how the limit moves. This must correctly implement all three drawdown models — write the model logic as documented pure functions with tests for each model.

**STEP 3 — Wiring & QA**
- Add /tools to nav + footer; add contextual links from matching /learn pages (risk-management → position size + drawdown recovery; glossary/pip → pip calculator, etc.).
- Sitemap entries, metadata per page (spec: titles ≤60 chars + " | Drawdown"), dynamic OG images.
- Lighthouse: ≥95 performance on calculator pages (they're mostly static — no excuse), zero CLS.
- Run the full unit test suite for `lib/calculators/` and paste results in the completion report.

---

## PROMPT B10 — PROP FIRM HUB (`/prop-firms/*`)

**STEP 1 — Data layer**
Create Supabase table `prop_firms`: `id, name, slug, website_url, affiliate_slug (nullable — only FTMO initially), challenge_cost_json (per account size), profit_target_p1, profit_target_p2, max_drawdown_pct, drawdown_type (enum: static|trailing|eod_trailing), daily_drawdown_pct, profit_split_pct, min_trading_days, time_limit, instruments_summary, payout_frequency, source_terms_url, last_verified (date), notes`. Seed with FTMO plus 5–8 major firms — every value sourced from each firm's published terms page, with `source_terms_url` mandatory and `last_verified` set to today. If a value cannot be verified from the firm's own published pages, leave it NULL and render "—" (never guess).

**STEP 2 — Templates & components**
- `<PropFirmComparisonTable>`: sortable, data-driven from the table above, "last verified" date rendered per row, methodology note component above it ("How we compiled this" — sources and update policy), affiliate disclosure component adjacent (the FTMO row's link is `/go/ftmo`; all other links are plain outbound, rel="nofollow sponsored" ONLY on affiliate links, plain nofollow external policy per site standard elsewhere).
- `<DrawdownRuleDiagram>`: SVG component visualising static vs trailing vs EOD-trailing limits against an equity curve — reused across the hub and linked from the B9 prop-firm calculator.
- Hub template: same article layout family as /learn (breadcrumbs, TOC, FAQ schema, related grid, risk warning).

**STEP 3 — Pages**
Build the 8 pages from the spec file (Batch 10 list) with their stated compliance requirements. The FTMO review page: first-person experience framing limited strictly to the permitted claim (founder trades a funded FTMO account), factual walkthrough of the challenge/verification/funded process, BOTH disclosures (founder account + affiliate relationship) in a visible callout near the top, no profit/payout figures, no pass-rate claims beyond figures FTMO itself publishes (linked).
Natural CTAs: Prop Firm Survival Kit (live) and the prop-firm drawdown calculator.

**STEP 4 — QA:** every factual cell traceable to `source_terms_url`; crawl the section for link/metadata issues; confirm no page makes a "best prop firm" superlative claim.

---

## PROMPT B12 — MARKET SESSIONS HUB (`/learn/sessions/*`)

**STEP 1 — The session engine (the differentiator)**
Build `lib/sessions/` with a DST-aware session model: for each market (Sydney, Tokyo, London, New York) define open/close in LOCAL exchange/session time with IANA timezone (`Australia/Sydney`, `Asia/Tokyo`, `Europe/London`, `America/New_York`) and compute current UTC open/close via `Intl`/Temporal-safe logic — NO hardcoded UTC hours, so DST transitions are always correct automatically. Unit-test: assert correct session states for known datetimes in January and July (both hemispheres' DST states) and across a DST transition weekend.

**STEP 2 — Components**
- `<SessionClock>`: live component showing all four sessions as a 24-hour arc/heatmap in brand style (DM Mono labels, GSAP-animated sweep line at "now"), user's local time + UK time displayed, overlap zones highlighted. Client-side only, zero network calls, zero CLS (fixed height).
- `<SessionTable>`: current open/close times rendered in the visitor's local timezone AND UK time, computed from the engine.
- `<HolidayList>`: driven by a Supabase `market_holidays` table (`market, date, name, status(closed|early_close), source_url`) seeded for the current + next year from exchange calendars (sourced, with URLs). Page copy auto-references the current year.

**STEP 3 — Pages:** build the 9 pages from the spec (pillar + 4 sessions + overlaps + best times + holidays), SessionClock embedded on every page, each session page with its characteristics content per the spec's sourcing rules, FAQ schema targeting the PAA patterns ("what time does the london session open", "when do london and new york overlap" etc.).

---

## PROMPT B14 — HONEST ANSWERS EDITORIAL CLUSTER (`/learn/questions/*`)

Build the 10 pages from the spec file. Special requirements beyond the standard article template:
1. Each page opens with a direct, quotable 2–3 sentence answer in a styled "Straight answer" callout (this is the AI-citation and featured-snippet target), then the full nuanced treatment.
2. Sourcing bar is highest on the site: broker loss-percentage claims link to the specific broker risk disclosures quoted; regulatory statements link to FCA/HMRC pages; a References section closes every article.
3. The signals page must describe our own Signal Centre in the same honest register as everything else — education/analysis framing, no performance claims; treat it as a worked example of how to evaluate any signal service.
4. The tax page renders a prominent top-of-page disclaimer component ("General information, not tax advice — speak to a qualified accountant") and cites only HMRC sources for tax treatment statements.
5. Add a `QAPage` or `FAQPage` schema decision per page (single-question pages → consider QAPage; verify rich-result eligibility and pick one policy site-wide).
6. Before marking complete: output a claims audit table for the whole cluster — every factual claim, its source URL, verified y/n. Any unverifiable claim gets rewritten or cut.

---

## PROMPT B11 — STRATEGY LIBRARY (`/learn/strategies/*`)

1. Build the index + 14 strategy pages from the spec. Template additions: `<SetupDiagram>` (ConceptDiagram preset for entry/stop/target annotation), a standardised "How you'd test this" section component (links Backtester methodology; CTA to Algo Builder where live), and a standardised "Where this fails" section — mandatory on every page.
2. Each page's historical example: pick a real, verifiable instance (instrument + dates), render via InteractiveChart from cached data, and include a one-line note of the exact date range shown. Verify the setup is genuinely visible in that data before shipping (manual check listed in the completion report: page → instrument → dates → verified y/n).
3. Zero win-rate/performance/expectancy claims anywhere. Language lint: grep the cluster for "guaranteed", "profitable strategy", "works", "% win rate", "easy" — flag all hits in the report.

---

## PROMPT B13 — PLATFORMS & PINE SCRIPT CLUSTER (`/learn/platforms/*`)

1. Build the 12 pages from the spec (platform guides + Pine Script mini-cluster). 
2. Screenshots: capture real annotated screenshots (dark theme where the platform supports it), stored via next/image, alt text descriptive; nominative trademark use only — factual references, no logos as decoration, no implied endorsement.
3. Pine Script pages: all code samples in styled DM Mono code blocks with copy buttons; every sample must be valid Pine Script v5 that compiles — verify each in TradingView before shipping and note verification in the report. The "From Pine Script to Live Algo" page CTAs to the Deploy Your Algo course (live product — permitted).
4. Order Types Explained gets a `<ConceptDiagram>` per order type (market/limit/stop/stop-limit/OCO/trailing) — six small diagrams, one visual language.

---

## PROMPT B15 — COMPARISON PAGES (`/learn/compare/*`)

1. Build the 8 comparison pages from the spec on a dedicated comparison template: intro, `<ComparisonTable>`, per-dimension prose sections, "Which fits your situation" neutral decision framework (bulleted scenarios, no winner verdicts on regulated products), FAQ, links to both underlying concept pages.
2. Spread Betting vs CFDs: UK regulatory + tax dimensions cited to FCA/HMRC; coordinate content with the B14 tax page (link, don't duplicate).
3. Metadata pattern: "X vs Y: [differentiator] | Drawdown" — verify no title collisions with existing pages via the metadata lint.

---

## PROMPT B16 — INSTRUMENT GUIDES (`/learn/markets/[instrument]`)

**STEP 0 — MANDATORY DEDUPE GATE:** export the full list of existing programmatic page URLs + their target keywords. For each of the 11 planned instruments, check for intent overlap. Output a decision table (new page / upgrade existing / skip) and STOP for my approval before building anything.

**STEP 1 (post-approval):** build approved pages on the market-guide template: live cached price widget (existing Twelve Data infra; graceful degradation — component hides entirely on data failure, absolutely no fallback prices), "what moves it" section with sourced fundamentals, session behaviour (link Sessions hub), qualified volatility discussion, costs/spread discussion in general terms (no specific broker spread claims unless sourced + dated), risks section. Crypto pages additionally carry the FCA crypto-promotions risk framing component.

**STEP 2:** wire each instrument page into: relevant strategy pages, relevant session pages, relevant indicator pages, and the matching calculator defaults (e.g. gold page → position size calculator preset link with XAUUSD selected).

---

## COMPLETION REPORT FORMAT (EVERY PROMPT ABOVE)
- Pages shipped (URL list) + build status
- Test results (unit tests, metadata lint, internal link crawl for the new section)
- Claims/sourcing audit table where required (B10, B14, B16)
- Any spec deviation with reasoning
- GSC actions for me (sitemap ping, etc.)
