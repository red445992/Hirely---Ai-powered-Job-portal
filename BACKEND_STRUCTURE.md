# 🏗️ Hirely Backend Project Structure

## 📁 Root Backend Directory Structure
```
backend/
├── .dockerignore                    # Docker ignore rules
├── .env                            # Environment variables (DB config, API keys)
├── .env.example                    # Example environment file
├── .gitignore                      # Git ignore rules
├── Dockerfile                      # Docker container configuration
├── POSTMAN_TESTING_GUIDE.md        # API testing guide
├── requirements.txt                # Python dependencies
├── start.sh                       # Startup script
├── myenv/                          # Virtual environment (Python packages)
└── HirelyBackend/                  # Main Django project directory
```

## 🎯 Main Django Project (HirelyBackend/)
```
HirelyBackend/
├── manage.py                       # Django management script
├── package.json                    # Node.js dependencies (if any)
├── package-lock.json              # Node.js lock file
├── Procfile                        # Process file for deployment
├── railway.json                    # Railway deployment config
├── railway-deployment-guide.md     # Railway deployment guide
├── DEPLOYMENT_GUIDE.md            # General deployment guide
├── requirements.txt                # Python dependencies
├── .gitignore                      # Git ignore rules
├── staticfiles/                    # Static files for production
├── media/                          # User uploaded files
├── resumes/                        # Resume files storage
├── node_modules/                   # Node.js modules (if any)
├── tests/                          # Test files
└── [Django Apps]/                  # Django applications
```

## 🧩 Django Applications Structure

### 1. **HirelyBackend/** (Main Project Settings)
```
HirelyBackend/
├── __init__.py                     # Python package marker
├── settings.py                     # Django settings
├── urls.py                         # Main URL routing
├── wsgi.py                         # WSGI configuration
└── asgi.py                         # ASGI configuration
```

### 2. **accounts/** (User Management)
```
accounts/
├── __init__.py                     # Python package marker
├── admin.py                        # Django admin configuration
├── apps.py                         # App configuration
├── models.py                       # User models (Candidate, Employer)
├── serializers.py                  # API serializers
├── views.py                        # API views
├── urls.py                         # URL routing
├── migrations/                     # Database migrations
│   ├── __init__.py
│   ├── 0001_initial.py
│   └── [other migration files]
└── tests.py                        # Unit tests
```

### 3. **jobs/** (Job Management)
```
jobs/
├── __init__.py                     # Python package marker
├── admin.py                        # Django admin configuration
├── apps.py                         # App configuration
├── models.py                       # Job models
├── serializers.py                  # API serializers
├── views.py                        # API views (including resume parser)
├── urls.py                         # URL routing
├── migrations/                     # Database migrations
├── utils/                          # Utility functions
│   ├── __init__.py
│   └── resume_parser.py           # ✅ Resume parsing functionality
└── tests.py                        # Unit tests
```

### 4. **applications/** (Job Applications)
```
applications/
├── __init__.py                     # Python package marker
├── admin.py                        # Django admin configuration
├── apps.py                         # App configuration
├── models.py                       # Application models
├── serializers.py                  # API serializers
├── views.py                        # ✅ API views (fixed employer filtering)
├── urls.py                         # URL routing
├── migrations/                     # Database migrations
└── tests.py                        # Unit tests
```

### 5. **interviews/** (Interview Management)
```
interviews/
├── __init__.py                     # Python package marker
├── admin.py                        # Django admin configuration
├── apps.py                         # App configuration
├── models.py                       # Interview models
├── serializers.py                  # API serializers
├── views.py                        # API views
├── urls.py                         # URL routing
├── migrations/                     # Database migrations
└── tests.py                        # Unit tests
```

## 🔧 Key Configuration Files

### Environment Variables (.env)
```
SECRET_KEY=django-insecure-67rtw07rj+act-8cf419go%7+-2x3eo_4#432nnnlb&jbyh%x3
DEBUG=True
DB_NAME=hirely
DB_USER=postgres
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=5432
HUGGINGFACE_API_KEY=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
```

### Dependencies (requirements.txt)
```
Django==5.2.7
djangorestframework
django-cors-headers
psycopg2-binary
python-decouple
requests
whitenoise
gunicorn
[other dependencies...]
```

## 🚀 Key Features by App

### **accounts/**
- ✅ User authentication (JWT)
- ✅ User registration/login
- ✅ Candidate and Employer profiles
- ✅ Profile management

### **jobs/**
- ✅ Job posting and management
- ✅ Job search and filtering
- ✅ **Resume parser** (fixed 500 error)
- ✅ Job categories and skills

### **applications/**
- ✅ Job application submission
- ✅ **Application management** (fixed database relationships)
- ✅ Status tracking (pending, shortlisted, accepted, rejected)
- ✅ Employer application review

### **interviews/**
- ✅ Interview scheduling
- ✅ Interview management
- ✅ Interview status tracking

## 🛠️ Recent Fixes Applied

1. **Resume Parser** (`jobs/utils/resume_parser.py`)
   - ✅ Fixed 500 Internal Server Error
   - ✅ Added robust fallback entity extraction
   - ✅ Handles API failures gracefully

2. **Applications Module** (`applications/views.py`)
   - ✅ Fixed database relationship errors
   - ✅ Changed `job__created_by` to `job__employer`
   - ✅ Proper filtering for employer applications

3. **Database Configuration**
   - ✅ PostgreSQL setup with proper credentials
   - ✅ Environment-based configuration

## 📊 Database Models

### Core Models
- **User** (extended with Candidate/Employer profiles)
- **Job** (with employer foreign key)
- **Application** (linking candidates to jobs)
- **Interview** (scheduling and management)
- **Skills, Categories** (job classification)

## 🔗 API Endpoints

### Authentication
- `POST /accounts/register/` - User registration
- `POST /accounts/login/` - User login
- `GET /accounts/profile/` - Get user profile

### Jobs
- `GET /jobs/` - List jobs
- `POST /jobs/` - Create job (employers only)
- `POST /jobs/parse-resume/` - **Resume parser** (fixed)

### Applications
- `GET /applications/` - List applications (fixed filtering)
- `POST /applications/` - Submit application
- `PUT /applications/{id}/` - Update application status

This is your complete **Hirely Backend** structure with Django REST Framework! 🎯