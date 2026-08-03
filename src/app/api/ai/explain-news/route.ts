import { createClient } from "@/lib/supabase/server";
import { checkAndLogAiUsage } from "@/lib/supabase/ai-rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkAndLogAiUsage(user.id, "explain_news");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }
    const { item } = await request.json();
    
    if (!item || !item.title) {
      return NextResponse.json({ error: "Missing news item" }, { status: 400 });
    }

    const systemPrompt = `
      You are a trading education assistant. A trader has clicked on this news headline to understand its market impact. 
      Given the headline and excerpt, explain in 2-3 short paragraphs:
      1. What happened (plain English, no jargon)
      2. Which markets/instruments this is likely to affect and why
      3. What a trader should watch for as a result

      Be factual and educational. Do NOT give specific trade recommendations. UK English spelling. Keep it under 200 words.
    `;

    const userPrompt = `
      Headline: ${item.title}
      Excerpt: ${item.excerpt}
      Source: ${item.source}
    `;

    const explanation = await getAnalysis(userPrompt, systemPrompt, 'news_explanation');

    return NextResponse.json({ explanation });

  } catch (error: any) {
    console.error("News AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
