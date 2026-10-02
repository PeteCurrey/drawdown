import { createClient } from "@supabase/supabase-js";
import { OCTOBER_ARTICLES } from "./data/october-articles.ts";
import type { ArticleSeed } from "./data/august-articles.ts";

const DEFAULT_PETE_AUTHOR_ID = "5f4f22da-9465-458d-ae1a-e75cdea8adc2";

async function main() {
  console.log("==================================================================");
  console.log("   DRAWDOWN EDITORIAL ENGINE — OCTOBER 2026 PUBLISHING           ");
  console.log("==================================================================");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Audit existing posts
  const { data: initialPosts, error: initialError } = await supabase
    .from("blog_posts")
    .select("id, slug, title, published_at, is_published")
    .order("published_at", { ascending: false });

  if (initialError || !initialPosts) {
    console.error("Failed to query initial blog_posts:", initialError);
    process.exit(1);
  }

  const initialCount = initialPosts.length;
  console.log(`[Audit] Current published post count: ${initialCount}`);
  if (initialCount < 100) {
    console.error(`[Error] Expected at least 100 articles (Aug/Sep batch should be present), found ${initialCount}. Aborting.`);
    process.exit(1);
  }

  const existingSlugMap = new Map<string, string>();
  for (const p of initialPosts) {
    existingSlugMap.set(p.slug, p.id);
  }

  // 2. Check for already-published October slugs
  const alreadyPublished = OCTOBER_ARTICLES.filter(a => existingSlugMap.has(a.slug));
  if (alreadyPublished.length > 0) {
    console.log(`[Info] ${alreadyPublished.length} October articles already in database:`);
    for (const a of alreadyPublished) {
      console.log(`  ✓ ${a.slug}`);
    }
  }

  const toPublish = OCTOBER_ARTICLES.filter(a => !existingSlugMap.has(a.slug));
  console.log(`[Batch] ${toPublish.length} new October articles to publish.`);

  const results: Array<{
    date: string;
    title: string;
    category: string;
    slug: string;
    url: string;
    status: string;
  }> = [];

  for (const article of toPublish) {
    const date = article.publishedAt.substring(0, 10);
    console.log(`\n[Publishing] ${date} — ${article.slug}`);

    // Insert blog_post
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .insert({
        slug: article.slug,
        title: article.title,
        subtitle: article.subtitle,
        body: article.body,
        category: article.category,
        read_time: article.readTime,
        published_at: article.publishedAt,
        is_published: true,
        hero_image_url: article.heroImageUrl,
        author_id: DEFAULT_PETE_AUTHOR_ID,
        related_post_slugs: article.relatedPostSlugs ?? [],
        dark_background: false,
      })
      .select("id")
      .single();

    if (postError || !post) {
      console.error(`  [Error] Failed to insert blog_post: ${postError?.message}`);
      results.push({ date, title: article.title, category: article.category, slug: article.slug, url: "", status: `FAILED: ${postError?.message}` });
      continue;
    }

    console.log(`  ✓ blog_posts inserted (id: ${post.id})`);

    // Insert SEO record
    const canonicalUrl = `https://drawdown.trading/blog/${article.slug}`;
    const { error: seoError } = await supabase
      .from("blog_post_seo")
      .insert({
        post_id: post.id,
        meta_title: article.metaTitle,
        meta_description: article.metaDescription,
        og_title: article.metaTitle,
        og_description: article.metaDescription,
        og_image_url: article.heroImageUrl,
        canonical_url: canonicalUrl,
        schema_type: "mdx",
        no_index: false,
        focus_keyword: article.focusKeyword,
      });

    if (seoError) {
      console.error(`  [Warning] SEO insert failed: ${seoError.message}`);
      results.push({ date, title: article.title, category: article.category, slug: article.slug, url: canonicalUrl, status: `POST OK, SEO FAILED: ${seoError.message}` });
    } else {
      console.log(`  ✓ blog_post_seo inserted`);
      results.push({ date, title: article.title, category: article.category, slug: article.slug, url: canonicalUrl, status: "PUBLISHED" });
    }
  }

  // 3. Final verification
  console.log("\n==================================================================");
  console.log("   PUBLISHING SUMMARY");
  console.log("==================================================================");

  for (const r of results) {
    const icon = r.status === "PUBLISHED" ? "✅" : "❌";
    console.log(`${icon} [${r.date}] ${r.category} — ${r.slug}`);
    if (r.status !== "PUBLISHED") console.log(`   ERROR: ${r.status}`);
  }

  const published = results.filter(r => r.status === "PUBLISHED").length;
  const failed = results.filter(r => r.status !== "PUBLISHED").length;

  console.log(`\n[Result] ${published} published, ${failed} failed, ${alreadyPublished.length} already existed`);

  // 4. Post-publish count verification
  const { data: finalPosts } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact" })
    .eq("is_published", true);

  const finalCount = (finalPosts as unknown as { count: number })?.length ?? 0;
  console.log(`[Verify] Total published posts now: ${initialCount + published}`);

  if (failed > 0) {
    console.error("\n[Warning] Some articles failed to publish. Review errors above.");
    process.exit(1);
  }

  console.log("\n[Done] October 2026 editorial batch complete. ✓");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
