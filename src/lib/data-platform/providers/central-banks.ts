/**
 * Drawdown Intelligence Data Platform — Central Banks Provider
 *
 * Domain: Macroeconomic & Monetary Policy Intelligence
 * Reliability: PRIMARY (Official sovereign central bank communications)
 * Confidence: VERIFIED
 *
 * Supported Institutions:
 *  - FED (Federal Reserve Board)
 *  - ECB (European Central Bank)
 *  - BOE (Bank of England)
 *  - BOJ (Bank of Japan)
 *  - SNB (Swiss National Bank)
 *  - RBA (Reserve Bank of Australia)
 *  - RBNZ (Reserve Bank of New Zealand)
 *  - BOC (Bank of Canada)
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

export type CentralBankCode = "FED" | "ECB" | "BOE" | "BOJ" | "SNB" | "RBA" | "RBNZ" | "BOC";

export interface CentralBankMetadata {
  code: CentralBankCode;
  name: string;
  countryCode: string;
  currency: string;
  entityId: string;
  feedUrl: string;
  homepage: string;
}

export const CENTRAL_BANKS: Record<CentralBankCode, CentralBankMetadata> = {
  FED: {
    code: "FED",
    name: "Federal Reserve Board",
    countryCode: "US",
    currency: "USD",
    entityId: "cb:fed",
    feedUrl: "https://www.federalreserve.gov/feeds/press_all.xml",
    homepage: "https://www.federalreserve.gov",
  },
  ECB: {
    code: "ECB",
    name: "European Central Bank",
    countryCode: "EU",
    currency: "EUR",
    entityId: "cb:ecb",
    feedUrl: "https://www.ecb.europa.eu/rss/press.html",
    homepage: "https://www.ecb.europa.eu",
  },
  BOE: {
    code: "BOE",
    name: "Bank of England",
    countryCode: "GB",
    currency: "GBP",
    entityId: "cb:boe",
    feedUrl: "https://www.bankofengland.co.uk/rss/news",
    homepage: "https://www.bankofengland.co.uk",
  },
  BOJ: {
    code: "BOJ",
    name: "Bank of Japan",
    countryCode: "JP",
    currency: "JPY",
    entityId: "cb:boj",
    feedUrl: "https://www.boj.or.jp/en/rss/whatsnew.xml",
    homepage: "https://www.boj.or.jp/en",
  },
  SNB: {
    code: "SNB",
    name: "Swiss National Bank",
    countryCode: "CH",
    currency: "CHF",
    entityId: "cb:snb",
    feedUrl: "https://www.snb.ch/en/rss/media-releases.xml",
    homepage: "https://www.snb.ch",
  },
  RBA: {
    code: "RBA",
    name: "Reserve Bank of Australia",
    countryCode: "AU",
    currency: "AUD",
    entityId: "cb:rba",
    feedUrl: "https://www.rba.gov.au/rss/rss-cb-media-releases.xml",
    homepage: "https://www.rba.gov.au",
  },
  RBNZ: {
    code: "RBNZ",
    name: "Reserve Bank of New Zealand",
    countryCode: "NZ",
    currency: "NZD",
    entityId: "cb:rbnz",
    feedUrl: "https://www.rbnz.govt.nz/feeds/news",
    homepage: "https://www.rbnz.govt.nz",
  },
  BOC: {
    code: "BOC",
    name: "Bank of Canada",
    countryCode: "CA",
    currency: "CAD",
    entityId: "cb:boc",
    feedUrl: "https://www.bankofcanada.ca/valet/lists/rss/press-releases",
    homepage: "https://www.bankofcanada.ca",
  },
};

export class CentralBanksProvider extends BaseProvider {
  readonly id = "central-banks";
  readonly name = "Global Central Banks";
  readonly categories: SourceCategory[] = ["CENTRAL_BANK", "MACRO", "NEWS"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 30,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Official policy announcements and communications sourced directly from sovereign central bank feeds.",
    linkBack: "https://www.bis.org",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "Official public sector communications released under respective open government/crown copyright frameworks.",
  };

  private readonly userAgent = "DrawdownIntelligence/1.0 (+https://drawdown.trading; research@drawdown.trading)";

  protected getCredential(): string | null {
    return "PUBLIC_PRIMARY";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    try {
      const start = Date.now();
      const res = await fetch(CENTRAL_BANKS.FED.feedUrl, {
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
        error: e?.message || "Central Banks probe failed",
      };
    }
  }

  /**
   * Fetches the official feed for a specific central bank.
   */
  async fetchBankFeed(code: CentralBankCode): Promise<RawFetchResult> {
    const bank = CENTRAL_BANKS[code];
    if (!bank) {
      throw new Error(`[central-banks] Unknown central bank code: ${code}`);
    }

    const start = Date.now();
    const res = await fetch(bank.feedUrl, {
      headers: {
        "User-Agent": this.userAgent,
        "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;
    if (!res.ok) {
      throw new Error(`[central-banks] Failed to fetch ${bank.name} feed: HTTP ${res.status}`);
    }

    const xml = await res.text();
    const rawHash = DataNormalizer.generateHash(xml);

    return {
      providerId: this.id,
      endpoint: bank.feedUrl,
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
   * Transforms raw XML into canonical central bank events and entities.
   */
  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const events: DataEvent[] = [];
    const entities: DataEntity[] = [];
    const errors: string[] = [];

    const payload = raw.payload as { code?: CentralBankCode; xml?: string } | string;
    let code: CentralBankCode = "FED";
    let xml = "";

    if (typeof payload === "string") {
      xml = payload;
    } else if (payload && typeof payload === "object") {
      code = payload.code || "FED";
      xml = payload.xml || "";
    }

    if (!xml) {
      errors.push("Central bank payload was empty");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    const bank = CENTRAL_BANKS[code] || CENTRAL_BANKS.FED;
    const nowIso = new Date().toISOString();

    // Register canonical institution entity
    entities.push({
      id: bank.entityId,
      entityType: "central_bank",
      name: bank.name,
      countryCode: bank.countryCode,
      identifiers: {
        bic: bank.code,
        currency: bank.currency,
      },
    });

    try {
      const parsed = UniversalFeedParser.parse(xml);

      for (const item of parsed.items) {
        // Detect monetary policy or rate decision keywords to classify severity
        const lowerTitle = item.title.toLowerCase();
        const lowerDesc = item.description.toLowerCase();
        const isInterestRateOrPolicy =
          lowerTitle.includes("interest rate") ||
          lowerTitle.includes("monetary policy") ||
          lowerTitle.includes("fomc") ||
          lowerTitle.includes("rate decision") ||
          lowerTitle.includes("asset purchase") ||
          lowerDesc.includes("benchmark rate") ||
          lowerDesc.includes("policy stance");

        const severity: "low" | "normal" | "high" | "critical" = isInterestRateOrPolicy
          ? "critical"
          : lowerTitle.includes("speech") || lowerTitle.includes("minutes")
          ? "high"
          : "normal";

        events.push({
          eventType: "CENTRAL_BANK_EVENT",
          title: `[${bank.code}] ${item.title}`,
          description: item.description || `Official communication released by ${bank.name}.`,
          entityIds: [bank.entityId],
          sourceIds: [this.id],
          occurredAt: item.pubDate,
          detectedAt: nowIso,
          severity,
          confidence: "VERIFIED",
          sourceReliability: this.sourceReliability,
          status: "READY",
          primarySourceUrl: item.link,
          metadata: {
            centralBank: bank.code,
            institutionName: bank.name,
            currency: bank.currency,
            categories: item.categories,
            guid: item.id,
          },
        });
      }
    } catch (e: any) {
      errors.push(`XML parsing error for ${bank.code}: ${e?.message || e}`);
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
