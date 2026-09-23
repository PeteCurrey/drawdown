"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink,
  Shield,
  Radio,
  Power
} from "lucide-react";
import type { NewsSource, SocialSourcePlatform, SocialSourceCategory } from "@/lib/content-os/types";

interface Props {
  initialSources: NewsSource[];
}

export function SourceManagerClient({ initialSources }: Props) {
  const router = useRouter();
  const [sources, setSources] = useState<NewsSource[]>(initialSources);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [ingestFeedback, setIngestFeedback] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<SocialSourcePlatform>("x");
  const [handle, setHandle] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [category, setCategory] = useState<string>("investor");
  const [priority, setPriority] = useState<number>(2);
  const [trustTier, setTrustTier] = useState<string>("tier_2_verified");
  const [formError, setFormError] = useState<string | null>(null);

  const handleToggleActive = async (sourceId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/news/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sourceId, active: !currentActive }),
      });
      if (res.ok) {
        setSources(prev => prev.map(s => s.id === sourceId ? { ...s, active: !currentActive } : s));
        router.refresh();
      }
    } catch (e) {
      console.error("Failed to toggle source active status", e);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/admin/news/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          platform,
          account_handle: handle,
          feed_url: feedUrl || undefined,
          source_category: category,
          priority,
          trust_tier: trustTier,
          active: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create source");
      }

      setSources(prev => [data.source, ...prev]);
      setShowAddModal(false);
      setName("");
      setHandle("");
      setFeedUrl("");
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to add source");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerIngestion = async () => {
    setIngesting(true);
    setIngestFeedback(null);
    try {
      const res = await fetch("/api/cron/social-ingest");
      const data = await res.json();
      if (res.ok) {
        setIngestFeedback(`Ingestion cycle complete: ${data.totalIngested} new items accepted, ${data.totalDuplicates} duplicates filtered.`);
        router.refresh();
      } else {
        setIngestFeedback(`Ingestion error: ${data.error || "Execution failed"}`);
      }
    } catch (e: any) {
      setIngestFeedback(`Trigger error: ${e.message}`);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-mkt-ink">
            Monitored Sources &amp; Intelligence Registry
          </h2>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Curated social accounts, regulatory newsrooms, and syndicated feeds monitored by Drawdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerIngestion}
            disabled={ingesting}
            className="px-3.5 py-2 text-xs font-mono font-bold bg-white border border-[#e5e7eb] text-mkt-ink rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${ingesting ? "animate-spin text-blue-600" : ""}`} />
            {ingesting ? "Ingesting..." : "Probe / Ingest Active"}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-mono font-bold bg-[#16213E] text-white rounded-lg hover:bg-black flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Monitored Source
          </button>
        </div>
      </div>

      {ingestFeedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono text-blue-900 flex items-center justify-between">
          <span>{ingestFeedback}</span>
          <button onClick={() => setIngestFeedback(null)} className="text-blue-500 hover:text-blue-800 ml-4">✕</button>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Source Name &amp; Handle</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Trust Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Ingested</th>
                <th className="py-3 px-4 text-right">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {sources.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#6b7280]">
                    No monitored sources registered yet.
                  </td>
                </tr>
              ) : (
                sources.map((s) => {
                  const isSocial = s.platform && s.platform !== "rss";
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-sm text-mkt-ink font-sans flex items-center gap-2">
                          {s.name}
                          {s.account_handle && (
                            <span className="text-xs font-mono text-blue-600 font-normal">
                              @{s.account_handle}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#6b7280] truncate block mt-0.5">
                          {s.feed_url || s.domain}
                        </span>
                        {s.error_details && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block border border-amber-200">
                            {s.error_details}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded uppercase text-[10px] font-bold ${
                          s.platform === "x" ? "bg-black text-white" :
                          s.platform === "threads" ? "bg-purple-100 text-purple-900" :
                          s.platform === "bluesky" ? "bg-sky-100 text-sky-900" :
                          "bg-amber-100 text-amber-900"
                        }`}>
                          {s.platform || "RSS"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize text-mkt-ink font-sans text-xs">
                          {s.source_category?.replace(/_/g, " ") || "Market Commentary"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded ${
                          s.trust_tier === "tier_1_primary" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                          s.trust_tier === "tier_2_verified" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          <Shield className="w-2.5 h-2.5" />
                          {s.trust_tier?.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          s.monitoring_status === "ingested" || s.monitoring_status === "connected"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.monitoring_status === "unavailable"
                            ? "bg-neutral-100 text-neutral-600"
                            : s.monitoring_status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            s.monitoring_status === "ingested" || s.monitoring_status === "connected" ? "bg-emerald-600" :
                            s.monitoring_status === "unavailable" ? "bg-neutral-400" :
                            s.monitoring_status === "failed" ? "bg-red-600" : "bg-blue-600"
                          }`} />
                          {s.monitoring_status || "Configured"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#6b7280] text-[11px]">
                        {s.last_fetched_at ? (
                          new Date(s.last_fetched_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
                        ) : (
                          <span className="text-[#9ca3af]">Never</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleActive(s.id, s.active)}
                          className={`p-1.5 rounded transition-colors ${
                            s.active ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                          }`}
                          title={s.active ? "Deactivate Source" : "Activate Source"}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#e5e7eb] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
              <div>
                <h3 className="font-bold text-base text-mkt-ink">Add Monitored Source</h3>
                <p className="text-xs text-[#6b7280]">Curate an external account or syndicated feed for intelligence surveillance.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#6b7280] hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-mono text-red-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSource} className="space-y-4 mt-4 text-xs font-mono">
              <div>
                <label className="block text-[#4b5563] uppercase font-bold mb-1">Source / Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanley Druckenmiller Desk or FinTech Radar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm font-sans focus:outline-none focus:border-mkt-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#4b5563] uppercase font-bold mb-1">Platform *</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value as SocialSourcePlatform)}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                  >
                    <option value="x">X (Twitter)</option>
                    <option value="rss">Syndicated RSS / Feed</option>
                    <option value="bluesky">Bluesky</option>
                    <option value="threads">Threads</option>
                    <option value="other">Other Authorised</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4b5563] uppercase font-bold mb-1">Account Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. @druckenmiller"
                    value={handle}
                    onChange={e => setHandle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4b5563] uppercase font-bold mb-1">Feed / Profile URL</label>
                <input
                  type="url"
                  placeholder="https://... (mandatory for RSS/Atom)"
                  value={feedUrl}
                  onChange={e => setFeedUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#4b5563] uppercase font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                  >
                    <option value="investor">Investor</option>
                    <option value="fund_manager">Fund Manager</option>
                    <option value="market_commentator">Market Commentator</option>
                    <option value="trader">Trader</option>
                    <option value="macro">Macro</option>
                    <option value="company_executive">Company / Exec</option>
                    <option value="financial_news">Financial News</option>
                    <option value="sector_specialist">Sector Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4b5563] uppercase font-bold mb-1">Trust Tier</label>
                  <select
                    value={trustTier}
                    onChange={e => setTrustTier(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                  >
                    <option value="tier_1_primary">Tier 1 (Primary)</option>
                    <option value="tier_2_verified">Tier 2 (Verified)</option>
                    <option value="tier_3_secondary">Tier 3 (Secondary)</option>
                    <option value="tier_4_untrusted">Tier 4 (Community)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4b5563] uppercase font-bold mb-1">Priority (1-5)</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs font-mono focus:outline-none focus:border-mkt-ink"
                  >
                    <option value={1}>1 (Highest)</option>
                    <option value={2}>2 (High)</option>
                    <option value={3}>3 (Normal)</option>
                    <option value={4}>4 (Low)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#e5e7eb] text-[#4b5563] rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-mkt-ink text-white font-bold rounded-lg hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Source"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
