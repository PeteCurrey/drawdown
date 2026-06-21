import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trades, userId } = body;

    if (!trades || trades.length === 0) {
      return NextResponse.json({ score: null, observations: [], message: 'No trades to analyse.' });
    }

    const cacheKey = `discipline-${userId}-${trades.length}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const tradeSummary = trades.slice(0, 30).map((t: any, i: number) =>
      `${i+1}. ${t.instrument} ${t.direction} | Risk: ${t.risk_amount} | P&L: ${t.pnl_amount} | RR: ${t.rr_ratio || 'N/A'} | Balance: ${t.account_balance}`
    ).join('\n');

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: 'You are a trading coach analysing a trader\'s discipline. Score their risk management 0-100 and give exactly 3 specific observations. Respond ONLY as valid JSON: { "score": number, "label": string, "observations": [string, string, string] }. Label options: "POOR" (0-39), "DEVELOPING" (40-59), "GOOD" (60-79), "EXCELLENT" (80-100).',
      messages: [{ role: 'user', content: `Analyse this trader's last ${trades.length} trades:\n\n${tradeSummary}\n\nScore their risk discipline 0-100 and give 3 specific observations.` }],
    });

    const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '{}';
    let parsed;
    try {
      // Extract JSON from response
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { score: 60, label: 'GOOD', observations: ['Unable to parse analysis.', 'Please try again.', ''] };
    } catch {
      parsed = { score: 60, label: 'GOOD', observations: ['Analysis error.', 'Please retry.', ''] };
    }

    cache.set(cacheKey, { data: parsed, ts: Date.now() });
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('[discipline-score]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
