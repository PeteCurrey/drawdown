# Drawdown Dashboard — Current Information Architecture Audit

> **Audit Date**: 2026-09-12  
> **Auditor**: Lead Product Architect & Lead Engineer  
> **Status**: Comprehensive Baseline Audit

---

## 1. Executive Summary

The authenticated Drawdown experience contains significant institutional depth, but its current information architecture (IA) functions as a fragmented catalogue of 25+ independent destinations. Traders are left asking *"Which tool should I open?"* rather than being guided through an intuitive, disciplined operating cadence: **Prepare → Plan → Size → Execute → Record → Review → Improve**.

This document provides a route-by-route audit of every authenticated page under `/dashboard`, identifying duplication, orphaned destinations, terminology inconsistencies, and navigation clutter.

---

## 2. Complete Inventory of Current Dashboard Routes

| Route | Purpose | User Type / Min Tier | Primary Action | Data Source(s) | Redundancy / IA Assessment |
|---|---|---|---|---|---|
| `/dashboard` | Mission control / workspace hub | All (Free+) | Check status, see next action, view balance | `profiles`, `funded_accounts`, `trades`, `session_preparations`, `trade_plans`, `trade_reviews`, `daily_briefings` | Primary anchor. Needs clearer zero-data progression. |
| `/dashboard/prepare` | Pre-session checklist & psychological readiness | Free+ | Complete check-in, set daily max loss limit | `session_preparations` | Core Workflow Stage 1. Keep as primary. |
| `/dashboard/plan` | Pre-trade strategy planning & invalidation rule setting | Free+ | Construct trade plan before placing orders | `trade_plans` | Core Workflow Stage 2. Keep as primary. |
| `/dashboard/plan/[planId]/execute` | Execution boundary notice (Drawdown does not route orders) | Free+ | Acknowledge broker boundary & checklist | `trade_plans` | Core Workflow Stage 3 (transition boundary). Keep contextual. |
| `/dashboard/record` | Fast manual trade entry against existing plan | Free+ | Record execution price, actual size, slippage | `trade_records`, `trade_plans` | Core Workflow Stage 4. Overlaps with `/dashboard/journal`. |
| `/dashboard/journal` | Full AI Trade Journal with analytics, calendar & emotional tagging | Foundation+ | Filter trades, view win rates, run AI pattern coach | `trades`, `journal_ai_analysis` | Overlaps with `/dashboard/record`. Must be unified into a single Journal & Record hub. |
| `/dashboard/review` | Trade process & discipline review listing | Free+ | Select completed trade to evaluate rule adherence | `trade_records`, `trade_reviews` | Core Workflow Stage 5. Keep as primary. |
| `/dashboard/review/[recordId]` | Trade scoring & commitment generation | Free+ | Grade plan adherence, log mistake, create commitment | `trade_records`, `trade_reviews`, `improvement_commitments` | Core Workflow Stage 5 detail. Keep contextual. |
| `/dashboard/improve` | Ongoing improvement commitment tracker | Free+ | Review active commitments, mark closed | `improvement_commitments` | Core Workflow Stage 6. Keep as primary. |
| `/dashboard/weekly-review` | Weekend operating review & process sign-off | Free+ | Close weekly loop, evaluate metrics | `weekly_operating_reviews` | Core Workflow Stage 7. Accessible from Review/Improve. |
| `/dashboard/accounts` | Funded account & challenge risk management | Free+ | Add account, track drawdown against breach limit | `funded_accounts`, `account_snapshots` | Critical context for all trading tools. High priority. |
| `/dashboard/tools` | Grid catalogue of analytical tools | Free+ | Navigate to sub-tool | Static configuration | Secondary navigation. Redundant with structured sidebar. |
| `/dashboard/tools/position-sizer` | Precision risk calculator & lot sizer | Free+ | Calculate lots based on balance & stop distance | Client-side math / Account context | Crucial tool. Should be embedded contextually in Trade Plan. |
| `/dashboard/tools/technical-scanner` | Multi-asset, 4-timeframe confluence scanner | Foundation+ | Scan 40+ pairs for RSI/EMA/trend signals | `useMarketData`, TAAPI / Polygon / Finnhub APIs | Analytical tool. Belongs under Market Intelligence. |
| `/dashboard/tools/backtester` | Strategy backtester (5,000 bars OHLC simulation) | Edge+ | Run parameter backtests on historical candles | Client-side backtest engine / Polygon OHLC | Analytical tool. Belongs under Tools & Strategy Lab. |
| `/dashboard/tools/algo-builder` | Pine Script v6 & Python quant strategy builder | Floor+ | Generate algo code with QuantCoder AI | Anthropic Claude API, `profiles` | Advanced tool. Belongs under Tools & Strategy Lab. |
| `/dashboard/tools/journal` | Old journal route | Foundation+ | Redirects to `/dashboard/journal` | None (redirect) | Orphaned legacy redirect. Maintain for backward compatibility. |
| `/dashboard/signal-centre` | Curated sessional signals with Tri-Model DCS scores | Foundation+ | Discover vetted setups & rationale | `signals`, AI debate logs | Decision-support intelligence. Belongs under Intelligence. |
| `/dashboard/signal-centre/signals/[id]` | Deep-dive signal analysis & debate transcripts | Foundation+ | Read Claude/GPT-4o/Grok consensus rationale | `signals` | Detail view. |
| `/dashboard/market-intelligence` | Interactive TradingView chart, heatmaps, macro gauge | Free / Edge+ | Inspect technical structure & sessional volume | `useMarketData`, Finnhub, FRED, TradingView | Core intelligence workspace. Belongs under Intelligence. |
| `/dashboard/the-wire` | Daily morning briefing & live financial news stream | Free+ | Read daily macro brief and session catalyst news | `daily_briefings`, `email_sends`, News API | Core daily context. Belongs under Intelligence. |
| `/dashboard/intelligence` | Congressional trading, insider transactions & sentiment | Edge+ | Track institutional flows and political alpha | Finnhub insider/congressional APIs | Advanced intelligence. Belongs under Intelligence. |
| `/dashboard/intelligence/daily-report` | Daily macro report archive | Free+ | Read historical daily briefings | `daily_briefings` | Duplicate of The Wire briefs. Merge into The Wire archive. |
| `/dashboard/investment-centre` | Autonomous macro regime terminal & portfolio router | Edge+ | Monitor macroeconomic regime and asset allocation | Macro models, DB | Advanced macro terminal. Belongs under Intelligence. |
| `/dashboard/curriculum` | 13-Phase trader development academy with quizzes | Foundation+ | Study structured modules, earn certificates | `curriculum_modules`, `course_progress` | Primary education hub. Belongs under Academy. |
| `/dashboard/curriculum/[phase]` | Phase module index | Foundation+ | Select lesson module | `curriculum_modules` | Sub-view of curriculum. |
| `/dashboard/curriculum/[phase]/[module]` | Interactive lesson, video & quiz runner | Foundation+ | Watch video, complete quiz, mark step complete | `curriculum_modules`, `course_progress` | Lesson runner. |
| `/dashboard/curriculum/certificate/[phase]` | Certificate verification & generation | Free+ | View and share earned phase certificate | `certificates` | Milestone achievement. |
| `/dashboard/learn` | "The Library" video archive of recorded live sessions | Free+ | Watch strategy, mindset, and recap videos | `recorded_sessions` | Duplicate concept of Curriculum. Move to tab in Academy. |
| `/dashboard/courses/deploy-your-algo` | Standalone algorithmic execution mini-course | Floor+ | Masterclass lessons for deploying Python algos | Static course content | Sub-course within Academy. |
| `/dashboard/courses/prop-firm-survival-kit` | Standalone prop firm risk management mini-course | Foundation+ | Rules, drawdown defense, evaluation tactics | Static course content | Sub-course within Academy. |
| `/dashboard/coach` | AI Psychology Coach & weekly discipline reports | Foundation+ | Review emotional trends, take psychology check-in | `discipline_reports`, `individual_trades` | Emotional review tool. Belongs under Review & Psychology. |
| `/dashboard/simulator` | Prop firm challenge pass/fail Monte Carlo simulator | Free+ | Simulate account outcomes against firm rules | `prop_firms`, simulator engine | Useful risk tool. Belongs under Analytical Tools. |
| `/dashboard/events` | Live webinar schedule & Discord stream links | Edge+ | Register for upcoming sessions | DB events table | Community / Academy event schedule. |
| `/dashboard/breakdowns` | Weekly trade breakdown video recordings | Foundation+ | Watch video breakdowns of past market setups | Supabase videos | Academy / Library sub-section. |
| `/dashboard/mentorship` | 1-on-1 private mentorship booking via Cal.com | Floor+ | Schedule private call with senior desk trader | Cal.com embed | High-tier service. Belongs under Account / Tier Services. |
| `/dashboard/community` | Discord & community portal links | Free+ | Join trading floor channels | Discord invite link | Community hub. |
| `/dashboard/downloads` | PDF cheat sheets, risk templates, indicator files | Free+ | Download trading resources | Supabase storage files | Academy resource tab. |
| `/dashboard/market-call` | Community weekly prediction game & standings | Free+ | Submit weekly price direction prediction | `market_call_*` tables | Community gamification. Low priority; keep contextual. |
| `/dashboard/profile` | Settings, personal data, subscription billing | Free+ | Manage password, profile, tier, notifications | `profiles`, Supabase Auth | Account management. |

---

## 3. Structural Problems & Cognitive Friction Identified

### 3.1. Navigation Sprawl & Information Duplication
1. **Desktop Header vs Sidebar Mismatch**:
   - Header shows 6 workflow tabs: `Today`, `Prepare`, `Plan`, `Journal`, `Review`, `Improve`.
   - Sidebar displays those same 6 tabs plus a **17-item kitchen-sink "Resources" list** where core tools, educational archives, and external marketing links (`/brokers`, `/prop-firms`) are mixed together without hierarchy.
2. **Mobile Bottom Bar Disconnect**:
   - The mobile viewport ignores the workflow entirely and shows: `Overview`, `Markets`, `Curriculum`, `Tools`, `Settings`.
   - A trader preparing or reviewing a trade on mobile cannot reach `Prepare`, `Plan`, `Record`, or `Review` without drilling through a buried mobile drawer.
3. **The "Journal" Split**:
   - The workflow tab "Journal" opens `/dashboard/record` (a simple single-trade input form linked to `trade_records`).
   - The actual analytical journal with AI coaching, calendar views, emotional analytics, and filtering is `/dashboard/journal` (linked to `trades`).
   - Traders are confused about where their trade history lives.
4. **The Intelligence Fragment**:
   - Four separate destinations (`the-wire`, `market-intelligence`, `intelligence`, `signal-centre`) compete for market attention. A trader has to hop between 4 screens to understand macro drivers, check pair setups, and see market sentiment.
5. **The Education Split**:
   - Structured learning is at `/dashboard/curriculum`.
   - Video library is at `/dashboard/learn`.
   - Standalone courses live under `/dashboard/courses/*`.
   - Video breakdowns live under `/dashboard/breakdowns`.
   - These belong under a single **Academy** umbrella.

---

## 4. Preservation & Migration Principles

1. **No Destructive URL Deletions**: Every existing valid URL will remain accessible. Deep links, bookmarks, and search references will not break.
2. **Unified Conceptual Grouping**: Rather than presenting 25 unranked items, navigation will be organised into **4 coherent domains**:
   - **Operating Loop**: Today, Prepare, Plan, Record, Review, Improve
   - **Market Intelligence**: The Wire, Market Scanner & Charts, Signal Centre, Institutional Flows
   - **Tools & Strategy**: Risk & Position Sizer, Strategy Backtester, Algo Builder, Challenge Simulator
   - **Academy**: Structured Curriculum, Masterclasses, Session Library, Downloads
3. **Contextual Tool Accessibility**: Tools like the **Position Sizer** will not only exist as standalone pages but will be linked directly inside the **Trade Plan** workflow where they are actually needed.
