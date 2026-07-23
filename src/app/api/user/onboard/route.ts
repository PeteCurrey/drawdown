import { NextResponse } from "next/server";
import { createClient, createInternalSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      experience_level, 
      country, 
      currency, 
      preferred_markets, 
      trading_style, 
      trading_capital, 
      trading_goals 
    } = body;

    const adminClient = createInternalSupabase();

    // Fetch existing profile to get email_preferences
    const { data: profile } = await adminClient
      .from("profiles")
      .select("email_preferences")
      .eq("id", user.id)
      .single();

    const existingPrefs = profile?.email_preferences || {};
    const updatedPrefs = {
      ...existingPrefs,
      onboarding: {
        experience_level,
        preferred_markets,
        trading_style,
        trading_capital,
        trading_goals,
        has_onboarded: true,
        completed_at: new Date().toISOString()
      }
    };

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        display_name: fullName || null,
        full_name: fullName || null,
        country,
        currency,
        email_preferences: updatedPrefs,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update profile onboarding status:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
