"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Award,
  AlertCircle,
  Loader2,
  Play,
  ArrowRight
} from 'lucide-react';
import { 
  generateQuiz, 
  submitQuizAnswers, 
  getQuizCategories,
  getRateLimitStatus 
} from '@/lib/api/quiz';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizState {
  questionSetId: string | null;
  questions: Question[];
  currentIndex: number;
  selectedAnswers: string[];
  startTime: number;
  isSubmitted: boolean;
  result: any | null;
}

export default function SecureQuizComponent() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Mixed');
  const [rateLimits, setRateLimits] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<QuizState>({
    questionSetId: null,
    questions: [],
    currentIndex: 0,
    selectedAnswers: [],
    startTime: 0,
    isSubmitted: false,
    result: null,
  });

  // Load categories and rate limits on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [cats, limits] = await Promise.all([
        getQuizCategories(),
        getRateLimitStatus(),
      ]);
      setCategories(cats);
      setRateLimits(limits);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load quiz data',{
        style: { color: 'white', backgroundColor: 'red'}
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category',{
        style: { color: 'white', backgroundColor: 'red'}
      });
      return;
    }

    try {
      setIsGenerating(true);
      const questionSet = await generateQuiz(selectedCategory, selectedDifficulty);
      
      setQuiz({
        questionSetId: questionSet.id,
        questions: questionSet.questions,
        currentIndex: 0,
        selectedAnswers: new Array(questionSet.questions.length).fill(''),
        startTime: Date.now(),
        isSubmitted: false,
        result: null,
      });

      toast.success('Quiz generated successfully!',{
        style: { color: 'white', backgroundColor: 'green'}
      });
      
      // Refresh rate limits
      const limits = await getRateLimitStatus();
      setRateLimits(limits);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate quiz',{
        style: { color: 'white', backgroundColor: 'red'}
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...quiz.selectedAnswers];
    newAnswers[quiz.currentIndex] = answer;
    setQuiz({ ...quiz, selectedAnswers: newAnswers });
  };

  const handleNext = () => {
    if (quiz.currentIndex < quiz.questions.length - 1) {
      setQuiz({ ...quiz, currentIndex: quiz.currentIndex + 1 });
    }
  };

  const handlePrevious = () => {
    if (quiz.currentIndex > 0) {
      setQuiz({ ...quiz, currentIndex: quiz.currentIndex - 1 });
    }
  };

  const handleSubmit = async () => {
    // Check if all questions answered
    const unanswered = quiz.selectedAnswers.filter(a => !a).length;
    if (unanswered > 0) {
      toast.error(`Please answer all questions (${unanswered} remaining)`,{
        style: { color: 'white', backgroundColor: 'red'}
      });
      return;
    }

    try {
      setIsGenerating(true);
      const timeTaken = Math.floor((Date.now() - quiz.startTime) / 1000);
      
      const result = await submitQuizAnswers(
        quiz.questionSetId!,
        quiz.selectedAnswers,
        timeTaken
      );

      setQuiz({ ...quiz, isSubmitted: true, result });
      toast.success(`Quiz completed! You scored ${result.score}%`,{
        style: { color: 'white', backgroundColor: 'green'}
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit quiz',{
        style: { color: 'white', backgroundColor: 'red'}
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetakeQuiz = () => {
    setQuiz({
      questionSetId: null,
      questions: [],
      currentIndex: 0,
      selectedAnswers: [],
      startTime: 0,
      isSubmitted: false,
      result: null,
    });
    setSelectedCategory('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Quiz not started - Show category selection
  if (!quiz.questionSetId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI-Powered Quiz Assessment</h2>
              <p className="text-gray-600">Test your knowledge with AI-generated questions</p>
            </div>
          </div>

          {/* Rate Limit Status */}
          {rateLimits && (
            <div className="bg-white rounded-lg p-4 mb-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Daily Quota</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {rateLimits.quiz_generation.remaining_daily} / {rateLimits.quiz_generation.limit_daily} remaining
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hourly Quota</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {rateLimits.quiz_generation.remaining_hourly} / {rateLimits.quiz_generation.limit_hourly} remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={!selectedCategory || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed - Show results
  if (quiz.isSubmitted && quiz.result) {
    const result = quiz.result;
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Score Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <Award className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {result.score}%
            </h2>
            <p className="text-lg text-gray-600">
              {result.correct_answers} / {result.total_questions} Correct
            </p>
            <p className={`text-sm font-medium mt-2 ${
              result.passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {result.passed ? '✓ Passed' : '✗ Failed - 70% required to pass'}
            </p>
          </div>

          {/* Improvement Tip */}
          {result.improvement_tip && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Improvement Tip</h4>
                  <p className="text-blue-800 text-sm">{result.improvement_tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
            {result.detailed_results.map((item: any, index: number) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  item.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {item.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className={item.is_correct ? 'text-green-700' : 'text-red-700'}>
                        <span className="font-medium">Your answer:</span> {item.user_answer}
                      </p>
                      {!item.is_correct && (
                        <p className="text-green-700">
                          <span className="font-medium">Correct answer:</span> {item.correct_answer}
                        </p>
                      )}
                      <p className="text-gray-600 italic mt-2">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = quiz.questions[quiz.currentIndex];
  const progress = ((quiz.currentIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = quiz.selectedAnswers.filter(a => a).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {quiz.currentIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {answeredCount} / {quiz.questions.length} Answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  quiz.selectedAnswers[quiz.currentIndex] === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      quiz.selectedAnswers[quiz.currentIndex] === option
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {quiz.selectedAnswers[quiz.currentIndex] === option && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={quiz.currentIndex === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {quiz.currentIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quiz
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
