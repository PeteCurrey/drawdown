import { cn } from "@/lib/utils";
import { Shield, ChevronRight, ExternalLink, Star } from "lucide-react";
import { PropFirm } from "@/data/prop-firms";

interface PropFirmCardProps {
  firm: PropFirm;
  source?: string;
  isPetesPick?: boolean;
}

export function PropFirmCard({ firm, source = "prop_firm_card", isPetesPick }: PropFirmCardProps) {
  return (
    <div className="bg-background-surface border border-border-slate p-8 flex flex-col justify-between group hover:border-accent/30 transition-premium relative">
      {isPetesPick && (
        <div className="absolute -top-3 left-8 px-3 py-1 bg-accent text-background-primary text-[8px] font-black uppercase tracking-widest z-10">
          Pete's Pick
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-background-elevated border border-border-slate/50">
             {/* Using text logo fallback since actual SVGs might not exist yet */}
             <span className="font-display font-black text-lg">{firm.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-accent">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-2.5 h-2.5",
                  i < Math.floor(firm.rating) ? "fill-accent" : "text-text-tertiary"
                )} 
              />
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-display font-bold uppercase mb-2">{firm.name}</h3>
        <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-8">
          {firm.profitSplit} Profit Split // {firm.maxFunding} Max
        </p>
        
        <div className="py-4 border-y border-border-slate/30 mb-8 space-y-2">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Entry Fee</p>
          <p className="text-sm font-bold text-accent">{firm.challengeFee}</p>
        </div>

        <ul className="space-y-3 mb-10">
          {firm.pros.slice(0, 3).map((pro, i) => (
            <li key={i} className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest leading-tight">
              <div className="w-1 h-1 bg-accent shrink-0" /> {pro}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <a 
          href={`/go/${firm.slug}`}
          className="w-full py-4 bg-accent text-background-primary hover:bg-accent-hover transition-premium text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          Start Challenge <ExternalLink className="w-3 h-3" />
        </a>
        <a 
          href={`/prop-firms/${firm.slug}`}
          className="w-full py-4 border border-border-slate hover:border-text-primary transition-premium text-center text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-text-tertiary hover:text-text-primary"
        >
          Read Full Review
        </a>
      </div>
    </div>
  );
}
