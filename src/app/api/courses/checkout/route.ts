import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * POST /api/courses/checkout
 * Body: { courseSlug: string }
 *
 * Works for both authenticated users and guests (Stripe allows guest checkout).
 * - Authenticated + Floor tier + is_free_for_floor → grants immediately, no Stripe
 * - Authenticated + already purchased              → returns alreadyOwned
 * - Everyone else                                  → creates Stripe checkout session
 */
export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });

  const { courseSlug } = await request.json();
  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug required" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://drawdown.trading";

  // ── Optional auth (guests allowed) ───────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ── Fetch course ──────────────────────────────────────────────────────────
  const { data: course } = await supabase
    .from("courses" as any)
    .select("id, title, price_gbp, stripe_price_id, is_free_for_floor, is_published")
    .eq("slug", courseSlug)
    .single();

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (!(course as any).is_published) return NextResponse.json({ error: "Course not available" }, { status: 403 });
  if (!(course as any).stripe_price_id) {
    return NextResponse.json({ error: "Course Stripe price not configured — contact support" }, { status: 503 });
  }

  // ── Authenticated user checks ─────────────────────────────────────────────
  if (user) {
    // Already purchased?
    const { data: existing } = await supabase
      .from("course_purchases" as any)
      .select("id, access_granted_via")
      .eq("user_id", user.id)
      .eq("course_id", (course as any).id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        alreadyOwned: true,
        redirectUrl: `/dashboard/courses/${courseSlug}`,
      });
    }

    // Floor tier → grant free immediately
    const { data: profile } = await supabase
      .from("profiles" as any)
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if ((profile as any)?.subscription_tier === "floor" && (course as any).is_free_for_floor) {
      const admin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll() { return []; }, setAll() {} } }
      );
      await admin.from("course_purchases" as any).insert({
        user_id:            user.id,
        course_id:          (course as any).id,
        amount_paid_pence:  0,
        access_granted_via: "floor_tier",
      });
      return NextResponse.json({
        granted: true,
        message: "Access granted as part of your Floor subscription.",
        redirectUrl: `/dashboard/courses/${courseSlug}`,
      });
    }
  }

  // ── Create Stripe Checkout (one-time payment, works for guests) ───────────
  const session = await stripe.checkout.sessions.create({
    ...(user?.email ? { customer_email: user.email } : {}),
    line_items:          [{ price: (course as any).stripe_price_id, quantity: 1 }],
    mode:                "payment",
    allow_promotion_codes: true,
    success_url: `${origin}/courses/${courseSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${origin}/courses/${courseSlug}?purchase=cancelled`,
    metadata: {
      courseSlug,
      course_id:     (course as any).id,
      userId:        user?.id ?? "guest",
      purchase_type: "course",
    },
  });

  return NextResponse.json({ checkoutUrl: session.url });
}
