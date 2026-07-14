"use client";

export function NewsSourceStrip() {
  return (
    <div className="w-full bg-background-surface border-y border-border-slate py-8 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-0 flex flex-col items-center">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-tertiary">
          Market data provided by Twelve Data and Finnhub
        </p>
      </div>
    </div>
  );
}
