import Link from "next/link";
import { Lock, Check, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { TIER_LABELS, type SubscriptionTier } from "@/lib/tier-access";

interface TierGateProps {
  requiredTier: NonNullable<SubscriptionTier>;
  currentTier: SubscriptionTier;
  /** Optional override for the page title shown in the gate */
  featureName?: string;
  /** Explanations for the 6-point capability breakdown */
  whatIsIt?: string;
  whyUseIt?: string;
  whatCanIDo?: string;
  returnUrl?: string;
}

/**
 * Full-page gate rendered when a subscriber
 * navigates directly to a page that requires a higher tier.
 * Not a redirect — the URL stays in place so users understand the hierarchy.
 *
 * Implements Prompt 09 Standard Locked Feature Experience:
 * - What is this?
 * - Why would I use it?
 * - What can I do with it?
 * - What is available on my current plan?
 * - What does Foundation unlock?
 * - What is the next step?
 * - Context preservation: returns user to same workflow upon upgrade.
 */
export function TierGate({
  requiredTier,
  currentTier,
  featureName,
  whatIsIt,
  whyUseIt,
  whatCanIDo,
  returnUrl,
}: TierGateProps) {
  const required = TIER_LABELS[requiredTier];
  const current = currentTier ? TIER_LABELS[currentTier as NonNullable<SubscriptionTier>] : "Signal Centre";

  const pricingHref = returnUrl 
    ? `/pricing?redirect=${encodeURIComponent(returnUrl)}` 
    : "/pricing";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4 py-8 max-w-2xl mx-auto">
      <div className="w-12 h-12 rounded-none bg-background-elevated border border-border-slate flex items-center justify-center">
        <Lock className="w-5 h-5 text-text-secondary" />
      </div>

      <div className="max-w-md space-y-2">
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

      {/* 6-Dimension Honest Capability Breakdown */}
      <div className="w-full text-left bg-background-elevated/50 border border-border-slate p-6 space-y-4 rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // WHAT IS THIS?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {whatIsIt || `${featureName || required} is a dedicated analytical & operational module designed for systematic trading.`}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // WHY WOULD I USE IT?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {whyUseIt || "To eliminate guesswork, quantify real market edge, and enforce disciplined risk boundaries before execution."}
            </p>
          </div>
        </div>

        <div className="border-t border-border-slate/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // ON YOUR CURRENT PLAN ({current})
            </span>
            <p className="text-text-secondary leading-relaxed">
              Free users have full access to Plan My Trade, Position Sizer, Session Preparation, and Manual Trade Journaling.
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent block mb-1 font-bold">
              // WHAT {required.toUpperCase()} UNLOCKS
            </span>
            <p className="text-text-primary font-medium leading-relaxed">
              {whatCanIDo || `Full access to ${featureName || required}, live signal scanner, automated multi-model AI consensus, and multi-account risk management.`}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs with direct link to plans: href="/pricing" */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href={pricingHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none bg-text-primary text-background-primary text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all font-sans"
        >
          <span>Upgrade to {required}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2.5 rounded-none border border-border-slate text-text-secondary text-xs font-semibold uppercase tracking-wider hover:text-text-primary hover:border-border-slate-hover transition-colors font-sans"
        >
          Back to Dashboard
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
        <Link href={pricingHref} className="text-accent hover:underline">
          drawdown.trading/pricing
        </Link>
      </p>
    </div>
  );
}
