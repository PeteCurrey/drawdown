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
import { createInternalSupabase } from "@/lib/supabase/server";
import { startCronRun, completeCronRun } from "@/lib/cron-observability";

export async function GET(req: Request) {
  // Simple auth check for internal trigger (Bearer token or ?secret=)
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    Boolean(cronSecret && (authHeader === `Bearer ${cronSecret}` || secret === cronSecret));

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createInternalSupabase();
  const runId = await startCronRun(supabase, {
    jobName: "market-sync",
    endpoint: "/api/cron/market-sync"
  });

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

    await completeCronRun(supabase, runId, {
      status: stats.failed === 0 ? "SUCCESS" : stats.success > 0 ? "SUCCESS" : "FAILED",
      recordsProcessed: stats.success,
      errorMessage: stats.failed > 0 ? `${stats.failed}/${stats.total} tasks rejected` : null,
      metadata: { stats }
    });

    return NextResponse.json({
      message: "Market Sync Complete",
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    await completeCronRun(supabase, runId, {
      status: "FAILED",
      errorMessage: error.message || "Market sync failed"
    });
    return NextResponse.json({
      message: "Sync Failed",
      error: error.message
    }, { status: 500 });
  }
}
