import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchNews } from "@/lib/news";
import { TheWireDashboardClient } from "@/components/the-wire/TheWireDashboardClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "The Wire · Drawdown",
  description: "Morning and afternoon intelligence briefs, live market news and economic calendar — delivered every trading day to keep you ahead of the session.",
};

export default async function TheWirePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/the-wire");

  // Fetch latest AI briefs and live news in parallel
  const [briefsResult, newsResult] = await Promise.allSettled([
    supabase
      .from("email_sends")
      .select("id, subject, content_text, type, created_at")
      .in("type", ["morning_brief", "evening_wrap"])
      .order("created_at", { ascending: false })
      .limit(7),
    fetchNews(),
  ]);

  const briefs =
    briefsResult.status === "fulfilled" ? (briefsResult.value.data ?? []) : [];
  const news = newsResult.status === "fulfilled" ? newsResult.value : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        eyebrow="Market Intelligence"
        title="The Wire"
        description="Morning and afternoon intelligence briefs, live market news, and economic calendar — every trading day."
        badge={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#F0FDF8] border border-[rgba(24,184,128,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18B880] animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#18B880]">Live Feed Active</span>
          </div>
        }
      />

      <TheWireDashboardClient
        initialBriefs={briefs as any}
        initialNews={news}
      />
    </div>
  );
}
