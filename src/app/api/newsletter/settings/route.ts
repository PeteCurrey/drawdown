import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { error } = await supabase
    .from('newsletter_settings')
    .update(body)
    .eq('id', body.id || (await supabase.from('newsletter_settings').select('id').single()).data?.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
