import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScannerClient } from "@/components/dashboard/ScannerClient";
import { Lock } from "lucide-react";
import Link from "next/link";
import { hasTierAccess } from "@/lib/entitlements";

export default async function TechnicalScannerPage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  // ── Auth check ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ── Tier check ──────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, role")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const status = (profile as any)?.subscription_status as string | undefined;
  const isAdmin = (profile as any)?.role === "admin";
  const userWeight = (isAdmin || hasTierAccess(tier, "foundation", status)) ? 1 : 0;

  if (userWeight < 1) {
    return <ScannerLockedState tier={tier} />;
  }

  // ── Resolve symbol from URL ─────────────────────────────────────────────
  const { symbol } = await searchParams;
  const resolvedSymbol = symbol?.toUpperCase().trim() || null;

  return (
    <div>
      <ScannerClient symbol={resolvedSymbol} />
    </div>
  );
}

// ─── Locked state — free users ────────────────────────────────────────────
function ScannerLockedState({ tier }: { tier?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <div className="p-10 bg-white border border-[#E6E4DE] rounded-[8px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] flex flex-col items-center text-center space-y-6 max-w-md w-full">
        <div className="w-12 h-12 rounded-full border border-[#E6E4DE] bg-[#F5F4F1] flex items-center justify-center text-[#181818]">
          <Lock className="w-5 h-5 text-[#181818]" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#181818]">
            Foundation Access Required
          </p>
          <p className="text-xs text-[#87877F] leading-relaxed">
            The Technical Scanner requires a Foundation plan or above. Your current
            plan is{" "}
            <span className="font-bold text-[#181818] uppercase">
              {tier ?? "Free"}
            </span>
            .
          </p>
        </div>

        <div className="w-full space-y-2 pt-2">
          <Link
            href="/pricing"
            className="w-full flex items-center justify-center px-8 py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider rounded-[6px] transition-all"
          >
            Upgrade to Foundation
          </Link>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center px-8 py-3 border border-[#E6E4DE] hover:border-[#181818] text-xs font-semibold uppercase tracking-wider text-[#87877F] hover:text-[#181818] rounded-[6px] transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <p className="text-[10px] text-[#87877F] uppercase tracking-widest">
        Technical Scanner · Foundation+ · Live Multi-Timeframe Technical Analysis
      </p>
    </div>
  );
}
