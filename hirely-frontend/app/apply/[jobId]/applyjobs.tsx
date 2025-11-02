"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { submitApplication } from "@/lib/api";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Link, 
  DollarSign, 
  Calendar,
  Briefcase,
  Building,
  MapPin,
  Award,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";

interface ApplyJobsProps {
  jobData: {
    id: number;
    title: string;
    company: string;
    location: string;
    level: string;
    salary: string;
  };
  onClose?: () => void;
  isModal?: boolean;
}

export default function ApplyJobs({ jobData, onClose, isModal = false }: ApplyJobsProps) {
  const params = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null as File | null,
    coverLetter: "",
    portfolioUrl: "",
    linkedinUrl: "",
    expectedSalary: "",
    availability: "immediately",
    additionalInfo: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    // Basic debug info on component mount
    console.log("Apply page loaded for job:", jobData.id);
  }, [jobData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, resume: file }));
    setResumeName(file?.name || "");
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({ ...prev, resume: null }));
    setResumeName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
    if (!formData.fullName || !formData.email || !formData.resume) {
      toast.error("Please fill in all required fields (Full Name, Email, Resume)", {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting application for job:", jobData.id);
      const result = await submitApplication(jobData.id, formData);
      
      toast.success(`Application submitted successfully! ID: ${result.id}`, {
        style: { background: "linear-gradient(90deg, #4caf50, #388e3c)" },
      });

      // Optional: Reset form or redirect
      // setFormData({ ... }); // Reset form
      // window.location.href = '/jobs'; // Redirect to jobs page
      
    } catch (error) {
      console.error("Application submission failed:", error);
      
      // Show user-friendly error message
      let errorMessage = "Failed to submit application. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('already applied')) {
          errorMessage = "You have already applied for this job with this email address.";
        } else if (error.message.includes('file size')) {
          errorMessage = "Resume file is too large. Please use a file smaller than 5MB.";
        } else if (error.message.includes('Network error')) {
          errorMessage = "Connection error. Please check your internet connection and try again.";
        }
      }
      toast.error(errorMessage, {
        style: { background: "linear-gradient(90deg, #ef4444, #b91c1c)" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white ${isModal ? 'rounded-lg' : 'min-h-screen'} relative`}>
      {/* Header */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className={`${isModal ? 'p-6' : 'p-8'} space-y-8`}>
        {/* Job Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-neutral-900">
                Apply for {jobData.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{jobData.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{jobData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{jobData.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  
                  <span>Rs.{jobData.salary}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  <Mail className="inline-block w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="max-w-md">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                <Phone className="inline-block w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+977-9800000000"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Resume & Documents
            </h2>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <FileText className="inline-block w-4 h-4 mr-2" />
                Resume / CV *
              </label>
              
              {!resumeName ? (
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <div className="text-sm text-neutral-600">
                      <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      PDF, DOC, DOCX, TXT (Max 5MB)
                    </div>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-neutral-900">{resumeName}</div>
                      <div className="text-xs text-neutral-500">Ready to submit</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-700 mb-2">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell us why you're interested in this position and what makes you a great candidate..."
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
              Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Portfolio URL */}
              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  <Link className="inline-block w-4 h-4 mr-2" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label htmlFor="linkedinUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  <Briefcase className="inline-block w-4 h-4 mr-2" />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expected Salary */}
              <div>
                <label htmlFor="expectedSalary" className="block text-sm font-medium text-neutral-700 mb-2">
                  <DollarSign className="inline-block w-4 h-4 mr-2" />
                  Expected Salary
                </label>
                <input
                  type="text"
                  id="expectedSalary"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g., Rs80,000 - Rs100,000"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-neutral-700 mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-2" />
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="immediately">Immediately</option>
                  <option value="1_week">1 Week</option>
                  <option value="2_weeks">2 Weeks</option>
                  <option value="1_month">1 Month</option>
                  <option value="2_months">2 Months</option>
                  <option value="3_months">3+ Months</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like to share with the employer..."
                rows={3}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting || !formData.fullName || !formData.email || !formData.resume}
              onClick={() => {
                console.log("🖱️ Submit button clicked");
                console.log("✅ Form validation status:", {
                  hasName: !!formData.fullName,
                  hasEmail: !!formData.email,
                  hasResume: !!formData.resume,
                  isSubmitting
                });
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:mask-b-to-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </button>
            
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-medium rounded-md transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500">
            * Required fields. By submitting this application, you agree to our Privacy Policy and Terms of Service.
          </p>
        </form>
      </div>
    </div>
  );
}