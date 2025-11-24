"use server";

import { db } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const apiKey = process.env.GOOGLE_GENERATIVE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

export async function generateCoverLetter(data) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("📝 Generating cover letter for user:", user.id);

    const userProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
      select: {
        industry: true,
        experience: true,
        skills: true,
        bio: true,
      },
    });

    if (!userProfile) throw new Error("User profile not found");

    const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
      data.companyName
    }.
    
    About the candidate:
    - Industry: ${userProfile.industry}
    - Years of Experience: ${userProfile.experience}
    - Skills: ${userProfile.skills?.join(", ") || "N/A"}
    - Professional Background: ${userProfile.bio || "N/A"}
    
    Job Description:
    ${data.jobDescription || "N/A"}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        content,
        jobDescription: data.jobDescription || "",
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
      },
    });

    console.log("✅ Cover letter generated successfully");
    revalidatePath("/sensai/cover-letter");
    revalidatePath("/sensai/dashboard");

    return coverLetter;
  } catch (error) {
    console.error("❌ Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("📋 Fetching cover letters for user:", user.id);

    const coverLetters = await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return coverLetters;
  } catch (error) {
    console.error("❌ Error fetching cover letters:", error);
    throw new Error("Failed to fetch cover letters");
  }
}

export async function getCoverLetter(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("📄 Fetching cover letter:", id);

    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!coverLetter) throw new Error("Cover letter not found");

    return coverLetter;
  } catch (error) {
    console.error("❌ Error fetching cover letter:", error);
    throw new Error("Failed to fetch cover letter");
  }
}

export async function deleteCoverLetter(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("🗑️ Deleting cover letter:", id);

    // First verify the cover letter belongs to the user
    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!coverLetter) throw new Error("Cover letter not found");

    // Delete by id (unique field)
    await db.coverLetter.delete({
      where: {
        id: coverLetter.id,
      },
    });

    console.log("✅ Cover letter deleted successfully");
    revalidatePath("/sensai/cover-letter");
    revalidatePath("/sensai/dashboard");

    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting cover letter:", error);
    throw new Error("Failed to delete cover letter");
  }
}