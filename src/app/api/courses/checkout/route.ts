import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });

  try {
    const { courseSlug } = await request.json();

    if (!courseSlug) {
      return NextResponse.json({ error: "courseSlug required" }, { status: 400 });
    }

    // ── Auth check ────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Fetch course from DB ───────────────────────────────────────────────────
    const { data: course, error: courseErr } = await supabase
      .from("courses" as any)
      .select("id, title, price_gbp, stripe_price_id, is_free_for_floor, is_published")
      .eq("slug", courseSlug)
      .single();

    if (courseErr || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!(course as any).is_published) {
      return NextResponse.json({ error: "Course not available" }, { status: 403 });
    }

    if (!(course as any).stripe_price_id) {
      return NextResponse.json(
        { error: "Course Stripe price not configured — contact support" },
        { status: 503 }
      );
    }

    // ── Check if user already has access ──────────────────────────────────────
    const { data: existingPurchase } = await supabase
      .from("course_purchases" as any)
      .select("id, access_granted_via")
      .eq("user_id", user.id)
      .eq("course_id", (course as any).id)
      .maybeSingle();

    if (existingPurchase) {
      return NextResponse.json(
        { error: "already_purchased", message: "You already have access to this course." },
        { status: 409 }
      );
    }

    // ── Check Floor tier — grant for free ─────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles" as any)
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const tier = (profile as any)?.subscription_tier as string | undefined;
    if (tier === "floor" && (course as any).is_free_for_floor) {
      // Grant immediately without Stripe
      const internal = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll() { return []; }, setAll() {} } }
      );
      await internal.from("course_purchases" as any).insert({
        user_id:            user.id,
        course_id:          (course as any).id,
        amount_paid_pence:  0,
        access_granted_via: "floor_tier",
      });
      return NextResponse.json({
        granted: true,
        message: "Access granted as part of your Floor subscription.",
        redirect: `/dashboard/courses/${courseSlug}`,
      });
    }

    // ── Create Stripe Checkout session (one-time payment) ─────────────────────
    const origin = request.headers.get("origin") ?? "https://drawdown.trading";

    const session = await stripe.checkout.sessions.create({
      customer_email:     user.email,
      line_items:         [{ price: (course as any).stripe_price_id, quantity: 1 }],
      mode:               "payment",
      payment_intent_data: { metadata: { userId: user.id, courseSlug } },
      success_url:        `${origin}/dashboard/courses/${courseSlug}?purchase=success`,
      cancel_url:         `${origin}/courses/${courseSlug}?purchase=cancelled`,
      metadata: {
        userId:        user.id,
        course_id:     (course as any).id,
        purchase_type: "course",
        courseSlug,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Course Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
