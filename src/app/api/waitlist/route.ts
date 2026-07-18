import { NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, tier } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createInternalSupabase();

    // Insert into waitlist
    const { error } = await supabase
      .from('floor_waitlist')
      .insert({
        email,
        tier: tier || 'floor',
        status: 'pending'
      });

    if (error) {
      if (error.code === '23505') {
        // Unique violation - already on the list, treat as success
        return NextResponse.json({ success: true });
      }
      console.error("Waitlist insert error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
