/**
 * Drawdown Intelligence Data Platform — Universal RSS/Atom Feed Provider
 *
 * Domain: General Financial Intelligence, Market News & Institutional Disclosures
 * Reliability: SECONDARY (Default, unless specified otherwise)
 * Confidence: KNOWN (or INFERRED if unverified)
 *
 * Allows subscribing to and ingesting any standard RSS 2.0 or Atom 1.0 feed
 * with rate limiting, circuit breaker protection, and schema normalization.
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
  DataEvent,
} from "../types.ts";
import { UniversalFeedParser } from "../rss/parser.ts";
import { DataNormalizer } from "../normalization.ts";

export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  category?: SourceCategory;
  reliability?: SourceReliability;
  attributionNotice?: string;
  rateLimitPerMinute?: number;
}

export class RssFeedProvider extends BaseProvider {
  readonly id: string;
  readonly name: string;
  readonly feedUrl: string;
  readonly categories: SourceCategory[];
  readonly sourceReliability: SourceReliability;
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig;
  readonly attribution: AttributionPolicy;
  readonly licensing: LicensePolicy;

  private readonly userAgent = "DrawdownIntelligence/1.0 (+https://drawdown.trading; research@drawdown.trading)";

  constructor(config: RssFeedConfig) {
    super();
    this.id = config.id;
    this.name = config.name;
    this.feedUrl = config.url;
    this.categories = [config.category || "NEWS"];
    this.sourceReliability = config.reliability || "SECONDARY";

    this.rateLimits = {
      maxRequestsPerMinute: config.rateLimitPerMinute || 20,
      cooldownPeriodMs: 60_000,
    };

    this.attribution = {
      required: true,
      notice: config.attributionNotice || `Intelligence syndicated from ${config.name}.`,
      linkBack: config.url,
    };

    this.licensing = {
      commercialAllowed: true,
      redistributionAllowed: false,
      retentionAllowed: true,
      notes: "Public syndication feed subject to publisher terms of service.",
    };
  }

  protected getCredential(): string | null {
    return "PUBLIC_SYNDICATED";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    try {
      const start = Date.now();
      const res = await fetch(this.feedUrl, {
        headers: { "User-Agent": this.userAgent },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        return { isAvailable: true, status: "AVAILABLE", latencyMs };
      }
      return {
        isAvailable: false,
        status: "DEGRADED",
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (e: any) {
      return {
        isAvailable: false,
        status: "UNAVAILABLE",
        latencyMs: 0,
        error: e?.message || "Feed health probe failed",
      };
    }
  }

  /**
   * Fetches and retrieves the raw feed XML payload.
   */
  async fetchFeed(): Promise<RawFetchResult> {
    const start = Date.now();
    const res = await fetch(this.feedUrl, {
      headers: {
        "User-Agent": this.userAgent,
        "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;
    if (!res.ok) {
      throw new Error(`[${this.id}] Failed to fetch feed: HTTP ${res.status}`);
    }

    const xml = await res.text();
    const rawHash = DataNormalizer.generateHash(xml);

    return {
      providerId: this.id,
      endpoint: this.feedUrl,
      httpStatus: res.status,
      latencyMs,
      payload: xml,
      rawHash,
      fetchedAt: new Date().toISOString(),
    };
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const events: DataEvent[] = [];
    const errors: string[] = [];
    const xml = typeof raw.payload === "string" ? raw.payload : "";

    if (!xml) {
      errors.push("RSS/Atom payload was empty");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    try {
      const parsed = UniversalFeedParser.parse(xml);
      const nowIso = new Date().toISOString();

      const confidence =
        this.sourceReliability === "PRIMARY"
          ? "VERIFIED"
          : this.sourceReliability === "AUTHORITATIVE_SECONDARY"
          ? "KNOWN"
          : "INFERRED";

      for (const item of parsed.items) {
        events.push({
          eventType: "NEWS_EVENT",
          title: item.title,
          description: item.description,
          entityIds: [],
          sourceIds: [this.id],
          occurredAt: item.pubDate,
          detectedAt: nowIso,
          severity: "normal",
          confidence,
          sourceReliability: this.sourceReliability,
          status: "READY",
          primarySourceUrl: item.link,
          metadata: {
            author: item.author,
            categories: item.categories,
            enclosureUrl: item.enclosureUrl,
            guid: item.id,
            feedTitle: parsed.title,
          },
        });
      }
    } catch (e: any) {
      errors.push(`XML parsing error: ${e?.message || e}`);
    }

    return {
      observations: [],
      events,
      entities: [],
      rawCount: events.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
