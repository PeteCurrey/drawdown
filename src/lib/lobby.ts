// src/lib/lobby.ts
// The Lobby Data Access Layer, Categories, Slug Mappings, and Tool Directories

import { createClient } from "@supabase/supabase-js";
import type { 
  LobbyArticle, 
  LobbyCategory, 
  LobbyArticleType, 
  LobbySection 
} from "../types/lobby";
import { slugToCategory } from "./lobby-constants";

export * from "./lobby-constants";

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
