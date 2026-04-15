"use client";

import { brokers } from "@/data/brokers";
import { ArrowUpRight, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrokerWidget() {
  // Show top 3 rated brokers
  const topBrokers = [...brokers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Recommended Brokers</h4>
      <div className="p-8 bg-background-surface border border-border-slate space-y-6">
        <div className="space-y-4">
          {topBrokers.map((broker) => (
            <div key={broker.id} className="group border-b border-border-slate/50 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1 text-black font-black text-xs italic">
                    {broker.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">{broker.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-2 h-2 text-accent fill-accent" />
                      <span className="text-[8px] font-mono text-text-tertiary">{broker.rating}</span>
                    </div>
                  </div>
                </div>
                <a 
                  href={`/api/brokers/redirect?id=${broker.id}&source=dashboard_widget`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border-slate hover:border-accent hover:text-accent transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[9px] text-text-secondary uppercase leading-tight">
                {broker.oneLine}
              </p>
            </div>
          ))}
        </div>
        
        <Link 
          href="/brokers" 
          className="w-full py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-text-primary transition-colors flex items-center justify-center gap-2 group"
        >
          See All Brokers <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
