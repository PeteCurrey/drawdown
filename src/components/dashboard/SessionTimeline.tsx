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
    <div className="fixed bottom-0 left-0 lg:left-[220px] right-0 h-11 bg-[#D5D8C5] border-t border-[#C8CBB8] flex items-center justify-between px-6 z-40 text-xs text-[#1A1A1A]">
      {/* Left session indicators */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-5 h-5 rounded-full bg-[#181818] text-white flex items-center justify-center font-bold text-[9px]">PC</div>
        <span className="text-[10px] font-mono text-[#555550]">
          Active Session <span className="text-[#18B880] font-bold">ONLINE</span>
        </span>
      </div>

      {/* Timeline track (centered) */}
      <div className="flex-1 max-w-xl mx-8 relative flex items-center h-2">
        <div className="absolute inset-x-0 h-0.5 bg-[#C8CBB8]" />
        
        {/* Tokyo Session Zone */}
        <div 
          className="absolute h-1 bg-[#8A8A85] opacity-20"
          style={{ left: "0%", width: "30%" }}
          title="Tokyo Session"
        />
        {/* London Session Zone */}
        <div 
          className="absolute h-1 bg-[#18B880] opacity-40"
          style={{ left: "30%", width: "40%" }}
          title="London Session"
        />
        {/* NY Session Zone */}
        <div 
          className="absolute h-1 bg-[#F9771D] opacity-30"
          style={{ left: "65%", width: "35%" }}
          title="New York Session"
        />

        {/* Current Time Cursor Marker */}
        <div 
          className="absolute w-0.5 h-4 bg-[#181818] z-10 transition-all duration-1000"
          style={{ left: `${markerPct}%` }}
        />
        
        <span className="absolute left-[15%] -bottom-4 text-[7px] font-mono text-[#8A8A85]">TOKYO</span>
        <span className="absolute left-[50%] -bottom-4 text-[7px] font-mono text-[#8A8A85]">LONDON</span>
        <span className="absolute left-[82%] -bottom-4 text-[7px] font-mono text-[#8A8A85]">NEW YORK</span>
      </div>

      {/* Right clocks */}
      <div className="flex items-center gap-4 shrink-0 text-right">
        <span className="text-[10px] font-mono tracking-wider font-bold text-[#1A1A1A]">
          {currentTime}
        </span>
      </div>
    </div>
  );
}
