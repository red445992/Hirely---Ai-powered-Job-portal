# Security Guidelines & Environment Setup

## 🚨 Security Alert Resolution

This repository previously contained exposed Firebase service account credentials. The following security measures have been implemented:

### ✅ Security Fixes Applied:
- Removed Firebase service account JSON file from repository
- Cleaned all exposed API keys from environment files
- Updated `.gitignore` to prevent future credential exposure
- Implemented environment variable patterns for all sensitive data

## 🔐 Environment Variables Setup

### Frontend (.env.local)
Copy `hirely-frontend/.env.example` to `hirely-frontend/.env.local` and set:

```env
# Django Backend
DJANGO_BASE_URL=http://localhost:8000

# Firebase (if using Firebase features)
Firebase_project_id=your-project-id
Firebase_private_key_id=your-private-key-id
Firebase_private_key="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----"
Firebase_client_email=your-service-account@project.iam.gserviceaccount.com
FIREBASE_API_KEY=your-firebase-api-key

# AI Services
GOOGLE_GENERATIVE_API_KEY=your-google-ai-api-key
NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-token
```

### Backend (.env)
Copy `backend/.env.example` to `backend/.env` and set:

```env
SECRET_KEY=your-django-secret-key
GOOGLE_GENERATIVE_API_KEY=your-google-ai-api-key
DATABASE_URL=your-database-url  # PostgreSQL for production
```

## 🚀 Railway Deployment Variables

Set these in your Railway dashboard:

### Required Variables:
- `SECRET_KEY`: Django secret key
- `GOOGLE_GENERATIVE_API_KEY`: Google AI API key
- `RAILWAY_ENVIRONMENT`: production (auto-set by Railway)

### Optional Variables (if using Firebase):
- `Firebase_project_id`
- `Firebase_private_key_id`
- `Firebase_private_key`
- `Firebase_client_email`

## 🛡️ Security Best Practices

### ❌ Never Commit:
- `.env` files with real credentials
- Firebase service account JSON files
- API keys in code
- Private keys or certificates

### ✅ Always Do:
- Use environment variables for all secrets
- Keep `.env.local` and `.env` in `.gitignore`
- Use `.env.example` files for documentation
- Rotate credentials if exposed
- Use Railway environment variables for production

## 🔄 If Credentials Were Exposed:

1. **Immediately revoke** exposed credentials:
   - Firebase: Generate new service account key
   - Google AI: Create new API key
   - VAPI: Generate new token

2. **Update all deployments** with new credentials

3. **Monitor for unauthorized usage**

## 📋 Environment Variable Checklist

### Local Development:
- [ ] `hirely-frontend/.env.local` created with real values
- [ ] `backend/.env` created with real values
- [ ] Both files are in `.gitignore`
- [ ] Django server starts without errors
- [ ] Next.js app connects to Django backend

### Railway Deployment:
- [ ] All required environment variables set in Railway dashboard
- [ ] Railway build completes successfully
- [ ] Health check endpoints respond
- [ ] Application logs show no credential errors

## 🆘 Support

If you need help with:
- Setting up credentials
- Railway deployment issues
- Security best practices

Please check the Railway logs and ensure all environment variables are properly configured.