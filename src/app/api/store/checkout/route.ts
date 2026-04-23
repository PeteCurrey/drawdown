import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PRODUCTS: Record<string, { name: string; amount: number; currency: string; description: string }> = {
  "prop-survival-kit": {
    name: "Prop Challenge Survival Kit",
    amount: 1400, // £14.00 in pence
    currency: "gbp",
    description: "Max-Drawdown Calculator Sheet, 30-Day Evaluation Checklist & The Tilt Protocol",
  },
};

const BUMP_PRODUCTS: Record<string, { price_id_env: string; name: string }> = {
  "edge-30day": {
    price_id_env: "STRIPE_PRICE_EDGE_MONTHLY_GBP",
    name: "30 Days Drawdown Edge Access",
  },
};

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });

  try {
    const { productId, includeBump = false } = await request.json();
    const product = PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    // Build line items — one-time product
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.amount,
        },
        quantity: 1,
      },
    ];

    // Optional bump: 30-day Edge trial at £19
    if (includeBump) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "30 Days Drawdown Edge Access",
            description: "Full access to AI Trade Journal, Market Scanner & Backtester",
          },
          unit_amount: 1900, // £19
        },
        quantity: 1,
      });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/store/prop-survival-kit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/prop-survival-kit?abandoned=true`,
      metadata: {
        product_id: productId,
        user_id: user?.id ?? "guest",
        include_bump: String(includeBump),
      },
      // Collect email if guest
      ...(user?.email
        ? { customer_email: user.email }
        : { customer_creation: "always" }),
      // Allow promotion codes
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Store Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
