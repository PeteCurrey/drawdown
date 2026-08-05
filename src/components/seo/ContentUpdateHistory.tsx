"use client";

import React, { useState } from "react";
import { History, ChevronDown, ChevronUp, ShieldCheck, AlertCircle } from "lucide-react";
import { ContentVersion } from "@/types/research";

interface ContentUpdateHistoryProps {
  versions: ContentVersion[];
  lastReviewedDate?: string;
  reviewerName?: string;
}

export const ContentUpdateHistory: React.FC<ContentUpdateHistoryProps> = ({
  versions,
  lastReviewedDate,
  reviewerName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!versions || versions.length === 0) return null;

  const latestVersion = versions[0];

  return (
    <div className="my-6 border border-border-primary/60 rounded-xl bg-background-secondary/30 p-4 transition-all">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                Version {latestVersion.version}
              </span>
              <span className="text-xs text-text-tertiary">•</span>
              <span className="text-xs text-text-secondary">
                Updated {latestVersion.date}
              </span>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">
              {versions.length} recorded update{versions.length > 1 ? "s" : ""} | Last reviewed: {lastReviewedDate || latestVersion.date} {reviewerName ? `by ${reviewerName}` : ""}
            </p>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-primary p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border-primary/40 space-y-3">
          {versions.map((ver, idx) => (
            <div key={idx} className="text-xs bg-background-primary/50 rounded-lg p-3 border border-border-primary/30">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-text-primary">{ver.version}</span>
                  <span className="text-text-tertiary">({ver.date})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-accent/10 text-accent">
                    {ver.type.replace("_", " ")}
                  </span>
                </div>
                {ver.conclusionChanged && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Material Conclusion Change
                  </span>
                )}
              </div>
              <p className="text-text-secondary leading-relaxed">{ver.summary}</p>
              <div className="mt-2 text-[11px] text-text-tertiary flex items-center gap-3">
                <span>Author: {ver.author}</span>
                {ver.reviewer && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Reviewed by: {ver.reviewer}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
