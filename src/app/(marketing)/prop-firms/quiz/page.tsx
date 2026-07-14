"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ShieldCheck, Mail, Target, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  title: string;
  options: { label: string; value: string; propFirmBias: string }[];
};

const questions: Question[] = [
  {
    id: "style",
    title: "What is your primary trading style?",
    options: [
      { label: "Aggressive Day Trading / Scalping", value: "scalp", propFirmBias: "ftmo" },
      { label: "Consistent Swing Trading", value: "swing", propFirmBias: "the5ers" },
      { label: "Algorithmic / High Frequency", value: "algo", propFirmBias: "funding-pips" },
    ]
  },
  {
    id: "news",
    title: "Do you trade high-impact news events (NFP, CPI)?",
    options: [
      { label: "Yes, it's a core part of my edge.", value: "yes", propFirmBias: "the5ers" },
      { label: "No, I sit on the sidelines.", value: "no", propFirmBias: "funding-pips" },
      { label: "Sometimes, but I manage risk strictly.", value: "sometimes", propFirmBias: "ftmo" },
    ]
  },
  {
    id: "weekends",
    title: "Do you hold positions over the weekend?",
    options: [
      { label: "Always. I hold for weeks.", value: "yes", propFirmBias: "the5ers" },
      { label: "Never. I close everything Friday.", value: "no", propFirmBias: "ftmo" },
    ]
  }
];

export default function PropFirmQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const handleOptionSelect = (questionId: string, bias: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: bias }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowEmailCapture(true);
    }
  };

  const calculateResult = () => {
    const scores: Record<string, number> = { "ftmo": 0, "the5ers": 0, "funding-pips": 0 };
    Object.values(answers).forEach(bias => {
      if (scores[bias] !== undefined) scores[bias]++;
    });
    
    // Find the firm with the highest score
    let topFirm = "ftmo";
    let maxScore = -1;
    for (const [firm, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topFirm = firm;
      }
    }
    return topFirm;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firm = calculateResult();
    try {
      await fetch("/api/prop-firms/quiz-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firmMatch: firm,
          tradingStyle: answers["style"] ?? "unknown",
        }),
      });
    } catch {
      // Non-blocking — still show result even if email call fails
    }
    setShowEmailCapture(false);
    setShowResult(true);
  };

  const result = calculateResult();

  const getFirmDetails = (id: string) => {
    switch(id) {
      case "ftmo": return { name: "FTMO", desc: "The perfect environment for aggressive intraday execution.", color: "text-[#00A7E1]", border: "border-[#00A7E1]" };
      case "the5ers": return { name: "The5%ers", desc: "Ideal for your longer-term swing trading and news flexibility.", color: "text-[#D4A373]", border: "border-[#D4A373]" };
      case "funding-pips": return { name: "Funding Pips", desc: "The best budget-friendly option for strict risk managers.", color: "text-[#00E676]", border: "border-[#00E676]" };
      default: return { name: "FTMO", desc: "The industry standard for serious execution.", color: "text-[#00A7E1]", border: "border-[#00A7E1]" };
    }
  };

  const firmData = getFirmDetails(result);

  return (
    <div className="min-h-[80vh] flex flex-col pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 max-w-3xl flex-grow flex flex-col justify-center">
        
        {/* Progress Bar */}
        {!showResult && !showEmailCapture && (
          <div className="mb-12">
            <div className="flex justify-between text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-2">
              <span>Diagnostic Phase</span>
              <span>{Math.round(((currentStep) / questions.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-background-elevated/40 w-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${((currentStep) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quiz Questions */}
        {!showResult && !showEmailCapture && (
          <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-8 md:p-12 shadow-2xl">
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors mb-8"
              >
                <ArrowLeft className="w-3 h-3" /> Previous
              </button>
            )}
            
            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase mb-8 leading-tight">
              {questions[currentStep].title}
            </h2>
            
            <div className="space-y-4">
              {questions[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(questions[currentStep].id, option.propFirmBias)}
                  className="w-full text-left p-6 border border-border-slate/50 hover:border-border-slate hover:bg-accent/5 transition-all group flex justify-between items-center"
                >
                  <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">
                    {option.label}
                  </span>
                  <div className="w-4 h-4 border border-border-slate/50 rounded-full group-hover:border-border-slate group-hover:bg-accent/20 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Email Capture (Lead Gen) */}
        {showEmailCapture && (
          <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 p-8 md:p-12 shadow-2xl text-center">
            <Target className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-sans font-black uppercase mb-4">
              Analysis Complete.
            </h2>
            <p className="text-text-secondary mb-8">
              Enter your email to reveal your mathematically optimal prop firm match and receive your <span className="text-text-primary font-bold">Free Challenge Survival Checklist</span>.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input 
                  type="email" 
                  required
                  placeholder="Enter your best email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-elevated/40 border border-border-slate/50 pl-12 pr-4 py-4 text-sm focus:border-border-slate focus:outline-none transition-colors text-text-primary placeholder:text-text-tertiary"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
              >
                Reveal My Match <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-4">
                We protect your data. No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        )}

        {/* Results & Upsell Phase */}
        {showResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* The Result */}
            <div className={cn("bg-background-surface/40 backdrop-blur-md border p-8 md:p-12 text-center relative overflow-hidden", firmData.border)}>
              <div className={cn("absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-current via-background-primary to-background-primary", firmData.color)} />
              
              <div className="relative z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-text-tertiary font-bold block mb-4">
                  // OPTIMAL MATCH DETERMINED
                </span>
                <h1 className={cn("  font-sans font-black uppercase mb-4", firmData.color)}>
                  {firmData.name}
                </h1>
                <p className="text-xl text-text-secondary mb-8">
                  {firmData.desc} Based on your parameters, this is the most statistically viable environment for your capital.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href={`/api/market/prop-firms/redirect?id=${result}&source=quiz_result`}
                    className="px-8 py-4 bg-text-primary text-background-primary font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors"
                  >
                    Start {firmData.name} Challenge
                  </a>
                  <Link 
                    href={`/prop-firms/${result}`}
                    className="flex-1 py-4 bg-background-elevated/40 backdrop-blur-md border border-border-slate/50 font-bold hover:bg-background-elevated text-text-primary transition-colors flex items-center justify-center"
                  >
                    Read The Data Review
                  </Link>
                </div>
              </div>
            </div>

            {/* The Low-Ticket Upsell */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/30 p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-accent mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Recommended Add-On</span>
                </div>
                <h3 className="text-2xl font-sans font-bold uppercase mb-2">The Challenge Survival Kit</h3>
                <p className="text-sm text-text-secondary">
                  Don't start your {firmData.name} evaluation without a math-backed risk model. Get our internal drawdown recovery sheets and daily routines.
                </p>
              </div>
              <Link href="/store/prop-survival-kit" className="shrink-0 px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors">
                Get The Kit — £14
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
