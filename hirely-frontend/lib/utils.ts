import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { interviewCovers, mappings } from "@/constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getInterviewCover = (interviewId?: string) => {
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