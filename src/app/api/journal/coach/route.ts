import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Stats builder ────────────────────────────────────────────────────────────

interface GroupStats {
  trades: number;
  wins: number;
  total_pnl: number;
}

function isWin(t: any): boolean {
  return typeof t.pnl_amount === "number" ? t.pnl_amount > 0 : false;
}

function groupBy<T extends { pnl_amount?: number | null }>(
  arr: T[],
  key: (item: T) => string | null | undefined
): Record<string, GroupStats> {
  const map: Record<string, GroupStats> = {};
  for (const item of arr) {
    const k = key(item) ?? "unknown";
    if (!map[k]) map[k] = { trades: 0, wins: 0, total_pnl: 0 };
    map[k].trades++;
    if (isWin(item)) map[k].wins++;
    map[k].total_pnl += item.pnl_amount ?? 0;
  }
  return map;
}

function toSummaryStats(group: Record<string, GroupStats>) {
  return Object.fromEntries(
    Object.entries(group).map(([k, v]) => [
      k,
      {
        trades: v.trades,
        win_rate: v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : 0,
        avg_pnl: v.trades > 0 ? +(v.total_pnl / v.trades).toFixed(2) : 0,
      },
    ])
  );
}

function buildTradeSummary(trades: any[]) {
  const closed = trades.filter((t) => t.status === "CLOSED" || t.pnl_amount != null);
  const wins = closed.filter(isWin);
  const losses = closed.filter((t) => !isWin(t));

  const gross_profit = wins.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
  const gross_loss = Math.abs(losses.reduce((s, t) => s + (t.pnl_amount ?? 0), 0));
  const profit_factor = gross_loss > 0 ? +(gross_profit / gross_loss).toFixed(2) : null;
  const total_pnl = closed.reduce((s, t) => s + (t.pnl_amount ?? 0), 0);
  const avg_rr_achieved =
    closed.length > 0
      ? +(
          closed.reduce((s, t) => s + (t.rr_achieved ?? 0), 0) / closed.length
        ).toFixed(2)
      : null;
  const avg_rr_planned =
    closed.length > 0
      ? +(
          closed.reduce((s, t) => s + (t.rr_planned ?? 0), 0) / closed.length
        ).toFixed(2)
      : null;

  // Day of week
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const byDayRaw: Record<string, GroupStats> = {};
  for (const t of closed) {
    if (!t.entry_time) continue;
    const dayName = dayNames[new Date(t.entry_time).getDay()];
    if (!byDayRaw[dayName]) byDayRaw[dayName] = { trades: 0, wins: 0, total_pnl: 0 };
    byDayRaw[dayName].trades++;
    if (isWin(t)) byDayRaw[dayName].wins++;
    byDayRaw[dayName].total_pnl += t.pnl_amount ?? 0;
  }
  const by_day = Object.fromEntries(
    Object.entries(byDayRaw).map(([k, v]) => [
      k,
      {
        trades: v.trades,
        win_rate: v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : 0,
      },
    ])
  );

  // Recurring mistakes
  const mistakeCounts: Record<string, number> = {};
  for (const t of closed) {
    const mistakes: string[] = Array.isArray(t.mistakes) ? t.mistakes : [];
    for (const m of mistakes) {
      mistakeCounts[m] = (mistakeCounts[m] ?? 0) + 1;
    }
  }
  const recurring_mistakes = Object.entries(mistakeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([mistake, count]) => ({ mistake, count }));

  // Rules followed vs broken win rate
  const rulesFollowed = closed.filter((t) => t.rules_followed === true || t.rules_followed === "true");
  const rulesBroken = closed.filter((t) => t.rules_followed === false || t.rules_followed === "false");
  const rules_followed_winrate =
    rulesFollowed.length > 0
      ? Math.round((rulesFollowed.filter(isWin).length / rulesFollowed.length) * 100)
      : null;
  const rules_broken_winrate =
    rulesBroken.length > 0
      ? Math.round((rulesBroken.filter(isWin).length / rulesBroken.length) * 100)
      : null;

  // Best 2-combo confluence by win rate (min 5 trades)
  const comboCounts: Record<string, { trades: number; wins: number }> = {};
  for (const t of closed) {
    const c: string[] = Array.isArray(t.confluences) ? t.confluences : [];
    for (let i = 0; i < c.length; i++) {
      for (let j = i + 1; j < c.length; j++) {
        const key = [c[i], c[j]].sort().join(" + ");
        if (!comboCounts[key]) comboCounts[key] = { trades: 0, wins: 0 };
        comboCounts[key].trades++;
        if (isWin(t)) comboCounts[key].wins++;
      }
    }
  }
  const eligible = Object.entries(comboCounts).filter(([, v]) => v.trades >= 5);
  const best_confluence_combo =
    eligible.length > 0
      ? eligible.sort(([, a], [, b]) => b.wins / b.trades - a.wins / a.trades)[0][0]
      : null;

  // Worst emotion/mistake pattern
  const emotionStats: Record<string, GroupStats> = {};
  for (const t of closed) {
    const em = t.emotions_before ?? "unknown";
    if (!emotionStats[em]) emotionStats[em] = { trades: 0, wins: 0, total_pnl: 0 };
    emotionStats[em].trades++;
    if (isWin(t)) emotionStats[em].wins++;
    emotionStats[em].total_pnl += t.pnl_amount ?? 0;
  }
  const worstEmotion = Object.entries(emotionStats)
    .filter(([, v]) => v.trades >= 3)
    .sort(([, a], [, b]) => a.wins / a.trades - b.wins / b.trades)[0];
  const worst_pattern = worstEmotion
    ? `${worstEmotion[0]} (${Math.round((worstEmotion[1].wins / worstEmotion[1].trades) * 100)}% win rate over ${worstEmotion[1].trades} trades)`
    : null;

  // Recent 10 AI verdict headlines
  const recent_10_verdicts = trades
    .slice(0, 10)
    .map((t) => {
      try {
        const v = typeof t.ai_verdict === "string" ? JSON.parse(t.ai_verdict) : t.ai_verdict;
        return v?.headline ?? null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return {
    total_trades: closed.length,
    overall_win_rate:
      closed.length > 0
        ? Math.round((wins.length / closed.length) * 100)
        : 0,
    profit_factor,
    total_pnl: +total_pnl.toFixed(2),
    avg_rr_achieved,
    avg_rr_planned,
    by_setup: toSummaryStats(groupBy(closed, (t) => t.setup_type)),
    by_session: toSummaryStats(groupBy(closed, (t) => t.session)),
    by_symbol: toSummaryStats(groupBy(closed, (t) => t.symbol)),
    by_emotion: toSummaryStats(groupBy(closed, (t) => t.emotions_before)),
    by_day,
    recurring_mistakes,
    rules_followed_winrate,
    rules_broken_winrate,
    best_confluence_combo,
    worst_pattern,
    recent_10_verdicts,
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      message,
      history = [],
      trades = [],
    } = body as {
      message: string;
      history: Array<{ role: "user" | "assistant"; content: string }>;
      trades: any[];
    };

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const summary = buildTradeSummary(trades);

    const systemPrompt = `You are an elite trading coach with 20 years of experience. You have live access to this trader's complete trading statistics and history. You are direct, honest, and actionable — you don't sugarcoat but you're constructive and encouraging about what's working. You know this trader's specific patterns, strengths, and weaknesses from their data. Reference specific numbers from their data in every response. Keep responses focused — max 200 words unless asked for detail. Never give generic trading advice. Everything must reference their actual statistics.

Current Trader Statistics:
${JSON.stringify(summary, null, 2)}`;

    // Build message history (last 10 turns) + new user message
    const recentHistory = history.slice(-10);
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...recentHistory,
      { role: "user", content: message },
    ];

    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      system: systemPrompt,
      messages,
    });

    const reply = (msg.content[0] as any).text as string;

    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error("POST /api/journal/coach error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
