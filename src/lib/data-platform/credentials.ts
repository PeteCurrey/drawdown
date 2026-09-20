/**
 * Drawdown Intelligence Data Platform — Server-Side Credential Manager & Secret Redactor
 *
 * Rules:
 *  - Provider API keys and secret tokens MUST NEVER execute in browser client context.
 *  - NEXT_PUBLIC_* variables must NEVER be used to store provider secrets.
 *  - All error messages and logs MUST be redacted to prevent secret leakage.
 */

export class CredentialManager {
  /**
   * Ensures execution is running strictly within a Node / Server environment.
   */
  static assertServerContext(providerName: string): void {
    if (typeof window !== "undefined") {
      throw new Error(
        `[SECURITY FATAL] ${providerName} credential access attempted in client/browser context. External provider API requests must execute server-side only.`
      );
    }
  }

  /**
   * Resolves the primary server-side Twelve Data key.
   * Never falls back to NEXT_PUBLIC_* variables.
   */
  static getTwelveDataKey(): string | null {
    this.assertServerContext("TwelveData");
    const primary = process.env.TWELVE_DATA_KEY?.trim();
    if (primary && primary.length > 5) return primary;

    const alt = process.env.TWELVE_DATA_KEY_ALT?.trim();
    if (alt && alt.length > 5) return alt;

    return null;
  }

  /**
   * Resolves all available server-side Twelve Data keys for rotation.
   */
  static getTwelveDataRotationKeys(): string[] {
    this.assertServerContext("TwelveData");
    const keys: string[] = [];
    if (process.env.TWELVE_DATA_KEY) {
      process.env.TWELVE_DATA_KEY.split(",").forEach(k => {
        const trimmed = k.trim();
        if (trimmed.length > 5 && !keys.includes(trimmed)) keys.push(trimmed);
      });
    }
    if (process.env.TWELVE_DATA_KEY_ALT) {
      const trimmed = process.env.TWELVE_DATA_KEY_ALT.trim();
      if (trimmed.length > 5 && !keys.includes(trimmed)) keys.push(trimmed);
    }
    return keys;
  }

  /**
   * Resolves FRED API Key (St. Louis Federal Reserve).
   */
  static getFredKey(): string | null {
    this.assertServerContext("FRED");
    const key = process.env.FRED_API_KEY?.trim();
    return key && key.length > 5 ? key : null;
  }

  /**
   * Resolves U.S. EIA API Key.
   */
  static getEiaKey(): string | null {
    this.assertServerContext("EIA");
    const key = process.env.EIA_API_KEY?.trim();
    return key && key.length > 5 ? key : null;
  }

  /**
   * Generic provider credential lookup by variable name.
   */
  static getSecret(envVarName: string): string | null {
    this.assertServerContext(envVarName);
    if (envVarName.startsWith("NEXT_PUBLIC_")) {
      console.warn(`[SECURITY WARNING] Attempted to read secret from public env var: ${envVarName}`);
      return null;
    }
    const val = process.env[envVarName]?.trim();
    return val && val.length > 0 ? val : null;
  }

  /**
   * Scrub secrets, tokens, and query parameters from text, URLs, and errors.
   */
  static redact(input: string): string {
    if (!input) return "";

    let cleaned = input;

    // Redact URL query params: apikey=..., api_key=..., token=...
    cleaned = cleaned.replace(/([?&](?:api_?key|token|secret|access_token)=)[^&]+/gi, "$1[REDACTED]");

    // Collect all configured active secret values to scrub
    const activeSecrets: string[] = [
      process.env.TWELVE_DATA_KEY,
      process.env.TWELVE_DATA_KEY_ALT,
      process.env.FRED_API_KEY,
      process.env.EIA_API_KEY,
      process.env.FINNHUB_API_KEY,
      process.env.POLYGON_API_KEY,
      process.env.ALPHA_VANTAGE_KEY,
      process.env.TAAPI_API_KEY,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.STRIPE_SECRET_KEY,
      process.env.RESEND_API_KEY,
    ]
      .filter((k): k is string => Boolean(k && k.trim().length > 5))
      .flatMap(k => k.split(",").map(s => s.trim()))
      .filter(s => s.length > 5);

    for (const secret of activeSecrets) {
      if (cleaned.includes(secret)) {
        cleaned = cleaned.replaceAll(secret, "[REDACTED_SECRET]");
      }
    }

    return cleaned;
  }
}
