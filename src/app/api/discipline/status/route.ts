import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readBadgeStatus } from "@/lib/discipline-badge-service";

/**
 * GET /api/discipline/status
 * Returns current badge tier for the authenticated user.
 * Used by profile page and journal header for fast reads.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const status = await readBadgeStatus(user.id);
    return NextResponse.json(status);
  } catch (e: any) {
    console.error("GET /api/discipline/status error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
