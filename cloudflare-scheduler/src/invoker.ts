import type { Env, ScheduledJobDefinition, JobExecutionResult } from "./types.ts";

/**
 * Redacts secrets and authorization headers from logs.
 */
export function sanitizeLog(message: string, secret?: string): string {
  if (!secret) return message;
  return message.split(secret).join("[REDACTED_SECRET]");
}

/**
 * Authenticated HTTP invoker for Avorria API routes.
 */
export async function invokeDrawdownEndpoint(
  job: ScheduledJobDefinition,
  env: Env,
  options?: {
    customPath?: string;
    method?: "GET" | "POST";
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<JobExecutionResult> {
  const startTime = Date.now();

  // Fail-closed verification of environment configuration
  const apiEndpoint = env.AVORRIA_API_URL || env.DRAWDOWN_API_URL;
  if (!apiEndpoint) {
    const errorMsg = "Configuration failure: AVORRIA_API_URL or DRAWDOWN_API_URL is missing. Failing closed.";
    console.error(`[Invoker] [${job.id}] ${errorMsg}`);
    return {
      jobId: job.id,
      status: "ERROR",
      durationMs: 0,
      error: errorMsg,
    };
  }

  if (!env.CRON_SECRET) {
    const errorMsg = "Configuration failure: CRON_SECRET is missing. Failing closed.";
    console.error(`[Invoker] [${job.id}] ${errorMsg}`);
    return {
      jobId: job.id,
      status: "ERROR",
      durationMs: 0,
      error: errorMsg,
    };
  }

  const baseUrl = apiEndpoint.replace(/\/$/, "");
  const targetPath = options?.customPath || job.path;
  const url = new URL(`${baseUrl}${targetPath}`);

  // For market-sync, pass query secret for 100% backward compatibility
  if (job.id === "market-sync") {
    url.searchParams.set("secret", env.CRON_SECRET);
  }

  // If Vercel protection bypass token is configured, inject it
  if (env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    url.searchParams.set("x-vercel-protection-bypass", env.VERCEL_AUTOMATION_BYPASS_SECRET);
    url.searchParams.set("x-vercel-set-bypass-cookie", "true");
  }

  // Merge headers
  const headers: Record<string, string> = {
    Authorization: `Bearer ${env.CRON_SECRET}`,
    "x-cron-source": "cloudflare-worker",
    "User-Agent": "Avorria-Cloudflare-Scheduler/1.0",
    ...(options?.headers || {}),
  };

  const method = options?.method || job.method;
  let bodyContent: string | undefined = undefined;

  if (method === "POST" && options?.body) {
    headers["Content-Type"] = "application/json";
    bodyContent = JSON.stringify(options.body);
  }

  // Setup timeout abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), job.timeoutMs);

  console.log(
    JSON.stringify({
      level: "INFO",
      event: "JOB_INVOKE_START",
      jobId: job.id,
      method,
      path: targetPath,
      environment: env.ENVIRONMENT,
      timestamp: new Date().toISOString(),
    })
  );

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: bodyContent,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    let responseData: any = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        responseData = await response.json();
      } catch {
        responseData = { parseError: "Failed to parse JSON body" };
      }
    } else {
      const text = await response.text();
      responseData = { text: text.slice(0, 500) };
    }

    if (response.ok) {
      console.log(
        JSON.stringify({
          level: "INFO",
          event: "JOB_INVOKE_SUCCESS",
          jobId: job.id,
          statusCode: response.status,
          durationMs,
          timestamp: new Date().toISOString(),
        })
      );
      return {
        jobId: job.id,
        status: "SUCCESS",
        statusCode: response.status,
        durationMs,
        data: responseData,
      };
    }

    // Classify non-2xx failure
    const errorMsg = `HTTP ${response.status}: ${JSON.stringify(responseData)}`;
    console.error(
      JSON.stringify({
        level: "ERROR",
        event: "JOB_INVOKE_HTTP_ERROR",
        jobId: job.id,
        statusCode: response.status,
        durationMs,
        error: sanitizeLog(errorMsg, env.CRON_SECRET),
        timestamp: new Date().toISOString(),
      })
    );

    return {
      jobId: job.id,
      status: "ERROR",
      statusCode: response.status,
      durationMs,
      error: sanitizeLog(errorMsg, env.CRON_SECRET),
      data: responseData,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;
    const isTimeout = err.name === "AbortError";
    const status = isTimeout ? "TIMEOUT" : "ERROR";
    const errorMsg = isTimeout
      ? `Job timed out after ${job.timeoutMs}ms`
      : err?.message || "Unknown network error";

    console.error(
      JSON.stringify({
        level: "ERROR",
        event: isTimeout ? "JOB_TIMEOUT" : "JOB_NETWORK_ERROR",
        jobId: job.id,
        durationMs,
        error: sanitizeLog(errorMsg, env.CRON_SECRET),
        timestamp: new Date().toISOString(),
      })
    );

    return {
      jobId: job.id,
      status,
      durationMs,
      error: sanitizeLog(errorMsg, env.CRON_SECRET),
    };
  }
}
