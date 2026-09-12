import { NextRequest, NextResponse } from "next/server";
import { runSignalScan } from "@/lib/signal-engine";
import { createClient } from "@/lib/supabase/server";
import { CommercialAccess } from "@/lib/entitlements";

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

// GET — called by Vercel cron every 5 minutes (authenticated via CRON_SECRET)
export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleScan();
}

// POST — called by the dashboard "Scan Markets" button (requires active subscriber or admin)
export async function POST(request: NextRequest) {
  // Allow CRON_SECRET bearer token
  if (process.env.CRON_SECRET && request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`) {
    return handleScan();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, role")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier;
  const status = (profile as any)?.subscription_status;
  const isAdmin = (profile as any)?.role === "admin";

  if (!isAdmin && !CommercialAccess.canAccessSignalCentre(tier, status)) {
    return NextResponse.json(
      { error: "Active Signal Centre subscription required to initiate market scan." },
      { status: 403 }
    );
  }

  return handleScan();
}
