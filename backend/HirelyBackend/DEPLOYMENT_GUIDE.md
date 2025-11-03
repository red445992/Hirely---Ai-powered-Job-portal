# 🚀 Complete Deployment Guide: Django Backend + VAPI Integration

## Overview
Deploy your Django backend to Railway for VAPI voice commanding integration. Railway provides:
- ✅ Free tier (perfect for development)
- ✅ Automatic PostgreSQL database
- ✅ Public HTTPS URLs (required for VAPI)
- ✅ Easy GitHub integration

## 📋 Pre-Deployment Checklist

### ✅ Files Ready:
- [x] `requirements.txt` - Python dependencies
- [x] `Procfile` - Railway deployment script
- [x] `railway.json` - Railway configuration
- [x] `.env.production` - Environment variables template
- [x] Updated `settings.py` with production configs

## 🚀 Step 1: Deploy to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Verify your account

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `Hirely---Ai-powered-Job-portal`
4. Set **Root Directory**: `backend/HirelyBackend`

### 1.3 Add PostgreSQL Database
1. In your Railway project dashboard
2. Click **"New"** → **"Database"** → **"PostgreSQL"**
3. Railway will automatically create database environment variables

### 1.4 Configure Environment Variables
Go to your project → **Variables** tab and add:

```env
SECRET_KEY=your-super-secret-django-key-here
GOOGLE_API_KEY=your-gemini-api-key-here
RAILWAY_ENVIRONMENT=production
DEBUG=False
```

### 1.5 Deploy
Railway will automatically deploy! Check the logs for any issues.

## 🔗 Step 2: Get Your Public URL

After successful deployment:
1. Go to your Railway project dashboard
2. Click on your web service
3. Go to **"Settings"** → **"Domains"**
4. Copy your public URL: `https://your-app-name.railway.app`

## 🎤 Step 3: Configure VAPI Integration

### 3.1 Update Your VAPI Webhook URL
In your VAPI dashboard:
- **Webhook URL**: `https://your-app-name.railway.app/interviews/generate/`
- **Method**: `POST`
- **Headers**: 
  ```json
  {
    "Content-Type": "application/json"
  }
  ```

### 3.2 Test VAPI Payload
VAPI should send data like this to your endpoint:
```json
{
  "type": "technical",
  "role": "Frontend Developer",
  "level": "intermediate", 
  "techstack": ["React", "TypeScript"],
  "amount": 5
}
```

### 3.3 Update Frontend Environment
Update your Next.js `.env.local`:
```env
# Replace with your actual Railway URL
DJANGO_BASE_URL=https://your-app-name.railway.app
```

## 🧪 Step 4: Test Everything

### 4.1 Test Direct API
```bash
curl -X POST https://your-app-name.railway.app/interviews/generate/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "technical",
    "role": "Frontend Developer", 
    "level": "intermediate",
    "techstack": ["React"],
    "amount": 3
  }'
```

### 4.2 Test Through Next.js
```bash
curl -X POST http://localhost:3000/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "technical",
    "role": "Frontend Developer",
    "level": "intermediate", 
    "techstack": ["React"],
    "amount": 3
  }'
```

### 4.3 Test VAPI Integration
1. Configure your VAPI assistant with the Railway webhook URL
2. Test voice commands like:
   - "Generate 5 React interview questions"
   - "Create technical questions for senior developer"

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Build Fails**
```bash
# Check Railway logs for missing dependencies
# Update requirements.txt if needed
pip freeze > requirements.txt
```

#### 2. **Database Connection Error**
- Verify PostgreSQL service is running in Railway
- Check environment variables are set correctly

#### 3. **CORS Issues with VAPI**
- Add VAPI domains to `CORS_ALLOWED_ORIGINS` in settings.py
- Verify `CORS_ALLOW_ALL_ORIGINS = True` for testing

#### 4. **Static Files Error**
```bash
# Railway should handle this automatically via Procfile
python manage.py collectstatic --noinput
```

#### 5. **VAPI Webhook Fails**
- Check Railway logs for request details
- Verify webhook URL format: `https://your-app.railway.app/interviews/generate/`
- Test with Postman first

## 🎯 VAPI Voice Commands Examples

Once deployed, your users can say:
- "Generate 5 Python interview questions for intermediate level"
- "Create React questions for senior developer"
- "I need 3 technical questions for backend role"

VAPI will parse these commands and send structured data to your Railway backend!

## 📈 Next Steps

1. **Monitor Usage**: Check Railway dashboard for usage stats
2. **Scale Up**: Upgrade Railway plan if needed for production
3. **Add Authentication**: Implement JWT tokens for VAPI calls
4. **Custom Domain**: Add your own domain in Railway settings
5. **CI/CD**: Set up automatic deployments on git push

## 🚨 Important Notes

- Railway free tier has some limitations (usage-based)
- Keep your `GOOGLE_API_KEY` secure
- Test thoroughly before production use
- Monitor Railway logs for any issues

Your Django backend is now ready for VAPI voice commanding! 🎉