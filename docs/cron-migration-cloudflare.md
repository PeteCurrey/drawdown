# Cloudflare Cron → Workers → Workflows Architecture & Migration Guide

> **Status: Phase 2 Implemented & Validated**  
> Cloudflare Worker & Workflows scheduler project configured in `cloudflare-scheduler/`.  
> All 11 background jobs restored to their original production frequencies via Cloudflare Cron Triggers & Workflows.  
> Drawdown application remains hosted on Vercel without relying on Vercel Cron.

---

## 1. Target Architecture

```text
Cloudflare
├── Cron Triggers (UTC)
│   └── 5-minute master tick (*/5 * * * *) + explicit trigger routing
│
├── drawdown-scheduler (Cloudflare Worker)
│   ├── Dispatcher & UTC Due-Time Evaluator
│   ├── In-Flight Concurrency Lock (Overlap Protection)
│   ├── Authenticated Invoker (Authorization: Bearer $CRON_SECRET)
│   ├── Error Classifier (2xx, 401/403, 429, 5xx, timeouts)
│   └── Structured Logger (Zero Secret Leaks)
│
└── Cloudflare Workflows (Durable Multi-Step Orchestration)
    ├── MorningBriefWorkflow (Step 1: generate-morning → Step 2: send-broadcast)
    ├── EveningWrapWorkflow (Step 1: generate-evening → Step 2: send-broadcast)
    └── DailyReportWorkflow (Step 1: generate-report → Step 2: verify)
            │
            ▼ HTTPS Request (Bearer $CRON_SECRET)
Vercel
└── Drawdown Application API Routes (Business Logic Owner)
            │
            ▼
Supabase
└── PostgreSQL Database / Auth / Application Data
```

---

## 2. Production Schedule Inventory & Migration Status

| # | Job Name | Frequency | Cloudflare Mechanism | Target Endpoint / Workflow | Status |
|---|----------|----------:|----------------------|----------------------------|--------|
| 1 | **Signal Scan** | `*/5 * * * *` (Every 5m) | Worker HTTP Invoker | `/api/signals/scan` | **Migrated & Validated** |
| 2 | **Market Sync** | `*/30 * * * *` (Every 30m) | Worker HTTP Invoker | `/api/cron/market-sync` | **Migrated & Validated** |
| 3 | **Update Prices** | `*/30 * * * *` (Every 30m) | Worker HTTP Invoker | `/api/cron/update-prices` | **Migrated & Validated** |
| 4 | **Morning Brief (Weekdays)** | `0 7 * * 1-5` (07:00 UTC) | `MorningBriefWorkflow` | `generate-morning` → `send-broadcast` | **Migrated & Validated** |
| 5 | **Morning Brief (Weekends)** | `0 8 * * 0,6` (08:00 UTC) | `MorningBriefWorkflow` | `generate-morning` → `send-broadcast` | **Migrated & Validated** |
| 6 | **Evening Wrap** | `0 17 * * 1-5` (17:00 UTC) | `EveningWrapWorkflow` | `generate-evening` → `send-broadcast` | **Migrated & Validated** |
| 7 | **Breaking News** | `*/15 * * * *` (Every 15m) | Worker HTTP Invoker | `/api/the-wire/breaking-news` | **Migrated & Validated** |
| 8 | **Social Ingest** | `*/15 * * * *` (Every 15m) | Worker HTTP Invoker | `/api/cron/social-ingest` | **Migrated & Validated** |
| 9 | **Discipline Report** | `0 20 * * 0` (Sun 20:00 UTC) | Worker HTTP Invoker | `/api/cron/discipline-report` | **Migrated & Validated** |
| 10 | **Daily Report** | `0 6 * * *` (06:00 UTC daily) | `DailyReportWorkflow` | `/api/cron/daily-report` → verify | **Migrated & Validated** |
| 11 | **Lobby Ingest** | `*/15 * * * *` (Every 15m) | Worker HTTP Invoker | `/api/cron/lobby-ingest` | **Migrated & Validated** |

---

## 3. Workflow Rationale (Why Durable Execution?)

### A. Morning Brief (`MorningBriefWorkflow`)
- **Reason**: The previous implementation sequentially called `/api/email/generate-morning` (LLM-based text/HTML generation) and `/api/email/send-broadcast` (Resend broadcast delivery). If the broadcast failed or encountered network latency, the expensive LLM generation had to be rerun from scratch on retry.
- **Workflow Steps**:
  1. `generate-morning-brief`: Calls `/api/email/generate-morning`, persists generated `emailSendId`, subject, and HTML content in durable state.
  2. `send-morning-broadcast`: Calls `/api/email/send-broadcast` with the payload from Step 1. Retries independently without re-generating LLM content.

### B. Evening Wrap (`EveningWrapWorkflow`)
- **Reason**: Identical 2-phase pipeline as Morning Brief. Decouples generation from delivery for fault isolation and durable retry.
- **Workflow Steps**:
  1. `generate-evening-wrap`: Calls `/api/email/generate-evening`, persists generated content.
  2. `send-evening-broadcast`: Dispatches email send with independent retry policy.

### C. Daily Report (`DailyReportWorkflow`)
- **Reason**: Daily Report aggregates quotes, RSI, 4 FRED series, Finnhub economic calendar, and multi-model AI analysis. On serverless runtimes, timeouts can cause partial data loss.
- **Workflow Steps**:
  1. `generate-daily-report`: Calls `/api/cron/daily-report`.
  2. `verify-daily-report-completion`: Confirms the `report_date` record was committed to `daily_briefings`.

---

## 4. Concurrency & Overlap Protection

Fast-cadence jobs (`Signal Scan` every 5m, `Breaking News`, `Social Ingest`, and `Lobby Ingest` every 15m) carry risks of execution overlap if a third-party upstream API is slow.
- **In-Flight Lock**: `src/lock.ts` maintains an active in-flight lease for each running job.
- If a subsequent cron trigger fires while a previous run of the same job is still active, the dispatcher logs `JOB_SKIPPED_OVERLAP` and skips the tick safely without creating duplicate database entries, signals, or broadcast emails.
- Locks have automatic expiration (matching `job.timeoutMs`) to prevent permanent lockouts if an unhandled network partition occurs.

---

## 5. Security & Secret Configuration

The Worker never hard-codes secrets or endpoints and injects `Authorization: Bearer $CRON_SECRET` on every request.

### Required Cloudflare Secrets & Variables

| Variable / Secret | Type | Purpose | Production Example |
|---|---|---|---|
| `CRON_SECRET` | Encrypted Secret | Authenticates Worker with Drawdown API routes | Stored in Cloudflare Vault |
| `DRAWDOWN_API_URL` | Plaintext Var | Base URL of the Drawdown deployment | `https://drawdown.io` |
| `ENVIRONMENT` | Plaintext Var | Deployment tier (`production`, `staging`, `development`) | `production` |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | Secret (Optional) | Bypasses Vercel Deployment Protection if active | Optional secret |

### Setting Secrets in Cloudflare

Run the following command from the repository root or `cloudflare-scheduler/`:

```bash
# Set production cron secret
npx wrangler secret put CRON_SECRET --config cloudflare-scheduler/wrangler.jsonc

# Optional: Set Vercel protection bypass token if deployment protection is active
npx wrangler secret put VERCEL_AUTOMATION_BYPASS_SECRET --config cloudflare-scheduler/wrangler.jsonc
```

---

## 6. Deployment & Rollout Runbook

### Prerequisites
1. Cloudflare account with Workers & Workflows enabled (available on Free and Paid plans).
2. Authenticated via `npx wrangler login`.

### Deployment Commands

```bash
# 1. Validate TypeScript & unit tests
npm run scheduler:typecheck
npm run scheduler:test

# 2. Deploy to Production
npm run scheduler:deploy

# Or deploy to staging environment
npx wrangler deploy --config cloudflare-scheduler/wrangler.jsonc --env staging
```

### Manual Trigger & Operational Health Check

The Cloudflare Worker exposes operational endpoints for monitoring and manual verification:

- **Health Check**:
  ```bash
  curl https://drawdown-scheduler.<your-subdomain>.workers.dev/health
  ```
- **Schedule Inventory**:
  ```bash
  curl https://drawdown-scheduler.<your-subdomain>.workers.dev/inventory
  ```
- **Authenticated Manual Job Invocation**:
  ```bash
  curl -X POST https://drawdown-scheduler.<your-subdomain>.workers.dev/trigger/signal-scan \
    -H "Authorization: Bearer <CRON_SECRET>"
  ```

---

## 7. Rollback Procedure

If scheduled execution needs to be immediately paused without impacting the Drawdown Vercel application:

1. **Option A: Disable Cron Trigger via Wrangler**
   Edit `cloudflare-scheduler/wrangler.jsonc`, comment out the `triggers.crons` block, and redeploy:
   ```bash
   npm run scheduler:deploy
   ```
2. **Option B: Disable Worker in Cloudflare Dashboard**
   Navigate to **Cloudflare Dashboard** → **Workers & Pages** → `drawdown-scheduler` → **Settings** → **Triggers** → Disable Cron Triggers.
3. The Drawdown Next.js application on Vercel is completely decoupled and will continue serving frontend traffic, manual scans, and user dashboards without disruption.
