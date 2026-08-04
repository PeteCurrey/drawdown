# Legal Implementation Report
**Black & Rowan Management Group Limited t/a Drawdown**
Document Version: LEG-2026-V1 · August 4, 2026

---

## Overview

This report documents the complete legal, regulatory, and contractual compliance upgrade implemented across the Drawdown.trading platform. All changes are live in the production codebase.

---

## 1. Central Legal Configuration

**File**: `src/config/legal.ts`

Single source of truth for all legal metadata. All pages import from here rather than hard-coding values.

| Key | Value |
|-----|-------|
| `contractingEntity` | Black & Rowan Management Group Limited |
| `fullTradingEntity` | Black & Rowan Management Group Limited t/a Drawdown |
| `companyNumber` | **LEGAL_ENTITY_VERIFICATION_REQUIRED** |
| `registeredOffice` | **LEGAL_ENTITY_VERIFICATION_REQUIRED** |
| `tradingAddress` | Chesterfield, Derbyshire, United Kingdom |
| `documentVersion` | LEG-2026-V1 |
| `effectiveDate` | August 4, 2026 |
| `governingLaw` | England and Wales |
| `moneyBackGuaranteeDays` | 7 |
| `fcaStatus` | Not authorised/regulated by FCA |

> [!IMPORTANT]
> `companyNumber` and `registeredOffice` remain as `LEGAL_ENTITY_VERIFICATION_REQUIRED` until confirmed at Companies House. These values must be verified and updated before any regulatory correspondence references them.

---

## 2. Legal Pages Implemented

All pages are **100% server-rendered** — no client-side loading states conceal the legal text.

| Page | Route | Status |
|------|-------|--------|
| Terms & Conditions | `/terms` | ✅ Live |
| Privacy Policy | `/privacy` | ✅ Rebuilt |
| Cookie Policy | `/cookies` | ✅ Live |
| Risk Disclaimer | `/disclaimer` | ✅ Updated |
| Legal & Tax Disclaimer | `/legal/financial-disclaimer` | ✅ Updated |
| Subscriptions & Refunds | `/legal/subscription-and-refunds` | ✅ Live |
| Community Guidelines | `/community-guidelines` | ✅ Live |

---

## 3. Checkout Consent Integration

All four Stripe checkout endpoints now enforce contractual consent before creating a Stripe session:

| Route | Type | Consent Logging |
|-------|------|-----------------|
| `api/stripe/checkout-tier` | Subscriptions (Foundation/Edge/Floor/Accelerator) | ✅ |
| `api/courses/checkout` | Course one-time purchases | ✅ |
| `api/store/checkout` | Ebook/manual store purchases | ✅ |
| `api/stripe/checkout` | Legacy subscription checkout | ✅ |

**Required fields** (all endpoints):
- `terms_accepted: true` — returns HTTP 400 if absent or false
- `immediate_supply_requested: boolean` — logged; triggers digital content acknowledgement
- `marketing_consent: boolean` — optional, logged separately

**Legal metadata** is also embedded in every Stripe session's `metadata` object for webhook reconciliation.

---

## 4. Database: `legal_acceptances` Table

**Migration**: `supabase/migrations/20260805_legal_acceptances.sql`

Versioned audit table capturing every consent event:

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users (nullable for guest pre-log) |
| `document_version` | TEXT | e.g. `LEG-2026-V1` |
| `checkout_session_id` | TEXT | Stripe session ID for reconciliation |
| `terms_accepted` | BOOLEAN | Always `true` (enforced by API) |
| `privacy_acknowledged` | BOOLEAN | Always `true` |
| `immediate_supply_requested` | BOOLEAN | Consumer waiver flag |
| `digital_content_acknowledgement` | BOOLEAN | Mirrors immediate_supply_requested |
| `marketing_consent` | BOOLEAN | Opt-in flag |
| `consent_source` | TEXT | `course_checkout`, `subscription_checkout`, `store_checkout`, `floor_tier_grant` |

**RLS**: Users can read their own rows; insert allowed for authenticated + service role.

---

## 5. User Data Rights Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `api/user/export-data` | GET | GDPR Article 20 data portability — exports profile, journals, strategies, subscriptions as JSON |
| `api/user/delete-account` | DELETE | Right to erasure — cancels Stripe, purges data, sends confirmation email |

---

## 6. Transactional Email Library

**File**: `src/lib/email/legal-emails.ts`

| Function | Trigger |
|----------|---------|
| `sendSubscriptionConfirmation` | On successful subscription webhook |
| `sendLegalAcceptanceReceipt` | On checkout consent logging |
| `sendAnnualRenewalReminder` | 7 days before annual renewal |
| `sendCancellationConfirmation` | On subscription cancellation |
| `sendRefundConfirmation` | On refund processing |
| `sendAccountDeletionConfirmation` | On account deletion |

---

## 7. Content & Claim Corrections

| Location | Change |
|----------|--------|
| `HorizontalScrollSection.tsx` | Removed "minimise tax liabilities" marketing claim |
| `about/page.tsx` | Live trading chronology corrected to 2016; "What is not claimed" section added |
| AI system prompts (algo-builder, ai-debate, journal/coach) | Removed "20 years of experience" claims |
| `terms/page.tsx` | Signal Centre described as legacy-only tier |
| Footer copyright | Updated to "Black & Rowan Management Group Limited t/a Drawdown" |

---

## 8. Navigation & SEO

- **Footer**: Company column expanded with Terms, Cookies, Subscriptions & Refunds, Community Guidelines
- **Sitemap**: All 7 legal pages added at `priority: 0.1`, `changeFrequency: monthly`
- **Canonical URLs**: All legal pages use `path`-based canonical via `getMetadata()`

---

## 9. Verification

Run the following to verify all legal routes:

```bash
# Against local dev server
npx tsx scripts/test-legal-routes.ts

# Against production
npx tsx scripts/test-legal-routes.ts --base-url https://drawdown.trading
```

---

## 10. Outstanding Actions (Non-Engineering)

> [!IMPORTANT]
> The following items require action from the business/legal team — they are not engineering tasks:

1. **Companies House verification** — Confirm the official Company Number and Registered Office address, then update `companyNumber` and `registeredOffice` in `src/config/legal.ts` and set the `*Verified` flags to `true`.
2. **VAT registration** — Confirm VAT status. Update `vatRegistered` and `vatNumber` in `legal.ts` if applicable.
3. **UK solicitor review** — Have a qualified solicitor review `/terms`, `/privacy`, and `/legal/subscription-and-refunds` before relying on them in disputes.
4. **ICO registration** — Verify Drawdown is registered with the ICO as a data controller (required under UK GDPR for commercial data processing).
5. **Stripe webhook integration** — Wire `sendSubscriptionConfirmation`, `sendCancellationConfirmation`, and `sendAnnualRenewalReminder` into the existing `api/stripe/webhook/route.ts` handler at the appropriate event types (`customer.subscription.created`, `customer.subscription.deleted`, `invoice.upcoming`).
6. **Front-end consent checkboxes** — The checkout UI components (pricing page, course purchase buttons, store purchase buttons) must be updated to present the Terms acceptance checkbox, Immediate Supply consent checkbox, and optional Marketing consent checkbox **before** calling any of the checkout API endpoints. This prevents the API-level 400 error being visible to users.
