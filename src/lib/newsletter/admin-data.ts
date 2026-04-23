import { createClient } from "@/lib/supabase/server";

export async function getNewsletterStats() {
  const supabase = await createClient();

  // 1. Recent Editions
  const { data: editions } = await supabase
    .from('newsletter_editions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // 2. Subscriber Counts
  const { count: activeSubscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // 3. Settings
  const { data: settings } = await supabase
    .from('newsletter_settings')
    .select('*')
    .single();

  // 4. Aggregate Analytics (Mocked for now until webhooks fill table)
  const stats = {
    totalSends: editions?.filter(e => e.status === 'sent').length || 0,
    avgOpenRate: 24.5, // %
    avgClickRate: 3.8,  // %
    totalUnsubs: 12
  };

  return {
    editions: editions || [],
    activeSubscribers: activeSubscribers || 0,
    settings: settings || {},
    stats
  };
}
