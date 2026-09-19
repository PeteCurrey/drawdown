# UI Audit — Drawdown Home Page
*Generated: 2026-09-18. Read-only investigation. No code changed.*

---

## 1. Render Order — Home Page Sections

Source: `src/app/(marketing)/page.tsx`

| # | Component | File path | Lines |
|---|-----------|-----------|-------|
| 0 | `<Navigation />` | `src/components/layout/Navigation.tsx` | 645 |
| 1 | `<HeroSection />` | `src/components/home/HeroSection.tsx` | 186 |
| 2 | `<PriceTicker />` | `src/components/home/PriceTicker.tsx` | 200 |
| 3 | `<MacroIntelligenceStrip />` | `src/components/home/MacroIntelligenceStrip.tsx` | 156 |
| 4 | `<FragmentedProblemSection />` | `src/components/home/FragmentedProblemSection.tsx` | 161 |
| 5 | `<OperatingLoopSection />` | `src/components/home/OperatingLoopSection.tsx` | 214 |
| 6 | `<RunMyTradeShowcase />` | `src/components/home/RunMyTradeShowcase.tsx` | 471 |
| 7 | Inline `<section>` — "No Lambos. No Beach Photos." | `src/app/(marketing)/page.tsx` L.154–189 | 36 (inline) |
| 8 | `<ScrollQuoteSection />` | `src/components/home/ScrollQuoteSection.tsx` | 160 |
| 9 | `<MarketPulse />` | `src/components/home/MarketPulse.tsx` | 447 |
| 10 | `<CurriculumSection />` | `src/components/home/CurriculumSection.tsx` | 254 |
| 11 | `<HorizontalScrollSection />` | `src/components/home/HorizontalScrollSection.tsx` | 127 |
| 12 | `<InstitutionalPulseSection />` | `src/components/home/InstitutionalPulseSection.tsx` | 365 |
| 13 | `<InstitutionalConsensusSection />` | `src/components/home/InstitutionalConsensusSection.tsx` | 297 |
| 14 | `<MarketCallPromoSection />` | `src/components/home/MarketCallPromoSection.tsx` | 126 |
| 15 | `<GlobalFluxSection />` | `src/components/home/GlobalFluxSection.tsx` | 190 |
| 16 | `<TradingViewSection />` | `src/components/home/TradingViewSection.tsx` | 210 |
| 17 | `<BrokerSection />` | `src/components/home/BrokerSection.tsx` | 269 |
| 18 | `<PricingSection />` | `src/components/home/PricingSection.tsx` | 456 |
| 19 | `<Footer />` | `src/components/layout/Footer.tsx` | 224 |

**Additional sub-components rendered inside home sections:**

- `TelemetryGrid` — `src/components/ui/TelemetryGrid.tsx` (inside `HeroSection`)
- `AnimatedMetric` — `src/components/ui/AnimatedMetric.tsx` (inside `RunMyTradeShowcase`)

---

## 2. Styling System

### 2a. Tailwind Configuration

This project uses **Tailwind CSS v4** (PostCSS plugin — `@tailwindcss/postcss ^4`). There is **no `tailwind.config.js` or `tailwind.config.ts`**. The entire configuration lives in `src/app/globals.css` inside an `@theme {}` block (L.4–40) and `:root {}` blocks.

```css
/* globals.css L.4–40 */
@theme {
  --color-accent:    var(--tool-accent, #F9771D);
  --color-profit:    #18B880;
  --color-loss:      #CE6969;
  --color-warning:   #F9771D;
  --color-premium:   #F9771D;
  --font-display:    'Outfit', ui-sans-serif, system-ui;
  --font-sans:       'Outfit', ui-sans-serif, system-ui;
  --font-mono:       var(--font-mono), ui-monospace, monospace;
  --ease-premium:    cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 2b. CSS Custom Properties — Token Inventory

All homepage tokens are declared in `src/app/globals.css` `:root {}` (L.42–162). No separate theme file.

#### Phase 1 Institutional Palette (homepage canonical tokens)

| Token | Hex value | Purpose | Home files using it |
|-------|-----------|---------|---------------------|
| `--ink-950` | `#0B0E12` | Primary text / near-black | 16 of 19 home component files |
| `--paper-0` | `#FAFAF9` | Primary background — warm off-white | 15 of 19 home component files |
| `--paper-100` | `#F1F0EE` | Panel / section background | ~12 of 19 home component files |
| `--graphite-600` | `#4B5157` | Secondary text, captions, metadata | ~14 of 19 home component files |
| `--line-200` | `#DDDBD7` | Hairline rule / border (1 px only) | Every home component file |
| `--signal-navy` | `#16213E` | Brand accent: CTAs, active states, links | 12 home files |
| `--risk-amber` | `#B8752E` | Risk/warning states ONLY — never decorative | `PricingSection.tsx` L.268 only |

#### Market Colour Tokens (`.marketing` CSS scope, `globals.css` L.599–632)

These tokens are only active when a DOM ancestor has `class="marketing"`. Home section components reference them via Tailwind utility classes (`text-mkt-grn` etc.) and `style` prop `var(--mkt-grn)` references.

| Token | Value | Files referencing it |
|-------|-------|---------------------|
| `--mkt-grn` | `#16A34A` | `MacroIntelligenceStrip`, `InstitutionalPulseSection`, `InstitutionalConsensusSection`, `GlobalFluxSection`, `MarketPulse` |
| `--mkt-red` | `#DC2626` | Same as above |
| `--mkt-amb` | `#D97706` | `InstitutionalPulseSection`, `InstitutionalConsensusSection` |
| `--mkt-gbg` | `#F0FDF4` | `MacroIntelligenceStrip`, `InstitutionalConsensusSection`, `InstitutionalPulseSection`, `GlobalFluxSection` |
| `--mkt-rbg` | `#FEF2F2` | `InstitutionalPulseSection`, `InstitutionalConsensusSection` |
| `--mkt-gbd` | `#BBF7D0` | `GlobalFluxSection`, `InstitutionalConsensusSection` |
| `--mkt-rbd` | *(implied)* | `InstitutionalPulseSection`, `InstitutionalConsensusSection` |

> **Gap:** The `<body>` in the marketing layout does not carry `class="marketing"`. The `--mkt-*` tokens resolve to `undefined` at the home section level unless a parent wrapper applies the class. Tailwind utilities like `text-mkt-grn` will silently render as empty/transparent if the scope is absent.

#### Hardcoded Hex Colours (bypassing the token system)

| Value | Location(s) | Usage |
|-------|------------|-------|
| `#FFFFFF` | `MacroIntelligenceStrip`, `RunMyTradeShowcase`, `FragmentedProblemSection`, `OperatingLoopSection`, `HeroSection`, `PricingSection` | Surface backgrounds, inline `style` props |
| `#FAFAF9` | `HeroSection`, `PricingSection`, `BrokerSection` | CTA text colour on dark backgrounds |
| `#18B880` | `PriceTicker.tsx` L.153 | Positive change colour (hardcoded, not `--mkt-grn`) |
| `#CE6969` | `PriceTicker.tsx` L.153 | Negative change colour (hardcoded, not `--mkt-red`) |
| `#2962FF` | `GlobalFluxSection.tsx` L.21 | TradingView SVG logo fill |
| `#b6f900` | `TradingViewSection.tsx` L.127, L.139 | Neon green CTA + bullet dots |
| `#a5df00` | `TradingViewSection.tsx` L.139 | Hover state for neon green CTA |
| `#E2B755` | `CurriculumSection.tsx` L.12, L.195–217 | Gold accent for Institutional Accelerator callout |
| `#C59235` | `CurriculumSection.tsx` L.226 | Gradient end of Accelerator CTA button |
| `#E30613` | `BrokerSection.tsx` L.36 | IG broker brand hover border |
| `#F03C3C` | `BrokerSection.tsx` L.41 | tastyfx broker brand hover border |
| `#050505` | `TradingViewSection.tsx` L.85 | Full dark section background |
| `#131722` | `TradingViewSection.tsx` L.167 | TradingView chart header bar |
| `#0c0c0e` | `TradingViewSection.tsx` L.166 | Chart container background |
| `#1A1A1A` | `MarketCallPromoSection.tsx` L.98 | Section heading colour |
| `rgba(239,68,68,0.02)` | `FragmentedProblemSection.tsx` L.60 | Red-tinted fragmented panel background |
| `rgba(15,23,42,0.025)` | `OperatingLoopSection.tsx` L.125 | Execute stage card tinted background |

#### Radius Token Inventory

Declared in `globals.css` L.69–72. The homepage sections largely override these with `borderRadius: 0` inline — "square corners" is the design language.

| Token | Value | Used in |
|-------|-------|---------|
| `--radius-control` | `5px` | `HeroSection` (CTA badge), `RunMyTradeShowcase` (buttons via Tailwind `rounded-[5px]`) |
| `--radius-sub` | `6px` | `HeroSection`, `OperatingLoopSection`, `RunMyTradeShowcase` |
| `--radius-card` | `8px` | `FragmentedProblemSection`, `OperatingLoopSection`, `RunMyTradeShowcase` metric cards |
| `--radius-panel` | `10px` | `RunMyTradeShowcase` outer shell |
| `0` / `borderRadius: 0` | n/a | All section cards: `InstitutionalPulseSection`, `InstitutionalConsensusSection`, `GlobalFluxSection`, `MarketCallPromoSection`, `BrokerSection`, `PricingSection`, `CurriculumSection`, `HorizontalScrollSection` |
| `rounded-full` | `9999px` | Pulse/status dots in `HeroSection`, `TradingViewSection`, `PriceTicker` |

### 2c. Fonts

Loaded in `src/app/layout.tsx` via `next/font/google`:

| Font | CSS variable | Weights | Used as |
|------|-------------|---------|---------|
| **Outfit** | Google CDN `@import` in globals.css | 300–700 | `--font-display` + `--font-sans` in `@theme` — dominant display + body font across all home sections |
| **Syne** | `--font-syne` | 400–800 | Prose headings in course module content only |
| **DM Sans** | `--font-dm-sans` | 400, 500 | Misc / legacy; not directly referenced in home components |
| **JetBrains Mono** | `--font-mono` | 400, 500 | Primary monospace — resolves `font-mono` Tailwind utility for all `font-mono` class usages |
| **Geist** | `--font-geist` | auto | Referenced in `.marketing` CSS scope only |
| **Geist Mono** | `--font-geist-mono` | auto | Referenced in `.marketing` CSS scope only |
| **IBM Plex Mono** | `--font-ibm-mono` | 400–700 | Declared but not directly used as `font-mono` on home page (commented as "IBM Plex Mono" in design docs, but `--font-mono` maps to JetBrains Mono) |
| **IBM Plex Sans** | `--font-ibm-sans` | 300–700 | Declared; not directly used in home component class names |

**Effective fonts on the rendered home page:**
- Display / heading (`font-display`): **Outfit**
- Body (`font-sans`): **Outfit**
- Monospace (`font-mono`): **JetBrains Mono**

---

## 3. Animation Libraries

### 3a. Installed

| Library | Version (`package.json`) | Purpose |
|---------|--------------------------|---------|
| `framer-motion` | `^12.38.0` | React animation primitives (`motion.*`, `AnimatePresence`) |
| `gsap` | `^3.14.2` | Scroll-triggered animations, counter increments, ticker sync |
| `lenis` | `^1.3.21` | Smooth-scroll inertia |

### 3b. Applied Locations — framer-motion

| Component | File | Lines | What it does |
|-----------|------|-------|-------------|
| `HeroSection` | `HeroSection.tsx` | L.4, 62–179 | `motion.div` / `motion.h1` / `motion.p` staggered `fadeUp` entry: eyebrow, headline, sub-headline, CTA buttons, trust signals. `useReducedMotion()` sets all `y` to 0 and `opacity` to 1 when OS preference is on. |
| `PriceTicker` | `PriceTicker.tsx` | L.4 | `useReducedMotion()` only — pauses CSS marquee animation via class toggling. |
| `ScrollQuoteSection` | `ScrollQuoteSection.tsx` | L.4 | `useReducedMotion()` only — skips word-illumination scroll animation. |
| `Navigation` | `Navigation.tsx` | L.33 | `motion` + `AnimatePresence` — mega-menu dropdown open/close transitions. |

### 3b. Applied Locations — GSAP

None of the currently-rendered home sections import GSAP directly. GSAP runs on the home page **only via the global `SmoothScroll` provider**:

| File | Lines | Usage |
|------|-------|-------|
| `src/components/providers/SmoothScroll.tsx` | L.6–34 | `gsap.registerPlugin(ScrollTrigger)`, `gsap.ticker.add(update)` — syncs Lenis scroll position into GSAP's ticker so that `ScrollTrigger`-powered components on other routes work. On the home page this manifests as smooth-scroll inertia; no GSAP animations are triggered directly. |

GSAP is imported in other `home/` files (`StatsBar`, `PhasePreview`, `FeatureShowcase`, `ProblemSection`) but **none of those are in the current home page render tree**.

### 3c. Applied Locations — Lenis

| File | Lines | Usage |
|------|-------|-------|
| `src/components/providers/SmoothScroll.tsx` | L.3, 11–17 | `ReactLenis` wraps the app globally (mounted in `layout.tsx`). `useLenis()` scrolls page to top (instant) on route change. |

### 3d. CSS-Native Animations on the Home Page

| Animation | Defined in | Applied on home page |
|-----------|-----------|---------------------|
| Marquee ticker | `PriceTicker.tsx` inline `<style>` | `PriceTicker` — 40 s infinite horizontal scroll. Disabled by `useReducedMotion`. |
| `animate-pulse` | Tailwind built-in | `HeroSection` eyebrow dot (L.74), `PriceTicker` live status dot (L.117), `MacroIntelligenceStrip` REAL-TIME dot (L.51), `TradingViewSection` LIVE dot (L.169) |
| `.animate-in .fade-in` | `globals.css` L.442–448 | `MarketCallPromoSection` instrument cards (L.64) |
| Word illumination | `ScrollQuoteSection.tsx` inline `<style>` + rAF | Scroll-driven colour transition on individual words in the founder quote. Skipped when `useReducedMotion` is true. |
| `transition-all` / `duration-300` | Tailwind | Hover state transitions on every section card (`InstitutionalConsensusSection`, `GlobalFluxSection`, `BrokerSection`, `CurriculumSection`, `MarketCallPromoSection`) |

---

## 4. Hardcoded / Sample / Mock Data Rendered to the Public Page

### 4a. Price Ticker — `PriceTicker.tsx`

**Fallback / demo values at L.21–29:**

```ts
const sampleItems = [
  { symbol: "GBPUSD", price: "1.2714",    change: "+0.18%" },
  { symbol: "EURUSD", price: "1.0862",    change: "-0.09%" },
  { symbol: "USDJPY", price: "157.34",    change: "+0.22%" },
  { symbol: "EURGBP", price: "0.8545",    change: "-0.12%" },
  { symbol: "XAUUSD", price: "2,338.40",  change: "+0.41%" },
  { symbol: "US500",  price: "5,471.05",  change: "+0.33%" },
  { symbol: "BTCUSD", price: "67,240.00", change: "-0.88%" },
];
```

**Live source:** `GET /api/market/prices?symbols=GBPUSD,EURUSD,...` polled every 30 s.

When the API call is in-flight (first client render), `sampleItems` are shown with badge **"Sample Data"** and a grey status dot, and footer text reads "Not Live — For Illustration Only". When live data arrives, the badge switches to **"Prices Delayed 60s"** (green pulse dot) and footer reads "Institutional Price Feeds". The fallback is also used permanently if the API returns an empty array.

---

### 4b. Plan My Trade Calculator — `RunMyTradeShowcase.tsx`

**Default state at mount:**

| Parameter | Default | Source |
|-----------|---------|--------|
| Instrument | GBPUSD | Hardcoded `selectedKey` L.36 |
| Direction | LONG | Hardcoded `direction` L.37 |
| Account size | £25,000 | Hardcoded `accountSize` L.38 |
| Risk % | 1.0% | Hardcoded `riskPercent` L.39 |
| Pip value | £7.80 / pip | Hardcoded constant `pipValueStandardLot = 7.8` at L.58 |

**Preset price levels (not live, hardcoded at L.27–33):**

| Instrument | Entry | Stop | Target |
|------------|-------|------|--------|
| GBPUSD | 1.2850 | 1.2810 | 1.2950 |
| EURUSD | 1.0820 | 1.0790 | 1.0895 |
| XAUUSD | 2920.0 | 2905.0 | 2965.0 |
| US500 | 5850.0 | 5820.0 | 5940.0 |
| BTCUSD | 68500 | 67100 | 72000 |

**Status:** Entirely **not wired to any live source**. Pure client-side arithmetic. Terminal header at L.139 reads `PLAN_MY_TRADE // SAMPLE DATA · CALCULATOR ONLY`. Footnote at L.451: "Sample data · For planning purposes only".

---

### 4c. Sentiment Percentages — `InstitutionalPulseSection.tsx`

**Live sources:** `GET /api/market/sentiment` + `GET /api/market/consensus`

Bullish %, bearish %, and neutral % shown in the donut ring are derived from:
- `sentiment.fearGreed` (fallback: `50` if API fails)
- `sentiment.vix` (fallback: `15` if API fails)

If **both APIs fail**, a `WifiOff` offline state is rendered — no fabricated percentages are displayed.

If **APIs succeed**, values are live (Crypto Fear & Greed Index + VIX).

---

### 4d. Consensus Ratios — `InstitutionalConsensusSection.tsx`

**Live sources:** `GET /api/market/consensus` + `GET /api/market/prices?symbols=GBPUSD,XAUUSD,EURUSD,BTCUSD`

**Hardcoded fallback consensus scores rendered when `/api/market/consensus` returns an empty array (L.96–102):**

```ts
GBPUSD → score: 74, verdict: "Buy",        rsi: "56.4", trend: "Bullish"
XAUUSD → score: 82, verdict: "Strong Buy", rsi: "56.4", trend: "Bullish"
EURUSD → score: 58, verdict: "Buy",        rsi: "56.4", trend: "Bullish"
BTCUSD → score: 58, verdict: "Buy",        rsi: "56.4", trend: "Bullish"
```

A secondary fallback at L.168–174 fires per-card if `activeConsensus` doesn't contain the symbol:
```ts
{ score: 65, verdict: "Buy", rsi: "54.0", trend: "Bullish" }
```

**No "sample data" label is shown when fallback scores are active.** The buy/sell ratio progress bars will silently display 74%/26%, 82%/18% etc. based on hardcoded scores.

`ASSET_CONFIG` also declares `fallbackPrice` / `fallbackChange` values (L.21–57) but these are **never rendered** — the template shows `"--"` for null/NaN prices (see §5).

---

### 4e. Global Flux Sparklines — `GlobalFluxSection.tsx`

**Live source:** `GET /api/market/polygon-snapshot?symbols=GBPUSD,EURUSD,XAUUSD,BTCUSD`

Each mini-chart card (4 cards: GBP/USD, EUR/USD, Gold, BTC/USD) shows:
- **Price:** `priceData.price` from Polygon, or `"--"` if not yet loaded
- **Change %:** `priceData.changePercent.toFixed(2)%`, or `"0.00%"` as fallback (see §5)
- **Sparkline chart:** Always live via TradingView `embed-widget-mini-symbol-overview.js` (1D, light theme)

Label below the symbol reads `Polygon.io Feed` confirming the intended live source.

---

### 4f. MarketCallPromoSection — Instrument Cards

**Hardcoded at L.7–12, never fetched:**

```ts
{ symbol: "GBP/USD", drift: "Bullish", indicator: "▲ +0.32%" }
{ symbol: "XAU/USD", drift: "Bullish", indicator: "▲ +1.15%" }
{ symbol: "UK100",   drift: "Bearish", indicator: "▼ -0.42%" }
{ symbol: "BTC/USD", drift: "Bullish", indicator: "▲ +2.60%" }
```

The `indicator` field (containing `"▲ +0.32%"` etc.) is declared but **not rendered in the JSX** (template renders only `symbol`, `type`, `drift`). The `drift` labels ("Bullish"/"Bearish") are fully hardcoded — no API source.

---

### 4g. MacroIntelligenceStrip — `MacroIntelligenceStrip.tsx`

**Live source:** `GET /api/macro/indicators` polled every 60 s. Attribution label in the UI: "FRED® & EIA® Feeds".

No hardcoded fallback values. If the API fails or returns empty, the component stays in loading skeleton state (6 pulse skeletons) while `loading: true`, then renders an empty grid on failure. No error message displayed.

---

### 4h. MarketPulse — `MarketPulse.tsx`

**News feed:** `GET /api/news/feed` (Sky News, CNN, Fox News, BBC aggregation)
**Top Movers:** `GET /api/market/prices?symbols=EURUSD,GBPUSD,BTCUSD` polled every 30 s.
**Economic Calendar:** TradingView Events Widget via injected `embed-widget-events.js` (always live).

---

### 4i. PricingSection — Server-side Data

`page.tsx` L.61–81 performs a server-side Supabase query to fetch:
- `floorCap` — maximum Floor tier members (database value)
- `activeFloorSubs` — count of active `profiles` rows with `subscription_tier = 'floor'`

These are passed as props to `<PricingSection floorCap={...} activeFloorSubs={...} />`. Defaults in the component signature: `floorCap = 15`, `activeFloorSubs = 0`.

**Status:** Live — sourced from Supabase `profiles` table at request time. The fallback `floorCap = 15` renders if the query fails.

---

## 5. Empty-State Values in Production

### `"--"` (double-dash)

| Location | File | Line | Source API | Why empty |
|----------|------|------|-----------|-----------|
| Price ticker (sample mode) | `PriceTicker.tsx` | L.118 (status badge) | `/api/market/prices` | On first client render before `useEffect` fetch completes. Clears within ~1 s on live connection. |
| GlobalFlux price | `GlobalFluxSection.tsx` | L.86 | `/api/market/polygon-snapshot` | Before API responds, or if API fails. No timeout or retry; persists indefinitely on failure. |
| InstitutionalConsensus price | `InstitutionalConsensusSection.tsx` | L.236 | `/api/market/prices` | Shown during `loading && !priceItem`. `formatPrice()` also returns `"--"` for null/NaN after load. |
| InstitutionalConsensus change % | `InstitutionalConsensusSection.tsx` | L.245 | `/api/market/prices` | `changePercent` is `null` until the API responds or if response is malformed. |
| MarketPulse top movers price | `MarketPulse.tsx` | L.403–404 | `/api/market/prices` | Initial state populates `TOP_MOVER_SYMBOLS` without a `price` field. `hasData` = false. `displayPrice` stays `"--"` until the 30 s poll resolves. |

### `"0.00%"` (zero percent)

| Location | File | Line | Source API | Why empty |
|----------|------|------|-----------|-----------|
| GlobalFlux change % | `GlobalFluxSection.tsx` | L.90 | `/api/market/polygon-snapshot` | `{priceData ? ... : "0.00%"}` — literal fallback rendered when `priceData` is undefined. Implies "no change" rather than "unknown". Potentially misleading to users. |

### `"----"` (four dashes)

Not found in any currently-rendered home component.

### Named Empty / Offline States

| Location | File | Display text | Trigger |
|----------|------|-------------|---------|
| InstitutionalPulseSection — signals | `InstitutionalPulseSection.tsx` L.180–186 | "Signals Unavailable" + WifiOff icon | `/api/market/consensus` returns empty or errors |
| InstitutionalPulseSection — donut | `InstitutionalPulseSection.tsx` L.247–252 | "Sentiment Feed Offline" + WifiOff icon | `/api/market/sentiment` returns null or error |
| MarketPulse — news | `MarketPulse.tsx` L.241–247 | "No live world news from Sky News, CNN, Fox News, or BBC available right now. Reconnecting to global feeds..." | `/api/news/feed` fails or returns empty |
| MacroIntelligenceStrip | `MacroIntelligenceStrip.tsx` | *(blank section — no indicator cards, no error text)* | `/api/macro/indicators` fails — components render empty array silently |

---

## 6. Terminal-Style Decorative Text

All instances rendered in JSX on the current home page (not source code comments):

| Text (as rendered) | Component | File | Line |
|--------------------|-----------|------|------|
| `// The Core Problem` | `FragmentedProblemSection` | `src/components/home/FragmentedProblemSection.tsx` | 38 |
| `// The Operating Loop` | `OperatingLoopSection` | `src/components/home/OperatingLoopSection.tsx` | 98 |
| `// LIVE MARKET BRIEFING` | `MarketPulse` | `src/components/home/MarketPulse.tsx` | 196 |
| `// SENTIMENT & TECHNICAL CONSENSUS` | `InstitutionalPulseSection` | `src/components/home/InstitutionalPulseSection.tsx` | 132 |
| `// CHARTING PARTNER` | `TradingViewSection` | `src/components/home/TradingViewSection.tsx` | 93 |
| `// REAL-TIME MACRO INTELLIGENCE` | `MacroIntelligenceStrip` | `src/components/home/MacroIntelligenceStrip.tsx` | 53 |
| `PLAN_MY_TRADE // SAMPLE DATA · CALCULATOR ONLY` | `RunMyTradeShowcase` | `src/components/home/RunMyTradeShowcase.tsx` | 139 |

**In `home/` components that are NOT rendered on the current home page:**

| Text | File | Line |
|------|------|------|
| `SYSTEM_STATUS_ACTIVE // 24.04.18` | `src/components/home/HubPreview.tsx` | 72 |
| `// INSTITUTIONAL CAPITAL` | `src/components/home/PropFirmSection.tsx` | 26 |
| `// ECONOMIC INTELLIGENCE` | `src/components/home/EconomicCalendarWidget.tsx` | 67 |
| `// LIVE MARKET BRIEFING` | `src/components/home/LiveNewsSection.tsx` | 334 |
| `// RECOMMENDED BROKERS` | `src/components/home/BrokerHubPreview.tsx` | 156 |

**`SYS //`, `LATENCY:`, `COORD:`, `NODE_` patterns:** No occurrences found in any home component or layout component.

---

## 7. Emoji and Unicode Glyphs Used as Icons

All occurrences in the **currently-rendered** home page component tree:

| Glyph | Name | File | Line | Context |
|-------|------|------|------|---------|
| `⚠️` | Warning sign + emoji VS16 | `src/components/home/FragmentedProblemSection.tsx` | 97 | Red warning callout: "⚠️ Friction causes execution mistakes…" |
| `✕` | Multiplication X | `src/components/home/FragmentedProblemSection.tsx` | 77 | Fragmented-stack header badge icon |
| `✕` | Multiplication X | `src/components/home/FragmentedProblemSection.tsx` | 85 | Fragmented-tab list item icon |
| `✓` | Check mark | `src/components/home/FragmentedProblemSection.tsx` | 122 | "Connected OS" header badge |
| `✓` | Check mark | `src/components/home/FragmentedProblemSection.tsx` | 130 | Connected-workflow list item icon |
| `★` | Black star | `src/components/home/CurriculumSection.tsx` | 201 | "★ Premium Executive Cohort" Accelerator badge label |
| `✓` | Check mark | `src/components/home/CurriculumSection.tsx` | 211 | "✓ 15-Student Limit" feature item |
| `✓` | Check mark | `src/components/home/CurriculumSection.tsx` | 214 | "✓ Live Audits" feature item |
| `✓` | Check mark | `src/components/home/CurriculumSection.tsx` | 217 | "✓ Tax Compliance Kit" feature item |
| `▲` | Up-pointing triangle | `src/components/home/InstitutionalConsensusSection.tsx` | 243 | Positive price change direction indicator |
| `▼` | Down-pointing triangle | `src/components/home/InstitutionalConsensusSection.tsx` | 243 | Negative price change direction indicator |
| `▲` | Up-pointing triangle | `src/components/home/MarketPulse.tsx` | 414 | Top-movers positive change indicator |
| `▼` | Down-pointing triangle | `src/components/home/MarketPulse.tsx` | 414 | Top-movers negative change indicator |
| `→` | Rightwards arrow | `src/components/home/TradingViewSection.tsx` | 142 | CTA button: "Try TradingView Free →" |
| `→` | Rightwards arrow | `src/components/home/TradingViewSection.tsx` | 199 | Live market pages nav link prefix |
| `·` | Middle dot | `src/components/home/HeroSection.tsx` | 79 | Eyebrow separator: "Trading Operating System · Decision-Support Infrastructure" |
| `·` | Middle dot | `src/components/home/RunMyTradeShowcase.tsx` | 139, 152, 165, 306, 451 | Terminal header + step labels + disclaimer separators |
| `•` (`&bull;`) | Bullet | `src/components/home/MarketPulse.tsx` | 279, 333 | News date/source separator: `{date} • {source}` |

**Glyphs declared in data but NOT currently rendered in JSX:**

| Glyph | File | Line | Note |
|-------|------|------|------|
| `▲ +0.32%` | `MarketCallPromoSection.tsx` | 8–11 | `indicator` field in `INSTRUMENT_CARDS` — field exists in data array but is not used in the JSX template |

**Lucide React icons used (not unicode glyphs but icon library):**

Home sections use `lucide-react ^1.8.0` throughout. Selected instances on the home page:
- `ArrowRight` — `HeroSection`, `CurriculumSection`, `PricingSection`
- `ShieldCheck` — `HeroSection`
- `TrendingUp` / `TrendingDown` — `GlobalFluxSection`, `MarketCallPromoSection`
- `ExternalLink` — `GlobalFluxSection`
- `Award`, `Clock` — `MarketCallPromoSection`
- `TrendingUp`, `Users` — `InstitutionalConsensusSection`
- `HelpCircle` — `InstitutionalConsensusSection`
- `Check` — `BrokerSection`, `PricingSection`
- `ChevronRight` — `BrokerSection`
- `Shield`, `BookOpen`, `Download`, `Cpu`, `ArrowRight` — `PricingSection`
- `Shield`, `Activity`, `History`, `FileText` — `HorizontalScrollSection`
- `Menu`, `X`, `ChevronDown`, `BookOpen`, `Activity`, `TrendingUp`, `Sparkles`, `Terminal`, `Newspaper`, `Award`, `Scale`, `ShieldCheck`, `Globe`, `Zap`, `Scan`, `LineChart`, `Calculator`, `Briefcase`, `GitBranch`, `FileText`, `HelpCircle` — `Navigation`
- `ArrowRight`, `Check` — `Footer`

**Custom inline SVG glyphs (not emoji, not Lucide):**

| Component | Usage |
|-----------|-------|
| `TVLogoMark` (in `GlobalFluxSection.tsx` L.16–26) | Official TradingView logo — custom `<svg>` path |
| `TradingViewLogo` (in `TradingViewSection.tsx` L.8–18) | Same TradingView SVG path, reused |

---

*End of audit. The home page renders 20 sections (positions 0–19 including Navigation and Footer) drawn from 19 distinct component files plus one inline section block in `page.tsx`. No source files were modified during this investigation.*
