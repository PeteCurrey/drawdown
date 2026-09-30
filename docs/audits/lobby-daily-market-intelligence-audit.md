# Avorria Trading — Lobby Daily Market Intelligence Architecture Audit

**Document Version:** 1.0.0  
**Date:** 2026-09-29  
**Platform:** Avorria Trading ([https://avorria.com](https://avorria.com))  
**Auditor:** Antigravity Principal Engineering & Commercial Architecture  
**Status:** Canonical Reference & Architectural Baseline  

---

## 1. Executive Summary & Architectural Scope

The Avorria Trading Lobby (`/lobby`) is the primary public editorial and intelligence front door of the platform. Following the commercial migration to **Avorria Core Membership (£24.99/month)** with the **Prop Firm Survival Kit as a 100% free lead magnet**, the Lobby must serve as a high-authority daily market intelligence terminal.

### Strategic Objective
The objective is to transform `/lobby` from an editorial article list into an Avorria-native, institutional-grade market intelligence terminal combining:
1. **Real-time & EOD Canonical Market Data** (Forex, Indices, Commodities, Crypto).
2. **Retail vs. Institutional Positioning** (Broker sentiment vs. CFTC Commitment of Traders).
3. **Futures Volume & Open Interest** (CME Group reports and daily bulletins).
4. **Options Market Activity & Sentiment** (Cboe Equity & Index Put/Call ratios, VIX term structure).
5. **Crypto Derivatives Metrics** (Binance USDT-M Futures Open Interest and 8-hour Funding Rates).
6. **Macroeconomic Calendar** (High-impact scheduled volatility events with consensus & actuals).
7. **Signal Centre Integration** (Direct hook into `public.signals` with sanitized preview for public visitors).
8. **Automated Daily Market Brief** ("Market in One Minute", generated deterministically via Content OS and verified by the Editorial QA Engine).

### Strict Non-Negotiable Engineering Standard
**Zero Fabricated Data**: Under no circumstances will mock, simulated, or placeholder numbers be rendered in the Lobby. Every single data point must trace to an authoritative source or provider API. When live data is unavailable, markets are closed, or an external feed fails, the UI must explicitly display `UNAVAILABLE`, `MARKET CLOSED`, or `STALE` with a transparent timestamp band pursuant to `src/lib/data-freshness-policy.ts`.

---

## 2. Existing Lobby Inventory & Current State

### Component Hierarchy
- **Route:** `src/app/(marketing)/lobby/page.tsx`
- **Data Fetcher:** `src/lib/lobby.ts` (`fetchLobbyData()`)
- **Key Sub-components:**
  - `LobbyHero.tsx`: Headline editorial lead article from `lobby_articles`.
  - `LobbyTickerTape.tsx`: Embedded TradingView iframe widget (external third-party dependency).
  - `LobbyArticles.tsx`: Categorized grid of published market analysis.
  - `LobbyEventCalendar.tsx`: Renders calendar items from `lobby_events`.
  - `LobbySources.tsx`: Direct links to external primary sources.

### Deficiencies in Current Architecture
1. **External Dependency Risk:** `LobbyTickerTape.tsx` relies on external TradingView scripts which can be blocked by ad blockers and leak user telemetry.
2. **Static/Mock Calendar Data:** `lobby_events` was previously seeded with hardcoded weekday events in `generate-morning/route.ts` instead of consuming live institutional calendar feeds.
3. **Absence of Positioning Datasets:** No CFTC COT data, no retail sentiment aggregates, and no futures open interest tracking exist in the current database schema.
4. **Disconnection from Signal Centre:** The Lobby did not surface active opportunities or recent verified track records from `public.signals`.

---

## 3. Canonical Market Data Pipeline Audit

Avorria Trading operates an authoritative market data pipeline anchored in `src/lib/instruments.ts`:

### Instrument Universe (`INSTRUMENTS_LIST`)
- **Forex Majors:** EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD, USD/CHF, NZD/USD.
- **Indices:** S&P 500 (SPX), Nasdaq 100 (NDX), Dow Jones (DJI), FTSE 100 (UKX), DAX 40 (DAX).
- **Commodities:** Gold (XAU/USD), Silver (XAG/USD), Crude Oil (WTI / BRENT).
- **Crypto:** Bitcoin (BTC/USD), Ethereum (ETH/USD), Solana (SOL/USD).

### Ingestion & Storage Architecture
- **Primary Data Providers:** Twelve Data (`TWELVE_DATA_API_KEY`) and Finnhub (`FINNHUB_API_KEY`) accessed via `src/lib/marketDataService.ts`.
- **Database Cache:** PostgreSQL table `price_cache` (`supabase/migrations/20260719_price_cache.sql`):
  - Stores: `ticker`, `price`, `change_24h`, `change_pct_24h`, `volume`, `rsi`, `ema50`, `ema200`, `high_24h`, `low_24h`, `updated_at`.
- **Freshness Policy (`src/lib/data-freshness-policy.ts`):**
  - `LIVE`: < 15 seconds (Forex/Crypto) or < 60 seconds (Indices/Commodities during cash hours).
  - `RECENT`: < 5 minutes.
  - `STALE`: 5 to 60 minutes.
  - `AGED`: > 60 minutes.
  - `UNAVAILABLE`: Feed connection timeout or missing instrument.

---

## 4. External Provider Licensing & Data Rights Audit

To maintain full compliance and institutional authority, external data sources must be legally licensed, public domain, or accessed via permitted unauthenticated public APIs:

| Data Surface | Authoritative Source | Ingestion Mechanism | Update Frequency | Licensing & Usage Rights |
| :--- | :--- | :--- | :--- | :--- |
| **Institutional Positioning** | CFTC Commitment of Traders (COT) | CFTC Public Socrata API (`data.cftc.gov/resource/6dca-aqww.json`) | Weekly (Fridays 15:30 ET) | US Public Domain. Free for commercial redistribution with attribution. |
| **Futures Volume & OI** | CME Group | Public Daily Settlement & Volume/OI Bulletins | Daily (Post-settlement ~22:00 ET) | Standard settlement prices and published aggregate OI are non-copyrightable facts; explicit attribution required. |
| **Options Sentiment** | Cboe Global Markets | Cboe Daily Market Statistics (`cboe.com/us/options/market_statistics/daily/`) | Daily (EOD) | Cboe aggregate Put/Call ratios (Total, Equity, Index) and VIX closing levels are published public statistics. |
| **Crypto Derivatives** | Binance Futures API | Public REST (`fapi.binance.com/fapi/v1/openInterest` & `fundingRate`) | 8-hour funding / Continuous OI | Public, unauthenticated API; conforms to rate limits and API Terms of Service. |
| **Economic Calendar** | Finnhub / Alpha Vantage / Myfxbook | Primary REST API endpoint | Real-time / Daily sync | Direct commercial API subscription with structured JSON events, forecast, and previous values. |

---

## 5. Signal Centre Reuse & Integration Strategy

Avorria Trading will **not** build a duplicate or disconnected signal engine for the Lobby.

### Reuse Principles
1. **Single Source of Truth:** All signals originate from `public.signals`.
2. **Public Sanitization (`sanitizeSignalForPreview`):** Public visitors on `/lobby` receive:
   - Instrument, Direction (BUY/SELL), Timeframe, Strategy Tag, and Timestamp.
   - Entry Price, Stop Loss, and Take Profit levels are redacted (`null`) until the user upgrades to Avorria Core Membership (£24.99/mo).
3. **Track Record Integrity:** Verified closed trades (`status = 'closed'`) display real net R-multiple and win rate to establish undeniable institutional credibility.

---

## 6. Content OS & Editorial QA Engine Pipeline

All text briefs published to the Lobby must pass through the deterministic Content OS Quality Assurance Engine (`src/lib/content-os/qa-engine.ts`):

### Deterministic QA Rules
1. **FCA Compliance Check:** Mandatory risk warnings must accompany all trade observations. No promise of profit, guarantees, or specific personal investment advice.
2. **Style Enforcer:** Tone must be concise, objective, analytical, and free from sensationalism or hype ("skyrocketing", "to the moon").
3. **Data Verification:** Every asset mention must match a verified entry in `price_cache` or `daily_market_briefs`.

---

## 7. Target Database Schema Migrations

The following tables are established to support the Daily Market Intelligence layer:

### 1. `cot_observations`
```sql
CREATE TABLE IF NOT EXISTS public.cot_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_name TEXT NOT NULL,
    cftc_contract_market_code TEXT NOT NULL,
    as_of_date DATE NOT NULL,
    commercial_long BIGINT NOT NULL,
    commercial_short BIGINT NOT NULL,
    non_commercial_long BIGINT NOT NULL,
    non_commercial_short BIGINT NOT NULL,
    net_non_commercial BIGINT GENERATED ALWAYS AS (non_commercial_long - non_commercial_short) STORED,
    open_interest BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cftc_contract_market_code, as_of_date)
);
```

### 2. `crypto_derivatives_snapshots`
```sql
CREATE TABLE IF NOT EXISTS public.crypto_derivatives_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL, -- e.g. BTCUSDT, ETHUSDT
    open_interest_usd NUMERIC NOT NULL,
    funding_rate NUMERIC NOT NULL,
    predicted_funding_rate NUMERIC,
    long_short_ratio NUMERIC,
    snapshot_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (symbol, snapshot_time)
);
```

### 3. `options_market_snapshots`
```sql
CREATE TABLE IF NOT EXISTS public.options_market_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_date DATE NOT NULL UNIQUE,
    total_put_call_ratio NUMERIC(5,2) NOT NULL,
    equity_put_call_ratio NUMERIC(5,2) NOT NULL,
    index_put_call_ratio NUMERIC(5,2) NOT NULL,
    vix_close NUMERIC(6,2),
    vix_change_pct NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `daily_market_briefs`
```sql
CREATE TABLE IF NOT EXISTS public.daily_market_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_date DATE NOT NULL UNIQUE,
    headline TEXT NOT NULL,
    one_minute_summary TEXT NOT NULL,
    macro_regime TEXT NOT NULL, -- 'Risk-On', 'Risk-Off', 'Cautious / Mixed'
    key_drivers JSONB NOT NULL DEFAULT '[]'::jsonb,
    top_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_catalysts JSONB NOT NULL DEFAULT '[]'::jsonb,
    qa_passed BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Ingestion & Scheduled Cron Pipeline

Ingestion tasks will execute through Cloudflare Scheduler & internal Next.js API cron handlers protected by `CRON_SECRET`:

1. **Daily Market Brief Cron (`/api/cron/daily-brief`):**
   - Runs Monday–Friday at 06:00 UTC.
   - Synthesizes overnight Asia session closes, European open positioning, CFTC COT bias, and calendar catalysts.
   - Evaluates text through `EditorialQAEngine` and commits to `daily_market_briefs`.
2. **CFTC COT Ingestion (`/api/cron/ingest-cot`):**
   - Runs Friday at 21:00 UTC (post-CFTC 15:30 ET release).
   - Ingests Gold, S&P 500, EUR/USD, GBP/USD, and Crude Oil net spec positions.
3. **Crypto Derivatives Sync (`/api/cron/crypto-derivatives`):**
   - Runs every 8 hours (00:00, 08:00, 16:00 UTC) at Binance funding reset.

---

## 9. Phased Implementation Roadmap

- **Phase 1 (Completed):** Architecture audit, schema design, and commercial pricing unification.
- **Phase 2:** Database migration execution (`supabase/migrations/20260929_lobby_market_intelligence.sql`).
- **Phase 3:** External provider adapters (`src/lib/intelligence/cot-provider.ts`, `crypto-derivatives.ts`, `options-sentiment.ts`).
- **Phase 4:** Daily Brief synthesis pipeline with `EditorialQAEngine` validation.
- **Phase 5:** Lobby UI component enhancements (`LobbyMarketPulse.tsx`, `LobbyPositioningMatrix.tsx`, `LobbyDailyBrief.tsx`).
- **Phase 6:** End-to-end integration testing and verification.
