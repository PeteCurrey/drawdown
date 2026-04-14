"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CoursePlayerProps {
  playbackId: string;
  title: string;
  onEnded?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function CoursePlayer({ playbackId, title, onEnded, onProgress }: CoursePlayerProps) {
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // We could load last saved position from API here and seek
  }, [playbackId]);

  const handleTimeUpdate = (e: Event) => {
    const el = e.target as HTMLVideoElement;
    if (el && onProgress) {
      onProgress(el.currentTime, el.duration);
    }
  };

  return (
    <div className={cn(
      "w-full aspect-video bg-background-elevated border border-border-slate relative overflow-hidden flex items-center justify-center",
      !isReady && "animate-pulse"
    )}>
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Loading Video Stream...</p>
        </div>
      )}
      
      <MuxPlayer
        ref={playerRef}
        streamType="on-demand"
        playbackId={playbackId}
        metadata={{
          video_title: title,
        }}
        primaryColor="#00C2FF"
        secondaryColor="#08090D"
        onLoadedData={() => setIsReady(true)}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-700",
          isReady ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
