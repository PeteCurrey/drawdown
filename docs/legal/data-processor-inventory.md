# Drawdown Data Processor Inventory

This document lists all third-party data processors, external API integrations, data flows, and infrastructure providers utilized across the **Drawdown** platform (operated by **Black & Rowan Management Group Limited t/a Drawdown**).

Last Updated: August 4, 2026  
Document Version: `LEG-PROC-2026-V1`

---

## Data Processors & Integrations Summary

| Provider | Core Purpose | Data Categories | Primary Location | Retention / Deletion | Model Training | Transfer Safeguards | Key Codebase Locations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase** | Core Database, Auth, Storage & Realtime API | Identity (Email, User ID), Trade Journals, Broker Statements, App Preferences, Session Logs, RLS Security | EU / AWS London (eu-west-2) | Active for account lifecycle. Backups rotated up to 90 days. User data export & deletion enabled. | No | UK International Data Transfer Agreement / UK Addendum | `src/lib/supabase/`, `@supabase/supabase-js`, `@supabase/ssr` |
| **Stripe** | Payment Processing, Subscription Management, Billing Portal | Name, Email, Payment Metadata, Billing Address, Payment Instrument (PCI-DSS compliant via Stripe Elements), Subscription Status | US / Global | 6 years for statutory accounting & tax compliance | No | UK Addendum to EU SCCs / EU-US Data Privacy Framework | `src/config/stripe.ts`, `@stripe/stripe-js`, `stripe`, `src/app/api/courses/checkout/route.ts` |
| **Resend** | Transactional Email Delivery, System Notifications, Newsletters | Name, Email Address, Delivery Logs, Open/Click Metrics | US / EU | Transactional logs retained up to 30 days. Opt-out/suppression list retained permanently. | No | Standard Contractual Clauses / DPA | `src/app/actions/accelerator-actions.ts`, `src/app/actions/dashboard.ts`, `resend` |
| **Anthropic (Claude AI)** | AI Trade Journaling, Strategy Analysis, Signal Consensus | Pseudonymised Trading Logs, Journal Prompts, Strategy Parameters | US | 30-day API prompt retention for safety monitoring; zero persistent storage | No (Opted out on API tier) | UK Addendum / Standard Contractual Clauses | `@anthropic-ai/sdk`, `src/app/api/algo-builder/generate/route.ts`, `src/app/actions/blog.ts` |
| **OpenAI (GPT-4o)** | AI Signal Consensus, Intelligence Debates | Pseudonymised Market Indicators, Strategy Prompts | US | 30-day API prompt logging for abuse detection; zero retention option where configured | No (Opted out on API tier) | Standard Contractual Clauses | `ai` (Vercel AI SDK), `src/app/api/intelligence/ai-debate/` |
| **TradingView (Lightweight Charts)** | Financial Charting, Market Indicators, Technical Analysis | Anonymised Technical Chart Request Preferences (Client-side rendering) | US / Global CDN | Client-side transient local state only | No | N/A (Client-side library) | `lightweight-charts`, `src/components/tools/` |
| **Mux** | Educational Video Streaming & Hosting | Video playback metrics, Session IDs, Device type | US | Anonymised analytics retained up to 90 days | No | Standard Contractual Clauses | `@mux/mux-player-react`, `src/components/courses/` |
| **Cal.com** | Mentorship & Strategy Call Scheduling | Name, Email, Appointment Time, Call Notes | US / EU | Retained for appointment duration plus 1 year | No | Standard Contractual Clauses | `@calcom/embed-react`, `src/app/(platform)/dashboard/mentorship/page.tsx` |
| **PostHog / Vercel Analytics** | Platform Performance, Route Analytics, Error Diagnostics | IP Address (hashed/anonymised), User Agent, Route Paths, Feature Toggles | US / EU | Configured 90-day retention window | No | Standard Contractual Clauses / DPA | `src/components/admin/TrackPageView.tsx`, `next.config.ts` |

---

## Detailed Data Processing Descriptions

### 1. Database & Authentication (Supabase)
- **Data Held**: User account UUIDs, email addresses, encrypted password hashes, user profile preferences, AI trade journal entries, strategy parameters, saved watchlist items, user course progress, and consent audit logs (`legal_acceptances`).
- **Access Controls**: Enforced via Supabase Row-Level Security (RLS) policies allowing users access only to their own record rows.
- **Model Training**: Supabase is a managed database host and does not use client database contents to train machine learning models.

### 2. Payment Administration (Stripe)
- **Data Held**: Customer IDs, Stripe subscription IDs, payment status, transaction amounts, currency (GBP), checkout session IDs.
- **PCI Compliance**: All payment card details are collected directly by Stripe inside PCI-DSS Level 1 compliant hosted elements. Raw card numbers never touch Drawdown servers.
- **Model Training**: Stripe processes payment data solely for transaction execution, fraud detection, and regulatory reporting.

### 3. Transactional & System Emails (Resend)
- **Data Held**: Recipient email address, email headers, timestamp, delivery status, suppression preferences.
- **Purpose**: Order confirmations, subscription changes, cancellation confirmations, security alerts, and legal notice updates.

### 4. AI Tooling & Large Language Model Providers (Anthropic & OpenAI)
- **Data Held**: Anonymised/pseudonymised user prompts, trade journal summaries, technical chart parameters submitted to AI analysis tools.
- **Data Safeguards**: System prompts explicitly strip personal identification. Zero API model training applies under standard enterprise API terms.

---

## Security & Transfer Assessment

All data transfers outside the UK or EEA rely on adequacy decisions, the UK International Data Transfer Agreement (IDTA), or the UK Addendum to the EU Standard Contractual Clauses (SCCs).

No sensitive personal data (such as financial account login credentials or government identity documents) is requested, processed, or stored by Drawdown.
