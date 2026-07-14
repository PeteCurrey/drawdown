"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, X, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DISMISSED_KEY = "algo_builder_course_banner_dismissed";
const COURSE_SLUG   = "deploy-your-algo";

/**
 * Shown after first code generation in the Algo Builder.
 * Detects purchase/tier status and adapts CTA + pricing copy.
 */
export function AlgoBuilderCourseBanner() {
  const [visible,   setVisible]   = useState(false);
  const [status,    setStatus]    = useState<"loading" | "purchased" | "floor" | "none">("loading");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(DISMISSED_KEY)) return;

    async function checkAccess() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setStatus("none"); setVisible(true); return; }

        // Check floor tier
        const { data: profile } = await supabase
          .from("profiles" as any)
          .select("subscription_tier")
          .eq("id", user.id)
          .single();
        if ((profile as any)?.subscription_tier === "floor") {
          setStatus("floor"); setVisible(true); return;
        }

        // Check purchase
        const { data: course } = await supabase
          .from("courses" as any)
          .select("id")
          .eq("slug", COURSE_SLUG)
          .single();
        if (course) {
          const { data: purchase } = await supabase
            .from("course_purchases" as any)
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", (course as any).id)
            .maybeSingle();
          setStatus(purchase ? "purchased" : "none");
        } else {
          setStatus("none");
        }
        setVisible(true);
      } catch {
        setStatus("none");
        setVisible(true);
      }
    }
    checkAccess();
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible || status === "loading") return null;

  const href = status === "purchased"
    ? `/dashboard/courses/${COURSE_SLUG}`
    : `/courses/${COURSE_SLUG}`;

  const ctaLabel = status === "purchased"
    ? "Continue the Course"
    : "View the Course";

  const priceLine = status === "purchased"
    ? null
    : status === "floor"
    ? "Included in your Floor plan"
    : "£97 one-time";

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#C8F135]/25 bg-[#C8F135]/5 mb-4 group">
      <div className="w-8 h-8 rounded-lg bg-[#C8F135]/15 border border-[#C8F135]/30 flex items-center justify-center shrink-0 mt-0.5">
        <GraduationCap className="w-4 h-4 text-[#C8F135]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white/70 leading-relaxed">
          Not sure what to do with this code?{" "}
          <span className="text-white font-semibold">Deploy Your Algo</span>{" "}
          walks you through exactly where it goes and how to read the results.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-black bg-[#C8F135] px-3 py-1.5 rounded-lg hover:bg-[#b8e020] transition-colors"
          >
            {ctaLabel} <ArrowRight className="w-3 h-3" />
          </Link>
          {priceLine && (
            <span className="text-[10px] font-mono text-white/40">{priceLine}</span>
          )}
        </div>
      </div>

      <button
        onClick={dismiss}
        className="text-white/30 hover:text-white/70 transition-colors shrink-0 mt-0.5 p-0.5"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
