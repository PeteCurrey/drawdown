/**
 * Drawdown Intelligence Data Platform — Twelve Data Reference Adapter
 *
 * Domain: Market Time-Series & Quotes (Forex, Crypto, Commodities, Indices)
 * Reliability: AUTHORITATIVE_SECONDARY
 * Confidence: KNOWN
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
 } from "../types";
import { CredentialManager } from "../credentials";
import { DataNormalizer } from "../normalization";

export class TwelveDataProvider extends BaseProvider {
  readonly id = "twelve-data";
  readonly name = "Twelve Data";
  readonly categories: SourceCategory[] = ["MARKET", "OPTIONS", "FUTURES", "CRYPTO"];
  readonly sourceReliability: SourceReliability = "AUTHORITATIVE_SECONDARY";
  readonly authenticationType: AuthenticationType = "api_key_query";

  readonly rateLimits: RateLimitConfig = {
    maxRequestsPerMinute: 8, // Standard free/starter limit
    maxRequestsPerDay: 800,
    cooldownPeriodMs: 65_000,
  };

  readonly attribution: AttributionPolicy = {
    required: true,
    notice: "Market data provided by Twelve Data.",
    linkBack: "https://twelvedata.com",
  };

  readonly licensing: LicensePolicy = {
    commercialAllowed: true,
    redistributionAllowed: false,
    retentionAllowed: true,
    notes: "Internal quantitative and derived analytical use permitted. Raw redistribution restricted.",
  };

  protected getCredential(): string | null {
    return CredentialManager.getTwelveDataKey();
  }

  async checkHealth(): Promise<ProviderHealthReport> {
    const key = this.getCredential();
    if (!key) {
      return {
        isAvailable: false,
        status: "NOT_CONFIGURED",
        latencyMs: 0,
        error: "TWELVE_DATA_KEY is not configured.",
      };
    }

    try {
      const start = Date.now();
      // Probe with lightweight symbol check
      const res = await fetch(`https://api.twelvedata.com/quote?symbol=EUR/USD&apikey=${key}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const latencyMs = Date.now() - start;

      if (res.ok) {
        const json = await res.json();
        if (json.status === "error" || json.code === 429) {
          return {
            isAvailable: false,
            status: "DEGRADED",
            latencyMs,
            error: json.message || "Twelve Data API quota exhausted",
          };
        }
        return {
          isAvailable: true,
          status: "AVAILABLE",
          latencyMs,
        };
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
        error: CredentialManager.redact(e?.message || "Health check request failed"),
      };
    }
  }

  async fetchQuote(symbol: string): Promise<RawFetchResult> {
    const key = this.getCredential();
    if (!key) throw new Error("[twelve-data] Missing TWELVE_DATA_KEY");

    const endpoint = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
    return this.fetchRaw({ endpoint });
  }

  async fetchTimeSeries(symbol: string, interval: string = "1day", outputsize: number = 30): Promise<RawFetchResult> {
    const key = this.getCredential();
    if (!key) throw new Error("[twelve-data] Missing TWELVE_DATA_KEY");

    const endpoint = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${key}`;
    return this.fetchRaw({ endpoint });
  }

  async normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle> {
    const observations: DataObservation[] = [];
    const errors: string[] = [];
    const payload: any = raw.payload;

    if (!payload || payload.status === "error" || payload.code) {
      errors.push(payload?.message || "Payload indicated provider error");
      return { observations: [], events: [], entities: [], rawCount: 0, errors };
    }

    const nowIso = new Date().toISOString();

    // 1. Handle Quote Payload
    if (payload.symbol && (payload.close !== undefined || payload.price !== undefined)) {
      const priceNum = parseFloat(payload.close ?? payload.price);
      if (!isNaN(priceNum)) {
        const cleanSymbol = String(payload.symbol).replace("/", "").toUpperCase();
        const observedAt = payload.datetime
          ? DataNormalizer.toIsoString(payload.datetime)
          : nowIso;

        observations.push({
          sourceId: "twelve-data-market",
          entityId: `inst:${cleanSymbol.toLowerCase()}`,
          metric: "price",
          value: priceNum,
          unit: "currency",
          currency: payload.currency || "USD",
          observedAt,
          receivedAt: nowIso,
          confidence: "KNOWN",
          sourceReliability: this.sourceReliability,
          ingestionState: "NORMALIZED",
          sourceReference: `https://api.twelvedata.com/quote?symbol=${payload.symbol}`,
          metadata: {
            exchange: payload.exchange,
            changePct: parseFloat(payload.percent_change || "0"),
            high: parseFloat(payload.high || "0"),
            low: parseFloat(payload.low || "0"),
            volume: parseInt(payload.volume || "0", 10),
          },
        });
      }
    }

    // 2. Handle Time-Series Payload
    if (Array.isArray(payload.values) && payload.meta?.symbol) {
      const cleanSymbol = String(payload.meta.symbol).replace("/", "").toUpperCase();

      for (const item of payload.values) {
        const closePrice = parseFloat(item.close);
        if (isNaN(closePrice)) continue;

        const observedAt = DataNormalizer.toIsoString(item.datetime);

        observations.push({
          sourceId: "twelve-data-market",
          entityId: `inst:${cleanSymbol.toLowerCase()}`,
          metric: "price_close",
          value: closePrice,
          unit: "currency",
          currency: payload.meta.currency || "USD",
          period: payload.meta.interval || "daily",
          observedAt,
          receivedAt: nowIso,
          confidence: "KNOWN",
          sourceReliability: this.sourceReliability,
          ingestionState: "NORMALIZED",
          sourceReference: `twelvedata:${cleanSymbol}:${item.datetime}`,
          metadata: {
            open: parseFloat(item.open || "0"),
            high: parseFloat(item.high || "0"),
            low: parseFloat(item.low || "0"),
            volume: parseInt(item.volume || "0", 10),
          },
        });
      }
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
