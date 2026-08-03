import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateNewsletterEdition(editionType: 'daily' | 'weekend') {
  const supabase = await createClient();

  // 1. Gather context (News and Economic Calendar)
  const date = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const { data: news } = await supabase
    .from('intelligence_signals')
    .select('title, content, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const newsContext = news?.map(n => `- ${n.title}: ${n.content}`).join('\n') || "No recent news signals found.";

  const calendarContext = `
    Upcoming High Impact Events:
    - US Non-Farm Payrolls (NFP) • Friday 13:30 GMT • USD • Forecast: 185k
    - Eurozone CPI (YoY) • Thursday 10:00 GMT • EUR • Forecast: 2.4%
    - BoE Interest Rate Decision • Thursday 12:00 GMT • GBP • Forecast: 5.25%
  `;

  const systemPrompt = `
    You are the editorial AI behind "The Wire" — Drawdown's daily market intelligence newsletter. 
    Brand Voice: Institutional, direct, and anti-hype. Written like a sharp, experienced trader briefing a peer.
    Rules: No clickbait, UK-first framing, specific numbers only, no financial advice.
  `;

  const userPrompt = `
    Generate the ${editionType} edition for ${date}.
    
    OUTPUT FORMAT: Respond ONLY with a valid JSON object.
    {
      "subject_line": "string",
      "preview_text": "string",
      "edition_date": "${date}",
      "sections": [
        { "key": "market_pulse", "title": "Market Pulse", "content": "..." },
        { "key": "what_moved", "title": "What Moved", "content": "..." },
        { "key": "macro_radar", "title": "Macro Radar", "content": "..." },
        { "key": "on_the_calendar", "title": "On the Calendar", "content": "..." },
        { "key": "forex_focus", "title": "Forex Focus", "content": "..." },
        { "key": "keep_an_eye_on", "title": "Keep an Eye On", "content": "..." },
        { "key": "petes_take", "title": "Pete's Take", "content": "..." }
        ${editionType === 'weekend' ? `, 
        { "key": "weekly_recap", "title": "The Week in Review", "content": "..." },
        { "key": "chart_of_the_week", "title": "Chart of the Week", "content": "..." },
        { "key": "read_this_week", "title": "Worth Reading", "content": "..." }` : ''}
      ]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: editionType === 'weekend' ? 6000 : 4000,
      temperature: 0.4,
      messages: [
        { role: "user", content: `${systemPrompt}\n\nLATEST NEWS:\n${newsContext}\n\nCALENDAR:\n${calendarContext}\n\n${userPrompt}` }
      ],
    });

    const content = (response.content[0] as any).text;
    const json = JSON.parse(content);

    // 2. Store in database
    const { data: edition, error: editionError } = await supabase
      .from('newsletter_editions')
      .insert({
        edition_type: editionType,
        status: 'draft',
        scheduled_send_at: new Date(new Date().setHours(editionType === 'daily' ? 7 : 8, 0, 0, 0)).toISOString(),
        subject_line: json.subject_line,
        preview_text: json.preview_text,
        ai_generated_json: json
      })
      .select()
      .single();

    if (editionError) throw editionError;

    // 3. Create sections
    const sections = json.sections.map((s: any, index: number) => ({
      edition_id: edition.id,
      section_key: s.key,
      section_title: s.title,
      ai_content: s.content,
      display_order: index
    }));

    const { error: sectionError } = await supabase
      .from('newsletter_sections')
      .insert(sections);

    if (sectionError) throw sectionError;

    return edition.id;

  } catch (error) {
    console.error("Newsletter generation failed:", error);
    throw error;
  }
}
