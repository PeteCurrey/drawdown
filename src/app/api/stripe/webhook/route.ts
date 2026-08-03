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
      break;
    }
  }

  return NextResponse.json({ received: true });
}
