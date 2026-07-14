"use client";

export function NewsSourceStrip() {
  // Triple the items for marquee loop
  const marqueeItems = [...sources, ...sources, ...sources];

  // Floating variants for Section 8 (Floating logos)
  // Each index has a different delay so they float independently
  const floatVariants = (delay: number) => ({
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: delay
      }
    }
  });

  return (
    <div className="w-full bg-background-surface border-y border-border-slate py-8 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-0 flex flex-col items-center">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-tertiary">
          Market data provided by Twelve Data and Finnhub
        </p>
      </div>

      <style jsx>{`
        @keyframes marquee-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee-logos {
          animation: marquee-logos 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
