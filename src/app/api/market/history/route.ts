import { NextRequest, NextResponse } from "next/server";
import { getMarketHistory } from "@/lib/market";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "GBPUSD";
  const interval = searchParams.get("interval") || "1h";
  const outputsize = parseInt(searchParams.get("outputsize") || "150");

  try {
    const history = await getMarketHistory(symbol, interval, outputsize);
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
    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("API Market History Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
