import { NextRequest, NextResponse } from "next/server";
import { generateMarketingContent } from "@/lib/ai/claude";

export async function POST(request: NextRequest) {
  const { topic, type } = await request.json();

  try {
    const content = await generateMarketingContent({ topic, type });
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
