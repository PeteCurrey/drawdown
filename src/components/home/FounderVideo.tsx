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
              THE FOUNDER'S PLEDGE
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
              A Platform Built <br /> on <span className="text-accent">Integrity.</span>
            </h2>
            <div className="space-y-6 text-text-secondary leading-relaxed">
              <p>
                "I didn't build Drawdown to sell you another technical indicator. I built it because I wanted a tool that would have saved me from my own worst impulses ten years ago."
              </p>
              <p>
                Pete is currently recording the Founder's Orientation. Subscribe to <b>The Wire</b> below to be notified the moment it drops and get exclusive early access to the Mind Over Market phase.
              </p>
            </div>

            {/* Email Capture */}
            <div className="pt-6 max-w-md">
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="flex-grow bg-background-elevated border border-border-slate px-4 py-3 text-xs font-mono focus:border-accent outline-none transition-colors"
                />
                <button className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                  Notify Me
                </button>
              </form>
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

          {/* Video Placeholder — Coming Soon State */}
          <div className="relative group order-1 lg:order-2">
            <div className="aspect-video w-full bg-[#0D0F14] border border-border-slate overflow-hidden relative flex flex-col items-center justify-center gap-6">
              {/* Coming Soon Graphic */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 border-2 border-accent/20 rounded-full flex items-center justify-center text-accent group-hover:border-accent group-hover:scale-105 transition-all duration-500">
                <Play className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm font-display font-bold uppercase tracking-widest text-text-primary">Founder&apos;s Orientation</p>
                <p className="text-[9px] font-mono uppercase tracking-widest text-accent">Status: In Recording // Coming Soon</p>
              </div>

              {/* Decorative scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 animate-scanline opacity-10" />
            </div>

            {/* Subtitle/Metadata */}
            <div className="mt-4 flex justify-between items-center px-2">
              <span className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest">ORIENTATION_v1.0.mp4</span>
              <span className="text-[9px] font-mono text-accent animate-pulse">RECORDING...</span>
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
