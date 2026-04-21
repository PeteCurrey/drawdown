"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function LinkGenerator() {
  const [source, setSource] = useState("twitter");
  const [campaign, setCampaign] = useState("spring_launch");
  const [copied, setCopied] = useState(false);
  
  const baseUrl = "https://drawdown.trade/api/market/brokers/redirect";
  const brokerSlug = "ig-markets"; // In reality, this would be the partner's linked broker slug
  const finalUrl = `${baseUrl}?broker=${brokerSlug}&source=${source}&campaign=${campaign}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background-surface border border-border-slate p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h3 className="text-lg font-display font-bold uppercase text-text-primary">Affiliate Link Generator.</h3>
          <p className="text-xs text-text-tertiary mt-1">Create unique tracking links for different marketing channels.</p>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">
          <RefreshCw className="w-3 h-3" /> Reset UTMs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Traffic Source</label>
          <input 
            type="text" 
            value={source}
            onChange={(e) => setSource(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors font-mono"
            placeholder="e.g. twitter, youtube, newsletter"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Campaign Name</label>
          <input 
            type="text" 
            value={campaign}
            onChange={(e) => setCampaign(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors font-mono"
            placeholder="e.g. membership_sale_2026"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Generated Tracking URL</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-grow bg-background-elevated border border-border-slate px-4 py-4 text-xs font-mono text-accent break-all select-all flex items-center">
            {finalUrl}
          </div>
          <button 
            onClick={handleCopy}
            className={cn(
              "px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all min-w-[160px]",
              copied ? "bg-profit text-background-primary" : "bg-accent text-background-primary hover:bg-accent-hover"
            )}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-background-primary border-l-2 border-accent/30 flex items-start gap-4">
        <div className="p-2 bg-accent/10 rounded-sm">
          <ExternalLink className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-secondary font-bold">Best Practice</p>
          <p className="text-[10px] text-text-tertiary leading-relaxed mt-1">
            Always use unique source tags for each platform. This allows us to attribute conversions correctly in your monthly performance reports.
          </p>
        </div>
      </div>
    </div>
  );
}
