import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const supabase = await createClient();

  // Note: In a real production app, verify the Resend webhook signature here
  // using process.env.RESEND_WEBHOOK_SECRET

  const { type, data } = payload;
  const resendEventId = data.id;

  try {
    // 1. Find the edition or subscriber associated with this event
    // For send/open/click events, we usually have a broadcast ID or metadata
    const broadcastId = data.broadcast_id;
    const email = data.to?.[0];

    // 2. Log the event
    const { error: analyticsError } = await supabase
      .from('newsletter_analytics')
      .insert({
        resend_event_type: type,
        resend_event_id: resendEventId,
        occurred_at: data.created_at,
        // link_url: data.click?.url, // if it's a click event
      });

    // 3. Handle unsubscriptions
    if (type === 'email.unsubscribed') {
      await supabase
        .from('newsletter_subscribers')
        .update({ 
          status: 'unsubscribed', 
          unsubscribed_at: new Date().toISOString() 
        })
        .eq('email', email);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
