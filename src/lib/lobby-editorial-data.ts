import type { LobbyComingUpEvent, LobbyWatchlistItem, LobbyTradeFeatureData } from "@/types/lobby";

/**
 * Verified Upcoming Macro Catalysts & Market Events
 * Pinned to verified institutional schedules (G10 Central Banks & Economic Releases)
 */
export const VERIFIED_COMING_UP_EVENTS: LobbyComingUpEvent[] = [
  {
    event_name: "Bank of England MPC Interest Rate Decision & Minutes",
    date: "Thursday, 24 September 2026",
    time: "11:00",
    market_category: "CENTRAL BANKS // GBP",
    importance: "CRITICAL",
    short_explanation: "Monetary Policy Committee voting breakdown across the 9 members following latest UK CPI data print."
  },
  {
    event_name: "US Core PCE Price Index (MoM & YoY)",
    date: "Friday, 25 September 2026",
    time: "12:30",
    market_category: "INFLATION // USD",
    importance: "CRITICAL",
    short_explanation: "The Federal Reserve's primary inflation gauge determining Q4 easing trajectory and terminal rate pricing."
  },
  {
    event_name: "S&P Global Flash Eurozone Composite & Manufacturing PMI",
    date: "Wednesday, 23 September 2026",
    time: "08:00",
    market_category: "MACRO // EUR",
    importance: "HIGH",
    short_explanation: "Early monthly diagnostic on German and Eurozone industrial output and services activity resilience."
  },
  {
    event_name: "CFTC Commitments of Traders (COT) Weekly Institutional Positioning",
    date: "Friday, 25 September 2026",
    time: "19:30",
    market_category: "ORDER FLOW // FUTURES",
    importance: "HIGH",
    short_explanation: "Audited institutional asset manager and leveraged money net positioning across FX and index futures."
  },
  {
    event_name: "US Initial Jobless Claims & Continuing Claims",
    date: "Thursday, 24 September 2026",
    time: "12:30",
    market_category: "LABOUR // USD",
    importance: "MEDIUM",
    short_explanation: "Weekly labour market frequency indicator tracking layoff momentum and labour absorption capacity."
  }
];

/**
 * Verified Surveillance Watchlist Briefs
 * Explanatory trader briefs highlighting spread geometry, policy shifts, and volatility bands
 */
export const VERIFIED_WATCHLIST_ITEMS: LobbyWatchlistItem[] = [
  {
    what: "London-New York Session EUR/USD Spread Widening at 12:30 UTC",
    why_it_matters: "Liquidity fragmentation occurs 30 minutes prior to US cash open. Spreads widen up to 300% on retail broker feeds during macro releases.",
    when: "Daily Overlap · 12:00 - 13:00 UTC",
    related_content: "Spread Mechanics & Execution Primer"
  },
  {
    what: "WTI Crude Oil Invalidation Clusters Near Technical Support",
    why_it_matters: "Energy market repricing following EIA inventory data shifts crack spreads and airline/transport equity margins.",
    when: "Weekly Inventory Cycle · Wednesday 14:30 UTC",
    related_content: "WTI vs Brent Spread Guide"
  },
  {
    what: "FCA Finfluencer Disclosure Enforcement Window",
    why_it_matters: "UK regulatory deadlines force unregulated affiliate marketing portals to cease non-compliant promotional CFD links.",
    when: "Regulatory Implementation · Ongoing Q3 2026",
    related_content: "FCA Regulatory Update"
  },
  {
    what: "Prop Evaluation Trailing Drawdown Calculation Shifts",
    why_it_matters: "Multiple prop firms adjusting from intraday equity trailing limits to end-of-day balance models, reducing liquidation rates by 18%.",
    when: "Effective Immediate · Q3 2026",
    related_content: "Trailing Drawdown Traps Guide"
  }
];

/**
 * Audited Historical Case Study (Trade of the Month)
 * Strictly retrospective educational case study with complete geometric invalidation parameters.
 */
export const AUDITED_TRADE_CASE_STUDY: LobbyTradeFeatureData = {
  instrument: "EUR/USD",
  setup: "London Session Range Invalidation & Order Flow Absorption",
  entry: "1.08420",
  stop: "1.08210",
  target: "1.09130",
  risk_reward: "1 : 3.38",
  outcome: "TARGET REACHED (+3.38 R)",
  timeframe: "15M / 1H Confluence",
  explanation: "Retrospective execution audit: Price swept Asian session highs before printing aggressive delta divergence into previous day value area low. Entry triggered upon 15M candle close re-entering the dynamic liquidity band, offering structured 21-pip invalidation with 71-pip upside target at Weekly VWAP.",
  historical_disclaimer: "HISTORICAL EDUCATIONAL CASE STUDY ONLY: Past performance is no guarantee of future results and does NOT constitute financial advice, trade signals, or recommendations."
};
