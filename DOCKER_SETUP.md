# Docker Setup Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Environment Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file and add your actual API keys:**
   ```bash
   # .env
   POSTGRES_DB=hirely_db
   POSTGRES_USER=hirely_user
   POSTGRES_PASSWORD=1122

   # Add your actual keys here
   GOOGLE_GENERATIVE_API_KEY=your_actual_google_api_key
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_actual_vapi_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_actual_workflow_id
   DATABASE_URL=your_actual_database_url
   ```

3. **Make sure `.env` is in `.gitignore`** (already configured)

## Running with Docker

### Start all services:
```bash
docker-compose up --build
```

### Run in background (detached mode):
```bash
docker-compose up -d --build
```

### Stop all services:
```bash
docker-compose down
```

### Stop and remove all data (fresh start):
```bash
docker-compose down -v
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Services

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **PostgreSQL**: localhost:5432

## Troubleshooting

### Build fails with environment variable errors
Make sure all required environment variables are set in your `.env` file.

### Database connection issues
Wait for PostgreSQL to be ready. The backend has a healthcheck that waits for the database.

### Port already in use
Stop any local services running on ports 3000, 8000, or 5432.

## Security Notes

⚠️ **NEVER commit the `.env` file to Git!**

- ✅ `.env` is already in `.gitignore`
- ✅ Use `.env.example` as a template
- ✅ Each developer should create their own `.env` file
- ✅ For production, use environment variables or secrets management
