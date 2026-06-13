"use client";

import { Play } from "lucide-react";

export function FounderVideo() {
  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <span className="text-accent font-mono tracking-widest uppercase text-sm md:text-xs block">
              THE FOUNDER'S PLEDGE
            </span>
            <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase leading-tight">
              A Platform Built <br /> on <span className="text-accent">Integrity.</span>
            </h2>
            <div className="space-y-6 text-mkt-i2 leading-relaxed">
              <p>
                "I didn't build Drawdown to sell you another technical indicator. I built it because I wanted a tool that would have saved me from my own worst impulses ten years ago."
              </p>
              <p>
                Every decision on this platform — every broker we recommend, every affiliate link we post, every course module — is filtered through one question: does this make you a better trader? Subscribe to The Wire for weekly market intelligence, no noise.
              </p>
            </div>

            {/* Email Capture */}
            <div className="pt-6 max-w-md">
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="flex-grow bg-[#F7F7F7] border border-mkt-bd px-4 py-3 text-sm md:text-xs font-mono focus:border-accent outline-none transition-colors"
                />
                <button className="px-6 py-3 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
                  Join The Wire
                </button>
              </form>
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-ink">100% Transparent Performance Triggers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-ink">AI-Enhanced Risk Governance</span>
              </div>
            </div>
          </div>

          {/* Typographic Quote Layout */}
          <div className="relative order-1 lg:order-2">
            <div className="p-12 md:p-20 bg-[#F7F7F7] border border-mkt-bd relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-[10rem] font-sans font-black text-accent leading-none">"</span>
              </div>
              
              <div className="relative z-10">
                <blockquote className="text-2xl md:text-3xl font-sans font-medium italic leading-relaxed text-mkt-ink mb-12">
                  "I didn't build Drawdown to sell you another technical indicator. I built it because I wanted a tool that would have saved me from my own worst impulses ten years ago."
                </blockquote>
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-mkt-bd flex items-center justify-center shrink-0">
                    <span className="text-2xl font-sans font-black text-accent/20">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-sans font-bold uppercase tracking-widest text-mkt-ink">Pete Currey</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Founder // Lead Mentor</p>
                  </div>
                </div>
              </div>

              {/* Decorative scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 animate-scanline opacity-10" />
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
