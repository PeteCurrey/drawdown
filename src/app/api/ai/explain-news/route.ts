import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";

export async function POST(request: NextRequest) {
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
