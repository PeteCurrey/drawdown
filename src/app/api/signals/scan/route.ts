import { NextResponse } from "next/server";
import { runSignalScan } from "@/lib/signal-engine";

let lastScanTime = 0;
const THROTTLE_MS = 60 * 1000; // 60 seconds

async function handleScan() {
  const now = Date.now();
  if (now - lastScanTime < THROTTLE_MS) {
    return NextResponse.json({ 
      throttled: true, 
      message: 'Scan throttled — last scan was less than 60 seconds ago',
      nextScanAvailable: new Date(lastScanTime + THROTTLE_MS).toISOString()
    }, { status: 429 });
  }

  try {
    const results = await runSignalScan();
    lastScanTime = Date.now();
    return NextResponse.json({
      success: true,
      message: "Market scan completed successfully.",
      results,
      lastScan: new Date(lastScanTime).toISOString(),
    });
  } catch (err: any) {
    console.error("[api/signals/scan] Scan failed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to run signal scan." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return handleScan();
}

export async function POST() {
  return handleScan();
}
