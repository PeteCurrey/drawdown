import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "./supabase/client";

// Tier-based limits (analyses per month)
export const TIER_LIMITS = {
  free: 0,
  foundation: 0,
  edge: 50,
  floor: 200,
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type AIScope = 'journal_analysis' | 'market_scanner' | 'backtest_coach' | 'daily_briefing' | 'chart_analysis' | 'news_explanation' | 'weekly_roundup' | 'blog_drafting';

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

  const stream = anthropic.messages.stream({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    system: systemPrompt + "\n\nDISCLAIMER: This is for educational purposes only and does not constitute financial advice.",
    messages: [{ role: "user", content: prompt }],
  });

  // Log usage asynchronously (approximating 1 request = 1 usage unit for tier limits)
  // Real token counting would happen via the final message event
  logAIUsage(userId, scope, "claude-3-5-sonnet", 0);

  return stream;
}

/**
 * Standard analysis (not streaming) for background tasks
 */
export async function getAnalysis(prompt: string, systemPrompt: string, scope: AIScope) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    system: systemPrompt + "\n\nDISCLAIMER: This is for educational purposes only and does not constitute financial advice.",
    messages: [{ role: "user", content: prompt }],
  });

  // Log usage (scope 'automated' if needed, but using existing scope)
  // logAIUsage('SYSTEM', scope, "claude-3-5-sonnet", 0);

  return response.content[0].type === 'text' ? response.content[0].text : '';
}
