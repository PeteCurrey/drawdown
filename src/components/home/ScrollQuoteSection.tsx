"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER QUOTE SECTION — LIGHT THEME EDITORIAL
// ─────────────────────────────────────────────────────────────────────────────

const quoteText =
  "I built Drawdown because I couldn't find a trading education platform I'd actually recommend to someone I cared about.";

export function ScrollQuoteSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const attributionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduce = useReducedMotion();

  const words = quoteText.split(" ");

  useEffect(() => {
    if (shouldReduce) {
      // Show everything immediately — no animation
      wordRefs.current.forEach((el) => el?.classList.add("illuminated"));
      attributionRef.current?.classList.add("visible");
      return;
    }

    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sectionTop = rect.top + scrollTop;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollProgress =
        (scrollTop - sectionTop) / (sectionHeight - windowHeight);
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      const n = words.length;

      words.forEach((_, i) => {
        const wordSpan = wordRefs.current[i];
        if (!wordSpan) return;
        if (clamped >= i / n) {
          wordSpan.classList.add("illuminated");
        } else {
          wordSpan.classList.remove("illuminated");
        }
      });

      if (attributionRef.current) {
        const lastThreshold = (n - 1) / n;
        if (clamped >= lastThreshold) {
          attributionRef.current.classList.add("visible");
        } else {
          attributionRef.current.classList.remove("visible");
        }
      }
    };

    const throttled = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttled, { passive: true });
    handleScroll(); // Initial check on mount

    return () => {
      window.removeEventListener("scroll", throttled);
      cancelAnimationFrame(animationFrameId);
    };
  }, [words.length, shouldReduce]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[250vh] md:h-[300vh] z-20 border-t border-b"
      style={{ 
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(0,0,0,0.05)"
      }}
    >
      {/* Soft off-centre 3.5% accent radial tint */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(22,33,62,0.035), transparent 70%)",
        }}
      />

      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden px-6">
        <div className="max-w-[880px] w-full text-center relative z-10">

          {/* Pull-quote — word-spacing fixed via explicit inline style */}
          <p
            className="quote-text"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.375rem, 4vw, 2.75rem)",
              fontWeight: 400,
              lineHeight: 1.35,
              letterSpacing: "-0.015em",
              wordSpacing: "0.12em",
            }}
            aria-label={quoteText}
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => { wordRefs.current[i] = el; }}
                className="word"
              >
                {word}{" "}
              </span>
            ))}
          </p>

          {/* Attribution */}
          <div
            ref={attributionRef}
            className="attribution mt-10 md:mt-14"
            style={{
              fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
            }}
          >
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Pete Currey</span>
            <span style={{ color: "rgba(0,0,0,0.2)", margin: "0 0.6em" }}>—</span>
            <span style={{ color: "var(--text-secondary)" }}>Founder, Drawdown. Trading live since 2016.</span>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .quote-text .word {
          color: rgba(11, 14, 18, 0.22);
          transition: color 0.25s ease;
          display: inline;
        }
        .quote-text .word.illuminated {
          color: #0B0E12;
        }
        .attribution {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .attribution.visible {
          opacity: 1;
        }
      `}} />
    </div>
  );
}
