import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/admin", "/seller", "/dashboard"];
const authRoutes = ["/admin/login", "/seller/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth-token");

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is on a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !authToken) {
    // Determine which login page to redirect to based on the route
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    } else if (pathname.startsWith("/seller")) {
      return NextResponse.redirect(new URL("/seller/login", request.url));
    }
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && authToken) {
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (pathname.startsWith("/seller/login")) {
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
