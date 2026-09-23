/**
 * Drawdown Intelligence Data Platform — Social Provider Abstraction
 *
 * Provider-agnostic interface for curated social accounts and feeds.
 * Adheres strictly to Phase 1 rules:
 * - Real API access only (no unofficial web scrapers, no credential harvesting)
 * - Truthful delivery states: UNAVAILABLE / NOT_CONFIGURED when keys/APIs are missing
 * - No fake posts, no simulated API responses in production
 */

import { BaseProvider } from "./base.ts";
import type { 
  SourceCategory, 
  SourceReliability, 
  AuthenticationType, 
  RateLimitConfig, 
  AttributionPolicy, 
  LicensePolicy,
  RawFetchResult,
  NormalizedIngestionBundle,
  ProviderHealthReport,
  DataEvent
} from "../types.ts";

export interface SocialPostRawItem {
  id: string;
  text: string;
  authorHandle: string;
  authorName?: string;
  authorId?: string;
  publishedAt: string;
  url: string;
  metrics?: {
    likes?: number;
    reposts?: number;
    replies?: number;
  };
  entities?: {
    symbols?: string[];
    urls?: string[];
    mentions?: string[];
    hashtags?: string[];
  };
  referencedPosts?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
}

export interface SocialSourceConfig {
  sourceId: string;
  name: string;
  handle: string;
  platform: 'x' | 'bluesky' | 'threads' | 'rss' | 'other';
  category: string;
  reliability: SourceReliability;
  targetFeedUrl?: string;
}

export abstract class SocialProvider extends BaseProvider {
  abstract readonly platform: string;

  /**
   * Evaluates the connection state truthfully.
   */
  abstract checkHealth(): Promise<ProviderHealthReport>;

  /**
   * Fetches latest posts for a monitored account.
   */
  abstract fetchUserTimeline(config: SocialSourceConfig): Promise<{
    posts: SocialPostRawItem[];
    rawFetch: RawFetchResult;
    status: 'SUCCESS' | 'NOT_CONFIGURED' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'ERROR';
    errorMessage?: string;
  }>;
}
