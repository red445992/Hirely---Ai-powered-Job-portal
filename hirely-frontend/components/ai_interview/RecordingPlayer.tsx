"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack,
  Clock,
  MessageSquare,
  TrendingUp,
  Award,
  AlertCircle,
  Download,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TranscriptSegment {
  timestamp: number;
  speaker: 'interviewer' | 'candidate';
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface AIFeedback {
  overall_score: number;
  communication: number;
  technical_knowledge: number;
  problem_solving: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  key_moments: {
    timestamp: number;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
}

interface InterviewRecording {
  id: string;
  role: string;
  date: string;
  duration: number;
  audioUrl: string;
  transcript: TranscriptSegment[];
  feedback: AIFeedback;
}

interface RecordingPlayerProps {
  recording: InterviewRecording;
}

export default function RecordingPlayer({ recording }: RecordingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Update active transcript based on current time
  useEffect(() => {
    const activeIndex = recording.transcript.findIndex(
      (segment, index) => {
        const nextSegment = recording.transcript[index + 1];
        return (
          currentTime >= segment.timestamp &&
          (!nextSegment || currentTime < nextSegment.timestamp)
        );
      }
    );
    if (activeIndex !== -1) {
      setActiveTranscriptIndex(activeIndex);
    }
  }, [currentTime, recording.transcript]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const changePlaybackSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    audioRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      handleSeek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{recording.role} Interview</h1>
            <p className="text-gray-600 mt-1">
              {new Date(recording.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <audio ref={audioRef} src={recording.audioUrl} />
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    handleSeek(percent * duration);
                  }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlayPause}
                    className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </motion.button>
                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={changePlaybackSpeed}
                    className="px-3 py-1 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {playbackSpeed}x
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Transcript */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Transcript</h2>
                </div>
                {showTranscript ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 max-h-96 overflow-y-auto"
                  >
                    {recording.transcript.map((segment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSeek(segment.timestamp)}
                        className={`
                          p-4 rounded-lg cursor-pointer transition-all
                          ${index === activeTranscriptIndex ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}
                          ${segment.speaker === 'interviewer' ? 'ml-0 mr-8' : 'ml-8 mr-0'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            {segment.speaker === 'interviewer' ? '🤖 AI Interviewer' : '👤 You'}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(segment.timestamp)}</span>
                        </div>
                        <p className="text-gray-800">{segment.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* AI Feedback Sidebar */}
        <div className="space-y-6">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`p-6 ${getScoreBgColor(recording.feedback.overall_score)} border-2`}>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-2 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(recording.feedback.overall_score)}`}>
                  {recording.feedback.overall_score}
                </div>
                <p className="text-sm text-gray-600 mt-2">out of 100</p>
              </div>
            </Card>
          </motion.div>

          {/* Skill Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Skill Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Communication', score: recording.feedback.communication },
                  { label: 'Technical Knowledge', score: recording.feedback.technical_knowledge },
                  { label: 'Problem Solving', score: recording.feedback.problem_solving },
                  { label: 'Confidence', score: recording.feedback.confidence },
                ].map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                      <span className={`text-sm font-bold ${getScoreColor(skill.score)}`}>{skill.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          skill.score >= 80 ? 'bg-green-500' : skill.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Detailed Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-bold text-gray-800">Detailed Feedback</h3>
                {showFeedback ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Strengths */}
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                        ✅ Strengths
                      </h4>
                      <ul className="space-y-2">
                        {recording.feedback.strengths.map((strength, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-gray-700 pl-4 border-l-2 border-green-500"
                          >
                            {strength}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                        🎯 Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {recording.feedback.weaknesses.map((weakness, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-gray-700 pl-4 border-l-2 border-orange-500"
                          >
                            {weakness}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                        💡 Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {recording.feedback.recommendations.map((rec, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-gray-700 pl-4 border-l-2 border-blue-500"
                          >
                            {rec}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
