import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { getSurvivalKitConfirmationTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName = "Trader", marketingConsent = false } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanFirstName = firstName.trim();
    const supabase = createServiceRoleClient();

    // ── 1. Save or update lead in canonical newsletter_subscribers table ────────
    const { error: subError } = await supabase
      .from("newsletter_subscribers")
      .upsert({
        email: cleanEmail,
        first_name: cleanFirstName,
        source: "prop-firm-survival-kit",
        status: "active",
        locale: "uk",
        subscribed_at: new Date().toISOString(),
      }, { onConflict: "email" });

    if (subError) {
      console.error("[Survival Kit Lead] DB upsert error:", subError);
    }

    // ── 2. Add to Resend Audience if configured ───────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && process.env.RESEND_AUDIENCE_ID) {
      try {
        const resend = new Resend(resendKey);
        await resend.contacts.create({
          email: cleanEmail,
          firstName: cleanFirstName,
          audienceId: process.env.RESEND_AUDIENCE_ID,
          unsubscribed: false,
        });
      } catch (audienceErr) {
        console.warn("[Survival Kit Lead] Resend contact creation warning:", audienceErr);
      }
    }

    // ── 3. Send Survival Kit Delivery Email ────────────────────────────────────
    if (resendKey) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://avorria.com";
        const dashboardUrl = `${appUrl}/dashboard/downloads`;
        const emailHtml = getSurvivalKitConfirmationTemplate(dashboardUrl);

        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Pete @ Avorria <thewire@avorria.com>",
          to: cleanEmail,
          subject: "Your Prop Challenge Survival Kit is ready",
          html: emailHtml,
        });

        // Log to email_sends
        await supabase.from("email_sends").insert({
          type: "survival_kit_delivery",
          subject: "Your Prop Challenge Survival Kit is ready",
          content_html: emailHtml,
          recipient_count: 1,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
      } catch (emailErr) {
        console.error("[Survival Kit Lead] Delivery email send failed:", emailErr);
      }
    }

    // ── 4. Log legal acceptance / marketing consent ───────────────────────────
    try {
      await supabase.from("legal_acceptances").insert({
        document_version: "2026-v1",
        terms_accepted: true,
        privacy_acknowledged: true,
        marketing_consent: !!marketingConsent,
        consent_source: "prop_firm_survival_kit_lead",
      });
    } catch (_) {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Survival Kit delivered! Check your email for direct access.",
      redirectUrl: `/signup?email=${encodeURIComponent(cleanEmail)}&source=survival-kit`,
    });
  } catch (err: any) {
    console.error("[Survival Kit Lead API Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}
