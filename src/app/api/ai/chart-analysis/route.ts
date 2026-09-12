import { createClient } from "@/lib/supabase/server";
import { checkAndLogAiUsage } from "@/lib/supabase/ai-rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";
import { CommercialAccess } from "@/lib/entitlements";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkAndLogAiUsage(user.id, "chart_analysis");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in an hour." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }

    // Tier gate: Foundation or higher required (fail closed)
    const { data: profile } = await authClient.from("profiles")
      .select("subscription_tier, subscription_status, role")
      .eq("id", user.id)
      .single();
    const tier = (profile as any)?.subscription_tier;
    const status = (profile as any)?.subscription_status;
    const isAdmin = (profile as any)?.role === "admin";
    if (!isAdmin && !CommercialAccess.canAccessSignalCentre(tier, status)) {
      return NextResponse.json(
        { error: "An active Foundation subscription or higher is required." },
        { status: 403 }
      );
    }

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
