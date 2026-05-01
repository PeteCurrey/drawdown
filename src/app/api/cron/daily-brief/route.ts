import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, DAILY_BRIEF_PROMPT } from "@/lib/prompts";
import { fetchNews } from "@/lib/news";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // 1. Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
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
    // 2. Fetch real news and prices for context
    const [news, marketRes] = await Promise.all([
      fetchNews(),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/market/prices`)
    ]);
    
    const marketData = await marketRes.json();
    const newsContext = news.slice(0, 5).map(item => `- ${item.title} (${item.source})`).join('\n');

    const promptContext = `
      Today's Market Snapshot (Prices): ${JSON.stringify(marketData)}
      Key News Headlines: 
      ${newsContext}
      Current Time: ${new Date().toUTCString()}
    `;

    // 3. Generate Brief with Claude
    const briefContent = await getAnalysis(promptContext, PETES_VOICE_PROFILE + "\n\n" + DAILY_BRIEF_PROMPT, 'daily_briefing');

    // 4. Store in database
    const today = new Date().toISOString().split('T')[0];
    const subjectLine = briefContent.split('\n')[0].replace(/[#*]/g, '').trim();
    
    const { data: brief, error: dbError } = await supabase.from('daily_briefs').upsert({
      brief_date: today,
      subject_line: subjectLine || `Daily Brief — ${today}`,
      content_html: briefContent, 
      content_text: briefContent,
      market_data: marketData,
    }).select().single();

    if (dbError) throw dbError;

    // 5. Fetch Active Subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subError) throw subError;

    if (subscribers && subscribers.length > 0) {
      const recipientEmails = subscribers.map(s => s.email);

      // 6. Send Email via Resend
      const { error: emailError } = await resend.emails.send({
        from: 'Drawdown <thewire@drawdown.co.uk>',
        to: 'thewire@drawdown.co.uk', // Sentinel address
        bcc: recipientEmails,
        subject: `The Wire — Daily Brief: ${subjectLine || today}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #08090D; color: #E4E2DD; padding: 40px;">
            <h1 style="color: #00C2FF; text-transform: uppercase; font-size: 24px; letter-spacing: 2px;">Drawdown</h1>
            <p style="font-family: monospace; color: #8C8B87; font-size: 10px;">// THE WIRE: ${today}</p>
            <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 20px 0;" />
            <div style="line-height: 1.6; font-size: 16px;">
              ${briefContent.split('\n').map(p => `<p>${p}</p>`).join('')}
            </div>
            <hr style="border: 0; border-top: 1px solid #1A1D24; margin: 40px 0;" />
            <p style="font-size: 11px; color: #8C8B87; text-align: center;">
              You received this because you're subscribed to The Wire. 
              <br /><br />
              © ${new Date().getFullYear()} Drawdown Platform Ltd.
            </p>
          </div>
        `,
      });

      if (emailError) throw emailError;
    }

    return NextResponse.json({ 
      success: true, 
      date: today,
      subscribers_sent: subscribers?.length ?? 0
    });

  } catch (error: any) {
    console.error("Daily Brief Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
