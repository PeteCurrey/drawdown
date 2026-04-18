import { NextResponse } from "next/server";
import { getEconomicCalendar } from "@/lib/market";

export async function GET() {
  try {
    const events = await getEconomicCalendar();
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
