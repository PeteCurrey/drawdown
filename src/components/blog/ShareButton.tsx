"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer bg-transparent border-none text-[10px] font-mono uppercase tracking-widest text-text-tertiary"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-profit" />
          <span className="text-profit">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3 h-3 text-accent" />
          <span>Share Insight</span>
        </>
      )}
    </button>
  );
}
