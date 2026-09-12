# Drawdown Dashboard — Product Architecture & Information Architecture

> **Version**: 2.0 (Prompt 04 Implementation)  
> **Core Principle**: WORKFLOW BEFORE NAVIGATION · TRUTH BEFORE FEATURES · CLARITY BEFORE COMPLEXITY

---

## 1. Product Philosophy: The Trading Operating Environment

Drawdown is not a catalogue of trading tools. It is a **professional operating environment** designed to enforce discipline across every phase of a trader's decision loop.

Every element of the authenticated dashboard serves one of four operational pillars:
1. **The Operating Cadence** (The disciplined cycle of preparation, risk planning, execution recording, and behavioral review).
2. **Market Intelligence** (Authoritative, multi-asset context and decision support — never raw trade instructions).
3. **Analytical Tools** (Precision quantitative instruments: position sizing, strategy backtesting, algorithm synthesis).
4. **Academy** (Structured skill acquisition directly reinforcing trading weaknesses).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DRAWDOWN OPERATING SYSTEM                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  OPERATING LOOP  │          │   INTELLIGENCE   │          │  TOOLS & ACADEMY │
├──────────────────┤          ├──────────────────┤          ├──────────────────┤
│ 1. Today         │          │ 1. The Wire      │          │ 1. Position Sizer│
│ 2. Prepare       │          │ 2. Market Pulse  │          │ 2. Backtester    │
│ 3. Plan & Size   │          │ 3. Signal Centre │          │ 3. Algo Builder  │
│ 4. Record & Log  │          │ 4. Institutional │          │ 4. Curriculum    │
│ 5. Review        │          └──────────────────┘          │ 5. Video Vault   │
│ 6. Improve       │                                        └──────────────────┘
└──────────────────┘
```

---

## 2. The Core 7-Stage Operating Loop

The platform guides traders sequentially through the professional trading cycle:

| Stage | Route | Question Answered | Key Capabilities |
|---|---|---|---|
| **1. PREPARE** | `/dashboard/prepare` | *"Am I psychologically and operationally fit to trade today?"* | Daily loss allowance check, news event risk screening, emotional state check-in, stand-down flag enforcement. |
| **2. PLAN** | `/dashboard/plan` | *"What is my exact technical setup, invalidation point, and risk thesis?"* | Instrument selection, directional bias, entry zone, invalidation price, risk-reward calculation, hypothesis notes. |
| **3. SIZE** | Contextual in Plan + `/dashboard/tools/position-sizer` | *"Exactly how many lots or units can I trade without exceeding risk limits?"* | Account balance integration, stop-loss distance calculation, pip/point value math, max loss limit safeguard. |
| **4. EXECUTE** | `/dashboard/plan/[id]/execute` | *"Am I respecting the execution boundary?"* | Explicit reminder: Drawdown does not route orders. Independent broker terminal execution checklist. |
| **5. RECORD** | `/dashboard/record` & `/dashboard/journal` | *"What actually happened during execution?"* | Fill price, slippage, lot size, entry/exit timestamp, trade screenshot, execution tags, emotional state at entry/exit. |
| **6. REVIEW** | `/dashboard/review` & `/dashboard/review/[id]` | *"Did I follow my plan, regardless of whether the trade won or lost?"* | Plan adherence scoring (1-5), risk discipline scoring (1-5), mistake classification, attribution of result to skill vs luck. |
| **7. IMPROVE** | `/dashboard/improve` & `/dashboard/weekly-review` | *"What single behavioral rule will I commit to improving next?"* | Active commitment tracker, weekend operating review, win rate and drawdown trend analysis. |

---

## 3. Desktop Navigation Architecture

### 3.1. Top Header Navigation
- **Left**: Drawdown brand anchor with environment badge.
- **Center**: Workflow Stage Bar with clean progressive tabs:
  - `Today` (`/dashboard`)
  - `Prepare` (`/dashboard/prepare`)
  - `Plan` (`/dashboard/plan`)
  - `Journal` (`/dashboard/journal`)
  - `Review` (`/dashboard/review`)
  - `Improve` (`/dashboard/improve`)
- **Right**: Active session pulse, notification bell (`The Wire`), User profile & tier badge.

### 3.2. Left Sidebar Navigation
Organised into 4 logical groups (collapsible to 56px icon rail):

```
OPERATING LOOP
├─ Today                    (/dashboard)
├─ Session Prep             (/dashboard/prepare)
├─ Trade Planning           (/dashboard/plan)
├─ Trade Journal & Logs     (/dashboard/journal)
├─ Process Review           (/dashboard/review)
└─ Improvement Focus        (/dashboard/improve)

MARKET INTELLIGENCE
├─ Daily Wire & News        (/dashboard/the-wire)
├─ Market Workspace         (/dashboard/market-intelligence)
├─ Signal Centre            (/dashboard/signal-centre)
└─ Institutional Flows      (/dashboard/intelligence)

ANALYTICAL TOOLS
├─ Position Sizer           (/dashboard/tools/position-sizer)
├─ Strategy Backtester      (/dashboard/tools/backtester)
├─ Algo Builder             (/dashboard/tools/algo-builder)
└─ Challenge Simulator      (/dashboard/simulator)

ACADEMY & COMMUNITY
├─ Trader Curriculum        (/dashboard/curriculum)
├─ Video Library            (/dashboard/learn)
├─ Weekly Breakdowns        (/dashboard/breakdowns)
├─ Live Events              (/dashboard/events)
└─ Community & Floor        (/dashboard/community)

BOTTOM UTILITY
├─ Trading Accounts         (/dashboard/accounts)
├─ Settings & Billing       (/dashboard/profile)
└─ Logout
```

---

## 4. Mobile Navigation Architecture

Mobile users require fast access to active risk, daily preparation, and trade logging. The desktop menu is not simply shrunk; it is refactored into a mobile-first 5-tab bottom bar and a quick-action drawer:

### Bottom Navigation Bar (≤768px Viewport)
1. **Today** (`/dashboard`): Current balance, drawdown buffer, and the single "Next Action".
2. **Plan** (`/dashboard/plan`): Setup creation and quick position sizing.
3. **Journal** (`/dashboard/journal`): View historical log and access "+ Record Trade".
4. **Markets** (`/dashboard/the-wire`): Morning brief and session news.
5. **Menu** (Drawer): Full access to Academy, Tools, Accounts, and Settings.

---

## 5. Dashboard Home Architecture ("Today")

The home screen answers: **"What do I need to know or do right now?"**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER: Good Morning, Pete · Active Session · Today's Date               │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 2. ACCOUNT & RISK SNAPSHOT (7 Cols)  │ 3. NEXT RECOMMENDED ACTION (5 Cols)  │
│ • Current Balance & Equity           │ • Contextual Stage Indicator         │
│ • Real-time Drawdown vs Breach Limit │ • Single Highest-Priority Action     │
│ • Daily Loss Buffer Remaining        │ • Primary CTA Button                 │
│ • MTD Win Rate, P&L, Current Streak  │ • 3-Stage Mini Operating Progress    │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ 4. SUPPORTING CONTEXT (3 Columns)                                           │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌─────────────────────┐ │
│ │ Active Watchlist      │ │ Daily Brief (The Wire)│ │ Weekly Commitment   │ │
│ │ • Prices & Sessions   │ │ • Macro narrative     │ │ • Rule adherence   │ │
│ │ • Alert triggers      │ │ • Sessional catalysts │ │ • Target sign-off   │ │
│ └───────────────────────┘ └───────────────────────┘ └─────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. MARKET INTELLIGENCE WORKSPACE                                            │
│ • Multi-timeframe trend & momentum scanner                                 │
│ • Live session liquidity timeline (Tokyo → London → NY overlap)            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Progressive Disclosure & Tier Integration

Drawdown serves three experience tiers without interface clutter:
- **Foundational Traders (Beginners)**: Interface highlights Session Prep, Trade Planning, Risk Calculator, and Phase 1-4 Curriculum. Advanced algo tools are discoverable but locked with clear value explanations.
- **Funded Prop Traders (Intermediate)**: Highlights Drawdown Defense, Prop Firm Rules, Multi-Timeframe Scanner, and Signal Centre.
- **Quantitative & Systematic Traders (Advanced)**: Unlocks Strategy Backtester, Algo Strategy Builder (Pine Script/Python), Institutional Flows, and Investment Centre.

Entitlement boundaries fail closed on the server while locked UI cards explain what the capability does and why it matters.
