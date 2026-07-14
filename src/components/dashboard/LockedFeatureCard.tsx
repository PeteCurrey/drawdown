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
  /** Mono badge label shown top-right (e.g. "HUMAN LAYER", "FLOOR ONLY") */
  badge?: string;
}

/**
 * Inline locked-feature card — used within Signal Centre pages
 * to replace sections that require Edge or Floor tier.
 *
 * Design: light theme, matches the dashboard white card aesthetic.
 * Not an aggressive blur — just a clean, honest locked state.
 */
export function LockedFeatureCard({
  title,
  description,
  requiredTier,
  badge,
}: LockedFeatureCardProps) {
  const requiredLabel = TIER_LABELS[requiredTier];

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        {badge && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">
            {badge}
          </span>
        )}
        <Lock className="w-4 h-4 text-gray-300 ml-auto" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-1 font-sans">{title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">{description}</p>
      </div>

      {/* CTA */}
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 w-fit px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors font-sans"
      >
        Upgrade to {requiredLabel}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
