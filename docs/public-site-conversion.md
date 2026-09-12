# DRAWDOWN.TRADING — PUBLIC WEBSITE CONVERSION REBUILD
## Prompt 15: Architecture, Positioning & Narrative Conversion

**Document Version**: 1.0  
**Status**: Authoritative Production Documentation  
**Implementation Date**: 2026-09-12  

---

## 1. CORE POSITIONING

### The Proposition
**A Trading Operating System for Serious Independent Traders.**

Drawdown is not another disjointed course or collection of speculative alerts. It is an integrated trading operating system that unifies the fragmented trading workflow:
$$\text{PREPARE} \longrightarrow \text{PLAN} \longrightarrow \text{SIZE} \longrightarrow \text{EXECUTE} \longrightarrow \text{RECORD} \longrightarrow \text{REVIEW} \longrightarrow \text{IMPROVE}$$

### The Core Problem Solved
Serious traders are forced to juggle six fragmented tools across disconnected browser tabs:
1. **Charting**: TradingView (isolated from position sizing)
2. **Lot Size Calculation**: Generic web calculator or spreadsheet (no memory of account capital or maximum drawdown limits)
3. **Macro Context**: Economic calendar on ForexFactory or Investing.com
4. **Sentiment & Flow**: COT reports, MyFXBook, or Twitter chatter
5. **Trade Logging**: Notion docs, Excel sheets, or unrecorded trades
6. **Execution**: Broker terminal (MT4/5, cTrader) entered in the heat of emotion without pre-committed boundaries

**The Solution**: Drawdown connects the loop. Context informs your plan; your plan calculates your exact mathematical lot size and drawdown impact; and your trade record automatically feeds your weekly process audit and targeted curriculum improvement.

---

## 2. INFORMATION ARCHITECTURE & PAGE HIERARCHY

```
drawdown.trading (Public Surface)
│
├── / (Homepage)
│   ├── Navigation (Sticky with Core Megamenus & RUN MY TRADE highlight)
│   ├── Hero Section (Operating System Positioning & Start Free CTA)
│   ├── Price Ticker (Live Polled Market Indices & FX)
│   ├── Macro Intelligence Strip (Current Session, S&P P/E, Yields, VIX)
│   ├── Fragmented Problem Section (6 Tabs vs. 1 Operating Loop)
│   ├── Operating Loop Section (Visual 7-Stage Architectural Pipeline)
│   ├── RUN MY TRADE Showcase (Interactive Live Sizing & Pre-Trade Plan Demo)
│   ├── Platform Integrity Statement ("No Lambos. No Beach Photos. Just Data.")
│   ├── Market Pulse (Sessional News & Economic Calendar)
│   ├── Curriculum Section (Phases 1–6 with Phase 1 Free Forever Highlight)
│   ├── Capabilities Grid (Tools & Risk Modules Overview)
│   ├── Technical Consensus Matrix (EMA/RSI Confluence across 4 Major Instruments)
│   ├── Broker Section (FCA/ASIC/MAS/SFC Regulated Broker Recommendations)
│   ├── Pricing Section (Free Tier Callout + Foundation / Edge / Floor Grid)
│   └── Footer (Full Regulatory, Risk & Educational Disclaimers)
│
├── /pricing (Authoritative Commercial Entitlement Grid & FAQ Schema)
├── /platform (Full Platform Architectural Specification & Capability Maps)
├── /signal-centre (DCS AI Consensus Engine, Confluence Grid, Signal Archive)
├── /tools (Alpha Stack Specification: Sizer, Journal, Scanner, Backtester, Algo Builder)
├── /courses (6-Phase Curriculum Directory — Phase 1 Free Ground Zero)
├── /brokers (Regulated Broker Directory & Head-to-Head Comparisons)
├── /prop-firms (Evaluation Rules, Survival Kit & Challenge Simulators)
└── /signup (Frictionless Onboarding Pathway into Free Operating Mode)
```

---

## 3. CTA & CONVERSION STRATEGY

### Primary Conversion Funnel: Free → Foundation
1. **Top of Funnel Entry**: "Start Free — No Card Required"
   - Directs to `/signup`
   - Instantly unlocks Phase 1 Ground Zero curriculum
   - Instantly grants unlimited pre-trade sizing via RUN MY TRADE
   - Provides live macroeconomic session briefings
2. **Aha Moment Delivery**: Interactive RUN MY TRADE
   - Available directly on homepage for instant validation
   - Shows exact lot sizes, monetary risk, R:R ratio, and drawdown exposure
   - Validates pre-trade discipline checklist before execution
3. **Natural Upgrade Trigger**: Value-Based Progression
   - When trader seeks to log trades, extract emotional pattern analysis, and progress into Phase 2+ curriculum, they upgrade to Foundation (£49/mo).
   - When seeking AI consensus signals, multi-model debate, and technical scanner, they upgrade to Edge (£99/mo).
   - Direct mentorship and custom algo builder access capped at 15–20 members on Floor (£299/mo).

---

## 4. TRUST, EVIDENCE & CLAIM BOUNDARIES

All public claims conform strictly to the **Prompt 14 Claim Register**:

| Claim Area | Verified Reality | Implementation Rule |
|---|---|---|
| **Market Data** | Sourced via Twelve Data REST API batch candles; synthetic fallback tagged when unavailable. | No "tick-level streaming" or "sub-1ms" claims. Described as "periodically refreshed market data." |
| **Execution** | Drawdown provides analytical decision-support and trade planning. | Explicit boundary: Drawdown does not route trades. Execution occurs at the user's independent broker terminal. |
| **Consensus Matrix** | EMA-20 and RSI-14 calculated over 50 daily candles. | No "active liquidity nodes" or "order flow depth" claims. Correctly framed as technical momentum consensus. |
| **Scanner** | Evaluates 13 major instruments across 4 timeframes. | No "40+ instruments" claims. Strictly accurate instrument count. |
| **Signal Engine** | DCS score combines Claude, GPT-4o, and Grok with fixed weights [40/35/25]. | Clear disclosure: A consensus score is an analytical agreement index, NOT a guaranteed probability. |
| **Acuity Analyst Feed** | API integration in progress. | Transparently labeled as "Coming Soon" with verified FCA FRN: 787261. No fabricated placeholder rationales. |
| **Backtester** | Historical candle simulation from Twelve Data. | Evaluates mechanical rules on close prices. Not claimed as proof of future performance. |

---

## 5. MOBILE & PERFORMANCE AUDIT

1. **Zero Horizontal Overflow**: All grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-7` and `grid-cols-1 lg:grid-cols-12`) collapse into single-column vertical stacks on viewports $<768\text{px}$.
2. **Tabular Figures**: All currency, pip, and percentage metrics formatted with monospace tabular figures (`font-mono`) to eliminate layout shift during state changes.
3. **Server-First Hydration**: Static marketing shell rendered via Next.js SSR with isolated client components (`RunMyTradeShowcase.tsx`, `FragmentedProblemSection.tsx`, `HeroSection.tsx`) maintaining instant First Contentful Paint (FCP).
4. **Accessible Semantics**: High-contrast text tokens (`var(--ink-950)` on `var(--paper-0)`), keyboard-focusable CTA buttons, and explicit ARIA labels.

---

*End of Documentation — Prompt 15*
