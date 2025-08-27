// src/app/api/admin/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
      { algorithms: ["HS256"] }
    ) as any;

    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if user has admin role
    if (decoded.role !== "admin") {
      return NextResponse.json({ authenticated: false }, { status: 403 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
