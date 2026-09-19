import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: renamed from middleware.ts → proxy.ts, default export → named "proxy" export.
// See: https://nextjs.org/docs/messages/middleware-to-proxy
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Safety check for environment variables to prevent runtime 500
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const path = request.nextUrl.pathname;
  const pathParts = path.split("/").filter(Boolean);

  // ── SEO: 410 Gone for retired regional city pages and retired glossary slugs ──
  // IMPORTANT: Only the 4 slugs below are genuinely retired. All other /glossary/[slug]
  // paths must reach the page component — do NOT add a broad glossary catch-all here.
  const RETIRED_GLOSSARY_SLUGS = new Set([
    "fundamental-analysis",
    "backwardation",
    "spot-price",
    "probability",
  ]);
  if (
    (pathParts[0] === "sg" && pathParts[1] === "learn-to-trade" && pathParts.length === 4) ||
    (pathParts[0] === "hk" && pathParts[1] === "learn-to-trade" && pathParts.length === 4) ||
    (pathParts[0] === "us" && pathParts[1] === "best" && pathParts.length === 3) ||
    (pathParts[0] === "us" && pathParts[1] === "how-to" && pathParts.length === 3) ||
    (pathParts[0] === "glossary" && pathParts.length === 2 && RETIRED_GLOSSARY_SLUGS.has(pathParts[1]))
  ) {
    return new NextResponse(null, { status: 410, statusText: "Gone" });
  }

  // ── Regional prefix 301 redirects (excluding working sub-folders) ─────────
  const regions = [
    { prefix: "/au/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "learn-to-trade", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/us/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "learn-to-trade", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/sg/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "learn-to-trade", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/hk/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "learn-to-trade", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/in/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/de/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/my/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/ph/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/ae/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
    { prefix: "/ca/", exclude: ["best", "brokers", "compare", "courses", "disclaimer", "how-to", "markets", "platform", "pricing", "prop-firms", "tools"] },
  ];

  for (const { prefix, exclude } of regions) {
    if (path.startsWith(prefix)) {
      const remaining = path.substring(prefix.length);
      const firstSegment = remaining.split("/")[0];
      if (remaining && !exclude.includes(firstSegment)) {
        return NextResponse.redirect(new URL("/" + remaining, request.url), {
          status: 301,
        });
      }
    }
  }

  // ── Route classification ───────────────────────────────────────────────────
  const isProtectedRoute =
    ((path === "/dashboard" || path.startsWith("/dashboard/")) && !path.startsWith("/dashboard-preview")) ||
    (path.startsWith("/learn/") && path.split("/").length > 3) || // Gate /learn/[phase]/[id] but not /learn or /learn/[phase]
    path.startsWith("/live") ||
    path.startsWith("/profile") ||
    path.startsWith("/admin") ||
    path.startsWith("/partner");

  const isAuthPage = path === "/login" || path === "/signup";

  if (path.startsWith("/learn-to-trade")) {
    return response;
  }

  // ── Early return for public routes — no Supabase network call needed ───────
  // supabase.auth.getUser() makes a network round-trip on every request.
  // Only pay this cost when the route genuinely requires auth state.
  if (!isProtectedRoute && !isAuthPage) {
    return response;
  }

  // ── Auth check — only reached for protected routes and login/signup ────────
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection for /partner
  if (path.startsWith("/partner") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "partner" && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
