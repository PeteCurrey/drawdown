"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createInternalSupabase } from "@/lib/supabase/server";

// 1. Trigger Morning Brief Cron
export async function triggerMorningBriefAction() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return { success: false, error: "CRON_SECRET is not configured on the server." };
  }

  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${cronSecret}`
    };
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const url = bypassToken
      ? `${siteUrl}/api/cron/morning-brief?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/cron/morning-brief`;

    const res = await fetch(url, { method: "GET", headers, cache: "no-store" });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Cron returned status ${res.status}: ${errText}` };
    }

    const result = await res.json();
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Error triggering morning brief cron action:", error);
    return { success: false, error: error.message };
  }
}

// 2. Trigger Evening Wrap Cron
export async function triggerEveningWrapAction() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return { success: false, error: "CRON_SECRET is not configured on the server." };
  }

  try {
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${cronSecret}`
    };
    const bypassToken = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    const url = bypassToken
      ? `${siteUrl}/api/cron/evening-wrap?x-vercel-protection-bypass=${bypassToken}&x-vercel-set-bypass-cookie=true`
      : `${siteUrl}/api/cron/evening-wrap`;

    const res = await fetch(url, { method: "GET", headers, cache: "no-store" });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Cron returned status ${res.status}: ${errText}` };
    }

    const result = await res.json();
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Error triggering evening wrap cron action:", error);
    return { success: false, error: error.message };
  }
}

// 3. Generate Blog Post with Claude AI
export async function generateBlogWithAIAction(userPrompt: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { success: false, error: "ANTHROPIC_API_KEY is not configured on the server." };
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are Pete Currey, founder of Drawdown Trading — a UK-based trading education platform. You write blog posts for traders who are learning to trade seriously.

Your voice: direct, honest, no fluff, anti-guru. You don't hype markets. You don't give signals. You give context, education, and honest assessment. You're a British trader who takes risk management seriously above all else. Use British English spelling (analyse, colour, favour, etc.) and short paragraphs.

NEVER say anything that could be construed as financial advice. ALWAYS frame analysis as educational context, not trading signals. Include a disclaimer reminder naturally where appropriate.`;

    const fullPrompt = `Write a professional blog post about: "${userPrompt}".

Respond ONLY with a valid JSON object matching the schema below. Do NOT add any markdown formatting, preamble, or wrapper outside the raw JSON:
{
  "title": "compelling blog post title",
  "slug": "url-friendly-slug-for-the-post",
  "category": "Market Analysis",
  "excerpt": "short summary under 200 chars describing the article",
  "body": "<p>detailed, comprehensive blog post content written as clean HTML. Use h2, h3, p, ul, li, strong, blockquote tags. Pete's voice, British English.</p>",
  "eyebrow": "MARKET ANALYSIS"
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.6,
      system: systemPrompt,
      messages: [{ role: "user", content: fullPrompt }]
    });

    const textContent = (message.content[0] as any).text.trim();
    let blogJson;
    try {
      blogJson = JSON.parse(textContent);
    } catch (parseErr) {
      console.error("Failed to parse JSON directly. Attempting regex cleanup. Raw response:", textContent);
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogJson = JSON.parse(jsonMatch[0]);
      } else {
        throw parseErr;
      }
    }

    return { success: true, blog: blogJson };
  } catch (error: any) {
    console.error("Failed to generate blog post with Claude:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllActiveSubscribersAction() {
  const supabase = createInternalSupabase();
  const { data, error } = await supabase
    .from("email_subscribers")
    .select("email, first_name, source, subscribed_at, subscribed_morning, subscribed_evening, subscribed_weekly, is_active")
    .eq("is_active", true)
    .order("subscribed_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch subscribers for CSV: ${error.message}`);
  }

  return data || [];
}

// 4. Delete Blog Post
export async function deleteBlogPostAction(id: string) {
  const supabase = createInternalSupabase();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
  revalidatePath("/blog");
  return { success: true };
}

// 5. Save Blog Post (new CMS schema: body, is_published, eyebrow, subtitle, etc.)
export async function saveBlogPostAction(payload: {
  id?: string;
  title: string;
  slug: string;
  category: string;
  eyebrow?: string;
  subtitle?: string;
  body: string;
  hero_image_url?: string;
  hero_image_alt?: string;
  read_time?: string;
  published_at?: string;
  is_published: boolean;
  related_post_slugs?: string[];
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  no_index?: boolean;
  focus_keyword?: string;
  dark_background?: boolean;
}) {
  const supabase = createInternalSupabase();
  const now = new Date().toISOString();

  // Build blog post record
  const postRecord: Record<string, any> = {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    eyebrow: payload.eyebrow || null,
    subtitle: payload.subtitle || null,
    body: payload.body,
    hero_image_url: payload.hero_image_url || null,
    hero_image_alt: payload.hero_image_alt || null,
    read_time: payload.read_time || null,
    is_published: payload.is_published,
    dark_background: payload.dark_background ?? false,
    related_post_slugs: payload.related_post_slugs || [],
    updated_at: now,
    ...(payload.is_published && !payload.id ? { published_at: payload.published_at || now } : {}),
    ...(payload.published_at ? { published_at: payload.published_at } : {}),
  };

  let postId = payload.id;
  let postResult;

  if (payload.id) {
    postResult = await supabase
      .from("blog_posts")
      .update(postRecord)
      .eq("id", payload.id)
      .select("id")
      .single();
  } else {
    postResult = await supabase
      .from("blog_posts")
      .insert({ ...postRecord, created_at: now })
      .select("id")
      .single();
  }

  if (postResult.error) {
    throw new Error(`Failed to save blog post: ${postResult.error.message}`);
  }

  postId = postResult.data.id;

  // Upsert SEO record
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
  const seoRecord = {
    post_id: postId,
    meta_title: payload.meta_title || `${payload.title} | Drawdown`,
    meta_description: payload.meta_description || payload.subtitle || "",
    og_title: payload.og_title || payload.meta_title || payload.title,
    og_description: payload.og_description || payload.meta_description || "",
    og_image_url: payload.og_image_url || payload.hero_image_url || "",
    canonical_url: payload.canonical_url || `${siteUrl}/blog/${payload.slug}`,
    no_index: payload.no_index || false,
    focus_keyword: payload.focus_keyword || null,
    schema_type: "BlogPosting",
    updated_at: now,
  };

  const { error: seoError } = await supabase
    .from("blog_post_seo")
    .upsert(seoRecord, { onConflict: "post_id" });

  if (seoError) {
    console.error("SEO upsert failed:", seoError.message);
  }

  // Revalidate the blog page and the specific post
  revalidatePath("/blog");
  revalidatePath(`/blog/${payload.slug}`);

  return { success: true, postId };
}

// 6. Toggle Blog Post Publish State
export async function togglePublishAction(id: string, currentState: boolean) {
  const supabase = createInternalSupabase();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      is_published: !currentState,
      updated_at: now,
      ...((!currentState) ? { published_at: now } : {}),
    })
    .eq("id", id)
    .select("slug, is_published")
    .single();

  if (error) {
    throw new Error(`Failed to toggle publish state: ${error.message}`);
  }

  revalidatePath("/blog");
  if (data?.slug) {
    revalidatePath(`/blog/${data.slug}`);
  }

  return { success: true, is_published: data?.is_published };
}

// 7. Save Author Profile
export async function saveAuthorProfileAction(payload: {
  id?: string;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string;
}) {
  const supabase = createInternalSupabase();
  const now = new Date().toISOString();

  let result;
  if (payload.id) {
    result = await supabase
      .from("author_profiles")
      .update({
        name: payload.name,
        role: payload.role,
        bio: payload.bio,
        avatar_url: payload.avatar_url || null,
        updated_at: now,
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("author_profiles")
      .insert({
        name: payload.name,
        role: payload.role,
        bio: payload.bio,
        avatar_url: payload.avatar_url || null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
  }

  if (result.error) {
    throw new Error(`Failed to save author profile: ${result.error.message}`);
  }

  return { success: true, profile: result.data };
}
