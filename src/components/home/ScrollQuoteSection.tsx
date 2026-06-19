"use client";

import { useEffect, useRef } from "react";

const quoteText = "Most trading education teaches you what to trade. Drawdown taught me how to think.";

export function ScrollQuoteSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const attributionRef = useRef<HTMLDivElement | null>(null);
  
  const words = quoteText.split(" ");

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress (0 when section top hits viewport top, 1 when section bottom hits viewport bottom)
      const scrollProgress = (scrollTop - sectionTop) / (sectionHeight - windowHeight);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      const n = words.length;

      // Illumination logic for each word
      words.forEach((_, i) => {
        const wordSpan = wordRefs.current[i];
        if (!wordSpan) return;

        const wordThreshold = i / n;
        if (clampedProgress >= wordThreshold) {
          wordSpan.classList.add("illuminated");
        } else {
          wordSpan.classList.remove("illuminated");
        }
      });

      // Attribution fade-in logic when last word is illuminated
      if (attributionRef.current) {
        const lastWordThreshold = (n - 1) / n;
        if (clampedProgress >= lastWordThreshold) {
          attributionRef.current.classList.add("visible");
        } else {
          attributionRef.current.classList.remove("visible");
        }
      }
    };

    const throttledScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [words.length]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[250vh] md:h-[300vh] bg-[#0a0a0a] z-20"
    >
      {/* Sticky viewport content wrapper */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden px-6 py-10">
        
        {/* Monumental Quote Container */}
        <div className="max-w-[900px] w-full text-center flex flex-col items-center">
          
          <h2 className="quote-display font-sans font-extrabold text-[clamp(1.5rem,6vw,2.5rem)] md:text-[clamp(2rem,5vw,4.5rem)] tracking-tight leading-[1.3] md:leading-[1.4] text-center select-none">
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className="word"
                data-index={i}
              >
                {word}
              </span>
            ))}
          </h2>

          {/* Attribution */}
          <div 
            ref={attributionRef}
            className="attribution font-sans text-sm md:text-base tracking-wider uppercase font-semibold mt-10 md:mt-12 text-white"
          >
            Pete Currey — Founder, Drawdown
          </div>

        </div>

      </div>

      <style jsx>{`
        .quote-display {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.22em 0.28em;
          font-weight: 800;
        }
        .word {
          color: rgba(255, 255, 255, 0.15);
          transition: color 0.25s ease;
        }
        .word.illuminated {
          color: #ffffff;
        }
        .attribution {
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .attribution.visible {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
