"use client";

import { useState } from "react";
import type { FullSystemHealthPayload } from "@/lib/data-health";
import { CRON_JOB_REGISTRY } from "@/lib/cron-registry";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Database, 
  RefreshCw, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  FileText,
  XCircle,
  HelpCircle
} from "lucide-react";

interface Props {
  initialHealth: FullSystemHealthPayload;
}

export function SystemHealthClient({ initialHealth }: Props) {
  const [health, setHealth] = useState<FullSystemHealthPayload>(initialHealth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/data-health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (e) {
      console.error("Failed to refresh health:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const statusBg =
    health.overallStatus === "HEALTHY"
      ? "bg-profit/10 text-profit border-profit/30"
      : health.overallStatus === "DEGRADED"
      ? "bg-amber-50 text-amber-800 border-amber-300"
      : "bg-red-50 text-red-700 border-red-300";

  return (
    <div className="space-y-8">
      {/* ── Top Bar: Overall Status & Refresh ──────────────────────────── */}
      <div className="p-6 border border-[#DEDDD8] rounded bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FAF9F5] border border-[#DEDDD8] rounded">
            <Activity className="w-6 h-6 text-[#16213E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-[#0B0E12]">System Health Status</h2>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${statusBg}`}>
                {health.overallStatus}
              </span>
            </div>
            <p className="text-xs font-mono text-[#4B5157] mt-1">
              Last Evaluated: {new Date(health.timestamp).toUTCString()}
            </p>
          </div>
        </div>

        <button
          onClick={refreshHealth}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#DEDDD8] bg-[#FAF9F5] hover:bg-[#F0EFEA] text-xs font-mono font-bold uppercase tracking-wider text-[#16213E] rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Evaluating..." : "Refresh Status"}
        </button>
      </div>

      {/* ── Grid: 4 Core Surface Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Market Data */}
        <div className="p-5 border border-[#DEDDD8] rounded bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#4B5157]">Market Data Pipeline</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
              health.marketData.status === "HEALTHY" ? "bg-profit/10 text-profit border-profit/30" : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {health.marketData.status}
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#0B0E12]">
              {health.marketData.cachedSymbolsCount}
            </div>
            <div className="text-[10px] font-mono text-[#4B5157]">Cached Symbols in Supabase</div>
          </div>
          <div className="text-[11px] font-mono text-[#4B5157] space-y-1 pt-2 border-t border-[#DEDDD8]/60">
            <div>Screener Cache: {health.marketData.screenerCacheAgeSeconds !== null ? `${health.marketData.screenerCacheAgeSeconds}s ago` : "—"}</div>
            <div>Newest Quote: {health.marketData.newestQuoteAgeSeconds !== null ? `${health.marketData.newestQuoteAgeSeconds}s ago` : "—"}</div>
            <div>Twelve Data Keys: {health.marketData.providerStatus.twelveData.keyCount} active</div>
          </div>
        </div>

        {/* The Lobby Broadsheet */}
        <div className="p-5 border border-[#DEDDD8] rounded bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#4B5157]">The Lobby Broadsheet</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
              health.lobby.leadStory.status === "HEALTHY" ? "bg-profit/10 text-profit border-profit/30" : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {health.lobby.leadStory.status === "HEALTHY" ? "LEAD VERIFIED" : health.lobby.leadStory.status}
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#0B0E12]">
              {health.lobby.publishedArticlesCount}
            </div>
            <div className="text-[10px] font-mono text-[#4B5157]">Published Production Articles</div>
          </div>
          <div className="text-[11px] font-mono text-[#4B5157] space-y-1 pt-2 border-t border-[#DEDDD8]/60">
            <div>Lead Age: {health.lobby.leadStory.ageHours !== null ? `${health.lobby.leadStory.ageHours}h ago` : "No lead"}</div>
            <div>Upcoming Events: {health.lobby.upcomingEventsCount} future</div>
            <div>Watchlist Briefs: {health.lobby.watchlistItemsCount} active</div>
          </div>
        </div>

        {/* AI Trading Signals */}
        <div className="p-5 border border-[#DEDDD8] rounded bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#4B5157]">AI Consensus Signals</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
              health.signals.status === "HEALTHY" ? "bg-profit/10 text-profit border-profit/30" : "bg-neutral-100 text-[#4B5157]"
            }`}>
              {health.signals.status}
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#0B0E12]">
              {health.signals.totalActiveCount}
            </div>
            <div className="text-[10px] font-mono text-[#4B5157]">Active Non-Expired Signals</div>
          </div>
          <div className="text-[11px] font-mono text-[#4B5157] space-y-1 pt-2 border-t border-[#DEDDD8]/60">
            <div>15M: {health.signals.byTimeframe["15M"] || 0} · 1H: {health.signals.byTimeframe["1H"] || 0}</div>
            <div>4H: {health.signals.byTimeframe["4H"] || 0} · 1D: {health.signals.byTimeframe["1D"] || 0}</div>
            <div>Newest: {health.signals.newestSignalAgeMinutes !== null ? `${health.signals.newestSignalAgeMinutes}m ago` : "—"}</div>
          </div>
        </div>

        {/* Scheduled Jobs (Crons) */}
        <div className="p-5 border border-[#DEDDD8] rounded bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-[#4B5157]">Scheduled Jobs (Crons)</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
              health.crons.failedCount === 0 && health.crons.missedCount === 0 ? "bg-profit/10 text-profit border-profit/30" : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {health.crons.healthyCount} / {health.crons.totalJobs} OK
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[#0B0E12]">
              {health.crons.missedCount}
            </div>
            <div className="text-[10px] font-mono text-[#4B5157]">Missed / Stale Scheduled Runs</div>
          </div>
          <div className="text-[11px] font-mono text-[#4B5157] space-y-1 pt-2 border-t border-[#DEDDD8]/60">
            <div>Failed Runs: {health.crons.failedCount}</div>
            <div>Total Registered: {health.crons.totalJobs} routes</div>
            <div>Scheduler: Cloudflare Worker 5m</div>
          </div>
        </div>
      </div>

      {/* ── Section: Scheduled Jobs Observability Table ─────────────────── */}
      <div className="border border-[#DEDDD8] rounded bg-white overflow-hidden">
        <div className="p-5 border-b border-[#DEDDD8] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-[#0B0E12]">
              Background Scheduled Job Registry & Run State
            </h3>
            <p className="text-xs font-mono text-[#4B5157] mt-0.5">
              Tracks last execution, completed run durations, processed records, and missed-run alerts.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] uppercase">
            16 REGISTERED JOBS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAF9F5] border-b border-[#DEDDD8] text-[#4B5157]">
              <tr>
                <th className="py-3 px-4">Job Name</th>
                <th className="py-3 px-4">Cadence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Started</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Processed</th>
                <th className="py-3 px-4">Details / Errors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DEDDD8]">
              {health.crons.jobs.map((job) => {
                let badgeClass = "bg-neutral-100 text-[#4B5157]";
                if (job.state === "OK") badgeClass = "bg-profit/10 text-profit border border-profit/30";
                else if (job.state === "RUNNING") badgeClass = "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse";
                else if (job.state === "MISSED" || job.state === "STALE") badgeClass = "bg-amber-50 text-amber-800 border border-amber-300 font-bold";
                else if (job.state === "FAILED") badgeClass = "bg-red-50 text-red-700 border border-red-300 font-bold";

                return (
                  <tr key={job.jobId} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0B0E12]">
                      {job.name}
                    </td>
                    <td className="py-3 px-4 text-[#4B5157]">
                      {CRON_JOB_REGISTRY[job.jobId]?.scheduleDescription || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${badgeClass}`}>
                        {job.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#4B5157]">
                      {job.lastStartedAt ? new Date(job.lastStartedAt).toLocaleTimeString("en-GB", { timeZone: "UTC" }) + " UTC" : "Never recorded"}
                    </td>
                    <td className="py-3 px-4 text-[#4B5157]">
                      {job.durationMs !== null ? `${job.durationMs}ms` : "—"}
                    </td>
                    <td className="py-3 px-4 text-[#4B5157]">
                      {job.recordsProcessed}
                    </td>
                    <td className="py-3 px-4 text-[#4B5157] max-w-xs truncate">
                      {job.lastErrorMessage ? (
                        <span className="text-red-600 font-semibold">{job.lastErrorMessage}</span>
                      ) : job.isMissed ? (
                        <span className="text-amber-700">Execution delayed past expected window</span>
                      ) : (
                        <span className="text-[#4B5157]/70">Healthy run history</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section: Data Quality & Test Quarantine ────────────────────── */}
      <div className="border border-[#DEDDD8] rounded bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-accent" />
          <h3 className="text-base font-bold font-display text-[#0B0E12]">
            Data Quality & Production Quarantine Layer
          </h3>
        </div>
        <p className="text-xs font-sans text-[#4B5157]">
          The production eligibility layer quarantines test records, mock entries, and unclassified drafts to prevent accidental public exposure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 border border-[#DEDDD8] bg-[#FAF9F5] rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#4B5157]">Quarantined Test Articles</span>
            <div className="text-xl font-mono font-black text-[#0B0E12]">
              {health.contentQuality.quarantinedLobbyCount}
            </div>
            <p className="text-[9px] font-mono text-[#4B5157]">Excluded from public Lobby feeds</p>
          </div>

          <div className="p-4 border border-[#DEDDD8] bg-[#FAF9F5] rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#4B5157]">Quarantined Test Signals</span>
            <div className="text-xl font-mono font-black text-[#0B0E12]">
              {health.contentQuality.quarantinedSignalsCount}
            </div>
            <p className="text-[9px] font-mono text-[#4B5157]">Deactivated and marked as test</p>
          </div>

          <div className="p-4 border border-[#DEDDD8] bg-[#FAF9F5] rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#4B5157]">Unclassified Draft Articles</span>
            <div className="text-xl font-mono font-black text-[#0B0E12]">
              {health.contentQuality.unclassifiedLobbyCount}
            </div>
            <p className="text-[9px] font-mono text-[#4B5157]">Awaiting editorial review</p>
          </div>

          <div className="p-4 border border-[#DEDDD8] bg-[#FAF9F5] rounded space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#4B5157]">Zero-Source Published Articles</span>
            <div className={`text-xl font-mono font-black ${health.contentQuality.zeroSourceArticlesCount > 0 ? "text-amber-700" : "text-[#0B0E12]"}`}>
              {health.contentQuality.zeroSourceArticlesCount}
            </div>
            <p className="text-[9px] font-mono text-[#4B5157]">Must have primary source citation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
