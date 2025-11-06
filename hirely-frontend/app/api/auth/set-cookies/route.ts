import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API route to set authentication cookies
 * Called after successful login to sync localStorage with server cookies
 */
export async function POST(request: NextRequest) {
  try {
    const { token, user } = await request.json();

    if (!token || !user) {
      return NextResponse.json(
        { error: "Token and user data are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Set token cookie (7 days expiry)
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Set user cookie (7 days expiry)
    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting cookies:", error);
    return NextResponse.json(
      { error: "Failed to set cookies" },
      { status: 500 }
    );
  }
}
