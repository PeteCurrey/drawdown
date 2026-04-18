import { NextRequest, NextResponse } from "next/server";
import { getMarketPrices } from "@/lib/market";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") || ["GBP/USD", "EUR/USD", "BTC/USD", "FTSE"];

  try {
    const prices = await getMarketPrices(symbols);
    return NextResponse.json(prices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
