import type { SupabaseClient } from "@supabase/supabase-js";

export interface CourseAccessResult {
  hasAccess:  boolean;
  via:        "stripe_purchase" | "floor_tier" | "manual_grant" | null;
  purchasedAt: string | null;
}

/**
 * Checks whether a user has access to a course identified by its slug.
 *
 * Resolution order:
 *  1. Explicit row in course_purchases (any access_granted_via)
 *  2. Active Floor subscription (auto-grants via RPC if row is missing)
 *
 * Pass the Supabase **server** client (with user session) or the
 * **service-role** client from API routes / server actions.
 */
export async function checkCourseAccess(
  supabase:   SupabaseClient,
  userId:     string,
  courseSlug: string
): Promise<CourseAccessResult> {

  // ── 1. Resolve course_id from slug ─────────────────────────────────────────
  const { data: course } = await supabase
    .from("courses" as any)
    .select("id, is_free_for_floor")
    .eq("slug", courseSlug)
    .single();

  if (!course) return { hasAccess: false, via: null, purchasedAt: null };

  // ── 2. Check explicit purchase row ─────────────────────────────────────────
  const { data: purchase } = await supabase
    .from("course_purchases" as any)
    .select("access_granted_via, purchased_at")
    .eq("user_id", userId)
    .eq("course_id", (course as any).id)
    .maybeSingle();

  if (purchase) {
    return {
      hasAccess:   true,
      via:         (purchase as any).access_granted_via,
      purchasedAt: (purchase as any).purchased_at,
    };
  }

  // ── 3. Check Floor subscription (belt-and-braces) ──────────────────────────
  if (!(course as any).is_free_for_floor) {
    return { hasAccess: false, via: null, purchasedAt: null };
  }

  const { data: profile } = await supabase
    .from("profiles" as any)
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;

  if (tier === "floor") {
    // Auto-grant — webhook may have missed this user (e.g. grandfathered accounts)
    await supabase
      .rpc("grant_floor_courses", { p_user_id: userId })
      .then(({ error }) => {
        if (error) console.warn("grant_floor_courses auto-grant warn:", error.message);
      });

    return { hasAccess: true, via: "floor_tier", purchasedAt: null };
  }

  return { hasAccess: false, via: null, purchasedAt: null };
}

/**
 * Server-side helper — resolves access from a Next.js server component
 * by creating a fresh server Supabase client internally.
 * Returns null if the user is not authenticated.
 */
export async function checkCourseAccessServer(
  courseSlug: string
): Promise<CourseAccessResult & { userId: string | null }> {
  // Lazy import to keep this utility usable in non-Next environments
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { hasAccess: false, via: null, purchasedAt: null, userId: null };

  const result = await checkCourseAccess(supabase, user.id, courseSlug);
  return { ...result, userId: user.id };
}
