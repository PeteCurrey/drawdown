# DRAWDOWN TRADING — MARKET DATA RELIABILITY & DATA-HEALTH SYSTEM

**Authoritative System Specification**  
**Version:** 1.0 (Production Data Health Layer)  
**Implementation Phase:** Prompt 12  
**Status:** ACTIVE IN PRODUCTION  

---

## 1. Core Principle

> **THE PLATFORM MUST KNOW WHETHER ITS DATA IS LIVE, RECENT, STALE, UNAVAILABLE, OR ERROR.**  
> A page rendering data successfully does not mean the data is reliable.  
> Under no circumstances may stale or synthetic fallback data be silently masqueraded as live verified data.

---

## 2. Market Data Source Inventory

| Source Provider | Datasets / Asset Classes | Auth Mechanism | Endpoints Used | Consumers | Cache / DB |
|---|---|---|---|---|---|
| **Twelve Data** | Live quotes, OHLCV candles, technical indicators (RSI, EMA, ATR, MACD, BBands, Stoch, CCI) for Forex, Indices, Commodities, Crypto | `TWELVE_DATA_KEY` (Key rotation) | `/quote`, `/time_series`, `/rsi`, `/ema`, `/atr`, `/macd`, `/bbands`, etc. | Run My Trade, Position Sizer, Scanner, Backtester, Alert Cron | `price_cache`, `market_data_cache` |
| **Yahoo Finance** | Live spot quotes, previous close, 60-day daily charts (28 instruments) | Public v8 Chart API | `/v8/finance/chart/{symbol}?interval=1d&range=60d` | `/api/market-data/[symbol]`, Scanner, Update-Prices cron | None (Direct proxy / fallback) |
| **Frankfurter** | Real-time foreign exchange cross-rates (USD, GBP, EUR, AUD, CAD, JPY, CHF, SGD, HKD) | Public API | `/v1/latest?from=...&to=...` | Position Sizer, `/api/market-data` currency conversion | In-memory / stateless |
| **Finnhub** | Macroeconomic calendar, earnings calendar, technical chart patterns | `FINNHUB_API_KEY` | `/calendar/economic`, `/calendar/earnings`, `/scan/pattern` | Market Intelligence, Daily Briefings, Economic Calendar | `market_data_cache` |
| **CoinGecko** | Crypto spot prices (BTC, ETH, SOL, XRP) | Public v3 API | `/simple/price` | `/api/market-data` fallback for crypto | In-memory / stateless |
| **MyFXBook / Web Scraper** | Retail positioning percentages (Long % vs. Short %) | Server-side API / Scraper | `/api/intelligence/retail-sentiment/[symbol]` | Technical Scanner Fundamentals tab | Stateless |
| **Glassnode / On-Chain** | Crypto MVRV, Exchange Net Flows | `GLASSNODE_API_KEY` | Provider interface | Signal Centre, Intelligence | Provider simulation / live |
| **Autochartist / Trading Central** | Pattern recognition and analyst consensus | `AUTOCHARTIST_API_KEY`, `TRADING_CENTRAL_API_KEY` | Provider interface | Signal Centre | Provider simulation / live |

---

## 3. Authoritative Sources & Precedence

1. **Tick Quotes & Live Prices:**
   - Primary Authoritative: **Twelve Data** (`/quote`)
   - Secondary Fallback: **Yahoo Finance** (`/v8/finance/chart`)
   - Tertiary Conversion: **Frankfurter** (FX cross-rates) and **CoinGecko** (Crypto spot)
   - Disconnected State: **`UNAVAILABLE`** (Zero fake quotes; calculation tools accept manual entry).
2. **Historical OHLCV Time-Series:**
   - Primary Authoritative: **Twelve Data** (`/time_series`)
   - Disconnected State: **`UNAVAILABLE`** (Synthetic fallback generation is explicitly tagged with `is_synthetic: true` and response header `x-is-synthetic: true`; cached for maximum 60 seconds to allow immediate live recovery).
3. **Macroeconomic & Corporate Calendars:**
   - Primary Authoritative: **Finnhub**
   - Disconnected State: **`EMPTY`** (Empty calendar array; never fabricated).
4. **Retail Positioning Sentiment:**
   - Primary Authoritative: **Live Sentiment API**
   - Disconnected State: **`FEED OFFLINE`** (UI explicitly badges sentiment as offline; does not present mock percentages as verified data).

---

## 4. Semantic Dataset-Aware Freshness Model

Freshness is evaluated semantically based on the intended refresh cycle of each specific dataset:

| Dataset Type | Intended Refresh | LIVE Window | RECENT Window | STALE Window | UNAVAILABLE Threshold |
|---|---|---|---|---|---|
| **Tick / Real-Time Quotes** | 10 – 30s | $< 60\text{s}$ | $1\text{m} - 5\text{m}$ | $5\text{m} - 15\text{m}$ | $> 15\text{m}$ |
| **Intraday Candles (1m – 15m)** | 1 – 15m | $< 15\text{m}$ | $15\text{m} - 1\text{h}$ | $1\text{h} - 3\text{h}$ | $> 3\text{h}$ |
| **Hourly Candles (1h – 4h)** | 1 – 4h | $< 4\text{h}$ | $4\text{h} - 12\text{h}$ | $12\text{h} - 24\text{h}$ | $> 24\text{h}$ |
| **Daily Candles (1D)** | 24h | $< 26\text{h}$ | $26\text{h} - 72\text{h}$ (weekend) | $72\text{h} - 96\text{h}$ | $> 96\text{h}$ |
| **Economic Calendar** | Daily / Weekly | $< 24\text{h}$ | $24\text{h} - 72\text{h}$ | $3\text{d} - 7\text{d}$ | $> 7\text{d}$ |
| **Earnings Calendar** | Daily / Weekly | $< 24\text{h}$ | $24\text{h} - 72\text{h}$ | $3\text{d} - 14\text{d}$ | $> 14\text{d}$ |
| **Daily Market Brief** | 24h | $< 26\text{h}$ | $26\text{h} - 36\text{h}$ | $36\text{h} - 48\text{h}$ | $> 48\text{h}$ |
| **Retail Sentiment** | 1 – 4h | $< 2\text{h}$ | $2\text{h} - 6\text{h}$ | $6\text{h} - 24\text{h}$ | $> 24\text{h}$ |
| **SEC / Regulatory Filings** | Daily / Periodic | $< 24\text{h}$ | $24\text{h} - 72\text{h}$ | $3\text{d} - 30\text{d}$ | $> 30\text{d}$ |

---

## 5. Time-Series Validation Rules

Implemented in `src/lib/market-data-health.ts:validateTimeSeries()`:
1. **Chronological Monotonicity:** Each bar's timestamp must strictly follow the preceding bar ($t_i \ge t_{i-1}$).
2. **Duplicate Detection:** Zero duplicate timestamps permitted within a single series.
3. **Future Timestamps:** Rejects timestamps more than 2 minutes in the future (permitting minor NTP clock drift).
4. **Mathematical OHLC Integrity:**
   - $\text{High} \ge \text{Low}$ (Strict violation flags `hasInvertedOHLC`).
   - $\text{High} \ge \text{Open}$ and $\text{High} \ge \text{Close}$.
   - $\text{Low} \le \text{Open}$ and $\text{Low} \le \text{Close}$.
5. **Non-Positive Prices:** Prices $\le 0$ or `NaN` are flagged and rejected.

---

## 6. Cache Architecture & Staleness Prevention

- **Database Cache Tables:**
  - `market_data_cache`: Stores JSON payloads with `expires_at` timestamp.
  - `price_cache`: Stores latest calculated quotes and indicators.
- **Cache Staleness Boundary in `useMarketCache.ts`:**
  - Rows read from `price_cache` with `fetched_at` older than 15 minutes are flagged as `STALE` and are not accepted as resolved hits. The hook falls back to requesting a live refresh from `/api/market-data`.
- **Synthetic Fallback TTL:**
  - Synthetic historical candles in `market.ts` are cached for **60 seconds maximum** (previously 24 hours), ensuring that once Twelve Data connectivity is restored, the platform immediately begins serving authentic market candles.

---

## 7. Consumer Map & Flow

```
Twelve Data / Yahoo / Finnhub / Frankfurter
                │
                ▼
        [API Routes & Cron]
    (/api/market-data, /api/cron/update-prices)
                │
                ▼
      [market_data_health.ts]
 (evaluateDatasetFreshness, validateTimeSeries)
                │
                ▼
  [Supabase Cache: price_cache & market_data_cache]
                │
                ▼
       [Frontend Consumers]
 ├── Run My Trade (checks feed status, allows manual override)
 ├── Position Sizer (checks live price, accepts custom input)
 ├── Technical Scanner (displays LIVE or FEED OFFLINE badges)
 ├── Strategy Backtester (rejects synthetic data or warns user)
 └── The Wire & Daily Briefs (displays STALE banner if > 24h)
```

---

## 8. Operational Monitoring Endpoint

- **Route:** `GET /api/health/market-data`
- **Security:** Public-safe operational endpoint. Redacts all API keys, internal tokens, and provider credentials.
- **Output:** Returns JSON status (`HEALTHY` or `DEGRADED`), server timestamp, and an array of `MarketDataHealthRecord` items for all primary providers and database cache tables.
