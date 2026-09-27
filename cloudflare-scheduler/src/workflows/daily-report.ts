import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";
import type { Env } from "../types.ts";
import { sanitizeLog } from "../invoker.ts";

export interface DailyReportParams {
  triggeredAt?: string;
  source?: string;
}

export class DailyReportWorkflow extends WorkflowEntrypoint<Env, DailyReportParams> {
  async run(event: WorkflowEvent<DailyReportParams>, step: WorkflowStep) {
    const env = this.env;
    const baseUrl = env.DRAWDOWN_API_URL.replace(/\/$/, "");

    // Step 1: Trigger Daily Report Generation (handles multi-model AI & external data sync)
    const reportResult = await step.do("generate-daily-report", async () => {
      const url = new URL(`${baseUrl}/api/cron/daily-report`);
      if (env.VERCEL_AUTOMATION_BYPASS_SECRET) {
        url.searchParams.set("x-vercel-protection-bypass", env.VERCEL_AUTOMATION_BYPASS_SECRET);
        url.searchParams.set("x-vercel-set-bypass-cookie", "true");
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
          "x-cron-source": "cloudflare-workflow",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          sanitizeLog(`Daily report generation failed (${res.status}): ${errText}`, env.CRON_SECRET)
        );
      }

      return await res.json() as { success: boolean; report_date?: string; generated_at?: string };
    });

    // Step 2: Verification log
    await step.do("verify-daily-report-completion", async () => {
      if (!reportResult.success) {
        throw new Error("Daily report completed without success flag");
      }
      return {
        verified: true,
        report_date: reportResult.report_date,
        generated_at: reportResult.generated_at,
        completedAt: new Date().toISOString(),
      };
    });
  }
}
