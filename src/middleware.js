
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

//current middleware function
// export function middleware(request) {
//   const { pathname } = request.nextUrl;
//   // //bypass auth for now
//   // return NextResponse.next();

//   if (
//     pathname === "/" ||
//     pathname.startsWith("/_next/") ||
//     pathname.startsWith("/api/") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname === "/users" || 
//     pathname.startsWith("/users/login-password") ||
//     pathname.startsWith("/users/employee-new-password") ||
//     pathname.startsWith("/users/email-verify") 

//   ) {
//     return NextResponse.next(`${process.env.NEXT_PUBLIC_URL}`,302);
//     // `${env.NEXT_PUBLIC_SITE_URL}/catalog`), 302

//   }

//   // Check for the authentication token in cookies
//   const tokenObj = request.cookies.get("access_token");
//   const token = tokenObj?.value; // Extract token value

//   if (!token) {
//     // Redirect to '/' if not authenticated
//     return NextResponse.redirect(new URL("/", request.url));
//   }
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

//   // Hardcoded role logic based on user_id
//   const userRole = payload.user_type === 'employee' ? "user" : "admin";

  
//   // Redirect based on role
//   if (userRole === "user" && !pathname.startsWith("/users")) {
//     console.log("usususu")
//     return NextResponse.redirect(new URL("/users", request.url));
//   }
//   if (userRole === "admin" && !pathname.startsWith("/dashboard")) {
//     console.log("adadada")
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Allow access to the intended route
//   return NextResponse.next();
// }
// // Function to parse a JWT and extract its payload


// export const config = {
//   matcher: "/((?!api|_next/static|favicon.ico).*)",
// };
// current middleware 

//middleware for same network:

// Function to parse a JWT and extract its payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Bypass middleware for specific routes
  const bypassRoutes = [
    '/',
    '/_next/',
    '/api/',
    '/favicon.ico',
    '/users',
    '/users/login-password',
    '/users/employee-new-password',
    '/users/email-verify',
  ];

  if (bypassRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next(); // Proceed to the next middleware or route handler
  }

  // Check for the authentication token in cookies
  const tokenObj = request.cookies.get('access_token');
  const token = tokenObj?.value;

  // Redirect to home if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }

  // Parse JWT to get user role
  const payload = parseJwt(token);
  if (!payload) {
    console.error('Invalid JWT payload');
    return NextResponse.redirect(new URL('/', request.url), 302);
  }

  // Determine user role based on user_type
  const userRole = payload.user_type === 'employee' ? 'user' : 'admin';

  // Redirect based on role
  if (userRole === 'user' && !pathname.startsWith('/users')) {
    console.log('Redirecting user to /users');
    return NextResponse.redirect(new URL('/users', request.url), 302);
  }

  if (userRole === 'admin' && !pathname.startsWith('/dashboard')) {
    console.log('Redirecting admin to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url), 302);
  }

  // Allow access to the intended route
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};