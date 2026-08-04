"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  getSingleStudentDetailsAction, 
  gradeAcceleratorMilestoneAction,
  updateEnrolmentAction
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { createClient } from "@/lib/supabase/client";
import { 
  Loader2, 
  AlertCircle, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Check, 
  X, 
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  Layers
} from "lucide-react";

export default function SingleStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: enrolmentId } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [enrolment, setEnrolment] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [weeks, setWeeks] = useState<any[]>([]);

  // Inline grading state
  const [activeWeekGrading, setActiveWeekGrading] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState<boolean>(false);

  // Workshop scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    topic: "",
    meetingUrl: "",
    scheduledAt: ""
  });

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSingleStudentDetailsAction(enrolmentId);
      if (!res.success) {
        setError(res.error || "Failed to load student details.");
        return;
      }

      setEnrolment(res.enrolment);
      setProfile(res.profile);
      setMilestones(res.milestones || []);
      setSessions(res.sessions || []);
      setWeeks(res.weeks || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [enrolmentId]);

  const handleGradeSubmit = async (weekNumber: number, status: "cleared" | "needs_resubmission") => {
    const milestone = milestones.find(m => m.week_number === weekNumber);
    if (!milestone) return;

    if (!reviewNotes.trim()) {
      alert("Please provide reviewer feedback notes for the student.");
      return;
    }

    setSubmittingGrade(true);
    try {
      const res = await gradeAcceleratorMilestoneAction(milestone.id, status, reviewNotes);
      if (res.success) {
        setActiveWeekGrading(null);
        setReviewNotes("");
        await loadStudentData();
      } else {
        alert(res.error || "Failed to grade milestone.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting grade.");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.topic || !sessionForm.scheduledAt) {
      alert("Topic and scheduled date/time are required.");
      return;
    }

    setSubmittingSession(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await (supabase
        .from("accelerator_personal_sessions") as any)
        .insert({
          enrolment_id: enrolmentId,
          topic: sessionForm.topic,
          meeting_url: sessionForm.meetingUrl || null,
          scheduled_at: new Date(sessionForm.scheduledAt).toISOString(),
          status: "scheduled"
        });

      if (insertError) {
        alert("Database error: " + insertError.message);
      } else {
        setShowScheduleModal(false);
        setSessionForm({ topic: "", meetingUrl: "", scheduledAt: "" });
        await loadStudentData();
      }
    } catch (err: any) {
      alert(err.message || "Error scheduling session.");
    } finally {
      setSubmittingSession(false);
    }
  };

  const handleWeekChange = async (newWeek: number) => {
    try {
      const res = await updateEnrolmentAction(enrolmentId, { currentWeek: newWeek });
      if (res.success) {
        await loadStudentData();
      } else {
        alert(res.error || "Failed to update progression week.");
      }
    } catch (err: any) {
      alert(err.message || "Error updating week.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING STUDENT DOSSIER...</p>
        </div>
      </div>
    );
  }

  if (error || !enrolment) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-bold">Error Loading Dossier</h4>
            <p className="text-xs">{error || "Student enrolment record not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AcceleratorSubNav />

      {/* TOP BAR */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <Link 
          href="/admin/accelerator/students"
          className="text-xs font-mono text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Roster</span>
        </Link>
        <button 
          onClick={loadStudentData}
          className="px-3.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-mono text-[10px] flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH DOSSIER
        </button>
      </div>

      {/* STUDENT HEADER CARD */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1 border-r border-neutral-100 pr-6">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">// STUDENT PROFILE</span>
          <h2 className="text-xl font-bold text-neutral-900">{profile?.display_name || "Anonymous Trader"}</h2>
          <p className="text-xs font-mono text-neutral-500">{profile?.email}</p>
          <div className="pt-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold font-mono ${
              enrolment.payment_status === "paid" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            }`}>
              Payment: {enrolment.payment_status}
            </span>
          </div>
        </div>

        <div className="space-y-1 border-r border-neutral-100 pr-6">
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">// COHORT & PROGRESSION</span>
          <p className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{enrolment.cohort?.name || "Standard Cohort"}</span>
          </p>
          <p className="text-xs text-neutral-500 font-mono">Enrolled: {new Date(enrolment.enrolled_at).toLocaleDateString()}</p>
          
          <div className="pt-2 flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-neutral-700">Current Week:</span>
            <select 
              value={enrolment.current_week}
              onChange={(e) => handleWeekChange(Number(e.target.value))}
              className="bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5 text-xs font-mono font-bold"
            >
              {[1, 2, 3, 4, 5, 6].map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">// QUICK ACTIONS</span>
            <p className="text-xs text-neutral-500 mt-1">Schedule a 1:1 coaching clinic or workshop session for this student.</p>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors cursor-pointer w-full justify-center"
          >
            <Calendar className="w-4 h-4" />
            SCHEDULE 1-ON-1 CLINIC
          </button>
        </div>
      </div>

      {/* 6-WEEK CURRICULUM PROGRESSION DOSSIER */}
      <section className="space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          // 6-WEEK MILESTONE DOSSIER & PROGRESSION
        </h3>

        <div className="space-y-4">
          {weeks.map((w: any) => {
            const milestone = milestones.find(m => m.week_number === w.week_number);
            const isUnlocked = w.week_number <= enrolment.current_week;
            const isGradingThis = activeWeekGrading === w.week_number;

            let statusBadge = (
              <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-400 border border-neutral-200">
                Locked (Stage {w.week_number})
              </span>
            );

            if (milestone) {
              if (milestone.status === "cleared") {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cleared</span>
                  </span>
                );
              } else if (milestone.status === "needs_resubmission") {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    <span>Needs Resubmission</span>
                  </span>
                );
              } else if (milestone.status === "submitted") {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" />
                    <span>Submitted (Awaiting Review)</span>
                  </span>
                );
              }
            } else if (isUnlocked) {
              statusBadge = (
                <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  Unlocked & Active
                </span>
              );
            }

            return (
              <div 
                key={w.week_number} 
                className={`bg-white border rounded-xl p-6 transition-all ${
                  milestone?.status === "submitted" 
                    ? "border-orange-300 shadow-sm" 
                    : isUnlocked 
                    ? "border-neutral-200" 
                    : "border-neutral-100 opacity-70"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-md">
                        WEEK {w.week_number}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900">{w.title}</h4>
                      {statusBadge}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 italic">&quot;{w.quote}&quot;</p>
                  </div>

                  {milestone && (
                    <button
                      onClick={() => {
                        if (isGradingThis) {
                          setActiveWeekGrading(null);
                        } else {
                          setActiveWeekGrading(w.week_number);
                          setReviewNotes(milestone.review_notes || "");
                        }
                      }}
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isGradingThis ? "CLOSE EVALUATOR" : "EVALUATE SUBMISSION"}</span>
                    </button>
                  )}
                </div>

                {/* MILESTONE SUBMISSION DETAILS */}
                {milestone ? (
                  <div className="mt-4 space-y-4">
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 font-mono text-xs space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-neutral-400">
                        <span>SUBMITTED AT: {new Date(milestone.submitted_at).toLocaleString()}</span>
                        {milestone.submission_content?.file_name && (
                          <a 
                            href={milestone.submission_content.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Attachment: {milestone.submission_content.file_name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-neutral-800 whitespace-pre-wrap font-sans text-xs">
                        {milestone.submission_content?.text || "No written notes attached."}
                      </p>
                    </div>

                    {/* EXISTING REVIEW NOTES IF GRADED */}
                    {milestone.review_notes && !isGradingThis && (
                      <div className="bg-neutral-900 text-neutral-200 rounded-lg p-4 font-mono text-xs space-y-1">
                        <span className="text-[9px] text-emerald-400 uppercase tracking-widest block">// PETE&apos;S REVIEW REMARKS</span>
                        <p className="whitespace-pre-wrap font-sans">{milestone.review_notes}</p>
                      </div>
                    )}

                    {/* INLINE GRADING PANEL */}
                    {isGradingThis && (
                      <div className="bg-neutral-950 text-white rounded-xl p-5 space-y-4 border border-neutral-800">
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">
                          // CLINICAL MILESTONE EVALUATION FORM
                        </span>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400">Review Remarks & Feedback to Student:</label>
                          <textarea 
                            rows={4}
                            required
                            className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-lg p-3 text-xs font-mono text-white focus:outline-none resize-none"
                            placeholder="Enter specific feedback, adjustments required, or clearance approval notes..."
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            onClick={() => handleGradeSubmit(w.week_number, "needs_resubmission")}
                            disabled={submittingGrade}
                            className="px-4 py-2 border border-red-800 text-red-400 hover:bg-red-950/40 rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>REQUEST AMENDMENTS</span>
                          </button>

                          <button 
                            onClick={() => handleGradeSubmit(w.week_number, "cleared")}
                            disabled={submittingGrade}
                            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>CLEAR MILESTONE & ADVANCE</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-neutral-400 font-mono">
                    {isUnlocked ? "// AWAITING STUDENT DELIVERABLE SUBMISSION" : "// LOCKED STAGE"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SCHEDULED WORKSHOPS & 1:1 CLINICS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            // SCHEDULED WORKSHOPS & CLINICS ({sessions.length})
          </h3>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="text-xs font-mono text-emerald-600 hover:underline flex items-center gap-1 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-3">
          {sessions.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-6 font-mono">// ZERO CLINICS SCHEDULED FOR THIS STUDENT</p>
          ) : (
            sessions.map((s: any) => (
              <div key={s.id} className="border border-neutral-100 rounded-lg p-4 flex justify-between items-center gap-4">
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 uppercase">{s.topic}</h5>
                  <p className="text-[10px] font-mono text-neutral-500 mt-1">
                    Scheduled: {new Date(s.scheduled_at).toLocaleString()}
                  </p>
                </div>
                {s.meeting_url && (
                  <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <span>Join Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* SCHEDULE WORKSHOP MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">Schedule 1-on-1 Clinic Session</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSession} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Target Student</label>
                <input 
                  type="text"
                  disabled
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 font-sans font-bold text-neutral-700"
                  value={`${profile?.display_name || "Student"} (${profile?.email})`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Clinic Topic / Objective</label>
                <input 
                  type="text"
                  required
                  placeholder="E.g. Pine Script Debugging & Risk Matrix Review"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans"
                  value={sessionForm.topic}
                  onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Date & Time</label>
                  <input 
                    type="datetime-local"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                    value={sessionForm.scheduledAt}
                    onChange={(e) => setSessionForm({ ...sessionForm, scheduledAt: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Meeting Room URL (Zoom/Meet)</label>
                  <input 
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 font-sans"
                    value={sessionForm.meetingUrl}
                    onChange={(e) => setSessionForm({ ...sessionForm, meetingUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={submittingSession}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold flex items-center gap-2"
                >
                  {submittingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>PUBLISH SESSION</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
