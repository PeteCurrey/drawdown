import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateDisclosureProps {
  className?: string;
}

export function AffiliateDisclosure({ className }: AffiliateDisclosureProps) {
  return (
    <div className={cn(
      "p-6 bg-background-elevated/50 border border-border-slate/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-start gap-4">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
            Institutional Transparency
          </span>
          <p className="text-[11px] leading-relaxed text-text-secondary uppercase">
            Drawdown may earn a referral commission if you open an account via our links. 
            This never influences our recommendations — we only feature brokers and platforms 
            we have personally used or thoroughly evaluated. See our full{" "}
            <a href="/brokers#methodology" className="text-text-primary underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">
              Review Methodology
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
