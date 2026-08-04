import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_CONFIG } from "@/config/stripe";
import { LEGAL_CONFIG } from "@/config/legal";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });

  try {
    const {
      tier,
      billingCycle = "monthly",
      region = "gbp",
      redirectPath,
      terms_accepted,
      immediate_supply_requested,
      marketing_consent,
    } = await request.json();

    if (!tier || !["foundation", "edge", "floor", "signal-centre", "investment-centre", "accelerator"].includes(tier)) {
      return NextResponse.json({ error: "Invalid plan tier specified" }, { status: 400 });
    }
    if (!terms_accepted) {
      return NextResponse.json(
        { error: "You must accept the Terms and Conditions to proceed." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve price config from Stripe config structure
    const pricesForTier = STRIPE_CONFIG.prices[tier as keyof typeof STRIPE_CONFIG.prices];
    if (!pricesForTier) {
      return NextResponse.json({ error: `Prices configuration not found for tier: ${tier}` }, { status: 400 });
    }

    let priceId: string;
    let mode: "subscription" | "payment" = "subscription";

    if (tier === "accelerator") {
      // Enforce strict seat_cap checks (blocking new checkouts if paid seats >= 15)
      const { count, error: countError } = await supabase
        .from("accelerator_enrolments")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "paid");

      if (countError) {
        console.error("Error counting active seats:", countError);
      } else if (count !== null && count >= 15) {
        return NextResponse.json(
          { error: "THE COHORT HAS REACHED SEAT CAPACITY (15/15). REGISTER TO THE WAITLIST TO SECURE THE NEXT COHORT SLOT." },
          { status: 403 }
        );
      }

      priceId = (pricesForTier as any).oneTime[region] || (pricesForTier as any).oneTime["gbp"];
      mode = "payment";
    } else {
      const cycleKey = billingCycle === "yearly" ? "annual" : "monthly";
      const pricesForCycle = pricesForTier[cycleKey as keyof typeof pricesForTier];
      if (!pricesForCycle) {
        return NextResponse.json({ error: `Price group not found for cycle: ${billingCycle}` }, { status: 400 });
      }
      priceId = (pricesForCycle as any)[region] || (pricesForCycle as any)["gbp"];
    }

    if (!priceId || priceId.includes("placeholder")) {
      return NextResponse.json({ error: `Stripe price ID is not configured for ${tier} in region ${region}` }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "https://drawdown-trading.com";
    
    // Construct dynamic success and cancel redirects
    const success_url = redirectPath 
      ? `${origin}${redirectPath}?subscription=success` 
      : `${origin}/dashboard?subscription=success`;

    const cancel_url = redirectPath 
      ? `${origin}${redirectPath}?subscription=cancelled` 
      : `${origin}/pricing?subscription=cancelled`;

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      allow_promotion_codes: mode === "payment" ? true : undefined,
      success_url,
      cancel_url,
      metadata: {
        userId:                     user.id,
        tier:                       tier,
        purchase_type:              tier === "accelerator" ? "accelerator" : "subscription",
        legal_version:              LEGAL_CONFIG.documentVersion,
        terms_accepted:             "true",
        immediate_supply_requested: immediate_supply_requested ? "true" : "false",
        marketing_consent:          marketing_consent ? "true" : "false",
      },
    });

    // ── Log legal acceptance ───────────────────────────────────────────────
    const admin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll() { return []; }, setAll() {} } }
    );
    await admin.from("legal_acceptances" as any).insert({
      user_id:                         user.id,
      document_version:                LEGAL_CONFIG.documentVersion,
      checkout_session_id:             session.id,
      terms_accepted:                  true,
      privacy_acknowledged:            true,
      immediate_supply_requested:      !!immediate_supply_requested,
      digital_content_acknowledgement: !!immediate_supply_requested,
      marketing_consent:               !!marketing_consent,
      consent_source:                  "subscription_checkout",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Direct Checkout Router Error:", err);
    return NextResponse.json({ error: err.message || "Failed to initiate Stripe session" }, { status: 500 });
  }
}
