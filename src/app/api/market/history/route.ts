import { NextRequest, NextResponse } from "next/server";
import { getMarketHistory } from "@/lib/market";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "GBPUSD";
  const interval = searchParams.get("interval") || "1h";
  const outputsize = parseInt(searchParams.get("outputsize") || "150");
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;

  try {
    const history = await getMarketHistory(symbol, interval, outputsize, startDate, endDate);
    
    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: "Historical candle data unavailable from upstream providers", history: [] },
        {
          status: 503,
          headers: {
            "x-data-source": "unavailable",
            "x-is-synthetic": "false",
            "x-feed-status": "OFFLINE",
          },
        }
      );
    }

    const formatted = history.map((item: any) => {
      let timeSecs = 0;
      if (typeof item.time === "number") {
        timeSecs = item.time;
      } else {
        timeSecs = Math.floor(new Date(item.time).getTime() / 1000);
      }
      if (Number.isNaN(timeSecs)) {
        timeSecs = Math.floor(Date.now() / 1000);
      }
      return {
        ...item,
        time: timeSecs,
      };
    });

    return NextResponse.json(formatted, {
      headers: {
        "x-data-source": "twelvedata",
        "x-is-synthetic": "false",
        "x-feed-status": "LIVE",
      },
    });
  } catch (error: any) {
    console.error("API Market History Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve market history from live providers", history: [] },
      {
        status: 503,
        headers: {
          "x-data-source": "error",
          "x-is-synthetic": "false",
          "x-feed-status": "ERROR",
        },
      }
    );
  }
}
