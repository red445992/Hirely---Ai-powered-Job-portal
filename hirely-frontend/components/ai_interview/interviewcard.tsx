"use client";

import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "./DisplayTechIcons";
import { 
  Calendar, 
  Star, 
  Clock, 
  ArrowRight, 
  Sparkles,
  CheckCircle2 
} from "lucide-react";

// Define types for the component props
interface InterviewCardProps {
  id: string;
  userId?: string;
  role: string;
  type: string;
  techstack?: string[];
  createdAt?: string | Date;
  status?: 'pending' | 'completed' | 'in-progress';
  score?: number;
  duration?: number;
}

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack = [],
  createdAt,
  status = 'pending',
  score,
  duration = 30,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  // Enhanced badge styling with gradients
  const badgeStyles = {
    Behavioral: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    Mixed: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    Technical: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  }[normalizedType] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";

  // Status styling
  const statusConfig = {
    pending: { 
      icon: Clock, 
      text: "Not Started", 
      color: "text-gray-600",
      bg: "bg-gray-100" 
    },
    'in-progress': { 
      icon: Sparkles, 
      text: "In Progress", 
      color: "text-orange-600",
      bg: "bg-orange-100" 
    },
    completed: { 
      icon: CheckCircle2, 
      text: "Completed", 
      color: "text-green-600",
      bg: "bg-green-100" 
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  const defaultDate = new Date('2024-01-01').getTime();
  const formattedDate = dayjs(createdAt || defaultDate).format("MMM D, YYYY");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col overflow-hidden border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white">
        {/* Header Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 pb-20">
          {/* Type Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles} shadow-lg`}>
            {normalizedType}
          </div>

          {/* Cover Image with Animation */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="absolute -bottom-12 left-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl opacity-50"></div>
              <Image
                src={getRandomInterviewCover(id)}
                alt="cover-image"
                width={100}
                height={100}
                className="relative rounded-full object-cover w-[100px] h-[100px] border-4 border-white shadow-lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 pt-16 flex flex-col">
          {/* Interview Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {role} Interview
          </h3>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg mb-4 ${statusConfig.bg}`}>
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.text}
            </span>
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{duration} minutes</span>
            </div>

            {status === 'completed' && score !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-900">{score}/100</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  score >= 80 ? 'bg-green-100 text-green-700' : 
                  score >= 60 ? 'bg-orange-100 text-orange-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {status === 'completed' 
              ? `You've completed this interview with a score of ${score || 0}/100. Review your performance and feedback.`
              : status === 'in-progress'
              ? "Continue where you left off and complete this interview."
              : "Start this interview to practice your skills and get AI-powered feedback."}
          </p>

          {/* Tech Stack */}
          {techstack && techstack.length > 0 && (
            <div className="mb-4">
              <DisplayTechIcons techStack={techstack} />
            </div>
          )}

          {/* Action Button */}
          <Link 
            href={status === 'completed' ? `/ai_interview/recordings/${id}` : `/ai_interview/interview/${id}`} 
            className="w-full"
          >
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>
                {status === 'completed' ? 'Review Interview' : 
                 status === 'in-progress' ? 'Continue Interview' : 
                 'Start Interview'}
              </span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default InterviewCard;
