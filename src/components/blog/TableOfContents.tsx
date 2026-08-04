"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeadingItem {
  text: string;
  id: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
  isDark?: boolean;
}

export function TableOfContents({ headings, isDark = false }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.1,
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // account for fixed nav header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveId(id);
      setIsOpen(false); // Close accordion on mobile after clicking
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div className="font-mono w-full">
      {/* Mobile Accordion */}
      <div className={cn(
        "lg:hidden border rounded-none",
        isDark ? "border-[#1A1A1A] bg-[#111111]" : "border-[#E5E5E5] bg-white"
      )}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between p-4 text-[10px] font-bold uppercase tracking-widest",
            isDark ? "text-white" : "text-slate-800"
          )}
        >
          <span className="flex items-center gap-2">
            <List className={cn("w-3.5 h-3.5", isDark ? "text-[#C8F135]" : "text-accent")} />
            Table of Contents
          </span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <ul className={cn(
            "border-t p-4 space-y-2 text-[10px] uppercase tracking-wider",
            isDark ? "border-[#1A1A1A]" : "border-[#E5E5E5]"
          )}>
            {headings.map((heading, i) => (
              <li 
                key={i}
                style={{ paddingLeft: heading.level === 3 ? "12px" : "0px" }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => scrollToHeading(e, heading.id)}
                  className={cn(
                    "flex items-center gap-2 py-1 transition-colors font-medium",
                    isDark
                      ? activeId === heading.id ? "text-[#C8F135]" : "text-zinc-400 hover:text-[#C8F135]"
                      : activeId === heading.id ? "text-accent" : "text-text-secondary hover:text-accent"
                  )}
                >
                  <span className={cn(
                    "text-[8px] font-light",
                    isDark
                      ? activeId === heading.id ? "text-[#C8F135]" : "text-zinc-600"
                      : activeId === heading.id ? "text-accent" : "text-text-tertiary"
                  )}>
                    {i + 1}.
                  </span>
                  <span className="truncate">{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sticky Rail */}
      <div className="hidden lg:block space-y-4">
        <h4 className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          isDark ? "text-zinc-500" : "text-text-tertiary"
        )}>
          // TABLE OF CONTENTS
        </h4>
        <ul className="space-y-3 text-[10px] uppercase tracking-wider leading-relaxed">
          {headings.map((heading, i) => (
            <li 
              key={i}
              style={{ paddingLeft: heading.level === 3 ? "12px" : "0px" }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => scrollToHeading(e, heading.id)}
                className={cn(
                  "flex items-start gap-2.5 transition-colors duration-150 py-0.5 font-medium",
                  isDark
                    ? activeId === heading.id ? "text-[#C8F135]" : "text-zinc-450 hover:text-[#C8F135]"
                    : activeId === heading.id ? "text-accent" : "text-text-secondary hover:text-accent"
                )}
              >
                <span className={cn(
                  "text-[8px] font-light mt-0.5",
                  isDark
                    ? activeId === heading.id ? "text-[#C8F135]" : "text-zinc-650"
                    : activeId === heading.id ? "text-accent" : "text-text-tertiary"
                )}>
                  0{i + 1}
                </span>
                <span className="break-words">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
