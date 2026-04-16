import { NextResponse } from "next/server";
import { FTSE_SECTORS } from "@/lib/data/sectors";

export async function GET() {
  try {
    // In a real app, this would calculate aggregate performance from live stock prices.
    // For the demo, we return the structured mock data.
    return NextResponse.json(FTSE_SECTORS);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
