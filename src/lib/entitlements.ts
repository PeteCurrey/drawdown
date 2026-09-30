/**
 * Canonical Entitlements & Commercial Access Engine for Avorria Trading
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

export type CanonicalTier = 'free' | 'core' | 'signal-centre' | 'foundation' | 'edge' | 'floor' | 'accelerator';

export const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  core: 1, // Canonical core tier (capability-based access model)
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
 * Checks whether user has an active core subscription.
 */
export function hasCoreSubscription(
  tier: string | null | undefined,
  status?: string | null | undefined
): boolean {
  if (!tier || !isSubscriptionActive(status)) return false;
  const normalized = tier.trim().toLowerCase();
  return normalized === 'core';
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

  // Accelerator access can be lifetime/cohort-based
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
 * Backwards compatible: an active core subscription satisfies core platform requirements.
 */
export function hasTierAccess(
  userTier: string | null | undefined,
  requiredTier: string,
  userStatus?: string | null | undefined
): boolean {
  if (!userTier) return false;
  const normalizedUser = userTier.trim().toLowerCase();
  const normalizedReq = requiredTier.trim().toLowerCase();

  // Core subscriber has access to all core platform tools (foundation, edge, floor platform tools)
  if (normalizedUser === 'core' && isSubscriptionActive(userStatus)) {
    return true;
  }

  const effectiveLevel = getEffectiveTierLevel(userTier, userStatus);
  const requiredLevel = TIER_WEIGHT[normalizedReq] ?? 0;
  return effectiveLevel >= requiredLevel;
}

/**
 * Commercial access rules with explicit core capability predicates.
 * All core platform functionality is included in the £24.99/mo Core Membership.
 * Premium courses and 1-on-1 mentorship remain separate paid products.
 */
export const CommercialAccess = {
  /** Core Platform Capabilities */
  canAccessSignalCentre(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'signal-centre' && isSubscriptionActive(status)) return true;
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessMarketScreener(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessTechnicalScanner(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessMarketIntelligence(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessInvestmentCentre(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 2;
  },

  canAccessAIJournal(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessBacktester(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 2;
  },

  canAccessAlgoBuilderExport(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 3;
  },

  canAccessWatchlists(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  canAccessSavedScreens(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    if (normalized === 'core' && isSubscriptionActive(status)) return true;
    return getEffectiveTierLevel(tier, status) >= 1;
  },

  /**
   * Premium Products that REMAIN SEPARATE from the Core Subscription:
   * Core subscription does NOT unlock full paid courses or 1-on-1 mentorship.
   */
  canAccessFullCourses(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    // Core subscribers DO NOT receive full courses automatically
    if (normalized === 'core') return false;
    return getEffectiveTierLevel(tier, status) >= 3;
  },

  canAccessMentorship(tier: string | null | undefined, status?: string | null | undefined): boolean {
    if (!tier) return false;
    const normalized = tier.trim().toLowerCase();
    // Core subscribers DO NOT receive 1-on-1 mentorship automatically
    if (normalized === 'core') return false;
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
      hasCoreAccess: false,
      canAccessSignals: false,
      canAccessScanner: false,
      canAccessIntelligence: false,
      canAccessInvestmentCentre: false,
      canAccessAIJournal: false,
      canAccessBacktester: false,
      canAccessAlgoExport: false,
      canAccessCourses: false,
      canAccessMentorship: false,
      canAccessWatchlists: false,
      canAccessSavedScreens: false,
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
      hasCoreAccess: false,
      canAccessSignals: false,
      canAccessScanner: false,
      canAccessIntelligence: false,
      canAccessInvestmentCentre: false,
      canAccessAIJournal: false,
      canAccessBacktester: false,
      canAccessAlgoExport: false,
      canAccessCourses: false,
      canAccessMentorship: false,
      canAccessWatchlists: false,
      canAccessSavedScreens: false,
    };
  }

  const tier = (profile.subscription_tier || 'free').toLowerCase() as CanonicalTier;
  const status = profile.subscription_status || 'inactive';
  const level = getEffectiveTierLevel(tier, status);
  const isActive = isSubscriptionActive(status) || tier === 'accelerator';
  const isAdmin = profile.role === 'admin';
  const hasCore = isAdmin || hasCoreSubscription(tier, status);

  return {
    tier,
    status,
    level,
    isActive,
    isAdmin,
    hasCoreAccess: hasCore,
    canAccessSignals: isAdmin || CommercialAccess.canAccessSignalCentre(tier, status),
    canAccessScanner: isAdmin || CommercialAccess.canAccessMarketScreener(tier, status),
    canAccessIntelligence: isAdmin || CommercialAccess.canAccessMarketIntelligence(tier, status),
    canAccessInvestmentCentre: isAdmin || CommercialAccess.canAccessInvestmentCentre(tier, status),
    canAccessAIJournal: isAdmin || CommercialAccess.canAccessAIJournal(tier, status),
    canAccessBacktester: isAdmin || CommercialAccess.canAccessBacktester(tier, status),
    canAccessAlgoExport: isAdmin || CommercialAccess.canAccessAlgoBuilderExport(tier, status),
    canAccessCourses: isAdmin || CommercialAccess.canAccessFullCourses(tier, status),
    canAccessMentorship: isAdmin || CommercialAccess.canAccessMentorship(tier, status),
    canAccessWatchlists: isAdmin || CommercialAccess.canAccessWatchlists(tier, status),
    canAccessSavedScreens: isAdmin || CommercialAccess.canAccessSavedScreens(tier, status),
  };
}
