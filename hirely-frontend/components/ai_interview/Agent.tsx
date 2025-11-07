"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Sparkles,
  Volume2,
  User,
  MessageSquare,
  Clock
} from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName?: string;
  userId?: string | number;
  interviewId?: string;
  feedbackId?: string;
  type?: "generate" | "practice";
  questions?: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [callDuration, setCallDuration] = useState(0);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const onCallStart = () => {
      console.log("✅ Call started - setting status to ACTIVE");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("🔴 Call ended - setting status to FINISHED");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      console.log("💬 Message received:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("🎤 Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("🔇 Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("❌ VAPI Error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    console.log("🎯 Starting VAPI call, type:", type);
    
    try {
      if (type === "generate") {
        // For generate type, use assistant with questions from backend
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question, index) => `${index + 1}. ${question}`)
            .join("\n");
        } else {
          console.warn("⚠️ No questions provided, using default flow");
          formattedQuestions = "1. Tell me about yourself\n2. What are your strengths?\n3. Why do you want to work here?";
        }
        
        console.log("📞 Starting with assistant config");
        console.log("👤 Username:", userName, "User ID:", userId);
        console.log("❓ Questions:", formattedQuestions);

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      } else {
        // For practice type, use provided questions
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question, index) => `${index + 1}. ${question}`)
            .join("\n");
        }
        
        console.log("📞 Starting with interviewer config (practice mode)");
        console.log("❓ Questions:", formattedQuestions);

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
      console.log("✅ VAPI start called successfully");
    } catch (error) {
      console.error("❌ Error starting VAPI call:", error);
      console.error("Error object:", JSON.stringify(error, null, 2));
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Status Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Interview Session</h1>
              <p className="text-purple-300 text-sm">
                {type === "practice" ? "Practice Mode" : "Live Interview"}
              </p>
            </div>
          </div>

          {/* Call Status Badge */}
          {callStatus === CallStatus.ACTIVE && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Live</span>
              </div>
              <div className="flex items-center gap-1 text-purple-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Interview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Interviewer Card */}
          <div className="relative group">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity",
              isSpeaking && "animate-pulse"
            )} />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 h-full">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Avatar with Speaking Animation */}
                <div className="relative">
                  <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300",
                    isSpeaking ? "bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl animate-pulse scale-150" : "bg-transparent"
                  )} />
                  <div className={cn(
                    "relative w-40 h-40 rounded-full p-1 transition-all duration-300",
                    isSpeaking ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-white/20"
                  )}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/ai-avatar.png"
                        alt="AI Interviewer"
                        width={140}
                        height={140}
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  {isSpeaking && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">AI Interviewer</h3>
                  <p className="text-purple-300 text-sm">Powered by Advanced AI</p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  {isSpeaking ? (
                    <>
                      <Volume2 className="w-4 h-4 text-green-400 animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">Speaking...</span>
                    </>
                  ) : callStatus === CallStatus.ACTIVE ? (
                    <>
                      <Mic className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">Listening...</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 h-full">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/user-avatar.png"
                        alt={userName || "User"}
                        width={140}
                        height={140}
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{userName || "Candidate"}</h3>
                  <p className="text-blue-300 text-sm">Interview Participant</p>
                </div>

                {/* Interview Stats */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                    <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{messages.length}</p>
                    <p className="text-xs text-purple-300">Messages</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                    <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">{formatDuration(callDuration)}</p>
                    <p className="text-xs text-blue-300">Duration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Transcript */}
        {messages.length > 0 && lastMessage && (
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Live Transcript</h3>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p
                  key={lastMessage}
                  className={cn(
                    "text-white/90 leading-relaxed transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100"
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className={cn(
                "group relative px-12 py-6 rounded-full font-semibold text-lg transition-all duration-300",
                "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                "text-white shadow-2xl hover:shadow-green-500/50 hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "flex items-center gap-3"
              )}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6" />
                  <span>
                    {callStatus === CallStatus.FINISHED ? "Start New Interview" : "Start Interview"}
                  </span>
                </>
              )}
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className={cn(
                "group relative px-12 py-6 rounded-full font-semibold text-lg transition-all duration-300",
                "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
                "text-white shadow-2xl hover:shadow-red-500/50 hover:scale-105",
                "flex items-center gap-3"
              )}
            >
              <PhoneOff className="w-6 h-6" />
              <span>End Interview</span>
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </button>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Agent;