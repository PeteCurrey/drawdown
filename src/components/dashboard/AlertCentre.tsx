"use client";

import { useState } from "react";
import { 
  Bell, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Zap,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertItem {
  id: string;
  symbol: string;
  condition: "above" | "below";
  price: number;
  status: "active" | "triggered" | "paused";
  type: "price" | "technical" | "news";
}

const initialAlerts: AlertItem[] = [
  { id: "1", symbol: "GBPUSD", condition: "above", price: 1.2680, status: "active", type: "price" },
  { id: "2", symbol: "XAUUSD", condition: "below", price: 2300.00, status: "paused", type: "price" },
  { id: "3", symbol: "EURUSD", condition: "above", price: 1.1000, status: "triggered", type: "technical" },
];

export function AlertCentre() {
  const [alerts, setAlerts] = useState(initialAlerts);

  return (
    <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 flex flex-col h-full group transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
      <div className="p-6 border-b border-border-slate/50 flex items-center justify-between bg-background-elevated/20">
        <div className="flex items-center gap-3 text-accent">
          <Bell className="w-4 h-4" />
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest">Signal_Centre_v2</h3>
        </div>
        <div className="flex gap-2">
           <button className="p-1 hover:bg-background-primary transition-colors">
             <Settings className="w-4 h-4 text-text-tertiary" />
           </button>
           <button className="p-1 bg-accent text-background-primary hover:bg-accent-hover transition-all">
             <Plus className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto custom-scrollbar">
        <div className="divide-y divide-border-slate/30">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-5 space-y-3 hover:bg-background-elevated/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-2 h-2 rounded-full",
                     alert.status === "active" ? "bg-profit animate-pulse" : 
                     alert.status === "paused" ? "bg-text-tertiary" : "bg-loss"
                   )} />
                   <span className="text-xs font-bold uppercase tracking-widest">{alert.symbol}</span>
                </div>
                <div className="flex gap-3">
                   <button className="text-text-tertiary hover:text-loss transition-colors">
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-background-primary/20 backdrop-blur-sm p-3 border border-border-slate/30">
                 <div className="flex items-center gap-2">
                    {alert.type === "price" ? <Clock className="w-3 h-3 text-accent" /> : <Zap className="w-3 h-3 text-premium" />}
                    <span className="text-[9px] font-mono text-text-secondary uppercase">
                      {alert.condition === "above" ? "Crosses Above" : "Drops Below"}
                    </span>
                 </div>
                 <span className="text-[10px] font-mono font-bold text-text-primary">
                   {alert.price.toLocaleString()}
                 </span>
              </div>

              <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                 <span>Status: {alert.status}</span>
                 {alert.status === "triggered" && <span className="text-loss flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Fired 2h ago</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-accent/5 border-t border-border-slate">
         <div className="flex items-center gap-3 text-accent mb-2">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Active Monitoring</span>
         </div>
         <p className="text-[9px] text-text-secondary leading-relaxed uppercase opacity-70">
            Institutional push notifications are active for all enabled triggers.
         </p>
      </div>
    </div>
  );
}
