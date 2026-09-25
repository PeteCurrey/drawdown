/**
 * In-memory circuit breaker for Twelve Data API.
 * Prevents hammering Twelve Data when daily credits are exhausted or rate limited (HTTP 429).
 */

let tdExhaustedUntil = 0;

export function isTwelveDataExhausted(): boolean {
  return Date.now() < tdExhaustedUntil;
}

export function tripTwelveDataCircuitBreaker(durationMs = 15 * 60 * 1000): void {
  tdExhaustedUntil = Date.now() + durationMs;
  console.warn(`[circuit-breaker] Twelve Data marked exhausted until ${new Date(tdExhaustedUntil).toISOString()}`);
}

export function resetTwelveDataCircuitBreaker(): void {
  tdExhaustedUntil = 0;
}
