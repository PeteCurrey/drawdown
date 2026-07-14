import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const symbol = searchParams.get("symbol");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");
    const limit = parseInt(searchParams.get("limit") ?? "200", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    let query = (supabase as any)
      .from("trade_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (symbol) query = query.eq("symbol", symbol);
    if (from_date) query = query.gte("entry_time", from_date);
    if (to_date) query = query.lte("entry_time", to_date);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ entries: data ?? [] });
  } catch (e: any) {
    console.error("GET /api/journal/trade-entries error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    // Validate required fields
    const required = [
      "symbol",
      "direction",
      "entry_price",
      "stop_loss",
      "position_size_lots",
      "entry_time",
      "trading_day",
    ];
    const missing = required.filter(
      (f) => body[f] === undefined || body[f] === null || body[f] === ""
    );
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Strip user_id from body — always use auth session
    const { user_id: _ignored, ...rest } = body;

    const { data, error } = await (supabase as any)
      .from("trade_entries")
      .insert({ ...rest, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/journal/trade-entries error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
