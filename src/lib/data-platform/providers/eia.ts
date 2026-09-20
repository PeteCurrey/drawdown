/**
 * Drawdown Intelligence Data Platform — EIA Reference Adapter
 *
 * Domain: Energy & Physical Commodity Statistics (U.S. Energy Information Administration v2)
 * Reliability: PRIMARY (Official U.S. Department of Energy statistics)
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
 } from "../types.ts";
import { CredentialManager } from "../credentials.ts";
import { DataNormalizer } from "../normalization.ts";

export class EiaProvider extends BaseProvider {
  readonly id = "eia-v2-api";
  readonly name = "U.S. Energy Information Administration (EIA)";
  readonly categories: SourceCategory[] = ["ENERGY", "AGRICULTURE"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "api_key_query";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 60,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Energy market data provided by the U.S. Energy Information Administration.",
    linkBack: "https://www.eia.gov",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "U.S. Government open data. Public domain without copyright restrictions.",
  };

  protected getCredential(): string | null {
    return CredentialManager.getEiaKey();
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    const key = this.getCredential();
    if (!key) {
      return {
        isAvailable: false,
        status: "NOT_CONFIGURED",
        latencyMs: 0,
        error: "EIA_API_KEY is not configured.",
      };
    }

    try {
      const start = Date.now();
      const testUrl = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${key}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=1`;
      const res = await fetch(testUrl, { cache: "no-store", signal: AbortSignal.timeout(5000) });
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

  async fetchWtiCrude(length: number = 5): Promise<RawFetchResult> {
    const key = this.getCredential();
    if (!key) throw new Error("[eia-v2-api] Missing EIA_API_KEY");

    const endpoint = `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${key}&frequency=daily&data[0]=value&facets[series][]=RWTC&sort[0][column]=period&sort[0][direction]=desc&length=${length}`;
    return this.fetchRaw({ endpoint });
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const observations: DataObservation[] = [];
    const errors: string[] = [];
    const payload: any = raw.payload;

    const dataRows = payload?.response?.data;
    if (!Array.isArray(dataRows)) {
      errors.push("Payload missing response.data array");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    const nowIso = new Date().toISOString();

    for (const row of dataRows) {
      if (!row.value || row.value === "NA") continue;

      const numVal = parseFloat(row.value);
      if (isNaN(numVal)) continue;

      const observedAt = DataNormalizer.toIsoString(row.period);
      const series = row.series || "RWTC";
      const seriesDescription = row["series-description"] || "Cushing, OK WTI Spot Price FOB";

      observations.push({
        sourceId: "eia-v2-api",
        entityId: "comm:crude-wti",
        metric: "spot_price",
        value: numVal,
        unit: "USD/bbl",
        currency: "USD",
        period: row.frequency || "daily",
        region: "US",
        observedAt,
        receivedAt: nowIso,
        confidence: "VERIFIED",
        sourceReliability: this.sourceReliability,
        ingestionState: "NORMALIZED",
        sourceReference: `https://www.eia.gov/dnav/pet/hist/rwtcD.htm`,
        metadata: {
          series,
          seriesDescription,
          product: row.product,
          units: row.units,
        },
      });
    }

    return {
      observations,
      events: [],
      entities: [],
      rawCount: observations.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
