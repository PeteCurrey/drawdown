import { NextRequest, NextResponse } from "next/server";
import { generateNewsletterEdition } from "@/lib/newsletter/generation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  // Verify admin auth
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { edition_type, force_regenerate } = await request.json();

  try {
    const editionId = await generateNewsletterEdition(edition_type);
    return NextResponse.json({ editionId, success: true });
  } catch (error) {
    console.error("Manual newsletter generation failed:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
