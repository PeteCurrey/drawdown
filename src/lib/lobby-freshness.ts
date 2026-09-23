/**
 * src/lib/lobby-freshness.ts
 *
 * Editorial freshness classification for Lobby content.
 *
 * Consistent in spirit with the dataset-freshness table in
 * docs/market-data-health.md and the LIVE/RECENT/STALE bands already used
 * by src/lib/market-data-health.ts — but calibrated for editorial cadence
 * (hours/days) rather than market-data cadence (seconds/minutes).
 *
 * Bands:
 *   FRESH   < 6 h   → no badge needed; content is current
 *   RECENT  6–24 h  → "Updated [relative time]" label
 *   STALE   24–72 h → visible "X days ago" label
 *   AGED    > 72 h  → amber stale indicator; deprioritise from Lead / What's Happening
 *
 * Usage rules:
 *  - Homepage-facing sections (Lead Story, What's Happening) show the freshness
 *    signal inline — never hidden.
 *  - Archive / search show the true date unmodified (use formatArchiveDate()).
 *  - Nothing is hidden: AGED content stays visible but is visually signalled.
 */

export type EditorialFreshnessband = "FRESH" | "RECENT" | "STALE" | "AGED";

export interface EditorialFreshnessResult {
  band: EditorialFreshnessband;
  /** Human-readable label for homepage sections.  null = FRESH (no badge). */
  label: string | null;
  /** CSS classes for the label badge element. */
  badgeClass: string;
  /** True when the article should be deprioritised from lead/hero slots. */
  shouldDeprioritise: boolean;
  /** Age in milliseconds for callers that need it. */
  ageMs: number;
}

const HOUR_MS  = 60 * 60 * 1000;
const DAY_MS   = 24 * HOUR_MS;

const FRESH_THRESHOLD_MS  = 6  * HOUR_MS;   //  < 6 h  → FRESH
const RECENT_THRESHOLD_MS = 24 * HOUR_MS;   //  6–24 h → RECENT
const STALE_THRESHOLD_MS  = 72 * HOUR_MS;   // 24–72 h → STALE  (> 72 h → AGED)

/**
 * Returns freshness band and display metadata for a given publishedAt timestamp.
 *
 * Safe to call server-side (no window / Date.now() injection needed — uses
 * the timestamp at call time so SSR and client produce the same output within
 * a single request).
 *
 * @param publishedAt ISO string, Date, or null/undefined (treated as AGED).
 */
export function getEditorialFreshness(
  publishedAt: string | Date | null | undefined
): EditorialFreshnessResult {
  if (!publishedAt) {
    return {
      band: "AGED",
      label: "Date unknown",
      badgeClass: "text-amber-600 bg-amber-50 border border-amber-200",
      shouldDeprioritise: true,
      ageMs: Infinity,
    };
  }

  const pub = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  const now = Date.now();
  const ageMs = now - pub.getTime();

  // Content from the future (clocks, pre-scheduled articles) — treat as FRESH
  if (ageMs < 0) {
    return {
      band: "FRESH",
      label: null,
      badgeClass: "",
      shouldDeprioritise: false,
      ageMs: 0,
    };
  }

  if (ageMs < FRESH_THRESHOLD_MS) {
    return {
      band: "FRESH",
      label: null,
      badgeClass: "",
      shouldDeprioritise: false,
      ageMs,
    };
  }

  if (ageMs < RECENT_THRESHOLD_MS) {
    return {
      band: "RECENT",
      label: `Updated ${formatRelativeHours(ageMs)}`,
      badgeClass: "text-[#4B5157] bg-[#FAF9F5] border border-[#DEDDD8]",
      shouldDeprioritise: false,
      ageMs,
    };
  }

  if (ageMs < STALE_THRESHOLD_MS) {
    const days = Math.floor(ageMs / DAY_MS);
    return {
      band: "STALE",
      label: `${days} day${days !== 1 ? "s" : ""} ago`,
      badgeClass: "text-[#4B5157] bg-[#FAF9F5] border border-[#DEDDD8]",
      shouldDeprioritise: false,
      ageMs,
    };
  }

  // AGED: > 72 h
  const days = Math.floor(ageMs / DAY_MS);
  return {
    band: "AGED",
    label: days < 14
      ? `${days} days ago`
      : days < 60
        ? `${Math.floor(days / 7)} weeks ago`
        : `${Math.floor(days / 30)} months ago`,
    badgeClass: "text-amber-700 bg-amber-50 border border-amber-200",
    shouldDeprioritise: true,
    ageMs,
  };
}

// ─── Archive helper ───────────────────────────────────────────────────────────

/**
 * Formats a date for archive/search views — always the true date, never a
 * relative label. This is the correct formatter for any context that is NOT
 * a homepage-facing recency signal.
 */
export function formatArchiveDate(
  publishedAt: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
): string {
  if (!publishedAt) return "Undated";
  const pub = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  return pub.toLocaleDateString("en-GB", options);
}

// ─── Inline helpers ───────────────────────────────────────────────────────────

function formatRelativeHours(ageMs: number): string {
  const hours = Math.floor(ageMs / HOUR_MS);
  const mins  = Math.floor((ageMs % HOUR_MS) / (60 * 1000));
  if (hours === 0) return `${mins}m ago`;
  if (mins === 0)  return `${hours}h ago`;
  return `${hours}h ${mins}m ago`;
}
