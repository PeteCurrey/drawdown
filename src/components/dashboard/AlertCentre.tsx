"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "@/lib/supabase/client";

interface AlertItem {
  id: string;
  symbol: string;
  trigger_price: number;
  trigger_condition: "above" | "below";
  is_active: boolean;
  triggered_at: string | null;
}

export function AlertCentre() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setAlerts(data.map((item: any) => ({
          id: item.id,
          symbol: item.symbol,
          trigger_price: Number(item.trigger_price),
          trigger_condition: item.trigger_condition,
          is_active: item.is_active,
          triggered_at: item.triggered_at
        })));
      }
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Set up polling interval to refresh alerts status
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (alertId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      if (!error) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      } else {
        throw error;
      }
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

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
        </div>
      </div>

      <div className="flex-grow overflow-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-10 bg-white/5 rounded" />
            <div className="h-10 bg-white/5 rounded" />
            <div className="h-10 bg-white/5 rounded" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Bell className="w-6 h-6 text-text-tertiary mx-auto opacity-50" />
            <p className="text-[10px] font-mono uppercase text-text-tertiary">No active alerts</p>
            <p className="text-[9px] text-text-tertiary/70 leading-normal uppercase">Use Watchlist Manager below to set a new alert.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-slate/30">
            {alerts.map((alert) => {
              const status = alert.triggered_at ? "triggered" : alert.is_active ? "active" : "paused";
              return (
                <div key={alert.id} className="p-5 space-y-3 hover:bg-background-elevated/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "w-2 h-2 rounded-full",
                         status === "active" ? "bg-profit animate-pulse" : 
                         status === "paused" ? "bg-text-tertiary" : "bg-loss"
                       )} />
                       <span className="text-xs font-bold uppercase tracking-widest">{alert.symbol}</span>
                    </div>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => handleDelete(alert.id)}
                         className="text-text-tertiary hover:text-loss transition-colors"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-background-primary/20 backdrop-blur-sm p-3 border border-border-slate/30">
                     <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-accent" />
                        <span className="text-[9px] font-mono text-text-secondary uppercase">
                          {alert.trigger_condition === "above" ? "Crosses Above" : "Drops Below"}
                        </span>
                     </div>
                     <span className="text-[10px] font-mono font-bold text-text-primary">
                       {alert.trigger_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                     </span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                     <span>Status: {status}</span>
                     {alert.triggered_at && (
                       <span className="text-loss flex items-center gap-1">
                         <AlertTriangle className="w-2.5 h-2.5" /> Fired {new Date(alert.triggered_at).toLocaleTimeString()}
                       </span>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
