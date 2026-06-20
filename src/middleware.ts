import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
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
          response = NextResponse.next({
            request,
          });
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

  const path = request.nextUrl.pathname;

  // Handle regional prefix 301 redirects (excluding working sub-folders)
  const regions = [
    { prefix: "/au/", exclude: ["best", "brokers", "compare", "how-to", "learn-to-trade", "pricing"] },
    { prefix: "/us/", exclude: ["best", "brokers", "compare", "disclaimer", "how-to", "learn-to-trade", "pricing"] },
    { prefix: "/sg/", exclude: ["best", "brokers", "compare", "disclaimer", "how-to", "learn-to-trade", "pricing"] },
    { prefix: "/hk/", exclude: ["best", "brokers", "compare", "disclaimer", "how-to", "learn-to-trade", "pricing"] },
    { prefix: "/in/", exclude: ["best", "compare", "how-to", "pricing"] },
    { prefix: "/de/", exclude: ["best", "compare", "how-to", "pricing"] },
    { prefix: "/my/", exclude: ["best", "compare", "how-to", "pricing"] },
    { prefix: "/ph/", exclude: ["best", "compare", "how-to", "pricing"] },
    { prefix: "/ae/", exclude: ["best", "compare", "how-to", "pricing"] },
    { prefix: "/ca/", exclude: ["best", "compare", "how-to", "pricing"] },
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

  // Define protected routes
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    (path.startsWith("/learn/") && path.split("/").length > 3) || // Gate /learn/[phase]/[id] but not /learn or /learn/[phase]
    path.startsWith("/live") ||
    path.startsWith("/profile") ||
    path.startsWith("/admin") ||
    path.startsWith("/partner");

  if (path.startsWith("/learn-to-trade")) {
    return response;
  }

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
  if ((path === "/login" || path === "/signup") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
