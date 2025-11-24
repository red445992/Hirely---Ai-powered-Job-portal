"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { getAssessments, type Assessment } from "@/lib/api/quiz";

interface CategoryStats {
  category: string;
  totalQuizzes: number;
  avgScore: number;
  bestScore: number;
  passRate: number;
}

export default function ProgressDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadAssessments();
  }, [selectedCategory]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssessments(
        selectedCategory === "all" ? undefined : selectedCategory
      );
      setAssessments(data.assessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (): {
    totalQuizzes: number;
    avgScore: number;
    totalQuestions: number;
    passRate: number;
  } => {
    if (assessments.length === 0) {
      return { totalQuizzes: 0, avgScore: 0, totalQuestions: 0, passRate: 0 };
    }

    const totalQuizzes = assessments.length;
    const totalScore = assessments.reduce((sum, a) => sum + a.score, 0);
    const totalQuestions = assessments.reduce(
      (sum, a) => sum + a.total_questions,
      0
    );
    const passedQuizzes = assessments.filter((a) => a.passed).length;

    return {
      totalQuizzes,
      avgScore: totalScore / totalQuizzes,
      totalQuestions,
      passRate: (passedQuizzes / totalQuizzes) * 100,
    };
  };

  const getCategoryStats = (): CategoryStats[] => {
    const categoryMap = new Map<string, Assessment[]>();

    assessments.forEach((assessment) => {
      const category = assessment.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(assessment);
    });

    return Array.from(categoryMap.entries()).map(([category, assessments]) => {
      const totalQuizzes = assessments.length;
      const avgScore =
        assessments.reduce((sum, a) => sum + a.score, 0) / totalQuizzes;
      const bestScore = Math.max(...assessments.map((a) => a.score));
      const passedCount = assessments.filter((a) => a.passed).length;

      return {
        category,
        totalQuizzes,
        avgScore,
        bestScore,
        passRate: (passedCount / totalQuizzes) * 100,
      };
    });
  };

  const getRecentAssessments = () => {
    return [...assessments]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  };

  const stats = calculateStats();
  const categoryStats = getCategoryStats();
  const recentAssessments = getRecentAssessments();

  const categories = [
    "all",
    ...new Set(assessments.map((a) => a.category)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-600">⚠️ {error}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
               Progress Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your quiz performance and skill development
            </p>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white shadow-lg">
            <div className="text-sm text-gray-600 mb-2">Total Quizzes</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalQuizzes}
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="text-sm text-gray-600 mb-2">Average Score</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.avgScore.toFixed(1)}%
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="text-sm text-gray-600 mb-2">Questions Answered</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalQuestions}
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="text-sm text-gray-600 mb-2">Pass Rate</div>
            <div className="text-3xl font-bold text-orange-600">
              {stats.passRate.toFixed(0)}%
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Category Performance
            </h2>
            {categoryStats.length === 0 ? (
              <p className="text-gray-500">No quiz data available yet</p>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((cat) => (
                  <div key={cat.category} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">
                        {cat.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {cat.totalQuizzes} quizzes
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Avg:</span>{" "}
                        <span className="font-semibold text-blue-600">
                          {cat.avgScore.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Best:</span>{" "}
                        <span className="font-semibold text-green-600">
                          {cat.bestScore.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Pass:</span>{" "}
                        <span className="font-semibold text-purple-600">
                          {cat.passRate.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${cat.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Quizzes */}
          <Card className="p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Quizzes
            </h2>
            {recentAssessments.length === 0 ? (
              <p className="text-gray-500">No recent quizzes</p>
            ) : (
              <div className="space-y-3">
                {recentAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {assessment.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(assessment.created_at).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(assessment.created_at).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {assessment.correct_answers}/{assessment.total_questions}{" "}
                        correct • {assessment.difficulty}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          assessment.passed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {assessment.score.toFixed(0)}%
                      </div>
                      <div className="text-xs">
                        {assessment.passed ? "✅ Passed" : "❌ Failed"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Performance Trend Chart (Simple text-based for now) */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Performance Trend
          </h2>
          {assessments.length === 0 ? (
            <p className="text-gray-500">
              Complete more quizzes to see your progress trend
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                {[...assessments]
                  .reverse()
                  .slice(-10)
                  .map((assessment, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-24 rounded-t-lg ${
                          assessment.passed ? "bg-green-500" : "bg-red-500"
                        } relative`}
                        style={{
                          height: `${Math.max(assessment.score, 10)}px`,
                        }}
                        title={`${assessment.score.toFixed(1)}% - ${
                          assessment.category
                        }`}
                      ></div>
                      <div className="text-xs text-gray-500 mt-1">
                        Quiz {idx + 1}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="text-sm text-gray-600 mt-4">
                💡 <strong>Tip:</strong> Your recent scores show{" "}
                {stats.avgScore >= 70
                  ? "great progress! Keep it up! 🎉"
                  : "room for improvement. Keep practicing! 💪"}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
