// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // Allow the base path '/', static assets, API routes, and favicon
//   if (
//     pathname === "/" ||
//     pathname.startsWith("/users") ||
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/api/") ||
//     pathname.startsWith("/favicon.ico")
//   ) {
//     return NextResponse.next();
//   }

//   // Check for the authentication token in cookies
//   const token = request.cookies.get("access_token");
//   //   console.log(token, "token");
//   if (!token) {
//     // Redirect to '/' if not authenticated
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Proceed if authenticated
//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/((?!api|_next/static|favicon.ico).*)",
// };
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (
    pathname === "/" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/users" || 
    pathname.startsWith("/users/login-password") ||
    pathname.startsWith("/users/employee-new-password") ||
    pathname.startsWith("/users/email-verify") 

  ) {
    return NextResponse.next();
  }

  // Check for the authentication token in cookies
  const tokenObj = request.cookies.get("access_token");
  const token = tokenObj?.value; // Extract token value

  if (!token) {
    // Redirect to '/' if not authenticated
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Decode JWT payload
  const payload = parseJwt(token);

  // Hardcoded role logic based on user_id
  const userRole = payload.user_id === 31 ? "admin" : "user";

  // Redirect based on role
  if (userRole === "user" && !pathname.startsWith("/users")) {
    return NextResponse.redirect(new URL("/users", request.url));
  }
  if (userRole === "admin" && !pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to the intended route
  return NextResponse.next();
}

// Function to parse a JWT and extract its payload
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
};