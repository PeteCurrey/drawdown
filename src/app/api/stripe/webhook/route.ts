import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { awardBadge } from "@/lib/gamification";
import { Resend } from "resend";
import {
  getSurvivalKitConfirmationTemplate,
  getHowToTradeConfirmationTemplate,
  getTheEdgeConfirmationTemplate,
} from "@/lib/email-templates";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  sendSubscriptionWelcomeEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
} from "@/lib/legal-emails";

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

  const supabase = createServiceRoleClient();

  const session = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.metadata.userId || session.metadata.user_id;
      const tier = session.metadata.tier;
      const customerId = session.customer;
      const purchaseType = session.metadata.purchase_type;
      const productId = session.metadata.product_id;

      // ── Helper: resolve or create a user for guest purchases ────────────────
      async function resolveOrCreateGuestUser(
        email: string,
        fullName: string
      ): Promise<{ userId: string | null; isNewUser: boolean }> {
        // Attempt to create the user first. If they already exist, Supabase
        // returns a 422 / "already registered" error — we then look them up.
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            subscription_tier: "free",
            role: "student",
          },
        });

        if (createData?.user) {
          // Brand-new user — fall through to profile upsert below.
          const newUserId = createData.user.id;
          await supabase.from("profiles").upsert({
            id: newUserId,
            display_name: fullName,
            full_name: fullName,
            subscription_tier: "free",
            subscription_status: "inactive",
            role: "student",
            updated_at: new Date().toISOString(),
          });
          return { userId: newUserId, isNewUser: true };
        }

        // If the error indicates the user already exists, find them via listUsers.
        const alreadyExists =
          createError?.status === 422 ||
          createError?.message?.toLowerCase().includes("already") ||
          createError?.message?.toLowerCase().includes("registered");

        if (alreadyExists) {
          const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
          const found = listData?.users?.find((u) => u.email === email);
          return { userId: found?.id ?? null, isNewUser: false };
        }

        console.error("Failed to create/resolve guest user in webhook:", createError);
        return { userId: null, isNewUser: false };
      }

      // ── Helper: generate a magic-link for a user ──────────────────────────
      async function getMagicLink(email: string): Promise<string> {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";
        try {
          const { data } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email,
            options: { redirectTo: `${appUrl}/dashboard` },
          });
          return data?.properties?.action_link || `${appUrl}/login`;
        } catch {
          return `${appUrl}/login`;
        }
      }

      // ── Prop Survival Kit Store Purchase ─────────────────────────────────
      if (productId === "prop-survival-kit") {
        const email = session.customer_details?.email || session.customer_email;
        let resolvedUserId = userId && userId !== "guest" ? userId : null;
        let isNewUser = false;

        if (!resolvedUserId && email) {
          const fullName = session.customer_details?.name || email.split("@")[0];
          const result = await resolveOrCreateGuestUser(email, fullName);
          resolvedUserId = result.userId;
          isNewUser = result.isNewUser;
        }

        // Record course purchase
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
          const { error: courseErr } = await supabase.from("course_purchases").insert({
            user_id: resolvedUserId,
            course_id: courseId,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id: session.id,
            amount_paid_pence: session.amount_total ?? 4900,
            access_granted_via: "stripe_purchase",
          });
          if (courseErr && courseErr.code !== "23505") {
            console.error("Error recording survival kit purchase:", courseErr);
          }
        }

        // Send confirmation email with magic link — never a password or direct PDF URL
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && email) {
          try {
            // §1.5: Direct download link replaced by dashboard access
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";
            const dashboardUrl = `${appUrl}/dashboard/store`;
            const magicLink = isNewUser ? await getMagicLink(email) : null;

            const emailHtml = getSurvivalKitConfirmationTemplate(dashboardUrl, undefined, magicLink ?? undefined);

            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: email,
              subject: "Your Prop Challenge Survival Kit is ready",
              html: emailHtml,
            });

            await supabase.from("email_sends").insert({
              type: "survival_kit_delivery",
              subject: "Your Prop Challenge Survival Kit is ready",
              content_html: emailHtml,
              recipient_count: 1,
              status: "sent",
              sent_at: new Date().toISOString(),
            });
          } catch (emailErr) {
            console.error("Failed to send survival kit delivery email:", emailErr);
          }
        }

        break;
      }

      // ── How to Trade ebook purchase ──────────────────────────────────────
      if (productId === "how-to-trade") {
        const email = session.customer_details?.email || session.customer_email;
        let resolvedUserId = userId && userId !== "guest" ? userId : null;
        let isNewUser = false;

        if (!resolvedUserId && email) {
          const fullName = session.customer_details?.name || email.split("@")[0];
          const result = await resolveOrCreateGuestUser(email, fullName);
          resolvedUserId = result.userId;
          isNewUser = result.isNewUser;
        }

        let courseId = session.metadata.course_id;
        if (!courseId) {
          const { data: course } = await supabase.from("courses").select("id").eq("slug", "how-to-trade").single();
          courseId = course?.id;
        }
        if (resolvedUserId && courseId) {
          const { error: courseErr } = await supabase.from("course_purchases").insert({
            user_id: resolvedUserId,
            course_id: courseId,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id: session.id,
            amount_paid_pence: session.amount_total ?? 7900,
            access_granted_via: "stripe_purchase",
          });
          if (courseErr && courseErr.code !== "23505") console.error("Error recording how-to-trade purchase:", courseErr);
        }

        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && email) {
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";
            const dashboardUrl = `${appUrl}/dashboard/store`;
            const magicLink = isNewUser ? await getMagicLink(email) : null;

            const emailHtml = getHowToTradeConfirmationTemplate(dashboardUrl, undefined, magicLink ?? undefined);
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: email,
              subject: "Your How to Trade guide is ready",
              html: emailHtml,
            });
          } catch (emailErr) {
            console.error("Failed to send how-to-trade delivery email:", emailErr);
          }
        }
        break;
      }

      // ── The Edge ebook purchase ──────────────────────────────────────────
      if (productId === "the-edge") {
        const email = session.customer_details?.email || session.customer_email;
        let resolvedUserId = userId && userId !== "guest" ? userId : null;
        let isNewUser = false;

        if (!resolvedUserId && email) {
          const fullName = session.customer_details?.name || email.split("@")[0];
          const result = await resolveOrCreateGuestUser(email, fullName);
          resolvedUserId = result.userId;
          isNewUser = result.isNewUser;
        }

        let courseId = session.metadata.course_id;
        if (!courseId) {
          const { data: course } = await supabase.from("courses").select("id").eq("slug", "the-edge").single();
          courseId = course?.id;
        }
        if (resolvedUserId && courseId) {
          const { error: courseErr } = await supabase.from("course_purchases").insert({
            user_id: resolvedUserId,
            course_id: courseId,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id: session.id,
            amount_paid_pence: session.amount_total ?? 5900,
            access_granted_via: "stripe_purchase",
          });
          if (courseErr && courseErr.code !== "23505") console.error("Error recording the-edge purchase:", courseErr);
        }

        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && email) {
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";
            const dashboardUrl = `${appUrl}/dashboard/store`;
            const magicLink = isNewUser ? await getMagicLink(email) : null;

            const emailHtml = getTheEdgeConfirmationTemplate(dashboardUrl, undefined, magicLink ?? undefined);
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: email,
              subject: "Your Edge Manual is ready",
              html: emailHtml,
            });
          } catch (emailErr) {
            console.error("Failed to send the-edge delivery email:", emailErr);
          }
        }
        break;
      }

      // ── One-time course purchase ─────────────────────────────────────────
      if (purchaseType === "course" && userId && session.metadata.course_id) {
        const { error: courseErr } = await supabase
          .from("course_purchases")
          .insert({
            user_id: userId,
            course_id: session.metadata.course_id,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id: session.id,
            amount_paid_pence: session.amount_total ?? 0,
            access_granted_via: "stripe_purchase",
          })
          .select()
          .single();
        if (courseErr && courseErr.code !== "23505") {
          console.error("Error recording course purchase:", courseErr);
        }
        break;
      }

      // ── High-Ticket Institutional Accelerator Purchase ───────────────────
      if (purchaseType === "accelerator" && userId) {
        let courseId = session.metadata.course_id;
        if (!courseId) {
          const { data: course } = await supabase
            .from("courses")
            .select("id")
            .eq("slug", "institutional-accelerator")
            .single();
          courseId = course?.id;
        }

        if (courseId) {
          const { error: courseErr } = await supabase.from("course_purchases").insert({
            user_id: userId,
            course_id: courseId,
            stripe_payment_intent_id: session.payment_intent,
            stripe_session_id: session.id,
            amount_paid_pence: session.amount_total ?? 150000,
            access_granted_via: "stripe_purchase",
          });
          if (courseErr && courseErr.code !== "23505") {
            console.error("Error recording accelerator cohort purchase:", courseErr);
          }
        }

        // Send a custom high-end enrollment confirmation email
        const resendKey = process.env.RESEND_API_KEY;
        const email = session.customer_details?.email || session.customer_email;
        if (resendKey && email) {
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://drawdown.trading";
            const dashboardUrl = `${appUrl}/dashboard/curriculum`;
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: email,
              subject: "Welcome to the Institutional Accelerator Cohort",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0B0E12; color: #ffffff; border: 1px solid #E2B755;">
                  <h1 style="color: #E2B755; text-align: center; font-size: 24px; text-transform: uppercase; tracking-wider; margin-top: 0;">Enrolment Confirmed</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #D1D5DB; margin-top: 30px;">
                    Thank you for enrolling in the <strong>Drawdown Institutional Accelerator</strong>.
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #D1D5DB;">
                    Your premium 6-week Live Cohort access is now active. We are excited to guide you through the process of building an institutional edge, passing prop firm challenges, and optimizing your UK corporate structures.
                  </p>
                  <div style="background-color: #111317; border: 1px solid #333330; padding: 25px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="color: #ffffff; margin-top: 0; font-size: 16px;">Next Steps:</h3>
                    <ul style="color: #9CA3AF; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                      <li>Review the curriculum on your student dashboard.</li>
                      <li>Read and accept the <a href="${appUrl}/legal/accelerator-agreement" style="color: #E2B755; text-decoration: none;">Accelerator Cohort Agreement</a>.</li>
                      <li>Check your dashboard events page for live webinar schedules.</li>
                    </ul>
                  </div>
                  <div style="text-align: center; margin-top: 40px;">
                    <a href="${dashboardUrl}" style="background-color: #E2B755; color: #000000; padding: 15px 35px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">Access Student Dashboard</a>
                  </div>
                  <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 40px;">
                    Drawdown Trading Ltd. Educational use only. Non-advisory compliance.
                  </p>
                </div>
              `,
            });
          } catch (emailErr) {
            console.error("Failed to send accelerator welcome email:", emailErr);
          }
        }
        break;
      }

      // ── Subscription checkout ────────────────────────────────────────────
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
          .select("id");

        if (error) {
          console.error("Error upserting profile on checkout:", error);
        } else if (!upsertData || upsertData.length === 0) {
          console.error(`Error: Upsert affected zero rows for userId: ${userId}`);
        } else {
          if (tier === "edge" || tier === "floor") {
            awardBadge(userId, "edge_unlocked").catch((err) =>
              console.error("edge_unlocked badge award failed (non-fatal):", err)
            );
          }
          if (tier === "floor") {
            await supabase
              .rpc("grant_floor_courses", { p_user_id: userId })
              .then(({ error: rpcErr }) => {
                if (rpcErr) console.error("grant_floor_courses failed (non-fatal):", rpcErr);
              });
          }

          // Send welcome legal email
          const resendKey = process.env.RESEND_API_KEY;
          const email = session.customer_details?.email || session.customer_email;
          if (resendKey && email && tier) {
            try {
              const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : "";
              const currency = session.currency ? session.currency.toUpperCase() : "GBP";
              const symbol = currency === "GBP" ? "£" : currency + " ";
              const priceString = amountTotal ? `${symbol}${amountTotal}/mo` : "Subscription Price";
              
              const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
              const immediateSupplyConsented = session.metadata.immediate_supply_requested === "true";

              await sendSubscriptionWelcomeEmail({
                resendKey,
                toEmail: email,
                tierLabel,
                priceString,
                immediateSupplyConsented,
              });
              console.log(`Sent legal welcome email for tier ${tier} to ${email}`);
            } catch (emailErr) {
              console.error("Failed to send welcome legal email:", emailErr);
            }
          }
        }
      }
      break;
    }

    case "customer.subscription.updated": {
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
        .select("id");

      if (updateError) {
        console.error("Error updating profile on subscription update:", updateError);
      } else if (!updatedProfiles || updatedProfiles.length === 0) {
        console.error(`Error: subscription update affected zero rows for customer: ${subscription.customer}`);
      } else {
        const updatedProfile = updatedProfiles[0];
        if ((subTier === "edge" || subTier === "floor") && updatedProfile?.id) {
          awardBadge(updatedProfile.id, "edge_unlocked").catch((err) =>
            console.error("edge_unlocked badge award failed (non-fatal):", err)
          );
          if (subTier === "floor") {
            await supabase
              .rpc("grant_floor_courses", { p_user_id: updatedProfile.id })
              .then(({ error: rpcErr }) => {
                if (rpcErr) console.error("grant_floor_courses upgrade failed (non-fatal):", rpcErr);
              });
          }
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const deletedSubscription = event.data.object as Stripe.Subscription;

      const { data: deletedProfiles, error: deleteError } = await supabase
        .from("profiles")
        .update({
          subscription_tier: "free",
          subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", deletedSubscription.customer)
        .select("id");

      if (deleteError) {
        console.error("Error updating profile on subscription delete:", deleteError);
      } else if (!deletedProfiles || deletedProfiles.length === 0) {
        console.error(`Error: subscription delete affected zero rows for customer: ${deletedSubscription.customer}`);
      }

      // Send cancellation email
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          const stripeCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
          const customerEmail = (stripeCustomer as Stripe.Customer).email;
          if (customerEmail) {
            const subTier = deletedSubscription.metadata?.tier || "membership";
            const tierLabel = subTier.charAt(0).toUpperCase() + subTier.slice(1);
            const accessUntil = new Date(deletedSubscription.current_period_end * 1000).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            await sendSubscriptionCancelledEmail({
              resendKey,
              toEmail: customerEmail,
              tierLabel,
              accessUntil,
            });
            console.log(`Sent cancellation confirmation email to ${customerEmail}`);
          }
        } catch (emailErr) {
          console.error("Failed to send subscription deleted email:", emailErr);
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const failedInvoice = event.data.object as Stripe.Invoice;

      const { data: failedProfiles, error: failError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", failedInvoice.customer)
        .select("id");

      if (failError) {
        console.error("Error updating profile on payment failed:", failError);
      } else if (!failedProfiles || failedProfiles.length === 0) {
        console.error(`Error: payment failed update affected zero rows for customer: ${failedInvoice.customer}`);
      }

      // Send payment failed email
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          const customerEmail = failedInvoice.customer_email || failedInvoice.customer_details?.email;
          if (customerEmail) {
            // Find subscription tier
            let subTier = "membership";
            if (failedInvoice.subscription) {
              const stripeSub = await stripe.subscriptions.retrieve(failedInvoice.subscription as string);
              subTier = stripeSub.metadata?.tier || "membership";
            }
            const tierLabel = subTier.charAt(0).toUpperCase() + subTier.slice(1);
            const amountTotal = failedInvoice.amount_due ? (failedInvoice.amount_due / 100).toFixed(2) : "";
            const currency = failedInvoice.currency ? failedInvoice.currency.toUpperCase() : "GBP";
            const symbol = currency === "GBP" ? "£" : currency + " ";
            const amountString = amountTotal ? `${symbol}${amountTotal}` : "Subscription Fee";

            await sendPaymentFailedEmail({
              resendKey,
              toEmail: customerEmail,
              tierLabel,
              amountString,
            });
            console.log(`Sent payment failed email to ${customerEmail}`);
          }
        } catch (emailErr) {
          console.error("Failed to send payment failed email:", emailErr);
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
