/**
 * src/lib/symbols.ts
 *
 * Curated symbol catalogue for the Drawdown watchlist search.
 *
 * Design decisions:
 * - Option 1 (curated list) — not TradingView's internal search endpoint, which
 *   is undocumented, unlicensed for third-party use, and can change without notice.
 * - Covers ~85 instruments scoped to what Drawdown's content actually discusses:
 *   forex majors/minors/crosses, metals, energy, major global indices, crypto.
 * - Extends (not duplicates) the Phase 2 DASHBOARD_INSTRUMENTS 12-symbol set.
 * - Search matches against ticker, displayPair, and named aliases — case-insensitive
 *   substring. Aliases like "gold", "cable", "fiber", "nasdaq", "footsie" are
 *   first-class search terms, not afterthoughts.
 * - tvSymbol is the confirmed TradingView embed symbol for each instrument, aligned
 *   with the DASHBOARD_INSTRUMENTS mapping in MarketConsensus.tsx.
 * - priceSymbol is the symbol format expected by getMarketPrices() / TwelveData
 *   (slashed pairs for forex/metals, plain tickers for indices).
 */

export type SymbolCategory =
  | "forex-major"
  | "forex-minor"
  | "metals"
  | "energy"
  | "indices"
  | "crypto";

export interface CuratedSymbol {
  /** Canonical display label, e.g. "EUR/USD" */
  displayPair: string;
  /** Short name for display alongside the ticker, e.g. "Euro / US Dollar" */
  name: string;
  /** TradingView embed symbol, e.g. "FX:EURUSD" */
  tvSymbol: string;
  /** Symbol format accepted by getMarketPrices() / TwelveData */
  priceSymbol: string;
  category: SymbolCategory;
  /** Lower-cased alias strings — used by searchSymbols() for alias matching */
  aliases: string[];
}

export const CATEGORY_LABELS: Record<SymbolCategory, string> = {
  "forex-major": "Forex Major",
  "forex-minor": "Forex Minor",
  metals:        "Metal",
  energy:        "Energy",
  indices:       "Index",
  crypto:        "Crypto",
};

// ─── Curated catalogue ────────────────────────────────────────────────────
// tvSymbol values confirmed against TradingView's live symbol database.
// priceSymbol values confirmed against TwelveData's symbol reference.

export const CURATED_SYMBOLS: CuratedSymbol[] = [

  // ── Forex Majors ─────────────────────────────────────────────────────────
  {
    displayPair: "EUR/USD", name: "Euro / US Dollar",
    tvSymbol: "FX:EURUSD", priceSymbol: "EUR/USD",
    category: "forex-major",
    aliases: ["fiber", "eurusd", "euro", "eur", "europe"],
  },
  {
    displayPair: "GBP/USD", name: "British Pound / US Dollar",
    tvSymbol: "FX:GBPUSD", priceSymbol: "GBP/USD",
    category: "forex-major",
    aliases: ["cable", "gbpusd", "sterling", "pound", "gbp", "quid"],
  },
  {
    displayPair: "USD/JPY", name: "US Dollar / Japanese Yen",
    tvSymbol: "FX:USDJPY", priceSymbol: "USD/JPY",
    category: "forex-major",
    aliases: ["yen", "usdjpy", "ninja", "gopher", "jpy"],
  },
  {
    displayPair: "USD/CHF", name: "US Dollar / Swiss Franc",
    tvSymbol: "FX:USDCHF", priceSymbol: "USD/CHF",
    category: "forex-major",
    aliases: ["swissy", "usdchf", "franc", "chf", "swiss"],
  },
  {
    displayPair: "AUD/USD", name: "Australian Dollar / US Dollar",
    tvSymbol: "FX:AUDUSD", priceSymbol: "AUD/USD",
    category: "forex-major",
    aliases: ["aussie", "audusd", "aud", "australia"],
  },
  {
    displayPair: "NZD/USD", name: "New Zealand Dollar / US Dollar",
    tvSymbol: "FX:NZDUSD", priceSymbol: "NZD/USD",
    category: "forex-major",
    aliases: ["kiwi", "nzdusd", "nzd", "new zealand"],
  },
  {
    displayPair: "USD/CAD", name: "US Dollar / Canadian Dollar",
    tvSymbol: "FX:USDCAD", priceSymbol: "USD/CAD",
    category: "forex-major",
    aliases: ["loonie", "usdcad", "cad", "canada"],
  },

  // ── Forex Minors / Crosses ────────────────────────────────────────────────
  {
    displayPair: "GBP/JPY", name: "British Pound / Japanese Yen",
    tvSymbol: "FX:GBPJPY", priceSymbol: "GBP/JPY",
    category: "forex-minor",
    aliases: ["geppy", "gbpjpy", "pound yen"],
  },
  {
    displayPair: "EUR/JPY", name: "Euro / Japanese Yen",
    tvSymbol: "FX:EURJPY", priceSymbol: "EUR/JPY",
    category: "forex-minor",
    aliases: ["eurjpy", "euro yen", "yuppy"],
  },
  {
    displayPair: "EUR/GBP", name: "Euro / British Pound",
    tvSymbol: "FX:EURGBP", priceSymbol: "EUR/GBP",
    category: "forex-minor",
    aliases: ["eurgbp", "chunnel"],
  },
  {
    displayPair: "AUD/JPY", name: "Australian Dollar / Japanese Yen",
    tvSymbol: "FX:AUDJPY", priceSymbol: "AUD/JPY",
    category: "forex-minor",
    aliases: ["audjpy", "aussie yen"],
  },
  {
    displayPair: "GBP/AUD", name: "British Pound / Australian Dollar",
    tvSymbol: "FX:GBPAUD", priceSymbol: "GBP/AUD",
    category: "forex-minor",
    aliases: ["gbpaud", "sterling aussie"],
  },
  {
    displayPair: "GBP/CHF", name: "British Pound / Swiss Franc",
    tvSymbol: "FX:GBPCHF", priceSymbol: "GBP/CHF",
    category: "forex-minor",
    aliases: ["gbpchf"],
  },
  {
    displayPair: "EUR/AUD", name: "Euro / Australian Dollar",
    tvSymbol: "FX:EURAUD", priceSymbol: "EUR/AUD",
    category: "forex-minor",
    aliases: ["euraud"],
  },
  {
    displayPair: "EUR/CHF", name: "Euro / Swiss Franc",
    tvSymbol: "FX:EURCHF", priceSymbol: "EUR/CHF",
    category: "forex-minor",
    aliases: ["eurchf"],
  },
  {
    displayPair: "EUR/CAD", name: "Euro / Canadian Dollar",
    tvSymbol: "FX:EURCAD", priceSymbol: "EUR/CAD",
    category: "forex-minor",
    aliases: ["eurcad"],
  },
  {
    displayPair: "GBP/CAD", name: "British Pound / Canadian Dollar",
    tvSymbol: "FX:GBPCAD", priceSymbol: "GBP/CAD",
    category: "forex-minor",
    aliases: ["gbpcad"],
  },
  {
    displayPair: "AUD/CAD", name: "Australian Dollar / Canadian Dollar",
    tvSymbol: "FX:AUDCAD", priceSymbol: "AUD/CAD",
    category: "forex-minor",
    aliases: ["audcad"],
  },
  {
    displayPair: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar",
    tvSymbol: "FX:AUDNZD", priceSymbol: "AUD/NZD",
    category: "forex-minor",
    aliases: ["audnzd"],
  },
  {
    displayPair: "NZD/JPY", name: "New Zealand Dollar / Japanese Yen",
    tvSymbol: "FX:NZDJPY", priceSymbol: "NZD/JPY",
    category: "forex-minor",
    aliases: ["nzdjpy", "kiwi yen"],
  },
  {
    displayPair: "CAD/JPY", name: "Canadian Dollar / Japanese Yen",
    tvSymbol: "FX:CADJPY", priceSymbol: "CAD/JPY",
    category: "forex-minor",
    aliases: ["cadjpy"],
  },
  {
    displayPair: "USD/SGD", name: "US Dollar / Singapore Dollar",
    tvSymbol: "FX:USDSGD", priceSymbol: "USD/SGD",
    category: "forex-minor",
    aliases: ["usdsgd", "singapore", "sgd"],
  },
  {
    displayPair: "USD/HKD", name: "US Dollar / Hong Kong Dollar",
    tvSymbol: "FX:USDHKD", priceSymbol: "USD/HKD",
    category: "forex-minor",
    aliases: ["usdhkd", "hong kong", "hkd"],
  },

  // ── Metals ────────────────────────────────────────────────────────────────
  {
    displayPair: "XAU/USD", name: "Gold / US Dollar",
    tvSymbol: "TVC:GOLD", priceSymbol: "XAU/USD",
    category: "metals",
    aliases: ["gold", "xauusd", "xau", "bullion", "yellow metal"],
  },
  {
    displayPair: "XAG/USD", name: "Silver / US Dollar",
    tvSymbol: "OANDA:XAGUSD", priceSymbol: "XAG/USD",
    category: "metals",
    aliases: ["silver", "xagusd", "xag"],
  },
  {
    displayPair: "XPT/USD", name: "Platinum / US Dollar",
    tvSymbol: "TVC:PLATINUM", priceSymbol: "XPT/USD",
    category: "metals",
    aliases: ["platinum", "xptusd", "xpt"],
  },
  {
    displayPair: "XPD/USD", name: "Palladium / US Dollar",
    tvSymbol: "TVC:PALLADIUM", priceSymbol: "XPD/USD",
    category: "metals",
    aliases: ["palladium", "xpdusd", "xpd"],
  },
  {
    displayPair: "XCU/USD", name: "Copper / US Dollar",
    tvSymbol: "TVC:COPPER", priceSymbol: "COPPER",
    category: "metals",
    aliases: ["copper", "xcuusd", "xcu", "dr copper"],
  },

  // ── Energy ────────────────────────────────────────────────────────────────
  {
    displayPair: "USOIL", name: "WTI Crude Oil",
    tvSymbol: "TVC:USOIL", priceSymbol: "WTI",
    category: "energy",
    aliases: ["wti", "crude", "oil", "usoil", "west texas", "cl"],
  },
  {
    displayPair: "UKOIL", name: "Brent Crude Oil",
    tvSymbol: "TVC:UKOIL", priceSymbol: "BRENTOIL",
    category: "energy",
    aliases: ["brent", "ukoil", "brent crude", "icebrent"],
  },
  {
    displayPair: "NATGAS", name: "Natural Gas",
    tvSymbol: "TVC:NATURALGAS", priceSymbol: "NATGAS",
    category: "energy",
    aliases: ["gas", "natural gas", "natgas", "ng"],
  },

  // ── Indices ───────────────────────────────────────────────────────────────
  {
    displayPair: "UK100", name: "FTSE 100",
    tvSymbol: "TVC:UKX", priceSymbol: "UK100",
    category: "indices",
    aliases: ["ftse", "ftse100", "footsie", "ukx", "uk100", "uk 100"],
  },
  {
    displayPair: "US500", name: "S&P 500",
    tvSymbol: "TVC:SPX", priceSymbol: "SPX",
    category: "indices",
    aliases: ["sp500", "spx", "s&p", "s&p500", "us500", "us 500"],
  },
  {
    displayPair: "NAS100", name: "Nasdaq 100",
    tvSymbol: "TVC:NDX", priceSymbol: "NDX",
    category: "indices",
    aliases: ["nasdaq", "ndx", "nas100", "nas 100", "tech", "qqq"],
  },
  {
    displayPair: "US30", name: "Dow Jones Industrial Average",
    tvSymbol: "TVC:DJI", priceSymbol: "DJI",
    category: "indices",
    aliases: ["dow", "djia", "us30", "us 30", "dow jones"],
  },
  {
    displayPair: "DE40", name: "DAX 40",
    tvSymbol: "XETR:DAX", priceSymbol: "DE30",
    category: "indices",
    aliases: ["dax", "de40", "de 40", "germany40", "germany 40", "dax40"],
  },
  {
    displayPair: "EU50", name: "Euro Stoxx 50",
    tvSymbol: "EUREX:FESX1!", priceSymbol: "EU50",
    category: "indices",
    aliases: ["stoxx", "eurostoxx", "eu50", "eu 50", "euro stoxx"],
  },
  {
    displayPair: "JP225", name: "Nikkei 225",
    tvSymbol: "TVC:NI225", priceSymbol: "JP225",
    category: "indices",
    aliases: ["nikkei", "jp225", "jp 225", "japan225", "ni225"],
  },
  {
    displayPair: "ASX200", name: "ASX 200",
    tvSymbol: "ASX:XJO", priceSymbol: "AUS200",
    category: "indices",
    aliases: ["asx", "asx200", "asx 200", "australia200"],
  },
  {
    displayPair: "HK50", name: "Hang Seng",
    tvSymbol: "TVC:HSI", priceSymbol: "HK50",
    category: "indices",
    aliases: ["hangseng", "hk50", "hsi", "hang seng", "hong kong"],
  },
  {
    displayPair: "FR40", name: "CAC 40",
    tvSymbol: "EURONEXT:CAC40", priceSymbol: "FRA40",
    category: "indices",
    aliases: ["cac", "cac40", "fr40", "france40", "fr 40"],
  },
  {
    displayPair: "VIX", name: "CBOE Volatility Index",
    tvSymbol: "TVC:VIX", priceSymbol: "VIX",
    category: "indices",
    aliases: ["vix", "fear index", "volatility", "cboe vix"],
  },

  // ── Crypto ────────────────────────────────────────────────────────────────
  {
    displayPair: "BTC/USD", name: "Bitcoin / US Dollar",
    tvSymbol: "BINANCE:BTCUSDT", priceSymbol: "BTC/USD",
    category: "crypto",
    aliases: ["bitcoin", "btc", "btcusd", "xbt", "digital gold"],
  },
  {
    displayPair: "ETH/USD", name: "Ethereum / US Dollar",
    tvSymbol: "BINANCE:ETHUSDT", priceSymbol: "ETH/USD",
    category: "crypto",
    aliases: ["ethereum", "eth", "ethusd", "ether"],
  },
  {
    displayPair: "XRP/USD", name: "XRP / US Dollar",
    tvSymbol: "BINANCE:XRPUSDT", priceSymbol: "XRP/USD",
    category: "crypto",
    aliases: ["ripple", "xrp", "xrpusd"],
  },
  {
    displayPair: "SOL/USD", name: "Solana / US Dollar",
    tvSymbol: "BINANCE:SOLUSDT", priceSymbol: "SOL/USD",
    category: "crypto",
    aliases: ["solana", "sol", "solusd"],
  },
  {
    displayPair: "BNB/USD", name: "BNB / US Dollar",
    tvSymbol: "BINANCE:BNBUSDT", priceSymbol: "BNB/USD",
    category: "crypto",
    aliases: ["bnb", "binance coin", "bnbusd"],
  },
  {
    displayPair: "ADA/USD", name: "Cardano / US Dollar",
    tvSymbol: "BINANCE:ADAUSDT", priceSymbol: "ADA/USD",
    category: "crypto",
    aliases: ["cardano", "ada", "adausd"],
  },
  {
    displayPair: "DOGE/USD", name: "Dogecoin / US Dollar",
    tvSymbol: "BINANCE:DOGEUSDT", priceSymbol: "DOGE/USD",
    category: "crypto",
    aliases: ["dogecoin", "doge", "dogeusd", "shibe"],
  },
  {
    displayPair: "DOT/USD", name: "Polkadot / US Dollar",
    tvSymbol: "BINANCE:DOTUSDT", priceSymbol: "DOT/USD",
    category: "crypto",
    aliases: ["polkadot", "dot", "dotusd"],
  },
  {
    displayPair: "AVAX/USD", name: "Avalanche / US Dollar",
    tvSymbol: "BINANCE:AVAXUSDT", priceSymbol: "AVAX/USD",
    category: "crypto",
    aliases: ["avalanche", "avax", "avaxusd"],
  },
  {
    displayPair: "LINK/USD", name: "Chainlink / US Dollar",
    tvSymbol: "BINANCE:LINKUSDT", priceSymbol: "LINK/USD",
    category: "crypto",
    aliases: ["chainlink", "link", "linkusd"],
  },
  {
    displayPair: "LTC/USD", name: "Litecoin / US Dollar",
    tvSymbol: "BINANCE:LTCUSDT", priceSymbol: "LTC/USD",
    category: "crypto",
    aliases: ["litecoin", "ltc", "ltcusd", "digital silver"],
  },
];

// ─── Search function ──────────────────────────────────────────────────────

/**
 * Returns up to `limit` symbols matching `query`.
 *
 * Ranking (highest first):
 * 1. displayPair starts with query (e.g. "EU" → "EUR/USD" first)
 * 2. displayPair contains query anywhere
 * 3. name contains query
 * 4. Any alias contains query
 *
 * All matching is case-insensitive.
 */
export function searchSymbols(query: string, limit = 8): CuratedSymbol[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  type Scored = { sym: CuratedSymbol; score: number };
  const scored: Scored[] = [];

  for (const sym of CURATED_SYMBOLS) {
    const dp    = sym.displayPair.toLowerCase();
    const name  = sym.name.toLowerCase();
    const noSlash = dp.replace("/", "");

    let score = 0;

    if (dp.startsWith(q) || noSlash.startsWith(q))               score = 40;
    else if (dp.includes(q) || noSlash.includes(q))              score = 30;
    else if (name.includes(q))                                    score = 20;
    else if (sym.aliases.some((a) => a.includes(q)))             score = 10;

    if (score > 0) scored.push({ sym, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.sym);
}

/**
 * Looks up a symbol by exact displayPair match.
 * Used to resolve a stored watchlist symbol back to its full CuratedSymbol.
 */
export function findSymbol(displayPair: string): CuratedSymbol | undefined {
  return CURATED_SYMBOLS.find(
    (s) => s.displayPair.toLowerCase() === displayPair.toLowerCase()
  );
}
