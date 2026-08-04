"use client";

import { useState, useEffect } from "react";
import { 
  getAcceleratorAdminDashboardAction 
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { createClient } from "@/lib/supabase/client";
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  Plus, 
  Clock, 
  ExternalLink, 
  Check, 
  Trash2,
  RefreshCw
} from "lucide-react";

export default function AdminAcceleratorSessionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // Form state
  const [schedulingSession, setSchedulingSession] = useState<boolean>(false);
  const [sessionForm, setSessionForm] = useState({
    enrolmentId: "",
    topic: "",
    meetingUrl: "",
    scheduledAt: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorAdminDashboardAction();
      if (!res.success) {
        setError(res.error || "Failed to load workshops.");
        return;
      }
      setEnrolments(res.enrolments || []);
      setSessions(res.sessions || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        await loadData();
        alert("Session scheduled and published successfully.");
      }
    } catch (err: any) {
      alert(err.message || "Error scheduling session.");
    } finally {
      setSchedulingSession(false);
    }
  };

  const handleToggleStatus = async (sessionId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "scheduled" : "completed";
    try {
      const supabase = createClient();
      await (supabase
        .from("accelerator_personal_sessions") as any)
        .update({ status: nextStatus })
        .eq("id", sessionId);

      await loadData();
    } catch (err: any) {
      alert("Error updating session status.");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this scheduled session?")) return;
    try {
      const supabase = createClient();
      await (supabase
        .from("accelerator_personal_sessions") as any)
        .delete()
        .eq("id", sessionId);

      await loadData();
    } catch (err: any) {
      alert("Error deleting session.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING WORKSHOP SCHEDULER...</p>
        </div>
      </div>
    );
  }

  const activePaidEnrolments = enrolments.filter(e => e.payment_status === "paid");

  return (
    <div className="space-y-8">
      <AcceleratorSubNav />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
            // CLINIC & WORKSHOP ENDPOINTS
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-purple-600" />
            Workshops & 1:1 Clinics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Schedule live Zoom/Google Meet coaching workshops,Pine Script review clinics, and 1-on-1 development sessions.
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

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduler Form */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 pb-3 border-b border-neutral-100">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Schedule Workshop / Clinic</h4>
          </div>

          <form onSubmit={handleScheduleSession} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400">Target Student Enrolment</label>
              <select 
                required
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans"
                value={sessionForm.enrolmentId}
                onChange={(e) => setSessionForm({ ...sessionForm, enrolmentId: e.target.value })}
              >
                <option value="">-- Select Active Student --</option>
                {activePaidEnrolments.map((e: any) => (
                  <option key={e.id} value={e.id}>
                    {e.profile?.display_name || "Anonymous"} ({e.profile?.email}) - Week {e.current_week}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400">Clinic / Session Topic</label>
              <input 
                type="text"
                required
                placeholder="E.g. Pine Script Debugging & Strategy Refinement"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Scheduled Date / Time</label>
                <input 
                  type="datetime-local"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2"
                  value={sessionForm.scheduledAt}
                  onChange={(e) => setSessionForm({ ...sessionForm, scheduledAt: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Meeting Room URL (Zoom/Meet)</label>
                <input 
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans"
                  value={sessionForm.meetingUrl}
                  onChange={(e) => setSessionForm({ ...sessionForm, meetingUrl: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={schedulingSession}
              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {schedulingSession ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PUBLISHING SESSION...</span>
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
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 pb-3 border-b border-neutral-100">
            <Clock className="w-4 h-4 text-neutral-500" />
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold">Scheduled Sessions ({sessions.length})</h4>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-12 font-mono">// ZERO WORKSHOPS SCHEDULED // INDEX EMPTY</p>
            ) : (
              sessions.map((s: any) => (
                <div key={s.id} className="border border-neutral-100 rounded-lg p-3.5 flex justify-between items-start gap-4 hover:border-neutral-200 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-neutral-900 uppercase">{s.topic}</h5>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        s.status === "completed" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 mt-1">
                      Student: {s.enrolment?.profile?.display_name || "Anonymous"} ({s.enrolment?.profile?.email})
                    </p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                      Scheduled: {new Date(s.scheduled_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {s.meeting_url && (
                      <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-neutral-400 hover:text-purple-600 border border-transparent hover:border-neutral-200 rounded-lg" title="Open Meeting Room">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleToggleStatus(s.id, s.status)}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold ${
                        s.status === "completed" 
                          ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" 
                          : "border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50"
                      }`}
                      title={s.status === "completed" ? "Mark as Scheduled" : "Mark as Completed"}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSession(s.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 border border-transparent hover:border-red-100 rounded-lg"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
