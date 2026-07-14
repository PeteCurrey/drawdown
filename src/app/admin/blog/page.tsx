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
    />
  );
}
