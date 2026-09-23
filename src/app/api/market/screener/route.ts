import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_SCREENER_INSTRUMENTS, SCREENER_INSTRUMENTS, ScreenerRow } from "@/lib/screener";
import { getMarketHistory } from "@/lib/market";
import { identifyMSS } from "@/lib/scanner";
import { createServerClient } from "@supabase/ssr";

// 60-second Next.js Edge cache — shared across all users, one upstream call per minute max
export const revalidate = 60;

const TD_KEY = process.env.TWELVE_DATA_KEY ?? process.env.NEXT_PUBLIC_TWELVE_DATA_KEY ?? "";
const TD_BASE = "https://api.twelvedata.com";

// ─── Supabase cache helpers ────────────────────────────────────────────────────
function makeSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );
}

async function getCached(key: string): Promise<unknown | null> {
  const sb = makeSupabase();
  const { data } = await sb
    .from("market_data_cache")
    .select("data")
    .eq("cache_key", key)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data?.data ?? null;
}

async function setCache(key: string, value: unknown, ttl = 60) {
  const sb = makeSupabase();
  const expires_at = new Date(Date.now() + ttl * 1000).toISOString();
  await sb.from("market_data_cache").upsert({ cache_key: key, data: value, expires_at }, { onConflict: "cache_key" });
}

// ─── Twelve Data batch price fetch ────────────────────────────────────────────
// One API credit for the entire batch — confirmed by TD docs
async function fetchBatchPrices(tdSymbols: string[]): Promise<Record<string, { price: number; changePct: number } | null>> {
  if (!TD_KEY || tdSymbols.length === 0) return {};
  const symStr = encodeURIComponent(tdSymbols.join(","));
  try {
    const res = await fetch(
      `${TD_BASE}/price?symbol=${symStr}&apikey=${TD_KEY}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return {};
    const json = await res.json();
    // Single symbol: { price: "1.2345" }
    // Multi symbol: { "EUR/USD": { price: "1.2345" }, ... }
    if (tdSymbols.length === 1) {
      const sym = tdSymbols[0];
      const p = parseFloat(json?.price);
      return { [sym]: isNaN(p) ? null : { price: p, changePct: 0 } };
    }
    const result: Record<string, { price: number; changePct: number } | null> = {};
    for (const sym of tdSymbols) {
      const p = parseFloat(json?.[sym]?.price);
      result[sym] = isNaN(p) ? null : { price: p, changePct: 0 };
    }
    return result;
  } catch {
    return {};
  }
}

// ─── Twelve Data batch previous-close for %change ─────────────────────────────
async function fetchBatchEOD(tdSymbols: string[]): Promise<Record<string, number | null>> {
  if (!TD_KEY || tdSymbols.length === 0) return {};
  const symStr = encodeURIComponent(tdSymbols.join(","));
  try {
    const res = await fetch(
      `${TD_BASE}/eod?symbol=${symStr}&apikey=${TD_KEY}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return {};
    const json = await res.json();
    if (tdSymbols.length === 1) {
      const sym = tdSymbols[0];
      const c = parseFloat(json?.close);
      return { [sym]: isNaN(c) ? null : c };
    }
    const result: Record<string, number | null> = {};
    for (const sym of tdSymbols) {
      const c = parseFloat(json?.[sym]?.close);
      result[sym] = isNaN(c) ? null : c;
    }
    return result;
  } catch {
    return {};
  }
}

// ─── RSI computation from OHLCV (Wilder's smoothing, avoids extra TD credit) ──
function computeRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gains += d; else losses -= d;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

// ─── Bias from MSS signals ─────────────────────────────────────────────────────
function deriveBias(history: { time: string; open: number; high: number; low: number; close: number; volume: number }[]): "BULLISH" | "BEARISH" | "NEUTRAL" {
  if (history.length < 20) return "NEUTRAL";
  const signals = identifyMSS(history);
  if (signals.length === 0) return "NEUTRAL";
  // Most recent signal drives bias
  const latest = signals[signals.length - 1];
  if (latest.type === "MSS_BULLISH") return "BULLISH";
  if (latest.type === "MSS_BEARISH") return "BEARISH";
  return "NEUTRAL";
}

// ─── Yahoo Finance fallback price ──────────────────────────────────────────────
async function fetchYahooPrice(yahooSym: string): Promise<{ price: number; changePct: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;
    if (typeof price !== "number" || typeof prevClose !== "number") return null;
    const changePct = prevClose !== 0 ? ((price - prevClose) / prevClose) * 100 : 0;
    return { price, changePct: parseFloat(changePct.toFixed(2)) };
  } catch {
    return null;
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryFilter = searchParams.get("category"); // optional filter
  const dashboardMode = searchParams.get("dashboard") === "1"; // full 38 instruments

  const instruments = dashboardMode ? SCREENER_INSTRUMENTS : PUBLIC_SCREENER_INSTRUMENTS;
  const filtered = categoryFilter
    ? instruments.filter(i => i.category === categoryFilter)
    : instruments;

  const cacheKey = `screener:${dashboardMode ? "full" : "public"}:${categoryFilter ?? "all"}`;
  const cached = await getCached(cacheKey);
  if (cached && Array.isArray(cached)) {
    return NextResponse.json(cached);
  }

  // ── Batch price fetch (Twelve Data) ──────────────────────────────────────────
  const tdSymbols = filtered.map(i => i.tdSymbol);
  const [priceMap, eodMap] = await Promise.all([
    fetchBatchPrices(tdSymbols),
    fetchBatchEOD(tdSymbols),
  ]);

  // ── Build rows in parallel (OHLCV from Supabase cache for RSI + bias) ────────
  const rows: ScreenerRow[] = await Promise.all(
    filtered.map(async (inst): Promise<ScreenerRow> => {
      const tdData = priceMap[inst.tdSymbol];
      let price: number | null = tdData?.price ?? null;
      let changePct: number | null = null;
      let source = "twelvedata";

      if (price !== null) {
        const prevClose = eodMap[inst.tdSymbol];
        if (prevClose && prevClose > 0) {
          changePct = parseFloat(((price - prevClose) / prevClose * 100).toFixed(2));
        }
      }

      // Yahoo fallback
      if (price === null) {
        const yahoo = await fetchYahooPrice(inst.yahooSymbol);
        if (yahoo) {
          price = yahoo.price;
          changePct = yahoo.changePct;
          source = "yahoo";
        }
      }

      const feedOffline = price === null;

      // RSI + bias from cached OHLCV (zero new TD credits — uses 24h Supabase cache)
      let rsi: number | null = null;
      let bias: "BULLISH" | "BEARISH" | "NEUTRAL" = "NEUTRAL";

      if (!feedOffline) {
        try {
          const history = await getMarketHistory(inst.scannerSlug, "1h", 50);
          if (Array.isArray(history) && history.length >= 20) {
            const closes = history.map((b: any) => b.close);
            rsi = computeRSI(closes);
            bias = deriveBias(history);
          }
        } catch {
          // Non-fatal: price still shown, RSI/bias unavailable
        }
      }

      return {
        slug: inst.scannerSlug,
        displayPair: inst.displayPair,
        category: inst.category,
        price,
        changePct,
        rsi,
        bias,
        source,
        cached_at: new Date().toISOString(),
        feed_offline: feedOffline,
      };
    })
  );

  // Cache for 60s in Supabase (shared across all requests within window)
  await setCache(cacheKey, rows, 60).catch(() => {/* non-fatal */});

  return NextResponse.json(rows, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
