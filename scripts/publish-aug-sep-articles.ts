import { createClient } from "@supabase/supabase-js";
import { AUGUST_ARTICLES } from "./data/august-articles.ts";
import { SEPTEMBER_ARTICLES } from "./data/september-articles.ts";

const DEFAULT_PETE_AUTHOR_ID = "5f4f22da-9465-458d-ae1a-e75cdea8adc2";

async function main() {
  console.log("==================================================================");
  console.log("   DRAWDOWN EDITORIAL ENGINE — AUGUST & SEPTEMBER PUBLISHING      ");
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

  // 1. Audit Existing 84 Articles
  const { data: initialPosts, error: initialError } = await supabase
    .from("blog_posts")
    .select("id, slug, title, published_at, is_published")
    .order("published_at", { ascending: false });

  if (initialError || !initialPosts) {
    console.error("Failed to query initial blog_posts:", initialError);
    process.exit(1);
  }

  const initialCount = initialPosts.length;
  console.log(`[Audit] Verified initial blog_posts count: ${initialCount}`);
  if (initialCount < 84) {
    console.error(`[Error] Expected at least 84 historical articles, found ${initialCount}. Aborting.`);
    process.exit(1);
  }

  const existingSlugMap = new Map<string, string>();
  for (const p of initialPosts) {
    existingSlugMap.set(p.slug, p.id);
  }

  // 2. Prepare 16 New Articles Batch
  const allNewArticles = [...AUGUST_ARTICLES, ...SEPTEMBER_ARTICLES];
  console.log(`[Batch] Preparing to publish ${allNewArticles.length} new articles.`);

  const insertedRecords: Array<{
    date: string;
    title: string;
    category: string;
    slug: string;
    url: string;
    status: string;
  }> = [];

  for (const article of allNewArticles) {
    const isAlreadyPresent = existingSlugMap.has(article.slug);
    console.log(`\nProcessing: [${article.publishedAt.split("T")[0]}] "${article.title}" (${article.slug})`);

    let postId = existingSlugMap.get(article.slug);

    if (!isAlreadyPresent) {
      // Insert new blog post
      const { data: newPost, error: insertError } = await supabase
        .from("blog_posts")
        .insert({
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle,
          body: article.body.trim(),
          category: article.category,
          read_time: article.readTime,
          published_at: article.publishedAt,
          is_published: true,
          hero_image_url: article.heroImageUrl,
          author_id: DEFAULT_PETE_AUTHOR_ID,
          related_post_slugs: article.relatedPostSlugs,
        })
        .select("id")
        .single();

      if (insertError || !newPost) {
        console.error(`Failed to insert post "${article.slug}":`, insertError);
        continue;
      }
      postId = newPost.id;
      console.log(`  -> Inserted blog_post ID: ${postId}`);
    } else {
      console.log(`  -> Post already exists with ID: ${postId}, updating content & status...`);
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: article.title,
          subtitle: article.subtitle,
          body: article.body.trim(),
          category: article.category,
          read_time: article.readTime,
          published_at: article.publishedAt,
          is_published: true,
          hero_image_url: article.heroImageUrl,
          author_id: DEFAULT_PETE_AUTHOR_ID,
          related_post_slugs: article.relatedPostSlugs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);

      if (updateError) {
        console.error(`Failed to update post "${article.slug}":`, updateError);
        continue;
      }
    }

    // Insert or update SEO record
    const { error: seoError } = await supabase
      .from("blog_post_seo")
      .upsert({
        post_id: postId,
        meta_title: article.metaTitle,
        meta_description: article.metaDescription,
        og_title: article.metaTitle,
        og_description: article.metaDescription,
        og_image_url: article.heroImageUrl,
        canonical_url: `https://drawdown.trading/blog/${article.slug}`,
        focus_keyword: article.focusKeyword,
        schema_type: "mdx",
        no_index: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "post_id" });

    if (seoError) {
      console.error(`Failed to upsert SEO for "${article.slug}":`, seoError);
    } else {
      console.log(`  -> SEO record linked successfully`);
    }

    insertedRecords.push({
      date: article.publishedAt.split("T")[0],
      title: article.title,
      category: article.category,
      slug: article.slug,
      url: `https://drawdown.trading/blog/${article.slug}`,
      status: "PUBLISHED",
    });
  }

  // 3. Post-Publishing Verification
  const { data: finalPosts, error: finalError } = await supabase
    .from("blog_posts")
    .select("id, slug, is_published, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const { data: finalSeo, error: finalSeoError } = await supabase
    .from("blog_post_seo")
    .select("id, post_id");

  console.log("\n==================================================================");
  console.log("                     POST-PUBLISHING AUDIT                        ");
  console.log("==================================================================");
  console.log(`Total Published blog_posts: ${finalPosts?.length} (Expected: 100)`);
  console.log(`Total blog_post_seo records: ${finalSeo?.length} (Expected: 100)`);

  // Verify all 84 original slugs are still intact
  let missingOriginals = 0;
  const finalSlugSet = new Set(finalPosts?.map(p => p.slug));
  for (const [origSlug] of existingSlugMap.entries()) {
    if (!finalSlugSet.has(origSlug)) {
      console.error(`CRITICAL WARNING: Original article "${origSlug}" missing!`);
      missingOriginals++;
    }
  }

  if (missingOriginals === 0) {
    console.log(`[PASS] 100% of the original ${initialCount} historical articles remain intact!`);
  }

  console.log("\n--- Newly Published Articles (Chronological Order) ---");
  console.table(insertedRecords);
}

main().catch(console.error);
