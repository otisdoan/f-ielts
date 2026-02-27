
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Static check first to skip any Supabase processing on public, un-authenticated routes
  // Protected routes pattern
  const protectedPaths = ["/dashboard", "/mock-tests", "/practice", "/analytics", "/settings", "/admin"];
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Redirect authenticated users from auth pages
  const authPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // If the path doesn't need auth checks, skip all Supabase network calls and return ~0ms
  if (!isProtected && !isAuthPage) {
    return response;
  }

  // 2. Only initialize Supabase client if we actually need to check auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() instead of getUser() in middleware to avoid 800ms+ network calls to Supabase.
  // getSession parses the JWT from the cookies locally and is incredibly fast, removing the 1s UI delay.
  // Full validation (getUser) should be performed inside Server Actions or individual protected API Routes if strict security is needed.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
