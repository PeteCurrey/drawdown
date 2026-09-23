import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const PILOT_SOURCES = [
  {
    name: 'The Reformed Broker (Josh Brown)',
    source_type: 'financial_publication',
    domain: 'thereformedbroker.com',
    feed_url: 'https://thereformedbroker.com/feed/',
    active: true,
    priority: 2,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'ReformedBroker',
    source_category: 'investor_perspective',
    monitoring_status: 'configured',
    metadata: { persona: 'investor', role: 'Ritholtz Wealth CEO & market practitioner' }
  },
  {
    name: 'Hussman Investment Trust Market Comment',
    source_type: 'financial_publication',
    domain: 'hussmanfunds.com',
    feed_url: 'https://www.hussmanfunds.com/feed/',
    active: true,
    priority: 2,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'hussmanfunds',
    source_category: 'fund_manager_update',
    monitoring_status: 'configured',
    metadata: { persona: 'fund_manager', role: 'Valuation & macro risk manager' }
  },
  {
    name: 'Lyn Alden Investment Strategy',
    source_type: 'financial_publication',
    domain: 'lynalden.com',
    feed_url: 'https://www.lynalden.com/feed/',
    active: true,
    priority: 1,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'LynAldenContact',
    source_category: 'macro_commentary',
    monitoring_status: 'configured',
    metadata: { persona: 'macro_commentator', role: 'Global macro & currency strategist' }
  },
  {
    name: 'Federal Reserve Bank of NY - Liberty Street Economics',
    source_type: 'central_bank',
    domain: 'libertystreeteconomics.newyorkfed.org',
    feed_url: 'https://libertystreeteconomics.newyorkfed.org/feed/',
    active: true,
    priority: 1,
    trust_tier: 'tier_1_primary',
    platform: 'rss',
    account_handle: 'NYFedResearch',
    source_category: 'macro_commentary',
    monitoring_status: 'configured',
    metadata: { persona: 'macro_commentator', role: 'Monetary research and balance sheet analytics' }
  },
  {
    name: 'Calculated Risk (Bill McBride)',
    source_type: 'financial_publication',
    domain: 'calculatedrisk.substack.com',
    feed_url: 'https://calculatedrisk.substack.com/feed',
    active: true,
    priority: 2,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'calculatedrisk',
    source_category: 'market_analyst',
    monitoring_status: 'configured',
    metadata: { persona: 'market_analyst', role: 'Leading macroeconomic cycle & housing analyst' }
  },
  {
    name: 'CNBC Financial Markets Breaking',
    source_type: 'financial_publication',
    domain: 'cnbc.com',
    feed_url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
    active: true,
    priority: 2,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'CNBC',
    source_category: 'company_news',
    monitoring_status: 'configured',
    metadata: { persona: 'company_news', role: 'Real-time equity market headlines' }
  },
  {
    name: 'MarketWatch Top Stories & Market Recap',
    source_type: 'financial_publication',
    domain: 'marketwatch.com',
    feed_url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
    active: true,
    priority: 2,
    trust_tier: 'tier_2_verified',
    platform: 'rss',
    account_handle: 'MarketWatch',
    source_category: 'market_recap',
    monitoring_status: 'configured',
    metadata: { persona: 'market_recap', role: 'Market wrap-ups and session summaries' }
  },
  {
    name: 'Mohamed A. El-Erian',
    source_type: 'api',
    domain: 'x.com',
    feed_url: 'https://x.com/elerianm',
    active: true,
    priority: 2,
    trust_tier: 'tier_3_secondary',
    platform: 'x',
    account_handle: 'elerianm',
    source_category: 'macro_commentary',
    monitoring_status: 'configured',
    metadata: { persona: 'macro_commentator', role: 'Allianz Chief Economic Advisor' }
  },
  {
    name: 'Tom Lee (Fundstrat)',
    source_type: 'api',
    domain: 'x.com',
    feed_url: 'https://x.com/fundstrat',
    active: true,
    priority: 2,
    trust_tier: 'tier_3_secondary',
    platform: 'x',
    account_handle: 'fundstrat',
    source_category: 'market_analyst',
    monitoring_status: 'configured',
    metadata: { persona: 'market_analyst', role: 'Fundstrat Head of Research' }
  }
];

async function seed() {
  console.log('Upserting curated pilot sources into public.news_sources...');

  for (const src of PILOT_SOURCES) {
    const { data: existing } = await supabase
      .from('news_sources')
      .select('id')
      .eq('feed_url', src.feed_url)
      .maybeSingle();

    if (existing) {
      console.log(`Updating existing source: ${src.name}`);
      const { error } = await supabase
        .from('news_sources')
        .update({
          name: src.name,
          source_type: src.source_type,
          domain: src.domain,
          active: src.active,
          priority: src.priority,
          trust_tier: src.trust_tier,
          platform: src.platform,
          account_handle: src.account_handle,
          source_category: src.source_category,
          monitoring_status: src.monitoring_status,
          metadata: src.metadata
        })
        .eq('id', existing.id);
      if (error) console.error(`Error updating ${src.name}:`, error.message);
    } else {
      console.log(`Inserting new source: ${src.name}`);
      const { error } = await supabase
        .from('news_sources')
        .insert(src);
      if (error) console.error(`Error inserting ${src.name}:`, error.message);
    }
  }

  // Read back all active sources
  const { data: allSources } = await supabase
    .from('news_sources')
    .select('id, name, platform, account_handle, source_category, monitoring_status, feed_url')
    .eq('active', true)
    .order('created_at', { ascending: false });

  console.log('\n--- Active News Sources in Database ---');
  console.table(allSources);
}

seed().catch(console.error);
