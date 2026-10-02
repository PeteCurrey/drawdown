/**
 * Drawdown Intelligence Data Platform — Syndicated Social & Analyst Feed Provider
 *
 * Domain: Monitored Financial Newsletters, Analyst Blogs, and Syndicated Feeds
 * Reliability: SECONDARY / COMMUNITY
 * Confidence: KNOWN / INFERRED
 *
 * Allows monitored external commentator accounts and analysts with public RSS/Atom
 * syndication to be ingested legitimately without credentials.
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
import { UniversalFeedParser } from "../rss/parser.ts";
import { DataNormalizer } from "../normalization.ts";

export class RssSocialProvider extends SocialProvider {
  readonly id = "social-syndicated-feed";
  readonly name = "Curated Social & Analyst Syndication";
  readonly platform = "rss";
  readonly categories: SourceCategory[] = ["SOCIAL", "NEWS", "MARKET"];
  readonly sourceReliability: SourceReliability = "SECONDARY";
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 20,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Commentary syndicated from public RSS publication.",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: false,
    retentionAllowed: true,
  };

  private readonly userAgent = "DrawdownIntelligence/1.0 (+https://drawdown.trading; research@drawdown.trading)";

  protected getCredential(): string | null {
    return "PUBLIC";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    return {
      isAvailable: true,
      status: "AVAILABLE",
      latencyMs: 15,
    };
  }

  async fetchUserTimeline(config: SocialSourceConfig): Promise<{
    posts: SocialPostRawItem[];
    rawFetch: RawFetchResult;
    status: 'SUCCESS' | 'NOT_CONFIGURED' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'ERROR';
    errorMessage?: string;
  }> {
    const feedUrl = config.targetFeedUrl;
    const startTime = Date.now();

    if (!feedUrl) {
      return {
        posts: [],
        rawFetch: {
          providerId: this.id,
          endpoint: "",
          httpStatus: 0,
          latencyMs: 0,
          payload: null,
          rawHash: "",
          fetchedAt: new Date().toISOString(),
        },
        status: "NOT_CONFIGURED",
        errorMessage: "Feed URL not specified for social source.",
      };
    }

    try {
      const res = await fetch(feedUrl, {
        headers: {
          "User-Agent": this.userAgent,
          "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        return {
          posts: [],
          rawFetch: {
            providerId: this.id,
            endpoint: feedUrl,
            httpStatus: res.status,
            latencyMs,
            payload: null,
            rawHash: "",
            fetchedAt: new Date().toISOString(),
          },
          status: "ERROR",
          errorMessage: `HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const xml = await res.text();
      const rawHash = DataNormalizer.generateHash(xml);
      const parsed = UniversalFeedParser.parse(xml);

      const posts: SocialPostRawItem[] = parsed.items.slice(0, 10).map((item) => {
        // Extract tickers from title/desc ($AAPL, $NVDA, etc.)
        const combined = `${item.title} ${item.description}`;
        const cashtagMatches = combined.match(/\$[A-Z]{1,5}\b/g) || [];
        const symbols = Array.from(new Set(cashtagMatches.map(m => m.slice(1))));

        return {
          id: item.id || DataNormalizer.generateHash(item.link || item.title),
          text: `${item.title}\n\n${item.description}`.trim(),
          authorHandle: config.handle || item.author || "Analyst",
          authorName: item.author || config.name,
          publishedAt: item.pubDate,
          url: item.link || feedUrl,
          entities: {
            symbols,
            urls: item.link ? [item.link] : [],
          },
        };
      });

      return {
        posts,
        rawFetch: {
          providerId: this.id,
          endpoint: feedUrl,
          httpStatus: 200,
          latencyMs,
          payload: xml,
          rawHash,
          fetchedAt: new Date().toISOString(),
        },
        status: "SUCCESS",
      };
    } catch (err: any) {
      return {
        posts: [],
        rawFetch: {
          providerId: this.id,
          endpoint: feedUrl,
          httpStatus: 500,
          latencyMs: Date.now() - startTime,
          payload: null,
          rawHash: "",
          fetchedAt: new Date().toISOString(),
        },
        status: "ERROR",
        errorMessage: err?.message || "Failed to fetch syndicated social feed",
      };
    }
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const xml = typeof raw.payload === "string" ? raw.payload : "";
    if (!xml) return { observations: [], events: [], entities: [], rawCount: 0 };

    const parsed = UniversalFeedParser.parse(xml);
    const events: DataEvent[] = parsed.items.map((item) => ({
      eventType: "SOCIAL_POST",
      title: item.title,
      description: item.description,
      entityIds: [],
      sourceIds: [this.id],
      occurredAt: item.pubDate,
      detectedAt: raw.fetchedAt,
      severity: "normal",
      confidence: "KNOWN",
      sourceReliability: this.sourceReliability,
      status: "READY",
      primarySourceUrl: item.link,
      metadata: {
        author: item.author,
      },
    }));

    return {
      observations: [],
      events,
      entities: [],
      rawCount: events.length,
    };
  }
}
