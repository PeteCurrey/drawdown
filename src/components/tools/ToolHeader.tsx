"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Check, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react";

interface ToolHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  category?: string;
}

export function ToolHeader({ badge, title, subtitle, category = "Free Trading Calculator" }: ToolHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="mb-10 max-w-4xl">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-xs font-mono mb-4 text-[var(--text-tertiary)]">
        <Link href="/tools" className="hover:text-[var(--text-primary)] transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[var(--text-secondary)]">{category}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="inline-flex items-center gap-2">
          <span 
            className="px-2.5 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{
              borderColor: "var(--border-subtle)",
              backgroundColor: "rgba(22,33,62,0.03)",
              color: "var(--text-secondary)",
              borderRadius: "var(--radius-pill)"
            }}
          >
            {badge}
          </span>
          <span className="text-[11px] font-mono text-[var(--market-up)] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--market-up)] inline-block" />
            Zero-gate / Unrestricted
          </span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border transition-all duration-150 cursor-pointer self-start md:self-auto"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--surface-raised)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius-sm)",
          }}
          title="Share current parameter configuration"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--market-up)]" />
              <span className="text-[var(--market-up)]">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>Share Config</span>
            </>
          )}
        </button>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight text-[var(--text-primary)] mb-4">
        {title}
      </h1>
      <p className="text-base sm:text-lg font-sans text-[var(--text-secondary)] leading-relaxed max-w-3xl">
        {subtitle}
      </p>
    </header>
  );
}
