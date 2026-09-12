/**
 * Pure deterministic calculations and geometric validators for Drawdown Signal Centre.
 * Zero external network or database dependencies.
 */

// Symbol mappings between Drawdown slugs and Twelve Data symbols
export const TD_SYMBOL_MAP: Record<string, string> = {
  "XAU/USD": "XAU/USD",
  "XAG/USD": "XAG/USD",
  "GBP/USD": "GBP/USD",
  "EUR/USD": "EUR/USD",
  "USD/JPY": "USD/JPY",
  "GBP/JPY": "GBP/JPY",
  "SPX": "SPX",
  "NDX": "NDX",
  "DJI": "DJI",
  "FTSE": "FTSE",
  "BTC/USD": "BTC/USD",
  "ETH/USD": "ETH/USD",
  "SOL/USD": "SOL/USD",
};

/**
 * Pure deterministic calculation of signal levels (entry, stop, targets, R:R).
 */
export function calculateSignalLevels(
  price: number,
  atr: number,
  bias: "BULLISH" | "BEARISH"
) {
  const stopDistance = 1.5 * atr;
  const targetDistance = 3.0 * atr;
  const entry_price = price;
  const stop_loss = parseFloat((bias === "BULLISH" ? price - stopDistance : price + stopDistance).toFixed(5));
  const take_profit_1 = parseFloat((bias === "BULLISH" ? price + (1.5 * atr) : price - (1.5 * atr)).toFixed(5));
  const take_profit_2 = parseFloat((bias === "BULLISH" ? price + targetDistance : price - targetDistance).toFixed(5));
  const take_profit_3 = parseFloat((bias === "BULLISH" ? price + (4.5 * atr) : price - (4.5 * atr)).toFixed(5));

  const risk = Math.abs(entry_price - stop_loss);
  const reward = Math.abs(take_profit_2 - entry_price);
  const rr_ratio = risk > 0 ? parseFloat((reward / risk).toFixed(2)) : 0;

  return {
    entry_price,
    stop_loss,
    take_profit_1,
    take_profit_2,
    take_profit_3,
    rr_ratio,
  };
}

/**
 * Validates the geometric integrity of signal levels.
 */
export function validateSignalGeometry(levels: {
  bias: "BULLISH" | "BEARISH";
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { bias, entry_price, stop_loss, take_profit_1, take_profit_2 } = levels;

  if (entry_price <= 0 || isNaN(entry_price)) {
    errors.push("Entry price must be a positive number");
  }
  if (stop_loss <= 0 || isNaN(stop_loss)) {
    errors.push("Stop loss must be a positive number");
  }

  if (bias === "BULLISH") {
    if (stop_loss >= entry_price) {
      errors.push(`Long setup stop loss (${stop_loss}) must be strictly below entry (${entry_price})`);
    }
    if (take_profit_1 <= entry_price || take_profit_2 <= entry_price) {
      errors.push(`Long setup targets must be strictly above entry (${entry_price})`);
    }
  } else if (bias === "BEARISH") {
    if (stop_loss <= entry_price) {
      errors.push(`Short setup stop loss (${stop_loss}) must be strictly above entry (${entry_price})`);
    }
    if (take_profit_1 >= entry_price || take_profit_2 >= entry_price) {
      errors.push(`Short setup targets must be strictly below entry (${entry_price})`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Pure calculation of the Drawdown Consensus Score (DCS).
 * Weighted model consensus: Claude (40%), GPT-4o (35%), Grok (25%).
 */
export function calculateDcsScore(
  claudeVerdict: "BULLISH" | "BEARISH" | "NEUTRAL",
  claudeConfidence: number,
  gpt4Verdict: "BULLISH" | "BEARISH" | "NEUTRAL",
  gpt4Confidence: number,
  grokVerdict: "BULLISH" | "BEARISH" | "NEUTRAL",
  grokConfidence: number
): number {
  const cDir = claudeVerdict === "BULLISH" ? 1 : claudeVerdict === "BEARISH" ? -1 : 0;
  const gDir = gpt4Verdict === "BULLISH" ? 1 : gpt4Verdict === "BEARISH" ? -1 : 0;
  const kDir = grokVerdict === "BULLISH" ? 1 : grokVerdict === "BEARISH" ? -1 : 0;

  const weightedDir = (cDir * 0.4) + (gDir * 0.35) + (kDir * 0.25);
  const weightedConf = (claudeConfidence * 0.4) + (gpt4Confidence * 0.35) + (grokConfidence * 0.25);

  const isAligned = (cDir === gDir && gDir === kDir);
  const alignmentMultiplier = isAligned ? 1.0 : Math.abs(weightedDir);
  return Math.max(10, Math.round(weightedConf * alignmentMultiplier));
}
