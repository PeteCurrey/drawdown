/**
 * Drawdown Intelligence Data Platform — Provider Registry
 *
 * Central registry managing provider registration, lookup, capability checks,
 * and live connection state reporting.
 */

import type { DataProvider, SourceCategory, ProviderHealthReport } from "./types";
import { TwelveDataProvider } from "./providers/twelve-data";
import { FredProvider } from "./providers/fred";
import { EiaProvider } from "./providers/eia";
import { SecEdgarProvider } from "./providers/sec-edgar";
import { CftcCotProvider } from "./providers/cftc-cot";
import { CentralBanksProvider } from "./providers/central-banks";
import { RegulatorsProvider } from "./providers/regulators";

export class ProviderRegistry {
  private static providers = new Map<string, DataProvider>();
  private static initialized = false;

  /**
   * Initializes default providers across all tiers.
   */
  static initDefaultProviders(): void {
    if (this.initialized) return;

    this.register(new TwelveDataProvider());
    this.register(new FredProvider());
    this.register(new EiaProvider());
    this.register(new SecEdgarProvider());
    this.register(new CftcCotProvider());
    this.register(new CentralBanksProvider());
    this.register(new RegulatorsProvider());

    this.initialized = true;
  }

  /**
   * Registers a provider instance.
   */
  static register(provider: DataProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Retrieves a provider by its unique identifier.
   */
  static get(providerId: string): DataProvider | undefined {
    this.initDefaultProviders();
    return this.providers.get(providerId);
  }

  /**
   * Returns all registered providers.
   */
  static getAll(): DataProvider[] {
    this.initDefaultProviders();
    return Array.from(this.providers.values());
  }

  /**
   * Filters providers by category.
   */
  static getByCategory(category: SourceCategory): DataProvider[] {
    this.initDefaultProviders();
    return Array.from(this.providers.values()).filter(p =>
      p.categories.includes(category)
    );
  }

  /**
   * Runs a health check across all registered providers.
   */
  static async checkAllHealth(): Promise<Record<string, ProviderHealthReport>> {
    this.initDefaultProviders();
    const reports: Record<string, ProviderHealthReport> = {};

    await Promise.allSettled(
      Array.from(this.providers.values()).map(async provider => {
        try {
          reports[provider.id] = await provider.checkHealth();
        } catch (e: any) {
          reports[provider.id] = {
            isAvailable: false,
            status: "UNAVAILABLE",
            latencyMs: 0,
            error: e?.message || "Health check threw exception",
          };
        }
      })
    );

    return reports;
  }

  /**
   * Clears registry for testing.
   */
  static resetForTesting(): void {
    this.providers.clear();
    this.initialized = false;
  }
}
