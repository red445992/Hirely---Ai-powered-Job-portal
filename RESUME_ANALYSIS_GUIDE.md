# AI-Powered Resume Analysis Dashboard

## Overview
This feature provides an intelligent resume analysis system that uses machine learning to score and rank job candidates based on their resume content and job requirements.

## Features

### 🧠 AI-Powered Analysis
- **TF-IDF Vectorization**: Converts resume text into numerical vectors for ML processing
- **Cosine Similarity Scoring**: Calculates match scores between resumes and job descriptions
- **Entity Extraction**: Automatically identifies skills, education, experience, and contact information
- **Fallback Systems**: Graceful degradation with regex-based parsing when ML fails

### 📊 Smart Candidate Ranking
- **Automatic Scoring**: 0-5.0 scale based on job description similarity
- **Custom Job Description Matching**: Re-rank candidates with modified job requirements
- **Multiple Sort Options**: Sort by score, name, or custom criteria
- **Real-time Search**: Filter candidates by name, email, or skills

### 🎯 Advanced UI Features
- **Clean Card Layout**: Easy-to-scan candidate information
- **Color-coded Scores**: Visual indicators for high/medium/low matches
- **Skill Tags**: Organized display of technical skills and education
- **Analysis Method Indicators**: Shows whether ML or fallback parsing was used

## Usage Guide

### 1. Access the Dashboard
Navigate to: `/dashboard/employer/resume-scoring`

### 2. Select Job Position
- Choose from available job positions in the dropdown
- Click "Analyze Candidates" to process resumes

### 3. Review Results
- View candidates ranked by AI match score
- See extracted skills, education, and contact information
- Check analysis method and status for each candidate

### 4. Custom Ranking (Advanced)
- Modify or enter a custom job description
- Click "Rank by Match" to re-score candidates
- Compare results with different job requirements

### 5. Search and Filter
- Use search bar to find specific candidates
- Filter by name, email, or technical skills
- Sort by score or alphabetically

## API Endpoints

### Resume Dashboard API
```
GET /applications/resume-dashboard/{job_id}/
Authorization: Bearer {jwt_token}
```

**Response Format:**
```json
{
  "results": [
    {
      "candidate": "username",
      "candidate_name": "Full Name",
      "email": "email@example.com", 
      "score": 4.22,
      "parsed_data": {
        "entities": {
          "skills": ["Python", "JavaScript", "React"],
          "education": ["Bachelor", "University"],
          "email": ["email@example.com"],
          "phone": [""],
          "experience": [],
          "organization": []
        },
        "method": "fallback_regex",
        "status": "success"
      }
    }
  ]
}
```

## Technical Implementation

### Backend Components
- **Resume Scorer** (`jobs/utils/resume_scorer.py`): Core ML analysis engine
- **Resume Parser** (`jobs/utils/resume_parser.py`): Text extraction and entity recognition
- **Dashboard View** (`applications/views.py`): API endpoint for candidate analysis

### Frontend Components
- **Main Dashboard** (`app/dashboard/employer/resume-scoring/page.tsx`): Complete UI implementation
- **Navigation** (`components/dashboard/employerSidebar.tsx`): Added "AI Resume Analysis" menu item
- **UI Components**: Badge, Select, Textarea components for enhanced UX

### Dependencies
- **Backend**: scikit-learn, PyPDF2, Django REST Framework
- **Frontend**: Next.js, Tailwind CSS, Radix UI, Lucide React

## Score Interpretation

| Score Range | Match Level | Color Code | Description |
|-------------|-------------|------------|-------------|
| 4.0 - 5.0   | High Match  | Green      | Excellent candidate fit |
| 3.0 - 3.9   | Good Match  | Yellow     | Strong candidate potential |
| 0.0 - 2.9   | Low Match   | Red        | Limited alignment |

## Data Privacy & Security
- All resume analysis is performed server-side
- JWT authentication required for API access
- No resume content is stored permanently in analysis cache
- Compliant with data protection standards

## Future Enhancements
- [ ] Advanced NLP models (BERT, transformer-based)
- [ ] Integration with ATS systems
- [ ] Batch resume processing
- [ ] Custom scoring weights by role type
- [ ] Export candidate rankings to CSV/PDF
- [ ] Integration with interview scheduling

## Troubleshooting

### Common Issues
1. **Empty Results**: Ensure applications have both resumes and linked user accounts
2. **Low Scores**: Check job description quality and resume format compatibility
3. **Authentication Errors**: Verify JWT token validity and permissions

### Debug Commands
```bash
# Check application data integrity
python manage.py debug_resume_dashboard {job_id}

# Fix orphaned applications
python manage.py fix_orphaned_applications
```

## Support
For technical support or feature requests, please contact the development team.