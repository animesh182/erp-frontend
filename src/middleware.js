import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the base path '/', static assets, API routes, and favicon
  if (
    pathname === "/" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Check for the authentication token in cookies
  const token = request.cookies.get("access_token");
  //   console.log(token, "token");

  if (!token) {
    // Redirect to '/' if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Proceed if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
};
