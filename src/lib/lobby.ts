// src/lib/lobby.ts
// The Lobby Data Access Layer, Categories, Slug Mappings, and Tool Directories

import { createClient } from "@supabase/supabase-js";
import type { 
  LobbyArticle, 
  LobbyCategory, 
  LobbyArticleType, 
  LobbySection 
} from "../types/lobby.ts";
import { slugToCategory } from "./lobby-constants.ts";

export * from "./lobby-constants.ts";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  return createClient(url, key);
}

export interface GetArticlesOptions {
  category?: LobbyCategory;
  section?: LobbySection;
  article_type?: LobbyArticleType;
  importance?: 'lead' | 'featured' | 'standard' | 'bulletin';
  limit?: number;
  offset?: number;
}

/**
 * Retrieves public, published Lobby articles.
 * Strictly enforces `status = 'PUBLISHED'` and `confidence != 'UNKNOWN'`.
 */
export async function getLobbyArticles(
  options: GetArticlesOptions = {}
): Promise<LobbyArticle[]> {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from("lobby_articles")
      .select("*")
      .eq("status", "PUBLISHED")
      .neq("confidence", "UNKNOWN")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (options.category) {
      query = query.eq("category", options.category);
    }
    if (options.section) {
      query = query.eq("section", options.section);
    }
    if (options.article_type) {
      query = query.eq("article_type", options.article_type);
    }
    if (options.importance) {
      query = query.eq("importance", options.importance);
    }
    if (options.limit) {
      const from = options.offset || 0;
      query = query.range(from, from + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) {
      // Return empty array defensively if table has not been migrated in environment
      return [];
    }

    return (data || []) as LobbyArticle[];
  } catch (err) {
    console.error("getLobbyArticles unexpected error:", err);
    return [];
  }
}

/**
 * Fetches the current primary Lead Story.
 */
export async function getLobbyLeadStory(): Promise<LobbyArticle | null> {
  const leadStories = await getLobbyArticles({
    section: 'lead',
    limit: 1
  });
  if (leadStories.length > 0) return leadStories[0];

  // Fallback to latest published featured/lead article
  const fallback = await getLobbyArticles({ limit: 1 });
  return fallback.length > 0 ? fallback[0] : null;
}

/**
 * Fetches a single public article by category slug and article slug.
 * Strictly enforces publication status.
 */
export async function getLobbyArticleBySlug(
  categorySlug: string,
  slug: string
): Promise<LobbyArticle | null> {
  const category = slugToCategory(categorySlug);
  if (!category) return null;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("lobby_articles")
      .select("*")
      .eq("slug", slug)
      .eq("category", category)
      .eq("status", "PUBLISHED")
      .neq("confidence", "UNKNOWN")
      .maybeSingle();

    if (error || !data) return null;
    return data as LobbyArticle;
  } catch (err) {
    console.error(`getLobbyArticleBySlug [${slug}] unexpected error:`, err);
    return null;
  }
}

/**
 * Fetches articles for chronological archive with pagination and optional search/category.
 */
export async function getLobbyArchive(options: {
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ articles: LobbyArticle[]; totalCount: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 15;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = getSupabase();
    let dbQuery = supabase
      .from("lobby_articles")
      .select("*", { count: "exact" })
      .eq("status", "PUBLISHED")
      .neq("confidence", "UNKNOWN")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (options.categorySlug) {
      const category = slugToCategory(options.categorySlug);
      if (category) {
        dbQuery = dbQuery.eq("category", category);
      }
    }

    if (options.query && options.query.trim().length > 0) {
      const q = `%${options.query.trim()}%`;
      dbQuery = dbQuery.or(`title.ilike.${q},excerpt.ilike.${q},body.ilike.${q}`);
    }

    dbQuery = dbQuery.range(from, to);

    const { data, count, error } = await dbQuery;
    if (error) {
      return { articles: [], totalCount: 0, totalPages: 0 };
    }

    const totalCount = count || 0;
    return {
      articles: (data || []) as LobbyArticle[],
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (err) {
    console.error("getLobbyArchive unexpected error:", err);
    return { articles: [], totalCount: 0, totalPages: 0 };
  }
}

/**
 * Search across headlines, body, tags, categories, and entities.
 */
export async function searchLobby(query: string, limit: number = 20): Promise<LobbyArticle[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const supabase = getSupabase();
    const cleanQ = `%${query.trim()}%`;

    const { data, error } = await supabase
      .from("lobby_articles")
      .select("*")
      .eq("status", "PUBLISHED")
      .neq("confidence", "UNKNOWN")
      .or(`title.ilike.${cleanQ},excerpt.ilike.${cleanQ},body.ilike.${cleanQ}`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) return [];
    return (data || []) as LobbyArticle[];
  } catch (err) {
    console.error("searchLobby error:", err);
    return [];
  }
}

export interface InvestorAttentionItem {
  id: string;
  title: string;
  source: string;
  source_url: string;
  author_handle?: string | null;
  published_at?: string | null;
  discovered_at: string;
  entity_references: string[];
  related_symbols: string[];
  source_claim?: string | null;
  verified_facts?: Array<{
    claim: string;
    source: string;
    source_url?: string;
    verified_at?: string;
  }>;
  drawdown_interpretation?: string | null;
  investor_attention_score?: number;
}

/**
 * Retrieves approved social intelligence & investor attention items for The Lobby.
 * Strictly requires `editorial_status IN ('approved', 'published')`.
 */
export async function getInvestorAttentionFeed(options: { limit?: number } = {}): Promise<InvestorAttentionItem[]> {
  try {
    const supabase = getSupabase();
    const limit = options.limit || 6;
    const { data, error } = await supabase
      .from("news_candidates")
      .select("id, title, source, source_url, author_handle, published_at, discovered_at, entity_references, related_symbols, source_claim, verified_facts, drawdown_interpretation, investor_attention_score")
      .in("editorial_status", ["approved", "published"])
      .not("source_claim", "is", null)
      .order("discovered_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as InvestorAttentionItem[];
  } catch (err) {
    console.error("getInvestorAttentionFeed error:", err);
    return [];
  }
}

/**
 * Bridges published Drawdown Content OS items directly to The Lobby feeds.
 * Strictly filters by `status = 'published'`.
 */
export async function getContentOSPublishedArticles(options: { limit?: number; category?: string } = {}): Promise<LobbyArticle[]> {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from("content_items")
      .select("id, title, slug, body, excerpt, category, content_type, published_at, created_at, updated_at, source_reference")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || item.body?.slice(0, 200) || "",
      body: item.body || "",
      category: (item.category === "risk_and_drawdown" ? "DRAWDOWN" :
                 item.category === "case_studies" ? "TRADES" :
                 item.category === "trading_education" ? "EDUCATION" :
                 item.category === "product_tools" ? "TRADING TECHNOLOGY" : "MARKETS") as any,
      article_type: "ANALYSIS",
      section: "just_in",
      status: "PUBLISHED",
      importance: "standard",
      confidence: "VERIFIED",
      primary_source_name: item.source_reference || "Drawdown Research",
      published_at: item.published_at || item.created_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tags: [item.category]
    })) as LobbyArticle[];
  } catch (err) {
    console.error("getContentOSPublishedArticles error:", err);
    return [];
  }
}


