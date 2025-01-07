
import { NextResponse } from "next/server";

// export function middleware(request) {
//   const { pathname } = request.nextUrl;
//     if (
//     pathname === "/" ||
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/api/") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname === "/users" || 
//     pathname.startsWith("/users/login-password") ||
//     pathname.startsWith("/users/employee-new-password") ||
//     pathname.startsWith("/users/email-verify") 

//   ) {
//     return NextResponse.next();
//   }
//   const tokenObj = request.cookies.get("access_token");
//   const token = tokenObj?.value; // Extract token value
//   function parseJwt(token) {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error("Failed to parse JWT", error);
//       return null;
//     }
//   }
//   const payload = parseJwt(token);
//   const userRole=payload.user_type

//   if (!token) {
//     // Redirect to '/' if not authenticated
//     return NextResponse.redirect(new URL("/", request.url));
//   }


//   if (token && userRole === "employee" && pathname.startsWith("/")) {
//     return NextResponse.redirect(new URL("/users", request.url));
//   }
//   if (token && userRole === "admin" && pathname.startsWith("/")) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Allow access to the intended route
//   return NextResponse.next();
// }
// // Function to parse a JWT and extract its payload


// export const config = {
//   matcher: [
//     "/",
//     "/dashboard",
//     "/users", // Match all routes under /admin
//   ],
// };


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
  const payload = parseJwt(token);

  // Hardcoded role logic based on user_id
  const userRole = payload.user_type === 'employee' ? "user" : "admin";

  
  // Redirect based on role
  if (userRole === "user" && !pathname.startsWith("/users")) {
    console.log("usususu")
    return NextResponse.redirect(new URL("/users", request.url));
  }
  if (userRole === "admin" && !pathname.startsWith("/dashboard")) {
    console.log("adadada")
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to the intended route
  return NextResponse.next();
}
// Function to parse a JWT and extract its payload


export const config = {
  matcher: "/((?!api|_next/static|favicon.ico).*)",
};