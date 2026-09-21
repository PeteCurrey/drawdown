"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServiceRoleClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const DEFAULT_PETE_AUTHOR_ID = "5f4f22da-9465-458d-ae1a-e75cdea8adc2";

export interface GenerateBlogDraftParams {
  topic: string;
  keywords?: string;
  category: string;
  wordCount?: number;
  sourceNotes?: string;
  targetDate?: string;
  articleType?: string;
}

export async function generateBlogDraft(formData: GenerateBlogDraftParams) {
  const { 
    topic, 
    keywords = "", 
    category, 
    wordCount = 1200, 
    sourceNotes = "", 
    targetDate = new Date().toISOString().split("T")[0],
    articleType = "Analysis" 
  } = formData;

  const prompt = `
You are Pete Currey, founder of Drawdown.
Voice Profile: Direct, honest, UK English (using natural terms like 'HMRC', 'quid', 'properly', 'tail risk'), anti-guru, zero-fluff, data-driven, practical.

Task: Write a high-calibre, substantive blog article for Drawdown.

Topic: ${topic}
Category: ${category}
Article Type: ${articleType}
Target Publication Date: ${targetDate}
Keywords to weave naturally: ${keywords}
Source Provenance / Research Notes: ${sourceNotes || "Authoritative market structure, central bank releases, and empirical risk mathematics."}
Target Word Count: ${wordCount}

Quality & Editorial Standards:
1. No generic AI padding (Never use "In today's fast-paced world...", "In conclusion...", or repetitive rhetorical questions).
2. Evidence-based: Reference real market mechanisms, math formulas (e.g. drawdown recovery percentage, expectancy), or regulatory facts where relevant.
3. No fabricated statistics, false quotes, or miraculous win-rate claims.
4. UK English spelling (e.g., analyse, organise, centre, manoeuvre).
5. Meaningfully reference Drawdown tools where relevant (Position Sizer, Challenge Simulator, Risk of Ruin Calculator, The Lobby, The Wire).

Structure:
- Title (Compelling, authoritative, maximum 75 characters)
- Subtitle / Excerpt (Punchy summary of the core thesis, 1-2 sentences)
- Introduction (The real-world problem or market event)
- 3 to 4 substantive H2 sections with deep analysis, tables or checklists where useful
- Practical Implications for Traders (Actionable takeaways)
- The Final Word (Pete's unvarnished verdict)
- A natural call-to-action to Drawdown tools

Return clean Markdown body content.
`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    // @ts-ignore
    const content = response.content[0]?.text || "";
    return { success: true, draft: content };
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return { success: false, error: error.message };
  }
}

export interface SaveBlogDraftParams {
  slug: string;
  title: string;
  subtitle?: string;
  body: string;
  category: string;
  readTime?: string;
  publishedAt?: string;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  heroImageUrl?: string;
  authorId?: string;
  relatedPostSlugs?: string[];
}

export async function saveBlogDraftToSupabase(params: SaveBlogDraftParams) {
  try {
    const supabase = createServiceRoleClient();
    const cleanSlug = params.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");

    if (!cleanSlug) {
      return { success: false, error: "A valid slug is required." };
    }

    // Check if post exists
    const { data: existingPost, error: checkError } = await supabase
      .from("blog_posts")
      .select("id, slug, is_published, published_at")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing slug:", checkError);
      return { success: false, error: checkError.message };
    }

    let postId = existingPost?.id;
    const nowIso = new Date().toISOString();
    const publishedAt = params.publishedAt || existingPost?.published_at || nowIso;
    const readTime = params.readTime || `${Math.max(3, Math.ceil(params.body.split(/\s+/).length / 200))} min read`;

    if (existingPost) {
      // Update existing post
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title: params.title,
          subtitle: params.subtitle || null,
          body: params.body,
          category: params.category,
          read_time: readTime,
          published_at: publishedAt,
          is_published: params.isPublished ?? existingPost.is_published,
          hero_image_url: params.heroImageUrl || null,
          author_id: params.authorId || DEFAULT_PETE_AUTHOR_ID,
          related_post_slugs: params.relatedPostSlugs || [],
          updated_at: nowIso,
        })
        .eq("id", postId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
    } else {
      // Insert new post
      const { data: newPost, error: insertError } = await supabase
        .from("blog_posts")
        .insert({
          slug: cleanSlug,
          title: params.title,
          subtitle: params.subtitle || null,
          body: params.body,
          category: params.category,
          read_time: readTime,
          published_at: publishedAt,
          is_published: params.isPublished ?? false,
          hero_image_url: params.heroImageUrl || null,
          author_id: params.authorId || DEFAULT_PETE_AUTHOR_ID,
          related_post_slugs: params.relatedPostSlugs || [],
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select("id")
        .single();

      if (insertError || !newPost) {
        return { success: false, error: insertError?.message || "Failed to create blog post" };
      }
      postId = newPost.id;
    }

    // Upsert SEO record
    const metaTitle = params.metaTitle || `${params.title} | Drawdown Trading`;
    const metaDescription = params.metaDescription || params.subtitle || params.title;

    const { error: seoError } = await supabase
      .from("blog_post_seo")
      .upsert({
        post_id: postId,
        meta_title: metaTitle,
        meta_description: metaDescription,
        og_title: metaTitle,
        og_description: metaDescription,
        focus_keyword: params.focusKeyword || null,
        canonical_url: `https://drawdown.trading/blog/${cleanSlug}`,
        schema_type: "mdx",
        no_index: false,
        updated_at: nowIso,
      }, { onConflict: "post_id" });

    if (seoError) {
      console.warn("Warning: SEO record upsert encountered error:", seoError.message);
    }

    return {
      success: true,
      postId,
      slug: cleanSlug,
      url: `/blog/${cleanSlug}`,
      isPublished: params.isPublished ?? false,
    };
  } catch (error: any) {
    console.error("saveBlogDraftToSupabase error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Backward-compatibility wrapper for legacy generator callers.
 * Parses raw text/frontmatter if provided and saves to Supabase.
 */
export async function saveBlogDraft(slug: string, content: string) {
  // Extract title if present in frontmatter or first # header
  let title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  let body = content;
  let category = "Market Analysis";
  let subtitle = "";

  const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/title:\s*["']?([^"'\n]+)["']?/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  const excerptMatch = content.match(/excerpt:\s*["']?([^"'\n]+)["']?/);
  if (excerptMatch) {
    subtitle = excerptMatch[1].trim();
  }

  const catMatch = content.match(/category:\s*["']?([^"'\n]+)["']?/);
  if (catMatch) {
    category = catMatch[1].trim();
  }

  return saveBlogDraftToSupabase({
    slug,
    title,
    subtitle,
    body,
    category,
    isPublished: false, // Default to draft for safety
  });
}
