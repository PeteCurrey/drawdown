import { NextResponse } from "next/server";

/**
 * Health check endpoint.
 *
 * Returns 200 if all required environment variables are present.
 * Returns 500 with a descriptive error if any are missing.
 *
 * Use this as the deployment health check target so that misconfigured
 * environments fail loudly rather than silently serving unprotected routes.
 */
export async function GET() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required environment variables",
        missing,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "ok" });
}
