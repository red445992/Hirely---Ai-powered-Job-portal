"use server";

import { db } from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the correct API key and model
const apiKey = process.env.GOOGLE_GENERATIVE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GENERATIVE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelName = process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

export async function generateQuiz() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    // Get user profile to access industry and skills
    const userProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
      select: {
        industry: true,
        skills: true,
      },
    });

    if (!userProfile) throw new Error("User profile not found");
    if (!userProfile.industry) throw new Error("User has not completed onboarding");

    const prompt = `
    Generate 10 technical interview questions for a ${userProfile.industry} professional${
      userProfile.skills?.length ? ` with expertise in ${userProfile.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    console.log("🤖 Generating quiz questions...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    console.log("✅ Quiz questions generated successfully");
    return quiz.questions;
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions: any[], answers: string[], score: number) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    console.log("💾 Saving quiz result...");

    const userProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
      select: { industry: true },
    });

    if (!userProfile) throw new Error("User profile not found");

    const questionResults = questions.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

    // Get wrong answers
    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

    // Only generate improvement tips if there are wrong answers
    let improvementTip = null;
    if (wrongAnswers.length > 0) {
      const wrongQuestionsText = wrongAnswers
        .map(
          (q) =>
            `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        )
        .join("\n\n");

      const improvementPrompt = `
        The user got the following ${userProfile.industry} technical interview questions wrong:

        ${wrongQuestionsText}

        Based on these mistakes, provide a concise, specific improvement tip.
        Focus on the knowledge gaps revealed by these wrong answers.
        Keep the response under 2 sentences and make it encouraging.
        Don't explicitly mention the mistakes, instead focus on what to learn/practice.
      `;

      try {
        const tipResult = await model.generateContent(improvementPrompt);
        improvementTip = tipResult.response.text().trim();
        console.log("💡 Improvement tip:", improvementTip);
      } catch (error) {
        console.error("Error generating improvement tip:", error);
        // Continue without improvement tip if generation fails
      }
    }

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    console.log("✅ Quiz result saved successfully");
    return assessment;
  } catch (error) {
    console.error("❌ Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc", // Changed to 'desc' to show newest first
      },
      select: {
        id: true,
        quizScore: true,
        category: true,
        improvementTip: true,
        questions: true,
        createdAt: true,
      },
    });

    console.log(`✅ Fetched ${assessments.length} assessments`);
    return assessments;
  } catch (error) {
    console.error("❌ Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}