"use server";

import { db } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const apiKey =  process.env.GOOGLE_GENERATIVE_API_KEY;
const modelName = process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-flash";

if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

export async function saveResume(content: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("💾 Saving resume for user:", user.id);

    // Check if resume exists
    const existingResume = await db.resume.findFirst({
      where: { userId: user.id },
    });

    let resume;
    if (existingResume) {
      // Update existing resume
      resume = await db.resume.update({
        where: { id: existingResume.id },
        data: {
          content,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new resume
      resume = await db.resume.create({
        data: {
          userId: user.id,
          userEmail: user.email,
          content,
        },
      });
    }

    console.log("✅ Resume saved successfully");
    revalidatePath("/resume");
    revalidatePath("/sensai/dashboard");
    
    return resume;
  } catch (error) {
    console.error("❌ Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const resume = await db.resume.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        content: true,
        atsScore: true,
        feedback: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return resume;
  } catch (error) {
    console.error("❌ Error fetching resume:", error);
    throw new Error("Failed to fetch resume");
  }
}

export async function improveWithAI({ current, type }: { current: string; type: string }) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log(`🤖 Improving ${type} with AI...`);

    // Get user profile to access industry information
    const userProfile = await db.userProfile.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        industry: true,
        skills: true,
      },
    });

    if (!userProfile) throw new Error("User profile not found");
    if (!userProfile.industry) throw new Error("Please complete onboarding to use AI improvements");

    const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${userProfile.industry} professional${
        userProfile.skills?.length ? ` with expertise in ${userProfile.skills.join(", ")}` : ""
      }.
      Make it more impactful, quantifiable, and aligned with industry standards.
      Current content: "${current}"

      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      
      Format the response as a single paragraph without any additional text or explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    
    console.log("✅ Content improved successfully");
    return improvedContent;
  } catch (error) {
    console.error("❌ Error improving content:", error);
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to improve content");
  }
}

export async function deleteResume() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("🗑️ Deleting resume for user:", user.id);

    // First find the resume
    const resume = await db.resume.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    // Delete by id (unique field)
    await db.resume.delete({
      where: {
        id: resume.id,
      },
    });

    console.log("✅ Resume deleted successfully");
    revalidatePath("/resume");
    revalidatePath("/sensai/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting resume:", error);
    throw new Error("Failed to delete resume");
  }
}

export async function analyzeResume() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const resume = await db.resume.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!resume) throw new Error("Resume not found");

    const userProfile = await db.userProfile.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        industry: true,
      },
    });

    if (!userProfile) throw new Error("User profile not found");

    console.log("🔍 Analyzing resume...");

    const prompt = `
      Analyze the following resume for a ${userProfile.industry} professional and provide:
      1. Overall score (0-100)
      2. Key strengths (3-5 points)
      3. Areas for improvement (3-5 points)
      4. Industry-specific recommendations
      
      Resume content:
      ${resume.content}
      
      Return the response in this JSON format only:
      {
        "score": number,
        "strengths": ["string"],
        "improvements": ["string"],
        "recommendations": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const analysis = JSON.parse(cleanedText);

    console.log("✅ Resume analyzed successfully");
    return analysis;
  } catch (error) {
    console.error("❌ Error analyzing resume:", error);
    throw new Error("Failed to analyze resume");
  }
}