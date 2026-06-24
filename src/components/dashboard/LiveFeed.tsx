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
  theme?: "light" | "dark";
}

export function LiveFeed({ items, className, theme = "dark" }: LiveFeedProps) {
  const isLight = theme === "light";

  return (
    <div 
      className={cn(
        "flex flex-col h-full overflow-hidden", 
        isLight ? "bg-white" : "bg-[#181818]",
        className
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          "flex items-center justify-between pb-3 mb-3 border-b",
          isLight ? "border-gray-100" : "border-[#333330]"
        )}
      >
        <div className="flex items-center gap-2">
          <span 
            className={cn(
              "text-[10px] font-mono uppercase tracking-widest",
              isLight ? "text-gray-500" : "text-[#8A8A85]"
            )}
          >
            Live Feed
          </span>
          <span 
            className={cn(
              "text-[8px] font-mono px-1.5 py-0.5 rounded",
              isLight 
                ? "bg-gray-100 text-gray-500 border border-gray-200" 
                : "text-[#18B880] border border-[#18B880]/20 bg-[#18B880]/5"
            )}
          >
            24H
          </span>
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {items.map((item, idx) => {
          // Identify if this is an alert type
          const isAlert = item.type === "alert";
          
          // Identify if this is the top highlighted alert (first alert in list)
          const isTopAlert = isAlert && idx === items.findIndex(f => f.type === "alert");

          if (isAlert) {
            return (
              <div 
                key={item.id} 
                className={cn(
                  "p-3 flex items-start gap-2.5 transition-all duration-300 transform hover:scale-[1.01]",
                  isLight 
                    ? isTopAlert 
                      ? "bg-[#fffbeb] text-[#92400e] border-l-3 border-[#f97316] rounded-r-lg" 
                      : "bg-[#fffbeb] text-[#92400e] rounded-lg"
                    : "bg-[#F9771D] text-white rounded-none"
                )}
                style={{
                  borderLeft: isLight && isTopAlert ? "3px solid #f97316" : undefined
                }}
              >
                <AlertCircle className={cn("w-4 h-4 shrink-0 mt-0.5", isLight ? "text-[#f97316]" : "text-white")} />
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
              className={cn(
                "p-3 flex items-start gap-2.5 transition-colors",
                isLight 
                  ? "bg-transparent hover:bg-gray-50 text-gray-700 border-b border-gray-100" 
                  : "bg-[#2A2A2A] text-white rounded-none border-l-2 border-[#555550]"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse", dotColor)} />
              <div className="flex-1 min-w-0">
                <p 
                  className={cn(
                    "text-xs leading-relaxed",
                    isLight ? "text-gray-700" : "text-[#E4E2DD]"
                  )}
                >
                  {item.message}
                </p>
                {item.time && (
                  <p 
                    className={cn(
                      "text-[9px] font-mono mt-1",
                      isLight ? "text-gray-400" : "text-[#8A8A85]"
                    )}
                  >
                    {item.time}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
