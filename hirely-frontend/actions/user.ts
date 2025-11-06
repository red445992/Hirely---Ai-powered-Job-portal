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

    // Find or create IndustryInsight for the selected industry
    let industryInsight = null;
    if (data.industry) {
      industryInsight = await db.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      // If industry insight doesn't exist, create a placeholder
      if (!industryInsight) {
        industryInsight = await db.industryInsight.create({
          data: {
            industry: data.industry,
            salaryRanges: [],
            growthRate: 0,
            demandLevel: "Unknown",
            topSkills: [],
            marketOutlook: "Data not available yet",
            keyTrends: [],
            recommendedSkills: [],
            nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        });
      }
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
          industryInsightId: industryInsight?.id,
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
        industryInsightId: industryInsight?.id,
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