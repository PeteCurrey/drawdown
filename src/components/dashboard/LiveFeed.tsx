"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, ExternalLink, ChevronRight } from "lucide-react";

export interface FeedItem {
  id: string;
  type: "alert" | "event";
  severity?: "green" | "orange" | "red";
  source?: string;
  message: string;
  time?: string;
  url?: string;
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
              "text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1",
              isLight 
                ? "bg-gray-100 text-gray-700 border border-gray-200" 
                : "text-[#18B880] border border-[#18B880]/20 bg-[#18B880]/5"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE ROTATION
          </span>
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {items.map((item, idx) => {
          const isAlert = item.type === "alert";
          const isTopAlert = isAlert && idx === items.findIndex(f => f.type === "alert");
          const targetUrl = item.url && item.url.trim() !== "" ? item.url : "/dashboard/the-wire";
          const isExternal = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

          const content = (
            <div className="flex items-start justify-between gap-2 w-full group">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {isAlert ? (
                  <AlertCircle className={cn("w-4 h-4 shrink-0 mt-0.5", isLight ? "text-[#f97316]" : "text-white")} />
                ) : (
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse",
                      item.severity === "green" ? "bg-[#18B880]" :
                      item.severity === "orange" ? "bg-[#F9771D]" :
                      "bg-[#CE6969]"
                    )} 
                  />
                )}
                <div className="flex-1 min-w-0">
                  {item.source && (
                    <p className={cn("text-[10px] font-mono font-bold uppercase mb-0.5", isLight ? "text-gray-600" : "text-slate-400")}>
                      {item.source}
                    </p>
                  )}
                  <p className={cn("text-xs leading-relaxed group-hover:text-emerald-500 transition-colors", isLight ? "text-gray-800" : "text-[#E4E2DD]")}>
                    {item.message}
                  </p>
                  {item.time && (
                    <p className={cn("text-[9px] font-mono mt-1", isLight ? "text-gray-400" : "text-[#8A8A85]")}>
                      {item.time}
                    </p>
                  )}
                </div>
              </div>
              <div className="shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isExternal ? (
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </div>
            </div>
          );

          if (isExternal) {
            return (
              <a
                key={item.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-3 block transition-all duration-200 cursor-pointer rounded-none",
                  isLight 
                    ? isTopAlert 
                      ? "bg-[#fffbeb] text-[#92400e] border-l-3 border-[#f97316]" 
                      : "bg-white hover:bg-gray-50 border-b border-gray-100"
                    : isAlert
                      ? "bg-[#F9771D] text-white"
                      : "bg-[#2A2A2A] hover:bg-[#333333] text-white border-l-2 border-[#555550]"
                )}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={targetUrl}
              className={cn(
                "p-3 block transition-all duration-200 cursor-pointer rounded-none",
                isLight 
                  ? isTopAlert 
                    ? "bg-[#fffbeb] text-[#92400e] border-l-3 border-[#f97316]" 
                    : "bg-white hover:bg-gray-50 border-b border-gray-100"
                  : isAlert
                    ? "bg-[#F9771D] text-white"
                    : "bg-[#2A2A2A] hover:bg-[#333333] text-white border-l-2 border-[#555550]"
              )}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
