/**
 * Canonical instrument registry for SC2 (public screener) and SC3 (dashboard scanner).
 * Single source of truth — imported by /api/market/screener and ScannerClient.tsx.
 */

export type MarketCategory = "forex" | "commodities" | "indices" | "crypto" | "stocks-uk" | "stocks-us";

export interface ScreenerInstrument {
  /** Slug used as URL param, API key, and state key throughout the app */
  scannerSlug: string;
  /** Human-readable label e.g. "EUR/USD" */
  displayPair: string;
  /** Category for tab filtering */
  category: MarketCategory;
  /** TradingView symbol string for MiniChart / widget embeds */
  tvSymbol: string;
  /** Symbol as accepted by Twelve Data time_series / quote endpoints */
  tdSymbol: string;
  /**
   * Yahoo Finance fallback symbol.
   * NULL means Yahoo Finance has no reliable OTC spot ticker for this instrument.
   * The screener MUST NOT fall back to Yahoo — it must fail closed (feed_offline: true).
   *
   * IMPORTANT: Do NOT assign a futures contract (e.g. GC=F, SI=F) as a fallback
   * for a spot instrument. COMEX futures carry a ~$20–60 premium over spot that
   * causes material price errors (proven: GC=F was 4,181.5 while spot was 4,149.79).
   */
  yahooSymbol: string | null;
  /**
   * Instrument type annotation — enforces that fallbacks do not substitute a
   * different instrument class (futures vs spot).
   */
  instrumentType: "spot" | "index" | "crypto" | "equity";
}


export interface ScreenerRow {
  slug: string;
  displayPair: string;
  category: MarketCategory;
  /** Live mid-price — null when feed offline */
  price: number | null;
  /** 24-hour percentage change — null when feed offline */
  changePct: number | null;
  /** Previous close price for calculating change */
  prevClose?: number | null;
  /** Bid price */
  bid?: number | null;
  /** Ask price */
  ask?: number | null;
  /** RSI(14) on 1H — null when feed offline or computation error */
  rsi: number | null;
  /** MSS-derived bias from identifyMSS on 1H OHLCV */
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  /** "twelvedata" | "yahoo" | "synthetic" */
  source: string;
  cached_at: string;
  /** Provider timestamp if available */
  provider_timestamp?: string | null;
  /** True when live feed unavailable — UI must show "—" and FEED_OFFLINE badge */
  feed_offline: boolean;
  ff_debug?: string;
}

// ─── FX Majors (8) ────────────────────────────────────────────────────────────
const FX_MAJORS: ScreenerInstrument[] = [
  { scannerSlug: "EURUSD",  displayPair: "EUR/USD", category: "forex", tvSymbol: "FX:EURUSD",  tdSymbol: "EUR/USD", yahooSymbol: "EURUSD=X",  instrumentType: "spot" },
  { scannerSlug: "GBPUSD",  displayPair: "GBP/USD", category: "forex", tvSymbol: "FX:GBPUSD",  tdSymbol: "GBP/USD", yahooSymbol: "GBPUSD=X",  instrumentType: "spot" },
  { scannerSlug: "USDJPY",  displayPair: "USD/JPY", category: "forex", tvSymbol: "FX:USDJPY",  tdSymbol: "USD/JPY", yahooSymbol: "USDJPY=X",  instrumentType: "spot" },
  { scannerSlug: "USDCHF",  displayPair: "USD/CHF", category: "forex", tvSymbol: "FX:USDCHF",  tdSymbol: "USD/CHF", yahooSymbol: "USDCHF=X",  instrumentType: "spot" },
  { scannerSlug: "AUDUSD",  displayPair: "AUD/USD", category: "forex", tvSymbol: "FX:AUDUSD",  tdSymbol: "AUD/USD", yahooSymbol: "AUDUSD=X",  instrumentType: "spot" },
  { scannerSlug: "NZDUSD",  displayPair: "NZD/USD", category: "forex", tvSymbol: "FX:NZDUSD",  tdSymbol: "NZD/USD", yahooSymbol: "NZDUSD=X",  instrumentType: "spot" },
  { scannerSlug: "USDCAD",  displayPair: "USD/CAD", category: "forex", tvSymbol: "FX:USDCAD",  tdSymbol: "USD/CAD", yahooSymbol: "USDCAD=X",  instrumentType: "spot" },
  { scannerSlug: "EURGBP",  displayPair: "EUR/GBP", category: "forex", tvSymbol: "FX:EURGBP",  tdSymbol: "EUR/GBP", yahooSymbol: "EURGBP=X",  instrumentType: "spot" },
];

// ─── FX Crosses (6) ───────────────────────────────────────────────────────────
const FX_CROSSES: ScreenerInstrument[] = [
  { scannerSlug: "GBPJPY",  displayPair: "GBP/JPY", category: "forex", tvSymbol: "FX:GBPJPY",  tdSymbol: "GBP/JPY", yahooSymbol: "GBPJPY=X",  instrumentType: "spot" },
  { scannerSlug: "EURJPY",  displayPair: "EUR/JPY", category: "forex", tvSymbol: "FX:EURJPY",  tdSymbol: "EUR/JPY", yahooSymbol: "EURJPY=X",  instrumentType: "spot" },
  { scannerSlug: "GBPCAD",  displayPair: "GBP/CAD", category: "forex", tvSymbol: "FX:GBPCAD",  tdSymbol: "GBP/CAD", yahooSymbol: "GBPCAD=X",  instrumentType: "spot" },
  { scannerSlug: "AUDCAD",  displayPair: "AUD/CAD", category: "forex", tvSymbol: "FX:AUDCAD",  tdSymbol: "AUD/CAD", yahooSymbol: "AUDCAD=X",  instrumentType: "spot" },
  { scannerSlug: "CADJPY",  displayPair: "CAD/JPY", category: "forex", tvSymbol: "FX:CADJPY",  tdSymbol: "CAD/JPY", yahooSymbol: "CADJPY=X",  instrumentType: "spot" },
  { scannerSlug: "EURCHF",  displayPair: "EUR/CHF", category: "forex", tvSymbol: "FX:EURCHF",  tdSymbol: "EUR/CHF", yahooSymbol: "EURCHF=X",  instrumentType: "spot" },
];

// ─── Commodities (4) ──────────────────────────────────────────────────────────
// XAUUSD and XAGUSD: yahooSymbol is null.
// Yahoo Finance has no OTC spot gold/silver ticker. GC=F and SI=F are COMEX futures
// contracts that carry a ~$20–60 premium over spot — using them caused a +$31.71
// pricing error (4,182.7 vs 4,149.79 spot). When Twelve Data is unavailable for
// these instruments, the screener MUST return feed_offline:true, never a futures price.
const COMMODITIES: ScreenerInstrument[] = [
  { scannerSlug: "XAUUSD",  displayPair: "XAU/USD", category: "commodities", tvSymbol: "OANDA:XAUUSD",  tdSymbol: "XAU/USD", yahooSymbol: null,    instrumentType: "spot" },
  { scannerSlug: "XAGUSD",  displayPair: "XAG/USD", category: "commodities", tvSymbol: "OANDA:XAGUSD",  tdSymbol: "XAG/USD", yahooSymbol: null,    instrumentType: "spot" },
  { scannerSlug: "WTIUSD",  displayPair: "WTI Oil",  category: "commodities", tvSymbol: "NYMEX:CL1!",   tdSymbol: "WTI/USD", yahooSymbol: "CL=F",  instrumentType: "spot" },
  { scannerSlug: "NATGAS",  displayPair: "Nat Gas",  category: "commodities", tvSymbol: "NYMEX:NG1!",   tdSymbol: "NATGAS",  yahooSymbol: "NG=F",  instrumentType: "spot" },
];

// ─── Indices (6) ──────────────────────────────────────────────────────────────
const INDICES: ScreenerInstrument[] = [
  { scannerSlug: "UKX",    displayPair: "UK100",  category: "indices", tvSymbol: "TVC:UKX",    tdSymbol: "FTSE",    yahooSymbol: "^FTSE",   instrumentType: "index" },
  { scannerSlug: "SPX",    displayPair: "US500",  category: "indices", tvSymbol: "TVC:SPX",    tdSymbol: "SPX",     yahooSymbol: "^GSPC",   instrumentType: "index" },
  { scannerSlug: "NDX",    displayPair: "NAS100", category: "indices", tvSymbol: "TVC:NDX",    tdSymbol: "NDX",     yahooSymbol: "^NDX",    instrumentType: "index" },
  { scannerSlug: "DJI",    displayPair: "US30",   category: "indices", tvSymbol: "TVC:DJI",    tdSymbol: "DJI",     yahooSymbol: "^DJI",    instrumentType: "index" },
  { scannerSlug: "DAX",    displayPair: "GER40",  category: "indices", tvSymbol: "XETR:DAX",   tdSymbol: "DAX",     yahooSymbol: "^GDAXI",  instrumentType: "index" },
  { scannerSlug: "NIKKEI", displayPair: "JPN225", category: "indices", tvSymbol: "TVC:NI225",  tdSymbol: "NIKKEI",  yahooSymbol: "^N225",   instrumentType: "index" },
];

// ─── Crypto (8) ───────────────────────────────────────────────────────────────
const CRYPTO: ScreenerInstrument[] = [
  { scannerSlug: "BTCUSDT",  displayPair: "BTC/USD",  category: "crypto", tvSymbol: "BINANCE:BTCUSDT",  tdSymbol: "BTC/USD",  yahooSymbol: "BTC-USD",  instrumentType: "crypto" },
  { scannerSlug: "ETHUSDT",  displayPair: "ETH/USD",  category: "crypto", tvSymbol: "BINANCE:ETHUSDT",  tdSymbol: "ETH/USD",  yahooSymbol: "ETH-USD",  instrumentType: "crypto" },
  { scannerSlug: "XRPUSDT",  displayPair: "XRP/USD",  category: "crypto", tvSymbol: "BINANCE:XRPUSDT",  tdSymbol: "XRP/USD",  yahooSymbol: "XRP-USD",  instrumentType: "crypto" },
  { scannerSlug: "SOLUSDT",  displayPair: "SOL/USD",  category: "crypto", tvSymbol: "BINANCE:SOLUSDT",  tdSymbol: "SOL/USD",  yahooSymbol: "SOL-USD",  instrumentType: "crypto" },
  { scannerSlug: "ADAUSDT",  displayPair: "ADA/USD",  category: "crypto", tvSymbol: "BINANCE:ADAUSDT",  tdSymbol: "ADA/USD",  yahooSymbol: "ADA-USD",  instrumentType: "crypto" },
  { scannerSlug: "DOGEUSDT", displayPair: "DOGE/USD", category: "crypto", tvSymbol: "BINANCE:DOGEUSDT", tdSymbol: "DOGE/USD", yahooSymbol: "DOGE-USD", instrumentType: "crypto" },
  { scannerSlug: "BNBUSDT",  displayPair: "BNB/USD",  category: "crypto", tvSymbol: "BINANCE:BNBUSDT",  tdSymbol: "BNB/USD",  yahooSymbol: "BNB-USD",  instrumentType: "crypto" },
  { scannerSlug: "LINKUSDT", displayPair: "LINK/USD", category: "crypto", tvSymbol: "BINANCE:LINKUSDT", tdSymbol: "LINK/USD", yahooSymbol: "LINK-USD", instrumentType: "crypto" },
];

// ─── UK Stocks (3) ────────────────────────────────────────────────────────────
const UK_STOCKS: ScreenerInstrument[] = [
  { scannerSlug: "BARC", displayPair: "Barclays", category: "stocks-uk", tvSymbol: "LSE:BARC", tdSymbol: "BARC:LSE", yahooSymbol: "BARC.L", instrumentType: "equity" },
  { scannerSlug: "LLOY", displayPair: "Lloyds",   category: "stocks-uk", tvSymbol: "LSE:LLOY", tdSymbol: "LLOY:LSE", yahooSymbol: "LLOY.L", instrumentType: "equity" },
  { scannerSlug: "SHEL", displayPair: "Shell",    category: "stocks-uk", tvSymbol: "LSE:SHEL", tdSymbol: "SHEL:LSE", yahooSymbol: "SHEL.L", instrumentType: "equity" },
];

// ─── US Stocks (3) ────────────────────────────────────────────────────────────
const US_STOCKS: ScreenerInstrument[] = [
  { scannerSlug: "AAPL", displayPair: "Apple",  category: "stocks-us", tvSymbol: "NASDAQ:AAPL", tdSymbol: "AAPL", yahooSymbol: "AAPL", instrumentType: "equity" },
  { scannerSlug: "NVDA", displayPair: "NVIDIA", category: "stocks-us", tvSymbol: "NASDAQ:NVDA", tdSymbol: "NVDA", yahooSymbol: "NVDA", instrumentType: "equity" },
  { scannerSlug: "TSLA", displayPair: "Tesla",  category: "stocks-us", tvSymbol: "NASDAQ:TSLA", tdSymbol: "TSLA", yahooSymbol: "TSLA", instrumentType: "equity" },
];


/**
 * Full 38-instrument canonical list.
 * SC2 public screener uses all except stocks (rate-limit protection on anonymous traffic).
 * SC3 dashboard scanner (Foundation+) uses all 38.
 */
export const SCREENER_INSTRUMENTS: ScreenerInstrument[] = [
  ...FX_MAJORS,
  ...FX_CROSSES,
  ...COMMODITIES,
  ...INDICES,
  ...CRYPTO,
  ...UK_STOCKS,
  ...US_STOCKS,
];

/**
 * Instruments shown on the public screener (no auth required).
 * Stocks excluded to avoid per-row indicator cost on anonymous traffic.
 */
export const PUBLIC_SCREENER_INSTRUMENTS: ScreenerInstrument[] = [
  ...FX_MAJORS,
  ...FX_CROSSES,
  ...COMMODITIES,
  ...INDICES,
  ...CRYPTO,
];

/** Look up a single instrument by scannerSlug */
export function getInstrumentBySlug(slug: string): ScreenerInstrument | undefined {
  return SCREENER_INSTRUMENTS.find(i => i.scannerSlug === slug);
}

/** All slugs in canonical order */
export const ALL_SCREENER_SLUGS = SCREENER_INSTRUMENTS.map(i => i.scannerSlug);
export const PUBLIC_SCREENER_SLUGS = PUBLIC_SCREENER_INSTRUMENTS.map(i => i.scannerSlug);
