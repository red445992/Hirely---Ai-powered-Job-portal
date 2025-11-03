# Required Environment Variables for Railway

## In Railway Dashboard → Variables Tab, add these:

# Django Configuration
SECRET_KEY=django-insecure-your-super-secret-key-here-change-this-in-production
DJANGO_SETTINGS_MODULE=HirelyBackend.settings
RAILWAY_ENVIRONMENT=production
DEBUG=False

# Google AI (Required for interview generation)
GOOGLE_API_KEY=your-actual-gemini-api-key-here

# Database (Railway will auto-set these when you add PostgreSQL)
# DATABASE_URL=postgresql://username:password@host:port/database
# PGDATABASE=railway
# PGUSER=postgres
# PGPASSWORD=auto-generated
# PGHOST=containers-us-west-xxx.railway.app
# PGPORT=5432

## Instructions:
1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable above (except the PostgreSQL ones - those are auto-added)
5. For SECRET_KEY, generate a new one or use Django's get_random_secret_key()
6. For GOOGLE_API_KEY, use your actual Gemini API key

## After adding variables:
1. Click "Deploy" to restart with new environment variables
2. Check logs for any error messages