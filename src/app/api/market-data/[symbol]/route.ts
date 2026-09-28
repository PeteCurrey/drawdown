/**
 * Canonical Market Data Route: /api/market-data/[symbol]/route.ts
 * 
 * Powered by canonicalMarketService.
 * NO MOCK DATA. NO FAKE CANDLES. NO STATIC 4152.40 OR 4148.30.
 * 
 * Computes all technical indicators locally from real OHLC candles.
 * Runs the verified 4-pillar composite bias engine (RSI 30%, EMA 30%, Order Flow 25%, Macro 15%).
 */

import { NextResponse } from "next/server";
import { getCanonicalMarketData } from "@/lib/canonicalMarketService";

export const revalidate = 60; // 60s revalidation

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval") ?? "4h";
  const userCurrency = (searchParams.get("currency") ?? "USD").toUpperCase();

  try {
    const canonical = await getCanonicalMarketData(symbol, interval, userCurrency);

    if (canonical.feed_status === "OFFLINE" || canonical.price === null) {
      return NextResponse.json(
        {
          symbol,
          interval,
          price: null,
          is_fallback: true,
          feed_status: "FEED_OFFLINE",
          error: canonical.error ?? "Market data feed offline or unavailable for this instrument.",
          composite_bias: canonical.composite_bias,
        },
        { status: 503 }
      );
    }

    // Trend label relative to EMA50
    let trendLabel = "—";
    let trendDir: "above" | "below" | "at" | null = null;
    if (canonical.price !== null && canonical.ema50 !== null) {
      const diff = Math.abs(canonical.price - canonical.ema50) / canonical.ema50;
      if (diff < 0.001) { trendLabel = "AT EMA"; trendDir = "at"; }
      else if (canonical.price > canonical.ema50) { trendLabel = "ABOVE EMA"; trendDir = "above"; }
      else { trendLabel = "BELOW EMA"; trendDir = "below"; }
    }

    // Return unified canonical format compatible with all dashboard consumers
    return NextResponse.json({
      symbol: canonical.symbol,
      interval: canonical.timeframe,
      price: canonical.price,
      prevClose: canonical.price && canonical.change ? canonical.price - canonical.change : canonical.price,
      change: canonical.change,
      changePct: canonical.change_pct,
      change_pct: canonical.change_pct,
      bid: canonical.bid,
      ask: canonical.ask,
      spread: canonical.spread,
      volume: canonical.volume,
      avgVolume: canonical.avg_volume,
      volRatio: canonical.vol_ratio,
      rsi: canonical.rsi,
      macdLine: canonical.macd_line,
      macdSignal: canonical.macd_signal,
      macdHist: canonical.macd_hist,
      ema50: canonical.ema50,
      ema200: canonical.ema200,
      bbUpper: canonical.bb_upper,
      bbMiddle: canonical.bb_middle,
      bbLower: canonical.bb_lower,
      stochK: canonical.stoch_k,
      stochD: canonical.stoch_d,
      cci: canonical.cci,
      adx: canonical.adx,
      atrCurrent: canonical.atr,
      resistance: canonical.resistance,
      support: canonical.support,
      biasScore: canonical.composite_bias.score,
      composite_bias: canonical.composite_bias,
      trendLabel,
      trendDir,
      currency: canonical.currency,
      fxRate: canonical.fx_rate !== 1 ? canonical.fx_rate : undefined,
      source: canonical.provider,
      feed_status: canonical.feed_status,
      is_fallback: canonical.is_fallback,
      cached_at: canonical.quote_timestamp,
      provider_timestamp: canonical.provider_timestamp,
    });
  } catch (err: any) {
    console.error(`[market-data] Unhandled exception for ${symbol}:`, err);
    return NextResponse.json(
      {
        symbol,
        interval,
        price: null,
        is_fallback: true,
        feed_status: "FEED_OFFLINE",
        error: "Internal server error fetching canonical market data",
      },
      { status: 503 }
    );
  }
}
