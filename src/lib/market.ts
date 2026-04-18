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
