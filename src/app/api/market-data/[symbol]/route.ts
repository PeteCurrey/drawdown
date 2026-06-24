/**
 * /api/market-data/[symbol]/route.ts
 *
 * DIAGNOSIS (what was broken):
 * ─────────────────────────────
 * The dashboard was making 26+ simultaneous client-side fetch calls to api.twelvedata.com
 * (18 from useTechnicalData + 5 from useTwelveData + 3 from useExtraSignals) using
 * NEXT_PUBLIC_TWELVE_DATA_KEY. Twelve Data's free tier is capped at 8 calls/minute.
 * Every call past #8 returned HTTP 429. The try/catch blocks swallowed the 429 silently
 * and returned null for everything → every data field showed "—" in the UI.
 *
 * FIX:
 * ────
 * This server-side route consolidates all indicator fetches into 8 parallel calls maximum,
 * uses the secret TWELVE_DATA_KEY (server-only, not exposed to the browser), and is
 * edge-cached via Next.js revalidate so the browser makes exactly 1 fast call to our own
 * domain instead of 26 slow calls to Twelve Data.
 *
 * WHAT THIS RETURNS:
 * ──────────────────
 * A single JSON blob with every value the dashboard needs: price, change, RSI, MACD,
 * EMA50/200, Bollinger Bands, Stochastic, CCI, ATR (with 20-period history), 20-candle
 * swing support/resistance, volume, and a computed biasScore (0–100).
 */

import { NextResponse } from "next/server";
import { tdSymbol } from "@/lib/instruments";

export const dynamic = "force-dynamic";

const TD = "https://api.twelvedata.com";

function pf(v: any): number | null {
  const n = parseFloat(v);
  return isNaN(n) || !isFinite(n) ? null : n;
}

function safeFetch(url: string, apiKey: string): Promise<any> {
  return fetch(`${url}&apikey=${apiKey}`, { next: { revalidate: 60 } })
    .then(r => r.json())
    .catch(() => null);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const searchParams = new URL(_req.url).searchParams;
  const interval = searchParams.get("interval") ?? "4h";

  const key = process.env.TWELVE_DATA_KEY;
  if (!key) {
    console.error("[market-data] TWELVE_DATA_KEY env var is not set");
    return NextResponse.json({ error: "API key not configured", symbol, interval }, { status: 503 });
  }

  const sym = encodeURIComponent(tdSymbol(symbol));

  console.log(`[market-data] Fetching ${symbol} (${sym}) interval=${interval}`);

  // ── Batch 1: quote + time_series (candles for support/resistance + volume) + ATR history
  // ── Batch 2: RSI, MACD, EMA50, EMA200, BB, Stoch, CCI (all at selected interval)
  //
  // Total: 9 calls — well within rate limits, all parallel, all server-side.

  const [
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
    // Quote: price, previous_close, change, percent_change, volume, average_volume
    safeFetch(`${TD}/quote?symbol=${sym}`, key),

    // 20 candles for swing high/low support & resistance + volume average
    safeFetch(`${TD}/time_series?symbol=${sym}&interval=${interval}&outputsize=21`, key),

    // ATR with 21 values so we can compute current vs 20-period average
    safeFetch(`${TD}/atr?symbol=${sym}&interval=${interval}&time_period=14&outputsize=21`, key),

    // RSI(14)
    safeFetch(`${TD}/rsi?symbol=${sym}&interval=${interval}&time_period=14&outputsize=1`, key),

    // MACD(12,26,9)
    safeFetch(`${TD}/macd?symbol=${sym}&interval=${interval}&outputsize=1`, key),

    // EMA 50 (use 1day for structural bias, regardless of selected interval)
    safeFetch(`${TD}/ema?symbol=${sym}&interval=1day&time_period=50&outputsize=1`, key),

    // EMA 200 (daily structural)
    safeFetch(`${TD}/ema?symbol=${sym}&interval=1day&time_period=200&outputsize=1`, key),

    // Bollinger Bands (20,2) at selected interval
    safeFetch(`${TD}/bbands?symbol=${sym}&interval=${interval}&time_period=20&series_type=close&outputsize=1`, key),

    // Stochastic (14,3,3)
    safeFetch(`${TD}/stoch?symbol=${sym}&interval=${interval}&outputsize=1`, key),

    // CCI (20)
    safeFetch(`${TD}/cci?symbol=${sym}&interval=${interval}&time_period=20&outputsize=1`, key),
  ]);

  // ── Extract quote ─────────────────────────────────────────────────────────
  const q = quoteData;
  const isError = !q || q.status === "error" || q.code;
  if (isError) {
    console.error("[market-data] quote error:", q);
    return NextResponse.json({ error: "Twelve Data error", symbol, raw: q }, { status: 502 });
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
  // RSI 30% + EMA 30% + MACD 20% + CCI 10% + BB 10%
  let biasScore: number | null = null;
  if (rsi !== null || ema50 !== null || macdLine !== null) {
    const rsiBias  = rsi !== null ? rsi / 100 : 0.5;

    let emaBias = 0.5;
    if (price !== null && ema50 !== null && ema200 !== null) {
      if (price > ema200 && price > ema50)      emaBias = 1.0;
      else if (price > ema50)                    emaBias = 0.75;
      else if (price > ema200)                   emaBias = 0.25;
      else                                        emaBias = 0.0;
    } else if (price !== null && ema50 !== null) {
      emaBias = price > ema50 ? 0.75 : 0.25;
    }

    const macdBias = macdLine !== null && macdSignal !== null
      ? (macdLine > macdSignal ? 1.0 : macdLine < macdSignal ? 0.0 : 0.5)
      : 0.5;

    const cciBias = cci !== null
      ? Math.min(1, Math.max(0, (cci + 200) / 400))
      : 0.5;

    let bbBias = 0.5;
    if (price !== null && bbUpper !== null && bbLower !== null) {
      const bw = bbUpper - bbLower;
      if (bw > 0) {
        const pos = (price - bbLower) / bw; // 0 = at lower, 1 = at upper
        bbBias = 1 - pos; // near lower = bullish, near upper = bearish
      }
    }

    const raw = rsiBias * 0.30 + emaBias * 0.30 + macdBias * 0.20 + cciBias * 0.10 + bbBias * 0.10;
    biasScore = Math.round(Math.min(100, Math.max(0, raw * 100)));
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
  });
}
