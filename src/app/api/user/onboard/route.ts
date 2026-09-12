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
      primary_objective,
      primary_market,
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
      .select("email_preferences, full_name, display_name")
      .eq("id", user.id)
      .single();

    const existingPrefs = profile?.email_preferences || {};
    const updatedPrefs = {
      ...existingPrefs,
      onboarding: {
        ...(existingPrefs.onboarding || {}),
        primary_objective: primary_objective || trading_goals || null,
        primary_market: primary_market || (preferred_markets && preferred_markets[0]) || null,
        experience_level: experience_level || null,
        preferred_markets: preferred_markets || (primary_market ? [primary_market] : []),
        trading_style: trading_style || null,
        trading_capital: trading_capital || null,
        trading_goals: trading_goals || primary_objective || null,
        has_onboarded: true,
        activation_completed: true,
        completed_at: new Date().toISOString()
      }
    };

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || profile?.full_name || profile?.display_name;
    
    const updatePayload: Record<string, any> = {
      email_preferences: updatedPrefs,
      updated_at: new Date().toISOString()
    };

    if (fullName) {
      updatePayload.display_name = fullName;
      updatePayload.full_name = fullName;
    }
    if (country) updatePayload.country = country;
    if (currency) updatePayload.currency = currency;

    const { error: updateError } = await adminClient
      .from("profiles")
      .update(updatePayload)
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
