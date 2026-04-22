import { createClient } from "@/lib/supabase/server";

export async function getAdminStats() {
  const supabase = await createClient();

  // 1. Total Subscriptions (simulated from profile tiers for now if Stripe table isn't ready)
  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('subscription_tier', 'free');

  // 2. AI Usage (Last 24h)
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: aiCalls } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', last24h);

  // 3. New Leads (Last 7 days)
  const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: newLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', last7d);

  // 4. SEO Analytics (Total Views)
  const { data: seoData } = await supabase
    .from('seo_analytics')
    .select('views');
  const totalSEOViews = seoData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

  // 5. Partner Stats
  const { count: totalPartners } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'partner');

  const { count: referralCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .not('partner_id', 'is', null);

  // 6. User Growth (Last 30 days)
  const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: userGrowth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', last30d);

  // 7. API Health (FinnHub, Anthropic, Stripe, Supabase, Discord)
  const health: Record<string, 'connected' | 'error'> = {
    supabase: 'connected',
  };

  // Stripe Check
  health.stripe = process.env.STRIPE_SECRET_KEY ? 'connected' : 'error';
  
  // Discord Check
  health.discord = process.env.DISCORD_BOT_TOKEN ? 'connected' : 'error';

  try {
    const finnhubResp = await fetch(`https://finnhub.io/api/v1/status?token=${process.env.FINNHUB_API_KEY}`);
    health.finnhub = finnhubResp.ok ? 'connected' : 'error';
  } catch {
    health.finnhub = 'error';
  }

  try {
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 
        'x-api-key': process.env.ANTHROPIC_API_KEY || '', 
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 1, messages: [{ role: 'user', content: 'ping' }] })
    });
    health.anthropic = anthropicResp.status === 200 || anthropicResp.status === 400 ? 'connected' : 'error';
  } catch {
    health.anthropic = 'error';
  }

  return {
    activeSubs: activeSubs || 0,
    aiCalls: aiCalls || 0,
    newLeads: newLeads || 0,
    totalPartners: totalPartners || 0,
    referralCount: referralCount || 0,
    userGrowth: userGrowth || 0,
    mrr: (activeSubs || 0) * 49,
    totalSEOViews,
    health
  };
}
