/**
 * Canonical Entitlements & Commercial Access Engine for Drawdown Trading
 * 
 * Standards:
 * - FAIL CLOSED: Unauthenticated or unpaid users always resolve to Level 0 (free).
 * - Authoritative Tier Weights:
 *     free: 0
 *     signal-centre: 1 (legacy grandfathered, signal access only)
 *     foundation: 1    (£49/mo - Signal Centre, Core Journal, Risk Calculator)
 *     edge: 2          (£99/mo - Includes Signal Centre + Investment Centre + Macro Intelligence)
 *     floor: 3         (£299/mo - Includes Edge + Full Course Library + Mentorship + Algo Builder full export)
 *     accelerator: 4   (£1,500 one-off / intensive cohort)
 * - Active Status Requirement: Paid tier privileges require subscription_status IN ('active', 'trialing').
 *   If status is 'past_due', 'unpaid', 'cancelled', or 'inactive', effective level falls back to 0.
 */

export type CanonicalTier = 'free' | 'signal-centre' | 'foundation' | 'edge' | 'floor' | 'accelerator';

export const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  'signal-centre': 1,
  foundation: 1,
  edge: 2,
  floor: 3,
  accelerator: 4,
};

export const TIER_LEVELS = TIER_WEIGHT;

/**
 * Checks whether a subscription status represents active paid standing.
 */
export function isSubscriptionActive(status: string | null | undefined): boolean {
  if (!status) return false;
  const normalized = status.trim().toLowerCase();
  return normalized === 'active' || normalized === 'trialing';
}

/**
 * Calculates effective tier level taking subscription status into account.
 * Drops to 0 (free) if subscription is not active or trialing, unless accelerator.
 */
export function getEffectiveTierLevel(
  tier: string | null | undefined,
  status?: string | null | undefined
): number {
  if (!tier) return 0;
  const normalizedTier = tier.trim().toLowerCase();
  const rawLevel = TIER_WEIGHT[normalizedTier] ?? 0;
  if (rawLevel === 0) return 0;

  // Accelerator access can be lifetime/cohort-based; but if status is provided and inactive, check if explicitly revoked
  if (normalizedTier === 'accelerator') {
    return 4;
  }

  // If status is supplied, enforce that it is active or trialing
  if (status !== undefined && !isSubscriptionActive(status)) {
    return 0;
  }

  return rawLevel;
}

/**
 * Checks if a user has sufficient tier level for a required minimum tier.
 */
export function hasTierAccess(
  userTier: string | null | undefined,
  requiredTier: string,
  userStatus?: string | null | undefined
): boolean {
  const effectiveLevel = getEffectiveTierLevel(userTier, userStatus);
  const requiredLevel = TIER_WEIGHT[requiredTier.trim().toLowerCase()] ?? 0;
  return effectiveLevel >= requiredLevel;
}

/**
 * Commercial access rules
 */
export const CommercialAccess = {
  canAccessSignalCentre(tier: string | null | undefined, status?: string | null | undefined): boolean {
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessInvestmentCentre(tier: string | null | undefined, status?: string | null | undefined): boolean {
    return getEffectiveTierLevel(tier, status) >= 2;
  },

  canAccessFullCourses(tier: string | null | undefined, status?: string | null | undefined): boolean {
    return getEffectiveTierLevel(tier, status) >= 3;
  },

  canAccessMentorship(tier: string | null | undefined, status?: string | null | undefined): boolean {
    return getEffectiveTierLevel(tier, status) >= 3;
  },

  canAccessAlgoBuilderExport(tier: string | null | undefined, status?: string | null | undefined): boolean {
    return getEffectiveTierLevel(tier, status) >= 3;
  },
};

/**
 * Server-side helper to query authoritative entitlement directly from database profile
 */
export async function resolveUserEntitlement(supabase: any, userId: string) {
  if (!userId) {
    return {
      tier: 'free' as CanonicalTier,
      status: 'inactive',
      level: 0,
      isActive: false,
      canAccessSignals: false,
      canAccessInvestmentCentre: false,
      canAccessCourses: false,
      canAccessMentorship: false,
      canAccessAlgoExport: false,
    };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) {
    return {
      tier: 'free' as CanonicalTier,
      status: 'inactive',
      level: 0,
      isActive: false,
      canAccessSignals: false,
      canAccessInvestmentCentre: false,
      canAccessCourses: false,
      canAccessMentorship: false,
      canAccessAlgoExport: false,
    };
  }

  const tier = (profile.subscription_tier || 'free').toLowerCase() as CanonicalTier;
  const status = profile.subscription_status || 'inactive';
  const level = getEffectiveTierLevel(tier, status);
  const isActive = isSubscriptionActive(status) || tier === 'accelerator';

  return {
    tier,
    status,
    level,
    isActive,
    isAdmin: profile.role === 'admin',
    canAccessSignals: CommercialAccess.canAccessSignalCentre(tier, status),
    canAccessInvestmentCentre: CommercialAccess.canAccessInvestmentCentre(tier, status),
    canAccessCourses: CommercialAccess.canAccessFullCourses(tier, status),
    canAccessMentorship: CommercialAccess.canAccessMentorship(tier, status),
    canAccessAlgoExport: CommercialAccess.canAccessAlgoBuilderExport(tier, status),
  };
}
