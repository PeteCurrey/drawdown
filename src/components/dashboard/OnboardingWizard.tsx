"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  Brain,
  TrendingUp,
  Globe,
  User,
  DollarSign,
  Award,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userProfile: any;
  onComplete: () => void;
}

export function OnboardingWizard({ userProfile, onComplete }: Props) {
  const router = useRouter();
  const obData = userProfile?.email_preferences?.onboarding || {};
  const [step, setStep] = useState(1);

  // Identity & Persona
  const [firstName, setFirstName] = useState<string>(
    userProfile?.display_name?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState<string>(
    userProfile?.display_name?.split(" ").slice(1).join(" ") || ""
  );
  const [style, setStyle] = useState<string | null>(obData.trading_style || null);

  // Experience & Region
  const [experience, setExperience] = useState<string | null>(obData.experience_level || null);
  const [country, setCountry] = useState<string>(userProfile?.country || 'UK');
  const [currency, setCurrency] = useState<string>(userProfile?.currency || 'GBP');

  // Markets & Capital
  const [markets, setMarkets] = useState<string[]>(obData.preferred_markets || []);
  const [capital, setCapital] = useState<string | null>(obData.trading_capital || null);

  // Trading Goals
  const [goal, setGoal] = useState<string | null>(obData.trading_goals || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const supabase = createClient();

  const handleComplete = async () => {
    if (!firstName.trim() || !lastName.trim() || !style) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      // Sync names to Supabase Auth metadata for seamless client-side greeting access
      await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName
        }
      });

      const response = await fetch('/api/user/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          experience_level: experience,
          country,
          currency,
          preferred_markets: markets,
          trading_style: style,
          trading_capital: capital,
          trading_goals: goal
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Onboarding API error:", errorText);
        setSubmitError("Failed to save profile configuration. Please check your connection and try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Onboarding database update successful.");
      if (userProfile?.id) {
        localStorage.setItem(`drawdown_onboarded_${userProfile.id}`, "true");
      }
      localStorage.setItem("drawdown_onboarded", "true");
      onComplete();
      router.push("/dashboard/accounts");
    } catch (err) {
      console.error("Onboarding unexpected error:", err);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Identity & Persona", icon: User },
    { title: "Experience & Region", icon: Brain },
    { title: "Market & Capital", icon: Target },
    { title: "Active Objectives", icon: Award },
    { title: "Operating Setup", icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/95 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-background-surface border border-border-slate shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Progress Sidebar */}
        <div className="w-full md:w-80 bg-background-elevated p-10 border-r border-border-slate space-y-12 shrink-0">
           <div className="space-y-1">
             <span className="text-[10px] font-mono text-accent uppercase tracking-widest">// DEPLOYMENT</span>
             <h2 className="text-xl font-display font-black uppercase">Initialization</h2>
           </div>
           
           <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className={cn(
                     "w-8 h-8 flex items-center justify-center border transition-all",
                     step > i + 1 ? "bg-profit border-profit text-background-primary" : 
                     step === i + 1 ? "border-accent text-accent" : "border-border-slate text-text-tertiary"
                   )}>
                      {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-mono font-bold">{i + 1}</span>}
                   </div>
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-widest",
                     step === i + 1 ? "text-text-primary" : "text-text-tertiary"
                   )}>{s.title}</span>
                </div>
              ))}
           </div>

           <div className="pt-12 border-t border-border-slate/50">
              <p className="text-[9px] font-mono text-text-tertiary leading-relaxed uppercase">
                Configuration of your trading terminal based on identity, experience and target objectives.
              </p>
           </div>
        </div>

        {/* Right: Content Area */}
        <div className="flex-grow p-12 md:p-16 flex flex-col justify-between min-h-[550px]">
           <div>
              {/* STEP 1: IDENTITY & PERSONA */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-display font-bold uppercase leading-none">Who is the <br /><span className="text-accent">Operator?</span></h3>
                      <p className="text-xs text-text-secondary">Please enter your name and select your preferred trading style/persona.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] font-mono uppercase text-text-tertiary">First Name</label>
                         <input 
                           type="text"
                           value={firstName}
                           onChange={(e) => setFirstName(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-accent"
                           placeholder="John"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-mono uppercase text-text-tertiary">Last Name</label>
                         <input 
                           type="text"
                           value={lastName}
                           onChange={(e) => setLastName(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-accent"
                           placeholder="Doe"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-mono uppercase text-text-tertiary block">Trading Style (Select One)</label>
                      <div className="grid grid-cols-2 gap-3">
                         {[
                           { id: 'scalper', label: 'Scalper', desc: 'Hold seconds/minutes.' },
                           { id: 'day_trader', label: 'Day Trader', desc: 'Closed same session.' },
                           { id: 'swing_trader', label: 'Swing Trader', desc: 'Hold days/weeks.' },
                           { id: 'position_trader', label: 'Position', desc: 'Hold weeks/months.' }
                         ].map((opt) => (
                           <button 
                             key={opt.id}
                             type="button"
                             onClick={() => setStyle(opt.id)}
                             className={cn(
                               "p-3 text-left border text-xs transition-all flex justify-between items-center",
                               style === opt.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/40"
                             )}
                           >
                              <div>
                                 <p className="font-bold uppercase text-[10px] mb-0.5">{opt.label}</p>
                                 <p className="text-[8px] text-text-tertiary uppercase">{opt.desc}</p>
                              </div>
                              <div className={cn(
                                "w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ml-2",
                                style === opt.id ? "border-accent" : "border-border-slate"
                              )}>
                                 {style === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                              </div>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 2: DEFINE YOUR EDGE */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-display font-bold uppercase leading-none">Define Your <br /><span className="text-accent">Experience & Region.</span></h3>
                      <p className="text-xs text-text-secondary">We calibrate insights and currency parameters based on your region.</p>
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-[9px] font-mono uppercase text-text-tertiary block">Trading Experience</label>
                      <div className="grid grid-cols-3 gap-3">
                         {[
                           { id: 'beginner', label: 'Beginner', desc: '< 1 Year' },
                           { id: 'intermediate', label: 'Intermediate', desc: '1 - 3 Years' },
                           { id: 'advanced', label: 'Advanced', desc: '3+ Years' }
                         ].map((opt) => (
                           <button 
                             key={opt.id}
                             type="button"
                             onClick={() => setExperience(opt.id)}
                             className={cn(
                               "p-4 text-center border transition-all flex flex-col items-center justify-center",
                               experience === opt.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/40"
                             )}
                           >
                              <span className="font-bold uppercase text-[10px] mb-0.5">{opt.label}</span>
                              <span className="text-[8px] text-text-tertiary uppercase">{opt.desc}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] font-mono uppercase text-text-tertiary">Primary Region</label>
                         <select 
                           value={country}
                           onChange={(e) => setCountry(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-accent"
                         >
                            <option value="UK">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="EU">European Union</option>
                            <option value="AU">Australia</option>
                            <option value="SG">Singapore</option>
                            <option value="HK">Hong Kong</option>
                            <option value="OTHER">Other</option>
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-mono uppercase text-text-tertiary">Base Currency</label>
                         <select 
                           value={currency}
                           onChange={(e) => setCurrency(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-accent"
                         >
                            <option value="GBP">GBP (£)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD (A$)</option>
                            <option value="SGD">SGD (S$)</option>
                            <option value="HKD">HKD (HK$)</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 3: MARKET & CAPITAL */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-display font-bold uppercase leading-none">Markets & <br /><span className="text-accent">Trading Capital.</span></h3>
                      <p className="text-xs text-text-secondary">Align the terminal to monitor your active markets and capital structure.</p>
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-[9px] font-mono uppercase text-text-tertiary block">Market Alignment (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-3">
                         {[
                           { id: 'forex', label: 'FX Majors', icon: Globe },
                           { id: 'indices', label: 'Equity Indices', icon: TrendingUp },
                           { id: 'crypto', label: 'Digital Assets', icon: Zap },
                           { id: 'commodities', label: 'Hard Assets', icon: ShieldCheck }
                         ].map((opt) => (
                           <button 
                             key={opt.id}
                             type="button"
                             onClick={() => {
                               if (markets.includes(opt.id)) setMarkets(markets.filter(m => m !== opt.id));
                               else setMarkets([...markets, opt.id]);
                             }}
                             className={cn(
                               "p-3 border transition-all flex items-center gap-3",
                               markets.includes(opt.id) ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/40"
                             )}
                           >
                              <opt.icon className={cn("w-4 h-4", markets.includes(opt.id) ? "text-accent" : "text-text-tertiary")} />
                              <span className="font-bold uppercase text-[9px] tracking-wider">{opt.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-mono uppercase text-text-tertiary block">Capital / Challenge Size (Select One)</label>
                      <div className="grid grid-cols-3 gap-3">
                         {[
                           { id: '10k', label: '10K Challenge', desc: 'Starter Portfolio' },
                           { id: '50k', label: '50K Challenge', desc: 'Intermediate' },
                           { id: '100k+', label: '100K+ Challenge', desc: 'Institutional' }
                         ].map((opt) => (
                           <button 
                             key={opt.id}
                             type="button"
                             onClick={() => setCapital(opt.id)}
                             className={cn(
                               "p-4 text-center border transition-all flex flex-col items-center justify-center",
                               capital === opt.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/40"
                             )}
                           >
                              <span className="font-bold uppercase text-[10px] mb-0.5">{opt.label}</span>
                              <span className="text-[8px] text-text-tertiary uppercase">{opt.desc}</span>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {/* STEP 4: ACTIVE OBJECTIVES */}
              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-display font-bold uppercase leading-none">Primary <br /><span className="text-accent">Trading Goal.</span></h3>
                      <p className="text-xs text-text-secondary">Select your core focus so we can customize your active dashboard checklists.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'pass_challenge', label: 'Pass a Prop Challenge', desc: 'Optimize verification rules, daily drawdown warnings, and target profit splits.' },
                        { id: 'build_consistency', label: 'Build Consistency', desc: 'Lock in disciplined risk parameters, fixed risk sizing, and emotional journal audits.' },
                        { id: 'full_time_income', label: 'Transition to Full-Time Operator', desc: 'Manage scale, payout structures, multi-broker allocations, and compound models.' },
                        { id: 'master_smc_mechanics', label: 'Master SMC / Order Flow Mechanics', desc: 'Prioritize structural scanner templates, liquidity hunts, and premium session sweeps.' }
                      ].map((opt) => (
                        <button 
                          key={opt.id}
                          type="button"
                          onClick={() => setGoal(opt.id)}
                          className={cn(
                            "p-4 text-left border transition-all flex justify-between items-center",
                            goal === opt.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/40"
                          )}
                        >
                           <div>
                              <p className="font-bold uppercase text-xs mb-0.5">{opt.label}</p>
                              <p className="text-[9px] text-text-tertiary uppercase leading-tight">{opt.desc}</p>
                           </div>
                           <div className={cn(
                             "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3",
                             goal === opt.id ? "border-accent" : "border-border-slate"
                           )}>
                              {goal === opt.id && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {/* STEP 5: OPERATING SETUP (CONFIRMATION) */}
              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-3">
                      <h3 className="text-3xl font-display font-bold uppercase leading-none">Profile <br /><span className="text-profit">Configured.</span></h3>
                      <div className="p-5 bg-background-elevated border border-border-slate rounded-none space-y-3">
                         <div className="flex items-center gap-2 text-profit">
                            <CheckCircle2 className="w-5 h-5 text-profit" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                              STATUS: PROFILE CONFIGURED // {(userProfile?.subscription_tier || 'FREE').toUpperCase()} TIER ACTIVE
                            </span>
                         </div>
                         <p className="text-xs text-text-secondary leading-relaxed">
                            Operator profile recorded for <span className="text-text-primary font-bold">{firstName} {lastName}</span>.
                            Calibrated for <span className="text-text-primary font-bold uppercase">{style?.replace('_', ' ')}</span> style across <span className="text-text-primary font-bold uppercase">{markets.join(', ')}</span> with base currency <span className="text-text-primary font-bold">{currency}</span>.
                         </p>
                      </div>
                   </div>

                   {submitError && (
                     <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{submitError}</span>
                     </div>
                   )}

                   <div className="space-y-3">
                      <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">// Recommended Next Operations:</p>
                      <div className="space-y-2">
                         <Link 
                           href="/dashboard/accounts" 
                           onClick={() => {
                             handleComplete();
                           }}
                           className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                         >
                            <div className="flex items-center gap-2.5">
                               <ChevronRight className="w-3.5 h-3.5 text-accent" />
                               <div>
                                  <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">Stage 0: Configure Trading Account</p>
                                  <p className="text-[9px] text-text-tertiary">Connect your challenge, funded account, or personal broker risk limits</p>
                               </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                         </Link>

                         <Link 
                           href="/dashboard/prepare" 
                           onClick={() => {
                             handleComplete();
                           }}
                           className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                         >
                            <div className="flex items-center gap-2.5">
                               <ChevronRight className="w-3.5 h-3.5 text-accent" />
                               <div>
                                  <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">Stage 1: Session Preparation</p>
                                  <p className="text-[9px] text-text-tertiary">Complete market check-in and verify daily risk allowance</p>
                               </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                         </Link>

                         <Link 
                           href="/dashboard/the-wire" 
                           onClick={() => {
                             handleComplete();
                           }}
                           className="flex items-center justify-between p-3 border border-border-slate hover:border-accent/60 bg-background-primary transition-all group"
                         >
                            <div className="flex items-center gap-2.5">
                               <ChevronRight className="w-3.5 h-3.5 text-accent" />
                               <div>
                                  <p className="text-xs font-semibold text-text-primary uppercase tracking-wide">Market Intelligence: The Wire</p>
                                  <p className="text-[9px] text-text-tertiary">Review morning and evening macroeconomic briefing</p>
                               </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
                         </Link>
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="flex justify-end gap-4 pt-12 border-t border-border-slate/10">
              {step > 1 && (
                <button 
                  key="back-btn"
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-3.5 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors"
                >
                   Back
                </button>
              )}
              <button 
                key="cont-btn"
                type="button"
                onClick={() => step === 5 ? handleComplete() : setStep(step + 1)}
                disabled={
                  (step === 1 && (!firstName || !lastName || !style)) ||
                  (step === 2 && !experience) ||
                  (step === 3 && (markets.length === 0 || !capital)) ||
                  (step === 4 && !goal) ||
                  isSubmitting
                }
                className="px-10 py-3.5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                 {step === 5 ? (isSubmitting ? 'Saving Profile...' : 'Launch Terminal') : 'Continue'} 
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
