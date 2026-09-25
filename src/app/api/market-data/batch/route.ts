import { NextRequest, NextResponse } from "next/server";
import { SCREENER_INSTRUMENTS, ScreenerInstrument } from "@/lib/screener";
import { isTwelveDataExhausted, tripTwelveDataCircuitBreaker } from "@/lib/market-circuit-breaker";

export const dynamic = "force-dynamic";

const TD_BASE = "https://api.twelvedata.com";

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

// Fallback Yahoo chart lookup
async function fetchYahooPrice(yahooSym: string): Promise<{ price: number; changePct: number; prevClose: number | null } | null> {
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
    if (typeof price !== "number") return null;
    const changePct = typeof prevClose === "number" && prevClose !== 0 
      ? parseFloat((((price - prevClose) / prevClose) * 100).toFixed(2)) 
      : 0;
    return { price, changePct, prevClose: typeof prevClose === "number" ? prevClose : null };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSymbols = searchParams.get("symbols") ?? "";
  const requestedSlugs = rawSymbols.split(",").map(s => s.trim()).filter(Boolean);

  if (requestedSlugs.length === 0) {
    return NextResponse.json({ error: "symbols required" }, { status: 400 });
  }

  // Resolve instruments
  const matchedInstruments = requestedSlugs.map(slug => {
    const found = SCREENER_INSTRUMENTS.find(i => 
      i.scannerSlug === slug || 
      i.displayPair === slug || 
      i.tdSymbol === slug
    );
    if (found) return found;
    // Generic fallback mapping
    const clean = slug.replace("/", "").toUpperCase();
    return {
      scannerSlug: slug,
      displayPair: slug,
      category: "forex",
      tvSymbol: slug,
      tdSymbol: slug.includes("/") ? slug : (slug.length === 6 ? `${slug.slice(0, 3)}/${slug.slice(3)}` : slug),
      yahooSymbol: slug.length === 6 ? `${clean}=X` : clean,
    } as ScreenerInstrument;
  });

  const results: Record<string, {
    symbol: string;
    price: number | null;
    changePct: number | null;
    prevClose: number | null;
    source: string;
    cached_at: string;
    error: boolean;
  }> = {};

  const keys = getTwelveDataKeys();
  const tdSymbols = Array.from(new Set(matchedInstruments.map(i => i.tdSymbol)));

  let tdPriceMap: Record<string, number | null> = {};

  // 1. Check circuit breaker before attempting Twelve Data
  if (!isTwelveDataExhausted() && keys.length > 0 && tdSymbols.length > 0) {
    const key = keys[0];
    const symStr = encodeURIComponent(tdSymbols.join(","));
    try {
      const res = await fetch(`${TD_BASE}/price?symbol=${symStr}&apikey=${key}`, {
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.status === "error" || json?.code === 429 || (json?.message && (json.message.includes("credits") || json.message.includes("limit")))) {
          tripTwelveDataCircuitBreaker();
        } else if (tdSymbols.length === 1) {
          const p = parseFloat(json?.price);
          if (!isNaN(p)) tdPriceMap[tdSymbols[0]] = p;
        } else if (json && typeof json === "object") {
          for (const sym of tdSymbols) {
            const p = parseFloat(json[sym]?.price);
            if (!isNaN(p)) tdPriceMap[sym] = p;
          }
        }
      } else if (res.status === 429) {
        tripTwelveDataCircuitBreaker();
      }
    } catch {
      // Upstream network failure, proceed to fallback
    }
  }

  // 2. Resolve each requested slug (using Twelve Data or Yahoo Finance fallback)
  await Promise.all(
    matchedInstruments.map(async inst => {
      const tdPrice = tdPriceMap[inst.tdSymbol] ?? null;
      if (tdPrice !== null) {
        results[inst.scannerSlug] = {
          symbol: inst.scannerSlug,
          price: tdPrice,
          changePct: null,
          prevClose: null,
          source: "twelvedata",
          cached_at: new Date().toISOString(),
          error: false,
        };
        return;
      }

      // Yahoo Finance Fallback
      const yData = await fetchYahooPrice(inst.yahooSymbol);
      if (yData && yData.price !== null) {
        results[inst.scannerSlug] = {
          symbol: inst.scannerSlug,
          price: yData.price,
          changePct: yData.changePct,
          prevClose: yData.prevClose,
          source: "yahoo",
          cached_at: new Date().toISOString(),
          error: false,
        };
      } else {
        results[inst.scannerSlug] = {
          symbol: inst.scannerSlug,
          price: null,
          changePct: null,
          prevClose: null,
          source: "unavailable",
          cached_at: new Date().toISOString(),
          error: true,
        };
      }
    })
  );

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
