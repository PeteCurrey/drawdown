import { createInternalSupabase } from "@/lib/supabase/server";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createInternalSupabase();

  // 1. Query Card Stats
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: totalSubscribers },
    { count: emailsSentThisWeek },
    { count: morningBriefsCount },
    { count: blogPostsCount }
  ] = await Promise.all([
    supabase
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("email_sends")
      .select("*", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("sent_at", sevenDaysAgo.toISOString()),

    supabase
      .from("email_sends")
      .select("*", { count: "exact", head: true })
      .eq("type", "morning_brief")
      .eq("status", "sent"),

    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true)
      .gte("published_at", startOfMonth.toISOString())
  ]);

  // 2. Query Recent 5 Email Sends
  const { data: recentSends } = await supabase
    .from("email_sends")
    .select("id, type, subject, recipient_count, status, sent_at, generated_at")
    .order("generated_at", { ascending: false })
    .limit(5);

  const stats = {
    totalSubscribers: totalSubscribers || 0,
    emailsSentThisWeek: emailsSentThisWeek || 0,
    morningBriefsCount: morningBriefsCount || 0,
    blogPostsCount: blogPostsCount || 0
  };

  // Health Metrics Queries
  const { count: waitlistCount } = await supabase
    .from("floor_waitlist")
    .select("*", { count: "exact", head: true });

  const { data: floorSettings } = await supabase
    .from("platform_settings")
    .select("floor_cap")
    .single();

  const { count: activeFloorSubs } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("subscription_tier", "floor")
    .eq("subscription_status", "active");

  const { data: upcomingEvents } = await supabase
    .from("live_events")
    .select("id, title, scheduled_at, meeting_url")
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: true })
    .limit(5);

  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

  const { data: latestBreakdowns } = await supabase
    .from("weekly_breakdowns")
    .select("published_at")
    .order("published_at", { ascending: false })
    .limit(1);

  const isBreakdownOverdue = !latestBreakdowns?.length || new Date(latestBreakdowns[0].published_at) < eightDaysAgo;

  const healthMetrics = {
    waitlistCount: waitlistCount || 0,
    floorCap: floorSettings?.floor_cap || 15,
    activeFloorSubs: activeFloorSubs || 0,
    upcomingEventsMissingUrls: (upcomingEvents || []).filter((e: any) => !e.meeting_url).length,
    isBreakdownOverdue
  };

  return (
    <AdminOverviewClient stats={stats} recentSends={recentSends || []} healthMetrics={healthMetrics} />
  );
}
