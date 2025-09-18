import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // For client-side auth check, we'll handle it in the components
  // This middleware just handles basic routing
  if (pathname === '/') {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"]
};
