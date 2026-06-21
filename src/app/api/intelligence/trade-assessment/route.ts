import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symbol, direction, entry, stop, takeProfit, lots, riskAmount, riskPct, atr, spread, session, newsEvents, bias, setupScore, accountBalance, currency } = body;

    const cacheKey = `${symbol}-${direction}-${entry}-${stop}-${lots}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const atrRatio = atr ? (Math.abs(entry - stop) / atr).toFixed(2) : null;
    const rrRatio = takeProfit && entry && stop ? (Math.abs(takeProfit - entry) / Math.abs(entry - stop)).toFixed(2) : null;
    const highImpactNews = (newsEvents || []).filter((e: any) => e.impact === 'high');
    const nextHighImpact = highImpactNews[0];

    const userPrompt = `
Trade Setup for Review:
- Symbol: ${symbol} | Direction: ${direction} | Bias: ${bias || 'Unknown'} | Setup Score: ${setupScore || 'N/A'}/100
- Entry: ${entry} | Stop: ${stop} | Take Profit: ${takeProfit || 'Not set'}
- Position Size: ${lots} lots | Risk: ${currency || ''}${riskAmount} (${riskPct}% of account)
- Account Balance: ${currency || ''}${accountBalance}
- ATR(14) Daily: ${atr || 'Unknown'} | Stop distance vs ATR: ${atrRatio ? atrRatio + '× ATR' : 'Unknown'}
- Current Spread: ${spread ? (spread * 10000).toFixed(1) + ' pips' : 'Unknown'}
- Active Session: ${session || 'Unknown'}
- Risk:Reward Ratio: ${rrRatio ? '1:' + rrRatio : 'No TP set'}
${nextHighImpact ? `- UPCOMING HIGH-IMPACT NEWS: ${nextHighImpact.event} at ${nextHighImpact.time} UTC` : '- No high-impact news in next 4 hours'}

Assess this trade setup from a risk management perspective.`;

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: 'You are a senior risk manager at a prop trading firm reviewing a trader\'s setup. Be direct and specific. Assess: 1) Is the stop placement sensible relative to volatility? 2) Is the risk/reward appropriate? 3) Are there timing concerns? 4) What is the one thing to watch out for? Respond in exactly 3-4 sentences. No bullet points. No preamble.',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const assessment = msg.content[0]?.type === 'text' ? msg.content[0].text : 'Assessment unavailable.';

    const result = { assessment, symbol, timestamp: new Date().toISOString() };
    cache.set(cacheKey, { data: result, ts: Date.now() });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[trade-assessment]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
