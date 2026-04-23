import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS for administrative broadcasting
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { title, message } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    // 1. Fetch all registered push tokens
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from('push_tokens')
      .select('token, platform');

    if (tokenError) throw tokenError;

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ count: 0, message: "No devices registered" });
    }

    // 2. LOGIC FOR BROADCASTING
    // In a real production app, you would integrate with FCM (Firebase) or OneSignal here.
    // Example for OneSignal:
    /*
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic YOUR_REST_API_KEY"
      },
      body: JSON.stringify({
        app_id: "YOUR_APP_ID",
        include_player_ids: tokens.map(t => t.token),
        headings: { en: title },
        contents: { en: message }
      })
    });
    */

    console.log(`Broadcasting to ${tokens.length} devices: ${title} - ${message}`);

    // For now, we simulate success and return the count
    return NextResponse.json({ 
      success: true, 
      count: tokens.length,
      message: "Push notifications queued successfully (Simulator Mode)" 
    });

  } catch (error: any) {
    console.error("Push broadcast error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
