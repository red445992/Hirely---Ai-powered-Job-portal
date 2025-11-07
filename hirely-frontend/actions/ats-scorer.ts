"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY || "");

export interface ATSAnalysisResult {
  "JD Match": string;
  MissingKeywords: string[];
  "Profile Summary": string;
}

/**
 * Convert file to base64 for Gemini
 */
async function fileToGenerativePart(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64,
      mimeType: file.type,
    },
  };
}

/**
 * Analyze resume using Gemini with direct PDF reading
 */
export async function analyzeResumeFromFile(
  file: File,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  try {
    // Validate API key
    if (!process.env.GOOGLE_GENERATIVE_API_KEY) {
      throw new Error('Google Generative API key is not configured');
    }

    // Validate inputs
    if (!jobDescription || jobDescription.trim() === '') {
      throw new Error('Job description is required');
    }

    if (!file) {
      throw new Error('Resume file is required');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported');
    }

    // Use Gemini Pro Vision to read the PDF directly
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
Act as an expert ATS (Applicant Tracking System) specialist with deep expertise in:
- Technical fields
- Software engineering
- Data science
- Data analysis
- Big data engineering

You have been provided with a resume PDF and a job description below.

Job Description:
${jobDescription.trim()}

Please analyze the resume against this job description and provide a response in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
  "JD Match": "percentage between 0-100 (e.g., 75%)",
  "MissingKeywords": ["keyword1", "keyword2", "keyword3"],
  "Profile Summary": "detailed analysis of the match and specific improvement suggestions"
}

Consider that the job market is highly competitive. Provide detailed, actionable feedback for resume improvement.
`;

    // Convert file to the format Gemini expects
    const filePart = await fileToGenerativePart(file);

    // Generate content with both the PDF and the prompt
    const result = await model.generateContent([prompt, filePart]);
    const response = result.response;
    const text = response.text();

    // Ensure response is not empty
    if (!text || text.trim() === '') {
      throw new Error('Empty response received from Gemini');
    }

    // Try to parse as JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    try {
      const responseJson = JSON.parse(jsonText);

      // Validate required fields
      const requiredFields = ["JD Match", "MissingKeywords", "Profile Summary"];
      for (const field of requiredFields) {
        if (!(field in responseJson)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return responseJson as ATSAnalysisResult;
    } catch (jsonError) {
      // If response is not valid JSON, try to extract JSON-like content
      const jsonPattern = /\{[\s\S]*\}/;
      const match = text.match(jsonPattern);
      
      if (match) {
        const extractedJson = match[0];
        const parsed = JSON.parse(extractedJson);
        
        // Validate required fields
        const requiredFields = ["JD Match", "MissingKeywords", "Profile Summary"];
        for (const field of requiredFields) {
          if (!(field in parsed)) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
        
        return parsed as ATSAnalysisResult;
      } else {
        console.error('Failed to parse AI response:', text);
        throw new Error('Could not extract valid JSON response from AI output');
      }
    }
  } catch (error) {
    console.error('File analysis error:', error);
    throw new Error(`Failed to analyze resume file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}