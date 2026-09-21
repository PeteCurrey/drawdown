import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Public Supabase client for reading unauthenticated / public data (e.g. blog, sitemap)
 * without requiring cookies or superuser service-role keys.
 */
export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

/**
 * Canonical service-role client for background jobs, webhooks, and administrative tasks.
 * Bypasses RLS. Ignores request cookies.
 * Falls back to public anon key if service role key is absent or malformed.
 */
export function createServiceRoleClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isLikelyJwt = typeof serviceKey === "string" && serviceKey.startsWith("ey") && serviceKey.split(".").length === 3;
  const apiKey = isLikelyJwt ? serviceKey : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    apiKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}

// Alias for backwards compatibility
export const createInternalSupabase = createServiceRoleClient;
