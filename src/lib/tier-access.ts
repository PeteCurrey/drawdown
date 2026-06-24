/**
 * Tier access utility — single source of truth for subscription hierarchy.
 * 'signal-centre' sits below Foundation; it unlocks the Signal Centre only.
 */

export type SubscriptionTier =
  | "signal-centre"
  | "foundation"
  | "edge"
  | "floor"
  | "free"
  | null;

/** Numeric weight for each tier (higher = more access). */
export const TIER_LEVEL: Record<NonNullable<SubscriptionTier> | "null", number> = {
  null: 0,
  free: 0,
  "signal-centre": 1,
  foundation: 2,
  edge: 3,
  floor: 4,
};

/** Human-readable tier labels for UI copy. */
export const TIER_LABELS: Record<NonNullable<SubscriptionTier>, string> = {
  "signal-centre": "Signal Centre",
  foundation: "Foundation",
  edge: "Edge",
  floor: "Floor",
  free: "Free",
};

/** Tier display colours (Tailwind classes). */
export const TIER_COLORS: Record<NonNullable<SubscriptionTier>, string> = {
  "signal-centre": "text-[#C8F135]",
  foundation: "text-indigo-400",
  edge: "text-cyan-400",
  floor: "text-amber-400",
  free: "text-gray-400",
};

/**
 * Returns true if `userTier` grants access to content gated at `requiredTier`.
 *
 * @example
 *   hasAccess('edge', 'foundation') // true
 *   hasAccess('signal-centre', 'foundation') // false
 *   hasAccess('floor', 'edge') // true
 */
export function hasAccess(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const userLevel = TIER_LEVEL[(userTier ?? "null") as keyof typeof TIER_LEVEL] ?? 0;
  const requiredLevel = TIER_LEVEL[(requiredTier ?? "null") as keyof typeof TIER_LEVEL] ?? 0;
  return userLevel >= requiredLevel;
}

/** True if the user has Signal Centre access (any paid tier). */
export function hasSignalAccess(userTier: SubscriptionTier): boolean {
  return hasAccess(userTier, "signal-centre");
}
