import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { awardBadge } from "@/lib/gamification";
import { Resend } from "resend";
import { getSurvivalKitConfirmationTemplate } from "@/lib/email-templates";

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
      const userId = session.metadata.userId || session.metadata.user_id;
      const tier = session.metadata.tier;
      const customerId = session.customer;
      const purchaseType = session.metadata.purchase_type; // 'subscription' | 'course'
      const productId = session.metadata.product_id;

      // ── Prop Survival Kit Store Purchase ──────────────────────────────────
      if (productId === 'prop-survival-kit') {
        const email = session.customer_details?.email || session.customer_email;
        let resolvedUserId = userId && userId !== 'guest' ? userId : null;
        let tempPassword = "";

        if (!resolvedUserId && email) {
          // Check if user already exists
          const { data: usersData } = await supabase.auth.admin.listUsers();
          const existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
          if (existingUser) {
            resolvedUserId = existingUser.id;
          } else {
            // Create user account for guest
            tempPassword = Math.random().toString(36).substring(2, 10);
            const fullName = session.customer_details?.name || email.split("@")[0];
            const { data: createData, error: createError } = await supabase.auth.admin.createUser({
              email,
              password: tempPassword,
              email_confirm: true,
              user_metadata: {
                full_name: fullName,
                subscription_tier: "free",
                role: "student",
              }
            });
            if (createData?.user) {
              resolvedUserId = createData.user.id;
              await supabase.from("profiles").upsert({
                id: resolvedUserId,
                display_name: fullName,
                full_name: fullName,
                subscription_tier: "free",
                subscription_status: "inactive",
                role: "student",
                updated_at: new Date().toISOString()
              });
            } else {
              console.error("Failed to create guest user in webhook:", createError);
            }
          }
        }

        // Record course purchase in course_purchases
        let courseId = session.metadata.course_id;
        if (!courseId) {
          const { data: course } = await supabase
            .from("courses")
            .select("id")
            .eq("slug", "prop-firm-survival-kit")
            .single();
          courseId = course?.id;
        }

        if (resolvedUserId && courseId) {
          const { error: courseErr } = await supabase
            .from('course_purchases')
            .insert({
              user_id:                  resolvedUserId,
              course_id:                courseId,
              stripe_payment_intent_id: session.payment_intent,
              stripe_session_id:        session.id,
              amount_paid_pence:        session.amount_total ?? 4900,
              access_granted_via:       'stripe_purchase',
            });
          if (courseErr && courseErr.code !== '23505') {
            console.error('Error recording survival kit purchase:', courseErr);
          }
        }

        // Send PDF download email via Resend
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && email) {
          try {
            // Generate a signed URL for the PDF (from Supabase Bucket)
            let pdfDownloadUrl = "";
            const bucketName = process.env.SUPABASE_SURVIVAL_KIT_BUCKET || "store";
            const filePath = process.env.SUPABASE_SURVIVAL_KIT_PATH || "survival-kit/prop-challenge-survival-kit.pdf";
            
            const { data: signedData } = await supabase
              .storage
              .from(bucketName)
              .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry
            
            if (signedData?.signedUrl) {
              pdfDownloadUrl = signedData.signedUrl;
            } else {
              const { data: publicUrlData } = supabase
                .storage
                .from(bucketName)
                .getPublicUrl(filePath);
              pdfDownloadUrl = publicUrlData?.publicUrl || "";
            }

            const emailHtml = getSurvivalKitConfirmationTemplate(pdfDownloadUrl, tempPassword || undefined);
            
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: email,
              subject: "Your Prop Challenge Survival Kit is ready for download",
              html: emailHtml
            });

            // Log the send in email_sends
            await supabase.from("email_sends").insert({
              type: "survival_kit_delivery",
              subject: "Your Prop Challenge Survival Kit is ready for download",
              content_html: emailHtml,
              recipient_count: 1,
              status: "sent",
              sent_at: new Date().toISOString()
            });

          } catch (emailErr) {
            console.error("Failed to send survival kit delivery email:", emailErr);
          }
        }

        break;
      }

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
        const { data: upsertData, error } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            stripe_customer_id: customerId,
            subscription_tier: tier,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .select('id');
        
        if (error) {
          console.error("Error upserting profile on checkout:", error);
        } else if (!upsertData || upsertData.length === 0) {
          console.error(`Error: Upsert affected zero rows for userId: ${userId} during checkout.session.completed`);
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
      
      const { data: updatedProfiles, error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_tier: subTier,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", subscription.customer)
        .select('id');
      
      if (updateError) {
        console.error("Error updating profile on subscription update:", updateError);
      } else if (!updatedProfiles || updatedProfiles.length === 0) {
        console.error(`Error: subscription update affected zero rows for stripe customer: ${subscription.customer}`);
      } else {
        const updatedProfile = updatedProfiles[0];
        if ((subTier === 'edge' || subTier === 'floor') && updatedProfile?.id) {
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
      }
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;
      
      const { data: deletedProfiles, error: deleteError } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", deletedSubscription.customer)
        .select('id');
      
      if (deleteError) {
        console.error("Error updating profile on subscription delete:", deleteError);
      } else if (!deletedProfiles || deletedProfiles.length === 0) {
        console.error(`Error: subscription delete affected zero rows for stripe customer: ${deletedSubscription.customer}`);
      }
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice;
      
      const { data: failedProfiles, error: failError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", failedInvoice.customer)
        .select('id');

      if (failError) {
        console.error("Error updating profile on payment failed:", failError);
      } else if (!failedProfiles || failedProfiles.length === 0) {
        console.error(`Error: payment failed update affected zero rows for stripe customer: ${failedInvoice.customer}`);
      }
      break;
  }

  return NextResponse.json({ received: true });
}
