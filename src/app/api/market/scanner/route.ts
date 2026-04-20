import { NextRequest, NextResponse } from "next/server";
import { getMarketHistory } from "@/lib/market";
import { identifyMSS } from "@/lib/scanner";

const SCAN_SYMBOLS = [
  "GBPUSD", "EURUSD", "USDJPY", "XAUUSD", "BTCUSD", "UK100", "SPX500"
];

export async function GET(request: NextRequest) {
  try {
    const results = await Promise.all(SCAN_SYMBOLS.map(async (symbol) => {
      const history = await getMarketHistory(symbol, "1h", 100);
      const signals = identifyMSS(history);
      
      // Update symbol from "ACTIVE" to real symbol
      return signals.map(s => ({ ...s, symbol }));
    }));

    // Flatten and take most recent 10 signals
    const flattened = results.flat()
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return NextResponse.json(flattened);
  } catch (error: any) {
    console.error("Scanner API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
