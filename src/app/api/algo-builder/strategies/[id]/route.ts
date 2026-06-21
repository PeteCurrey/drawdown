import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── PATCH — rename / toggle favourite ────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["name", "is_favourite", "version"] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) patch[k] = body[k];
  }

  if (patch.name && (String(patch.name).trim().length < 3 || String(patch.name).trim().length > 60)) {
    return NextResponse.json({ error: "Name must be 3–60 characters." }, { status: 400 });
  }

  const { data, error } = await (supabase as any)
    .from("algo_strategies")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)          // RLS + belt-and-suspenders
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ strategy: data });
}

// ─── DELETE — remove a saved strategy ────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await (supabase as any)
    .from("algo_strategies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
