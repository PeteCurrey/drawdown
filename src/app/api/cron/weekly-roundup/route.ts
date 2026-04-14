import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, WEEKLY_ROUNDUP_PROMPT } from "@/lib/prompts";
import { sendNewsletter } from "@/lib/resend";

export async function GET(request: NextRequest) {
  // 1. Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV === 'production') {
      return new Response('Unauthorized', { status: 401 });
    }
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
    // 2. Fetch context for the week (This would typically call a market data service)
    const weeklyNewsContext = `
      - The Federal Reserve kept rates steady but hinted at a cut in September.
      - Apple reported record services revenue, pushing the stock to all-time highs.
      - Oil prices dropped 4% on concerns of slowing global demand.
      - GBPUSD ended the week lower following weaker-than-expected UK inflation data.
    `;

    const weeklyPerformance = `
      - FTSE 100: +0.2%
      - S&P 500: +1.5%
      - GBPUSD: -0.8%
      - BTCUSD: +3.4%
    `;

    const promptContext = `
      This Week's Market Performance: ${weeklyPerformance}
      This Week's Key Stories: ${weeklyNewsContext}
      Current Time: ${new Date().toUTCString()} (Friday Close)
    `;

    // 3. Generate Roundup with Claude
    const roundupContent = await getAnalysis(promptContext, PETES_VOICE_PROFILE + "\n\n" + WEEKLY_ROUNDUP_PROMPT, 'automated' as any);

    // 4. Store in database
    const weekEnding = new Date().toISOString().split('T')[0];
    
    const { data: roundup, error: dbError } = await supabase.from('weekly_roundups').upsert({
      week_ending: weekEnding,
      content_html: roundupContent,
      content_text: roundupContent,
      market_data: { performance: weeklyPerformance },
    }).select().single();

    if (dbError) throw dbError;

    // 5. Fetch Active Subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError) throw subError;

    // 6. Dispatch via Resend
    if (subscribers && subscribers.length > 0) {
      const emailList = subscribers.map(s => s.email);
      
      const dispatch = await sendNewsletter({
        subject: `Weekly Roundup: The Truth About This Week's Move [${weekEnding}]`,
        html: `
          <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px;">
            <h1 style="text-transform: uppercase;">Drawdown Weekly Roundup</h1>
            <div style="margin: 40px 0; line-height: 1.6;">
              ${roundupContent}
            </div>
            <p style="font-size: 10px; color: #666;">
              You are receiving this because you are a Drawdown subscriber. 
              <a href="https://drawdown.trade/unsubscribe" style="color: #0066FF;">Unsubscribe</a>
            </p>
          </div>
        `,
        recipients: emailList,
      });

      // 7. Log the Dispatch
      if (dispatch.success) {
        await supabase.from('newsletter_sends').insert({
          subject: `Weekly Roundup [${weekEnding}]`,
          content_html: roundupContent,
          recipient_count: emailList.length,
          sent_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      date: weekEnding,
      recipients: subscribers?.length || 0
    });

  } catch (error: any) {
    console.error("Weekly Roundup Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
