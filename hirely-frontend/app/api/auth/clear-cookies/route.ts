import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API route to clear authentication cookies
 * Called during logout to remove server-side session
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete all auth cookies
    cookieStore.delete("token");
    cookieStore.delete("user");
    cookieStore.delete("access_token"); // In case this was also set

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cookies:", error);
    return NextResponse.json(
      { error: "Failed to clear cookies" },
      { status: 500 }
    );
  }
}
