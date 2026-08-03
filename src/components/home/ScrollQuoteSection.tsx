"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDER QUOTE SECTION
//
// The previous implementation rendered words as individual <span> elements
// inside a flex container with gap: 0 — causing browsers to collapse inter-word
// spacing to zero in certain fallback states. Fixed by rendering the full
// sentence as a single text node, splitting only for the scroll-illumination
// animation, and explicitly setting word-spacing in CSS rather than relying
// on gap.
//
// Tenure: "since 2016" — confirmed fact per Phase 1 addendum. Do not change.
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
    handleScroll(); // set initial state

    return () => {
      window.removeEventListener("scroll", throttled);
      cancelAnimationFrame(animationFrameId);
    };
  }, [words.length, shouldReduce]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[250vh] md:h-[300vh] z-20"
      style={{ backgroundColor: "var(--ink-950)" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden px-6">
        <div className="max-w-[880px] w-full text-center">

          {/* Pull-quote — word-spacing fixed via explicit inline style */}
          <p
            className="quote-text"
            style={{
              fontFamily: "var(--font-display, 'Inter Tight', 'Inter', sans-serif)",
              fontSize: "clamp(1.375rem, 4vw, 2.5rem)",
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              wordSpacing: "0.12em", /* explicit — never rely on flex gap for word spacing */
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

          {/* Attribution — no tenure figure here; attribution line only */}
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
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Pete Currey</span>
            <span style={{ color: "rgba(255,255,255,0.35)", margin: "0 0.5em" }}>—</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Founder, Drawdown. Trading live since 2016.</span>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .quote-text .word {
          color: rgba(255,255,255,0.15);
          transition: color 0.25s ease;
          /* display: inline keeps words flowing naturally with word-spacing above */
          display: inline;
        }
        .quote-text .word.illuminated {
          color: rgba(255,255,255,1);
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
