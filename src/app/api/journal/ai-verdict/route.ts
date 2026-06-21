import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FALLBACK_VERDICT = {
  verdict: "REVIEW_NEEDED" as const,
  score: 50,
  headline: "Analysis unavailable",
  what_went_well: "Trade was logged",
  what_to_improve: "Review manually",
  key_lesson: "Continue journalling",
  pattern_flag: null,
};

function tradeResult(pnl: number | null | undefined): string {
  if (pnl === null || pnl === undefined) return "UNKNOWN";
  if (pnl > 0) return "WIN";
  if (pnl < 0) return "LOSS";
  return "BE";
}

function buildUserPrompt(trade: any): string {
  const result = tradeResult(trade.pnl_amount);
  const confluences = Array.isArray(trade.confluences)
    ? trade.confluences.join(", ")
    : trade.confluences ?? "none listed";
  const mistakes = Array.isArray(trade.mistakes)
    ? trade.mistakes.join(", ")
    : trade.mistakes ?? "none listed";

  return `Trade Details:
- Symbol: ${trade.symbol ?? "N/A"}
- Direction: ${trade.direction ?? "N/A"}
- Result: ${result}
- Entry: ${trade.entry_price ?? "N/A"} | Stop: ${trade.stop_loss ?? "N/A"} | TP: ${trade.take_profit ?? "N/A"} | Exit: ${trade.exit_price ?? "N/A"}
- PnL: ${trade.pnl_amount ?? "N/A"} | RR Planned: ${trade.rr_planned ?? "N/A"} | RR Achieved: ${trade.rr_achieved ?? "N/A"}
- Risk %: ${trade.risk_percent ?? "N/A"} | Lots: ${trade.position_size_lots ?? "N/A"}
- Setup Type: ${trade.setup_type ?? "N/A"}
- Session: ${trade.session ?? "N/A"}
- Market Conditions: ${trade.market_conditions ?? "N/A"}
- Confluences: ${confluences}
- Emotions Before: ${trade.emotions_before ?? "N/A"}
- Rules Followed: ${trade.rules_followed ?? "N/A"}
- Pre-Trade Notes: ${trade.pre_trade_notes ?? "N/A"}
- Post-Trade Notes: ${trade.post_trade_notes ?? "N/A"}
- Mistakes: ${mistakes}

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "verdict": "GOOD_PROCESS" | "POOR_PROCESS" | "MIXED" | "REVIEW_NEEDED",
  "score": <0-100>,
  "headline": "<one sentence summary>",
  "what_went_well": "<specific observation>",
  "what_to_improve": "<specific actionable point>",
  "key_lesson": "<one key takeaway>",
  "pattern_flag": "<pattern name or null>"
}`;
}

function stripFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
}

async function callClaude(trade: any): Promise<any> {
  const systemPrompt =
    "You are an experienced trading coach reviewing a trader's journal entry. You are direct, honest, and constructive. You focus on process over outcome — a losing trade with good process is better than a winning trade with bad process. You never say 'great trade!' for wins or 'bad trade!' for losses. You assess whether the trader followed their edge correctly. Your feedback is specific, not generic.";

  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: buildUserPrompt(trade) }],
  });

  const text = (msg.content[0] as any).text as string;
  return JSON.parse(stripFences(text));
}

function countPatterns(recentTrades: any[]): number {
  // Count trades from the last 30 that share the same pattern_flag as the current verdict
  // We'll compute this after parsing the verdict — caller passes recent_trades
  return recentTrades.length;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { trade_id, trade, recent_trades = [] } = body as {
      trade_id: string;
      trade: any;
      recent_trades: any[];
    };

    if (!trade_id || !trade) {
      return NextResponse.json({ error: "trade_id and trade are required" }, { status: 400 });
    }

    // Attempt to parse Claude response, retry once on failure
    let parsed: any;
    try {
      parsed = await callClaude(trade);
    } catch {
      try {
        parsed = await callClaude(trade);
      } catch {
        parsed = { ...FALLBACK_VERDICT };
      }
    }

    // Validate shape — if critical keys missing, use fallback
    if (
      !parsed ||
      typeof parsed.verdict !== "string" ||
      typeof parsed.score !== "number"
    ) {
      parsed = { ...FALLBACK_VERDICT };
    }

    // Count pattern occurrences from recent 30 trades' ai_verdict fields
    const last30 = recent_trades.slice(0, 30);
    let pattern_count = 0;
    if (parsed.pattern_flag) {
      for (const rt of last30) {
        try {
          const v = typeof rt.ai_verdict === "string" ? JSON.parse(rt.ai_verdict) : rt.ai_verdict;
          if (v?.pattern_flag === parsed.pattern_flag) pattern_count++;
        } catch {
          // skip unparseable
        }
      }
    }

    // Save verdict to trade_entries
    const { error: updateError } = await (supabase as any)
      .from("trade_entries")
      .update({
        ai_verdict: JSON.stringify(parsed),
        ai_verdict_generated_at: new Date().toISOString(),
      })
      .eq("id", trade_id)
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ verdict: parsed, pattern_count });
  } catch (e: any) {
    console.error("POST /api/journal/ai-verdict error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
