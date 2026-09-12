/**
 * DataState — the canonical set of states for any data-driven UI component.
 *
 * Every dashboard widget that fetches remote data MUST handle all of these states.
 * Do NOT use placeholder numbers, fake charts, or hardcoded fallbacks to disguise
 * missing or unavailable data.
 *
 * Rule: If Drawdown says it is real, it must be real.
 *       If data does not exist, display an honest empty state.
 *       If a provider is unavailable, display that it is unavailable.
 *       If data is stale, display that it is stale.
 */

export type DataState =
  | "loading"       // Data is being fetched — show skeleton
  | "live"          // Data was successfully retrieved and meets freshness requirements
  | "stale"         // Data exists but is outside the intended freshness window
  | "empty"         // Request succeeded but there is no data (user has none yet)
  | "unavailable"   // The provider or service is currently unavailable
  | "error";        // The request failed with an error

export interface DataStateResult<T> {
  state: DataState;
  data: T | null;
  fetchedAt: Date | null;
  /** Human-readable explanation shown to the user when state is stale/unavailable/error */
  staleReason?: string;
  errorMessage?: string;
}

/**
 * Provider connection status.
 * Used in product-status.ts and signal engine to accurately describe
 * which data sources are genuinely connected.
 */
export type ProviderStatus =
  | "CONNECTED"       // API key present and endpoint responding
  | "NOT_CONNECTED"   // No API key configured — provider is not available
  | "PARTIAL"         // Key present but some endpoints failing
  | "UNAVAILABLE";    // Key present but provider is down or rate-limited

/**
 * The NOT_CONNECTED sentinel returned by providers when their API key is absent.
 * Signal engine must check for this and never pass synthetic values to AI models.
 */
export const NOT_CONNECTED = "NOT_CONNECTED" as const;
export type NotConnected = typeof NOT_CONNECTED;
