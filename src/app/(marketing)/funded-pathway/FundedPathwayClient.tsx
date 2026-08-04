"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  CheckCircle, 
  TrendingUp, 
  Coins, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  Check, 
  Loader2, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { propFirms, PropFirm, ChallengeTier } from "@/data/prop-firms";
import { cn } from "@/lib/utils";

export default function FundedPathwayClient() {
  const router = useRouter();
  const supabase = createClient();

  // Auth & API states
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    completed_count: number;
    total_count: number;
    subscription_tier: string;
    challenge_status: string;
    challenge_prop_firm_id: string | null;
    challenge_tier: string | null;
    reason: string;
  } | null>(null);

  // Active challenge tracking inputs
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActivePartnerTab] = useState<string>("the5ers");
  const [challengeStatus, setChallengeStatus] = useState<string>("not_started");
  const [challengePropFirmId, setChallengePropFirmId] = useState<string>("");
  const [challengeTierInput, setChallengeTierInput] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Core Phase 4 modules for the checklist
  const phase4Modules = [
    { num: 1, title: "The Math of Ruin", desc: "Understanding the statistical point of no return." },
    { num: 2, title: "Position Sizing Formulas", desc: "Applying Kelly Criterion and expectancy models." },
    { num: 3, title: "Fixed vs. Percentage Risk Models", desc: "Calculating optimal risk units per trade." },
    { num: 4, title: "Drawdown Psychology & Recovery", desc: "The cognitive trap of losing streaks." },
    { num: 5, title: "Compounding Capital Safely", desc: "Scaling account size without scaling risk exposure." },
    { num: 6, title: "Handling Correlation Risk", desc: "Managing overlapping currency and asset exposure." }
  ];

  // Fetch auth and eligibility
  const checkState = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const res = await fetch("/api/funded-pathway/eligibility");
        if (res.ok) {
          const data = await res.json();
          setEligibility(data);
          setChallengeStatus(data.challenge_status);
          setChallengePropFirmId(data.challenge_prop_firm_id || "the5ers");
          setChallengeTierInput(data.challenge_tier || "$10,000");
        }
      }
    } catch (e) {
      console.error("Error loading funded pathway state:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkState();
  }, []);

  // Save active challenge status
  const handleSaveChallenge = async () => {
    setSubmitting(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/funded-pathway/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge_status: challengeStatus,
          challenge_prop_firm_id: challengePropFirmId,
          challenge_tier: challengeTierInput
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        // Refresh eligibility data
        const refreshRes = await fetch("/api/funded-pathway/eligibility");
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setEligibility(data);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error saving challenge:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center border-t border-mkt-bd">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-xs uppercase tracking-widest font-mono text-mkt-i4">Loading Pathway Systems...</p>
        </div>
      </div>
    );
  }

  // Filter only our verified pathway partners
  const partners = propFirms.filter(f => f.isPathwayPartner);

  // ----------------------------------------------------
  // 1. PUBLIC LANDING STATE
  // ----------------------------------------------------
  if (!user) {
    return (
      <div className="bg-white min-h-screen text-mkt-ink relative overflow-hidden border-t border-mkt-bd font-sans">
        {/* Anti-Hype Visual Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-0 w-[300px] h-[300px] rounded-full bg-premium/5 blur-[80px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-24">
          {/* Header */}
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest font-mono">
              <Award className="w-3.5 h-3.5" /> Funded Account Pathway
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-mkt-ink">
              STOP RISKING YOUR <br />
              <span className="text-accent">OWN CAPITAL.</span>
            </h1>
            <p className="text-base md:text-xl text-mkt-i2 leading-relaxed max-w-2xl font-serif">
              A structured, highly disciplined bridge from trading theory to managing up to $200,000 in prop firm capital. Complete Phase 4 (Risk Manager) to unlock the pathway.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-mkt-ink text-white font-bold text-[10px] uppercase tracking-widest border border-mkt-ink hover:bg-accent-hover hover:border-accent hover:translate-x-1 transition-all inline-flex items-center gap-2"
              >
                Sign Up & Start Phase 1 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 bg-white text-mkt-ink font-bold text-[10px] uppercase tracking-widest border border-mkt-bd hover:bg-[#F9F9F9] transition-all inline-flex items-center gap-2"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>

          {/* CRITICAL WARNING CARD - Explicit Anti-Hype */}
          <div className="border border-mkt-bd bg-white p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest font-mono text-mkt-ink">
                  PROP TRADING INDUSTRY REALITY CHECK
                </h3>
                <p className="text-sm text-mkt-i2 font-serif leading-relaxed">
                  Prop challenge providers (FTMO, The5%ers, etc.) are built on challenge failure. Over <strong>90%</strong> of traders who pay challenge fees fail to pass because they take excessive leverage, rush profit targets, and lack absolute mechanical consistency. 
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-mkt-bd">
                  <div>
                    <span className="block text-2xl font-black text-accent font-sans">90%+</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">Fail Rate</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-mkt-ink font-sans">100%</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">Risk Gated</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-premium font-sans">$200k+</span>
                    <span className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">Funding Potential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pathway Process Pillars */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-mkt-ink">The Path of Professional Funding</h2>
              <p className="text-xs font-mono uppercase tracking-widest text-mkt-i4">We don't give you fish. We teach you how to build the fleet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-mkt-bd p-8 bg-[#FDFDFD] space-y-4 hover:border-mkt-ink transition-colors">
                <div className="w-10 h-10 bg-mkt-ink text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest">
                  01
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-mkt-ink">Defensive Education</h3>
                <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                  Complete our core curriculum. You are locked out of our pathway challenges until you fully pass Phase 4 (Risk Manager) and prove absolute ruleset compliance on our risk engine.
                </p>
              </div>

              <div className="border border-mkt-bd p-8 bg-[#FDFDFD] space-y-4 hover:border-mkt-ink transition-colors">
                <div className="w-10 h-10 bg-accent text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest">
                  02
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-accent">Pathway Validation</h3>
                <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                  Unlock the dashboard and gain access to detailed pricing matrices, rules, and structures for our three premium partners. Choose a tier that matches your current discipline.
                </p>
              </div>

              <div className="border border-mkt-bd p-8 bg-[#FDFDFD] space-y-4 hover:border-mkt-ink transition-colors">
                <div className="w-10 h-10 bg-premium text-white flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest">
                  03
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-premium">Continuous Tracking</h3>
                <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                  Log your active challenges directly onto your student profile. Receive automated, context-specific risk warnings and coaching support to ensure your maximum statistical survival rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. LOGGED-IN GATED (LOCKED) STATE
  // ----------------------------------------------------
  if (eligibility && !eligibility.eligible) {
    const isFree = eligibility.subscription_tier === "free";
    const percentCompleted = Math.round((eligibility.completed_count / eligibility.total_count) * 100);

    return (
      <div className="bg-white min-h-screen text-mkt-ink border-t border-mkt-bd font-sans py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Header Title */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest font-mono">
              <Lock className="w-3.5 h-3.5" /> Funded Pathway Locked
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-mkt-ink">
              PROVE YOUR RISK EDGE.
            </h1>
            <p className="text-sm md:text-base text-mkt-i2 font-serif leading-relaxed">
              To unlock the Funded Pathway, you must statistically verify your risk management knowledge. The bridge requires you to complete all 6 modules of <strong>Phase 4 (Risk Manager)</strong> and hold an active paid subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Progress Circular Widget (4 Columns) */}
            <div className="md:col-span-4 border border-mkt-bd p-8 bg-[#FAFAFA] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
              <div className="relative w-32 h-32">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    className="text-[#EFEFEF]"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-accent transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - eligibility.completed_count / eligibility.total_count)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-mkt-ink font-sans">{eligibility.completed_count}/{eligibility.total_count}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-mkt-i4">Modules</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-mkt-ink">Phase 4 Progress</h4>
                <p className="text-[10px] text-mkt-i4 uppercase font-mono tracking-widest">{percentCompleted}% Completed</p>
              </div>
            </div>

            {/* Locked Reason Callout & Upgrade Action (8 Columns) */}
            <div className="md:col-span-8 border border-mkt-bd p-8 bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-accent">
                  REASON FOR LOCK:
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-mkt-i2 bg-[#FFFDF6] border border-accent/20 p-4">
                  ⚠️ {eligibility.reason}
                </p>
                <p className="text-xs text-mkt-i3 leading-relaxed font-serif">
                  Paying challenge fees with no strict risk framework is pure gambling. We intentionally gate the pathway to stop students from wasting hard-earned capital. Our partners offer challenges starting at $32—but you should only buy them once you have finished Phase 4.
                </p>
              </div>

              {isFree ? (
                <Link
                  href="/pricing"
                  className="w-full md:w-auto self-start px-8 py-4 bg-accent text-white font-bold text-[10px] uppercase tracking-widest hover:bg-accent-hover hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  Upgrade Subscription Tier <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/courses/risk-manager"
                  className="w-full md:w-auto self-start px-8 py-4 bg-mkt-ink text-white font-bold text-[10px] uppercase tracking-widest hover:bg-accent-hover hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  Go to Risk Manager Course <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Module Checklist Grid */}
          <div className="space-y-6 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-mkt-ink border-b border-mkt-bd pb-2">
              Phase 4 Core Modules Gating Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phase4Modules.map((m) => {
                const isComplete = m.num <= eligibility.completed_count; // Mock logic, or fetch module state
                return (
                  <Link
                    key={m.num}
                    href={`/courses/risk-manager/module-${m.num}`}
                    className="border border-mkt-bd p-5 bg-[#FDFDFD] hover:border-mkt-ink transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1 pr-4">
                      <span className="block text-[10px] font-bold font-mono tracking-widest text-mkt-i4 uppercase">
                        Module 0{m.num}
                      </span>
                      <h4 className="text-xs font-bold uppercase text-mkt-ink tracking-wide font-sans group-hover:underline">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-mkt-i2 font-serif line-clamp-1">
                        {m.desc}
                      </p>
                    </div>
                    <div>
                      {isComplete ? (
                        <div className="p-1.5 bg-accent/15 border border-accent/20 text-accent rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-[#EFEFEF] text-mkt-i4 rounded-full">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. LOGGED-IN UNLOCKED STATE
  // ----------------------------------------------------
  return (
    <div className="bg-[#FAF8F6] min-h-screen text-mkt-ink border-t border-mkt-bd font-sans py-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Banner */}
        <div className="bg-white border border-mkt-bd p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold uppercase tracking-widest font-mono">
                <CheckCircle className="w-3.5 h-3.5" /> Eligible & Unlocked
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-mkt-ink">
                THE FUNDED DASHBOARD
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-mkt-i3">
                You passed the Risk Gate. Standardised challenge options & survival coaching logs are below.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#FFFDF6] border border-accent/20 p-4 shrink-0 max-w-sm">
              <Award className="w-8 h-8 text-accent shrink-0" />
              <p className="text-[10px] leading-relaxed font-serif text-mkt-i2">
                "Disciplined execution is the only metric that matters. Leverage is a weapon; wield it defensively."
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Progress Updater / Coaching Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Form Area (5 Columns) */}
          <div className="lg:col-span-5 bg-white border border-mkt-bd p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-mkt-ink border-b border-mkt-bd pb-2">
                ACTIVE CHALLENGE LOGGER
              </h3>

              {/* Status input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">
                  Challenge Status
                </label>
                <select
                  value={challengeStatus}
                  onChange={(e) => setChallengeStatus(e.target.value)}
                  className="w-full bg-[#FCFCFC] border border-mkt-bd p-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-mkt-ink"
                >
                  <option value="not_started">⚪ Not Started</option>
                  <option value="in_progress">🔵 In Progress</option>
                  <option value="passed">🟢 Challenge Passed</option>
                  <option value="failed">🔴 Challenge Failed</option>
                  <option value="funded">👑 Fully Funded Account</option>
                </select>
              </div>

              {/* Partner selection */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">
                  Prop Firm Partner
                </label>
                <select
                  value={challengePropFirmId || ""}
                  onChange={(e) => setChallengePropFirmId(e.target.value)}
                  className="w-full bg-[#FCFCFC] border border-mkt-bd p-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-mkt-ink"
                >
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-mkt-i4">
                  Account Tier / Capital Size
                </label>
                <input
                  type="text"
                  value={challengeTierInput || ""}
                  onChange={(e) => setChallengeTierInput(e.target.value)}
                  placeholder="e.g. $10,000, $20,000"
                  className="w-full bg-[#FCFCFC] border border-mkt-bd p-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-mkt-ink"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={handleSaveChallenge}
                disabled={submitting}
                className="w-full bg-mkt-ink text-white font-bold text-[10px] uppercase tracking-widest py-4 px-8 inline-flex items-center justify-center gap-2 hover:bg-accent hover:translate-x-0.5 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Progress Log"
                )}
              </button>

              {saveSuccess && (
                <div className="bg-accent/10 border border-accent/20 text-accent p-3 text-center text-[10px] font-bold font-mono uppercase tracking-widest">
                  ✅ Progress Saved & Committed
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Coaching Response Panel (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-mkt-bd p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-mkt-ink border-b border-mkt-bd pb-2">
                SURVIVAL COACHING BRIEF
              </h3>

              {/* Dynamic Status Output Cards */}
              {challengeStatus === "not_started" && (
                <div className="space-y-4">
                  <div className="bg-[#FAF8F6] border border-mkt-bd p-5 flex items-start gap-4">
                    <HelpCircle className="w-5 h-5 text-mkt-i4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-mkt-ink">Step 1: Choose Your Weapon</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Read through our verified partners below. Compare FTMO's extreme payout stability, The5%ers' hyper-scaling bootcamps, and Funding Pips' cheap micro-accounts. Start small. Do not purchase a $100k tier first.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FAF8F6] border border-mkt-bd p-5 flex items-start gap-4">
                    <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-mkt-ink">The Tuition Rule</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Treat challenge fees as tuition, not an investment. Act as if the fee is gone. This completely removes the psychological panic of violating drawdown limits.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {challengeStatus === "in_progress" && (
                <div className="space-y-4">
                  <div className="bg-[#FFFDF6] border border-accent/20 p-5 flex items-start gap-4 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-accent">Active Protocol — Slow Down</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Do not rush to meet profit targets by scaling your risk. The prop firms intentionally remove time limits so you take your time. If you risk more than 0.5% per trade, you will fail the daily drawdown.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FCFCFC] border border-mkt-bd p-5 flex items-start gap-4">
                    <Layers className="w-5 h-5 text-mkt-i4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-mkt-ink">No Over-Exposure</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Ensure you hold zero correlated positions. Do not trade EURUSD and GBPUSD simultaneously if both setups are identical; this doubles your actual statistical risk unit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {challengeStatus === "passed" && (
                <div className="space-y-4">
                  <div className="bg-[#F6FFF8] border border-[#22C55E]/25 p-5 flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-[#22C55E]">Evaluation Phase Finished</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Outstanding work. You successfully completed the valuation phases. Now wait for KYC compliance and setup verification. Do not touch your charts or take any setups until the real funded credentials are fully provisioned.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {challengeStatus === "failed" && (
                <div className="space-y-4">
                  <div className="bg-[#FFF5F5] border border-[#EF4444]/25 p-5 flex items-start gap-4">
                    <RotateCcw className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-[#EF4444]">Challenge Violated</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Every professional trader has blown multiple challenges. It is part of the cost of scaling. Do not immediately purchase a new challenge to revenge-trade your loss. Go back to our simulator for 5 days, identify your mistake, and restart cleanly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {challengeStatus === "funded" && (
                <div className="space-y-4">
                  <div className="bg-[#F7FAFC] border border-[#3B82F6]/25 p-5 flex items-start gap-4">
                    <Sparkles className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase font-mono text-[#3B82F6]">👑 Real Capital Protocol</h4>
                      <p className="text-xs text-mkt-i2 font-serif leading-relaxed">
                        Now the actual game of professional capital survival begins. Your objective is not a 50% monthly gain. Your objective is maintaining a 1.5% monthly payout with zero drawdown spikes. Scale risk down to 0.25% per trade. Let the math compound.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-mkt-i4 bg-[#FAFAFA] border border-mkt-bd p-4 font-mono leading-normal uppercase">
              🧠 RULE_LOG: "A trader is a risk manager who happens to buy and sell. Your edge is not entries, it is survival."
            </div>
          </div>
        </div>

        {/* Tabbed Verified Partner Information & Matrix */}
        <div className="space-y-8 bg-white border border-mkt-bd p-8 md:p-12">
          <div className="border-b border-mkt-bd pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest font-mono text-mkt-ink">
                VERIFIED PARTNER COMPRISES
              </h3>
              <p className="text-[10px] uppercase font-mono tracking-widest text-mkt-i4">
                We only recommend FCA-regulated-adjacent platforms and founder-vetted entities.
              </p>
            </div>

            {/* Partner tabs */}
            <div className="flex gap-2 font-mono">
              {partners.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePartnerTab(p.id)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all",
                    activeTab === p.id 
                      ? "bg-mkt-ink text-white border-mkt-ink" 
                      : "bg-[#FAFAFA] text-mkt-i2 border-mkt-bd hover:bg-[#F0F0F0]"
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Partner Content Card */}
          {partners.map(p => {
            if (p.id !== activeTab) return null;
            return (
              <div key={p.id} className="space-y-12 animate-in fade-in duration-300">
                {/* Specs / Badges */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold uppercase text-mkt-ink font-sans tracking-wide">
                        {p.name} Summary
                      </h4>
                      {p.founderVerified && (
                        <span className="inline-flex items-center gap-1 bg-premium/10 border border-premium/20 text-premium text-[8px] font-bold uppercase tracking-widest font-mono px-2 py-0.5">
                          🛡️ Founder Verified
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[8px] font-bold uppercase tracking-widest font-mono px-2 py-0.5">
                        ⭐ {p.rating} / 5.0
                      </span>
                    </div>

                    <p className="text-sm text-mkt-i2 font-serif leading-relaxed">
                      {p.verdict}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      {/* Pros */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[#22C55E]">
                          ✓ Verified Advantages
                        </span>
                        <ul className="space-y-1.5">
                          {p.pros.map((pro, i) => (
                            <li key={i} className="text-[10px] uppercase font-mono tracking-wider text-mkt-i2 flex items-start gap-1.5">
                              <span className="text-[#22C55E] shrink-0 mt-0.5">•</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold font-mono uppercase tracking-widest text-[#EF4444]">
                          ✗ Structural Vulnerabilities
                        </span>
                        <ul className="space-y-1.5">
                          {p.cons.map((con, i) => (
                            <li key={i} className="text-[10px] uppercase font-mono tracking-wider text-mkt-i2 flex items-start gap-1.5">
                              <span className="text-[#EF4444] shrink-0 mt-0.5">•</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Link Callout */}
                  <div className="md:col-span-4 border border-mkt-bd bg-[#FAFAFA] p-6 text-center space-y-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold uppercase font-mono tracking-widest text-mkt-i4">
                        Standard Fee
                      </span>
                      <span className="block text-2xl font-black text-mkt-ink font-sans">
                        {p.challengeFee}
                      </span>
                      <p className="text-[10px] font-serif text-mkt-i3 leading-relaxed">
                        All challenge fees are processed directly by the respective prop provider. We earn standard affiliate revenue with zero markups to you.
                      </p>
                    </div>

                    <a
                      href={p.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-accent text-white font-bold text-[10px] uppercase tracking-widest py-3 px-6 inline-flex items-center justify-center gap-1.5 hover:bg-accent-hover hover:translate-x-0.5 transition-all"
                    >
                      Apply For Challenge <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Challenge Tier Matrix */}
                {p.challengeTiers && p.challengeTiers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-mkt-ink border-t border-mkt-bd pt-6">
                      CHALLENGE TIER MATRIX
                    </h4>
                    <div className="overflow-x-auto border border-mkt-bd">
                      <table className="w-full text-left font-mono border-collapse">
                        <thead>
                          <tr className="bg-[#FAF8F6] border-b border-mkt-bd text-[9px] font-bold uppercase text-mkt-i4">
                            <th className="p-3">Account Size</th>
                            <th className="p-3">Entrance Fee</th>
                            <th className="p-3">Profit Target</th>
                            <th className="p-3">Max Drawdown</th>
                            <th className="p-3">Daily Drawdown</th>
                            <th className="p-3">Profit Split</th>
                            <th className="p-3">Time Limit</th>
                          </tr>
                        </thead>
                        <tbody className="text-[10px] uppercase tracking-wider text-mkt-i2 divide-y divide-mkt-bd">
                          {p.challengeTiers.map((tier: ChallengeTier, i: number) => (
                            <tr key={i} className="hover:bg-[#FCFCFC] transition-colors">
                              <td className="p-3 font-bold text-mkt-ink">{tier.size}</td>
                              <td className="p-3 font-sans font-bold text-accent">{tier.fee}</td>
                              <td className="p-3">{tier.profitTarget}</td>
                              <td className="p-3 text-red-500 font-bold">{tier.maxDrawdown}</td>
                              <td className="p-3">{tier.dailyDrawdown}</td>
                              <td className="p-3">{tier.split}</td>
                              <td className="p-3">{tier.timeLimit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
