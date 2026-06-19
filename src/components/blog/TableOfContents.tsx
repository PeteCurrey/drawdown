"use client";

import React, { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: string[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      // Find entries that are intersecting
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Set the active heading to the first intersecting heading
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.1,
    });

    headings.forEach((heading) => {
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const element = document.getElementById(id);
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
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
        // Table of Contents
      </h4>
      <ul className="space-y-3 font-sans text-xs">
        {headings.map((heading, i) => {
          const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const isActive = activeId === id;

          return (
            <li key={i}>
              <a
                href={`#${id}`}
                onClick={(e) => scrollToHeading(e, id)}
                className={`flex items-center gap-3 transition-colors duration-200 py-0.5 hover:text-accent font-medium ${
                  isActive ? "text-accent" : "text-text-secondary"
                }`}
              >
                <span
                  className={`text-[8px] font-mono w-4 transition-colors ${
                    isActive ? "text-accent" : "text-text-tertiary"
                  }`}
                >
                  0{i + 1}
                </span>
                <span className="truncate">{heading}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
