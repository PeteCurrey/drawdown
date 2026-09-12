# Drawdown Entitlement Model

> **Single source of truth:** `src/lib/entitlements.ts`

All entitlement decisions across the platform must go through the functions and constants exported by `src/lib/entitlements.ts`. Local tier weight definitions in individual files are prohibited.

---

## Tier Hierarchy

| Tier | Level | Price | Description |
|------|-------|-------|-------------|
| `free` | 0 | Free | Unauthenticated or unpaid users |
| `signal-centre` | 1 | Legacy | Grandfathered tier — signal access only |
| `foundation` | 1 | £49/mo | Signal Centre, Core Journal, Risk Calculator |
| `edge` | 2 | £99/mo | Foundation + Investment Centre + Macro Intelligence |
| `floor` | 3 | £299/mo | Edge + Full Course Library + Mentorship + Algo Builder export |
| `accelerator` | 4 | £1,500 one-off | Intensive cohort access |

---

## Subscription Status Requirement

**Paid tier privileges are only active when `subscription_status` is `'active'` or `'trialing'`.**

| Status | Effective Level |
|--------|----------------|
| `active` | Full tier level |
| `trialing` | Full tier level |
| `past_due` | 0 (free) |
| `unpaid` | 0 (free) |
| `cancelled` / `canceled` | 0 (free) |
| `inactive` | 0 (free) |

**Exception:** `accelerator` tier always resolves to level 4, regardless of status (cohort-based access).

---

## Core Principles

### Fail Closed
- Unauthenticated users always resolve to level 0.
- DB errors always resolve to level 0.
- When in doubt: deny access.

### Server-Side Enforcement
- Client-side gates (CSS blur, UI conditionals) are UX only — never security boundaries.
- All access decisions must be enforced server-side before any privileged data is sent to the client.

### Admin Bypass
- Users with `role = 'admin'` bypass all tier gates on all server routes.
- Admin check: `profile.role === 'admin'`.

---

## Feature Access Matrix

| Feature | Required Tier | `CommercialAccess` Predicate |
|---------|--------------|------------------------------|
| Signal Centre | Foundation (1) | `canAccessSignalCentre()` |
| Chart AI Analysis | Foundation (1) | `canAccessSignalCentre()` |
| News AI Explanation | Foundation (1) | `canAccessSignalCentre()` |
| Journal AI Analysis | Foundation (1) | `canAccessSignalCentre()` |
| Investment Centre | Edge (2) | `canAccessInvestmentCentre()` |
| AI Debate | Edge (2) | `canAccessInvestmentCentre()` |
| Grok Sentiment | Edge (2) | `canAccessInvestmentCentre()` |
| Macro Intelligence | Edge (2) | `hasTierAccess(tier, 'edge', status)` |
| Events Page | Edge (2) | `hasTierAccess(tier, 'edge', status)` |
| Full Course Library | Floor (3) | `canAccessFullCourses()` |
| Mentorship | Floor (3) | `canAccessMentorship()` |
| Algo Builder Export | Floor (3) | `canAccessAlgoBuilderExport()` |

---

## API Reference

```typescript
import {
  TIER_WEIGHT,           // Record<string, number> — tier to level map
  TIER_LEVELS,           // Alias for TIER_WEIGHT
  isSubscriptionActive,  // (status) => boolean
  getEffectiveTierLevel, // (tier, status?) => number
  hasTierAccess,         // (userTier, requiredTier, userStatus?) => boolean
  CommercialAccess,      // Object with boolean predicate methods
  resolveUserEntitlement // async (supabase, userId) => EntitlementResult
} from "@/lib/entitlements";
```

### Standard Server Route Pattern

```typescript
const { data: profile } = await authClient.from("profiles")
  .select("subscription_tier, subscription_status, role")
  .eq("id", user.id)
  .single();

const tier = (profile as any)?.subscription_tier;
const status = (profile as any)?.subscription_status;
const isAdmin = (profile as any)?.role === "admin";

if (!isAdmin && !CommercialAccess.canAccessSignalCentre(tier, status)) {
  return NextResponse.json(
    { error: "An active Foundation subscription or higher is required." },
    { status: 403 }
  );
}
```

---

## Data Provenance

Tier and status are **always read from `profiles.subscription_tier` and `profiles.subscription_status`** — never from JWT metadata or client-supplied values.

`profiles.subscription_tier` and `profiles.subscription_status` are write-protected by the `protect_sensitive_profile_fields()` Postgres trigger. Only `service_role` callers (the Stripe webhook) can update them.
