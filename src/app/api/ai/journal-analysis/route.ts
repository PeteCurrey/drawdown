import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";
import { Database } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Fetch user's recent trades
    const { data: trades, error: tradesError } = await supabase
      .from('trade_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50);

    if (tradesError) throw tradesError;

    if (!trades || trades.length < 3) {
      return NextResponse.json({ 
        analysis: "Look, I can't give you an honest breakdown with only one or two trades. Log at least 3-5 sessions. Once the data starts talking, we'll find your edge. For now, focus on the process, not the outcome." 
      });
    }

    // 2. Format trades for the prompt with emotional context
    const tradeSummary = trades.map(t => {
      const pnlSign = (t.pnl_amount || 0) >= 0 ? "+" : "";
      return `- [${new Date(t.date).toLocaleDateString()}] ${t.symbol} ${t.type}: ${pnlSign}£${t.pnl_amount?.toFixed(2)} (${t.pnl_percent?.toFixed(2)}%). Feel: ${t.feeling}. Strategy: ${t.strategy}. Session: ${t.session}. Notes: ${t.notes || 'None'}`;
    }).join('\n');

    const systemPrompt = `
      ${PETES_VOICE_PROFILE}
      
      CONTEXT: You are "Pete", checking a trader's performance logs. 
      TASK: Analyze the provided trade history. Your goal is to be brutal but constructive. 
      
      Look for:
      - Sessional bias: Are they losing in New York but winning in London?
      - Emotional leaks: Are trades logged as "FOMO" or "Anxious" consistently losing?
      - Strategy drift: Are they trading a "Breakout" when the market is clearly ranging?
      
      REQUIRED STRUCTURE:
      ## THE HARD TRUTH
      [A blunt, one-sentence assessment of their current state.]
      
      ## YOUR EDGE
      [Where the data says they are actually making money.]
      
      ## THE LEAK
      [The specific psychological or technical habit that is killing their equity curve.]
      
      ## DISCIPLINE FOR TOMORROW
      [One specific, actionable rule they MUST follow in their next session.]
    `;

    const userPrompt = `
      Traders recent history (Last ${trades.length} trades):
      ${tradeSummary}
      
      Pete, give me the rundown. Don't waffle.
    `;

    const analysis = await getAnalysis(userPrompt, systemPrompt, 'journal_analysis');

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error("Journal Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
