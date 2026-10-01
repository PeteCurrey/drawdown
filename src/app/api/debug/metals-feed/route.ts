import { NextResponse } from "next/server";

/**
 * Temporary diagnostic endpoint — confirms FastForex env var and live API call
 * from within the Vercel lambda runtime.
 * DELETE after production metals feed is confirmed working.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.FASTFOREX_API_KEY;

  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      FASTFOREX_API_KEY_present: !!key,
      FASTFOREX_API_KEY_length: key ? key.length : 0,
      // Mask key for security — show only first 4 chars
      FASTFOREX_API_KEY_prefix: key ? key.slice(0, 4) + "…" : null,
    },
  };

  if (!key) {
    return NextResponse.json({ ...report, error: "FASTFOREX_API_KEY not set in lambda environment" }, { status: 200 });
  }

  // Test XAU
  for (const base of ["XAU", "XAG"]) {
    const url = `https://api.fastforex.io/fetch-one?from=${base}&to=USD&api_key=${key}`;
    try {
      const start = Date.now();
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const elapsed = Date.now() - start;
      const text = await res.text();
      let parsed: unknown = null;
      try { parsed = JSON.parse(text); } catch { /* non-json */ }
      report[base] = {
        status: res.status,
        ok: res.ok,
        elapsed_ms: elapsed,
        body: parsed ?? text.slice(0, 300),
      };
    } catch (err: unknown) {
      report[base] = {
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return NextResponse.json(report, { status: 200 });
}
