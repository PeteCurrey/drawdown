import { NextResponse } from "next/server";
import { 
  getInsiderTransactions, 
  getCongressionalTrading, 
  getEconomicCalendar,
  getMarketSentiment,
  getSocialSentiment,
  getNewsSentiment
} from "@/lib/market";
import { generateIntelligenceSignals } from "@/lib/intelligence-ai";

/**
 * BACKGROUND WORKER: MARKET DATA SYNC
 * This endpoint should be triggered by a Vercel Cron job or manual trigger.
 * It populates the cache for high-signal data points to ensure zero-latency
 * for end users and dashboard components.
 */
export async function GET(req: Request) {
  // Simple auth check for internal trigger
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await Promise.allSettled([
      // 1. Insider Flow (Top symbols)
      getInsiderTransactions("NVDA"),
      getInsiderTransactions("AAPL"),
      getInsiderTransactions("TSLA"),
      getInsiderTransactions("MSFT"),
      
      // 2. Political Flow
      getCongressionalTrading(),
      
      // 3. Market Awareness
      getEconomicCalendar(),
      getMarketSentiment(),
      getSocialSentiment("NVDA"),
      getSocialSentiment("TSLA"),
      getNewsSentiment("AAPL"),
      getNewsSentiment("NVDA"),

      // 4. AI Analysis
      generateIntelligenceSignals()
    ]);

    const stats = {
      total: results.length,
      success: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };

    return NextResponse.json({
      message: "Market Sync Complete",
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "Sync Failed",
      error: error.message
    }, { status: 500 });
  }
}
