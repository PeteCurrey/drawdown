"use client";
/**
 * SlideOver — reusable right-side slide-over panel.
 *
 * Usage:
 *   <SlideOver open={open} onClose={() => setOpen(false)} title="COT Data">
 *     <p>Explanation content here...</p>
 *   </SlideOver>
 *
 * Features:
 *   - Slides in from the right (400px desktop, full-width mobile)
 *   - White background, left border 1px #e5e7eb
 *   - Closes on: × button, backdrop click, or Escape key
 *   - Scrollable content area
 *   - Subtle backdrop rgba(0,0,0,0.15)
 */

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number; // px, default 420
}

export function SlideOver({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 420,
}: SlideOverProps) {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.15)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white overflow-hidden"
        style={{
          width: `min(${width}px, 100vw)`,
          borderLeft: "1px solid #e5e7eb",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
          animation: "slideOverIn 220ms ease-out both",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <style>{`
          @keyframes slideOverIn {
            from { transform: translateX(100%); opacity: 0.5; }
            to   { transform: translateX(0);    opacity: 1;   }
          }
        `}</style>

        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0"
        >
          <div>
            <h2 className="text-[15px] font-bold text-[#111827] leading-tight">{title}</h2>
            {subtitle && (
              <p className="text-[12px] text-[#6b7280] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-4 shrink-0 mt-0.5"
            aria-label="Close panel"
          >
            <X className="w-4 h-4 text-[#6b7280]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </>
  );
}

/** Reusable definition block inside a SlideOver */
export function SlideOverSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-mono uppercase tracking-widest text-[#9ca3af] mb-2">
        {label}
      </p>
      <div className="text-[13px] text-[#374151] leading-relaxed">{children}</div>
    </div>
  );
}

/** Impact pill for calendar events */
export function ImpactPill({ impact }: { impact: "high" | "medium" | "low" | string }) {
  const styles =
    impact === "high"   ? "bg-red-50 text-red-700 border border-red-200" :
    impact === "medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-gray-50 text-gray-500 border border-gray-200";
  return (
    <span className={cn("text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full", styles)}>
      {impact}
    </span>
  );
}
