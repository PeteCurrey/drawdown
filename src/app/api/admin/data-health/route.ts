import { NextResponse } from "next/server";
import { calculateSystemHealth } from "@/lib/data-health";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/data-health
 * Authenticated admin endpoint delivering canonical system health JSON.
 */
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return guard.error;
  }

  try {
    const health = await calculateSystemHealth();
    return NextResponse.json(health);
  } catch (err: any) {
    console.error("[api/admin/data-health] Failed to calculate health:", err);
    return NextResponse.json({ error: err.message || "Failed to calculate system health" }, { status: 500 });
  }
}
