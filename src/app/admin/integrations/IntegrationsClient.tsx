"use client";

import { cn } from "@/lib/utils";
import { 
  Network, 
  Settings,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface APIProvider {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: 'connected' | 'error';
}

interface Props {
  health: Record<string, 'connected' | 'error'>;
}

export function IntegrationsClient({ health }: Props) {
  const router = useRouter();

  const API_PROVIDERS: APIProvider[] = [
    { 
      id: "supabase", 
      name: "Supabase Core", 
      provider: "Supabase", 
      description: "Database, Auth, and Edge Functions. Powers the entire data layer.",
      status: health.supabase
    },
    { 
      id: "stripe", 
      name: "Stripe Billing", 
      provider: "Stripe", 
      description: "Subscription lifecycle and recurring payments.",
      status: health.stripe || 'error'
    },
    { 
      id: "finnhub", 
      name: "FinnHub Markets", 
      provider: "FinnHub", 
      description: "Market data feeds and economic calendar aggregation.",
      status: health.finnhub
    },
    { 
      id: "anthropic", 
      name: "Anthropic Claude", 
      provider: "Anthropic", 
      description: "LLM for automated market analysis and strategy generation.",
      status: health.anthropic
    },
    { 
      id: "discord", 
      name: "Discord Bot", 
      provider: "Discord", 
      description: "Community role syncing and automated broadcasts.",
      status: health.discord || 'error'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">API Integrations</h1>
          <p className="text-xs text-text-tertiary">Live monitoring of external service nodes and data pipelines.</p>
        </div>
        <button 
          onClick={() => router.refresh()}
          className="flex items-center gap-2 px-6 py-3 border border-border-slate hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest bg-background-elevated/30"
        >
          <RefreshCw className="w-4 h-4" /> Force Health Check
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {API_PROVIDERS.map((api) => (
          <div key={api.id} className="p-6 bg-background-surface border border-border-slate flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-4 flex-grow">
              <div className="p-3 bg-background-elevated rounded-lg mt-1 border border-border-slate/50">
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
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Connection</p>
                <div className="flex items-center gap-2">
                  {api.status === 'connected' ? (
                    <CheckCircle2 className="w-4 h-4 text-profit" />
                  ) : (
                    <XCircle className="w-4 h-4 text-loss" />
                  )}
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    api.status === 'connected' ? "text-profit" : "text-loss"
                  )}>
                    {api.status === 'connected' ? 'Active' : 'Errored'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">Latency</p>
                <p className="text-[10px] font-mono text-text-secondary">REAL-TIME</p>
              </div>

              <button className="p-3 border border-border-slate hover:bg-background-elevated transition-colors text-text-tertiary hover:text-text-primary group-hover:border-accent">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 bg-background-surface border border-border-slate border-dashed flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-4">
           <ShieldCheck className="w-10 h-10 text-accent opacity-50" />
           <div>
             <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Developer & API Console</h4>
             <p className="text-xs text-text-tertiary">Manage secret keys, webhook signatures, and environment variables on Vercel.</p>
           </div>
         </div>
         <Link 
           href="https://vercel.com/peter-curreys-projects/drawdown/settings/environment-variables"
           target="_blank"
           className="flex items-center gap-2 px-8 py-4 bg-background-elevated border border-border-slate hover:border-accent hover:text-accent transition-all text-[10px] font-bold uppercase tracking-widest"
         >
           Open Vercel Console <ExternalLink className="w-3 h-3" />
         </Link>
      </div>
    </div>
  );
}
