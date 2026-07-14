"use client";
 
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Video, 
  Users, 
  MessageSquare, 
  Calendar,
  Settings,
  Maximize2,
  Volume2,
  Play,
  Send,
  Circle,
  ChevronRight
} from "lucide-react";
 
export default function LiveSessionsPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'schedule'>('chat');
  const [isLive] = useState(true);
 
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-700 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-border-slate/50 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-loss/10 border border-loss/20 text-loss rounded-md">
            <Circle className={cn("w-2 h-2 fill-loss", isLive && "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{isLive ? 'Live Now' : 'Offline'}</span>
          </div>
          <h1 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">The Floor: London Morning Session</h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-text-tertiary uppercase tracking-widest font-bold">
           <div className="flex items-center gap-2">
             <Users className="w-4 h-4 text-accent" /> 1,240 Watching
           </div>
           <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4" /> Wed, Apr 22
           </div>
        </div>
      </div>
 
      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
        {/* Main Player Area */}
        <div className="flex-grow flex flex-col gap-4 min-w-0 overflow-y-auto">
          <div className="relative flex-grow bg-black aspect-video group overflow-hidden border border-border-slate/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] shrink-0">
            {/* Mock Player UI */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
               <div className="p-8 rounded-full bg-accent/25 border border-accent/40 group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-12 h-12 text-accent fill-accent" />
               </div>
            </div>
            
            {/* Player Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button className="text-white hover:text-accent transition-colors"><Play className="w-5 h-5 fill-white" /></button>
                    <button className="text-white hover:text-accent transition-colors"><Volume2 className="w-5 h-5" /></button>
                    <span className="text-white text-xs font-mono">01:24:45 / 03:00:00</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button className="text-white hover:text-accent transition-colors"><Settings className="w-5 h-5" /></button>
                    <button className="text-white hover:text-accent transition-colors"><Maximize2 className="w-5 h-5" /></button>
                  </div>
               </div>
            </div>
          </div>
 
          {/* Session Details */}
          <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-display font-bold uppercase mb-1 text-accent">Strategic Liquidity Mapping</h2>
                  <p className="text-xs text-text-secondary">Lead Educator: <span className="text-text-primary font-bold">Pete Currey</span></p>
                </div>
                <div className="flex gap-2">
                   {['ES_F', 'NQ_F', 'GBP_USD'].map(sym => (
                     <span key={sym} className="px-2.5 py-1 bg-background-primary border border-border-slate/80 text-[9px] font-mono text-text-tertiary uppercase rounded-md font-bold">
                       {sym}
                     </span>
                   ))}
                </div>
             </div>
             <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
               In this session, we are analyzing the London Open liquidity grabs and how to position for the NY crossover. Pete will be walking through live execution on the Edge terminal.
             </p>
          </div>
        </div>
 
        {/* Sidebar: Chat & Schedule */}
        <div className="w-full lg:w-[400px] flex flex-col bg-background-surface border border-border-slate/50 rounded-xl overflow-hidden shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.04)] h-full">
          <div className="flex border-b border-border-slate/50 shrink-0">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                activeTab === 'chat' ? "bg-accent/5 text-accent border-b-2 border-accent" : "text-text-tertiary hover:bg-background-elevated/20"
              )}
            >
              <MessageSquare className="w-4 h-4" /> Live Chat
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={cn(
                "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                activeTab === 'schedule' ? "bg-accent/5 text-accent border-b-2 border-accent" : "text-text-tertiary hover:bg-background-elevated/20"
              )}
            >
              <Calendar className="w-4 h-4" /> Schedule
            </button>
          </div>
 
          <div className="flex-grow overflow-hidden flex flex-col min-h-0">
            {activeTab === 'chat' ? (
              <>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0">
                   {[
                     { user: "TradeMasterX", msg: "Pete, thoughts on the GBP liquidity at 1.2540?", tier: "edge" },
                     { user: "London_Whale", msg: "Just took a long on NQ. Let's see.", tier: "floor" },
                     { user: "Student_99", msg: "Is this session being recorded?", tier: "foundation" },
                     { user: "Drawdown_Pete", msg: "Yes, all sessions are archived in the Library within 2 hours.", tier: "admin" },
                     { user: "Alpha_Trader", msg: "The 15m order flow is looking very bearish here.", tier: "edge" }
                   ].map((chat, i) => (
                     <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "text-[9px] font-bold uppercase tracking-wider",
                             chat.tier === 'admin' ? "text-accent" : "text-text-tertiary"
                           )}>{chat.user}</span>
                           <span className="px-1.5 py-0.5 bg-background-primary border border-border-slate/80 text-[7px] font-mono uppercase text-text-tertiary rounded-md font-bold">{chat.tier}</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-snug">{chat.msg}</p>
                     </div>
                   ))}
                </div>
                <div className="p-4 border-t border-border-slate/50 bg-background-elevated/20 shrink-0">
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="SEND A MESSAGE..." 
                        className="w-full bg-background-primary border border-border-slate/80 p-3 pr-12 text-[10px] font-mono uppercase outline-none focus:border-accent rounded-lg text-text-primary"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-grow overflow-y-auto p-6 space-y-6 min-h-0">
                 {[
                   { time: "Tomorrow, 08:30", title: "London Session Live", host: "Pete Currey" },
                   { time: "Tomorrow, 14:00", title: "NY Open Execution", host: "Pete Currey" },
                   { time: "Fri, 10:00", title: "Weekly Roundup & Q&A", host: "Pete Currey" },
                   { time: "Mon, 09:00", title: "Phase 3 Curriculum Review", host: "Senior Mentor" }
                 ].map((session, i) => (
                   <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="flex flex-col items-center shrink-0">
                         <div className="w-2 h-2 rounded-full border border-accent bg-background-primary group-hover:bg-accent transition-colors" />
                         <div className="flex-grow w-px bg-border-slate/50 mt-2" />
                      </div>
                      <div className="pb-4">
                         <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-1 font-bold">{session.time}</p>
                         <h4 className="text-sm font-bold uppercase tracking-tight mb-1 text-text-primary">{session.title}</h4>
                         <p className="text-[10px] text-text-tertiary uppercase">Host: {session.host}</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
