import { NextResponse } from "next/server";

export const revalidate = 14400; // 4 hours

export async function GET() {
  const polygonKey = process.env.POLYGON_API_KEY ?? "";
  
  if (!polygonKey) {
    return NextResponse.json({
      source: "Mock Data",
      upcoming: [
        { ticker: "NVDA", name: "NVIDIA Corp", date: "2026-08-20", time: "After Hours", estimateEps: "$0.64" },
        { ticker: "AAPL", name: "Apple Inc", date: "2026-08-08", time: "After Hours", estimateEps: "$1.34" },
        { ticker: "TSLA", name: "Tesla Inc", date: "2026-08-15", time: "After Hours", estimateEps: "$0.48" },
        { ticker: "AMZN", name: "Amazon.com Inc", date: "2026-08-10", time: "After Hours", estimateEps: "$1.02" }
      ]
    });
  }

  try {
    const url = `https://api.polygon.io/v2/reference/news?limit=6&apiKey=${polygonKey}`;
    const res = await fetch(url, { next: { revalidate: 14400 } });
    if (res.ok) {
      const data = await res.json();
      const newsItems = (data.results || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.article_url,
        publishedAt: item.published_utc,
        publisher: item.publisher?.name || "Polygon News",
        tickers: item.tickers || [],
        summary: item.description,
      }));
      return NextResponse.json({
        source: "Polygon.io Ticker News",
        news: newsItems
      });
    }
  } catch (err) {
    console.error("Error fetching Polygon news/earnings:", err);
  }

  return NextResponse.json({
    source: "Fallback Data",
    upcoming: [
      { ticker: "NVDA", name: "NVIDIA Corp", date: "2026-08-20", time: "After Hours", estimateEps: "$0.64" },
      { ticker: "AAPL", name: "Apple Inc", date: "2026-08-08", time: "After Hours", estimateEps: "$1.34" },
      { ticker: "TSLA", name: "Tesla Inc", date: "2026-08-15", time: "After Hours", estimateEps: "$0.48" }
    ]
  });
}
