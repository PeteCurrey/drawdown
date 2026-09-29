/**
 * src/lib/lobby-freshness.ts
 *
 * Editorial freshness classification for Lobby content.
 *
 * COMPATIBILITY WRAPPER:
 * Delegates all thresholds and evaluation logic directly to the single
 * authoritative source of truth in src/lib/data-freshness-policy.ts.
 */

import {
  evaluateTimestampFreshness,
  DATASET_FRESHNESS_CONFIG,
  DataFreshnessBand,
} from "./data-freshness-policy.ts";

export type EditorialFreshnessband = "FRESH" | "RECENT" | "STALE" | "AGED";

export interface EditorialFreshnessResult {
  band: EditorialFreshnessband;
  /** Human-readable label for homepage sections. null = FRESH (no badge). */
  label: string | null;
  /** CSS classes for the label badge element. */
  badgeClass: string;
  /** True when the article should be deprioritised from lead/hero slots. */
  shouldDeprioritise: boolean;
  /** Age in milliseconds for callers that need it. */
  ageMs: number;
}

/**
 * Returns freshness band and display metadata for a given publishedAt timestamp.
 * Delegates directly to the canonical evaluateTimestampFreshness.
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

  const evaluated = evaluateTimestampFreshness("lobby_lead", publishedAt);

  // Map canonical DataFreshnessBand to EditorialFreshnessband
  let band: EditorialFreshnessband = "FRESH";
  if (evaluated.band === "RECENT") band = "RECENT";
  else if (evaluated.band === "STALE") band = "STALE";
  else if (evaluated.band === "AGED" || evaluated.band === "UNAVAILABLE" || evaluated.band === "ERROR") band = "AGED";

  let badgeClass = "";
  let label: string | null = null;

  switch (band) {
    case "FRESH":
      label = null;
      badgeClass = "";
      break;
    case "RECENT":
      label = evaluated.label ? `Updated ${evaluated.label}` : "Recent";
      badgeClass = "text-[#4B5157] bg-[#F0EFEA] border border-[#DEDDD8]";
      break;
    case "STALE":
      label = evaluated.label || "Over 24h ago";
      badgeClass = "text-amber-700 bg-amber-50 border border-amber-200";
      break;
    case "AGED":
      label = evaluated.label || "Over 72h ago";
      badgeClass = "text-amber-800 bg-amber-100 border border-amber-300 font-semibold";
      break;
  }

  return {
    band,
    label,
    badgeClass,
    shouldDeprioritise: band === "AGED" || !evaluated.isEligible,
    ageMs: evaluated.ageMs,
  };
}

/**
 * Formats a timestamp for archive display.
 */
export function formatArchiveDate(
  publishedAt: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!publishedAt) return "—";
  const date = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  });
}
