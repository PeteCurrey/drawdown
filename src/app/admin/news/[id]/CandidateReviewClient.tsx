"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Sparkles,
  Save,
  Check,
  X,
  Plus,
  Trash2,
  Lock
} from "lucide-react";
import type { NewsCandidate } from "@/lib/content-os/types";

interface Props {
  candidate: NewsCandidate;
}

export function CandidateReviewClient({ candidate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Epistemic separation state
  const [sourceClaim, setSourceClaim] = useState(
    candidate.source_claim || candidate.summary || ""
  );
  const [drawdownInterpretation, setDrawdownInterpretation] = useState(
    candidate.drawdown_interpretation || ""
  );
  const [verifiedFacts, setVerifiedFacts] = useState<Array<{ claim: string; source: string; source_url?: string }>>(
    candidate.verified_facts || []
  );

  // New fact entry state
  const [newFactClaim, setNewFactClaim] = useState("");
  const [newFactSource, setNewFactSource] = useState("");
  const [newFactUrl, setNewFactUrl] = useState("");
  const [showAddFact, setShowAddFact] = useState(false);

  const handleAddFact = () => {
    if (!newFactClaim.trim()) return;
    setVerifiedFacts(prev => [
      ...prev,
      {
        claim: newFactClaim.trim(),
        source: newFactSource.trim() || "Authoritative Filing",
        source_url: newFactUrl.trim() || undefined,
      }
    ]);
    setNewFactClaim("");
    setNewFactSource("");
    setNewFactUrl("");
    setShowAddFact(false);
  };

  const handleRemoveFact = (index: number) => {
    setVerifiedFacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveEpistemic = async (overrideStatus?: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const payload: Record<string, any> = {
        source_claim: sourceClaim,
        verified_facts: verifiedFacts,
        drawdown_interpretation: drawdownInterpretation,
      };

      if (overrideStatus) {
        payload.editorial_status = overrideStatus;
        if (overrideStatus === "approved") {
          payload.verification_status = "verified";
        }
      }

      const res = await fetch(`/api/admin/news/candidate/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setFeedback(overrideStatus ? `Candidate marked as ${overrideStatus}.` : "Epistemic fields saved successfully.");
      router.refresh();
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Banner */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded ${
            candidate.editorial_status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
            candidate.editorial_status === 'ignored' ? 'bg-gray-100 text-gray-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            Status: {candidate.editorial_status}
          </span>
          {candidate.platform_post_id && (
            <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
              Platform ID: {candidate.platform_post_id}
            </span>
          )}
          {candidate.author_handle && (
            <span className="text-xs font-mono font-bold text-blue-600">
              @{candidate.author_handle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleSaveEpistemic()}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-mono font-bold bg-white border border-[#e5e7eb] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save Edits
          </button>

          {candidate.editorial_status !== 'approved' && (
            <button
              onClick={() => handleSaveEpistemic("approved")}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-mono font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" /> Approve for Lobby
            </button>
          )}

          {candidate.editorial_status !== 'ignored' && (
            <button
              onClick={() => handleSaveEpistemic("ignored")}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" /> Ignore / Suppress
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono text-blue-900 flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-blue-500 hover:text-blue-800 ml-4">✕</button>
        </div>
      )}

      {/* 3 Core Epistemic Blocks: Claim vs Fact vs Interpretation */}
      <div className="grid grid-cols-1 gap-6">
        {/* Block 1: SOURCE CLAIM */}
        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-purple-900">
                1. Source Claim (What the External Account Said)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Subjective Assertion
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mb-2 font-sans">
            Must accurately quote or capture the external account&apos;s statement without presenting it as an established fact.
          </p>
          <textarea
            rows={3}
            value={sourceClaim}
            onChange={e => setSourceClaim(e.target.value)}
            className="w-full p-3 text-sm font-sans border border-purple-200 rounded-lg focus:outline-none focus:border-purple-600 bg-purple-50/20"
            placeholder="What the investor or source claimed..."
          />
        </div>

        {/* Block 2: VERIFIED FACTS */}
        <div className="bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-900">
                2. Verified Facts (Independently Corroborated Evidence)
              </h3>
            </div>
            <button
              onClick={() => setShowAddFact(true)}
              className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded hover:bg-emerald-100 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Fact
            </button>
          </div>
          <p className="text-xs text-[#6b7280] mb-3 font-sans">
            Data verified through official filings (SEC, Companies House, Exchange disclosures, official revenue, or debt metrics).
          </p>

          {verifiedFacts.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#6b7280] italic text-center">
              No corroborating facts attached yet. Click &quot;Add Fact&quot; to corroborate with regulatory filings or announcements.
            </div>
          ) : (
            <ul className="space-y-2">
              {verifiedFacts.map((fact, idx) => (
                <li key={idx} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg flex items-start justify-between gap-3">
                  <div className="text-xs text-[#1A1A1A]">
                    <div className="font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{fact.claim}</span>
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-[#6b7280] flex items-center gap-2">
                      <span>Source: {fact.source}</span>
                      {fact.source_url && (
                        <a href={fact.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5">
                          Link <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFact(idx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Remove Fact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showAddFact && (
            <div className="mt-3 p-4 bg-emerald-50/30 border border-emerald-300 rounded-lg space-y-3 animate-in fade-in">
              <h4 className="text-xs font-mono font-bold uppercase text-emerald-800">Add Corroborating Fact</h4>
              <div>
                <input
                  type="text"
                  placeholder="Verified fact (e.g. Q2 Revenue was $2.4B, Up 14% YoY per SEC 10-Q)"
                  value={newFactClaim}
                  onChange={e => setNewFactClaim(e.target.value)}
                  className="w-full p-2 text-xs border border-emerald-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Source Name (e.g. SEC Filing, Press Release)"
                  value={newFactSource}
                  onChange={e => setNewFactSource(e.target.value)}
                  className="p-2 text-xs border border-emerald-300 rounded focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="url"
                  placeholder="Source URL"
                  value={newFactUrl}
                  onChange={e => setNewFactUrl(e.target.value)}
                  className="p-2 text-xs border border-emerald-300 rounded focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFact(false)}
                  className="px-3 py-1 text-xs text-[#6b7280]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFact}
                  className="px-3 py-1 bg-emerald-700 text-white rounded text-xs font-bold"
                >
                  Confirm Fact
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Block 3: DRAWDOWN INTERPRETATION */}
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-blue-900">
                3. Drawdown Interpretation (Neutral Analytical Synthesis)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Institutional Context
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mb-2 font-sans">
            Drawdown&apos;s neutral synthesis explaining why traders and risk managers are paying attention, without recommending action.
          </p>
          <textarea
            rows={3}
            value={drawdownInterpretation}
            onChange={e => setDrawdownInterpretation(e.target.value)}
            className="w-full p-3 text-sm font-sans border border-blue-200 rounded-lg focus:outline-none focus:border-blue-600 bg-blue-50/20"
            placeholder="Explain why this account is highlighting this subject, what market catalysts exist..."
          />
        </div>
      </div>
    </div>
  );
}
