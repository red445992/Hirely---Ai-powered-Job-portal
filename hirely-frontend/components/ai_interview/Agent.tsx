import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const messages =[
    "Welcome to your AI-powered interview! Let's get started.",
    "Can you tell me about a time you faced a challenge at work and how you handled it?",
  ];
  const lastMessage = messages[messages.length - 1] || "";
  return (
    <>
      <div className="flex sm:flex-row flex-col gap-8 items-stretch justify-center w-full max-w-6xl mx-auto">
        {/* AI Interviewer Card */}
        <div className="flex flex-col items-center justify-center gap-6 p-8 h-[450px] bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-2xl border border-blue-400/20 flex-1 sm:basis-1/2 w-full relative overflow-hidden group hover:scale-105 transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 to-transparent" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />

          {/* Avatar container */}
          <div className="relative z-10 flex items-center justify-center bg-linear-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full w-32 h-32 shadow-xl border border-white/20 group-hover:shadow-2xl transition-all duration-300">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={80}
              height={70}
              className="object-cover drop-shadow-lg"
            />
            {isSpeaking && (
              <span className="absolute inset-0 inline-flex animate-ping rounded-full bg-white/30 opacity-75" />
            )}
          </div>

          {/* Title */}
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              AI Interviewer
            </h3>
            <p className="text-blue-100 text-sm font-medium">
              Ready to conduct your interview
            </p>
          </div>

          {/* Status indicator */}
          <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
            <div
              className={`w-2 h-2 rounded-full ${
                isSpeaking ? "bg-green-400 animate-pulse" : "bg-gray-300"
              }`}
            />
            <span className="text-white text-xs font-medium">
              {isSpeaking ? "Speaking" : "Listening"}
            </span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="flex-1 sm:basis-1/2 w-full h-[450px] max-md:hidden group hover:scale-105 transition-all duration-300">
          <div className="relative h-full p-1 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-purple-600 shadow-2xl">
            <div className="flex flex-col items-center justify-center gap-6 p-8 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl h-full relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 to-transparent" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-400/20 rounded-full blur-xl" />

              {/* Avatar container */}
              <div className="relative z-10 flex items-center justify-center bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full w-32 h-32 shadow-xl border border-white/10 group-hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/user-avatar.png"
                  alt="User Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover w-28 h-28 border-2 border-white/20"
                />
              </div>

              {/* User info */}
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {userName}
                </h3>
                <p className="text-gray-300 text-sm font-medium">
                  Interview Candidate
                </p>
              </div>

              {/* User status */}
              <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Transcript Section */}
      {messages.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="relative p-1 rounded-2xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl">
            <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl min-h-16 px-6 py-4 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
              
              {/* Message content */}
              <div className="relative z-10 flex items-center gap-4">
                {/* AI Speaker Icon */}
                <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                
                {/* Message text */}
                <div className="flex-1">
                  <p
                    key={lastMessage}
                    className={cn(
                      "text-white text-sm md:text-base leading-relaxed",
                      "animate-in fade-in duration-500 slide-in-from-left-4"
                    )}
                  >
                    {lastMessage}
                  </p>
                </div>
                
                {/* Typing indicator */}
                {isSpeaking && (
                  <div className="shrink-0 flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Transcript label */}
          <div className="flex items-center justify-center mt-3">
            <span className="text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1 rounded-full">
              Live Transcript
            </span>
          </div>
        </div>
      )}

      {/* <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative inline-block px-7 py-3 font-bold text-sm leading-5 text-white transition-colors duration-150 bg-success-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-success-200 hover:bg-success-200 min-w-28 cursor-pointer items-center justify-center overflow-visible"
            onClick={() => handleCall()}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button
            className="inline-block px-7 py-3 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-destructive-100 border border-transparent rounded-full shadow-sm focus:outline-none focus:shadow-2xl active:bg-destructive-200 hover:bg-destructive-200 min-w-28"
            onClick={() => handleDisconnect()}
          >
            End
          </button>
        )}
      </div> */}
    </>
  );
};

export default Agent;
