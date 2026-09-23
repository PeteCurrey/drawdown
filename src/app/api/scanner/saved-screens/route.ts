import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await (supabase as any)
      .from("saved_screens")
      .select("id, name, filter_json, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ screens: data ?? [] });
  } catch (error: any) {
    console.error("GET /api/scanner/saved-screens error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, filter_json } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 80) {
      return NextResponse.json(
        { error: "Valid screen name (1-80 characters) is required" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("saved_screens")
      .insert({
        user_id: user.id,
        name: name.trim(),
        filter_json: filter_json ?? {},
      })
      .select("id, name, filter_json, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ screen: data });
  } catch (error: any) {
    console.error("POST /api/scanner/saved-screens error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Screen ID required" }, { status: 400 });
    }

    const { error } = await (supabase as any)
      .from("saved_screens")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/scanner/saved-screens error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
