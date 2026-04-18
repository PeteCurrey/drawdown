"use client";

import { LayoutDashboard, BarChart3, Radio, Percent, Gauge, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const features = [
  { icon: LayoutDashboard, label: "Live Overview", description: "Real-time ticker & ticker & high-impact macro data." },
  { icon: BarChart3, label: "Earnings Guide", description: "Corporate reporting schedule for major equities." },
  { icon: Percent, label: "Technical Scanner", description: "Cross-asset technical consensus & price action." },
  { icon: Gauge, label: "Sentiment Index", description: "Real-time Fear & Greed combined with VIX data." },
];

export function HubPreview() {
  return (
    <section className="py-24 bg-background-elevated border-b border-border-slate overflow-hidden relative">
      {/* Aesthetic Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff,transparent_1px)] [background-size:32px_32px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">INTELLIGENCE_LAYER_v4.0</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tight leading-none">
              The Hub <span className="text-accent underline decoration-accent/20">Preview.</span>
            </h2>
            
            <p className="text-xl text-text-secondary leading-relaxed max-w-xl">
              Don't trade blind. Access the same data feeds institutional desks use, simplified for the high-performance retail trader.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-slate/50">
               {features.map((feature, i) => {
                 const Icon = feature.icon;
                 return (
                   <div key={i} className="space-y-3 group">
                      <div className="flex items-center gap-3">
                         <Icon className="w-5 h-5 text-accent transition-transform group-hover:scale-110" />
                         <span className="text-xs font-display font-bold uppercase tracking-widest">{feature.label}</span>
                      </div>
                      <p className="text-[10px] font-mono text-text-tertiary leading-relaxed uppercase tracking-widest">
                        {feature.description}
                      </p>
                   </div>
                 );
               })}
            </div>

            <Link href="/markets" className="inline-flex items-center gap-4 bg-accent text-background-primary px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all group mt-8">
               Enter The Room
               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          {/* High-Fi Visual Representation */}
          <div className="relative">
            <div className="aspect-square bg-background-primary border border-border-slate p-8 relative overflow-hidden shadow-2xl shadow-accent/10">
               {/* Mock Dashboard UI */}
               <div className="absolute top-0 left-0 w-full h-12 border-b border-border-slate bg-background-elevated flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-loss" />
                     <div className="w-2 h-2 rounded-full bg-accent" />
                     <div className="w-2 h-2 rounded-full bg-profit" />
                  </div>
                  <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">SYSTEM_STATUS_ACTIVE // 24.04.18</span>
               </div>

               <div className="pt-12 grid grid-cols-2 gap-4 h-full">
                  <div className="border border-border-slate bg-background-elevated/50 p-4 space-y-4">
                     <div className="w-full h-1 bg-accent/20" />
                     <div className="w-2/3 h-1 bg-accent/10" />
                     <div className="flex justify-between items-end h-32">
                        {Array.from({length: 12}).map((_, i) => (
                           <div key={i} className="w-1 bg-accent/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="border border-border-slate bg-background-elevated/50 p-4 h-24 flex items-center justify-center">
                        <span className="text-4xl font-display font-black text-accent opacity-40 animate-pulse">82</span>
                     </div>
                     <div className="border border-border-slate bg-background-elevated/30 p-4 h-32 flex flex-col justify-between">
                         <div className="space-y-2">
                            <div className="w-full h-[1px] bg-border-slate" />
                            <div className="w-full h-[1px] bg-border-slate" />
                            <div className="w-full h-[1px] bg-border-slate" />
                         </div>
                         <div className="w-full h-8 bg-accent/10 border border-accent/20" />
                     </div>
                  </div>
               </div>

               {/* Scanning light overlay */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-accent/5 to-transparent h-1/2 animate-scanline opacity-20" />
            </div>
            
            {/* Pulsing indicator */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scanline {
          animation: scanline 6s linear infinite;
        }
      `}</style>
    </section>
  );
}
