# Applications API Documentation

## Overview
The Applications app handles job application submissions and management for the Hirely platform.

## Models

### Application
Stores job application data submitted by candidates.

**Fields:**
- `job` (ForeignKey): Job being applied for
- `applicant` (ForeignKey): User account (optional, for logged-in users)
- `full_name` (CharField): Applicant's full name
- `email` (EmailField): Contact email
- `phone` (CharField): Phone number (optional)
- `resume` (FileField): Uploaded resume file
- `cover_letter` (TextField): Cover letter text (optional)
- `portfolio_url` (URLField): Portfolio URL (optional)
- `linkedin_url` (URLField): LinkedIn profile URL (optional)
- `expected_salary` (CharField): Salary expectations (optional)
- `availability` (CharField): When candidate can start
- `additional_info` (TextField): Additional notes (optional)
- `status` (CharField): Application status (pending, reviewing, etc.)
- `applied_at` (DateTimeField): Application submission time
- `updated_at` (DateTimeField): Last update time
- `viewed_by_employer` (BooleanField): Has employer viewed this application
- `employer_notes` (TextField): Internal notes for employer

**Status Choices:**
- `pending`: Waiting for review
- `reviewing`: Under review
- `shortlisted`: Candidate shortlisted
- `interviewed`: Interview completed
- `accepted`: Application accepted
- `rejected`: Application rejected
- `withdrawn`: Candidate withdrew

**Availability Choices:**
- `immediately`: Immediately
- `1_week`: 1 Week
- `2_weeks`: 2 Weeks
- `1_month`: 1 Month
- `2_months`: 2 Months
- `3_months`: 3+ Months
- `negotiable`: Negotiable

### ApplicationStatusHistory
Tracks status changes for applications.

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Submit Application
- **POST** `/applications/apply/`
- **Content-Type**: `multipart/form-data` (for file upload)
- **Description**: Submit a new job application

**Request Body:**
```json
{
  "job": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+977-9800000000",
  "resume": "<file>",
  "cover_letter": "I am interested in this position...",
  "portfolio_url": "https://johndoe.dev",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "expected_salary": "Rs80,000 - Rs100,000",
  "availability": "immediately",
  "additional_info": "Additional information..."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "job": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+977-9800000000",
  "resume": "/media/applications/resumes/resume_123.pdf",
  "cover_letter": "I am interested in this position...",
  "portfolio_url": "https://johndoe.dev",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "expected_salary": "Rs80,000 - Rs100,000",
  "availability": "immediately",
  "additional_info": "Additional information..."
}
```

### Authenticated Endpoints (Require Authorization Token)

#### List Applications (Employers Only)
- **GET** `/applications/`
- **Description**: List applications for jobs created by the authenticated user

**Query Parameters:**
- `job`: Filter by job ID
- `status`: Filter by application status
- `search`: Search by name, email, or job title

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/applications/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "job": 1,
      "job_title": "Software Engineer",
      "job_company": "Tech Corp",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+977-9800000000",
      "resume_filename": "resume_123.pdf",
      "expected_salary": "Rs80,000 - Rs100,000",
      "availability": "immediately",
      "status": "pending",
      "applied_at": "2025-11-02T10:30:00Z",
      "time_since_applied": "2 hours ago",
      "viewed_by_employer": false,
      "is_recent": true
    }
  ]
}
```

#### Get Application Details
- **GET** `/applications/{id}/`
- **Description**: Get detailed information about a specific application

**Response (200 OK):**
```json
{
  "id": 1,
  "job": 1,
  "job_title": "Software Engineer",
  "job_company": "Tech Corp",
  "job_location": "Kathmandu",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+977-9800000000",
  "resume": "/media/applications/resumes/resume_123.pdf",
  "resume_filename": "resume_123.pdf",
  "cover_letter": "I am interested in this position...",
  "portfolio_url": "https://johndoe.dev",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "expected_salary": "Rs80,000 - Rs100,000",
  "availability": "immediately",
  "additional_info": "Additional information...",
  "status": "pending",
  "applied_at": "2025-11-02T10:30:00Z",
  "updated_at": "2025-11-02T10:30:00Z",
  "viewed_by_employer": true,
  "employer_notes": "",
  "status_history": [
    {
      "old_status": "pending",
      "new_status": "reviewing",
      "changed_at": "2025-11-02T11:00:00Z",
      "notes": "Initial review"
    }
  ],
  "is_recent": true
}
```

#### Update Application Status
- **PATCH** `/applications/{id}/`
- **Description**: Update application status and add notes

**Request Body:**
```json
{
  "status": "shortlisted",
  "employer_notes": "Good candidate, proceed to interview",
  "notes": "Moved to shortlist after initial review"
}
```

#### Get Applications for Specific Job
- **GET** `/applications/job/{job_id}/`
- **Description**: List all applications for a specific job

#### Get User's Applications
- **GET** `/applications/my-applications/`
- **Description**: List applications submitted by the authenticated user

#### Get Application Statistics
- **GET** `/applications/stats/`
- **Description**: Get application statistics for the authenticated user

**Response (200 OK):**
```json
{
  "total_applications": 45,
  "pending_applications": 12,
  "shortlisted_applications": 8,
  "accepted_applications": 3,
  "rejected_applications": 20,
  "recent_applications": 5
}
```

#### Bulk Update Applications
- **POST** `/applications/bulk-update/`
- **Description**: Update multiple applications at once

**Request Body:**
```json
{
  "application_ids": [1, 2, 3],
  "status": "rejected",
  "notes": "Position filled"
}
```

#### Delete Application
- **DELETE** `/applications/{id}/delete/`
- **Description**: Delete an application (admin or job owner only)

## File Upload

Resume files are uploaded to `media/applications/resumes/` directory. Supported formats:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Text files (.txt)
- Maximum file size: 5MB

## Permissions

- **Public**: Can submit applications
- **Authenticated Users**: Can view their own applications
- **Employers**: Can view/manage applications for their jobs
- **Admins**: Can view/manage all applications

## Error Handling

Common error responses:

**400 Bad Request:**
```json
{
  "email": ["You have already applied for this job with this email address"],
  "resume": ["Resume file size must be less than 5MB"]
}
```

**403 Forbidden:**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

**404 Not Found:**
```json
{
  "detail": "Not found."
}
```

## Usage Examples

### Frontend Integration

The application form should submit to `/applications/apply/` endpoint:

```javascript
const submitApplication = async (formData) => {
  const form = new FormData();
  form.append('job', jobId);
  form.append('full_name', formData.fullName);
  form.append('email', formData.email);
  form.append('phone', formData.phone);
  form.append('resume', formData.resume);
  form.append('cover_letter', formData.coverLetter);
  form.append('portfolio_url', formData.portfolioUrl);
  form.append('linkedin_url', formData.linkedinUrl);
  form.append('expected_salary', formData.expectedSalary);
  form.append('availability', formData.availability);
  form.append('additional_info', formData.additionalInfo);

  const response = await fetch('/applications/apply/', {
    method: 'POST',
    body: form
  });

  return response.json();
};
```