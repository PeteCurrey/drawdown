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

  return (
    <AdminOverviewClient stats={stats} recentSends={recentSends || []} />
  );
}
