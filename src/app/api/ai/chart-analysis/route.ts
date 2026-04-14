import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { symbol, indicators } = await request.json();

    const prompt = `
      Analyse the current chart for ${symbol}.
      
      Technical Data Context:
      - Timeframe: 1H
      - Current Indicators: ${JSON.stringify(indicators)}
      
      Provide a professional, educational analysis in Pete's voice.
      1. What the overall technical picture looks like right now.
      2. Key levels to watch (support and resistance based on the indicators).
      3. What scenarios could play out from here (bullish case and bearish case).
      4. One thing to be cautious about.

      DISCLAIMER: Do NOT say "buy" or "sell." Do NOT say "you should enter here." This is EDUCATIONAL analysis.
    `;

    const analysis = await getAnalysis(prompt, PETES_VOICE_PROFILE, 'market_scanner');

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
