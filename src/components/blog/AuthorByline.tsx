import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

interface AuthorBylineProps {
  authorName?: string;
  authorRole?: string;
  authorLink?: string;
  date?: string;
  readTime?: string;
  factChecked?: boolean;
}

export function AuthorByline({
  authorName = "Pete Currey",
  authorRole = "Founder, Drawdown",
  authorLink = "/about",
  date,
  readTime,
  factChecked = true,
}: AuthorBylineProps) {
  return (
    <div className="py-4 border-y border-border-slate/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-primary">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background-elevated border border-border-slate flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-accent">
            {authorName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Link href={authorLink} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">
              {authorName}
            </Link>
            {factChecked && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-profit/10 border border-profit/20" title="Fact-checked by Drawdown Research Desk">
                <CheckCircle2 className="w-3 h-3 text-profit" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-profit font-bold">Verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary mt-0.5">
            <span>{authorRole}</span>
            {date && (
              <>
                <span className="opacity-50">•</span>
                <time>{date}</time>
              </>
            )}
            {readTime && (
              <>
                <span className="opacity-50">•</span>
                <span>{readTime} read</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 pl-12 md:pl-0">
        <Link 
          href="/editorial-standards" 
          className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors bg-background-surface px-3 py-1.5 rounded-md border border-border-slate/50"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Editorial Standards</span>
        </Link>
      </div>
    </div>
  );
}
