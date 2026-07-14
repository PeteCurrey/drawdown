import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/courses/access?slug=deploy-your-algo
// Returns { hasAccess: boolean, grantedVia: string | null, course: {...} }
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ── Fetch course ───────────────────────────────────────────────────────────
  const { data: course, error: courseErr } = await supabase
    .from("courses" as any)
    .select("id, slug, title, subtitle, price_gbp, is_free_for_floor, is_published")
    .eq("slug", slug)
    .single();

  if (courseErr || !course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (!user) {
    return NextResponse.json({
      hasAccess:  false,
      grantedVia: null,
      course,
    });
  }

  // ── Check explicit purchase record first ────────────────────────────────────
  const { data: purchase } = await supabase
    .from("course_purchases" as any)
    .select("access_granted_via, purchased_at")
    .eq("user_id", user.id)
    .eq("course_id", (course as any).id)
    .maybeSingle();

  if (purchase) {
    return NextResponse.json({
      hasAccess:  true,
      grantedVia: (purchase as any).access_granted_via,
      purchasedAt: (purchase as any).purchased_at,
      course,
    });
  }

  // ── Check Floor tier (just-upgraded users who haven't been granted yet) ─────
  const { data: profile } = await supabase
    .from("profiles" as any)
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  if (tier === "floor" && (course as any).is_free_for_floor) {
    return NextResponse.json({
      hasAccess:  true,
      grantedVia: "floor_tier",
      course,
    });
  }

  return NextResponse.json({
    hasAccess:  false,
    grantedVia: null,
    course,
  });
}
