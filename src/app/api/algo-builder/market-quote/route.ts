import { NextRequest, NextResponse } from "next/server";

// Server-side FinnHub proxy — keeps FINNHUB_API_KEY off the client
// Returns: { price, change, changePct, high52w, low52w, sparkline: {v}[] }

const SYMBOL_MAP: Record<string, string> = {
  GBPUSD: "OANDA:GBP_USD", EURUSD: "OANDA:EUR_USD", USDJPY: "OANDA:USD_JPY",
  GBPJPY: "OANDA:GBP_JPY", XAGUSD: "OANDA:XAG_USD",
  NAS100: "OANDA:NAS100_USD", SPX500: "OANDA:SPX500_USD",
  BTCUSD: "BINANCE:BTCUSDT", ETHUSD: "BINANCE:ETHUSDT",
};

const QUOTE_CACHE = new Map<string, { data: any; ts: number }>();
const TTL = 55_000; // 55s cache (slightly less than 60s refresh interval)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw    = (searchParams.get("symbol") ?? "").toUpperCase();
  const symbol = SYMBOL_MAP[raw] ?? raw;

  const key = process.env.FINNHUB_API_KEY;
  if (!key) return NextResponse.json(null, { status: 204 }); // silently hide

  // Cache check
  const cached = QUOTE_CACHE.get(raw);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const [quoteRes, profileRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(raw)}&metric=all&token=${key}`),
    ]);

    if (quoteRes.status === 429) return NextResponse.json(null, { status: 429 });
    if (!quoteRes.ok)            return NextResponse.json(null, { status: 204 });

    const q = await quoteRes.json();
    const m = profileRes.ok ? await profileRes.json() : {};

    if (!q.c && q.c !== 0) return NextResponse.json(null, { status: 204 });

    // Build 7-day sparkline from Finnhub stock candle (1-day resolution, 7 points)
    const from    = Math.floor((Date.now() - 7 * 24 * 3600 * 1000) / 1000);
    const to      = Math.floor(Date.now() / 1000);
    const candleRes = await fetch(
      `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${key}`
    ).catch(() => null);
    const candle = candleRes?.ok ? await candleRes.json() : {};
    const sparkline = Array.isArray(candle.c)
      ? candle.c.map((v: number) => ({ v }))
      : [];

    const result = {
      price:     q.c,
      change:    q.d ?? 0,
      changePct: q.dp ?? 0,
      high52w:   m.metric?.["52WeekHigh"] ?? q.h ?? 0,
      low52w:    m.metric?.["52WeekLow"]  ?? q.l ?? 0,
      sparkline,
    };

    QUOTE_CACHE.set(raw, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(null, { status: 204 }); // silently hide on any error
  }
}
