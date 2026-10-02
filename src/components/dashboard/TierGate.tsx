import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

interface TierGateProps {
  /** Optional override for the feature name shown in the gate */
  featureName?: string;
  /** What this feature does (shown in the capability breakdown) */
  whatIsIt?: string;
  /** Why the user would want it */
  whyUseIt?: string;
  /** What Core unlocks specifically for this feature */
  whatCoreUnlocks?: string;
  /** Legacy alias for whatCoreUnlocks */
  whatCanIDo?: string;
  /** URL to return to after upgrading (passed as redirect param) */
  returnUrl?: string;
  /** Optional legacy tier parameters */
  requiredTier?: string | null;
  currentTier?: string | null;
}

/**
 * Full-page gate rendered when a free user navigates to a Core-only feature.
 *
 * Commercial model: single Core Membership at £24.99/mo.
 * - Primary CTA: "Start Membership" → /pricing
 * - Secondary CTA: "Continue Exploring Free Tools" → /dashboard
 *
 * The URL stays in place so users understand where they are.
 */
export function TierGate({
  featureName,
  whatIsIt,
  whyUseIt,
  whatCoreUnlocks,
  whatCanIDo,
  returnUrl,
}: TierGateProps) {
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
          {featureName ? `${featureName} — ` : ""}Drawdown Core Membership
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed font-sans">
          This feature is included in{" "}
          <span className="font-semibold text-text-primary">Drawdown Core</span>{" "}
          (£24.99/month). Your current account is{" "}
          <span className="font-semibold text-text-primary">Free</span>.
        </p>
      </div>

      {/* 4-Dimension Capability Breakdown */}
      <div className="w-full text-left bg-background-elevated/50 border border-border-slate p-6 space-y-4 rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // WHAT IS THIS?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {whatIsIt ||
                `${featureName || "This feature"} is a core analytical module included in every Drawdown Core membership.`}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // WHY WOULD I USE IT?
            </span>
            <p className="text-text-secondary leading-relaxed">
              {whyUseIt ||
                "To eliminate guesswork, quantify real market edge, and enforce disciplined risk boundaries before execution."}
            </p>
          </div>
        </div>

        <div className="border-t border-border-slate/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary block mb-1">
              // ON YOUR FREE ACCOUNT
            </span>
            <p className="text-text-secondary leading-relaxed">
              Free accounts include Plan My Trade, Position Sizer, Session Prep, Manual Trade Journal, Signal Centre preview, and the full Prop Firm Survival Kit.
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent block mb-1 font-bold">
              // WHAT CORE (£24.99/MO) UNLOCKS
            </span>
            <p className="text-text-primary font-medium leading-relaxed">
              {whatCoreUnlocks || whatCanIDo ||
                `Full access to ${featureName || "this feature"}, live signal scanner, AI Trade Journal, Technical Scanner, Market Intelligence, and all core platform tools.`}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href={pricingHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none bg-text-primary text-background-primary text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all font-sans"
        >
          <span>Start Membership</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2.5 rounded-none border border-border-slate text-text-secondary text-xs font-semibold uppercase tracking-wider hover:text-text-primary hover:border-border-slate-hover transition-colors font-sans"
        >
          Continue Exploring Free Tools
        </Link>
      </div>

      <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
        £24.99/month — cancel any time →{" "}
        <Link href={pricingHref} className="text-accent hover:underline">
          drawdown.trading/pricing
        </Link>
      </p>
    </div>
  );
}
