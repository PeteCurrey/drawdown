import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error("CALCOM_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  const signature = request.headers.get("cal-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Cal.com webhook signature mismatch");
    return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { triggerEvent, payload } = event;

  // We need the admin client to write to the DB securely bypassing RLS
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  );

  switch (triggerEvent) {
    case "BOOKING_CREATED": {
      const userId = payload.metadata?.userId;
      
      if (!userId) {
        console.error("Booking created but no userId found in metadata. Cannot link to user.");
        return NextResponse.json({ received: true, ignored: true, reason: "No userId in metadata" });
      }

      // Calculate duration in minutes
      const start = new Date(payload.startTime);
      const end = new Date(payload.endTime);
      const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

      const { error } = await supabase
        .from("mentorship_sessions")
        .insert({
          id: payload.uid, // Map cal.com booking uid to our session id
          user_id: userId,
          scheduled_at: start.toISOString(),
          duration_mins: durationMins,
          status: "scheduled",
          meeting_url: payload.meetingUrl || null,
        });

      if (error) {
        console.error("Failed to insert mentorship session:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      break;
    }
    
    case "BOOKING_RESCHEDULED": {
      const start = new Date(payload.startTime);
      const end = new Date(payload.endTime);
      const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

      const { error } = await supabase
        .from("mentorship_sessions")
        .update({
          scheduled_at: start.toISOString(),
          duration_mins: durationMins,
          meeting_url: payload.meetingUrl || null,
        })
        .eq("id", payload.uid);

      if (error) {
        console.error("Failed to update mentorship session:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      break;
    }

    case "BOOKING_CANCELLED": {
      const { error } = await supabase
        .from("mentorship_sessions")
        .update({
          status: "cancelled",
        })
        .eq("id", payload.uid);

      if (error) {
        console.error("Failed to cancel mentorship session:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
