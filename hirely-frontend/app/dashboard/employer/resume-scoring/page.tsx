"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star, Trophy, User, Mail, Phone, FileText, Brain, ArrowUpDown, Zap, Target } from "lucide-react";
import { toast } from "sonner";

interface CandidateAnalysis {
  candidate: string;
  candidate_name: string;
  email: string;
  score: number;
  parsed_data: {
    entities: {
      person: string[];
      email: string[];
      phone: string[];
      skills: string[];
      education: string[];
      experience: string[];
      organization: string[];
    };
    method: string;
    status: string;
  };
}

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
}

export default function ResumeScoringDashboard() {
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [customJobDescription, setCustomJobDescription] = useState("");
  const [useCustomJobDesc, setUseCustomJobDesc] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Fetch available jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in to access this feature");
        setJobs([]);
        return;
      }

      const response = await fetch("http://localhost:8000/jobs/addjobs/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle paginated response - extract jobs from results array
        const jobsArray = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        setJobs(jobsArray);
        if (jobsArray.length > 0) {
          setSelectedJobId(jobsArray[0].id.toString());
        } else {
          toast.error("No jobs found. Please create a job first.");
        }
      } else {
        console.error("Failed to fetch jobs:", response.statusText);
        setJobs([]);
        toast.error("Failed to load jobs - please check your authentication");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      toast.error("Network error - please check your connection");
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchCandidateAnalysis = async (jobId: string) => {
    if (!jobId || jobId === "loading" || jobId === "no-jobs") return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/applications/resume-dashboard/${jobId}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.results || []);
        toast.success(`Analyzed ${data.results?.length || 0} candidates`);
        
        // Auto-set the job description from the selected job for custom ranking
        const selectedJob = jobs.find(job => job.id.toString() === jobId);
        if (selectedJob && !customJobDescription) {
          setCustomJobDescription(selectedJob.description);
        }
      } else {
        toast.error("Failed to analyze candidates");
      }
    } catch (error) {
      console.error("Error fetching candidate analysis:", error);
      toast.error("Error analyzing candidates");
    } finally {
      setLoading(false);
    }
  };

  const rankByCustomJobMatch = async () => {
    if (!customJobDescription.trim()) {
      toast.error("Please enter a job description for ranking");
      return;
    }

    setIsRanking(true);
    try {
      // For now, we'll simulate enhanced ranking by adjusting scores based on keyword matching
      // In a real implementation, this would call a backend API for more sophisticated ML ranking
      const keywords = customJobDescription.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      
      const rankedCandidates = candidates.map(candidate => {
        const allSkills = candidate.parsed_data.entities.skills.join(' ').toLowerCase();
        const matchCount = keywords.filter(keyword => allSkills.includes(keyword)).length;
        const matchBoost = matchCount * 0.1; // Boost score by 0.1 for each keyword match
        
        return {
          ...candidate,
          score: Math.min(5.0, candidate.score + matchBoost) // Cap at 5.0
        };
      });

      setCandidates(rankedCandidates);
      toast.success("Candidates re-ranked based on job description match!");
    } catch (error) {
      console.error("Error ranking candidates:", error);
      toast.error("Error ranking candidates");
    } finally {
      setIsRanking(false);
    }
  };

  // Filter and sort candidates
  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.parsed_data.entities.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === "score") {
        return sortOrder === "desc" ? b.score - a.score : a.score - b.score;
      } else {
        const aName = a.candidate_name.toLowerCase();
        const bName = b.candidate_name.toLowerCase();
        return sortOrder === "desc" ? bName.localeCompare(aName) : aName.localeCompare(bName);
      }
    });

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600 bg-green-50";
    if (score >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <Trophy className="h-4 w-4" />;
    if (score >= 3) return <Star className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Resume Analysis</h1>
          <p className="text-muted-foreground">
            Intelligent candidate ranking using machine learning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">ML-Powered</span>
        </div>
      </div>

      {/* Job Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select Job Position
          </CardTitle>
          <CardDescription>
            Choose a job position to analyze candidate resumes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="job-select">Job Position</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={jobsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={jobsLoading ? "Loading jobs..." : "Select a job position"} />
              </SelectTrigger>
              <SelectContent>
                {jobsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading jobs...
                  </SelectItem>
                ) : Array.isArray(jobs) && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-jobs" disabled>
                    No jobs available - please create a job first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={() => fetchCandidateAnalysis(selectedJobId)}
              disabled={!selectedJobId || selectedJobId === "loading" || selectedJobId === "no-jobs" || loading}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              {loading ? "Analyzing..." : "Analyze Candidates"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Job Description Ranking */}
      {candidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Rank by Job Description Match
            </CardTitle>
            <CardDescription>
              Fine-tune candidate ranking with a custom job description for better matching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Enter or modify the job description to re-rank candidates based on specific requirements..."
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={rankByCustomJobMatch}
                disabled={!customJobDescription.trim() || isRanking}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Zap className="h-4 w-4" />
                {isRanking ? "Re-ranking..." : "Rank by Match"}
              </Button>
              <Button 
                onClick={() => setCustomJobDescription("")}
                variant="ghost"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Sort Controls */}
      {candidates.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <Label htmlFor="search">Search Candidates</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [by, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(by);
                  setSortOrder(order);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score-desc">Score (High to Low)</SelectItem>
                    <SelectItem value="score-asc">Score (Low to High)</SelectItem>
                    <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{filteredAndSortedCandidates.length}</p>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredAndSortedCandidates.filter(c => c.score >= 4).length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Match (4.0+)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredAndSortedCandidates.filter(c => c.score >= 3 && c.score < 4).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Good Match (3.0-3.9)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredAndSortedCandidates.length > 0 ? 
                      filteredAndSortedCandidates[0].score.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-sm text-muted-foreground">Top Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Candidate Cards */}
      <div className="grid gap-6">
        {filteredAndSortedCandidates.map((candidate, index) => (
          <Card key={candidate.candidate} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    {getScoreIcon(candidate.score)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{candidate.candidate_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        @{candidate.candidate}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(candidate.score)}`}>
                    {candidate.score.toFixed(2)}/5.0
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI Match Score
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Technical Skills ({candidate.parsed_data.entities.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.parsed_data.entities.skills.slice(0, 12).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.parsed_data.entities.skills.length > 12 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.parsed_data.entities.skills.length - 12} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Education & Contact */}
                <div className="space-y-4">
                  {candidate.parsed_data.entities.education.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Education</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.parsed_data.entities.education.map((edu, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {edu}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Analysis Info</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        Method: {candidate.parsed_data.method}
                      </Badge>
                      <Badge 
                        variant={candidate.parsed_data.status === "success" ? "default" : "destructive"} 
                        className="text-xs"
                      >
                        {candidate.parsed_data.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizations & Experience */}
              {(candidate.parsed_data.entities.organization.length > 0 || 
                candidate.parsed_data.entities.experience.length > 0) && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid md:grid-cols-2 gap-4">
                    {candidate.parsed_data.entities.organization.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Organizations</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.parsed_data.entities.organization.map((org, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {org}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {candidate.parsed_data.entities.experience.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Experience</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.parsed_data.entities.experience.map((exp, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && candidates.length === 0 && selectedJobId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                No applications with resumes found for this job position.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Analyzing Resumes...</h3>
              <p className="text-muted-foreground">
                Our AI is processing candidate resumes and calculating match scores.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}