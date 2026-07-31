import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Verify Vercel Cron Secret / Cron Auth
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`) || process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const supabase = createInternalSupabase();

    // 2. Rate limit check: max 3 per day (fail-safe if DB table missing)
    let sentTodayCount = 0;
    let sentToday: any[] = [];
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("email_sends")
        .select("id, metadata")
        .eq("type", "breaking_news")
        .gte("created_at", today.toISOString());
      
      if (data) {
        sentToday = data;
        sentTodayCount = data.length;
      }
    } catch (e) {
      console.warn("email_sends query skipped in breaking-news:", e);
    }

    if (sentTodayCount >= 3) {
      console.log("[CRON] Breaking news limit reached for today (3/3). Skipping.");
      return NextResponse.json({ success: true, message: "Limit reached" });
    }

    // 3. Fetch Finnhub general news
    const finnhubKey = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!finnhubKey) {
      throw new Error("Finnhub API key not found");
    }

    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`);
    if (!newsRes.ok) throw new Error("Failed to fetch finnhub news");
    const newsData = await newsRes.json();

    if (!newsData || newsData.length === 0) {
      return NextResponse.json({ success: true, message: "No news found" });
    }

    // Filter to news from the last hour
    const oneHourAgo = Date.now() / 1000 - 3600;
    const recentNews = newsData.filter((n: any) => n.datetime >= oneHourAgo);

    if (recentNews.length === 0) {
      return NextResponse.json({ success: true, message: "No recent breaking news" });
    }

    const topArticle = recentNews[0];

    // Deduplicate: check if we already sent this article
    const alreadySent = sentToday?.some(
      (send) => send.metadata && send.metadata.article_url === topArticle.url
    );

    if (alreadySent) {
      console.log("[CRON] Already sent breaking news for this article.");
      return NextResponse.json({ success: true, message: "Already sent" });
    }

    // 4. Generate Claude summary
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured.");
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are Pete Currey, founder of Drawdown Trading. Write a short, punchy breaking news alert based on the provided article.
Keep it strictly under 150 words. Focus on market impact and risk. No financial advice. Output ONLY valid JSON:
{
  "subject": "BREAKING: [Headline]",
  "content": "The alert body..."
}`;

    const userPrompt = `Headline: ${topArticle.headline}\nSummary: ${topArticle.summary}\nSource: ${topArticle.source}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const textContent = (message.content[0] as any).text.trim();
    let briefJson;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      briefJson = JSON.parse(jsonMatch ? jsonMatch[0] : textContent);
    } catch (e) {
      throw new Error("Failed to parse Claude JSON");
    }

    // 5. Generate simple HTML for breaking news
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #ef4444; text-transform: uppercase; letter-spacing: 1px;">🚨 Breaking News</h2>
        <p style="font-size: 16px; line-height: 1.6;">${briefJson.content.replace(/\\n/g, "<br/>")}</p>
        <p style="font-size: 14px; margin-top: 30px; color: #666;">
          Source: <a href="${topArticle.url}" style="color: #2563eb;">${topArticle.source}</a>
        </p>
      </div>
    `;

    // 6. Save to email_sends table if available
    let emailSendId = crypto.randomUUID();
    try {
      const { data: emailSend } = await supabase
        .from("email_sends")
        .insert({
          type: "breaking_news",
          subject: briefJson.subject,
          content_html: emailHtml,
          content_text: briefJson.content,
          status: "pending",
          metadata: {
            article_url: topArticle.url,
            headline: topArticle.headline
          }
        })
        .select()
        .single();
      
      if (emailSend?.id) emailSendId = emailSend.id;
    } catch (err) {
      console.warn("email_sends insert skipped in breaking-news:", err);
    }

    // 7. Dispatch broadcast
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const sendHeaders: Record<string, string> = {
      "Authorization": `Bearer ${process.env.CRON_SECRET || "dd-sc-cr0n-s3cr3t-x9pQk2mNvR7wJtLh"}`,
      "Content-Type": "application/json",
      "x-vercel-cron": "1"
    };

    const sendUrl = bypassToken
      ? `${siteUrl}/api/email/send-broadcast?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/email/send-broadcast`;

    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: sendHeaders,
      body: JSON.stringify({ 
        emailSendId, 
        type: "breaking_news",
        contentHtml: emailHtml,
        contentText: briefJson.content,
        subject: briefJson.subject
      }),
      cache: "no-store"
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      throw new Error(`Broadcast failed (${sendRes.status}): ${errText}`);
    }

    return NextResponse.json({ success: true, emailSendId });
  } catch (err: any) {
    console.error("Breaking news cron failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
