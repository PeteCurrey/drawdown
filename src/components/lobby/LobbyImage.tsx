"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LobbyImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  headline?: string;
  aspectRatio?: "16/9" | "4/3" | "3/2" | "1/1";
  caption?: string | null;
  credit?: string | null;
  priority?: boolean;
  className?: string;
}

export function LobbyImage({
  src,
  alt,
  category = "MARKET INTELLIGENCE",
  headline,
  aspectRatio = "16/9",
  caption,
  credit,
  priority = false,
  className
}: LobbyImageProps) {
  const [hasError, setHasError] = useState(false);

  const aspectClass = {
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "1/1": "aspect-[1/1]",
  }[aspectRatio];

  const showImage = src && !hasError && src.startsWith("http");

  return (
    <figure className={cn("w-full overflow-hidden flex flex-col", className)}>
      <div 
        className={cn(
          "relative w-full overflow-hidden bg-[#F3F2EE] border border-[#DEDDD8] rounded-[2px]",
          aspectClass
        )}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            priority={priority}
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            onError={() => setHasError(true)}
          />
        ) : (
          /* Clean Broadsheet Typographic Fallback */
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-[#FAF9F5] border-l-4 border-l-[#16213E]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#16213E] font-semibold">
                {category}
              </span>
              <span className="text-[10px] font-mono text-[#4B5157]/60 tracking-wider">
                DRAWDOWN DESK
              </span>
            </div>

            <div className="my-auto py-2">
              <p className="text-base sm:text-xl md:text-2xl font-display font-semibold text-[#0B0E12] leading-snug line-clamp-3">
                &ldquo;{headline || alt}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.14em] text-[#4B5157]/70 pt-2 border-t border-[#DEDDD8]/60">
              <span>EDITORIAL ARCHIVE</span>
              <span>VERIFIED EVIDENCE</span>
            </div>
          </div>
        )}
      </div>

      {(caption || credit) && (
        <figcaption className="mt-2 text-[11px] font-mono text-[#4B5157] flex flex-wrap justify-between gap-2 px-1">
          {caption && <span>{caption}</span>}
          {credit && <span className="text-[#4B5157]/80">Source: {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
