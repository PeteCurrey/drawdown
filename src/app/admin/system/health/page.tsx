import { calculateSystemHealth } from "@/lib/data-health";
import { SystemHealthClient } from "./SystemHealthClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "System Data Health & Control Tower | Admin | Drawdown",
  description: "Operational telemetry, data freshness, scheduled job health, and test data quarantine control tower.",
};

export default async function AdminSystemHealthPage() {
  const healthData = await calculateSystemHealth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#16213E] font-bold">
            OPERATIONAL CONTROL TOWER // PLATFORM INTEGRITY
          </span>
        </div>
        <h1 className="text-3xl font-display font-black text-[#0B0E12] tracking-tight">
          System Data Health
        </h1>
        <p className="text-sm font-sans text-[#4B5157] max-w-2xl mt-1">
          Real-time monitoring of all production data flows: live market feeds, broadsheet publication recency, signal expiry integrity, and scheduled background job execution.
        </p>
      </div>

      <SystemHealthClient initialHealth={healthData} />
    </div>
  );
}
