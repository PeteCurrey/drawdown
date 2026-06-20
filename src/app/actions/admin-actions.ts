"use server";

import Anthropic from "@anthropic-ai/sdk";
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

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store"
    });

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

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store"
    });

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
  "category": "Market Analysis", // options: Market Analysis, Education, Psychology, Tools, UK Trading, Risk Management, Prop Firms, Broker News
  "excerpt": "short summary under 200 chars describing the article",
  "content": "detailed, comprehensive blog post content written in markdown format. Use appropriate heading hierarchy, bullet points, and code block formatting where helpful. Pete's voice, British English.",
  "tags": ["tag1", "tag2"]
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
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

export async function deleteBlogPostAction(id: string) {
  const supabase = createInternalSupabase();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
  return { success: true };
}

export async function saveBlogPostAction(payload: {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}) {
  const supabase = createInternalSupabase();
  const date = new Date().toISOString();

  const record = {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    excerpt: payload.excerpt,
    content: payload.content,
    tags: payload.tags,
    published: payload.published,
    featured: payload.featured || false,
    meta_title: payload.meta_title || `${payload.title} | Drawdown`,
    meta_description: payload.meta_description || payload.excerpt,
    updated_at: date,
    ...(payload.published ? { published_at: date } : {})
  };

  let result;
  if (payload.id) {
    result = await supabase
      .from("blog_posts")
      .update(record)
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("blog_posts")
      .insert({ ...record, created_at: date })
      .select()
      .single();
  }

  if (result.error) {
    throw new Error(`Failed to save blog post: ${result.error.message}`);
  }

  return { success: true, post: result.data };
}
