"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Cpu, Info } from "lucide-react";

interface WorkingStep {
  label: string;
  formula: string;
  calculation: string;
  result: string;
}

interface ToolWorkingBoxProps {
  steps: WorkingStep[];
  title?: string;
  defaultExpanded?: boolean;
}

export function ToolWorkingBox({
  steps,
  title = "Show the Working (Mathematical Transparency)",
  defaultExpanded = true,
}: ToolWorkingBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div
      className="border my-8 overflow-hidden transition-all"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--surface-raised)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-black/[0.02]"
        style={{
          borderBottom: isOpen ? "1px solid var(--border-subtle)" : "none",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-mono uppercase tracking-[0.08em] font-semibold text-[var(--text-primary)]">
            {title}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-black/5 text-[var(--text-tertiary)] bg-black/[0.02]">
            {steps.length} Steps
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-[var(--text-secondary)]">
          <span>{isOpen ? "Hide Steps" : "Inspect Math"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 space-y-4 font-mono text-xs">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 border border-black/5 rounded space-y-2 bg-[var(--surface-base)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-black/5 pb-2">
                <span className="font-semibold text-[var(--text-primary)]">{step.label}</span>
                <span className="text-[11px] text-[var(--text-tertiary)] font-normal">
                  Formula: {step.formula}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
                <span className="text-[var(--text-secondary)] break-all">{step.calculation}</span>
                <span className="font-bold text-[var(--accent)] shrink-0 text-sm">
                  {step.result}
                </span>
              </div>
            </div>
          ))}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              All math computed client-side in pure IEEE 754 floating-point precision without server round-trips.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
