import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { getInterviewCover } from "@/lib/utils";
// Define types for the component props
interface InterviewCardProps {
  id: string;
  userId?: string;
  role: string;
  type: string;
  techstack?: string[];
  createdAt?: string | Date;
}

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack = [],
  createdAt,
}: InterviewCardProps) => {
  // Simplified feedback state (no functionality for now)
  const feedback = null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  // Badge color mapping using standard Tailwind classes
  const badgeColor = {
    Behavioral: "bg-blue-100 text-blue-800",
    Mixed: "bg-purple-100 text-purple-800",
    Technical: "bg-green-100 text-green-800",
  }[normalizedType] || "bg-gray-100 text-gray-800";

  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  // Simple random cover image function
  

  return (
    <div className="w-[360px] max-sm:w-full min-h-96 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 h-full flex flex-col justify-between relative overflow-hidden bg-linear-to-b from-gray-50 to-white rounded-2xl">
        <div>
          {/* Type Badge */}
          <div className={`absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg ${badgeColor}`}>
            <p className="text-sm font-medium">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getInterviewCover(id)}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-cover w-[90px] h-[90px]"
          />

          {/* Interview Role */}
          <h3 className="mt-5 text-xl font-semibold capitalize text-gray-900">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p className="text-sm text-gray-600">
                {/* {feedback?.totalScore || "---"}/100 */}
              </p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5 text-gray-700 text-sm">
            {/* {feedback?.finalAssessment || */}
              "You haven't taken this interview yet. Take it now to improve your skills."
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-row justify-between items-center mt-6">
          {/* Tech Stack Icons (simplified for now) */}
          <div className="flex flex-row gap-2">
            {techstack.slice(0, 3).map((tech, index) => (
              <div
                key={index}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <span className="text-xs font-medium text-gray-600">
                  {tech.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {techstack.length > 3 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{techstack.length - 3}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link
              href={
                feedback
                  ? `/interview/${id}/feedback`
                  : `/interview/${id}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
