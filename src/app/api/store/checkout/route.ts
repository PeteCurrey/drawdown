import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { LEGAL_CONFIG } from "@/config/legal";

const PRODUCTS: Record<string, { name: string; baseAmount: number; defaultCurrency: string; description: string; slug: string }> = {
  "prop-survival-kit": {
    name: "Prop Challenge Survival Kit",
    baseAmount: 4900, // £49.00
    defaultCurrency: "gbp",
    description: "The complete prop firm evaluation blueprint — rule decoder, position sizing sheets & the tilt protocol.",
    slug: "prop-firm-survival-kit",
  },
  "how-to-trade": {
    name: "How to Trade",
    baseAmount: 7900, // £79.00
    defaultCurrency: "gbp",
    description: "A 100-page institutional trading framework covering market structure, sessions, execution and risk management.",
    slug: "how-to-trade",
  },
  "the-edge": {
    name: "The Edge Manual",
    baseAmount: 5900, // £59.00
    defaultCurrency: "gbp",
    description: "Pete's advanced playbook — confluence trading, liquidity theory, psychological edge and proprietary setups.",
    slug: "the-edge",
  },
  "manual-bundle": {
    name: "Complete Manual Collection (Bundle)",
    baseAmount: 12900, // £129.00
    defaultCurrency: "gbp",
    description: "Get the Prop Firm Survival Kit, How to Trade Manual, and The Edge Manual in one permanent PDF bundle.",
    slug: "manual-bundle",
  },
};

const REGION_CURRENCIES: Record<string, string> = {
  uk: "gbp",
  au: "aud",
  us: "usd",
  sg: "sgd",
  hk: "hkd",
  ca: "cad",
  de: "eur",
  ae: "aed",
  in: "inr",
  my: "myr",
  ph: "php",
};

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });

  try {
    const {
      productId,
      includeBump = false,
      bumpProductId,
      region,
      terms_accepted,
      immediate_supply_requested,
      marketing_consent,
    } = await request.json();
    const product = PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }
    if (!terms_accepted) {
      return NextResponse.json(
        { error: "You must accept the Terms and Conditions to proceed." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    // Fetch course ID for this product
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", product.slug)
      .single();
    const courseId = course?.id || "";

    const currency = (region && REGION_CURRENCIES[region]) ? REGION_CURRENCIES[region] : product.defaultCurrency;

    // Build line items — one-time product
    const lineItems: any[] = [
      {
        price_data: {
          currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.baseAmount,
        },
        quantity: 1,
      },
    ];

    // Optional order bump (another ebook at a discount)
    if (includeBump && bumpProductId && PRODUCTS[bumpProductId]) {
      const bump = PRODUCTS[bumpProductId];
      // Bump discount: 25% off
      const bumpAmount = Math.round(bump.baseAmount * 0.75);
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: `${bump.name} (Bundle Upgrade)`,
            description: bump.description,
          },
          unit_amount: bumpAmount,
        },
        quantity: 1,
      });
    } else if (includeBump && productId === 'prop-survival-kit') {
      // Legacy bump: 30 Days Edge trial
      lineItems.push({
        price_data: {
          currency,
          product_data: {
            name: "30 Days Drawdown Edge Access",
            description: "Full access to AI Trade Journal, Market Scanner & Backtester",
          },
          unit_amount: 1900,
        },
        quantity: 1,
      });
    }

    // Determine success/cancel URLs per product
    const successSlug = productId === 'prop-survival-kit' ? 'prop-survival-kit' : productId;
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/store/${successSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/${successSlug}?abandoned=true`,
      metadata: {
        product_id:                  productId,
        user_id:                     user?.id ?? "guest",
        userId:                      user?.id ?? "guest",
        purchase_type:               "course",
        course_id:                   courseId,
        include_bump:                String(includeBump),
        bump_product_id:             bumpProductId || "",
        legal_version:               LEGAL_CONFIG.documentVersion,
        terms_accepted:              "true",
        immediate_supply_requested:  immediate_supply_requested ? "true" : "false",
        marketing_consent:           marketing_consent ? "true" : "false",
      },
      ...(user?.email
        ? { customer_email: user.email }
        : { customer_creation: "always" }),
      allow_promotion_codes: true,
    } as any);

    // ── Log legal acceptance ───────────────────────────────────────────────
    if (user?.id) {
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
        consent_source:                  "store_checkout",
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Store Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
