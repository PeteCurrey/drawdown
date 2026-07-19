import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchNews } from "@/lib/news";
import { TheWireDashboardClient } from "@/components/the-wire/TheWireDashboardClient";

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

  const themeStyles = {
    "--tool-accent":        "#14b8a6", // teal-500
    "--tool-accent-hover":  "#0d9488", // teal-600
    "--tool-accent-tint":   "#f0fdfa", // teal-50
    "--tool-accent-border": "#99f6e4", // teal-200
    "--tool-accent-text":   "#0f766e", // teal-700
  } as React.CSSProperties;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" style={themeStyles}>
      {/* Page header — standard tool page pattern */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-teal-500 font-mono text-[10px] uppercase tracking-widest block mb-3">
            // MODULE_TW // THE WIRE
          </span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">
            The <span className="text-teal-500 italic">Wire.</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Morning and afternoon intelligence briefs, live market news, and economic calendar — every trading day.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary">Live Feed Active</span>
        </div>
      </header>

      <TheWireDashboardClient
        initialBriefs={briefs as any}
        initialNews={news}
      />
    </div>
  );
}
