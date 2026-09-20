/**
 * Drawdown Intelligence Data Platform — Provider Health & Circuit Breaker Manager
 *
 * Implements:
 *  - Continuous request/failure telemetry & latency EMA
 *  - Circuit breaker (CLOSED -> OPEN -> HALF_OPEN)
 *  - Rate limit backoff tracking
 *  - Fault isolation: prevents third-party outages from crashing the platform
 */

import type {  ProviderHealth, CircuitBreakerState, ProviderHealthReport  } from "./types";
import { CredentialManager } from "./credentials";

export interface HealthRecordOptions {
  latencyMs: number;
  isSuccess: boolean;
  httpStatus?: number;
  errorMessage?: string;
  rateLimitResetMs?: number;
}

export class ProviderHealthManager {
  private static healthStore = new Map<string, ProviderHealth>();

  private static readonly MAX_CONSECUTIVE_FAILURES = 5;
  private static readonly DEFAULT_CIRCUIT_COOLDOWN_MS = 60_000; // 1 minute

  /**
   * Initialize or retrieve health state for a provider.
   */
  static getHealth(providerId: string, providerName?: string): ProviderHealth {
    let health = this.healthStore.get(providerId);
    if (!health) {
      health = {
        providerId,
        name: providerName ?? providerId,
        status: "AVAILABLE",
        successfulRequests: 0,
        failedRequests: 0,
        consecutiveFailures: 0,
        averageLatencyMs: 0,
        circuitBreakerState: "CLOSED",
      };
      this.healthStore.set(providerId, health);
    }

    // Check if circuit breaker can transition from OPEN to HALF_OPEN
    if (health.circuitBreakerState === "OPEN" && health.rateLimitResetAt) {
      const resetTime = new Date(health.rateLimitResetAt).getTime();
      if (Date.now() >= resetTime) {
        health.circuitBreakerState = "HALF_OPEN";
        health.status = "DEGRADED";
      }
    }

    return health;
  }

  /**
   * Determine if requests should be allowed through to the provider.
   */
  static canExecute(providerId: string): boolean {
    const health = this.getHealth(providerId);
    if (health.circuitBreakerState === "OPEN") {
      // Check cooldown expiry
      if (health.rateLimitResetAt && Date.now() >= new Date(health.rateLimitResetAt).getTime()) {
        health.circuitBreakerState = "HALF_OPEN";
        return true; // allow probe request
      }
      return false; // fail fast
    }
    return true;
  }

  /**
   * Record the outcome of an execution attempt.
   */
  static recordExecution(providerId: string, options: HealthRecordOptions): void {
    const health = this.getHealth(providerId);
    const now = new Date().toISOString();
    health.lastAttemptedFetch = now;

    if (options.isSuccess) {
      health.successfulRequests++;
      health.consecutiveFailures = 0;
      health.lastSuccessfulFetch = now;
      health.lastErrorMessage = undefined;

      // Update EMA latency (alpha = 0.2)
      health.averageLatencyMs =
        health.averageLatencyMs === 0
          ? options.latencyMs
          : Math.round(health.averageLatencyMs * 0.8 + options.latencyMs * 0.2);

      // If probing in HALF_OPEN, restore to CLOSED
      if (health.circuitBreakerState === "HALF_OPEN") {
        health.circuitBreakerState = "CLOSED";
      }

      health.status = health.averageLatencyMs > 2500 ? "DEGRADED" : "AVAILABLE";
    } else {
      health.failedRequests++;
      health.consecutiveFailures++;
      health.lastErrorMessage = options.errorMessage
        ? CredentialManager.redact(options.errorMessage)
        : `Request failed with HTTP status ${options.httpStatus ?? "unknown"}`;

      // Handle Rate Limit (HTTP 429) or consecutive threshold
      const isRateLimited = options.httpStatus === 429;
      if (isRateLimited || health.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        health.circuitBreakerState = "OPEN";
        health.status = "UNAVAILABLE";

        const cooldownMs = options.rateLimitResetMs ?? this.DEFAULT_CIRCUIT_COOLDOWN_MS;
        health.rateLimitResetAt = new Date(Date.now() + cooldownMs).toISOString();
      } else {
        health.status = "DEGRADED";
      }
    }
  }

  /**
   * Summarize health report for downstream status consumers.
   */
  static generateReport(providerId: string): ProviderHealthReport {
    const health = this.getHealth(providerId);
    return {
      isAvailable: health.circuitBreakerState !== "OPEN" && health.status !== "UNAVAILABLE",
      status: health.status,
      latencyMs: health.averageLatencyMs,
      error: health.lastErrorMessage,
      details: {
        circuitBreakerState: health.circuitBreakerState,
        consecutiveFailures: health.consecutiveFailures,
        successfulRequests: health.successfulRequests,
        failedRequests: health.failedRequests,
        rateLimitResetAt: health.rateLimitResetAt,
      },
    };
  }

  /**
   * Reset state for testing.
   */
  static resetForTesting(): void {
    this.healthStore.clear();
  }
}
