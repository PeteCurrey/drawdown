import { NextRequest, NextResponse } from "next/server";
import { getMarketHistory, generateFallbackHistory } from "@/lib/market";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "GBPUSD";
  const interval = searchParams.get("interval") || "1h";
  const outputsize = parseInt(searchParams.get("outputsize") || "150");
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;

  try {
    const history = await getMarketHistory(symbol, interval, outputsize, startDate, endDate);
    const isSynthetic = history.length > 0 && Boolean(history[0].is_synthetic);
    const formatted = history.map((item: any) => {
      let timeSecs = 0;
      if (typeof item.time === "number") {
        timeSecs = item.time;
      } else {
        timeSecs = Math.floor(new Date(item.time).getTime() / 1000);
      }
      // Ensure timeSecs is not NaN
      if (Number.isNaN(timeSecs)) {
        timeSecs = Math.floor(Date.now() / 1000);
      }
      return {
        ...item,
        time: timeSecs
      };
    });
    return NextResponse.json(formatted, {
      headers: {
        "x-data-source": isSynthetic ? "synthetic_fallback" : "twelvedata",
        "x-is-synthetic": isSynthetic ? "true" : "false",
        "x-feed-status": isSynthetic ? "UNAVAILABLE" : "LIVE",
      },
    });
  } catch (error: any) {
    console.error("API Market History Error:", error);
    const fallback = generateFallbackHistory(symbol, interval, outputsize).map(b => ({
      ...b,
      is_synthetic: true,
    }));
    return NextResponse.json(fallback, {
      headers: {
        "x-data-source": "synthetic_fallback",
        "x-is-synthetic": "true",
        "x-feed-status": "ERROR",
      },
    });
  }
}
