import { NextRequest, NextResponse } from "next/server";
import { createClient, createInternalSupabase } from "@/lib/supabase/server";

const TIER_WEIGHT: Record<string, number> = {
  free: 0, foundation: 1, edge: 2, floor: 3,
};

// ─── GET — list user's saved strategies ──────────────────────────────────────
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: strategies, error } = await supabase
    .from("algo_strategies" as any)
    .select("*")
    .eq("user_id", user.id)
    .order("is_favourite", { ascending: false })
    .order("created_at",   { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ strategies: strategies ?? [] });
}

// ─── POST — save a new strategy ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Tier check (floor only)
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier   = (profile as any)?.subscription_tier as string ?? "free";
  if ((TIER_WEIGHT[tier] ?? 0) < 3) {
    return NextResponse.json({ error: "Floor subscription required." }, { status: 403 });
  }

  // Count existing strategies — enforce 20-strategy limit at API level
  const { count } = await supabase
    .from("algo_strategies" as any)
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= 20) {
    return NextResponse.json(
      { error: "Strategy library full (20/20). Delete a strategy to save more." },
      { status: 409 }
    );
  }

  const body = await req.json();
  const { name, description, language, code, instrument, timeframe } = body;

  // Validate
  if (!name || name.trim().length < 3 || name.trim().length > 60) {
    return NextResponse.json({ error: "Name must be 3–60 characters." }, { status: 400 });
  }
  if (!code || !language) {
    return NextResponse.json({ error: "Code and language are required." }, { status: 400 });
  }

  const { data: strategy, error } = await supabase
    .from("algo_strategies" as any)
    .insert({
      user_id:    user.id,
      name:       name.trim(),
      description: description?.slice(0, 200) ?? null,
      language,
      code,
      instrument: instrument || null,
      timeframe:  timeframe  || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ strategy }, { status: 201 });
}
