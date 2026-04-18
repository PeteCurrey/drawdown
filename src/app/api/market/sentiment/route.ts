import { NextResponse } from "next/server";
import { getMarketSentiment } from "@/lib/market";

export async function GET() {
  try {
    const sentiment = await getMarketSentiment();
    return NextResponse.json(sentiment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
