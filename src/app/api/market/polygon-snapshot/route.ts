import { NextResponse } from "next/server";

export const revalidate = 60; // 60s cache

interface SnapshotData {
  symbol: string;
  price: number;
  changePercent: number;
  high?: number;
  low?: number;
  volume?: number;
  source: string;
}

const FALLBACK_PRICES: Record<string, { price: number; changePercent: number }> = {
  GBPUSD: { price: 1.2845, changePercent: 0.15 },
  EURUSD: { price: 1.0892, changePercent: -0.08 },
  USDJPY: { price: 154.20, changePercent: 0.32 },
  XAUUSD: { price: 2384.50, changePercent: 0.85 },
  XAGUSD: { price: 28.40, changePercent: 1.12 },
  BTCUSD: { price: 68420.00, changePercent: 2.45 },
  ETHUSD: { price: 3450.00, changePercent: 1.80 },
  SPX: { price: 5480.20, changePercent: 0.42 },
  NDX: { price: 19850.00, changePercent: 0.65 },
  UK100: { price: 8220.00, changePercent: -0.15 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSymbols = searchParams.get("symbols") || "GBPUSD,XAUUSD,BTCUSD,SPX";
  const symbols = rawSymbols.split(",").map(s => s.trim().toUpperCase());
  const polygonKey = process.env.POLYGON_API_KEY ?? "";

  const results: Record<string, SnapshotData> = {};

  await Promise.all(
    symbols.map(async (sym) => {
      let data: SnapshotData | null = null;
      if (polygonKey) {
        try {
          // Normalize symbol format for Polygon
          let endpoint = "";
          const cleanSym = sym.replace("/", "");

          if (["GBPUSD", "EURUSD", "USDJPY", "AUDUSD", "USDCAD"].includes(cleanSym)) {
            endpoint = `https://api.polygon.io/v2/snapshot/locale/global/markets/forex/tickers/C:${cleanSym}?apiKey=${polygonKey}`;
          } else if (["BTCUSD", "ETHUSD", "XRPUSD"].includes(cleanSym)) {
            endpoint = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${cleanSym}?apiKey=${polygonKey}`;
          } else {
            // General ticker prev close / agg snapshot
            const polyTicker = cleanSym === "XAUUSD" ? "C:XAUUSD" : cleanSym === "SPX" ? "I:SPX" : cleanSym;
            endpoint = `https://api.polygon.io/v2/aggs/ticker/${polyTicker}/prev?adjusted=true&apiKey=${polygonKey}`;
          }

          const res = await fetch(endpoint, { next: { revalidate: 60 } });
          if (res.ok) {
            const json = await res.json();
            if (json.ticker?.lastQuote || json.ticker?.day) {
              const t = json.ticker;
              const price = t.lastTrade?.p || t.day?.c || t.lastQuote?.a || 0;
              const changePercent = t.todaysChangePerc || 0;
              if (price > 0) {
                data = {
                  symbol: sym,
                  price: parseFloat(price.toFixed(4)),
                  changePercent: parseFloat(changePercent.toFixed(2)),
                  high: t.day?.h,
                  low: t.day?.l,
                  volume: t.day?.v,
                  source: "Polygon.io Realtime",
                };
              }
            } else if (json.results && json.results.length > 0) {
              const r = json.results[0];
              const price = r.c || 0;
              const open = r.o || price;
              const changePercent = open > 0 ? ((price - open) / open) * 100 : 0;
              data = {
                symbol: sym,
                price: parseFloat(price.toFixed(4)),
                changePercent: parseFloat(changePercent.toFixed(2)),
                high: r.h,
                low: r.l,
                volume: r.v,
                source: "Polygon.io Aggs",
              };
            }
          }
        } catch (e) {
          console.error(`Polygon snapshot error for ${sym}:`, e);
        }
      }

      if (!data) {
        const fb = FALLBACK_PRICES[sym] || { price: 100.0, changePercent: 0.0 };
        data = {
          symbol: sym,
          price: fb.price,
          changePercent: fb.changePercent,
          source: polygonKey ? "Fallback (Polygon returned 404/Empty)" : "Mock Data",
        };
      }

      results[sym] = data;
    })
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    snapshots: results,
  });
}
