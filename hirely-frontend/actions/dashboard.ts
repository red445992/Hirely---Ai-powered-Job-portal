"use server";

import { db } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Debug: Check if API key is loaded
const apiKey = process.env.GOOGLE_GENERATIVE_API_KEY;
console.log("🔑 Google API Key loaded:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ NOT FOUND");

if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Use the correct model name - gemini-pro or gemini-1.5-pro instead of gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export const generateAIInsights = async (industry: string) => {
  try {
    console.log(`🤖 Generating AI insights for industry: ${industry}`);
    
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "string",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage (e.g., 5.2 for 5.2%).
          Include at least 5 skills and trends.
          Market outlook should be a descriptive string about the industry's future.
        `;

    console.log("📤 Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("📥 Received response from Gemini API");
    console.log("📝 Raw response length:", text.length);
    console.log("📝 First 200 chars:", text.substring(0, 200));
    
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    console.log("🧹 Cleaned text length:", cleanedText.length);
    console.log("🧹 Cleaned first 200 chars:", cleanedText.substring(0, 200));
    
    const parsed = JSON.parse(cleanedText);
    console.log("✅ Successfully parsed JSON");
    console.log("📊 Parsed data structure:", {
      salaryRangesCount: parsed.salaryRanges?.length,
      growthRate: parsed.growthRate,
      demandLevel: parsed.demandLevel,
      topSkillsCount: parsed.topSkills?.length,
      keyTrendsCount: parsed.keyTrends?.length,
      recommendedSkillsCount: parsed.recommendedSkills?.length,
    });
    
    return parsed;
  } catch (error) {
    console.error("❌ Error generating AI insights:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};

export async function getIndustryInsights() {
  try {
    console.log("🔍 Getting industry insights...");
    const user = await getCurrentUser();
    if (!user) {
      console.error("❌ No user found");
      throw new Error("Unauthorized");
    }
    console.log(`✅ User found: ${user.id}`);

    const userProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
      include: {
        industryInsight: true,
      },
    });

    if (!userProfile) {
      console.error("❌ User profile not found");
      throw new Error("User profile not found");
    }
    console.log(`✅ User profile found. Industry: ${userProfile.industry}`);
    
    if (!userProfile.industry) {
      console.error("❌ User has not selected an industry");
      throw new Error("User has not selected an industry");
    }

    // If user profile has a linked insight, check if it matches the current industry
    if (userProfile.industryInsight) {
      console.log("📊 User has existing industry insight");
      console.log(`🏭 Linked insight industry: ${userProfile.industryInsight.industry}`);
      console.log(`👤 User's current industry: ${userProfile.industry}`);
      
      // CRITICAL: Check if the linked insight matches the user's current industry
      if (userProfile.industryInsight.industry !== userProfile.industry) {
        console.log("⚠️ Industry mismatch detected! User changed industries.");
        console.log(`� Looking for insight for new industry: ${userProfile.industry}`);
        
        // Look for insight matching the new industry
        const newIndustryInsight = await db.industryInsight.findUnique({
          where: { industry: userProfile.industry },
        });
        
        if (newIndustryInsight) {
          console.log("✅ Found existing insight for new industry, linking...");
          await db.userProfile.update({
            where: { userId: user.id },
            data: { industryInsightId: newIndustryInsight.id },
          });
          return newIndustryInsight;
        }
        
        // If no insight exists for new industry, generate it
        console.log("🆕 No insight exists for new industry, generating...");
        const insights = await generateAIInsights(userProfile.industry);
        
        // Use upsert to handle race conditions
        const newInsight = await db.industryInsight.upsert({
          where: { industry: userProfile.industry },
          update: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          create: {
            industry: userProfile.industry,
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        
        await db.userProfile.update({
          where: { userId: user.id },
          data: { industryInsightId: newInsight.id },
        });
        
        console.log("✅ New industry insight created and linked");
        return newInsight;
      }
      
      console.log(`📅 Last updated: ${userProfile.industryInsight.lastUpdated}`);
      console.log(`📅 Next update: ${userProfile.industryInsight.nextUpdate}`);
      
      // Check if insights need updating (older than nextUpdate date)
      if (userProfile.industryInsight.nextUpdate < new Date()) {
        console.log("🔄 Insights are stale, updating...");
        const insights = await generateAIInsights(userProfile.industry);

        const updatedInsight = await db.industryInsight.update({
          where: { id: userProfile.industryInsight.id },
          data: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        console.log("✅ Industry insights updated successfully");
        return updatedInsight;
      }
      
      console.log("✅ Returning cached industry insights (still fresh)");
      return userProfile.industryInsight;
    }

    // Check if an insight already exists for this industry (shared across users)
    console.log(`🔍 Checking if insight exists for industry: ${userProfile.industry}`);
    const existingInsight = await db.industryInsight.findUnique({
      where: { industry: userProfile.industry },
    });

    if (existingInsight) {
      console.log("📊 Found existing insight for this industry, linking to user...");
      // Link the existing insight to this user's profile
      await db.userProfile.update({
        where: { userId: user.id },
        data: { industryInsightId: existingInsight.id },
      });

      console.log("✅ User linked to existing industry insight");
      return existingInsight;
    }

    // If no insights exist at all, generate them
    console.log("🆕 No existing insights found, generating new ones...");
    const insights = await generateAIInsights(userProfile.industry);

    console.log("💾 Saving industry insights to database...");
    // Use upsert to handle race conditions where insight was created between checks
    const industryInsight = await db.industryInsight.upsert({
      where: { industry: userProfile.industry },
      update: {
        // If it exists, update it with new data
        salaryRanges: insights.salaryRanges,
        growthRate: insights.growthRate,
        demandLevel: insights.demandLevel,
        topSkills: insights.topSkills,
        marketOutlook: insights.marketOutlook,
        keyTrends: insights.keyTrends,
        recommendedSkills: insights.recommendedSkills,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        // If it doesn't exist, create it
        industry: userProfile.industry,
        salaryRanges: insights.salaryRanges,
        growthRate: insights.growthRate,
        demandLevel: insights.demandLevel,
        topSkills: insights.topSkills,
        marketOutlook: insights.marketOutlook,
        keyTrends: insights.keyTrends,
        recommendedSkills: insights.recommendedSkills,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
      },
    });

    console.log("🔗 Linking industry insight to user profile...");
    // Link the new insight to user profile
    await db.userProfile.update({
      where: { userId: user.id },
      data: { industryInsightId: industryInsight.id },
    });

    console.log("✅ Industry insights created and linked successfully");
    return industryInsight;
  } catch (error) {
    console.error("❌ Error in getIndustryInsights:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}

/**
 * Get user's dashboard stats
 */
export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [profile, assessments, resumes, coverLetters, careerGoals, interviewSessions] = await Promise.all([
    db.userProfile.findUnique({
      where: { userId: user.id },
      include: { industryInsight: true },
    }),
    db.assessment.count({ where: { userId: user.id } }),
    db.resume.count({ where: { userId: user.id } }),
    db.coverLetter.count({ where: { userId: user.id } }),
    db.careerGoal.count({ where: { userId: user.id, status: "active" } }),
    db.interviewSession.count({ where: { userId: user.id } }),
  ]);

  return {
    profile,
    stats: {
      assessments,
      resumes,
      coverLetters,
      activeGoals: careerGoals,
      interviewSessions,
    },
  };
}

/**
 * Get recent user activities
 */
export async function getRecentActivities() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const [recentAssessments, recentResumes, recentCoverLetters, recentGoals] = await Promise.all([
    db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        category: true,
        quizScore: true,
        createdAt: true,
      },
    }),
    db.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        atsScore: true,
        createdAt: true,
      },
    }),
    db.coverLetter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        status: true,
        createdAt: true,
      },
    }),
    db.careerGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        progress: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    assessments: recentAssessments,
    resumes: recentResumes,
    coverLetters: recentCoverLetters,
    goals: recentGoals,
  };
}

/**
 * Test function to verify Google AI API key is working
//  */
// export async function testGoogleAIConnection() {
//   try {
//     console.log("🧪 Testing Google AI API connection...");
//     console.log("📝 API Key status:", apiKey ? "✅ Found" : "❌ Not found");
//     console.log("📝 API Key preview:", apiKey ? `${apiKey.substring(0, 15)}...` : "N/A");
    
//     // Try to list available models first
//     let availableModels: string[] = [];
//     try {
//     //   const listResult = await genAI.listModels();
//     //   availableModels = listResult.map((m: any) => m.name);
//       console.log("📋 Available models:", availableModels);
//     } catch (listError) {
//       console.warn("⚠️ Could not list models:", listError);
//     }
    
//     const testPrompt = "Say 'Hello! API is working.' in exactly those words.";
//     const result = await model.generateContent(testPrompt);
//     const response = result.response;
//     const text = response.text();
    
//     console.log("✅ Google AI API test successful!");
//     console.log("📝 Response:", text);
    
//     return {
//       success: true,
//       message: "API connection successful",
//       response: text,
//       apiKeyFound: !!apiKey,
//       modelUsed: "gemini-pro",
//       availableModels: availableModels.length > 0 ? availableModels : undefined,
//     };
//   } catch (error) {
//     console.error("❌ Google AI API test failed:", error);
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Unknown error",
//       apiKeyFound: !!apiKey,
//       modelUsed: "gemini-pro",
//       error: String(error),
//       suggestion: "Try using 'gemini-pro' or 'gemini-1.5-pro' model instead",
//     };
//   }
// }