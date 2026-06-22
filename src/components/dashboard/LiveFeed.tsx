"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface FeedItem {
  id: string;
  type: "alert" | "event";
  severity?: "green" | "orange" | "red";
  source?: string;
  message: string;
  time?: string;
}

interface LiveFeedProps {
  items: FeedItem[];
  className?: string;
}

export function LiveFeed({ items, className }: LiveFeedProps) {
  return (
    <div className={cn("flex flex-col h-full bg-[#181818] overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#333330] mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A85]">Live Feed</span>
          <span className="text-[8px] font-mono text-[#18B880] border border-[#18B880]/20 bg-[#18B880]/5 px-1.5 py-0.5 rounded">24H</span>
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {items.map((item) => {
          if (item.type === "alert") {
            return (
              <div 
                key={item.id} 
                className="bg-[#F9771D] text-white p-3 flex items-start gap-2.5 rounded-none transition-all duration-300 transform hover:scale-[1.01]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">{item.source || "SYSTEM"}</span>
                  <span className="opacity-75 mx-1.5">|</span>
                  <span>{item.message}</span>
                </div>
              </div>
            );
          }

          // Event type
          const dotColor = 
            item.severity === "green" ? "bg-[#18B880]" :
            item.severity === "orange" ? "bg-[#F9771D]" :
            "bg-[#CE6969]";

          return (
            <div 
              key={item.id} 
              className="bg-[#2A2A2A] text-white p-3 flex items-start gap-2.5 rounded-none border-l-2 border-[#555550]"
            >
              <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse", dotColor)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#E4E2DD] leading-relaxed">{item.message}</p>
                {item.time && <p className="text-[9px] font-mono text-[#8A8A85] mt-1">{item.time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
