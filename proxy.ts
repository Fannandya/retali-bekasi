import createMiddleware from "next-intl/middleware";
import { updateSession } from "./lib/supabase/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }
  const response = intlMiddleware(request);
  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
