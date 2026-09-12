# Drawdown Security Model

> **Principle:** TRUTH BEFORE FEATURES. FAIL CLOSED. No client-side security boundaries.

---

## Core Principles

### 1. Fail Closed
Every security gate defaults to denying access when:
- The user is not authenticated
- The database returns an error
- The subscription status is anything other than `active` or `trialing`
- The tier cannot be resolved

### 2. Server-Side Enforcement
All security boundaries are enforced on the server before any data is sent to the client.
Client-side conditionals (CSS blur, UI gating) are for UX only and are never relied upon for security.

### 3. Authoritative Database Records
Tier and subscription status are read exclusively from `public.profiles`. They cannot be modified by:
- JWT user metadata
- Client-supplied POST body values
- Any caller without `service_role` privilege

### 4. Admin Bypass
Users with `profiles.role = 'admin'` bypass tier gates on all server routes. Admin status is read from the database — not from JWT claims.

---

## Layer Architecture

```
Browser / Client
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Next.js API Routes & Server Components             │
│  ┌─────────────────────────────────────────────┐    │
│  │  1. Authentication (Supabase Auth)          │    │
│  │     createClient().auth.getUser()           │    │
│  │     → 401 if no session                     │    │
│  │                                             │    │
│  │  2. Rate Limiting (AI routes only)          │    │
│  │     checkAndLogAiUsage(userId, action)      │    │
│  │     → 429 if exceeded                       │    │
│  │                                             │    │
│  │  3. Entitlement Check                       │    │
│  │     CommercialAccess / hasTierAccess()      │    │
│  │     reads: subscription_tier, status, role  │    │
│  │     → 403 if insufficient tier              │    │
│  │                                             │    │
│  │  4. Data Sanitisation (signal pages)        │    │
│  │     sanitizeSignalForPreview()              │    │
│  │     strips sensitive fields server-side     │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Supabase (PostgreSQL + RLS)                        │
│                                                     │
│  • RLS enabled on all user tables                   │
│  • protect_sensitive_profile_fields() trigger       │
│    blocks writes to subscription_tier, status,      │
│    role, stripe_customer_id, stripe_subscription_id │
│    from non-service_role callers                    │
│  • stripe_events table: RLS, no public policies     │
│  • grant_floor_courses(): service_role only         │
│  • get_user_id_by_email(): service_role only        │
└─────────────────────────────────────────────────────┘
```

---

## Stripe Webhook Security

The Stripe webhook is the **only legitimate path** to changing a user's subscription tier or status.

| Control | Detail |
|---------|--------|
| Signature verification | `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET` |
| Idempotency | Events recorded in `stripe_events` table; duplicate `stripe_event_id` = already processed (Postgres unique constraint) |
| Tier validation | `metadata.tier` from Stripe session — written server-side at checkout using `getTierFromPriceId()` |
| Cancellation handling | Forces `subscription_tier = 'free'` when status is `canceled` or `unpaid` |
| DB writes | Via `service_role` client only |

---

## Stripe Checkout Security

At checkout, the server validates that the client-supplied `tier` matches the `priceId` using `getTierFromPriceId()`. A mismatch is rejected with HTTP 400 before any Stripe session is created.

The `authoritativeTier` (resolved from `priceId`) — not the client-supplied tier — is written to the Stripe session metadata.

---

## Signal Data Protection

Signal fields containing alpha (entry/exit prices, TP/SL, AI analysis, R:R ratios) are stripped server-side for users without an active subscription, before the data object is passed to any client component.

**Fields stripped for non-subscribers:**
- `entry_price`, `stop_loss`, `take_profit_1`, `take_profit_2`
- `rr_ratio`
- `claude_analysis`, `gpt4_analysis`, `grok_analysis`
- `taapi_data`, `coingecko_data`, `ai_debate`

Sanitisation is performed in:
- `src/app/(platform)/dashboard/signal-centre/page.tsx`
- `src/app/(platform)/dashboard/signal-centre/signals/[id]/page.tsx`

---

## Protected Routes Summary

| Route | Auth | Tier Gate | Notes |
|-------|------|-----------|-------|
| `POST /api/ai/chart-analysis` | ✅ | Foundation | + rate limit |
| `POST /api/ai/explain-news` | ✅ | Foundation | + rate limit |
| `POST /api/ai/journal-analysis` | ✅ | Foundation | + rate limit |
| `POST /api/signals/scan` | ✅ | Foundation | CRON_SECRET exempt |
| `POST /api/market/analysis` | ✅ | Foundation | |
| `GET /api/intelligence/ai-debate/[symbol]` | ✅ | Edge | |
| `POST /api/intelligence/grok-sentiment` | ✅ | Edge | |
| `POST /api/algo-builder/generate` | ✅ | Floor | |
| `GET/POST /api/algo-builder/strategies` | ✅ | Floor | |
| `POST /api/stripe/checkout` | ✅ | — | Validates priceId/tier match |
| `POST /api/stripe/webhook` | — | — | Stripe signature only |

---

## Database Trigger: protect_sensitive_profile_fields()

Defined in `supabase/migrations/20260912_entitlement_security_hardening.sql`.

Blocks `UPDATE` on `public.profiles` for the following columns when called by any non-service_role caller:
- `subscription_tier`
- `subscription_status`
- `role`
- `stripe_customer_id`
- `stripe_subscription_id`

This prevents any authenticated user (including admins authenticating via the client SDK) from self-modifying their subscription tier.

---

## Test Coverage

| Test File | What It Covers |
|-----------|---------------|
| `tests/entitlements.test.ts` | Tier hierarchy, status enforcement, CommercialAccess predicates |
| `tests/security-access.test.ts` | Signal sanitisation, checkout validation, webhook idempotency, tier gates on AI routes, no local TIER_WEIGHT definitions |
