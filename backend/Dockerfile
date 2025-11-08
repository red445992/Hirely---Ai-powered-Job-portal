# backend/Dockerfile
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    netcat-traditional \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create directory for static files
RUN mkdir -p /app/HirelyBackend/staticfiles

# Set working directory to Django project
WORKDIR /app/HirelyBackend

# Create start script with healthcheck
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🔍 Waiting for PostgreSQL..."\n\
until nc -z postgres 5432; do\n\
  echo "⏳ PostgreSQL is unavailable - sleeping"\n\
  sleep 2\n\
done\n\
echo "✅ PostgreSQL is up - executing migrations"\n\
python manage.py migrate --noinput\n\
echo "📦 Collecting static files..."\n\
python manage.py collectstatic --noinput || true\n\
echo "🚀 Starting Gunicorn server..."\n\
exec gunicorn HirelyBackend.wsgi:application \\\n\
    --bind 0.0.0.0:8000 \\\n\
    --workers 3 \\\n\
    --threads 2 \\\n\
    --timeout 120 \\\n\
    --access-logfile - \\\n\
    --error-logfile - \\\n\
    --log-level info' > /start.sh && chmod +x /start.sh

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Run the start script
CMD ["/start.sh"]