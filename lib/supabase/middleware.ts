import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getTimeoutCookieName, getExpiryTimestamp, getCookieOptions } from "@/lib/timeout";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
    return supabaseResponse;
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const timeoutCookie = request.cookies.get(getTimeoutCookieName())?.value;
    if (!timeoutCookie || Date.now() > parseInt(timeoutCookie)) {
      const loginUrl = new URL("/admin/login", request.url);
      supabaseResponse = NextResponse.redirect(loginUrl);
    }
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          if (!supabaseResponse.headers.get("location")) {
            supabaseResponse = NextResponse.next({ request });
          }
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    });

    if (isAdminRoute && !isLoginPage) {
      const timeoutCookie = request.cookies.get(getTimeoutCookieName())?.value;
      if (!timeoutCookie || Date.now() > parseInt(timeoutCookie)) {
        await supabase.auth.signOut();
        return supabaseResponse;
      }
      supabaseResponse.cookies.set(
        getTimeoutCookieName(),
        String(getExpiryTimestamp()),
        getCookieOptions()
      );
    }

    await supabase.auth.getUser();
  } catch {
    // Supabase not configured — skip session refresh
  }

  return supabaseResponse;
}
