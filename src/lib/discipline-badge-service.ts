import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  computeDisciplineScore,
  getBadgeTier,
  type BadgeStatus,
  type TradeRow,
} from "@/lib/discipline-scorer";

// Badge key constants
export const BADGE_KEYS = {
  bronze: "discipline_bronze",
  silver: "discipline_silver",
  gold:   "discipline_gold",
} as const;

/**
 * Compute and persist the discipline badge status for a given user.
 *
 * Called:
 *  - Weekly via cron (/api/cron/discipline-badges)
 *  - On-demand from the journal page when a user saves a trade
 *
 * Deliberately does NOT expose P&L to the scoring engine.
 */
export async function evaluateAndPersistBadge(
  userId: string
): Promise<BadgeStatus> {
  const supabase = createServiceRoleClient();

  // Fetch all trade_entries for this user (only columns scoring engine needs)
  const { data: rows, error } = await (supabase as any)
    .from("trade_entries")
    .select("id, trading_day, status, stop_loss, rules_followed, risk_percent")
    .eq("user_id", userId)
    .order("trading_day", { ascending: true });

  if (error) throw new Error(`Failed to fetch trades: ${error.message}`);

  const trades = (rows ?? []) as TradeRow[];
  const score  = computeDisciplineScore(trades);

  // Determine how long the user has been continuously passing
  // We use user_badges table to track the awarded_at of the lowest badge level
  const { data: existingBronze } = await supabase
    .from("user_badges")
    .select("awarded_at")
    .eq("user_id", userId)
    .eq("badge_key", BADGE_KEYS.bronze)
    .maybeSingle();

  let consecutiveDaysPassing = 0;
  if (score.all_passed && existingBronze?.awarded_at) {
    consecutiveDaysPassing = Math.floor(
      (Date.now() - new Date(existingBronze.awarded_at).getTime()) / 86_400_000
    );
  } else if (score.all_passed && !existingBronze) {
    // First time passing — day 1
    consecutiveDaysPassing = 1;
  }

  const tier = getBadgeTier(consecutiveDaysPassing);

  // ── Persist badge awards ───────────────────────────────────────────────────
  if (score.all_passed) {
    // Award bronze on first passing
    if (!existingBronze) {
      await supabase.from("user_badges").upsert({
        user_id:    userId,
        badge_key:  BADGE_KEYS.bronze,
        awarded_at: new Date().toISOString(),
      }, { onConflict: "user_id,badge_key" });
    }
    // Award silver if earned
    if (consecutiveDaysPassing >= 180) {
      await supabase.from("user_badges").upsert({
        user_id:    userId,
        badge_key:  BADGE_KEYS.silver,
        awarded_at: new Date().toISOString(),
      }, { onConflict: "user_id,badge_key" });
    }
    // Award gold if earned
    if (consecutiveDaysPassing >= 365) {
      await supabase.from("user_badges").upsert({
        user_id:    userId,
        badge_key:  BADGE_KEYS.gold,
        awarded_at: new Date().toISOString(),
      }, { onConflict: "user_id,badge_key" });
    }
  } else if (existingBronze) {
    // Criteria no longer all pass — revoke all discipline badges
    // (badge history is preserved via awarded_at timestamp, not deletion)
    await supabase
      .from("user_badges")
      .delete()
      .eq("user_id", userId)
      .in("badge_key", Object.values(BADGE_KEYS));
  }

  return { tier, consecutive_days_passing: consecutiveDaysPassing, score };
}

/**
 * Read the current badge status for a user without recalculating.
 * Fast path for display — used by the profile page and journal header.
 */
export async function readBadgeStatus(userId: string): Promise<{
  tier: import("@/lib/discipline-scorer").BadgeTier;
  badges: Array<{ badge_key: string; awarded_at: string }>;
}> {
  const supabase = createServiceRoleClient();

  const { data } = await supabase
    .from("user_badges")
    .select("badge_key, awarded_at")
    .eq("user_id", userId)
    .in("badge_key", Object.values(BADGE_KEYS))
    .order("awarded_at", { ascending: true });

  const badges = (data ?? []) as Array<{ badge_key: string; awarded_at: string }>;

  const hasGold   = badges.some((b) => b.badge_key === BADGE_KEYS.gold);
  const hasSilver = badges.some((b) => b.badge_key === BADGE_KEYS.silver);
  const hasBronze = badges.some((b) => b.badge_key === BADGE_KEYS.bronze);

  const tier = hasGold ? "gold" : hasSilver ? "silver" : hasBronze ? "bronze" : null;

  return { tier, badges };
}
