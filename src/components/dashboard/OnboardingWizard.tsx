"use client";

import { useState } from "react";
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
  Globe
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  userProfile: any;
  onComplete: () => void;
}

export function OnboardingWizard({ userProfile, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<string | null>(userProfile.experience_level || null);
  const [country, setCountry] = useState<string>(userProfile.country || 'US');
  const [currency, setCurrency] = useState<string>(userProfile.currency || 'USD');
  const [markets, setMarkets] = useState<string[]>(userProfile.preferred_markets || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleComplete = async () => {
    console.log("Onboarding initialization started...");
    setIsSubmitting(true);
    
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          experience_level: experience,
          country: country,
          currency: currency,
          preferred_markets: markets,
          has_onboarded: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (error) {
        console.error("Onboarding database update error:", error);
      } else {
        console.log("Onboarding database update successful.");
      }
    } catch (err) {
      console.error("Onboarding unexpected error:", err);
    } finally {
      console.log("Closing onboarding wizard.");
      // Always mark as onboarded in localStorage so wizard never reappears
      localStorage.setItem("drawdown_onboarded", "true");
      onComplete();
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: "Define Your Edge", icon: Brain },
    { title: "Regional Settings", icon: Globe },
    { title: "Market Alignment", icon: Target },
    { title: "The Road Map", icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/95 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-background-surface border border-border-slate shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Progress Sidebar */}
        <div className="w-full md:w-80 bg-background-elevated p-10 border-r border-border-slate space-y-12">
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
                Configuration of your institutional terminal based on experience and volatility preference.
              </p>
           </div>
        </div>

        {/* Right: Content Area */}
        <div className="flex-grow p-12 md:p-16 flex flex-col justify-between min-h-[500px]">
           <div>
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">What is your <br /> <span className="text-accent">Current Experience?</span></h3>
                      <p className="text-sm text-text-secondary">We calibrate the AI insights and curriculum difficulty based on your history.</p>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'beginner', label: 'Beginner', desc: 'Less than 1 year. Focusing on core mechanics and risk.' },
                        { id: 'intermediate', label: 'Intermediate', desc: '1-3 years. Familiar with SMC and institutional flow.' },
                        { id: 'advanced', label: 'Advanced', desc: '3+ years. Looking for refined edge and deep analysis.' }
                      ].map((opt) => (
                        <button 
                          key={opt.id}
                          onClick={() => setExperience(opt.id)}
                          className={cn(
                            "p-6 text-left border transition-all flex justify-between items-center group",
                            experience === opt.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/50"
                          )}
                        >
                           <div>
                              <p className="font-bold uppercase text-sm mb-1">{opt.label}</p>
                              <p className="text-[10px] text-text-tertiary uppercase">{opt.desc}</p>
                           </div>
                           <div className={cn(
                             "w-4 h-4 rounded-full border flex items-center justify-center",
                             experience === opt.id ? "border-accent" : "border-border-slate"
                           )}>
                              {experience === opt.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Select your <br /> <span className="text-accent">Region & Base Currency.</span></h3>
                      <p className="text-sm text-text-secondary">We will localize your dashboard analytics and partner payouts accordingly.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Primary Region</label>
                         <select 
                           value={country}
                           onChange={(e) => setCountry(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                         >
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="SG">Singapore</option>
                            <option value="HK">Hong Kong</option>
                            <option value="EU">European Union</option>
                            <option value="OTHER">Other</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Base Currency</label>
                         <select 
                           value={currency}
                           onChange={(e) => setCurrency(e.target.value)}
                           className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                         >
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD (A$)</option>
                            <option value="SGD">SGD (S$)</option>
                            <option value="HKD">HKD (HK$)</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Select your <br /> <span className="text-accent">Market Focus.</span></h3>
                      <p className="text-sm text-text-secondary">Your scanner and intelligence feed will prioritize these asset classes.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'forex', label: 'FX Majors', icon: Globe },
                        { id: 'indices', label: 'Equity Indices', icon: TrendingUp },
                        { id: 'crypto', label: 'Digital Assets', icon: Zap },
                        { id: 'commodities', label: 'Hard Assets', icon: ShieldCheck }
                      ].map((opt) => (
                        <button 
                          key={opt.id}
                          onClick={() => {
                            if (markets.includes(opt.id)) setMarkets(markets.filter(m => m !== opt.id));
                            else setMarkets([...markets, opt.id]);
                          }}
                          className={cn(
                            "p-8 border transition-all flex flex-col items-center gap-4 group",
                            markets.includes(opt.id) ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/50"
                          )}
                        >
                           <opt.icon className={cn("w-6 h-6", markets.includes(opt.id) ? "text-accent" : "text-text-tertiary")} />
                           <p className="font-bold uppercase text-[10px] tracking-widest">{opt.label}</p>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-6">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Deployment <br /> <span className="text-profit">Successful.</span></h3>
                      <div className="p-8 bg-profit/5 border border-profit/20 rounded-sm space-y-4">
                         <div className="flex items-center gap-2 text-profit">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Verification: {userProfile.subscription_tier}</span>
                         </div>
                         <p className="text-xs text-text-secondary leading-relaxed">
                            Your institutional access is active. We have configured your Intelligence Hub to monitor <span className="text-text-primary font-bold">{markets.join(', ')}</span> with a focus on <span className="text-text-primary font-bold">{experience}</span> level insights.
                         </p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Next Steps:</p>
                      <ul className="space-y-3">
                         <li className="flex items-center gap-3 text-xs text-text-secondary">
                            <ChevronRight className="w-3 h-3 text-accent" /> Complete the "Edge" phase in the Library.
                         </li>
                         <li className="flex items-center gap-3 text-xs text-text-secondary">
                            <ChevronRight className="w-3 h-3 text-accent" /> Sync your first trade log.
                         </li>
                      </ul>
                   </div>
                </div>
              )}
           </div>

           <div className="flex justify-end gap-4 pt-12">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors"
                >
                   Back
                </button>
              )}
              <button 
                onClick={() => step === 4 ? handleComplete() : setStep(step + 1)}
                disabled={step === 1 && !experience || step === 3 && markets.length === 0 || isSubmitting}
                className="px-10 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                 {step === 4 ? (isSubmitting ? 'Initializing...' : 'Launch Terminal') : 'Continue'} 
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
