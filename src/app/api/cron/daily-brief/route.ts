import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, DAILY_BRIEF_PROMPT } from "@/lib/prompts";
import { fetchNews } from "@/lib/news";

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
    
    const { data, error } = await supabase.from('daily_briefs').upsert({
      brief_date: today,
      content_html: briefContent, // Markdown to be rendered on frontend
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
