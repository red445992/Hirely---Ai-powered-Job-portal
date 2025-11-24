"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Play, 
  Clock, 
  Calendar,
  TrendingUp,
  Award,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RecordingSummary {
  id: string;
  role: string;
  type: 'Technical' | 'Behavioral' | 'Mixed';
  date: string;
  duration: number;
  score: number;
  status: 'completed' | 'in-progress';
}

interface RecordingsListProps {
  recordings?: RecordingSummary[];
}

export default function RecordingsList({ recordings = [] }: RecordingsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  // Mock data for demonstration
  const mockRecordings: RecordingSummary[] = recordings.length > 0 ? recordings : [
    {
      id: '1',
      role: 'Senior Frontend Developer',
      type: 'Technical',
      date: '2025-11-20T10:30:00',
      duration: 1800,
      score: 85,
      status: 'completed',
    },
    {
      id: '2',
      role: 'Full Stack Engineer',
      type: 'Mixed',
      date: '2025-11-18T14:00:00',
      duration: 2400,
      score: 78,
      status: 'completed',
    },
    {
      id: '3',
      role: 'React Developer',
      type: 'Technical',
      date: '2025-11-15T09:00:00',
      duration: 1500,
      score: 92,
      status: 'completed',
    },
  ];

  const filteredRecordings = mockRecordings
    .filter((rec) => {
      const matchesSearch = rec.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || rec.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.score - a.score;
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAverageScore = () => {
    if (filteredRecordings.length === 0) return 0;
    const sum = filteredRecordings.reduce((acc, rec) => acc + rec.score, 0);
    return Math.round(sum / filteredRecordings.length);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800">🎤 Interview Recordings</h1>
          <p className="text-gray-600 mt-2">Review your past interviews and track progress</p>
        </div>

        <Link
          href="/ai_interview/interview"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          New Interview
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-blue-600">{filteredRecordings.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-green-600">{calculateAverageScore()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredRecordings.filter(r => 
                    new Date(r.date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="Technical">Technical</option>
          <option value="Behavioral">Behavioral</option>
          <option value="Mixed">Mixed</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
        </select>
      </motion.div>

      {/* Recordings List */}
      <div className="space-y-4">
        {filteredRecordings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Play className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No recordings found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start your first AI interview to see recordings here'}
            </p>
            <Link
              href="/ai_interview/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Interview
            </Link>
          </Card>
        ) : (
          filteredRecordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/ai_interview/recordings/${recording.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {recording.role}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {recording.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(recording.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(recording.duration)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 ${getScoreBgColor(recording.score)} rounded-lg`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(recording.score)}`}>
                            {recording.score}
                          </div>
                          <div className="text-xs text-gray-600">Score</div>
                        </div>
                      </div>

                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
