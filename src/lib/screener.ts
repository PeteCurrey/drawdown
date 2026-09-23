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
  /** Yahoo Finance fallback symbol */
  yahooSymbol: string;
}

export interface ScreenerRow {
  slug: string;
  displayPair: string;
  category: MarketCategory;
  /** Live mid-price — null when feed offline */
  price: number | null;
  /** 24-hour percentage change — null when feed offline */
  changePct: number | null;
  /** RSI(14) on 1H — null when feed offline or computation error */
  rsi: number | null;
  /** MSS-derived bias from identifyMSS on 1H OHLCV */
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  /** "twelvedata" | "yahoo" | "synthetic" */
  source: string;
  cached_at: string;
  /** True when live feed unavailable — UI must show "—" and FEED_OFFLINE badge */
  feed_offline: boolean;
}

// ─── FX Majors (8) ────────────────────────────────────────────────────────────
const FX_MAJORS: ScreenerInstrument[] = [
  { scannerSlug: "EURUSD",  displayPair: "EUR/USD", category: "forex", tvSymbol: "FX:EURUSD",  tdSymbol: "EUR/USD", yahooSymbol: "EURUSD=X"  },
  { scannerSlug: "GBPUSD",  displayPair: "GBP/USD", category: "forex", tvSymbol: "FX:GBPUSD",  tdSymbol: "GBP/USD", yahooSymbol: "GBPUSD=X"  },
  { scannerSlug: "USDJPY",  displayPair: "USD/JPY", category: "forex", tvSymbol: "FX:USDJPY",  tdSymbol: "USD/JPY", yahooSymbol: "USDJPY=X"  },
  { scannerSlug: "USDCHF",  displayPair: "USD/CHF", category: "forex", tvSymbol: "FX:USDCHF",  tdSymbol: "USD/CHF", yahooSymbol: "USDCHF=X"  },
  { scannerSlug: "AUDUSD",  displayPair: "AUD/USD", category: "forex", tvSymbol: "FX:AUDUSD",  tdSymbol: "AUD/USD", yahooSymbol: "AUDUSD=X"  },
  { scannerSlug: "NZDUSD",  displayPair: "NZD/USD", category: "forex", tvSymbol: "FX:NZDUSD",  tdSymbol: "NZD/USD", yahooSymbol: "NZDUSD=X"  },
  { scannerSlug: "USDCAD",  displayPair: "USD/CAD", category: "forex", tvSymbol: "FX:USDCAD",  tdSymbol: "USD/CAD", yahooSymbol: "USDCAD=X"  },
  { scannerSlug: "EURGBP",  displayPair: "EUR/GBP", category: "forex", tvSymbol: "FX:EURGBP",  tdSymbol: "EUR/GBP", yahooSymbol: "EURGBP=X"  },
];

// ─── FX Crosses (6) ───────────────────────────────────────────────────────────
const FX_CROSSES: ScreenerInstrument[] = [
  { scannerSlug: "GBPJPY",  displayPair: "GBP/JPY", category: "forex", tvSymbol: "FX:GBPJPY",  tdSymbol: "GBP/JPY", yahooSymbol: "GBPJPY=X"  },
  { scannerSlug: "EURJPY",  displayPair: "EUR/JPY", category: "forex", tvSymbol: "FX:EURJPY",  tdSymbol: "EUR/JPY", yahooSymbol: "EURJPY=X"  },
  { scannerSlug: "GBPCAD",  displayPair: "GBP/CAD", category: "forex", tvSymbol: "FX:GBPCAD",  tdSymbol: "GBP/CAD", yahooSymbol: "GBPCAD=X"  },
  { scannerSlug: "AUDCAD",  displayPair: "AUD/CAD", category: "forex", tvSymbol: "FX:AUDCAD",  tdSymbol: "AUD/CAD", yahooSymbol: "AUDCAD=X"  },
  { scannerSlug: "CADJPY",  displayPair: "CAD/JPY", category: "forex", tvSymbol: "FX:CADJPY",  tdSymbol: "CAD/JPY", yahooSymbol: "CADJPY=X"  },
  { scannerSlug: "EURCHF",  displayPair: "EUR/CHF", category: "forex", tvSymbol: "FX:EURCHF",  tdSymbol: "EUR/CHF", yahooSymbol: "EURCHF=X"  },
];

// ─── Commodities (4) ──────────────────────────────────────────────────────────
const COMMODITIES: ScreenerInstrument[] = [
  { scannerSlug: "XAUUSD",  displayPair: "XAU/USD", category: "commodities", tvSymbol: "OANDA:XAUUSD",  tdSymbol: "XAU/USD", yahooSymbol: "GC=F"   },
  { scannerSlug: "XAGUSD",  displayPair: "XAG/USD", category: "commodities", tvSymbol: "OANDA:XAGUSD",  tdSymbol: "XAG/USD", yahooSymbol: "SI=F"   },
  { scannerSlug: "WTIUSD",  displayPair: "WTI Oil",  category: "commodities", tvSymbol: "NYMEX:CL1!",   tdSymbol: "WTI/USD", yahooSymbol: "CL=F"   },
  { scannerSlug: "NATGAS",  displayPair: "Nat Gas",  category: "commodities", tvSymbol: "NYMEX:NG1!",   tdSymbol: "NATGAS",  yahooSymbol: "NG=F"   },
];

// ─── Indices (6) ──────────────────────────────────────────────────────────────
const INDICES: ScreenerInstrument[] = [
  { scannerSlug: "UKX",    displayPair: "UK100",  category: "indices", tvSymbol: "TVC:UKX",    tdSymbol: "FTSE",    yahooSymbol: "^FTSE"   },
  { scannerSlug: "SPX",    displayPair: "US500",  category: "indices", tvSymbol: "TVC:SPX",    tdSymbol: "SPX",     yahooSymbol: "^GSPC"   },
  { scannerSlug: "NDX",    displayPair: "NAS100", category: "indices", tvSymbol: "TVC:NDX",    tdSymbol: "NDX",     yahooSymbol: "^NDX"    },
  { scannerSlug: "DJI",    displayPair: "US30",   category: "indices", tvSymbol: "TVC:DJI",    tdSymbol: "DJI",     yahooSymbol: "^DJI"    },
  { scannerSlug: "DAX",    displayPair: "GER40",  category: "indices", tvSymbol: "XETR:DAX",   tdSymbol: "DAX",     yahooSymbol: "^GDAXI"  },
  { scannerSlug: "NIKKEI", displayPair: "JPN225", category: "indices", tvSymbol: "TVC:NI225",  tdSymbol: "NIKKEI",  yahooSymbol: "^N225"   },
];

// ─── Crypto (8) ───────────────────────────────────────────────────────────────
const CRYPTO: ScreenerInstrument[] = [
  { scannerSlug: "BTCUSDT",  displayPair: "BTC/USD",  category: "crypto", tvSymbol: "BINANCE:BTCUSDT",  tdSymbol: "BTC/USD",  yahooSymbol: "BTC-USD"  },
  { scannerSlug: "ETHUSDT",  displayPair: "ETH/USD",  category: "crypto", tvSymbol: "BINANCE:ETHUSDT",  tdSymbol: "ETH/USD",  yahooSymbol: "ETH-USD"  },
  { scannerSlug: "XRPUSDT",  displayPair: "XRP/USD",  category: "crypto", tvSymbol: "BINANCE:XRPUSDT",  tdSymbol: "XRP/USD",  yahooSymbol: "XRP-USD"  },
  { scannerSlug: "SOLUSDT",  displayPair: "SOL/USD",  category: "crypto", tvSymbol: "BINANCE:SOLUSDT",  tdSymbol: "SOL/USD",  yahooSymbol: "SOL-USD"  },
  { scannerSlug: "ADAUSDT",  displayPair: "ADA/USD",  category: "crypto", tvSymbol: "BINANCE:ADAUSDT",  tdSymbol: "ADA/USD",  yahooSymbol: "ADA-USD"  },
  { scannerSlug: "DOGEUSDT", displayPair: "DOGE/USD", category: "crypto", tvSymbol: "BINANCE:DOGEUSDT", tdSymbol: "DOGE/USD", yahooSymbol: "DOGE-USD" },
  { scannerSlug: "BNBUSDT",  displayPair: "BNB/USD",  category: "crypto", tvSymbol: "BINANCE:BNBUSDT",  tdSymbol: "BNB/USD",  yahooSymbol: "BNB-USD"  },
  { scannerSlug: "LINKUSDT", displayPair: "LINK/USD", category: "crypto", tvSymbol: "BINANCE:LINKUSDT", tdSymbol: "LINK/USD", yahooSymbol: "LINK-USD" },
];

// ─── UK Stocks (3) ────────────────────────────────────────────────────────────
const UK_STOCKS: ScreenerInstrument[] = [
  { scannerSlug: "BARC", displayPair: "Barclays", category: "stocks-uk", tvSymbol: "LSE:BARC", tdSymbol: "BARC:LSE", yahooSymbol: "BARC.L" },
  { scannerSlug: "LLOY", displayPair: "Lloyds",   category: "stocks-uk", tvSymbol: "LSE:LLOY", tdSymbol: "LLOY:LSE", yahooSymbol: "LLOY.L" },
  { scannerSlug: "SHEL", displayPair: "Shell",    category: "stocks-uk", tvSymbol: "LSE:SHEL", tdSymbol: "SHEL:LSE", yahooSymbol: "SHEL.L" },
];

// ─── US Stocks (3) ────────────────────────────────────────────────────────────
const US_STOCKS: ScreenerInstrument[] = [
  { scannerSlug: "AAPL", displayPair: "Apple",  category: "stocks-us", tvSymbol: "NASDAQ:AAPL", tdSymbol: "AAPL", yahooSymbol: "AAPL" },
  { scannerSlug: "NVDA", displayPair: "NVIDIA", category: "stocks-us", tvSymbol: "NASDAQ:NVDA", tdSymbol: "NVDA", yahooSymbol: "NVDA" },
  { scannerSlug: "TSLA", displayPair: "Tesla",  category: "stocks-us", tvSymbol: "NASDAQ:TSLA", tdSymbol: "TSLA", yahooSymbol: "TSLA" },
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
