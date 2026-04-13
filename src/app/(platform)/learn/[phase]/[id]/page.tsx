"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  FileText, 
  HelpCircle, 
  MessageSquare,
  ChevronDown
} from "lucide-react";

interface Props {
  params: { phase: string; id: string };
}

export default function ModulePage({ params }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'discussion'>('notes');
  
  return (
    <div className="pt-24 min-h-screen bg-background-primary">
      {/* Module Navigation Header */}
      <div className="border-b border-border-slate bg-background-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href={`/learn/${params.phase}`} 
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Phase
          </Link>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Phase 01 — Module 03</span>
            <h1 className="text-sm font-display font-bold uppercase tracking-tight">The Math of Survivability</h1>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-all">
                <ChevronLeft className="w-4 h-4" />
             </button>
             <button className="p-2 border border-border-slate hover:border-accent text-text-tertiary hover:text-accent transition-all">
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-background-surface border border-border-slate flex flex-col items-center justify-center group relative overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/40 to-transparent" />
              <div className="w-20 h-20 bg-accent text-background-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10 shadow-2xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <p className="mt-6 text-[10px] font-mono uppercase tracking-widest text-text-secondary relative z-10">Mux Player Integration Ready</p>
            </div>

            {/* Lesson Content Tabs */}
            <div className="space-y-8">
              <div className="flex gap-8 border-b border-border-slate">
                {(['notes', 'quiz', 'discussion'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                      activeTab === tab ? "text-accent" : "text-text-tertiary hover:text-text-primary"
                    )}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {activeTab === 'notes' && (
                  <div className="prose prose-invert prose-drawdown max-w-none">
                    <h2>Mastering the Math</h2>
                    <p>Trading is often taught as a series of chart patterns, but the reality is much more clinical. It's a game of statistics, probability, and risk management.</p>
                    <p>In this lesson, we break down the formula for <strong>Expected Value (EV)</strong> and why focusing on your P&L instead of your process is the fastest way to lose your account.</p>
                    <ul>
                      <li>The formula for Expected Value</li>
                      <li>Understanding the sample size of 20 trades</li>
                      <li>Why drawdown is your only real enemy</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'quiz' && (
                  <div className="space-y-8 max-w-2xl">
                    <div className="p-8 bg-background-surface border border-border-slate">
                      <p className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Question 1 of 5</p>
                      <h3 className="text-xl font-display font-bold uppercase mb-8">If you have a 40% win rate and a 1:3 RR, what is your expected profit after 20 trades of £100 risk?</h3>
                      <div className="space-y-4">
                        {[
                          "£800 Loss",
                          "£400 Profit",
                          "£1,200 Profit",
                          "Break Even"
                        ].map((opt, i) => (
                          <button key={i} className="w-full text-left p-6 border border-border-slate hover:border-accent transition-colors text-sm font-mono uppercase tracking-widest">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-8">
                    <div className="p-6 bg-background-elevated border border-border-slate flex gap-4">
                       <div className="w-10 h-10 bg-accent/20 border border-accent/20 rounded-full shrink-0" />
                       <textarea 
                        placeholder="Add to the discussion..." 
                        className="flex-grow bg-transparent outline-none h-24 text-sm font-sans resize-none"
                       />
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 border-l-2 border-border-slate ml-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Admin_Pete</span>
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest border border-accent/30 px-2">Floor</span>
                        </div>
                        <p className="text-sm text-text-secondary">If you're struggling with the EV formula, check out the resources tab in Phase 1 Module 2.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Module Outline */}
          <aside className="space-y-8 h-fit lg:sticky lg:top-32">
             <div className="bg-background-surface border border-border-slate p-8">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Course Outline</h4>
                <div className="space-y-4">
                  {[
                    { id: 1, title: "Industry Toxins", status: "complete" },
                    { id: 2, title: "The Edge Gap", status: "complete" },
                    { id: 3, title: "Math of Survival", status: "current" },
                    { id: 4, title: "Capital vs Ego", status: "locked" },
                  ].map((mod) => (
                    <div 
                      key={mod.id} 
                      className={cn(
                        "flex items-center gap-4 py-3 group cursor-pointer border-b border-border-slate/30",
                        mod.status === 'locked' && "opacity-40"
                      )}
                    >
                      <span className={cn(
                        "text-lg font-display font-bold",
                        mod.status === 'current' ? "text-accent" : "text-text-tertiary"
                      )}>0{mod.id}</span>
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        mod.status === 'current' ? "text-text-primary" : "text-text-tertiary group-hover:text-text-primary transition-colors"
                      )}>
                        {mod.title}
                      </p>
                    </div>
                  ))}
                </div>
             </div>

             <button className="w-full py-5 bg-profit text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-profit/90 transition-all flex items-center justify-center gap-2">
                Mark Module Complete
             </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
