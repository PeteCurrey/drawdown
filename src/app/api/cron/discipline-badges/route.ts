import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { evaluateAndPersistBadge } from "@/lib/discipline-badge-service";

/**
 * POST /api/cron/discipline-badges
 * Weekly cron job — recalculates discipline scores for all active journal users.
 * Protected by CRON_SECRET environment variable.
 *
 * Set up in vercel.json:
 *   { "path": "/api/cron/discipline-badges", "schedule": "0 3 * * 0" }
 *   (Every Sunday at 03:00 UTC)
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();

    // Get all users who have at least 1 closed trade entry in the last 90 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const { data: activeUsers, error } = await (supabase as any)
      .from("trade_entries")
      .select("user_id")
      .eq("status", "CLOSED")
      .gte("trading_day", cutoff.toISOString().slice(0, 10));

    if (error) throw new Error(error.message);

    // Deduplicate user IDs
    const userIds: string[] = Array.from(
      new Set((activeUsers ?? []).map((r: any) => r.user_id as string))
    );

    const results: { userId: string; tier: string | null; error?: string }[] = [];

    for (const userId of userIds) {
      try {
        const status = await evaluateAndPersistBadge(userId);
        results.push({ userId, tier: status.tier });
      } catch (e: any) {
        results.push({ userId, tier: null, error: e.message });
      }
    }

    const processed = results.length;
    const awarded   = results.filter((r) => r.tier !== null).length;
    const errors    = results.filter((r) => r.error).length;

    console.log(`[discipline-badges cron] Processed ${processed}, awarded ${awarded}, errors ${errors}`);

    return NextResponse.json({ processed, awarded, errors });
  } catch (e: any) {
    console.error("POST /api/cron/discipline-badges error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
