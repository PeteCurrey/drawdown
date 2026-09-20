// src/types/lobby.ts
// Core domain interfaces and enums for Drawdown The Lobby

export type LobbyCategory =
  | 'MARKETS'
  | 'BROKERS'
  | 'PROP FIRMS'
  | 'PLATFORMS'
  | 'MACRO'
  | 'REGULATION'
  | 'TRADING TECHNOLOGY'
  | 'TRADES'
  | 'DRAWDOWN'
  | 'EDUCATION'
  | 'INDUSTRY'
  | 'OTHER';

export type LobbyArticleType =
  | 'NEWS'
  | 'ANALYSIS'
  | 'EXPLAINER'
  | 'INDUSTRY UPDATE'
  | 'TRADE FEATURE'
  | 'PLATFORM SPOTLIGHT'
  | 'BROKER WATCH'
  | 'PROP FIRM WATCH'
  | 'DRAWDOWN FEATURE';

export type LobbyStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type LobbyConfidence = 'VERIFIED' | 'KNOWN' | 'INFERRED' | 'UNKNOWN';

export type LobbyImportance = 'lead' | 'featured' | 'standard' | 'bulletin';

export type LobbySection =
  | 'lead'
  | 'whats_happening'
  | 'just_in'
  | 'coming_up'
  | 'watchlist'
  | 'broker_watch'
  | 'prop_firm_watch'
  | 'platform_spotlight'
  | 'trade_of_the_month'
  | 'drawdown_desk'
  | 'explained'
  | 'standard';

export interface LobbySource {
  id?: string;
  name: string;
  url: string;
  published_at?: string;
  source_type: string;
  classification: 'primary' | 'secondary';
  notes?: string;
}

export interface LobbyComingUpEvent {
  event_name: string;
  date: string;
  time: string;
  market_category: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  short_explanation: string;
}

export interface LobbyWatchlistItem {
  what: string;
  why_it_matters: string;
  when: string;
  related_content?: string;
}

export interface LobbyBrokerWatchData {
  broker_name: string;
  story_headline: string;
  what_changed: string;
  effective_date: string;
  source_citation: string;
  broker_slug?: string;
}

export interface LobbyPropFirmWatchData {
  company: string;
  change_update: string;
  effective_date: string;
  previous_state: string;
  current_state: string;
  source_citation: string;
  prop_firm_slug?: string;
}

export interface LobbyTradeFeatureData {
  instrument: string;
  setup: string;
  entry: string | number;
  stop: string | number;
  target: string | number;
  risk_reward: string;
  outcome: string;
  timeframe: string;
  explanation: string;
  historical_disclaimer?: string;
}

export interface LobbyArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: LobbyCategory;
  subcategory?: string | null;
  article_type: LobbyArticleType;
  status: LobbyStatus;
  confidence: LobbyConfidence;
  importance: LobbyImportance;
  section: LobbySection;
  author_id?: string | null;
  author_name: string;
  author_role?: string | null;
  hero_image_url?: string | null;
  hero_image_alt?: string | null;
  hero_image_caption?: string | null;
  hero_image_credit?: string | null;
  reading_time_minutes: number;
  tags: string[];
  sources: LobbySource[];
  primary_source_name?: string | null;
  primary_source_url?: string | null;
  primary_source_date?: string | null;
  primary_source_type?: string | null;
  primary_source_classification?: 'primary' | 'secondary' | null;
  editorial_metadata?: Record<string, any>;
  related_article_slugs: string[];
  related_tool_slugs: string[];
  related_broker_slugs: string[];
  related_prop_firm_slugs: string[];
  related_platform_slugs: string[];
  related_markets: string[];
  related_entities?: string[];
  related_tools?: string[];
  data_confidence?: LobbyConfidence;
  meta_title?: string | null;
  meta_description?: string | null;
  schema_type: 'Article' | 'NewsArticle';
  canonical_url?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LobbyAuditLog {
  id: string;
  article_id: string;
  action: 'created' | 'edited' | 'submitted_for_review' | 'published' | 'unpublished' | 'archived';
  actor_id: string;
  actor_email?: string | null;
  previous_status?: string | null;
  new_status?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface LobbySourceRegistryItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  source_type: string;
  reliability_classification: string;
  polling_frequency_minutes: number;
  active: boolean;
  last_checked?: string | null;
  last_successful_check?: string | null;
  error_state?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LobbyEventItem {
  id: string;
  title: string;
  summary: string;
  event_type: string;
  entity_references: string[];
  related_symbols: string[];
  primary_source_url?: string | null;
  corroborating_sources: LobbySource[];
  importance: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  currency?: string;
  impact?: string;
  event_time?: string;
  forecast?: string;
  status: 'DETECTED' | 'RESEARCHING' | 'DRAFTED' | 'NEEDS_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED';
  article_id?: string | null;
  discovered_at: string;
  created_at: string;
  updated_at: string;
}
