"use client";

import { useState, useEffect } from "react";
import { PatternDetector, PsychologyPattern } from "@/lib/coach/pattern-detector";
import { IndividualTrade, FundedAccount } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, ShieldAlert, Zap, Brain, ChevronRight } from "lucide-react";

interface PsychologyCoachProps {
  trades: IndividualTrade[];
  account: FundedAccount;
}

export function PsychologyCoach({ trades, account }: PsychologyCoachProps) {
  const [patterns, setPatterns] = useState<PsychologyPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate engine analysis
    const timer = setTimeout(() => {
      const detector = new PatternDetector({ trades, account });
      setPatterns(detector.detectPatterns());
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [trades, account]);

  if (loading) {
    return (
      <div className="p-6 bg-white border border-[#E8E6E1] rounded-lg space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-[#888882]" />
          <div className="h-4 bg-[#F4F3F0] w-48 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-[#F4F3F0] w-full rounded" />
          <div className="h-16 bg-[#F4F3F0] w-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <Brain className="w-4 h-4 text-[#F9771D]" />
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">Psychology Coach</h4>
        </div>
        <span className="text-[10px] font-medium text-[#888882]">Live Engine</span>
      </div>

      <div className="space-y-3">
        {patterns.length === 0 ? (
          <div className="p-6 bg-white border border-[rgba(24,184,128,0.2)] rounded-lg flex flex-col items-center text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#F0FDF8] flex items-center justify-center text-[#18B880]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              {trades.length === 0 ? (
                <>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Awaiting Trade Data</p>
                  <p className="text-xs text-[#888882]">Log your first trades in the journal to activate behavioural pattern detection.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Discipline Maintained</p>
                  <p className="text-xs text-[#888882]">No negative behavioural patterns detected across your recent trades.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          patterns.map((pattern) => (
            <div 
              key={pattern.id}
              className={cn(
                "p-5 rounded-lg border border-l-4 transition-all",
                pattern.severity === 'critical' ? "bg-[#FDF2F2] border-[rgba(206,105,105,0.2)] border-l-[#CE6969]" : 
                pattern.severity === 'high' ? "bg-[#FFFBEB] border-[rgba(217,119,6,0.2)] border-l-[#D97706]" : 
                "bg-[#FFF4EC] border-[rgba(249,119,29,0.2)] border-l-[#F9771D]"
              )}
            >
              <div className="flex items-start gap-3.5">
                {pattern.severity === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-[#CE6969] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                )}
                <div className="space-y-2.5 flex-1">
                  <div>
                    <h5 className="text-sm font-bold text-[#1A1A1A] mb-1">{pattern.name}</h5>
                    <p className="text-xs text-[#4A4A47] leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-[#E8E6E1] space-y-1">
                    <div className="flex items-center gap-1.5">
                       <Zap className="w-3 h-3 text-[#F9771D]" />
                       <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]">Recommendation</span>
                    </div>
                    <p className="text-xs text-[#4A4A47] leading-relaxed">
                      {pattern.recommendation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#888882]">
                     <span>Detected: {new Date(pattern.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     <button className="text-[11px] font-semibold text-[#F9771D] hover:underline flex items-center gap-1">
                        Review Trade <ChevronRight className="w-3 h-3" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-[#F7F7F5] border border-[#E8E6E1] rounded-lg text-center">
         <p className="text-[11px] text-[#888882] font-medium">
            Coach monitors rule adherence and equity impact in real-time.
         </p>
      </div>
    </div>
  );
}

