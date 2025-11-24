'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, Video, Clock, Sparkles, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import InterviewCard from '@/components/ai_interview/interviewcard';
import { dummyInterviews } from '@/constants';
export default function AIInterviewPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl px-8 py-12 items-center justify-between text-white shadow-2xl gap-8">
        <div className="flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get started with AI-Powered Interviews
          </h1>
          
          <p className="text-xl text-indigo-100 leading-relaxed">
            Leverage cutting-edge AI technology to conduct interviews that are efficient, unbiased, and insightful. 
            Our AI Interview feature helps you assess candidates effectively with automated video interviews, 
            real-time feedback, and comprehensive analytics.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Button asChild className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-lg">
              <Link href="/ai_interview/quiz">
                Take AI Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full shadow-lg">
              <Link href="/ai_interview/interview">
                Voice Interview
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 text-lg font-semibold rounded-full shadow-lg">
              <Link href="/ai_interview/recordings">
                Recordings
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 text-lg font-semibold rounded-full shadow-lg">
              <Link href="/ai_interview/dashboard">
                 Dashboard
              </Link>
            </Button>
          </div>
        </div>
        {/* robo Image Section */}
        <div className="flex-shrink-0">
          <div className="relative w-80 h-64 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="/robo.webp" 
              alt="AI Interview Robot" 
              width={320} 
              height={256} 
              className="object-cover w-full h-full" 
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">AI Quiz</CardTitle>
            <CardDescription>Test your knowledge with AI-generated questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai_interview/quiz">
              <Button className="w-full">Start Quiz</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Voice Interview</CardTitle>
            <CardDescription>Practice with AI voice interviewer</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai_interview/interview">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Interview</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Recordings</CardTitle>
            <CardDescription>Review your past interview recordings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai_interview/recordings">
              <Button className="w-full bg-green-600 hover:bg-green-700">View Recordings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Dashboard</CardTitle>
            <CardDescription>Track your progress and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai_interview/dashboard">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">View Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </section> */}

      {/* Your Interviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              Your Interviews
            </h2>
            <p className="text-gray-600 mt-2">Interviews you've completed or are in progress</p>
          </div>
          <Link href="/ai_interview/interview">
            <Button className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create New
            </Button>
          </Link>
        </div>

        {dummyInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyInterviews.slice(0, 3).map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-gray-400 mb-4">
              <MessageCircle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No interviews yet</h3>
            <p className="text-gray-500 mb-6">Start your first AI interview to see it here</p>
            <Link href="/ai_interview/interview">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Start Your First Interview
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Available Interviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-600" />
              Available Interviews
            </h2>
            <p className="text-gray-600 mt-2">Practice interviews available for you to take</p>
          </div>
        </div>

        {dummyInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-purple-400 mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No interviews available</h3>
            <p className="text-gray-500 mb-6">Check back later for new interview opportunities</p>
          </Card>
        )}
      </section>
    </div>
  );
}