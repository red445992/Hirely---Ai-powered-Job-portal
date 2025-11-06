"use server";

import { db } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";
import { revalidatePath } from "next/cache";

interface UpdateUserData {
  industry: string;
  experience?: number;
  bio?: string;
  skills?: string[];
}

/**
 * Update user profile in SensAI database
 */
export async function updateUser(data: UpdateUserData) {
  try {
    // Get current Django user from cookies
    const user = await getCurrentUser();
    
    console.log("Current user from cookies:", user); // Debug log
    
    if (!user) {
      return {
        success: false,
        error: "User not authenticated. Please log in again.",
      };
    }

    // Check if an IndustryInsight already exists for the selected industry
    // Don't create it here - let the dashboard generate it with AI
    let industryInsightId = null;
    if (data.industry) {
      const existingInsight = await db.industryInsight.findUnique({
        where: { industry: data.industry },
      });
      industryInsightId = existingInsight?.id || null;
    }

    // Check if user profile exists
    const existingProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      // Create new profile if doesn't exist
      const newProfile = await db.userProfile.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          industry: data.industry,
          industryInsightId: industryInsightId, // Fixed: was industryInsight?.id
          experience: data.experience || null,
          bio: data.bio || null,
          skills: data.skills || [],
          preferences: {}
        },
      });
      
      revalidatePath("/");
      return {
        success: true,
        data: newProfile,
      };
    }

    // Update existing profile
    const updatedProfile = await db.userProfile.update({
      where: { userId: user.id },
      data: {
        industry: data.industry,
        industryInsightId: industryInsightId, // Fixed: was industryInsight?.id
        experience: data.experience,
        bio: data.bio,
        skills: data.skills || [],
      },
    });

    revalidatePath("/");
    return {
      success: true,
      data: updatedProfile,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function getUserOnboardingStatus() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { isOnboarded: false };
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
      select: {
        industry: true,
        bio: true,
      },
    });

    // User is considered onboarded if they have set their industry
    return {
      isOnboarded: !!profile?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { isOnboarded: false };
  }
}

/**
 * Get user's complete profile
 */
export async function getUserProfile() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
      include: {
        industryInsight: true, // Include related industry insights
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

/**
 * Reset user onboarding (for testing purposes)
 * This clears the industry field so user can re-onboard
 */
export async function resetOnboarding() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Just clear the industry field, keep other data
    await db.userProfile.update({
      where: { userId: user.id },
      data: {
        industry: null,
        industryInsightId: null, // Unlink from insight
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error resetting onboarding:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset onboarding",
    };
  }
}