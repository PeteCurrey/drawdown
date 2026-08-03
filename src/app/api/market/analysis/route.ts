import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnalysis } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tier check (Foundation or above)
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = (profile as any)?.subscription_tier ?? "free";
    const TIER_WEIGHT: Record<string, number> = { free: 0, foundation: 1, edge: 2, floor: 3 };
    if ((TIER_WEIGHT[tier] ?? 0) < 1) {
      return NextResponse.json({ error: "Access denied. Premium tier required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "GBPUSD";
    const interval = searchParams.get("interval") || "1h";

    const systemPrompt = `You are Drawdown Trading's Institutional Market Confluence AI Advisor. 
Analyze the provided instrument technical details and output a professional institutional-grade brief.
You must return your response in EXACTLY the following JSON format without any markdown wrappers or additional text around the JSON block. Do not wrap it in \`\`\`json or similar.

{
  "headline": "Short description of the technical setup",
  "bias": "BULLISH" | "BEARISH" | "NEUTRAL",
  "confluenceScore": number (0 to 100),
  "keyLevels": ["Support 1", "Support 2", "Resistance 1", "Resistance 2"],
  "commentary": "Detailed institutional-grade sessional commentary explaining confluence patterns, order block sweeps, and momentum."
}`;

    const prompt = `Instrument: ${symbol}
Timeframe: ${interval}

Analyze the current structure. Provide the JSON formatted report for ${symbol} detailing the market structure shift, key liquidity pools, sessional confluence, and risk assessment guidelines.`;

    const aiOutputText = await getAnalysis(prompt, systemPrompt, "market_scanner");
    
    // Attempt to parse JSON response. If AI outputs text with markdown block, try to clean it
    let cleanJsonText = aiOutputText.trim();
    if (cleanJsonText.startsWith("```json")) {
      cleanJsonText = cleanJsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJsonText.startsWith("```")) {
      cleanJsonText = cleanJsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const result = JSON.parse(cleanJsonText);
      return NextResponse.json(result);
    } catch (parseErr) {
      // Return a structured fallback if parse fails
      return NextResponse.json({
        headline: `Confluence Analysis for ${symbol}`,
        bias: "NEUTRAL",
        confluenceScore: 55,
        keyLevels: ["Support: Sessional Lows", "Resistance: Sessional Highs"],
        commentary: aiOutputText || "Technical structure is holding within a sessional range. Standard risk offsets apply."
      });
    }

  } catch (err: any) {
    console.error("AI Analysis route error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate market brief." }, { status: 500 });
  }
}
