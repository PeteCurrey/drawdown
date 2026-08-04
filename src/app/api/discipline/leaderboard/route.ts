import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { BADGE_KEYS } from "@/lib/discipline-badge-service";

/**
 * GET /api/discipline/leaderboard
 * Returns public list of opt-in users holding Verified Discipline badges.
 *
 * ⚠ COMPLIANCE NOTE:
 * This only displays process badges and duration (since date).
 * It never exposes account size, profits, losses, or trade volumes.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Fetch opt-in users with active discipline badges
    const { data: rows, error } = await supabase
      .from("profiles")
      .select(`
        id,
        display_name,
        user_badges (
          badge_key,
          awarded_at
        )
      `)
      .eq("show_badges_publicly", true);

    if (error) throw error;

    // Filter and format the results
    const leaderboard = (rows ?? [])
      .map((row: any) => {
        const badges = row.user_badges ?? [];
        const disciplineBadges = badges.filter((b: any) =>
          Object.values(BADGE_KEYS).includes(b.badge_key as any)
        );

        if (disciplineBadges.length === 0) return null;

        // Find highest tier
        const hasGold   = disciplineBadges.some((b: any) => b.badge_key === BADGE_KEYS.gold);
        const hasSilver = disciplineBadges.some((b: any) => b.badge_key === BADGE_KEYS.silver);
        const hasBronze = disciplineBadges.some((b: any) => b.badge_key === BADGE_KEYS.bronze);

        const tier = hasGold ? "gold" : hasSilver ? "silver" : hasBronze ? "bronze" : null;

        // Use display name or anonymised fallback based on user ID hash
        const hash = row.id.substring(0, 4).toUpperCase();
        const name = row.display_name?.trim() || `Trader #${hash}`;

        // Get the earliest award timestamp (bronze award date)
        const bronzeAward = disciplineBadges.find((b: any) => b.badge_key === BADGE_KEYS.bronze);
        const since = bronzeAward ? bronzeAward.awarded_at : null;

        return {
          name,
          tier,
          since,
        };
      })
      .filter(Boolean);

    // Sort by tier priority: gold > silver > bronze, then by oldest since
    const tierPriority = { gold: 3, silver: 2, bronze: 1 };
    leaderboard.sort((a: any, b: any) => {
      const pA = tierPriority[a.tier as keyof typeof tierPriority] || 0;
      const pB = tierPriority[b.tier as keyof typeof tierPriority] || 0;
      if (pA !== pB) return pB - pA;
      return new Date(a.since).getTime() - new Date(b.since).getTime();
    });

    return NextResponse.json({ leaderboard });
  } catch (e: any) {
    console.error("GET /api/discipline/leaderboard error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
