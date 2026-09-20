// src/lib/lobby.ts
// The Lobby Data Access Layer, Categories, Slug Mappings, and Tool Directories

import type { 
  LobbyArticle, 
  LobbyCategory, 
  LobbyArticleType, 
  LobbySection 
} from "../types/lobby";

async function getSupabase() {
  const { createInternalSupabase } = await import("./supabase/server");
  return createInternalSupabase();
}

export const LOBBY_CATEGORIES: LobbyCategory[] = [
  'MARKETS',
  'BROKERS',
  'PROP FIRMS',
  'PLATFORMS',
  'MACRO',
  'REGULATION',
  'TRADING TECHNOLOGY',
  'TRADES',
  'DRAWDOWN',
  'EDUCATION',
  'INDUSTRY',
  'OTHER'
];

export const LOBBY_ARTICLE_TYPES: LobbyArticleType[] = [
  'NEWS',
  'ANALYSIS',
  'EXPLAINER',
  'INDUSTRY UPDATE',
  'TRADE FEATURE',
  'PLATFORM SPOTLIGHT',
  'BROKER WATCH',
  'PROP FIRM WATCH',
  'DRAWDOWN FEATURE'
];

/**
 * Converts a controlled category to an SEO-friendly URL slug.
 */
export function categoryToSlug(category: LobbyCategory): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Resolves a URL slug to its controlled LobbyCategory, or null if invalid.
 */
export function slugToCategory(slug: string): LobbyCategory | null {
  const normalised = slug.toLowerCase().trim();
  const match = LOBBY_CATEGORIES.find(
    cat => categoryToSlug(cat) === normalised
  );
  return match || null;
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
    const supabase = await getSupabase();
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
    const supabase = await getSupabase();
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
    const supabase = await getSupabase();
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
    const supabase = await getSupabase();
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

// ─── Real Drawdown Tool & Entity Reference Catalogues ────────────────────────
export interface ToolReference {
  slug: string;
  name: string;
  href: string;
  description: string;
}

export const DRAWDOWN_TOOLS: Record<string, ToolReference> = {
  "position-size-calculator": {
    slug: "position-size-calculator",
    name: "Position Size Calculator",
    href: "/tools/position-size-calculator",
    description: "Exact lot sizing, invalidation distance & cash risk standardisation.",
  },
  "drawdown-recovery-calculator": {
    slug: "drawdown-recovery-calculator",
    name: "Drawdown Recovery Calculator",
    href: "/tools/drawdown-recovery-calculator",
    description: "Loss asymmetry analysis & break-even trade modeling.",
  },
  "pip-value-calculator": {
    slug: "pip-value-calculator",
    name: "Pip Value Calculator",
    href: "/tools/pip-value-calculator",
    description: "Multi-currency pip and tick values across account currencies.",
  },
  "risk-of-ruin-calculator": {
    slug: "risk-of-ruin-calculator",
    name: "Risk of Ruin Calculator",
    href: "/tools/risk-of-ruin-calculator",
    description: "Statistical probability of catastrophic capital depletion.",
  },
  "forex-market-hours": {
    slug: "forex-market-hours",
    name: "Forex Market Hours",
    href: "/tools/forex-market-hours",
    description: "Live session clock with London & New York liquidity overlap radar.",
  },
  "signal-centre": {
    slug: "signal-centre",
    name: "Signal Centre",
    href: "/signal-centre",
    description: "AI consensus decision support across Claude, GPT-4o, and Grok.",
  },
  "ai-trade-journal": {
    slug: "ai-trade-journal",
    name: "AI Trade Journal",
    href: "/tools/ai-trade-journal",
    description: "Execution audit and behavioural bias detection.",
  }
};

export interface EntityReference {
  slug: string;
  name: string;
  href: string;
  type: 'broker' | 'prop_firm' | 'platform';
}

export const DRAWDOWN_ENTITIES: Record<string, EntityReference> = {
  // Brokers
  "pepperstone": { slug: "pepperstone", name: "Pepperstone", href: "/brokers/pepperstone", type: "broker" },
  "ig-markets": { slug: "ig-markets", name: "IG Markets", href: "/brokers/ig-markets", type: "broker" },
  "ic-markets": { slug: "ic-markets", name: "IC Markets", href: "/brokers/ic-markets", type: "broker" },
  // Prop Firms
  "ftmo": { slug: "ftmo", name: "FTMO", href: "/prop-firms/ftmo", type: "prop_firm" },
  "the5ers": { slug: "the5ers", name: "The5ers", href: "/prop-firms/the5ers", type: "prop_firm" },
  "funding-pips": { slug: "funding-pips", name: "Funding Pips", href: "/prop-firms/funding-pips", type: "prop_firm" },
  // Platforms
  "tradingview": { slug: "tradingview", name: "TradingView", href: "/tools/tradingview", type: "platform" },
  "metatrader-5": { slug: "metatrader-5", name: "MetaTrader 5", href: "/tools", type: "platform" },
  "ctrader": { slug: "ctrader", name: "cTrader", href: "/tools", type: "platform" }
};
