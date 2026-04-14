import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, DAILY_BRIEF_PROMPT } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  // 1. Verify Cron Secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // In production, you'd want to enforce this. For local dev/testing, we might skip.
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
    // 2. Fetch context for the prompt
    // In a real app, we'd fetch the latest news from NewsAPI and prices from TwelveData
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/market/prices`);
    const marketData = await res.json();
    
    // Mock News headlines for context
    const newsContext = `
      - UK CPI data released at 07:00 GMT came in at 1.7%, lower than the 1.9% forecast.
      - Standard Chartered raised its Bitcoin price forecast to $150,000.
      - S&P 500 futures are trading slightly higher ahead of the New York open.
    `;

    const promptContext = `
      Today's Market Snapshot: ${JSON.stringify(marketData)}
      Key News Headlines: ${newsContext}
      Current Time: ${new Date().toUTCString()}
    `;

    // 3. Generate Brief with Claude
    const briefContent = await getAnalysis(promptContext, PETES_VOICE_PROFILE + "\n\n" + DAILY_BRIEF_PROMPT, 'daily_briefing');

    // 4. Store in database
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase.from('daily_briefs').upsert({
      brief_date: today,
      content_html: briefContent, // In production, we might convert markdown to HTML here
      content_text: briefContent,
      market_data: marketData,
    }).select();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      date: today,
      data 
    });

  } catch (error: any) {
    console.error("Daily Brief Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
