# DRAWDOWN — CONTENT EXPANSION: NEXT LANDING PAGE BATCHES
## Antigravity Prompt File — Batches 9–16 (follows the Education Hub build)

These batches extend beyond the `/learn` education hub into commercial, tool-led, and editorial territory. Same non-negotiable rules as the Education Hub file apply to EVERY page here (no fabricated claims, cited sources only, FCA-compliant framing, affiliate + FTMO dual disclosure, real data only with graceful degradation, one CTA per page pointing only to live features, design system compliance, no route collisions with existing programmatic pages).

**Priority order: 9 → 10 → 12 → 14 → 11 → 13 → 15 → 16.** Batch 9 (calculators) first — tool pages are the strongest link magnets and convert search intent that competitors serve with ugly, ad-stuffed calculators.

---

## BATCH 9 — FREE TOOLS & CALCULATORS CLUSTER (`/tools/*`)

Each is a standalone landing page: working calculator above the fold, then 800–1,200 words of genuinely useful supporting content (how the calculation works, worked examples, FAQ with FAQPage schema). Calculators are client-side, instant, no signup wall — the free value IS the marketing. SoftwareApplication/WebApplication schema on each.

1. `/tools/position-size-calculator` — account size, risk %, stop distance → lot size. (Highest commercial relevance — this is the risk management entry point.)
2. `/tools/pip-calculator` — pip value by pair, lot size, account currency (live cached FX rates for conversion; hide converter if data unavailable).
3. `/tools/lot-size-calculator` — variant targeting its own query; canonical-distinct content, cross-linked to position size.
4. `/tools/margin-calculator` — leverage, position size → required margin.
5. `/tools/profit-calculator` — entry/exit/lots → P/L in account currency.
6. `/tools/drawdown-recovery-calculator` — THE brand-name tool: input drawdown % → required recovery %, with the asymmetry curve rendered as an interactive SVG chart. Flagship linkable asset; deserves the most design polish.
7. `/tools/risk-of-ruin-calculator` — win rate, R:R, risk per trade → probability curves.
8. `/tools/compounding-calculator` — growth projection tool. COMPLIANCE CRITICAL: neutral framing ("model account growth scenarios"), no suggested return inputs, prominent "illustrative only — not a projection of trading results" disclaimer, no default % that implies achievable returns.
9. `/tools/prop-firm-drawdown-calculator` — static vs trailing drawdown limit tracker for challenge accounts (ties into Batch 10 and the Survival Kit).
10. `/tools` — index page presenting the suite.

Cross-link every calculator to its matching `/learn` concept page and vice versa. Existing platform Risk Calculator: decide merge-or-coexist — if the platform tool is gated, these public pages are the ungated SEO layer that funnels to it.

---

## BATCH 10 — PROP FIRM & FUNDED TRADING HUB (`/prop-firms/*`)

Highest commercial-intent cluster; directly monetised via FTMO affiliate + Prop Firm Survival Kit. EVERY page: affiliate disclosure component; FTMO pages additionally disclose the founder trades a funded FTMO account AND that FTMO is an affiliate partner.

1. `/prop-firms/what-is-a-prop-firm` — pillar: model explained, how firms make money (honest: challenge fees), evaluation vs instant funding, realistic pass-rate honesty (only cite figures firms publish — link them).
2. `/prop-firms/how-challenges-work` — phases, profit targets, drawdown rules, time limits, verification.
3. `/prop-firms/drawdown-rules-explained` — daily vs max vs trailing drawdown, EOD vs intraday calculation, balance vs equity based. Brand-perfect topic; use the prop-firm drawdown calculator inline.
4. `/prop-firms/ftmo-review` — genuine first-hand review. This is the ONLY prop firm page allowed first-person experience content ("the founder trades a funded FTMO account") — describe the process factually, no profit/payout figures, both disclosures prominent.
5. `/prop-firms/comparison` — comparison table of major firms (FTMO, and 5–8 others) built ONLY from each firm's published, linked terms: challenge cost, targets, drawdown type, profit split, instruments. Every cell sourced; add a `last verified` date per row; build as data-driven table from a Supabase `prop_firms` table so updates don't require redeploys.
6. `/prop-firms/rules-that-fail-traders` — common breach causes (daily drawdown misunderstanding, news-trading rules, consistency rules, weekend holding) — educational, links to Survival Kit as the natural CTA.
7. `/prop-firms/one-step-vs-two-step` — comparison page.
8. `/prop-firms/funded-account-next-steps` — payouts process, scaling plans (factual, sourced from firm T&Cs only).

DO NOT create individual review pages for firms with no first-hand experience — comparison table coverage only. No "best prop firm" superlative claims; the comparison page is titled and framed as a comparison, with a stated methodology box.

---

## BATCH 11 — STRATEGY LIBRARY (`/learn/strategies/*`)

12–15 pages. Framing rules: strategies are described as approaches traders use, never as profitable systems; every page includes a "How you'd test this" section pointing to backtesting methodology (and the live Backtester/Algo Builder as CTA where live); include the limitations/failure-modes section; NO win-rate or performance claims anywhere.

Index + pages: Breakout Trading, Trend Following, Mean Reversion, Pullback Trading, Range Trading, Opening Range Breakout, London Open Strategy, New York Session Strategies, News Trading (with a serious risk section: slippage, spread widening), Scalping Strategies, Swing Trading Strategies, Gold (XAUUSD) Strategies, Momentum Trading, Carry Trade (rates explained, sourced).

Unique media: each strategy gets a ConceptDiagram of the setup + an InteractiveChart showing one hand-verified historical example (real dates, real data — verify the setup actually occurred).

---

## BATCH 12 — MARKET SESSIONS & HOURS (`/learn/sessions/*`)

High-volume evergreen with a killer unique-media angle: a live session clock/heatmap component (pure client-side timezone logic — no API needed, no data-availability risk) showing which sessions are open now, rendered in brand style. Embed it on every page in the batch.

1. `/learn/sessions/forex-market-hours` — pillar; UK-first framing, DST handling explained (this is where competitors' pages go stale — build DST-aware logic so the page is always correct; that accuracy is the ranking edge).
2. London Session, New York Session, Tokyo Session, Sydney Session — one page each: characteristics, typically-active pairs, volatility patterns (sourced/qualified, not asserted as fact).
3. `/learn/sessions/session-overlaps` — London/NY overlap focus.
4. `/learn/sessions/best-times-to-trade` — honest, qualified treatment; strong People-Also-Ask FAQ section.
5. `/learn/sessions/market-holidays` — data-driven page from a maintained holidays table; auto-updating year in title. 

---

## BATCH 13 — PLATFORMS & TECHNICAL SETUP (`/learn/platforms/*`)

Ties directly to Algo Builder and Deploy Your Algo mini-course.

1. MT4 vs MT5 (comparison, factual feature table), MetaTrader guide, TradingView Complete Guide, cTrader Overview.
2. How to Read a Candlestick Chart (beginner high-volume), Order Types Explained (market/limit/stop/OCO with diagrams), What Is Slippage, Trading APIs & VPS Basics.
3. Pine Script mini-cluster (the Algo Builder feeder): What Is Pine Script, Pine Script Basics Tutorial, Common Pine Script Errors, Backtesting in TradingView, From Pine Script to Live Algo (CTA: Deploy Your Algo course — it's live, so permitted).

Platform screenshots: use own captured screenshots of the platforms (annotate in brand style) — no vendor marketing imagery; respect trademark usage (nominative reference only, no implied endorsement).

---

## BATCH 14 — HONEST ANSWERS EDITORIAL CLUSTER (`/learn/questions/*`)

The credibility play. Every trader Googles these; almost every result is written by someone selling a dream. Drawdown answers them honestly — that's the brand moat and the E-E-A-T signal. These pages must be conservative, heavily cited, and reviewed against FCA financial-promotion rules before publish.

1. Why Do Most Traders Lose Money? (cite the actual broker CFD disclosure percentages with links; explain the structural reasons)
2. Is Trading Gambling? (nuanced, honest)
3. Can You Make a Living From Trading? (realistic; no income claims; discuss variance, capital requirements, prop route factually)
4. How Much Money Do You Need to Start Trading? (factual broker minimums — sourced; risk-first framing)
5. Is Forex Trading Legal in the UK? (FCA regulation explained, link to FCA register)
6. Do Trading Signals Work? (honest — including our own Signal Centre positioning: education/analysis framing, not performance promises)
7. Are Prop Firms Legit? (balanced; regulatory status of prop model explained)
8. Trading and Tax in the UK (factual overview of spread betting vs CFD treatment; prominent "not tax advice — consult an accountant" disclaimer; cite HMRC pages)
9. Demo vs Live Trading: What Changes?
10. How Long Does It Take to Learn Trading? (honest, no timeline promises)

---

## BATCH 15 — COMPARISON PAGES (`/learn/compare/*`)

Spread Betting vs CFDs (UK-critical, links to tax page), Forex vs Stocks vs Crypto, Day Trading vs Swing Trading, Prop Firm vs Personal Capital, Trading vs Investing, Technical vs Fundamental Analysis, Fixed vs Trailing Stop, Manual vs Algorithmic Trading.

Template: ComparisonTable component, "which suits you" decision framework (neutral), FAQ, links to both underlying concept pages. No "winner" verdicts on regulated-product comparisons — present trade-offs.

---

## BATCH 16 — INSTRUMENT TRADING GUIDES (`/learn/markets/[instrument]`)

⚠️ DEDUPE FIRST: before building, list all existing programmatic batch URLs and confirm zero keyword/intent overlap. If an existing programmatic page targets the same query, UPGRADE that page instead of creating a new one — do not create cannibalising duplicates.

Priority instruments (one deep guide each, 2,000+ words): Gold (XAUUSD), NAS100, US30, S&P 500, EURUSD, GBPUSD, GBPJPY, USDJPY, Oil (WTI), Bitcoin CFDs, FTSE 100.

Each: what moves it (sourced fundamentals), typical volatility characteristics (qualified), session behaviour, spreads/costs discussion, live cached price widget (existing Twelve Data infra, graceful degradation — remember the XAUUSD incident: NO fallback prices), how it's commonly traded, risks. Crypto pages: additional volatility/regulatory risk framing per FCA guidance on crypto promotions.

---

## SHARED ACCEPTANCE CRITERIA (ALL BATCHES)

- Passes the per-page content quality checklist from the Education Hub file
- Zero unsourced statistics; zero performance/income claims; compounding & signals pages get an extra compliance read
- Every page wired into internal linking: breadcrumb, ≥4 contextual links, related grid, added to sitemap with lastmod
- Calculators unit-tested (position size, pip value, margin math verified against reference calculations)
- Data-driven tables (prop firms, holidays) come from Supabase tables with `last_verified` dates — no hardcoded rows in components
- Build-verify pass per batch before the next begins
