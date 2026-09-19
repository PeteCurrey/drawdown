import { INSTRUMENTS, getExchangeRateToAccount, InstrumentSpec } from "./instruments";

export interface PipCalculationInput {
  symbol: string;
  accountCurrency: string;
  lots: number;
}

export interface PipCalculationResult {
  instrument: InstrumentSpec;
  lots: number;
  pipValueSingle: number; // 1 pip value in account currency for specified lots
  pipValue10: number;
  pipValue50: number;
  pipValue100: number;
  table: {
    lotType: string;
    lotSize: number;
    units: number;
    valuePerPip: number;
    valuePer10Pips: number;
    valuePer50Pips: number;
  }[];
  formulaSteps: {
    label: string;
    formula: string;
    calculation: string;
    result: string;
  }[];
}

export function calculatePipValue(input: PipCalculationInput): PipCalculationResult {
  const instrument = INSTRUMENTS[input.symbol] || INSTRUMENTS.EURUSD;
  const lots = Math.max(0.01, input.lots);

  // 1 standard lot units
  const standardUnits = instrument.standardContractUnits;
  
  // Base pip value in quote currency for 1 standard lot
  let basePipValueQuote = 0;
  if (instrument.category === "forex") {
    basePipValueQuote = standardUnits * instrument.tickSize; // e.g. 100k * 0.0001 = 10 USD
  } else if (instrument.symbol === "XAUUSD") {
    basePipValueQuote = 100; // 100 oz * $1 = $100 per 1 point
  } else if (instrument.symbol === "XAGUSD") {
    basePipValueQuote = 5000;
  } else if (instrument.symbol === "USOIL") {
    basePipValueQuote = 1000;
  } else {
    basePipValueQuote = 1; // 1 index/crypto unit = 1 USD
  }

  // Conversion rate to account currency
  const fxRate = getExchangeRateToAccount(instrument.quoteCurrency, input.accountCurrency);
  const pipValuePerStandardLot = basePipValueQuote * fxRate;

  // For input lot size:
  const pipValueSingle = pipValuePerStandardLot * lots;
  const pipValue10 = pipValueSingle * 10;
  const pipValue50 = pipValueSingle * 50;
  const pipValue100 = pipValueSingle * 100;

  // Comparison Table (Standard 1.0, Mini 0.1, Micro 0.01, Custom)
  const lotTiers = [
    { lotType: "Standard Lot", lotSize: 1.0, units: standardUnits },
    { lotType: "Mini Lot", lotSize: 0.1, units: standardUnits * 0.1 },
    { lotType: "Micro Lot", lotSize: 0.01, units: standardUnits * 0.01 },
    { lotType: `Custom (${lots.toFixed(2)} Lots)`, lotSize: lots, units: standardUnits * lots },
  ];

  const table = lotTiers.map((tier) => {
    const val = pipValuePerStandardLot * tier.lotSize;
    return {
      lotType: tier.lotType,
      lotSize: tier.lotSize,
      units: tier.units,
      valuePerPip: val,
      valuePer10Pips: val * 10,
      valuePer50Pips: val * 50,
    };
  });

  const formulaSteps = [
    {
      label: "Step 1: Raw Pip Value in Quote Currency",
      formula: `Contract Units × Tick Increment`,
      calculation: `${standardUnits.toLocaleString()} × ${instrument.tickSize}`,
      result: `${basePipValueQuote.toFixed(2)} ${instrument.quoteCurrency} per standard lot`,
    },
    {
      label: "Step 2: Currency Conversion to Account Ground",
      formula: `Raw Pip Value × (${instrument.quoteCurrency} → ${input.accountCurrency} Rate)`,
      calculation: `${basePipValueQuote.toFixed(2)} × ${fxRate.toFixed(4)}`,
      result: `${pipValuePerStandardLot.toFixed(2)} ${input.accountCurrency} per 1.0 Standard Lot`,
    },
    {
      label: "Step 3: Scaled for Specified Volume",
      formula: `Pip Value per Standard Lot × Volume Lots`,
      calculation: `${pipValuePerStandardLot.toFixed(2)} × ${lots.toFixed(2)}`,
      result: `${pipValueSingle.toFixed(2)} ${input.accountCurrency} / ${instrument.unitName === "pips" ? "pip" : "point"}`,
    },
  ];

  return {
    instrument,
    lots,
    pipValueSingle,
    pipValue10,
    pipValue50,
    pipValue100,
    table,
    formulaSteps,
  };
}
