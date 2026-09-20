"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  articleId: string;
  initialSaved?: boolean;
  className?: string;
}

export function BookmarkButton({ articleId, initialSaved = false, className = "" }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      const res = await fetch("/api/lobby/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId })
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      } else {
        // Revert on failure
        setIsSaved(!nextState);
      }
    } catch {
      setIsSaved(!nextState);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isSaved ? "Remove from saved stories" : "Save story to read later"}
      title={isSaved ? "Saved to your list" : "Save story"}
      className={`inline-flex items-center justify-center p-1.5 transition-colors border ${
        isSaved 
          ? "bg-zinc-800 text-amber-400 border-zinc-700 hover:bg-zinc-700" 
          : "bg-transparent text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
      } ${className}`}
    >
      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-400" : ""}`} />
    </button>
  );
}
