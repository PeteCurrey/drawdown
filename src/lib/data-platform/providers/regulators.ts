/**
 * Drawdown Intelligence Data Platform — Financial Regulators Provider
 *
 * Domain: Regulatory Enforcement, Warnings, Fines, Broker Actions
 * Reliability: PRIMARY (Official sovereign statutory regulatory bodies)
 * Confidence: VERIFIED
 *
 * Supported Regulators:
 *  - FCA (UK Financial Conduct Authority)
 *  - SEC (US Securities and Exchange Commission - Enforcement & News)
 *  - CFTC (US Commodity Futures Trading Commission)
 *  - ESMA (European Securities and Markets Authority)
 *  - FINRA (US Financial Industry Regulatory Authority)
 *  - ASIC (Australian Securities and Investments Commission)
 *  - CySEC (Cyprus Securities and Exchange Commission - Retail FX/CFD Broker Hub)
 *  - PRA (UK Prudential Regulation Authority)
 */

import { BaseProvider } from "./base";
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
  DataEntity,
} from "../types";
import { UniversalFeedParser } from "../rss/parser";
import { DataNormalizer } from "../normalization";

export type RegulatorCode = "FCA" | "SEC" | "CFTC" | "ESMA" | "FINRA" | "ASIC" | "CYSEC" | "PRA";

export interface RegulatorMetadata {
  code: RegulatorCode;
  name: string;
  countryCode: string;
  entityId: string;
  feedUrl: string;
  homepage: string;
  targetCategories: SourceCategory[];
}

export const REGULATORS: Record<RegulatorCode, RegulatorMetadata> = {
  FCA: {
    code: "FCA",
    name: "Financial Conduct Authority",
    countryCode: "GB",
    entityId: "reg:fca",
    feedUrl: "https://www.fca.org.uk/news/rss.xml",
    homepage: "https://www.fca.org.uk",
    targetCategories: ["REGULATOR", "BROKER"],
  },
  SEC: {
    code: "SEC",
    name: "U.S. Securities and Exchange Commission",
    countryCode: "US",
    entityId: "reg:sec",
    feedUrl: "https://www.sec.gov/news/pressreleases.rss",
    homepage: "https://www.sec.gov",
    targetCategories: ["REGULATOR", "CORPORATE"],
  },
  CFTC: {
    code: "CFTC",
    name: "Commodity Futures Trading Commission",
    countryCode: "US",
    entityId: "reg:cftc",
    feedUrl: "https://www.cftc.gov/PressRoom/PressReleases/pressreleases.rss",
    homepage: "https://www.cftc.gov",
    targetCategories: ["REGULATOR", "FUTURES", "OPTIONS"],
  },
  ESMA: {
    code: "ESMA",
    name: "European Securities and Markets Authority",
    countryCode: "EU",
    entityId: "reg:esma",
    feedUrl: "https://www.esma.europa.eu/rss.xml",
    homepage: "https://www.esma.europa.eu",
    targetCategories: ["REGULATOR", "MARKET"],
  },
  FINRA: {
    code: "FINRA",
    name: "Financial Industry Regulatory Authority",
    countryCode: "US",
    entityId: "reg:finra",
    feedUrl: "https://www.finra.org/rss/news-releases",
    homepage: "https://www.finra.org",
    targetCategories: ["REGULATOR", "BROKER"],
  },
  ASIC: {
    code: "ASIC",
    name: "Australian Securities and Investments Commission",
    countryCode: "AU",
    entityId: "reg:asic",
    feedUrl: "https://asic.gov.au/about-asic/news-centre/find-a-media-release/rss-feed/",
    homepage: "https://asic.gov.au",
    targetCategories: ["REGULATOR", "BROKER"],
  },
  CYSEC: {
    code: "CYSEC",
    name: "Cyprus Securities and Exchange Commission",
    countryCode: "CY",
    entityId: "reg:cysec",
    feedUrl: "https://www.cysec.gov.cy/en-GB/public-information/rss/",
    homepage: "https://www.cysec.gov.cy",
    targetCategories: ["REGULATOR", "BROKER"],
  },
  PRA: {
    code: "PRA",
    name: "Prudential Regulation Authority",
    countryCode: "GB",
    entityId: "reg:pra",
    feedUrl: "https://www.bankofengland.co.uk/rss/pra",
    homepage: "https://www.bankofengland.co.uk/prudential-regulation",
    targetCategories: ["REGULATOR", "CENTRAL_BANK"],
  },
};

export class RegulatorsProvider extends BaseProvider {
  readonly id = "regulators";
  readonly name = "Global Financial Regulators";
  readonly categories: SourceCategory[] = ["REGULATOR", "BROKER", "CORPORATE", "NEWS"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 30,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Regulatory notices, enforcement actions, and broker sanctions sourced directly from official statutory regulator feeds.",
    linkBack: "https://www.iosco.org",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "Public statutory regulatory publications and consumer alerts.",
  };

  private readonly userAgent = "DrawdownIntelligence/1.0 (+https://drawdown.trading; research@drawdown.trading)";

  protected getCredential(): string | null {
    return "PUBLIC_PRIMARY";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    try {
      const start = Date.now();
      const res = await fetch(REGULATORS.SEC.feedUrl, {
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
        error: e?.message || "Regulators probe failed",
      };
    }
  }

  /**
   * Fetches official feed for a specific regulator.
   */
  async fetchRegulatorFeed(code: RegulatorCode): Promise<RawFetchResult> {
    const reg = REGULATORS[code];
    if (!reg) {
      throw new Error(`[regulators] Unknown regulator code: ${code}`);
    }

    const start = Date.now();
    const res = await fetch(reg.feedUrl, {
      headers: {
        "User-Agent": this.userAgent,
        "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;
    if (!res.ok) {
      throw new Error(`[regulators] Failed to fetch ${reg.name} feed: HTTP ${res.status}`);
    }

    const xml = await res.text();
    const rawHash = DataNormalizer.generateHash(xml);

    return {
      providerId: this.id,
      endpoint: reg.feedUrl,
      httpStatus: res.status,
      latencyMs,
      payload: {
        code,
        xml,
      },
      rawHash,
      fetchedAt: new Date().toISOString(),
    };
  }

  /**
   * Transforms raw XML into canonical regulatory events and entity records.
   */
  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const events: DataEvent[] = [];
    const entities: DataEntity[] = [];
    const errors: string[] = [];

    const payload = raw.payload as { code?: RegulatorCode; xml?: string } | string;
    let code: RegulatorCode = "FCA";
    let xml = "";

    if (typeof payload === "string") {
      xml = payload;
    } else if (payload && typeof payload === "object") {
      code = payload.code || "FCA";
      xml = payload.xml || "";
    }

    if (!xml) {
      errors.push("Regulator payload was empty");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    const reg = REGULATORS[code] || REGULATORS.FCA;
    const nowIso = new Date().toISOString();

    entities.push({
      id: reg.entityId,
      entityType: "regulator",
      name: reg.name,
      countryCode: reg.countryCode,
      identifiers: {
        code: reg.code,
      },
    });

    try {
      const parsed = UniversalFeedParser.parse(xml);

      for (const item of parsed.items) {
        const lowerTitle = item.title.toLowerCase();
        const lowerDesc = item.description.toLowerCase();

        // Categorize severity based on enforcement/warning keywords
        const isEnforcement =
          lowerTitle.includes("enforcement") ||
          lowerTitle.includes("fine") ||
          lowerTitle.includes("penalty") ||
          lowerTitle.includes("sanction") ||
          lowerTitle.includes("charges") ||
          lowerTitle.includes("fraud") ||
          lowerTitle.includes("unauthorised") ||
          lowerTitle.includes("unauthorized") ||
          lowerTitle.includes("warning") ||
          lowerTitle.includes("suspension") ||
          lowerDesc.includes("civil penalty") ||
          lowerDesc.includes("cease and desist");

        const severity: "low" | "normal" | "high" | "critical" = isEnforcement
          ? "high"
          : "normal";

        // Detect if item references brokers or prop firms
        const referencesBroker =
          lowerTitle.includes("broker") ||
          lowerTitle.includes("cfd") ||
          lowerTitle.includes("forex") ||
          lowerTitle.includes("trading platform") ||
          lowerDesc.includes("broker") ||
          lowerDesc.includes("investment firm");

        const eventType = referencesBroker ? "BROKER_REGULATORY_EVENT" : "REGULATORY_EVENT";

        events.push({
          eventType,
          title: `[${reg.code}] ${item.title}`,
          description: item.description || `Regulatory notice published by ${reg.name}.`,
          entityIds: [reg.entityId],
          sourceIds: [this.id],
          occurredAt: item.pubDate,
          detectedAt: nowIso,
          severity,
          confidence: "VERIFIED",
          sourceReliability: this.sourceReliability,
          status: "READY",
          primarySourceUrl: item.link,
          metadata: {
            regulator: reg.code,
            institutionName: reg.name,
            categories: item.categories,
            isEnforcement,
            referencesBroker,
            guid: item.id,
          },
        });
      }
    } catch (e: any) {
      errors.push(`XML parsing error for ${reg.code}: ${e?.message || e}`);
    }

    return {
      observations: [],
      events,
      entities,
      rawCount: events.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
