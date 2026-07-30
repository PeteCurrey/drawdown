import { NextRequest, NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  // 1. Verify Secret Header / Cron Auth
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`) || process.env.NODE_ENV === "development";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { emailSendId, type, contentHtml: directHtml, contentText: directText, subject: directSubject } = body;

    if ((!emailSendId && !directHtml) || !type) {
      return NextResponse.json({ error: "emailSendId or contentHtml, plus type are required" }, { status: 400 });
    }

    const supabase = createInternalSupabase();
    const resendKey = process.env.RESEND_API_KEY;
    const resend = new Resend(resendKey || "re_mock_key");

    let subject = directSubject || "Drawdown Trading Update";
    let contentHtml = directHtml || "";
    let contentText = directText || "";

    // 2. Fetch the email_sends record if available
    if (emailSendId) {
      try {
        const { data: emailSend } = await supabase
          .from("email_sends")
          .select("*")
          .eq("id", emailSendId)
          .maybeSingle();

        if (emailSend) {
          subject = emailSend.subject || subject;
          contentHtml = emailSend.content_html || contentHtml;
          contentText = emailSend.content_text || contentText;
        }
      } catch (err) {
        console.warn("[send-broadcast] email_sends fetch ignored:", err);
      }
    }

    if (!contentHtml) {
      return NextResponse.json({ error: "No email content found to broadcast" }, { status: 400 });
    }

    // 3. Multi-source subscriber aggregation (newsletter_subscribers, profiles, email_subscribers)
    const subscriberMap = new Map<string, { email: string; unsubscribe_token: string }>();

    // Source A: newsletter_subscribers
    try {
      const { data: ns } = await supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("is_active", true);
      
      if (ns) {
        ns.forEach(s => {
          if (s.email && !subscriberMap.has(s.email)) {
            subscriberMap.set(s.email, { email: s.email, unsubscribe_token: Buffer.from(s.email).toString("hex") });
          }
        });
      }
    } catch (e) {
      console.warn("[send-broadcast] newsletter_subscribers query skipped:", e);
    }

    // Source B: profiles (all registered users)
    try {
      const { data: pr } = await supabase
        .from("profiles")
        .select("email")
        .not("email", "is", null);
      
      if (pr) {
        pr.forEach(p => {
          if (p.email && !subscriberMap.has(p.email)) {
            subscriberMap.set(p.email, { email: p.email, unsubscribe_token: Buffer.from(p.email).toString("hex") });
          }
        });
      }
    } catch (e) {
      console.warn("[send-broadcast] profiles query skipped:", e);
    }

    // Source C: email_subscribers (if table exists)
    try {
      const { data: es } = await supabase
        .from("email_subscribers")
        .select("email, unsubscribe_token")
        .eq("is_active", true);
      
      if (es) {
        es.forEach(s => {
          if (s.email) {
            subscriberMap.set(s.email, { email: s.email, unsubscribe_token: s.unsubscribe_token || Buffer.from(s.email).toString("hex") });
          }
        });
      }
    } catch (e) {
      // Table may not exist, ignore error
    }

    const subscribers = Array.from(subscriberMap.values());

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No active subscribers found." });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://drawdown.trading";
    let recipientCount = subscribers.length;
    let status = "sent";
    let errorMessage = null;
    let sentIds: string[] = [];

    // 4. Send via Resend with fallback from address support
    if (resendKey) {
      const primaryFrom = process.env.RESEND_FROM_EMAIL || "Pete @ Drawdown <thewire@drawdown.trading>";
      const fallbackFrom = "Drawdown Trading <onboarding@resend.dev>";

      try {
        const chunkSize = 100;
        for (let i = 0; i < subscribers.length; i += chunkSize) {
          const chunk = subscribers.slice(i, i + chunkSize);
          const buildPayload = (fromAddr: string) => chunk.map(sub => {
            const unsubLink = `${appUrl}/unsubscribe?token=${sub.unsubscribe_token}`;
            const customizedHtml = contentHtml.replace(/\{\{unsubscribeUrl\}\}/g, unsubLink);

            return {
              from: fromAddr,
              to: sub.email,
              subject: subject,
              html: customizedHtml,
              headers: {
                "List-Unsubscribe": `<${unsubLink}>`
              }
            };
          });

          let batchRes = await resend.batch.send(buildPayload(primaryFrom));
          
          // Fallback to verified testing sender if custom domain fails verification
          if (batchRes.error && batchRes.error.name === "validation_error" && primaryFrom !== fallbackFrom) {
            console.warn(`[send-broadcast] Primary domain sending failed (${batchRes.error.message}). Retrying with fallback sender...`);
            batchRes = await resend.batch.send(buildPayload(fallbackFrom));
          }

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

    // 5. Update email_sends record if DB table exists
    if (emailSendId) {
      try {
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
      } catch (err) {
        console.warn("[send-broadcast] email_sends update skipped:", err);
      }
    }

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
