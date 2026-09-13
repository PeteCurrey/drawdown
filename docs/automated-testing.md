# DRAWDOWN.TRADING — AUTOMATED TESTING ARCHITECTURE & REGRESSION SUITE
## Phase 19: Engineering Quality Gate & Automated Testing Specification
**Date**: September 2026  
**Auditor**: Lead QA Engineer, Security Auditor & Principal Architect  
**Status**: ACTIVE & VERIFIED  

---

## 1. Testing Architecture Overview

The Drawdown automated testing suite is built directly on Node.js's native test runner (`node:test` and `node:assert/strict`) utilizing `--experimental-strip-types`. This architecture provides:
- **Zero-Transpilation Overhead**: Tests run directly against TypeScript source files without intermediate build artifacts or Babel/SWC layers.
- **Zero-Mock Leakage**: Production business logic (`position-sizing.ts`, `entitlements.ts`, `freshness.ts`, `signal-engine.ts`) is executed authentically.
- **Sub-Second Execution**: The entire 210-test suite executes in < 1,000ms.
- **Deterministic Reliability**: Zero network dependencies in unit/integration tests; time-dependent logic uses explicit frozen or relative ISO timestamps.
- **Fail-Closed Assertions**: Non-zero exit codes are strictly enforced on any assertion failure. No swallowed errors or warnings masquerading as passes.

---

## 2. Canonical Test Commands

The standard testing entry points configured in `package.json`:

| Command | Target Scope | Description | Typical Duration |
|---|---|---|---|
| `npm run test` | `tests/**/*.test.ts` | Complete test suite (210 tests across all modules) | ~900ms |
| `npm run test:unit` | `financial-calculations`, `tool-functional-audit`, `signal-freshness` | Mathematical, sizing, tool, and threshold unit tests | ~280ms |
| `npm run test:integration` | `security-access`, `entitlements`, `run-my-trade`, `conversion-architecture`, `market-data-health`, `signal-centre-integrity`, `seo-technical-audit` | Database schemas, API routes, Stripe webhooks, RLS, and security gates | ~520ms |
| `npm run test:e2e` | `production-e2e-journeys` | Critical multi-step user flows (Anonymous -> Free -> RUN MY TRADE -> Upgrade -> Floor) | ~180ms |
| `npm run typecheck` | `tsc --noEmit` | Full TypeScript compiler validation across whole codebase | ~7,000ms |
| `npm run lint` | `eslint` | ESLint 9 + Next.js Core Web Vitals + TypeScript checks | ~35,000ms |
| `npm run build` | `NODE_OPTIONS='--max-old-space-size=4096' next build` | Next.js Turbopack production compilation | ~90,000ms |

---

## 3. Test Inventory & Coverage Breakdown

Total test count: **210 passing tests** across 15 test files.

### 3.1 Financial & Trading Calculations (`tests/financial-calculations.test.ts`)
- **Multi-Asset Sizing**: Validated across Forex Majors (EUR/USD), JPY pairs (USD/JPY), Commodities (Gold XAU/USD), Crypto (BTC/USD), Indices (SPX500, US30).
- **Geometric Invariants**: Enforces strict stop < entry < target for Longs; stop > entry > target for Shorts. Rejects target <= entry and stop >= entry.
- **Extreme & Edge Cases**: Validates handling of zero balance, negative prices, NaN, Infinity, risk > 100%, and negative risk fallback.
- **Prop Firm Safeguards**: Validates daily loss limit warning thresholds and maximum drawdown impact calculations.

### 3.2 Security, Access & IDOR (`tests/security-access.test.ts`)
- **Stripe Checkout Validation**: Validates that checkout verifies `priceId` server-side and rejects client-supplied tier overrides.
- **Stripe Webhook Idempotency**: Validates deduplication and cancellation fallback to free tier.
- **Server-Side IDOR Sanitisation**: Signal Centre and Signal Detail routes sanitize entry/stop/target levels server-side before returning HTML to non-entitled users.
- **Canonical Entitlements**: Verifies zero local `TIER_WEIGHT` definitions exist outside `src/lib/entitlements.ts`.

### 3.3 RUN MY TRADE & Execution Boundary (`tests/run-my-trade.test.ts`)
- **Non-Execution Verification**: Confirms that RUN MY TRADE creates structured trade plans and immutable snapshots without calling broker execution endpoints.
- **Account Ownership Enforcement**: Verifies user ID validation against `trading_accounts`.
- **Market Data Independence**: Confirms calculations succeed gracefully even when live market feeds are unavailable.

### 3.4 Market Data Health & Reliability (`tests/market-data-health.test.ts`)
- **Provenance & State Classification**: Evaluates LIVE, RECENT, STALE, UNAVAILABLE, and ERROR states.
- **Anti-Masquerading**: Signals or quotes older than threshold (15m for intraday, 48h for daily) are strictly tagged STALE or EXPIRED.
- **Time-Series Integrity**: Detects duplicate timestamps and rejects impossible OHLC structures.

### 3.5 Signal Centre Integrity (`tests/signal-centre-integrity.test.ts`)
- **Consensus Scoring**: DCS consensus calculation fallback when individual LLMs fail.
- **Universe Discipline**: Strictly enforces the 52-signal universe (13 instruments × 4 timeframes).
- **Stale Market Data Cutoff**: Signals based on stale upstream data are automatically deactivated.

### 3.6 SEO & Indexation Architecture (`tests/seo-technical-audit.test.ts`)
- **Programmatic Sitemap**: Validates `sitemap.ts` dynamic output, live timestamps, canonical URLs, and exclusion of thin doorway pages.
- **Dynamic Robots**: Validates blocking of `/dashboard/`, `/admin/`, `/partner/`, `/api/`, `/checkout/`.
- **Zero Fabricated Schema Ratings**: Confirms absence of fake `AggregateRating` schemas.

### 3.7 Production End-to-End User Journeys (`tests/production-e2e-journeys.test.ts`)
- **Journey A**: Anonymous visitor -> free registration -> RUN MY TRADE calculation.
- **Journey B**: Free user -> locked feature -> pricing -> upgrade to Foundation -> unlock Signal Centre -> verify Investment Centre requires Edge, full courses require Floor.
- **Journey C**: Trade plan creation non-execution boundary.
- **Journey D**: Cross-user data isolation.
- **Journey E**: Market data freshness anti-masquerading.
- **Journey F**: SEO and robots.txt indexation consistency.

---

## 4. CI/CD Pipeline Configuration

In CI environments (e.g. GitHub Actions), the gate is executed via:
```bash
# 1. Install clean dependencies
npm ci

# 2. Typecheck
npm run typecheck

# 3. Claims compliance
node --experimental-strip-types src/scripts/lint-claims.ts

# 4. Lint
npm run lint

# 5. Full test suite
npm run test

# 6. Production build
npm run build
```
All six steps must exit with code 0 for deployment approval.
