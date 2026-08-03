import { createServiceRoleClient } from "@/lib/supabase/server";

/** Max AI requests per user per hour */
const MAX_REQUESTS_PER_HOUR = 20;
/** Alert threshold: if a user exceeds this many requests in 24h, log a warning */
const DAILY_ALERT_THRESHOLD = 100;

export type AiRoute =
  | "chart_analysis"
  | "explain_news"
  | "journal_analysis"
  | "journal_analyse";

/**
 * Check whether a user is within their hourly AI rate limit.
 * Inserts a log row on success.
 *
 * Returns { allowed: true } if under the limit, { allowed: false, retryAfter } if exceeded.
 */
export async function checkAndLogAiUsage(
  userId: string,
  route: AiRoute
): Promise<{ allowed: true } | { allowed: false; retryAfter: number }> {
  const supabase = createServiceRoleClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Count requests in the last hour for this user
  const { count } = await supabase
    .from("ai_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("called_at", oneHourAgo);

  if ((count ?? 0) >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, retryAfter: 3600 };
  }

  // Log this request
  await supabase.from("ai_usage_log").insert({
    user_id: userId,
    route,
    called_at: new Date().toISOString(),
  });

  // Spend alert: check daily count and warn if high
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: dailyCount } = await supabase
    .from("ai_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("called_at", oneDayAgo);

  if ((dailyCount ?? 0) > DAILY_ALERT_THRESHOLD) {
    console.warn(
      `[AI spend alert] User ${userId} has made ${dailyCount} AI requests in the last 24h`
    );
  }

  return { allowed: true };
}
