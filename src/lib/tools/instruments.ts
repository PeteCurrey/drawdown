export type AssetClass = "forex" | "indices" | "commodities" | "crypto";

export interface InstrumentSpec {
  symbol: string;
  name: string;
  category: AssetClass;
  pipFactor: number;       // e.g. 10000 for EUR/USD, 100 for USD/JPY, 1 for indices/crypto/gold
  decimals: number;        // display decimals for entry/stop
  tickSize: number;        // minimum tick
  standardContractUnits: number; // 100k for FX, 100 oz for Gold, 1 contract for Indices
  unitName: string;        // "pips" | "points"
  quoteCurrency: string;   // e.g. "USD", "JPY", "GBP"
  defaultEntry: number;
  defaultStopDistance: number;
}

export const INSTRUMENTS: Record<string, InstrumentSpec> = {
  EURUSD: {
    symbol: "EURUSD",
    name: "EUR/USD (Euro / US Dollar)",
    category: "forex",
    pipFactor: 10000,
    decimals: 4,
    tickSize: 0.0001,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "USD",
    defaultEntry: 1.0850,
    defaultStopDistance: 25,
  },
  GBPUSD: {
    symbol: "GBPUSD",
    name: "GBP/USD (British Pound / US Dollar)",
    category: "forex",
    pipFactor: 10000,
    decimals: 4,
    tickSize: 0.0001,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "USD",
    defaultEntry: 1.2850,
    defaultStopDistance: 30,
  },
  USDJPY: {
    symbol: "USDJPY",
    name: "USD/JPY (US Dollar / Japanese Yen)",
    category: "forex",
    pipFactor: 100,
    decimals: 2,
    tickSize: 0.01,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "JPY",
    defaultEntry: 154.50,
    defaultStopDistance: 45,
  },
  EURGBP: {
    symbol: "EURGBP",
    name: "EUR/GBP (Euro / British Pound)",
    category: "forex",
    pipFactor: 10000,
    decimals: 4,
    tickSize: 0.0001,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "GBP",
    defaultEntry: 0.8520,
    defaultStopDistance: 20,
  },
  AUDUSD: {
    symbol: "AUDUSD",
    name: "AUD/USD (Australian Dollar / US Dollar)",
    category: "forex",
    pipFactor: 10000,
    decimals: 4,
    tickSize: 0.0001,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "USD",
    defaultEntry: 0.6550,
    defaultStopDistance: 25,
  },
  USDCAD: {
    symbol: "USDCAD",
    name: "USD/CAD (US Dollar / Canadian Dollar)",
    category: "forex",
    pipFactor: 10000,
    decimals: 4,
    tickSize: 0.0001,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "CAD",
    defaultEntry: 1.3750,
    defaultStopDistance: 30,
  },
  GBPJPY: {
    symbol: "GBPJPY",
    name: "GBP/JPY (British Pound / Japanese Yen)",
    category: "forex",
    pipFactor: 100,
    decimals: 2,
    tickSize: 0.01,
    standardContractUnits: 100000,
    unitName: "pips",
    quoteCurrency: "JPY",
    defaultEntry: 198.50,
    defaultStopDistance: 60,
  },
  XAUUSD: {
    symbol: "XAUUSD",
    name: "Gold (XAU/USD)",
    category: "commodities",
    pipFactor: 1, // 1 point = $1 per oz
    decimals: 2,
    tickSize: 0.01,
    standardContractUnits: 100, // 100 oz per standard lot
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 2920.00,
    defaultStopDistance: 15.0,
  },
  XAGUSD: {
    symbol: "XAGUSD",
    name: "Silver (XAG/USD)",
    category: "commodities",
    pipFactor: 1,
    decimals: 2,
    tickSize: 0.01,
    standardContractUnits: 5000, // 5000 oz per lot
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 32.50,
    defaultStopDistance: 0.60,
  },
  USOIL: {
    symbol: "USOIL",
    name: "WTI Crude Oil (USOIL)",
    category: "commodities",
    pipFactor: 1,
    decimals: 2,
    tickSize: 0.01,
    standardContractUnits: 1000, // 1,000 barrels
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 72.50,
    defaultStopDistance: 1.20,
  },
  US500: {
    symbol: "US500",
    name: "S&P 500 Index (US500 / SPX)",
    category: "indices",
    pipFactor: 1,
    decimals: 1,
    tickSize: 0.1,
    standardContractUnits: 1, // 1 index point = $1 or $10 depending on contract (standard CFD = 1 pt = $1)
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 5850.0,
    defaultStopDistance: 35.0,
  },
  NAS100: {
    symbol: "NAS100",
    name: "Nasdaq 100 (NAS100 / US TECH 100)",
    category: "indices",
    pipFactor: 1,
    decimals: 1,
    tickSize: 0.1,
    standardContractUnits: 1,
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 20400.0,
    defaultStopDistance: 120.0,
  },
  UK100: {
    symbol: "UK100",
    name: "FTSE 100 (UK100)",
    category: "indices",
    pipFactor: 1,
    decimals: 1,
    tickSize: 0.5,
    standardContractUnits: 1,
    unitName: "points",
    quoteCurrency: "GBP",
    defaultEntry: 8250.0,
    defaultStopDistance: 40.0,
  },
  GER40: {
    symbol: "GER40",
    name: "DAX 40 (GER40)",
    category: "indices",
    pipFactor: 1,
    decimals: 1,
    tickSize: 0.5,
    standardContractUnits: 1,
    unitName: "points",
    quoteCurrency: "EUR",
    defaultEntry: 19400.0,
    defaultStopDistance: 80.0,
  },
  BTCUSD: {
    symbol: "BTCUSD",
    name: "Bitcoin (BTC/USD)",
    category: "crypto",
    pipFactor: 1,
    decimals: 0,
    tickSize: 1.0,
    standardContractUnits: 1, // 1 coin per 1.0 lot
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 68500,
    defaultStopDistance: 1200,
  },
  ETHUSD: {
    symbol: "ETHUSD",
    name: "Ethereum (ETH/USD)",
    category: "crypto",
    pipFactor: 1,
    decimals: 2,
    tickSize: 0.1,
    standardContractUnits: 1,
    unitName: "points",
    quoteCurrency: "USD",
    defaultEntry: 2650.0,
    defaultStopDistance: 80.0,
  },
};

// Approximate cross conversion rates to account currency
// Base quote currency to account currency multiplier
export const REFERENCE_RATES: Record<string, Record<string, number>> = {
  GBP: { USD: 1.285, EUR: 1.173, JPY: 198.5, AUD: 1.96, CAD: 1.76, GBP: 1.0 },
  USD: { GBP: 0.778, EUR: 0.921, JPY: 154.5, AUD: 1.52, CAD: 1.37, USD: 1.0 },
  EUR: { GBP: 0.852, USD: 1.085, JPY: 167.6, AUD: 1.67, CAD: 1.49, EUR: 1.0 },
  AUD: { GBP: 0.510, USD: 0.655, EUR: 0.598, JPY: 101.2, CAD: 0.90, AUD: 1.0 },
  CAD: { GBP: 0.568, USD: 0.728, EUR: 0.671, JPY: 112.4, AUD: 1.11, CAD: 1.0 },
};

export function getExchangeRateToAccount(quoteCurrency: string, accountCurrency: string): number {
  if (quoteCurrency === accountCurrency) return 1.0;
  
  // Direct conversion rate: 1 QuoteCurrency in AccountCurrency
  // e.g. Quote is USD, Account is GBP -> GBP/USD is 1.285, so 1 USD = 1/1.285 = 0.778 GBP
  const matrix = REFERENCE_RATES[accountCurrency];
  if (matrix && matrix[quoteCurrency]) {
    return 1 / matrix[quoteCurrency];
  }
  return 1.0;
}
