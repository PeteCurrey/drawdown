import { INSTRUMENTS, getExchangeRateToAccount } from "./instruments.ts";
import type { InstrumentSpec } from "./instruments.ts";

export interface PositionCalculationInput {
  symbol: string;
  accountCurrency: string;
  accountBalance: number;
  riskType: "percent" | "cash";
  riskValue: number; // e.g. 1.0 for 1%, or 250 for £250
  entryPrice: number;
  stopPrice: number;
  targetPrice?: number;
}

export interface PositionCalculationResult {
  instrument: InstrumentSpec;
  cashRisk: number;
  riskPercent: number;
  stopDistance: number;
  stopDistanceUnits: number; // in pips or points
  pipValueAccountCurrency: number; // per 1.0 standard lot
  standardLots: number;
  miniLots: number;
  microLots: number;
  units: number;
  notionalValue: number;
  rrRatio: number | null;
  potentialProfit: number | null;
  drawdownImpactPercent: number;
  formulaSteps: {
    label: string;
    formula: string;
    calculation: string;
    result: string;
  }[];
}

export function calculatePositionSize(input: PositionCalculationInput): PositionCalculationResult {
  const instrument = INSTRUMENTS[input.symbol] || INSTRUMENTS.EURUSD;
  const balance = Math.max(1, input.accountBalance);
  
  // 1. Calculate Cash Risk
  let cashRisk = 0;
  let riskPercent = 0;
  if (input.riskType === "percent") {
    riskPercent = Math.max(0.01, input.riskValue);
    cashRisk = (balance * riskPercent) / 100;
  } else {
    cashRisk = Math.max(0.01, input.riskValue);
    riskPercent = (cashRisk / balance) * 100;
  }

  // 2. Stop distance
  const stopDistance = Math.abs(input.entryPrice - input.stopPrice);
  const stopDistanceUnits = stopDistance * instrument.pipFactor;

  // 3. Pip value in quote currency for 1.0 standard contract
  let pipValueQuote = 0;
  if (instrument.category === "forex") {
    // 1 standard lot = 100,000 units
    // 1 pip = tickSize * pipFactor (10,000 or 100)
    // Pip value quote = 100,000 * 0.0001 = $10 (for 4 decimals) or 100,000 * 0.01 = 1,000 JPY
    pipValueQuote = instrument.standardContractUnits * instrument.tickSize;
  } else if (instrument.symbol === "XAUUSD") {
    // 100 oz * $1 = $100 per 1 point move per 1 lot, or $1 per 0.01 tick
    // In trading terminology, 1 point = $100 for 100oz
    pipValueQuote = 100; 
  } else if (instrument.symbol === "XAGUSD") {
    pipValueQuote = 5000;
  } else if (instrument.symbol === "USOIL") {
    pipValueQuote = 1000;
  } else if (instrument.category === "indices") {
    // 1 point per 1 contract CFD = $1 / £1 / €1
    pipValueQuote = 1;
  } else if (instrument.category === "crypto") {
    // 1 point ($1) per 1 coin = $1
    pipValueQuote = 1;
  }

  // 4. Convert pip value to Account Currency
  const conversionRate = getExchangeRateToAccount(instrument.quoteCurrency, input.accountCurrency);
  const pipValueAccountCurrency = pipValueQuote * conversionRate;

  // 5. Calculate Standard Lots
  // Lots = CashRisk / (StopDistanceUnits * PipValueInAccountCurrency)
  let standardLots = 0;
  if (stopDistanceUnits > 0 && pipValueAccountCurrency > 0) {
    standardLots = cashRisk / (stopDistanceUnits * pipValueAccountCurrency);
  }

  // Mini / Micro lots
  const miniLots = standardLots * 10;
  const microLots = standardLots * 100;
  const units = standardLots * instrument.standardContractUnits;
  const notionalValue = units * input.entryPrice;

  // R:R and target
  let rrRatio: number | null = null;
  let potentialProfit: number | null = null;
  if (input.targetPrice && input.targetPrice > 0) {
    const targetDistance = Math.abs(input.targetPrice - input.entryPrice);
    if (stopDistance > 0) {
      rrRatio = targetDistance / stopDistance;
      potentialProfit = cashRisk * rrRatio;
    }
  }

  const drawdownImpactPercent = (cashRisk / balance) * 100;

  // Mathematical Transparency / "Show the Working"
  const formulaSteps = [
    {
      label: "Step 1: Cash Risk Calculation",
      formula: input.riskType === "percent" ? "Balance × (Risk % / 100)" : "Defined Cash Risk",
      calculation: input.riskType === "percent"
        ? `${balance.toLocaleString()} × (${riskPercent.toFixed(2)}% / 100)`
        : `${cashRisk.toLocaleString()} ${input.accountCurrency}`,
      result: `${cashRisk.toFixed(2)} ${input.accountCurrency}`,
    },
    {
      label: "Step 2: Invalidation / Stop Distance",
      formula: `|Entry Price - Stop Loss| × Pip/Point Factor`,
      calculation: `|${input.entryPrice} - ${input.stopPrice}| × ${instrument.pipFactor}`,
      result: `${stopDistanceUnits.toFixed(1)} ${instrument.unitName}`,
    },
    {
      label: "Step 3: Pip / Point Value per 1.0 Standard Lot",
      formula: `Contract Units × Tick Size × FX Conversion Rate`,
      calculation: `${instrument.standardContractUnits.toLocaleString()} × ${instrument.tickSize} × ${conversionRate.toFixed(4)} (${instrument.quoteCurrency} → ${input.accountCurrency})`,
      result: `${pipValueAccountCurrency.toFixed(2)} ${input.accountCurrency} / ${instrument.unitName === "pips" ? "pip" : "point"}`,
    },
    {
      label: "Step 4: Position Sizing (Lot Size)",
      formula: `Cash Risk ÷ (Stop Distance × Pip Value per Lot)`,
      calculation: `${cashRisk.toFixed(2)} ÷ (${stopDistanceUnits.toFixed(1)} × ${pipValueAccountCurrency.toFixed(2)})`,
      result: `${standardLots.toFixed(2)} Standard Lots`,
    },
  ];

  return {
    instrument,
    cashRisk,
    riskPercent,
    stopDistance,
    stopDistanceUnits,
    pipValueAccountCurrency,
    standardLots,
    miniLots,
    microLots,
    units,
    notionalValue,
    rrRatio,
    potentialProfit,
    drawdownImpactPercent,
    formulaSteps,
  };
}
