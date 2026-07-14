import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { awardBadge } from "@/lib/gamification";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as any,
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
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
      const purchaseType = session.metadata.purchase_type; // 'subscription' | 'course'

      // ── One-time course purchase ──────────────────────────────────────────
      if (purchaseType === 'course' && userId && session.metadata.course_id) {
        const { error: courseErr } = await supabase
          .from('course_purchases')
          .insert({
            user_id:                  userId,
            course_id:                session.metadata.course_id,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id:        session.id,
            amount_paid_pence:        session.amount_total ?? 0,
            access_granted_via:       'stripe_purchase',
          })
          .select()
          .single();
        if (courseErr && courseErr.code !== '23505') { // 23505 = unique violation (already purchased)
          console.error('Error recording course purchase:', courseErr);
        }
        break;
      }

      // ── Subscription checkout ─────────────────────────────────────────────
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
        
        if (error) {
          console.error("Error updating profile on checkout:", error);
        } else {
          if (tier === 'edge' || tier === 'floor') {
            awardBadge(userId, 'edge_unlocked').catch(err =>
              console.error("edge_unlocked badge award failed (non-fatal):", err)
            );
          }
          // Auto-grant floor-included courses
          if (tier === 'floor') {
            await supabase.rpc('grant_floor_courses', { p_user_id: userId })
              .then(({ error: rpcErr }) => {
                if (rpcErr) console.error('grant_floor_courses failed (non-fatal):', rpcErr);
              });
          }
        }
      }
      break;

    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      const subTier = subscription.metadata.tier;
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_tier: subTier,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", subscription.customer)
        .select('id')
        .single();
      
      if (updateError) {
        console.error("Error updating profile on subscription update:", updateError);
      } else if ((subTier === 'edge' || subTier === 'floor') && updatedProfile?.id) {
        awardBadge(updatedProfile.id, 'edge_unlocked').catch(err =>
          console.error("edge_unlocked badge award failed (non-fatal):", err)
        );
        // Auto-grant floor-included courses on upgrade
        if (subTier === 'floor') {
          await supabase.rpc('grant_floor_courses', { p_user_id: updatedProfile.id })
            .then(({ error: rpcErr }) => {
              if (rpcErr) console.error('grant_floor_courses upgrade failed (non-fatal):', rpcErr);
            });
        }
      }
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
