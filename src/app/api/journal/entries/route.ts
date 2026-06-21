import { NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createInternalSupabase();
    const { data: { user } } = await (supabase as any).auth.getUser();
    const userId = user?.id ?? body.user_id;
    if (!userId) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { error } = await supabase.from("trade_logs" as any).insert({
      user_id:       userId,
      date:          body.timestamp ?? new Date().toISOString(),
      symbol:        body.instrument,
      type:          body.direction,
      entry_price:   body.entry_price,
      exit_price:    body.stop_loss,
      pnl_amount:    -(body.risk_amount ?? 0),
      pnl_percent:   -(body.risk_percent ?? 0),
      strategy:      "Risk Model",
      notes: JSON.stringify({
        take_profit:          body.take_profit,
        position_size_lots:   body.position_size_lots,
        rr_ratio:             body.rr_ratio,
        account_balance:      body.account_balance,
        atr_value:            body.atr_value,
        spread_cost:          body.spread_cost,
        prop_firm_compliant:  body.prop_firm_compliant,
      }),
    } as any);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    if (!userId) return NextResponse.json({ entries: [] });
    const today = new Date().toISOString().split("T")[0];
    const supabase = createInternalSupabase();
    const { data } = await supabase.from("trade_logs" as any)
      .select("*")
      .eq("user_id", userId)
      .gte("date", `${today}T00:00:00`)
      .order("date", { ascending: false });
    return NextResponse.json({ entries: data ?? [] });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
