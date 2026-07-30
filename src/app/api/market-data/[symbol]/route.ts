/**
 * /api/market-data/[symbol]/route.ts
 *
 * Implements robust key rotation across multiple Twelve Data API keys.
 * Falls back to Alpha Vantage when all Twelve Data keys are exhausted.
 * Returns an honest FEED_OFFLINE state (null price) when all sources fail —
 * NO fabricated/simulated data is returned at any point.
 *
 * Supports ?currency=GBP|EUR|AUD|SGD|HKD to convert prices via Frankfurter FX.
 * Prices from Twelve Data are always USD-denominated; conversion is applied
 * before returning.
 *
 * MODES:
 *  - ?priceOnly=true  → 1 API call (quote only). Used by 30-second price poller.
 *  - default          → 10 API calls (quote + all indicators). Used every 5 minutes.
 */

import { NextResponse } from "next/server";
import { tdSymbol } from "@/lib/instruments";
import { calculateBiasScore } from "@/lib/biasEngine";

export const dynamic = "force-dynamic";

const TD = "https://api.twelvedata.com";
const AV = "https://www.alphavantage.co/query";
const FX = "https://api.frankfurter.dev/v1/latest";

function pf(v: any): number | null {
  const n = parseFloat(v);
  return isNaN(n) || !isFinite(n) ? null : n;
}

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

/**
 * Fetch a USD to target currency FX rate via Frankfurter (free, no key required).
 * Returns 1 if currency is USD or fetch fails (price unchanged).
 */
async function getFxRate(currency: string): Promise<number> {
  if (!currency || currency.toUpperCase() === "USD") return 1;
  try {
    const res = await fetch(`${FX}?from=USD&to=${currency.toUpperCase()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return 1;
    const data = await res.json();
    const rate = data?.rates?.[currency.toUpperCase()];
    return typeof rate === "number" && rate > 0 ? rate : 1;
  } catch {
    return 1;
  }
}

/**
 * Fetch a real-time price from Alpha Vantage as a fallback.
 * Returns null if the key is missing, rate-limited, or the symbol is unsupported.
 */
async function fetchAlphaVantagePrice(symbol: string): Promise<{ price: number; changePct: number | null } | null> {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) return null;

  const clean = symbol.replace("/", "").toUpperCase();

  const FOREX_PAIRS: Record<string, { from: string; to: string }> = {
    GBPUSD: { from: "GBP", to: "USD" }, EURUSD: { from: "EUR", to: "USD" },
    USDJPY: { from: "USD", to: "JPY" }, USDCHF: { from: "USD", to: "CHF" },
    AUDUSD: { from: "AUD", to: "USD" }, NZDUSD: { from: "NZD", to: "USD" },
    USDCAD: { from: "USD", to: "CAD" }, EURGBP: { from: "EUR", to: "GBP" },
    EURJPY: { from: "EUR", to: "JPY" }, GBPJPY: { from: "GBP", to: "JPY" },
    CADJPY: { from: "CAD", to: "JPY" }, AUDCAD: { from: "AUD", to: "CAD" },
    GBPCAD: { from: "GBP", to: "CAD" }, XAUUSD: { from: "XAU", to: "USD" },
    XAGUSD: { from: "XAG", to: "USD" },
  };

  try {
    if (FOREX_PAIRS[clean]) {
      const { from, to } = FOREX_PAIRS[clean];
      const url = `${AV}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`;
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
      const data = await res.json();
      if (data?.Information || data?.Note) return null;
      const rate = pf(data?.["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"]);
      if (rate === null) return null;
      return { price: rate, changePct: null };
    }

    const url = `${AV}?function=GLOBAL_QUOTE&symbol=${clean}&apikey=${key}`;
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    if (data?.Information || data?.Note) return null;
    const price = pf(data?.["Global Quote"]?.["05. price"]);
    const pctStr = data?.["Global Quote"]?.["10. change percent"];
    const changePct = pctStr ? pf(pctStr.replace("%", "")) : null;
    if (price === null) return null;
    return { price, changePct };
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const searchParams = new URL(_req.url).searchParams;
  const interval = searchParams.get("interval") ?? "4h";
  const priceOnly = searchParams.get("priceOnly") === "true";
  const userCurrency = (searchParams.get("currency") ?? "USD").toUpperCase();
  const sym = encodeURIComponent(tdSymbol(symbol));

  console.log(`[market-data] Fetching ${symbol} (${sym}) interval=${interval} priceOnly=${priceOnly} currency=${userCurrency}`);

  const keys = getTwelveDataKeys();

  // ── PRICE-ONLY MODE ─────────────────────────────────────────────────────────
  if (priceOnly) {
    let price: number | null = null;
    let changePct: number | null = null;
    let change: number | null = null;
    let bid: number | null = null;
    let ask: number | null = null;
    let spread: number | null = null;
    let source = "unavailable";

    for (const key of keys) {
      try {
        const res = await fetch(`${TD}/quote?symbol=${sym}&apikey=${key}`, { cache: "no-store" });
        const q = await res.json();
        if (q?.status === "error" || q?.code === 429 || (q?.message && (q.message.includes("credits") || q.message.includes("limit")))) {
          throw new Error("KEY_EXHAUSTED");
        }
        if (!q || q.status === "error" || q.code) throw new Error("BAD_QUOTE");

        price = pf(q.close ?? q.price);
        const prevClose = pf(q.previous_close);
        change = (price !== null && prevClose !== null) ? price - prevClose : pf(q.change);
        changePct = pf(q.percent_change);
        bid = pf(q.bid);
        ask = pf(q.ask);
        spread = bid !== null && ask !== null ? parseFloat((ask - bid).toFixed(8)) : null;
        source = "twelvedata";
        console.log(`[market-data] priceOnly ${symbol} -> price=${price} (twelvedata)`);
        break;
      } catch (err: any) {
        console.warn(`[market-data] priceOnly TD key ${key.substring(0, 5)}... failed:`, err.message || err);
      }
    }

    if (price === null) {
      console.warn(`[market-data] All TD keys failed for priceOnly ${symbol}. Trying Alpha Vantage.`);
      const av = await fetchAlphaVantagePrice(symbol);
      if (av !== null) {
        price = av.price;
        changePct = av.changePct;
        source = "alphavantage";
        console.log(`[market-data] priceOnly ${symbol} -> price=${price} (alphavantage)`);
      }
    }

    if (price === null) {
      console.error(`[market-data] All sources offline for priceOnly ${symbol}.`);
      return NextResponse.json(
        { symbol, price: null, change: null, changePct: null, is_fallback: true, feed_status: "FEED_OFFLINE", cached_at: new Date().toISOString() },
        { status: 503 }
      );
    }

    const fxRate = await getFxRate(userCurrency);
    const cvt = (v: number | null) => v !== null ? parseFloat((v * fxRate).toFixed(8)) : null;

    return NextResponse.json({
      symbol,
      price: cvt(price),
      change: cvt(change),
      changePct,
      bid: cvt(bid),
      ask: cvt(ask),
      spread: cvt(spread),
      currency: userCurrency,
      fxRate: fxRate !== 1 ? fxRate : undefined,
      source,
      is_fallback: false,
      cached_at: new Date().toISOString(),
    });
  }

  // ── FULL MODE ───────────────────────────────────────────────────────────────
  if (keys.length === 0) {
    console.error("[market-data] No Twelve Data API keys configured.");
    return NextResponse.json(
      { symbol, price: null, is_fallback: true, feed_status: "FEED_OFFLINE", error: "No market data API keys configured" },
      { status: 503 }
    );
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
        const res = await fetch(`${urlWithoutKey}${sep}apikey=${key}`, { cache: "no-store" });
        const json = await res.json();
        if (json && (json.status === "error" || json.code === 429 || (json.message && (json.message.includes("credits") || json.message.includes("limit") || json.message.includes("Rate limit"))))) {
          console.error("[market-data] Twelve Data API failed:", { symbol, status: json.status, error: json.message || json.code });
          throw new Error("KEY_EXHAUSTED");
        }
        return json;
      };

      [quoteData, candlesData, atrData, rsiData, macdData, ema50Data, ema200Data, bbData, stochData, cciData] = await Promise.all([
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
      console.warn(`[market-data] Key ${key.substring(0, 5)}... failed or exhausted. Error:`, err.message || err);
    }
  }

  if (!success) {
    console.warn(`[market-data] All Twelve Data keys failed for ${symbol}. Attempting Alpha Vantage for price only.`);
    const av = await fetchAlphaVantagePrice(symbol);
    if (av !== null) {
      const fxRate = await getFxRate(userCurrency);
      const cvt = (v: number | null) => v !== null ? parseFloat((v * fxRate).toFixed(8)) : null;
      console.log(`[market-data] ${symbol} -> price=${cvt(av.price)} via alphavantage (indicators offline)`);
      return NextResponse.json({
        symbol, interval,
        price: cvt(av.price), prevClose: null, change: null, changePct: av.changePct,
        bid: null, ask: null, spread: null,
        volume: null, avgVolume: null, volRatio: null,
        rsi: null, macdLine: null, macdSignal: null, macdHist: null,
        ema50: null, ema200: null,
        bbUpper: null, bbMiddle: null, bbLower: null,
        stochK: null, stochD: null, cci: null,
        atrCurrent: null, atrAvg20: null, atrRatio: null,
        resistance: null, support: null,
        biasScore: null, trendLabel: "—", trendDir: null,
        currency: userCurrency,
        fxRate: fxRate !== 1 ? fxRate : undefined,
        source: "alphavantage",
        cached_at: new Date().toISOString(),
        is_fallback: false,
        feed_status: "INDICATORS_OFFLINE",
      });
    }

    console.error(`[market-data] All sources offline for full mode ${symbol}.`);
    return NextResponse.json(
      { symbol, price: null, is_fallback: true, feed_status: "FEED_OFFLINE", error: "All market data sources are currently offline" },
      { status: 503 }
    );
  }

  // ── Extract quote ─────────────────────────────────────────────────────────
  const q = quoteData;
  if (!q || q.status === "error" || q.code) {
    console.warn("[market-data] quote returned error structure. Returning FEED_OFFLINE.");
    return NextResponse.json(
      { symbol, price: null, is_fallback: true, feed_status: "FEED_OFFLINE", error: "Quote data unavailable" },
      { status: 503 }
    );
  }

  const rawPrice     = pf(q.close ?? q.price);
  const rawPrevClose = pf(q.previous_close);
  const rawChange    = (rawPrice !== null && rawPrevClose !== null) ? rawPrice - rawPrevClose : pf(q.change);
  const changePct    = pf(q.percent_change);
  const volume       = pf(q.volume);
  const avgVolume    = pf(q.average_volume);
  const rawBid       = pf(q.bid);
  const rawAsk       = pf(q.ask);
  const rawSpread    = rawBid !== null && rawAsk !== null ? parseFloat((rawAsk - rawBid).toFixed(8)) : null;

  const candles: any[] = candlesData?.values ?? [];
  const highs   = candles.map((c: any) => pf(c.high)).filter((n): n is number => n !== null);
  const lows    = candles.map((c: any) => pf(c.low)).filter((n): n is number => n !== null);
  const volumes = candles.slice(1).map((c: any) => pf(c.volume)).filter((n): n is number => n !== null);

  const rawResistance = highs.length ? Math.max(...highs) : null;
  const rawSupport    = lows.length  ? Math.min(...lows)  : null;
  const avgVol20      = volumes.length ? volumes.reduce((a, b) => a + b, 0) / volumes.length : null;
  const curVol        = candles[0] ? pf(candles[0].volume) : null;
  const volRatio      = curVol && avgVol20 ? (curVol / avgVol20) * 100 : null;

  const atrVals: number[] = (atrData?.values ?? []).map((v: any) => pf(v.atr)).filter((n: number | null): n is number => n !== null);
  const rawAtrCurrent = atrVals[0] ?? null;
  const atrHistory20  = atrVals.slice(1, 21);
  const atrAvg20      = atrHistory20.length ? atrHistory20.reduce((a: number, b: number) => a + b, 0) / atrHistory20.length : null;
  const atrRatio      = rawAtrCurrent && atrAvg20 ? rawAtrCurrent / atrAvg20 : null;

  const rsi      = pf(rsiData?.values?.[0]?.rsi);
  const macdLine = pf(macdData?.values?.[0]?.macd);
  const macdSignal = pf(macdData?.values?.[0]?.macd_signal);
  const macdHist   = pf(macdData?.values?.[0]?.macd_hist);
  const rawEma50   = pf(ema50Data?.values?.[0]?.ema);
  const rawEma200  = pf(ema200Data?.values?.[0]?.ema);
  const rawBbUpper  = pf(bbData?.values?.[0]?.upper_band);
  const rawBbMiddle = pf(bbData?.values?.[0]?.middle_band);
  const rawBbLower  = pf(bbData?.values?.[0]?.lower_band);
  const stochK = pf(stochData?.values?.[0]?.slow_k);
  const stochD = pf(stochData?.values?.[0]?.slow_d);
  const cci    = pf(cciData?.values?.[0]?.cci);

  // Bias score computed on USD values (dimensionless)
  const indForBias = {
    rsi, ema50: rawEma50, ema200: rawEma200,
    macdValue: macdLine, macdSignal, macdHistogram: macdHist,
    bbUpper: rawBbUpper, bbMiddle: rawBbMiddle, bbLower: rawBbLower,
    stochK, stochD, atr: rawAtrCurrent, cci,
    volumeAvg: avgVol20, currentVolume: volume
  };
  let biasScore: number | null = null;
  if (rawPrice !== null) {
    const calculatedBias = calculateBiasScore(indForBias, rawPrice);
    biasScore = calculatedBias.score;
  }

  // Apply FX conversion
  const fxRate = await getFxRate(userCurrency);
  const cvt = (v: number | null) => v !== null ? parseFloat((v * fxRate).toFixed(8)) : null;

  const price      = cvt(rawPrice);
  const prevClose  = cvt(rawPrevClose);
  const change     = cvt(rawChange);
  const bid        = cvt(rawBid);
  const ask        = cvt(rawAsk);
  const spread     = cvt(rawSpread);
  const resistance = cvt(rawResistance);
  const support    = cvt(rawSupport);
  const ema50      = cvt(rawEma50);
  const ema200     = cvt(rawEma200);
  const bbUpper    = cvt(rawBbUpper);
  const bbMiddle   = cvt(rawBbMiddle);
  const bbLower    = cvt(rawBbLower);
  const atrCurrent = cvt(rawAtrCurrent);

  let trendLabel = "—";
  let trendDir: "above" | "below" | "at" | null = null;
  if (price !== null && ema50 !== null) {
    const diff = Math.abs(price - ema50) / ema50;
    if (diff < 0.001) { trendLabel = "AT EMA"; trendDir = "at"; }
    else if (price > ema50) { trendLabel = "ABOVE EMA"; trendDir = "above"; }
    else { trendLabel = "BELOW EMA"; trendDir = "below"; }
  }

  console.log(`[market-data] ${symbol} -> price=${price} (${userCurrency}) rsi=${rsi} biasScore=${biasScore} ema50=${ema50}`);

  return NextResponse.json({
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
    currency: userCurrency,
    fxRate: fxRate !== 1 ? fxRate : undefined,
    source: "twelvedata",
    cached_at: new Date().toISOString(),
    is_fallback: false,
  });
}
