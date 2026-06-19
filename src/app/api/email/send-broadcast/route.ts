import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  // 1. Verify Secret Header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailSendId, type } = await req.json();

    if (!emailSendId || !type) {
      return NextResponse.json({ error: "emailSendId and type are required" }, { status: 400 });
    }

    const supabase = createInternalSupabase();
    const resendKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendKey || "re_mock_key");

    // 2. Fetch the email_sends record
    const { data: emailSend, error: fetchError } = await supabase
      .from("email_sends")
      .select("*")
      .eq("id", emailSendId)
      .single();

    if (fetchError || !emailSend) {
      throw new Error(`Email send record not found: ${fetchError?.message}`);
    }

    // 3. Query appropriate active subscribers
    const query = supabase
      .from("email_subscribers")
      .select("email, unsubscribe_token")
      .eq("is_active", true);

    if (type === "morning_brief") {
      query.eq("subscribed_morning", true);
    } else if (type === "evening_wrap") {
      query.eq("subscribed_evening", true);
    } else if (type === "weekly") {
      query.eq("subscribed_weekly", true);
    }

    const { data: subscribers, error: subsError } = await query;

    if (subsError) {
      throw new Error(`Failed to fetch subscribers: ${subsError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      // Update status to 'sent' but with 0 count
      await supabase
        .from("email_sends")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          recipient_count: 0
        })
        .eq("id", emailSendId);
      
      return NextResponse.json({ success: true, count: 0, message: "No active subscribers for this category." });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
    let recipientCount = subscribers.length;
    let status = "sent";
    let errorMessage = null;
    let sentIds = [];

    // 4. Send via Resend (using standard batch API for unique unsubscribe tokens)
    if (resendKey) {
      try {
        // Chunk subscribers to respect Resend's 100 contacts per batch limit
        const chunkSize = 100;
        for (let i = 0; i < subscribers.length; i += chunkSize) {
          const chunk = subscribers.slice(i, i + chunkSize);
          const batchPayload = chunk.map(sub => {
            const unsubLink = `${appUrl}/unsubscribe?token=${sub.unsubscribe_token}`;
            const customizedHtml = emailSend.content_html.replace(/\{\{unsubscribeUrl\}\}/g, unsubLink);

            return {
              from: "Pete @ Drawdown <thewire@drawdown.trading>",
              to: sub.email,
              subject: emailSend.subject,
              html: customizedHtml,
              headers: {
                "List-Unsubscribe": `<${unsubLink}>`
              }
            };
          });

          const batchRes = await resend.batch.send(batchPayload);
          if (batchRes.error) {
            console.error("Batch dispatch error in chunk:", batchRes.error);
            status = "failed";
            errorMessage = batchRes.error.message;
          } else if (batchRes.data?.data) {
            sentIds.push(...batchRes.data.data.map(d => d.id));
          }
        }
      } catch (sendErr: any) {
        console.error("Resend API failed:", sendErr);
        status = "failed";
        errorMessage = sendErr.message;
      }
    } else {
      console.log(`[DEV MODE] Batch sending ${recipientCount} emails for ${type}`);
    }

    // 5. Update email_sends record
    await supabase
      .from("email_sends")
      .update({
        status: status,
        sent_at: new Date().toISOString(),
        recipient_count: recipientCount,
        resend_broadcast_id: sentIds.length > 0 ? sentIds.join(",") : null,
        error_message: errorMessage
      })
      .eq("id", emailSendId);

    return NextResponse.json({
      success: status === "sent",
      recipient_count: recipientCount,
      status,
      error: errorMessage
    });

  } catch (err: any) {
    console.error("Send broadcast route exception:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
