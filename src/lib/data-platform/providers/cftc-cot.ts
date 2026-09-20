/**
 * Drawdown Intelligence Data Platform — CFTC Commitment of Traders (COT) Provider
 *
 * Domain: Market Positioning & Institutional Flows (U.S. Commodity Futures Trading Commission)
 * Reliability: PRIMARY (Official regulatory market participant disclosures)
 * Confidence: VERIFIED
 *
 * Normalizes:
 *  - Market / Contract Name
 *  - Reporting Date (Tuesday cutoff)
 *  - Commercial & Non-Commercial Longs, Shorts, Spreading
 *  - Net Positioning & Week-on-Week Changes
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
  DataObservation,
  DataEvent,
} from "../types";
import { DataNormalizer } from "../normalization";

export interface CftcCotRecord {
  market_name: string;
  report_date_as_yyyy_mm_dd: string;
  noncomm_positions_long_all: string;
  noncomm_positions_short_all: string;
  comm_positions_long_all?: string;
  comm_positions_short_all?: string;
  change_in_noncomm_long_all?: string;
  change_in_noncomm_short_all?: string;
  contract_units?: string;
}

export class CftcCotProvider extends BaseProvider {
  readonly id = "cftc-cot";
  readonly name = "CFTC Commitment of Traders";
  readonly categories: SourceCategory[] = ["POSITIONING", "FUTURES", "MARKET"];
  readonly sourceReliability: SourceReliability = "PRIMARY";
  readonly authenticationType: AuthenticationType = "public_unauthenticated";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 30,
    cooldownPeriodMs: 60_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Positioning data sourced from U.S. Commodity Futures Trading Commission (CFTC).",
    linkBack: "https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: true,
    retentionAllowed: true,
    notes: "U.S. Government open dataset. Public domain.",
  };

  protected getCredential(): string | null {
    return "PUBLIC_PRIMARY";
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    try {
      const start = Date.now();
      // Probe CFTC public Socrata API endpoint
      const res = await fetch(
        "https://publicreporting.cftc.gov/resource/6dca-aqww.json?$limit=1",
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
        error: e?.message || "CFTC COT probe failed",
      };
    }
  }

  /**
   * Fetches latest weekly COT positioning reports from CFTC Socrata endpoint.
   */
  async fetchLatestReports(limit = 50): Promise<RawFetchResult> {
    const endpoint = `https://publicreporting.cftc.gov/resource/6dca-aqww.json?$order=report_date_as_yyyy_mm_dd%20DESC&$limit=${limit}`;
    return this.fetchRaw({ endpoint });
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const observations: DataObservation[] = [];
    const events: DataEvent[] = [];
    const errors: string[] = [];

    const rows = Array.isArray(raw.payload) ? (raw.payload as CftcCotRecord[]) : [];
    if (rows.length === 0) {
      errors.push("No COT records in payload");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    const nowIso = new Date().toISOString();

    for (const row of rows) {
      const marketName = row.market_name || "UNKNOWN_MARKET";
      const reportDate = row.report_date_as_yyyy_mm_dd;
      if (!reportDate) continue;

      const longContracts = parseInt(row.noncomm_positions_long_all || "0", 10);
      const shortContracts = parseInt(row.noncomm_positions_short_all || "0", 10);
      const netPosition = longContracts - shortContracts;

      const changeLong = parseInt(row.change_in_noncomm_long_all || "0", 10);
      const changeShort = parseInt(row.change_in_noncomm_short_all || "0", 10);
      const netChange = changeLong - changeShort;

      const entityId = `market:${marketName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const observedAt = DataNormalizer.toIsoString(reportDate);

      // Observation 1: Net Non-Commercial Positioning
      observations.push({
        sourceId: this.id,
        entityId,
        metric: "cot_net_position",
        value: netPosition,
        unit: "contracts",
        period: "weekly",
        observedAt,
        receivedAt: nowIso,
        confidence: "VERIFIED",
        sourceReliability: this.sourceReliability,
        ingestionState: "NORMALIZED",
        sourceReference: `https://publicreporting.cftc.gov/resource/6dca-aqww.json`,
        metadata: {
          marketName,
          longContracts,
          shortContracts,
          netChange,
        },
      });

      // Discrete Event: Significant Positioning Shift (> 10,000 contracts change or extreme flip)
      if (Math.abs(netChange) >= 10_000 || (netPosition > 0 && netPosition - netChange < 0) || (netPosition < 0 && netPosition - netChange > 0)) {
        events.push({
          eventType: "POSITIONING_EVENT",
          title: `CFTC COT: ${marketName} Net Shift of ${netChange > 0 ? "+" : ""}${netChange.toLocaleString()} Contracts`,
          description: `Non-commercial speculative positioning in ${marketName} shifted by ${netChange.toLocaleString()} contracts to reach a net ${netPosition >= 0 ? "long" : "short"} stance of ${Math.abs(netPosition).toLocaleString()} contracts for the week ended ${reportDate}.`,
          entityIds: [entityId],
          sourceIds: [this.id],
          occurredAt: observedAt,
          detectedAt: nowIso,
          severity: Math.abs(netChange) >= 25_000 ? "high" : "normal",
          confidence: "VERIFIED",
          sourceReliability: this.sourceReliability,
          status: "READY",
          metadata: {
            marketName,
            netPosition,
            netChange,
            longContracts,
            shortContracts,
          },
        });
      }
    }

    return {
      observations,
      events,
      entities: [],
      rawCount: observations.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
