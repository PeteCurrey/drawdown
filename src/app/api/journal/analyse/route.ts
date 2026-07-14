import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
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

    const { trades } = await request.json();
    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json({ error: "No trades provided" }, { status: 400 });
    }

    // Format trades for Claude
    const tradeSummary = trades.map((t: any, idx: number) => {
      const pVal = t.pnl_amount !== undefined ? t.pnl_amount : (t.pnl !== undefined ? t.pnl : null);
      const exitVal = t.exit_price !== null && t.exit_price !== undefined ? t.exit_price : 'Open';
      const pnlText = pVal !== null ? `${pVal >= 0 ? '+' : ''}£${Number(pVal).toFixed(2)}` : 'Open';
      
      return `Trade #${idx + 1}:
- Date: ${t.date || (t.entry_time ? new Date(t.entry_time).toLocaleDateString() : new Date(t.created_at).toLocaleDateString())}
- Instrument: ${t.symbol || t.instrument}
- Direction: ${(t.direction || t.type || 'long').toUpperCase()}
- Entry Price: ${t.entry_price}
- Exit Price: ${exitVal}
- P&L: ${pnlText}
- R:R: Planned: ${t.rrr_planned || 'N/A'}, Achieved: ${t.rrr_achieved || 'N/A'}
- Emotion Entry: ${t.emotional_state_entry || 'N/A'}
- Plan Followed: ${t.followed_plan ? 'Yes' : 'No'}
- Session: ${t.session || 'N/A'}
- Setup: ${t.setup_type || 'N/A'}
- Notes: ${t.notes || 'None'}`;
    }).join('\n\n');

    const systemPrompt = `You are a professional trading coach reviewing a trader's journal. Be specific and use the actual data provided. Do not give generic advice. Identify concrete patterns. Keep response under 700 words. Use clear section headings.`;

    const userPrompt = `Analyse these ${trades.length} trades and identify:
1. Win rate and sustainability
2. Emotional patterns vs outcomes  
3. Session performance patterns
4. Whether following the plan correlates with better results
5. The single most important improvement to make

Trades data:
${tradeSummary}`;

    // Get Claude analysis
    const analysisContent = await getAnalysis(userPrompt, systemPrompt, 'journal_analysis');

    // Parse wins and losses for patterns_detected
    const closedTrades = trades.filter((t: any) => t.status === 'closed' || t.exit_price !== null);
    const winCount = closedTrades.filter((t: any) => {
      const p = t.pnl_amount !== undefined ? t.pnl_amount : t.pnl;
      return Number(p || 0) > 0;
    }).length;

    const patterns_detected = {
      trade_count: trades.length,
      wins: winCount,
      losses: closedTrades.length - winCount,
      timestamp: new Date().toISOString()
    };

    const recommendations = {
      primary_focus: "Focus on execution discipline and avoiding emotional trigger setups.",
      generated_at: new Date().toISOString()
    };

    // Save to journal_ai_analysis
    const { error: saveError } = await (supabase as any)
      .from('journal_ai_analysis')
      .insert({
        user_id: user.id,
        analysis_type: 'pattern',
        trade_count: trades.length,
        analysis_content: analysisContent,
        patterns_detected,
        recommendations
      });

    if (saveError) {
      console.error("Save Analysis Error:", saveError);
    }

    return NextResponse.json({ 
      analysis: analysisContent,
      patterns_detected,
      recommendations
    });

  } catch (error: any) {
    console.error("Journal Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
