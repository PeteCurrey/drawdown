# Drawdown Platform — Canonical Terminology & Vocabulary Dictionary

> **Standardisation Purpose**: Eliminate ambiguity, overlapping meanings, and marketing drift across the codebase, documentation, and user interfaces.  
> **Rule**: Use one consistent term for each domain concept. Never use terms interchangeably.

---

## 1. Core Vocabulary Table

| Term | Canonical Definition | Forbidden / Confusing Synonyms | Where Used |
|---|---|---|---|
| **Trading Account** | A specific brokerage, prop firm challenge, or funded account with capital balance and drawdown limits. | Do NOT use "Portfolio", "Wallet", or "Fund" when referring to a user's trading balance. | `/dashboard/accounts`, Dashboard Account Widget |
| **Trade Plan** | A pre-execution hypothesis defining instrument, directional bias, invalidation level, target zone, and proposed risk percentage before entering the market. | Do NOT call an unexecuted plan a "Trade", "Position", or "Order". | `/dashboard/plan`, `trade_plans` table |
| **Position** | An active market exposure currently open in a broker terminal. Drawdown tracks planned and recorded parameters, but does not manage live broker positions directly. | Do NOT call a trade plan a "Position". | Risk Calculator, Execution Boundary |
| **Trade Record** | The historical record of an executed trade containing actual entry price, exit price, size, slippage, and outcome. | Do NOT confuse with "Trade Plan" (pre-market) or "Trade Review" (post-market scoring). | `/dashboard/record`, `trade_records`, `trades` |
| **Trade Review** | The post-trade disciplined evaluation of whether the trader followed their pre-trade plan and respected risk boundaries, independent of P&L. | Do NOT call this a "Journal Entry" or "Post-Mortem". | `/dashboard/review`, `trade_reviews` |
| **AI Trade Journal** | The unified analytical repository of all recorded trades, performance analytics, calendar visualisations, emotional tags, and AI pattern detection. | Do NOT use "Diary", "Logbook", or "Notes". | `/dashboard/journal` |
| **Signal** | An algorithmic or multi-model market observation providing technical setup data, DCS consensus scoring, and directional confluence for educational and decision-support purposes. | NEVER call a signal an "Instruction", "Call", "Recommendation", or "Tip". | `/dashboard/signal-centre`, `signals` table |
| **Idea / Setup** | A discretionary market observation identified by a trader during preparation or scanning that has not yet been formalized into a Trade Plan. | Do NOT confuse with an authoritative "Signal" or a committed "Trade Plan". | Market Scanner, Watchlist |
| **Session Preparation** | The pre-market check-in protocol covering news risks, daily loss limits, and psychological readiness before charting. | Do NOT call this "Daily Brief" (which is the market intelligence newsletter). | `/dashboard/prepare`, `session_preparations` |
| **The Wire** | Drawdown's morning and afternoon macro market intelligence briefing and live catalyst stream. | Do NOT confuse with "Session Preparation" or "The Library". | `/dashboard/the-wire`, `daily_briefings` |
| **Market Intelligence** | Multi-asset macro context, technical market structure, sessional volume, and institutional data feeds. | Do NOT use interchangeably with "Signal Centre". | `/dashboard/market-intelligence` |
| **Technical Scanner** | Multi-timeframe algorithmic screening tool identifying technical confluences (RSI, EMA, momentum, trend) across 40+ assets. | Do NOT call it "Signal Generator" or "Bot". | `/dashboard/tools/technical-scanner` |
| **Strategy Backtester** | Historical candle simulation engine testing rules against up to 5,000 bars of historical OHLC data. | Do NOT call it "Paper Trading" or "Demo". | `/dashboard/tools/backtester` |
| **Algo Strategy Builder** | Code generation tool converting discretionary rules into Pine Script v6 and Python. | Do NOT call it "Auto Trader" or "Robot". | `/dashboard/tools/algo-builder` |
| **Curriculum** | The 13-Phase structured trader education pathway featuring video lessons, module notes, quizzes, and certificates. | Do NOT confuse with "The Library" (which is the archive of live recorded sessions). | `/dashboard/curriculum` |
| **The Library** | The video vault of recorded live mentoring calls, market recaps, and mindset briefings. | Do NOT call it "Curriculum". | `/dashboard/learn` |
| **Drawdown** | The peak-to-trough decline in account equity, expressed in currency or percentage. In prop firm contexts, specifically refers to the remaining buffer before challenge breach. | Do NOT confuse with "Loss" (a single trade outcome). | Account Widget, Position Sizer |
| **Max Loss Limit** | The hard monetary or percentage threshold where trading must halt for the session or account life. | Do NOT call this "Stop Loss" (which is an order-level parameter). | Prepare, Accounts |

---

## 2. Terminology Governance Rules

1. **Trade Lifecycle Sequence**:
   - `MARKET IDEA` &rarr; `TRADE PLAN` &rarr; `POSITION SIZE` &rarr; `EXECUTION RECORD` &rarr; `TRADE REVIEW` &rarr; `IMPROVEMENT COMMITMENT`.
   - Never skip terminology stages in copy or navigation.
2. **Signals Are Decision Support**:
   - Every reference to Signal Centre must frame outputs as *confluence analysis* and *decision support*.
   - Never promise or imply automated profit, guaranteed accuracy, or execution instructions.
3. **Accounts vs Portfolios**:
   - Drawdown users trade specific individual trading accounts (e.g., *FTMO 100k Challenge #1*, *Interactive Brokers Personal*). Use the term **Trading Account**. The aggregate of all accounts is the **Account Overview**, not a "Hedge Fund Portfolio".
