import { NextResponse } from "next/server";

export const revalidate = 60; // 60s cache

interface SnapshotData {
  symbol: string;
  price: number | null;
  changePercent: number | null;
  high?: number | null;
  low?: number | null;
  volume?: number | null;
  source: string;
  status: "LIVE" | "UNAVAILABLE";
}

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
          let endpoint = "";
          const cleanSym = sym.replace("/", "");

          if (["GBPUSD", "EURUSD", "USDJPY", "AUDUSD", "USDCAD"].includes(cleanSym)) {
            endpoint = `https://api.polygon.io/v2/snapshot/locale/global/markets/forex/tickers/C:${cleanSym}?apiKey=${polygonKey}`;
          } else if (["BTCUSD", "ETHUSD", "XRPUSD"].includes(cleanSym)) {
            endpoint = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:${cleanSym}?apiKey=${polygonKey}`;
          } else {
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
                  high: t.day?.h ?? null,
                  low: t.day?.l ?? null,
                  volume: t.day?.v ?? null,
                  source: "Polygon.io Realtime",
                  status: "LIVE",
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
                high: r.h ?? null,
                low: r.l ?? null,
                volume: r.v ?? null,
                source: "Polygon.io Aggs",
                status: "LIVE",
              };
            }
          }
        } catch (e) {
          console.error(`Polygon snapshot error for ${sym}:`, e);
        }
      }

      // FAIL-CLOSED: If no real data, return explicit null/unavailable state. NEVER fabricate static prices.
      if (!data) {
        data = {
          symbol: sym,
          price: null,
          changePercent: null,
          high: null,
          low: null,
          volume: null,
          source: polygonKey ? "Polygon.io (Unavailable)" : "Polygon Unconfigured",
          status: "UNAVAILABLE",
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
