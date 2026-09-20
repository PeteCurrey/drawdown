/**
 * Drawdown Intelligence Data Platform — Base Provider Abstract Class
 *
 * Provides shared HTTP execution, latency tracking, secret redaction,
 * rate limit tracking, and circuit breaker checks.
 */

import type { 
  DataProvider,
  SourceCategory,
  SourceReliability,
  AuthenticationType,
  RateLimitConfig,
  AttributionPolicy,
  LicensePolicy,
  IngestionRequest,
  RawFetchResult,
  NormalizedIngestionBundle,
  ProviderHealthReport,
 } from "../types.ts";
import { CredentialManager } from "../credentials.ts";
import { ProviderHealthManager } from "../health.ts";
import { DataNormalizer } from "../normalization.ts";

export abstract class BaseProvider implements DataProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly categories: SourceCategory[];
  abstract readonly sourceReliability: SourceReliability;
  abstract readonly authenticationType: AuthenticationType;
  abstract readonly rateLimits: RateLimitConfig;
  abstract readonly attribution: AttributionPolicy;
  abstract readonly licensing: LicensePolicy;

  /**
   * Resolves the primary credential for this provider.
   * Return null if unconfigured.
   */
  protected abstract getCredential(): string | null;

  /**
   * Implementation-specific health check.
   */
  abstract checkHealth(): Promise<ProviderHealthReport>;

  /**
   * Transforms raw response payload into normalized observations/events.
   */
  abstract normalize(raw: RawFetchResult): Promise<NormalizedIngestionBundle>;

  /**
   * Thin HTTP fetch layer with rate-limiting, timing, error redaction,
   * and circuit-breaker telemetry.
   */
  async fetchRaw(request: IngestionRequest): Promise<RawFetchResult> {
    CredentialManager.assertServerContext(this.name);

    // 1. Check Circuit Breaker
    if (!ProviderHealthManager.canExecute(this.id)) {
      const health = ProviderHealthManager.getHealth(this.id, this.name);
      throw new Error(
        `[${this.id}] Circuit breaker is OPEN. Cooldown expires at ${health.rateLimitResetAt || "unknown"}`
      );
    }

    const startTime = Date.now();
    let httpStatus = 0;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), request.timeoutMs ?? 10_000);

      const res = await fetch(request.endpoint, {
        headers: request.headers,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      httpStatus = res.status;
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        ProviderHealthManager.recordExecution(this.id, {
          latencyMs,
          isSuccess: false,
          httpStatus,
          errorMessage: `HTTP ${res.status}: ${res.statusText}`,
          rateLimitResetMs: httpStatus === 429 ? this.rateLimits.cooldownPeriodMs : undefined,
        });

        throw new Error(`[${this.id}] API returned HTTP ${res.status}: ${res.statusText}`);
      }

      const payload = await res.json();
      const rawHash = DataNormalizer.generateHash(payload);

      ProviderHealthManager.recordExecution(this.id, {
        latencyMs,
        isSuccess: true,
        httpStatus,
      });

      return {
        providerId: this.id,
        endpoint: CredentialManager.redact(request.endpoint),
        httpStatus,
        latencyMs,
        payload,
        rawHash,
        fetchedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const cleanError = CredentialManager.redact(err?.message || "Unknown fetch error");

      ProviderHealthManager.recordExecution(this.id, {
        latencyMs,
        isSuccess: false,
        httpStatus: httpStatus || 500,
        errorMessage: cleanError,
      });

      throw new Error(`[${this.id}] Fetch failed: ${cleanError}`);
    }
  }
}
