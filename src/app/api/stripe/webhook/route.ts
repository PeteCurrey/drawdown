import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Create a Supabase admin client to update profiles
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin access
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  const session = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed":
      const userId = session.metadata.userId;
      const tier = session.metadata.tier;
      const customerId = session.customer;

      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_tier: tier,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        
        if (error) console.error("Error updating profile on checkout:", error);
      }
      break;

    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      const subTier = subscription.metadata.tier; // Assuming tier is also in subscription metadata
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_tier: subTier,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", subscription.customer);
      
      if (updateError) console.error("Error updating profile on subscription update:", updateError);
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;
      
      const { error: deleteError } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", deletedSubscription.customer);
      
      if (deleteError) console.error("Error updating profile on subscription delete:", deleteError);
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice;
      
      await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", failedInvoice.customer);
      break;
  }

  return NextResponse.json({ received: true });
}
