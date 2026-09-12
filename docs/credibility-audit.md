# Drawdown Credibility Claim Audit

This document inventories marketing and implementation claims identified during the Phase 1 & 2 Audits, the reality in code/production, and remediation actions taken.

| Claim | Location | Production Reality | Remediation Action |
|---|---|---|---|
| **"Manual Trading Portfolio" / $100k Account** | `dashboard/page.tsx:256` | Synthetic account injected when user has 0 accounts. | **REMOVED**. Dashboard shows genuine empty state and `--` stats when user has no accounts. |
| **Pete's Daily Take Quote Fallback** | `PetesDailyTakeExcerpt.tsx:41` | Hardcoded quote displayed when DB returned 0 rows. | **REMOVED**. Component queries `daily_briefings` and returns `null` (hidden) if no genuine content exists. |
| **"HMAC Risk Tokens" / "HMAC-SHA256 Signed"** | `tools/page.tsx`, `ToolsClient.tsx`, `InvestmentCentreMarketingClient.tsx`, `InvestmentCentreClient.tsx` | No HMAC signing or validation logic exists for trading orders (only in Cal.com webhooks). | **REMOVED**. Replaced with truthful descriptions of deterministic risk parameters. |
| **"1,420 Metrics 24/7 (Salience Engine)"** | `tools/page.tsx`, `InvestmentCentreMarketingClient.tsx` | No salience engine or 1,420 metric evaluation loop exists. | **REMOVED**. Replaced with accurate description of cross-asset macro dynamics. |
| **"18 Real-Time Feeds"** | `tools/page.tsx`, `InvestmentCentreMarketingClient.tsx` | 5–8 active external APIs are configured. | **REPLACED** with "Multi-Source Macro & Alternative Feeds". |
| **"based on back-tested signal accuracy" (DCS)** | `SignalCentreMarketingClient.tsx:149` | Weights (40%, 35%, 25%) are fixed heuristics with no backtest corpus. | **REPLACED** with accurate description of fixed heuristic weighting. |
| **"real-time X/Twitter sentiment data" (Grok)** | `signal-engine.ts:392, 422` | Grok API called via xAI / GPT-4o without X social stream ingress. | **REMOVED**. Prompt updated to focus on technical indicator analysis. |
| **"Dark pool activity indicators"** | `platform/page.tsx:316` | No dark pool feeds or order books integrated. | **REMOVED**. |
| **Autochartist 88% Probability Patterns** | `autochartist.ts:56-117` | Synthetic mathematical pattern generator based on bias string. | **REMOVED**. Provider returns `NOT_CONNECTED` when API key is missing. |
| **Trading Central Consensus Score** | `trading-central.ts:45-80` | ATR-derived synthetic consensus engine. | **REMOVED**. Provider returns `NOT_CONNECTED` when API key is missing. |
| **On-Chain MVRV Z-Score & Galaxy Score** | `onchain-analytics.ts:40-75` | Hardcoded bias-aligned metrics. | **REMOVED**. Provider returns `NOT_CONNECTED` when API key is missing. |
