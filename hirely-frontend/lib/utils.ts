import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { interviewCovers, mappings } from "@/constants";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export const getInterviewCover = (interviewId?: string) => {
//   // If no interviewId provided, return a default cover
//   if (!interviewId) {
//     return `/covers${interviewCovers[0]}`;
//   }

//   // Create a simple hash from the interview ID
//   let hash = 0;
//   for (let i = 0; i < interviewId.length; i++) {
//     const char = interviewId.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash = hash & hash; // Convert to 32-bit integer
//   }
  
//   // Use absolute value and modulo to get a valid index
//   const index = Math.abs(hash) % interviewCovers.length;
//   return `/covers${interviewCovers[index]}`;
// };



// Use unpkg.com as a more reliable CDN alternative
const techIconBaseURL = "https://unpkg.com/simple-icons@latest/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || null;
};

// Simple icon mapping for common tech stacks - returns local fallback
const getTechIcon = (tech: string): string => {
  const normalized = normalizeTechName(tech);
  
  // For commonly used tech, just return fallback
  // This avoids CDN issues entirely
  return "/tech.svg";
};

export const getTechLogos = async (techArray: string[]) => {
  // Return synchronously with fallback icons to avoid CDN issues
  const results = techArray.map((tech) => ({
    tech,
    url: getTechIcon(tech),
  }));

  return results;
};

export const getRandomInterviewCover = (interviewId?: string) => {
  // If no interviewId provided, return a default cover
  if (!interviewId) {
    return `/covers${interviewCovers[0]}`;
  }

  // Create a simple hash from the interview ID
  let hash = 0;
  for (let i = 0; i < interviewId.length; i++) {
    const char = interviewId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a valid index
  const index = Math.abs(hash) % interviewCovers.length;
  return `/covers${interviewCovers[index]}`;
};
