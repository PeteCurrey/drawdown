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

  // 4. Aggregate Analytics (Real calculations)
  const sentEditions = editions?.filter(e => e.status === 'sent') || [];
  const totalSends = sentEditions.length;
  
  // Calculate averages from actual sent data
  const totalOpenRate = sentEditions.reduce((acc, curr) => acc + (curr.open_rate || 0), 0);
  const totalClickRate = sentEditions.reduce((acc, curr) => acc + (curr.click_rate || 0), 0);
  
  const stats = {
    totalSends,
    avgOpenRate: totalSends > 0 ? Number((totalOpenRate / totalSends).toFixed(1)) : 0,
    avgClickRate: totalSends > 0 ? Number((totalClickRate / totalSends).toFixed(1)) : 0,
    totalUnsubs: 0 // Will be populated by webhook tracking
  };

  return {
    editions: editions || [],
    activeSubscribers: activeSubscribers || 0,
    settings: settings || {},
    stats
  };
}
