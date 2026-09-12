"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Target,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Brain,
  TrendingUp,
  Zap,
  Globe,
  BarChart2,
  Award,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userProfile: any;
  onComplete: () => void;
}

// ─── Prompt 07: 2-Step Activation Flow ───────────────────────────────────────
//
// Step 1: "What do you want to improve?"
// Step 2: "What do you trade most?"
// Step 3: Confirmation & product entry (state-aware routing)
//
// Biography, experience, trading history, and broker credentials are NOT
// collected during activation. They are progressively profiled later.

const OBJECTIVES = [
  {
    id: "Risk",
    label: "Risk",
    desc: "Position sizing, drawdown protection, daily loss buffers.",
    icon: ShieldCheck
  },
  {
    id: "Strategy",
    label: "Strategy",
    desc: "Invalidation levels, execution criteria, edge building.",
    icon: Target
  },
  {
    id: "Discipline",
    label: "Discipline",
    desc: "Rule adherence, emotional review, process scoring.",
    icon: Brain
  },
  {
    id: "Prop Firm Performance",
    label: "Prop Firm Performance",
    desc: "Challenge limits, consistency tracking, payout eligibility.",
    icon: Award
  },
  {
    id: "Market Analysis",
    label: "Market Analysis",
    desc: "Macro intelligence, multi-timeframe scanner, institutional flow.",
    icon: BarChart2
  }
];

const MARKETS = [
  {
    id: "FX",
    label: "FX",
    desc: "Majors & Crosses",
    icon: Globe
  },
  {
    id: "Indices",
    label: "Indices",
    desc: "US & European Equities Indices",
    icon: TrendingUp
  },
  {
    id: "Commodities",
    label: "Commodities",
    desc: "Gold, Oil, Metals",
    icon: BarChart2
  },
  {
    id: "Equities",
    label: "Equities",
    desc: "Single Stocks",
    icon: ChevronRight
  },
  {
    id: "Crypto",
    label: "Crypto",
    desc: "Major Digital Assets",
    icon: Zap
  },
  {
    id: "Other / All Markets",
    label: "All Markets",
    desc: "Cross-asset generalist",
    icon: Globe
  }
];

export function OnboardingWizard({ userProfile, onComplete }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Activation State
  const [primaryObjective, setPrimaryObjective] = useState<string | null>(null);
  const [primaryMarket, setPrimaryMarket] = useState<string | null>(null);

  // Legacy fields retained for API backwards-compatibility
  const firstName = userProfile?.display_name?.split(" ")[0] || "";
  const lastName = userProfile?.display_name?.split(" ").slice(1).join(" ") || "";
  const style = null; // deferred to progressive profiling
  const experience = null; // deferred to progressive profiling

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createClient();

  const handleComplete = async () => {
    if (!primaryObjective || !primaryMarket) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_objective: primaryObjective,
          primary_market: primaryMarket,
          preferred_markets: [primaryMarket],
          trading_goals: primaryObjective,
          // Legacy shape (backwards-compatible)
          firstName: firstName || null,
          lastName: lastName || null
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Activation API error:", text);
        setSubmitError(
          "Failed to save activation configuration. Please check your connection and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Mark as activated in localStorage (prevents re-showing)
      if (userProfile?.id) {
        localStorage.setItem(`drawdown_onboarded_${userProfile.id}`, "true");
      }
      localStorage.setItem("drawdown_onboarded", "true");

      onComplete();

      // State-aware routing:
      // If user has no accounts → direct to account setup immediately
      const { data: accounts } = await (supabase as any)
        .from("trading_accounts")
        .select("id")
        .eq("is_active", true)
        .limit(1);

      const hasAccount = accounts && accounts.length > 0;
      router.push(hasAccount ? "/dashboard" : "/dashboard/accounts");
    } catch (err) {
      console.error("Activation error:", err);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Improvement Goal", icon: Target },
    { title: "Primary Market", icon: Globe },
    { title: "Activate Terminal", icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/95 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-background-surface border border-border-slate shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left: Progress Sidebar */}
        <div className="w-full md:w-72 bg-background-elevated p-10 border-r border-border-slate space-y-10 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
              // ACTIVATION
            </span>
            <h2 className="text-xl font-display font-black uppercase">Drawdown OS</h2>
          </div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center border transition-all",
                    step > i + 1
                      ? "bg-profit border-profit text-background-primary"
                      : step === i + 1
                      ? "border-accent text-accent"
                      : "border-border-slate text-text-tertiary"
                  )}
                >
                  {step > i + 1 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    step === i + 1 ? "text-text-primary" : "text-text-tertiary"
                  )}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border-slate/50">
            <p className="text-[9px] font-mono text-text-tertiary leading-relaxed uppercase">
              Two questions. Under two minutes. Immediate product access.
            </p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-grow p-10 md:p-14 flex flex-col justify-between min-h-[520px]">
          <div>
            {/* STEP 1: OBJECTIVE */}
            {step === 1 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block">
                    // STEP 1 OF 2
                  </span>
                  <h3 className="text-3xl font-display font-bold uppercase leading-none">
                    What do you want to{" "}
                    <span className="text-accent">improve?</span>
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Select your primary trading focus. This personalises your Drawdown experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {OBJECTIVES.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => {
                        setPrimaryObjective(obj.id);
                        // Allow immediate advance on selection
                        setTimeout(() => setStep(2), 120);
                      }}
                      className={cn(
                        "p-3.5 text-left border transition-all flex items-center justify-between gap-3 group",
                        primaryObjective === obj.id
                          ? "border-accent bg-accent/8 text-text-primary"
                          : "border-border-slate hover:border-accent/50 text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <obj.icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            primaryObjective === obj.id
                              ? "text-accent"
                              : "text-text-tertiary group-hover:text-accent/60"
                          )}
                        />
                        <div>
                          <p className="font-bold uppercase text-[11px] tracking-wide leading-none mb-0.5">
                            {obj.label}
                          </p>
                          <p className="text-[9px] text-text-tertiary uppercase leading-snug">
                            {obj.desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-3.5 h-3.5 border rounded-full flex items-center justify-center shrink-0",
                          primaryObjective === obj.id
                            ? "border-accent"
                            : "border-border-slate"
                        )}
                      >
                        {primaryObjective === obj.id && (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PRIMARY MARKET */}
            {step === 2 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest block">
                    // STEP 2 OF 2
                  </span>
                  <h3 className="text-3xl font-display font-bold uppercase leading-none">
                    What do you{" "}
                    <span className="text-accent">trade most?</span>
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Your primary market calibrates the instrument scanner and signal feed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {MARKETS.map((mkt) => (
                    <button
                      key={mkt.id}
                      type="button"
                      onClick={() => {
                        setPrimaryMarket(mkt.id);
                        // Allow immediate advance on selection
                        setTimeout(() => setStep(3), 120);
                      }}
                      className={cn(
                        "p-3.5 text-left border transition-all flex items-start gap-3 group",
                        primaryMarket === mkt.id
                          ? "border-accent bg-accent/8 text-text-primary"
                          : "border-border-slate hover:border-accent/50 text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <mkt.icon
                        className={cn(
                          "w-4 h-4 mt-0.5 shrink-0",
                          primaryMarket === mkt.id
                            ? "text-accent"
                            : "text-text-tertiary group-hover:text-accent/60"
                        )}
                      />
                      <div>
                        <p className="font-bold uppercase text-[11px] tracking-wide leading-none mb-0.5">
                          {mkt.label}
                        </p>
                        <p className="text-[9px] text-text-tertiary uppercase leading-snug">
                          {mkt.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION & PRODUCT ENTRY */}
            {step === 3 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-profit uppercase tracking-widest block">
                    // ACTIVATION COMPLETE
                  </span>
                  <h3 className="text-3xl font-display font-bold uppercase leading-none">
                    Profile{" "}
                    <span className="text-profit">Configured.</span>
                  </h3>
                </div>

                {/* Activation Summary */}
                <div className="p-4 bg-background-elevated border border-border-slate space-y-3">
                  <div className="flex items-center gap-2 text-profit">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                      STATUS: PROFILE CONFIGURED // {(userProfile?.subscription_tier || "FREE").toUpperCase()} TIER ACTIVE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase block">
                        Primary Objective
                      </span>
                      <span className="text-xs font-bold text-text-primary uppercase block mt-0.5">
                        {primaryObjective}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase block">
                        Primary Market
                      </span>
                      <span className="text-xs font-bold text-text-primary uppercase block mt-0.5">
                        {primaryMarket}
                      </span>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Recommended Next Operations */}
                <div className="space-y-2">
                  <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                    // Recommended Next Operations:
                  </p>
                  <Link
                    href="/dashboard/accounts"
                    onClick={handleComplete}
                    className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChevronRight className="w-3.5 h-3.5 text-accent" />
                      <div>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                          Stage 0: Configure Trading Account
                        </p>
                        <p className="text-[9px] text-text-tertiary">
                          Connect your challenge, funded account, or personal broker risk limits
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/prepare"
                    onClick={handleComplete}
                    className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChevronRight className="w-3.5 h-3.5 text-accent" />
                      <div>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                          Stage 1: Session Preparation
                        </p>
                        <p className="text-[9px] text-text-tertiary">
                          Complete market check-in and verify daily risk allowance
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                  </Link>

                  <Link
                    href="/dashboard/the-wire"
                    onClick={handleComplete}
                    className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChevronRight className="w-3.5 h-3.5 text-accent" />
                      <div>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                          Market Intelligence: The Wire
                        </p>
                        <p className="text-[9px] text-text-tertiary">
                          Review morning and evening macroeconomic briefing
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="flex justify-end gap-3 pt-8 border-t border-border-slate/20 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-8 py-3.5 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors"
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !primaryObjective) ||
                  (step === 2 && !primaryMarket)
                }
                className="px-10 py-3.5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-10 py-3.5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? "Activating..." : "Launch Terminal"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
