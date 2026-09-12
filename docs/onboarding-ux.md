# Drawdown — Onboarding & First-Time User Experience (UX)

> **Purpose**: Establish an authoritative, honest, and disciplined onboarding architecture for first-time traders joining Drawdown.

---

## 1. Onboarding Philosophy: Discipline from Day Zero

Drawdown is an institutional-grade operating platform for disciplined traders. The onboarding experience reinforces this positioning:
1. **Truth Before Features**: No fake deployment verifications, no synthetic trading history, no simulated win-rates.
2. **Operator Calibration**: Collects only actionable operational parameters (style, capital scale, base currency, focus markets, goals).
3. **Immediate Operating Direction**: Transitions the operator directly to **Stage 0 (Account Setup)** and **Stage 1 (Session Preparation)**.

---

## 2. The 5-Step Onboarding Sequence

The onboarding modal runs as a focused 5-step sequence (`src/components/dashboard/OnboardingWizard.tsx`):

### Step 1: Identity & Persona
* **Fields Collected**:
  * `firstName` (string, required)
  * `lastName` (string, required)
  * `trading_style` (single select: `scalper` | `day_trader` | `swing_trader` | `position_trader`)
* **Validation**: Continue button is disabled until all three inputs are populated.
* **Purpose**: Personalises the operating greeting and calibrates intraday session cadence.

### Step 2: Experience & Region
* **Fields Collected**:
  * `experience_level` (single select: `beginner` [<1yr] | `intermediate` [1–3yrs] | `advanced` [3+yrs])
  * `country` (select: UK, US, EU, AU, SG, HK, OTHER)
  * `currency` (select: GBP, USD, EUR, AUD, SGD, HKD)
* **Validation**: Disabled until experience level is selected.
* **Purpose**: Calibrates base currency across position sizers and regional intelligence.

### Step 3: Market & Capital
* **Fields Collected**:
  * `preferred_markets` (multi-select: `forex`, `indices`, `crypto`, `commodities`)
  * `trading_capital` (single select: `10k` | `50k` | `100k+`)
* **Validation**: Requires at least one market selected and capital tier selected.
* **Purpose**: Focuses the watchlist, market scanner, and risk allocation limits.

### Step 4: Active Objectives
* **Fields Collected**:
  * `trading_goals` (single select: `pass_challenge` | `build_consistency` | `full_time_income` | `master_smc_mechanics`)
* **Validation**: Requires goal selection.
* **Purpose**: Shapes next recommended actions and priority checklist focus.

### Step 5: Operating Setup (Confirmation)
* **UI Structure**:
  * Static confirmation banner: `STATUS: PROFILE CONFIGURED // [TIER] TIER ACTIVE` with static `CheckCircle2` (no simulated pulse or fake scanning).
  * Honest summary of recorded parameters (style, markets, base currency).
  * **Direct, Actionable Links**:
    1. **Stage 0: Configure Trading Account** (`/dashboard/accounts`)
    2. **Stage 1: Session Preparation** (`/dashboard/prepare`)
    3. **Market Intelligence: The Wire** (`/dashboard/the-wire`)
  * Primary Action: **Launch Terminal** button saves profile and routes directly to `/dashboard/accounts`.

---

## 3. Authoritative State & Storage Architecture

### Server-Side Authority
The database is the single source of truth:
* Table: `profiles`
* Field: `email_preferences.onboarding.has_onboarded` (boolean)
* Additional fields updated: `display_name`, `full_name`, `country`, `currency`, `updated_at`.
* API Route: `POST /api/user/onboard` verifies session auth and updates profile via server internal Supabase client.

### Client-Side Cache
* LocalStorage keys: `drawdown_onboarded_${userId}` and `drawdown_onboarded`.
* If `hasOnboardedDb === true`, localStorage is populated automatically.
* The wizard only appears if `hasOnboardedDb` is false and no local session key exists.
* In the event of a network or API failure during completion, `submitError` is displayed and the wizard remains open so user progress is not silently lost.

---

## 4. Post-Onboarding Transition: The Operating Loop

When the user exits the onboarding sequence:
```
Onboarding Complete ──► /dashboard/accounts (Stage 0: Connect Account)
                                │
                                ▼
                       /dashboard/prepare (Stage 1: Daily Risk & Readiness)
                                │
                                ▼
                       /dashboard/plan (Stage 2: Setup Hypothesis & Limits)
```

If the user navigates directly to the dashboard, the **Next Action** engine detects:
1. `!account` ──► Recommends **Stage 0: Configure Your Trading Account**.
2. `account && !todayPrep` ──► Recommends **Stage 1: Start Session Preparation**.
3. `todayPrep.outcome === 'stand_down'` ──► Enforces **Stand Down Active**.
4. `draftPlan` ──► Recommends **Stage 2: Complete Draft Trade Plan**.
5. `readyPlan` ──► Recommends **Stage 3: Enter Execution Boundary**.
6. `pendingReviews.length > 0` ──► Recommends **Stage 5: Complete Process Review**.
