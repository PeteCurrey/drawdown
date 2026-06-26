import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CACHE = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 15 * 60 * 1000;

const KEY = process.env.TWELVE_DATA_KEY ?? process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const BASE = "https://api.twelvedata.com";

export async function POST(req: Request) {
  try {
    const { symbol, displayPair } = await req.json();
    if (!symbol) return NextResponse.json({ error: "symbol required" }, { status: 400 });

    const hit = CACHE.get(symbol);
    if (hit && Date.now() - hit.ts < CACHE_TTL) return NextResponse.json(hit.data);

    // Fetch 50 candles from Twelve Data server-side
    const TD_MAP: Record<string, string> = {
      EURUSD:"EUR/USD", GBPUSD:"GBP/USD", USDJPY:"USD/JPY", GBPJPY:"GBP/JPY",
      XAUUSD:"XAU/USD", XAGUSD:"XAG/USD", UKX:"FTSE", SPX:"SPX", NDX:"NDX", DJI:"DJI",
      BTCUSDT:"BTC/USD", ETHUSDT:"ETH/USD", XRPUSDT:"XRP/USD",
    };
    const tdSym = encodeURIComponent(TD_MAP[symbol] ?? symbol);
    let candleData = "No candle data available.";
    if (KEY) {
      const res = await fetch(`${BASE}/time_series?symbol=${tdSym}&interval=4h&outputsize=50&apikey=${KEY}`);
      const ts = await res.json();
      if (Array.isArray(ts?.values)) {
        candleData = ts.values.slice(0, 50).map((v: any) =>
          `${v.datetime}: O=${v.open} H=${v.high} L=${v.low} C=${v.close} V=${v.volume}`
        ).join("\n");
      }
    }

    const prompt = `You are a professional technical analyst. Analyse this OHLCV data for ${displayPair ?? symbol} (4H timeframe, newest first):

${candleData}

Return ONLY valid JSON (no markdown) in this exact shape:
{
  "patterns": [
    { "name": "Pattern Name", "type": "bullish|bearish|neutral", "confidence": 0.0-1.0, "description": "One sentence." }
  ],
  "commentary": "Exactly two sentences of professional analysis.",
  "trendBias": "bullish|bearish|neutral"
}

Identify: chart patterns (head and shoulders, double tops/bottoms, triangles, flags, wedges, channels), candlestick patterns (engulfing, pin bars, doji, hammer), and trend structure (higher highs/lows = uptrend, lower highs/lows = downtrend). Maximum 4 patterns.`;

    const message = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as any).text ?? "{}";
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { parsed = { patterns: [], commentary: "Analysis unavailable.", trendBias: "neutral" }; }

    const result = { ...(parsed as object), symbol, generatedAt: new Date().toISOString() };
    CACHE.set(symbol, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ patterns: [], commentary: "Analysis unavailable.", trendBias: "neutral", error: e.message }, { status: 500 });
  }
}
