import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getWelcomeTemplate } from "@/lib/email-templates";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  // 1. Verify Secret Header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, userId, firstName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createInternalSupabase();
    const resendKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendKey || "re_mock_key");

    // 2. Add to Supabase newsletter_subscribers
    const { data: subscriber, error: subError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          user_id: userId || null,
          first_name: firstName || "Trader",
          source: "signup",
          confirmed: true
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (subError) {
      console.error("Database insert subscriber error:", subError);
      throw subError;
    }

    // 3. Sync to Resend Contacts (optional but recommended)
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    let resendContactId = null;
    if (resendKey && audienceId) {
      try {
        const contactRes = await resend.contacts.create({
          email: email,
          firstName: firstName || "Trader",
          unsubscribed: false,
          audienceId: audienceId
        });
        if (contactRes.data) {
          resendContactId = contactRes.data.id;
          // Update subscriber in DB with resendContactId
          await supabase
            .from("newsletter_subscribers")
            .update({ resend_contact_id: resendContactId })
            .eq("id", subscriber.id);
        }
      } catch (resendContactErr) {
        console.error("Resend Contacts Sync failed:", resendContactErr);
      }
    }

    // 4. Send Welcome Email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    const welcomeHtml = getWelcomeTemplate(unsubscribeUrl);

    let resendMessageId = null;
    let status = "sent";
    let errorMessage = null;

    if (resendKey) {
      try {
        const emailRes = await resend.emails.send({
          from: "Pete @ Drawdown <thewire@drawdown.trading>",
          to: email,
          subject: "Welcome to The Wire — your market intelligence starts now",
          html: welcomeHtml
        });
        if (emailRes.error) {
          console.error("Resend send failed:", emailRes.error);
          status = "failed";
          errorMessage = emailRes.error.message;
        } else {
          resendMessageId = emailRes.data?.id || null;
        }
      } catch (sendErr: any) {
        console.error("Error calling Resend API:", sendErr);
        status = "failed";
        errorMessage = sendErr.message;
      }
    } else {
      console.log(`[DEV MODE] Welcome email to ${email} (mock sent)`);
    }

    // 5. Log the Send
    await supabase.from("email_sends").insert({
      type: "welcome",
      subject: "Welcome to The Wire — your market intelligence starts now",
      content_html: welcomeHtml,
      recipient_count: 1,
      resend_broadcast_id: resendMessageId,
      status: status,
      error_message: errorMessage,
      sent_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, subscriberId: subscriber.id, status });

  } catch (err: any) {
    console.error("Welcome route handler exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
