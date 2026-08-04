"use client";

import { useState, useEffect } from "react";
import { 
  getAcceleratorAdminDashboardAction, 
  gradeAcceleratorMilestoneAction 
} from "@/app/actions/accelerator-actions";
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Layers, 
  Clock, 
  X, 
  Check, 
  Eye, 
  Calendar, 
  FileText, 
  Send, 
  ExternalLink,
  Plus,
  RefreshCw,
  TrendingUp,
  Inbox
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminAcceleratorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Administrative stats & data
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [pendingMilestones, setPendingMilestones] = useState<any[]>([]);
  const [allMilestones, setAllMilestones] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // UI state - Side Review Drawer
  const [activeReview, setActiveReview] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState<boolean>(false);

  // UI state - Create personal session/workshop
  const [schedulingSession, setSchedulingSession] = useState<boolean>(false);
  const [sessionForm, setSessionForm] = useState({
    enrolmentId: "",
    topic: "",
    meetingUrl: "",
    scheduledAt: ""
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorAdminDashboardAction();
      if (!res.success) {
        setError(res.error || "Failed to load admin controls.");
        return;
      }

      setCohorts(res.cohorts || []);
      setEnrolments(res.enrolments || []);
      setPendingMilestones(res.pendingMilestones || []);
      setAllMilestones(res.allMilestones || []);
      setSessions(res.sessions || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleGradeSubmit = async (status: "cleared" | "needs_resubmission") => {
    if (!activeReview) return;
    if (!reviewNotes.trim()) {
      alert("Please provide review notes for the student.");
      return;
    }

    setSubmittingGrade(true);
    try {
      const res = await gradeAcceleratorMilestoneAction(activeReview.id, status, reviewNotes);
      if (res.success) {
        setActiveReview(null);
        setReviewNotes("");
        await loadAdminData();
      } else {
        alert(res.error || "Failed to submit milestone grade.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting grade.");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.enrolmentId || !sessionForm.topic || !sessionForm.scheduledAt) {
      alert("Enrolment, Topic, and Scheduled Date/Time are required.");
      return;
    }

    setSchedulingSession(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await (supabase
        .from("accelerator_personal_sessions") as any)
        .insert({
          enrolment_id: sessionForm.enrolmentId,
          topic: sessionForm.topic,
          meeting_url: sessionForm.meetingUrl || null,
          scheduled_at: new Date(sessionForm.scheduledAt).toISOString(),
          status: "scheduled"
        });

      if (insertError) {
        alert("Database error: " + insertError.message);
      } else {
        setSessionForm({ enrolmentId: "", topic: "", meetingUrl: "", scheduledAt: "" });
        await loadAdminData();
        alert("Session scheduled and published successfully.");
      }
    } catch (err: any) {
      alert(err.message || "Error scheduling session.");
    } finally {
      setSchedulingSession(false);
    }
  };

  const getStudentMilestone = (enrolmentId: string, weekNum: number) => {
    return allMilestones.find(m => m.enrolment_id === enrolmentId && m.week_number === weekNum);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 py-24 min-h-[500px]">
        <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING ADMIN PLATFORM CORE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="font-bold">Error Loading Workspace</h4>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
            // CLINICAL OVERSIGHT CONSOLE
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900">
            Institutional Accelerator
          </h1>
          <p className="text-xs text-neutral-500">
            Manage cohort milestones, student development matrices, and coaching session endpoints.
          </p>
        </div>

        <button 
          onClick={loadAdminData}
          className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-mono text-[10px] flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          FORCE SYNC FEED
        </button>
      </div>

      {/* ADMIN STAT STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider">// ENROLLED COHORT</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900">{enrolments.filter(e => e.payment_status === "paid").length}</p>
          <p className="text-[9px] font-mono text-neutral-400 mt-1">Paid & Active Students</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider">// REVIEW QUEUE</span>
            <Inbox className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-orange-500">{pendingMilestones.length}</p>
          <p className="text-[9px] font-mono text-neutral-400 mt-1">Submissions Awaiting Grading</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider">// ACTIVE COHORTS</span>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900">{cohorts.length}</p>
          <p className="text-[9px] font-mono text-neutral-400 mt-1">Operational Cohort Segments</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[9px] font-mono uppercase tracking-wider">// WORKSHOPS</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-900">{sessions.length}</p>
          <p className="text-[9px] font-mono text-neutral-400 mt-1">Published coaching clinics</p>
        </div>
      </section>

      {/* MILESTONE OBLIGATIONS QUEUE (PENDING REVIEW) */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          // Pending Milestone Reviews ({pendingMilestones.length})
        </h3>

        {pendingMilestones.length === 0 ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center text-neutral-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
            <p className="text-xs font-mono uppercase tracking-widest">// ALL MILESTONES REVIEWED // ZERO OBLIGATIONS</p>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-4">// Student</th>
                    <th className="p-4">// Week</th>
                    <th className="p-4">// Submitted At</th>
                    <th className="p-4">// Attached Deliverable</th>
                    <th className="p-4 text-right">// Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {pendingMilestones.map((m: any) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-neutral-900">{m.enrolment?.profile?.display_name || "Anonymous Trader"}</p>
                          <p className="text-[10px] font-mono text-neutral-400">{m.enrolment?.profile?.email || "no-email@drawdown.trading"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Week {m.week_number}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-500 font-mono">
                        {new Date(m.submitted_at).toLocaleDateString()} @ {new Date(m.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-neutral-500">
                        {m.submission_content?.file_name ? (
                          <div className="flex items-center gap-1.5 text-accent font-bold">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{m.submission_content.file_name}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400">Text Notes Only</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setActiveReview(m)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] rounded-lg transition-colors inline-flex items-center gap-1.5 uppercase font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Evaluate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* COHORT PROGRESS MATRIX GRID */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          // COHORT DEVELOPMENT MATRIX
        </h3>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                  <th className="p-4 w-1/4">// Student Profile</th>
                  <th className="p-4 text-center">W1</th>
                  <th className="p-4 text-center">W2</th>
                  <th className="p-4 text-center">W3</th>
                  <th className="p-4 text-center">W4</th>
                  <th className="p-4 text-center">W5</th>
                  <th className="p-4 text-center">W6</th>
                  <th className="p-4 text-right w-1/6">// Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {enrolments.filter(e => e.payment_status === "paid").map((e: any) => (
                  <tr key={e.id} className="hover:bg-neutral-50/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-sans font-bold text-neutral-900">{e.profile?.display_name || "Anonymous Trader"}</p>
                        <p className="text-[10px] text-neutral-400">{e.profile?.email}</p>
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((weekNum) => {
                      const m = getStudentMilestone(e.id, weekNum);
                      let content = <span className="text-neutral-300">-</span>;

                      if (m) {
                        if (m.status === "cleared") {
                          content = (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-50 text-green-600 border border-green-200" title="Milestone Cleared">
                              ✓
                            </span>
                          );
                        } else if (m.status === "needs_resubmission") {
                          content = (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-50 text-red-600 border border-red-200" title="Needs Resubmission">
                              !
                            </span>
                          );
                        } else if (m.status === "submitted") {
                          content = (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 animate-pulse font-bold" title="Awaiting Review">
                              ?
                            </span>
                          );
                        }
                      } else if (weekNum === e.current_week) {
                        content = (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-bold animate-pulse text-[10px]">
                            {weekNum}
                          </span>
                        );
                      }

                      return (
                        <td key={weekNum} className="p-4 text-center">
                          {content}
                        </td>
                      );
                    })}
                    <td className="p-4 text-right font-bold text-neutral-700">
                      Week {e.current_week} / 6
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WORKSHOP & COACHING CLINIC SCHEDULER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduler Form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 pb-3 border-b border-neutral-100">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Schedule Cohort Workshop</h4>
          </div>

          <form onSubmit={handleScheduleSession} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Target Student Enrolment</label>
              <select 
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                value={sessionForm.enrolmentId}
                onChange={(e) => setSessionForm({ ...sessionForm, enrolmentId: e.target.value })}
              >
                <option value="">-- Select Active Student --</option>
                {enrolments.filter(e => e.payment_status === "paid").map((e: any) => (
                  <option key={e.id} value={e.id}>
                    {e.profile?.display_name || "Anonymous"} ({e.profile?.email}) - Week {e.current_week}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Clinic / Session Topic</label>
              <input 
                type="text"
                required
                placeholder="E.g. Pine Script Debugging & Strategy Refinement"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Scheduled Date / Time</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2"
                  value={sessionForm.scheduledAt}
                  onChange={(e) => setSessionForm({ ...sessionForm, scheduledAt: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Meeting Room URL (Zoom/Meet)</label>
                <input 
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                  value={sessionForm.meetingUrl}
                  onChange={(e) => setSessionForm({ ...sessionForm, meetingUrl: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={schedulingSession}
              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {schedulingSession ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PUBLISHING SESSION ENDPOINT...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>PUBLISH WORKSHOP MEETING</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing / Past Scheduled Sessions */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 pb-3 border-b border-neutral-100">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Upcoming Cohort Workshops</h4>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-12 font-mono">// ZERO WORKSHOPS SCHEDULED // INDEX EMPTY</p>
            ) : (
              sessions.map((s: any) => (
                <div key={s.id} className="border border-neutral-100 rounded-lg p-3 flex justify-between items-start gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 uppercase">{s.topic}</h5>
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">
                      Student: {s.enrolment?.profile?.display_name || "Anonymous"} ({s.enrolment?.profile?.email})
                    </p>
                    <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      Schedule: {new Date(s.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                  {s.meeting_url && (
                    <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="p-1 text-neutral-400 hover:text-accent border border-transparent hover:border-neutral-100 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FLOAT REVIEW DRAWER / SHEET */}
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
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// STUDENT COHORT MEMBER</p>
                  <p className="text-xs font-bold text-white mt-1">{activeReview.enrolment?.profile?.display_name || "Anonymous"}</p>
                  <p className="text-[10px] font-mono text-neutral-400">{activeReview.enrolment?.profile?.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// QUEUE SLOT TIMESTAMP</p>
                  <p className="text-xs font-bold text-white mt-1">{new Date(activeReview.submitted_at).toLocaleDateString()}</p>
                  <p className="text-[10px] font-mono text-neutral-400">@ {new Date(activeReview.submitted_at).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Text notes content */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">// Submitter Documentation Notes</span>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 font-mono text-xs text-neutral-100 whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
                  {activeReview.submission_content?.text || "No brief content submitted."}
                </div>
              </div>

              {/* File download attachment */}
              {activeReview.submission_content?.file_url && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent" />
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

              {/* Pete's Clinician Grading Form */}
              <div className="pt-6 border-t border-neutral-800 space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Pete&apos;s Reviewer Clinical Notes</label>
                  <textarea 
                    rows={6}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-accent rounded-lg p-3 text-xs text-white font-mono focus:outline-none resize-none"
                    placeholder="Provide professional instruction, specific feedback recommendations, and clinical evaluations here..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                  <p className="text-[9px] font-mono text-neutral-500">// Your remarks will be dispatched immediately via automated secure emails and saved to their active student profile database.</p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGradeSubmit("needs_resubmission")}
                disabled={submittingGrade}
                className="w-full py-3 bg-transparent hover:bg-red-950/20 text-red-400 hover:text-red-300 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-900/40 hover:border-red-900 flex items-center justify-center gap-2"
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
                className="w-full py-3 bg-accent hover:bg-accent-hover text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(24,184,128,0.2)]"
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
