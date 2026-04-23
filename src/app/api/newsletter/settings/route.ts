import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  // Exclude id from the update payload to prevent primary key violation errors
  const { id, ...updates } = body;

  // 1. Get the current settings ID if not provided
  let targetId = id;
  if (!targetId) {
    const { data: currentSettings } = await supabase
      .from('newsletter_settings')
      .select('id')
      .single();
    
    if (!currentSettings) {
      // Create default settings if missing
      const { data: newSettings, error: createError } = await supabase
        .from('newsletter_settings')
        .insert({})
        .select('id')
        .single();
      
      if (createError) {
        console.error("Failed to create settings:", createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      targetId = newSettings.id;
    } else {
      targetId = currentSettings.id;
    }
  }

  // 2. Perform the update
  const { error } = await supabase
    .from('newsletter_settings')
    .update(updates)
    .eq('id', targetId);

  if (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
