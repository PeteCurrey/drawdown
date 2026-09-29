import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSignalEligibleForProduction } from "@/lib/data-freshness-policy";

export const revalidate = 30; // 30-second cache

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  return createClient(url, key);
}

/**
 * Public preview endpoint for Signal Centre marketing hero section.
 * STRICT ELIGIBILITY:
 * Returns ONLY real, active, non-expired, verified signals from the database.
 * Never returns mock, test, or fabricated signals.
 */
export async function GET() {
  try {
    const supabase = getSupabase();
    const nowIso = new Date().toISOString();

    const { data: rawSignals, error } = await supabase
      .from("signals")
      .select("id, instrument, timeframe, bias, confluence_score, dcs_score, entry_price, stop_loss, take_profit_1, catalyst_event, created_at, expires_at, is_active, is_test, data_classification")
      .eq("is_active", true)
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
      .gt("expires_at", nowIso)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !rawSignals) {
      return NextResponse.json({ signals: [] });
    }

    const nowMs = Date.now();
    const eligibleSignals = rawSignals
      .filter((s: any) => isSignalEligibleForProduction(s, nowMs))
      .slice(0, 3)
      .map((s: any) => ({
        id: s.id,
        instrument: s.instrument,
        timeframe: s.timeframe,
        bias: s.bias,
        dcs: s.dcs_score || Math.round((s.confluence_score / 10) * 100),
        catalyst: s.catalyst_event?.event || "Multi-Timeframe Technical Confluence",
        created_at: s.created_at,
        expires_at: s.expires_at,
      }));

    return NextResponse.json({ signals: eligibleSignals });
  } catch (err) {
    console.error("[marketing-preview] Error fetching signals:", err);
    return NextResponse.json({ signals: [] });
  }
}
