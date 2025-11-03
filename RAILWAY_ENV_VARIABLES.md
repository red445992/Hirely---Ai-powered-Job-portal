# Required Environment Variables for Railway

## CRITICAL: Add these in Railway Dashboard → Variables Tab

### Essential Variables (Required for app to start):
```
RAILWAY_ENVIRONMENT=production
SECRET_KEY=django-insecure-your-super-secret-key-here-change-this
DEBUG=False
```

### Google AI (Required for interview generation):
```
GOOGLE_API_KEY=your-actual-gemini-api-key-here
```

### Database (Add PostgreSQL service in Railway):
Railway will automatically set these when you add PostgreSQL:
- DATABASE_URL
- PGDATABASE  
- PGUSER
- PGPASSWORD
- PGHOST
- PGPORT

## QUICK FIX STEPS:

1. **In Railway Dashboard:**
   - Go to your project
   - Click "Variables" tab
   - Add the essential variables above

2. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-configures database variables

3. **Redeploy:**
   - Push to GitHub or manually trigger deploy
   - Health check should pass with these variables

## Generate SECRET_KEY:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

The app now has fallbacks and should start even without perfect configuration!