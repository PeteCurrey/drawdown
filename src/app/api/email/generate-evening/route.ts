import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getEveningWrapTemplate } from "@/lib/email-templates";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  // 1. Verify Secret Header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createInternalSupabase();
    
    // 2. Fetch recent intelligence signals for context
    const { data: signals } = await supabase
      .from("intelligence_signals")
      .select("title, content")
      .order("created_at", { ascending: false })
      .limit(3);

    const signalsContext = signals && signals.length > 0
      ? signals.map(s => `- ${s.title}: ${s.content}`).join("\n")
      : "No major intelligence signals recorded today.";

    const dateStr = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // 3. Call Claude to generate evening wrap text
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are Pete Currey, founder of Drawdown Trading — a UK-based trading education platform. You write a twice-daily email to traders who are learning to trade seriously.

Your voice: direct, honest, no fluff, anti-guru. You don't hype markets. You don't give signals. You give context, education, and honest assessment. You're a British trader who takes risk management seriously above all else. Use British English spelling (analyse, colour, favour, etc.) and short paragraphs.

NEVER say anything that could be construed as financial advice. ALWAYS frame analysis as educational context, not trading signals. Include a disclaimer reminder naturally where appropriate.`;

    const userPrompt = `Generate an evening market session wrap-up email for ${dateStr}.

Market news context from today:
${signalsContext}

Respond ONLY with a valid JSON object matching the schema below. Do NOT add any markdown formatting, preamble, or wrapper outside the raw JSON:
{
  "subject_line": "compelling evening subject line under 60 chars",
  "preview_text": "preview snippet summarizing the evening session wrap",
  "how_it_played_out": "2-3 paragraphs of commentary outlining how the UK/US sessions played out today compared to expectations, separated by double linebreaks",
  "tomorrow_watch_list": "2 paragraphs outlining tomorrow's key macro watchlist levels and indicators to observe, separated by double linebreaks",
  "trade_of_session": "2 paragraphs describing an educational trade setup (e.g. liquidity grab, structure shift) that happened today. Outline entries/stops and risk parameters purely for training.",
  "curriculum_topic": "One sentence explaining how today's price action serves as a textbook example of a specific concept (e.g., sweep of liquidity, FOMC volatility, session range expansion).",
  "curriculum_phase_slug": "ground-zero or chart-reader or other phase slug",
  "curriculum_module_number": 2
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const textContent = (message.content[0] as any).text.trim();
    let wrapJson;
    try {
      wrapJson = JSON.parse(textContent);
    } catch (parseErr) {
      console.error("Failed to parse JSON directly. Attempting regex cleanup. Raw response:", textContent);
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        wrapJson = JSON.parse(jsonMatch[0]);
      } else {
        throw parseErr;
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
    const curriculumLink = `${appUrl}/courses/${wrapJson.curriculum_phase_slug}/module-${wrapJson.curriculum_module_number}`;

    // 4. Generate HTML Content
    const emailHtml = getEveningWrapTemplate({
      dateStr,
      subject: wrapJson.subject_line,
      preview: wrapJson.preview_text,
      howItPlayedOut: wrapJson.how_it_played_out,
      tomorrowWatchList: wrapJson.tomorrow_watch_list,
      tradeOfSession: wrapJson.trade_of_session,
      curriculumTopic: wrapJson.curriculum_topic,
      curriculumModuleLink: curriculumLink,
      unsubscribeUrl: "{{unsubscribeUrl}}" // placeholder replaced at broadcast time
    });

    // 5. Save to email_sends table as 'pending'
    const { data: emailSend, error: sendError } = await supabase
      .from("email_sends")
      .insert({
        type: "evening_wrap",
        subject: wrapJson.subject_line,
        content_html: emailHtml,
        content_text: `${wrapJson.preview_text}\n\n${wrapJson.how_it_played_out}\n\n${wrapJson.tomorrow_watch_list}\n\n${wrapJson.trade_of_session}`,
        status: "pending",
        metadata: {
          signals_context: signalsContext,
          curriculum_link: curriculumLink,
          model: "claude-3-5-sonnet-20241022"
        }
      })
      .select()
      .single();

    if (sendError) {
      console.error("Database insert email_sends error:", sendError);
      throw sendError;
    }

    return NextResponse.json({ success: true, emailSendId: emailSend.id });

  } catch (err: any) {
    console.error("Evening wrap generation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
