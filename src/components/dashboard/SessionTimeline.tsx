"use client";

import React, { useEffect, useState } from "react";

export function SessionTimeline() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [markerPct, setMarkerPct] = useState<number>(50);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) +
        "  " +
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
        " GMT"
      );

      // Percentage of the 24 hour day elapsed
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const totalMinutes = hours * 60 + minutes;
      setMarkerPct((totalMinutes / 1440) * 100);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 lg:left-[220px] right-0 h-10 bg-[#FAFAF9] border-t border-[#E8E6E1] flex items-center justify-between px-6 z-40 text-xs text-[#1A1A1A]">
      {/* Left session indicators */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#18B880] animate-pulse" />
        <span className="text-[11px] font-medium text-[#4A4A47]">
          Session <span className="text-[#18B880] font-semibold">Active</span>
        </span>
      </div>

      {/* Timeline track (centered) */}
      <div className="flex-1 max-w-xl mx-8 relative flex items-center h-2">
        <div className="absolute inset-x-0 h-1 bg-[#E8E6E1] rounded-full" />
        
        {/* Tokyo Session Zone */}
        <div 
          className="absolute h-1 bg-[#888882]/20 rounded-full"
          style={{ left: "0%", width: "30%" }}
          title="Tokyo Session"
        />
        {/* London Session Zone */}
        <div 
          className="absolute h-1 bg-[#18B880]/30 rounded-full"
          style={{ left: "30%", width: "40%" }}
          title="London Session"
        />
        {/* NY Session Zone */}
        <div 
          className="absolute h-1 bg-[#F9771D]/30 rounded-full"
          style={{ left: "65%", width: "35%" }}
          title="New York Session"
        />

        {/* Current Time Cursor Marker */}
        <div 
          className="absolute w-1 h-3.5 bg-[#1A1A1A] rounded-full z-10 transition-all duration-1000 -translate-x-1/2"
          style={{ left: `${markerPct}%` }}
        />
        
        <span className="absolute left-[12%] -bottom-3.5 text-[8px] font-semibold text-[#888882] tracking-wider">TOKYO</span>
        <span className="absolute left-[47%] -bottom-3.5 text-[8px] font-semibold text-[#888882] tracking-wider">LONDON</span>
        <span className="absolute left-[80%] -bottom-3.5 text-[8px] font-semibold text-[#888882] tracking-wider">NEW YORK</span>
      </div>

      {/* Right clocks */}
      <div className="flex items-center gap-4 shrink-0 text-right">
        <span className="text-[11px] dd-tabular font-semibold text-[#4A4A47]">
          {currentTime}
        </span>
      </div>
    </div>
  );
}

