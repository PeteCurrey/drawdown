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
    const { priceId, tier, terms_accepted, immediate_supply_requested, marketing_consent } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!terms_accepted) {
      return NextResponse.json(
        { error: "You must accept the Terms and Conditions to proceed." },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin");

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?subscription=success`,
      cancel_url: `${origin}/pricing?subscription=cancelled`,
      metadata: {
        userId: user.id,
        tier: tier,
        legal_version:              LEGAL_CONFIG.documentVersion,
        terms_accepted:             "true",
        immediate_supply_requested: immediate_supply_requested ? "true" : "false",
        marketing_consent:          marketing_consent ? "true" : "false",
      },
    });

    // Log legal acceptance
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
      consent_source:                  "legacy_subscription_checkout",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
