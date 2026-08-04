import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateAndPersistBadge } from "@/lib/discipline-badge-service";

/**
 * POST /api/discipline/evaluate
 * Recalculates discipline score + badge status for the authenticated user.
 * Called after each trade save, or on-demand from the Journal/Profile page.
 *
 * ⚠ COMPLIANCE NOTE:
 * This endpoint measures process adherence only. It never returns or persists P&L.
 * Badge copy must not imply future profitability.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const status = await evaluateAndPersistBadge(user.id);

    return NextResponse.json({ success: true, status });
  } catch (e: any) {
    console.error("POST /api/discipline/evaluate error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
