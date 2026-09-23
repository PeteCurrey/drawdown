/**
 * Drawdown Intelligence Data Platform — Official X (Twitter) API v2 Provider
 *
 * Adheres strictly to Phase 1 rules:
 * - Legitimate X API v2 endpoints only
 * - Truthfully reports NOT_CONFIGURED / UNAVAILABLE when token is missing
 * - Zero mock tweets or simulated data in production
 */

import { SocialProvider } from "./social-provider.ts";
import type { SocialPostRawItem, SocialSourceConfig } from "./social-provider.ts";
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
import { CredentialManager } from "../credentials.ts";
import { DataNormalizer } from "../normalization.ts";

export class XApiProvider extends SocialProvider {
  readonly id = "x-official-api";
  readonly name = "X (Twitter) Official API v2";
  readonly platform = "x";
  readonly categories: SourceCategory[] = ["SOCIAL", "NEWS", "MARKET"];
  readonly sourceReliability: SourceReliability = "COMMUNITY";
  readonly authenticationType: AuthenticationType = "bearer_token";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 10,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Post intelligence syndicated via X Official API.",
    linkBack: "https://x.com",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: false,
    retentionAllowed: true,
    notes: "Requires compliance with X Developer Terms of Service.",
  };

  protected getCredential(): string | null {
    return process.env.X_API_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN || null;
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    const token = this.getCredential();
    if (!token) {
      return {
        isAvailable: false,
        status: "NOT_CONFIGURED",
        latencyMs: 0,
        error: "X API Bearer token is not configured (X_API_BEARER_TOKEN).",
      };
    }

    try {
      const start = Date.now();
      // Health probe against me / rate limit or light endpoint
      const res = await fetch("https://api.twitter.com/2/users/by/username/twitter", {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "DrawdownIntelligence/1.0",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        return { isAvailable: true, status: "AVAILABLE", latencyMs };
      }

      if (res.status === 429) {
        return {
          isAvailable: false,
          status: "DEGRADED",
          latencyMs,
          error: "X API rate limit reached (HTTP 429).",
        };
      }

      return {
        isAvailable: false,
        status: "UNAVAILABLE",
        latencyMs,
        error: `X API returned HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (err: any) {
      return {
        isAvailable: false,
        status: "UNAVAILABLE",
        latencyMs: 0,
        error: err?.message || "X API connection failed.",
      };
    }
  }

  async fetchUserTimeline(config: SocialSourceConfig): Promise<{
    posts: SocialPostRawItem[];
    rawFetch: RawFetchResult;
    status: 'SUCCESS' | 'NOT_CONFIGURED' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'ERROR';
    errorMessage?: string;
  }> {
    const token = this.getCredential();
    const cleanHandle = config.handle.replace(/^@/, '').trim();

    if (!token) {
      const emptyRaw: RawFetchResult = {
        providerId: this.id,
        endpoint: `https://api.twitter.com/2/users/by/username/${cleanHandle}`,
        httpStatus: 0,
        latencyMs: 0,
        payload: null,
        rawHash: "",
        fetchedAt: new Date().toISOString(),
      };
      return {
        posts: [],
        rawFetch: emptyRaw,
        status: "NOT_CONFIGURED",
        errorMessage: "X API is not connected. Missing X_API_BEARER_TOKEN.",
      };
    }

    const startTime = Date.now();
    try {
      // 1. Resolve user ID from handle
      const userRes = await fetch(
        `https://api.twitter.com/2/users/by/username/${cleanHandle}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        }
      );

      if (!userRes.ok) {
        const errorText = await userRes.text();
        return {
          posts: [],
          rawFetch: {
            providerId: this.id,
            endpoint: `https://api.twitter.com/2/users/by/username/${cleanHandle}`,
            httpStatus: userRes.status,
            latencyMs: Date.now() - startTime,
            payload: null,
            rawHash: "",
            fetchedAt: new Date().toISOString(),
          },
          status: userRes.status === 429 ? "RATE_LIMITED" : "UNAVAILABLE",
          errorMessage: `User lookup failed: ${userRes.status} ${errorText}`,
        };
      }

      const userData = await userRes.json();
      const userId = userData?.data?.id;
      if (!userId) {
        return {
          posts: [],
          rawFetch: {
            providerId: this.id,
            endpoint: `https://api.twitter.com/2/users/by/username/${cleanHandle}`,
            httpStatus: 200,
            latencyMs: Date.now() - startTime,
            payload: userData,
            rawHash: DataNormalizer.generateHash(userData),
            fetchedAt: new Date().toISOString(),
          },
          status: "ERROR",
          errorMessage: `User @${cleanHandle} not found on X.`,
        };
      }

      // 2. Fetch recent tweets
      const tweetUrl = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at,public_metrics,entities,referenced_tweets&max_results=10`;
      const tweetRes = await fetch(tweetUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });

      const latencyMs = Date.now() - startTime;
      const tweetData = await tweetRes.json();
      const rawHash = DataNormalizer.generateHash(tweetData);

      const rawFetch: RawFetchResult = {
        providerId: this.id,
        endpoint: tweetUrl,
        httpStatus: tweetRes.status,
        latencyMs,
        payload: tweetData,
        rawHash,
        fetchedAt: new Date().toISOString(),
      };

      if (!tweetRes.ok) {
        return {
          posts: [],
          rawFetch,
          status: tweetRes.status === 429 ? "RATE_LIMITED" : "ERROR",
          errorMessage: `Tweet fetch error (${tweetRes.status}): ${JSON.stringify(tweetData)}`,
        };
      }

      const tweets = tweetData?.data || [];
      const posts: SocialPostRawItem[] = tweets.map((t: any) => {
        const cashtags = (t.entities?.cashtags || []).map((c: any) => c.tag?.toUpperCase());
        const hashtags = (t.entities?.hashtags || []).map((h: any) => h.tag);
        const urls = (t.entities?.urls || []).map((u: any) => u.expanded_url || u.url);

        return {
          id: t.id,
          text: t.text,
          authorHandle: cleanHandle,
          authorId: userId,
          publishedAt: t.created_at || new Date().toISOString(),
          url: `https://x.com/${cleanHandle}/status/${t.id}`,
          metrics: {
            likes: t.public_metrics?.like_count,
            reposts: t.public_metrics?.retweet_count,
            replies: t.public_metrics?.reply_count,
          },
          entities: {
            symbols: cashtags,
            hashtags,
            urls,
          },
          referencedPosts: t.referenced_tweets,
        };
      });

      return {
        posts,
        rawFetch,
        status: "SUCCESS",
      };
    } catch (err: any) {
      return {
        posts: [],
        rawFetch: {
          providerId: this.id,
          endpoint: `https://api.twitter.com/2/users/by/username/${cleanHandle}`,
          httpStatus: 500,
          latencyMs: Date.now() - startTime,
          payload: null,
          rawHash: "",
          fetchedAt: new Date().toISOString(),
        },
        status: "ERROR",
        errorMessage: CredentialManager.redact(err?.message || "Failed to fetch X timeline"),
      };
    }
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const payload = raw.payload as any;
    const tweets = payload?.data || [];
    const events: DataEvent[] = [];

    for (const t of tweets) {
      const cashtags: string[] = (t.entities?.cashtags || []).map((c: any) => c.tag?.toUpperCase());
      events.push({
        eventType: "SOCIAL_POST",
        title: t.text.slice(0, 100),
        description: t.text,
        entityIds: cashtags.map(s => `inst:${s.toLowerCase()}`),
        sourceIds: [this.id],
        occurredAt: t.created_at || raw.fetchedAt,
        detectedAt: raw.fetchedAt,
        severity: "normal",
        confidence: "INFERRED", // Social claims are inferred until corroborated
        sourceReliability: this.sourceReliability,
        status: "READY",
        primarySourceUrl: `https://x.com/i/web/status/${t.id}`,
        metadata: {
          metrics: t.public_metrics,
          authorId: t.author_id,
          symbols: cashtags,
        },
      });
    }

    return {
      observations: [],
      events,
      entities: [],
      rawCount: events.length,
    };
  }
}
