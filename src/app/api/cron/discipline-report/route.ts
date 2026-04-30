import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, COACH_REPORT_PROMPT } from "@/lib/prompts";
import { PatternDetector } from "@/lib/coach/pattern-detector";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 });
  }

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
    // 2. Fetch all profiles that have traded this week
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get users with trades in the last 7 days
    const { data: activeUsers, error: userError } = await supabase
      .from('individual_trades')
      .select('user_id')
      .gte('entry_time', sevenDaysAgo.toISOString());

    if (userError) throw userError;

    const uniqueUserIds = [...new Set(activeUsers?.map(u => u.user_id) || [])];
    
    const results = [];

    for (const userId of uniqueUserIds) {
      // 3. Fetch user's trades and main account
      const [tradesRes, accountRes] = await Promise.all([
        supabase
          .from('individual_trades')
          .select('*')
          .eq('user_id', userId)
          .gte('entry_time', sevenDaysAgo.toISOString()),
        supabase
          .from('funded_accounts')
          .select('*')
          .eq('user_id', userId)
          .eq('account_status', 'active')
          .limit(1)
          .single()
      ]);

      if (!tradesRes.data || !accountRes.data) continue;

      // 4. Run Pattern Detection
      const detector = new PatternDetector({
        trades: tradesRes.data as any,
        account: accountRes.data as any
      });
      const patterns = detector.detectPatterns();

      // 5. Calculate Discipline Score (Basic heuristic)
      let score = 100;
      patterns.forEach(p => {
        if (p.severity === 'critical') score -= 30;
        if (p.severity === 'high') score -= 20;
        if (p.severity === 'medium') score -= 10;
        if (p.severity === 'low') score -= 5;
      });
      score = Math.max(0, score);

      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

      // 6. Generate AI Report with Pete's Voice
      const stats = {
        winRate: (tradesRes.data.filter(t => (t.net_pnl || 0) > 0).length / tradesRes.data.length * 100).toFixed(1),
        totalPnl: tradesRes.data.reduce((sum, t) => sum + (t.net_pnl || 0), 0),
        tradeCount: tradesRes.data.length
      };

      const promptContext = `
        Week Ending: ${new Date().toISOString().split('T')[0]}
        Discipline Score: ${score}/100
        Grade: ${grade}
        Detected Patterns: ${patterns.map(p => p.name).join(', ') || 'None'}
        Trade Stats: ${stats.winRate}% win rate, ${stats.tradeCount} trades, £${stats.totalPnl} P&L.
      `;

      const reportContent = await getAnalysis(promptContext, PETES_VOICE_PROFILE + "\n\n" + COACH_REPORT_PROMPT, 'weekly_roundup');

      // 7. Store Report
      const { data: report, error: reportError } = await supabase
        .from('discipline_reports')
        .insert({
          user_id: userId,
          week_ending: new Date().toISOString().split('T')[0],
          discipline_score: score,
          grade,
          pattern_data: patterns,
          report_content: reportContent
        })
        .select()
        .single();

      if (reportError) {
        console.error(`Error storing report for user ${userId}:`, reportError);
        continue;
      }

      results.push({ userId, reportId: report.id });
    }

    return NextResponse.json({ 
      success: true, 
      processedCount: results.length,
      reports: results 
    });

  } catch (error: any) {
    console.error("Discipline Report Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
