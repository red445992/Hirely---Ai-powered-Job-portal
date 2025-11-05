"use client";

import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Layers, 
  MapPinned, 
  Award, 
  Building, 
  Sparkles, 
  Clock,
  Globe,
  CheckSquare,
  FileText,
  Code
} from "lucide-react";

interface AddJobsProps {
  formData: {
    title: string;
    description: string;
    category: string;
    location: string;
    level: string;
    salary: string;
    salary_amount?: string;
    company: string;
    job_type: string;
    is_remote: boolean;
    responsibilities: string;
    requirements: string;
    skills: string;
  };
  isSubmitting: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddJobs({ formData, isSubmitting, onFormChange, onSubmit }: AddJobsProps) {
  // Use values that match the backend choices (value -> label)
  const categories = [
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "business", label: "Business" },
    { value: "customer_service", label: "Customer Service" },
    { value: "other", label: "Other" },
  ];

  const locations = [
    { value: "kathmandu", label: "Kathmandu" },
    { value: "pokhara", label: "Pokhara" },
    { value: "lalitpur", label: "Lalitpur" },
    { value: "bhaktapur", label: "Bhaktapur" },
    { value: "biratnagar", label: "Biratnagar" },
    { value: "butwal", label: "Butwal" },
    { value: "remote", label: "Remote" },
  ];

  const levels = [
    { value: "intern", label: "Intern" },
    { value: "junior", label: "Junior Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "lead", label: "Lead" },
    { value: "manager", label: "Manager" },
  ];

  const jobTypes = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "remote", label: "Remote" },
  ];

  // Handle checkbox changes separately
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value } = e.target;

    // Create a synthetic event that includes `checked` so the parent handler can read it
    // The parent `handleFormChange` inspects `type === 'checkbox'` and reads
    // `(e.target as HTMLInputElement).checked` — include that property here.
    const syntheticEvent = {
      target: {
        name,
        value, // keep the original value (string) in case parent uses it
        type: "checkbox",
        checked,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onFormChange(syntheticEvent);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Post a New Job</h1>
          <p className="text-neutral-600">Fill in the details to create a job posting</p>
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            <Briefcase className="inline-block w-4 h-4 mr-2" />
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onFormChange}
            placeholder="e.g., Senior Full Stack Developer"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
            <Building className="inline-block w-4 h-4 mr-2" />
            Company Name *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={onFormChange}
            placeholder="e.g., Tech Corp Inc."
            required
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
            <FileText className="inline-block w-4 h-4 mr-2" />
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onFormChange}
            placeholder="Describe the role, team, and company culture..."
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Four Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Job Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
              <Layers className="inline-block w-4 h-4 mr-2" />
              Job Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onFormChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-2" />
              Job Location *
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={onFormChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-neutral-700 mb-2">
              <Award className="inline-block w-4 h-4 mr-2" />
              Job Level *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={onFormChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select level</option>
              {levels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="job_type" className="block text-sm font-medium text-neutral-700 mb-2">
              <Clock className="inline-block w-4 h-4 mr-2" />
              Job Type *
            </label>
            <select
              id="job_type"
              name="job_type"
              value={formData.job_type}
              onChange={onFormChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">Select type</option>
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Remote Work Checkbox */}
        <div className="flex items-center p-3 border border-neutral-200 rounded-md bg-neutral-50">
          <input
            type="checkbox"
            id="is_remote"
            name="is_remote"
            checked={formData.is_remote}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_remote" className="ml-3 text-sm font-medium text-neutral-700 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            This is a remote position
          </label>
        </div>

        {/* Salary Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salary Display */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-neutral-700 mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Salary Display *
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={onFormChange}
              placeholder="e.g., Rs. 80,000 - Rs. 100,000"
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-neutral-500 mt-1">How the salary will be displayed to candidates</p>
          </div>

          {/* Numeric Salary (Optional) */}
          <div>
            <label htmlFor="salary_amount" className="block text-sm font-medium text-neutral-700 mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Numeric Salary (Optional)
            </label>
            <input
              type="number"
              id="salary_amount"
              name="salary_amount"
              value={formData.salary_amount}
              onChange={onFormChange}
              placeholder="e.g., 500000"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-neutral-500 mt-1">For filtering and sorting (annual amount)</p>
          </div>
        </div>

        {/* Key Responsibilities */}
        <div>
          <label htmlFor="responsibilities" className="block text-sm font-medium text-neutral-700 mb-2">
            <CheckSquare className="inline-block w-4 h-4 mr-2" />
            Key Responsibilities
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={onFormChange}
            placeholder="List the main responsibilities and day-to-day tasks...
• Build and maintain web applications
• Collaborate with cross-functional teams
• Write clean, maintainable code"
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-neutral-700 mb-2">
            <FileText className="inline-block w-4 h-4 mr-2" />
            Requirements & Qualifications
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={onFormChange}
            placeholder="List the required qualifications and experience...
• 3+ years of experience in web development
• Bachelor's degree in Computer Science or related field
• Strong problem-solving skills"
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Skills Required */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-neutral-700 mb-2">
            <Code className="inline-block w-4 h-4 mr-2" />
            Skills & Technologies Required
          </label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={onFormChange}
            placeholder="List the required skills, technologies, and tools...
• JavaScript, React, Node.js
• Python, Django, PostgreSQL
• AWS, Docker, CI/CD
• Agile methodologies, Git"
            rows={4}
            className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </button>
          <p className="text-xs text-neutral-500 mt-2">
            * Required fields
          </p>
        </div>
      </div>
    </div>
  );
}