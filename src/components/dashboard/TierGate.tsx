import Link from "next/link";
import { Lock } from "lucide-react";
import { TIER_LABELS, type SubscriptionTier } from "@/lib/tier-access";

interface TierGateProps {
  requiredTier: NonNullable<SubscriptionTier>;
  currentTier: SubscriptionTier;
  /** Optional override for the page title shown in the gate */
  featureName?: string;
}

/**
 * Full-page gate rendered when a subscriber
 * navigates directly to a page that requires a higher tier.
 * Not a redirect — the URL stays in place so users understand the hierarchy.
 */
export function TierGate({ requiredTier, currentTier, featureName }: TierGateProps) {
  const required = TIER_LABELS[requiredTier];
  const current = currentTier ? TIER_LABELS[currentTier as NonNullable<SubscriptionTier>] : "Signal Centre";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-12 h-12 rounded-none bg-background-elevated border border-border-slate flex items-center justify-center">
        <Lock className="w-5 h-5 text-text-secondary" />
      </div>

      <div className="max-w-sm space-y-2">
        <h2 className="text-lg font-semibold text-text-primary tracking-tight font-sans">
          {featureName ?? required} — {required} and above
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          This section is included from the{" "}
          <span className="font-semibold text-text-primary">{required}</span> plan and above.
          Your current plan is{" "}
          <span className="font-semibold text-text-primary">{current}</span>.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center px-5 py-2.5 rounded-none bg-text-primary text-background-primary text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all font-sans"
        >
          View Plans
        </Link>
        <Link
          href="/dashboard/signal-centre"
          className="inline-flex items-center px-5 py-2.5 rounded-none border border-border-slate text-text-secondary text-xs font-semibold uppercase tracking-wider hover:text-text-primary hover:border-border-slate-hover transition-colors font-sans"
        >
          Back to Signal Centre
        </Link>
      </div>

      <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
        Upgrade to unlock this section →{" "}
        <Link href="/pricing" className="text-accent hover:underline">
          drawdown.trading/pricing
        </Link>
      </p>
    </div>
  );
}
