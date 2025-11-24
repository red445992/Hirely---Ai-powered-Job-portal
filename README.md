# Hirely - AI-Powered Job Portal

A modern full-stack job portal with AI-powered features including resume scoring, AI interviews, and intelligent candidate matching.

![Django](https://img.shields.io/badge/Django-5.2.7-green)
![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Python](https://img.shields.io/badge/Python-3.12-yellow)

---

## Features

### Core Features
- **Job Posting & Management** - Employers can create, edit, and manage job postings
- **Application System** - Candidates can apply with resumes and track applications
- **User Authentication** - JWT-based secure authentication with role-based access
- **Real-time Notifications** - Stay updated with application status changes

### AI-Powered Features
- **AI Resume Scoring** - TF-IDF cosine similarity with multi-factor analysis (0-5 scale)
- **AI Interview System** - Voice-based interviews powered by VAPI and Google Gemini
- **Secure Quiz Generation** - Dynamic technical assessments with rate limiting
- **Smart Candidate Ranking** - Enhanced scoring with skill matching and bonuses

### Dashboard Features
- **Employer Dashboard** - Manage jobs, view applicants, analyze resumes
- **Candidate Dashboard** - Track applications, view interview results
- **Analytics** - Application statistics, success rates, and insights
- **Progress Tracking** - Interview history and performance metrics

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.0 (App Router)
- **UI**: React 19.2.0, TypeScript, Tailwind CSS
- **Components**: Shadcn/ui, Radix UI
- **Animations**: Framer Motion, Canvas Confetti
- **State**: React Hooks, Context API
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: Django 5.2.7, Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **ML/AI**: scikit-learn, Google Gemini API
- **PDF Processing**: PyPDF2
- **Storage**: File-based (configurable for S3)

### AI & ML
- **Resume Parsing**: TF-IDF Vectorization, NER patterns
- **Interview AI**: Google Gemini Pro, VAPI
- **Scoring**: Cosine Similarity, Multi-factor analysis
- **Rate Limiting**: Custom middleware

---

## 📋 Prerequisites

- **Python** 3.12+
- **Node.js** 18+ and npm
- **PostgreSQL** 15+
- **Git**

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/red445992/Hirely---Ai-powered-Job-portal.git
cd Esewa-JobApplication
```

### 2. Backend Setup

```bash
cd backend/HirelyBackend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Configure database in .env
DATABASE_URL=postgresql://user:password@localhost:5432/hirely

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

**Backend runs at:** `http://localhost:8000`

### 3. Frontend Setup

```bash
cd hirely-frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Configure environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key
GOOGLE_GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev
```

**Frontend runs at:** `http://localhost:3000`

---

## 🗄️ Database Setup

### PostgreSQL
```sql
-- Create database
CREATE DATABASE hirely;

-- Create user
CREATE USER hirely_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hirely TO hirely_user;
```

### Apply Migrations
```bash
cd backend/HirelyBackend
python manage.py makemigrations
python manage.py migrate
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/hirely
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

---

## 📁 Project Structure

```
Esewa-JobApplication/
├── backend/
│   └── HirelyBackend/
│       ├── jobs/              # Job posting management
│       ├── applications/      # Application & resume scoring
│       ├── interviews/        # AI interview system
│       ├── users/             # User authentication
│       └── utils/             # Resume parser, scorer
│
├── hirely-frontend/
│   ├── app/
│   │   ├── dashboard/         # Dashboards (employer/candidate)
│   │   ├── ai_interview/      # AI interview features
│   │   └── auth/              # Authentication pages
│   ├── components/
│   │   ├── ai_interview/      # Interview components
│   │   ├── auth/              # Auth components
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utilities, API clients
│
└── docs/                      # Documentation
```

---

##  Key Features Explained

### AI Resume Scoring
- **Algorithm**: TF-IDF + Cosine Similarity
- **Scale**: 0-5 with bonus factors
- **Factors**: Skills match, experience, education
- **Output**: Ranked candidate list with detailed analysis

### AI Interview System
- **Voice-based**: Real-time speech recognition
- **AI-powered**: Google Gemini Pro responses
- **Recording**: Audio playback and transcripts
- **Assessment**: Automated scoring and feedback

### Secure Quiz Generation
- **Rate Limiting**: 2/hour, 5/day per user
- **Dynamic**: AI-generated questions per role
- **Categories**: Technical, behavioral, situational
- **Tracking**: Progress dashboard and analytics

---
## Authentication

### User Roles
- **Employer**: Post jobs, review applications, access resume scoring
- **Candidate**: Apply for jobs, take interviews, track applications

### JWT Tokens
- **Access Token**: 1 hour expiration
- **Refresh Token**: 7 days expiration
- **Storage**: localStorage (frontend)

---

## API Endpoints

### Authentication
```
POST   /api/auth/register/          # User registration
POST   /api/auth/login/             # User login
POST   /api/auth/token/refresh/     # Refresh token
```

### Jobs
```
GET    /api/jobs/                   # List jobs
POST   /api/jobs/addjobs/           # Create job (employer)
GET    /api/jobs/<id>/              # Job details
PATCH  /api/jobs/<id>/              # Update job
DELETE /api/jobs/<id>/              # Delete job
```

### Applications
```
POST   /api/applications/apply/                    # Apply for job
GET    /api/applications/my-applications/          # Candidate's applications
GET    /api/applications/job/<id>/applications/    # Job applications (employer)
GET    /api/applications/resume-dashboard/<id>/    # AI resume scoring
```

### AI Interview
```
GET    /api/interviews/quiz-categories/            # Quiz categories
POST   /api/interviews/generate-quiz/              # Generate quiz
GET    /api/interviews/progress/                   # User progress
```

---

##  Testing

### Backend Tests
```bash
cd backend/HirelyBackend
python manage.py test
```

### Frontend Tests
```bash
cd hirely-frontend
npm run test
```

---

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Railway/Heroku
```bash
# Configure environment variables in platform dashboard
# Connect repository
# Deploy
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

##  License

This project is licensed under the MIT License.

---

## Authors

- **Developer** - [red445992](https://github.com/red445992)

---

##  Acknowledgments

- Google Gemini AI for interview intelligence
- VAPI for voice interview capabilities
- Shadcn/ui for beautiful components
- Vercel for Next.js framework

---

##  Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/red445992/Hirely---Ai-powered-Job-portal/issues)
- **Email**: Support contact

---



---

**Built with ❤️ using Django & Next.js**
