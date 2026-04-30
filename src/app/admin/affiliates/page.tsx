import { createClient } from '@/lib/supabase/server';
import AffiliatesClient from './AffiliatesClient';

export const dynamic = 'force-dynamic';

export default async function AffiliatesAdminPage() {
  const supabase = await createClient();

  // Fetch links with 30-day click counts
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: links } = await supabase
    .from('affiliate_links')
    .select(`
      *,
      affiliate_clicks(count)
    `)
    .order('display_name');

  // Also get 30d clicks per link
  const { data: clicks30d } = await supabase
    .from('affiliate_clicks')
    .select('affiliate_id')
    .gte('clicked_at', thirtyDaysAgo);

  const clickMap: Record<string, number> = {};
  clicks30d?.forEach(c => {
    clickMap[c.affiliate_id] = (clickMap[c.affiliate_id] ?? 0) + 1;
  });

  const enriched = (links ?? []).map(l => ({
    ...l,
    click_count: clickMap[l.id] ?? 0,
  }));

  return <AffiliatesClient initialLinks={enriched} />;
}
