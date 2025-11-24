"use client";

import React from 'react';
import SecureQuiz from '@/components/ai_interview/SecureQuiz';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/ai_interview" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI Interview
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <SecureQuiz />
      </div>
    </div>
  );
}
