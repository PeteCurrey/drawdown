import { createServerClient } from "@supabase/ssr";

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY || process.env.TWELVE_DATA_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

/**
 * Curated mega-cap + high-conviction watchlist.
 * Used by Insider Tracker, Cluster Buy detection, and AI Signals.
 * Balanced across tech, finance, healthcare, energy, retail.
 */
export const INTELLIGENCE_SYMBOLS = [
  "AAPL", "MSFT", "NVDA", "AMZN", "TSLA",
  "META", "GOOGL", "JPM", "BAC", "XOM",
  "WMT", "JNJ", "NFLX", "AMD", "GS"
];

function getTwelveDataKeys(): string[] {
  const list: string[] = [];
  const envKeys = [
    process.env.TWELVEDATA_API_KEY,
    process.env.TWELVE_DATA_KEY,
    process.env.TWELVE_DATA_KEY_ALT,
    process.env.NEXT_PUBLIC_TWELVE_DATA_KEY
  ];
  envKeys.forEach(val => {
    if (val) {
      val.split(",").forEach(k => {
        const trimmed = k.trim();
        if (trimmed && !list.includes(trimmed)) list.push(trimmed);
      });
    }
  });
  return list.filter(k => k.length > 5);
}

export interface MarketPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high?: number;
  low?: number;
  sparkline?: number[];
}

export interface InsiderTransaction {
  symbol: string;
  name: string;
  share: number;
  change: number;
  filingDate: string;
  transactionDate: string;
  transactionCode: string;
  transactionPrice: number;
}

export interface CongressionalTrade {
  symbol: string;
  name: string;
  transactionDate: string;
  filingDate: string;
  transactionType: 'Purchase' | 'Sale' | 'Exchange';
  amount: string;
  owner: string;
}

export interface SentimentData {
  symbol: string;
  /** 0 to 1 */
  score: number;
  bullishPercent: number;
  bearishPercent: number;
  buzz: number;
  mentions: number;
}

export async function getMarketPrices(symbols: string[]): Promise<MarketPrice[]> {
  const cacheKey = `prices:${symbols.sort().join(",")}`;
  const cached = await getCachedData(cacheKey);
  // Sanitise cached data — price may be null if it was cached from a failed API call
  if (cached && Array.isArray(cached)) {
    const sanitized = (cached as MarketPrice[]).map(item => ({
      ...item,
      price: (typeof item.price === 'number' && !Number.isNaN(item.price)) ? item.price : NaN,
      changePercent: (typeof item.changePercent === 'number' && !Number.isNaN(item.changePercent)) ? item.changePercent : 0,
      change: (typeof item.change === 'number' && !Number.isNaN(item.change)) ? item.change : 0,
    }));
    // If cache is valid and has valid prices, return it
    if (sanitized.every(item => !Number.isNaN(item.price))) {
      return sanitized;
    }
  }

  const results: MarketPrice[] = [];
  const keys = getTwelveDataKeys();
  let apiSuccess = false;

  if (keys.length > 0) {
    for (const key of keys) {
      try {
        console.log(`[getMarketPrices] Attempting Twelve Data with key: ${key.substring(0, 5)}...`);
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${symbols.join(",")}&apikey=${key}`
        );
        const data = await response.json();
        
        if (data && (data.status === "error" || data.code === 429 || (data.message && (data.message.includes("credits") || data.message.includes("limit") || data.message.includes("Rate limit"))))) {
          throw new Error("KEY_EXHAUSTED");
        }
        
        symbols.forEach(symbol => {
          const quote = symbols.length === 1 ? data : data[symbol];
          if (quote && (quote.close || quote.price)) {
            results.push({
              symbol,
              price: parseFloat(quote.close || quote.price),
              change: parseFloat(quote.change || "0"),
              changePercent: parseFloat(quote.percent_change || "0"),
              volume: parseInt(quote.volume || "0"),
              high: parseFloat(quote.high || "0"),
              low: parseFloat(quote.low || "0"),
            });
          }
        });
        
        if (results.length > 0) {
          apiSuccess = true;
          console.log(`[getMarketPrices] Successfully fetched quote using key: ${key.substring(0, 5)}...`);
          break;
        }
      } catch (error: any) {
        console.warn(`[getMarketPrices] Key ${key.substring(0, 5)}... failed or exhausted. Error:`, error.message || error);
      }
    }
  }

  // Free Fallback: Frankfurter (Forex) and CoinGecko (Crypto)
  if (!apiSuccess) {
    try {
      const fxRes = await fetch("https://api.frankfurter.app/latest?from=GBP&to=USD,EUR,JPY,AUD,CAD,CHF");
      const fxData = fxRes.ok ? await fxRes.json() : null;

      const cgRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true");
      const cgData = cgRes.ok ? await cgRes.json() : null;

      for (const symbol of symbols) {
        if (symbol.includes("BTC")) {
          const p = cgData?.bitcoin?.usd;
          const c = cgData?.bitcoin?.usd_24h_change;
          if (p) results.push({ symbol, price: p, change: 0, changePercent: c || 0, volume: 0 });
        } else if (symbol.includes("ETH")) {
          const p = cgData?.ethereum?.usd;
          const c = cgData?.ethereum?.usd_24h_change;
          if (p) results.push({ symbol, price: p, change: 0, changePercent: c || 0, volume: 0 });
        } else if (symbol.includes("XRP")) {
          const p = cgData?.ripple?.usd;
          const c = cgData?.ripple?.usd_24h_change;
          if (p) results.push({ symbol, price: p, change: 0, changePercent: c || 0, volume: 0 });
        } else if (symbol === "GBP/USD" || symbol === "GBPUSD") {
          const rate = fxData?.rates?.USD;
          if (rate) results.push({ symbol, price: rate, change: 0, changePercent: 0, volume: 0 });
        } else if (symbol === "EUR/USD" || symbol === "EURUSD") {
          const usdRate = fxData?.rates?.USD;
          const eurRate = fxData?.rates?.EUR;
          if (usdRate && eurRate) results.push({ symbol, price: usdRate / eurRate, change: 0, changePercent: 0, volume: 0 });
        } else if (symbol === "USD/JPY" || symbol === "USDJPY") {
          const usdRate = fxData?.rates?.USD;
          const jpyRate = fxData?.rates?.JPY;
          if (usdRate && jpyRate) results.push({ symbol, price: jpyRate / usdRate, change: 0, changePercent: 0, volume: 0 });
        } else if (symbol === "AUD/USD" || symbol === "AUDUSD") {
          const usdRate = fxData?.rates?.USD;
          const audRate = fxData?.rates?.AUD;
          if (usdRate && audRate) results.push({ symbol, price: usdRate / audRate, change: 0, changePercent: 0, volume: 0 });
        }
      }
    } catch (error) {
      console.error("Price Free Fallback API Error:", error);
    }
  }

  if (results.length > 0) {
    await setCacheData(cacheKey, results, 60);
  }
  return results;
}

/**
 * Generates realistic synthetic historical OHLC data when live API feeds are unavailable or rate-limited.
 */
export function generateFallbackHistory(symbol: string, interval: string = "1h", outputsize: number = 150) {
  const cleanSymbol = (symbol || "GBPUSD").toUpperCase().replace("/", "").trim();
  
  // Base price & volatility parameters based on asset class
  let basePrice = 1.2650;
  let volatility = 0.0025;
  
  if (cleanSymbol.includes("XAU") || cleanSymbol.includes("GOLD")) {
    basePrice = 2380.00;
    volatility = 6.5;
  } else if (cleanSymbol.includes("BTC") || cleanSymbol.includes("CRYPTO")) {
    basePrice = 64500.00;
    volatility = 350.0;
  } else if (cleanSymbol.includes("FTSE") || cleanSymbol.includes("UK100") || cleanSymbol.includes("US30") || cleanSymbol.includes("SPX")) {
    basePrice = 8220.00;
    volatility = 25.0;
  } else if (cleanSymbol.includes("EUR")) {
    basePrice = 1.0850;
    volatility = 0.0020;
  } else if (cleanSymbol.includes("JPY")) {
    basePrice = 154.50;
    volatility = 0.35;
  }

  // Interval in seconds
  let secondsPerInterval = 3600;
  const lowerInterval = interval.toLowerCase();
  if (lowerInterval === "15m") secondsPerInterval = 900;
  else if (lowerInterval === "4h") secondsPerInterval = 14400;
  else if (lowerInterval === "1d") secondsPerInterval = 86400;

  const nowSecs = Math.floor(Date.now() / 1000);
  const startTime = nowSecs - (outputsize * secondsPerInterval);

  const history: any[] = [];
  let currentPrice = basePrice;

  // Pseudo-random seed for consistent pattern per symbol
  let seed = 0;
  for (let i = 0; i < cleanSymbol.length; i++) seed += cleanSymbol.charCodeAt(i);

  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const isForexMajor = cleanSymbol.includes("USD") && !cleanSymbol.includes("BTC") && !cleanSymbol.includes("XAU");

  for (let i = 0; i < outputsize; i++) {
    const time = startTime + (i * secondsPerInterval);
    const r1 = pseudoRandom() - 0.485; // Slight trend/drift
    const r2 = pseudoRandom();
    const r3 = pseudoRandom();

    const change = r1 * volatility * 2.2;
    const open = currentPrice;
    const close = Math.max(0.0001, open + change);
    const high = Math.max(open, close) + (r2 * volatility * 0.9);
    const low = Math.max(0.0001, Math.min(open, close) - (r3 * volatility * 0.9));
    const volume = Math.floor(1200 + pseudoRandom() * 8800);

    currentPrice = close;

    history.push({
      time,
      open: parseFloat(open.toFixed(isForexMajor ? 5 : 2)),
      high: parseFloat(high.toFixed(isForexMajor ? 5 : 2)),
      low: parseFloat(low.toFixed(isForexMajor ? 5 : 2)),
      close: parseFloat(close.toFixed(isForexMajor ? 5 : 2)),
      volume
    });
  }

  return history;
}

/**
 * Fetches historical OHLC data for a symbol. 
 * Used for technical scanning and backtesting.
 */
export async function getMarketHistory(symbol: string, interval: string = "1h", outputsize: number = 150) {
  const cacheKey = `history:${symbol}:${interval}:${outputsize}`;
  const cached = await getCachedData(cacheKey);
  if (cached && Array.isArray(cached) && cached.length >= 20) return cached;

  const keys = getTwelveDataKeys();
  
  // Format symbol for Twelve Data
  let apiSymbol = symbol;
  if (symbol === "GBPUSD") apiSymbol = "GBP/USD";
  if (symbol === "XAUUSD") apiSymbol = "XAU/USD";
  if (symbol === "BTCUSD") apiSymbol = "BTC/USD";
  if (symbol === "FTSE100") apiSymbol = "FTSE";

  if (keys.length > 0) {
    for (const key of keys) {
      try {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${apiSymbol}&interval=${interval}&outputsize=${outputsize}&apikey=${key}`
        );
        const data = await response.json();
        
        if (data && data.values && Array.isArray(data.values) && data.values.length >= 20) {
          const history = data.values.map((v: any) => ({
            time: v.datetime,
            open: parseFloat(v.open),
            high: parseFloat(v.high),
            low: parseFloat(v.low),
            close: parseFloat(v.close),
            volume: parseInt(v.volume || "0")
          })).reverse();

          await setCacheData(cacheKey, history, 300); // 5 minutes cache
          return history;
        }
      } catch (error) {
        console.warn(`[getMarketHistory] Key ${key.substring(0, 5)}... failed, trying next key.`);
      }
    }
  }

  console.log(`[getMarketHistory] Live feed offline or rate limited. Returning synthetic history for ${symbol}`);
  const fallback = generateFallbackHistory(symbol, interval, outputsize);
  await setCacheData(cacheKey, fallback, 300);
  return fallback;
}

// Economic Calendar
export async function getEconomicCalendar() {
  if (!FINNHUB_API_KEY) return [];
  
  const cacheKey = "calendar:economic";
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    const events = data.economicCalendar || [];
    
    await setCacheData(cacheKey, events, 3600); // 1 hour cache
    return events;
  } catch (error) {
    console.error("Finnhub Calendar Error:", error);
    return [];
  }
}

// Earnings Calendar
export async function getEarningsCalendar() {
  if (!FINNHUB_API_KEY) return [];
  
  const cacheKey = "calendar:earnings";
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    const earnings = data.earningsCalendar || [];
    
    await setCacheData(cacheKey, earnings, 3600); // 1 hour cache
    return earnings;
  } catch (error) {
    console.error("Finnhub Earnings Error:", error);
    return [];
  }
}

// Market Sentiment (Fear & Greed + VIX)
export async function getMarketSentiment() {
  const cacheKey = "sentiment:fear_greed";
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Combine Alternative.me (Crypto F&G) with VIX data from TwelveData/Finnhub
    const response = await fetch("https://api.alternative.me/fng/?limit=1");
    const data = await response.json();
    const fng = data.data?.[0]?.value || "50";

    // Mock/Fetch VIX (Market Volatility)
    const vixSymbols = await getMarketPrices(["VIX", "MOVE"]); // VIX and optional Bond volatility
    const vixValue = vixSymbols[0]?.price;

    const sentiment = {
      fearGreed: parseInt(fng),
      vix: vixValue,
      label: parseInt(fng) > 75 ? "Extreme Greed" : 
             parseInt(fng) > 55 ? "Greed" : 
             parseInt(fng) > 45 ? "Neutral" : 
             parseInt(fng) > 25 ? "Fear" : "Extreme Fear",
      updatedAt: new Date().toISOString()
    };
    
    await setCacheData(cacheKey, sentiment, 300); // 5 minutes cache
    return sentiment;
  } catch (error) {
    console.error("Sentiment API Error:", error);
    return { fearGreed: 50, vix: 15, label: "Neutral", updatedAt: new Date().toISOString() };
  }
}

// ─── Insider Transactions ─────────────────────────────────────────────────────
// Fetches across a curated symbol list (or a single symbol) and merges results
// sorted by most recent transaction date. Uses Finnhub stock/insider-transactions.
export async function getInsiderTransactions(symbols?: string | string[]) {
  if (!FINNHUB_API_KEY) return [];

  const symbolList = symbols
    ? Array.isArray(symbols) ? symbols : [symbols]
    : INTELLIGENCE_SYMBOLS;

  const cacheKey = `insider:${symbolList.sort().join(",")}`;
  const cached = await getCachedData(cacheKey);
  if (cached && Array.isArray(cached)) return cached;

  try {
    // Fetch all symbols in parallel, rate-limit friendly (15 symbols)
    const results = await Promise.allSettled(
      symbolList.map(async (sym) => {
        const res = await fetch(
          `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${sym}&token=${FINNHUB_API_KEY}`,
          { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        // Response shape: { symbol: string, data: Transaction[] }
        const rows: any[] = data.data ?? [];
        return rows.map((r: any) => ({ ...r, symbol: sym }));
      })
    );

    const allTrades: any[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") allTrades.push(...r.value);
    }

    // Sort by most recent filing date descending
    const sorted = allTrades
      .filter(t => t.filingDate && t.name)
      .sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime());

    await setCacheData(cacheKey, sorted, 3600);
    return sorted;
  } catch (error) {
    console.error("Insider API Error:", error);
    return [];
  }
}

// ─── Congressional Trading via SEC EDGAR (free, no auth) ───────────────────────
// STOCK Act periodic transaction reports are filed as Form PT and publicly
// accessible via SEC EDGAR full-text search RSS feed.
// Shape returned: { name, symbol, transactionType, amount, filingDate, transactionDate, owner, filingUrl }
export async function getCongressionalTrading() {
  const cacheKey = "congress:trades:edgar";
  const cached = await getCachedData(cacheKey);
  if (cached && Array.isArray(cached) && cached.length > 0) return cached;

  try {
    // EDGAR full-text search for recent periodic transaction reports (Form PT / Annual PT)
    const edgarUrl = "https://efts.sec.gov/LATEST/search-index?q=%22periodic+transaction%22+%22purchase%22&dateRange=custom&startdt=" +
      new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().slice(0, 10) +
      "&enddt=" + new Date().toISOString().slice(0, 10) +
      "&forms=PT,PTY&hits.hits.total.value=true&hits.hits._source.period_of_report=true";

    const res = await fetch(
      `https://efts.sec.gov/LATEST/search-index?q=%22periodic+transaction+report%22&forms=PT&dateRange=custom&startdt=${new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().slice(0, 10)}&enddt=${new Date().toISOString().slice(0, 10)}`,
      { headers: { "User-Agent": "drawdown.trading contact@drawdown.trading" }, next: { revalidate: 21600 } }
    );
    if (!res.ok) throw new Error(`EDGAR HTTP ${res.status}`);
    const data = await res.json();
    const hits = data.hits?.hits ?? [];

    const trades = hits.slice(0, 20).map((h: any) => {
      const src = h._source ?? {};
      return {
        name: src.display_names?.[0] ?? src.entity_name ?? "U.S. Representative",
        symbol: src.security_title ?? "N/A",
        transactionType: "Purchase",          // PT forms are primarily purchases
        amount: src.period_of_report ?? "",
        filingDate: src.file_date ?? src.period_of_report ?? "",
        transactionDate: src.period_of_report ?? "",
        owner: src.display_names?.[0] ?? "",
        filingUrl: `https://www.sec.gov/Archives/edgar/data/${src.entity_id}/${src.file_num?.replace(/-/g, "") ?? ""}`,
        party: null, // EDGAR PT filings do not include party affiliation
      };
    }).filter((t: any) => t.filingDate);

    if (trades.length > 0) {
      await setCacheData(cacheKey, trades, 21600);
    }
    return trades;
  } catch (error) {
    console.error("Congressional EDGAR Error:", error);
    return [];
  }
}

// ─── Social Sentiment via RSS keyword frequency ────────────────────────────────
// Finnhub social-sentiment is blocked on current plan (403).
// We approximate sentiment by counting matching mentions in financial RSS feeds
// and scoring bullish vs bearish keyword frequency. Honest, observable, free.
export async function getSocialSentiment(symbol: string = "AAPL") {
  const cacheKey = `social-sentiment:rss:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { fetchNews } = await import("./news");
    const articles = await fetchNews();

    const sym = symbol.toUpperCase();
    // Company name aliases for better matching
    const aliases: Record<string, string[]> = {
      AAPL: ["apple", "iphone", "aapl"],
      MSFT: ["microsoft", "msft", "azure", "openai"],
      NVDA: ["nvidia", "nvda", "gpu", "cuda"],
      AMZN: ["amazon", "amzn", "aws"],
      TSLA: ["tesla", "tsla", "elon"],
      META: ["meta", "facebook", "instagram", "whatsapp"],
      GOOGL: ["google", "alphabet", "googl", "youtube"],
      JPM: ["jpmorgan", "chase", "jpm"],
      BAC: ["bank of america", "bac"],
      XOM: ["exxon", "xom", "mobil"],
      WMT: ["walmart", "wmt"],
      JNJ: ["johnson", "jnj"],
      NFLX: ["netflix", "nflx"],
      AMD: ["amd", "advanced micro"],
      GS: ["goldman", "sachs", "gs"]
    };

    const keywords = aliases[sym] ?? [sym.toLowerCase()];
    const bullishWords = ["surge", "rally", "beat", "record", "gain", "bull", "rise", "up", "buy", "growth", "profit", "strong", "upgrade"];
    const bearishWords = ["drop", "fall", "miss", "loss", "bear", "down", "sell", "weak", "cut", "downgrade", "decline", "crash", "fear"];

    const relevant = articles.filter(a => {
      const text = `${a.title} ${a.excerpt}`.toLowerCase();
      return keywords.some(k => text.includes(k));
    });

    let bullishCount = 0, bearishCount = 0;
    for (const a of relevant) {
      const text = `${a.title} ${a.excerpt}`.toLowerCase();
      bullishWords.forEach(w => { if (text.includes(w)) bullishCount++; });
      bearishWords.forEach(w => { if (text.includes(w)) bearishCount++; });
    }

    const total = bullishCount + bearishCount || 1;
    const score = bullishCount / total;

    const result = {
      symbol: sym,
      score,                          // 0..1  (0.5 = neutral)
      mentions: relevant.length,
      bullishCount,
      bearishCount,
      source: "rss-keyword",
      updatedAt: new Date().toISOString()
    };

    await setCacheData(cacheKey, result, 1800);
    return result;
  } catch (error) {
    console.error("Social Sentiment (RSS) Error:", error);
    return null;
  }
}

// ─── News Sentiment via our internal RSS pipeline ──────────────────────────────
// Finnhub news-sentiment is blocked on current plan (403).
// We re-use our fetchNews() RSS pipeline and score articles by keyword frequency
// against bullish/bearish signal words, same approach as getSocialSentiment above.
export async function getNewsSentiment(symbol: string = "AAPL") {
  const cacheKey = `news-sentiment:rss:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const { fetchNews } = await import("./news");
    const articles = await fetchNews();

    const sym = symbol.toUpperCase();
    const companyAliases: Record<string, string[]> = {
      AAPL: ["apple", "aapl"], MSFT: ["microsoft", "msft"], NVDA: ["nvidia", "nvda"],
      AMZN: ["amazon", "amzn"], TSLA: ["tesla", "tsla"], META: ["meta", "facebook"],
      GOOGL: ["google", "alphabet"], JPM: ["jpmorgan", "jpm"], BAC: ["bank of america", "bac"],
      XOM: ["exxon", "xom"], WMT: ["walmart", "wmt"], JNJ: ["johnson", "jnj"],
      NFLX: ["netflix", "nflx"], AMD: ["amd", "advanced micro"], GS: ["goldman", "sachs"]
    };
    const keywords = companyAliases[sym] ?? [sym.toLowerCase()];
    const bullishWords = ["surge", "rally", "beat", "record", "gain", "rise", "buy", "profit", "upgrade", "strong", "optimistic"];
    const bearishWords = ["drop", "fall", "miss", "loss", "down", "sell", "weak", "downgrade", "decline", "risk", "concern", "recession"];

    const relevant = articles.filter(a => {
      const text = `${a.title} ${a.excerpt}`.toLowerCase();
      return keywords.some(k => text.includes(k));
    });

    let bull = 0, bear = 0;
    for (const a of relevant) {
      const text = `${a.title} ${a.excerpt}`.toLowerCase();
      bullishWords.forEach(w => { if (text.includes(w)) bull++; });
      bearishWords.forEach(w => { if (text.includes(w)) bear++; });
    }
    const total = bull + bear || 1;
    const bullishPercent = bull / total;
    // Buzz = ratio of matching articles to total fetched; normalised to 0..1
    const buzz = Math.min(relevant.length / Math.max(articles.length, 1), 1);

    const result = {
      symbol: sym,
      buzz,
      weeklyAvgBuzz: 0.15,            // static industry average proxy
      sentiment: bullishPercent,
      sectorAvgSentiment: 0.52,        // static sector baseline
      articleCount: relevant.length,
      source: "rss-keyword",
      updatedAt: new Date().toISOString()
    };

    await setCacheData(cacheKey, result, 1800);
    return result;
  } catch (error) {
    console.error("News Sentiment (RSS) Error:", error);
    return null;
  }
}

// ─── Company Profile + Logo (Finnhub stock/profile2) ──────────────────────────
// Returns logo URL, company name, exchange, industry, web URL.
// Cached for 24 hours — company profiles rarely change.
export async function getCompanyProfile(symbol: string) {
  if (!FINNHUB_API_KEY) return null;

  const cacheKey = `profile:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ticker) return null;

    const profile = {
      symbol: data.ticker,
      name: data.name,
      logo: data.logo,
      exchange: data.exchange,
      industry: data.finnhubIndustry,
      weburl: data.weburl,
    };
    await setCacheData(cacheKey, profile, 86400);
    return profile;
  } catch (error) {
    console.error(`Company Profile Error (${symbol}):`, error);
    return null;
  }
}

// Bulk-fetch profiles for a list of symbols
export async function getCompanyProfiles(symbols: string[]): Promise<Record<string, any>> {
  const results = await Promise.allSettled(symbols.map(s => getCompanyProfile(s)));
  const map: Record<string, any> = {};
  symbols.forEach((sym, i) => {
    const r = results[i];
    if (r.status === "fulfilled" && r.value) map[sym] = r.value;
  });
  return map;
}

// Technical Pattern Scanner
export async function getTechnicalPatterns(symbol: string = "AAPL") {
  if (!FINNHUB_API_KEY) return [];
  
  const cacheKey = `patterns:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/scan/pattern?symbol=${symbol}&resolution=D&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    const patterns = data.points || [];
    
    await setCacheData(cacheKey, patterns, 3600); // 1 hour cache
    return patterns;
  } catch (error) {
    console.error("Patterns API Error:", error);
    return [];
  }
}

// Caching Helpers
async function getCachedData(key: string) {
  const supabase = createInternalSupabase();
  const { data } = await supabase
    .from("market_data_cache")
    .select("data")
    .eq("cache_key", key)
    .gt("expires_at", new Date().toISOString())
    .single();
    
  return data?.data || null;
}

async function setCacheData(key: string, data: any, ttlSeconds: number) {
  const supabase = createInternalSupabase();
  const expires_at = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  
  await supabase
    .from("market_data_cache")
    .upsert({
      cache_key: key,
      data,
      expires_at
    }, { onConflict: "cache_key" });
}

function createInternalSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll() { return [] }, setAll() {} }
    }
  );
}
