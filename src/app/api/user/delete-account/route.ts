import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { Resend } from "resend";
import { LEGAL_CONFIG } from "@/config/legal";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { confirmationText } = await request.json();

    if (confirmationText !== "DELETE MY ACCOUNT") {
      return NextResponse.json({ error: "Confirmation text mismatch. Please enter 'DELETE MY ACCOUNT'." }, { status: 400 });
    }

    // Get profile to check Stripe customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", user.id)
      .single();

    // Cancel Stripe subscription if active
    if (profile?.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any });
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      } catch (stripeErr) {
        console.warn("Stripe cancellation warning during deletion:", stripeErr);
      }
    }

    // Purge user trade entries
    await supabase.from("trade_entries").delete().eq("user_id", user.id);

    // Update profile to deleted state / anonymise
    await supabase.from("profiles").update({
      full_name: "Deleted User",
      avatar_url: null,
      tier: "free",
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    // Send confirmation email via Resend if configured
    if (process.env.RESEND_API_KEY && user.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Drawdown <support@drawdown.trading>",
          to: [user.email],
          subject: "Account Deletion Confirmation — Drawdown",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
              <h2 style="color: #0f172a;">Account Deletion Request Processed</h2>
              <p>Hello,</p>
              <p>Your Drawdown account and associated operational data have been successfully purged as requested.</p>
              <p>If you had an active subscription, it has been cancelled and will not renew.</p>
              <p>If you believe this request was processed in error, please contact us immediately at <a href="mailto:${LEGAL_CONFIG.privacyEmail}">${LEGAL_CONFIG.privacyEmail}</a>.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b;">${LEGAL_CONFIG.fullTradingEntity} · ${LEGAL_CONFIG.tradingAddress}</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("Deletion notification email warning:", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete account", details: error.message }, { status: 500 });
  }
}
