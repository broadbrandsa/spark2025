import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "spark-report-access";

const PUBLIC_PATHS = new Set(["/access", "/favicon.ico"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/access") ||
    PUBLIC_PATHS.has(pathname) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(COOKIE_NAME)?.value === "1";
  if (hasAccess) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/access";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
