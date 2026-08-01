import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRODUCTS: Record<string, { name: string; baseAmount: number; defaultCurrency: string; description: string }> = {
  "prop-survival-kit": {
    name: "Prop Challenge Survival Kit",
    baseAmount: 4900, // 49.00
    defaultCurrency: "gbp",
    description: "Max-Drawdown Calculator Sheet, 30-Day Evaluation Checklist & The Tilt Protocol",
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
    const { productId, includeBump = false, region } = await request.json();
    const product = PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    // Fetch survival kit course ID to link purchase
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "prop-firm-survival-kit")
      .single();
    const courseId = course?.id || "";

    const currency = (region && REGION_CURRENCIES[region]) ? REGION_CURRENCIES[region] : product.defaultCurrency;

    // Build line items — one-time product
    const lineItems = [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.baseAmount,
        },
        quantity: 1,
      },
    ];

    // Optional bump: 30-day Edge trial at £19 / $19 etc
    if (includeBump) {
      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: "30 Days Drawdown Edge Access",
            description: "Full access to AI Trade Journal, Market Scanner & Backtester",
          },
          unit_amount: 1900, // 19.00
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/store/prop-survival-kit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/prop-survival-kit?abandoned=true`,
      metadata: {
        product_id: productId,
        user_id: user?.id ?? "guest",
        userId: user?.id ?? "guest",
        purchase_type: "course",
        course_id: courseId,
        include_bump: String(includeBump),
      },
      ...(user?.email
        ? { customer_email: user.email }
        : { customer_creation: "always" }),
      allow_promotion_codes: true,
    } as any);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Store Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
