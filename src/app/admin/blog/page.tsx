import { createInternalSupabase } from "@/lib/supabase/server";
import { BlogListClient } from "@/components/admin/blog/BlogListClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminBlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const limit = 20;
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const supabase = createInternalSupabase();

  const { data: posts, count, error } = await supabase
    .from("blog_posts")
    .select("id, title, category, is_published, dark_background, published_at, created_at, slug", { count: "exact" })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to query blog posts:", error);
  }

  // Fetch all email_sends of type blog_post so we can show newsletter status per post
  const { data: emailSends } = await (supabase as any)
    .from("email_sends")
    .select("metadata, status, sent_at, recipient_count")
    .eq("type", "blog_post")
    .in("status", ["sent", "completed", "pending", "failed"]);

  // Build a lookup: blog_post_id -> best send record
  const emailSendMap: Record<string, { status: string; sent_at?: string; recipient_count?: number }> = {};
  (emailSends || []).forEach((send: any) => {
    const blogPostId = send.metadata?.blog_post_id;
    if (!blogPostId) return;
    // Prefer most recent sent/completed over pending/failed
    const existing = emailSendMap[blogPostId];
    if (!existing) {
      emailSendMap[blogPostId] = { status: send.status, sent_at: send.sent_at, recipient_count: send.recipient_count };
    } else if (send.status === "sent" || send.status === "completed") {
      emailSendMap[blogPostId] = { status: send.status, sent_at: send.sent_at, recipient_count: send.recipient_count };
    }
  });

  const totalRecords = count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <BlogListClient
      posts={posts || []}
      totalRecords={totalRecords}
      currentPage={currentPage}
      totalPages={totalPages}
      from={from}
      to={to}
      emailSendMap={emailSendMap}
    />
  );
}
