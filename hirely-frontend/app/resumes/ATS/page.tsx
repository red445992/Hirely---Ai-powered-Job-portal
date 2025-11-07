'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { analyzeResumeFromFile, type ATSAnalysisResult } from '@/actions/ats-scorer';

export default function ATSPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        event.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        event.target.value = '';
        return;
      }
      
      setResumeFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Handle resume analysis
  const handleAnalyze = async () => {
    // Validation
    if (!jobDescription.trim()) {
      toast.warning('Please provide a job description.');
      return;
    }

    if (!resumeFile) {
      toast.warning('Please upload a resume in PDF format.');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // Call the actual analysis function
      const analysisResult = await analyzeResumeFromFile(resumeFile, jobDescription);
      
      setResult(analysisResult);
      toast.success('✨ Analysis Complete!');
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Show specific error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred during analysis. Please try again.';
      
      toast.error(errorMessage);
      
      // If it's a PDF extraction error, provide helpful guidance
      if (errorMessage.includes('extract')) {
        toast.info('Tip: Make sure your PDF contains selectable text, not just images.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Extract percentage value
  const getMatchPercentage = () => {
    if (!result) return 0;
    const match = result['JD Match'].match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/resumes')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resumes
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart ATS Resume Analyzer
              </h1>
              <p className="text-muted-foreground">
                Optimize Your Resume for Applicant Tracking Systems
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - About Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  About Smart ATS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This smart ATS helps you:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Evaluate resume-job description match</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Identify missing keywords</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Get personalized improvement suggestions</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">How it works</h4>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">1.</span>
                      Paste the job description
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">2.</span>
                      Upload your resume (PDF)
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">3.</span>
                      Click "Analyze Resume"
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">4.</span>
                      Review results & improve
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Analysis
                </CardTitle>
                <CardDescription>
                  Enter the job description and upload your resume for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="job-description">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] resize-y"
                    disabled={analyzing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the complete job description for accurate analysis
                  </p>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume-file">
                    Resume (PDF) <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="resume-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      disabled={analyzing}
                      className="cursor-pointer"
                    />
                    {resumeFile && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {resumeFile.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload your resume in PDF format (max 10MB)
                  </p>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !jobDescription.trim() || !resumeFile}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing your resume...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-5 w-5" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Match Score */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="h-5 w-5" />
                      Match Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-green-700">
                        {result['JD Match']}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${getMatchPercentage() >= 80 ? 'bg-green-100 text-green-700 border-green-300' : ''}
                          ${getMatchPercentage() >= 60 && getMatchPercentage() < 80 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : ''}
                          ${getMatchPercentage() < 60 ? 'bg-red-100 text-red-700 border-red-300' : ''}
                        `}
                      >
                        {getMatchPercentage() >= 80 ? 'Excellent' : 
                         getMatchPercentage() >= 60 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                    <Progress value={getMatchPercentage()} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Your resume matches {getMatchPercentage()}% of the job requirements
                    </p>
                  </CardContent>
                </Card>

                {/* Missing Keywords */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="h-5 w-5" />
                      Missing Keywords
                    </CardTitle>
                    <CardDescription>
                      Add these keywords to improve your match score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.MissingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.MissingKeywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="bg-white border-orange-300 text-orange-700"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        No critical missing keywords found!
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Summary */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <FileText className="h-5 w-5" />
                      Profile Summary
                    </CardTitle>
                    <CardDescription>
                      AI-powered analysis of your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {result['Profile Summary']}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}