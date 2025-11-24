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

          <div className="flex gap-4 mt-4">
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


       <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900">Your Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
         {dummyInterviews.map((interview)=>(

            <InterviewCard key={interview.id} {...interview} />
         ))}
        </div>
      </section>



        <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900">Take Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )} */}
          {dummyInterviews.map((interview)=>(

            <InterviewCard key={interview.id} {...interview} />
         ))}
        </div>
      </section>

     
    </div>
  );
}