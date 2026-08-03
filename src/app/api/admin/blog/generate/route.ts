import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { PETES_VOICE_PROFILE } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const supabase = createServiceRoleClient();

  try {
    const { topic, keywords, category } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const systemPrompt = `
      ${PETES_VOICE_PROFILE}
      
      TASK: Write a punchy, honest, and educational blog post for Drawdown based on the topic below. 
      Use target keywords where natural. UK English.
      
      Structure:
      - Engaging headline (Syne 800 style)
      - Key takeaways (bullet points)
      - Deep dive (short, punchy paragraphs)
      - Actionable conclusion
      - Sign-off in Pete's signature style
    `;

    const userPrompt = `
      Topic: ${topic}
      Keywords: ${keywords || "trading, drawdown, education"}
      Category: ${category || "Trading Strategy"}
    `;

    const draft = await getAnalysis(userPrompt, systemPrompt, 'blog_drafting');

    return NextResponse.json({ draft });

  } catch (error: any) {
    console.error("AI Blog Draft Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
