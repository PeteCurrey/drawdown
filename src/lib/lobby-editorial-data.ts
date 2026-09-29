import type { LobbyTradeFeatureData } from "@/types/lobby";

/**
 * Audited Historical Case Study (Trade of the Month)
 * Strictly retrospective educational case study with complete geometric invalidation parameters.
 * Note: Historical educational case studies are NOT live market intelligence and carry prominent disclaimers.
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
