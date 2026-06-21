import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/journal/trade-entries/[id]">
) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await (supabase as any)
      .from("trade_entries")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ entry: data });
  } catch (e: any) {
    console.error("GET /api/journal/trade-entries/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/journal/trade-entries/[id]">
) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Strip immutable fields
    const { user_id: _uid, id: _id, created_at: _ca, ...updates } = body;

    const { data, error } = await (supabase as any)
      .from("trade_entries")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ entry: data });
  } catch (e: any) {
    console.error("PUT /api/journal/trade-entries/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/journal/trade-entries/[id]">
) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await (supabase as any)
      .from("trade_entries")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE /api/journal/trade-entries/[id] error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
