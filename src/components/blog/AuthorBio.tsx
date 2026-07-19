"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AuthorBioProps {
  author: "Pete Currey" | "Drawdown Team";
}

export function AuthorBio({ author }: AuthorBioProps) {
  const isPete = author === "Pete Currey";

  return (
    <div className="p-6 bg-slate-50 border border-[#E5E5E5] rounded-none shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-[#E5E5E5] rounded-none flex items-center justify-center shadow-sm">
            <span className="text-lg font-mono font-black text-accent">
              {isPete ? "PC" : "DT"}
            </span>
          </div>
          <div>
            <h5 className="text-sm font-mono font-bold uppercase text-slate-800 leading-tight">
              {author}
            </h5>
            <span className="text-[9px] font-mono uppercase tracking-widest text-accent block">
              {isPete ? "Founder of Drawdown" : "Drawdown Research Desk"}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          {isPete
            ? "Professional trader and algorithmic systems architect. Pete built Drawdown to strip away retail noise and focus on cold professional risk."
            : "The Drawdown research desk. Composed of professional analysts and systematic developers extracting edge from order flow data."}
        </p>
        {isPete && (
          <Link 
            href="/about" 
            className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-450 hover:text-accent transition-colors font-bold"
          >
            Pete's Story <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
