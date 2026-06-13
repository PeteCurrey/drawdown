"use client";

import { Users, MessageSquare, TrendingUp, HelpCircle, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  return (
    <div className="pt-12 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 max-w-6xl">
        <div className="mb-12">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// THE FLOOR</span>
          <h1 className="  font-sans font-bold uppercase">Community.</h1>
          <p className="text-sm font-mono text-mkt-i4 mt-4 max-w-2xl">
            A curated network of serious traders. Share analysis, discuss setups, and elevate your edge alongside peers and mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "General Chat", icon: MessageSquare },
                { label: "Trade Setups", icon: TrendingUp },
                { label: "Q&A", icon: HelpCircle },
                { label: "Pro Room", icon: Shield, locked: true },
              ].map((item, i) => (
                <button 
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-mkt-bd hover:border-mkt-bds transition-colors group relative overflow-hidden"
                >
                  <item.icon className="w-6 h-6 text-mkt-i4 group-hover:text-accent transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                  {item.locked && (
                    <div className="absolute top-2 right-2">
                       <Shield className="w-3 h-3 text-mkt-ink/20" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Discourse Placeholder */}
            <div className="bg-white border border-mkt-bd overflow-hidden">
               <div className="p-6 border-b border-mkt-bd flex justify-between items-center bg-[#F7F7F7]/30">
                  <h3 className="text-lg font-sans font-bold uppercase">Recent Discussions</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest bg-mkt-ink text-white px-4 py-2 hover:bg-accent-hover transition-colors">
                    New Post
                  </button>
               </div>
               
               <div className="divide-y divide-border-slate">
                  {[
                    { title: "EUR/USD Daily Structure - Liquidity Sweep?", author: "TraderMike", replies: 12, time: "2h ago", tag: "Setups" },
                    { title: "Question about Phase 3 Risk Management model", author: "Alex_P", replies: 4, time: "5h ago", tag: "Course Q&A" },
                    { title: "NFP week preparation - What are you watching?", author: "Pete Currey", replies: 28, time: "1d ago", tag: "Macro", admin: true },
                  ].map((post, i) => (
                    <div key={i} className="p-6 hover:bg-[#F7F7F7]/50 transition-colors cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-[#F7F7F7] border border-mkt-bd rounded-full flex items-center justify-center">
                               {post.admin ? <Shield className="w-3 h-3 text-accent" /> : <Users className="w-3 h-3 text-mkt-i4" />}
                             </div>
                             <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "text-xs font-bold uppercase",
                                    post.admin ? "text-accent" : "text-mkt-i2"
                                  )}>{post.author}</span>
                                  {post.admin && <span className="text-[7px] bg-accent/20 text-accent px-1.5 py-0.5 uppercase tracking-widest border border-mkt-bd/20">Mentor</span>}
                                </div>
                                <span className="text-[9px] font-mono text-mkt-i4 uppercase">{post.time}</span>
                             </div>
                          </div>
                       </div>
                       <h4 className="text-lg font-sans font-bold group-hover:text-accent transition-colors my-3">{post.title}</h4>
                       <div className="flex items-center gap-4">
                          <span className="text-[9px] font-mono border border-mkt-bd px-2 py-0.5 text-mkt-i4 uppercase">{post.tag}</span>
                          <span className="text-[10px] text-mkt-i4 font-bold flex items-center gap-1 group-hover:text-mkt-ink transition-colors">
                             <MessageSquare className="w-3 h-3" /> {post.replies} Replies
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="p-4 bg-[#F7F7F7]/20 text-center border-t border-mkt-bd">
                  <button className="text-[10px] font-mono font-bold uppercase tracking-widest text-mkt-i4 hover:text-accent transition-colors">
                    Load More Discussions ↓
                  </button>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-mkt-bd p-8 text-center space-y-6">
               <div className="w-16 h-16 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-[#5865F2]" />
               </div>
               <h3 className="text-xl font-sans font-bold uppercase">Join the Discord</h3>
               <p className="text-xs text-mkt-i2 leading-relaxed">
                 For real-time chat, exclusive voice sessions, and instant market alerts, connect your Drawdown account to our private Discord server.
               </p>
               <Link href="/profile" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-mkt-ink text-[10px] font-bold uppercase tracking-widest transition-colors mb-2">
                  Connect Account <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            
            <div className="bg-white border border-mkt-bd p-6">
               <h3 className="text-sm font-sans font-bold uppercase mb-4 flex items-center gap-2">
                 <Shield className="w-4 h-4 text-accent" /> Community Rules
               </h3>
               <ul className="space-y-3 text-xs text-mkt-i2 leading-relaxed">
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" /> Zero tolerance for toxic behaviour or ego-driven trading.</li>
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" /> Focus on process over PnL. Do not post arbitrary cash figures.</li>
                 <li className="flex gap-2"><div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" /> Share the "why" behind an idea, not just the entry and exit.</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
