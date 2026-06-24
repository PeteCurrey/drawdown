/**
 * /api/market-data/[symbol]/route.ts
 *
 * Implements robust key rotation across multiple Twelve Data API keys.
 * If all keys fail or run out of credits, falls back to a high-fidelity
 * dynamic simulator to prevent the dashboard overview from showing blank dashes.
 */

import { NextResponse } from "next/server";
import { tdSymbol } from "@/lib/instruments";
import { calculateBiasScore } from "@/lib/biasEngine";

export const dynamic = "force-dynamic";

const TD = "https://api.twelvedata.com";

function pf(v: any): number | null {
  const n = parseFloat(v);
  return isNaN(n) || !isFinite(n) ? null : n;
}

// Baseline technical data for all 28 supported instruments
const BASELINES: Record<string, {
  price: number;
  decimals: number;
  rsi: number;
  ema50: number;
  ema200: number;
  macdLine: number;
  macdSignal: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  stochK: number;
  stochD: number;
  atrCurrent: number;
  cci: number;
  support: number;
  resistance: number;
  volume: number;
  avgVolume: number;
}> = {
  XAUUSD: { price: 2350.8, decimals: 2, rsi: 58.2, ema50: 2330.5, ema200: 2280.2, macdLine: 12.5, macdSignal: 10.2, bbUpper: 2380.0, bbMiddle: 2345.0, bbLower: 2310.0, stochK: 70, stochD: 65, atrCurrent: 24.5, cci: 110, support: 2315.0, resistance: 2388.0, volume: 45000, avgVolume: 42000 },
  XAGUSD: { price: 29.50, decimals: 3, rsi: 54.5, ema50: 29.10, ema200: 27.80, macdLine: 0.25, macdSignal: 0.20, bbUpper: 30.50, bbMiddle: 29.30, bbLower: 28.10, stochK: 62, stochD: 58, atrCurrent: 0.45, cci: 75, support: 28.00, resistance: 30.80, volume: 15000, avgVolume: 14200 },
  GBPUSD: { price: 1.2734, decimals: 5, rsi: 52.4, ema50: 1.2710, ema200: 1.2650, macdLine: 0.0012, macdSignal: 0.0010, bbUpper: 1.2810, bbMiddle: 1.2725, bbLower: 1.2640, stochK: 65, stochD: 60, atrCurrent: 0.0075, cci: 85, support: 1.2610, resistance: 1.2840, volume: 120000, avgVolume: 115000 },
  EURUSD: { price: 1.0850, decimals: 5, rsi: 48.5, ema50: 1.0870, ema200: 1.0820, macdLine: -0.0005, macdSignal: -0.0002, bbUpper: 1.0930, bbMiddle: 1.0860, bbLower: 1.0790, stochK: 45, stochD: 48, atrCurrent: 0.0062, cci: -40, support: 1.0780, resistance: 1.0920, volume: 140000, avgVolume: 138000 },
  USDJPY: { price: 157.20, decimals: 3, rsi: 63.8, ema50: 155.80, ema200: 152.40, macdLine: 0.85, macdSignal: 0.72, bbUpper: 158.40, bbMiddle: 156.50, bbLower: 154.60, stochK: 78, stochD: 72, atrCurrent: 1.15, cci: 130, support: 153.80, resistance: 158.20, volume: 95000, avgVolume: 98000 },
  USDCHF: { price: 0.8950, decimals: 5, rsi: 46.5, ema50: 0.8980, ema200: 0.9020, macdLine: -0.0015, macdSignal: -0.0010, bbUpper: 0.9060, bbMiddle: 0.8970, bbLower: 0.8880, stochK: 38, stochD: 42, atrCurrent: 0.0055, cci: -70, support: 0.8850, resistance: 0.9080, volume: 65000, avgVolume: 68000 },
  AUDUSD: { price: 0.6650, decimals: 5, rsi: 51.5, ema50: 0.6620, ema200: 0.6580, macdLine: 0.0008, macdSignal: 0.0006, bbUpper: 0.6720, bbMiddle: 0.6645, bbLower: 0.6570, stochK: 58, stochD: 55, atrCurrent: 0.0058, cci: 45, support: 0.6550, resistance: 0.6750, volume: 85000, avgVolume: 82000 },
  NZDUSD: { price: 0.6120, decimals: 5, rsi: 53.2, ema50: 0.6080, ema200: 0.6020, macdLine: 0.0010, macdSignal: 0.0008, bbUpper: 0.6190, bbMiddle: 0.6110, bbLower: 0.6030, stochK: 64, stochD: 60, atrCurrent: 0.0052, cci: 70, support: 0.6000, resistance: 0.6220, volume: 55000, avgVolume: 52000 },
  USDCAD: { price: 1.3680, decimals: 5, rsi: 47.8, ema50: 1.3710, ema200: 1.3640, macdLine: -0.0005, macdSignal: -0.0002, bbUpper: 1.3780, bbMiddle: 1.3690, bbLower: 1.3600, stochK: 42, stochD: 45, atrCurrent: 0.0068, cci: -35, support: 1.3580, resistance: 1.3780, volume: 78000, avgVolume: 75000 },
  EURGBP: { price: 0.8520, decimals: 5, rsi: 45.4, ema50: 0.8550, ema200: 0.8580, macdLine: -0.0008, macdSignal: -0.0005, bbUpper: 0.8600, bbMiddle: 0.8540, bbLower: 0.8480, stochK: 35, stochD: 38, atrCurrent: 0.0035, cci: -80, support: 0.8450, resistance: 0.8620, volume: 92000, avgVolume: 95000 },
  EURJPY: { price: 170.50, decimals: 3, rsi: 62.4, ema50: 168.80, ema200: 164.50, macdLine: 0.95, macdSignal: 0.80, bbUpper: 172.00, bbMiddle: 169.80, bbLower: 167.60, stochK: 75, stochD: 70, atrCurrent: 1.25, cci: 120, support: 166.50, resistance: 171.80, volume: 88000, avgVolume: 85000 },
  GBPJPY: { price: 200.15, decimals: 3, rsi: 65.4, ema50: 197.80, ema200: 192.50, macdLine: 1.45, macdSignal: 1.20, bbUpper: 201.80, bbMiddle: 199.10, bbLower: 196.40, stochK: 82, stochD: 78, atrCurrent: 1.55, cci: 145, support: 195.50, resistance: 202.00, volume: 82000, avgVolume: 80000 },
  CADJPY: { price: 114.80, decimals: 3, rsi: 58.6, ema50: 113.80, ema200: 111.50, macdLine: 0.55, macdSignal: 0.45, bbUpper: 116.00, bbMiddle: 114.30, bbLower: 112.60, stochK: 68, stochD: 64, atrCurrent: 0.95, cci: 85, support: 112.00, resistance: 115.80, volume: 48000, avgVolume: 45000 },
  AUDCAD: { price: 0.9100, decimals: 5, rsi: 52.8, ema50: 0.9070, ema200: 0.8980, macdLine: 0.0012, macdSignal: 0.0009, bbUpper: 0.9180, bbMiddle: 0.9090, bbLower: 0.9000, stochK: 60, stochD: 56, atrCurrent: 0.0062, cci: 55, support: 0.8950, resistance: 0.9220, volume: 38000, avgVolume: 40000 },
  GBPCAD: { price: 1.7350, decimals: 5, rsi: 54.2, ema50: 1.7280, ema200: 1.7120, macdLine: 0.0025, macdSignal: 0.0018, bbUpper: 1.7480, bbMiddle: 1.7330, bbLower: 1.7180, stochK: 65, stochD: 60, atrCurrent: 0.0092, cci: 75, support: 1.7050, resistance: 1.7520, volume: 42000, avgVolume: 45000 },
  SPX: { price: 5345.5, decimals: 2, rsi: 59.1, ema50: 5240.2, ema200: 5080.5, macdLine: 24.5, macdSignal: 20.2, bbUpper: 5420.0, bbMiddle: 5315.0, bbLower: 5210.0, stochK: 74, stochD: 70, atrCurrent: 38.5, cci: 115, support: 5180.0, resistance: 5385.0, volume: 1800000, avgVolume: 1850000 },
  NDX: { price: 18650.0, decimals: 2, rsi: 61.4, ema50: 18120.0, ema200: 17450.0, macdLine: 112.0, macdSignal: 95.0, bbUpper: 18950.0, bbMiddle: 18400.0, bbLower: 17850.0, stochK: 76, stochD: 72, atrCurrent: 185.0, cci: 125, support: 17750.0, resistance: 18880.0, volume: 2500000, avgVolume: 2450000 },
  DJI: { price: 39120.0, decimals: 2, rsi: 51.2, ema50: 38950.0, ema200: 38150.0, macdLine: 45.0, macdSignal: 52.0, bbUpper: 39600.0, bbMiddle: 39050.0, bbLower: 38500.0, stochK: 52, stochD: 55, atrCurrent: 280.0, cci: 15, support: 38200.0, resistance: 39550.0, volume: 1200000, avgVolume: 1250000 },
  FTSE: { price: 8245.0, decimals: 2, rsi: 48.2, ema50: 8280.0, ema200: 8080.0, macdLine: -5.0, macdSignal: 3.0, bbUpper: 8420.0, bbMiddle: 8285.0, bbLower: 8150.0, stochK: 44, stochD: 48, atrCurrent: 65.0, cci: -30, support: 8110.0, resistance: 8390.0, volume: 750000, avgVolume: 780000 },
  DAX: { price: 18180.0, decimals: 2, rsi: 49.8, ema50: 18220.0, ema200: 17650.0, macdLine: 12.0, macdSignal: 18.0, bbUpper: 18650.0, bbMiddle: 18285.0, bbLower: 17920.0, stochK: 48, stochD: 50, atrCurrent: 145.0, cci: -5, support: 17800.0, resistance: 18580.0, volume: 620000, avgVolume: 650000 },
  NIKKEI: { price: 38850.0, decimals: 2, rsi: 53.6, ema50: 38500.0, ema200: 37200.0, macdLine: 145.0, macdSignal: 120.0, bbUpper: 39500.0, bbMiddle: 38650.0, bbLower: 37800.0, stochK: 62, stochD: 58, atrCurrent: 350.0, cci: 65, support: 37100.0, resistance: 39480.0, volume: 1450000, avgVolume: 1500000 },
  ASX200: { price: 7780.0, decimals: 2, rsi: 51.8, ema50: 7740.0, ema200: 7620.0, macdLine: 22.0, macdSignal: 18.0, bbUpper: 7890.0, bbMiddle: 7765.0, bbLower: 7640.0, stochK: 56, stochD: 52, atrCurrent: 58.0, cci: 35, support: 7590.0, resistance: 7880.0, volume: 320000, avgVolume: 310000 },
  WTIUSD: { price: 78.40, decimals: 2, rsi: 52.6, ema50: 77.80, ema200: 76.20, macdLine: 0.35, macdSignal: 0.28, bbUpper: 81.20, bbMiddle: 78.30, bbLower: 75.40, stochK: 56, stochD: 52, atrCurrent: 1.25, cci: 35, support: 74.80, resistance: 80.60, volume: 320000, avgVolume: 310000 },
  NATGAS: { price: 2.650, decimals: 3, rsi: 45.2, ema50: 2.720, ema200: 2.580, macdLine: -0.035, macdSignal: -0.025, bbUpper: 2.950, bbMiddle: 2.700, bbLower: 2.450, stochK: 36, stochD: 40, atrCurrent: 0.095, cci: -75, support: 2.350, resistance: 2.880, volume: 180000, avgVolume: 190000 },
  COPPER: { price: 4.480, decimals: 4, rsi: 44.5, ema50: 4.620, ema200: 4.350, macdLine: -0.085, macdSignal: -0.065, bbUpper: 4.850, bbMiddle: 4.565, bbLower: 4.280, stochK: 32, stochD: 38, atrCurrent: 0.085, cci: -90, support: 4.150, resistance: 4.780, volume: 65000, avgVolume: 68000 },
  BTCUSD: { price: 67250.0, decimals: 2, rsi: 54.8, ema50: 66100.0, ema200: 63400.0, macdLine: 450.0, macdSignal: 380.0, bbUpper: 69500.0, bbMiddle: 66850.0, bbLower: 64200.0, stochK: 62, stochD: 58, atrCurrent: 1850.0, cci: 75, support: 63800.0, resistance: 68900.0, volume: 28000, avgVolume: 26500 },
  ETHUSD: { price: 3480.0, decimals: 2, rsi: 52.1, ema50: 3420.0, ema200: 3250.0, macdLine: 18.5, macdSignal: 15.2, bbUpper: 3650.0, bbMiddle: 3465.0, bbLower: 3280.0, stochK: 55, stochD: 52, atrCurrent: 115.0, cci: 60, support: 3250.0, resistance: 3620.0, volume: 35000, avgVolume: 34000 },
  SOLUSD: { price: 148.50, decimals: 3, rsi: 46.2, ema50: 152.00, ema200: 142.00, macdLine: -2.45, macdSignal: -1.80, bbUpper: 162.00, bbMiddle: 150.00, bbLower: 138.00, stochK: 38, stochD: 42, atrCurrent: 6.80, cci: -80, support: 135.00, resistance: 161.00, volume: 42000, avgVolume: 45000 },
};

// Add structural aliases
BASELINES["BTCUSDT"] = BASELINES["BTCUSD"];
BASELINES["ETHUSDT"] = BASELINES["ETHUSD"];
BASELINES["SOLUSD"] = BASELINES["SOLUSD"];
BASELINES["XAU/USD"] = BASELINES["XAUUSD"];
BASELINES["XAG/USD"] = BASELINES["XAGUSD"];
BASELINES["GBP/USD"] = BASELINES["GBPUSD"];
BASELINES["EUR/USD"] = BASELINES["EURUSD"];
BASELINES["USD/JPY"] = BASELINES["USDJPY"];
BASELINES["USD/CHF"] = BASELINES["USDCHF"];
BASELINES["AUD/USD"] = BASELINES["AUDUSD"];
BASELINES["NZD/USD"] = BASELINES["NZDUSD"];
BASELINES["USD/CAD"] = BASELINES["USDCAD"];
BASELINES["EUR/GBP"] = BASELINES["EURGBP"];
BASELINES["EUR/JPY"] = BASELINES["EURJPY"];
BASELINES["GBP/JPY"] = BASELINES["GBPJPY"];
BASELINES["CAD/JPY"] = BASELINES["CADJPY"];
BASELINES["AUD/CAD"] = BASELINES["AUDCAD"];
BASELINES["GBP/CAD"] = BASELINES["GBPCAD"];
BASELINES["WTI/USD"] = BASELINES["WTIUSD"];
BASELINES["US30"] = BASELINES["DJI"];
BASELINES["UK100"] = BASELINES["FTSE"];
BASELINES["SPX500"] = BASELINES["SPX"];
BASELINES["NAS100"] = BASELINES["NDX"];

function getTwelveDataKeys(): string[] {
  const list: string[] = [];
  
  if (process.env.TWELVE_DATA_KEY) {
    process.env.TWELVE_DATA_KEY.split(",").forEach(k => {
      const trimmed = k.trim();
      if (trimmed && !list.includes(trimmed)) list.push(trimmed);
    });
  }
  
  if (process.env.TWELVE_DATA_KEY_ALT) {
    const trimmed = process.env.TWELVE_DATA_KEY_ALT.trim();
    if (trimmed && !list.includes(trimmed)) list.push(trimmed);
  }
  
  if (process.env.NEXT_PUBLIC_TWELVE_DATA_KEY) {
    process.env.NEXT_PUBLIC_TWELVE_DATA_KEY.split(",").forEach(k => {
      const trimmed = k.trim();
      if (trimmed && !list.includes(trimmed)) list.push(trimmed);
    });
  }
  
  return list.filter(k => k.length > 5);
}

function getFallbackMarketData(symbol: string, interval: string) {
  const clean = symbol.replace("/", "").toUpperCase();
  const baseline = BASELINES[clean] ?? BASELINES["GBPUSD"];
  
  // Oscillate dynamically every 5 minutes
  const cycle = Math.sin(Date.now() / 300000);
  const noise = (Math.sin(clean.charCodeAt(0) * 10) * 0.5) + (Math.cos(clean.charCodeAt(1) * 20) * 0.5);
  
  const priceMultiplier = 1 + (0.0012 * cycle) + (0.0003 * noise);
  const price = parseFloat((baseline.price * priceMultiplier).toFixed(baseline.decimals));
  
  const changePct = parseFloat((0.15 * cycle + 0.05 * noise).toFixed(2));
  const change = parseFloat((price * (changePct / 100)).toFixed(baseline.decimals));
  const prevClose = parseFloat((price - change).toFixed(baseline.decimals));
  
  const bid = parseFloat((price - (baseline.price * 0.0001)).toFixed(baseline.decimals));
  const ask = parseFloat((price + (baseline.price * 0.0001)).toFixed(baseline.decimals));
  const spread = parseFloat((ask - bid).toFixed(8));
  
  const volumeMultiplier = 1 + (0.1 * cycle) + (0.05 * noise);
  const volume = Math.round(baseline.volume * volumeMultiplier);
  const avgVolume = baseline.avgVolume;
  const volRatio = parseFloat(((volume / avgVolume) * 100).toFixed(1));
  
  // Indicators with minor noise
  const rsi = parseFloat((baseline.rsi + (3 * cycle) + (1 * noise)).toFixed(1));
  const ema50 = parseFloat((baseline.ema50).toFixed(baseline.decimals));
  const ema200 = parseFloat((baseline.ema200).toFixed(baseline.decimals));
  
  const macdLine = parseFloat((baseline.macdLine + (baseline.macdLine * 0.1 * cycle)).toFixed(baseline.decimals));
  const macdSignal = parseFloat((baseline.macdSignal + (baseline.macdSignal * 0.08 * cycle)).toFixed(baseline.decimals));
  const macdHist = parseFloat((macdLine - macdSignal).toFixed(baseline.decimals));
  
  const bbMiddle = parseFloat((baseline.bbMiddle).toFixed(baseline.decimals));
  const bbUpper = parseFloat((baseline.bbUpper + (baseline.bbUpper * 0.0005 * cycle)).toFixed(baseline.decimals));
  const bbLower = parseFloat((baseline.bbLower - (baseline.bbLower * 0.0005 * cycle)).toFixed(baseline.decimals));
  
  const stochK = parseFloat((baseline.stochK + (5 * cycle)).toFixed(1));
  const stochD = parseFloat((baseline.stochD + (4 * cycle)).toFixed(1));
  const cci = parseFloat((baseline.cci + (15 * cycle)).toFixed(1));
  
  const atrCurrent = parseFloat((baseline.atrCurrent * (1 + 0.05 * cycle)).toFixed(baseline.decimals));
  const atrAvg20 = baseline.atrCurrent;
  const atrRatio = parseFloat((atrCurrent / atrAvg20).toFixed(2));
  
  const support = parseFloat((baseline.support).toFixed(baseline.decimals));
  const resistance = parseFloat((baseline.resistance).toFixed(baseline.decimals));
  
  const simulatedIndicators = {
    rsi, ema50, ema200,
    macdValue: macdLine, macdSignal, macdHistogram: macdHist,
    bbUpper, bbMiddle, bbLower,
    stochK, stochD, atr: atrCurrent, cci,
    volumeAvg: avgVolume, currentVolume: volume
  };
  
  const calculatedBias = calculateBiasScore(simulatedIndicators, price);
  const biasScore = calculatedBias.score;
  const trendLabel = price > ema50 ? "ABOVE EMA" : price < ema50 ? "BELOW EMA" : "AT EMA";
  const trendDir = price > ema50 ? "above" : price < ema50 ? "below" : "at";
  
  return {
    symbol, interval,
    price, prevClose, change, changePct,
    bid, ask, spread,
    volume, avgVolume, volRatio,
    rsi, macdLine, macdSignal, macdHist,
    ema50, ema200,
    bbUpper, bbMiddle, bbLower,
    stochK, stochD, cci,
    atrCurrent, atrAvg20, atrRatio,
    resistance, support,
    biasScore, trendLabel, trendDir,
    cached_at: new Date().toISOString(),
    is_fallback: true
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const searchParams = new URL(_req.url).searchParams;
  const interval = searchParams.get("interval") ?? "4h";
  const sym = encodeURIComponent(tdSymbol(symbol));

  console.log(`[market-data] Fetching ${symbol} (${sym}) interval=${interval}`);

  const keys = getTwelveDataKeys();
  if (keys.length === 0) {
    console.warn("[market-data] No Twelve Data API keys configured. Using fallback engine.");
    return NextResponse.json(getFallbackMarketData(symbol, interval));
  }

  let quoteData: any = null;
  let candlesData: any = null;
  let atrData: any = null;
  let rsiData: any = null;
  let macdData: any = null;
  let ema50Data: any = null;
  let ema200Data: any = null;
  let bbData: any = null;
  let stochData: any = null;
  let cciData: any = null;

  let success = false;

  for (const key of keys) {
    try {
      console.log(`[market-data] Attempting API call with key: ${key.substring(0, 5)}...`);
      
      const fetchWithKey = async (urlWithoutKey: string) => {
        const sep = urlWithoutKey.includes("?") ? "&" : "?";
        const res = await fetch(`${urlWithoutKey}${sep}apikey=${key}`, { next: { revalidate: 60 } });
        const json = await res.json();
        
        if (json && (json.status === "error" || json.code === 429 || (json.message && (json.message.includes("credits") || json.message.includes("limit") || json.message.includes("Rate limit"))))) {
          throw new Error("KEY_EXHAUSTED");
        }
        return json;
      };

      [
        quoteData,
        candlesData,
        atrData,
        rsiData,
        macdData,
        ema50Data,
        ema200Data,
        bbData,
        stochData,
        cciData,
      ] = await Promise.all([
        fetchWithKey(`${TD}/quote?symbol=${sym}`),
        fetchWithKey(`${TD}/time_series?symbol=${sym}&interval=${interval}&outputsize=21`),
        fetchWithKey(`${TD}/atr?symbol=${sym}&interval=${interval}&time_period=14&outputsize=21`),
        fetchWithKey(`${TD}/rsi?symbol=${sym}&interval=${interval}&time_period=14&outputsize=1`),
        fetchWithKey(`${TD}/macd?symbol=${sym}&interval=${interval}&outputsize=1`),
        fetchWithKey(`${TD}/ema?symbol=${sym}&interval=1day&time_period=50&outputsize=1`),
        fetchWithKey(`${TD}/ema?symbol=${sym}&interval=1day&time_period=200&outputsize=1`),
        fetchWithKey(`${TD}/bbands?symbol=${sym}&interval=${interval}&time_period=20&series_type=close&outputsize=1`),
        fetchWithKey(`${TD}/stoch?symbol=${sym}&interval=${interval}&outputsize=1`),
        fetchWithKey(`${TD}/cci?symbol=${sym}&interval=${interval}&time_period=20&outputsize=1`),
      ]);

      success = true;
      console.log(`[market-data] Successful API fetch with key ${key.substring(0, 5)}...`);
      break;
    } catch (err: any) {
      console.warn(`[market-data] Key ${key.substring(0, 5)}... failed or exhausted. Trying next key. Error:`, err.message || err);
    }
  }

  if (!success) {
    console.warn(`[market-data] All Twelve Data keys failed or exhausted for ${symbol}. Returning simulated fallback data.`);
    return NextResponse.json(getFallbackMarketData(symbol, interval));
  }

  // ── Extract quote ─────────────────────────────────────────────────────────
  const q = quoteData;
  const isError = !q || q.status === "error" || q.code;
  if (isError) {
    console.warn("[market-data] quote returned error structure. Falling back.");
    return NextResponse.json(getFallbackMarketData(symbol, interval));
  }

  const price      = pf(q.close ?? q.price);
  const prevClose  = pf(q.previous_close);
  const change     = (price !== null && prevClose !== null) ? price - prevClose : pf(q.change);
  const changePct  = pf(q.percent_change);
  const volume     = pf(q.volume);
  const avgVolume  = pf(q.average_volume);
  const bid        = pf(q.bid);
  const ask        = pf(q.ask);
  const spread     = bid !== null && ask !== null ? parseFloat((ask - bid).toFixed(8)) : null;

  // ── Candles → swing support/resistance + volume ───────────────────────────
  const candles: any[] = candlesData?.values ?? [];
  const highs   = candles.map((c: any) => pf(c.high)).filter((n): n is number => n !== null);
  const lows    = candles.map((c: any) => pf(c.low)).filter((n): n is number => n !== null);
  const volumes = candles.slice(1).map((c: any) => pf(c.volume)).filter((n): n is number => n !== null);

  const resistance = highs.length ? Math.max(...highs) : null;
  const support    = lows.length  ? Math.min(...lows)  : null;
  const avgVol20   = volumes.length ? volumes.reduce((a, b) => a + b, 0) / volumes.length : null;
  const curVol     = candles[0] ? pf(candles[0].volume) : null;
  const volRatio   = curVol && avgVol20 ? (curVol / avgVol20) * 100 : null;

  // ── ATR ───────────────────────────────────────────────────────────────────
  const atrVals: number[] = (atrData?.values ?? []).map((v: any) => pf(v.atr)).filter((n: number | null): n is number => n !== null);
  const atrCurrent = atrVals[0] ?? null;
  const atrHistory20 = atrVals.slice(1, 21);
  const atrAvg20   = atrHistory20.length ? atrHistory20.reduce((a: number, b: number) => a + b, 0) / atrHistory20.length : null;
  const atrRatio   = atrCurrent && atrAvg20 ? atrCurrent / atrAvg20 : null;

  // ── RSI ───────────────────────────────────────────────────────────────────
  const rsi = pf(rsiData?.values?.[0]?.rsi);

  // ── MACD ──────────────────────────────────────────────────────────────────
  const macdLine   = pf(macdData?.values?.[0]?.macd);
  const macdSignal = pf(macdData?.values?.[0]?.macd_signal);
  const macdHist   = pf(macdData?.values?.[0]?.macd_hist);

  // ── EMA 50 / 200 ─────────────────────────────────────────────────────────
  const ema50  = pf(ema50Data?.values?.[0]?.ema);
  const ema200 = pf(ema200Data?.values?.[0]?.ema);

  // ── Bollinger Bands ───────────────────────────────────────────────────────
  const bbUpper  = pf(bbData?.values?.[0]?.upper_band);
  const bbMiddle = pf(bbData?.values?.[0]?.middle_band);
  const bbLower  = pf(bbData?.values?.[0]?.lower_band);

  // ── Stochastic ────────────────────────────────────────────────────────────
  const stochK = pf(stochData?.values?.[0]?.slow_k);
  const stochD = pf(stochData?.values?.[0]?.slow_d);

  // ── CCI ───────────────────────────────────────────────────────────────────
  const cci = pf(cciData?.values?.[0]?.cci);

  // ── Bias score (0–100) ────────────────────────────────────────────────────
  const simulatedIndicators = {
    rsi, ema50, ema200,
    macdValue: macdLine, macdSignal, macdHistogram: macdHist,
    bbUpper, bbMiddle, bbLower,
    stochK, stochD, atr: atrCurrent, cci,
    volumeAvg: avgVol20, currentVolume: volume
  };
  
  let biasScore: number | null = null;
  if (price !== null) {
    const calculatedBias = calculateBiasScore(simulatedIndicators, price);
    biasScore = calculatedBias.score;
  }

  // ── EMA trend label ───────────────────────────────────────────────────────
  let trendLabel: string = "—";
  let trendDir: "above" | "below" | "at" | null = null;
  if (price !== null && ema50 !== null) {
    const diff = Math.abs(price - ema50) / ema50;
    if (diff < 0.001) { trendLabel = "AT EMA";    trendDir = "at"; }
    else if (price > ema50) { trendLabel = "ABOVE EMA"; trendDir = "above"; }
    else                    { trendLabel = "BELOW EMA"; trendDir = "below"; }
  }

  console.log(`[market-data] ${symbol} → price=${price} rsi=${rsi} biasScore=${biasScore} ema50=${ema50}`);

  return NextResponse.json({
    symbol, interval,
    // Price
    price, prevClose, change, changePct,
    bid, ask, spread,
    volume, avgVolume, volRatio,
    // Indicators
    rsi, macdLine, macdSignal, macdHist,
    ema50, ema200,
    bbUpper, bbMiddle, bbLower,
    stochK, stochD, cci,
    // ATR
    atrCurrent, atrAvg20, atrRatio,
    // Levels
    resistance, support,
    // Computed
    biasScore, trendLabel, trendDir,
    // Debug
    cached_at: new Date().toISOString(),
    is_fallback: false
  });
}
