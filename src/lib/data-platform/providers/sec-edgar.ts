/**
 * Drawdown Intelligence Data Platform — SEC EDGAR Provider
 *
 * Domain: Corporate Intelligence & Regulatory Filings (U.S. Securities & Exchange Commission)
 * Reliability: PRIMARY (Official government statutory filing repository)
 * Confidence: VERIFIED
 * Supported Forms: 8-K, 10-Q, 10-K, Form 3, Form 4 (insider ownership), Form 5
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
} from "../types";
import { UniversalFeedParser } from "../rss/parser";
import { DataNormalizer } from "../normalization";

export class SecEdgarProvider extends BaseProvider {
  readonly id = "sec-edgar";
  readonly name = "U.S. SEC EDGAR";
  readonly categories: SourceCategory[] = ["CORPORATE", "REGULATOR", "EARNINGS"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 10, // SEC limit: max 10 requests per second; we stay conservative at 10/min
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Corporate disclosure sourced from U.S. Securities and Exchange Commission (EDGAR).",
    linkBack: "https://www.sec.gov/edgar",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "U.S. Federal Government public domain records.",
  };

  // SEC requires a descriptive User-Agent header with contact info
  private readonly userAgent = "DrawdownIntelligence research@drawdown.trading";

  protected getCredential(): string | null {
    return "PUBLIC_PRIMARY";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    try {
      const start = Date.now();
      const res = await fetch("https://www.sec.gov/files/company_tickers.json", {
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
        status: "UNAVAILABLE",
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    } catch (e: any) {
      return {
        isAvailable: false,
        status: "UNAVAILABLE",
        latencyMs: 0,
        error: e?.message || "SEC EDGAR probe failed",
      };
    }
  }

  /**
   * Fetches latest public corporate filings stream via SEC EDGAR Current Filings Atom feed.
   */
  async fetchLatestFilings(): Promise<RawFetchResult> {
    const endpoint =
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=&company=&dateb=&owner=include&start=0&count=40&output=atom";

    const start = Date.now();
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": this.userAgent,
        "Accept": "application/atom+xml,application/xml,text/xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;
    if (!res.ok) {
      throw new Error(`[sec-edgar] Failed to fetch current filings: HTTP ${res.status}`);
    }

    const xml = await res.text();
    const rawHash = DataNormalizer.generateHash(xml);

    return {
      providerId: this.id,
      endpoint,
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
      errors.push("SEC payload was empty or not XML string");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    try {
      const parsed = UniversalFeedParser.parse(xml);
      const nowIso = new Date().toISOString();

      for (const item of parsed.items) {
        // SEC Atom title format is typically: "8-K - Apple Inc. (0000320193) (Filer)" or "4 - TESLA, INC. (0001318605)"
        const titleMatch = item.title.match(/^([A-Z0-9\/-]+)\s*-\s*([^(\n]+)(?:\s*\(([0-9]+)\))?/i);
        const formType = titleMatch ? titleMatch[1].trim().toUpperCase() : "FILING";
        const companyName = titleMatch ? titleMatch[2].trim() : item.title;
        const cik = titleMatch && titleMatch[3] ? titleMatch[3].trim() : undefined;

        // Filter for relevant corporate forms
        const isTargetForm =
          formType.startsWith("8-K") ||
          formType.startsWith("10-Q") ||
          formType.startsWith("10-K") ||
          formType === "4" ||
          formType === "3" ||
          formType === "5";

        if (!isTargetForm) continue;

        const severity: "low" | "normal" | "high" | "critical" =
          formType.startsWith("8-K")
            ? "high" // Unscheduled material corporate event
            : formType.startsWith("10-K")
            ? "normal"
            : "normal";

        events.push({
          eventType: "CORPORATE_EVENT",
          title: `SEC ${formType}: ${companyName}`,
          description: item.description || `Official ${formType} filing submitted to U.S. SEC by ${companyName}.`,
          entityIds: cik ? [`company:cik-${cik}`] : [],
          sourceIds: [this.id],
          occurredAt: item.pubDate,
          detectedAt: nowIso,
          severity,
          confidence: "VERIFIED",
          sourceReliability: this.sourceReliability,
          status: "READY",
          primarySourceUrl: item.link,
          metadata: {
            formType,
            companyName,
            cik,
            accessionNumber: item.id,
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
