/**
 * Cloudflare Worker Environment Interface
 */
export interface Env {
  // Environment Variables
  ENVIRONMENT: "production" | "staging" | "development";
  AVORRIA_API_URL?: string;
  DRAWDOWN_API_URL?: string;

  // Cloudflare Encrypted Secrets
  CRON_SECRET: string;

  // Optional automation bypass for Vercel deployment protection if enabled
  VERCEL_AUTOMATION_BYPASS_SECRET?: string;

  // Workflow Bindings
  MORNING_BRIEF_WORKFLOW: {
    create: (options: { id?: string; params?: Record<string, any> }) => Promise<{ id: string }>;
  };
  EVENING_WRAP_WORKFLOW: {
    create: (options: { id?: string; params?: Record<string, any> }) => Promise<{ id: string }>;
  };
  DAILY_REPORT_WORKFLOW: {
    create: (options: { id?: string; params?: Record<string, any> }) => Promise<{ id: string }>;
  };
}

export type JobClassification =
  | "simple_api"       // Cron -> Worker -> Authenticated HTTP -> API route
  | "durable_workflow" // Cron -> Worker -> Cloudflare Workflow
  | "event_driven"     // Reacts to webhooks/events
  | "application_internal"; // Left on Vercel (not scheduled)

export interface ScheduledJobDefinition {
  id: string;
  name: string;
  originalSchedule: string;
  humanSchedule: string;
  path: string;
  method: "GET" | "POST";
  classification: JobClassification;
  workflowBinding?: keyof Env;
  timeoutMs: number;
  preventOverlap: boolean;
  queryParams?: Record<string, string>;
  isDue: (date: Date) => boolean;
}

export interface JobExecutionResult {
  jobId: string;
  status: "SUCCESS" | "SKIPPED_IN_FLIGHT" | "ERROR" | "TIMEOUT" | "WORKFLOW_TRIGGERED";
  statusCode?: number;
  durationMs: number;
  error?: string;
  data?: any;
  workflowInstanceId?: string;
}
