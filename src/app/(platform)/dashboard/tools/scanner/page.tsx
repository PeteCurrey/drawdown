import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScannerClient } from "@/components/dashboard/ScannerClient";
import { Lock } from "lucide-react";
import Link from "next/link";

// ─── Tier weights — mirrors the platform-wide definition ─────────────────
const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

// ─── Scanner requires Foundation+ ────────────────────────────────────────
const REQUIRED_WEIGHT = 1; // "foundation"

export default async function MarketScannerPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  // ── Auth check ──────────────────────────────────────────────────────────
  // Middleware already redirects unauthenticated users away from /dashboard,
  // but we add an explicit check here so this page is independently safe if
  // the middleware config ever changes (e.g. if the path is reorganised).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── Tier check ──────────────────────────────────────────────────────────
  // This is the Phase 1 "generalise the fix" requirement: any destination
  // page that is gated on the dashboard must enforce the same tier check
  // independently of how the user arrived (dashboard card vs. direct URL).
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  if (userWeight < REQUIRED_WEIGHT) {
    return <ScannerLockedState tier={tier} />;
  }

  // ── Resolve symbol from URL ─────────────────────────────────────────────
  const { symbol } = await searchParams;

  // Normalise to uppercase; treat empty string as null (show overview)
  const resolvedSymbol = symbol?.toUpperCase().trim() || null;

  return <ScannerClient symbol={resolvedSymbol} />;
}

// ─── Locked state — free users ────────────────────────────────────────────
// Mirrors the locked card pattern used on the dashboard to keep the UX
// consistent regardless of whether the user arrived via the card or a URL.

function ScannerLockedState({ tier }: { tier?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <div className="p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 flex flex-col items-center text-center space-y-6 max-w-md w-full">
        <div className="w-14 h-14 rounded-full border border-accent/20 bg-accent/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-accent" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-text-primary">
            Foundation Access Required
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            The Market Scanner requires a Foundation plan or above. Your current
            plan is{" "}
            <span className="font-bold text-text-primary uppercase">
              {tier ?? "Free"}
            </span>
            .
          </p>
        </div>

        <div className="w-full space-y-2 pt-2">
          <Link
            href="/pricing"
            className="w-full flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Upgrade to Foundation
          </Link>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center px-8 py-3 border border-border-slate/50 hover:border-accent text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <p className="text-[9px] font-mono text-text-tertiary/50 uppercase tracking-widest">
        Market Scanner · Foundation+ · Live TradingView Technical Analysis
      </p>
    </div>
  );
}
