import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";

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
    const { symbol, indicators } = await request.json();

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const systemPrompt = `
      ${PETES_VOICE_PROFILE}
      
      TASK: You are looking at a technical chart for ${symbol}. 
      Active Indicators: ${JSON.stringify(indicators)}
      
      Give a blunt, honest, and risk-focused analysis of the current setup. 
      - Treat the user like an adult. 
      - Focus on price action and market structure.
      - If it's a "no trade" zone, say so. 
      - Use UK English.
      - 3-4 short paragraphs.
      
      Sign off with a piece of wisdom from Pete.
    `;

    const userPrompt = `
      Current Symbol: ${symbol}
      Market Sentiment: Neutral/Aggressive
      Key Levels: 1.2800 Resistance, 1.2650 Support
    `;

    const analysis = await getAnalysis(userPrompt, systemPrompt, 'chart_analysis');

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error("AI Chart Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
