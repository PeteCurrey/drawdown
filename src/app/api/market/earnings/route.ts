import { NextResponse } from "next/server";
import { getEarningsCalendar } from "@/lib/market";

export async function GET() {
  try {
    const earnings = await getEarningsCalendar();
    return NextResponse.json(earnings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
