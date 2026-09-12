# RUN MY TRADE — Technical Documentation

**Platform**: Drawdown Operating System  
**Feature**: RUN MY TRADE Decision-Support Workflow  
**Prompt**: 08  
**Status**: Production

---

## 1. Purpose

RUN MY TRADE is the flagship decision-support workflow of the Drawdown Operating System.

It takes a trader's proposed trade idea — instrument, direction, entry, stop, target, account, and risk — and converts it into a fully quantified, pre-execution trade plan.

**Drawdown does not execute orders. Drawdown does not route trades to brokers.**

This workflow exists to enforce pre-trade discipline by making every trade decision an explicit, documented, and quantified act.

---

## 2. User Flow

```
[1. TRADE IDEA]
Instrument selection + Direction (Long/Short)
         ↓
[2. PRICE LEVELS]
Entry / Invalidation (Stop) / Target
         ↓
[3. ACCOUNT & RISK]
Select trading account (server-validated) + Risk % input
         ↓
[4. DRAWDOWN ANALYSIS]
Position Size → Cash Risk → Cash Reward → R:R → Drawdown Impact
         ↓
[5. MARKET CONTEXT]
Non-mutating bias/trend info (freshness-badged: LIVE / RECENT / STALE / UNAVAILABLE)
         ↓
[6. DISCIPLINE CHECK]
Thesis → Invalidation criteria → 3-item checklist
         ↓
[7. SAVE TRADE PLAN]
Server-validated → Persisted to trade_plans + immutable snapshot in trade_plan_snapshots
         ↓
[EXECUTION BOUNDARY]
EXECUTE AT BROKER → Record Actual Execution → Review
```

---

## 3. Calculation Model

The authoritative calculation engine is:

```
src/lib/position-sizing.ts
```

### Formula

```
riskAmount = accountBalance × (riskPct / 100)
stopDistancePips = |entry - stop| × instrument.mult
divisor = stopDistancePips × instrument.pip (pip value per lot)
lots = riskAmount / divisor
cashRisk = riskAmount
cashReward = cashRisk × rewardRiskRatio
rewardRiskRatio = |target - entry| / |stop - entry|
drawdownImpactPct = (cashRisk / accountBalance) × 100
dailyLossImpactPct = ((todayLoss + cashRisk) / accountBalance) × 100
```

### Instrument Specifications

| Asset Class | id | pip | mult |
|---|---|---|---|
| Forex Major (EUR/USD, GBP/USD...) | `forex-major` | 10 | 10000 |
| Forex Minor / JPY pairs | `forex-minor` | 10 | 100 |
| Forex Exotic (USD/TRY...) | `forex-exotic` | 10 | 1000 |
| Index - Points (FTSE, US30...) | `index-pts` | 1 | 1 |
| Index - Cash (NAS100, SPX500...) | `index-cash` | 1 | 1 |
| Commodity (Gold, Oil...) | `commodity` | 1 | 10 |
| Crypto (BTC, ETH...) | `crypto` | 1 | 1 |
| Stock / Share | `stock` | 0.01 | 100 |

### Instrument Resolution

`resolveInstrumentSpec(symbolOrSlug)` maps any instrument string to the correct specification using keyword matching:
- Detects JPY for forex-minor
- Detects XAU, GOLD, XAG, WTI, OIL for commodity
- Detects BTC, ETH, SOL, XRP for crypto
- Detects SPX, NDX, FTSE, DAX, US30, DJI for index-pts
- Detects exotic currency codes (TRY, ZAR, MXN, SEK, NOK)
- Defaults to forex-major for all unrecognised forex pairs

---

## 4. Data Dependencies

### Required (User-Supplied)
- `instrument` — user-entered symbol string
- `direction` — "long" or "short"
- `entryPrice` — proposed entry level
- `stopPrice` — invalidation / stop loss level
- `targetPrice` — profit target level
- `accountId` — Supabase `trading_accounts` ID (validated server-side)
- `riskPct` — % of account balance to risk

### Optional (Account Environment)
- `dailyLossLimitPct` — loaded from `risk_policies` for selected account
- `maxDrawdownLimitPct` — loaded from `risk_policies`
- `todayLoss` — accumulated daily loss

### Non-Intrusive (Market Context)
- Live price feed from `useMarketData(hookSlug, "1h")` via `/api/market-data/[symbol]/route.ts`
- ATR, RSI, trend label, bias score
- **Market context never overwrites entry, stop, or target values**

---

## 5. Market Data Behaviour

Market context is loaded via the existing `useMarketData` hook which polls `/api/market-data/[symbol]` every 60 seconds.

### Freshness States

| State | Condition | Badge |
|---|---|---|
| LIVE FEED | lastUpdated < 2 minutes | Green |
| RECENT | lastUpdated < 15 minutes | Blue/Accent |
| STALE | lastUpdated ≥ 15 min or is_fallback | Amber |
| NO FEED | price === null or error | Grey |
| LOADING | loading and no price yet | Grey |

### Market Data Failure Handling

If the market data feed is unavailable:
- All core calculations continue to function based on user-supplied price levels
- A non-blocking informational notice replaces the market context panel
- No fabricated values are substituted

---

## 6. Account Security Model

Account ownership is enforced server-side in `/api/trade-plans/create/route.ts`:

1. `supabase.auth.getUser()` validates the session
2. `trading_accounts.eq("user_id", user.id)` checks account ownership
3. If account is not found or not owned by user → **HTTP 403**
4. If trade plan parameters are invalid → **HTTP 400** with specific error messages
5. Client-side payload manipulation cannot bypass account ownership

**RLS**: Supabase Row Level Security also enforces ownership at the database layer.

---

## 7. Persistence Model

### Trade Plan Insert

Table: `trade_plans`

```typescript
{
  user_id: user.id,
  account_id: validatedAccount.id,
  instrument: string,
  direction: "buy" | "sell",
  entry_zone: string, // calculated range: entry ± 0.1%
  invalidation_level: stopPrice,
  stop_loss: stopPrice,
  proposed_size: lots,
  target_logic: `Target RRR of ${rr}R (Target: ${target})`,
  status: "ready",
}
```

### Immutable Snapshot Insert

Table: `trade_plan_snapshots`

```typescript
{
  trade_plan_id: plan.id,
  user_id: user.id,
  snapshot_data: {
    instrument, direction,
    entryPrice, stopPrice, targetPrice,
    proposedLots, cashRisk, cashReward, riskPct,
    rewardRiskRatio, drawdownImpactPct,
    thesis, invalidationCriteria,
    checklistResults: [{ item, checked }],
    savedAt: ISO8601,
    accountRef: { id, balance }
  }
}
```

The snapshot is immutable by design. It records the exact parameters at the moment of plan creation. No later edits to the plan row can contaminate the snapshot — this prevents hindsight bias.

---

## 8. Execution Boundary

After saving a Trade Plan, the workflow presents an explicit execution boundary:

```
TRADE PLAN [SAVED] → EXECUTE AT BROKER → RECORD ACTUAL EXECUTION → REVIEW
```

- The "EXECUTE AT BROKER" button navigates to `/dashboard/plan/[id]/execute`
- This route (handled by `ExecuteElsewhereClient`) allows the user to:
  - Confirm: "I placed the trade at my broker" → status becomes `executed_elsewhere`
  - Confirm: "I did not take the trade" → status becomes `not_taken`
- **Drawdown never creates a trade record automatically from a plan**

---

## 9. Analytics Events

The following events use the existing platform event taxonomy:

| Event | Trigger |
|---|---|
| `run_trade_started` | User enters RUN MY TRADE workspace |
| `run_trade_inputs_completed` | All 3 price levels entered with valid direction |
| `run_trade_calculation_completed` | `isValid === true` and lots > 0 |
| `run_trade_plan_saved` | Successful POST to `/api/trade-plans/create` |
| `run_trade_abandoned` | User navigates away before saving |

---

## 10. Entitlement Behaviour

The core RUN MY TRADE workflow uses the existing `CommercialAccess` / entitlement architecture from `src/lib/entitlements.ts`.

- **Free tier**: RUN MY TRADE is available (single account, core calculations)
- **Foundation+**: Full policy integration, daily loss limit enforcement
- **Edge+**: Advanced market context with AI bias signals
- No new tiers are introduced
- No entitlement bypass in client-side code

---

## 11. Mobile UX

The workflow is designed mobile-first:
- `inputMode="decimal"` on all numeric inputs (triggers numeric keyboard on iOS/Android)
- `type="number"` with `step="any"` for decimal precision
- Side-by-side direction buttons are minimum 44px touch targets
- Risk % quick-select buttons (0.5%, 1%, 2%) prevent mistyping
- Sticky CTA at bottom of right column on desktop; stacked inline on mobile
- No horizontal overflow: grid switches to single column below `lg:` breakpoint
- Drawdown Analysis panel positioned prominently above fold on mobile

---

## 12. Files Created / Modified

### New Files
- `src/lib/position-sizing.ts` — Authoritative calculation engine
- `src/components/dashboard/RunMyTrade.tsx` — Decision-support UI component
- `src/components/dashboard/PlanWorkspace.tsx` — Sub-tab wrapper for Plan page
- `src/app/(platform)/dashboard/run-my-trade/page.tsx` — Dedicated route
- `src/app/api/trade-plans/create/route.ts` — Server-side validation & persistence
- `tests/run-my-trade.test.ts` — 20 automated test cases
- `docs/run-my-trade.md` — This document

### Modified Files
- `src/app/(platform)/dashboard/plan/page.tsx` — Now renders `PlanWorkspace`
- `src/app/api/user/onboard/route.ts` — Supports `primary_objective` + `primary_market` fields

---

## 13. Test Coverage

20 tests in `tests/run-my-trade.test.ts`:

1. Valid long setup calculation
2. Valid short setup calculation
3. Invalid stop placement (long and short)
4. Invalid target placement (long and short)
5. Invalid risk percentage (0% and >100%)
6. Correct cash risk calculation
7. Correct R:R calculation
8. Multi-asset position sizing (Forex, JPY, Gold, Index, Crypto)
9. Drawdown impact and account limit evaluation
10. Account ownership validation in API
11. Unauthorised account rejection (403)
12. Market data unavailable — calculation remains active
13. Freshness state handling in RunMyTrade UI
14. Trade Plan persistence (existing table)
15. Immutable snapshot architecture
16. No false trade record creation
17. Execution boundary is explicit and non-routing
18. Entitlement enforcement
19. Consistency with existing RiskCalculator engine
20. Existing Prompt 02–07 test suites continue passing

**Result: 20/20 pass + 97 pre-existing = 117/117 total**
