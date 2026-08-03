import { NextRequest, NextResponse } from "next/server";
import { generateMarketingContent } from "@/lib/ai/claude";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const { topic, type } = await request.json();

  try {
    const content = await generateMarketingContent({ topic, type });
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
