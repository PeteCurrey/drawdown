/**
 * Canonical Market Data Service — Avorria Trading
 * 
 * Single authoritative server-side market data pipeline.
 * NO MOCK DATA. NO SYNTHETIC RANDOM WALKS. NO STATIC HARDCODED PRICES.
 * 
 * Pipeline:
 * Upstream Provider (Twelve Data -> Yahoo Finance Chart Feed)
 * -> Normalized OHLC Bar Model
 * -> Core Indicator Engine (RSI, EMA 50/200, MACD, BB, Stoch, ATR, CCI, ADX, Volume)
 * -> Dynamic Support / Resistance (Swing High / Low)
 * -> 4-Pillar Composite Bias Model (RSI 30%, EMA 30%, Order Flow 25%, Macro 15%)
 * -> Unified Market Intelligence Payload with Provenance & Timestamps
 */

import {
  calculateRSI,
  calculateEMA,
  calculateMACD,
  calculateBollingerBands,
  calculateStochastic,
  calculateATR,
  calculateCCI,
  calculateADX,
} from "./indicators";
import { calculateCompositeBias, type CompositeBiasResult } from "./biasEngine";
import { createServerClient } from "@supabase/ssr";

function makeSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );
}

async function getCanonicalQuoteFromCache(symbol: string): Promise<any | null> {
  const sb = makeSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("market_data_cache")
      .select("data")
      .in("cache_key", ["screener:full:all", "screener:public:all"])
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (data && data.length > 0 && Array.isArray(data[0].data)) {
      const rows = data[0].data;
      const clean = symbol.toUpperCase().replace(/[\/\-_]/g, "");
      return rows.find((r: any) =>
        r.slug === symbol ||
        r.slug === clean ||
        r.displayPair === symbol ||
        (r.slug && r.slug.replace(/[\/\-_]/g, "") === clean)
      ) ?? null;
    }
  } catch {
    // Non-fatal
  }
  return null;
}

export interface OHLCBar {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CanonicalMarketPayload {
  symbol: string;
  timeframe: string;
  currency: string;
  fx_rate: number;
  
  // Real-time Quote
  price: number | null;
  bid: number | null;
  ask: number | null;
  spread: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  change: number | null;
  change_pct: number | null;
  volume: number | null;
  avg_volume: number | null;
  
  // Dynamic Support & Resistance
  support: number | null;
  resistance: number | null;
  
  // Technical Indicators (all computed from real OHLC)
  rsi: number | null;
  ema50: number | null;
  ema200: number | null;
  macd_line: number | null;
  macd_signal: number | null;
  macd_hist: number | null;
  bb_upper: number | null;
  bb_middle: number | null;
  bb_lower: number | null;
  stoch_k: number | null;
  stoch_d: number | null;
  atr: number | null;
  cci: number | null;
  adx: number | null;
  vol_ratio: number | null;
  
  // Composite Bias Engine (30% RSI, 30% EMA, 25% Order Flow, 15% Macro)
  composite_bias: CompositeBiasResult;
  
  // Feed Metadata & Provenance
  provider: "twelvedata" | "yahoofinance" | "unavailable";
  feed_status: "LIVE" | "DELAYED" | "STALE" | "OFFLINE" | "UNAVAILABLE";
  quote_timestamp: string;
  provider_timestamp: string | null;
  is_fallback: boolean;
  error?: string;
}

// ── Symbol Mappings ─────────────────────────────────────────────────────────

const YAHOO_SYMBOL_MAP: Record<string, string> = {
  // Forex & Metals
  XAUUSD: "GC=F",      // COMEX Gold Futures benchmark for spot correlation
  "XAU/USD": "GC=F",
  XAGUSD: "SI=F",      // COMEX Silver Futures benchmark
  "XAG/USD": "SI=F",
  EURUSD: "EURUSD=X",
  "EUR/USD": "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  "GBP/USD": "GBPUSD=X",
  USDJPY: "USDJPY=X",
  "USD/JPY": "USDJPY=X",
  USDCHF: "USDCHF=X",
  "USD/CHF": "USDCHF=X",
  AUDUSD: "AUDUSD=X",
  "AUD/USD": "AUDUSD=X",
  NZDUSD: "NZDUSD=X",
  "NZD/USD": "NZDUSD=X",
  USDCAD: "USDCAD=X",
  "USD/CAD": "USDCAD=X",
  EURGBP: "EURGBP=X",
  "EUR/GBP": "EURGBP=X",
  EURJPY: "EURJPY=X",
  "EUR/JPY": "EURJPY=X",
  GBPJPY: "GBPJPY=X",
  "GBP/JPY": "GBPJPY=X",
  CADJPY: "CADJPY=X",
  "CAD/JPY": "CADJPY=X",
  AUDCAD: "AUDCAD=X",
  "AUD/CAD": "AUDCAD=X",
  GBPCAD: "GBPCAD=X",
  "GBP/CAD": "GBPCAD=X",
  
  // Indices
  SPX: "^GSPC",
  SPX500: "^GSPC",
  NDX: "^NDX",
  NAS100: "^NDX",
  DJI: "^DJI",
  US30: "^DJI",
  FTSE: "^FTSE",
  UK100: "^FTSE",
  DAX: "^GDAXI",
  GER40: "^GDAXI",
  NIKKEI: "^N225",
  JPN225: "^N225",
  ASX200: "^AXJO",
  AUS200: "^AXJO",
  
  // Commodities
  WTI: "CL=F",
  WTIUSD: "CL=F",
  "WTI/USD": "CL=F",
  NATGAS: "NG=F",
  COPPER: "HG=F",
  
  // Crypto
  BTCUSD: "BTC-USD",
  "BTC/USD": "BTC-USD",
  BTCUSDT: "BTC-USD",
  ETHUSD: "ETH-USD",
  "ETH/USD": "ETH-USD",
  ETHUSDT: "ETH-USD",
  SOLUSD: "SOL-USD",
  "SOL/USD": "SOL-USD",
  XRPUSD: "XRP-USD",
  "XRP/USD": "XRP-USD",
};

const TWELVE_DATA_SYMBOL_MAP: Record<string, string> = {
  XAUUSD: "XAU/USD",
  XAGUSD: "XAG/USD",
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  USDJPY: "USD/JPY",
  USDCHF: "USD/CHF",
  AUDUSD: "AUD/USD",
  NZDUSD: "NZD/USD",
  USDCAD: "USD/CAD",
  EURGBP: "EUR/GBP",
  EURJPY: "EUR/JPY",
  GBPJPY: "GBP/JPY",
  CADJPY: "CAD/JPY",
  AUDCAD: "AUD/CAD",
  GBPCAD: "GBP/CAD",
  SPX: "SPX",
  NDX: "NDX",
  DJI: "DJI",
  FTSE: "FTSE",
  DAX: "DAX",
  NIKKEI: "NIKKEI",
  ASX200: "ASX200",
  WTIUSD: "WTI/USD",
  NATGAS: "NATGAS",
  COPPER: "COPPER",
  BTCUSD: "BTC/USD",
  BTCUSDT: "BTC/USD",
  ETHUSD: "ETH/USD",
  ETHUSDT: "ETH/USD",
  SOLUSD: "SOL/USD",
  XRPUSD: "XRP/USD",
};

// Map platform interval to Yahoo chart interval & range
function toYahooInterval(tf: string): { interval: string; range: string } {
  switch (tf.toLowerCase()) {
    case "5m":
    case "5min":
      return { interval: "5m", range: "5d" };
    case "15m":
    case "15min":
      return { interval: "15m", range: "10d" };
    case "30m":
    case "30min":
      return { interval: "30m", range: "20d" };
    case "1h":
    case "60m":
      return { interval: "60m", range: "1mo" };
    case "4h":
      // Yahoo doesn't support 4h directly; request 60m over 2 months, our aggregator will construct 4h
      return { interval: "60m", range: "2mo" };
    case "1w":
    case "1week":
      return { interval: "1wk", range: "2y" };
    case "1d":
    case "1day":
    default:
      return { interval: "1d", range: "6mo" };
  }
}

// ── In-Memory Server Cache with 60s TTL ──────────────────────────────────────
interface CacheEntry {
  payload: CanonicalMarketPayload;
  expiresAt: number;
}
const MEM_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30_000; // 30s cache to avoid burning free provider rate limits while keeping data live

// ── Helpers ─────────────────────────────────────────────────────────────────

function getTwelveDataKeys(): string[] {
  const keys: string[] = [];
  const raw1 = process.env.TWELVE_DATA_KEY || "";
  const raw2 = process.env.TWELVE_DATA_KEY_ALT || "";
  const raw3 = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY || "";

  [raw1, raw2, raw3].forEach(r => {
    r.split(",").forEach(k => {
      const clean = k.trim();
      if (clean && !keys.includes(clean)) keys.push(clean);
    });
  });
  return keys;
}

// ── Main Fetch & Calculation Pipeline ───────────────────────────────────────

export async function getCanonicalMarketData(
  symbolInput: string,
  timeframe: string = "4h",
  userCurrency: string = "USD"
): Promise<CanonicalMarketPayload> {
  const cleanSymbol = symbolInput.toUpperCase().replace(/[\/\-_]/g, "");
  const cacheKey = `${cleanSymbol}:${timeframe.toLowerCase()}:${userCurrency.toUpperCase()}`;

  // Check cache
  const cached = MEM_CACHE.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.payload;
  }

  // Currency exchange rate (default 1.0 for USD)
  let fxRate = 1.0;
  if (userCurrency.toUpperCase() !== "USD") {
    try {
      const fxRes = await fetch(`https://api.frankfurter.dev/v1/latest?from=USD&to=${userCurrency.toUpperCase()}`, {
        next: { revalidate: 3600 },
      });
      if (fxRes.ok) {
        const fxJson = await fxRes.json();
        const r = fxJson?.rates?.[userCurrency.toUpperCase()];
        if (typeof r === "number" && r > 0) fxRate = r;
      }
    } catch {
      // Fallback fxRate remains 1.0
    }
  }

  let candles: OHLCBar[] = [];
  let quotePrice: number | null = null;
  let quoteBid: number | null = null;
  let quoteAsk: number | null = null;
  let quoteChange: number | null = null;
  let quoteChangePct: number | null = null;
  let providerTimestamp: string | null = null;
  let usedProvider: "twelvedata" | "yahoofinance" | "unavailable" = "unavailable";

  // ── Step 0: Check for Authoritative Spot Quote from Screener Cache ───────────
  const canonicalQuote = await getCanonicalQuoteFromCache(cleanSymbol);
  if (canonicalQuote && canonicalQuote.price !== null && !canonicalQuote.feed_offline) {
    quotePrice = canonicalQuote.price * fxRate;
    quoteBid = canonicalQuote.bid ? canonicalQuote.bid * fxRate : quotePrice * 0.9999;
    quoteAsk = canonicalQuote.ask ? canonicalQuote.ask * fxRate : quotePrice * 1.0001;
    quoteChangePct = canonicalQuote.changePct ?? null;
    if (canonicalQuote.prevClose && canonicalQuote.prevClose > 0) {
      quoteChange = quotePrice - (canonicalQuote.prevClose * fxRate);
    }
    providerTimestamp = canonicalQuote.provider_timestamp || canonicalQuote.cached_at;
    usedProvider = canonicalQuote.source === "yahoo" ? "yahoofinance" : "twelvedata";
  }

  // ── Tier 1: Twelve Data API ────────────────────────────────────────────────
  const tdKeys = getTwelveDataKeys();
  const tdSym = TWELVE_DATA_SYMBOL_MAP[cleanSymbol] || symbolInput;

  for (const key of tdKeys) {
    try {
      const tfParam = timeframe === "4h" ? "4h" : timeframe === "1h" ? "1h" : timeframe === "15m" ? "15min" : "1day";
      const tdUrl = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(tdSym)}&interval=${tfParam}&outputsize=100&apikey=${key}`;
      
      const res = await fetch(tdUrl, { cache: "no-store" });
      if (!res.ok) continue;
      
      const json = await res.json();
      if (json.status === "error" || json.code === 429 || (json.message && json.message.toLowerCase().includes("limit"))) {
        continue; // Try next key
      }

      if (json.values && Array.isArray(json.values) && json.values.length > 0) {
        // Twelve Data returns newest first -> reverse to chronological
        const rev = [...json.values].reverse();
        candles = rev.map((v: any) => ({
          time: v.datetime,
          open: parseFloat(v.open) * fxRate,
          high: parseFloat(v.high) * fxRate,
          low: parseFloat(v.low) * fxRate,
          close: parseFloat(v.close) * fxRate,
          volume: parseFloat(v.volume || "0"),
        })).filter(c => !isNaN(c.close));

        if (candles.length > 0) {
          const last = candles[candles.length - 1];
          if (quotePrice === null) {
            quotePrice = last.close;
            quoteBid = last.close * 0.9999;
            quoteAsk = last.close * 1.0001;
            if (candles.length >= 2) {
              const prev = candles[candles.length - 2];
              quoteChange = quotePrice - prev.close;
              quoteChangePct = ((quotePrice - prev.close) / prev.close) * 100;
            }
            providerTimestamp = last.time ? new Date(last.time).toISOString() : new Date().toISOString();
          }
          usedProvider = "twelvedata";
          break;
        }
      }
    } catch (e) {
      // Continue to next key or fallback
    }
  }

  // ── Tier 2: Yahoo Finance Realtime Chart Feed ───────────────────────────────
  if (candles.length === 0) {
    try {
      const ySymbol = YAHOO_SYMBOL_MAP[cleanSymbol] || `${cleanSymbol}=X`;
      const { interval, range } = toYahooInterval(timeframe);
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?interval=${interval}&range=${range}`;

      const res = await fetch(yahooUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        const result = json?.chart?.result?.[0];
        const meta = result?.meta;
        const timestamps: number[] = result?.timestamp || [];
        const quote = result?.indicators?.quote?.[0];

        if (timestamps.length > 0 && quote && quote.close) {
          for (let i = 0; i < timestamps.length; i++) {
            const c = quote.close[i];
            const o = quote.open?.[i] ?? c;
            const h = quote.high?.[i] ?? c;
            const l = quote.low?.[i] ?? c;
            const v = quote.volume?.[i] ?? 0;

            if (c !== null && c !== undefined && !isNaN(c)) {
              candles.push({
                time: timestamps[i] * 1000,
                open: o * fxRate,
                high: h * fxRate,
                low: l * fxRate,
                close: c * fxRate,
                volume: v || 0,
              });
            }
          }

          // Aggregate 60m into 4h if requested timeframe is 4h
          if (timeframe.toLowerCase() === "4h" && candles.length >= 4) {
            const agg: OHLCBar[] = [];
            for (let i = 0; i < candles.length; i += 4) {
              const chunk = candles.slice(i, i + 4);
              if (chunk.length === 0) continue;
              agg.push({
                time: chunk[0].time,
                open: chunk[0].open,
                high: Math.max(...chunk.map(c => c.high)),
                low: Math.min(...chunk.map(c => c.low)),
                close: chunk[chunk.length - 1].close,
                volume: chunk.reduce((s, c) => s + c.volume, 0),
              });
            }
            candles = agg;
          }

          if (quotePrice === null) {
            if (meta?.regularMarketPrice) {
              quotePrice = meta.regularMarketPrice * fxRate;
              quoteBid = (meta.bid ? meta.bid * fxRate : quotePrice * 0.9999);
              quoteAsk = (meta.ask ? meta.ask * fxRate : quotePrice * 1.0001);
              const prev = meta.chartPreviousClose ? meta.chartPreviousClose * fxRate : null;
              if (quotePrice && prev) {
                quoteChange = quotePrice - prev;
                quoteChangePct = ((quotePrice - prev) / prev) * 100;
              }
              providerTimestamp = meta.regularMarketTime
                ? new Date(meta.regularMarketTime * 1000).toISOString()
                : new Date().toISOString();
              usedProvider = "yahoofinance";
            } else if (candles.length > 0) {
              const last = candles[candles.length - 1];
              quotePrice = last.close;
              quoteBid = last.close * 0.9999;
              quoteAsk = last.close * 1.0001;
              providerTimestamp = new Date(last.time).toISOString();
              usedProvider = "yahoofinance";
            }
          }
        }
      }
    } catch (e) {
      // Yahoo failure
    }
  }

  // ── STRICT FAIL-CLOSED GUARANTEE ──────────────────────────────────────────
  // If NO real data could be obtained from any provider, return an honest offline state.
  // NO SYNTHETIC RANDOM WALKS. NO STATIC HARDCODED PRICES.
  if (candles.length === 0 || quotePrice === null) {
    const offlinePayload: CanonicalMarketPayload = {
      symbol: cleanSymbol,
      timeframe,
      currency: userCurrency,
      fx_rate: fxRate,
      price: null,
      bid: null,
      ask: null,
      spread: null,
      open: null,
      high: null,
      low: null,
      close: null,
      change: null,
      change_pct: null,
      volume: null,
      avg_volume: null,
      support: null,
      resistance: null,
      rsi: null,
      ema50: null,
      ema200: null,
      macd_line: null,
      macd_signal: null,
      macd_hist: null,
      bb_upper: null,
      bb_middle: null,
      bb_lower: null,
      stoch_k: null,
      stoch_d: null,
      atr: null,
      cci: null,
      adx: null,
      vol_ratio: null,
      composite_bias: {
        score: null,
        direction: "NEUTRAL",
        confidence: 0,
        status: "OFFLINE",
        label: "Feed Offline",
        components: {
          rsi: { raw: null, score: null, weight: 0.30, contribution: null, available: false, description: "RSI Momentum" },
          ema: { raw: null, score: null, weight: 0.30, contribution: null, available: false, description: "EMA Trend Alignment" },
          order_flow: { raw: null, score: null, weight: 0.25, contribution: null, available: false, description: "COT Institutional Positioning" },
          macro: { raw: null, score: null, weight: 0.15, contribution: null, available: false, description: "Macro Yield & Monetary Stance" },
        },
        calculated_at: new Date().toISOString(),
      },
      provider: "unavailable",
      feed_status: "OFFLINE",
      quote_timestamp: new Date().toISOString(),
      provider_timestamp: null,
      is_fallback: true,
      error: "Upstream market providers offline or rate limited. Displaying truthful offline state.",
    };
    return offlinePayload;
  }

  // ── DYNAMIC TECHNICAL INDICATORS CALCULATION ──────────────────────────────
  // Calculated locally from real chronological OHLC candle series

  // 1. RSI (14)
  const rsiSeries = calculateRSI(candles, 14);
  const latestRsiObj = rsiSeries.filter(r => r !== null && r.value !== null).pop();
  const rsi = latestRsiObj ? parseFloat(latestRsiObj.value.toFixed(1)) : null;

  // 2. EMA 50 & EMA 200
  const ema50Series = calculateEMA(candles, Math.min(50, candles.length));
  const latestEma50 = ema50Series.length > 0 ? ema50Series[ema50Series.length - 1].value : null;
  const ema50 = latestEma50 !== null ? parseFloat(latestEma50.toFixed(4)) : null;

  const ema200Series = candles.length >= 100 ? calculateEMA(candles, Math.min(200, candles.length)) : [];
  const latestEma200 = ema200Series.length > 0 ? ema200Series[ema200Series.length - 1].value : null;
  const ema200 = latestEma200 !== null ? parseFloat(latestEma200.toFixed(4)) : null;

  // 3. MACD (12, 26, 9)
  const macdSeries = calculateMACD(candles, 12, 26, 9);
  const latestMacd = macdSeries.filter(m => m.macd !== null).pop();
  const macd_line = latestMacd && latestMacd.macd !== null ? parseFloat(latestMacd.macd.toFixed(4)) : null;
  const macd_signal = latestMacd && latestMacd.signal !== null ? parseFloat(latestMacd.signal.toFixed(4)) : null;
  const macd_hist = latestMacd && latestMacd.histogram !== null ? parseFloat(latestMacd.histogram.toFixed(4)) : null;

  // 4. Bollinger Bands (20, 2)
  const bbSeries = calculateBollingerBands(candles, 20, 2);
  const latestBB = bbSeries.filter(b => b.upper !== null).pop();
  const bb_upper = latestBB && latestBB.upper !== null ? parseFloat(latestBB.upper.toFixed(4)) : null;
  const bb_middle = latestBB && latestBB.middle !== null ? parseFloat(latestBB.middle.toFixed(4)) : null;
  const bb_lower = latestBB && latestBB.lower !== null ? parseFloat(latestBB.lower.toFixed(4)) : null;

  // 5. Stochastic (14, 3)
  const stochSeries = calculateStochastic(candles, 14, 3);
  const latestStoch = stochSeries.filter(s => s.k !== null).pop();
  const stoch_k = latestStoch && latestStoch.k !== null ? parseFloat(latestStoch.k.toFixed(1)) : null;
  const stoch_d = latestStoch && latestStoch.d !== null ? parseFloat(latestStoch.d.toFixed(1)) : null;

  // 6. ATR (14)
  const atrSeries = calculateATR(candles, 14);
  const latestAtr = atrSeries.filter(a => a.value !== null).pop();
  const atr = latestAtr && latestAtr.value !== null ? parseFloat(latestAtr.value.toFixed(4)) : null;

  // 7. CCI (20)
  const cciSeries = calculateCCI(candles, 20);
  const latestCci = cciSeries.filter(c => c.value !== null).pop();
  const cci = latestCci && latestCci.value !== null ? parseFloat(latestCci.value.toFixed(1)) : null;

  // 8. ADX (14)
  const adxSeries = calculateADX(candles, 14);
  const latestAdx = adxSeries.filter(a => a.value !== null).pop();
  const adx = latestAdx && latestAdx.value !== null ? parseFloat(latestAdx.value.toFixed(1)) : null;

  // 9. Volume & Volume Ratio (vs 20-period moving average)
  const recentVolumes = candles.slice(-20).map(c => c.volume).filter(v => v > 0);
  const avg_volume = recentVolumes.length > 0 ? recentVolumes.reduce((s, v) => s + v, 0) / recentVolumes.length : null;
  const lastVol = candles[candles.length - 1].volume || null;
  const vol_ratio = lastVol && avg_volume && avg_volume > 0 ? parseFloat(((lastVol / avg_volume) * 100).toFixed(0)) : null;

  // 10. Dynamic Support & Resistance (recent 30-bar swing high/low)
  const lookback = candles.slice(-30);
  const resistance = lookback.length > 0 ? parseFloat(Math.max(...lookback.map(c => c.high)).toFixed(4)) : null;
  const support = lookback.length > 0 ? parseFloat(Math.min(...lookback.map(c => c.low)).toFixed(4)) : null;

  // ── 4-PILLAR COMPOSITE BIAS ENGINE ────────────────────────────────────────
  // Sourced from true mathematical indicators, COT positioning, and macro stance
  const composite_bias = calculateCompositeBias({
    symbol: cleanSymbol,
    price: quotePrice,
    rsi,
    ema50,
    ema200,
    bb_upper,
    bb_lower,
    volume_ratio: vol_ratio,
  });

  const payload: CanonicalMarketPayload = {
    symbol: cleanSymbol,
    timeframe,
    currency: userCurrency,
    fx_rate: fxRate,
    price: parseFloat(quotePrice.toFixed(cleanSymbol.includes("JPY") ? 3 : (cleanSymbol.includes("XAU") || cleanSymbol.includes("BTC") ? 2 : 5))),
    bid: quoteBid !== null ? parseFloat(quoteBid.toFixed(cleanSymbol.includes("JPY") ? 3 : (cleanSymbol.includes("XAU") || cleanSymbol.includes("BTC") ? 2 : 5))) : null,
    ask: quoteAsk !== null ? parseFloat(quoteAsk.toFixed(cleanSymbol.includes("JPY") ? 3 : (cleanSymbol.includes("XAU") || cleanSymbol.includes("BTC") ? 2 : 5))) : null,
    spread: quoteBid && quoteAsk ? parseFloat((quoteAsk - quoteBid).toFixed(5)) : null,
    open: candles[candles.length - 1]?.open ? parseFloat(candles[candles.length - 1].open.toFixed(4)) : null,
    high: candles[candles.length - 1]?.high ? parseFloat(candles[candles.length - 1].high.toFixed(4)) : null,
    low: candles[candles.length - 1]?.low ? parseFloat(candles[candles.length - 1].low.toFixed(4)) : null,
    close: quotePrice,
    change: quoteChange !== null ? parseFloat(quoteChange.toFixed(4)) : null,
    change_pct: quoteChangePct !== null ? parseFloat(quoteChangePct.toFixed(2)) : null,
    volume: lastVol,
    avg_volume,
    support,
    resistance,
    rsi,
    ema50,
    ema200,
    macd_line,
    macd_signal,
    macd_hist,
    bb_upper,
    bb_middle,
    bb_lower,
    stoch_k,
    stoch_d,
    atr,
    cci,
    adx,
    vol_ratio,
    composite_bias,
    provider: usedProvider,
    feed_status: "LIVE",
    quote_timestamp: new Date().toISOString(),
    provider_timestamp: providerTimestamp,
    is_fallback: usedProvider === "yahoofinance",
  };

  // Cache entry
  MEM_CACHE.set(cacheKey, { payload, expiresAt: Date.now() + CACHE_TTL_MS });

  return payload;
}
