import { NextResponse } from "next/server";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getLatestSignals } from "@/lib/intelligence-ai";

export async function GET() {
  try {
    const signals = await getLatestSignals(10);
    return NextResponse.json(signals);
  } catch (error) {
    console.error("API Error (Latest Signals):", error);
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 });
  }
}
