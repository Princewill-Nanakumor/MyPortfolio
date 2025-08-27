// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret-change-in-production",
        { algorithms: ["HS256"] }
      ) as any;

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Check if user has admin role
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Add security headers
      const response = NextResponse.next();
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
      );
      response.headers.set("X-XSS-Protection", "1; mode=block");

      if (process.env.NODE_ENV === "production") {
        response.headers.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );
      }

      return response;
    } catch (error) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
