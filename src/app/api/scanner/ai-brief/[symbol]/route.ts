import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const TD_KEY = () => process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const TD_MAP: Record<string, string> = {
  EURUSD: "EUR/USD", GBPUSD: "GBP/USD", USDJPY: "USD/JPY", GBPJPY: "GBP/JPY",
  XAGUSD: "XAG/USD", UKX: "FTSE", SPX: "SPX500", NDX: "QQQ", DJI: "DJI",
  BTCUSDT: "BTC/USD", ETHUSDT: "ETH/USD", XRPUSDT: "XRP/USD",
};

const INSTRUMENT_CURRENCIES: Record<string, string[]> = {
  EURUSD: ["EUR","USD"], GBPUSD: ["GBP","USD"], USDJPY: ["USD","JPY"], GBPJPY: ["GBP","JPY"],
  XAGUSD: ["USD"], UKX: ["GBP"], SPX: ["USD"], NDX: ["USD"], DJI: ["USD"],
  BTCUSDT: ["USD"], ETHUSDT: ["USD"], XRPUSDT: ["USD"],
};

const CENTRAL_BANK_RATES: Record<string, { bank: string; rate: number; trend: string }> = {
  USD: { bank: "Federal Reserve", rate: 4.25, trend: "cutting" },
  EUR: { bank: "ECB",             rate: 2.65, trend: "cutting" },
  GBP: { bank: "Bank of England", rate: 4.25, trend: "cutting" },
  JPY: { bank: "Bank of Japan",   rate: 0.50, trend: "hiking"  },
};

async function fetchCandles(sym: string, interval: string, size: number) {
  const tdSym = encodeURIComponent(TD_MAP[sym] ?? sym);
  const k = TD_KEY();
  if (!k) return [];
  try {
    const r = await fetch(`https://api.twelvedata.com/time_series?symbol=${tdSym}&interval=${interval}&outputsize=${size}&apikey=${k}`);
    const d = await r.json();
    return (d?.values ?? []).map((v: any) => ({
      dt: v.datetime, o: +v.open, h: +v.high, l: +v.low, c: +v.close, vol: +(v.volume ?? 0),
    })).reverse();
  } catch { return []; }
}

async function fetchRSI(sym: string, interval: string) {
  const tdSym = encodeURIComponent(TD_MAP[sym] ?? sym);
  const k = TD_KEY();
  if (!k) return null;
  try {
    const r = await fetch(`https://api.twelvedata.com/rsi?symbol=${tdSym}&interval=${interval}&time_period=14&outputsize=1&apikey=${k}`);
    const d = await r.json();
    return d?.values?.[0]?.rsi ? parseFloat(d.values[0].rsi) : null;
  } catch { return null; }
}

async function fetchATR(sym: string) {
  const tdSym = encodeURIComponent(TD_MAP[sym] ?? sym);
  const k = TD_KEY();
  if (!k) return null;
  try {
    const r = await fetch(`https://api.twelvedata.com/atr?symbol=${tdSym}&interval=1day&time_period=14&outputsize=1&apikey=${k}`);
    const d = await r.json();
    return d?.values?.[0]?.atr ? parseFloat(d.values[0].atr) : null;
  } catch { return null; }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const slug = symbol.toUpperCase();

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  // ── Fetch data in parallel ───────────────────────────────────────────────
  const [dailyCandles, rsi4h, rsiDaily, atr, calendarRes] = await Promise.all([
    fetchCandles(slug, "1day", 22),
    fetchRSI(slug, "4h"),
    fetchRSI(slug, "1day"),
    fetchATR(slug),
    fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/calendar/${slug}`)
      .then(r => r.json()).catch(() => ({ events: [] })),
  ]);

  const candles = dailyCandles.slice(-20);
  const latest = candles[candles.length - 1];
  const prev   = candles[candles.length - 2];

  if (!latest) {
    return NextResponse.json({ error: "No market data available" }, { status: 503 });
  }

  const price     = latest.c;
  const changePct = prev ? ((latest.c - prev.c) / prev.c) * 100 : 0;

  // Pivot points from second-to-last candle
  const pivotCandle = prev ?? latest;
  const pivot = (pivotCandle.h + pivotCandle.l + pivotCandle.c) / 3;
  const r1 = 2 * pivot - pivotCandle.l;
  const r2 = pivot + (pivotCandle.h - pivotCandle.l);
  const s1 = 2 * pivot - pivotCandle.h;
  const s2 = pivot - (pivotCandle.h - pivotCandle.l);

  // Rate differential
  const currencies = INSTRUMENT_CURRENCIES[slug] ?? [];
  const rateInfo = currencies.length === 2
    ? `${currencies[0]}: ${CENTRAL_BANK_RATES[currencies[0]]?.rate ?? "?"}% (${CENTRAL_BANK_RATES[currencies[0]]?.trend ?? "?"}) vs ${currencies[1]}: ${CENTRAL_BANK_RATES[currencies[1]]?.rate ?? "?"}% (${CENTRAL_BANK_RATES[currencies[1]]?.trend ?? "?"})`
    : "N/A";

  // Format candles for prompt (last 5 for brevity)
  const candleSummary = candles.slice(-5).map(c =>
    `${c.dt}: O=${c.o.toFixed(4)} H=${c.h.toFixed(4)} L=${c.l.toFixed(4)} C=${c.c.toFixed(4)}`
  ).join("\n");

  const events = (calendarRes?.events ?? []).slice(0, 3);
  const eventSummary = events.length > 0
    ? events.map((e: any) => `${e.time} UTC — ${e.event} (${e.impact ?? "?"} impact)`).join(", ")
    : "No high-impact events in next 48h";

  const atrPips = atr ? (atr * 10000).toFixed(0) : "N/A";

  const prompt = `You are a professional institutional FX/CFD analyst. Analyse this instrument and provide a structured trading brief. Be concise, specific, and data-driven. Do not provide financial advice.

Instrument: ${slug} (${TD_MAP[slug] ?? slug})
Current Price: ${price.toFixed(5)}
Daily Change: ${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%
ATR(14) Daily: ${atrPips} pips

Recent OHLCV (last 5 daily candles):
${candleSummary}

Key Levels:
  R2=${r2.toFixed(5)} R1=${r1.toFixed(5)} Pivot=${pivot.toFixed(5)} S1=${s1.toFixed(5)} S2=${s2.toFixed(5)}
Price is ${price > pivot ? "ABOVE" : "BELOW"} the daily pivot.

RSI readings: 4H=${rsi4h?.toFixed(1) ?? "N/A"}, Daily=${rsiDaily?.toFixed(1) ?? "N/A"}

Rate differential: ${rateInfo}

Upcoming economic events: ${eventSummary}

Respond with ONLY valid JSON — no markdown, no commentary outside the JSON:
{
  "market_structure": "2 sentences on trend and price position relative to key levels",
  "key_observation": "1 sentence — single most important thing happening right now",
  "scenario_bull": "1 sentence — what needs to happen for bullish move and first target",
  "scenario_bear": "1 sentence — what needs to happen for bearish move and first target",
  "catalyst_watch": "1 sentence — most important upcoming event or catalyst",
  "bias": "BULLISH or BEARISH or NEUTRAL",
  "confidence": "HIGH or MEDIUM or LOW",
  "setup_quality": <integer 0-100>
}`;

  try {
    const client = new Anthropic({ apiKey: anthropicKey });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const text = msg.content[0]?.type === "text" ? msg.content[0].text.trim() : "";
    // Strip any markdown code fences
    const jsonStr = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      ...parsed,
      symbol: slug,
      price,
      changePct,
      pivot: pivot.toFixed(5),
      r1: r1.toFixed(5), r2: r2.toFixed(5),
      s1: s1.toFixed(5), s2: s2.toFixed(5),
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Analysis failed", detail: String(err) }, { status: 500 });
  }
}
