"use client";

import { Play } from "lucide-react";

export function FounderVideo() {
  return (
    <section className="py-24 bg-background-primary relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <span className="text-accent font-mono tracking-widest uppercase text-xs block">
              // THE FOUNDER'S PLEDGE
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
              A Platform Built <br /> on <span className="text-accent">Integrity.</span>
            </h2>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                "I didn't build Drawdown to sell you another technical indicator. I built it because I wanted a tool that would have saved me from my own worst impulses ten years ago."
              </p>
              <p>
                This video introduces you to my personal trading philosophy and the exact framework I use to navigate high-volatility environments without losing my edge—or my sanity.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">100% Transparent Performance Triggers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">AI-Enhanced Risk Governance</span>
              </div>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="relative group cursor-pointer order-1 lg:order-2">
            <div className="aspect-video w-full bg-background-elevated border border-border-slate overflow-hidden relative">
              {/* Cinematic Poster Image Placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200" 
                alt="Founder Video Preview" 
                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/90 rounded-full flex items-center justify-center text-background-primary backdrop-blur-sm group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </div>

              {/* Decorative scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 animate-scanline opacity-10" />
            </div>

            {/* Subtitle/Metadata */}
            <div className="mt-4 flex justify-between items-center px-2">
              <span className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest">ORIENTATION_v1.0.mp4</span>
              <span className="text-[9px] font-mono text-accent">04:12</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>
    </section>
  );
}
