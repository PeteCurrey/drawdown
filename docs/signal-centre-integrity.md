# DRAWDOWN TRADING — SIGNAL CENTRE INTEGRITY & SIGNAL PIPELINE AUDIT

**Authoritative Technical Specification**  
**Version:** 1.0 (Signal Centre Production Integrity)  
**Implementation Phase:** Prompt 13  
**Status:** COMPLETED AUDIT & PRODUCTION VERIFICATION  

---

## 1. Executive Summary

A comprehensive, quantitative, and architectural audit was performed on the Drawdown Trading **Signal Centre** and its end-to-end signal generation pipeline. The Signal Centre operates a multi-model consensus and quantitative confluence engine across a universe of **52 potential signal candidates** ($13 \text{ instruments} \times 4 \text{ timeframes}$).

### Key Findings & Integrity Guardrails:
1. **The "52 Signals" Reality:** The referenced "52 Signals" represents the platform's multi-asset universe matrix: 13 primary instruments (Forex, Indices, Commodities, Crypto) evaluated across 4 sessional timeframes (`15M`, `1H`, `4H`, `1D`). It is an active candidate universe, not 52 discrete algorithms.
2. **Deterministic Geometric Integrity:** All generated setups calculate entry at current close, stop loss at $1.5 \times \text{ATR}$, Target 1 at $1.5 \times \text{ATR}$, Target 2 at $3.0 \times \text{ATR}$ (guaranteeing exact 1:2 R:R to Target 2), and Target 3 at $4.5 \times \text{ATR}$ (1:3 R:R). Long and Short geometric validity is strictly enforced.
3. **Multi-Model Consensus & DCS Score:** The Drawdown Consensus Score (DCS) is calculated as a weighted consensus: Claude 3.5 Sonnet (40%), GPT-4o (35%), and Grok (25%). An alignment multiplier scales the score based on directional agreement, with a mathematical floor of 10.
4. **Data Provenance & Simulation Tagging:** When Twelve Data API feeds are offline, fallback simulation data is explicitly tagged (`is_simulated: true`, `data_source: "synthetic_simulator"`), ensuring simulation data is never masqueraded as live market opportunities.
5. **Freshness vs. Expiry Separation:** Signals enforce a two-tier staleness filter: timeframe-based freshness cutoffs (15M: 2h, 1H: 4h, 4H: 12h, 1D: 48h) and absolute expiry dates (`expires_at`).

---

## 2. Signal Pipeline Architecture

```
                       [MARKET DATA FEEDS]
       Twelve Data (Candles/Indicators) / Yahoo (Backup)
       Finnhub (Economic Catalysts) / TAAPI / CoinGecko
                                │
                                ▼
                     [DATA HEALTH VALIDATION]
        (Checks ATR > 0, price > 0, checks freshness)
                                │
                                ▼
                    [TECHNICAL CONFLUENCE ENGINE]
      Evaluates 5-factor confluence across EMA20/50 crosses,
        Price/EMA positioning, RSI momentum, MACD, Stoch
                                │
                                ▼
                     [GEOMETRIC LEVEL ENGINE]
     Entry = Price, Stop = 1.5 ATR, TP1 = 1.5 ATR, TP2 = 3.0 ATR
      Validates Long (Stop < Entry) and Short (Stop > Entry)
                                │
                                ▼
                     [AI CONSENSUS PANEL]
            Claude 3.5 Sonnet (40%) + GPT-4o (35%) + Grok (25%)
             Computes Drawdown Consensus Score (DCS: 10-100)
                                │
                                ▼
                   [PERSISTENCE & DEDUPLICATION]
       Upserts to `signals` table (updates existing active signal)
                                │
                                ▼
                  [SERVER-SIDE ENTITLEMENT GATE]
       Non-subscribers receive server-sanitized preview
        (entry_price, stop_loss, targets, R:R stripped)
                                │
                                ▼
                       [FRONTEND DISPLAY]
       Renders live signal card with DCS, badges, and STALE flags
```

---

## 3. The 52-Signal Matrix Scope

The platform universe is strictly defined in `src/lib/signal-calculations.ts`:
- **13 Instruments:**
  1. `XAU/USD` (Gold)
  2. `XAG/USD` (Silver)
  3. `GBP/USD` (Cable)
  4. `EUR/USD` (Euro)
  5. `USD/JPY` (Yen)
  6. `GBP/JPY` (Guppy)
  7. `SPX` (S&P 500)
  8. `NDX` (Nasdaq 100)
  9. `DJI` (Dow Jones)
  10. `FTSE` (FTSE 100)
  11. `BTC/USD` (Bitcoin)
  12. `ETH/USD` (Ethereum)
  13. `SOL/USD` (Solana)
- **4 Timeframes:** `15M`, `1H`, `4H`, `1D`.
- **Total Universe Candidates:** $13 \times 4 = 52$ signal matrix cells.

---

## 4. Freshness Model vs. Expiry Model

A signal's active status depends on two distinct rules:
1. **Expiry Window (`expires_at`):**
   - `15M`: Generated with 4-hour absolute lifespan.
   - `1H`: Generated with 8-hour absolute lifespan.
   - `4H`: Generated with 24-hour absolute lifespan.
   - `1D`: Generated with 120-hour (5-day) absolute lifespan.
2. **Semantic Freshness Cutoff (`created_at`):**
   - Independent of `expires_at`, if the signal age exceeds the following thresholds, it is flagged as `STALE` in the UI and automatically deactivated during cron scans:
     - `15M`: Stale after **2 hours**.
     - `1H`: Stale after **4 hours**.
     - `4H`: Stale after **12 hours**.
     - `1D`: Stale after **48 hours**.

---

## 5. Technical Confluence Scoring

The confluence engine awards points based on technical alignment:
- **EMA Trend Cross (2 pts):** Fast EMA (20) vs. Slow EMA (50) alignment.
- **Price Trend Alignment (2 pts):** Price above both fast and slow EMAs (Bullish) or below (Bearish).
- **RSI Momentum (2 pts):** RSI $>53$ (Bullish) or $<47$ (Bearish).
- **MACD Cross (2 pts):** MACD Line vs. Signal Line cross.
- **Stochastic Crossover (2 pts):** Fast $\%K > \%D$ cross.
- **Trigger Threshold:** A signal is only generated if total points $\ge 5$ (out of 10).

---

## 6. Drawdown Consensus Score (DCS)

The DCS formula combines directional verdict and confidence across three institutional AI models:
$$\text{Directional Consensus} = (0.40 \times \text{Dir}_{\text{Claude}}) + (0.35 \times \text{Dir}_{\text{GPT-4o}}) + (0.25 \times \text{Dir}_{\text{Grok}})$$
$$\text{Weighted Confidence} = (0.40 \times \text{Conf}_{\text{Claude}}) + (0.35 \times \text{Conf}_{\text{GPT-4o}}) + (0.25 \times \text{Conf}_{\text{Grok}})$$
$$\text{Alignment Multiplier} = \begin{cases} 1.0 & \text{if all models agree} \\ |\text{Directional Consensus}| & \text{if in conflict} \end{cases}$$
$$\text{DCS Score} = \max(10, \text{round}(\text{Weighted Confidence} \times \text{Alignment Multiplier}))$$

---

## 7. Deduplication & Persistence

- When `runSignalScan()` runs, it checks for an existing active signal matching both `instrument` and `timeframe`.
- If an active signal already exists, it executes an **atomic update** (`.update(payload).eq("id", existing.id)`), refreshing the levels, score, and timestamps, preventing duplicate rows.
- If no active signal exists, it executes an **insert**.

---

## 8. Entitlement & IDOR Security

- **Server-Side Sanitization:** In `src/app/(platform)/dashboard/signal-centre/page.tsx` and `signals/[id]/page.tsx`, non-subscribers receive signals sanitized on the server before client serialization:
  - `entry_price`: `null`
  - `stop_loss`: `null`
  - `take_profit_1`: `null`
  - `take_profit_2`: `null`
  - `rr_ratio`: `null`
  - AI analysis fields: `null`
- **Zero IDOR Vulnerability:** Direct API or URL navigation to `/dashboard/signal-centre/signals/[id]` strictly evaluates user subscription tier on the server before returning props.
