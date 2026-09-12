import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lock } from "lucide-react";
import Link from "next/link";
import { JournalClient } from "@/components/journal/JournalClient";
import { hasTierAccess } from "@/lib/entitlements";

export const metadata = {
  title: "AI Trade Journal",
  description: "Log every trade, discover hidden patterns, and track your true edge. Drawdown's AI journal surfaces the insights your P&L can't show you alone.",
};

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, role")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const status = (profile as any)?.subscription_status as string | undefined;
  const isAdmin = (profile as any)?.role === "admin";
  const hasAccess = isAdmin || hasTierAccess(tier, "foundation", status);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="p-10 bg-white border border-[#E6E4DE] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)] flex flex-col items-center text-center space-y-6 max-w-md w-full rounded-[8px]">
          <div className="w-12 h-12 rounded-full border border-[#E6E4DE] bg-[#F5F4F1] flex items-center justify-center text-[#181818]">
            <Lock className="w-5 h-5 text-[#181818]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#181818]">
              Foundation Access Required
            </p>
            <p className="text-xs text-[#87877F] leading-relaxed">
              The AI Trade Journal requires a Foundation plan or above. Your current plan is{" "}
              <span className="font-bold text-[#181818] uppercase">{tier ?? "Free"}</span>.
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center px-8 py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider transition-all rounded-[6px]"
            >
              Upgrade to Foundation
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-8 py-3 border border-[#E6E4DE] hover:border-[#181818] text-xs font-semibold uppercase tracking-wider text-[#87877F] hover:text-[#181818] transition-all rounded-[6px]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { view } = await searchParams;

  return (
    <div>
      <JournalClient initialView={(view as any) ?? "calendar"} userId={user.id} />
    </div>
  );
}
