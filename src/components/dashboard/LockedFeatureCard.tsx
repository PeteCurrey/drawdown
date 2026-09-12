import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import { TIER_LABELS, type SubscriptionTier } from "@/lib/tier-access";

interface LockedFeatureCardProps {
  /** Display title of the locked section */
  title: string;
  /** Short description of what the feature does */
  description: string;
  /** The minimum tier required to unlock this feature */
  requiredTier: NonNullable<SubscriptionTier>;
  /** Optional current tier of the viewing user */
  currentTier?: SubscriptionTier;
  /** Mono badge label shown top-right (e.g. "HUMAN LAYER", "FLOOR ONLY") */
  badge?: string;
}

/**
 * Inline locked-feature card — used within platform pages
 * to replace sections that require higher tiers.
 *
 * Design: platform design tokens, clean, honest locked state.
 */
export function LockedFeatureCard({
  title,
  description,
  requiredTier,
  currentTier,
  badge,
}: LockedFeatureCardProps) {
  const requiredLabel = TIER_LABELS[requiredTier];
  const currentLabel = currentTier ? TIER_LABELS[currentTier as NonNullable<SubscriptionTier>] : null;

  return (
    <div className="rounded-none border border-border-slate bg-background-elevated/40 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        {badge && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary font-bold">
            {badge}
          </span>
        )}
        <Lock className="w-4 h-4 text-text-tertiary ml-auto" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1 font-sans">{title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed font-sans">{description}</p>
        {currentLabel && (
          <p className="text-[10px] font-mono text-text-tertiary mt-2 uppercase">
            Current plan: {currentLabel} // Required: {requiredLabel}+
          </p>
        )}
      </div>

      {/* CTA */}
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 w-fit px-3.5 py-1.5 rounded-none border border-border-slate text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-border-slate-hover transition-colors font-sans"
      >
        Upgrade to {requiredLabel}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
