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
 * Full-page gate rendered when a `signal-centre` subscriber
 * navigates directly to a page that requires a higher tier.
 * Not a redirect — the URL stays in place so users understand the hierarchy.
 */
export function TierGate({ requiredTier, currentTier, featureName }: TierGateProps) {
  const required = TIER_LABELS[requiredTier];
  const current = currentTier ? TIER_LABELS[currentTier as NonNullable<SubscriptionTier>] : "Signal Centre";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/8 border border-[#DEDDD8] flex items-center justify-center">
        <Lock className="w-5 h-5 text-[#555550]" />
      </div>

      <div className="max-w-sm space-y-2">
        <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight font-sans">
          {featureName ?? required} — {required} and above
        </h2>
        <p className="text-sm text-[#555550] leading-relaxed font-sans">
          This section is included from the{" "}
          <span className="font-semibold text-[#1A1A1A]">{required}</span> plan and above.
          Your current plan is{" "}
          <span className="font-semibold text-[#1A1A1A]">{current}</span>.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/pricing"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#333330] transition-colors font-sans"
        >
          View Plans
        </Link>
        <Link
          href="/dashboard/signal-centre"
          className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#DEDDD8] text-[#555550] text-sm font-medium hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors font-sans"
        >
          Back to Signal Centre
        </Link>
      </div>

      <p className="text-xs font-mono text-[#8A8A85] uppercase tracking-widest">
        Upgrade to unlock this section →{" "}
        <Link href="/pricing" className="text-[#F9771D] hover:underline">
          drawdown.trading/pricing
        </Link>
      </p>
    </div>
  );
}
