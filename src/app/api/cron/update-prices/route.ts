import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tdSymbol } from "@/lib/instruments";
import { calculateBiasScore } from "@/lib/biasEngine";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel max execution time (up to 5 mins on pro)

const TD = "https://api.twelvedata.com";
const FINNHUB = "https://finnhub.io/api/v1";

function pf(v: any): number | null {
  const n = parseFloat(v);
  return isNaN(n) || !isFinite(n) ? null : n;
}

const SYMBOLS = [
  "XAU/USD", "XAG/USD", "GBP/USD", "EUR/USD", "USD/JPY", "USD/CHF", "AUD/USD",
  "NZD/USD", "USD/CAD", "EUR/GBP", "EUR/JPY", "GBP/JPY", "CAD/JPY", "AUD/CAD",
  "GBP/CAD", "WTI/USD", "BTC/USD", "ETH/USD", "SOL/USD",
  "SPX500", "NAS100", "US30", "UK100", "GER40", "JPN225", "AUS200"
];

function getKeys() {
  const tdKeys: string[] = [];
  if (process.env.TWELVE_DATA_KEY) tdKeys.push(...process.env.TWELVE_DATA_KEY.split(",").map(k => k.trim()).filter(k => k.length > 5));
  if (process.env.TWELVE_DATA_KEY_ALT) tdKeys.push(process.env.TWELVE_DATA_KEY_ALT.trim());
  if (process.env.NEXT_PUBLIC_TWELVE_DATA_KEY) tdKeys.push(...process.env.NEXT_PUBLIC_TWELVE_DATA_KEY.split(",").map(k => k.trim()).filter(k => k.length > 5));
  
  const fhKeys: string[] = [];
  if (process.env.FINNHUB_KEY) fhKeys.push(process.env.FINNHUB_KEY.trim());
  
  return { tdKeys: Array.from(new Set(tdKeys)), fhKeys: Array.from(new Set(fhKeys)) };
}

// Simple RSI calculation
function calculateRSI(closes: number[], periods = 14): number | null {
  if (closes.length <= periods) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= periods; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / periods;
  let avgLoss = losses / periods;
  
  for (let i = periods + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (periods - 1) + diff) / periods;
      avgLoss = (avgLoss * (periods - 1)) / periods;
    } else {
      avgGain = (avgGain * (periods - 1)) / periods;
      avgLoss = (avgLoss * (periods - 1) - diff) / periods;
    }
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  // Sanity check
  if (rsi < 5 || rsi > 95) return null;
  return parseFloat(rsi.toFixed(1));
}

// Simple EMA calculation
function calculateEMA(closes: number[], periods: number): number | null {
  if (closes.length < periods) return null;
  const k = 2 / (periods + 1);
  let ema = closes.slice(0, periods).reduce((a, b) => a + b, 0) / periods; // SMA for first EMA
  for (let i = periods; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return parseFloat(ema.toFixed(5));
}

export async function GET(req: Request) {
  const { tdKeys, fhKeys } = getKeys();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let activeTdKeyIdx = 0;

  async function fetchTD(urlWithoutKey: string) {
    while (activeTdKeyIdx < tdKeys.length) {
      const key = tdKeys[activeTdKeyIdx];
      const sep = urlWithoutKey.includes("?") ? "&" : "?";
      const res = await fetch(`${urlWithoutKey}${sep}apikey=${key}`, { cache: "no-store" });
      const json = await res.json();
      
      if (json && (json.status === "error" || json.code === 429 || (json.message && (json.message.includes("credits") || json.message.includes("limit") || json.message.includes("Rate limit"))))) {
        activeTdKeyIdx++;
        console.warn(`[cron] TD key ${key.substring(0, 5)} exhausted. Switching to index ${activeTdKeyIdx}`);
        continue;
      }
      return { data: json, source: 'twelvedata' };
    }
    throw new Error("ALL_TD_KEYS_EXHAUSTED");
  }

  const results = [];

  for (const symbol of SYMBOLS) {
    const sym = encodeURIComponent(tdSymbol(symbol));
    try {
      let price = null;
      let change_pct = null;
      let closes: number[] = [];
      let source = '';

      try {
        // Fetch 200 candles for EMA200
        const { data: tsData, source: src } = await fetchTD(`${TD}/time_series?symbol=${sym}&interval=1day&outputsize=200`);
        source = src;
        
        if (tsData && tsData.values && tsData.values.length > 0) {
          // TD values are latest first, we need chronological for indicators
          const values = [...tsData.values].reverse();
          closes = values.map((v: any) => pf(v.close)).filter((n): n is number => n !== null);
          
          price = closes[closes.length - 1];
          if (closes.length >= 2) {
            const prev = closes[closes.length - 2];
            change_pct = parseFloat((((price - prev) / prev) * 100).toFixed(2));
          }
        } else {
          throw new Error("Invalid TS Data");
        }
      } catch (tdErr) {
        console.warn(`[cron] TD failed for ${symbol}:`, tdErr);
        // Fallback to Finnhub if available
        if (fhKeys.length > 0) {
          const fhKey = fhKeys[0];
          // Finnhub format for crypto/forex varies, we'll try a basic quote
          const fhSym = symbol.includes("/") ? `OANDA:${symbol.replace("/", "_")}` : symbol;
          const res = await fetch(`${FINNHUB}/quote?symbol=${fhSym}&token=${fhKey}`, { cache: "no-store" });
          const q = await res.json();
          if (q && q.c) {
            price = pf(q.c);
            change_pct = pf(q.dp);
            source = 'finnhub';
            // We can't easily calculate RSI/EMA from just quote
          }
        }
      }

      if (price !== null) {
        let rsi = null;
        let ema50 = null;
        let ema200 = null;
        let momentum_signal = "NEUTRAL";

        if (closes.length > 0) {
          rsi = calculateRSI(closes, 14);
          ema50 = calculateEMA(closes, 50);
          ema200 = calculateEMA(closes, 200);

          let bullishScore = 0;
          if (rsi && rsi > 50) bullishScore++;
          if (rsi && rsi < 50) bullishScore--;
          if (ema50 && price > ema50) bullishScore++;
          if (ema50 && price < ema50) bullishScore--;
          if (ema200 && price > ema200) bullishScore++;
          if (ema200 && price < ema200) bullishScore--;

          if (bullishScore >= 2) momentum_signal = "BULLISH";
          else if (bullishScore <= -2) momentum_signal = "BEARISH";
        }

        const payload = {
          symbol,
          price,
          change_pct,
          rsi,
          ema50,
          ema200,
          momentum_signal,
          source,
          fetched_at: new Date().toISOString()
        };

        const { error: upsertErr } = await supabase
          .from("price_cache")
          .upsert(payload, { onConflict: "symbol" });

        if (upsertErr) {
          console.error(`[cron] Upsert failed for ${symbol}:`, upsertErr);
        } else {
          results.push(payload);
        }
      }
    } catch (e) {
      console.error(`[cron] Processing failed for ${symbol}:`, e);
    }
    
    // Add small delay to avoid hitting rate limits too aggressively
    await new Promise(r => setTimeout(r, 100));
  }

  return NextResponse.json({ success: true, updated: results.length, results });
}
