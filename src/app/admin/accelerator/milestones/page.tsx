"use client";

import { useState, useEffect } from "react";
import { 
  getAcceleratorAdminDashboardAction, 
  gradeAcceleratorMilestoneAction 
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { 
  Loader2, 
  AlertCircle, 
  Inbox, 
  CheckCircle2, 
  Eye, 
  FileText, 
  Check, 
  X, 
  Filter, 
  RefreshCw,
  Clock,
  ExternalLink
} from "lucide-react";

export default function AdminAcceleratorMilestonesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allMilestones, setAllMilestones] = useState<any[]>([]);
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [weekFilter, setWeekFilter] = useState("all");

  // Side Drawer Review state
  const [activeReview, setActiveReview] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorAdminDashboardAction();
      if (!res.success) {
        setError(res.error || "Failed to load milestone queue.");
        return;
      }
      setAllMilestones(res.allMilestones || []);
      setEnrolments(res.enrolments || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGradeSubmit = async (status: "cleared" | "needs_resubmission") => {
    if (!activeReview) return;
    if (!reviewNotes.trim()) {
      alert("Please provide clinical review notes for the student.");
      return;
    }

    setSubmittingGrade(true);
    try {
      const res = await gradeAcceleratorMilestoneAction(activeReview.id, status, reviewNotes);
      if (res.success) {
        setActiveReview(null);
        setReviewNotes("");
        await loadData();
      } else {
        alert(res.error || "Failed to submit milestone grade.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting grade.");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const enrolmentMap = new Map(enrolments.map((e: any) => [e.id, e]));

  // Combine milestones with enrolment + profile
  const enrichedMilestones = allMilestones.map((m: any) => ({
    ...m,
    enrolment: enrolmentMap.get(m.enrolment_id)
  }));

  const filteredMilestones = enrichedMilestones.filter((m: any) => {
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesWeek = weekFilter === "all" || m.week_number === Number(weekFilter);
    return matchesStatus && matchesWeek;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING MILESTONE QUEUE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AcceleratorSubNav />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
            // CLINICAL EVALUATION QUEUE
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900 flex items-center gap-3">
            <Inbox className="w-7 h-7 text-orange-500" />
            Milestones Review Queue
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Inspect student deliverables, verifyPine Script code and expected value spreadsheets, and issue stage clearances.
          </p>
        </div>

        <button 
          onClick={loadData}
          className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-mono text-[10px] flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          FORCE REFRESH
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <select 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="submitted">Pending Review Only (Status: Submitted)</option>
            <option value="cleared">Cleared Submissions</option>
            <option value="needs_resubmission">Needs Resubmission</option>
            <option value="all">All Milestone Records</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
          >
            <option value="all">All Curriculum Weeks (1 - 6)</option>
            {[1, 2, 3, 4, 5, 6].map(w => (
              <option key={w} value={w}>Week {w} Deliverables</option>
            ))}
          </select>
        </div>
      </div>

      {/* MILESTONES TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="p-4">// Student</th>
                <th className="p-4">// Week</th>
                <th className="p-4">// Status</th>
                <th className="p-4">// Submitted At</th>
                <th className="p-4">// Deliverable</th>
                <th className="p-4 text-right">// Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {filteredMilestones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-mono">
                    No milestone submissions match selected filters.
                  </td>
                </tr>
              ) : (
                filteredMilestones.map((m: any) => (
                  <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-sans font-bold text-neutral-900">{m.enrolment?.profile?.display_name || "Anonymous Student"}</p>
                        <p className="text-[10px] text-neutral-400">{m.enrolment?.profile?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Week {m.week_number}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold font-mono tracking-wider ${
                        m.status === "cleared" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : m.status === "needs_resubmission" 
                          ? "bg-red-50 text-red-700 border border-red-200" 
                          : "bg-orange-50 text-orange-700 border border-orange-200 animate-pulse"
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500">
                      {m.submitted_at ? new Date(m.submitted_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-4 text-[10px] text-neutral-500">
                      {m.submission_content?.file_name ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{m.submission_content.file_name}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">Text Notes Only</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => {
                          setActiveReview(m);
                          setReviewNotes(m.review_notes || "");
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] rounded-lg transition-colors inline-flex items-center gap-1.5 uppercase font-bold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Evaluate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOAT REVIEW DRAWER */}
      {activeReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-2xl bg-neutral-950 text-neutral-200 min-h-screen shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
              <div>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-0.5">// STUDENT MILESTONE DOSSIER AUDIT</span>
                <h3 className="text-base font-bold uppercase text-white tracking-wide">
                  Evaluate Week {activeReview.week_number} Submission
                </h3>
              </div>
              <button 
                onClick={() => { setActiveReview(null); setReviewNotes(""); }}
                className="p-1.5 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 flex-grow overflow-y-auto space-y-6">
              {/* Profile card */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// STUDENT MEMBER</p>
                  <p className="text-xs font-bold text-white mt-1">{activeReview.enrolment?.profile?.display_name || "Anonymous"}</p>
                  <p className="text-[10px] font-mono text-neutral-400">{activeReview.enrolment?.profile?.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// SUBMITTED AT</p>
                  <p className="text-xs font-bold text-white mt-1">
                    {activeReview.submitted_at ? new Date(activeReview.submitted_at).toLocaleDateString() : "-"}
                  </p>
                  <p className="text-[10px] font-mono text-neutral-400">
                    {activeReview.submitted_at ? `@ ${new Date(activeReview.submitted_at).toLocaleTimeString()}` : ""}
                  </p>
                </div>
              </div>

              {/* Text notes content */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// Student Submission Notes</span>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 font-mono text-xs text-neutral-100 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                  {activeReview.submission_content?.text || "No brief content submitted."}
                </div>
              </div>

              {/* File download attachment */}
              {activeReview.submission_content?.file_url && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Source Script / Deliverable Attachment</p>
                      <p className="text-[10px] font-mono text-neutral-400 mt-0.5">Filename: {activeReview.submission_content.file_name}</p>
                    </div>
                  </div>
                  <a 
                    href={activeReview.submission_content.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-1.5 border border-neutral-700 transition-colors"
                  >
                    <span>Download</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Pete's Reviewer Grading Form */}
              <div className="pt-6 border-t border-neutral-800 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Pete&apos;s Clinical Review Notes</label>
                  <textarea 
                    rows={6}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-lg p-3 text-xs text-white font-mono focus:outline-none resize-none"
                    placeholder="Provide professional instruction, specific feedback recommendations, and clinical evaluations here..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGradeSubmit("needs_resubmission")}
                disabled={submittingGrade}
                className="w-full py-3 bg-transparent hover:bg-red-950/20 text-red-400 hover:text-red-300 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-900/40 hover:border-red-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingGrade ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>REQUEST AMENDMENTS</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleGradeSubmit("cleared")}
                disabled={submittingGrade}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] cursor-pointer"
              >
                {submittingGrade ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>CLEAR & ADVANCE STAGE</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
