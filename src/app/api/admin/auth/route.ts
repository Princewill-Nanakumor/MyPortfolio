// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Rate limiting store (in production, use Redis or database)
const loginAttempts = new Map<
  string,
  { count: number; lastAttempt: number; lockedUntil?: number }
>();

const MAX_ATTEMPTS = 4;
const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour
const WINDOW_SIZE = 60 * 60 * 1000; // 1 hour

// Helper function to get client identifier
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const clientId = getClientId(request);

    // Check rate limiting
    const now = Date.now();
    const attempts = loginAttempts.get(clientId) || {
      count: 0,
      lastAttempt: 0,
    };

    // Reset attempts if window has passed
    if (now - attempts.lastAttempt > WINDOW_SIZE) {
      attempts.count = 0;
      attempts.lockedUntil = undefined;
    }

    // Check if account is locked
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
      const remainingTime = Math.ceil((attempts.lockedUntil - now) / 1000 / 60);
      return NextResponse.json(
        {
          error: `Account temporarily locked. Try again in ${remainingTime} minutes.`,
        },
        { status: 429 }
      );
    }

    // Clear lockout if time has passed
    if (attempts.lockedUntil && now >= attempts.lockedUntil) {
      attempts.lockedUntil = undefined;
    }

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    // Use plain text comparison (for now)
    const isValid = password === correctPassword;

    if (isValid) {
      // Reset failed attempts on successful login
      loginAttempts.delete(clientId);

      const token = jwt.sign(
        { role: "admin", iat: Math.floor(Date.now() / 1000) },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "24h" }
      );

      const response = NextResponse.json({ success: true });
      response.cookies.set("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60,
        path: "/",
      });

      return response;
    } else {
      // Increment failed attempts
      attempts.count += 1;
      attempts.lastAttempt = now;

      // Lock account if max attempts reached
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = now + LOCKOUT_DURATION;
        loginAttempts.set(clientId, attempts);

        return NextResponse.json(
          { error: `Too many failed attempts. Account locked for 1 hour.` },
          { status: 429 }
        );
      }

      loginAttempts.set(clientId, attempts);

      const remainingAttempts = MAX_ATTEMPTS - attempts.count;
      return NextResponse.json(
        { error: `Invalid password. ${remainingAttempts} attempts remaining.` },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
