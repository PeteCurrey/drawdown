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
    const { experience_level, country, currency, preferred_markets } = body;

    const adminClient = createInternalSupabase();
    
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        experience_level,
        country,
        currency,
        preferred_markets,
        has_onboarded: true,
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
