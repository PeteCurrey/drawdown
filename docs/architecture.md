# Drawdown Platform Architecture

Last Updated: September 2026 (Prompt 02 Remediation)

## 1. Core Principles

- **Truth Before Features**: The platform must never manufacture trading accounts, account balances, drawdown figures, trading performance, signals, market intelligence, third-party intelligence, sentiment, analyst consensus, or historical performance.
- **Explicit Unknowns**: If data does not exist or a provider is not connected, the UI must render an honest empty or unavailable state (`DataState: empty | unavailable | stale | error`).
- **Data Integrity Over Continuity**: It is strictly preferable to show "No account connected" or "No signals today" than to show fabricated numbers or synthetic third-party pattern matches.

---

## 2. Daily Intelligence Architecture

Two tables historically existed for daily intelligence:

1. `daily_briefs`: Legacy table originally created for email newsletter distribution. It contains 0 rows in production.
2. `daily_briefings`: Authoritative production table generated daily at 06:00 UTC by `/api/cron/daily-report`.

### Reading Standard
- The dashboard (`/dashboard/page.tsx`), Daily Report Intelligence view (`/dashboard/intelligence/daily-report/page.tsx`), and homepage excerpts (`PetesDailyTakeExcerpt.tsx`) read strictly from `daily_briefings`.
- If `macro_narrative` is empty or absent, widgets display an honest empty state or are hidden entirely.

---

## 3. Market Data Providers & Status

Provider connectivity is tracked in `src/config/product-status.ts` under `PROVIDER_STATUS`.

| Provider | Purpose | Status | Key Configured |
|----------|---------|--------|----------------|
| **Twelve Data** | Real-time & historical quotes, FX/indices candles | CONNECTED | `TWELVE_DATA_KEY` |
| **Finnhub** | Market news, economic calendar events | CONNECTED | `FINNHUB_API_KEY` |
| **TAAPI** | Technical indicator calculations (RSI, MACD, ATR, Bollinger) | CONNECTED | `TAAPI_API_KEY` |
| **CoinGecko** | Public crypto price feeds | CONNECTED | Public API |
| **Binance** | Public crypto order book & price feeds | CONNECTED | Public API |
| **FRED** | Federal Reserve macro data | CONNECTED | `FRED_API_KEY` |
| **EIA** | Energy Information Administration data | CONNECTED | `EIA_API_KEY` |
| **Polygon** | Financial market data | CONNECTED | `POLYGON_API_KEY` |
| **Anthropic (Claude)** | Daily report narrative & DCS signal consensus | CONNECTED | `ANTHROPIC_API_KEY` |
| **OpenAI (GPT-4o)** | DCS signal consensus | CONNECTED | `OPENAI_API_KEY` |
| **xAI (Grok)** | DCS signal consensus | CONNECTED | `XAI_API_KEY` |
| **Autochartist** | Pattern recognition | NOT_CONNECTED | None (simulator removed) |
| **Trading Central** | Panoramic consensus | NOT_CONNECTED | None (simulator removed) |
| **Glassnode** | On-chain crypto analytics | NOT_CONNECTED | None (simulator removed) |
| **CryptoQuant** | On-chain crypto analytics | NOT_CONNECTED | None (simulator removed) |

### Provider Availability Contract
- When an API key is absent, providers return `{ status: "NOT_CONNECTED", provider: "...", message: "..." }`.
- Under no circumstances does the system manufacture synthetic data to emulate a disconnected third party.

---

## 4. Signal Freshness Model

Signals are evaluated against per-timeframe freshness thresholds defined in `src/lib/freshness.ts`:

- **15M**: Freshness window of 2 hours
- **1H**: Freshness window of 4 hours
- **4H**: Freshness window of 12 hours
- **1D**: Freshness window of 48 hours

Signals older than their threshold are flagged as `stale` in the UI and deactivated automatically by `/api/signals/scan`.

---

## 5. Drawdown Consensus Score (DCS) Methodology

The Drawdown Consensus Score aggregates evaluations from three independent LLMs evaluating identical technical indicator bundles:
- Claude (40% weight)
- GPT-4o (35% weight)
- Grok (25% weight)

**Weights are fixed heuristics**, not derived from backtested signal accuracy. The marketing and technical documentation reflects this accurately.
