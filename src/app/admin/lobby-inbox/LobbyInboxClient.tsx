"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";

interface MonitoredSource {
  id: string;
  platform: string;
  handle: string;
  ingest_mode: string;
  active: boolean;
}

interface LobbyItem {
  id: string;
  source_id: string;
  original_url: string;
  posted_at: string;
  extracted_claims: {
    headline: string;
    claims: string[];
    avorria_commentary?: string | null;
  };
  verified_facts: Array<{
    claim: string;
    source: string;
    source_url: string;
    verified_at?: string;
    reference_value?: string;
  }>;
  status: "draft" | "published" | "rejected";
  created_at: string;
  monitored_sources?: MonitoredSource;
}

export function LobbyInboxClient() {
  const [sources, setSources] = useState<MonitoredSource[]>([]);
  const [items, setItems] = useState<LobbyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [originalUrl, setOriginalUrl] = useState("");
  const [selectedHandle, setSelectedHandle] = useState("daytrading");
  const [customHandle, setCustomHandle] = useState("");
  const [caption, setCaption] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Latest extracted item preview
  const [extractedItem, setExtractedItem] = useState<LobbyItem | null>(null);

  useEffect(() => {
    fetchInboxData();
  }, []);

  async function fetchInboxData() {
    setFetchingData(true);
    try {
      const res = await fetch("/api/admin/lobby/inbox");
      if (!res.ok) throw new Error("Failed to load inbox data.");
      const data = await res.json();
      setSources(data.sources || []);
      setItems(data.items || []);
      if (data.sources && data.sources.length > 0 && !selectedHandle) {
        setSelectedHandle(data.sources[0].handle);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to load data.");
    } finally {
      setFetchingData(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const handleToUse = selectedHandle === "custom" ? customHandle.trim() : selectedHandle;
    if (!handleToUse) {
      setErrorMessage("Please specify an Instagram source handle.");
      return;
    }
    if (!originalUrl) {
      setErrorMessage("Instagram post URL is required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("original_url", originalUrl.trim());
      formData.append("handle", handleToUse);
      formData.append("caption", caption.trim());
      if (screenshotFile) {
        formData.append("screenshot", screenshotFile);
      }

      const res = await fetch("/api/admin/lobby/inbox", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to extract post intelligence.");
      }

      setSuccessMessage("Intelligence successfully extracted and cross-checked against FRED/EIA/Prices!");
      setExtractedItem(data.item);
      setItems((prev) => [data.item, ...prev]);

      // Reset form
      setCaption("");
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Unexpected extraction error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: "draft" | "published" | "rejected") {
    try {
      const res = await fetch("/api/admin/lobby/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status.");
      }

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (extractedItem && extractedItem.id === id) {
        setExtractedItem({ ...extractedItem, status: newStatus });
      }

      setSuccessMessage(`Item status updated to ${newStatus}.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Status update failed.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this lobby item?")) return;
    try {
      const res = await fetch(`/api/admin/lobby/inbox?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete item.");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (extractedItem && extractedItem.id === id) {
        setExtractedItem(null);
      }
      setSuccessMessage("Item deleted.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete.");
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#737373] block mb-1">
            // EDITORIAL INBOX // INSTAGRAM INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B0E12]">
            Send-to-Lobby Inbox
          </h1>
          <p className="text-xs text-[#525252] font-sans mt-1 max-w-2xl">
            Ingest external Instagram posts, extract strictly visible statements with Claude Vision, cross-check numeric claims against FRED/EIA/Prices, and publish to The Lobby.
          </p>
        </div>

        <button
          onClick={fetchInboxData}
          disabled={fetchingData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded text-xs font-mono text-[#0B0E12] hover:bg-[#F5F5F5] self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${fetchingData ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Ingest Form */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#0B0E12] mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#9333EA]" /> Ingest New Instagram Dispatch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Post URL */}
            <div>
              <label className="block text-xs font-mono font-semibold text-[#0B0E12] uppercase tracking-wider mb-2">
                Instagram Post URL *
              </label>
              <input
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/DB123456789/"
                className="w-full text-xs font-mono p-3 bg-[#FAF9F5] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#0B0E12]"
              />
            </div>

            {/* 2. Source Handle */}
            <div>
              <label className="block text-xs font-mono font-semibold text-[#0B0E12] uppercase tracking-wider mb-2">
                Source Account Handle *
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedHandle}
                  onChange={(e) => setSelectedHandle(e.target.value)}
                  className="text-xs font-mono p-3 bg-[#FAF9F5] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#0B0E12] flex-1"
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.handle}>
                      @{s.handle} ({s.ingest_mode})
                    </option>
                  ))}
                  <option value="custom">+ New Source Handle...</option>
                </select>

                {selectedHandle === "custom" && (
                  <input
                    type="text"
                    required
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="e.g. bloomberg"
                    className="text-xs font-mono p-3 bg-[#FAF9F5] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#0B0E12] flex-1"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 3. Screenshot Upload & Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-mono font-semibold text-[#0B0E12] uppercase tracking-wider mb-2">
                Upload Post Screenshot (Claude Vision Analysis)
              </label>
              <div className="border-2 border-dashed border-[#DEDDD8] rounded-xl p-4 text-center hover:border-[#0B0E12] transition-colors bg-[#FAF9F5]">
                {screenshotPreview ? (
                  <div className="space-y-3">
                    <img
                      src={screenshotPreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded border border-[#E5E5E5] object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotFile(null);
                        setScreenshotPreview(null);
                      }}
                      className="text-xs font-mono text-rose-600 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-6">
                    <Upload className="w-8 h-8 text-[#A3A3A3] mx-auto mb-2" />
                    <span className="text-xs font-mono text-[#525252] block">
                      Click to upload image or drag and drop
                    </span>
                    <span className="text-[10px] font-mono text-[#A3A3A3]">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#0B0E12] uppercase tracking-wider mb-2">
                Pasted Caption / Transcription (Optional fallback)
              </label>
              <textarea
                rows={7}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Paste the caption or visible copy here..."
                className="w-full text-xs font-mono p-3 bg-[#FAF9F5] border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#0B0E12] resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#737373]">
              * Strict compliance: Zero fabricated stats. Claims strictly verified or left unverified.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0B0E12] text-white rounded-lg text-xs font-mono font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing with Claude Vision &amp; Verifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Extract &amp; Cross-Check
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Extracted Intelligence Live Preview */}
      {extractedItem && (
        <div className="bg-[#FAF9F5] border-2 border-[#9333EA] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#F3E8FF] text-[#6B21A8] font-mono text-xs font-bold uppercase rounded">
                LIVE EXTRACTION PREVIEW
              </span>
              <span className="text-xs font-mono text-[#525252]">
                Status: <strong className="uppercase">{extractedItem.status}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange(extractedItem.id, "published")}
                className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-700"
              >
                Publish Now
              </button>
              <button
                onClick={() => handleStatusChange(extractedItem.id, "draft")}
                className="px-3 py-2 bg-white border border-[#E5E5E5] text-[#0B0E12] rounded text-xs font-mono uppercase hover:bg-neutral-100"
              >
                Keep as Draft
              </button>
              <button
                onClick={() => handleStatusChange(extractedItem.id, "rejected")}
                className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-xs font-mono uppercase hover:bg-rose-100"
              >
                Reject
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-1">
                  Headline
                </span>
                <h3 className="font-serif font-bold text-lg text-[#0B0E12]">
                  {extractedItem.extracted_claims.headline}
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E22CE] font-bold block mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Source Assertion (Unverified Claims)
                </span>
                <ul className="space-y-1.5 bg-[#FAF5FF] border-l-2 border-[#9333EA] p-3 rounded-r">
                  {extractedItem.extracted_claims.claims.map((claim, idx) => (
                    <li key={idx} className="text-xs text-[#3B0764] italic">
                      &ldquo;{claim}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>

              {extractedItem.verified_facts && extractedItem.verified_facts.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#15803D] font-bold block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Market Facts
                  </span>
                  <ul className="space-y-1.5 bg-[#F0FDF4] border-l-2 border-[#16A34A] p-3 rounded-r">
                    {extractedItem.verified_facts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-[#14532D]">
                        • {fact.claim}
                        <a
                          href={fact.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 font-mono text-[10px] underline text-[#15803D] inline-flex items-center gap-0.5"
                        >
                          [Source <ExternalLink className="w-2.5 h-2.5 inline" />]
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {extractedItem.extracted_claims.avorria_commentary && (
                <div className="bg-white border border-[#E5E5E5] p-3.5 rounded">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#525252] block mb-1">
                    Avorria commentary
                  </span>
                  <p className="text-xs text-[#404040]">
                    {extractedItem.extracted_claims.avorria_commentary}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block mb-2">
                  Original Source Post
                </span>
                <p className="text-xs font-mono text-[#0B0E12] break-all mb-4">
                  {extractedItem.original_url}
                </p>
                <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded text-center">
                  <span className="text-xs font-mono text-[#525252] block mb-2">
                    Official Instagram Embed Reference
                  </span>
                  <a
                    href={extractedItem.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B0E12] text-white rounded text-xs font-mono hover:bg-neutral-800"
                  >
                    View Original on Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#737373] pt-4 border-t border-[#F5F5F5]">
                Source opinion; not advice. Images not re-hosted.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Lobby Ingest Items Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#0B0E12]">
            Recent Ingest Queue ({items.length})
          </h2>
          <span className="text-xs font-mono text-[#737373]">
            {items.filter((i) => i.status === "published").length} Published
          </span>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#737373]">
            No items in the inbox yet. Use the form above to extract and verify external Instagram posts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF9F5] border-b border-[#E5E5E5] text-[10px] uppercase text-[#737373]">
                <tr>
                  <th className="p-4">Handle</th>
                  <th className="p-4">Headline</th>
                  <th className="p-4">Claims</th>
                  <th className="p-4">Verified Facts</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {items.map((item) => {
                  const hasFacts = item.verified_facts && item.verified_facts.length > 0;
                  const handleName = item.monitored_sources?.handle || "instagram";

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="p-4 whitespace-nowrap font-bold text-[#6B21A8]">
                        @{handleName}
                      </td>
                      <td className="p-4 max-w-xs font-serif text-sm font-semibold text-[#0B0E12] truncate">
                        {item.extracted_claims.headline}
                      </td>
                      <td className="p-4 text-[#525252]">
                        {item.extracted_claims.claims?.length || 0} claims
                      </td>
                      <td className="p-4">
                        {hasFacts ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            <ShieldCheck className="w-3 h-3" /> {item.verified_facts.length} verified
                          </span>
                        ) : (
                          <span className="text-[#A3A3A3] text-[10px]">None attached</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                            item.status === "published"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : item.status === "rejected"
                              ? "bg-rose-50 text-rose-800 border-rose-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExtractedItem(item)}
                            className="p-1.5 text-[#525252] hover:text-[#0B0E12] rounded hover:bg-[#E5E5E5]"
                            title="Preview item"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={item.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#2563EB] hover:text-blue-700 rounded hover:bg-blue-50"
                            title="View original"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
