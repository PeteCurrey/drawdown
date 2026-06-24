/**
 * lib/instruments.ts
 *
 * Single source of truth for all tradeable instruments on the Drawdown dashboard.
 * Replaces the hardcoded INSTRUMENTS_LIST in dashboard/page.tsx.
 *
 * AUDIT NOTE: The previous INSTRUMENTS_LIST in page.tsx contained hardcoded
 * price, RSI, trend, and defaultPct values that never updated from live data.
 * All those fields are removed here — live data comes exclusively from
 * useTwelveData and useTechnicalData hooks.
 *
 * defaultPct is kept as a neutral loading placeholder (50) only — it is
 * overwritten by the live biasScore from useTechnicalData as soon as data loads.
 */

export interface Instrument {
  /** Canonical slug used as React key and for hook lookups — e.g. "XAU/USD" */
  slug: string;
  /** Short display label in the dropdown */
  name: string;
  /** TradingView widget symbol format */
  tvSymbol: string;
  /** useTwelveData / useTechnicalData hook key — no slash, e.g. "XAUUSD" */
  hookSlug: string;
  /** Loading placeholder bias score — immediately overwritten by live biasScore */
  defaultPct: 50;
  category: "Forex" | "Indices" | "Commodities" | "Crypto";
}

export interface InstrumentGroup {
  label: string;
  items: Instrument[];
}

// ─── Full instrument catalogue ────────────────────────────────────────────────

export const INSTRUMENT_GROUPS: InstrumentGroup[] = [
  {
    label: "Forex & Metals",
    items: [
      { slug: "XAU/USD", name: "XAU/USD",  tvSymbol: "TVC:GOLD",          hookSlug: "XAUUSD",   defaultPct: 50, category: "Forex" },
      { slug: "XAG/USD", name: "XAG/USD",  tvSymbol: "TVC:SILVER",        hookSlug: "XAGUSD",   defaultPct: 50, category: "Forex" },
      { slug: "GBP/USD", name: "GBP/USD",  tvSymbol: "FX:GBPUSD",         hookSlug: "GBPUSD",   defaultPct: 50, category: "Forex" },
      { slug: "EUR/USD", name: "EUR/USD",  tvSymbol: "FX:EURUSD",         hookSlug: "EURUSD",   defaultPct: 50, category: "Forex" },
      { slug: "USD/JPY", name: "USD/JPY",  tvSymbol: "FX:USDJPY",         hookSlug: "USDJPY",   defaultPct: 50, category: "Forex" },
      { slug: "USD/CHF", name: "USD/CHF",  tvSymbol: "FX:USDCHF",         hookSlug: "USDCHF",   defaultPct: 50, category: "Forex" },
      { slug: "AUD/USD", name: "AUD/USD",  tvSymbol: "FX:AUDUSD",         hookSlug: "AUDUSD",   defaultPct: 50, category: "Forex" },
      { slug: "NZD/USD", name: "NZD/USD",  tvSymbol: "FX:NZDUSD",         hookSlug: "NZDUSD",   defaultPct: 50, category: "Forex" },
      { slug: "USD/CAD", name: "USD/CAD",  tvSymbol: "FX:USDCAD",         hookSlug: "USDCAD",   defaultPct: 50, category: "Forex" },
      { slug: "EUR/GBP", name: "EUR/GBP",  tvSymbol: "FX:EURGBP",         hookSlug: "EURGBP",   defaultPct: 50, category: "Forex" },
      { slug: "EUR/JPY", name: "EUR/JPY",  tvSymbol: "FX:EURJPY",         hookSlug: "EURJPY",   defaultPct: 50, category: "Forex" },
      { slug: "GBP/JPY", name: "GBP/JPY",  tvSymbol: "FX:GBPJPY",         hookSlug: "GBPJPY",   defaultPct: 50, category: "Forex" },
      { slug: "CAD/JPY", name: "CAD/JPY",  tvSymbol: "FX:CADJPY",         hookSlug: "CADJPY",   defaultPct: 50, category: "Forex" },
      { slug: "AUD/CAD", name: "AUD/CAD",  tvSymbol: "FX:AUDCAD",         hookSlug: "AUDCAD",   defaultPct: 50, category: "Forex" },
      { slug: "GBP/CAD", name: "GBP/CAD",  tvSymbol: "FX:GBPCAD",         hookSlug: "GBPCAD",   defaultPct: 50, category: "Forex" },
    ],
  },
  {
    label: "Indices",
    items: [
      { slug: "SPX",    name: "S&P 500",   tvSymbol: "FOREXCOM:SPXUSD",   hookSlug: "SPX",      defaultPct: 50, category: "Indices" },
      { slug: "NDX",    name: "NASDAQ 100",tvSymbol: "FOREXCOM:NSXUSD",   hookSlug: "NDX",      defaultPct: 50, category: "Indices" },
      { slug: "DJI",    name: "Dow Jones", tvSymbol: "FOREXCOM:DJI",      hookSlug: "DJI",      defaultPct: 50, category: "Indices" },
      { slug: "FTSE",   name: "FTSE 100",  tvSymbol: "FOREXCOM:UKXUSD",   hookSlug: "FTSE",     defaultPct: 50, category: "Indices" },
      { slug: "DAX",    name: "DAX 40",    tvSymbol: "FOREXCOM:DEUIDXEUR",hookSlug: "DAX",      defaultPct: 50, category: "Indices" },
      { slug: "NKY",    name: "Nikkei 225",tvSymbol: "FOREXCOM:JPN225",   hookSlug: "NIKKEI",   defaultPct: 50, category: "Indices" },
      { slug: "ASX200", name: "ASX 200",   tvSymbol: "FOREXCOM:AUS200",   hookSlug: "ASX200",   defaultPct: 50, category: "Indices" },
    ],
  },
  {
    label: "Commodities",
    items: [
      { slug: "WTI/USD", name: "Crude Oil", tvSymbol: "NYMEX:CL1!",       hookSlug: "WTIUSD",   defaultPct: 50, category: "Commodities" },
      { slug: "NATGAS",  name: "Nat Gas",   tvSymbol: "NYMEX:NG1!",        hookSlug: "NATGAS",   defaultPct: 50, category: "Commodities" },
      { slug: "COPPER",  name: "Copper",    tvSymbol: "COMEX:HG1!",        hookSlug: "COPPER",   defaultPct: 50, category: "Commodities" },
    ],
  },
  {
    label: "Crypto",
    items: [
      { slug: "BTC/USD", name: "BTC/USD",  tvSymbol: "BINANCE:BTCUSDT",   hookSlug: "BTCUSD",   defaultPct: 50, category: "Crypto" },
      { slug: "ETH/USD", name: "ETH/USD",  tvSymbol: "BINANCE:ETHUSDT",   hookSlug: "ETHUSD",   defaultPct: 50, category: "Crypto" },
      { slug: "SOL/USD", name: "SOL/USD",  tvSymbol: "BINANCE:SOLUSDT",   hookSlug: "SOLUSD",   defaultPct: 50, category: "Crypto" },
    ],
  },
];

/** Flat list — use for page state initialisation and selector iteration */
export const INSTRUMENTS_LIST: Instrument[] = INSTRUMENT_GROUPS.flatMap(g => g.items);

// ─── Lookup helpers ───────────────────────────────────────────────────────────

const SLUG_TO_INSTRUMENT = new Map<string, Instrument>(
  INSTRUMENTS_LIST.map(i => [i.slug, i])
);

const HOOK_TO_INSTRUMENT = new Map<string, Instrument>(
  INSTRUMENTS_LIST.map(i => [i.hookSlug, i])
);

export function instrumentBySlug(slug: string): Instrument | undefined {
  return SLUG_TO_INSTRUMENT.get(slug);
}

export function instrumentByHookSlug(hookSlug: string): Instrument | undefined {
  return HOOK_TO_INSTRUMENT.get(hookSlug);
}

// ─── Twelve Data symbol mapping ───────────────────────────────────────────────

/** Map from hookSlug → Twelve Data API symbol string */
const TD_SYMBOL_MAP: Record<string, string> = {
  XAUUSD:  "XAU/USD",
  XAGUSD:  "XAG/USD",
  GBPUSD:  "GBP/USD",
  EURUSD:  "EUR/USD",
  USDJPY:  "USD/JPY",
  USDCHF:  "USD/CHF",
  AUDUSD:  "AUD/USD",
  NZDUSD:  "NZD/USD",
  USDCAD:  "USD/CAD",
  EURGBP:  "EUR/GBP",
  EURJPY:  "EUR/JPY",
  GBPJPY:  "GBP/JPY",
  CADJPY:  "CAD/JPY",
  AUDCAD:  "AUD/CAD",
  GBPCAD:  "GBP/CAD",
  SPX:     "SPX500",
  NDX:     "NDX",
  DJI:     "DJI",
  FTSE:    "UKX",
  DAX:     "DAX",
  NIKKEI:  "NIKKEI225",
  ASX200:  "ASX200",
  WTIUSD:  "WTI/USD",
  NATGAS:  "NATGAS",
  COPPER:  "COPPER",
  BTCUSD:  "BTC/USD",
  ETHUSD:  "ETH/USD",
  SOLUSD:  "SOL/USD",
  // Legacy keys used elsewhere in the codebase
  BTCUSDT: "BTC/USD",
  ETHUSDT: "ETH/USD",
  XRPUSDT: "XRP/USD",
  GBPJPY2: "GBP/JPY",
};

export function tdSymbol(hookSlug: string): string {
  return TD_SYMBOL_MAP[hookSlug] ?? hookSlug;
}

// ─── Price decimal places ─────────────────────────────────────────────────────

const DECIMAL_MAP: Record<string, number> = {
  USDJPY: 3, EURJPY: 3, GBPJPY: 3, CADJPY: 3,
  XAUUSD: 2, XAGUSD: 3, WTIUSD: 2, COPPER: 4,
  BTCUSD: 2, ETHUSD: 2, SOLUSD: 3,
  SPX: 2, NDX: 2, DJI: 2, FTSE: 2, DAX: 2, NIKKEI: 2, ASX200: 2,
  NATGAS: 3,
};

export function instrumentDecimals(hookSlug: string): number {
  return DECIMAL_MAP[hookSlug] ?? 5;
}

// ─── Timeframe definitions ────────────────────────────────────────────────────

export interface Timeframe {
  label: string;   // UI label: "4H"
  interval: string; // Twelve Data interval: "4h"
}

export const TIMEFRAMES: Timeframe[] = [
  { label: "5m",  interval: "5min"  },
  { label: "15m", interval: "15min" },
  { label: "30m", interval: "30min" },
  { label: "1H",  interval: "1h"    },
  { label: "4H",  interval: "4h"    },
  { label: "1D",  interval: "1day"  },
  { label: "1W",  interval: "1week" },
];

export function intervalLabel(interval: string): string {
  return TIMEFRAMES.find(t => t.interval === interval)?.label ?? interval;
}

// ─── Finnhub calendar currency filter ────────────────────────────────────────

/** Returns the currency codes whose economic events are relevant to this instrument */
export function currencyFilter(hookSlug: string): string[] {
  const map: Record<string, string[]> = {
    XAUUSD: ["USD"],
    XAGUSD: ["USD"],
    GBPUSD: ["GBP", "USD"],
    EURUSD: ["EUR", "USD"],
    USDJPY: ["USD", "JPY"],
    USDCHF: ["USD", "CHF"],
    AUDUSD: ["AUD", "USD"],
    NZDUSD: ["NZD", "USD"],
    USDCAD: ["USD", "CAD"],
    EURGBP: ["EUR", "GBP"],
    EURJPY: ["EUR", "JPY"],
    GBPJPY: ["GBP", "JPY"],
    CADJPY: ["CAD", "JPY"],
    AUDCAD: ["AUD", "CAD"],
    GBPCAD: ["GBP", "CAD"],
    SPX:    ["USD"],
    NDX:    ["USD"],
    DJI:    ["USD"],
    FTSE:   ["GBP"],
    DAX:    ["EUR"],
    NIKKEI: ["JPY"],
    ASX200: ["AUD"],
    WTIUSD: ["USD"],
    NATGAS: ["USD"],
    COPPER: ["USD"],
    BTCUSD: ["USD"],
    ETHUSD: ["USD"],
    SOLUSD: ["USD"],
  };
  return map[hookSlug] ?? ["USD"];
}

export type InstrumentKey = 
  | 'GBPUSD' | 'EURUSD' | 'USDJPY' | 'EURGBP'
  | 'XAUUSD' | 'BTCUSD' | 'ETHUSD'
  | 'US30' | 'UK100' | 'SPX500' | 'NAS100';

export type InstrumentCategory = 'forex' | 'crypto' | 'index' | 'commodity';

export interface InstrumentConfig {
  key: InstrumentKey;
  label: string;            // display: "GBP / USD"
  twelveDataSymbol: string; // symbol for Twelve Data API
  finnhubSymbol: string;    // symbol for FinnHub API  
  category: InstrumentCategory;
  baseCurrency: string;     // for news + calendar filtering e.g. "GBP"
  quoteCurrency: string;    // e.g. "USD"
  pipDecimalPlaces: number; // 4 for most forex, 2 for JPY, gold, indices
  newsKeywords: string[];   // search terms for relevant FinnHub news
}

export const INSTRUMENTS: Record<InstrumentKey, InstrumentConfig> = {
  GBPUSD: {
    key: 'GBPUSD', label: 'GBP / USD',
    twelveDataSymbol: 'GBP/USD', finnhubSymbol: 'OANDA:GBP_USD',
    category: 'forex', baseCurrency: 'GBP', quoteCurrency: 'USD',
    pipDecimalPlaces: 4, newsKeywords: ['GBP', 'sterling', 'pound', 'BOE', 'Bank of England']
  },
  EURUSD: {
    key: 'EURUSD', label: 'EUR / USD',
    twelveDataSymbol: 'EUR/USD', finnhubSymbol: 'OANDA:EUR_USD',
    category: 'forex', baseCurrency: 'EUR', quoteCurrency: 'USD',
    pipDecimalPlaces: 4, newsKeywords: ['EUR', 'euro', 'ECB', 'eurozone']
  },
  USDJPY: {
    key: 'USDJPY', label: 'USD / JPY',
    twelveDataSymbol: 'USD/JPY', finnhubSymbol: 'OANDA:USD_JPY',
    category: 'forex', baseCurrency: 'USD', quoteCurrency: 'JPY',
    pipDecimalPlaces: 2, newsKeywords: ['JPY', 'yen', 'BOJ', 'Bank of Japan']
  },
  EURGBP: {
    key: 'EURGBP', label: 'EUR / GBP',
    twelveDataSymbol: 'EUR/GBP', finnhubSymbol: 'OANDA:EUR_GBP',
    category: 'forex', baseCurrency: 'EUR', quoteCurrency: 'GBP',
    pipDecimalPlaces: 4, newsKeywords: ['EUR', 'GBP', 'ECB', 'BOE']
  },
  XAUUSD: {
    key: 'XAUUSD', label: 'XAU / USD',
    twelveDataSymbol: 'XAU/USD', finnhubSymbol: 'OANDA:XAU_USD',
    category: 'commodity', baseCurrency: 'XAU', quoteCurrency: 'USD',
    pipDecimalPlaces: 2, newsKeywords: ['gold', 'XAU', 'bullion', 'precious metals']
  },
  BTCUSD: {
    key: 'BTCUSD', label: 'BTC / USD',
    twelveDataSymbol: 'BTC/USD', finnhubSymbol: 'BINANCE:BTCUSDT',
    category: 'crypto', baseCurrency: 'BTC', quoteCurrency: 'USD',
    pipDecimalPlaces: 2, newsKeywords: ['bitcoin', 'BTC', 'crypto']
  },
  ETHUSD: {
    key: 'ETHUSD', label: 'ETH / USD',
    twelveDataSymbol: 'ETH/USD', finnhubSymbol: 'BINANCE:ETHUSDT',
    category: 'crypto', baseCurrency: 'ETH', quoteCurrency: 'USD',
    pipDecimalPlaces: 2, newsKeywords: ['ethereum', 'ETH', 'crypto']
  },
  US30: {
    key: 'US30', label: 'US30',
    twelveDataSymbol: 'DJI', finnhubSymbol: 'INDEX:DJI',
    category: 'index', baseCurrency: 'USD', quoteCurrency: 'USD',
    pipDecimalPlaces: 0, newsKeywords: ['Dow Jones', 'DJI', 'US stocks', 'Fed']
  },
  UK100: {
    key: 'UK100', label: 'UK100',
    twelveDataSymbol: 'FTSE', finnhubSymbol: 'INDEX:UKX',
    category: 'index', baseCurrency: 'GBP', quoteCurrency: 'GBP',
    pipDecimalPlaces: 0, newsKeywords: ['FTSE', 'UK100', 'UK stocks', 'BOE']
  },
  SPX500: {
    key: 'SPX500', label: 'SPX 500',
    twelveDataSymbol: 'SPX', finnhubSymbol: 'INDEX:SPX',
    category: 'index', baseCurrency: 'USD', quoteCurrency: 'USD',
    pipDecimalPlaces: 0, newsKeywords: ['S&P 500', 'SPX', 'US equities', 'Fed']
  },
  NAS100: {
    key: 'NAS100', label: 'NAS100',
    twelveDataSymbol: 'NDX', finnhubSymbol: 'INDEX:NDX',
    category: 'index', baseCurrency: 'USD', quoteCurrency: 'USD',
    pipDecimalPlaces: 0, newsKeywords: ['Nasdaq', 'NDX', 'tech stocks', 'Fed']
  },
};

export const TIMEFRAME_MAP: Record<string, string> = {
  '5m': '5min', '15m': '15min', '30m': '30min',
  '1H': '1h', '4H': '4h', '1D': '1day', '1W': '1week',
};
