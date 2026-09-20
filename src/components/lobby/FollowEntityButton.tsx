"use client";

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";

interface FollowEntityButtonProps {
  entityType: 'market' | 'broker' | 'prop_firm' | 'platform' | 'category' | 'tool';
  entityName: string;
  initialFollowing?: boolean;
  className?: string;
}

export function FollowEntityButton({
  entityType,
  entityName,
  initialFollowing = false,
  className = ""
}: FollowEntityButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const nextState = !following;
    setFollowing(nextState);

    try {
      const res = await fetch("/api/lobby/preferences/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityName, follow: nextState })
      });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      } else {
        setFollowing(!nextState);
      }
    } catch {
      setFollowing(!nextState);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
        following
          ? "bg-zinc-800 text-emerald-400 border-emerald-900/60 hover:bg-zinc-700"
          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
      } ${className}`}
      title={following ? `Following ${entityName}` : `Follow ${entityName}`}
    >
      {following ? (
        <>
          <Check className="w-2.5 h-2.5" />
          Following
        </>
      ) : (
        <>
          <Plus className="w-2.5 h-2.5" />
          Follow
        </>
      )}
    </button>
  );
}
