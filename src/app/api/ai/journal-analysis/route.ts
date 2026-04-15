import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
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

    if (!trades || trades.length < 5) {
      return NextResponse.json({ 
        analysis: "Log at least 5 trades for Pete's AI to find your edge. Currently, we don't have enough data to give you an honest breakdown." 
      });
    }

    // 2. Format trades for the prompt
    const tradeSummary = trades.map(t => `- ${t.date}: ${t.symbol} ${t.type} (${t.pnl_amount}). Feel: ${t.feeling}. Strategy: ${t.strategy}`).join('\n');

    const systemPrompt = `
      ${PETES_VOICE_PROFILE}
      
      TASK: You are analyzing a trader's journal. Your goal is to find "leaks" (where they lose money due to psychology or timing) and "strengths" (where they have an edge).
      
      Direct, blunt, risk-focused advice. UK English.
      Structure:
      - The Hard Truth (one sentence summary)
      - Your Edge (where they win)
      - The Leak (where they lose)
      - Tomorrow's Discipline (one specific rule change)
    `;

    const userPrompt = `
      Traders recent history:
      ${tradeSummary}
    `;

    const analysis = await getAnalysis(userPrompt, systemPrompt, 'journal_analysis');

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error("Journal Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
