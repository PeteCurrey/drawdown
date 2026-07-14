/**
 * /api/news-sentiment/[symbol]/route.ts
 *
 * Server-side proxy for Finnhub news sentiment.
 * Uses FINNHUB_API_KEY (server-only, never exposed to the browser).
 * Cached for 30 minutes server-side.
 *
 * For stocks: uses /news-sentiment?symbol=
 * For forex pairs: uses /news?category=forex and scores the headline
 * sentiment based on keyword presence (simple heuristic).
 *
 * Returns: { score: number | null, label: "Positive"|"Negative"|"Neutral"|"N/A", raw: any }
 */

import { NextResponse } from "next/server";
import { tdSymbol } from "@/lib/instruments";

export const dynamic = "force-dynamic";

const CACHE = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Forex-relevant pairs — Finnhub /news-sentiment only works for stocks.
// For these we use the general forex news feed and heuristic scoring.
const FOREX_SLUGS = new Set([
  "GBPUSD","EURUSD","USDJPY","USDCHF","AUDUSD","NZDUSD","USDCAD",
  "EURGBP","EURJPY","GBPJPY","CADJPY","AUDCAD","GBPCAD",
  "XAUUSD","XAGUSD","WTIUSD","NATGAS","COPPER",
]);

function scoreForexNews(articles: any[], hookSlug: string): number | null {
  if (!articles || articles.length === 0) return null;
  const bull = ["bullish","rally","surge","gain","rise","buy","strong","positive","optimism","recovery"];
  const bear = ["bearish","fall","drop","decline","sell","weak","negative","caution","risk","selloff","collapse"];

  let total = 0;
  let count = 0;
  articles.slice(0, 20).forEach((a: any) => {
    const text = ((a.headline ?? "") + " " + (a.summary ?? "")).toLowerCase();
    let s = 0;
    bull.forEach(w => { if (text.includes(w)) s += 0.1; });
    bear.forEach(w => { if (text.includes(w)) s -= 0.1; });
    total += Math.max(-1, Math.min(1, s));
    count++;
  });
  return count > 0 ? Math.round((total / count) * 100) / 100 : null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return NextResponse.json({ score: null, label: "N/A", error: "FINNHUB_API_KEY not set" }, { status: 503 });
  }

  const cacheHit = CACHE.get(symbol);
  if (cacheHit && Date.now() - cacheHit.ts < CACHE_TTL) {
    return NextResponse.json(cacheHit.data);
  }

  try {
    let score: number | null = null;
    let label = "Neutral";
    let raw: any = null;

    if (FOREX_SLUGS.has(symbol)) {
      // Forex: use general news + heuristic scoring
      const res = await fetch(
        `https://finnhub.io/api/v1/news?category=forex&token=${key}`,
        { next: { revalidate: 1800 } }
      );
      const articles = await res.json();
      score = scoreForexNews(Array.isArray(articles) ? articles : [], symbol);
      raw = { source: "forex-news-heuristic", articleCount: Array.isArray(articles) ? articles.length : 0 };
    } else {
      // Equity/crypto: use Finnhub /news-sentiment
      const finnhubSymbol = tdSymbol(symbol).replace("/", "");
      const res = await fetch(
        `https://finnhub.io/api/v1/news-sentiment?symbol=${encodeURIComponent(finnhubSymbol)}&token=${key}`,
        { next: { revalidate: 1800 } }
      );
      const data = await res.json();
      raw = data;
      if (data?.companyNewsScore !== undefined) {
        score = parseFloat(data.companyNewsScore);
      } else if (data?.buzz?.weeklyAverage !== undefined) {
        score = parseFloat(data.buzz.weeklyAverage);
      }
    }

    if (score !== null) {
      label = score > 0.25 ? "Positive" : score < -0.25 ? "Negative" : "Neutral";
    } else {
      label = "N/A";
    }

    const result = { score, label, raw, symbol, fetched_at: new Date().toISOString() };
    CACHE.set(symbol, { data: result, ts: Date.now() });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[news-sentiment]", err);
    return NextResponse.json({ score: null, label: "N/A", error: err.message }, { status: 500 });
  }
}
