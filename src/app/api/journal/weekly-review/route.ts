import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Parse "2026-W24" → { monday: "2026-06-08", friday: "2026-06-12" }
function parseWeek(week: string): { monday: string; friday: string } | null {
  const match = week.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const weekNum = parseInt(match[2], 10);

  // ISO 8601: Week 1 contains the first Thursday of the year.
  // Find Jan 4 (always in week 1), then go back to Monday of that week.
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // Mon=1 … Sun=7
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - dayOfWeek + 1);

  const monday = new Date(week1Monday);
  monday.setDate(week1Monday.getDate() + (weekNum - 1) * 7);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { monday: fmt(monday), friday: fmt(friday) };
}

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const week = new URL(request.url).searchParams.get("week");
    if (!week) {
      return NextResponse.json({ error: "week query param required (e.g. 2026-W24)" }, { status: 400 });
    }

    const { data, error } = await (supabase as any)
      .from("weekly_reviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("week", week)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ review: data ?? null });
  } catch (e: any) {
    console.error("GET /api/journal/weekly-review error:", e);
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
    const { week } = body as { week: string };

    if (!week) {
      return NextResponse.json({ error: "week is required (e.g. 2026-W24)" }, { status: 400 });
    }

    const range = parseWeek(week);
    if (!range) {
      return NextResponse.json({ error: "Invalid week format. Use YYYY-Www" }, { status: 400 });
    }

    const { monday, friday } = range;

    // Fetch all trade_entries in the week range
    const { data: trades, error: tradesError } = await (supabase as any)
      .from("trade_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("entry_time", `${monday}T00:00:00.000Z`)
      .lte("entry_time", `${friday}T23:59:59.999Z`)
      .order("entry_time", { ascending: true });

    if (tradesError) throw tradesError;

    const tradeList: any[] = trades ?? [];

    if (tradeList.length < 3) {
      return NextResponse.json({ review: null, reason: "insufficient_data" });
    }

    // Build trade summary for Claude
    const closed = tradeList.filter((t) => t.pnl_amount != null);
    const wins = closed.filter((t) => t.pnl_amount > 0);
    const losses = closed.filter((t) => t.pnl_amount <= 0);
    const total_pnl = closed.reduce((s: number, t: any) => s + (t.pnl_amount ?? 0), 0);
    const win_rate = closed.length > 0 ? Math.round((wins.length / closed.length) * 100) : 0;
    const avg_rr =
      closed.length > 0
        ? +(closed.reduce((s: number, t: any) => s + (t.rr_achieved ?? 0), 0) / closed.length).toFixed(2)
        : 0;

    const setupBreakdown: Record<string, number> = {};
    for (const t of closed) {
      const s = t.setup_type ?? "unknown";
      setupBreakdown[s] = (setupBreakdown[s] ?? 0) + 1;
    }

    const tradeSummary = `Week: ${week} (${monday} to ${friday})
Total trades: ${tradeList.length} | Closed: ${closed.length} | Wins: ${wins.length} | Losses: ${losses.length}
Win Rate: ${win_rate}% | Total PnL: ${total_pnl.toFixed(2)} | Avg RR Achieved: ${avg_rr}
Setups: ${JSON.stringify(setupBreakdown)}
Trade details:
${closed
  .map(
    (t: any) =>
      `- ${t.symbol} ${t.direction} | ${t.pnl_amount > 0 ? "WIN" : "LOSS"} | PnL: ${t.pnl_amount} | RR: ${t.rr_achieved ?? "N/A"} | Setup: ${t.setup_type ?? "N/A"} | Mistakes: ${Array.isArray(t.mistakes) ? t.mistakes.join(", ") : "none"}`
  )
  .join("\n")}`;

    const systemPrompt = `You are an elite trading coach delivering a weekly performance review. Be direct, honest, and constructive. Focus on process patterns, not individual outcomes. Identify what the trader is doing consistently well and what needs work. Grade fairly — a week with good process but bad luck deserves a B, not a D.`;

    const userPrompt = `Review this trader's week and respond ONLY with valid JSON (no markdown):
${tradeSummary}

{
  "week_headline": "<one punchy sentence summarising the week>",
  "overall_grade": "A" | "B" | "C" | "D",
  "pnl_summary": "<1-2 sentences on PnL context>",
  "what_worked": ["<specific point>", "<specific point>"],
  "what_didnt": ["<specific point>", "<specific point>"],
  "pattern_of_week": "<key recurring pattern observed>",
  "one_focus_for_next_week": "<single actionable priority>",
  "momentum": "IMPROVING" | "STABLE" | "DECLINING"
}`;

    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = (msg.content[0] as any).text as string;
    let parsed: any;
    try {
      parsed = JSON.parse(stripFences(raw));
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    // Upsert to weekly_reviews
    const reviewPayload = {
      user_id: user.id,
      week,
      week_start: monday,
      week_end: friday,
      trade_count: tradeList.length,
      ...parsed,
      generated_at: new Date().toISOString(),
    };

    const { data: saved, error: upsertError } = await (supabase as any)
      .from("weekly_reviews")
      .upsert(reviewPayload, { onConflict: "user_id,week" })
      .select()
      .single();

    if (upsertError) throw upsertError;

    return NextResponse.json({ review: saved });
  } catch (e: any) {
    console.error("POST /api/journal/weekly-review error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
