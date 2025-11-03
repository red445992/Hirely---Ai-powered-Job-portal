# Railway Deployment Guide for Django Backend

## Prerequisites
- Railway account (free): https://railway.app
- GitHub repository with your Django code

## Step 1: Prepare Django for Production

### 1.1 Create requirements.txt
```bash
cd backend/HirelyBackend
pip freeze > requirements.txt
```

### 1.2 Update settings.py for production
Add this to the bottom of `settings.py`:

```python
import os
from pathlib import Path

# Production settings
if os.environ.get('RAILWAY_ENVIRONMENT'):
    DEBUG = False
    ALLOWED_HOSTS = [
        '.railway.app',
        'localhost',
        '127.0.0.1',
        os.environ.get('RAILWAY_PUBLIC_DOMAIN', '')
    ]
    
    # Database for Railway (PostgreSQL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('PGDATABASE'),
            'USER': os.environ.get('PGUSER'),
            'PASSWORD': os.environ.get('PGPASSWORD'),
            'HOST': os.environ.get('PGHOST'),
            'PORT': os.environ.get('PGPORT', 5432),
        }
    }
    
    # Static files for production
    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    
    # CORS settings for VAPI
    CORS_ALLOWED_ORIGINS = [
        "https://vapi.ai",
        "https://*.vapi.ai",
        "https://your-frontend-domain.vercel.app"  # Update with your frontend URL
    ]
    
    CORS_ALLOW_ALL_ORIGINS = True  # For development
```

### 1.3 Create Procfile (for Railway)
Create `Procfile` in Django root:
```
web: python manage.py migrate && python manage.py collectstatic --noinput && gunicorn HirelyBackend.wsgi
```

### 1.4 Add gunicorn to requirements
```bash
pip install gunicorn
pip freeze > requirements.txt
```

## Step 2: Deploy to Railway

### 2.1 Connect GitHub
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Choose the backend folder path: `backend/HirelyBackend`

### 2.2 Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```
DJANGO_SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-gemini-api-key
RAILWAY_ENVIRONMENT=production
```

### 2.3 Add PostgreSQL Database
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set database environment variables

### 2.4 Deploy
Railway will automatically deploy when you push to GitHub!

## Step 3: Update Frontend Environment

Update your `.env.local`:
```bash
# Replace with your Railway URL after deployment
DJANGO_BASE_URL=https://your-app-name.railway.app
```

## Step 4: Test Deployment

Your API will be available at:
- Base URL: `https://your-app-name.railway.app`
- Interview API: `https://your-app-name.railway.app/interviews/generate/`

## Troubleshooting

### Build Fails
- Check requirements.txt includes all dependencies
- Ensure Python version compatibility

### Database Issues
- Railway PostgreSQL is automatically configured
- Run migrations: `python manage.py migrate`

### CORS Issues
- Update CORS_ALLOWED_ORIGINS with your frontend domain
- For development, keep CORS_ALLOW_ALL_ORIGINS = True