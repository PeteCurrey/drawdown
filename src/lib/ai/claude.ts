import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export type ContentType = 'blog' | 'twitter' | 'linkedin' | 'newsletter';

interface ContentRequest {
  topic: string;
  type: ContentType;
  tone?: string;
  competitorContext?: string;
}

export async function generateMarketingContent({
  topic,
  type,
  tone = "Institutional, direct, anti-hype, risk-aware",
  competitorContext = ""
}: ContentRequest) {
  const systemPrompt = `
    You are Pete, the founder of Drawdown.trading. 
    Persona: A retired institutional trader who is tired of the "retail guru" culture.
    Voice: Direct, data-dense, transparent about loss, and authoritative.
    Mandatory Vocabulary: Slippage, liquidity, spread, counterparty risk, margin, delta, theta, drawdown, capital at risk.
    Banned Phrases: "Financial freedom", "passive income", "100% win rate", "hidden secret", "guaranteed".
    
    Current Competitor Context: ${competitorContext}
    Goal: Out-educate the competition. If they are talking about "Making Money", you talk about "Managing Risk".
  `;

  const prompts: Record<ContentType, string> = {
    blog: `
      Write a 1500-2000 word professional-grade analysis of "${topic}". 
      Structure:
      1. The Retail Narrative (What the gurus say).
      2. The Institutional Reality (The math they hide).
      3. Technical Deep Dive (Execution, Slippage, and Liquidity).
      4. Pete's Verdict (The honest bottom line).
      Use Markdown with H2 and H3 headers. No emojis.
    `,
    twitter: `
      Create a 12-tweet "Anti-Hype" thread about "${topic}".
      Start with a contrarian take. 
      Every tweet must provide a specific technical insight or a warning about risk.
      Tone: Like a mentor talking to a junior trader.
      End with a link to Drawdown.trading.
    `,
    linkedin: `
      Write a high-level executive summary on "${topic}" for institutional capital managers.
      Focus on macro implications, regulatory landscape (FCA), and operational risk.
      Length: 400 words.
    `,
    newsletter: `
      Write a "The Wire" special segment for "${topic}".
      Include a "Market Intel" section and a "Risk Assessment" table.
      End with a direct CTA to the Drawdown community.
    `
  };

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `
          System: ${systemPrompt}
          Task: ${prompts[type]}
        `
      }
    ],
  });

  return (response.content[0] as any).text;
}


export async function analyzeCompetitorTrends(competitorData: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `
          Analyze the following competitor data and identify:
          1. Top 3 SEO trends they are currently exploiting.
          2. Gaps in their content where Drawdown can provide better "institutional" value.
          3. Suggested topics for our next 3 blog posts to outrank them.
          
          Data: ${competitorData}
          
          Output in valid JSON format.
        `
      }
    ],
  });

  return JSON.parse((response.content[0] as any).text);
}
