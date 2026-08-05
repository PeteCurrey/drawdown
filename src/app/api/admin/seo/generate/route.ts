import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/ai";
import { requireAdmin } from "@/lib/supabase/require-admin";

// ── Phase 1 SEO Freeze ─────────────────────────────────────────────────────
// Programmatic SEO publishing is frozen. Set PROGRAMMATIC_SEO_PUBLISHING_ENABLED=true
// in .env.local ONLY after completing the editorial approval process documented
// in /seo-audit/PROGRAMMATIC_SEO_APPROVAL_PROCESS.md
const SEO_PUBLISHING_ENABLED = process.env.PROGRAMMATIC_SEO_PUBLISHING_ENABLED === "true";

export async function POST(request: NextRequest) {
  // Hard freeze gate
  if (!SEO_PUBLISHING_ENABLED) {
    return NextResponse.json(
      {
        error: "Programmatic SEO publishing is frozen (Phase 1 remediation). Set PROGRAMMATIC_SEO_PUBLISHING_ENABLED=true in .env after completing editorial approval.",
        frozenAt: "2026-08-05",
        approvalProcess: "/seo-audit/PROGRAMMATIC_SEO_APPROVAL_PROCESS.md",
      },
      { status: 503 }
    );
  }


  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  try {
    const { type, terms } = await request.json(); // e.g., { type: 'glossary', terms: ['Bid-Ask Spread', 'Stop Loss'] }

    if (!terms || !Array.isArray(terms)) {
      return NextResponse.json({ error: "Invalid terms array" }, { status: 400 });
    }

    const generatedPages = [];

    for (const term of terms) {
      const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      const prompt = type === "glossary" 
        ? `Write a comprehensive glossary definition for the trading term: "${term}". 
           Format in clean Markdown. Include:
           1. A short, simple definition (1-2 sentences).
           2. Why it matters to traders (the "so what").
           3. An example of it in action.
           4. Common mistakes or misconceptions.
           Use Pete's direct, no-nonsense UK trading voice.`
        : `Write a How-To guide for the trading topic: "How to ${term}".
           Format in clean Markdown. Include:
           1. Introduction (Why this is important for your capital).
           2. Step-by-step breakdown.
           3. Common pitfalls.
           Use Pete's direct, no-nonsense UK trading voice.`;

      // Generate content using the AI engine
      const content = await getAnalysis(prompt, "You are Pete, founder of the Drawdown trading platform.", 'automated' as any);
      
      const seoTitle = type === "glossary" ? `${term} Definition | Trading Glossary | Drawdown` : `How to ${term} | Trading Guide | Drawdown`;
      const seoDesc = type === "glossary" ? `Learn what ${term} means in trading, why it matters, and how to use it to protect your capital.` : `Step-by-step guide on how to ${term} like a professional trader.`;

      // In production, upsert to the database
      /*
      await supabase.from('seo_pages').upsert({
        page_type: type,
        slug,
        title: type === 'glossary' ? term : `How to ${term}`,
        seo_title: seoTitle,
        seo_description: seoDesc,
        content,
        is_published: true
      });
      */

      generatedPages.push({
        slug,
        title: term,
        content
      });
    }

    return NextResponse.json({ success: true, count: generatedPages.length, pages: generatedPages });

  } catch (error: any) {
    console.error("SEO Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
