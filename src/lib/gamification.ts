import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for internal awarding

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export type BadgeType = 
  | "first_flight"      // Logged first trade
  | "math_master"       // Passed Ground Zero quiz
  | "disciplined"       // 5-day journal streak
  | "pete_approved"     // Manual award
  | "edge_unlocked"     // Upgraded to Edge tier
  | "survivor";        // Recovered from 5%+ drawdown

const BADGE_METADATA: Record<BadgeType, { title: string; description: string; icon: string }> = {
  first_flight: {
    title: "First Flight",
    description: "Successfully logged your first performance entry.",
    icon: "🛩️"
  },
  math_master: {
    title: "Math Master",
    description: "Scored 100% on the Math of Survivability quiz.",
    icon: "🧮"
  },
  disciplined: {
    title: "Disciplined",
    description: "Maintained a 5-day journaling streak without error.",
    icon: "🎯"
  },
  pete_approved: {
    title: "Pete Approved",
    description: "Directly recognised for mechanical integrity.",
    icon: "🤝"
  },
  edge_unlocked: {
    title: "Edge Unlocked",
    description: "Gained full access to the AI intelligence engine.",
    icon: "🔓"
  },
  survivor: {
    title: "The Survivor",
    description: "Recovered a 5% drawdown while maintaining risk rules.",
    icon: "🛡️"
  }
};

export async function awardBadge(userId: string, badgeKey: BadgeType) {
  try {
    // 1. Insert badge record
    const { error: badgeError } = await supabase
      .from("user_badges")
      .upsert({ user_id: userId, badge_key: badgeKey }, { onConflict: "user_id,badge_key" });

    if (badgeError) throw badgeError;

    // 2. Create notification
    const badge = BADGE_METADATA[badgeKey];
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        type: "achievement",
        title: `Achievement Unlocked: ${badge.title}`,
        message: badge.description,
        action_url: "/profile"
      });

    if (notifError) throw notifError;

    return { success: true, badge };
  } catch (error) {
    console.error("Error awarding badge:", error);
    return { success: false, error };
  }
}

export async function getUserBadges(userId: string) {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_key, awarded_at")
    .eq("user_id", userId);

  if (error) return [];
  
  return data.map(b => ({
    ...b,
    metadata: BADGE_METADATA[b.badge_key as BadgeType]
  }));
}
