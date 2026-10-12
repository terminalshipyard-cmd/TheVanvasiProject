import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes with RBAC
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-vanvasi-project-development-only",
    });

    // If user is not authenticated, redirect to sign-in
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Role-Based Access Control (RBAC): Require role "admin"
    if (token.role !== "admin") {
      // Non-admin customer trying to access /admin
      const unauthorizedUrl = new URL("/", req.url);
      unauthorizedUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
