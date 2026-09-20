import { NextResponse } from "next/server";
import { LobbyControlRoomService } from "@/lib/data-platform/control-room";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/lobby/control-room
 *
 * Admin telemetry endpoint returning full data pipeline status:
 *  - Provider Health & Feed Inventory
 *  - Data Freshness across 12 categories
 *  - Pipeline Funnel stage counters
 *  - Active operational alerts
 */
export async function GET() {
  try {
    const providers = LobbyControlRoomService.getProviderInventory();
    const freshness = LobbyControlRoomService.getDataFreshness();
    const funnel = LobbyControlRoomService.getPipelineFunnel();
    const alerts = LobbyControlRoomService.getSystemAlerts();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalProviders: providers.length,
        activeProviders: providers.filter(p => p.inventoryStatus === "ACTIVE").length,
        criticalAlerts: alerts.filter(a => a.severity === "critical").length,
        pipelineTotal: funnel.raw,
      },
      providers,
      freshness,
      funnel,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load Control Room telemetry",
      },
      { status: 500 }
    );
  }
}
