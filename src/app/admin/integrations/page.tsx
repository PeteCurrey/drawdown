"use client";

import { cn } from "@/lib/utils";
import { 
  Network, 
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface APIIntegration {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: 'connected' | 'error' | 'disconnected';
  lastPing: string;
  latency: number;
}

const APIS: APIIntegration[] = [
  { id: "1", name: "Stripe Billing", provider: "Stripe", description: "Handles subscription payments and Edge+ access.", status: "connected", lastPing: "2s ago", latency: 142 },
  { id: "2", name: "FinnHub Market Data", provider: "FinnHub", description: "Real-time forex and indices pricing feeds.", status: "connected", lastPing: "1s ago", latency: 85 },
  { id: "3", name: "Anthropic AI Core", provider: "Anthropic", description: "Powers the AI analysis and Page Builder.", status: "connected", lastPing: "12m ago", latency: 450 },
  { id: "4", name: "Discord Bot API", provider: "Discord", description: "Role management and community announcements.", status: "error", lastPing: "4h ago", latency: 0 },
];

export default function IntegrationsManager() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">API Integrations</h1>
          <p className="text-xs text-text-tertiary">Monitor and manage external data feeds and service connections.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-border-slate hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest">
          <RefreshCw className="w-4 h-4" /> Run Diagnostics
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {APIS.map((api) => (
          <div key={api.id} className="p-6 bg-background-surface border border-border-slate flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-4 flex-grow">
              <div className="p-3 bg-background-elevated rounded-lg mt-1">
                <Network className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight">{api.name}</h3>
                  <span className="px-2 py-0.5 bg-background-primary border border-border-slate text-[9px] font-mono uppercase tracking-widest text-text-tertiary">
                    {api.provider}
                  </span>
                </div>
                <p className="text-xs text-text-secondary max-w-xl leading-relaxed">{api.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-8 md:min-w-[300px] justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Status</p>
                <div className="flex items-center gap-2">
                  {api.status === 'connected' ? (
                    <CheckCircle2 className="w-4 h-4 text-profit" />
                  ) : api.status === 'error' ? (
                    <XCircle className="w-4 h-4 text-loss" />
                  ) : (
                    <Activity className="w-4 h-4 text-text-tertiary" />
                  )}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    api.status === 'connected' ? "text-profit" : api.status === 'error' ? "text-loss" : "text-text-tertiary"
                  )}>
                    {api.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Latency</p>
                <p className="text-xs font-mono text-text-secondary">{api.latency > 0 ? `${api.latency}ms` : '--'}</p>
              </div>

              <button className="p-3 border border-border-slate hover:bg-background-elevated transition-colors text-text-tertiary hover:text-text-primary group-hover:border-accent">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-background-elevated border border-border-slate border-dashed flex justify-between items-center">
         <div>
           <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Need a new integration?</h4>
           <p className="text-xs text-text-tertiary">Configure new webhooks or add provider keys via the developer console.</p>
         </div>
         <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
           Open Dev Console <ExternalLink className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}
