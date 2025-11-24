"use client";

import React, { useEffect, useState, use } from 'react';
import Agent from '@/components/ai_interview/Agent';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Clock, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { dummyInterviews } from '@/constants';

const InterviewPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Find the interview from dummy data
  const interview = dummyInterviews.find((int) => int.id.toString() === id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading during SSR and initial client load
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show auth required after component is mounted and auth is checked
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access the AI interview.</p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Interview not found
  if (!interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Interview Not Found</h3>
          <p className="text-gray-600 mb-4">The interview you're looking for doesn't exist.</p>
          <Link 
            href="/ai_interview"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            href="/ai_interview"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>
          
          {/* Interview Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">{interview.role}</h1>
                </div>
                <p className="text-gray-600 capitalize">{interview.type} Interview</p>
              </div>
              
              {interview.status === 'in-progress' && interview.duration && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(interview.duration / 60)} min remaining</span>
                </div>
              )}
            </div>

            {/* Tech Stack */}
            {interview.techstack && interview.techstack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {interview.techstack.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interview Agent Component */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Agent 
            userName={user.first_name || user.firstName || user.username || 'you'}
            userId={user?.id?.toString() || user?.id || 'guest'} 
            type="practice"
            interviewId={id}
          />
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Interview Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure your microphone is working properly</li>
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Take your time to think before answering</li>
            <li>• You can pause and resume the interview anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
