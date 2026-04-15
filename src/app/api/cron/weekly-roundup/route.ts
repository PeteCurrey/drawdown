import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE, WEEKLY_ROUNDUP_PROMPT } from "@/lib/prompts";
import { fetchNews } from "@/lib/news";

export async function GET(request: NextRequest) {
  // 1. Verify Cron Secret
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });

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
    // 2. Fetch context
    const [news, marketRes] = await Promise.all([
      fetchNews(), // In production, we'd fetch news from the whole week
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/market/prices`)
    ]);
    
    const marketData = await marketRes.json();
    const newsContext = news.slice(0, 10).map(item => `- ${item.title} (${item.source})`).join('\n');

    const promptContext = `
      WEEKLY MARKET DATA: ${JSON.stringify(marketData)}
      KEY NEWS OF THE WEEK:
      ${newsContext}
      Date range: Last 7 days ending ${new Date().toDateString()}
    `;

    // 3. Generate Weekly Roundup
    const roundupContent = await getAnalysis(promptContext, PETES_VOICE_PROFILE + "\n\n" + WEEKLY_ROUNDUP_PROMPT, 'weekly_roundup');

    // 4. Store and Publish
    const today = new Date().toISOString().split('T')[0];
    
    // a. Save to weekly_roundups
    const { data: roundup, error: roundupError } = await supabase.from('weekly_roundups').upsert({
      week_ending: today,
      content_html: roundupContent,
      content_text: roundupContent,
      market_data: marketData,
    }).select().single();

    if (roundupError) throw roundupError;

    // b. Auto-publish as Blog Post (Section 4C-5)
    const { error: blogError } = await supabase.from('blog_posts').insert({
      title: `The Wire — Weekly Roundup (${new Date().toLocaleDateString('en-GB')})`,
      slug: `weekly-roundup-${today}`,
      content: roundupContent,
      excerpt: roundupContent.slice(0, 160) + "...",
      category: "Weekly Roundup",
      is_published: true,
      published_at: new Date().toISOString(),
      author_id: (await supabase.auth.getUser()).data.user?.id || null,
    } as any);

    return NextResponse.json({ 
      success: true, 
      date: today,
      roundupId: roundup.id
    });

  } catch (error: any) {
    console.error("Weekly Roundup Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
