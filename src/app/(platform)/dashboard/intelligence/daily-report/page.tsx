import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { generateDailyReport } from "@/app/api/cron/daily-report/route";
import DailyReportClient from "@/components/dashboard/DailyReportClient";

// Server-side fetch of today's (or yesterday's) report from Supabase
async function fetchReport() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

  const today = new Date().toISOString().substring(0, 10);
  const nowUTC = new Date();
  const afterSix = nowUTC.getUTCHours() >= 6;

  // Try today
  const { data: todayReport } = await supabase
    .from("daily_briefings")
    .select("*")
    .eq("report_date", today)
    .single();

  if (todayReport) {
    return { report: todayReport, isStale: false, staleDate: null };
  }

  // Generate on first access if after 06:00 UTC and report not yet created
  if (afterSix) {
    try {
      const report = await generateDailyReport();
      const { data: stored } = await supabase
        .from("daily_briefings")
        .upsert({
          report_date:       report.report_date,
          macro_narrative:   report.macro_narrative,
          macro_data:        report.macro_data,
          events_today:      report.events_today,
          instrument_briefs: report.instrument_briefs,
          top_setups:        report.top_setups,
          risk_radar:        report.risk_radar,
          generated_at:      report.generated_at,
        }, { onConflict: "report_date" })
        .select()
        .single();

      if (stored) return { report: stored, isStale: false, staleDate: null };
    } catch (e) {
      console.error("[daily-report/page] On-demand generation failed:", e);
    }
  }

  // Fall back to most recent available report
  const { data: latestReport } = await supabase
    .from("daily_briefings")
    .select("*")
    .order("report_date", { ascending: false })
    .limit(1)
    .single();

  if (latestReport) {
    return { report: latestReport, isStale: true, staleDate: latestReport.report_date };
  }

  return { report: null, isStale: false, staleDate: null };
}

export default async function DailyReportPage() {
  const { report, isStale, staleDate } = await fetchReport();

  if (!report) {
    // No report at all — show loading state via client
    return (
      <DailyReportClient
        report={null}
        isStale={false}
        staleDate={null}
      />
    );
  }

  return (
    <DailyReportClient
      report={{
        report_date:       report.report_date,
        macro_narrative:   report.macro_narrative,
        macro_data:        report.macro_data       ?? {},
        events_today:      report.events_today      ?? [],
        instrument_briefs: report.instrument_briefs ?? [],
        top_setups:        report.top_setups        ?? [],
        risk_radar:        report.risk_radar        ?? [],
        generated_at:      report.generated_at,
      }}
      isStale={isStale}
      staleDate={staleDate}
    />
  );
}

export const metadata = {
  title: "Daily Intelligence Briefing | Drawdown",
  description: "AI-generated morning market briefing covering macro environment, key events, instrument analysis, and top setups — published every trading day.",
};
