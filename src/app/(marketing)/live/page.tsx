"use client";

import { Video, Users, Clock, CalendarDays, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LiveSessionsPage() {
  return (
    <div className="pt-12 pb-24 bg-background-primary min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// LIVE EDGE</span>
          <h1 className="  font-display font-bold uppercase">Trading Room.</h1>
          <p className="text-sm font-mono text-text-tertiary mt-4 max-w-2xl">
            Watch professional-grade execution in real-time. Daily pre-market analysis and live session trading.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Placeholder Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-background-surface border border-border-slate relative flex flex-col items-center justify-center p-8 text-center group overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <Video className="w-12 h-12 text-text-tertiary mb-6 opacity-50" />
              <h2 className="text-2xl font-display font-bold uppercase mb-4 text-text-primary">Stream Offline</h2>
              <p className="text-xs font-mono text-text-secondary">
                The next live session begins at 08:00 AM GMT (London Open).
              </p>
              
              <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-background-elevated border border-border-slate rounded-full">
                <div className="w-2 h-2 rounded-full bg-text-tertiary" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary">Offline</span>
              </div>
            </div>

            <div className="bg-background-surface border border-border-slate p-8">
              <h3 className="text-lg font-display font-bold uppercase mb-6 flex items-center gap-2 text-text-primary">
                <CalendarDays className="w-5 h-5 text-accent" /> Upcoming Schedule
              </h3>
              
              <div className="space-y-4">
                {[
                  { title: "London Pre-Market Analysis", time: "08:00 GMT", active: true },
                  { title: "NY Open Live Trading", time: "13:30 GMT", active: false },
                  { title: "Weekly Q&A Workshop", time: "Friday, 16:00 GMT", active: false }
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "flex items-center justify-between p-4 border",
                    item.active ? "bg-accent/5 border-accent/20" : "bg-background-elevated border-border-slate"
                  )}>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.time}</span>
                      <span className={cn(
                        "text-sm font-bold uppercase",
                        item.active ? "text-accent" : "text-text-primary"
                      )}>{item.title}</span>
                    </div>
                    {item.active && <span className="text-[9px] font-bold uppercase tracking-widest bg-accent text-background-primary px-3 py-1 rounded-sm">Next</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat / Sidebar Area */}
          <div className="bg-background-surface border border-border-slate flex flex-col h-[600px] lg:h-auto">
            <div className="p-6 border-b border-border-slate flex items-center justify-between">
               <h3 className="text-lg font-display font-bold uppercase flex items-center gap-2 text-text-primary">
                 <Users className="w-5 h-5 text-accent" /> Live Chat
               </h3>
               <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary flex items-center gap-1">
                 <Lock className="w-3 h-3" /> Members Only
               </span>
            </div>
            
            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-background-surface/50 backdrop-blur-sm z-10" />
               <div className="relative z-20 space-y-4">
                  <Lock className="w-8 h-8 text-text-tertiary mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase">Offline Chat Disabled</p>
                  <p className="text-[10px] font-mono text-text-secondary leading-relaxed">
                     The chat room automatically opens 15 minutes before scheduled live sessions.
                  </p>
               </div>
            </div>
            
            <div className="p-4 border-t border-border-slate bg-background-elevated">
               <input 
                 disabled
                 type="text" 
                 placeholder="Chat is currently disabled..." 
                 className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm focus:outline-none opacity-50 cursor-not-allowed"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
