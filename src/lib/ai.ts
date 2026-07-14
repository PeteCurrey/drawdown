import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "./supabase/client";

// Tier-based limits (analyses per month)
export const TIER_LIMITS = {
  free: 0,
  foundation: 0,
  edge: 50,
  floor: 200,
};

let anthropic: any = null;
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "an_placeholder") {
  try {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  } catch (err) {
    console.error("Failed to initialize Anthropic client:", err);
  }
}

export type AIScope = 'journal_analysis' | 'market_scanner' | 'backtest_coach' | 'daily_briefing' | 'chart_analysis' | 'news_explanation' | 'weekly_roundup' | 'blog_drafting' | 'algo_strategy_builder';

// Helper to generate context-aware mock responses when API key is missing
function generateMockAIResponse(prompt: string, systemPrompt: string, scope: AIScope): string {
  const isPython = prompt.toLowerCase().includes("python");
  
  switch (scope) {
    case "chart_analysis":
      return `Right, let's look at the chart. Price is holding steady near key support, but the momentum is sluggish. We've got clear structural resistance just above, and jumping in here is simply gambling. In this game, sitting on your hands is an active trading decision. 

No clear market structure shift (MSS) has occurred on the lower timeframes yet. Wait for the sweep of the session lows, then look for the displacement. If it doesn't happen, we don't trade. Simple as that.

"Protect your capital. The opportunities will come." — Pete`;

    case "journal_analysis":
      return `I've reviewed your recent logs. You've got a clear revenge trading pattern emerging after losses. Your lot size is scaling up by 2x within 30 minutes of a losing trade. That's a direct leak of your R.

You're trying to win the money back from the market, which is emotional suicide. Stop. Focus on execution compliance, not the PnL. Take a break after any loss.

"Maintain the ruleset, and the equity curve will look after itself." — Pete`;

    case "news_explanation":
      return `This headline points to a cooling of core inflation in the UK, which came in slightly below the consensus forecast. The direct result is a drop in yields, putting immediate pressure on Sterling across the board.

Look for GBP/USD and EUR/GBP to experience elevated volatility. For day traders, this means support levels on Cable are vulnerable. Watch the 1.2650 area for potential liquidity sweeps, but don't try to catch a falling knife. Wait for confirmation.`;

    case "algo_strategy_builder":
      if (isPython) {
        return `import backtrader as bt

class PetesEmaCrossStrategy(bt.Strategy):
    params = (
        ('fast_period', 20),
        ('slow_period', 50),
        ('rsi_period', 14),
        ('rsi_oversold', 40),
    )

    def __init__(self):
        self.ema_fast = bt.indicators.EMA(period=self.p.fast_period)
        self.ema_slow = bt.indicators.EMA(period=self.p.slow_period)
        self.rsi = bt.indicators.RSI(period=self.p.rsi_period)
        self.crossover = bt.indicators.CrossOver(self.ema_fast, self.ema_slow)

    def next(self):
        if not self.position:
            if self.crossover > 0 and self.rsi[0] > self.p.rsi_oversold:
                self.buy()
        else:
            if self.crossover < 0:
                self.close()`;
      } else {
        return `//@version=5
strategy("Pete's Dynamic EMA Cross Strategy", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=10)

// Inputs
fast_ema_len = input.int(20, title="Fast EMA Period")
slow_ema_len = input.int(50, title="Slow EMA Period")
rsi_len = input.int(14, title="RSI Period")
rsi_oversold = input.int(40, title="RSI Oversold Level")

// Indicators
fast_ema = ta.ema(close, fast_ema_len)
slow_ema = ta.ema(close, slow_ema_len)
rsi_val = ta.rsi(close, rsi_len)

// Strategy Conditions
long_condition = ta.crossover(fast_ema, slow_ema) and rsi_val > rsi_oversold
short_condition = ta.crossunder(fast_ema, slow_ema)

// Execution
if (long_condition)
    strategy.entry("Long", strategy.long)
if (short_condition)
    strategy.close("Long")

plot(fast_ema, color=color.blue, title="Fast EMA")
plot(slow_ema, color=color.orange, title="Slow EMA")`;
      }

    default:
      return `Right, let's keep it simple. Always wait for price to align with your high-timeframe bias. Trade what you see, not what you feel. 

"Discipline is not a part-time job." — Pete`;
  }
}

// Helper to simulate typewriter streaming for mock responses
async function* generateMockStream(text: string) {
  const chunks = text.match(/.{1,4}/g) || [text];
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 15));
    yield {
      type: 'content_block_delta',
      delta: {
        type: 'text_delta',
        text: chunk
      }
    };
  }
}

/**
 * Checks if a user has remaining AI quota for the current month
 */
export async function checkAIQuota(userId: string) {
  const supabase = createClient();
  
  // 1. Get user tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (!profile) return { allowed: false, error: 'Profile not found' };

  const tier = (profile as any).subscription_tier as keyof typeof TIER_LIMITS;
  const limit = TIER_LIMITS[tier] || 0;

  if (limit === 0) {
    return { allowed: false, error: `Your ${tier} tier does not include AI tools.` };
  }

  // 2. Count usage in current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  if (error) return { allowed: false, error: 'Error checking usage' };

  if ((count || 0) >= limit) {
    return { allowed: false, error: `Monthly AI limit reached (${limit}/${limit}). Resets on the 1st.` };
  }

  return { allowed: true, limit, count: count || 0 };
}

/**
 * Log AI usage to database
 */
export async function logAIUsage(userId: string, scope: AIScope, model: string, tokens: number) {
  const supabase = createClient();
  await supabase.from('ai_usage_logs').insert({
    user_id: userId,
    scope,
    model,
    tokens_estimated: tokens,
  } as any);
}

/**
 * Core analysis engine using Claude
 */
export async function streamAnalysis(prompt: string, systemPrompt: string, userId: string, scope: AIScope) {
  const quota = await checkAIQuota(userId);
  if (!quota.allowed) {
    throw new Error(quota.error);
  }

  if (!anthropic) {
    // If Anthropic is not initialized, return the mock sessional stream
    const mockText = generateMockAIResponse(prompt, systemPrompt, scope);
    logAIUsage(userId, scope, "mock-claude-3-5", 0);
    return generateMockStream(mockText);
  }

  const stream = anthropic.messages.stream({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    system: systemPrompt + "\n\nDISCLAIMER: This is for educational purposes only and does not constitute financial advice.",
    messages: [{ role: "user", content: prompt }],
  });

  // Log usage asynchronously
  logAIUsage(userId, scope, "claude-3-5-sonnet", 0);

  return stream;
}

/**
 * Standard analysis (not streaming) for background tasks
 */
export async function getAnalysis(prompt: string, systemPrompt: string, scope: AIScope) {
  if (!anthropic) {
    // Return mock sessional response if API key is not present
    return generateMockAIResponse(prompt, systemPrompt, scope);
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    system: systemPrompt + "\n\nDISCLAIMER: This is for educational purposes only and does not constitute financial advice.",
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

