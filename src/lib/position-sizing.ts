/**
 * src/lib/position-sizing.ts
 *
 * Authoritative position sizing and risk quantification engine for Drawdown.
 * Provides unified, deterministic calculations for:
 * - RUN MY TRADE decision workflow
 * - Strategy Planning (Stage 2)
 * - Risk Calculator (Stage 3 / Analytical Tools)
 * - Server-side validation APIs
 */

export interface InstrumentSpec {
  id: string;
  label: string;
  pip: number;
  mult: number;
  isForex: boolean;
}

export const POSITION_INSTRUMENT_SPECS: Record<string, InstrumentSpec> = {
  "forex-major": { id: "forex-major", label: "Forex Major (EUR/USD, GBP/USD...)", pip: 10, mult: 10000, isForex: true },
  "forex-minor": { id: "forex-minor", label: "Forex Minor (GBP/JPY, USD/JPY...)", pip: 10, mult: 100, isForex: true },
  "forex-exotic": { id: "forex-exotic", label: "Forex Exotic (USD/TRY, USD/ZAR...)", pip: 10, mult: 1000, isForex: true },
  "index-pts": { id: "index-pts", label: "Index - Points (FTSE, US30...)", pip: 1, mult: 1, isForex: false },
  "index-cash": { id: "index-cash", label: "Index - Cash (NAS100, SPX500...)", pip: 1, mult: 1, isForex: false },
  "commodity": { id: "commodity", label: "Commodity (Gold, Oil, Silver...)", pip: 1, mult: 10, isForex: false },
  "crypto": { id: "crypto", label: "Crypto (BTC, ETH...)", pip: 1, mult: 1, isForex: false },
  "stock": { id: "stock", label: "Stock / Share", pip: 0.01, mult: 100, isForex: false },
  "custom": { id: "custom", label: "Custom Instrument", pip: 10, mult: 1, isForex: false },
};

/**
 * Resolves an instrument symbol or slug to its authoritative sizing specification.
 */
export function resolveInstrumentSpec(symbolOrSlug: string): InstrumentSpec {
  const clean = (symbolOrSlug || "").toUpperCase().replace(/[\s\/\-_]/g, "");

  if (!clean) {
    return POSITION_INSTRUMENT_SPECS["forex-major"];
  }

  // JPY pairs
  if (clean.includes("JPY")) {
    return POSITION_INSTRUMENT_SPECS["forex-minor"];
  }

  // Metals & Commodities
  if (
    clean.includes("XAU") ||
    clean.includes("GOLD") ||
    clean.includes("XAG") ||
    clean.includes("SILVER") ||
    clean.includes("WTI") ||
    clean.includes("OIL") ||
    clean.includes("NATGAS") ||
    clean.includes("COPPER")
  ) {
    return POSITION_INSTRUMENT_SPECS["commodity"];
  }

  // Crypto
  if (
    clean.includes("BTC") ||
    clean.includes("ETH") ||
    clean.includes("SOL") ||
    clean.includes("XRP") ||
    clean.includes("CRYPTO")
  ) {
    return POSITION_INSTRUMENT_SPECS["crypto"];
  }

  // Indices
  if (
    clean.includes("SPX") ||
    clean.includes("NDX") ||
    clean.includes("NAS100") ||
    clean.includes("US30") ||
    clean.includes("DJI") ||
    clean.includes("FTSE") ||
    clean.includes("UK100") ||
    clean.includes("DAX") ||
    clean.includes("NIKKEI") ||
    clean.includes("ASX") ||
    clean.includes("GER40")
  ) {
    return POSITION_INSTRUMENT_SPECS["index-pts"];
  }

  // Forex Exotics
  if (
    clean.includes("TRY") ||
    clean.includes("ZAR") ||
    clean.includes("MXN") ||
    clean.includes("SEK") ||
    clean.includes("NOK")
  ) {
    return POSITION_INSTRUMENT_SPECS["forex-exotic"];
  }

  // Default Forex Major
  return POSITION_INSTRUMENT_SPECS["forex-major"];
}

export interface PositionCalculationInput {
  instrument: string;
  direction: "long" | "short" | "BUY" | "SELL";
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
  accountBalance: number;
  riskPct?: number; // e.g. 1 for 1%
  riskAmount?: number; // cash risk override
  accountLimits?: {
    dailyLossLimitPct?: number;
    maxDrawdownLimitPct?: number;
    todayLoss?: number;
  };
}

export interface PositionCalculationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];

  // Normalized inputs
  instrument: string;
  direction: "long" | "short";
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
  accountBalance: number;
  riskPct: number;
  riskAmount: number;

  // Geometry
  spec: InstrumentSpec;
  priceDistance: number;
  stopPips: number;
  rewardDistance: number;
  rewardPips: number;
  rewardRiskRatio: number;

  // Position sizing
  lots: number;
  units: number;
  notionalValue: number;
  pipValue: number;

  // Drawdown & risk metrics
  cashRisk: number;
  cashReward: number;
  drawdownImpactPct: number;
  dailyLossImpactPct: number;
  isWithinDailyLimit: boolean;
  isWithinMaxDrawdown: boolean;
}

/**
 * Authoritative position sizing calculation.
 * Pure function: deterministic, side-effect free, safe for both client and server.
 */
export function calculatePositionSize(input: PositionCalculationInput): PositionCalculationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rawDirection = (input.direction || "long").toLowerCase();
  const direction: "long" | "short" = rawDirection === "short" || rawDirection === "sell" ? "short" : "long";

  const entry = Number(input.entryPrice) || 0;
  const stop = Number(input.stopPrice) || 0;
  const target = Number(input.targetPrice) || 0;
  const balance = Number(input.accountBalance) || 0;

  // Validate basic numbers
  if (!input.instrument || input.instrument.trim().length === 0) {
    errors.push("Instrument symbol is required.");
  }
  if (entry <= 0 || !Number.isFinite(entry)) {
    errors.push("Entry price must be a positive number.");
  }
  if (stop <= 0 || !Number.isFinite(stop)) {
    errors.push("Stop loss price must be a positive number.");
  }
  if (target <= 0 || !Number.isFinite(target)) {
    errors.push("Target price must be a positive number.");
  }
  if (balance <= 0 || !Number.isFinite(balance)) {
    errors.push("Trading account balance must be greater than zero.");
  }

  // Validate risk percentage / amount
  let riskPct = Number(input.riskPct) || 0;
  let riskAmount = Number(input.riskAmount) || 0;

  if (riskAmount <= 0 && riskPct > 0 && balance > 0) {
    riskAmount = parseFloat(((balance * riskPct) / 100).toFixed(2));
  } else if (riskAmount > 0 && riskPct <= 0 && balance > 0) {
    riskPct = parseFloat(((riskAmount / balance) * 100).toFixed(2));
  } else if (riskPct <= 0 && riskAmount <= 0) {
    // Default fallback to 1% if neither specified
    riskPct = 1.0;
    riskAmount = parseFloat(((balance * 1.0) / 100).toFixed(2));
  }

  if (riskPct <= 0) {
    errors.push("Risk percentage must be greater than 0%.");
  } else if (riskPct > 100) {
    errors.push("Risk percentage cannot exceed 100% of account balance.");
  }

  // Directional logic validation
  if (entry > 0 && stop > 0) {
    if (direction === "long" && stop >= entry) {
      errors.push("For a Long trade, stop loss must be placed strictly below the entry price.");
    } else if (direction === "short" && stop <= entry) {
      errors.push("For a Short trade, stop loss must be placed strictly above the entry price.");
    }
  }

  if (entry > 0 && target > 0) {
    if (direction === "long" && target <= entry) {
      errors.push("For a Long trade, target must be placed strictly above the entry price.");
    } else if (direction === "short" && target >= entry) {
      errors.push("For a Short trade, target must be placed strictly below the entry price.");
    }
  }

  const spec = resolveInstrumentSpec(input.instrument);
  const priceDistance = Math.abs(entry - stop);
  const stopPips = parseFloat((priceDistance * spec.mult).toFixed(1));
  const rewardDistance = Math.abs(target - entry);
  const rewardPips = parseFloat((rewardDistance * spec.mult).toFixed(1));

  const rewardRiskRatio = priceDistance > 0 ? parseFloat((rewardDistance / priceDistance).toFixed(2)) : 0;

  // Position Sizing Formula
  // divisor = stopDistanceInPips * pipValuePerLot
  // lots = riskAmount / divisor
  const pipValue = spec.pip;
  const divisor = stopPips * pipValue;
  const rawLots = divisor > 0 && riskAmount > 0 ? riskAmount / divisor : 0;
  
  // Format lots: 2 decimals for standard precision
  const lots = parseFloat(rawLots.toFixed(2));
  const units = spec.isForex ? lots * 100000 : lots;
  const notionalValue = entry > 0 ? parseFloat((units * entry).toFixed(2)) : 0;

  const cashRisk = parseFloat(riskAmount.toFixed(2));
  const cashReward = parseFloat((cashRisk * rewardRiskRatio).toFixed(2));
  const drawdownImpactPct = balance > 0 ? parseFloat(((cashRisk / balance) * 100).toFixed(2)) : 0;

  // Account Limits check
  const todayLoss = Number(input.accountLimits?.todayLoss) || 0;
  const dailyLossLimitPct = Number(input.accountLimits?.dailyLossLimitPct) || 5.0; // standard 5% default
  const maxDrawdownLimitPct = Number(input.accountLimits?.maxDrawdownLimitPct) || 10.0; // standard 10% default

  const dailyLossImpactPct = balance > 0 ? parseFloat((((todayLoss + cashRisk) / balance) * 100).toFixed(2)) : 0;
  const isWithinDailyLimit = dailyLossImpactPct <= dailyLossLimitPct;
  const isWithinMaxDrawdown = drawdownImpactPct <= maxDrawdownLimitPct;

  if (!isWithinDailyLimit) {
    warnings.push(`Trade risk pushes total daily loss (${dailyLossImpactPct}%) beyond account daily loss limit (${dailyLossLimitPct}%).`);
  }
  if (!isWithinMaxDrawdown) {
    warnings.push(`Trade risk (${drawdownImpactPct}%) breaches maximum drawdown limit (${maxDrawdownLimitPct}%).`);
  }
  if (rewardRiskRatio > 0 && rewardRiskRatio < 1.0) {
    warnings.push(`Reward-to-Risk ratio (${rewardRiskRatio}R) is below 1.0R. The potential loss exceeds potential profit.`);
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    instrument: input.instrument,
    direction,
    entryPrice: entry,
    stopPrice: stop,
    targetPrice: target,
    accountBalance: balance,
    riskPct,
    riskAmount,
    spec,
    priceDistance,
    stopPips,
    rewardDistance,
    rewardPips,
    rewardRiskRatio,
    lots,
    units,
    notionalValue,
    pipValue,
    cashRisk,
    cashReward,
    drawdownImpactPct,
    dailyLossImpactPct,
    isWithinDailyLimit,
    isWithinMaxDrawdown,
  };
}
