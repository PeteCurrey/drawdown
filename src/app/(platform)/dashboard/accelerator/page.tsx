"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  getAcceleratorStudentDashboardAction, 
  submitAcceleratorMilestoneAction 
} from "@/app/actions/accelerator-actions";
import { 
  Play, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Calendar, 
  Upload, 
  FileText, 
  AlertCircle, 
  Award, 
  Terminal, 
  ArrowRight, 
  Check, 
  Loader2, 
  Sparkles, 
  RefreshCw,
  TrendingUp,
  User,
  Clock,
  ExternalLink
} from "lucide-react";

export default function AcceleratorWorkspacePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard state
  const [enrolment, setEnrolment] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  
  // UI states
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [submittingWeek, setSubmittingWeek] = useState<number | null>(null);
  const [textSubmission, setTextSubmission] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Pitch/Unenrolled states
  const [notEnrolled, setNotEnrolled] = useState<boolean>(false);
  const [activeSeats, setActiveSeats] = useState<number>(12); // Simulated count from database or default
  const [submittingApplication, setSubmittingApplication] = useState<boolean>(false);
  const [appSuccess, setAppSuccess] = useState<boolean>(false);
  const [appForm, setAppAppForm] = useState({
    fullName: "",
    email: "",
    experienceLevel: "intermediate",
    tradingCapital: "50k_100k",
    motivation: ""
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorStudentDashboardAction();
      
      if (!res.success) {
        if (res.notEnrolled) {
          setNotEnrolled(true);
          // Query active seats for dynamic check
          const supabase = createClient();
          const { count } = await supabase
            .from("accelerator_enrolments")
            .select("*", { count: "exact", head: true })
            .eq("payment_status", "paid");
          
          if (count !== null) {
            setActiveSeats(count);
          }
        } else {
          setError(res.error || "Failed to load Accelerator workstation.");
        }
        return;
      }

      setEnrolment(res.enrolment);
      setWeeks(res.weeks || []);
      setMilestones(res.milestones || []);
      setSessions(res.sessions || []);
      
      // Auto-expand the active week
      if (res.enrolment?.current_week) {
        setExpandedWeek(res.enrolment.current_week);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApplication(true);
    try {
      // Dynamic import of application submit action
      const { submitAcceleratorApplicationAction } = await import("@/app/actions/accelerator-actions");
      const res = await submitAcceleratorApplicationAction(appForm);
      if (res.success) {
        setAppSuccess(true);
      } else {
        alert(res.error || "Failed to submit application.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting application.");
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleMilestoneSubmit = async (weekNumber: number) => {
    if (!textSubmission.trim() && !selectedFile) {
      alert("Please provide either a text response or a file attachment for your milestone.");
      return;
    }

    setSubmittingWeek(weekNumber);
    setUploadingFile(true);
    let uploadedFileUrl: string | null = null;
    let uploadedFileName: string | null = null;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Session expired. Please log in again.");
        return;
      }

      // 1. Handle File Upload if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const path = `${user.id}/week-${weekNumber}/${Date.now()}_${safeFileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("accelerator-submissions")
          .upload(path, selectedFile, { upsert: true });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          // Fallback warning but proceed with public URL if possible
        }

        const { data: urlData } = supabase.storage
          .from("accelerator-submissions")
          .getPublicUrl(path);

        uploadedFileUrl = urlData.publicUrl;
        uploadedFileName = selectedFile.name;
      }

      // 2. Call Server Action to register submission
      const res = await submitAcceleratorMilestoneAction(
        weekNumber,
        textSubmission,
        uploadedFileUrl,
        uploadedFileName
      );

      if (res.success) {
        setSubmissionSuccess(true);
        setTextSubmission("");
        setSelectedFile(null);
        // Refresh dashboard data
        await loadDashboard();
      } else {
        alert(res.error || "Failed to submit milestone.");
      }
    } catch (err: any) {
      console.error("Submission exception:", err);
      alert(err.message || "Error submitting milestone.");
    } finally {
      setUploadingFile(false);
      setSubmittingWeek(null);
    }
  };

  // Helper to resolve milestone state
  const getMilestoneStatus = (weekNum: number) => {
    if (!enrolment) return { status: "locked", label: "LOCKED", color: "text-[#555550] border-transparent" };
    
    const submitted = milestones.find(m => m.week_number === weekNum);
    
    if (submitted) {
      if (submitted.status === "cleared") {
        return { 
          status: "cleared", 
          label: "CLEARED // CONTINUUM OK", 
          color: "text-[#18B880] border-[#18B880]/30 bg-[#18B880]/5 shadow-[0_0_15px_rgba(24,184,128,0.1)]",
          data: submitted 
        };
      }
      if (submitted.status === "needs_resubmission") {
        return { 
          status: "needs_resubmission", 
          label: "NEEDS RESUBMISSION // CRITICAL AMENDMENTS", 
          color: "text-[#CE6969] border-[#CE6969]/30 bg-[#CE6969]/5 shadow-[0_0_15px_rgba(206,105,105,0.1)]",
          data: submitted 
        };
      }
      return { 
        status: "submitted", 
        label: "SUBMITTED // AWAITING AUDIT", 
        color: "text-[#F9771D] border-[#F9771D]/30 bg-[#F9771D]/5 shadow-[0_0_15px_rgba(249,119,29,0.1)]",
        data: submitted 
      };
    }

    if (weekNum === enrolment.current_week) {
      return { 
        status: "active", 
        label: "ACTIVE WORKSTATION // MILESTONE INCOMPLETE", 
        color: "text-[#18B880] border-[#18B880]/50 bg-[#18B880]/10 font-black animate-pulse" 
      };
    }

    if (weekNum < enrolment.current_week) {
      return { 
        status: "overdue", 
        label: "MISSING // EXPIRED PREREQUISITE", 
        color: "text-[#CE6969] border-[#CE6969]/40 bg-[#CE6969]/5" 
      };
    }

    return { 
      status: "locked", 
      label: "LOCKED // COMPLETE PRIOR MILESTONES", 
      color: "text-[#333330] border-transparent" 
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#555550]">// INITIALIZING ACCELERATOR ENVIRONMENT...</p>
      </div>
    );
  }

  // State: Not enrolled - Pitch/Application view
  if (notEnrolled) {
    return (
      <div className="min-h-screen bg-[#070707] text-[#E0E0E0] font-sans antialiased selection:bg-accent selection:text-black">
        
        {/* PREMIUM PITCH HEADER */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1A1A1A] bg-[#111111] text-xs font-mono text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STRICTLY LIMITED COHORT // SEAT CAP: 15 ACTIVE</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Drawdown <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-teal-500">
                Institutional Accelerator
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#999] leading-relaxed max-w-xl">
              A hyper-exclusive, 6-week systematic trade development and clinical portfolio building incubator guided personally by Pete. Transform from an discretionary retail chart-watcher into a systematic operator with commercial-grade Pine Script automation.
            </p>

            {/* HIGH-LEVEL STATISTICS STRIP */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#1A1A1A]">
              <div>
                <p className="text-xs font-mono text-[#555550]">// CAPACITY</p>
                <p className="text-lg md:text-2xl font-mono font-bold text-white">15 SEATS</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#555550]">// CURRICULUM</p>
                <p className="text-lg md:text-2xl font-mono font-bold text-accent">6 WEEKS</p>
              </div>
              <div>
                <p className="text-xs font-mono text-[#555550]">// COHORT CAP</p>
                <p className="text-lg md:text-2xl font-mono font-bold text-[#CE6969]">{activeSeats >= 15 ? "FULLY BOOKED" : `${15 - activeSeats} SEATS LEFT`}</p>
              </div>
            </div>
          </div>

          {/* APPLICATION FORM OR STRIPE TRIGGER CARD */}
          <div className="lg:col-span-5">
            <div className="relative group bg-[#0C0C0C] border border-[#1C1C1C] rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
              
              {appSuccess ? (
                <div className="space-y-6 text-center py-10">
                  <div className="w-16 h-16 bg-accent/10 border border-accent/30 flex items-center justify-center rounded-full mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-accent animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white uppercase">Dossier Registered</h3>
                    <p className="text-xs text-[#999] leading-relaxed">
                      Pete has received your application blueprint. A secure confirmation email has been dispatched. Candidates will be interviewed on a rolling basis.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold uppercase text-white tracking-wide">// Register Candidate Dossier</h3>
                    <p className="text-xs text-[#666]">Submit your application details to secure a review queue slot.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-0 transition-colors"
                        placeholder="John Doe"
                        value={appForm.fullName}
                        onChange={(e) => setAppAppForm({ ...appForm, fullName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Secure Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-0 transition-colors"
                        placeholder="john@example.com"
                        value={appForm.email}
                        onChange={(e) => setAppAppForm({ ...appForm, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Experience</label>
                        <select 
                          className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:ring-0"
                          value={appForm.experienceLevel}
                          onChange={(e) => setAppAppForm({ ...appForm, experienceLevel: e.target.value })}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="institutional">Institutional</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Trading Capital</label>
                        <select 
                          className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:ring-0"
                          value={appForm.tradingCapital}
                          onChange={(e) => setAppAppForm({ ...appForm, tradingCapital: e.target.value })}
                        >
                          <option value="under_10k">Under £10,000</option>
                          <option value="10k_50k">£10,000 - £50,000</option>
                          <option value="50k_100k">£50,000 - £100,000</option>
                          <option value="above_100k">£100,000+</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[#555550]">Your Development Goals</label>
                      <textarea 
                        required
                        rows={3}
                        className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-0 resize-none transition-colors"
                        placeholder="What specific strategies are you aiming to automate, and what is your motivation for joining the accelerator?"
                        value={appForm.motivation}
                        onChange={(e) => setAppAppForm({ ...appForm, motivation: e.target.value })}
                      />
                    </div>
                  </div>

                  {activeSeats >= 15 ? (
                    <button 
                      type="button" 
                      disabled
                      className="w-full bg-transparent border border-[#CE6969]/40 text-[#CE6969] rounded-xl py-3 text-[10px] font-mono uppercase tracking-widest"
                    >
                      COHORT CAPACITY ATTAINED (15/15)
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={submittingApplication}
                      className="w-full bg-accent hover:bg-accent-hover active:translate-y-px text-black font-bold uppercase tracking-widest py-3 text-[10px] rounded-xl transition-all shadow-[0_0_20px_rgba(24,184,128,0.2)] flex items-center justify-center gap-2"
                    >
                      {submittingApplication ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>TRANSMITTING COHORT DOSSIER...</span>
                        </>
                      ) : (
                        <>
                          <span>SUBMIT COHORT APPLICATION</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* THE 6-WEEK BLUEPRINT SECTION */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-[#111]">
          <div className="space-y-3 text-center max-w-xl mx-auto mb-16">
            <p className="text-[10px] font-mono uppercase tracking-widest text-accent">// SYSTEMATIC SYLLABUS</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">The 6-Week Curriculum Blueprint</h2>
            <p className="text-xs text-[#666]">Each milestone is graded clinical-style by Pete before unlocking next-stage architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { week: 1, title: "Algorithmic Foundation", desc: "Calibrate your technical environment, initialize Git control, and configure standardized trading parameters." },
              { week: 2, title: "Systematic Strategy Formulation", desc: "Translate your discretionary trade edge into a concrete mathematical blueprint with clear logic loops." },
              { week: 3, title: "Pine Script Programming Mastery", desc: "Develop clean, optimized commercial-grade indicator scripts and custom signal alert modules." },
              { week: 4, title: "Advanced Backtesting & Refinement", desc: "Harness systematic batch engines to pressure-test your script across 5+ years of historical price data." },
              { week: 5, title: "Risk Safeguards & Execution Hook", desc: "Embed programmatic max drawdown limits, trailing stops, and webhook execution payload interfaces." },
              { week: 6, title: "Institutional Incubation Launch", desc: "Connect live webhooks to institutional broker endpoints and begin active capital-backed scaling." }
            ].map((item) => (
              <div key={item.week} className="bg-[#0C0C0C] border border-[#151515] hover:border-[#1F1F1F] p-6 rounded-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-[#555550] uppercase">// PHASE 0{item.week}</span>
                  <span className="text-xs font-mono font-bold text-accent">WEEK {item.week}</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-2">{item.title}</h4>
                <p className="text-xs text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // State: Enrolled & Paid - ACTIVE STUDENT WORKSPACE
  return (
    <div className="min-h-screen bg-[#070707] text-[#E0E0E0] font-sans antialiased selection:bg-accent selection:text-black">
      
      {/* GLOWING WORKSPACE HERO HEADER */}
      <div className="relative border-b border-[#151515] bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(24,184,128,0.04),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#111] border border-[#1A1A1A] text-[9px] font-mono text-accent uppercase tracking-widest animate-pulse">
                <Terminal className="w-3 h-3" />
                // COHORT SYSTEM: ACTIVE
              </span>
              {enrolment?.cohort && (
                <span className="text-[10px] font-mono text-[#555550] uppercase">
                  Cohort: {enrolment.cohort.name}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase text-white">
                Accelerator Workstation
              </h1>
              <p className="text-xs text-[#888] font-mono tracking-wide">
                SYSTEMATIC PORTFOLIO PROTOCOL // STUDENT ID: {enrolment?.user_id?.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* SCHEDULED WORKSHOPS / SESSIONS ROW */}
          {sessions.length > 0 ? (
            <div className="bg-[#0F0C08] border border-[#F9771D]/20 rounded-xl p-4 md:max-w-xs shrink-0 shadow-[0_0_20px_rgba(249,119,29,0.03)]">
              <div className="flex items-center gap-2 mb-1.5 text-[#F9771D]">
                <Calendar className="w-4 h-4 animate-bounce" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Scheduled Session</span>
              </div>
              {sessions.map((s: any) => (
                <div key={s.id} className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase">{s.topic}</p>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#888]">
                    <span>{new Date(s.scheduled_at).toLocaleDateString()} @ {new Date(s.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {s.meeting_url && (
                      <a href={s.meeting_url} target="_blank" rel="noopener noreferrer" className="text-accent flex items-center gap-0.5 hover:underline">
                        JOIN <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0C0C0C] border border-[#1A1A1A] rounded-xl p-4 md:max-w-xs shrink-0">
              <div className="flex items-center gap-2 mb-1 text-[#555550]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono uppercase tracking-wider">// Scheduled Sessions</span>
              </div>
              <p className="text-xs font-bold text-[#888]">No upcoming sessions scheduled.</p>
              <p className="text-[9px] font-mono text-[#555550] mt-1">Pete will post links to weekly private coaching workshops here.</p>
            </div>
          )}
        </div>
      </div>

      {/* MATRIX LEDGER */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#555550]">
              // 6-WEEK DEVELOPMENT LEDGER
            </h3>
            <button 
              onClick={loadDashboard}
              className="p-1.5 rounded-lg border border-[#1A1A1A] hover:bg-[#111] text-[#888] hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              REFRESH FEED
            </button>
          </div>

          <div className="space-y-4 border border-[#151515] bg-[#0A0A0A] rounded-2xl overflow-hidden p-2">
            {weeks.map((week: any) => {
              const isOpen = expandedWeek === week.week_number;
              const meta = getMilestoneStatus(week.week_number);
              const isLocked = meta.status === "locked";

              return (
                <div 
                  key={week.id}
                  className={`border rounded-xl transition-all duration-300 ${
                    isOpen 
                      ? "border-[#222] bg-[#0E0E0E]/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]" 
                      : isLocked 
                        ? "border-[#151515] opacity-50 bg-[#070707]" 
                        : "border-[#1A1A1A] hover:border-[#222] bg-[#0B0B0B]"
                  }`}
                >
                  {/* Ledger Header */}
                  <div 
                    onClick={() => !isLocked && setExpandedWeek(isOpen ? null : week.week_number)}
                    className={`p-5 flex items-center justify-between gap-4 select-none ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-4">
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-[#333330]" />
                      ) : isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#888]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#888]" />
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#555550]">WEEK 0{week.week_number}</span>
                          <span className={`text-[9px] font-mono border px-2 py-0.5 rounded-full ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide mt-1">
                          {week.title}
                        </h4>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[9px] font-mono text-[#555550] uppercase">// ESTIMATED EFFORT</p>
                        <p className="text-xs font-bold text-white font-mono">{week.estimated_hours || 4} HOURS</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="p-6 border-t border-[#1C1C1C] space-y-6 bg-[#0B0B0B]">
                      
                      {/* Curated Syllabus Briefing */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-[#555550] uppercase">// WEEKLY SYLLABUS DIRECTIVE</span>
                            <p className="text-xs text-[#888] leading-relaxed">
                              {week.description}
                            </p>
                          </div>

                          {/* Syllabus Checklist */}
                          {week.syllabus_outline && Array.isArray(week.syllabus_outline) && (
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono text-[#555550] uppercase">// CORE LESSONS & CHECKLIST</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {week.syllabus_outline.map((o: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-[#999]">
                                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                                    <span>{o}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Deliverables / Objectives details */}
                        <div className="bg-[#0E0E0E] border border-[#1C1C1C] rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 text-white">
                            <Award className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Milestone Deliverable</span>
                          </div>
                          <p className="text-xs text-[#999] leading-relaxed">
                            {week.milestone_deliverable || "Draft and backtest dynamic alert script formulation."}
                          </p>
                        </div>
                      </div>

                      {/* SUBMISSION / WORKSTATION FORM OR PREVIOUS FEEDBACK */}
                      <div className="pt-6 border-t border-[#1C1C1C]">
                        {/* Pete's Clinical Notes (Feedback display) */}
                        {meta.data?.grading_feedback && (
                          <div className="mb-6 bg-[#0E0B08] border border-[#F9771D]/20 rounded-xl p-5 space-y-3 shadow-[0_0_20px_rgba(249,119,29,0.02)]">
                            <div className="flex items-center justify-between text-[#F9771D]">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                <span className="text-[10px] font-mono uppercase tracking-widest font-black">Pete&apos;s Clinical Feedback Notes</span>
                              </div>
                              <span className="text-[9px] font-mono">
                                {meta.data.graded_at ? new Date(meta.data.graded_at).toLocaleDateString() : ""}
                              </span>
                            </div>
                            <p className="text-xs text-white font-mono leading-relaxed bg-[#0A0806] border border-[#F9771D]/10 p-4 rounded-lg whitespace-pre-wrap">
                              {meta.data.grading_feedback}
                            </p>
                          </div>
                        )}

                        {/* Submission interactive workstation */}
                        {meta.status === "active" || meta.status === "needs_resubmission" ? (
                          <div className="bg-[#0C0C0C] border border-[#1A1A1A] rounded-xl p-6 space-y-4">
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold uppercase text-white tracking-wide flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#18B880] rounded-full animate-ping" />
                                Interactive Deliverable Workstation
                              </h5>
                              <p className="text-[10px] font-mono text-[#666]">Submit your documentation notes and attach source code scripts below.</p>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-mono uppercase tracking-widest text-[#555550]">Dossier Brief / Description Notes</label>
                                <textarea
                                  rows={5}
                                  required
                                  className="w-full bg-[#111] border border-[#222] focus:border-accent rounded-lg p-3.5 text-xs text-white focus:outline-none focus:ring-0 resize-none font-mono transition-colors"
                                  placeholder="Write out your Pine Script formulas, checklist answers, or backtesting parameters here..."
                                  value={textSubmission}
                                  onChange={(e) => setTextSubmission(e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                {/* File Upload Button */}
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#555550]">Attach Code Script / Document</label>
                                  <div className="flex items-center gap-3">
                                    <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#222] hover:border-accent hover:bg-[#111] text-xs font-mono text-[#999] hover:text-white transition-all">
                                      <Upload className="w-3.5 h-3.5 text-accent" />
                                      <span>{selectedFile ? "CHANGE ATTACHMENT" : "CHOOSE SCRIPT / FILE"}</span>
                                      <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                        accept=".txt,.gcode,.py,.csv,.xlsx,.pdf,.json,.txt,pinescript"
                                      />
                                    </label>
                                    {selectedFile && (
                                      <div className="flex items-center gap-1.5 text-xs font-mono text-accent">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Submit trigger button */}
                                <div className="text-right">
                                  <button
                                    onClick={() => handleMilestoneSubmit(week.week_number)}
                                    disabled={submittingWeek !== null}
                                    className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-black font-bold text-[10px] font-mono uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 ml-auto"
                                  >
                                    {submittingWeek === week.week_number ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>TRANSMITTING DELIVERABLE...</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>TRANSMIT FOR CLINICAL REVIEW</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : meta.status === "submitted" ? (
                          <div className="bg-[#110D0A] border border-[#F9771D]/10 rounded-xl p-5 flex items-center gap-4">
                            <Clock className="w-5 h-5 text-[#F9771D] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white uppercase">Your submission is currently in Pete&apos;s review queue</p>
                              <p className="text-[10px] font-mono text-[#888] mt-0.5">
                                Submitted at: {meta.data?.submitted_at ? new Date(meta.data.submitted_at).toLocaleString() : ""}
                              </p>
                              {meta.data?.submission_content?.file_name && (
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-accent mt-2">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Attached: {meta.data.submission_content.file_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : meta.status === "cleared" ? (
                          <div className="bg-[#0A110D] border border-[#18B880]/10 rounded-xl p-5 flex items-center gap-4">
                            <CheckCircle2 className="w-5 h-5 text-[#18B880] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white uppercase">Milestone Cleared successfully</p>
                              <p className="text-[10px] font-mono text-[#888] mt-0.5">
                                Cleared at: {meta.data?.graded_at ? new Date(meta.data.graded_at).toLocaleDateString() : ""} // CURRENT GRADE: EXCELLENT
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
