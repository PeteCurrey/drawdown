"use client";
 
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
 
const assets = [
  { 
    name: "Drawdown Main Logo - SVG", 
    type: "Vector", 
    size: "24 KB", 
    category: "Branding",
    icon: ImageIcon,
    color: "text-accent"
  },
  { 
    name: "Partner Badge - Dark Theme", 
    type: "PNG", 
    size: "142 KB", 
    category: "Branding",
    icon: ImageIcon,
    color: "text-accent"
  },
  { 
    name: "Social Media Card - Spring Launch", 
    type: "JPG", 
    size: "1.2 MB", 
    category: "Marketing",
    icon: ImageIcon,
    color: "text-profit"
  },
  { 
    name: "Brand Style Guide v2.1", 
    type: "PDF", 
    size: "4.8 MB", 
    category: "Guidelines",
    icon: FileText,
    color: "text-text-tertiary"
  },
  { 
    name: "Promo Video - 15s Teaser", 
    type: "MP4", 
    size: "18 MB", 
    category: "Video",
    icon: VideoIcon,
    color: "text-loss"
  },
];
 
export default function PartnerAssetsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-2 font-bold">// CREATIVE HUB</span>
          <h1 className="text-4xl font-display font-black uppercase text-text-primary">Assets.</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-lg">
          <Download className="w-4 h-4" /> Download All (.ZIP)
        </button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, i) => (
          <div key={i} className="bg-background-surface border border-border-slate/50 p-6 rounded-xl hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-premium group flex flex-col justify-between h-[220px]">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 bg-background-elevated rounded-lg border border-border-slate/30", asset.color)}>
                <asset.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary bg-background-elevated border border-border-slate/30 px-2 py-1 rounded-md">
                {asset.category}
              </span>
            </div>
 
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-display font-bold uppercase text-text-primary group-hover:text-accent transition-colors leading-snug">
                  {asset.name}
                </h3>
                <p className="text-[10px] font-mono text-text-tertiary uppercase mt-1">
                  {asset.type} • {asset.size}
                </p>
              </div>
 
              <div className="flex gap-2">
                <button className="flex-grow py-2.5 bg-background-elevated border border-border-slate/50 text-[9px] font-bold uppercase tracking-widest hover:bg-background-surface transition-colors flex items-center justify-center gap-2 rounded-lg text-text-primary">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button className="p-2.5 bg-background-elevated border border-border-slate/50 hover:bg-background-surface transition-colors rounded-lg text-text-tertiary hover:text-text-primary">
                   <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* Guidelines Section */}
      <div className="bg-background-elevated/40 border border-border-slate/50 p-8 rounded-xl">
        <h3 className="text-lg font-display font-bold uppercase text-text-primary mb-4">Partner Guidelines.</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
             <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Usage Policy</h4>
             <p className="text-xs text-text-tertiary leading-relaxed">
                Assets must only be used for the promotion of Drawdown. trade. Modification of logos or brand colors is strictly prohibited without prior written consent from the Drawdown compliance team.
             </p>
          </div>
          <div className="space-y-4">
             <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Affiliate Disclosure</h4>
             <p className="text-xs text-text-tertiary leading-relaxed">
                As a partner, you are required to clearly disclose your affiliate relationship in accordance with FTC guidelines and your local regulatory authority.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
