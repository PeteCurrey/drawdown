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

import { 
  evaluateComingUpEventEligibility,
  DATASET_FRESHNESS_CONFIG,
} from "./data-freshness-policy.ts";

export interface GetArticlesOptions {
  category?: LobbyCategory;
  section?: LobbySection;
  article_type?: LobbyArticleType;
  importance?: 'lead' | 'featured' | 'standard' | 'bulletin';
  limit?: number;
  offset?: number;
  excludeStale?: boolean;
}

/**
 * Retrieves public, published Lobby articles.
 * Strictly enforces `status = 'PUBLISHED'`, `confidence != 'UNKNOWN'`,
 * `is_test != true`, and excludes retired records.
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
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
      .or(`retire_at.is.null,retire_at.gt.${new Date().toISOString()}`)
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
    if (options.excludeStale) {
      const cutoff = new Date(Date.now() - DATASET_FRESHNESS_CONFIG.lobby_lead.maxEligibilityAgeMs).toISOString();
      query = query.gte("published_at", cutoff);
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
 * STRICT FRESHNESS & ELIGIBILITY ENFORCEMENT:
 * Must be <= 72 hours old (from DATASET_FRESHNESS_CONFIG.lobby_lead.maxEligibilityAgeMs).
 * If no article meets the threshold, returns null.
 * NEVER returns a stale lead story to the UI.
 */
export async function getLobbyLeadStory(): Promise<LobbyArticle | null> {
  const maxAgeMs = DATASET_FRESHNESS_CONFIG.lobby_lead.maxEligibilityAgeMs;
  const cutoff = new Date(Date.now() - maxAgeMs).toISOString();

  // Try explicit lead section first with strict freshness cutoff
  const leadStories = await getLobbyArticles({
    section: 'lead',
    excludeStale: true,
    limit: 1
  });
  if (leadStories.length > 0) return leadStories[0];

  // Fallback to latest published article from any section, but STILL strictly within the 72h window
  const fallback = await getLobbyArticles({
    excludeStale: true,
    limit: 1
  });
  return fallback.length > 0 ? fallback[0] : null;
}

/**
 * Fetches live upcoming events for the Coming Up timetable.
 * EVENT-DATE-DRIVEN:
 * Strictly filters by primary_source_date >= UTC_TODAY.
 * Excludes past events regardless of article creation date.
 */
export async function getLobbyComingUpEvents(): Promise<import("../types/lobby.ts").LobbyComingUpEvent[]> {
  try {
    const articles = await getLobbyArticles({
      section: 'coming_up',
      limit: 10
    });

    const nowUtc = new Date();
    const validEvents: import("../types/lobby.ts").LobbyComingUpEvent[] = [];

    for (const article of articles) {
      const eventDate = article.primary_source_date || article.editorial_metadata?.event_date;
      const eligibility = evaluateComingUpEventEligibility(eventDate, nowUtc);

      if (eligibility.isUpcoming && eventDate) {
        const d = new Date(eventDate);
        const formattedDate = d.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        });
        const formattedTime = d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        });

        validEvents.push({
          event_name: article.title,
          date: formattedDate,
          time: formattedTime,
          market_category: article.category || "MACRO",
          importance: (article.importance === 'lead' ? 'CRITICAL' : article.importance === 'featured' ? 'HIGH' : 'MEDIUM') as any,
          short_explanation: article.excerpt || article.body.slice(0, 160),
        });
      }
    }

    return validEvents.slice(0, 6);
  } catch (err) {
    console.error("getLobbyComingUpEvents error:", err);
    return [];
  }
}

/**
 * Fetches dynamic watchlist surveillance items from lobby_articles.
 * Freshness window: published within the last 14 days.
 */
export async function getLobbyWatchlistItems(): Promise<import("../types/lobby.ts").LobbyWatchlistItem[]> {
  try {
    const cutoff = new Date(Date.now() - DATASET_FRESHNESS_CONFIG.lobby_watchlist.maxEligibilityAgeMs).toISOString();
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("lobby_articles")
      .select("*")
      .eq("status", "PUBLISHED")
      .eq("section", "watchlist")
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
      .gte("published_at", cutoff)
      .or(`retire_at.is.null,retire_at.gt.${new Date().toISOString()}`)
      .order("published_at", { ascending: false })
      .limit(6);

    if (error || !data) return [];

    return data.map((a: LobbyArticle) => ({
      what: a.title,
      why_it_matters: a.excerpt || a.editorial_metadata?.why_it_matters || "",
      when: a.editorial_metadata?.when || "Ongoing Surveillance",
      related_content: a.related_article_slugs?.[0] || undefined,
    }));
  } catch (err) {
    console.error("getLobbyWatchlistItems error:", err);
    return [];
  }
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
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
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
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
      .or(`retire_at.is.null,retire_at.gt.${new Date().toISOString()}`)
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
      .neq("is_test", true)
      .eq("data_classification", "PRODUCTION_VERIFIED")
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
 * Fetches latest published items from lobby_items (Instagram & monitored sources) first,
 * supplemented by approved candidates.
 */
export async function getInvestorAttentionFeed(options: { limit?: number } = {}): Promise<InvestorAttentionItem[]> {
  try {
    const supabase = getSupabase();
    const limit = options.limit || 6;

    // 1. Fetch latest published items from lobby_items (Instagram & specialist sources)
    const { data: lobbyData, error: lobbyError } = await supabase
      .from("lobby_items")
      .select(`
        id,
        source_id,
        original_url,
        posted_at,
        extracted_claims,
        verified_facts,
        status,
        created_at,
        monitored_sources:source_id (
          id,
          platform,
          handle
        )
      `)
      .eq("status", "published")
      .order("posted_at", { ascending: false })
      .limit(limit);

    const formattedLobbyItems: InvestorAttentionItem[] = (lobbyData || []).map((row: any) => {
      const claimsObj = row.extracted_claims || {};
      const claimsList = Array.isArray(claimsObj.claims) ? claimsObj.claims : [];
      return {
        id: row.id,
        title: claimsObj.headline || "Monitored Market Dispatch",
        source: row.monitored_sources?.platform === "instagram" ? "Instagram" : "Monitored Source",
        source_url: row.original_url,
        author_handle: row.monitored_sources?.handle || null,
        published_at: row.posted_at || row.created_at,
        discovered_at: row.created_at,
        entity_references: [],
        related_symbols: [],
        source_claim: claimsList[0] || null,
        verified_facts: Array.isArray(row.verified_facts) ? row.verified_facts : [],
        drawdown_interpretation: claimsObj.avorria_commentary || null,
        investor_attention_score: 1.0,
      };
    });

    if (formattedLobbyItems.length >= limit) {
      return formattedLobbyItems.slice(0, limit);
    }

    // 2. Supplement from news_candidates if more slots available
    const remainingLimit = limit - formattedLobbyItems.length;
    const { data: newsData } = await supabase
      .from("news_candidates")
      .select("id, title, source, source_url, author_handle, published_at, discovered_at, entity_references, related_symbols, source_claim, verified_facts, drawdown_interpretation, investor_attention_score")
      .in("editorial_status", ["approved", "published"])
      .not("source_claim", "is", null)
      .order("discovered_at", { ascending: false })
      .limit(remainingLimit);

    return [...formattedLobbyItems, ...((newsData || []) as InvestorAttentionItem[])].slice(0, limit);
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
      primary_source_name: item.source_reference || "Avorria Research",
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


