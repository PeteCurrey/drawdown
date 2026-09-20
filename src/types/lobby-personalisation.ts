// src/types/lobby-personalisation.ts
// Domain types for user personalisation, watchlists, saved stories, and alert preferences

import type { LobbyArticle, LobbyEventItem } from "./lobby";

export interface UserLobbyPreferences {
  user_id: string;
  followed_markets: string[];
  followed_brokers: string[];
  followed_prop_firms: string[];
  followed_platforms: string[];
  followed_categories: string[];
  followed_tools: string[];
  alert_new_articles: boolean;
  alert_broker_updates: boolean;
  alert_prop_firm_updates: boolean;
  alert_market_events: boolean;
  alert_drawdown_updates: boolean;
  wire_digest_subscribed: boolean;
  updated_at: string;
}

export interface UserSavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  article?: LobbyArticle;
}

export interface PersonalLobbyFeed {
  greeting: string;
  userName: string;
  hasFollows: boolean;
  followedMarkets: string[];
  followedBrokers: string[];
  followedPropFirms: string[];
  followedPlatforms: string[];
  followedCategories: string[];
  followedTools: string[];
  curatedArticles: LobbyArticle[];
  matchedEvents: LobbyEventItem[];
  recommendedTools: Array<{
    slug: string;
    name: string;
    href: string;
    description: string;
    reason: string;
  }>;
}
