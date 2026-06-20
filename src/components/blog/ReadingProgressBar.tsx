"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleHeight = rect.height;
      const scrollPos = window.scrollY + window.innerHeight - (rect.top + window.scrollY);
      
      const percent = Math.min(100, Math.max(0, (scrollPos / articleHeight) * 100));
      setProgress(percent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-[58px] left-0 w-full h-[2px] bg-slate-100 z-[195] pointer-events-none">
      <div 
        className="h-full bg-accent transition-all duration-75 ease-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
