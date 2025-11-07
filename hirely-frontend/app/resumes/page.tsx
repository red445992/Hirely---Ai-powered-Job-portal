'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  fetchUserResumes, 
  fetchResumeStats, 
  uploadResume, 
  updateResume, 
  deleteResume, 
  setDefaultResume, 
  downloadResume 
} from '@/lib/resume-api';
import { 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  FileText, 
  Calendar,
  Target,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Resume {
  id: number;
  title: string;
  file_name: string;
  file_path: string;
  is_default: boolean;
  uploaded_at: string;
  updated_at: string;
  download_count: number;
  view_count: number;
  last_used: string | null;
  file_size?: number;
  metadata?: {
    pages?: number;
    file_type?: string;
  };
}

interface ResumeStats {
  total_resumes: number;
  default_resume_id: number | null;
  total_downloads: number;
  total_views: number;
  most_downloaded_resume: Resume | null;
  recent_uploads: Resume[];
}

export default function ResumesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [stats, setStats] = useState<ResumeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');

  // Load resumes and stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [resumesData, statsData] = await Promise.all([
        fetchUserResumes(),
        fetchResumeStats()
      ]);
      
      // Ensure resumesData is an array
      const resumesArray = Array.isArray(resumesData) ? resumesData : 
                          (resumesData?.results || resumesData?.data || []);
      
      console.log("Resume data received:", resumesArray);
      setResumes(resumesArray);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setResumes([]); // Fallback to empty array
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadData();
    }
  }, [mounted, isAuthenticated]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('📁 File selected:', file);
    
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      console.log('📄 File type:', file.type);
      console.log('📎 File extension:', fileExtension);
      console.log('📏 File size:', file.size, 'bytes');
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        toast.error('Please select a valid file (PDF, DOC, or DOCX)');
        event.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        event.target.value = ''; // Reset file input
        return;
      }
      
      setSelectedFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      console.log('✅ File accepted:', file.name);
    } else {
      console.log('❌ No file selected');
      setSelectedFile(null);
      setUploadTitle('');
    }
  };

  // Handle resume upload
  const handleUpload = async () => {
    console.log('🚀 Starting upload...');
    console.log('📄 Selected file:', selectedFile);
    console.log('📝 Upload title:', uploadTitle);
    
    if (!selectedFile || !uploadTitle.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Creating FormData...');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle.trim());
      
      // Log FormData contents
      console.log('📋 FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, value.name, value.size, 'bytes');
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      console.log('📡 Calling uploadResume API...');
      const result = await uploadResume(formData);
      console.log('✅ Upload successful:', result);
      
      // Reset form
      setSelectedFile(null);
      setUploadTitle('');
      const fileInput = document.getElementById('resume-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
        console.log('🔄 File input reset');
      }
      
      // Reload data
      console.log('🔄 Reloading data...');
      await loadData();
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast.error('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  // Handle resume update
  const handleUpdate = async () => {
    if (!editingResume || !newTitle.trim()) return;

    try {
      await updateResume(editingResume.id, { title: newTitle.trim() });
      setEditingResume(null);
      setNewTitle('');
      await loadData();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // Handle resume deletion
  const handleDelete = async (resumeId: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResume(resumeId);
      await loadData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Handle set default
  const handleSetDefault = async (resumeId: number) => {
    try {
      await setDefaultResume(resumeId);
      await loadData();
    } catch (error) {
      console.error('Set default error:', error);
    }
  };

  // Handle download
  const handleDownload = async (resume: Resume) => {
    try {
      await downloadResume(resume.id, resume.file_name);
      await loadData(); // Refresh to update download count
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to manage your resumes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Resume Management</h1>
          <p className="text-muted-foreground">Manage and organize your resumes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => router.push('/resumes/ATS')}
            className="gap-2"
          >
            <Target className="h-4 w-4" />
            Resume Scorer
          </Button>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_resumes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_downloads}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_views}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Default Resume</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {stats.default_resume_id ? 'Set' : 'None'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Resume
          </CardTitle>
          <CardDescription>
            Upload a new resume file (PDF, DOC, DOCX supported)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resume-file">Select File</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">
                      ✓ {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadTitle('');
                        const fileInput = document.getElementById('resume-file') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      disabled={uploading}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                type="text"
                placeholder="e.g., Software Developer Resume"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                disabled={uploading}
              />
            </div>
          </div>
          
          {/* Upload Status */}
          {selectedFile && uploadTitle.trim() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-700 text-sm">
                Ready to upload: <strong>{uploadTitle}</strong>
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !uploadTitle.trim() || uploading}
            className="w-full md:w-auto"
          >
            {uploading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resumes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
          <CardDescription>
            Manage your uploaded resumes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No resumes uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload your first resume above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div key={resume.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{resume.title}</h3>
                        {resume.is_default && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{resume.file_name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Uploaded {formatDate(resume.uploaded_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {resume.download_count} downloads
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {resume.view_count} views
                        </span>
                        {resume.file_size && (
                          <span>{formatFileSize(resume.file_size)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!resume.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(resume.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingResume(resume);
                          setNewTitle(resume.title);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(resume)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Resume</CardTitle>
              <CardDescription>Update resume title</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Resume Title</Label>
                <Input
                  id="edit-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter new title"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdate} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingResume(null);
                    setNewTitle('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}