import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from "cloudflare:workers";
import type { Env } from "../types.ts";
import { sanitizeLog } from "../invoker.ts";

export interface EveningWrapParams {
  triggeredAt?: string;
  source?: string;
}

export class EveningWrapWorkflow extends WorkflowEntrypoint<Env, EveningWrapParams> {
  async run(event: WorkflowEvent<EveningWrapParams>, step: WorkflowStep) {
    const env = this.env;
    const baseUrl = env.DRAWDOWN_API_URL.replace(/\/$/, "");

    // Step 1: Generate Evening Wrap
    const generationResult = await step.do("generate-evening-wrap", async () => {
      const url = new URL(`${baseUrl}/api/email/generate-evening`);
      if (env.VERCEL_AUTOMATION_BYPASS_SECRET) {
        url.searchParams.set("x-vercel-protection-bypass", env.VERCEL_AUTOMATION_BYPASS_SECRET);
        url.searchParams.set("x-vercel-set-bypass-cookie", "true");
      }

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
          "x-cron-source": "cloudflare-workflow",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          sanitizeLog(`Generate evening wrap failed (${res.status}): ${errText}`, env.CRON_SECRET)
        );
      }

      return await res.json() as {
        emailSendId: string;
        contentHtml: string;
        contentText: string;
        subject: string;
      };
    });

    // Step 2: Dispatch Broadcast (durable retry without re-generating email content)
    await step.do("send-evening-broadcast", async () => {
      const url = new URL(`${baseUrl}/api/email/send-broadcast`);
      if (env.VERCEL_AUTOMATION_BYPASS_SECRET) {
        url.searchParams.set("x-vercel-protection-bypass", env.VERCEL_AUTOMATION_BYPASS_SECRET);
        url.searchParams.set("x-vercel-set-bypass-cookie", "true");
      }

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
          "x-cron-source": "cloudflare-workflow",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailSendId: generationResult.emailSendId,
          type: "evening_wrap",
          contentHtml: generationResult.contentHtml,
          contentText: generationResult.contentText,
          subject: generationResult.subject,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          sanitizeLog(`Evening broadcast send failed (${res.status}): ${errText}`, env.CRON_SECRET)
        );
      }

      return (await res.json()) as Record<string, any>;
    });
  }
}
