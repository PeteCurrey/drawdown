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

    // 1. Fetch user's last 20 closed trades from 'trades' table
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'closed')
      .order('exit_time', { ascending: false })
      .limit(20);

    if (tradesError) throw tradesError;

    const typedTrades = (trades || []) as any[];

    if (typedTrades.length < 5) {
      return NextResponse.json({ 
        error: `Need at least 5 completed trades. You currently have ${typedTrades.length}.` 
      }, { status: 400 });
    }

    // 2. Fetch user's profile details to get currency setting
    const { data: profile } = await supabase
      .from('profiles')
      .select('currency')
      .eq('id', user.id)
      .single();

    const currency = (profile as any)?.currency || "GBP";

    // 3. Format trades as structured JSON
    const formattedTrades = typedTrades.map(t => ({
      id: t.id,
      instrument: t.instrument,
      direction: t.direction,
      entry_price: Number(t.entry_price),
      exit_price: t.exit_price ? Number(t.exit_price) : null,
      stop_loss: Number(t.stop_loss),
      take_profit: t.take_profit ? Number(t.take_profit) : null,
      position_size: Number(t.position_size),
      entry_time: t.entry_time,
      exit_time: t.exit_time,
      session: t.session,
      risk_amount: Number(t.risk_amount),
      risk_percentage: Number(t.risk_percentage),
      account_balance_at_entry: Number(t.account_balance_at_entry),
      pnl: t.pnl ? Number(t.pnl) : null,
      pnl_percentage: t.pnl_percentage ? Number(t.pnl_percentage) : null,
      rrr_planned: t.rrr_planned ? Number(t.rrr_planned) : null,
      rrr_achieved: t.rrr_achieved ? Number(t.rrr_achieved) : null,
      emotional_state_entry: t.emotional_state_entry,
      emotional_state_exit: t.emotional_state_exit,
      followed_plan: t.followed_plan,
      setup_type: t.setup_type,
      timeframe_analysis: t.timeframe_analysis,
      entry_reason: t.entry_reason,
      exit_reason: t.exit_reason,
      notes: t.notes,
      mistakes: t.mistakes,
      tags: t.tags
    }));

    // Find the date of the first trade to calculate experience duration
    const { data: firstTrade } = await supabase
      .from('trades')
      .select('entry_time')
      .eq('user_id', user.id)
      .order('entry_time', { ascending: true })
      .limit(1);

    let durationText = "just started";
    const typedFirstTrade = (firstTrade || []) as any[];
    if (typedFirstTrade.length > 0 && typedFirstTrade[0].entry_time) {
      const diffMs = Date.now() - new Date(typedFirstTrade[0].entry_time).getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      durationText = `${diffDays} days`;
    }

    const systemPrompt = `You are a professional trading coach reviewing a trader's journal. Analyse the trades provided and identify:
1. Win rate and whether it is sustainable
2. Average R:R planned vs achieved
3. Emotional patterns — which emotional states correlate with wins vs losses
4. Whether following the plan correlates with better outcomes
5. Session performance — which trading sessions produce best results
6. Setup type performance — which setups work best
7. The single most important thing this trader should focus on to improve

Be specific and use the actual data provided.
Do not give generic advice.
Format your response with clear sections and bullet points.
Keep your total response under 600 words.`;

    const userPrompt = `Here are my last ${typedTrades.length} trades:
${JSON.stringify(formattedTrades, null, 2)}

My account currency is ${currency}.
I have been trading for ${durationText}.

Please analyse my trading and identify patterns.`;

    // 4. Run Claude Analysis
    const analysisContent = await getAnalysis(userPrompt, systemPrompt, 'journal_analysis');

    // 5. Generate simple recommendation summary JSON fields to store in DB
    const recommendations = {
      primary_focus: "Focus on plan compliance and maintaining risk boundaries.",
      generated_at: new Date().toISOString()
    };
    const patterns_detected = {
      trade_count: typedTrades.length,
      wins: typedTrades.filter(t => (Number(t.pnl) || 0) > 0).length,
      losses: typedTrades.filter(t => (Number(t.pnl) || 0) <= 0).length
    };

    // 6. Save analysis to public.journal_ai_analysis
    const { error: saveError } = await (supabase as any)
      .from('journal_ai_analysis')
      .insert({
        user_id: user.id,
        analysis_type: 'pattern',
        trade_ids: typedTrades.map(t => t.id),
        analysis_content: analysisContent,
        patterns_detected,
        recommendations
      });

    if (saveError) throw saveError;

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

// Support fetching history of past analyses!
export async function GET(request: NextRequest) {
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

    const { data: history, error: historyError } = await supabase
      .from('journal_ai_analysis')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (historyError) throw historyError;

    return NextResponse.json({ history: history || [] });

  } catch (error: any) {
    console.error("Journal History Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
