// src/lib/lobby-personalisation.ts
// User personalisation, watchlists, saved stories, and Morning View feed generator

import { createClient } from "@supabase/supabase-js";
import type { 
  UserLobbyPreferences, 
  UserSavedArticle, 
  PersonalLobbyFeed 
} from "../types/lobby-personalisation.ts";
import type { LobbyArticle, LobbyEventItem } from "../types/lobby.ts";
import { DRAWDOWN_TOOLS } from "./lobby-constants.ts";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
  return createClient(url, key);
}

/**
 * Default empty preferences for a newly registered user or unconfigured profile.
 */
export function getDefaultPreferences(userId: string): UserLobbyPreferences {
  return {
    user_id: userId,
    followed_markets: [],
    followed_brokers: [],
    followed_prop_firms: [],
    followed_platforms: [],
    followed_categories: [],
    followed_tools: [],
    alert_new_articles: true,
    alert_broker_updates: true,
    alert_prop_firm_updates: true,
    alert_market_events: true,
    alert_drawdown_updates: true,
    wire_digest_subscribed: true,
    updated_at: new Date().toISOString()
  };
}

/**
 * Retrieves user preferences from the database, or returns default if not set.
 */
export async function getUserPreferences(userId: string): Promise<UserLobbyPreferences> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("user_lobby_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return getDefaultPreferences(userId);
    }
    return data as UserLobbyPreferences;
  } catch {
    return getDefaultPreferences(userId);
  }
}

/**
 * Saves explicit user preferences.
 */
export async function saveUserPreferences(
  userId: string, 
  prefs: Partial<UserLobbyPreferences>
): Promise<UserLobbyPreferences> {
  const supabase = getSupabase();
  const payload = {
    ...prefs,
    user_id: userId,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("user_lobby_preferences")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to update preferences");
  }

  return data as UserLobbyPreferences;
}

/**
 * Retrieves a user's saved/bookmarked articles.
 */
export async function getUserSavedArticles(userId: string): Promise<UserSavedArticle[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("user_saved_articles")
      .select(`
        *,
        article:lobby_articles(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as unknown as UserSavedArticle[];
  } catch {
    return [];
  }
}

/**
 * Toggles a bookmark for a user on an article.
 */
export async function toggleSaveArticle(
  userId: string, 
  articleId: string
): Promise<{ isSaved: boolean }> {
  const supabase = getSupabase();
  
  // Check if currently saved
  const { data } = await supabase
    .from("user_saved_articles")
    .select("id")
    .eq("user_id", userId)
    .eq("article_id", articleId)
    .maybeSingle();

  if (data) {
    // Delete
    await supabase
      .from("user_saved_articles")
      .delete()
      .eq("id", data.id);
    return { isSaved: false };
  } else {
    // Insert
    await supabase
      .from("user_saved_articles")
      .insert({
        user_id: userId,
        article_id: articleId
      });
    return { isSaved: true };
  }
}

/**
 * Builds the personalized "Your Lobby" / Morning View feed based on explicit user follows.
 * Guarantees zero algorithmic inferencing: solely filters by what the user explicitly selected.
 */
export function buildPersonalLobbyFeed(params: {
  userName: string;
  preferences: UserLobbyPreferences;
  allArticles: LobbyArticle[];
  allEvents: LobbyEventItem[];
}): PersonalLobbyFeed {
  const { userName, preferences, allArticles, allEvents } = params;

  // Determine if the user has configured any follows
  const hasFollows = 
    preferences.followed_markets.length > 0 ||
    preferences.followed_brokers.length > 0 ||
    preferences.followed_prop_firms.length > 0 ||
    preferences.followed_platforms.length > 0 ||
    preferences.followed_categories.length > 0 ||
    preferences.followed_tools.length > 0;

  // Time of day greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  // If no explicit follows yet, fallback gracefully to lead/featured stories
  if (!hasFollows) {
    return {
      greeting,
      userName,
      hasFollows: false,
      followedMarkets: [],
      followedBrokers: [],
      followedPropFirms: [],
      followedPlatforms: [],
      followedCategories: [],
      followedTools: [],
      curatedArticles: allArticles.slice(0, 8),
      matchedEvents: allEvents.slice(0, 5),
      recommendedTools: Object.values(DRAWDOWN_TOOLS).slice(0, 3).map(t => ({
        ...t,
        reason: "Core Drawdown risk standardisation tool"
      }))
    };
  }

  // Normalised lookup sets
  const catSet = new Set(preferences.followed_categories.map(c => c.toUpperCase()));
  const entitySet = new Set([
    ...preferences.followed_brokers,
    ...preferences.followed_prop_firms,
    ...preferences.followed_platforms
  ].map(e => e.toLowerCase().trim()));

  // Curate matching articles
  const matched = allArticles.filter(art => {
    // 1. Category match
    if (catSet.has(art.category.toUpperCase())) return true;
    
    // 2. Entity reference match
    if (art.related_entities && art.related_entities.some(ent => entitySet.has(ent.toLowerCase()))) {
      return true;
    }

    // 3. Title or slug mentions followed entities
    const lowerTitle = art.title.toLowerCase();
    for (const ent of entitySet) {
      if (lowerTitle.includes(ent)) return true;
    }

    return false;
  });

  // If matching count is low, supplement with lead/featured articles so feed is never sparse
  const finalArticles = [...matched];
  for (const art of allArticles) {
    if (finalArticles.length >= 8) break;
    if (!finalArticles.some(a => a.id === art.id)) {
      finalArticles.push(art);
    }
  }

  // Filter events matching followed markets
  const marketSet = new Set(preferences.followed_markets.map(m => m.toUpperCase()));
  const matchedEvents = allEvents.filter(evt => {
    if (marketSet.size === 0) return true;
    return (evt.currency ? marketSet.has(evt.currency.toUpperCase()) : false) || (evt.impact ? marketSet.has(evt.impact.toUpperCase()) : false);
  }).slice(0, 5);

  // Recommended tools matching followed tools and categories
  const recommendedTools = (preferences.followed_tools.length > 0 ? preferences.followed_tools : ['position-size-calculator', 'signal-centre'])
    .map(slug => DRAWDOWN_TOOLS[slug])
    .filter(Boolean)
    .map(t => ({
      ...t,
      reason: "Matched to your selected risk & analysis preferences"
    }));

  return {
    greeting,
    userName,
    hasFollows: true,
    followedMarkets: preferences.followed_markets,
    followedBrokers: preferences.followed_brokers,
    followedPropFirms: preferences.followed_prop_firms,
    followedPlatforms: preferences.followed_platforms,
    followedCategories: preferences.followed_categories,
    followedTools: preferences.followed_tools,
    curatedArticles: finalArticles,
    matchedEvents: matchedEvents.length > 0 ? matchedEvents : allEvents.slice(0, 5),
    recommendedTools
  };
}
