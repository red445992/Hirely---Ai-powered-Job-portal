import { resetOnboarding } from "@/actions/user";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await resetOnboarding();
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to reset onboarding" 
      },
      { status: 500 }
    );
  }
}
