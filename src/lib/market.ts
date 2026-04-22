import { createServerClient } from "@supabase/ssr";

const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

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
  score: number; // 0 to 1
  bullishPercent: number;
  bearishPercent: number;
  buzz: number;
  mentions: number;
}

export async function getMarketPrices(symbols: string[]): Promise<MarketPrice[]> {
  if (!TWELVEDATA_API_KEY) {
    console.warn("TWELVEDATA_API_KEY missing, returning mock data");
    return symbols.map(s => generateMockPrice(s));
  }

  const cacheKey = `prices:${symbols.sort().join(",")}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbols.join(",")}&apikey=${TWELVEDATA_API_KEY}`
    );
    const data = await response.json();

    // TwelveData returns either one object if single symbol, or a map if multiple
    const results: MarketPrice[] = [];
    
    symbols.forEach(symbol => {
      const quote = symbols.length === 1 ? data : data[symbol];
      if (quote && quote.price) {
        results.push({
          symbol,
          price: parseFloat(quote.close || quote.price),
          change: parseFloat(quote.change || "0"),
          changePercent: parseFloat(quote.percent_change || "0"),
          volume: parseInt(quote.volume || "0"),
          high: parseFloat(quote.high || "0"),
          low: parseFloat(quote.low || "0"),
        });
      } else {
        results.push(generateMockPrice(symbol));
      }
    });

    await setCacheData(cacheKey, results, 60); // 60 seconds cache
    return results;
  } catch (error) {
    console.error("TwelveData API Error:", error);
    return symbols.map(s => generateMockPrice(s));
  }
}

/**
 * Fetches historical OHLC data for a symbol. 
 * Used for technical scanning and backtesting.
 */
export async function getMarketHistory(symbol: string, interval: string = "1h", outputsize: number = 72) {
  if (!TWELVEDATA_API_KEY) {
    return generateMockHistory(symbol, outputsize);
  }

  const cacheKey = `history:${symbol}:${interval}:${outputsize}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVEDATA_API_KEY}`
    );
    const data = await response.json();
    
    if (!data.values) {
      console.warn(`No history for ${symbol}, using mock.`);
      return generateMockHistory(symbol, outputsize);
    }

    // Format to consistent OHLC structure
    const history = data.values.map((v: any) => ({
      time: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseInt(v.volume || "0")
    })).reverse(); // Oldest to newest

    await setCacheData(cacheKey, history, 300); // 5 minutes cache
    return history;
  } catch (error) {
    console.error("History API Error:", error);
    return generateMockHistory(symbol, outputsize);
  }
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
    const vixValue = vixSymbols[0]?.price || 15;

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

// Insider Transactions
export async function getInsiderTransactions(symbol: string = "AAPL") {
  if (!FINNHUB_API_KEY) return [];
  
  const cacheKey = `insider:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/insider-transactions?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    const transactions = data.data || [];
    
    await setCacheData(cacheKey, transactions, 3600); // 1 hour cache
    return transactions;
  } catch (error) {
    console.error("Insider API Error:", error);
    return [];
  }
}

// Congressional Trading (US)
export async function getCongressionalTrading() {
  if (!FINNHUB_API_KEY) return [];
  
  const cacheKey = "congress:trades";
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Note: FinnHub uses /stock/congressional-trading
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/congressional-trading?token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    const trades = data.data || [];
    
    await setCacheData(cacheKey, trades, 3600 * 6); // 6 hours cache (less volatile)
    return trades;
  } catch (error) {
    console.error("Congressional API Error:", error);
    return [];
  }
}

// Social Sentiment (Reddit/Twitter)
export async function getSocialSentiment(symbol: string = "AAPL") {
  if (!FINNHUB_API_KEY) return null;
  
  const cacheKey = `social-sentiment:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    // Aggregating reddit/twitter sentiment
    const reddit = data.reddit || [];
    const twitter = data.twitter || [];
    
    const combined = [...reddit, ...twitter];
    if (combined.length === 0) return null;

    const avgSentiment = combined.reduce((acc, curr) => acc + (curr.sentiment || 0), 0) / combined.length;
    const result = {
      symbol,
      score: (avgSentiment + 1) / 2, // Convert -1..1 to 0..1
      mentions: combined.reduce((acc, curr) => acc + (curr.mention || 0), 0),
      redditCount: reddit.length,
      twitterCount: twitter.length,
      updatedAt: new Date().toISOString()
    };

    await setCacheData(cacheKey, result, 1800); // 30 mins cache
    return result;
  } catch (error) {
    console.error("Social Sentiment API Error:", error);
    return null;
  }
}

// News Sentiment
export async function getNewsSentiment(symbol: string = "AAPL") {
  if (!FINNHUB_API_KEY) return null;
  
  const cacheKey = `news-sentiment:${symbol}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    const result = {
      symbol,
      buzz: data.buzz?.buzz || 0,
      weeklyAvgBuzz: data.buzz?.weeklyAverage || 0,
      sentiment: data.sentiment?.bullishPercent || 0.5,
      sectorAvgSentiment: data.sectorAverageBullishPercent || 0.5,
      updatedAt: new Date().toISOString()
    };

    await setCacheData(cacheKey, result, 1800); // 30 mins cache
    return result;
  } catch (error) {
    console.error("News Sentiment API Error:", error);
    return null;
  }
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

function generateMockPrice(symbol: string): MarketPrice {
  const base = symbol.includes("USD") ? 1.2 : symbol.includes("BTC") ? 65000 : 150;
  const change = (Math.random() - 0.5) * 2;
  return {
    symbol,
    price: base + (Math.random() * 5),
    change,
    changePercent: (change / base) * 100,
    volume: Math.floor(Math.random() * 1000000),
    sparkline: Array.from({ length: 20 }, () => Math.random() * 100)
  };
}

function generateMockHistory(symbol: string, size: number) {
  const base = symbol.includes("USD") ? 1.2 : symbol.includes("BTC") ? 65000 : 150;
  let lastClose = base;
  
  return Array.from({ length: size }).map((_, i) => {
    const open = lastClose;
    const high = open + (Math.random() * 0.02 * base);
    const low = open - (Math.random() * 0.02 * base);
    const close = low + (Math.random() * (high - low));
    lastClose = close;
    
    return {
      time: new Date(Date.now() - (size - i) * 3600000).toISOString(),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000)
    };
  });
}
