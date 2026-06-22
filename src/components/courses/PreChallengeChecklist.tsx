"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, Printer, Check } from "lucide-react";

const CHECKLIST_ITEMS = [
  "Backtested your strategy over at least 100 historical trade setups",
  "Documented your exact daily loss limits and maximum drawdown floor",
  "Calculated your strict Kelly criteria or percentage position sizing rules",
  "Identified restricted high-impact news times and consistency rules",
  "Setup automatic journaling to log performance metrics objectively",
  "Established a daily routine checklist (pre-market preparation and review)",
  "Committed to closing all platforms immediately upon receiving a daily loss warning",
];

export function PreChallengeChecklist() {
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("drawdown_prechallenge_checklist");
    if (stored) {
      try {
        setCheckedIndices(JSON.parse(stored));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleToggle = (index: number) => {
    let next: number[];
    if (checkedIndices.includes(index)) {
      next = checkedIndices.filter(i => i !== index);
    } else {
      next = [...checkedIndices, index];
    }
    setCheckedIndices(next);
    localStorage.setItem("drawdown_prechallenge_checklist", JSON.stringify(next));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) {
    return (
      <div className="bg-[#111111] border border-[#1E1E1E] rounded p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-white/5 w-1/3 rounded" />
        <div className="space-y-2">
          <div className="h-10 bg-white/5 rounded" />
          <div className="h-10 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  const completedCount = checkedIndices.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded p-6 space-y-6 max-w-[680px] my-8 print:border-none print:bg-transparent print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4 print:border-none">
        <div>
          <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
            Pre-Challenge Checklist
          </h3>
          <p className="text-xs text-[#6B7280] font-mono uppercase mt-1">
            Status: {completedCount} of {totalCount} completed ({progressPct}%)
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="self-start sm:self-center px-4 py-2 border border-[#2A2A2A] text-white hover:text-[#22C55E] hover:border-[#22C55E] text-xs font-mono font-bold uppercase rounded flex items-center gap-2 transition-all print:hidden"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Checklist
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[#1E1E1E] rounded-full w-full overflow-hidden print:hidden">
        <div 
          className="h-full bg-[#22C55E] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item, idx) => {
          const isChecked = checkedIndices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleToggle(idx)}
              className="w-full flex items-start gap-4 p-4 text-left bg-transparent border border-[#1E1E1E]/50 rounded hover:border-[#22C55E]/50 transition-colors group print:border-none print:p-2"
            >
              <div className="mt-0.5 shrink-0 print:hidden">
                {isChecked ? (
                  <div className="w-5 h-5 rounded border border-[#22C55E] bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded border border-[#2A2A2A] group-hover:border-[#22C55E] transition-colors" />
                )}
              </div>
              
              {/* Print fallback bullet */}
              <span className="hidden print:inline text-[#22C55E] font-bold mr-2">
                {isChecked ? "[x]" : "[ ]"}
              </span>

              <span className={`text-sm leading-relaxed transition-colors ${isChecked ? "text-[#9CA3AF] line-through decoration-[#22C55E]/40" : "text-white"}`}>
                {item}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-[#6B7280] uppercase tracking-widest text-center pt-2 print:hidden">
        Checklist state persists automatically on this device
      </div>
    </div>
  );
}
