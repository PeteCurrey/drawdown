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
    .select(`
      id,
      title,
      slug,
      category,
      eyebrow,
      subtitle,
      body,
      hero_image_url,
      hero_image_alt,
      read_time,
      published_at,
      is_published,
      dark_background,
      related_post_slugs,
      created_at,
      blog_post_seo (
        meta_title,
        meta_description,
        og_title,
        og_description,
        og_image_url,
        canonical_url,
        no_index,
        focus_keyword,
        schema_type
      )
    `)
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Normalise the seo join (Supabase returns array or object depending on relationship type)
  const seoRaw = post.blog_post_seo;
  const seo = Array.isArray(seoRaw) ? seoRaw[0] : seoRaw;

  const mappedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    eyebrow: post.eyebrow || "",
    subtitle: post.subtitle || "",
    body: post.body || "",
    hero_image_url: post.hero_image_url || "",
    hero_image_alt: post.hero_image_alt || "",
    read_time: post.read_time || "",
    published_at: post.published_at || post.created_at,
    is_published: post.is_published,
    dark_background: post.dark_background ?? false,
    related_post_slugs: post.related_post_slugs || [],
    seo: seo
      ? {
          meta_title: seo.meta_title || "",
          meta_description: seo.meta_description || "",
          og_title: seo.og_title || "",
          og_description: seo.og_description || "",
          og_image_url: seo.og_image_url || "",
          canonical_url: seo.canonical_url || "",
          no_index: seo.no_index ?? false,
          focus_keyword: seo.focus_keyword || "",
          schema_type: seo.schema_type || "BlogPosting",
        }
      : undefined,
  };

  return <BlogEditor post={mappedPost} />;
}
