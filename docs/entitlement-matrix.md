# Drawdown Trading — Production Entitlement & Capability Matrix

**Version**: 1.0.0 (Production)  
**Prompt**: 09 — Free → Foundation Conversion Architecture  
**Authoritative Tier Engine**: `src/lib/entitlements.ts`  
**Stripe Architecture**: `src/config/stripe.ts` + `src/app/api/stripe/checkout-tier` + `src/app/api/stripe/checkout` + `src/app/api/stripe/webhook`

---

## 1. Executive Conversion Philosophy

Drawdown follows a strict product-led conversion model:

```
DISCOVER → USE → EXPERIENCE VALUE → REACH A NATURAL LIMIT → UNDERSTAND WHAT FOUNDATION UNLOCKS → UPGRADE → RETURN TO THE SAME CONTEXT → CONTINUE
```

### Non-Negotiable Tenets:
1. **Free users must experience the product's core value.** Free users can configure accounts, prepare sessions, use RUN MY TRADE, calculate exact position sizing, create trade plans, maintain an immutable snapshot, log executions in the journal, and review trade adherence. Free is NOT a crippled teaser.
2. **Foundation expands intelligence, multi-account capability, and AI diagnostics.** It is the natural operational upgrade for traders who need automated high-conviction signals, multi-account risk policies, and AI journal diagnostics.
3. **Context Preservation is absolute.** A user upgrading from any workflow (e.g. RUN MY TRADE, Signal Centre, Journal) is returned directly back to that workflow with active entitlements and a confirmation notice. They are never dumped onto a generic landing page.
4. **Zero Dark Patterns.** No countdown timers, no fabricated scarcity, no hidden pricing, no fake user counts, and no automatic unauthorized charges.

---

## 2. Authoritative Tier Hierarchy

| Tier ID | Commercial Level | Price (Monthly) | Price (Annual) | Description |
|---|:---:|:---:|:---:|---|
| **`free`** | 0 | £0 | £0 | Full operating loop (Plan, Size, Journal, Review), 1 account, daily news. |
| **`signal-centre`** (legacy) | 1 | £49/mo | £490/yr | Grandfathered tier with Signal Centre access. |
| **`foundation`** | 1 | £49/mo | £490/yr | Signal Centre, Multi-Account Management, AI Journal Review, AI Chart Diagnostics. |
| **`edge`** | 2 | £99/mo | £990/yr | Foundation + Investment Centre, AI Institutional Debate, Macro Regime Tracker. |
| **`floor`** | 3 | £299/mo | £2,990/yr | Edge + Full Course Library, Algo Builder Pine/Python Code Export, 1-on-1 Mentorship. (Capped at 20 seats) |
| **`accelerator`** | 4 | £1,495 | — | 6-week Live Cohort, Prop Firm Funding Pathway, direct mentorship with Pete. (Capped at 15 seats) |

---

## 3. Production Capability Matrix

| Capability | Free | Foundation | Edge | Floor | Server Enforcement | UI Enforcement | Upgrade Destination | Reason for Restriction |
|---|:---:|:---:|:---:|:---:|---|---|---|---|
| **RUN MY TRADE** | Full Core Access | Full + Multi-Account | Full + AI Debate | Full + Code Export | `POST /api/trade-plans/create` | `RunMyTrade.tsx` | `/pricing?redirect=/dashboard/run-my-trade` | Free users can plan & size; multi-account switching requires Foundation. |
| **Trade Plans** | Primary Account | Unlimited Accounts | Unlimited + Macro Bias | Unlimited + Algo Bridge | `trade_plans` table RLS | `PlanWorkspace.tsx` | `/pricing?redirect=/dashboard/plan` | Managing multiple live/challenge portfolios is a professional requirement. |
| **Position Sizer** | Unlimited | Unlimited | Unlimited + Live ATR | Unlimited + Heat Matrix | None (Client/Engine pure math) | `RiskCalculator.tsx` | `/pricing?redirect=/dashboard/tools/position-sizer` | Core risk quantification is a fundamental platform right. |
| **Trade Journal** | Manual logging & review | Manual + CSV / Broker Import | Automated Plan Slippage | Institutional Clustering | `trades` / `trade_records` RLS | `JournalListingClient.tsx` | `/pricing?redirect=/dashboard/journal` | Basic record keeping is free; automated processing is Foundation. |
| **Journal AI Review** | Gated | Full Access (Last 20 trades) | Full Access | Full Access + Custom Prompts | `POST /api/ai/journal-analysis` (403 for Free) | `LockedFeatureCard.tsx` | `/pricing?redirect=/dashboard/journal` | High compute cost of Anthropic Claude multi-token reasoning. |
| **Reviews & Scoring** | Process scoring | Weekly/Monthly Aggregates | Cohort Benchmarking | 1-on-1 Mentor Audits | Supabase RLS | `ReviewListingClient.tsx` | `/pricing?redirect=/dashboard/review` | Aggregate analytics require historical data aggregation. |
| **The Wire** | Full Access | Full Access | Full Access | Full Access + Commentary | Public / Open API | `TheWireClient.tsx` | None | Macro literacy is educational; freely available to all traders. |
| **Market Pulse** | General Overview | Live Indicators | Macro Regime Model | Order Book Flow | None | `MarketIntelligenceClient.tsx` | `/pricing?redirect=/dashboard/market-intelligence` | Advanced macroeconomic data subscriptions cost institutional fees. |
| **Signal Centre** | Blurred Preview | Full Access (Entry, SL, TP) | Full Access + AI Consensus | Full Access + Webhook Alerts | Server sanitisation in `page.tsx` | `PublicSignalDetailClient.tsx` | `/pricing?redirect=/dashboard/signal-centre` | Real-time actionable trade setups with direct risk levels. |
| **Technical Scanner** | Basic Overview | Multi-Timeframe (15m, 1h, 4h, 1D) | Composite Indicator Score | Custom Alerts | `signals/scan` POST guard | `LockedFeatureCard.tsx` | `/pricing?redirect=/dashboard/tools` | Real-time multi-asset technical indicator scanning costs API credits. |
| **Backtester** | Manual Rule Checklist | Standard Metrics | Monte Carlo Simulation | Portfolio Multi-Asset | Supabase RLS | `BacktesterClient.tsx` | `/pricing?redirect=/dashboard/tools/backtester` | Monte Carlo processing and institutional slippage modeling. |
| **Algo Strategy Builder** | Prompt Builder | Config Builder | Syntax Verification | Full Pine/Python Code Export | `POST /api/algo-builder/generate` (Floor check) | `AlgoStrategyBuilder.tsx` | `/pricing?redirect=/dashboard/tools/algo-builder` | Full production code generation with anti-lookahead bias guards. |
| **Institutional Intelligence** | Gated | Summary View | Full AI Debate (Bull vs. Bear) | Full Access + Bespoke Reports | `GET /api/intelligence/ai-debate/[symbol]` | `TierGate.tsx` | `/pricing?redirect=/dashboard/intelligence` | Dual-model Anthropic Claude + Twelve Data real-time financial models. |
| **The Investment Centre** | Gated | Gated | Full Access (Global Liquidity) | Full Access | `InvestmentCentreClient.tsx` guard | `TierGate.tsx` | `/pricing?redirect=/dashboard/investment-centre` | Institutional macro data and central bank balance sheet analysis. |
| **Curriculum & Video Vault** | Foundation Modules | Core Curriculum | Advanced Liquidity | Full Masterclasses + Downloads | `courses` / `course_purchases` RLS | `CourseListingClient.tsx` | `/pricing?redirect=/dashboard/curriculum` | Proprietary video courses and downloadable PDF manuals. |
| **Trading Community** | Read-Only Feed | Discussion Channels | Private Edge Floor | Private Mentor Office Hours | Discord sync / Supabase RLS | `CommunityClient.tsx` | `/pricing?redirect=/dashboard/community` | Community access scales with operational commitment. |
| **Challenge Simulator** | Basic Target / Loss | Prop Rule Presets (FTMO, 5ers) | Multi-Challenge Portfolio | Funding Pathway Review | Pure Math Engine | `SimulatorClient.tsx` | `/pricing?redirect=/dashboard/simulator` | Basic simulator is free; proprietary rule decoders are Foundation. |
| **Trading Accounts** | 1 Active Account | Up to 5 Accounts | Unlimited Accounts | Multi-Broker Corporate | Server validation in API | `TradingAccountsClient.tsx` | `/pricing?redirect=/dashboard/accounts` | Multi-account switching reflects professional trading operations. |
| **Analytics & Export** | On-Screen Stats | CSV Export | PDF Executive Reports | Corporate Tax Audits | Server export route | `ProfileClient.tsx` | `/pricing?redirect=/dashboard/profile` | Advanced report generation formats. |

---

## 4. Context Preservation Mechanism

```
[User on /dashboard/signal-centre]
              ↓
   Clicks "Upgrade to Foundation"
              ↓
  Redirected to /pricing?redirect=/dashboard/signal-centre
              ↓
   Selects Billing Cycle & Terms Accepted
              ↓
  POST /api/stripe/checkout { redirectPath: "/dashboard/signal-centre" }
              ↓
  Stripe Checkout Session (success_url = origin + "/dashboard/signal-centre?subscription=success")
              ↓
  User completes checkout at Stripe
              ↓
  Stripe redirects to /dashboard/signal-centre?subscription=success
              ↓
  Dashboard detects ?subscription=success:
    1. Displays truthful "Subscription Confirmed" banner
    2. Entitlements active immediately from database profile
    3. Cleans URL query parameter via window.history.replaceState
```

---

## 5. Subscription Status & Lifecycle Transitions

| Stripe Status | Effective Tier Level | Platform Privileges | Recovery Action |
|---|:---:|---|---|
| `active` | Authoritative (`1`, `2`, `3`, `4`) | Full privileges for assigned tier | None |
| `trialing` | Authoritative (`1`, `2`, `3`, `4`) | Full privileges for assigned tier | None |
| `past_due` | **0** (Drop to Free) | Drops to Free tier privileges | Customer billing portal to update payment card |
| `unpaid` | **0** (Drop to Free) | Drops to Free tier privileges | Customer billing portal to clear invoice |
| `canceled` | **0** (Drop to Free) | Retains Free tier privileges | Prompt to reactivate via `/pricing` |
| `incomplete` | **0** (Drop to Free) | Free tier privileges | Complete 3D Secure verification |

---

## 6. Server-Side Security & Fail-Closed Enforcement

Every restricted API and server action validates authentication and entitlement **fail-closed**:
1. `createClient()` retrieves verified session via `supabase.auth.getUser()`.
2. Authoritative profile queried with `subscription_tier` and `subscription_status`.
3. `CommercialAccess` helper computes effective tier level via `getEffectiveTierLevel(tier, status)`.
4. If tier level is insufficient, server rejects with **HTTP 403 Forbidden** before any data or compute is executed.
5. Client-side state, `localStorage`, and URL parameter manipulation cannot bypass server checks.
