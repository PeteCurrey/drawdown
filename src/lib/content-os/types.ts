// src/lib/content-os/types.ts
// Core domain interfaces and enums for Drawdown Content OS (Phase 1)

export type ContentItemType = 
  | 'evergreen' 
  | 'educational' 
  | 'case_study' 
  | 'market_analysis' 
  | 'product' 
  | 'announcement' 
  | 'news' 
  | 'opinion' 
  | 'weekly_recap';

export type ContentStatus = 
  | 'idea' 
  | 'draft' 
  | 'review' 
  | 'approved' 
  | 'scheduled' 
  | 'published' 
  | 'archived';

export type ContentPriority = 'critical' | 'high' | 'medium' | 'low';

export type ContentAssetType = 'image' | 'carousel' | 'video' | 'chart' | 'social_graphic';

export type SocialChannel = 
  | 'instagram' 
  | 'x' 
  | 'linkedin' 
  | 'threads' 
  | 'facebook' 
  | 'bluesky' 
  | 'tiktok';

export type SocialDeliveryStatus = 
  | 'queued' 
  | 'publishing' 
  | 'published' 
  | 'failed' 
  | 'retrying' 
  | 'unconfirmed' 
  | 'cancelled';

export type NewsSourceType = 
  | 'rss' 
  | 'corporate_newsroom' 
  | 'regulator' 
  | 'government' 
  | 'central_bank' 
  | 'exchange' 
  | 'financial_publication' 
  | 'api';

export type NewsTrustTier = 
  | 'tier_1_primary' 
  | 'tier_2_verified' 
  | 'tier_3_secondary' 
  | 'tier_4_untrusted';

export type NewsVerificationStatus = 
  | 'unverified' 
  | 'partially_verified' 
  | 'verified' 
  | 'rejected';

export type NewsEditorialStatus = 
  | 'new' 
  | 'reviewing' 
  | 'draft_ready' 
  | 'approved' 
  | 'published' 
  | 'ignored';

export type VisualFamily = 
  | 'BREAKING' 
  | 'DATA' 
  | 'EXPLAINER' 
  | 'CASE_STUDY' 
  | 'DRAWDOWN' 
  | 'MARKET_UPDATE' 
  | 'WEEKLY_RECAP';

export interface ContentItem {
  id: string;
  content_type: ContentItemType;
  title: string;
  slug: string;
  status: ContentStatus;
  category: string;
  priority: ContentPriority;
  source_type: 'original' | 'news' | 'research' | 'evergreen';
  source_reference?: string | null;
  body: string;
  excerpt?: string | null;
  canonical_url?: string | null;
  published_at?: string | null;
  scheduled_at?: string | null;
  created_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  metadata?: Record<string, any>;
  content_channels?: ContentChannel[];
  created_at: string;
  updated_at: string;
}

export interface ContentAsset {
  id: string;
  content_item_id: string;
  asset_type: ContentAssetType;
  storage_url: string;
  alt_text?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  aspect_ratio?: '1:1' | '4:5' | '1.91:1' | '16:9' | string | null;
  display_order: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ContentChannel {
  id: string;
  content_item_id: string;
  channel: SocialChannel;
  headline?: string | null;
  body: string;
  hashtags: string[];
  media_references: Array<{
    asset_id?: string;
    url: string;
    type: ContentAssetType;
    aspect_ratio?: string;
    slide_index?: number;
  }>;
  status: 'draft' | 'ready' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string | null;
  published_at?: string | null;
  provider: string;
  provider_post_id?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SocialDelivery {
  id: string;
  content_channel_id: string;
  provider: string;
  channel: SocialChannel;
  status: SocialDeliveryStatus;
  provider_post_id?: string | null;
  published_at?: string | null;
  failure_reason?: string | null;
  retry_count: number;
  raw_response?: Record<string, any>;
  idempotency_key?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentMetric {
  id: string;
  content_channel_id: string;
  metric_name: string;
  metric_value: number;
  observed_at: string;
  provider: string;
  channel: SocialChannel;
  raw_metrics?: Record<string, any>;
  created_at: string;
}

export type SocialSourcePlatform = 'rss' | 'x' | 'linkedin' | 'threads' | 'bluesky' | 'youtube' | 'other';

export type SourceMonitoringStatus = 
  | 'configured' 
  | 'connected' 
  | 'scheduled' 
  | 'ingested' 
  | 'failed' 
  | 'unavailable';

export type SocialSourceCategory =
  | 'investor'
  | 'fund_manager'
  | 'market_commentator'
  | 'trader'
  | 'macro'
  | 'company_executive'
  | 'financial_news'
  | 'sector_specialist'
  | 'strategy_education'
  | 'market_recap'
  | string;

export interface NewsSource {
  id: string;
  name: string;
  source_type: NewsSourceType;
  domain: string;
  feed_url: string;
  platform?: SocialSourcePlatform;
  account_handle?: string | null;
  source_category?: SocialSourceCategory;
  monitoring_status?: SourceMonitoringStatus;
  active: boolean;
  priority: number;
  trust_tier: NewsTrustTier;
  metadata?: Record<string, any>;
  last_fetched_at?: string | null;
  last_attempted_at?: string | null;
  last_failure_reason?: string | null;
  error_details?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsCandidate {
  id: string;
  title: string;
  summary: string;
  source: string;
  source_url: string;
  published_at?: string | null;
  discovered_at: string;
  entity_references: string[];
  related_symbols: string[];
  asset_classes: string[];
  relevance_score: number;
  market_impact_score: number;
  confidence_score: number;
  priority_level: ContentPriority;
  scoring_reasons: string[];
  duplicate_key: string;
  parent_event_id?: string | null;
  corroborating_sources: Array<{
    source_name: string;
    url: string;
    trust_tier: NewsTrustTier;
    published_at?: string;
  }>;
  verification_status: NewsVerificationStatus;
  verification_evidence?: Record<string, any>;
  editorial_status: NewsEditorialStatus;
  content_item_id?: string | null;
  processed_at?: string | null;
  raw_payload?: Record<string, any>;
  // Epistemic separation & social fields
  source_claim?: string | null;
  verified_facts?: Array<{
    claim: string;
    source: string;
    source_url?: string;
    verified_at?: string;
  }>;
  drawdown_interpretation?: string | null;
  platform_post_id?: string | null;
  author_handle?: string | null;
  investor_attention_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ContentAuditLog {
  id: string;
  entity_type: 'content_item' | 'content_channel' | 'social_delivery' | 'news_candidate';
  entity_id: string;
  actor_id: string;
  previous_state?: string | null;
  new_state: string;
  reason?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}
