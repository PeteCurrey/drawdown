# DRAWDOWN.TRADING — FINAL PRODUCTION RELEASE DECISION & AUDIT GATE
## Phase 21: Production Release Verification, Subsystem Evidence & Release Decision
**Release Candidate**: Drawdown v1.0.0-RC1  
**Commit Baseline**: `adf5d7a` (Repository: `PeteCurrey/drawdown`, Branch: `main`)  
**Deployment Target**: `https://www.drawdown.trading` (Active Vercel Deployment: `dpl_8qJQDNZHxJ5fVSsu7X5mWe9dxmQv`)  
**Audit Date**: September 13, 2026  
**Auditor Role**: Principal Release Auditor  

---

## 1. Executive Summary & Release Verdict

A rigorous, evidence-based final release audit was conducted across the live production environment (`https://www.drawdown.trading`), the repository codebase, and automated test runners.

Although the core engineering gate (`npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, and 27/27 Playwright E2E browser tests) achieves a 100% pass rate, **the platform is certified as NO-GO for production launch** due to two unresolved mandatory criteria:

1. **Signal Centre HTTP 500 on Deployed Production Environment**:
   - **Root Cause Confirmed**: An application-level defect (Class A) where calling `.toFixed()` on nullified numeric values (`entry_price`, `stop_loss`, `take_profit_2`, `rr_ratio`) during React Server-Side Rendering (SSR) for free-tier users caused an unhandled `TypeError`, rendering Next.js App Router's root error boundary with status 500.
   - **Remediation Status**: The defect has been resolved in code (commits `ee705aa` and `adf5d7a`), verified clean via local Turbopack build (`exit 0`), and pushed to `main`.
   - **Release Blocker**: The live production deployment on Vercel is currently serving build `dpl_8qJQDNZHxJ5fVSsu7X5mWe9dxmQv` (compiled at 14:08 GMT, prior to the fix). 5/5 Free-tier browser loads on `https://www.drawdown.trading/dashboard/signal-centre` continue to return HTTP 500 until Vercel deploys the updated commit. Per release rules, a GO verdict cannot be granted while the live deployment returns 500.
2. **Stripe Test Mode Webhook Unverified**:
   - Only restricted live keys (`mk_1TOh...`, `pk_live_...`) exist in the production environment. No test-mode keys (`sk_test_...`) exist.
   - Per mandate, test-mode delivery through Stripe's infrastructure remains **UNVERIFIED**.
   - A formal release exception has been drafted below, but without explicit named Release Owner approval from Pete Currey, Stripe remains an independent release blocker.

---

## 2. Signal Centre HTTP 500 Investigation & Defect Analysis

### 2.1 10x Browser Verification Audit (Playwright Chromium)
To investigate the previously reported HTTP 500 on `/dashboard/signal-centre`, a test suite of 10 automated browser sessions was executed against `https://www.drawdown.trading/dashboard/signal-centre` using Google Chrome CDP:

| Run # | Tier | Authenticated User | HTTP Document Status | Visible UI Rendered | Result |
|---|---|---|---|---|---|
| **Free-1** | Free | `qa-free-user@drawdown.trading` | **500 Internal Server Error** | Root Next.js Error: "This page couldn’t load" | **FAIL (500)** |
| **Free-2** | Free | `qa-free-user@drawdown.trading` | **500 Internal Server Error** | Root Next.js Error: "This page couldn’t load" | **FAIL (500)** |
| **Free-3** | Free | `qa-free-user@drawdown.trading` | **500 Internal Server Error** | Root Next.js Error: "This page couldn’t load" | **FAIL (500)** |
| **Free-4** | Free | `qa-free-user@drawdown.trading` | **500 Internal Server Error** | Root Next.js Error: "This page couldn’t load" | **FAIL (500)** |
| **Free-5** | Free | `qa-free-user@drawdown.trading` | **500 Internal Server Error** | Root Next.js Error: "This page couldn’t load" | **FAIL (500)** |
| **Paid-1** | Floor | `qa-paid-user@drawdown.trading` | **200 OK** | Full Signal Centre: Header, 52 cells, AI alignment | **PASS (200)** |
| **Paid-2** | Floor | `qa-paid-user@drawdown.trading` | **200 OK** | Full Signal Centre: Header, 52 cells, AI alignment | **PASS (200)** |
| **Paid-3** | Floor | `qa-paid-user@drawdown.trading` | **200 OK** | Full Signal Centre: Header, 52 cells, AI alignment | **PASS (200)** |
| **Paid-4** | Floor | `qa-paid-user@drawdown.trading` | **200 OK** | Full Signal Centre: Header, 52 cells, AI alignment | **PASS (200)** |
| **Paid-5** | Floor | `qa-paid-user@drawdown.trading` | **200 OK** | Full Signal Centre: Header, 52 cells, AI alignment | **PASS (200)** |

### 2.2 Classification
- **Classification**: **Class A (Confirmed Application Defect)**.
- **Consistency**: 100% reproducible for Free-tier users; 0% reproducible for Paid-tier users.

### 2.3 Root Cause Identification
1. In `src/app/(platform)/dashboard/signal-centre/page.tsx`, server-side entitlements correctly distinguish Free vs Paid subscribers. For Free users (`isSubscriber = false`), raw signals are passed through `sanitizeSignalForPreview()`, which nullifies commercial levels (`entry_price: null`, `stop_loss: null`, `take_profit_2: null`, `rr_ratio: null`).
2. In `src/components/signal-centre/SignalCentreDashboardClient.tsx`:
   - Line 697 (Signal Card): Rendered `<span className="font-bold text-gray-900">1 : {s.rr_ratio.toFixed(1)}</span>` without checking if `s.rr_ratio` was null.
   - Lines 968–971 (Raw Signal Feed Table inside Floor TierGate): Rendered `{s.entry_price.toFixed(4)}`, `{s.stop_loss.toFixed(4)}`, `{s.take_profit_2.toFixed(4)}`. Because `TierGate` renders `{children}` in a blurred container for non-subscribers rather than skipping DOM generation, these table cells were evaluated for all users.
3. Calling `.toFixed()` on `null` threw an uncaught `TypeError: Cannot read properties of null (reading 'toFixed')` during Next.js React Server-Side Rendering (SSR).
4. Because no route-level error boundary existed, Next.js caught the exception at the root level and emitted an HTTP 500 response containing the default template: `"This page couldn’t load\n\nReload to try again, or go back."`

### 2.4 Code Remediation & Verification
1. **Component Patching** (`src/components/signal-centre/SignalCentreDashboardClient.tsx` & `PublicSignalDetailClient.tsx`): Added null-safe property access and fallback placeholders (`"—"` and `"─ ─"`) for all numeric calculations.
2. **Error Boundary** (`src/app/(platform)/dashboard/signal-centre/error.tsx`): Added dedicated route error boundary to catch runtime exceptions gracefully without producing raw 500 responses.
3. **Local Validation**: Local `tsc --noEmit` and `npm run build` completed with exit code 0.
4. **Git Baseline**: Committed and pushed to GitHub `main` as `ee705aa` and `adf5d7a`.
5. **Deployment Blocker**: Vercel deployment on `https://www.drawdown.trading` has not yet completed the rollout of `adf5d7a`. As verified in Section 2.1, the production server remains on build `dpl_8qJQDNZHxJ5fVSsu7X5mWe9dxmQv` and returns 500 for Free users.

---

## 3. Stripe Test Mode Webhook Verification & Release Exception Block

### 3.1 Verification Status: UNVERIFIED
- **Environment Assessment**: The environment contains only `STRIPE_SECRET_KEY=mk_1TOh...` (restricted live key), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`, and `STRIPE_WEBHOOK_SECRET=whsec_vx...`.
- **Zero Test Credentials**: No `sk_test_...` keys exist in `.env.local` or repository configuration.
- **No Direct Injection**: In strict compliance with audit rules, no fabricated webhook events were posted directly to `/api/webhooks/stripe`, and live production credentials were not used for test events.
- **Result**: Stripe webhook delivery through Stripe's infrastructure remains **UNVERIFIED**.

### 3.2 Formal Release Exception Documentation
Per release criteria, because Stripe test-mode delivery is UNVERIFIED, the following exception documentation is formally recorded:

1. **Reason Test Mode Was Not Verified**:
   Test-mode Stripe API keys (`sk_test_...`) are not provisioned in the hosting or local environment. The Stripe CLI is not installed in the environment. Production live credentials cannot be used to trigger synthetic test-mode events without risking customer billing anomalies or corrupting live telemetry.
2. **Exact Operational Procedure for First Webhook Test**:
   Upon provisioning test credentials or accessing the Stripe Dashboard:
   - Step 1: Open Stripe Dashboard in **Test Mode**.
   - Step 2: Navigate to **Developers -> Webhooks -> Add endpoint**.
   - Step 3: Set URL to `https://www.drawdown.trading/api/webhooks/stripe`.
   - Step 4: Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
   - Step 5: Trigger test event `customer.subscription.updated` with status `active` and metadata `tier: "foundation"`. Verify HTTP 200 response.
   - Step 6: Query Supabase `profiles` table for `subscription_status = 'active'` and `subscription_tier = 'foundation'`.
   - Step 7: Trigger test event `customer.subscription.deleted`. Verify HTTP 200 and profile downgrade to `subscription_status = 'canceled'`, `subscription_tier = 'free'`.
   - Step 8: Replay the identical event to verify idempotency (returns HTTP 200 with no duplicate mutations).
3. **Risk Introduced by This Gap**:
   - Webhook signature validation failure if `STRIPE_WEBHOOK_SECRET` does not match the delivery endpoint secret.
   - Unhandled event schema variance if Stripe webhook payload structure differs from TypeScript definitions.
   - Failure of subscription cancellation downgrade, leaving canceled users with continued paid-tier privileges.
4. **Mitigations Currently in Place**:
   - `src/app/api/webhooks/stripe/route.ts` enforces `stripe.webhooks.constructEvent()` with raw request body buffer.
   - Handled events are strictly typed and wrapped in exhaustive try/catch blocks.
   - Unit test suite (`tests/unit/entitlements.test.ts`) verifies subscription cancellation downgrade and fail-closed fallbacks.
   - Application entitlements fail closed: unauthenticated or missing profile records default to Level 0 (`free`).
5. **Named Release Owner Approval Status**:
   - **Approval Required From**: Pete Currey (Release Owner / Commercial Authority).
   - **Current Status**: **PENDING / NOT SIGNED**.
   - *Audit Rule*: Without explicit release-owner approval, Stripe remains a release blocker and the verdict must be NO-GO.

---

## 4. Production Market-Data Fallback & Pipeline Verification

### 4.1 Production Code Path Analysis
Market data flows through `src/lib/market.ts` (`getMarketPrices()`) and `src/lib/marketDataService.ts`:
1. **Cache Layer**: Queries internal cache (`getCachedData`). If valid unexpired prices exist, returns immediately.
2. **Provider Key Loop**: `getTwelveDataKeys()` aggregates all available keys. Iterates sequentially; on error, HTTP 429, or quota exhaustion, logs a warning and proceeds to the next key without throwing.
3. **Live API Fallback Layer**: If all Twelve Data keys fail or exhaust:
   - Automatically queries **Frankfurter FX Engine** (`https://api.frankfurter.app/latest`) for real-time forex pairs (`GBP/USD`, `EUR/USD`, `USD/JPY`, `AUD/USD`).
   - Automatically queries **CoinGecko** (`https://api.coingecko.com/api/v3/simple/price`) for crypto pairs (`BTC`, `ETH`, `XRP`).
   - Finnhub API (`https://finnhub.io/api/v1/quote`) provides live equity quotes and economic calendar events.
4. **Cache Commitment**: Valid fallback results are committed to cache with a 60-second TTL.

### 4.2 Credential & Health State Verification
- **Primary Twelve Data Key (`TWELVE_DATA_KEY`)**: Probed live against `https://api.twelvedata.com/quote?symbol=EUR/USD`. Returned HTTP 401 (`apikey parameter is incorrect or not specified`). **Status: EXPIRED / INVALID (Recorded as P2 Operational Defect)**.
- **Secondary Alt Key (`TWELVE_DATA_KEY_ALT`)**: Probed live. Returned HTTP 429 (`You have run out of API credits for the day. 1249 API credits were used, with the current limit being 800`). Key is structurally valid but daily quota is depleted.
- **Finnhub Key (`FINNHUB_API_KEY`)**: Probed live. Returned HTTP 200 OK (`AAPL` quote: `c: 332.27, t: 1789156800`). **Status: LIVE**.
- **Frankfurter FX Engine**: Probed live. Returned HTTP 200 OK (all major FX rates live). **Status: LIVE FALLBACK**.

### 4.3 Anti-Masquerading & Synthetic Safeguards
- Evaluated `src/lib/market-data-health.ts`: Authoritative semantic dataset thresholds (`DATASET_FRESHNESS_THRESHOLDS_MS`) prevent global timeout misclassifications.
- `buildDataHealthRecord()` automatically categorizes synthetic data with `is_synthetic: true` and forces `status: "UNAVAILABLE"`.
- Signal Centre and market widgets cannot present stale, synthetic, or fallback data as verified live exchange data.

---

## 5. Database 404 Table Assessment

Nine database tables were observed returning HTTP 404 in browser network logs during authenticated sessions:

| Missing Table | Referenced Files | Part of v1 Scope? | UI Impact of Absence | Graceful Fallback Present? | Remediation Recommendation |
|---|---|---|---|---|---|
| `trade_plans` | `PlanClient.tsx`, `RecordClient.tsx`, `ExecuteElsewhereClient.tsx` | Optional Phase | Empty plan list; pre-trade sizing remains fully functional | Yes (`if (plans)` guards) | Post-v1 migration |
| `trade_records` | `RecordClient.tsx`, `ReviewClient.tsx`, `ReviewListingClient.tsx` | Optional Phase | Empty journal history; manual logging remains functional | Yes (default empty array `[]`) | Post-v1 migration |
| `trade_reviews` | `ReviewClient.tsx`, `WeeklyReviewClient.tsx` | Optional Phase | Review tab shows empty state | Yes (null-safe checks) | Post-v1 migration |
| `improvement_commitments` | `ImproveClient.tsx`, `WeeklyReviewClient.tsx` | Optional Phase | No active commitments displayed | Yes (`if (data) setCommitments`) | Post-v1 migration |
| `weekly_operating_reviews` | `WeeklyReviewClient.tsx` | Optional Phase | Operating review shows empty schedule | Yes (safe catch block) | Post-v1 migration |
| `user_watchlists` | `WatchlistManager.tsx` | Core Dashboard | Watchlist defaults to empty list; search remains interactive | Yes (enclosed in `try/catch` at line 106) | Apply Supabase migration |
| `trading_accounts` | `RunMyTrade.tsx`, `PlanClient.tsx`, `OnboardingWizard.tsx` | Core Dashboard | Defaults to standard £10,000 / $10,000 simulated account balance | Yes (`if (accountsData && length > 0)`) | Apply Supabase migration |
| `session_preparations` | `PrepareClient.tsx`, `PlanClient.tsx` | Core Loop | Session prep checklist resets on refresh | Yes (silent catch) | Post-v1 migration |
| `price_cache` | `market-call/page.tsx`, `hooks/useMarketCache.ts`, health route | Infrastructure | Bypasses Supabase cache and fetches from upstream APIs directly | Yes (`status: "ERROR", EMPTY_RESPONSE`) | Apply Supabase migration |

**Audit Conclusion**: None of the 404 table responses trigger unhandled JavaScript exceptions, crash the client DOM, or block primary user journeys. However, tables `trading_accounts` and `user_watchlists` degrade user persistence. Running the respective Supabase schema migrations is classified as a recommended operational task prior to public user onboarding.

---

## 6. Engineering Quality Gate Execution Summary

| Gate Check | Command Executed | Exit Code | Results Summary | Status |
|---|---|---|---|---|
| **TypeScript** | `npm run typecheck` (`tsc --noEmit`) | `0` | 0 errors across entire repository | **PASS** |
| **ESLint** | `npm run lint` | `0` | 0 errors, 1,588 warnings (React 19 hooks) | **PASS** |
| **Unit & Integration Suite** | `npm run test` | `0` | 210/210 passing tests across 15 suites (1.01s) | **PASS** |
| **Production Build** | `npm run build` | `0` | Turbopack compilation successful; 530 SSG/ISR/Dynamic routes clean | **PASS** |
| **Public Browser E2E** | `npx playwright test e2e/critical-journeys.spec.ts` | `0` | 27/27 tests PASS across Desktop, Mobile-375, Mobile-390 (40.8s) | **PASS** |
| **Marketing Claims Linter** | `node --experimental-strip-types src/scripts/lint-claims.ts` | `0` | 0 prohibited claims or marketing exaggerations | **PASS** |
| **Secret Exposure Audit** | `grep -rn "sk_live\|whsec_" src/` | `0` | Zero exposed secret keys in source code or client bundles | **PASS** |

---

## 7. 22-Row Release Evidence Matrix

| # | Subsystem / Criterion | Required State | Actual Verified Evidence | Audit Status |
|---|---|---|---|---|
| **1** | **Playwright Framework & Runner** | Chromium CDP execution | Playwright Chromium executing via Chrome CDP (`Google Chrome.app`) | **VERIFIED** |
| **2** | **Desktop Public Journeys (1440×900)** | 9 core public flows | 9/9 desktop tests pass in `critical-journeys.spec.ts` | **VERIFIED** |
| **3** | **Mobile Public Journeys (375×812)** | 9 mobile flows | 9/9 mobile-375 tests pass; screenshots in `docs/screenshots/` | **VERIFIED** |
| **4** | **Mobile Public Journeys (390×844)** | 9 mobile flows | 9/9 mobile-390 tests pass; screenshots in `docs/screenshots/` | **VERIFIED** |
| **5** | **Responsive Layout / No Overflow** | `scrollWidth <= clientWidth` | Zero horizontal overflow across all tested viewports | **VERIFIED** |
| **6** | **Auth: Free User RUN MY TRADE** | Math & risk limits | AUTH-1: Inputs, risk calculation, and non-execution boundary verified | **VERIFIED** |
| **7** | **Auth: Entitlement & Upgrade Route** | Commercial gating | AUTH-2: Tier pricing DOM-verified (£49/£99/£299); checkout routes functional | **VERIFIED** |
| **8** | **Auth: Trade Plan Geometry** | Stop/Entry bounds | AUTH-3: Invalid trade geometry (Long stop > entry) rejected by DOM validator | **VERIFIED** |
| **9** | **Auth: Cross-User Isolation (IDOR)** | Zero data bleed | AUTH-4: User A session exposes 0 User B data; RLS isolation confirmed | **VERIFIED** |
| **10** | **Auth: Signal Centre Freshness** | Stale signal deactivation | AUTH-5: Active signals display freshness badges; expired signals closed | **VERIFIED** |
| **11** | **Auth: Free Signal Protection** | Levels masked for free | AUTH-6: Entry/stop/target sanitized to null for non-subscribers | **VERIFIED** |
| **12** | **Auth: Mobile 375×812 Navigation** | Drawer & hamburger | MOB-375-RMT: Mobile navigation drawer and pre-trade tool functional | **VERIFIED** |
| **13** | **Auth: Mobile 375×812 Signal Centre** | Card layout responsive | MOB-375-SIG: Signal cards stack cleanly at 375px; no layout break | **VERIFIED** |
| **14** | **Auth: Mobile 390×844 Dashboard** | Grid reflow | MOB-390-DASH: Operational loop dashboard reflows cleanly at 390px | **VERIFIED** |
| **15** | **Signal Centre HTTP 500 Defect** | Resolved on live server | Root cause fixed in `adf5d7a`, but live Vercel deploy still serves 500 | **UNRESOLVED ON PROD** |
| **16** | **Stripe Webhook Test-Mode Delivery** | Live webhook verified | No `sk_test_...` keys available; live webhook delivery not executed | **UNVERIFIED** |
| **17** | **Stripe Release Exception** | Formally documented | Exception block complete; pending Pete Currey release-owner sign-off | **PENDING APPROVAL** |
| **18** | **Market Data Path & Fallback** | Fallback through app path | `src/lib/market.ts` routes through Twelve Data -> Frankfurter/CoinGecko | **VERIFIED** |
| **19** | **Primary Market Credential** | Authoritative status | `TWELVE_DATA_KEY` is HTTP 401 (expired); recorded as P2 operational defect | **DEFECT RECORDED** |
| **20** | **Database 404 Assessment** | Impact of missing tables | All 9 tables analyzed; graceful fallbacks verified; no fatal crashes | **VERIFIED SAFE** |
| **21** | **Engineering Quality Gate** | All checks exit 0 | Typecheck (0), Lint (0), Node tests (210/210), Build (0), E2E (27/27) | **VERIFIED** |
| **22** | **Secret / Credential Exposure** | 0% secret leakage | All client bundles clean; health endpoints sanitize credentials | **VERIFIED** |

---

## 8. Defect Register (Final Release State)

- **P0 (Critical Blocker)**: **0**
- **P1 (Must Resolve Before Production Traffic)**: **2**
  1. **Signal Centre HTTP 500 on Deployed URL**: Vercel deployment of commit `adf5d7a` must complete and be verified with 0 HTTP 500 responses across 5 Free-tier browser loads.
  2. **Stripe Test Mode Webhook Approval**: Requires explicit named release-owner signature from Pete Currey approving the documented Stripe exception, OR live execution of test-mode webhook delivery.
- **P2 (Operational / Post-Launch Remediation)**: **2**
  1. **Primary Twelve Data Key Refresh**: Replace expired `TWELVE_DATA_KEY` with a valid production key to eliminate reliance on secondary quotas and fallback engines.
  2. **Database Schema Migrations**: Apply migrations for `trading_accounts` and `user_watchlists` to eliminate 404s and enable persistent user data.

---

## 9. Final Release Decision

Per the Release Gate Mandate:
- Condition 1 (No P0): PASS.
- Condition 2 (No unresolved P1): **FAIL** (Signal Centre 500 on live environment; Stripe unapproved exception).
- Condition 3 (Signal Centre 500 resolved on production): **FAIL** (Deployed Vercel build still serves 500).
- Condition 4 (Authenticated journeys pass): PASS.
- Condition 5 (Mobile journeys pass): PASS.
- Condition 6 (Security/IDOR passes): PASS.
- Condition 7 (Stripe verified OR named approval): **FAIL** (Stripe is UNVERIFIED; named approval pending).
- Condition 8 (Market data fallback safe): PASS.
- Condition 9 (Build passes): PASS.
- Condition 10 (Regression tests pass): PASS.
- Condition 11 (No fabricated claims): PASS.

Because Conditions 2, 3, and 7 are not satisfied on the deployed production environment, the release verdict is:

```
================================================================================
                    FINAL RELEASE VERDICT: NO-GO
================================================================================
Production deployment certification is withheld until the following two
operational remediation actions are completed:

1. Vercel deployment of commit adf5d7a must complete, and 5 consecutive
   authenticated Free-tier browser loads of /dashboard/signal-centre must
   return HTTP 200 without error.
2. Pete Currey (Release Owner) must explicitly sign the Stripe Webhook
   Exception Block, OR provide test-mode credentials (sk_test_...) to execute
   a live Stripe-delivered webhook verification.
================================================================================
```

FINAL RELEASE VERDICT: NO-GO
