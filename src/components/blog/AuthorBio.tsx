"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorBioProps {
  author: "Pete Currey" | "Drawdown Team";
  isDark?: boolean;
}

export function AuthorBio({ author, isDark = false }: AuthorBioProps) {
  const isPete = author === "Pete Currey";

  return (
    <div className={cn(
      "p-6 border rounded-none shadow-sm relative overflow-hidden group",
      isDark ? "bg-[#111111] border-[#1A1A1A] text-white" : "bg-slate-50 border-[#E5E5E5]"
    )}>
      <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 border rounded-none flex items-center justify-center shadow-sm",
            isDark ? "bg-[#0A0A0A] border-[#1A1A1A]" : "bg-white border-[#E5E5E5]"
          )}>
            <span className={cn(
              "text-lg font-mono font-black",
              isDark ? "text-[#C8F135]" : "text-accent"
            )}>
              {isPete ? "PC" : "DT"}
            </span>
          </div>
          <div>
            <h5 className={cn(
              "text-sm font-mono font-bold uppercase leading-tight",
              isDark ? "text-white" : "text-slate-800"
            )}>
              {author}
            </h5>
            <span className={cn(
              "text-[9px] font-mono uppercase tracking-widest block",
              isDark ? "text-[#C8F135]" : "text-accent"
            )}>
              {isPete ? "Founder of Drawdown" : "Drawdown Research Desk"}
            </span>
          </div>
        </div>
        <p className={cn(
          "text-xs leading-relaxed font-sans",
          isDark ? "text-zinc-450" : "text-slate-500"
        )}>
          {isPete
            ? "Professional trader and algorithmic systems architect. Pete built Drawdown to strip away retail noise and focus on cold professional risk."
            : "The Drawdown research desk. Composed of professional analysts and systematic developers extracting edge from order flow data."}
        </p>
        {isPete && (
          <Link 
            href="/about" 
            className={cn(
              "inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest font-bold transition-colors",
              isDark ? "text-zinc-550 hover:text-[#C8F135]" : "text-slate-450 hover:text-accent"
            )}
          >
            Pete's Story <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
