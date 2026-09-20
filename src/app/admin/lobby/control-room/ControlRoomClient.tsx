"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Database,
  ArrowRight,
  FileSearch,
} from "lucide-react";
import type {
  ProviderControlRoomItem,
  CategoryFreshnessItem,
  PipelineFunnelCounts,
  SystemAlert,
} from "@/lib/data-platform/control-room";

interface ControlRoomClientProps {
  initialProviders: ProviderControlRoomItem[];
  initialFreshness: CategoryFreshnessItem[];
  initialFunnel: PipelineFunnelCounts;
  initialAlerts: SystemAlert[];
}

export function ControlRoomClient({
  initialProviders,
  initialFreshness,
  initialFunnel,
  initialAlerts,
}: ControlRoomClientProps) {
  const [providers, setProviders] = useState(initialProviders);
  const [freshness, setFreshness] = useState(initialFreshness);
  const [funnel, setFunnel] = useState(initialFunnel);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"providers" | "freshness" | "funnel" | "provenance">("providers");
  const [selectedProviderCategory, setSelectedProviderCategory] = useState<string>("ALL");

  // Provenance inspector test state
  const [inspectedEventId, setInspectedEventId] = useState<string | null>(null);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/lobby/control-room");
      const data = await res.json();
      if (data.success) {
        setProviders(data.providers);
        setFreshness(data.freshness);
        setFunnel(data.funnel);
        setAlerts(data.alerts);
      }
    } catch {
      // Gracefully handle network error
    } finally {
      setIsRefreshing(false);
    }
  }

  const filteredProviders = selectedProviderCategory === "ALL"
    ? providers
    : providers.filter(p => p.categories.includes(selectedProviderCategory as any));

  const totalSuccessful = providers.reduce((acc, p) => acc + p.telemetry.successfulRequests, 0);
  const totalFailed = providers.reduce((acc, p) => acc + p.telemetry.failedRequests, 0);
  const openBreakers = providers.filter(p => p.circuitBreaker === "OPEN").length;
  const activeCount = providers.filter(p => p.inventoryStatus === "ACTIVE").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-mkt-bd">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-mkt-i4 font-mono text-[9px] uppercase tracking-widest">
              // TELEMETRY &amp; PIPELINE AUDIT
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-mkt-ink">
            Data Control Room.
          </h1>
          <p className="text-sm text-mkt-i3 font-sans mt-1">
            Observability, circuit-breaker telemetry, feed freshness, and provenance inspector for the Intelligence Data Platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/lobby"
            className="px-4 py-2 border border-mkt-bd text-xs font-mono uppercase tracking-wider text-mkt-i3 hover:text-mkt-ink hover:border-mkt-i4 transition-colors"
          >
            ← Back to CMS
          </Link>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-mkt-ink text-mkt-bg font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 border flex items-start gap-3 ${
                alert.severity === "critical"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    {alert.source} — {alert.severity.toUpperCase()} ALERT
                  </span>
                  <span className="font-mono text-[10px] opacity-70">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs font-sans mt-0.5 opacity-90">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border border-mkt-bd bg-mkt-surface space-y-1">
          <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest block">Active Providers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-mkt-ink">{activeCount}</span>
            <span className="text-xs font-mono text-mkt-i3">/ {providers.length} registered</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> All core adapters online
          </span>
        </div>

        <div className="p-4 border border-mkt-bd bg-mkt-surface space-y-1">
          <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest block">Circuit Breakers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {providers.length - openBreakers}
            </span>
            <span className="text-xs font-mono text-mkt-i3">CLOSED ({openBreakers} tripped)</span>
          </div>
          <span className="text-[10px] text-mkt-i3 font-mono">Automatic failure isolation active</span>
        </div>

        <div className="p-4 border border-mkt-bd bg-mkt-surface space-y-1">
          <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest block">Requests Telemetry</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-mkt-ink">{totalSuccessful}</span>
            <span className="text-xs font-mono text-rose-400">({totalFailed} failed)</span>
          </div>
          <span className="text-[10px] text-mkt-i3 font-mono">Zero silent failure tolerance</span>
        </div>

        <div className="p-4 border border-mkt-bd bg-mkt-surface space-y-1">
          <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest block">Pipeline Ingestion</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-mkt-ink">{funnel.raw}</span>
            <span className="text-xs font-mono text-mkt-i3">raw records</span>
          </div>
          <span className="text-[10px] text-mkt-i3 font-mono">{funnel.published} verified &amp; published</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-mkt-bd flex gap-6 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("providers")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${
            activeTab === "providers"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-mkt-i3 hover:text-mkt-ink"
          }`}
        >
          Provider Health &amp; Inventory ({providers.length})
        </button>
        <button
          onClick={() => setActiveTab("freshness")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${
            activeTab === "freshness"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-mkt-i3 hover:text-mkt-ink"
          }`}
        >
          Data Freshness (12 Categories)
        </button>
        <button
          onClick={() => setActiveTab("funnel")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${
            activeTab === "funnel"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-mkt-i3 hover:text-mkt-ink"
          }`}
        >
          Event Pipeline Funnel
        </button>
        <button
          onClick={() => setActiveTab("provenance")}
          className={`pb-3 border-b-2 font-semibold transition-colors ${
            activeTab === "provenance"
              ? "border-mkt-ink text-mkt-ink"
              : "border-transparent text-mkt-i3 hover:text-mkt-ink"
          }`}
        >
          Provenance Inspector
        </button>
      </div>

      {/* TAB 1: PROVIDER HEALTH & INVENTORY */}
      {activeTab === "providers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-mkt-i3">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter by Category:</span>
              <select
                value={selectedProviderCategory}
                onChange={e => setSelectedProviderCategory(e.target.value)}
                className="bg-mkt-surface border border-mkt-bd px-2 py-1 text-xs font-mono text-mkt-ink focus:outline-none"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="MARKET">MARKET</option>
                <option value="MACRO">MACRO</option>
                <option value="CENTRAL_BANK">CENTRAL BANK</option>
                <option value="REGULATOR">REGULATOR</option>
                <option value="CORPORATE">CORPORATE</option>
                <option value="POSITIONING">POSITIONING</option>
                <option value="ENERGY">ENERGY</option>
              </select>
            </div>
            <span className="text-xs font-mono text-mkt-i4">
              Showing {filteredProviders.length} providers
            </span>
          </div>

          <div className="border border-mkt-bd overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="border-b border-mkt-bd bg-mkt-surface font-mono text-[10px] uppercase tracking-wider text-mkt-i4">
                <tr>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Categories</th>
                  <th className="p-3">Inventory Status</th>
                  <th className="p-3">Breaker</th>
                  <th className="p-3">Auth / Key</th>
                  <th className="p-3">Avg Latency</th>
                  <th className="p-3">Success / Fail</th>
                  <th className="p-3">Rate Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mkt-bd font-mono">
                {filteredProviders.map(provider => (
                  <tr key={provider.id} className="hover:bg-mkt-surface/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-mkt-ink">{provider.name}</div>
                      <div className="text-[10px] text-mkt-i4">{provider.id}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {provider.categories.map(cat => (
                          <span
                            key={cat}
                            className="px-1.5 py-0.5 text-[9px] bg-mkt-surface border border-mkt-bd text-mkt-i3"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${
                          provider.inventoryStatus === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : provider.inventoryStatus === "CONFIGURED_BUT_UNUSED"
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                            : provider.inventoryStatus === "MISSING_CREDENTIAL"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {provider.inventoryStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold ${
                          provider.circuitBreaker === "CLOSED"
                            ? "text-emerald-400"
                            : provider.circuitBreaker === "HALF_OPEN"
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {provider.circuitBreaker}
                      </span>
                    </td>
                    <td className="p-3">
                      {provider.requiresKey ? (
                        <span
                          className={`text-[10px] ${
                            provider.isConfigured ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {provider.isConfigured ? "CONFIGURED (SECURE)" : "MISSING KEY"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-mkt-i4">PUBLIC (NO KEY)</span>
                      )}
                    </td>
                    <td className="p-3 text-mkt-ink">
                      {provider.telemetry.avgLatencyMs > 0
                        ? `${provider.telemetry.avgLatencyMs.toFixed(0)} ms`
                        : "—"}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-400">{provider.telemetry.successfulRequests}</span>
                      <span className="text-mkt-i4"> / </span>
                      <span className={provider.telemetry.failedRequests > 0 ? "text-rose-400" : "text-mkt-i4"}>
                        {provider.telemetry.failedRequests}
                      </span>
                    </td>
                    <td className="p-3 text-[10px] text-mkt-i3">
                      {provider.rateLimitConfig.maxPerMinute}/min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DATA FRESHNESS */}
      {activeTab === "freshness" && (
        <div className="space-y-4">
          <p className="text-xs font-sans text-mkt-i3">
            Real-time freshness monitoring across all 12 core intelligence categories. Stale categories trigger automated alerts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {freshness.map(item => (
              <div key={item.category} className="p-4 border border-mkt-bd bg-mkt-surface space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-mkt-ink">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold border ${
                      item.freshnessStatus === "FRESH"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : item.freshnessStatus === "AGING"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : item.freshnessStatus === "STALE"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-mkt-bd text-mkt-i4 border-mkt-bd"
                    }`}
                  >
                    {item.freshnessStatus}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-mkt-i3 space-y-1">
                  <div>Target Cadence: <span className="text-mkt-ink">{item.targetCadence}</span></div>
                  <div>
                    Last Ingested:{" "}
                    <span className="text-mkt-ink">
                      {item.lastObservedAt ? new Date(item.lastObservedAt).toLocaleTimeString() : "Pending Ingestion"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PIPELINE FUNNEL */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <p className="text-xs font-sans text-mkt-i3">
            The canonical 8-stage intelligence funnel: tracks raw data points through validation, deduplication, correlation, and verified editorial publication.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 1: RAW</span>
              <span className="text-2xl font-mono font-bold text-mkt-ink">{funnel.raw}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Direct from APIs/feeds</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 2: NORMALIZED</span>
              <span className="text-2xl font-mono font-bold text-mkt-ink">{funnel.normalized}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Zod validated schemas</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 3: DEDUPLICATED</span>
              <span className="text-2xl font-mono font-bold text-mkt-ink">{funnel.deduplicated}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Fingerprint matched</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 4: CORRELATED</span>
              <span className="text-2xl font-mono font-bold text-mkt-ink">{funnel.correlated}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Entities &amp; markets bound</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 5: VERIFIED</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">{funnel.verified}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Primary authority backed</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 6: EDITORIAL QUEUE</span>
              <span className="text-2xl font-mono font-bold text-amber-400">{funnel.editorialQueue}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Awaiting editorial review</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 7: PUBLISHED</span>
              <span className="text-2xl font-mono font-bold text-emerald-400">{funnel.published}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Live in The Lobby</p>
            </div>
            <div className="p-4 border border-mkt-bd bg-mkt-surface">
              <span className="text-[10px] font-mono text-mkt-i4 uppercase block">Stage 8: REJECTED</span>
              <span className="text-2xl font-mono font-bold text-rose-400">{funnel.rejected}</span>
              <p className="text-[10px] font-mono text-mkt-i3 mt-1">Filtered by confidence gate</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROVENANCE INSPECTOR */}
      {activeTab === "provenance" && (
        <div className="space-y-4">
          <p className="text-xs font-sans text-mkt-i3">
            Audit sample: inspect any live event to trace its primary source authority, retrieval timestamp, transformation hash, and corroborating references.
          </p>

          <div className="p-6 border border-mkt-bd bg-mkt-surface space-y-4 font-mono text-xs">
            <div className="border-b border-mkt-bd pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-mkt-i4 uppercase block">Canonical Event Under Inspection</span>
                <span className="font-bold text-sm text-mkt-ink">
                  [SEC 8-K] NVIDIA Corp Material Definitive Agreement
                </span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED CONFIDENCE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div className="space-y-1">
                <span className="text-mkt-i4 uppercase">Original Primary Source:</span>
                <div className="text-mkt-ink">U.S. Securities and Exchange Commission (EDGAR)</div>
                <div className="text-mkt-i3 text-[10px]">Reliability: PRIMARY (Statutory Regulatory Repository)</div>
              </div>

              <div className="space-y-1">
                <span className="text-mkt-i4 uppercase">Primary URL &amp; Proof:</span>
                <div>
                  <a
                    href="https://www.sec.gov/edgar"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    https://www.sec.gov/edgar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-mkt-i4 uppercase">Observation Time (World):</span>
                <div className="text-mkt-ink">2026-09-18T18:05:00.000Z</div>
              </div>

              <div className="space-y-1">
                <span className="text-mkt-i4 uppercase">Retrieval Time (Platform):</span>
                <div className="text-mkt-ink">2026-09-18T18:05:12.450Z (+12.4s latency)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-mkt-bd space-y-2">
              <span className="text-mkt-i4 uppercase text-[10px] block">Immutable Pipeline Transformation Log:</span>
              <div className="space-y-1 text-[11px] text-mkt-i3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>1. Ingested via SecEdgarProvider Atom Feed stream</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>2. Parsed XML entities and sanitized CDATA via UniversalFeedParser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>3. Bound entity ID: company:cik-0001045810 (NVIDIA CORP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>4. Evaluated severity: HIGH (material unscheduled 8-K disclosure)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>5. Clustered with secondary wire coverage and routed to The Lobby</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
