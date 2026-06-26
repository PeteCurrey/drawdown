"use client";

import { useEffect, useState } from "react";

/** Thin chartreuse reading-progress bar fixed at very top of viewport */
export function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc   = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) { setPct(100); return; }
      setPct(Math.min(100, (window.scrollY / total) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
      style={{ background: "rgba(200,241,53,0.12)" }}
    >
      <div
        className="h-full transition-all duration-100 ease-out"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #C8F135 0%, #a8e010 100%)",
          boxShadow: "0 0 10px rgba(200,241,53,0.6)",
        }}
      />
    </div>
  );
}
