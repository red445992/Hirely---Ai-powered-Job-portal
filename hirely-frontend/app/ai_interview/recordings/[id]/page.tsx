"use client";

import RecordingPlayer from "@/components/ai_interview/RecordingPlayer";
import { use } from "react";
import Link from "next/link";

// Mock data for demonstration
const mockRecording = {
  id: "1",
  role: "Senior Frontend Developer",
  date: "2025-11-20T10:30:00",
  duration: 1800,
  audioUrl: "/sample-interview.mp3", // You would use actual audio URL
  transcript: [
    {
      timestamp: 0,
      speaker: "interviewer" as const,
      text: "Hello! Welcome to your interview for the Senior Frontend Developer position. Let's start by having you introduce yourself.",
    },
    {
      timestamp: 15,
      speaker: "candidate" as const,
      text: "Thank you for having me. I'm a frontend developer with 5 years of experience specializing in React and TypeScript. I've led several projects involving complex state management and performance optimization.",
    },
    {
      timestamp: 45,
      speaker: "interviewer" as const,
      text: "Great! Can you tell me about a challenging project you've worked on recently?",
    },
    {
      timestamp: 60,
      speaker: "candidate" as const,
      text: "Sure! I recently architected a real-time dashboard using React, Redux, and WebSockets. The main challenge was optimizing rendering performance with thousands of data points updating every second.",
    },
    {
      timestamp: 90,
      speaker: "interviewer" as const,
      text: "How did you approach that performance optimization?",
    },
    {
      timestamp: 105,
      speaker: "candidate" as const,
      text: "I implemented several strategies including virtualization with react-window, memoization with React.memo and useMemo, and debouncing updates. I also used React Profiler to identify bottlenecks.",
    },
  ],
  feedback: {
    overall_score: 85,
    communication: 88,
    technical_knowledge: 90,
    problem_solving: 82,
    confidence: 80,
    strengths: [
      "Clear and concise communication",
      "Strong technical knowledge of React ecosystem",
      "Good problem-solving approach with specific examples",
      "Demonstrates hands-on experience with performance optimization",
    ],
    weaknesses: [
      "Could provide more detail on team collaboration aspects",
      "Limited discussion of testing strategies",
      "Could elaborate more on design pattern choices",
    ],
    recommendations: [
      "Practice explaining complex technical concepts in simpler terms",
      "Prepare examples that showcase soft skills and teamwork",
      "Study common system design patterns for frontend applications",
      "Be ready to discuss testing methodologies (unit, integration, e2e)",
    ],
    key_moments: [
      {
        timestamp: 60,
        description: "Strong example of project leadership",
        type: "positive" as const,
      },
      {
        timestamp: 105,
        description: "Excellent technical depth on performance optimization",
        type: "positive" as const,
      },
    ],
  },
};

export default function RecordingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // In a real app, you would fetch the recording data based on the id
  // For now, we'll use mock data
  const recording = { ...mockRecording, id };

  return (
    <div>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/ai_interview/recordings"
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all shadow-md border border-gray-200 flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Recordings</span>
        </Link>
      </div>
      <RecordingPlayer recording={recording} />
    </div>
  );
}
