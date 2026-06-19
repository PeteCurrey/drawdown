import { createInternalSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog/BlogEditor";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = createInternalSupabase();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Map database keys to expected editor prop keys
  const mappedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt || "",
    content: post.content,
    tags: post.tags || [],
    published: post.published,
    featured: post.featured,
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || ""
  };

  return <BlogEditor post={mappedPost} />;
}
