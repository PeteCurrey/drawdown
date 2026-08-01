import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const categories = [
    { slug: "forex", name: "Forex", ticker: "GBPUSD", label: "GBP/USD" },
    { slug: "commodities", name: "Commodities", ticker: "XAUUSD", label: "Gold (XAU/USD)" },
    { slug: "indices", name: "Indices", ticker: "SPX", label: "S&P 500" },
    { slug: "crypto", name: "Cryptocurrencies", ticker: "BTCUSD", label: "Bitcoin" },
  ];

  const polygonKey = process.env.POLYGON_API_KEY ?? "";
  const results: Record<string, any> = {};

  await Promise.all(
    categories.map(async (cat) => {
      let price = 0;
      let changePercent = 0;
      let source = "Mock";

      if (polygonKey) {
        try {
          let url = "";
          if (cat.slug === "forex") {
            url = `https://api.polygon.io/v2/snapshot/locale/global/markets/forex/tickers/C:GBPUSD?apiKey=${polygonKey}`;
          } else if (cat.slug === "crypto") {
            url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD?apiKey=${polygonKey}`;
          } else {
            const sym = cat.ticker === "XAUUSD" ? "C:XAUUSD" : "I:SPX";
            url = `https://api.polygon.io/v2/aggs/ticker/${sym}/prev?adjusted=true&apiKey=${polygonKey}`;
          }

          const res = await fetch(url, { next: { revalidate: 60 } });
          if (res.ok) {
            const json = await res.json();
            if (json.ticker) {
              price = json.ticker.lastTrade?.p || json.ticker.day?.c || json.ticker.lastQuote?.a || 0;
              changePercent = json.ticker.todaysChangePerc || 0;
              source = "Polygon.io";
            } else if (json.results && json.results[0]) {
              const r = json.results[0];
              price = r.c || 0;
              const open = r.o || price;
              changePercent = open > 0 ? ((price - open) / open) * 100 : 0;
              source = "Polygon.io";
            }
          }
        } catch (err) {
          console.error(`Error fetching category snapshot for ${cat.slug}:`, err);
        }
      }

      // Fallbacks
      if (price === 0) {
        const fallbacks: Record<string, { price: number; changePercent: number }> = {
          forex: { price: 1.2845, changePercent: 0.15 },
          commodities: { price: 2384.50, changePercent: 0.85 },
          indices: { price: 5480.20, changePercent: 0.42 },
          crypto: { price: 68420.00, changePercent: 2.45 },
        };
        const fb = fallbacks[cat.slug];
        price = fb.price;
        changePercent = fb.changePercent;
      }

      results[cat.slug] = {
        category: cat.slug,
        ticker: cat.ticker,
        label: cat.label,
        price: parseFloat(price.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        source,
      };
    })
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    categories: results,
  });
}
