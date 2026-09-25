import { NextResponse } from "next/server";
import { STOCK_DATA_V1, buildTreemapData, GICS_SECTORS } from "@/lib/data/stock-sectors";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get("sector") || "All Sectors";

    const treemapData = buildTreemapData(STOCK_DATA_V1, sector);

    // Summary statistics
    const totalMarketCap = STOCK_DATA_V1.reduce((sum, s) => sum + s.marketCap, 0);
    const gainers = STOCK_DATA_V1.filter((s) => (s.change1D ?? 0) > 0).length;
    const losers = STOCK_DATA_V1.filter((s) => (s.change1D ?? 0) < 0).length;
    const unchanged = STOCK_DATA_V1.length - gainers - losers;

    return NextResponse.json({
      sectors: GICS_SECTORS,
      selectedSector: sector,
      stats: {
        totalStocks: STOCK_DATA_V1.length,
        totalMarketCapUSD: totalMarketCap, // in billions
        gainers,
        losers,
        unchanged
      },
      data: treemapData,
      rawStocks: STOCK_DATA_V1
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load sector data" }, { status: 500 });
  }
}
