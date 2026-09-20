/**
 * Drawdown Intelligence Data Platform — FRED Reference Adapter
 *
 * Domain: Macroeconomic Series & Central Bank Data (St. Louis Federal Reserve)
 * Reliability: PRIMARY (Official government & central bank statistics)
 * Confidence: VERIFIED
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
  DataObservation,
  DataEntity,
 } from "../types.ts";
import { CredentialManager } from "../credentials.ts";
import { DataNormalizer } from "../normalization.ts";

export interface FredSeriesMetadata {
  id: string;
  name: string;
  unit: string;
  frequency: string;
  category: SourceCategory;
}

export const CANONICAL_FRED_SERIES: Record<string, FredSeriesMetadata> = {
  FEDFUNDS: {
    id: "FEDFUNDS",
    name: "Federal Funds Effective Rate",
    unit: "%",
    frequency: "Monthly",
    category: "CENTRAL_BANK",
  },
  CPIAUCSL: {
    id: "CPIAUCSL",
    name: "Consumer Price Index for All Urban Consumers",
    unit: "Index",
    frequency: "Monthly",
    category: "MACRO",
  },
  UNRATE: {
    id: "UNRATE",
    name: "Unemployment Rate",
    unit: "%",
    frequency: "Monthly",
    category: "MACRO",
  },
  GDPC1: {
    id: "GDPC1",
    name: "Real Gross Domestic Product",
    unit: "Billions USD",
    frequency: "Quarterly",
    category: "MACRO",
  },
  DGS10: {
    id: "DGS10",
    name: "10-Year Treasury Constant Maturity Rate",
    unit: "%",
    frequency: "Daily",
    category: "MARKET",
  },
  DGS2: {
    id: "DGS2",
    name: "2-Year Treasury Constant Maturity Rate",
    unit: "%",
    frequency: "Daily",
    category: "MARKET",
  },
  INDPRO: {
    id: "INDPRO",
    name: "Industrial Production Index",
    unit: "Index",
    frequency: "Monthly",
    category: "MACRO",
  },
  UMCSENT: {
    id: "UMCSENT",
    name: "University of Michigan Consumer Sentiment",
    unit: "Index",
    frequency: "Monthly",
    category: "MACRO",
  },
  NFCI: {
    id: "NFCI",
    name: "Chicago Fed National Financial Conditions Index",
    unit: "Index",
    frequency: "Weekly",
    category: "MACRO",
  },
};

export class FredProvider extends BaseProvider {
  readonly id = "fred-api";
  readonly name = "Federal Reserve Economic Data (FRED)";
  readonly categories: SourceCategory[] = ["MACRO", "CENTRAL_BANK"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "api_key_query";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 120,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Economic data sourced from FRED, Federal Reserve Bank of St. Louis.",
    linkBack: "https://fred.stlouisfed.org",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "U.S. Government public domain data. Free for public display and derivation.",
  };

  protected getCredential(): string | null {
    return CredentialManager.getFredKey();
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    const key = this.getCredential();
    if (!key) {
      return {
        isAvailable: false,
        status: "NOT_CONFIGURED",
        latencyMs: 0,
        error: "FRED_API_KEY is not configured.",
      };
    }

    try {
      const start = Date.now();
      const res = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${key}&file_type=json&limit=1`,
        { cache: "no-store", signal: AbortSignal.timeout(5000) }
      );
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
        error: CredentialManager.redact(e?.message || "Health check failed"),
      };
    }
  }

  async fetchSeriesObservations(seriesId: string, limit: number = 10): Promise<RawFetchResult> {
    const key = this.getCredential();
    if (!key) throw new Error("[fred-api] Missing FRED_API_KEY");

    const endpoint = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(
      seriesId
    )}&api_key=${key}&file_type=json&sort_order=desc&limit=${limit}`;

    return this.fetchRaw({ endpoint });
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const observations: DataObservation[] = [];
    const entities: DataEntity[] = [];
    const errors: string[] = [];
    const payload: any = raw.payload;

    if (!payload || !Array.isArray(payload.observations)) {
      errors.push("Payload missing observations array");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    // Extract series ID from endpoint or metadata
    const seriesMatch = raw.endpoint.match(/series_id=([^&]+)/);
    const seriesId = seriesMatch ? decodeURIComponent(seriesMatch[1]).toUpperCase() : "UNKNOWN_SERIES";
    const seriesMeta = CANONICAL_FRED_SERIES[seriesId];
    const nowIso = new Date().toISOString();

    const entityId = `ind:${seriesId.toLowerCase()}`;
    entities.push({
      id: entityId,
      entityType: "economic_indicator",
      name: seriesMeta?.name || seriesId,
      symbol: seriesId,
      countryCode: "US",
      identifiers: { fred: seriesId },
    });

    for (const obs of payload.observations) {
      // FRED uses "." for missing observations
      if (!obs.value || obs.value === ".") continue;

      const numVal = parseFloat(obs.value);
      if (isNaN(numVal)) continue;

      const observedAt = DataNormalizer.toIsoString(obs.date);

      observations.push({
        sourceId: "fred-api",
        entityId,
        metric: "indicator_value",
        value: numVal,
        unit: seriesMeta?.unit || "%",
        region: "US",
        period: seriesMeta?.frequency.toLowerCase() || "observation",
        observedAt,
        receivedAt: nowIso,
        confidence: "VERIFIED",
        sourceReliability: this.sourceReliability,
        ingestionState: "NORMALIZED",
        sourceReference: `https://fred.stlouisfed.org/series/${seriesId}`,
        metadata: {
          seriesId,
          realtimeStart: obs.realtime_start,
          realtimeEnd: obs.realtime_end,
        },
      });
    }

    return {
      observations,
      events: [],
      entities,
      rawCount: observations.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
