# Drawdown Dashboard — Analytics Event Taxonomy

> **Purpose**: Define standard telemetry and instrumentation events to measure trader engagement, operating loop adherence, and feature discovery without compromising user privacy.

---

## 1. Operating Loop Events

These events measure how effectively traders complete the 7-stage disciplined trading cycle:

| Event Name | Trigger | Payload / Properties | Business Objective |
|---|---|---|---|
| `operating_loop_stage_viewed` | User navigates to any workflow stage | `{ stage: 'prepare' \| 'plan' \| 'record' \| 'review' \| 'improve', previous_stage: string }` | Track navigation flow through the daily operating cadence. |
| `session_prep_started` | User opens `/dashboard/prepare` | `{ user_tier: string, has_active_account: boolean }` | Measure pre-market engagement. |
| `session_prep_completed` | User signs off on daily checklist | `{ outcome: 'ready' \| 'caution' \| 'stand_down', max_loss_defined: boolean }` | Track stand-down discipline rate. |
| `trade_plan_created` | User submits a trade plan | `{ instrument: string, direction: 'buy' \| 'sell', has_invalidation: boolean, has_target: boolean }` | Measure planning thoroughness. |
| `position_size_calculated` | User calculates lot size | `{ instrument: string, risk_percentage: number, account_id: string }` | Track risk calculator adoption inside trade planning. |
| `trade_recorded` | User logs an executed trade | `{ instrument: string, plan_matched: boolean, has_screenshot: boolean, emotional_state: string }` | Measure trade capture rate. |
| `trade_review_completed` | User completes review of a trade | `{ plan_adherence_score: number, risk_discipline_score: number, mistake_tagged: boolean }` | Track process scoring vs pure P&L focus. |
| `improvement_commitment_created` | User commits to a behavioral rule | `{ category: 'process' \| 'risk' \| 'mindset' \| 'analysis', origin: 'review' \| 'manual' }` | Track continuous improvement adoption. |
| `weekly_review_submitted` | User signs off on weekend review | `{ week_start: string, total_trades: number, discipline_avg: number }` | Measure weekly retention and operating loop closure. |

---

## 2. Dashboard Home & Navigation Events

| Event Name | Trigger | Payload / Properties |
|---|---|---|
| `dashboard_home_viewed` | User lands on `/dashboard` | `{ user_tier: string, account_count: number, has_today_prep: boolean, pending_review_count: number }` |
| `next_action_clicked` | User clicks the primary CTA in the Next Action panel | `{ stage: string, target_url: string, action_text: string }` |
| `quick_operating_step_clicked` | User clicks one of the 3 mini operating loop cards | `{ step: 'prepare' \| 'plan' \| 'review', status: 'pending' \| 'complete' }` |
| `navigation_item_clicked` | User clicks any link in the top bar or sidebar rail | `{ destination: string, nav_location: 'top_header' \| 'sidebar_loop' \| 'sidebar_intel' \| 'sidebar_tools' \| 'sidebar_academy' \| 'mobile_bottom' }` |
| `mobile_menu_toggled` | User opens/closes mobile drawer | `{ state: 'open' \| 'close' }` |

---

## 3. Intelligence & Analytical Tools Events

| Event Name | Trigger | Payload / Properties |
|---|---|---|
| `wire_brief_viewed` | User reads morning/afternoon brief | `{ report_date: string, read_duration_seconds: number }` |
| `signal_card_inspected` | User opens signal detail view | `{ signal_id: string, instrument: string, dcs_score: number, is_locked: boolean }` |
| `market_scanner_filtered` | User changes timeframe or instrument in scanner | `{ instrument: string, timeframe: string }` |
| `backtester_run_executed` | User runs a historical simulation | `{ strategy_slug: string, symbol: string, candle_count: number }` |
| `algo_strategy_generated` | User generates Pine Script / Python code | `{ strategy_type: string, output_language: 'pine' \| 'python' }` |

---

## 4. Commercial & Account Events

| Event Name | Trigger | Payload / Properties |
|---|---|---|
| `account_created` | User links a prop firm or broker account | `{ account_type: 'prop_firm' \| 'live_broker' \| 'demo', currency: string, initial_balance: number }` |
| `tier_gate_encountered` | User attempts to access a feature above their tier | `{ required_tier: string, current_tier: string, feature_name: string }` |
| `upgrade_cta_clicked` | User clicks "Upgrade Plan" from locked feature | `{ source_feature: string, required_tier: string }` |

---

## 5. Onboarding & Conversion Events

| Event Name | Trigger | Payload / Properties | Business Objective |
|---|---|---|---|
| `onboarding_wizard_started` | Wizard modal renders on first login | `{ user_id: string, initial_tier: string }` | Measure initial onboarding modal activation. |
| `onboarding_step_completed` | User advances through any of the 5 wizard steps | `{ step_number: number, step_name: string, payload_snapshot: Record<string, any> }` | Pinpoint onboarding drop-off points. |
| `onboarding_completed` | User successfully completes wizard step 5 | `{ trading_style: string, experience_level: string, capital: string, primary_goal: string }` | Track profile completion rate and calibration accuracy. |
| `onboarding_wizard_dismissed` | Wizard closed or bypassed | `{ step_reached: number }` | Measure premature abandonment. |
| `subscription_confirmed_banner_viewed` | Return from Stripe with `?subscription=success` | `{ user_id: string, current_tier: string }` | Track successful conversion return rate. |
| `subscription_confirmed_banner_dismissed` | User dismisses post-checkout confirmation | `{ time_visible_ms: number }` | Confirm post-checkout acknowledgement. |

